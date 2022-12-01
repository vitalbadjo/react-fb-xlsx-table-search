import { UserModel } from "../models/user"
import { initializeApp } from "firebase/app"
import { config } from "../config/config"
import { getDatabase, ref, set } from "firebase/database"
import { realtimeDatabasePaths } from "../models/realtime-database-paths"
import { UserSettings } from "../models/user-settings"

initializeApp(config.firebase)
const db = getDatabase()
const dbRef = ref(db, realtimeDatabasePaths.defaultSettingsPath)

test("init db", async () => {
	await set(dbRef, settings)
	expect("").toBeFalsy()
})

export {}

const settings: UserSettings = {
	currencies: {
		usd: {
			id: "usd",
			displayName: "USD",
			visible: true,
			isFiat: true,
			rate: ""
		},
		eur: {
			id: "eur",
			displayName: "EUR",
			visible: true,
			isFiat: true,
			rate: ""
		}
	},
	incomeCategories: {
		investment: {
			id: "investment",
			displayName: "Investment",
			icon: ""
		}
	},
	outcomeCategories: {
		investment: {
			id: "investment",
			displayName: "Investment",
			icon: ""
		}
	},
	ratesSources: {
		binance: {
			id: "binance",
			icon: "",
			apiUrl: "",
			displayName: "Binance",
			type: "crypto"
		}
	},
	language: "en",
	defaultCurrency: "usd",
	pinCode: {
		isDefined: false,
		value: ""
	}
}

const defaultSettingsData = (uid: string, email:string, name: string): UserModel => {
	return {
		id: uid,
		uid,
		email,
		name,
		displayName: name,
		phone: "",
		avatar: "",
		settings
	}
}
