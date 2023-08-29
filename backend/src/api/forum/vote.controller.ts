import { Controller, Post, Req, Res, Body, HttpStatus } from "@nestjs/common";
import { validateUser } from "../user/user.utils";
import { Response } from "express";
import { VoteOnDTO } from "./forum.dto";
import { prisma } from "src/db/prisma";

@Controller("vote")
export class VoteController {
    @Post("comment")
    async voteOnComment(@Req() req: Request, @Res() res: Response, @Body() body: VoteOnDTO) {
        const user = await validateUser(req);
        if (user === undefined) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Token couldn't be verified"});
        }

        const comment = await prisma.comment.findUnique({
            where: {
                comment_id: Number.parseInt(body.target_id)
            },
        });

        if (comment === null) {
            return res.status(HttpStatus.NOT_FOUND).json({"message": "Couldn't find target"});
        }

        switch (body.type) {
            case 1:
                if (comment.likes.includes(user.public_id))
                    break;    

                if (comment.dislikes.includes(user.public_id)) {
                    comment.dislikes.splice(comment.dislikes.indexOf(user.public_id));
                    await prisma.user.update({
                        where: {
                            public_id: comment.user_id || 0
                        },
                        data: {
                            reputation: {
                                increment: 1
                            } 
                        }
                    });
                }
                await prisma.user.update({
                    where: {
                        public_id: comment.user_id || 0
                    },
                    data: {
                        reputation: {
                            increment: 1
                        } 
                    }
                });

                comment.likes.push(user.public_id);
                break; 
            case -1:
                if (comment.dislikes.includes(user.public_id))
                    break;    

                if (comment.likes.includes(user.public_id)) {
                    comment.likes.splice(comment.likes.indexOf(user.public_id));
                    await prisma.user.update({
                        where: {
                            public_id: comment.user_id || 0
                        },
                        data: {
                            reputation: {
                                decrement: 1
                            } 
                        }
                    });
                }

                await prisma.user.update({
                    where: {
                        public_id: comment.user_id || 0
                    },
                    data: {
                        reputation: {
                            decrement: 1
                        }
                    }
                });
            
                comment.dislikes.push(user.public_id);
                break;
            default:
                if (comment.likes.includes(user.public_id)) {
                    comment.likes.splice(comment.likes.indexOf(user.public_id));
                    await prisma.user.update({
                        where: {
                            public_id: comment.user_id || 0
                        },
                        data: {
                            reputation: {
                                decrement: 1
                            }
                        }
                    });
                }
                
                if (comment.dislikes.includes(user.public_id)) {
                    comment.dislikes.splice(comment.dislikes.indexOf(user.public_id));
                    await prisma.user.update({
                        where: {
                            public_id: comment.user_id || 0
                        },
                        data: {
                            reputation: {
                                increment: 1
                            }
                        }
                    });
                }

                break;
        }
        prisma.comment.update({
            where: {
                comment_id: Number.parseInt(body.target_id)
            },
            data: {
                likes: comment.likes,
                dislikes: comment.dislikes
            }
        });

        return res.status(HttpStatus.OK).json({"message": "Voted on comment"});
    }

    @Post("post")
    async voteOnPost(@Req() req: Request, @Res() res: Response, @Body() body: VoteOnDTO) {
        const user = await validateUser(req);
        if (user === undefined) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Token couldn't be verified"});
        }
        const post = await prisma.post.findUnique({
            where: {
                post_id: Number.parseInt(body.target_id)
            },
        });

        if (post === null) {
            return res.status(HttpStatus.NOT_FOUND).json({"message": "Couldn't find target"});
        }

        switch (body.type) {
            case 1:
                if (post.likes.includes(user.public_id))
                    break;    

                if (post.dislikes.includes(user.public_id)) {
                    post.dislikes.splice(post.dislikes.indexOf(user.public_id));
                    await prisma.user.update({
                        where: {
                            public_id: post.user_id || 0
                        },
                        data: {
                            reputation: {
                                increment: 1
                            }
                        }
                    });
                }
                await prisma.user.update({
                    where: {
                        public_id: post.user_id || 0
                    },
                    data: {
                        reputation: {
                            increment: 1
                        }
                    }
                });
                post.likes.push(user.public_id);
                break; 
            case -1:
                if (post.dislikes.includes(user.public_id))
                    break;    

                if (post.likes.includes(user.public_id)) {
                    post.likes.splice(post.likes.indexOf(user.public_id));
                    await prisma.user.update({
                        where: {
                            public_id: post.user_id || 0
                        },
                        data: {
                            reputation: {
                                decrement: 1
                            }
                        }
                    });
                }

                await prisma.user.update({
                    where: {
                        public_id: post.user_id || 0
                    },
                    data: {
                        reputation: {
                            decrement: 1
                        }
                    }
                });

                post.dislikes.push(user.public_id);
                break;
            default:
                if (post.likes.includes(user.public_id)) {
                    post.likes.splice(post.likes.indexOf(user.public_id));
                    await prisma.user.update({
                        where: {
                            public_id: post.user_id || 0
                        },
                        data: {
                            reputation: {
                                decrement: 1
                            }
                        }
                    });
                }
                
                if (post.dislikes.includes(user.public_id)) {
                    post.dislikes.splice(post.dislikes.indexOf(user.public_id));
                    await prisma.user.update({
                        where: {
                            public_id: post.user_id || 0
                        },
                        data: {
                            reputation: {
                                increment: 1
                            }
                        }
                    });
                }

                break;
        }

        await prisma.post.update({
            where: {
                post_id: post.post_id
            },
            data: {
                likes: post.likes,
                dislikes: post.dislikes
            }
        });

        return res.status(HttpStatus.OK).json({"message": "Voted on post"});
    }
}
