import * as gracely from "gracely"
import * as cardfunc from "@cardfunc/model"
import * as Authorization from "../Authorization"
import { addCommand } from "./Module"

addCommand({
	name: "fraud",
	description: "Creates, captures and refunds an authorization.",
	examples: [],
	execute: async (connection, argument, flags) => {
		let result: boolean
		const creatable: cardfunc.Authorization.Creatable = {
			amount: 13.37,
			currency: "SEK",
			card: {
				pan: "420000404140000",
				expires: [ 2, 22 ],
				csc: "987",
			},
		}
		const token = connection && await Authorization.create(connection, creatable)
		return gracely.client.malformedContent.is(token) &&
			token.content.property == "card.pan" &&
			token.content.description == "Invalid card number."
	}
})
