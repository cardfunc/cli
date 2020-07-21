import { get } from "./get"
import { missing } from "./missing"

const paresModule = {
	name: "pares",
	description: "Handles PaRes.",
	commands: {
		get: get.command,
	},
}

export {
	get,
	missing,
	paresModule as module,
}
