import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { adminSchema } from '../model/admin.model';
import { teacherDocument } from '../model/teacher.model';
import { Model } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { studentDocument } from '../model/admission.model';
import { JwtService } from '@nestjs/jwt';
import { classSchema } from '../model/class.model';
import { FeeStructure } from '../model/fees-structure.model';
import { Fee } from '../model/fee.model';
import { subjectSchema } from '../model/subject.model';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('admin') private readonly adminModel: Model<adminSchema>,
    @InjectModel('teacher')
    private readonly teacherModel: Model<teacherDocument>,
    @InjectModel('student')
    private readonly studentModel: Model<studentDocument>,
    @InjectModel('classes') private readonly classModel: Model<classSchema>,
    @InjectModel('fee-structure')
    private readonly feeStructure: Model<FeeStructure>,
    @InjectModel('fee') private readonly studentFee: Model<Fee>,
    @InjectModel('subject') private readonly subjectModel: Model<subjectSchema>,

    private readonly mailService: MailerService,
    private jwtService: JwtService,
  ) {}

  async adminLogin(logindata: adminSchema) {
    try {
      const { email, password } = logindata;

      const adminEmail = await this.adminModel.findOne({ email });

      if (!adminEmail) {
        return { Emailmessage: 'invalid Email' };
      }

      if (adminEmail.password !== password) {
        return { Passmessage: 'Incorrect password' };
      }
      const payload = {
        sub: adminEmail._id,
        email: adminEmail.email,
        role: 'admin',
      };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      console.log(error.message);
    }
  }

  async addteacher(formdata: any, file: any) {
    try {
      const { name, email, gender, phone, subject, address } = formdata;
      const checkEmail = await this.teacherModel.findOne({ email });
      const phoneCheck = await this.teacherModel.findOne({ phone: phone });

      const min = 10000;
      const max = 99999;
      const randomID = Math.floor(Math.random() * (max - min + 1)) + min;

      if (checkEmail) {
        return { EmailError: 'Email already Exist..' };
      } else if (phoneCheck) {
        return { Phoneerror: 'Phone number Already exist..' };
      } else {
        if (file) {
          const teacherData = new this.teacherModel({
            teacherId: randomID,
            name,
            email,
            gender,
            phone,
            subject,
            address,
            image: file.filename,
            is_classTeacher: false,
            is_delete: false,
          });

          if (teacherData) {
            const mailOption = {
              to: email,
              from: 'intslateofficial@gmail.com',
              subject: 'Teacher Registration Mail From IntSlate School',
              text: `Hello This is Testing Message`,
              html: `<h1>Teacher Registration ID</h1>
                        <p>Dear ${name},</p>
                        <p>Thank you for registering. Your registration ID is: <strong>#${randomID}</strong></p>
                        <p>Please keep this ID for future reference.</p>
                        <p>Best regards,</p>
                        <p>From Intslate School Administration</p>`,
            };
            this.mailService.sendMail(mailOption);
            const saveData = await teacherData.save();
            if (saveData) {
              await this.subjectModel.findByIdAndUpdate(
                { _id: subject },
                { $inc: { teacherCount: 1 } },
                { new: true },
              );
              return { success: true };
            }
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async fetchTeachers() {
    try {
      const allTeacher = await this.teacherModel.find({ is_delete: false }).populate('subject')
      if (allTeacher) {
        return { fetchedData: allTeacher };
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async admissionRequest(data: any, file: any) {
    const addmissionData = new this.studentModel({
      name: data['firstName'] + data['lastName'],
      age: data.age,
      DOB: data.DOB,
      gender: data.gender,
      seekingClass: data.class,
      image: file.filename,
      Guardname: data.Guardname,
      relation: data.relation,
      email: data.email,
      phone: data.phone,
      city: data.city,
      state: data.state,
      zip: data.zip,
      address: data.address,
      admissoinDate: Date.now(),
    });

    if (addmissionData) {
      let result = await addmissionData.save();
      if (result) {
        return { success: true };
      }
    }
  }

  async getAdmmissionData() {
    try {
      const getAdmissionData = await this.studentModel.find();
      if (getAdmissionData) {
        return { data: getAdmissionData };
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async approveAdmission(id: any, data: any) {
    try {
      enum status {
        approve = 'Approved',
        reject = 'Rejected',
      }
      const min = 10000;
      const max = 99999;
      const randomID = Math.floor(Math.random() * (max - min + 1)) + min;
      const updateStatus = await this.studentModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            is_approved: status.approve,
            studentId: randomID,
            class: data.division,
          },
        },
      );
      await this.classModel.findByIdAndUpdate(
        { _id: data.division },
        { $inc: { students: 1 } },
      );
      if (updateStatus) {
        const mailOption = {
          to: updateStatus.email.toString(),
          from: 'intslateofficial@gmail.com',
          subject: 'Student Admission Mail From IntSlate School',
          text: `Hello,`,
          html: ` 
                <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Intslate</a>
    </div>
    <p style="font-size:1.1em">Hi ${updateStatus.name},</p>
    <p>Your Admission Request has been Approved for the class of ${data.class}.Welcome to Intslate School. Your Student Id</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">#${randomID}</h2>
    <p style="font-size:0.9em;">Best Regards,<br />From Intslate School Administration</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Intslate School</p>
      <p>Kakkanchery,Malappuram</p>
      <p>Kerla,India</p>
    </div>
  </div>
</div>`,
        };
        const findStudent = await this.studentFee.findById({ _id: id });
        if (!findStudent) {
          const studentId = new this.studentFee({
            student: id,
          });
          await studentId.save();
        }
        this.mailService.sendMail(mailOption);
        return { success: true };
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async reject(id: any) {
    try {
      enum status {
        approve = 'Approved',
        reject = 'Rejected',
      }
      const rejectAction = await this.studentModel.findByIdAndUpdate(
        { _id: id },
        { $set: { is_approved: status.reject } },
      );
      if (rejectAction) {
        const mailOption = {
          to: rejectAction.email.toString(),
          from: 'intslateofficial@gmail.com',
          subject: 'Student Admission Mail From IntSlate School',
          text: `Hello,`,
          html: ` 
            <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
<div style="margin:50px auto;width:70%;padding:20px 0">
<div style="border-bottom:1px solid #eee">
  <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Intslate</a>
</div>
<p style="font-size:1.1em">Hi ${rejectAction.name},</p>
<p>Your Admission Request has been Rejected by the admin for the class  ${rejectAction.class}<br>The administrator may reject an admission form due to incomplete or incorrect information provided by the applicant. Additionally, if the school has reached its maximum capacity, admission forms received later may be turned down to maintain a balanced student-to-teacher ratio. These measures ensure accurate records and uphold the school's commitment to providing quality education within its available resources.
</p>
<p style="font-size:0.9em;">Best Regards,<br />From Intslate School Administration</p>
<hr style="border:none;border-top:1px solid #eee" />
<div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
  <p>Intslate School</p>
  <p>Kakkanchery,Malappuram</p>
  <p>Kerla,India</p>
</div>
</div>
</div>`,
        };
        this.mailService.sendMail(mailOption);
        return { success: true };
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async fetchStudent() {
    try {
      const userData = await this.studentModel
        .find({ is_approved: 'Approved' })
        .sort({ admissoinDate: -1 })
        .populate('class')
        .exec();
      if (userData) {
        return { data: userData };
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async fetchDivision(className: number) {
    try {
      const nextDivision = await this.classModel
        .find({ className: className })
        .sort({ division: -1 })
        .exec();

      const division = nextDivision.length
        ? String.fromCharCode(nextDivision[0].division.charCodeAt(0) + 1)
        : 'A';
      return { division };
    } catch (error) {
      console.log(error.message);
    }
  }

  async addClass(data: any) {
    try {
      if (data) {
        let new_class = new this.classModel({
          className: data.classNumber,
          maxStudent: data.maxStudents,
          division: data.division,
          classTeacher: data.classTeacher,
        });

        const saveData = await new_class.save();
       
        
        if (saveData) {
          await this.teacherModel.findByIdAndUpdate(
            { _id: data.classTeacher },
            { $set: { is_classTeacher: true , class:saveData._id} },
          );
          return { success: true };
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async fetchClasses() {
    try {
      const classData = await this.classModel
        .find()
        .sort({ className: 1 })
        .populate('classTeacher')
        .exec();
      return classData;
    } catch (error) {
      console.log(error.message);
    }
  }

  async fetchdivisionAprovde(classNum: string) {
    try {
      const cDivision = await this.classModel.find({ className: classNum });
      let divisions = cDivision.map((classObj) => {
        return { division: classObj.division, classId: classObj._id };
      });
      return divisions;
    } catch (error) {
      console.log(error.message);
    }
  }

  async addfee(data: any) {
    try {
      if (data) {
        const saveData = new this.feeStructure({
          term1: { amount: data.term1 },
          term2: { amount: data.term2 },
          term3: { amount: data.term3 },
        });

        const UpdateFee = await saveData.save();
        if (UpdateFee) {
          return {
            success: true,
          };
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async fetchFee() {
    try {
      const feeData = await this.feeStructure.find();
      if (feeData) {
        return feeData;
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async updateFee(id: any, data: any) {
    try {
      const updateData = await this.feeStructure.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            'term1.amount': data.term1,
            'term2.amount': data.term2,
            'term3.amount': data.term3,
          },
        },
        { new: true },
      );

      console.log(updateData);

      if (updateData) {
        return { success: true };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async fetchClassData(id: any) {
    try {
      const classData = await this.classModel
        .findById({ _id: id })
        .populate('classTeacher');
      if (classData) {
        return classData;
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async updataClassData(id: any, formData: any) {
    try {
      const update = await this.classModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            maxStudent: formData.maxStudents,
            classTeacher: formData.classTeacher,
          },
        },
      );
      if (update) {
        await this.teacherModel.findByIdAndUpdate(
          { _id: formData.classTeacher },
          { $set: { is_classTeacher: true } },
        );
        return { success: true };
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteTeacher(id: any) {
    try {
      const deleteTeacher = await this.teacherModel.findByIdAndUpdate(
        { _id: id },
        { $set: { is_delete: true } },
      );
      if (deleteTeacher) {
        return { success: true };
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async fetchStudentFee() {
    try {
      const studentFeeData = await this.studentFee.find().populate({
        path: 'student',
        populate: { path: 'class', model: 'classes' },
      });
      if (studentFeeData) {
        return studentFeeData;
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async addSubject(data: any) {
    try {
      if (data) {
        const checkName = await this.subjectModel.findOne({
          subjectName: {
            $regex: new RegExp('^' + data.subjectName + '$', 'i'),
          },
        });
        if (checkName) {
          return {
            alreadyExist: true,
          };
        } else {
          const saveData = new this.subjectModel({
            subjectName: data.subjectName,
          });
          await saveData.save();
          return { success: true };
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async fetchSubject() {
    try {
      const subjectData = await this.subjectModel.find();
      if (subjectData) {
        return subjectData;
      }
    } catch (error) {
      console.log(error.message);
    }
  }
}
