import { Controller, Get, HttpStatus, Res } from "@nestjs/common";
import { prisma } from "../../db/prisma";
import { Response } from "express";

@Controller("comment")
export class CommentController {
    @Get("all")
    async getAllComments(@Res() res: Response) {
        const comments = await prisma.comment.findMany({});
        return res.status(HttpStatus.OK).json({"comments": comments});
    }
}