import { LinearProgress } from "@mui/material"
import { useContext } from "react"
import { UserContext } from "../providers/userContext"
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import { Thing } from "../models/thing"

export const thingsTableColumns: GridColDef[] = [
	{ field: 'id', headerName: 'ID', width: 120 },
	{ field: 'name', headerName: 'Name', width: 500 },
	{ field: 'amount', headerName: 'Amount', width: 70 },
	{ field: 'size', headerName: 'Size', width: 120 },
	{ field: 'details', headerName: 'Details', width: 120 },
	{
		field: 'parts',
		headerName: 'Parts entries',
		description: 'This column has a value getter and is not sortable.',
		sortable: false,
		width: 600,
		renderCell: (params: GridRenderCellParams<string, any, { parts: Thing["parts"] }>) => {
			if (params.row.parts) {
				const toArray = Object.keys(params.row.parts).map(el => {
					return `Арт: ${params.row.parts[el].partId}, Кол-во: ${params.row.parts[el].amount}`
				})
				return <>{toArray.map(el => <>{el}<br/></>)}</>
			}
			return ""
		}
	},
];

const Things = () => {
	const { data } = useContext(UserContext)
	if (!Object.keys(data.things).length) {
		return <LinearProgress />
	}
	return <div style={{ height: 800, width: '100%' }}>
		<DataGrid
			autoHeight
			autoPageSize
			rows={Object.values(data.things)}
			columns={thingsTableColumns}
			pageSize={50}
			rowsPerPageOptions={[50]}
			checkboxSelection={false}
			rowThreshold={100}
			rowHeight={60}
		/>
	</div>
}

export default Things
