import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, User } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import {
	Box,
	Button, Container,
	FormControl, FormHelperText, Grid,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput, Paper, Stack,
	TextField,
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"

// eslint-disable-next-line no-useless-escape
const emailFormat = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

export default function Login() {
	const auth = getAuth()
	const navigate = useNavigate()
	const [authing, setAuthing] = useState(false)
	const [user, setUser] = useState<User | null>(null)

	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => setShowPassword((show) => !show);
	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	const [pass, setPass] = useState("")
	const [passError, setPassError] = useState(false)
	const [passErrorMessage, setPassErrorMessage] = useState("")
	const [login, setLogin] = useState("")
	const [loginError, setLoginError] = useState(false)
	const [loginErrorMessage, setLoginErrorMessage] = useState("")


	useEffect(() => {
		if (user?.uid) {
			navigate("/")
		} else {
			console.log("unauth")
		}
	}, [user, navigate])

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const signInWithGoogle = async () => {
		setAuthing(true)
		await signInWithPopup(auth, new GoogleAuthProvider()).then(e => {
			setUser(e.user)
		}).catch(e => {
			console.log(e)
			setAuthing(false)
		})
	}

	const handleSignInWithPassword = async () => {
		if (validate()) {
			setAuthing(true)
			try {
				const authUser = await signInWithEmailAndPassword(auth, login, pass)
				setUser(authUser.user)
			} catch (e) {
				console.log("Auth error: ", e)
			}
			setAuthing(false)
		}
	}

	const validate = () => {
		return validateEmail() && validatePassword()
	}

	const validateEmail = () => {
		if (!login) {
			setLoginError(true)
			setLoginErrorMessage("Email is required")
			return false
		} else if (login.match(emailFormat)) {
			setLoginError(false)
			setLoginErrorMessage("")
			return true
		} else {
			setLoginError(true)
			setLoginErrorMessage("Invalid email format")
			return false
		}
	}

	const validatePassword = () => {
		if (pass) {
			setPassError(false)
			setPassErrorMessage("")
			return true
		} else {
			setPassError(true)
			setPassErrorMessage("Password is required")
			return false
		}
	}

	return <Container style={{height: "100vh"}}>
		<Grid container height={"100%"} alignItems={"center"} justifyContent={"center"}>
			<Grid item maxWidth={"45ch"}>
		<Paper elevation={3}>
		<Box
			component="form"
			padding={"4ch"}
			sx={{
				'& .MuiTextField-root': { m: 1, width: '100%' },
			}}
			noValidate
			autoComplete="off"
		>
			<Stack direction={"column"} spacing={2} alignItems={"center"}>
				<TextField
					error={loginError}
					style={{margin: 0}}
					helperText={loginErrorMessage}
					id="outlined-login"
					label="Login"
					variant="outlined"
					value={login}
					onChange={e => setLogin(e.target.value)}
					required
				/>
				<FormControl sx={{ m: 0, width: '100%' }} variant="outlined">
					<InputLabel error={passError} htmlFor="outlined-adornment-password">Password</InputLabel>
					<OutlinedInput
						error={passError}
						id="outlined-pass"
						label="Password"
						value={pass}
						onChange={e => setPass(e.target.value)}
						type={showPassword ? 'text' : 'password'}
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									aria-label="toggle password visibility"
									onClick={handleClickShowPassword}
									onMouseDown={handleMouseDownPassword}
									edge="end"
								>
									{showPassword ? <VisibilityOff color={passError ? "error" : "action"}/> : <Visibility color={passError ? "error" : "action"}/>}
								</IconButton>
							</InputAdornment>
						}
						required
					/>
					<FormHelperText title={"error"} error={passError}>{passErrorMessage}</FormHelperText>
				</FormControl>
				<Button
					onClick={() => handleSignInWithPassword()}
					disabled={authing}
					variant="outlined"
				>
					Sign in
				</Button>
			</Stack>
		</Box>

		{/*<Button onClick={() => signInWithGoogle()} disabled={authing} variant="outlined">Sign in with google</Button>*/}
		</Paper>
			</Grid>
		</Grid>
	</Container>
}
