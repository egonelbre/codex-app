// import * as Feather from "react-feather"
import Context from "../Context"
import getStatus from "./getStatus"
import React from "react"
import stylex from "stylex"

function formatComma({ count }) {
	return count.toLocaleString("en")
}

function formatCount({ count, desc }) {
	return `${formatComma({ count })} ${desc}${count === 1 ? "" : "s"}`
}

// Gets the status string for the LHS.
function getStatusLHS({ line, column, selectedLines, selectedCharacters }) {
	if (selectedCharacters.count) {
		if (selectedLines.count < 2) {
			return `Selected ${formatCount(selectedCharacters)}`
		}
		return `Selected ${formatCount(selectedLines)}, ${formatCount(selectedCharacters)}`
	}
	return `Line ${formatComma(line)}, column ${formatComma(column)}`
}

// Gets the status string for the RHS.
function getStatusRHS({ words, duration }) {
	if (duration.count < 2) {
		return formatCount(words)
	}
	return `${formatCount(words)}, ${formatCount(duration)}`
}

// const Icon = stylex.Styleable(({ icon: Icon, ...props }) => (
// 	<Icon style={stylex.parse("sw:500 wh:14 c:gray-900")} />
// ))

const Text = stylex.Styleable(props => (
	<p style={stylex.parse("tnum fw:500 fs:14 lh:100% c:gray-900")} {...props}>
		{props.children}
	</p>
))

function StatusBar(props) {
	const [state] = React.useContext(Context)

	const status = getStatus(state)

	return (
		<aside style={stylex.parse("p-x:16 p-y:12 fixed -x -b z:1")}>
			<div style={stylex.parse("flex -r -x:center")}>
				<div style={stylex.parse("flex -r -x:between w:1440")}>
					<div style={stylex.parse("p-x:16 p-y:12 b:gray-100 br:8")}>
						<Text>
							<span className="emoji" role="img" aria-label="emoji">
								✂️
							</span>{"\u00a0\u00a0"}
							{getStatusRHS(status)}
						</Text>
					</div>
					<div style={stylex.parse("p-x:16 p-y:12 b:gray-100 br:8")}>
						<Text>
							{getStatusRHS(status)}{"\u00a0\u00a0"}
							<span className="emoji" role="img" aria-label="emoji">
								⌛️
							</span>
						</Text>
					</div>
				</div>
			</div>
		</aside>
	)
}

export default StatusBar
