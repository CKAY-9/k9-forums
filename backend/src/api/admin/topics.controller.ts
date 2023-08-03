import { Controller, HttpStatus, Req, Res, Get, Post, Body, Query } from "@nestjs/common";
import { Response } from "express";
import { prisma } from "../../db/prisma";
import { CreateTopicDTO } from "./admin.dto";
import { validateUser } from "../user/user.utils";
import { UsergroupFlags, doesUserHavePermissionLevel } from "./permissions";

@Controller("topic")
export class TopicController {
    @Get("all")
    async getAllTopics(@Res() res: Response, @Req() req: Request) {
        const topics = await prisma.topic.findMany();
        return res.status(HttpStatus.OK).json({"message": "Got all topics", "topics": topics});
    }

    @Get("category")
    async getCategoryTopics(@Res() res: Response, @Req() req: Request, @Query() query: {category_id: string}) {
        const topics = await prisma.topic.findMany({
            where: {
                category_id: Number.parseInt(query.category_id)
            }
        });

        return res.status(HttpStatus.OK).json({"message": "Got topics of category ID" + query.category_id, "topics": topics});
    }
    
    @Get("posts")
    async getTopicPostsAndActivity(@Res() res: Response, @Req() req: Request, @Query() query: {topic_id: string}) {
        const topic = await prisma.topic.findUnique({
            where: {
                topic_id: Number.parseInt(query.topic_id)
            },
            select: {
                posts: true,
                name: true,
                about: true,
                category_id: true,
                topic_id: true,
            }
        });

        if (topic === null) {
            return res.status(HttpStatus.NOT_FOUND).json({"message": "Failed to find topic with ID" + query.topic_id});
        }

        const topicPosts = await prisma.post.findMany({
            where: {
                topic_id: topic.topic_id
            }
        });

        topic.posts = topicPosts;

        const topicUpdate = await prisma.topic.update({
            where: {
                topic_id: Number.parseInt(query.topic_id)
            },
            data: {
                posts: {
                    set: topicPosts
                }
            }
        });

        return res.status(HttpStatus.OK).json({"message": "Got topic info", "topic": topic});
    }

    @Post("create") 
    async createNewTopic(@Res() res: Response, @Req() req: Request, @Body() body: CreateTopicDTO) {
        const user = await validateUser(req);
        if (user === undefined) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Token couldn't be verified"});
        }

        if (!doesUserHavePermissionLevel(user, UsergroupFlags.FORUM_MANAGEMENT)) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Permission level not met"}); 
        }

        body.category_id = Number.parseInt(body.category_id.toString());

        const parentCategory = await prisma.category.findUnique({
            where: {
                category_id: body.category_id
            },
            select: {
                topics: true
            }
        });

        if (parentCategory === null) {
            return res.status(HttpStatus.NOT_FOUND).json({"message": "Parent category couldn't be found"}); 
        }

        const topicCreate = await prisma.topic.create({data: {
            "name": body.name,
            "about": body.about,
            "category_id": body.category_id
        }});

        parentCategory.topics.push(topicCreate);

        const parentUpdate = await prisma.category.update({
            where: {
                category_id: body.category_id
            },
            data: {
                topics: {
                    set: parentCategory.topics
                }
            }
        });

        return res.status(HttpStatus.OK).json({"message": "Successful creation of new topic", topic: topicCreate});
    }
}