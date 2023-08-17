import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSchema } from '../model/admin.model';
import { teacherModel } from '../model/teacher.model';
import { studentModel } from '../model/admission.model';
import { classModel } from '../model/class.model';
import { FeeSchema } from '../model/fee.model';
import { FeeStructureSchema } from '../model/fees-structure.model';
import { subjectModel } from '../model/subject.model';
import { EventModel } from '../model/event.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'admin', schema: AdminSchema },
      { name: 'teacher', schema: teacherModel },
      { name: 'student', schema: studentModel },
      { name: 'classes', schema: classModel },
      { name: 'fee', schema: FeeSchema },
      { name: 'fee-structure', schema: FeeStructureSchema },
      { name: 'subject', schema: subjectModel },
      { name: 'events', schema: EventModel },
    ]),
   
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {
  constructor(){
    
    
  }
}
