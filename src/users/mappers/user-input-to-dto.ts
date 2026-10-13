import { UserInputDto } from "../dto/user.input.dto";
import { UserDto } from "../types/user.types";

export function mapUserInputToDTO(
  dto: Omit<UserInputDto, "login" | "password">,
): UserDto {
  return {
    firstName: dto.firstName,
    lastName: dto.lastName,
    middleName: dto.middleName,
    fullName: `${dto.lastName} ${dto.firstName} ${dto.middleName ?? ""}`,
    phoneNumber: dto.phoneNumber,
    email: dto.email,
  };
}
