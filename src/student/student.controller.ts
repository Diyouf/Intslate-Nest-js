import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { StudentService } from './student.service';
import { leaveFormData } from './student.interfaces';
import { async } from 'rxjs';

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
    async fetchHomeWorks(@Query('id') id :string): Promise<any>{
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

}
