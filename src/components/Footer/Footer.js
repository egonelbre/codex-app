// import * as StatusCircle from "./StatusCircle"
import * as Feather from "react-feather"
import React from "react"
import RouterLink from "components/RouterLink"
import stylex from "stylex"

import { ReactComponent as CodexLogo } from "assets/codex.svg"

const Icon = stylex.Styleable(({ icon: Icon, ...props }) => (
	<Icon style={stylex.parse("wh:15 middle c:gray")} />
))

const Text = stylex.Styleable(props => (
	<p style={stylex.parse("fw:700 fs:15 lh:100% c:gray-200")} {...props}>
		{props.children}
	</p>
))

// const CopyrightText = stylex.Styleable(props => (
// 	<p style={stylex.parse("fs:15 lh:100% c:gray")} {...props}>
// 		{props.children}
// 	</p>
// ))

const FooterItem = stylex.Unstyleable(props => (
	<RouterLink style={stylex.parse("p-x:8 flex -r -y:center h:max")} {...props}>
		{props.children}
	</RouterLink>
))

const FooterList = stylex.Unstyleable(props => (
	<div style={stylex.parse("m-x:-8 flex -r")}>
		{props.children}
	</div>
))

const Footer = props => (
	<footer style={stylex.parse("p-x:24 flex -r -x:center b:gray-900")}>
		<div style={stylex.parse("flex -r -x:between w:1024 h:80")}>

			{/* LHS */}
			<FooterList>
				<FooterItem to="/systems">
					<Text>
						{/* <StatusCircle.Info /> */}
						{/* &nbsp; */}
						System status
					</Text>
				</FooterItem>
				<FooterItem to="/api">
					<Text>
						API
					</Text>
				</FooterItem>
				<FooterItem to="https://github.com/codex-src">
					<Text>
						Open source
						&nbsp;
						<Icon icon={Feather.ExternalLink} />
					</Text>
				</FooterItem>
				{/* TODO: Username. */}
				<FooterItem to="https://twitter.com/username_ZAYDEK">
					<Text>
						Twitter
						&nbsp;
						<Icon icon={Feather.ExternalLink} />
					</Text>
				</FooterItem>
				<FooterItem to="/support">
					<Text>
						Support
					</Text>
				</FooterItem>
				{/* <FooterItem to="/feedback"> */}
				{/* 	<Text> */}
				{/* 		Feedback */}
				{/* 	</Text> */}
				{/* </FooterItem> */}
			</FooterList>

			{/* RHS */}
			<FooterList>
				<FooterItem>
					<CodexLogo style={stylex.parse("w:80 h:20 c:white")} />
				</FooterItem>
			</FooterList>

		</div>
	</footer>
)

export default Footer
