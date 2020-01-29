import Enum from "utils/Enum"
import newNodes from "./helpers/newNodes"
import parseComponents from "./parseComponents"
import useMethods from "use-methods"
import write from "./helpers/write"
import { newCursor } from "./helpers/getCursorFromKey"

const OpTypes = new Enum(
	"INIT",
	"FOCUS",
	"BLUR",
	"SELECT",
	"INPUT",
	"CUT",
	"COPY",
	"PASTE",
	"UNDO",
	"REDO",
)

const initialState = {
	opType: "",       // The editing operation type
	opTimestamp: 0,   // The editing operation timestamp
	hasFocus: false,  // Is the editor focused?
	data: "",         // The plain text data
	nodes: null,      // The parsed nodes
	start: null,      // The start cursor
	end: null,        // The end cursor
	coords: null,     // The cursor coordinates
	reset: null,      // The reset cursor key and offset
	components: null, // The parsed React components
	reactDOM: null,   // The React DOM (unmounted)
	shouldRender: 0,  // Should render? (hook)
	didRender: 0,     // Did render? (hook)
}

const reducer = state => ({
	commitOp(opType) {
		const opTimestamp = Date.now()
		if (opType === OpTypes.SELECT && opTimestamp - state.opTimestamp < 100) {
			// No-op
			return
		}
		Object.assign(state, { opType, opTimestamp })
	},
	opFocus() {
		this.commitOp(OpTypes.FOCUS)
		state.hasFocus = true
	},
	opBlur() {
		this.commitOp(OpTypes.BLUR)
		state.hasFocus = false
	},
	opSelect(start, end, coords) {
		this.commitOp(OpTypes.SELECT)
		Object.assign(state, { start, end, coords })
	},
	// state.nodes.splice(start.index, end.index - start.index + 1, ...nodes)
	opInput(nodes, start, end, coords, reset) { // TODO: coords
		this.commitOp(OpTypes.INPUT)
		write(state, nodes, start, end)
		// state.reset = reset
		Object.assign(state, { coords, reset })
		this.render()
	},
	render() {
		const nodes = state.nodes.map(each => ({ ...each })) // Read proxy
		state.components = parseComponents(nodes)
		state.shouldRender++
	},
	rendered() {
		state.didRender++
	}
})

// Initializes the editor state.
const init = initialValue => initialState => {
	const nodes = newNodes(initialValue)
	const state = {
		...initialState,
		opType: OpTypes.INIT,
		opTimestamp: Date.now(),
		data: initialValue,
		nodes,
		start: newCursor(),
		end: newCursor(),
		coords: {
			start: {
				x: 0,
				y: 0,
			},
			end: {
				x: 0,
				y: 0,
			},
		},
		reset: {
			key: "",
			offset: 0,
		},
		components: parseComponents(nodes),
		reactDOM: document.createElement("div"),
	}
	return state
}

const useEditor = initialValue => useMethods(reducer, initialState, init(initialValue))

export default useEditor
