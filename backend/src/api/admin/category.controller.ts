import { Body, Controller, HttpStatus, Req, Res, Post, Put } from "@nestjs/common";
import { validateUser } from "../user/user.utils";
import { UsergroupFlags, doesUserHavePermissionLevel } from "./permissions";
import { CreateCategoryDTO, UpdateCategoryDTO } from "./admin.dto";
import { Response } from "express";
import { prisma } from "../../db/prisma";

@Controller("category")
export class CategoryController {
    @Post("create")
    async createNewCategory(@Req() req: Request, @Res() res: Response, @Body() createCategoryDTO: CreateCategoryDTO) {
        const user = await validateUser(req);
        if (user === undefined) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Token couldn't be verified"});
        }

        if (!doesUserHavePermissionLevel(user, UsergroupFlags.FORUM_MANAGEMENT)) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Permission level not met"}); 
        }

        const forum = await prisma.forum.findFirst({
            select: {
                categories: true,
                community_name: true
            }
        });

        if (forum === null) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Forum object not found"}); 
        }

        const categoryCreate = await prisma.category.create({data: {
            "name": createCategoryDTO.name,
            "color": createCategoryDTO.color,
            "about": createCategoryDTO.about,
            "forumCommunity_name": forum.community_name,
        }});

        forum.categories.push(categoryCreate);

        const forumUpdate = await prisma.forum.update({
            where: {
                community_name: forum.community_name
            },
            data: {
                categories: {
                    set: forum.categories
                }
            }
        });

        return res.status(HttpStatus.OK).json({"message": "Created new forum category", "category": categoryCreate});
    }

    @Put("update")
    async updateCategory(@Req() req: Request, @Res() res: Response, @Body() updateCategoryDTO: UpdateCategoryDTO) {
        const user = await validateUser(req);
        if (user === undefined) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Token couldn't be verified"});
        }

        if (!doesUserHavePermissionLevel(user, UsergroupFlags.FORUM_MANAGEMENT)) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Permission level not met"}); 
        }

        const doesExist = await prisma.category.findUnique({
            where: {
                category_id: updateCategoryDTO.category_id
            }
        });

        if (doesExist === null) {
            return res.status(HttpStatus.NOT_FOUND).json({"message": "Specified category ID couldn't be found"});
        }

        const update = await prisma.category.update({
            where: {
                category_id: updateCategoryDTO.category_id
            },
            data: {
                name: updateCategoryDTO.name,
                about: updateCategoryDTO.about,
                color: updateCategoryDTO.color
            }
        });

        return res.status(HttpStatus.OK).json({"message": "Updated new forum category", "category": update});
    }
}