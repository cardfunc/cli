import * as paramly from "paramly"
import { Method } from "./index"
import { Connection } from "../../Connection"
import * as utility from "../../utility"
import * as authly from "authly"
import * as model from "@payfunc/model-card"
import { default as fetch } from "node-fetch"
import * as querystring from "querystring"

export async function get(
	request: { url: string; transactionId: string } | Method,
	merchant: model.Merchant & authly.Payload,
	token: authly.Token
): Promise<string | undefined> {
	if (Method.is(request))
		request = {
			url: request.content.details.url,
			transactionId: request.content.details.data?.threeDSServerTransID ?? "",
		}
	const methodNotificationUrl =
		merchant.card.url.endsWith("7082") || merchant.card.url.endsWith("cardfunc.com")
			? merchant.card.url + "/card/" + token + "/verification?mode=show&merchant=" + (merchant.card.id ?? merchant.sub)
			: merchant.card.url + "/card/" + token + "/verification?mode=show"
	let methodData = authly.Base64.encode(
		JSON.stringify({
			threeDSServerTransID: request.transactionId,
			threeDSMethodNotificationURL: methodNotificationUrl,
		}),
		"url",
		"="
	)
	await utility.postForm(request.url, {
		threeDSMethodData: methodData,
	})
	methodData = authly.Base64.encode(
		JSON.stringify({
			threeDSServerTransID: request.transactionId,
		}),
		"url",
		"="
	)
	const cardToken = await fetch(methodNotificationUrl, {
		body: querystring.encode({ threeDSMethodData: methodData }),
		method: "POST",
		headers: { "content-type": "application/x-www-form-urlencoded" },
	})
	return await cardToken?.text()
}

export namespace get {
	export const command: paramly.Command<Connection> = {
		name: "get",
		description: "Performs method 3D. Only works with 3D simulator.",
		examples: [["<url> <transactionId>", "Perform method 3D for given URL and transactionId."]],
		execute: async (connection, argument, flags) => {
			const merchant = (await authly.Verifier.create("public").verify(
				connection?.credentials?.keys.public
			)) as model.Merchant
			const result =
				merchant && argument.length > 2
					? await get({ url: argument[0], transactionId: argument[1] }, merchant, argument[2])
					: undefined
			console.info(result)
			return !!result
		},
	}
}
