import { Filter, ObjectId, WithId } from "mongodb";
import { HttpStatus } from "../../core/types/http-statuses";
import { User } from "../types/user.types";
import { UserQueryInput } from "../dto/user-query.input.dto";
import { userCollection } from "../../db/collections";

export const usersQueryRepository = {
  async getAll(queryDto: UserQueryInput) {
    const filters: Filter<User> = {};
    const skip = (queryDto.pageNumber - 1) * queryDto.pageSize;
    const filterFields = {
      email: queryDto.searchUserEmailTerm,
      fullName: queryDto.searchUserFullNameTerm,
    };
    Object.entries(filterFields).forEach(([k, value]) => {
      if (value) {
        if (!filters.$or) {
          filters.$or = [];
        }
        filters.$or.push({
          [k]: { $regex: value, $options: "i" },
        });
      }
    });

    const [items, totalCount] = await Promise.all([
      userCollection
        .find(filters)
        .sort(queryDto.sortBy, queryDto.sortDirection)
        .skip(skip)
        .limit(queryDto.pageSize)
        .toArray(),
      userCollection.countDocuments(filters),
    ]);
    return { items, totalCount };
  },
  async findById(id: string) {
    return await userCollection.findOne({ _id: new ObjectId(id) });
  },
  async findByIdOrFail(id: string): Promise<WithId<User>> {
    const user = await this.findById(id);
    if (!user) {
      throw new Error(`user by id=${id} not found`, {
        cause: {
          status: HttpStatus.NotFound,
          field: "id",
        },
      });
    }
    return user;
  },
};
