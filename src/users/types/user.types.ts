export type UserDto = {
  firstName: string;
  lastName: string;
  middleName: string | null;
  fullName: string;
  phoneNumber: string;
  email: string;
};
export type User = UserDto & {
  login: string;
  passwordHash: string;
  createdAt: Date;
  emailConfirmationCode: string | null;
  emailConfirmationExpirationDate: Date | null;
  emailConfirmationIsConfirmed: boolean;
};
