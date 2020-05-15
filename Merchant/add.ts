import { addCommand } from "./Module"
import * as authly from "authly"
import { Data } from "./Data"

export async function add(name: string, privateKey: authly.Token, publicKey: authly.Token, user?: string, password?: string): Promise<boolean> {
	const merchant: Data = { name, keys: { private: privateKey, public: publicKey } }
	if (user && password)
		merchant.administrator = { user, password }
	return Data.save(merchant)
}

addCommand({
	name: "add",
	description: "Adds a new merchant.",
	examples: [
		["<name> <private key> <public key>", "Add merchant without admin user."],
		["<name> <private key> <public key> <user> <password>", "Add merchant and admin user."],
	],
	execute: (connection, argument, flags) => add(argument[0], argument[1], argument[2], argument[3], argument[4]),
})
