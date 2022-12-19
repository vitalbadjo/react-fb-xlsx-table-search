import { useContext } from "react"
import { UserContext } from "../providers/userContext"
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { LinearProgress } from "@mui/material"

const columns: GridColDef[] = [
	{ field: 'id', headerName: 'Article', width: 70 },
	{ field: 'name', headerName: 'Name', width: 600 },
	{ field: 'amount', headerName: 'Amount', width: 200 },
];
const Parts = () => {
	const { data } = useContext(UserContext)

	if (!Object.keys(data.parts).length) {
		return <LinearProgress />
	}
	return <div style={{ height: 800, width: '100%' }}>
		<DataGrid
			autoHeight
			autoPageSize
			rows={Object.values(data.parts)}
			columns={columns}
			pageSize={50}
			rowsPerPageOptions={[50]}
			checkboxSelection
		/>
	</div>
}

export default Parts

