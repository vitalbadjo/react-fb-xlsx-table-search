import {
	Box, Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
} from "@mui/material"
import { ChangeEvent, useContext, useEffect, useState } from "react"
import { UserContext } from "../providers/userContext"
import { TransactionCategory } from "../models/transactionCategory"
import transactionsService from "../services/transactions"
import { getDatabase } from "firebase/database"

export type ITransactionFormProps = {
	type: "income" | "outcome"
}

const TransactionForm: React.FunctionComponent<ITransactionFormProps> = ({type}) => {
	const {settings, user} = useContext(UserContext)
	const [loading, setLoading] = useState(false)
	const [incomesCat, setIncomesCat] = useState<TransactionCategory[]>([])
	const [outcomesCat, setOutcomesCat] = useState<TransactionCategory[]>([])
	const [form, setForm] = useState({category: "", currency: "", desc: "", amount: ""})
	const text = type === "income" ?
		{
			title: "Add income",
			buttonText: "Add income"
		} :
		{
			title: "Add expense",
			buttonText: "Add expense"
		}

	useEffect(() => {
		const { incomeCategories, outcomeCategories } = settings
		setIncomesCat(Object.values(incomeCategories))
		setOutcomesCat(Object.values(outcomeCategories))
	}, [settings])

	const onSave = async () => {
		if (user?.uid) {
			setLoading(true)
			await transactionsService(getDatabase(), user?.uid, type)
				.create(type,{
					id: "",
					amount: form.amount,
					currencyId: form.currency,
					rate: "",
					description: "Test",
					date: new Date().toISOString(),
					creationDate: "",
					updateDate: "",
					deletionDate: "",
					...type === "income" ? {incomeCategoryId: form.category} : { outcomeCategoryId: form.category}
				})
			setLoading(false)
		}

	}

	const handleChange = (event: SelectChangeEvent | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: keyof typeof form ) => {
		setForm(prevState => ({
			...prevState,
			[key]: event.target.value
		}))
	};
	return <Box
		component="form"
		sx={{
			'& .MuiTextField-root': { m: 1, width: '25ch' },
		}}
		noValidate
		autoComplete="off"
	>
		<div>
			<TextField
				error={false}
				id="outlined-error"
				label="Amount"
				placeholder="Please enter amount"
				helperText=""
				value={form.amount}
				onChange={e => handleChange(e, "amount")}
				required
			/>
			<TextField
				error={false}
				id="outlined-error-helper-text"
				label="Description"
				helperText=""
				value={form.desc}
				onChange={e => handleChange(e, "desc")}
			/>
			<FormControl sx={{ m: 1, minWidth: 180 }}>
				<InputLabel id="currency-select-helper-label">Currency</InputLabel>
				<Select
					labelId="currency-select-helper-label"
					id="currency-select-helper"
					value={form.currency}
					label="Currency"
					onChange={e => handleChange(e, "currency")}
				>
					{Object.values(settings.currencies).map(val => {
						return <MenuItem key={val.displayName} value={val.id}>{val.displayName}</MenuItem>
					})}
				</Select>
				{/*<FormHelperText>With label + helper text</FormHelperText>*/}
			</FormControl>
			<FormControl sx={{ m: 1, minWidth: 180 }}>
				<InputLabel id="category-select-helper-label">Category</InputLabel>
				<Select
					labelId="category-select-helper-label"
					id="category-select-helper"
					value={form.category}
					label="Category"
					onChange={e => handleChange(e, "category")}
				>
					<MenuItem value="">
						<em>None</em>
					</MenuItem>
					{(type === "income" ? incomesCat : outcomesCat).map(val => {
						return <MenuItem key={val.displayName} value={val.id}>{val.displayName}</MenuItem>
					})}
				</Select>
				{/*<FormHelperText>With label + helper text</FormHelperText>*/}
			</FormControl>
		</div>
		<FormControl sx={{ m: 1, minWidth: 120 }}>
			<Button disabled={loading} onClick={() => onSave()} variant="contained">{text.buttonText}</Button>
		</FormControl>
	</Box>
}

export default TransactionForm
