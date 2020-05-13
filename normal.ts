import * as fetch from "node-fetch"
import * as cardfunc from "@cardfunc/model"

export async function test(): Promise<boolean> {
	const request: cardfunc.Authorization.Creatable = {
		amount: 13.37,
		currency: "SEK",
		card: {
			pan: "4111111111111111",
			expires: [ 2, 22 ],
			csc: "987",
		},
	}
	const response = await fetch("", { body: request })
}
