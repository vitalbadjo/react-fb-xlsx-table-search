import { Database, get, ref, remove, update, push, set } from "firebase/database"
import { realtimeDatabasePaths } from "../models/realtime-database-paths"
import { checkSnapshotExist } from "./utils"
import { Transaction } from "../models/transaction"
import { Outcomes } from "../models/outcomes"
import { Incomes } from "../models/incomes"

const transactionsService = (dbRef: Database, uid: string, type: "income" | "outcome") => {
	const transactionsRef = ref(
		dbRef,
		realtimeDatabasePaths.user[
			type === "income" ? "incomesPath":"outcomesPath"
			](uid)
	)
	return {
		async getAll() {
			const snapshot = await get(transactionsRef)
			return checkSnapshotExist(snapshot)
		},
		/**
		 * Not implemented yet
		 */
		getByCriteria() {
		},
		async create<T extends "income" | "outcome">(transactionType: T, newData: T extends "outcome" ? Outcomes : Incomes) {
			const newItemRef = push(transactionsRef, newData)
			await set(newItemRef, {...newData, id: newItemRef.key})
		},
		async delete(transactionId: string) {
			const transactionRef = ref(dbRef, `${realtimeDatabasePaths.user[
				type === "income" ? "incomesPath":"outcomesPath"
				](uid)}/${transactionId}`)
			remove(transactionRef).then(() => {
				console.log("Transaction deleted")
				// todo show popup
			}).catch(console.log)
		},
		update(transactionId: string, newData: Partial<Transaction>) {
			const transactionRef = ref(dbRef, `${realtimeDatabasePaths.user[
				type === "income" ? "incomesPath":"outcomesPath"
				](uid)}/${transactionId}`)
			update(transactionRef, newData).then(() => {
				console.log("Transaction updated")
				// todo show popup
			}).catch(console.log)
		},
	}
}

export default transactionsService
