import { Controller, Post, Get, Req, Res, Body, HttpStatus } from "@nestjs/common";
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
            select: {
                comment_id: true,
                votes: true,
                user_id: true
            }
        });

        if (comment === null) {
            return res.status(HttpStatus.NOT_FOUND).json({"message": "Couldn't find target"});
        }

        const voteInsert = await prisma.vote.create({
            data: {
                comment_id: comment.comment_id,
                type: body.type,
                user_id: user.public_id
            }
        });

        comment.votes.push(voteInsert);

        const commentUpdate = await prisma.comment.update({
            where: {
                comment_id: Number.parseInt(body.target_id)
            },
            data: {
                votes: {
                    set: comment.votes
                }
            }
        });

        const repUpdate = await prisma.user.update({
            where: {
                public_id: comment.user_id || 0
            },
            data: {
                reputation: {
                    "increment": body.type
                }
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
            select: {
                post_id: true,
                votes: true,
                user_id: true
            }
        });

        if (post === null) {
            return res.status(HttpStatus.NOT_FOUND).json({"message": "Couldn't find target"});
        }

        const voteInsert = await prisma.vote.create({
            data: {
                post_id: post.post_id,
                type: body.type,
                user_id: user.public_id
            }
        });

        post.votes.push(voteInsert);

        const postUpdate = await prisma.post.update({
            where: {
                post_id: Number.parseInt(body.target_id)
            },
            data: {
                votes: {
                    set: post.votes
                },
                last_updated: new Date()
            }
        });

        const repUpdate = await prisma.user.update({
            where: {
                public_id: post.user_id || 0
            },
            data: {
                reputation: {
                    "increment": body.type
                }
            }
        });

        return res.status(HttpStatus.OK).json({"message": "Voted on post"});
    }
}