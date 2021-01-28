import { get as verificationGet } from "./get"
import { Error as VerificationError } from "./Error"
import { Pares as VerificationPares } from "./Pares"
import { Method as VerificationMethod } from "./Method"
import { Challenge as VerificationChallenge } from "./Challenge"

const verificationModule = {
	name: "verification",
	description: "Handles Card Verification.",
	commands: {
		get: verificationGet.command,
	},
}

export namespace Verification {
	export function is(value: any | Pares): value is Pares {
		return VerificationError.is(value) && typeof value.content.details.data?.pareq == "string"
	}
	export type Error = VerificationError
	export namespace Error {
		export const is = VerificationError.is
	}
	export type Pares = VerificationPares
	export namespace Pares {
		export const is = VerificationPares.is
		export const get = VerificationPares.get
		export const module = VerificationPares.module
	}
	export namespace Method {
		export const is = VerificationMethod.is
		export const get = VerificationMethod.get
		export const module = VerificationMethod.module
	}
	export namespace Challenge {
		export const is = VerificationChallenge.is
		export const get = VerificationChallenge.get
		export const module = VerificationChallenge.module
	}
	export const get = verificationGet
	export const module = verificationModule
}
