import * as gracely from "gracely"
import * as paramly from "paramly"
import * as cardfunc from "@cardfunc/model"
import { Connection } from "../Connection"

export function capture(connection: Connection, authorization: string, amount?: number): Promise<cardfunc.Capture | gracely.Error> {
	return connection.post<cardfunc.Capture>("private", `authorization/${ authorization }/capture`, amount ? { amount } : {})
}
export namespace capture {
	export const command: paramly.Command<Connection> = {
		name: "capture",
		description: "Captures authorization.",
		examples: [
			["<authorization> <amount>", "Captures authorization."],
		],
		execute: async (connection, argument, flags) => {
			const amount = Number.parseFloat(argument[1])
			const result = connection &&
				await capture(connection, argument[0], amount)
			console.info(JSON.stringify(result, undefined, "\t"))
			return cardfunc.Capture.is(result)
		}
	}
}
