import * as paramly from "paramly"
import { Connection } from "../Connection"

export namespace simple {
	export const command: paramly.Command<Connection> = {
		name: "simple",
		description: "simple.",
		examples: [],
		execute: async (connection, argument, flags) => {
			console.log("hello")
			console.info("olleh")
			return true
		},
	}
}
