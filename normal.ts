import { default as fetch } from "node-fetch"
import { FormData } from "@types/node-fetch"
import * as gracely from "gracely"
import * as cardfunc from "@cardfunc/model"
import { Connection } from "./Connection"

export async function test(connection: Connection): Promise<boolean> {
	const request: cardfunc.Authorization.Creatable = {
		amount: 13.37,
		currency: "SEK",
		card: {
			pan: "4111111111111111",
			expires: [ 2, 22 ],
			csc: "987",
		},
	}
	const error = await connection.post<cardfunc.Authorization>("public", "authorization", request)
	if (isParesError(error)) {
		const data = new FormData()
		data.set("pareq", error.content.pareq)
		const response = await fetch(error.content.url, { body: data })
		console.log(error)
	}
	return true
}

function isParesError(value: any): value is gracely.Error & { status: 400, type: "missing property", content: { property: "pares", type: "string", url: string, pareq: string } } {
	return gracely.client.missingProperty.is(value) &&
		typeof value.content == "object" &&
		value.content.property == "pares" &&
		value.content.type == "string" &&
		typeof value.content.url == "string" &&
		typeof value.content.pareq == "string"
}