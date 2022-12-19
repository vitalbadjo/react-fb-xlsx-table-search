import { useEffect, useState } from "react"
import { LinearProgress, TextField } from "@mui/material"
import * as XLSX from "xlsx"
import { Xls2jsonHelprer } from "../helpers/xls2json"
import { getDatabase, ref, set, DatabaseReference } from "firebase/database"
import { getAuth } from "firebase/auth"

const UploadXlsx = () => {
	const [ loading, setLoading ] = useState(false)
	const [ bdRef, setDbRef] = useState<DatabaseReference>()

	const database = getDatabase()
	const auth = getAuth()
	let uid = auth.currentUser?.uid

	useEffect(() => {
		if (uid) {
			setDbRef(ref(database, uid))
		} else {
			// should never happens
			// something went wrong navigate to login, throw popup error
		}
	}, [uid])


	const handleChangeFile = async (e: FileList | null) => {
		setLoading(true)
		const file = e![0]
		const reader = new FileReader()
		reader.onload = async event => {
			const bstr = event.target!.result
			const workbook = XLSX.read(bstr, {type: "binary"})
			const workSheetName = workbook.SheetNames[0]
			const workSheet = workbook.Sheets[workSheetName]

			const data = Xls2jsonHelprer(workSheet)
			await set(bdRef!, data).then(ev => {
				console.log("set", ev)
			}).catch(err => {
				console.log("upload error", err)
			})
		}
		await reader.readAsBinaryString(file)
		setLoading(false)
	}

	if (loading) {
		return <LinearProgress />
	}
	return <div style={{ height: 800, width: '100%' }}>
		<TextField
			type={"file"}
	// @ts-ignore
			onChange={e => handleChangeFile(e.target.files)}
		/>
		<input type="file" onChange={e => handleChangeFile(e.target.files)}/>
	</div>
}

export default UploadXlsx

