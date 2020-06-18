import * as gracely from "gracely"
import * as cardfunc from "@cardfunc/model"
import { Connection } from "../Connection"
import { addCommand } from "./Module"

export async function create(connection: Connection, merchant: cardfunc.Merchant.Creatable): Promise<cardfunc.Merchant | gracely.Error> {
		return connection.post<cardfunc.Merchant>("admin", `merchant`, merchant)
}
addCommand({
	name: "create",
	description: "Create a new merchant.",
	examples: [
		["\'<cardfunc json>\'", "Create a new merchant."],
	],
	execute: async (connection, argument, flags) => {
		const merchant = JSON.parse(argument[0])
		const result = connection && cardfunc.Merchant.Creatable.is(merchant) && await create(connection, merchant)
		console.info(JSON.stringify(result, undefined, "\t"))
		return !gracely.Error.is(result)
	}
})
