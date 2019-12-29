import * as Feather from "react-feather"
import metrics from "./metrics"
import React from "react"
import stylex from "stylex"

/*
 *
 */

// `formatCommas` formats a number with commas.
function formatCommas({ count }) {
	return count.toLocaleString("en")
}

// `formatPlural` formats a number with commas and a
// descriptor in singular or plural form.
function formatPlural({ count, desc }) {
	return `${formatCommas({ count })} ${desc}${count === 1 ? "" : "s"}`
}

// `computeLHS` computes the selection string or the
// insertion point string.
function computeLHS({ line, column, selectedLines, selectedCharacters }) {
	// Compute selection string:
	if (selectedCharacters.count) {
		if (selectedLines.count < 2) {
			return `Selected ${formatPlural(selectedCharacters)}`
		}
		return `Selected ${formatPlural(selectedLines)}, ${formatPlural(selectedCharacters)}`
	}
	// Compute insertion point string:
	return `Line ${formatCommas(line)}, column ${formatCommas(column)}`
}

// `computeRHS` computes the rounded up word count and
// rounded up duration (in minutes).
function computeRHS({ words, duration }) {
	if (duration.count < 2) {
		return formatPlural(words)
	}
	return `${formatPlural(words)}, ${formatPlural(duration)}`
}

/*
 *
 */

const Icon = stylex.Styleable(({ icon: Icon, ...props }) => (
	<Icon style={stylex.parse("wh:12.5")} />
))

const Text = stylex.Styleable(props => (
	<p style={stylex.parse("tnum fs:12.5 ls:0.625% lh:100%")} {...props}>
		{props.children}
	</p>
))

// FIXME: `React.useContext`?
function StatusBar({ state, dispatch, ...props }) {
	const mx = metrics.compute(state)

	return (
		<div style={{ ...stylex.parse("fixed -x -b b:gray-100 z:1 no-pointer-events"), boxShadow: "0px -1px hsl(var(--gray-200))" }}>
			<div style={stylex.parse("p-x:24 flex -r -x:center")}>
				<div style={stylex.parse("flex -r -x:between w:1024 h:32")}>

					{/* LHS */}
					<div style={stylex.parse("flex -r -y:center")}>
						<Icon icon={Feather.Scissors} />
						<div style={stylex.parse("w:6.25")} />
						<Text>
							{computeLHS(mx)}
						</Text>
					</div>

					{/* RHS */}
					<div style={stylex.parse("flex -r -y:center")}>
						<Text>
							{computeRHS(mx)}
						</Text>
						<div style={stylex.parse("w:6.25")} />
						<Icon icon={Feather.Bookmark} />
					</div>

				</div>
			</div>
		</div>
	)
}

export default StatusBar