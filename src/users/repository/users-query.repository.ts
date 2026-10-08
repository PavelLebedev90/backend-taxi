import { Filter, ObjectId } from "mongodb";
import { HttpStatus } from "../../core/types/http-statuses";
import { User } from "../types/user.types";
import { UserQueryInput } from "../dto/user-query.input.dto";
import { userCollection } from "../../db/collections";
import { UserDataView, UserMetaView } from "../types/user-view.types";
import { mapUserDataView, mapUserView } from "../mappers/user-view";
import { mapDataPaginatedView } from "../../core/mappers/data-paginated-view";

export const usersQueryRepository = {
  async getAll(queryDto: UserQueryInput): Promise<UserMetaView> {
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
    const users = items.map(mapUserView);
    return mapDataPaginatedView(users, {
      pageNumber: queryDto.pageNumber,
      pageSize: queryDto.pageSize,
      totalCount,
    });
  },
  async findByIdOrFail(id: string): Promise<UserDataView> {
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw new Error(`user by id=${id} not found`, {
        cause: {
          status: HttpStatus.NotFound,
          field: "id",
        },
      });
    }
    return mapUserDataView(user);
  },
};
