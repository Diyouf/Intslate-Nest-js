import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { MongooseModule } from '@nestjs/mongoose';
import { studentModel } from '../model/admission.model';
import { FeeStructureSchema } from '../model/fees-structure.model';
import { FeeSchema } from '../model/fee.model';
import { MailerModule } from '@nestjs-modules/mailer';
import { homeWorkModel } from '../model/homeWork.model';
import { leaveReqModel } from '../model/leaveReq.model';
import { attendanceModel } from '../model/attendance.model';
import { teacherModel } from '../model/teacher.model';
import { ConnectionModel } from '../model/connection.model';
import { ChatModel } from '../model/chat.model';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: 'student', schema: studentModel },
        { name: 'fee-structure', schema: FeeStructureSchema },
        { name: 'fee', schema: FeeSchema },
        { name: 'homework', schema: homeWorkModel },
        { name: 'leaveReq', schema: leaveReqModel },
        { name: 'attendance', schema: attendanceModel },
        { name: 'teacher', schema: teacherModel },
        { name: 'connections', schema: ConnectionModel },
        { name: 'chats', schema: ChatModel },
      ]),
      MailerModule.forRoot({
        transport: {
          host: 'smtp.gmail.com',
          auth: {
            user: 'intslateofficial@gmail.com',
            pass: 'tqtupwdbqpwrdjgc'
          }
        }
      }),
  ],
  controllers: [StudentController],
  providers: [StudentService]
})
export class StudentModule {
 }
