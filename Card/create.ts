import * as gracely from "gracely"
import * as authly from "authly"
import * as paramly from "paramly"
import * as cardfunc from "@cardfunc/model"
import { Connection } from "../Connection"

export async function create(connection: Connection, card: cardfunc.Card.Creatable): Promise<authly.Token | gracely.Error> {
		return connection.post<authly.Token>("public", "card", card)
}
export namespace create {
	export const command: paramly.Command<Connection> = {
		name: "create",
		description: "Create a new card.",
		examples: [
			["4111111111111111 2/22 987", "Create a new card."],
			["4111111111111111 2/22 987 <pares>", "Create a new card with PaRes."],
		],
		execute: async (connection, argument, flags) => {
			const expires = argument[1].split("/", 2).map(e => Number.parseInt(e))
			const result = connection &&
				cardfunc.Card.Expires.is(expires) &&
				await create(connection, {
					pan: argument[0],
					expires,
					csc: argument[2],
					pares: argument[3] == "auto" || !argument[3] ? undefined : argument[3],
				})
			console.info(typeof result == "string" ? result : JSON.stringify(result, undefined, "\t"))
			return !!(typeof result == "string" && authly.Token.is(result)) // TODO: change to cardfunc.card.verify
		}
	}
}
