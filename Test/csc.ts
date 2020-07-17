import * as gracely from "gracely"
import * as authly from "authly"
import * as cardfunc from "@cardfunc/model"
import * as Authorization from "../Authorization"
import * as Card from "../Card"
import { addCommand } from "./module"

addCommand({
	name: "csc",
	description: "Invalid CSC (40120)",
	examples: [],
	execute: async (connection, argument, flags) => {
		const card = connection && await Card.create(connection, {
			pan: "4111111111111111",
			expires: [ 2, 22 ],
			csc: "988",
		})
		const creatable = authly.Token.is(card) && {
			amount: 13.37,
			currency: "SEK",
			card,
		}
		const token = connection && cardfunc.Authorization.Creatable.is(creatable) && await Authorization.create(connection, creatable, true)
		return gracely.client.malformedContent.is(token) && token.content.property == "card.csc"
	}
})
