import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logout } from '@mui/icons-material';
import { getAuth } from "firebase/auth"
import { ListItemIcon } from "@mui/material"

type Props = {
	/**
	 * Injected by the documentation to work in an iframe.
	 * You won't need it on your project.
	 */
	window?: () => Window;
}

const drawerWidth = 240;
const navItems = [
	{ name: 'Home', path: "/" },
	{ name: 'Parts', path: '/parts' },
	{ name: 'Things', path: '/things' },
	{ name: 'Upload xlsx', path: '/upload' },
];

export default function DrawerAppBar(props: PropsWithChildren & Props) {
	const { window, children } = props;
	const [mobileOpen, setMobileOpen] = React.useState(false);

	const navigate = useNavigate();

	const handleDrawerToggle = () => {
		setMobileOpen((prevState) => !prevState);
	};

	const drawer = (
		<Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
			<Typography variant="h6" sx={{ my: 2 }}>
				Super Pro Keeper
			</Typography>
			<Divider />
			<List>
				{navItems.map((item) => (
					<ListItem key={item.name} disablePadding>
						<ListItemButton sx={{ textAlign: 'left' }} onClick={() => navigate(item.path)}>
							<ListItemText primary={item.name} />
						</ListItemButton>
					</ListItem>
				))}
				<ListItem key={"logout"} disablePadding>
					<ListItemButton sx={{ textAlign: 'left' }} onClick={() => getAuth().signOut()}>
						<ListItemText primary={"Logout"}/>
						<ListItemIcon children={<Logout />}/>
					</ListItemButton>
				</ListItem>
			</List>
		</Box>
	);

	const container = window !== undefined ? () => window().document.body : undefined;

	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<AppBar component="nav">
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{ mr: 2, display: { sm: 'none' } }}
					>
						<MenuIcon />
					</IconButton>
					<Typography
						variant="h6"
						component="div"
						sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
					>
						Super Pro Keeper
					</Typography>
					<Box sx={{ display: { xs: 'none', sm: 'block' } }}>
						{navItems.map((item) => (
							<Button key={item.name} sx={{ color: '#fff' }} onClick={() => navigate(item.path)}>
								{item.name}
							</Button>
						))}
						<Button
							sx={{ color: '#fff' }}
							key="logout"
							variant="text"
							color={"inherit"} endIcon={<Logout />}
							onClick={() => getAuth().signOut()}
						>
							Logout
						</Button>
					</Box>
				</Toolbar>
			</AppBar>
			<Box component="nav">
				<Drawer
					container={container}
					variant="temporary"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					sx={{
						display: { xs: 'block', sm: 'none' },
						'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
					}}
				>
					{drawer}
				</Drawer>
			</Box>
			<Box component="main" sx={{ p: 3 }} style={{width: "100%"}}>
				<Toolbar />
				{children}
			</Box>


		</Box>
	);
}
