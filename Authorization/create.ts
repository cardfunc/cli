import * as open from "open"
import * as isoly from "isoly"
import * as cardfunc from "@cardfunc/model"
import { addCommand } from "./Module"
import * as gracely from "gracely"
import * as authly from "authly"
import { Connection } from "../Connection"
import { getPares, isParesError } from "./getPares"
import { post } from "./post"

export async function create(connection: Connection, authorization: cardfunc.Authorization.Creatable, auto3d: boolean): Promise<authly.Token | gracely.Error> {
	const response = await post(connection, authorization)
	let result: authly.Token | gracely.Error
	if (!isParesError(response))
		result = response
	else if (auto3d)
		result = await post(connection, { ...authorization, pares: (await getPares(response)).PaRes })
	else {
		await open(`${ connection.url }/redirect/post?target=${ encodeURIComponent(response.content.url) }&PaReq=${ encodeURIComponent(response.content.pareq) }&MD=MD&TermUrl=${ encodeURIComponent(connection.url) }/emv3d/done/cli`)
		result = response
	}	
	return result
}
addCommand({
	name: "create",
	description: "Creates a new authorization.",
	examples: [
		["13.37 EUR 4111111111111111 2/22 987", "Create an authorization for EUR 13.37 with 3D Secure in browser."],
		["13.37 EUR 4111111111111111 2/22 987 auto", "Create an authorization for EUR 13.37."],
		["13.37 EUR 4111111111111111 2/22 987 <pares>", "Create an authorization for EUR 13.37 with 3D Secure."]
	],
	execute: async (connection, argument, flags) => {
		const amount = Number.parseFloat(argument[0])
		const currency = argument[1]
		const expires = argument[3].split("/", 2).map(e => Number.parseInt(e))
		const result = connection &&
			isoly.Currency.is(currency) &&
			cardfunc.Card.Expires.is(expires) &&
			await create(connection, {
				number: authly.Identifier.generate(4),
				amount, currency,
				card: {
					pan: argument[2],
					expires,
					csc: argument[4],
				},
				pares: argument[5] == "auto" ? undefined : argument[5],
				descriptor: argument[6],
			}, argument[5] == "auto")
		console.info("\n" + (typeof result == "string" ? result : JSON.stringify(result, undefined, "\t")))
		return !!(typeof result == "string" && cardfunc.Authorization.verify(result))
	}
})
