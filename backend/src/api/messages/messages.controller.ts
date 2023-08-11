import {Controller} from "@nestjs/common";
import {Body, Get, Post, Query, Req, Res} from "@nestjs/common/decorators";
import {HttpStatus} from "@nestjs/common/enums";
import {Response} from "express";
import {prisma} from "src/db/prisma";
import {validateUser} from "../user/user.utils";
import {NewMessageDTO} from "./messages.dto";

@Controller("messages")
export class MessagesController {
    @Post("create")
    async createNewMessage(@Req() req: Request, @Res() res: Response, @Body() body: NewMessageDTO) {
        const sender_id = body.sender_id;
        const receiver_id = body.receiver_id;

        const sender = await prisma.user.findUnique({
            where: {
                public_id: sender_id
            }
        });

        if (sender === null) {
            return res.status(HttpStatus.NOT_FOUND).json({"message": "Couldn't find sender"});
        }

        const receiver = await prisma.user.findUnique({
            where: {
                public_id: receiver_id
            } 
        });

        if (receiver === null) {
            return res.status(HttpStatus.NOT_FOUND).json({"message": "Couldn't find receiver"});
        }

        let channel = await prisma.channel.findUnique({
            where: {
                channel_id: `${sender.public_id}:${receiver.public_id}`
            }
        });

        if (channel === null) {
            channel = await prisma.channel.create({
                data: {
                    sender_id: sender.public_id,
                    receiver_id: receiver.public_id,
                    channel_id: `${sender.public_id}:${receiver.public_id}`
                }
            });
        }

        const newMessage = await prisma.message.create({
            data: {
                channel_id: channel.channel_id,
                content: body.content,
                sender_id: sender.public_id,
                receiver_id: receiver.public_id
            }
        });

        return res.status(HttpStatus.OK).json({"message": "Created new message", "data": newMessage});
    }

    @Get("channelMessages")
    async getChannelMessage(@Req() req: Request, @Res() res: Response, @Query() query: {channel_id: string}) {
        const user = await validateUser(req);
        if (user === undefined) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Couldn't verify user"});
        }

        const channel = await prisma.channel.findUnique({
            where: {
                channel_id: query.channel_id
            }
        });

        if (channel === null) {
            return res.status(HttpStatus.NOT_FOUND).json({"message": "Couldn't find channel"});
        }
        if (channel.sender_id !== user.public_id) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "You cannot view these messages"});
        }

        const messages = await prisma.message.findMany({
            where: {
                channel_id: channel.channel_id
            }
        });

        return res.status(HttpStatus.OK).json({"message": "Fetched channel messages", "messages": messages});
    }

    @Get("me")
    async getMyChannels(@Req() req: Request, @Res() res: Response) {
        const user = await validateUser(req);
        if (user === undefined) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "User couldn't be verified"});
        }

        const channels = await prisma.channel.findMany({
            where: {
                sender_id: user.public_id
            }
        });

        if (channels === null) {
            return res.status(HttpStatus.NOT_FOUND).json({"message": "Couldn't find channels"});
        }

        return res.status(HttpStatus.OK).json({"message": "Fetched users messages", "channels": channels});
    }
}
