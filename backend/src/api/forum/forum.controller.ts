import { Body, Controller, Get, Param, Res, HttpStatus } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { Response } from "express";

const prisma = new PrismaClient();

@Controller("forum")
export class ForumController {
    @Get("info")
    async GeneralInfoForum(@Res() res: Response): Promise<any> {
        let forumInfo = await prisma.forum.findFirst();
        if (forumInfo === null) {
            forumInfo = {
                community_name: "K9 Forums",
                community_logo: "",
                about: "FOS Forum Software by CKAY9",
                custom_redirects: []
            } 

            await prisma.forum.create({data: forumInfo});
        }
        return res.status(HttpStatus.OK).json(forumInfo);
    }
}