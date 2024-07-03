import { Session, User } from "next-auth"
export interface ExtendedUser extends User {
    // Add additional properties here
    username: string;
    useremail: string;
    img: string;
    role: string;
    id: string;
  }
  export interface ExtendedSession extends Session {
    user_id: any;
    user_name: string;
    user_email: string;
    user_img: string;
    user_role: string;
  }