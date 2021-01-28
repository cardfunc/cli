import * as paramly from "paramly"
import { Pares } from "./index"
import { Connection } from "../../Connection"
import * as utility from "../../utility"

export async function get(request: { url: string; pareq: string } | Pares): Promise<string | undefined> {
	if (Pares.is(request))
		request = { url: request.content.details.url, pareq: request.content.details.data?.pareq ?? "" }
	const dialog3d = await utility.postForm(request.url, {
		TermUrl: "http://localhost",
		PaReq: request.pareq,
		MD: "data",
	})
	return (await utility.postForm(request.url, { ...dialog3d, authenticated: "authenticated", MD: "" }))?.PaRes
}

export namespace get {
	export const command: paramly.Command<Connection> = {
		name: "get",
		description: "Performs 3D. Only works with 3D simulator.",
		examples: [["<url> <pareq>", "Perform 3D for given URL and PaReq."]],
		execute: async (connection, argument, flags) => {
			const result = await get({ url: argument[0], pareq: argument[1] })
			console.info(result)
			return !!result
		},
	}
}
