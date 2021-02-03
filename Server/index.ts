import { add } from "./add"
import { Credentials } from "./Credentials"
import { list } from "./list"
import { remove } from "./remove"
import { Storage } from "./Storage"

const serverModule = {
	name: "server",
	description: "Adds or lists server.",
	commands: {
		add: add.command,
		list: list.command,
		remove: remove.command,
	},
}

export { Credentials, Storage, add, list, remove, serverModule as module }
