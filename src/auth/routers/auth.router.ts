import { Router } from "express";
import { inputResultValidationErrors } from "../../core/middlewares/validation/input-result.validation";
import {
  validationSchemaAuthLoginInputBody,
  validationSchemaRegistrationConfirmationAuthInputBody,
  validationSchemaRegistrationEmailResendingAuthInputBody,
} from "../validation/auth-input-body.validation";
import { loginAuth } from "../handlers/login-auth";
import { getMeAuth } from "../handlers/me-auth";
import { AUTH_ROUTE } from "../../core/constants/auth-router.path";
import { checkAccessJWT } from "../../core/middlewares/auth/jwt.auth";
import { nodemailerService } from "../../core/application/nodemailer.service";
import { registrationAuth } from "../handlers/registration-auth";
import {
  validationSchemaUserInputBody,
  validationSchemaUserRegistrationInputBody,
} from "../../users/validation/user-input-body.validation";
import { registrationConfirmationAuth } from "../handlers/registration-confirmation-auth";
import { registrationEmailResendingAuth } from "../handlers/registration-email-resending-auth";
import { logoutAuth } from "../handlers/logout-auth";
import { refreshAuth } from "../handlers/refresh-auth";

nodemailerService.createTransport();

export const authRouter = Router({});

authRouter.get(
  AUTH_ROUTE.ME,
  checkAccessJWT,
  inputResultValidationErrors,
  getMeAuth,
);

authRouter.post(
  AUTH_ROUTE.LOGIN,
  validationSchemaAuthLoginInputBody,
  inputResultValidationErrors,
  loginAuth,
);
authRouter.post(
  AUTH_ROUTE.LOGOUT,
  checkAccessJWT,
  inputResultValidationErrors,
  logoutAuth,
);
authRouter.post(AUTH_ROUTE.REFRESH, refreshAuth);
authRouter.post(
  AUTH_ROUTE.REGISTER,
  validationSchemaUserRegistrationInputBody,
  validationSchemaUserInputBody,
  inputResultValidationErrors,
  registrationAuth,
);
authRouter.post(
  AUTH_ROUTE.REGISTER_CONFIRMATION,
  validationSchemaRegistrationConfirmationAuthInputBody,
  inputResultValidationErrors,
  registrationConfirmationAuth,
);
authRouter.post(
  AUTH_ROUTE.REGISTER_EMAIL_RESENDING,
  validationSchemaRegistrationEmailResendingAuthInputBody,
  inputResultValidationErrors,
  registrationEmailResendingAuth,
);
