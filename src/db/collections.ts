import { Collection, Db } from "mongodb";
import { Driver } from "../drivers/types/driver.types";
import { DRIVER_ROUTE } from "../core/constants/drivers-router.path";
import { Ride } from "../rides/types/rides.types";
import { RIDE_ROUTE } from "../core/constants/rides-router.path";
import { User } from "../users/types/user.types";
import { USER_ROUTE } from "../core/constants/users-router.path";
import { RefreshToken } from "../refreshTokens/types/refresh-token.types";

// Коллекция инициализируется один раз в initCollections() после подключения к БД.
// До этого момента она undefined, поэтому обращаться к ней можно только после runDB().
export let driverCollection: Collection<Driver>;
export let rideCollection: Collection<Ride>;
export let userCollection: Collection<User>;
export let refreshTokenBlackListCollection: Collection<RefreshToken>;

// Создаём объект коллекции из подключённой базы.
export function initCollections(db: Db): void {
  driverCollection = db.collection<Driver>(DRIVER_ROUTE.DRIVERS);
  rideCollection = db.collection<Ride>(RIDE_ROUTE.RIDES);
  userCollection = db.collection<User>(USER_ROUTE.USERS);
  refreshTokenBlackListCollection =
    db.collection<RefreshToken>("/refresh_tokens");
}
