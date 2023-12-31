import { Body, Controller, Post, Res, HttpStatus, Query, Get } from "@nestjs/common";
import { Response } from "express";
import { CreateUserK9Dto } from "./create-user.dto";
import { prisma } from "../../db/prisma";
import { SHA256 } from "crypto-js";
import { Prisma } from "@prisma/client";

@Controller("auth")
export class AuthController {
    @Get("k9l")
    async knLogin(@Res() res: Response, @Query() query: {email: string, password: string}) {
        const token = SHA256(query.email + query.password).toString();
        const user = await prisma.user.findUnique({
            where: {
                token: token
            }
        });

        if (user === null) {
            return res.status(HttpStatus.BAD_REQUEST).json({"message": "Failed to login with given email and password"});
        }

        return res.status(HttpStatus.OK).json({"message": "Logged in", "token": token});
    }

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

        let userUsergroupCheck = await prisma.usergroup.findFirst();
        let userGroupID = 1;
        if (userUsergroupCheck === null) {
            let userUsergroup: Prisma.UsergroupCreateInput = {
                color: "FFFFFF",
                name: "User",
                permissions: (0x400 | 0x410 | 0x420 | 0x4000 | 0x4100)
            }

            let adminUsergroup: Prisma.UsergroupCreateInput = {
                color: "FF0000",
                name: "Admin",
                permissions: (0x400 | 0x410 | 0x420 | 0x4000 | 0x4100 | 0x5000 | 0x5100 | 0x08 | 0x04)
            }

            const crud = await prisma.usergroup.create({data: userUsergroup});
            userGroupID = crud.usergroup_id;
        
            await prisma.usergroup.create({data: adminUsergroup});
        } else {
            userGroupID === userUsergroupCheck.usergroup_id;
        }

        let user: Prisma.UserCreateInput = {
            email: createUserDto.email,
            password: createUserDto.password,
            username: createUserDto.username,
            last_online: new Date(),
            token: SHA256(createUserDto.email + createUserDto.password).toString(),
            profile_bio: "No information provided.",
            reputation: 0,
            usergroups: [userGroupID.toString()],
            profile_picture: "/default/default.png"
        }

        const createUser = await prisma.user.create({data: user});

        return res.status(HttpStatus.OK).json({"message": "Created K9 Account!", "token": user.token});
    }
}