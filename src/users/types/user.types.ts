export type User = {
  login: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  fullName: string;
  phoneNumber: string;
  email: string;
  createdAt: Date;
};
