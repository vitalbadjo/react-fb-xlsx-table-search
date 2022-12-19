import { getDatabase, ref, get, child } from "firebase/database"
import { getAuth } from "firebase/auth"
import { realtimeDatabasePaths } from "../models/realtime-database-paths"

const initUser = async () => {
	const database = getDatabase()
	const dbRef = ref(database)
	const auth = getAuth()
	let uid = auth.currentUser?.uid
	if (uid) {
		get(child(dbRef, realtimeDatabasePaths.defaultPath(uid))).then(snapshot => {
			if (!snapshot.exists()) {
				return snapshot.val()
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

export default initUser
