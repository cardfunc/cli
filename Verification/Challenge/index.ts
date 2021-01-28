import { Error as VerificationError } from "../Error"
import { get as challengeGet } from "./get"

const challengeModule = {
	name: "challenge",
	description: "Handles PaRes.",
	commands: {
		get: challengeGet.command,
	},
}

export type Challenge = VerificationError & {
	content: {
		details: {
			data?: {
				type: "challenge"
				threeDSServerTransID: string
				acsTransID: string
				messageVersion: string
				messageType: "CReq"
				challengeWindowSize: string
			}
		}
	}
}
export namespace Challenge {
	export function is(value: any | Challenge): value is Challenge {
		return (
			VerificationError.is(value) &&
			typeof value.content.details.data == "object" &&
			value.content.details.data.type == "challenge" &&
			typeof value.content.details.data.threeDSServerTransID == "string" &&
			typeof value.content.details.data.acsTransID == "string" &&
			typeof value.content.details.data.messageVersion == "string" &&
			value.content.details.data.messageType == "CReq" &&
			typeof value.content.details.data.challengeWindowSize == "string"
		)
	}
	export const get = challengeGet
	export const module = challengeModule
}
