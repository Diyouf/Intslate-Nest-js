import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { teacherDocument } from '../model/teacher.model';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { studentDocument } from '../model/admission.model';
import { homeWorkDocument } from '../model/homeWork.model';
import { leaveReqDocument } from '../model/leaveReq.model';

@Injectable()
export class TeacherService {
  constructor(
    @InjectModel('teacher')
    private readonly teacherModel: Model<teacherDocument>,
    @InjectModel('student')
    private readonly studentModel: Model<studentDocument>,
    @InjectModel('homework')
    private readonly homeworkModel: Model<homeWorkDocument>,
    private jwtService: JwtService,
    @InjectModel('leaveReq') private readonly leaveReqModel: Model<leaveReqDocument>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    return hashedPassword;
  }

  async registerTeacher(formData: any) {
    try {
      const { teacherId, email, password, phone } = formData;
      const checkId = await this.teacherModel.findOne({ teacherId });
      if (checkId) {
        if (checkId.password) {
          return { alreadyReg: 'You are already Registered..' };
        } else {
          if (checkId.email !== email) {
            return { emailMatch: 'Email  is not match..' };
          } else if (checkId.phone === phone) {
            const hashedPass = await this.hashPassword(password);

            const addpass = await this.teacherModel.findOneAndUpdate(
              { teacherId },
              { $set: { password: hashedPass } },
            );
            if (addpass) {
              return { succes: true };
            }
          } else {
            return { phoneMatch: 'Phone number is not match..' };
          }
        }
      } else {
        return { idMatch: 'Teacher ID is not match..' };
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async validateLogin(data: any) {
    try {
      const { teacherId, email, password } = data;
      let idMatch = await this.teacherModel.findOne({ teacherId });
      if (idMatch) {
        if (idMatch.is_delete === false) {
          if (!idMatch.password) {
            return { regError: 'You should register first..' };
          } else if (idMatch.email !== email) {
            return { emailError: 'Email is not match.. ' };
          } else {
            const passMatch = await bcrypt.compare(password, idMatch.password);
            if (!passMatch) {
              return { passError: 'Password is not match..' };
            } else {
              const payload = {
                sub: idMatch._id,
                email: idMatch.email,
                role: 'teacher',
              };
              return {
                access_token: await this.jwtService.signAsync(payload),
                id: idMatch._id,
              };
            }
          }
        } else {
          return { msg: 'Account has been removed..' };
        }
      } else {
        return { idNotmatch: 'Teacher Id is found..' };
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async loadTeacherProfile(id: string) {
    try {
      const teacherData = await this.teacherModel
        .findById({ _id: id })
        .populate('subject')
        .populate('class');
      if (teacherData) {
        return teacherData;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async fetchStudent(id: string) {
    try {
      const teacherId = await this.teacherModel.findById({ _id: id });
      if (teacherId) {
        const classId = teacherId.class;

        const studentData = await this.studentModel.find({ class: classId });
        return studentData;
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async addHomeWork(id:string ,data:any){
    try {
     if(data){
      const saveData = new this.homeworkModel({
         teacher:id,
         class:data.class,
         dueDate:data.dueDate,
         homework:data.homework,
         date:new Date()
      })
      if(saveData){
        await saveData.save()
        return true
      }else{
        return false
      }
     }
      
    } catch (error) {
      console.log(error.message);
      
    }
  }

  async fetchHomeWork(id:string){
    try {
       const homeWorkData = await this.homeworkModel.find({teacher:id}).populate('class').sort({date :-1})
       if(homeWorkData){
        return homeWorkData
       }
      
    } catch (error) {
      console.log(error.message);
      
    }
  }

  async fetchLeaveReq(id:string){
    try {
      const teacherData = await this.teacherModel.findById({_id:id})    
      const classId = teacherData.class  

      const LeaveData = await this.leaveReqModel.find({class:classId}).populate('student')
     if(LeaveData){
      return LeaveData
     }
      
    } catch (error) {
      console.log(error.message);
      
    }
  }

  async approveReq(id:string){
    try {
      const updateStatus = await this.leaveReqModel.findByIdAndUpdate({_id:id},{$set:{status:'Approved'}})
      if(updateStatus){
        return {success:true}
      }
    } catch (error) {
      console.log(error.message);
      
    }
  }

}
