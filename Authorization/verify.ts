import * as paramly from "paramly"
import * as cardModel from "@payfunc/model-card"
import { Connection } from "../Connection"

export function verify(authorization: string): Promise<cardModel.Authorization | undefined> {
	return cardModel.Authorization.verify(authorization)
}
export namespace verify {
	export const command: paramly.Command<Connection> = {
		name: "verify",
		description: "Verifies authorization.",
		examples: [["<authorization>", "Verifies authorization."]],
		execute: async (connection, argument, flags) => {
			const result = await verify(argument[0])
			console.info(JSON.stringify(result, undefined, "\t"))
			return !!result
		},
	}
}
