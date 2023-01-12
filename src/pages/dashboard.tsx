import { useContext, useState } from "react"
import { UserContext } from "../providers/userContext"
import {
	Box,
	Button,
	Divider, Grid,
	LinearProgress, Paper,
	Typography,
} from "@mui/material"
import GroupedSearchList, { GroupedListState } from "../components/grouped-search-list"
import { generateXlsx } from "../helpers/generate-xlsx"

export default function Dashboard() {
	const { isDataEmpty, isDataLoading, data } = useContext(UserContext)
	const [searchResults, setSearchResults] = useState<GroupedListState>({})
	const [approvedSearchSettings, setApprovedSearchSettings] = useState<{id: string, amount: string}[]>([])

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
					<Typography>Поиск</Typography>
					<GroupedSearchList dataCallback={setSearchResults}/>
					{!!approvedSearchSettings.length && <Button onClick={() => setApprovedSearchSettings([])} variant={"contained"} >Очистить</Button>}
				</Paper>
			</Box>

			<Grid item xs={12} sm={12} md>
				<Divider variant={"fullWidth"} style={{ padding: "20px" }}>Результаты поиска</Divider>
				<div style={{ height: 800, width: '100%' }}>
					{/*<DataGrid*/}
					{/*	loading={loading}*/}
					{/*	autoHeight*/}
					{/*	autoPageSize*/}
					{/*	rows={searchResults}*/}
					{/*	columns={thingsTableColumns}*/}
					{/*	pageSize={50}*/}
					{/*	rowsPerPageOptions={[50]}*/}
					{/*	checkboxSelection={false}*/}
					{/*	localeText={{noRowsLabel: "Чет тут душно...", noResultsOverlayLabel: "Чет тут душно..."}}*/}
					{/*/>*/}
					{Object.keys(searchResults).map(group => {
						const {roomArea, roomNumber, floorNumber} = searchResults[group]
						return <Grid container direction={"column"} gap={2} key={group}>
							<Typography variant={"h5"}>
								{`Номер этажа: ${floorNumber} Номер помещения: ${roomNumber} Кол.квадратов: ${roomArea}` }
							</Typography>
							<Grid container direction={"column"} gap={2}>
								{Object.keys(searchResults[group].list).map(listItem => {
									if (searchResults[group].list[listItem]?.result?.[0]) {
										const {id, size, name} = searchResults[group].list[listItem]?.result?.[0]!
										return <Typography key={listItem}>
											{`${id} ${size} ${name}`}
										</Typography>
									}
									return null
								})}
							</Grid>
							<Divider variant="middle" style={{marginBottom: "20px"}}/>
						</Grid>
					})}
					<Button
						variant={"contained"}
						onClick={() => generateXlsx(searchResults, data.parts)}
					>
						Export
					</Button>
				</div>
			</Grid>
		</Grid>
	</>
}
