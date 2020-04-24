export interface User {
  user_uuid: string;
  verified: string;
  email: string;
  username: string;
  password: string;
  created_at: Date;
  deleted_at: Date;
}
