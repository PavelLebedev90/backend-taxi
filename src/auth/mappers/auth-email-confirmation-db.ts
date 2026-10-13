import { randomUUID } from "node:crypto";

export const mapAuthEmailConfirmationToDb = () => {
  return {
    emailConfirmationIsConfirmed: false,
    emailConfirmationExpirationDate: new Date(
      new Date().getTime() + 10 * 60 * 1000,
    ), // текущая дата + 10мин
    emailConfirmationCode: randomUUID(),
  };
};
