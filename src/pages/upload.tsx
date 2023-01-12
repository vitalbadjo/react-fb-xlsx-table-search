import { useEffect, useState } from "react"
import { Grid, LinearProgress, TextField, Typography } from "@mui/material"
import * as XLSX from "xlsx"
import { Xls2jsonHelprer } from "../helpers/xls2json"
import { getDatabase, ref, set, DatabaseReference } from "firebase/database"
import { getAuth } from "firebase/auth"

const UploadXlsx = () => {
	const [ loading, setLoading ] = useState(false)
	const [ bdRef, setDbRef] = useState<DatabaseReference>()

	const [ isError, setIsError ] = useState(false)
	const [ isUploaded, setIsUploaded] = useState(false)

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
		setIsError(false)
		const file = e![0]
		const reader = new FileReader()
		reader.onload = async event => {
			try {
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
				setIsUploaded(true)
				setTimeout(() => {
					setIsUploaded(false)
				}, 5000)
			} catch (e) {
				console.log("Error", e)
				setIsError(true)
				setTimeout(() => {
					setIsError(false)
				}, 15000)
			}
		}
		await reader.readAsBinaryString(file)
		setLoading(false)
	}

	if (loading) {
		return <LinearProgress />
	}
	return <Grid container gap={2} direction={"column"}>
		<Typography>Загрузка файла</Typography>
		<TextField
			inputProps={{accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"}}
			type={"file"}
	// @ts-ignore
			onChange={e => handleChangeFile(e.target.files)}
		/>
		{isUploaded && <Typography>Файл загружен, база обновлена</Typography>}
		{isError && <Typography>При чтении файла произошла ошибка, пожалуйста обратитесь в поддержку</Typography>}
	</Grid>
}

export default UploadXlsx

