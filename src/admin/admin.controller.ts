import { Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AdminService } from './admin.service';
import { adminSchema } from '../model/admin.model'
import { teacherSchema } from '../model/teacher.model'
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('admin')
export class AdminController {

  constructor(private adminService: AdminService) { }

  @Post('login')
  async login(@Body() loginData: adminSchema): Promise<any> {
    return await this.adminService.adminLogin(loginData)
  }

  @Post('addTeacher')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const name = file.originalname.split('.')[0];
        const fileExtension = file.originalname.split('.')[1];
        const newFileName = name.split(" ").join("_") + "_" + Date.now() + "." + fileExtension;
        cb(null, newFileName);
      }
    })
  }))

  async addTeacher(@UploadedFile() file: Express.Multer.File, @Body() formdata: teacherSchema): Promise<any> {
    return await this.adminService.addteacher(formdata, file)
  }

  @Get('getTeacher')
  async fetchTeacherData(): Promise<any> {
    return await this.adminService.fetchTeachers();
  }



  @Post('admissionRequest')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './studentImage',
      filename: (req, file, cb) => {
        const name = file.originalname.split('.')[0];
        const fileExtension = file.originalname.split('.')[1];
        const newFileName = name.split(" ").join("_") + "_" + Date.now() + "." + fileExtension;
        cb(null, newFileName);
      }
    })
  }))

  async admissionRequest(@UploadedFile() file: Express.Multer.File, @Body() formdata: any): Promise<any> {
    return await this.adminService.admissionRequest(formdata, file)
  }

  @Get('getAdmissionData')
  async getAdmission(): Promise<any> {
    return await this.adminService.getAdmmissionData()
  }

  @Post('approveAdmission')
  async approveAdmission(@Query('id') id: any , @Body() formData:any): Promise<any> {
    return await this.adminService.approveAdmission(id,formData)
  }


  @Get('rejectAdmission')
  async rejectAdmission(@Query('id') id: any): Promise<any> {    
    return await this.adminService.reject(id)
  }

  @Get('fetchStudent')
  async fetchStdent(): Promise<any> {
    return await this.adminService.fetchStudent()
  }

  @Get('fetchDivision')
  async fetchDivision(@Query('classNum') classNum: any): Promise<any> {
    return await this.adminService.fetchDivision(classNum)
  }

  @Post('addClass')
  async addClass (@Body() bodyData:any):Promise<any>{
    return await this.adminService.addClass(bodyData)
  }

  @Get('fetchClasses')
  async fetchClasses():Promise<any>{
    return await this.adminService.fetchClasses()
  }

  @Get('fetchDivisionforApprove')
  async fetchDivisionfor(@Query('class') classNum:any ):Promise<any>{ 
    return await this.adminService.fetchdivisionAprovde(classNum)
  }

  @Post('addfee')
  async addFee(@Body() data:any):Promise<any>{
    return await this.adminService.addfee(data)
  }

  @Get('fetchFeeStructure')
  async fetchFee():Promise<any>{
    return await this.adminService.fetchFee()
  }

  @Post('editFeeStructue')
  async editFeeStructure(@Query('id') id:any, @Body() formData:any):Promise<any>{
    return await this.adminService.updateFee(id,formData)
  }

  @Get('fetchClassData')
  async fetchClassData(@Query('id') id:any):Promise<any>{
    return await this.adminService.fetchClassData(id)
  }

  @Post('updateClassData')
  async updateClassData(@Query('id') id :any,@Body() formData:any):Promise<any>{
    return await this.adminService.updataClassData(id,formData)
  }

  @Get('deleteTeacher')
  async deleteTeacher(@Query("id") id:string):Promise<any>{
    return await this.adminService.deleteTeacher(id)
  }

  @Get('studentFee')
  async studentFee():Promise<any>{
    return await this.adminService.fetchStudentFee()
  }

  @Post('addSubject')
  async addSubject(@Body() data:any):Promise<any>{
    return await this.adminService.addSubject(data)
  }

  @Get('fetchSubject')
  async fetchSubject():Promise<any>{
    return await this.adminService.fetchSubject()
  }



}


