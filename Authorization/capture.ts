import * as gracely from "gracely"
import * as paramly from "paramly"
import * as cardModel from "@payfunc/model-card"
import { Connection } from "../Connection"

export function capture(
	connection: Connection,
	authorization: string,
	amount?: number
): Promise<cardModel.Capture | gracely.Error> {
	return connection.post<cardModel.Capture>(
		"private",
		`authorization/${authorization}/capture`,
		amount ? { amount } : {}
	)
}
export namespace capture {
	export const command: paramly.Command<Connection> = {
		name: "capture",
		description: "Captures authorization.",
		examples: [["<authorization> <amount>", "Captures authorization."]],
		execute: async (connection, argument, flags) => {
			const amount = Number.parseFloat(argument[1])
			const result = connection && (await capture(connection, argument[0], amount))
			console.info(JSON.stringify(result, undefined, "\t"))
			return cardModel.Capture.is(result)
		},
	}
}
