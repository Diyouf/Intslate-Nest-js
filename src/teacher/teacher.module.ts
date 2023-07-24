import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { teacherModel } from '../model/teacher.model';

@Module({
  imports:[
    MongooseModule.forFeature([ { name: 'teacher', schema: teacherModel }]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: 'intslateofficial@gmail.com',
          pass: 'tqtupwdbqpwrdjgc'
        }
      }
    })
  ],
  controllers: [TeacherController],
  providers: [TeacherService]
})
export class TeacherModule{
}
