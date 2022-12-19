import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from "./pages/dashboard"
import Login from "./pages/login"
import { initializeApp } from "firebase/app"
import { config } from "./config/config"
import AuthRoute from "./components/auth-route"
import Things from "./pages/things"
import Parts from "./pages/parts"
import UploadXlsx from "./pages/upload"

initializeApp(config.firebase)

export type IAppProps = {}

const App: React.FunctionComponent<IAppProps> = (props) => {
	return (<BrowserRouter>
		<Routes>
			<Route path={"/"} element={
				<AuthRoute>
					<Dashboard />
				</AuthRoute>
			} />
			<Route path={"/parts"} element={
				<AuthRoute>
					<Parts />
				</AuthRoute>
			} />
			<Route path={"/things"} element={
				<AuthRoute>
					<Things />
				</AuthRoute>
			} />
			<Route path={"/upload"} element={
				<AuthRoute>
					<UploadXlsx />
				</AuthRoute>
			} />
			<Route path={"/login"} element={<Login />} />
		</Routes>
	</BrowserRouter>);
}

export default App;
