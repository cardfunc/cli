import * as paramly from "paramly"
import * as authly from "authly"
import * as model from "@payfunc/model-card"
import { Connection } from "../Connection"
import { Challenge } from "./Challenge"
import { Error as VerificationError } from "./Error"
import { Method } from "./Method"
import { Pares } from "./Pares"

export async function get(
	request: VerificationError | { url: string; [property: string]: string | undefined },
	merchant: model.Merchant & authly.Payload,
	cardToken: authly.Token
): Promise<string | undefined> {
	let result: string | undefined
	if (Pares.is(request))
		result = await Pares.get(request, merchant, cardToken)
	else if (Method.is(request))
		result = await Method.get(request, merchant, cardToken)
	else if (Challenge.is(request))
		result = await Challenge.get(request, merchant, cardToken)
	return result
}

export namespace get {
	export const command: paramly.Command<Connection> = {
		name: "get",
		description: "Performs 3D. Only works with 3D simulator.",
		examples: [
			[
				"<url> <cardToken> <pareq> | <url> <cardToken> <transactionId> | <url> <cardToken> <transactionId> <acsTransactionId>",
				"Perform 3D for given URL and PaReq.",
			],
		],
		execute: async (connection, argument, flags) => {
			const merchant = await authly.Verifier.create<model.Merchant>().verify(
				connection?.credentials?.keys.public,
				"public"
			)
			const result = merchant
				? argument.length == 3
					? argument[2].match(/^\w{8}-\w{4}-/)
						? await get({ url: argument[0], transactionId: argument[2] }, merchant, argument[1])
						: await get({ url: argument[0], pareq: argument[2] }, merchant, argument[1])
					: argument.length == 4
					? await get(
							{ url: argument[0], transactionId: argument[2], ascTransactionId: argument[3] },
							merchant,
							argument[1]
					  )
					: undefined
				: undefined
			return !!result
		},
	}
}
