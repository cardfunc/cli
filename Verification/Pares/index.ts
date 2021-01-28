import { Error as VerificationError } from "../Error"
import { get as paresGet } from "./get"

const paresModule = {
	name: "pares",
	description: "Handles PaRes.",
	commands: {
		get: paresGet.command,
	},
}

export type Pares = VerificationError & {
	content: {
		details: {
			data?: {
				pareq: string
			}
		}
	}
}
export namespace Pares {
	export function is(value: any | Pares): value is Pares {
		return VerificationError.is(value) && typeof value.content.details.data?.pareq == "string"
	}
	export const get = paresGet
	export const module = paresModule
}
