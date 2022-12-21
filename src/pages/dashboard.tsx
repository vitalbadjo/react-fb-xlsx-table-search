import { useContext, useEffect, useState } from "react"
import { UserContext } from "../providers/userContext"
import {
	Autocomplete, Box,
	Button,
	Divider, FormControlLabel, Grid, IconButton,
	LinearProgress, Paper,
	Switch,
	TextField, Typography,
} from "@mui/material"
import { Check, Close } from "@mui/icons-material"
import { Thing } from "../models/thing"
import { xor, intersection } from "lodash"
import { DataGrid } from "@mui/x-data-grid"
import { thingsTableColumns } from "./things"

export default function Dashboard() {
	const { data, isDataEmpty, isDataLoading } = useContext(UserContext)
	const { parts } = data
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const [selectedAmount, setSelectedAmount] = useState<string | null>(null)
	const [searchResults, setSearchResults] = useState<Thing[]>([])
	const [entireSearch, setEntireSearch] = useState(true)
	const [isSearchOnChange, setIsSearchOnChange] = useState(true)
	const [loading, setLoading] = useState(false)
	const [approvedSearchSettings, setApprovedSearchSettings] = useState<{id: string, amount: string}[]>([])
	const [isAutoCompleteOpen, setIsAutoCompleteOpen] = useState(false)

	useEffect(() => {
		if (isSearchOnChange) {
			search()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [approvedSearchSettings])

	const handleAddSetting = () => {
		if (selectedId  && selectedAmount) {
			const newSettings = [...approvedSearchSettings || [], {id: selectedId, amount: selectedAmount}]
			setApprovedSearchSettings(newSettings)
			setSelectedId(null)
			setSelectedAmount(null)
		}
	}
	const handleRemoveSetting = (id: string) => {
			setApprovedSearchSettings(approvedSearchSettings?.filter(el => el.id !== id))
	}

	const search = () => {
		setLoading(true)
		let result: string[] = []
		if (entireSearch) {
			result = Object.keys(data.things).filter(el => {
				const thingParts = Object.keys(data.things[el])
				if (thingParts.includes("parts")) {
					return approvedSearchSettings!.length === Object.keys(data.things[el].parts)!.length
				}
				return false
			}).filter(el => {
				const diff = xor(
					approvedSearchSettings?.map(s => JSON.stringify(s)),
					Object.values(data.things[el].parts).map(p => (JSON.stringify({ id: p.partId, amount: p.amount })))
				)
				return !diff.length
			})
		} else {
			result = Object.keys(data.things).filter(el => {
				const thingParts = Object.keys(data.things[el])
				if (thingParts.includes("parts")) {
					return true
				}
				return false
			}).filter(el => {
				const selectedData = approvedSearchSettings?.map(apprSetting => JSON.stringify(apprSetting))
				const sourceData = Object.values(data.things[el].parts).map(sourceItem => JSON.stringify({ id: sourceItem.partId, amount: sourceItem.amount }))
				const intersect = intersection(
					selectedData,
					sourceData
				)
				return intersect!.length === approvedSearchSettings!.length
			})
		}
		setSearchResults(result.map(r => data.things[r]))
		setLoading(false)
	}

	if (isDataLoading) {
		return <LinearProgress />
	} else if (isDataEmpty) {
	return <Typography>База данных пуста, загрузите файл на вкладке "Upload"</Typography>
	}

	return <>
		<Grid container spacing={2}>
			<Box
				component={Grid}
				item xs={12} sm={12} md="auto" container direction={"column"}
			>
				{/*Search settings*/}
				<Paper component={Grid} item md container direction={"column"} elevation={12} gap={2} p={2}>
					<Typography>Настройки поиска</Typography>
					<FormControlLabel control={
						<Switch   checked={isSearchOnChange} onChange={() => setIsSearchOnChange(!isSearchOnChange)} inputProps={{ 'aria-label': 'ant design' }}/>
					} label="Поиск при вводе" />
					<FormControlLabel control={
						<Switch   checked={entireSearch} onChange={() => setEntireSearch(!entireSearch)} inputProps={{ 'aria-label': 'ant design' }}/>
					} label="Искать точное совпадение" />
					<Typography>Поиск</Typography>
					<Grid container direction="row" gap={2}>
						<Autocomplete
							// multiple
							size="small"
							open={isAutoCompleteOpen}
							onFocus={() => setIsAutoCompleteOpen(true)}
							onInput={e => {
									//@ts-ignore
								console.log(e.nativeEvent.inputType)
								//@ts-ignore
									if (e.nativeEvent.inputType === "insertFromPaste") {
										setSelectedId("")
									} else {
										//@ts-ignore
										if (e.nativeEvent.inputType !== "deleteContentBackward" && e.nativeEvent.inputType !== "insertText") {
											setIsAutoCompleteOpen(false)
										} else {
											setIsAutoCompleteOpen(true)
										}

									}
								}
							}
							// onAbort={() => setIsAutoCompleteOpen(false)}
							onClose={() => setIsAutoCompleteOpen(false)}
							onOpen={(event) => {
								if (event.type !== "change") {
									setIsAutoCompleteOpen(true)
								}

							}}
							id="tags-outlined"
							options={Object.keys(parts).filter(el => !approvedSearchSettings?.find(s => s.id === el))}
							getOptionLabel={(option) => option}
							style={{ width: "200px" }}
							// defaultValue={[]}
							filterSelectedOptions
							value={selectedId}
							onPaste={event => {
								const splited: {id: string, amount: string}[] = (event.clipboardData)
									.getData('text')
									.split("\n").map(row => {
										if (row.trim().search(" ") >= 0) {
											console.log("space")
											const byValues = row.split(" ")
											return {id: byValues[0], amount: byValues[1]}
										}
										console.log("tab")
										const byValues = row.trim().split("\t")
										return {id: byValues[0], amount: byValues[1]}
									}).filter(prepared => prepared.id.trim() && prepared.amount.trim())
								setIsAutoCompleteOpen(false)
								setApprovedSearchSettings(splited)
							}}
							onChange={(_, n,r,d) => {
								console.log("onchange", _, n , r ,d)
								setSelectedId(n)
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Артикул"
									placeholder="Выберите артикул"
								/>
							)}
						/>
						<TextField
							style={{width: "70px"}}
							variant="outlined"
							size="small"
							id="outlined-login"
							label="Кол-во"
							value={selectedAmount || ""}
							onChange={e => setSelectedAmount(e.target.value)}
							required
						/>
						<IconButton color="primary" onClick={handleAddSetting} disabled={!(selectedId  && selectedAmount)}><Check/></IconButton>
					</Grid>
					{!!approvedSearchSettings.length && <Button onClick={() => setApprovedSearchSettings([])} variant={"contained"} >Очистить</Button>}
					<Grid container direction={"column"} gap={2}>
						{approvedSearchSettings?.map(e => {
							return <Grid key={e.id} item container direction={"row"} gap={2} alignItems={"center"}>
								<Typography>{e.id}</Typography>
								<Typography>{e.amount}</Typography>
								<IconButton color="primary" onClick={() => handleRemoveSetting(e.id)}><Close/></IconButton>
							</Grid>
						})}
					</Grid>
					{!isSearchOnChange && <Button onClick={search} variant={"contained"} disabled={isSearchOnChange}>Искать</Button>}
				</Paper>
			</Box>

			<Grid item xs={12} sm={12} md>
				<Divider variant={"fullWidth"} style={{ padding: "20px" }}>Результаты поиска</Divider>
				<div style={{ height: 800, width: '100%' }}>
					<DataGrid
						loading={loading}
						autoHeight
						autoPageSize
						rows={searchResults}
						columns={thingsTableColumns}
						pageSize={50}
						rowsPerPageOptions={[50]}
						checkboxSelection={false}
						localeText={{noRowsLabel: "Чет тут душно...", noResultsOverlayLabel: "Чет тут душно..."}}
					/>
				</div>
			</Grid>
		</Grid>
	</>
}
