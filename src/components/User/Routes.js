import * as Context from "./Context"
import DocumentTitle from "DocumentTitle"
import React from "react"
import Router from "components/Router"

export const Route = ({ title, ...props }) => (
	<DocumentTitle title={title}>
		<Router.Route {...props}>
			{props.children}
		</Router.Route>
	</DocumentTitle>
)

// `UnprotectedRoute` guards authenticated users.
export function UnprotectedRoute(props) {
	const [state] = React.useContext(Context.Context)

	if (state.isAuth) {
		return <Router.Redirect to="/" />
	}
	return <Route {...props} />
}

// `ProtectedRoute` guards unauthenticated users.
export function ProtectedRoute(props) {
	const [state] = React.useContext(Context.Context)

	if (!state.isAuth) {
		return <Router.Redirect to="/sign-in" />
	}
	return <Route {...props} />
}