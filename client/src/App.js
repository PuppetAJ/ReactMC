import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
	ApolloProvider,
	ApolloClient,
	InMemoryCache,
	createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Home from "./Pages/Home";
import Editor from "./Pages/Editor";
import Nav from "./Components/Nav";

const httpLink = createHttpLink({
	uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem("id_token");
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : "",
		},
	};
});

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});

// Add catch route all later
function App() {
	return (
		<ApolloProvider client={client}>
			<Router>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/editor' element={<Editor />} />
				</Routes>
			</Router>
		</ApolloProvider>
	);
}

export default App;
