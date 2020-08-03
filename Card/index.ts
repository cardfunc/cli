import { create } from "./create"
import { update } from "./update"

const cardModule = {
	name: "card",
	description: "Creates and updates cards.",
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
