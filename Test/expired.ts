import * as gracely from "gracely"
import * as cardfunc from "@cardfunc/model"
import * as Authorization from "../Authorization"
import { addCommand } from "./Module"

addCommand({
	name: "expired",
	description: "Invalid expire date (40130)",
	examples: [],
	execute: async (connection, argument, flags) => {
		let result: boolean
		const creatable: cardfunc.Authorization.Creatable = {
			amount: 13.37,
			currency: "SEK",
			card: {
				pan: "4111111111111111",
				expires: [ 2, 20 ],
				csc: "987",
			},
		}
		const token = connection && await Authorization.create(connection, creatable, true)
		return gracely.client.malformedContent.is(token) &&
			token.content.property == "card.pan" &&
			token.content.description == "Card expired"
	}
})
