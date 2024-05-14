export interface JwtPayload {
  id: number;
  email: string;
  password: string;
  username: string;
  isAdmin: boolean;
  isCompany: boolean;
}
