export const config = {
	firebase: {
		apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
		appId: process.env.REACT_APP_FIREBASE_APP_ID,
		messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
		projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
		authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
		databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
		storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
		measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
	}
}
