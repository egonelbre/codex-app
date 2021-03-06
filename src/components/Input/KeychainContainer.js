import * as Base from "./Base"
import React from "react"
import stylex from "stylex"

// Compound component.
const KeychainContainer = stylex.Unstyleable(props => (
	<div style={{ ...stylex.parse("flex -r br:6"), ...Base.boxShadow }}>
		{React.cloneElement(
			props.children[0],
			{ style: stylex.parse("br-r:0") },
		)}
		<div style={stylex.parse("no-flex-shrink m-x:-1 w:1 b:gray-200")} />
		{React.cloneElement(
			props.children[1],
			{ style: stylex.parse("br-l:0") },
		)}
	</div>
))

export default KeychainContainer
