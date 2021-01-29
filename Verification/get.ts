import * as authly from "authly"
import * as paramly from "paramly"
import { Connection } from "../Connection"
import { Error as VerificationError } from "./Error"
import { Pares } from "./Pares"
import { Method } from "./Method"
import { Challenge } from "./Challenge"
import * as model from "@payfunc/model-card"

export async function get(
	request: VerificationError | { url: string; [property: string]: string | undefined },
	merchant?: model.Merchant & authly.Payload,
	cardToken?: authly.Token
): Promise<string | undefined> {
	let result: string | undefined
	if (Pares.is(request))
		result = await Pares.get(request)
	else if (Method.is(request) && merchant && cardToken)
		result = await Method.get(request, merchant, cardToken)
	else if (Challenge.is(request) && merchant && cardToken)
		result = await Challenge.get(request, merchant, cardToken)
	return result
}

export namespace get {
	export const command: paramly.Command<Connection> = {
		name: "get",
		description: "Performs 3D. Only works with 3D simulator.",
		examples: [
			[
				"<url> <pareq> | <url> <transactionId> <cardToken> | <url> <transactionId> <acsTransactionId> <cardToken>",
				"Perform 3D for given URL and PaReq.",
			],
		],
		execute: async (connection, argument, flags) => {
			const merchant = await authly.Verifier.create<model.Merchant>().verify(
				connection?.credentials?.keys.public,
				"public"
			)
			const result = merchant
				? argument.length == 2
					? await get({ url: argument[0], pareq: argument[1] })
					: argument.length == 3
					? await get({ url: argument[0], transactionId: argument[1] }, merchant, argument[2])
					: argument.length == 4
					? await get(
							{ url: argument[0], transactionId: argument[1], ascTransactionId: argument[2] },
							merchant,
							argument[3]
					  )
					: undefined
				: undefined
			return !!result
		},
	}
}
