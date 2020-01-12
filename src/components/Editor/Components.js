import React from "react"
import stylex from "stylex"

// `sameComponents` returns whether two component arrays are
// the same (based on type -- reference).
export function sameComponents(Components, NewComponents) {
	if (Components.length !== NewComponents.length) {
		return false
	}
	let index = 0
	while (index < Components.length) {
		if (Components[index].type !== NewComponents[index].type) {
			return false
		}
		index++
	}
	return true
}

// // `VDOMNode` adds attributes to a render function.
// const VDOMNode = render => ({ reactKey, ...props }) => {
// 	const element = render(props)
// 	const newRender = React.cloneElement(
// 		element,
// 		{
// 			"id": reactKey,
// 			"data-vdom-node": true,
// 			...element.props,
// 		},
// 	)
// 	return newRender
// }

const Syntax = stylex.Styleable(props => (
	<span style={stylex.parse("pre c:blue-a400")}>
		{props.children}
	</span>
))

const Markdown = ({ style, ...props }) => (
	<React.Fragment>
		{props.startSyntax && (
			<Syntax style={style}>
				{props.startSyntax}
			</Syntax>
		)}
		{props.children}
		{props.endSyntax && (
			<Syntax style={style}>
				{props.endSyntax}
			</Syntax>
		)}
	</React.Fragment>
)

const Header = props => (
	<div id={props.reactKey} style={stylex.parse("fw:700 fs:19")} data-vdom-node data-vdom-unix={Date.now()}>
		<Markdown startSyntax={props.startSyntax}>
			{props.children || (
				<br />
			)}
		</Markdown>
	</div>
)

const Comment = props => (
	<div style={stylex.parse("fs:19 c:gray")} spellCheck={false} data-vdom-node>
		<Markdown style={stylex.parse("c:gray")} startSyntax="//">
			{props.children || (
				<br />
			)}
		</Markdown>
	</div>
)

// Compound component.
const Blockquote = props => (
	<div id={props.reactKey} data-vdom-node>
		{props.children.map(each => (
			<div key={each.key} id={each.key} style={stylex.parse("fs:19")} data-vdom-node>
				<Markdown startSyntax={each.startSyntax}>
					{each.children || (
						!(each.startSyntax + each.children) && (
							<br />
						)
					)}
				</Markdown>
			</div>
		))}
	</div>
)

const codeStyle = {
	MozTabSize: 2, // Firefox.
	tabSize: 2,
	font: "15px/1.375 'Monaco', 'monospace'",
}

// Compound component.
//
// https://cdpn.io/PowjgOg
const CodeBlock = props => (
	<div
		id={props.reactKey}

		style={{
			...stylex.parse("m-x:-24 p-y:16 pre b:gray-50 overflow -x:scroll"),
			...codeStyle,
			boxShadow: "0px 0px 1px hsl(var(--gray))",
		}}
		spellCheck={false}
		data-vdom-node
	>
		{props.children.map((each, index) => (
			<div key={each.key} id={each.key} style={stylex.parse("p-x:24")} data-vdom-node>
				<code style={{ ...stylex.parse("m-r:-24 p-r:24"), ...codeStyle }}>
					<Markdown
						startSyntax={!index && props.startSyntax}
						endSyntax={index + 1 === props.children.length && props.endSyntax}
					>
						{each.children || (
							index > 0 && index + 1 < props.children.length && (
								<br />
							)
						)}
					</Markdown>
				</code>
			</div>
		))}
	</div>
)

const Paragraph = props => (
	<div id={props.reactKey} style={stylex.parse("fs:19")} data-vdom-node>
		{props.children || (
			<br />
		)}
	</div>
)

const Break = props => (
	<div style={stylex.parse("fs:19 c:gray")} spellCheck={false} data-vdom-node>
		<Markdown startSyntax={props.startSyntax} />
	</div>
)

export const ComponentMap = {
	[btoa(Header)]:     "Header",
	[btoa(Comment)]:    "Comment",
	[btoa(Blockquote)]: "Blockquote",
	[btoa(CodeBlock)]:  "CodeBlock",
	[btoa(Paragraph)]:  "Paragraph",
	[btoa(Break)]:      "Break",
}

// Convenience function.
function isBlockquote(data, hasNextSibling) {
	const ok = (
		(data.length === 1 && data === ">" && hasNextSibling) || // Empty syntax.
		(data.length >= 2 && data.slice(0, 2) === "> ")
	)
	return ok
}

export function parseComponents(body) {
	// const updatedAt = Date.now()

	const Components = []
	let index = 0
	while (index < body.nodes.length) {
		const { key, data } = body.nodes[index]
		switch (true) {
		// Header:
		case (
			(data.length >= 2 && data.slice(0, 2) === ("# ")) ||
			(data.length >= 3 && data.slice(0, 3) === ("## ")) ||
			(data.length >= 4 && data.slice(0, 4) === ("### ")) ||
			(data.length >= 5 && data.slice(0, 5) === ("#### ")) ||
			(data.length >= 6 && data.slice(0, 6) === ("##### ")) ||
			(data.length >= 7 && data.slice(0, 7) === ("###### "))
		): {
			const commonSyntaxStartIndex = data.indexOf("# ")
			const startSyntax = data.slice(0, commonSyntaxStartIndex + 2)
			Components.push(<Header key={key} reactKey={key} startSyntax={startSyntax}>{data.slice(commonSyntaxStartIndex + 2)}</Header>)
			break
		}
		// Comment:
		case data.length >= 2 && data.slice(0, 2) === "//":
			Components.push(<Comment key={key} reactKey={key}>{data.slice(2)}</Comment>)
			break
		// Blockquote:
		case isBlockquote(data, index + 1 < body.nodes.length): {
			const startIndex = index
			index++
			while (index < body.nodes.length) {
				if (!isBlockquote(body.nodes[index].data, index + 1 < body.nodes.length)) {
					break
				}
				index++
			}
			const nodes = body.nodes.slice(startIndex, index)
			Components.push((
				<Blockquote key={key} reactKey={key}>
					{nodes.map(each => (
						{
							key:         each.key,
							startSyntax: each.data.slice(0, 2),
							children:    each.data.slice(2),
						}
					))}
				</Blockquote>
			))
			// Decrement (compound components):
			index--
			break
		}
		// Code block:
		case (
			data.length >= 6 &&
			data.slice(0, 3) === "```" && // Start syntax.
			data.slice(-3) === "```"      // End syntax.
		):
			Components.push((
				<CodeBlock key={key} reactKey={key} startSyntax="```" endSyntax="```">
					{[
						{
							key, // Reuse the current key.
							children: data.slice(3, -3),
						},
					]}
				</CodeBlock>
			))
			break
		// Code block (multiline):
		case data.length >= 3 && data.slice(0, 3) === "```": {
			const startIndex = index
			index++
			let didTerminate = false
			while (index < body.nodes.length) {
				if (body.nodes[index].data.length === 3 && body.nodes[index].data === "```") {
					didTerminate = true
					break
				}
				index++
			}
			index++
			if (!didTerminate) {
				Components.push(<Paragraph key={key} reactKey={key}>{data}</Paragraph>)
				index = startIndex
				break
			}
			const nodes = body.nodes.slice(startIndex, index)
			Components.push((
				<CodeBlock key={key} reactKey={key} startSyntax={data} endSyntax="```">
					{nodes.map((each, index) => (
						{
							key:      each.key,
							children: !index || index + 1 === nodes.length
								? ""         // Start and end nodes.
								: each.data, // Center nodes.
						}
					))}
				</CodeBlock>
			))
			// Decrement (compound components):
			index--
			break
		}
		// Break:
		case (
			data.length === 3 &&
			(data === "***" || data === "---")
		):
			Components.push(<Break key={key} reactKey={key} startSyntax={data} />)
			break
		// Paragraph:
		default:
			Components.push(<Paragraph key={key} reactKey={key}>{data}</Paragraph>)
			break
		}
		index++
	}
	return Components
}
