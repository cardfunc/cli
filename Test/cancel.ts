import * as gracely from "gracely"
import * as cardfunc from "@cardfunc/model"
import * as Authorization from "../Authorization"
import { addCommand } from "./Module"

addCommand({
	name: "cancel",
	description: "Creates and cancels an authorization.",
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
		const token = await Authorization.create(connection, creatable)
		if (!(result = gracely.Error.is(token))) {
			const a = await cardfunc.Authorization.verify(token) || undefined
			const c = await Authorization.cancel(connection, token)
			result = cardfunc.Authorization.is(a) && a.amount == creatable.amount && cardfunc.Cancel.is(c)
		}
		return result
	}
})
