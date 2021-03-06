import React from "react"

const ReadOnlyModeStylesheet = props => (
	<style>{
		`
.prefers-read-only-mode .blockquote {
	padding-left: 28px;
	font-size: 1.1em;
	box-shadow: inset 2px 0px hsl(var(--blue-a400));
}
/* .prefers-read-only-mode .blockquote > [data-empty-node] { */
/* 	height: calc(1.65em / 2); */
/* } */

.prefers-read-only-mode .code-block > [data-start-node],
.prefers-read-only-mode .code-block > [data-end-node] {
	display: none;
}

.prefers-read-only-mode .paragraph.emojis {
	font-size: 1.5em;
}

.prefers-read-only-mode .break {
	margin: calc(0.75em - 1px) 0px;
	border: 2px solid hsl(var(--gray-200));
}

/* FIXME */
.prefers-read-only-mode .comment,
.prefers-read-only-mode .markdown {
	display: none;
}
.prefers-read-only-mode .comment + .paragraph[data-empty-node] {
	display: none;
}

`.trim()
	}</style>
)

const TextBackgroundStylesheet = props => (
	<style>{
		`
.prefers-text-background .em,
.prefers-text-background .strong {
	/* color: hsl(var(--blue-a400)); */
	background: hsla(var(--blue-a400), 0.05);
}
.prefers-text-background .strikethrough,
.prefers-text-background .comment .em,
.prefers-text-background .comment .strong,
.prefers-text-background .comment .strikethrough {
	background: hsla(var(--gray), 0.1);
}
.prefers-text-background .em *,
.prefers-text-background .strong *,
.prefers-text-background .strikethrough * {
	background: none;
}
.prefers-text-background .code {
	background: hsl(var(--white)) !important;
}

`.trim()
	}</style>
)

const CoreStylesheet = props => (
	<style>{
		`
@import "https://cdn.jsdelivr.net/gh/codex-src/iA-Fonts@master/iA%20Writer%20Mono/Webfonts/index.css";
@import "https://cdn.jsdelivr.net/gh/codex-src/iA-Fonts@master/iA%20Writer%20Duo/Webfonts/index.css";

.editor {
	--padding-x:     24px;
	--padding-y:     12px;
	--border-radius: 0px;
	--box-shadow:    0px 0px 0px 1px hsl(var(--gray-300));

	color: hsl(var(--black));
	caret-color: hsl(var(--black));
}
.editor *::selection {
	background: hsla(218, 100%, 58.0392%, 0.25) !important;
}

.header {
	font-weight: bold;
	line-height: 1.45;
	color: hsl(var(--black));
}
.header.h1 {
	font-size: 1.50em;
}
.header.h2 {
	font-size: 1.25em;
}
.header.h3 {
	font-size: 1.20em;
}
.header.h4 {
	font-size: 1.15em;
}
.header.h5 {
	font-size: 1.10em;
}
.header.h6 {
	font-size: 1.05em;
}

.comment {
	--blue-a400: var(--gray);
	color: hsl(var(--gray));
}

.blockquote {
	color: hsl(var(--blue-a200));
}

.code-block {
	/* margin: 0px calc(-1 * var(--padding-x)); */
	padding: var(--padding-y) var(--padding-x);
	background: hsl(var(--gray-50));
	border-radius: var(--border-radius);
	box-shadow: var(--box-shadow);
	-webkit-overflow-scrolling: touch;
	overflow-x: scroll;
}
.code-block > [data-node] > span {
	padding-right: var(--padding-x);
}

.paragraph.emojis {
	font-size: 1.5em;
}

.emoji {
	font-size: 1.2em;
	line-height: 1;
	vertical-align: -0.1em;
}

.em {
	font-style: italic;
	/* color: hsl(var(--blue-a400)); */
}

.strong {
	font-weight: bold;
}

.code {
	padding: 1px 0px;
	box-decoration-break: clone;
	color: hsl(var(--blue-a400));
	border-radius: var(--border-radius);
	box-shadow: var(--box-shadow);
}
.code > .markdown {
	color: hsl(var(--gray));
}

.strikethrough {
	--blue-a400: var(--gray);
	font-style: italic;
	color: hsl(var(--gray));
	text-decoration: line-through;
}

.markdown {
	color: hsl(var(--blue-a400));
}

`.trim()
	}</style>
)

const TextStylesheet = props => (
	<style>{
		`
.editor {
	-moz-tab-size: 4;
	tab-size: 4;
	font: 19px/1.65 system-ui;
}

.code-block,
.code {
	-webkit-font-smoothing:  auto;
	-moz-osx-font-smoothing: auto;

	-moz-tab-size: 2;
	tab-size: 2;
	font: calc(16/19 * 1em)/1.45 "iA Writer Mono", monospace;
}

`.trim()
	}</style>
)

const MonoStylesheet = props => (
	<style>{
		`
.editor {
	-webkit-font-smoothing:  auto;
	-moz-osx-font-smoothing: auto;

	-moz-tab-size: 2;
	tab-size: 2;
	font: 16px/1.65 "iA Writer Duo", monospace;
}

.code-block,
.code {
	font: 1em/1.45 "iA Writer Mono";
}

`.trim()
	}</style>
)

const Stylesheets = ({ state, ...props }) => (
	<React.Fragment>
		<TextBackgroundStylesheet />
		<ReadOnlyModeStylesheet />
		<CoreStylesheet />
		{!state.prefersMonoStylesheet ? (
			<TextStylesheet />
		) : (
			<MonoStylesheet />
		)}
	</React.Fragment>
)

export default Stylesheets
