import * as gracely from "gracely"
import * as cardfunc from "@cardfunc/model"
import * as Authorization from "../Authorization"
import { addCommand } from "./Module"

addCommand({
	name: "csc",
	description: "Invalid CSC (40120)",
	examples: [],
	execute: async (connection, argument, flags) => {
		const creatable: cardfunc.Authorization.Creatable = {
			amount: 13.37,
			currency: "SEK",
			card: {
				pan: "4111111111111111",
				expires: [ 2, 22 ],
				csc: "988",
			},
		}
		const token = connection && await Authorization.create(connection, creatable, true)
		return gracely.client.malformedContent.is(token) && token.content.property == "card.csc"
	}
})
