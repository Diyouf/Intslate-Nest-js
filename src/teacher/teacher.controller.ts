import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { TeacherService } from './teacher.service'

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
}
