import * as gracely from "gracely"
import * as cardfunc from "@cardfunc/model"
import { Connection } from "../Connection"
import { addCommand } from "./Module"

export function cancel(connection: Connection, authorization: string): Promise<cardfunc.Cancel | gracely.Error> {
	return connection.post<cardfunc.Cancel>("private", `authorization/${ authorization }/cancel`, {})
}
addCommand({
	name: "cancel",
	description: "Cancels authorizations.",
	examples: [
		["<authorization>", "Cancels authorizations."],
	],
	execute: async (connection, argument, flags) => {
		const result = connection &&
			await cancel(connection, argument[0])
		console.info(JSON.stringify(result, undefined, "\t"))
		return cardfunc.Cancel.is(result)
	}
})