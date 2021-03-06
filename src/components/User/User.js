import * as Router from "react-router-dom"
import Errors from "components/Errors"
import Fragments from "components/Fragments"
import GraphQL from "use-graphql"
import invariant from "invariant"
import React from "react"
import useUser from "./UserReducer"

export const Context = React.createContext()

// `Fetcher` fetches the current user.
function Fetcher(props) {
	const [, { login }] = React.useContext(Context)

	const [history, { pathname }] = [Router.useHistory(), Router.useLocation()]

	const { fetching, errors, data } = GraphQL.useQuery(`
		query Me {
			me {
				...user
			}
		}
		${Fragments.user}
	`)

	React.useLayoutEffect(
		React.useCallback(() => {
			if (!data) {
				return
			}
			login(data.me)
			history.push(pathname)
		}, [data, history, login, pathname]),
		[data],
	)

	if (errors && !GraphQL.errorsIs(errors, Errors.sqlNoRows)) {
		// FIXME
		invariant(false, errors.map(error => error.message).join(", "))
	} else if (fetching) {
		return null
	}
	return props.children
}

export function Provider(props) {
	const [state, dispatch] = useUser()

	const { Provider } = Context
	return (
		<Provider value={[state, dispatch]}>
			<Fetcher>
				{props.children}
			</Fetcher>
		</Provider>
	)
}
