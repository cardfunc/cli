import * as gracely from "gracely"
import * as cardfunc from "@cardfunc/model";
import { Connection } from "../Connection";
import { addCommand } from "./Module"

export async function update(connection: Connection, id: string, merchant: cardfunc.Merchant.Creatable): Promise<cardfunc.Merchant | gracely.Error> {
		return connection.put<cardfunc.Merchant>("admin", `merchant/${ id }`, merchant)
}
addCommand({
	name: "update",
	description: "Update merchant.",
	examples: [
		["<Id> \'<cardfunc json>\'", "Update merchant."],
	],
	execute: async (connection, argument, flags) => {
		const merchant = JSON.parse(argument[1])
		const id = argument[0]
		const result = connection && cardfunc.Merchant.Creatable.is(merchant) && await update(connection, id, merchant)
		console.info(JSON.stringify(result, undefined, "\t"))
		return !gracely.Error.is(result)
	}
})
