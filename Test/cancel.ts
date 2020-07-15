import * as gracely from "gracely"
import * as authly from "authly"
import * as cardfunc from "@cardfunc/model"
import * as Authorization from "../Authorization"
import * as Card from "../Card"
import { addCommand } from "./Module"

addCommand({
	name: "cancel",
	description: "Creates and cancels an authorization.",
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
		const token = connection && cardfunc.Authorization.Creatable.is(creatable) && await Authorization.create(connection, creatable, true)
		let result: boolean
		if (result = !gracely.Error.is(token)) {
			const a = token && await cardfunc.Authorization.verify(token) || undefined
			const c = connection && token && await Authorization.cancel(connection, token)
			result = cardfunc.Authorization.Creatable.is(creatable) && cardfunc.Authorization.is(a) && a.amount == creatable.amount && cardfunc.Cancel.is(c)
		}
		return result
	}
})
