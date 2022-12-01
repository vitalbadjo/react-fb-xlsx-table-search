import { Currency } from "./currency"
import { TransactionCategory } from "./transactionCategory"
import { RatesSource } from "./rates-source"

export type UserSettings = {
	currencies: Record<string, Currency>
	incomeCategories: Record<string, TransactionCategory>
	outcomeCategories: Record<string, TransactionCategory>
	ratesSources: Record<string, RatesSource>
	language: string
	defaultCurrency: Currency["id"]
	pinCode: {
		isDefined: boolean,
		value: string
	}
}

export const dummySettings: UserSettings = {
	currencies: {},
	incomeCategories: {},
	outcomeCategories: {},
	ratesSources: {},
	language: "en",
	defaultCurrency: "usd",
	pinCode: {
		isDefined: false,
		value: ""
	}
}
