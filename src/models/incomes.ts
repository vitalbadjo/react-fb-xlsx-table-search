import { Transaction } from "./transaction"
import { TransactionCategory } from "./transactionCategory"

export type Incomes = Transaction & {
	incomeCategoryId: TransactionCategory["id"],
}
