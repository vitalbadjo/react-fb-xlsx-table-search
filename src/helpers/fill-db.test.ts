import { initializeApp } from "firebase/app"
import { config } from "../config/config"
import { getDatabase, ref, set } from "firebase/database"
import { realtimeDatabasePaths } from "../models/realtime-database-paths"
import { UserData } from "../models/user-data"

initializeApp(config.firebase)
const db = getDatabase()
const dbRef = ref(db, realtimeDatabasePaths.defaultPath("WWyyWsKPk1bbmBIRYEGy8eEvCk43"))

test("init db", async () => {
	await set(dbRef, settings)
	expect("").toBeFalsy()
})

export { }

const settings: UserData = {
	parts: {
		part1: {
			id: "part1",
			name: "Test part",
			amount: "1"
		}
	},
	things: {
		thing1: {
			id: "thing1",
			name: "Test thing",
			amount: "1",
			size: "",
			details: "",
			parts: {}
		}
	},
}

