export interface AddAttendance {
    attendance: { studentId: string; attendance: 'present' | 'absent' }[];
  }
  