import * as gracely from "gracely"

export interface Error {
	status: 400
	type: "malformed content"
	content: {
		property: string
		type: string
		description: "verification required"
		details: {
			visible: boolean
			method: "GET" | "POST"
			url: string
			data?: {
				[property: string]: string | undefined
			}
		}
	}
}

export namespace Error {
	export function is(value: any | gracely.Error): value is Error {
		const result =
			typeof value == "object" &&
			value.type == "malformed content" &&
			typeof value.content == "object" &&
			typeof value.content.property == "string" &&
			typeof value.content.type == "string" &&
			value.content.description == "verification required" &&
			typeof value.content.details == "object" &&
			typeof value.content.details.visible == "boolean" &&
			(value.content.details.method == "GET" || value.content.details.method == "POST") &&
			typeof value.content.details.url == "string" &&
			(value.content.details.data == undefined ||
				(typeof value.content.details.data == "object" &&
					Object.values(value.content.details.data).every(v => v == undefined || typeof v == "string")))
		return result
	}
}
