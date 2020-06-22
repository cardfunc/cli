import * as paramly from "paramly"
import { application } from "../application"
import { Connection } from "../Connection"

const commands: { [command: string]: paramly.Command<Connection> } = {}

export function addCommand(command: paramly.Command<Connection>) {
	commands[command.name] = command
}

application.register({
	name: "card",
	description: "Creates, updates and lists cards.",
	commands,
}, "card", "c")
