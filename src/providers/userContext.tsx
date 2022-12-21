import React from "react";
import { ObscuredFBUser } from "../models/user"
import { UserData } from "../models/user-data";

export const UserContext = React.createContext<{
	data: UserData,
	user: ObscuredFBUser | null,
	isDataLoading: boolean,
	isDataEmpty: boolean
}>({
	user: null,
	data: { parts: {}, things: {} },
	isDataLoading: true,
	isDataEmpty: false
});
