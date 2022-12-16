import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";
import { Link } from "@chakra-ui/react";
import Auth from "../utils/auth";

const Login = (props) => {
	const [formState, setFormState] = useState({ email: "", password: "" });
	const [login, { error }] = useMutation(LOGIN_USER);

	// update state based on form input changes
	const handleChange = (event) => {
		const { name, value } = event.target;

		setFormState({
			...formState,
			[name]: value,
		});
	};

	// submit form
	const handleFormSubmit = async (event) => {
		event.preventDefault();

		try {
			const { data } = await login({
				variables: { ...formState },
			});

			Auth.login(data.login.token);
		} catch (e) {
			console.error(e);
		}

		// clear form values
		setFormState({
			email: "",
			password: "",
		});
	};

	//Returning JSX
	return (
		<main className="flex-row justify-center mb-4 container">
			<div className="col-12 col-md-6 menu-options">
				<div className="card">
					<h4 className="card-header">Login</h4>
					<div className="card-body">
						<form onSubmit={handleFormSubmit}>
							<input
								className="form-input"
								placeholder="Your email"
								name="email"
								type="email"
								id="email"
								value={formState.email}
								onChange={handleChange}
							/>
							<input
								className="form-input"
								placeholder="******"
								name="password"
								type="password"
								id="password"
								value={formState.password}
								onChange={handleChange}
							/>
							<button className="btn-minecraft d-block w-100" type="submit">
								Submit
							</button>
						</form>

						{error && <div>Login failed</div>}
					</div>
				</div>
				{/* <Link
					href="http://fonts.cdnfonts.com/css/minecraftia"
					rel="stylesheet"
				/> */}
			</div>

			{/* <div className="container">
				<div className="menu-options">
					<button className="btn-minecraft">Signup</button>
					<button className="btn-minecraft">Login</button>
				</div>
			</div> */}

		</main>
	);
};

export default Login;