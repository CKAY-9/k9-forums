import { Module } from '@nestjs/common';
import { AuthController } from './api/auth/auth.controller';
import { UsergroupController } from './api/admin/usergroup.controller';
import { ForumController } from './api/forum/forum.controller';
import { UserController } from './api/user/user.controller';

@Module({
  imports: [],
  controllers: [
    AuthController, 
    UsergroupController, 
    ForumController, 
    UserController],
})
export class AppModule {}
