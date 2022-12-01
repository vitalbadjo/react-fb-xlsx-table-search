import {
	IconButton,
	ListItem,
	ListItemText,
	Menu,
	MenuItem,
} from "@mui/material"
import React, { useState } from "react"
import { MoreVert } from "@mui/icons-material"
import { TransactionCategory } from "../../models/transactionCategory"

export type ICategoryItemProps = TransactionCategory

const CategoryItem: React.FunctionComponent<ICategoryItemProps> = ({id, displayName, icon}) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	return <ListItem
		secondaryAction={
			<>
				<IconButton
					id="basic-button"
					aria-controls={open ? 'basic-menu' : undefined}
					aria-haspopup="true"
					aria-expanded={open ? 'true' : undefined}
					onClick={handleClick}
				>
					<MoreVert/>
				</IconButton>
				<Menu
					id="basic-menu"
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose}
					MenuListProps={{
						'aria-labelledby': 'basic-button',
					}}
				>
					<MenuItem onClick={handleClose}>Delete</MenuItem>
					<MenuItem onClick={handleClose}>Edit</MenuItem>
				</Menu>
			</>
		}
	>
		<ListItemText primary={displayName}/>
	</ListItem>
}
export default CategoryItem
