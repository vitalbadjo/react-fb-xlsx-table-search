import { LinearProgress, Typography } from "@mui/material"
import { useContext } from "react"
import { UserContext } from "../providers/userContext"
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import { Thing } from "../models/thing"

export const thingsTableColumns: GridColDef[] = [
	{ field: 'id', headerName: 'Артикул', width: 120 },
	{ field: 'name', headerName: 'Название', width: 500 },
	{ field: 'amount', headerName: 'Кол-во', width: 70 },
	{ field: 'size', headerName: 'Размер', width: 120 },
	{ field: 'details', headerName: 'Хар-ка', width: 120 },
	{
		field: 'parts',
		headerName: 'Комплектующие',
		// description: 'This column has a value getter and is not sortable.',
		sortable: false,
		width: 600,
		renderCell: (params: GridRenderCellParams<string, any, { parts: Thing["parts"] }>) => {
			if (params.row.parts) {
				const toArray = Object.keys(params.row.parts).map(el => {
					return `Арт: ${params.row.parts[el].partId}, Кол-во: ${params.row.parts[el].amount}`
				})
				return <>{toArray.map(el => <div key={el}>{el}<br/></div>)}</>
			}
			return ""
		}
	},
];

const Things = () => {
	const { data, isDataEmpty, isDataLoading } = useContext(UserContext)
	if (isDataLoading) {
		return <LinearProgress />
	} else if (isDataEmpty) {
		return <Typography>База данных пуста, загрузите файл на вкладке "Upload"</Typography>
	}
	return <div style={{ height: 800, width: '100%' }}>
		<DataGrid
			autoHeight
			autoPageSize
			rows={Object.values(data.things)}
			columns={thingsTableColumns}
			pageSize={100}
			rowsPerPageOptions={[50]}
			checkboxSelection={false}
			rowThreshold={100}
			rowHeight={60}
		/>
	</div>
}

export default Things
