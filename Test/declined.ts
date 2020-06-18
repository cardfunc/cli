import * as gracely from "gracely"
import * as cardfunc from "@cardfunc/model"
import * as Authorization from "../Authorization"
import { addCommand } from "./Module"

addCommand({
	name: "declined",
	description: "Declined by issuer or card scheme (40410)",
	examples: [],
	execute: async (connection, argument, flags) => {
		const creatable: cardfunc.Authorization.Creatable = {
			amount: 13.37,
			currency: "SEK",
			card: {
				pan: "420000404100000",
				expires: [ 2, 22 ],
				csc: "987",
			},
		}
		const token = connection && await Authorization.create(connection, creatable, true)
		return gracely.client.malformedContent.is(token) &&
			token.content.property == "card.pan" &&
			token.content.description == "Invalid card number."
	}
})
