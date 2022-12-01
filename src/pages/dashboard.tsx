import { getDatabase, ref, onValue } from "firebase/database"
import { useEffect, useState } from "react"
import TransactionForm from "../components/transaction-form"

export default function Dashboard() {
	const database = getDatabase()
	const [data, setData] = useState("")
	const starCountRef = ref(database, 'currencies/')

	useEffect(() => {
		onValue(starCountRef, (snapshot) => {
			const data = snapshot.val()
			console.log(data)
			setData(JSON.stringify(data))
		});
	}, [])

	return <>
		Dash {data}
		<TransactionForm type="outcome"/>
	</>
}
