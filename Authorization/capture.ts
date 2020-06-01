import * as gracely from "gracely"
import * as cardfunc from "@cardfunc/model"
import { Connection } from "../Connection"
import { addCommand } from "./Module"

export function capture(connection: Connection, authorization: string, amount?: number): Promise<cardfunc.Capture | gracely.Error> {
	return connection.post<cardfunc.Capture>("private", `authorization/${ authorization }/capture`, amount ? { amount } : {})
}
addCommand({
	name: "capture",
	description: "Adds a new capture.",
	examples: [
		["<authentication> <amount>", "Captures authorizations."],
	],
	execute: async (connection, argument, flags) => {
		const amount = Number.parseFloat(argument[1])
		const result = connection &&
			await capture(connection, argument[0], amount)
		console.info(JSON.stringify(result, undefined, "\t"))
		return cardfunc.Capture.is(result)
	}
})
