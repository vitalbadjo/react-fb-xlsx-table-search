import { useContext, useEffect, useState } from "react"
import { UserContext } from "../providers/userContext"
import {
	Autocomplete,
	Button,
	Divider, FormControlLabel, IconButton,
	LinearProgress,
	Stack,
	Switch,
	TextField,
} from "@mui/material"
import { Check, Close } from "@mui/icons-material"
import { Part } from "../models/part"
import { Thing } from "../models/thing"
import { xor, intersection } from "lodash"
import { DataGrid } from "@mui/x-data-grid"
import { thingsTableColumns } from "./things"

export default function Dashboard() {
	const { data } = useContext(UserContext)
	const [parts, setParts] = useState<Record<string, Part>>({})
	const [selected, setSelected] = useState<string[]>([])
	const [searchResults, setSearchResults] = useState<Thing[]>([])
	const [entireSearch, setEntireSearch] = useState(true)
	const [isSearchOnChange, setIsSearchOnChange] = useState(true)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		setParts(Object.keys(data.parts).reduce((p, c) => {
			return {
				...p,
				[c]: {
					...data.parts[c]
				}
			}
		}, {}))
	}, [data])

	useEffect(() => {
		search()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selected, entireSearch])

	const onAutocompleteChange = (
		event: React.SyntheticEvent,
		value: string[],
		reason: "selectOption" | "removeOption" | "createOption" | "focus" | "clear" | "blur",
	) => {
		switch (reason) {
			case "clear": {
				setSelected([])
				break
			}
			case "selectOption": {
				setSelected(value)
				break
			}
			case "removeOption": {
				setSelected(value)
			}
		}
	}

	const search = () => {
		setLoading(true)
		let result: Thing[] = []
		if (entireSearch) {
			result = Object.values(data.things).filter(el => {
				return selected.length === Object.keys(el.parts[0].partId).length
			}).filter(el => {
				return !xor(selected, Object.keys(el.parts)).length
			})
		} else {
			result = Object.values(data.things).filter(el => {
				const originalArrayForSearch = Object.keys(el.parts[0].partId)
				return intersection(selected, originalArrayForSearch).length >= selected.length
			})
		}
		setSearchResults(result)
		setLoading(false)
	}

	if (!Object.keys(data.parts).length) {
		return <LinearProgress />
	}

	return <>
		<Divider variant={"fullWidth"} style={{ padding: "20px" }}>Поиск</Divider>
		<Stack direction="row" spacing={1} alignItems="center">
			<Autocomplete
				multiple
				id="tags-outlined"
				options={Object.keys(parts)}
				getOptionLabel={(option) => option}
				style={{ width: "400px" }}
				defaultValue={[]}
				filterSelectedOptions
				onChange={onAutocompleteChange}
				renderInput={(params) => (
					<TextField
						{...params}
						label="Выберите несколько значений"
						placeholder="Favorites"
					/>
				)}
			/>
			<IconButton color="primary" ><Check/></IconButton>
			<IconButton color="primary"><Close/></IconButton>
			{!isSearchOnChange && <Button onClick={search} variant={"contained"} disabled={isSearchOnChange}>Искать</Button>}
			<FormControlLabel control={
				<Switch   checked={isSearchOnChange} onChange={() => setIsSearchOnChange(!isSearchOnChange)} inputProps={{ 'aria-label': 'ant design' }}/>
			} label="Поиск при вводе" />
			<FormControlLabel control={
				<Switch   checked={entireSearch} onChange={() => setEntireSearch(!entireSearch)} inputProps={{ 'aria-label': 'ant design' }}/>
			} label="Искать точное совпадение?" />
		</Stack>

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
			/>
		</div>
	</>
}
