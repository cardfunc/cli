import { Module } from "./Module"

import "./Authorization"
import "./Merchant"
import "./Test"

async function run(argument: string[]): Promise<boolean> {
	argument = argument.slice(2)
	const module = argument.shift()
	const command = argument.shift()
	const result = await Module.execute(module ?? "_", command ?? "_", argument, {})
	console.log(result ? "succeeded" : "failed")
	return result
}
run(process.argv).then(result => process.exit(result ? 0 : 1), _ => process.exit(1))
