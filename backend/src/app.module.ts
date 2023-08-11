import { Module } from '@nestjs/common';
import { AuthController } from './api/auth/auth.controller';
import { UsergroupController } from './api/admin/usergroup.controller';
import { ForumController } from './api/forum/forum.controller';
import { UserController } from './api/user/user.controller';
import { CategoryController } from './api/admin/category.controller';
import { TopicController } from './api/admin/topics.controller';
import { PostController } from './api/forum/post.controller';
import { VoteController } from './api/forum/vote.controller';
import {MessagesController} from './api/messages/messages.controller';

@Module({
  imports: [],
  controllers: [
    AuthController, 
    UsergroupController, 
    ForumController, 
    UserController,
    CategoryController,
    TopicController,
    PostController,
    VoteController,
    MessagesController
  ],
})
export class AppModule {}
