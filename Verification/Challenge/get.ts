import * as paramly from "paramly"
import { Challenge } from "./index"
import { Connection } from "../../Connection"
import * as utility from "../../utility"
import * as authly from "authly"
import * as model from "@payfunc/model-card"
import { default as fetch } from "node-fetch"
import * as querystring from "querystring"
import { Verification } from "../index"

export async function get(
	request: { url: string; transactionId: string; acsTransactionID: string } | Challenge,
	merchant: model.Merchant & authly.Payload,
	token: authly.Token
): Promise<string | undefined> {
	if (Challenge.is(request))
		request = {
			url: request.content.details.url,
			transactionId: request.content.details.data?.threeDSServerTransID ?? "",
			acsTransactionID: request.content.details.data?.acsTransID ?? "",
		}
	const challengeRequest = authly.Base64.encode(
		JSON.stringify({
			threeDSServerTransID: request.transactionId,
			acsTransId: request.acsTransactionID,
			messageVersion: "2.1.0",
			messageType: "CReq",
			challengeWindowSize: "01",
		}),
		"url",
		"="
	)
	const dialog3d = await utility.postForm(
		request.url,
		{
			creq: challengeRequest,
		},
		true
	)
	const challengeResponse = (
		await utility.postForm(dialog3d?.action, {
			threeDSServerTransID: dialog3d?.threeDSServerTransID,
			challengeStatus: "pass",
		})
	)?.cres
	const cardToken = challengeResponse
		? await fetch(await Verification.generateNotificationUrl(merchant, token), {
				body: querystring.encode({ cres: challengeResponse }),
				method: "POST",
				headers: { "content-type": "application/x-www-form-urlencoded" },
		  })
		: undefined
	return await cardToken?.text()
}

export namespace get {
	export const command: paramly.Command<Connection> = {
		name: "get",
		description: "Performs challenge 3D. Only works with 3D simulator.",
		examples: [
			["<url> <transactionId> <acsTransID> <cardToken>", "Perform challenge 3D for given URL and transactionId."],
		],
		execute: async (connection, argument, flags) => {
			const merchant = await authly.Verifier.create<model.Merchant>().verify(
				connection?.credentials?.keys.public,
				"public"
			)
			const result =
				merchant && argument.length > 3
					? await get(
							{ url: argument[0], transactionId: argument[1], acsTransactionID: argument[2] },
							merchant,
							argument[3]
					  )
					: undefined
			console.info(result)
			return !!result
		},
	}
}
