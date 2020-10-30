import * as paramly from "paramly"
import { Connection } from "../Connection"

export async function remove(connection: Connection, name: string): Promise<boolean> {
	return connection.storage.remove(name) ?? false
}
export namespace remove {
	export const command: paramly.Command<Connection> = {
		name: "remove",
		description: "Removes server.",
		examples: [["<name>", "Removes server."]],
		execute: async (connection, argument, flags) => {
			const result = connection && (await remove(connection, argument[0]))
			console.info("Attempt to remove server:")
			return result ?? false
		},
	}
}
