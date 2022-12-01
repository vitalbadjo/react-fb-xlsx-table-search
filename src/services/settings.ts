import { Database, get, ref, remove, update, push, set, child } from "firebase/database"
import { checkSnapshotExist } from "./utils"
import { TransactionCategory } from "../models/transactionCategory"
import { realtimeDatabasePaths } from "../models/realtime-database-paths"

const settingsService = (dbRef: Database, uid: string) => {
	return {
		currencies: {},
		categories(type: "incomeCategories" | "outcomeCategories") {
			const categoriesRef = ref(dbRef, `${realtimeDatabasePaths.user.settingsPath(uid)}${type}`)
			return {
				async getAll() {
					const snapshot = await get(categoriesRef)
					return checkSnapshotExist(snapshot) as TransactionCategory
				},
				async create(newData: Omit<TransactionCategory, "id"> ) {
					const newItemRef = push(categoriesRef, newData)
					await set(newItemRef, {...newData, id: newItemRef.key})
				},
				async update(categoryId: string, newData: TransactionCategory) {
					const categoryRef = child(categoriesRef, categoryId)
					update(categoryRef, newData).then(() => {
						console.log("Category updated")
						// todo show popup
					}).catch(error => console.log)
				},
				async delete(categoryId: string) {
					const categoryRef = child(categoriesRef, categoryId)
					remove(categoryRef).then(() => {
						console.log("Category deleted")
						// todo show popup/snack/notifier
					}).catch(console.log)
				},
			}
		},
		incomeCategories: {},
		outcomeCategories: {},
		language: {}
	}

}

export default settingsService
