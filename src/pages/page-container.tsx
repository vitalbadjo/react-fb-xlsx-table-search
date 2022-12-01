import { Grid } from "@mui/material"
import React, { PropsWithChildren } from "react"
import MiniDrawer from "../components/app-bar"

const PageContainer: React.FunctionComponent<PropsWithChildren> = ({ children }) => {
	return <Grid
		container
		direction="column"
		justifyContent="space-between"
		alignItems="center"
		height="100vh"
	>
		<Grid item>
				<MiniDrawer>{children}</MiniDrawer>
		</Grid>
	</Grid>
}

export default PageContainer
