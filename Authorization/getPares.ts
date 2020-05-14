import * as gracely from "gracely"
import * as utility from "../utility"

function isParesError(value: any): value is gracely.Error & { status: 400, type: "missing property", content: { property: "pares", type: "string", url: string, pareq: string } } {
	return gracely.client.missingProperty.is(value) &&
		typeof value.content == "object" &&
		value.content.property == "pares" &&
		value.content.type == "string" &&
		typeof value.content.url == "string" &&
		typeof value.content.pareq == "string"
}

export async function getPares(error: gracely.Error): Promise<{ [field: string]: string }> {
	const dialog3d = isParesError(error) ? await utility.postForm(error.content.url, { TermUrl: "http://localhost", PaReq: error.content.pareq, MD: "data"}) : {}
	return isParesError(error) ? utility.postForm(error.content.url, { ...dialog3d, Authenticated: "authenticated", MD: "" }) : {}
}
