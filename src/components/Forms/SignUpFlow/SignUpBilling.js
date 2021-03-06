import * as Stripe from "./Stripe"
import Fragments from "components/Fragments"
import GraphQL from "use-graphql"
import Headers from "components/Headers"
import Input from "components/Input"
import Overlay from "components/Overlay"
import React from "react"
import stylex from "stylex"
import User from "components/User"

function SignUpBilling({ state, dispatch, ...props }) {
	const [, { login }] = React.useContext(User.Context)

	const createToken = Stripe.useCard(Stripe.cardOptions)

	const [, createUser] = GraphQL.useLazyMutation(`
		mutation CreateUser($user: CreateUserInput!) {
			createUser(user: $user) {
				...user
			}
		}
		${Fragments.user}
	`)

	React.useEffect(
		React.useCallback(() => {
			;(async () => {
				const { errors, data } = await GraphQL.fetchAsGraphQL(`
					query NextSubscriptionDate {
						nextMonth { ...date }
						nextYear  { ...date }
					}
					${Fragments.date}
				`)
				if (errors) {
					throw new Error(`FIXME: ${errors.map(error => error.message).join(", ")}`)
				}
				const { nextMonth, nextYear } = data
				dispatch.setNextMonth(nextMonth.year, nextMonth.month, nextMonth.day)
				dispatch.setNextYear(nextYear.year, nextYear.month, nextYear.day)
			})()
		}, [dispatch]),
		[],
	)

	const asyncHandleSubmit = async e => {
		e.preventDefault()
		const { username, password, passcode, chargeMonth } = state
		if (chargeMonth === -1) {
			dispatch.setWarn("Please choose a subscription.")
			return
		}
		// Create token:
		dispatch.setFetching(true)
		const res1 = await createToken()
		if (res1.error) { // Stripe error; not GraphQL
			dispatch.setFetching(false)
			dispatch.setWarn(`Stripe: ${res1.error.message}`)
			return
		}
		// Create user:
		const { card: { id: stripeCardID, brand: stripeCardBrand, last4: stripeCardLastFour } } = res1.token
		const res2 = await createUser({ user: { username, password, passcode, chargeMonth: chargeMonth === 1, stripeCardID, stripeCardBrand, stripeCardLastFour } })
		if (res2.errors) {
			// throw new Error(`FIXME: ${res2.errors.map(error => error.message).join(", ")}`)
			dispatch.setFetching(false)
			dispatch.setWarn("An unexpected error occurred.") // FIXME: E.g. support@opencodex.dev
			return
		}
		login(res2.data.createUser)
	}

	// TODO: Add back button?
	return (
		<Overlay>
			<div style={stylex.parse("p-x:24 p-y:128 flex -r -x:center")}>
				<form style={stylex.parse("w:320")} onSubmit={asyncHandleSubmit}>

					<header style={stylex.parse("m-b:40")}>
						<Headers.H1 style={stylex.parse("center")}>
							Sign up
						</Headers.H1>
						<Headers.H2 style={stylex.parse("center")}>
							to continue with <span style={stylex.parse("c:blue-a400")}>Codex</span>
						</Headers.H2>
					</header>

					<Input.Label style={stylex.parse("m-y:16")}>
						Subscription
						<Input.SubscriptionSelect>
							<Input.SubscriptionOption
								selected={state.chargeMonth === 1}
								text="Charge me per month"
								price="$8 per month"
								onClick={dispatch.setChargeMonth}
							/>
							<Input.SubscriptionOption
								selected={state.chargeMonth === 0}
								text="Charge me per year"
								price="$80 per year"
								discount="SAVE 20%"
								onClick={dispatch.setChargeYear}
							/>
						</Input.SubscriptionSelect>
					</Input.Label>

					<Input.Label style={stylex.parse("m-y:32")}>
						Payment method
						<Input.StripeCard />
					</Input.Label>

					{state.info && (
						<Input.Info style={stylex.parse("m-t:40 m-b:-24")}>
							{state.info}
						</Input.Info>
					)}

					<Input.Submit style={stylex.parse("m-t:40 m-b:16")} fetching={state.fetching}>
						Sign up now
					</Input.Submit>

					{state.warn && (
						<Input.Warn style={stylex.parse("m-t:16")}>
							{state.warn}
						</Input.Warn>
					)}

				</form>
			</div>
		</Overlay>
	)
}

export default SignUpBilling
