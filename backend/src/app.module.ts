import { Module } from '@nestjs/common';
import { AuthController } from './api/auth/auth.controller';
import { UsergroupController } from './api/admin/usergroup.controller';

@Module({
  imports: [],
  controllers: [AuthController, UsergroupController],
})
export class AppModule {}
