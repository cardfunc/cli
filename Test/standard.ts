import * as authly from "authly"
import * as cardModel from "@payfunc/model-card"
import * as Authorization from "../Authorization"
import * as Card from "../Card"
import { addCommand } from "./module"

addCommand({
	name: "standard",
	description: "Creates, captures and refunds an authorization.",
	examples: [],
	execute: async (connection, argument, flags) => {
		const card = connection && await Card.create(connection, {
			pan: "4111111111111111",
			expires: [ 2, 22 ],
			csc: "987",
		})
		const creatable = authly.Token.is(card) && {
			amount: 13.37,
			currency: "SEK",
			card,
		}
		const token = connection && cardModel.Authorization.Creatable.is(creatable) && await Authorization.create(connection, creatable, true)
		let result: boolean
		if (result = authly.Token.is(token)) {
			const a = await cardModel.Authorization.verify(token) || undefined
			const c = connection && token && await Authorization.capture(connection, token)
			const r = connection && token && await Authorization.refund(connection, token)
			result = cardModel.Authorization.Creatable.is(creatable) && cardModel.Authorization.is(a) && cardModel.Capture.is(c) && cardModel.Refund.is(r) && creatable.amount == a.amount && creatable.amount == c.amount && creatable.amount == r.amount
		}
		return result
	}
})
