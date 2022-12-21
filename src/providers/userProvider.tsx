import React, { PropsWithChildren, useEffect, useState } from "react"
import { getDatabase, ref, onValue } from "firebase/database";
import { UserContext } from "./userContext"
import { realtimeDatabasePaths } from "../models/realtime-database-paths"
import { getAuth, Unsubscribe } from "firebase/auth"
import { ObscuredFBUser } from "../models/user"
import { UserData } from "../models/user-data";

const initialData = { parts: {}, things: {} }

export const UserProvider: React.FunctionComponent<PropsWithChildren> = ({ children }) => {
	const [user, setUser] = useState<ObscuredFBUser | null>(null);
	const [userSettings, setUserSettings] = useState<UserData>(initialData);
	const [loading, setLoading] = useState(true);
	const [isDataEmpty, setIsDataEmpty] = useState(false);

	useEffect(() => {
		const unsubscribe = getAuth().onAuthStateChanged((firebaseUser) => {
			if (firebaseUser) {
				const { displayName, uid, email, emailVerified, phoneNumber, photoURL } = firebaseUser
				setUser({
					displayName,
					uid,
					emailVerified,
					email,
					phoneNumber,
					photoURL
				});
			} else {
				setUser(firebaseUser)
			}
		})

		return unsubscribe;
	}, []);

	useEffect(() => {
		let unsubscribe: Unsubscribe = () => { }
		if (user?.uid) {
			const db = getDatabase();
			const settingsRef = ref(db, realtimeDatabasePaths.defaultPath(user?.uid!));
			unsubscribe = onValue(settingsRef, (snapshot) => {
				if (snapshot.exists()) {
					setUserSettings(snapshot.val())
					setIsDataEmpty(false)
				} else {
					setIsDataEmpty(true)
				}
				setLoading(false)
			});
		}
		return unsubscribe;
	}, [user]);

	return <UserContext.Provider value={{ data: userSettings, user, isDataLoading: loading, isDataEmpty }}>{children}</UserContext.Provider>;
};
