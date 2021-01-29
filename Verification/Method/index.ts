import { Error as VerificationError } from "../Error"
import { get as methodGet } from "./get"

const methodModule = {
	name: "method",
	description: "Handles method.",
	commands: {
		get: methodGet.command,
	},
}

export type Method = VerificationError & {
	content: {
		details: {
			data?: {
				type: "method"
				threeDSServerTransID: string
			}
		}
	}
}
export namespace Method {
	export function is(value: any | Method): value is Method {
		return (
			VerificationError.is(value) &&
			typeof value.content.details.data == "object" &&
			value.content.details.data.type == "method" &&
			typeof value.content.details.data.threeDSServerTransID == "string"
		)
	}
	export const get = methodGet
	export const module = methodModule
}
