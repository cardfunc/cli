import * as gracely from "gracely"
import * as cardfunc from "@cardfunc/model";
import * as authly from "authly";
import { Connection } from "../Connection";
import { addCommand } from "./Module"

export async function create(connection: Connection, card: cardfunc.Card.Creatable, publicKey: authly.Token): Promise<cardfunc.Card | gracely.Error> {
		return connection.post<cardfunc.Card>("admin", `card`, card)
}
addCommand({
	name: "create",
	description: "Create a new card.",
	examples: [
		["4111111111111111 2/22 987 <pares> <public key>", "Create a new card."],
	],
	execute: async (connection, argument, flags) => {
		const expires = argument[1].split("/", 2).map(e => Number.parseInt(e))
		const result = connection && 
			cardfunc.Card.Expires.is(expires) &&
			await create(connection, {
				card: {
					pan: argument[0],
					expires,
					csc: argument[2],
				},
				pares: argument[3] == "auto" ? undefined : argument[3],
			}, argument[5] == "auto")
		console.info("\n" + (typeof result == "string" ? result : JSON.stringify(result, undefined, "\t")))
		return !!(typeof result == "string" && cardfunc.Authorization.verify(result))
		//console.info(JSON.stringify(result, undefined, "\t"))
		//return !gracely.Error.is(result)
	}
})
