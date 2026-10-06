import { UserInputDto } from "../dto/user.input.dto";
import { User } from "../types/user.types";

export function mapUserInputToDTO(
  dto: Omit<UserInputDto, "login" | "password">,
): Omit<User, "createdAt" | "passwordHash" | "login"> {
  return {
    firstName: dto.firstName,
    lastName: dto.lastName,
    middleName: dto.middleName,
    fullName: `${dto.lastName} ${dto.firstName} ${dto.middleName ?? ""}`,
    phoneNumber: dto.phoneNumber,
    email: dto.email,
  };
}
