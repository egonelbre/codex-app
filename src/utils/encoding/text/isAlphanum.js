// Returns whether a character is an alphanumeric character.
function isAlphanum(char) {
	if (!char) {
		return false
	}
	const ok = (
		(char >= "a" && char <= "z") ||
		(char >= "A" && char <= "Z") ||
		(char >= "0" && char <= "9") ||
		char === "_"
	)
	return ok
}

export default isAlphanum
