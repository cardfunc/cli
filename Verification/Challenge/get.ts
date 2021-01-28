import * as paramly from "paramly"
import { Challenge } from "./index"
import { Connection } from "../../Connection"
import * as utility from "../../utility"
import * as authly from "authly"
import * as model from "@payfunc/model-card"
import { default as fetch } from "node-fetch"
import * as querystring from "querystring"

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
	const challengeNotificationUrl =
		merchant.card.url.endsWith("7082") || merchant.card.url.endsWith("cardfunc.com")
			? merchant.card.url + "/card/" + token + "/verification?mode=show&merchant=" + (merchant.card.id ?? merchant.sub)
			: merchant.card.url + "/card/" + token + "/verification?mode=show"
	let challengeData = authly.Base64.encode(
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
			creq: challengeData,
		},
		true
	)
	challengeData = (
		await utility.postForm(dialog3d?.action, {
			threeDSServerTransID: dialog3d?.threeDSServerTransID,
			challengeStatus: "pass",
		})
	)?.cres
	const cardToken = challengeData
		? await fetch(challengeNotificationUrl, {
				body: querystring.encode({ cres: challengeData }),
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
			const merchant = (await authly.Verifier.create("public").verify(
				connection?.credentials?.keys.public
			)) as model.Merchant
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
