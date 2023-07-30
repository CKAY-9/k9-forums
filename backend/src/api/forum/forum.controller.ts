import { Body, Controller, Get, Param, Res, HttpStatus } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { Response } from "express";

const prisma = new PrismaClient();

@Controller("forum")
export class ForumController {
    @Get("geninfo")
    async GeneralInfoForum(): Promise<any> {
        const forumInfo = await prisma
    }
}