import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from "./pages/dashboard"
import Login from "./pages/login"
import { initializeApp } from "firebase/app"
import { config } from "./config/config"
import AuthRoute from "./components/auth-route"
import PageContainer from "./pages/page-container"

initializeApp(config.firebase)

export type IAppProps = {}

const App: React.FunctionComponent<IAppProps> = (props) => {
  return (<BrowserRouter>
		<Routes>
			<Route path={"/"} element={
				<AuthRoute>
					<PageContainer>
						<Dashboard />
					</PageContainer>
			</AuthRoute>}/>
			<Route path={"/login"} element={<Login />}/>
		</Routes>
	</BrowserRouter>);
}

export default App;
