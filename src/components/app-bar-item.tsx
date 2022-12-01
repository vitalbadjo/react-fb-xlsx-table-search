import React, { ReactNode } from "react"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"

export type IAppBarItemProps = {
	text: string
	icon: ReactNode
	open: boolean
	onClick?: () => void
}

const AppBarItem: React.FunctionComponent<IAppBarItemProps> = (props) => {
	const {text, icon, open, onClick} = props
	return 	<ListItem key={text} disablePadding sx={{ display: 'block' }}>
		<ListItemButton
			onClick={onClick}
			sx={{
				minHeight: 48,
				justifyContent: open ? 'initial' : 'center',
				px: 2.5,
			}}
		>
			<ListItemIcon
				sx={{
					minWidth: 0,
					mr: open ? 3 : 'auto',
					justifyContent: 'center',
				}}
			>
				{icon}
			</ListItemIcon>
			<ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
		</ListItemButton>
	</ListItem>
}

export default AppBarItem
