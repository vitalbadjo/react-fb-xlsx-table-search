import { Transaction } from "./transaction"
import { TransactionCategory } from "./transactionCategory"

export type Outcomes = Transaction & {
	outcomeCategoryId: TransactionCategory["id"],
}
