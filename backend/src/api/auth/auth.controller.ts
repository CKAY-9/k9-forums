import { Body, Controller, Post, Res, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { CreateUserK9Dto } from "./create-user.dto";
import { PrismaClient, Prisma } from "@prisma/client";
import { SHA256 } from "crypto-js";

const prisma = new PrismaClient();

@Controller("auth")
export class AuthController {
    @Post("k9r")
    async knRegister(@Body() createUserDto: CreateUserK9Dto, @Res() res: Response): Promise<any> {
        const userCheck = await prisma.user.findUnique({
            where: {
                email: createUserDto.email
            }
        });

        if (userCheck !== null) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Account with this email already exists!"});
        }

        let user: Prisma.UserCreateInput = {
            email: createUserDto.email,
            password: createUserDto.password,
            username: createUserDto.username,
            last_online: new Date(),
            token: SHA256(createUserDto.email + createUserDto.password).toString(),
            profile_bio: "No information provided.",
            reputation: 0,
        }

        const createUser = await prisma.user.create({data: user});

        return res.status(HttpStatus.OK).json({"message": "Created K9 Account!", "token": user.token});
    }
}