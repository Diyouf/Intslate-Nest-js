export interface leaveFormData {
    noofday?:number 
    startDate ?:Date 
    endDate ?:Date
    reason?:string 
}

export interface resetPass {
    currentPass?:string 
    newPass?:string 
    confirmPass?:string 
}