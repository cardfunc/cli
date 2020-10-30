import * as paramly from "paramly"
import { Connection } from "../Connection"

export async function list(connection: Connection): Promise<string[]> {
	return connection.storage.list()
}

export namespace list {
	export const command: paramly.Command<Connection> = {
		name: "list",
		description: "List stored servers.",
		examples: [
			["", "List names of all stored servers."]
		],
		execute: async (connection, argument, flags) => {
			let result: boolean
			if (result = !!connection) {
				console.info("payfunc-card --server <server> <module> <command>\n\nServers:")
				console.info((await list(connection)).join("\n") + "\n")
			}
			return result
		},
	}
}
