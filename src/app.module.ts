import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from './admin/admin.module';
import { TeacherModule } from './teacher/teacher.module';
import { StudentModule } from './student/student.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthMiddleware } from './common/AuthMiddleWare';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/project-SM'),
    AdminModule,
    TeacherModule,
    StudentModule,
    JwtModule.register({
      global: true,
      secret: 'jwtSecret',
      signOptions: { expiresIn: '7d' },
    }),
    UserModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'admin/login', method: RequestMethod.POST },
        { path: 'student/login', method: RequestMethod.POST },
        { path: 'student/register', method: RequestMethod.POST },
        { path: 'teacher/teacherLogin', method: RequestMethod.POST },
        { path: 'teacher/teacherRegister', method: RequestMethod.POST },
        { path: 'user/loadEvents', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}
