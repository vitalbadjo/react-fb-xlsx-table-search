import React from "react";
import { ObscuredFBUser } from "../models/user"
import { UserData } from "../models/user-data";

export const UserContext = React.createContext<{ data: UserData, user: ObscuredFBUser | null }>({ user: null, data: { parts: {}, things: {} } });
