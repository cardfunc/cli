import * as isoly from "isoly"
import * as cardfunc from "@cardfunc/model"
import { addCommand } from "./Module"
import * as gracely from "gracely"
import * as authly from "authly"
import { Connection } from "../Connection"
import { getPares, isParesError } from "./getPares"
import { post } from "./post"

export async function create(connection: Connection, authorization: cardfunc.Authorization.Creatable): Promise<authly.Token | gracely.Error> {
	const error = await post(connection, authorization)
	return isParesError(error) ? post(connection, { ...authorization, pares: (await getPares(error)).PaRes }) : error
}
addCommand({
	name: "create",
	description: "Creates a new authorization.",
	examples: [],
	execute: async (connection, argument, flags) => {
		const amount = Number.parseFloat(argument[0])
		const currency = argument[1]
		const expires = argument[3].split("/", 2).map(e => Number.parseInt(e))
		const result = connection &&
			isoly.Currency.is(currency) &&
			cardfunc.Card.Expires.is(expires) &&
			await create(connection, {
				amount, currency,
				card: {
					pan: argument[2],
					expires,
					csc: argument[4],
				},
				descriptor: argument[5],
				pares: argument[6]
			})
		console.info(typeof result == "string" ? result : JSON.stringify(result, undefined, "\t"))
		return !!(typeof result == "string" && cardfunc.Authorization.verify(result))
	}
})
