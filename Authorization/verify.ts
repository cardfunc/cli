import * as paramly from "paramly"
import * as cardfunc from "@cardfunc/model"
import { Connection } from "../Connection"


export function verify(authorization: string): Promise<cardfunc.Authorization | undefined> {
	return cardfunc.Authorization.verify(authorization)
}
export namespace verify {
	export const command: paramly.Command<Connection> = {
		name: "verify",
		description: "Verifies authorization.",
		examples: [
			["<authorization>", "Verifies authorization."],
		],
		execute: async (connection, argument, flags) => {
			const result = await verify(argument[0])
			console.info(JSON.stringify(result, undefined, "\t"))
			return !!result
		}
	}
}
