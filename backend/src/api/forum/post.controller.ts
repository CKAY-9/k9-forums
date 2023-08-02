import { Body, Controller, Req, Res, Post, HttpStatus, Get, Query } from "@nestjs/common";
import { Response } from "express";
import { CreatePostDTO, NewCommentDTO, PostDTO } from "./forum.dto";
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
                votes: 0
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
            }
        });

        if (post === null) {
            return res.status(HttpStatus.NOT_FOUND).json({"message": "Couldn't find post with specified ID"});
        }

        const comments = await prisma.comment.findMany({
            where: {
                post_id: post?.post_id
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

    @Post("lock")
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
                closed: true
            }
        });

        return res.status(HttpStatus.OK).json({"message": "Locked post"});
    }

    @Post("pin")
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
                pinned: true
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
                votes: 0
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
                }
            }
        });

        return res.status(HttpStatus.OK).json({"message": "Comment posted", "comment_id": commentInsert.comment_id})
    }
}