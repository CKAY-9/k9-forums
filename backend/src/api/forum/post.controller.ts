import { Body, Controller, Req, Res, Post, HttpStatus, Get, Query, Delete, Put } from "@nestjs/common";
import { Response } from "express";
import { CreatePostDTO, DeleteCommentDTO, DeletePostDTO, NewCommentDTO, PostDTO, UpdateCommentDTO, UpdatePostDTO } from "./forum.dto";
import { validateUser } from "../user/user.utils";
import { UsergroupFlags, doesUserHavePermissionLevel } from "../admin/permissions";
import { prisma } from "src/db/prisma";

@Controller("post")
export class PostController {
    @Post("create")
    async createPost(@Res() res: Response, @Req() req: Request, @Body() body: CreatePostDTO) {
        const user = await validateUser(req);
        if (user === undefined) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Token couldn't be verified"});
        }

        if (!doesUserHavePermissionLevel(user, UsergroupFlags.POST)) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Permission level not met"}); 
        }

        const topic = await prisma.topic.findUnique({
            where: {
                topic_id: Number.parseInt(body.topic_id)
            },
            select: {
                posts: true,
                topic_id: true
            }
        });

        if (topic === null) {
            return res.status(HttpStatus.NOT_FOUND).json({"message": "Topic with given ID couldn't be found"});
        }

        const postCreate = await prisma.post.create({
            data: {
                user_id: user.public_id,
                body: body.body,
                title: body.title,
                closed: false,
                pinned: false,
                topic_id: topic.topic_id,
                last_updated: new Date(),
                template_allowed: body.template_allowed
            }
        });

        topic.posts.push(postCreate);

        const topicUpdate = await prisma.topic.update({
            where: {
                topic_id: topic.topic_id
            },
            data: {
                posts: {
                    set: topic.posts
                }
            }
        });

        return res.status(HttpStatus.OK).json({"message": "Created new post", "post_id": postCreate.post_id});
    }

    @Put("update")
    async updatePost(@Res() res: Response, @Req() req: Request, @Body() body: UpdatePostDTO) {
        const user = await validateUser(req);
        if (user === undefined) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Token couldn't be verified"});
        }

        const post = await prisma.post.findUnique({
            where: {
                post_id: Number.parseInt(body.post_id),
                user_id: user.public_id
            }
        });

        if (post === null) {
            return res.status(HttpStatus.NOT_FOUND).json({"message": "Couldn't find post"});
        }

        const postUpdate = await prisma.post.update({
            where: {
                post_id: Number.parseInt(body.post_id),
                user_id: user.public_id
            },
            data: {
                title: body.title,
                body: body.body,
                last_updated: new Date()
            }
        });

        return res.status(HttpStatus.OK).json({"message": "Updated post"});
    }

    @Delete("delete")
    async deletePost(@Res() res: Response, @Req() req: Request, @Body() body: DeletePostDTO) {
        const user = await validateUser(req);
        if (user === undefined) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Token couldn't be verified"});
        }

        const post = await prisma.post.findUnique({
            where: {
                post_id: body.post_id,
                user_id: user.public_id
            }
        });

        if (post === null) {
            return res.status(HttpStatus.NOT_FOUND).json({"message": "Couldn't find post"});
        }

        const comments = await prisma.comment.findMany({
            where: {
                post_id: post.post_id
            }
        });

        for (let i = 0; i < comments.length; i++) {
            const deleteCommentVotes = await prisma.comment.deleteMany({
                where: {
                    comment_id: comments[i].comment_id
                }
            });
        }

        const deleteComments = await prisma.comment.deleteMany({
            where: {
                post_id: post.post_id
            }
        });

        const deleteVotes = await prisma.vote.deleteMany({
            where: {
                post_id: post.post_id
            }
        });

        const deletePost = await prisma.post.delete({
            where: {
                post_id: body.post_id,
                user_id: user.public_id
            }
        });

        return res.status(HttpStatus.OK).json({"message": "Deleted post"});
    }

    @Get("get")
    async getPost(@Query() query: {post_id: string}, @Res() res: Response) {
        const post = await prisma.post.findUnique({
            where: {
                post_id: Number.parseInt(query.post_id)
            }, 
            select: {
                post_id: true,
                title: true,
                body: true,
                user_id: true,
                User: true,
                closed: true,
                pinned: true,
                votes: true,
                comments: true,
                first_posted: true,
                last_updated: true,
                topic_id: true,
            }
        });

        if (post === null) {
            return res.status(HttpStatus.NOT_FOUND).json({"message": "Couldn't find post with specified ID"});
        }

        const comments = await prisma.comment.findMany({
            where: {
                post_id: post?.post_id
            },
            orderBy: {
                posted_at: "asc"
            }
        });

        post.comments = comments;

        const postUpdate = await prisma.post.update({
            where: {
                post_id: post.post_id
            },
            data: {
                comments: {
                    set: comments
                }
            }
        });

        return res.status(HttpStatus.OK).json({"message": "Got post", "post": post});
    }

    @Put("lock")
    async lockPost(@Req() req: Request, @Res() res: Response, @Body() lockPostDTO: PostDTO) {
        const user = await validateUser(req);
        if (user === undefined) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Token couldn't be verified"});
        }

        if (!doesUserHavePermissionLevel(user, UsergroupFlags.POST_MANAGEMENT)) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Permission level not met"}); 
        }

        const post = await prisma.post.findUnique({
            where: {
                post_id: Number.parseInt(lockPostDTO.post_id)
            }
        });

        if (post === null) {
            return res.status(HttpStatus.NOT_FOUND).json({"message": "Post with specified ID couldn't be found"}); 
        }

        await prisma.post.update({
            where: {
                post_id: Number.parseInt(lockPostDTO.post_id)
            },
            data: {
                closed: !post.closed
            }
        });

        return res.status(HttpStatus.OK).json({"message": "Locked post"});
    }

    @Put("pin")
    async pinPost(@Req() req: Request, @Res() res: Response, @Body() pinPostDTO: PostDTO) {
        const user = await validateUser(req);
        if (user === undefined) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Token couldn't be verified"});
        }

        if (!doesUserHavePermissionLevel(user, UsergroupFlags.POST_MANAGEMENT)) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Permission level not met"}); 
        }

        const post = await prisma.post.findUnique({
            where: {
                post_id: Number.parseInt(pinPostDTO.post_id)
            }
        });

        if (post === null) {
            return res.status(HttpStatus.NOT_FOUND).json({"message": "Post with specified ID couldn't be found"}); 
        }

        await prisma.post.update({
            where: {
                post_id: Number.parseInt(pinPostDTO.post_id)
            },
            data: {
                pinned: !post.pinned
            }
        });

        return res.status(HttpStatus.OK).json({"message": "Pinned post"});
    }

    @Post("comment")
    async commentOnPost(@Req() req: Request, @Res() res: Response, @Body() newCommentDTO: NewCommentDTO) {
        const user = await validateUser(req);
        if (user === undefined) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Token couldn't be verified"});
        }

        if (!doesUserHavePermissionLevel(user, UsergroupFlags.COMMENT)) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Permission level not met"}); 
        }

        const post = await prisma.post.findUnique({
            where: {
                post_id: Number.parseInt(newCommentDTO.post_id)
            },
            select: {
                comments: true
            }
        });

        if (post === null) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Post couldn't be found with specified ID"});
        }

        const commentInsert = await prisma.comment.create({
            data: {
                content: newCommentDTO.content,
                user_id: Number.parseInt(newCommentDTO.user_id),
                post_id: Number.parseInt(newCommentDTO.post_id),
            }
        });

        post.comments.push(commentInsert);

        const postUpdate = await prisma.post.update({
            where: {
                post_id: Number.parseInt(newCommentDTO.post_id)
            },
            data: {
                comments: {
                    set: post.comments
                },
                last_updated: {
                    set: new Date()
                }
            }
        });

        return res.status(HttpStatus.OK).json({"message": "Comment posted", "comment_id": commentInsert.comment_id})
    }

    @Put("updateComment")
    async updateComment(@Res() res: Response, @Req() req: Request, @Body() body: UpdateCommentDTO) {
        const user = await validateUser(req);
        if (user === undefined) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Token couldn't be verified"});
        }

        const comment = await prisma.comment.findUnique({
            where: {
                comment_id: Number.parseInt(body.comment_id),
                user_id: user.public_id
            }
        });

        if (comment === null) {
            return res.status(HttpStatus.NOT_FOUND).json({"message": "Couldn't find comment"});
        }

        const commentUpdate = await prisma.comment.update({
            where: {
                comment_id: Number.parseInt(body.comment_id),
                user_id: user.public_id
            },
            data: {
                content: body.content,
                posted_at: comment.posted_at,
                updated_at: new Date()
            }
        });

        return res.status(HttpStatus.OK).json({"message": "Updated comment"});
    }

    @Delete("deleteComment")
    async deleteComment(@Res() res: Response, @Req() req: Request, @Body() body: DeleteCommentDTO) {
        const user = await validateUser(req);
        if (user === undefined) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Token couldn't be verified"});
        }

        const comment = await prisma.comment.findUnique({
            where: {
                comment_id: body.comment_id,
                user_id: user.public_id
            }
        });

        if (comment === null) {
            return res.status(HttpStatus.NOT_FOUND).json({"message": "Couldn't find comment"});
        }

        const deleteVotes = await prisma.vote.deleteMany({
            where: {
                comment_id: comment.comment_id 
            }
        });

        const deleteComment = await prisma.comment.delete({
            where: {
                comment_id: body.comment_id,
                user_id: user.public_id
            }
        });

        return res.status(HttpStatus.OK).json({"message": "Deleted comment"});
    }


    @Get("all")
    async getAllPosts(@Res() res: Response) {
        const posts = await prisma.post.findMany({
            orderBy: {
                last_updated: "desc"
            }
        });
        return res.status(HttpStatus.OK).json({"message": "Fetched all posts", "posts": posts});
    }

    @Get("allComments")
    async getAllComments(@Res() res: Response) {
        const comments = await prisma.comment.findMany({
            orderBy: {
                posted_at: "desc"
            }
        });
        return res.status(HttpStatus.OK).json({"message": "Fetched all comments", "comments": comments});
    }
}
