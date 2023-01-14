import React, { PropsWithChildren, useEffect, useState } from "react"
import { getDatabase, ref, onValue, set } from "firebase/database"
import { UserContext } from "./userContext"
import { realtimeDatabasePaths } from "../models/realtime-database-paths"
import { getAuth, Unsubscribe } from "firebase/auth"
import { ObscuredFBUser } from "../models/user"
import { UserData } from "../models/user-data";
import { getSheetData } from "../helpers/sheets-getter"

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
				if (uid) {
					setLoading(true)
					const database = getDatabase()
					const dbRef = ref(database, uid)
					getSheetData().then(data => {
						set(dbRef!, data).then(_ => {
							setLoading(false)
							console.log("Data updated successfully!")
						}).catch(err => {
							setLoading(false)
							console.log("Data upload error", err)
						})
					})
				}
			} else {
				setUser(firebaseUser)
			}
		})

		return unsubscribe;
		/* eslint-disable react-hooks/exhaustive-deps */
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
