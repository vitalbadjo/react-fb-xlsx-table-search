import TransactionForm from "../components/transactions/transaction-form"
import TransactionList from "../components/transactions/transaction-list"
import CategoryForm from "../components/categories/category-form"
import CategoryList from "../components/categories/category-list"
import CurrencyList from "../components/currencies/currency-list"
import CurrencyForm from "../components/currencies/currency-form"

export default function Dashboard() {
	return <>
		<TransactionList type="outcomes" />
		<TransactionList type="incomes" />
		<TransactionForm type="outcome"/>
		<CategoryList type="outcomes" />
		<CategoryForm type="outcomeCategories" />
		<CurrencyList/>
		<CurrencyForm/>
	</>
}
