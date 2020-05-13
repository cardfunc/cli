import * as gracely from "gracely"
import * as cardfunc from "@cardfunc/model"
import { Connection } from "./Connection"
import * as Authorization from "./Authorization"

export async function test(connection: Connection): Promise<boolean> {
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
		const authorisation = await cardfunc.Authorization.verify(token) || undefined
		const capture = await Authorization.capture(connection, token)
		const refund = await Authorization.refund(connection, token)
		result = !!authorisation && !gracely.Error.is(capture) && !gracely.Error.is(refund) && authorisation.amount == capture.amount && authorisation.amount == refund.amount
	}
	return result
}
