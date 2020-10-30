import * as gracely from "gracely"
import * as authly from "authly"
import * as cardModel from "@payfunc/model-card"
import * as Authorization from "../Authorization"
import * as Card from "../Card"
import { addCommand } from "./module"

addCommand({
	name: "csc",
	description: "Invalid CSC (40120)",
	examples: [],
	execute: async (connection, argument, flags) => {
		const card = connection && await Card.create(connection, {
			pan: "4200000000000000", // Force trigger "Invalid CSC (40120)" part 1/2
			expires: [ 2, 22 ],
			csc: "988", // Does only (in test systems) cause clearhaus to respond with status 20000 (approved) and csc: { present: true, matches: false }
		})
		const creatable = authly.Token.is(card) && {
			amount: 401.20, // Force trigger "Invalid CSC (40120)" part 2/2
			currency: "SEK",
			card,
		}
		const token = connection && cardModel.Authorization.Creatable.is(creatable) && await Authorization.create(connection, creatable, true)
		return gracely.client.malformedContent.is(token) && token.content.property == "card.csc"
	}
})
