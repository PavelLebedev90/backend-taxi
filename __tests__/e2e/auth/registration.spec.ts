import { HttpStatus } from "../../../src/core/types/http-statuses";
import { setupDbLifecycle } from "../../utils/setup-db";
import { collectCorrectUser } from "../../utils/users/collect-correct.user";
import { registrationAuth } from "../../utils/auth/registration.auth";
import { registrationConfirmationAuth } from "../../utils/auth/registration-confirmation.auth";
import { registrationEmailResendingAuth } from "../../utils/auth/registration-email-resending.auth";
import { userCollection } from "../../../src/db/collections";
import { nodemailerService } from "../../../src/core/application/nodemailer.service";

jest.mock("../../../src/core/application/nodemailer.service", () => ({
  nodemailerService: {
    createTransport: jest.fn(),
    verifyMailer: jest.fn(),
    sendWelcome: jest.fn().mockResolvedValue(undefined),
  },
}));

const mockedSendWelcome = nodemailerService.sendWelcome as jest.Mock;

describe("Auth registration API", () => {
  setupDbLifecycle();

  beforeEach(() => {
    mockedSendWelcome.mockClear();
  });

  describe("POST /api/auth/registration", () => {
    it("should register a new user", async () => {
      await registrationAuth({
        data: {
          ...collectCorrectUser().data,
          attributes: {
            ...collectCorrectUser().data.attributes,
            login: "registerMe",
            email: "registerMe@example.com",
          },
        },
      }).expect(HttpStatus.Created);

      const createdUser = await userCollection.findOne({
        login: "registerMe",
      });
      expect(createdUser).not.toBeNull();
      expect(createdUser?.emailConfirmationIsConfirmed).toBe(false);
      expect(createdUser?.emailConfirmationCode).toEqual(expect.any(String));
      expect(createdUser?.emailConfirmationExpirationDate).toBeInstanceOf(Date);

      expect(mockedSendWelcome).toHaveBeenCalledTimes(1);
      expect(mockedSendWelcome).toHaveBeenCalledWith(
        "registerme@example.com",
        expect.any(String),
        createdUser?.emailConfirmationCode,
      );
    });

    it("should not call the mail service when registration fails due to a duplicate login or email", async () => {
      await registrationAuth({
        data: {
          ...collectCorrectUser().data,
          attributes: {
            ...collectCorrectUser().data.attributes,
            login: "duplicateUser",
            email: "duplicateUser@example.com",
          },
        },
      }).expect(HttpStatus.Created);
      mockedSendWelcome.mockClear();

      const response = await registrationAuth({
        data: {
          ...collectCorrectUser().data,
          attributes: {
            ...collectCorrectUser().data.attributes,
            login: "duplicateUser",
            email: "duplicateUser@example.com",
          },
        },
      }).expect(HttpStatus.BadRequest);

      expect(response.body.errorMessages).toHaveLength(1);
      expect(mockedSendWelcome).not.toHaveBeenCalled();
    });

    it("should not call the mail service when registration fails validation", async () => {
      const response = await registrationAuth({
        data: {
          ...collectCorrectUser().data,
          attributes: {
            ...collectCorrectUser().data.attributes,
            login: "shortLoginUser",
            email: "shortLoginUser@example.com",
            firstName: "A",
          },
        },
      }).expect(HttpStatus.BadRequest);

      expect(response.body.errorMessages).toHaveLength(1);
      expect(mockedSendWelcome).not.toHaveBeenCalled();
    });
  });

  describe("POST /api/auth/registration-confirmation", () => {
    const registerUser = async (login: string, email: string) => {
      await registrationAuth({
        data: {
          ...collectCorrectUser().data,
          attributes: {
            ...collectCorrectUser().data.attributes,
            login,
            email,
          },
        },
      }).expect(HttpStatus.Created);

      const user = await userCollection.findOne({ login });
      return user!;
    };

    it("should confirm registration with a valid confirmation code", async () => {
      const user = await registerUser("confirmMe", "confirmMe@example.com");
      mockedSendWelcome.mockClear();

      await registrationConfirmationAuth({
        emailConfirmationCode: user.emailConfirmationCode as string,
      }).expect(HttpStatus.NoContent);

      const confirmedUser = await userCollection.findOne({
        login: "confirmMe",
      });
      expect(confirmedUser?.emailConfirmationIsConfirmed).toBe(true);
      expect(confirmedUser?.emailConfirmationCode).toBeNull();
      expect(confirmedUser?.emailConfirmationExpirationDate).toBeNull();

      expect(mockedSendWelcome).not.toHaveBeenCalled();
    });

    it("should not confirm registration with an unknown confirmation code", async () => {
      const response = await registrationConfirmationAuth({
        emailConfirmationCode: "3a2f1b4c-5d6e-7f8g-9h0i-1j2k3l4m5n6o".replace(
          /[g-o]/g,
          "a",
        ),
      }).expect(HttpStatus.NotFound);

      expect(response.body.errorMessages).toHaveLength(1);
    });

    it("should not confirm registration with an already expired confirmation code", async () => {
      const user = await registerUser("expiredCode", "expiredCode@example.com");
      await userCollection.updateOne(
        { login: "expiredCode" },
        {
          $set: {
            emailConfirmationExpirationDate: new Date(Date.now() - 60 * 1000),
          },
        },
      );

      const response = await registrationConfirmationAuth({
        emailConfirmationCode: user.emailConfirmationCode as string,
      }).expect(HttpStatus.BadRequest);

      expect(response.body.errorMessages).toHaveLength(1);
    });

    it("should not confirm registration with an invalid code format", async () => {
      const response = await registrationConfirmationAuth({
        emailConfirmationCode: "not-a-uuid",
      }).expect(HttpStatus.BadRequest);

      expect(response.body.errorMessages).toHaveLength(1);
    });
  });

  describe("POST /api/auth/registration-email-resending", () => {
    const registerUser = async (login: string, email: string) => {
      await registrationAuth({
        data: {
          ...collectCorrectUser().data,
          attributes: {
            ...collectCorrectUser().data.attributes,
            login,
            email,
          },
        },
      }).expect(HttpStatus.Created);

      const user = await userCollection.findOne({ login });
      return user!;
    };

    it("should resend the confirmation email and issue a new code once the previous one expired", async () => {
      const user = await registerUser("resendMe", "resendMe@example.com");
      await userCollection.updateOne(
        { login: "resendMe" },
        {
          $set: {
            emailConfirmationExpirationDate: new Date(Date.now() - 60 * 1000),
          },
        },
      );
      mockedSendWelcome.mockClear();

      await registrationEmailResendingAuth({
        email: "resendMe@example.com",
      }).expect(HttpStatus.NoContent);

      const updatedUser = await userCollection.findOne({ login: "resendMe" });
      expect(updatedUser?.emailConfirmationCode).toEqual(expect.any(String));
      expect(updatedUser?.emailConfirmationCode).not.toEqual(
        user.emailConfirmationCode,
      );
      expect(
        updatedUser?.emailConfirmationExpirationDate?.getTime(),
      ).toBeGreaterThan(Date.now());

      expect(mockedSendWelcome).toHaveBeenCalledTimes(1);
      expect(mockedSendWelcome).toHaveBeenCalledWith(
        "resendme@example.com",
        expect.any(String),
        updatedUser?.emailConfirmationCode,
      );
    });

    it("should not resend the confirmation email when the previous code has not expired yet", async () => {
      await registerUser("notExpiredYet", "notExpiredYet@example.com");
      mockedSendWelcome.mockClear();

      const response = await registrationEmailResendingAuth({
        email: "notExpiredYet@example.com",
      }).expect(HttpStatus.BadRequest);

      expect(response.body.errorMessages).toHaveLength(1);
      expect(mockedSendWelcome).not.toHaveBeenCalled();
    });

    it("should not resend the confirmation email for an unknown email", async () => {
      const response = await registrationEmailResendingAuth({
        email: "ghost@example.com",
      }).expect(HttpStatus.NotFound);

      expect(response.body.errorMessages).toHaveLength(1);
      expect(mockedSendWelcome).not.toHaveBeenCalled();
    });

    it("should not resend the confirmation email for an invalid email format", async () => {
      const response = await registrationEmailResendingAuth({
        email: "not-an-email",
      }).expect(HttpStatus.BadRequest);

      expect(response.body.errorMessages).toHaveLength(1);
      expect(mockedSendWelcome).not.toHaveBeenCalled();
    });
  });
});
