import { useContext, useEffect, useState } from "react"
import { Alert, Button, Grid, LinearProgress, Typography } from "@mui/material"
import { getDatabase, ref, set, DatabaseReference } from "firebase/database"
import { getSheetData } from "../helpers/sheets-getter"
import { UserContext } from "../providers/userContext"

const UpdateDatabase = () => {
	const [ loading, setLoading ] = useState(false)
	const [ bdRef, setDbRef] = useState<DatabaseReference>()

	const [ isError, setIsError ] = useState(false)
	const [ isUploaded, setIsUploaded] = useState(false)

	const { user } = useContext(UserContext)

	useEffect(() => {
		if (user?.uid) {
			const database = getDatabase()
			setDbRef(ref(database, user.uid))
		} else {
			// should never happens
			// something went wrong navigate to login, throw popup error
		}
	}, [user])


	const handleUpdateBase = async () => {
		setLoading(true)
		setIsError(false)
		try {
			const data = await getSheetData()
			await set(bdRef!, data).then(_ => {
				console.log("Data upload success!")
			}).catch(err => {
				console.log("Data upload error", err)
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
		setLoading(false)
	}

	if (loading) {
		return <LinearProgress />
	}
	return <Grid container gap={2} direction={"column"}>
		<Typography variant={"h5"}>Обновление базы из таблицы Google Sheet</Typography>
		<Alert severity="info">Обратите внимание, база обновляется из таблицы Google Sheet автоматически при загрузке страницы приложения, но вы всегда можете обновить базу вручную нажав на кнопку ниже.</Alert>
		<Button style={{width: "300px"}} variant={"contained"} disabled={loading} onClick={handleUpdateBase}>Обновить базу</Button>
		{isUploaded && <Typography>Файл загружен, база обновлена</Typography>}
		{isError && <Typography>При чтении файла произошла ошибка, пожалуйста обратитесь в поддержку</Typography>}
	</Grid>
}

export default UpdateDatabase

