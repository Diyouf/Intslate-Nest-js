import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { studentDocument } from '../model/admission.model';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { FeeStructure } from '../model/fees-structure.model';
import { Fee } from '../model/fee.model';
import { MailerService } from '@nestjs-modules/mailer';
import { homeWorkDocument } from '../model/homeWork.model';
import { leaveFormData } from './student.interfaces';
import { leaveReqDocument } from '../model/leaveReq.model';
import { attendanceDocument } from '../model/attendance.model';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel('student')
    private readonly studentModel: Model<studentDocument>,
    @InjectModel('fee-structure')
    private readonly feeStructure: Model<FeeStructure>,
    @InjectModel('fee') private readonly paidFeesModel: Model<Fee>,
    @InjectModel('leaveReq') private readonly leaveReqModel: Model<leaveReqDocument>,
    @InjectModel('homework')
    private readonly homeworkModel: Model<homeWorkDocument>,
    @InjectModel('attendance')
    private readonly attendanceModel: Model<attendanceDocument>,
    private readonly mailService: MailerService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    return hashedPassword;
  }

  async registerStudent(data: any) {
    try {
      try {
        const { studentId, email, password, phone } = data;
        const checkId = await this.studentModel.findOne({ studentId });
        if (checkId) {
          if (checkId.password) {
            return { alreadyReg: 'You are already Registered..' };
          } else {
            if (checkId.email !== email) {
              return { emailMatch: 'Email number is not match..' };
            } else if (checkId.phone === phone) {
              const hashedPass = await this.hashPassword(password);

              const addpass = await this.studentModel.findOneAndUpdate(
                { studentId },
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
          return { idMatch: 'Student ID is not match..' };
        }
      } catch (error) {
        console.log(error.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async validateLogin(data: any) {
    try {
      const { studentId, email, password } = data;
      let idMatch = await this.studentModel.findOne({ studentId });
      if (idMatch) {
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
              role: 'student',
            };
            return {
              access_token: await this.jwtService.signAsync(payload),
              id: idMatch._id,
            };
          }
        }
      } else {
        return { idNotmatch: 'Student Id is found..' };
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async studentProfile(id: string) {
    try {
      const studentData = await this.studentModel
        .findById({ _id: id })
        .populate({
          path: 'class',
          populate: { path: 'classTeacher', model: 'teacher' },
        });
      return studentData;
    } catch (error) {
      console.log(error.message);
    }
  }

  async feesStructure() {
    try {
      const feeData = await this.feeStructure.findOne();
      return feeData;
    } catch (error) {
      console.log(error.message);
    }
  }

  async paidStudent(id: string) {
    try {
      const paidStudentData = await this.paidFeesModel.findOne({ student: id });
      return paidStudentData;
    } catch (error) {
      console.log(error.message);
    }
  }

  async paymentUpdates(id: string, data: any) {
    try {
      
      
      const termId = data.term.id;

      const userData = await this.paidFeesModel.findOne({ student: id });
      const studentData = await this.studentModel.findById({ _id: id });

      let foundTerm = null;
      let foundTermKey = null;
      for (const termKey in userData) {
        if (termKey.startsWith('term')) {
          const term = userData[termKey];
          if (term._id.toString() === termId) {
            foundTerm = term;
            foundTermKey = termKey;
            break;
          }
        }
      }

      if (foundTerm) {
        foundTerm.amount = data.term.amount;
        foundTerm.status = 'Paid';
        foundTerm.paymentDate = new Date();
        foundTerm.paymentId = data.paymentData.id;
        userData[foundTermKey] = foundTerm;

        const updateAmount = await this.paidFeesModel.findOneAndUpdate(
          { _id: userData._id },
          { $set: { ...userData } },
        );

        if (updateAmount) {
          const date = new Date();
          const mailOption = {
            to: data.paymentData.email.toString(),
            from: 'intslateofficial@gmail.com',
            subject: 'Student Fee payment status Mail From IntSlate School',
            text: `Hello,`,
            html: ` 
                        <html>

                        <body style="background-color:#e2e1e0;font-family: Open Sans, sans-serif;font-size:100%;font-weight:400;line-height:1.4;color:#000;">
                          <table style="max-width:670px;margin:50px auto 10px;background-color:#fff;padding:50px;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;-webkit-box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24);-moz-box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24);box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24); border-top: solid 10px green;">
                            <thead>
                              <tr>
                                <th style="text-align:right;font-weight:400;">${date.toLocaleString()}</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td style="height:35px;">Intslate</td>
                              </tr>
                              <tr>
                                <td colspan="2" style="border: solid 1px #ddd; padding:10px 20px;">
                                  <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:150px">Order status</span><b style="color:green;font-weight:normal;margin:0">Success</b></p>
                                  <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:146px">Term:</span>${
                                    data.term.term
                                  } </p>
                                  <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:146px">Transaction ID:</span>${
                                    foundTerm.paymentId
                                  } </p>
                                  <p style="font-size:14px;margin:0 0 0 0;"><span style="font-weight:bold;display:inline-block;min-width:146px">Amount:</span> Rs. ${
                                    data.term.amount
                                  }.00/-</p>
                                </td>
                              </tr>
                              <tr>
                                <td style="height:35px;"></td>
                              </tr>
                              <tr>
                              <td style="width:50%;padding:20px;vertical-align:top">
                                  <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">ID No.</span>#${
                                    studentData.studentId
                                  }</p>
                                  <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px">Name</span>${
                                    studentData.name
                                  }</p>
                                  <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Email</span> ${
                                    studentData.email
                                  }</p>
                                  <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Phone</span> +91-${
                                    studentData.phone
                                  }</p>
                                </td>
                                <td style="width:50%;padding:20px;vertical-align:top">
                                  <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Address</span> ${
                                    studentData.address
                                  },${studentData.city} ,${
              studentData.state
            }, ${studentData.zip}</p>
                                </td>
                              </tr>
                             
                            </tbody>
                            <tfooter>
                              <tr>
                                <td colspan="2" style="font-size:14px;padding:50px 15px 0 15px;">
                                  <strong style="display:block;margin:0 0 10px 0;">Regards</strong> Inslate school<br> kakkencheri, Pin/Zip - 735221, Malappuram, Kerala, India<br><br>
                                  <b>Phone:</b> 8590629210<br>
                                  <b>Email:</b> intslateofficial@gmail.com.in
                                </td>
                              </tr>
                            </tfooter>
                          </table>
                        </body>
                        
                        </html>`,
          };
          this.mailService.sendMail(mailOption);

          return { success: true };
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async fetchHomeWorks(id: string) {
    try {
      if (id) {
        const studentData = await this.studentModel.findById({ _id: id });
        if (studentData) {
          const classId = studentData.class;

          const homeWorkData = await this.homeworkModel
            .find({ class: classId })
            .populate({
              path: 'teacher',
              populate: {
                path: 'subject', // Assuming 'subject' is the field referencing the subject model
              },
            }).sort({date:-1})

          return homeWorkData;
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

async leaveReq (id:string , formData:leaveFormData){
  try {
    const studentData = await this.studentModel.findById({_id:id})
    const classId = studentData.class
   const saveData = new this.leaveReqModel({
    noofday:formData.noofday,
    endDate:formData.endDate,
    startDate:formData.startDate,
    reason :formData.reason,
    student:id,
    class:classId,
    currentDate:new Date()
   })
   if(saveData){
    await saveData.save()
    return {success:true}
   }
    
  } catch (error) {
    console.log(error.message);
    
  }
}

async fetchAttendance(id:string){
  try {
    const studentId = await this.studentModel.findById({_id:id})
    const classId = studentId.class
    const attendanceData = await this.attendanceModel.find({
      class: classId,
      'attendance.studentId': studentId._id 
    });

    const formattedAttendance = attendanceData.flatMap(item => {
      return item.attendance
        .filter(entry => entry.studentId.equals(studentId._id))
        .map(entry => {
          return {
            attendance: entry.attendance,
            date: item.date.toISOString().split('T')[0]
          };
        });
    });

    return formattedAttendance

    
  } catch (error) {
    console.log(error.message);
    
  }
}


}
