import * as gracely from "gracely"
import * as paramly from "paramly"
import * as cardfunc from "@cardfunc/model"
import { Connection } from "../Connection"

export function refund(connection: Connection, authorization: string, amount?: number): Promise<cardfunc.Refund | gracely.Error> {
	return connection.post<cardfunc.Refund>("private", `authorization/${ authorization }/refund`, amount ? { amount } : {})
}
export namespace refund {
	export const command: paramly.Command<Connection> = {
		name: "refund",
		description: "Refunds authorization.",
		examples: [
			["<authentication> <amount>", "Refunds authorization."],
		],
		execute: async (connection, argument, flags) => {
			const amount = Number.parseFloat(argument[1])
			const result = connection &&
				await refund(connection, argument[0], amount)
			console.info(JSON.stringify(result, undefined, "\t"))
			return cardfunc.Refund.is(result)
		}
	}
}
