import * as authly from "authly"
import * as gracely from "gracely"
import * as paramly from "paramly"
import * as cardModel from "@payfunc/model-card"
import { Connection } from "../Connection"

export async function update(connection: Connection, token: authly.Token, card: Partial<cardModel.Card.Creatable>): Promise<authly.Token | gracely.Error> {
		return connection.patch<authly.Token>("public", `card/${ token }`, card)
}
export namespace update {
	export const command: paramly.Command<Connection> = {
		name: "update",
		description: "Update card.",
		examples: [
			["<token> 4111111111111111 2/22 987", "Update card."],
			["<token> 4111111111111111 2/22 987 <pares>", "Update card with PaRes."],
			["<token> <pares>", "Update pares."],
		],
		execute: async (connection, argument, flags) => {
			const card: Partial<cardModel.Card.Creatable> = {}
			if (argument.length == 2)
				card.pares = argument[1] == "auto" ? undefined : argument[1]
			else {
				const expires = argument[2].split("/", 2).map(e => Number.parseInt(e))
				card.pan = argument[1]
				if (cardModel.Card.Expires.is(expires))
					card.expires = expires
				card.csc = argument[3]
				card.pares = argument[4] == "auto" || !argument[4] ? undefined : argument[4]
			}
			const result = connection && await update(connection, argument[0], card)
			console.info(typeof result == "string" ? result : JSON.stringify(result, undefined, "\t"))
			return !gracely.Error.is(result)
		}
	}
}
