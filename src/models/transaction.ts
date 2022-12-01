export type Transaction = {
	id: string
	amount: string
	currencyId: string
	rate: string //  string || null
	description: string
	date: string // custom or creation date
	creationDate: string
	updateDate: string
	deletionDate: string
}
