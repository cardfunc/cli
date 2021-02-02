import * as paramly from "paramly"
import * as authly from "authly"
import { Pares } from "./index"
import { default as fetch } from "node-fetch"
import { Connection } from "../../Connection"
import * as utility from "../../utility"
import { Verification } from "../index"
import * as model from "@payfunc/model-card"
import * as querystring from "querystring"

export async function get(
	request: { url: string; pareq: string } | Pares,
	merchant: model.Merchant & authly.Payload,
	token: authly.Token
): Promise<string | undefined> {
	if (Pares.is(request))
		request = { url: request.content.details.url, pareq: request.content.details.data?.pareq ?? "" }
	const termUrl = await Verification.generateNotificationUrl(merchant, token)
	const dialog3d = await utility.postForm(request.url, {
		TermUrl: termUrl,
		PaReq: request.pareq,
		MD: "data",
	})
	const pares = (await utility.postForm(request.url, { ...dialog3d, authenticated: "authenticated", MD: "" }))?.PaRes
	const cardToken = await fetch(termUrl, {
		body: querystring.encode({ PaRes: pares }),
		method: "POST",
		headers: { "content-type": "application/x-www-form-urlencoded" },
	})
	return await cardToken?.text()
}

export namespace get {
	export const command: paramly.Command<Connection> = {
		name: "get",
		description: "Performs 3D. Only works with 3D simulator.",
		examples: [["<url> <cardToken> <pareq>", "Perform 3D for given URL and PaReq."]],
		execute: async (connection, argument, flags) => {
			const merchant = await authly.Verifier.create<model.Merchant>().verify(
				connection?.credentials?.keys.public,
				"public"
			)
			const result =
				merchant && argument.length > 2
					? await get({ url: argument[0], pareq: argument[2] }, merchant, argument[1])
					: undefined
			console.info(result)
			return !!result
		},
	}
}
