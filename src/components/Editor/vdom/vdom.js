// https://gist.github.com/jed/982883
//
// newUUID() // 96ace54c-69b0-4a9c-a8d5-7a22b111d05b
// newUUID() // 4e27fdb6-d5ba-4825-8f2b-a975eb96ed6f
// newUUID() // 5f542e0f-f0d0-402c-b246-d7e049ec648e
//
function newUUID(a) {
	return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, newUUID)
}

// `parse` parses data into discrete, keyed nodes.
function parse(data) {
	const nodes = data.split("\n").map(data => ({
		key: newUUID(),
		data,
	}))
	return nodes
}

class VDOM {
	constructor(data) {
		const nodes = parse(data)
		Object.assign(this, {
			data,  // The data.
			nodes, // The discrete, keyed nodes.
		})
	}
	// `read` reads the VDOM.
	read(pos1 = 0, pos2 = this.data.length) { // Arguments can be omitted.
		return this.data.slice(pos1, pos2)
	}
	// `write` writes to the VDOM.
	write(data, pos1, pos2) {

		// Start node and offset:
		let pos = pos1
		let node1 = 0
		let offset1 = 0
		while (node1 < this.nodes.length) {
			if (pos - this.nodes[node1].data.length <= 0) {
				// Offset from the start:
				offset1 = pos
				break
			}
			pos -= this.nodes[node1].data.length
			if (node1 + 1 < this.nodes[node1].data.length) {
				pos--
			}
			node1++
		}

		// End node and offset:
		pos = pos2 - pos1
		let node2 = node1
		let offset2 = 0
		while (node2 < this.nodes.length) {
			if (pos - this.nodes[node2].data.length <= 0) {
				// Offset from the end:
				offset2 = pos - this.nodes[node2].data.length
				break
			}
			pos -= this.nodes[node2].data.length
			if (node2 + 1 < this.nodes[node2].data.length) {
				pos--
			}
			node2++
		}

		const range = {
			node: [node1, node2 + 1],
			offset: [offset1, offset2 + 1],
		}

		const newData = this.data.slice(0, pos1) + data + this.data.slice(pos2)
		const newNodes = []

		// Start node; must have one or more nodes:
		const nodes = parse(data)
		newNodes.push({
			key: this.nodes[range.node[0]].key,
			data: this.nodes[range.node[0]].data.slice(0, range.offset[0]) + nodes[0].data,
		})

		// Intermediary nodes; must have three or more nodes:
		if (nodes.length > 2) {
			newNodes.push(...nodes.slice(1, -1))
		}
		// End node; must have two or more nodes:
		if (nodes.length > 1) {
			newNodes.push({
				key: this.nodes[range.node[1]].key,
				data: nodes.slice(-1)[0].data + this.nodes[range.node[1]].data.slice(range.offset[1]),
			})
		}

		Object.assign(this, {
			data: newData,
			nodes: newNodes,
		})
	}

}

const v = new VDOM("foo\nbar\nbaz")
v.write("abc\ndef\nghi", 2, 9)

// foo
// bar
// baz
//
// abc
// def
// ghi
//
// foabc
// def
// ghiaz
