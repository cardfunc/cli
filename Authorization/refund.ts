import * as gracely from "gracely"
import * as paramly from "paramly"
import * as cardModel from "@payfunc/model-card"
import { Connection } from "../Connection"

export function refund(
	connection: Connection,
	authorization: string,
	amount?: number
): Promise<cardModel.Refund | gracely.Error> {
	return connection.post<cardModel.Refund>("private", `authorization/${authorization}/refund`, amount ? { amount } : {})
}
export namespace refund {
	export const command: paramly.Command<Connection> = {
		name: "refund",
		description: "Refunds authorization.",
		examples: [["<authentication> <amount>", "Refunds authorization."]],
		execute: async (connection, argument, flags) => {
			const amount = Number.parseFloat(argument[1])
			const result = connection && (await refund(connection, argument[0], amount))
			console.info(JSON.stringify(result, undefined, "\t"))
			return cardModel.Refund.is(result)
		},
	}
}
