import * as gracely from "gracely"
import * as authly from "authly"
import * as cardfunc from "@cardfunc/model"
import * as Authorization from "../Authorization"
import * as Card from "../Card"
import { addCommand } from "./Module"

addCommand({
	name: "3d-problem",
	description: "3-D Secure problem (40300)",
	examples: [],
	execute: async (connection, argument, flags) => {
		const card = connection && await Card.create(connection, {
			pan: "420000403000000",
			expires: [ 2, 22 ],
			csc: "987",
		})
		const creatable = authly.Token.is(card) && {
			amount: 13.37,
			currency: "SEK",
			card,
		}
		const token = connection && cardfunc.Authorization.Creatable.is(creatable) && await Authorization.create(connection, creatable, true)
		return gracely.client.malformedContent.is(token) &&
			token.content.property == "card.pan" &&
			token.content.description == "Invalid card number."
	}
})
