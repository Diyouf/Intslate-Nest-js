import { Module } from '@nestjs/common';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { teacherModel } from '../model/teacher.model';
import { studentModel } from '../model/admission.model';
import { homeWorkModel } from '../model/homeWork.model';
import { leaveReqModel } from '../model/leaveReq.model';
import { attendanceModel } from '../model/attendance.model';
import { ChatModel } from '../model/chat.model';
import { ConnectionModel } from '../model/connection.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'teacher', schema: teacherModel },
      { name: 'student', schema: studentModel },
      { name: 'homework', schema: homeWorkModel },
      { name: 'leaveReq', schema: leaveReqModel },
      { name: 'attendance', schema: attendanceModel },
      { name: 'connections', schema: ConnectionModel },
      { name: 'chats', schema: ChatModel },
    ]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: 'intslateofficial@gmail.com',
          pass: 'tqtupwdbqpwrdjgc',
        },
      },
    }),
  ],
  controllers: [TeacherController],
  providers: [TeacherService],
})
export class TeacherModule {}
