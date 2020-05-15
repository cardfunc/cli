import { addCommand } from "./Module"
import { Credentials } from "./Credentials"

export async function list(): Promise<string[]> {
	return Credentials.list()
}

addCommand({
	name: "list",
	description: "List stored servers.",
	examples: [
		["", "List names of all stored servers."]
	],
	execute: async (connection, argument, flags) => {
		console.log("cardfunc --server <server> <module> <command>\n\nServers:")
		console.log((await list()).join("\n") + "\n")
		return true
	},
})
