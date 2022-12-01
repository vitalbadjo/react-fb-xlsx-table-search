
export const realtimeDatabasePaths = {
	defaultSettingsPath: 'defaultSettings/',
	user: {
		incomesPath: (uid: string) => `incomes/${uid}/`,
		outcomesPath: (uid: string) => `outcomes/${uid}/`,
		settingsPath: (uid: string) => `settings/${uid}/`,
		statsPath: (uid: string) => `stats/${uid}/`
	},
	userPath: (uid: string) => `users/${uid}`,
	outcomes: (uid: string) => `outcomes/${uid}`,
	incomes: (uid: string) => `incomes/${uid}`,
}
