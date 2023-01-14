import { useContext, useState } from "react"
import { UserContext } from "../providers/userContext"
import {
	Accordion,
	AccordionDetails, AccordionSummary,
	Box,
	Button,
	Divider, Grid,
	LinearProgress, Paper, Stack,
	Typography,
} from "@mui/material"
import GroupedSearchList, { GroupedListState } from "../components/grouped-search-list"
import { generateXlsx } from "../helpers/generate-xlsx"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const dividerStyle = {marginLeft: "5px", marginRight: "5px"}

export default function Dashboard() {
	const { isDataEmpty, isDataLoading, data } = useContext(UserContext)
	const [searchResults, setSearchResults] = useState<GroupedListState>({})
	const [approvedSearchSettings, setApprovedSearchSettings] = useState<{id: string, amount: string}[]>([])
	const [expanded, setExpanded] = useState<string | false>(false);

	const handleChangeExpanded =
		(panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
			setExpanded(isExpanded ? panel : false);
		};

	if (isDataLoading) {
		return <LinearProgress />
	} else if (isDataEmpty) {
	return <Typography>База данных пуста, обновите базу на вкладке "Update"</Typography>
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
					{Object.keys(searchResults).map(group => {
						const {roomArea, roomNumber, floorNumber} = searchResults[group]
						return <Grid container direction={"column"} key={group}>
							<Typography variant={"h5"}>
								{`Номер этажа: ${floorNumber} Номер помещения: ${roomNumber} Кол.квадратов: ${roomArea}` }
							</Typography>
							{Object.keys(searchResults[group].list).map((listItem, i) => {
								if (searchResults[group].list[listItem]?.result?.[0]) {
									const {id, size, name, parts} = searchResults[group].list[listItem]?.result?.[0]!
									return <Accordion
										key={id}
										expanded={expanded === `panel${i}`}
										onChange={handleChangeExpanded(`panel${i}`)}
									>
										<AccordionSummary
											expandIcon={<ExpandMoreIcon />}
											aria-controls={`panel${i}bh-content`}
											id={`panel${i}bh-content`}
											style={{maxWidth: "100%"}}
										>
											<Typography sx={{ width: '70px', flexShrink: 0 }}>Артикул:</Typography>
											<Typography sx={{ color: 'text.secondary' }}>{id}</Typography>
											<Divider orientation="vertical" flexItem style={dividerStyle}/>
											<Typography sx={{ width: '70px', flexShrink: 0 }}>Размер:</Typography>
											<Typography sx={{ color: 'text.secondary' }}>{size}</Typography>
											<Divider orientation="vertical" flexItem style={dividerStyle}/>
											<Typography sx={{ width: '80px', flexShrink: 0 }}>Название:</Typography>
											<Typography sx={{ color: 'text.secondary' }} noWrap>{name}</Typography>
										</AccordionSummary>
										<AccordionDetails>

											<Grid container direction="column" gridColumn={2}>
												{Object.keys(parts).map(part => {
													const { amount, name, id} = parts[part]
													return <Stack key={id} style={{paddingLeft: "20px"}} direction="row" spacing={2}>
															<Typography sx={{ width: '60px', flexShrink: 0 }}>Артикул:</Typography>
															<Typography sx={{ color: 'text.secondary' }}>{id}</Typography>
															<Typography sx={{ width: '85px', flexShrink: 0 }}>Количество:</Typography>
															<Typography sx={{ color: 'text.secondary' }}>{amount}</Typography>
															<Typography sx={{ width: '60px', flexShrink: 0 }}>Название:</Typography>
															<Typography sx={{ color: 'text.secondary' }} noWrap>{name}</Typography>
														</Stack>
												})}
											</Grid>
										</AccordionDetails>
									</Accordion>
								}
								return null
							})}
						</Grid>
					})}
					<Button
						style={{marginTop: "20px"}}
						variant={"contained"}
						onClick={() => {
							if (Object.keys(searchResults).length) {
								generateXlsx(searchResults, data.parts)
							} else {
								console.log("Unable to generate XLSX file. Search results is empty")
							}
						}}
					>
						Экспортировать результат в XLSX
					</Button>
				</div>
			</Grid>
		</Grid>
	</>
}
