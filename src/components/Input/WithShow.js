import * as Base from "./Base"
import React from "react"
import stylex from "stylex"

const ShowButton = stylex.Styleable(({ show, setShow, ...props }) => (
	<Base.StyledButton style={stylex.parse("flex -r :center w:74.469")} onClick={e => setShow(!show)}>
		<p style={stylex.parse("fw:500 fs:12 ls:10% lh:100% c:gray")}>
			{!show ? (
				"SHOW"
			) : (
				"HIDE"
			)}
		</p>
	</Base.StyledButton>
))

const WithShow = stylex.Unstyleable(({ show, setShow, ...props }) => (
	<div style={{ ...stylex.parse("flex -r br:6"), ...Base.boxShadow }}>
		{React.cloneElement(
			props.children,
			{ style: stylex.parse("br-r:0"), type: !show ? "password" : "text" },
		)}
		<ShowButton style={stylex.parse("no-flex-shrink br-l:0")} show={show} setShow={setShow} />
	</div>
))

export default WithShow
