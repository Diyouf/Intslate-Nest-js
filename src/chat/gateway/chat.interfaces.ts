interface Recipient {
    _id: string;
    teacherId: number;
    name: string;
    gender: 'male' | 'female'; // Assuming gender can be either 'male' or 'female'
    email: string;
    phone: number;
    subject: string;
    address: string;
    image: string;
    is_classTeacher: boolean;
    is_delete: boolean;
    __v: number;
    class: string;
    password: string;
  }
  
  export interface Message {
    senderName: string;
    message: string;
    connectionId: string;
    to: Recipient;
  }
  