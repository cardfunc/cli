import * as gracely from "gracely"
import * as cardModel from "@payfunc/model-card"
import * as Authorization from "../Authorization"
import { addCommand } from "./module"

addCommand({
	name: "legacy",
	description: "Creates, captures and refunds an authorization w/o card tokens.",
	examples: [],
	execute: async (connection, argument, flags) => {
		let result: boolean
		const creatable: cardModel.Authorization.Creatable = {
			amount: 13.37,
			currency: "SEK",
			card: {
				pan: "4111111111111111",
				expires: [2, 22],
				csc: "987",
			},
		}
		const token = connection && (await Authorization.create(connection, creatable, true))
		if ((result = !gracely.Error.is(token))) {
			const a = (token && (await cardModel.Authorization.verify(token))) || undefined
			const c = connection && token && (await Authorization.capture(connection, token))
			const r = connection && token && (await Authorization.refund(connection, token))
			result =
			cardModel.Authorization.is(a) &&
				cardModel.Capture.is(c) &&
				cardModel.Refund.is(r) &&
				creatable.amount == a.amount &&
				creatable.amount == c.amount &&
				creatable.amount == r.amount
		}
		return result
	},
})
