import { Module } from '@nestjs/common';
import { AuthController } from './api/auth/auth.controller';
import { UsergroupController } from './api/admin/usergroup.controller';
import { ForumController } from './api/forum/forum.controller';
import { UserController } from './api/user/user.controller';
import { CategoryController } from './api/admin/category.controller';

@Module({
  imports: [],
  controllers: [
    AuthController, 
    UsergroupController, 
    ForumController, 
    UserController,
    CategoryController
  ],
})
export class AppModule {}
