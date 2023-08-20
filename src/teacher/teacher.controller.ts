import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { TeacherService } from './teacher.service'
import { leaveReqDocument } from '../model/leaveReq.model';
import { AddAttendance } from './teacher.interface';
import { attendanceDocument } from '../model/attendance.model';

@Controller('teacher')
export class TeacherController {
    constructor(private service: TeacherService) { }

    @Post('teacherRegister')
    async registerTeacher(@Body() data: any): Promise<any> {
        return await this.service.registerTeacher(data)
    }

    @Post('teacherLogin')
    async validateLogin(@Body() data: any): Promise<any> {
        return await this.service.validateLogin(data)
    }

    @Get('loadTeacherProfile')
    async loadTeacherProfile(@Query('id') id :any): Promise<any> {
        return await this.service.loadTeacherProfile(id)
    }

    @Get('fetchStudents')
    async fetchStudent (@Query('id') id :string):Promise<any>{
        return await this.service.fetchStudent(id)
    }

    @Post('addHomeWork')
    async addHomeWork (@Query('id') id:string,@Body() data : any):Promise<any>{
        return await this.service.addHomeWork(id,data)
    }

    @Get('fetchHomework')
    async fetchHomeWork(@Query('id') id : string):Promise<any>{
        return await this.service.fetchHomeWork(id)
    }

    @Get('loadLeaveReq')
    async fetchLeaveReq(@Query('id') id : string):Promise<leaveReqDocument[]>{
        return await this.service.fetchLeaveReq(id)
    }

    @Get('approveReq')
    async approveReq(@Query('id') id : string):Promise<{success:boolean}>{
        return await this.service.approveReq(id)
    }

    @Get('rejectReq')
    async rejectReq(@Query('id') id : string):Promise<{success:boolean}>{
        return await this.service.rejectReq(id)
    }

    @Post('addAttendance')
    async addAttendance(@Query('id') id : string,@Body() data:AddAttendance):Promise<{success?:boolean,alreadySubmitted?:string}>{
        return await this.service.addAttendance(id,data);
    }

    @Get('loadAttendance')
    async fetchAttendance(
      @Query('id') id: string,
     
    ): Promise<any> {
      return await this.service.fetchAttendance(id);
    }
    

    @Get('getConnection')
    async fetchConnections(@Query('id') id:string):Promise<any>{
        return await this.service.loadConnection(id)
    }

    @Get('loadAllChats')
    async loadAllChats(@Query('id') id:string){
        return await this.service.loadAllChats(id)
    }

}
