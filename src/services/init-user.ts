import { getDatabase, ref, get, child, set } from "firebase/database"
import { getAuth } from "firebase/auth"
import { realtimeDatabasePaths } from "../models/realtime-database-paths"

const initUser = async (isUpdate: boolean = false) => {
	const database = getDatabase()
	const dbRef = ref(database)
	const auth = getAuth()
	let uid = auth.currentUser?.uid
	if (uid) {
		get(child(dbRef, realtimeDatabasePaths.user.settingsPath(uid))).then(snapshot => {
			if (!snapshot.exists()) {
				console.log("No user default data available")
				getDefaults().then(data => {
					console.log("Received default data:", data)
					if (data) {
						//todo write to some state or return
						setUserDefaults(uid!, data).then(response => {
						}).catch(error => {
							console.log("Error setting default user data, please try again later")
						})
					}
					//else do something
				}).catch(error => console.log)
			}
		}).catch(error => {
			console.log("initUser error")
		})
		// may be check for initialisation
	} else {
		// should never happens
		// something went wrong navigate to login, throw popup error
	}
}

const setUserDefaults = async (uid: string, data: {}) => {
	const database = getDatabase()
	const dbRef = ref(database, realtimeDatabasePaths.user.settingsPath(uid))
	return set(dbRef, data)
}

const getDefaults = async () => {
	const database = getDatabase()
	const dbRef = ref(database)
	return get(child(dbRef, realtimeDatabasePaths.defaultSettingsPath)).then((snapshot) => {
		if (snapshot.exists()) {
			console.log(snapshot.val())
			return snapshot.val()
		} else {
			console.log("No data available")
			return null
		}
	}).catch((error) => {
		console.error(error)
	});
}

export default initUser
