import { Grid } from "@mui/material"
import React, { PropsWithChildren } from "react"
import MiniDrawer from "../components/app-bar"
import { UserProvider } from "../providers/userProvider"

const PageContainer: React.FunctionComponent<PropsWithChildren> = (props) => {
	const {children} = props
	const [value, setValue] = React.useState('recents');

	const handleChange = (event: React.SyntheticEvent, newValue: string) => {
		setValue(newValue);
	};

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
