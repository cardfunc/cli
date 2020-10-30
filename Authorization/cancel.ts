import * as gracely from "gracely"
import * as paramly from "paramly"
import * as cardModel from "@payfunc/model-card"
import { Connection } from "../Connection"

export function cancel(connection: Connection, authorization: string): Promise<cardModel.Cancel | gracely.Error> {
	return connection.post<cardModel.Cancel>("private", `authorization/${authorization}/cancel`, {})
}
export namespace cancel {
	export const command: paramly.Command<Connection> = {
		name: "cancel",
		description: "Cancels authorization.",
		examples: [["<authorization>", "Cancels authorization."]],
		execute: async (connection, argument, flags) => {
			const result = connection && (await cancel(connection, argument[0]))
			console.info(JSON.stringify(result, undefined, "\t"))
			return cardModel.Cancel.is(result)
		},
	}
}
