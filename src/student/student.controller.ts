import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { StudentService } from './student.service';
import { leaveFormData, resetPass } from './student.interfaces';
import { teacherDocument } from '../model/teacher.model';
import { homeWorkDocument } from '../model/homeWork.model';

@Controller('student')
export class StudentController {

    constructor(private studentService: StudentService) { }

    @Post('register')
    async registerStudent(@Body() data: any): Promise<any> {
        return await this.studentService.registerStudent(data);
    }

    @Post('login')
    async validateLogin(@Body() data: any): Promise<any> {
        return await this.studentService.validateLogin(data)
    }

    @Get('fetchStudentProfile')
    async fetchStudentData(@Query('id') id:string ): Promise<any> {
        return await this.studentService.studentProfile(id)
    }

    @Get('fetchfeesStructure')
    async getFeesStructure(): Promise<any> {
        return await this.studentService.feesStructure()
    }

    @Get('fetchPaidFees')
    async getPaidStudent(@Query('id') id:string ): Promise<any> {
        return await this.studentService.paidStudent(id)
    }

    @Post('hitPayment')
    async hitPayment(@Query('studentId') id :string,@Body() data : any): Promise<any>{
        return await this.studentService.paymentUpdates(id,data)
    }

    @Get('fetchHomeWorks')
    async fetchHomeWorks(@Query('id') id :string): Promise<homeWorkDocument[]>{
        return await this.studentService.fetchHomeWorks(id)
    }

    @Post('leaveApplication')
    async leaveRequest(@Query('id') id : string,@Body() data : leaveFormData):Promise<{success:boolean}>{
        return await this.studentService.leaveReq(id,data)
    }

    @Get('fetchAttendance')
    async fetchAttendance(@Query('id') id :string):Promise<any>{
        return await this.studentService.fetchAttendance(id)
    }

    @Get('fetchTeacher')
    async fetchTeacher():Promise<teacherDocument[]>{
        return await this.studentService.fetchTeacher()
    }

    @Post('setConnection')
    async setConnection(@Body() data:{teacherId:string,studentId:string}):Promise<any>{        
        return await this.studentService.setConnection(data)
    }

    @Get('loadMesssages')
    async loadMessage(@Query('id') id:string){
        return await this.studentService.loadallMessage(id)
    }

    @Post('resetPassword')
    async resetPassword(@Query('id') id:string ,@Body() data : resetPass):Promise<any>{
        return await this.studentService.resetPassword(id,data)
    }
}
