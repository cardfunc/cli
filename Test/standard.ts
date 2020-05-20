import * as gracely from "gracely"
import * as cardfunc from "@cardfunc/model"
import * as Authorization from "../Authorization"
import { addCommand } from "./Module"

addCommand({
	name: "standard",
	description: "Creates, captures and refunds an authorization.",
	examples: [],
	execute: async (connection, argument, flags) => {
		let result: boolean
		const creatable: cardfunc.Authorization.Creatable = {
			amount: 13.37,
			currency: "SEK",
			card: {
				pan: "4111111111111111",
				expires: [ 2, 22 ],
				csc: "987",
			},
		}
		const token = connection && await Authorization.create(connection, creatable)
		if (result = !gracely.Error.is(token)) {
			const a = token && await cardfunc.Authorization.verify(token) || undefined
			const c = connection && token && await Authorization.capture(connection, token)
			const r = connection && token && await Authorization.refund(connection, token)
			result = cardfunc.Authorization.is(a) && cardfunc.Capture.is(c) && cardfunc.Refund.is(r) && creatable.amount == a.amount && creatable.amount == c.amount && creatable.amount == r.amount
		}
		return result
	}
})
