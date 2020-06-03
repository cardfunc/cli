import { addCommand } from "./Module"
import * as authly from "authly"
import { Credentials } from "./Credentials"

export async function add(name: string, privateKey: authly.Token, publicKey: authly.Token, user?: string, password?: string): Promise<boolean> {
	const credential: Credentials = { name, keys: { private: privateKey, public: publicKey } }
	if (user && password)
		credential.administrator = { user, password }
	return Credentials.save(credential)
}

addCommand({
	name: "add",
	description: "Adds a new server.",
	examples: [
		["<name> <private key> <public key>", "Add server without admin user."],
		["<name> <private key> <public key> <user> <password>", "Add server and admin user."],
	],
	execute: (connection, argument, flags) => add(argument[0], argument[1], argument[2], argument[3], argument[4]),
})
