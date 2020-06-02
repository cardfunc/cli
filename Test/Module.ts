import { Module } from "../Module"
import { Command } from "../Command"

const commands: { [command: string]: Command } = {}

export function addCommand(command: Command) {
	commands[command.name] = command
}

Module.register({
	name: "test",
	description: "Runs tests.",
	commands,
}, "test", "t")

addCommand({
	name: "_",
	description: "Runs tests.",
	examples: [["", "Invoke all tests."]],
	execute: async (connection, argument, flags) => {
		console.log("CardFunc Test\n")
		const result = (await Promise.all(Object.values(commands).filter(c => c.name != "_").map(async c => {
			const r = await c.execute(connection, argument, flags)
			console.log(c.name.padEnd(16, ".") + (r ? "ok" : "fail").padStart(4, "."))
			return r
		}))).every(r => r)
		console.log()
		return result
	}
})
