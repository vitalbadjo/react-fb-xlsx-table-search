import { Autocomplete, Grid, IconButton, TextField, Typography } from "@mui/material"
import { Check, Close, Delete } from "@mui/icons-material"
import { xor } from "lodash"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../providers/userContext"
import { Thing } from "../models/thing"

type IDoubleFieldedInputSearch = {
	searchResult: (data: Thing[]) => void
	removeField: () => void
}

export default function DoubleFieldedInputSearch({searchResult, removeField}: IDoubleFieldedInputSearch) {
	const { data } = useContext(UserContext)
	const { parts } = data
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const [selectedAmount, setSelectedAmount] = useState<string | null>(null)
	const [approvedSearchSettings, setApprovedSearchSettings] = useState<{id: string, amount: string}[]>([])
	const [isAutoCompleteOpen, setIsAutoCompleteOpen] = useState(false)

	useEffect(() => {
			search()
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
		let result: string[] = []

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

		const results = result.map(r => data.things[r])
		searchResult(results)
	}

	return <>
		<Grid container direction="row" gap={2}>
			<Autocomplete
				// multiple
				size="small"
				open={isAutoCompleteOpen}
				onFocus={() => setIsAutoCompleteOpen(true)}
				onInput={e => {
					//@ts-ignore
					// console.log(e.nativeEvent.inputType)
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
					// console.log("onchange", _, n , r ,d)
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
				onKeyPress={e => {
					if (e.code === "Enter") {
						handleAddSetting()
					}
				}}
				required
			/>
			<IconButton color="primary" onClick={handleAddSetting} disabled={!(selectedId  && selectedAmount)}><Check/></IconButton>
			<IconButton title={"Удалить"} color="primary" onClick={removeField}><Delete/></IconButton>
		</Grid>
		<Grid container direction={"column"} gap={0}>
			{approvedSearchSettings?.map(e => {
				return <Grid key={e.id} item container direction={"row"} gap={2} alignItems={"center"}>
					<Typography style={{fontSize: 10}}>{e.id}</Typography>
					<Typography style={{fontSize: 10}}>{e.amount}</Typography>
					<IconButton style={{padding: 0, width: "10px", height: "10px" }} color="primary" onClick={() => handleRemoveSetting(e.id)}><Close/></IconButton>
				</Grid>
			})}
		</Grid>
	</>
}
