import { ChangeEvent, useEffect, useState } from "react"
import { Button, Dialog, DialogContent, DialogTitle, Divider, Grid, Stack, TextField } from "@mui/material"
import DoubleFieldedInputSearch from "./doublefielded-input-search"
import { Thing } from "../models/thing"
import { getDataToLocalStorage, setDataToLocalStorage } from "../helpers/local-storage"

export type GroupListItems = Record<string, { result:  Thing[]|null }>
type GroupItem = {
	title: string
	floorNumber: string
	roomNumber: string
	roomArea: string
	list: GroupListItems
}
export type GroupedListState = Record<string, GroupItem>

const initialLocalState: GroupedListState = {
	initGroup: {
		title: "",
		floorNumber: "",
		roomNumber: "",
		roomArea: "",
		list: {
			initItem: { result: null }
		}
	}
}

type IGroupedSearchListProps = {
	dataCallback: (data: GroupedListState) => void
}

export default function GroupedSearchList ({dataCallback}: IGroupedSearchListProps) {
	const [tree, setTree] = useState<GroupedListState>(getDataToLocalStorage() || initialLocalState)
	const [isDialogOpen, setIsOpenDialog] = useState(false)

	useEffect(() => {
		const localSavedData = getDataToLocalStorage()
		if (localSavedData) {
			setTree(localSavedData)
		}
	}, [])

	useEffect(() => {
		dataCallback(tree)
		setDataToLocalStorage(tree)
	}, [tree, dataCallback])

	const changeGroupData = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, groupKey: keyof GroupedListState, field: keyof GroupItem) => {
		setTree(prevState => ({
			...prevState,
			[groupKey]: {
				...prevState[groupKey],
				[field]: e.currentTarget.value
			}
		}))
	}

	const addGroup = () => {
		setTree(prevState => ({
			...prevState,
			["addedGroup"+new Date().getTime()]: {
				title: "",
				floorNumber: "",
				roomNumber: "",
				roomArea: "",
				list: { init: { result: null }}
			}
		}))
	}

	const removeGroup = (groupKey: keyof GroupedListState) => {
		const newState = JSON.parse(JSON.stringify(tree))
		delete newState[groupKey]
		setTree(newState)
	}

	const addListItem = (groupKey: keyof GroupedListState) => {
		setTree(prevState => ({
			...prevState,
			[groupKey]: {
				...prevState[groupKey],
				list: {
					...prevState[groupKey].list,
					["addedListItem"+new Date().getTime()]: {
						result: null
					}
				}
			}
		}))
	}

	const removeListItem = <T extends keyof GroupedListState>(groupKey: T, listKey: keyof GroupedListState[T]["list"]) => {
		console.log("remove", groupKey, listKey)
		const newState = JSON.parse(JSON.stringify(tree))
		delete newState[groupKey].list[listKey]
		setTree(newState)
	}

	const setSearchResult = <T extends keyof GroupedListState>(groupKey: T, listKey: keyof GroupedListState[T]["list"], data: Thing[]) => {
		setTree(prevState => ({
			...prevState,
			[groupKey]: {
				...prevState[groupKey],
				list: {
					...prevState[groupKey].list,
					[listKey]: {
						result: data
					}
				}
			}
		}))
	}

	return <>
		{Object.keys(tree).map((groupElKey, i) => {
			return <Grid container direction={"column"} gap={1} key={groupElKey}>
				<Grid container direction={"row"} gap={2}>
					<TextField
						style={{maxWidth: "120px"}}
						variant="outlined"
						size="small"
						label="?????????? ??????????"
						placeholder="?????????? ??????????"
						value={tree[groupElKey].floorNumber || ""}
						onChange={e => changeGroupData(e, groupElKey, "floorNumber")}
					/>
					<TextField
						style={{maxWidth: "120px"}}
						variant="outlined"
						size="small"
						label="?????????? ??????????????????"
						placeholder="?????????? ??????????????????"
						value={tree[groupElKey].roomNumber || ""}
						onChange={e => changeGroupData(e, groupElKey, "roomNumber")}
					/>
					<TextField
						style={{maxWidth: "120px"}}
						variant="outlined"
						size="small"
						label="??????.??????????????????"
						placeholder="??????.??????????????????"
						value={tree[groupElKey].roomArea || ""}
						onChange={e => changeGroupData(e, groupElKey, "roomArea")}
					/>
				</Grid>

				{Object.keys(tree[groupElKey].list).map(listSearchElKey => {
					return <DoubleFieldedInputSearch
						key={listSearchElKey}
						removeField={
							(Object.keys(Object.keys(tree[groupElKey].list)).length > 1) ?
								() => removeListItem(groupElKey, listSearchElKey) :
								()=>{}
						}
						searchResult={data => setSearchResult(groupElKey, listSearchElKey, data)}
					/>
				})}
				<Button onClick={() => addListItem(groupElKey)} variant={"contained"}>???????????????? ???????????? ????????????</Button>
				{i > 0 && <Button onClick={() => removeGroup(groupElKey)} variant={"contained"}>?????????????? ????????????</Button>}
				<Divider/>
			</Grid>
		})}
		<Button onClick={addGroup} variant={"contained"}>???????????????? ????????????</Button>
		<Button
			style={{marginTop:"20px"}}
			variant={"contained"}
			color="error"
			onClick={() => setIsOpenDialog(true)}
		>
			???????????????? ??????
		</Button>
		<Dialog onClose={() => setIsOpenDialog(false)} open={isDialogOpen}>
			<DialogTitle>???? ???????????????</DialogTitle>
			<DialogContent>
				<Stack direction={"row"} spacing={2}>
					<Button
						variant={"contained"}
						onClick={() => setIsOpenDialog(false)}
					>
						????????????
					</Button>
					<Button
						variant={"contained"}
						color="error"
						onClick={() => {
							setTree(initialLocalState)
							setIsOpenDialog(false)
						}}
					>
						???????????????? ??????
					</Button>
				</Stack>
			</DialogContent>
		</Dialog>
	</>
}
