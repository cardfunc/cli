import * as paramly from "paramly"
import { Challenge } from "./index"
import { Connection } from "../../Connection"
import * as utility from "../../utility"
import * as authly from "authly"
import * as model from "@payfunc/model-card"

export async function get(
	request: { url: string; transactionId: string; acsTransID: string } | Challenge,
	merchant: model.Merchant & authly.Payload,
	token: authly.Token
): Promise<string | undefined> {
	if (Challenge.is(request))
		request = {
			url: request.content.details.url,
			transactionId: request.content.details.data?.threeDSServerTransID ?? "",
			acsTransID: request.content.details.data?.acsTransID ?? "",
		}
	const challengeNotificationUrl =
		merchant.card.url.endsWith("7082") || merchant.card.url.endsWith("cardfunc.com")
			? merchant.card.url + "/card/" + token + "/verification?mode=show&merchant=" + (merchant.card.id ?? merchant.sub)
			: merchant.card.url + "/card/" + token + "/verification?mode=show"
	const challengeData = authly.Base64.encode(
		JSON.stringify({
			threeDSServerTransID: request.transactionId,
			threeDSMethodNotificationURL: challengeNotificationUrl,
		}),
		"url",
		"="
	)
	const dialog3d = await utility.postForm(request.url, {
		threeDSMethodData: challengeData,
	})
	return (await utility.postForm(request.url, { ...dialog3d }))?.threeDSMethodData
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
					? await get({ url: argument[0], transactionId: argument[1], acsTransID: argument[2] }, merchant, argument[3])
					: undefined
			console.info(result)
			return !!result
		},
	}
}
