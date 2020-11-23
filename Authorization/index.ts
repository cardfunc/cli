import { create } from "./create"
import { list } from "./list"
import { verify } from "./verify"

export const authorizationModule = {
	name: "authorization",
	description: "Creates an authorization.",
	commands: {
		create: create.command,
		list: list.command,
		verify: verify.command,
	},
}

export { create, list, verify, authorizationModule as module }
