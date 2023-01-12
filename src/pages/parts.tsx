import { useContext } from "react"
import { UserContext } from "../providers/userContext"
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { LinearProgress, Typography } from "@mui/material"

const columns: GridColDef[] = [
	{ field: 'id', headerName: 'Артикул', width: 120 },
	{ field: 'name', headerName: 'Название', width: 600 },
	// { field: 'amount', headerName: 'Кол-во', width: 200 },
];
const Parts = () => {
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
			rows={Object.values(data.parts)}
			columns={columns}
			pageSize={50}
			rowsPerPageOptions={[50]}
			// checkboxSelection
		/>
	</div>
}

export default Parts

