import * as authly from "authly"
import * as model from "@payfunc/model-card"
import { Challenge as VerificationChallenge } from "./Challenge"
import { Error as VerificationError } from "./Error"
import { get as verificationGet } from "./get"
import { Method as VerificationMethod } from "./Method"
import { Pares as VerificationPares } from "./Pares"

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
	export async function generateNotificationUrl(merchant: model.Merchant & authly.Payload, token: authly.Token) {
		const card: model.Card.Token | model.Card.V1.Token | undefined =
			(await model.Card.Token.verify(token)) ?? (await model.Card.V1.Token.verify(token))
		return model.Card.Token.is(card)
			? merchant.card.url +
					"/card/" +
					(card
						? card.encrypted + card.expires[0].toString().padStart(2, "0") + card.expires[1].toString().padStart(2, "0")
						: token) +
					"/verification?mode=show"
			: merchant.card.url +
					"/card/" +
					(card?.card ?? token) +
					"/verification?mode=show&merchant=" +
					(merchant.card.id ?? merchant.sub)
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
