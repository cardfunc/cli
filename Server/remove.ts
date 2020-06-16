import { addCommand } from "./Module"
import { Credentials } from "./Credentials"

export async function remove(name: string): Promise<boolean> {
	return Credentials.remove(name)
}
addCommand({
	name: "remove",
	description: "Removes server.",
	examples: [
		["<name>", "Removes server."],
	],
	execute: async (connection, argument, flags) => {
		const result = connection &&
			await remove(argument[0])
		console.log("Attempt to remove server:")
		return result ?? false
	},
})
