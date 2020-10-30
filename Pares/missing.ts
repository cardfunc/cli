import * as gracely from "gracely"

export function missing(
	value: any
): value is gracely.Error & {
	status: 400
	type: "missing property"
	content: { property: "pares"; type: "string"; url: string; pareq: string }
} {
	return (
		gracely.client.missingProperty.is(value) &&
		typeof value.content == "object" &&
		value.content.property == "pares" &&
		value.content.type == "string" &&
		typeof value.content.url == "string" &&
		typeof value.content.pareq == "string"
	)
}
