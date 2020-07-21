import { create } from "./create"
import { update } from "./update"

const cardModule = {
	name: "card",
	description: "Creates, updates and lists cards.",
	commands: {
		create: create.command,
		update: update.command,
	},
}

export {
	create,
	update,
	cardModule as module
}
