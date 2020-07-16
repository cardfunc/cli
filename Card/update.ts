import * as authly from "authly"
import * as gracely from "gracely"
import * as cardfunc from "@cardfunc/model"
import { Connection } from "../Connection"
import { addCommand } from "./Module"

export async function update(connection: Connection, token: authly.Token, card: Partial<cardfunc.Card.Creatable>): Promise<cardfunc.Card | gracely.Error> {
		return connection.patch<cardfunc.Card>("public", `card/${ token }`, card)
}
addCommand({
	name: "update",
	description: "Update card.",
	examples: [
		["<token> 4111111111111111 2/22 987", "Update card."],
		["<token> 4111111111111111 2/22 987 <pares>", "Update card with PaRes."],
		["<token> <pares>", "Update pares."],
	],
	execute: async (connection, argument, flags) => {
		const card: Partial<cardfunc.Card.Creatable> = {}
		if (argument.length == 2)
			card.pares = argument[1] == "auto" ? undefined : argument[1]
		else {
			const expires = argument[2].split("/", 2).map(e => Number.parseInt(e))
			card.pan = argument[1]
			if (cardfunc.Card.Expires.is(expires))
				card.expires = expires
			card.csc = argument[3]
			card.pares = argument[4] == "auto" || !argument[4] ? undefined : argument[4]
		}
		const result = connection && await update(connection, argument[0], card)
		console.info(typeof result == "string" ? result : JSON.stringify(result, undefined, "\t"))
		return !gracely.Error.is(result)
	}
})
