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
		["13.37 EUR 4111111111111111 2/22 987 <pares> <public key>", "Create a new card."],
	],
	execute: async (connection, argument, flags) => {
		
		const result = connection && cardfunc.Merchant.Creatable.is(merchant) && await create(connection, merchant)
		console.info(JSON.stringify(result, undefined, "\t"))
		return !gracely.Error.is(result)
	}
})
