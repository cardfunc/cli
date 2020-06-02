import { Command } from "./Command"
import { Connection } from "./Connection"
import * as configuration from "./package.json"

export interface Module {
	readonly name: string
	readonly description: string
	readonly commands: { [command: string]: Command | undefined }
}
export namespace Module {
	const flags: { [name: string]: number } = { s: 1, server: 1, u: 1, url: 1 }
	const modules: { [name: string]: Module } = {}
	export async function execute(argument: string[]): Promise<boolean> {
		let a: string[] = []
		const f: { [flag: string]: string[] } = {}
		let item: string | undefined
		while (item = argument.shift()) {
			if (item.startsWith("-")) {
				while (item.startsWith("-"))
					item = item.slice(1)
				f[item] = argument.splice(0, flags[item])
			} else
				a.push(item)
		}
		const connection = await Connection.create((f.s ?? f.server)?.[0] ?? "default", (f.u ?? f.url)?.[0])
		const module = modules[a.shift() ?? "?"] ?? modules["?"]
		const commandName = a.shift()
		let command = module.commands[commandName ?? "_"]
		if (!command) {
			command = module.commands._
			a = commandName ? [commandName, ...a] : a
		}
		return await command?.execute(connection, a, f) || false
	}
	export function register(module: Module, ...names: string[]): void {
		names.forEach(name => modules[name] = module)
	}
	register({
		name: "help",
		description: "Shows help.",
		commands: {
			_: {
				name: "",
				description: "",
				examples: [
					["", "Shows module overview."],
					["<module>", "Shows help for specific module."],
					["<module> <command>", "Shows help for specific command."],
				],
				execute: async (connection, argument, _) => {
					const module = argument.length > 0 && modules[argument[0]]
					const command = module && argument.length > 1 && module.commands[argument[1]]
					console.log("\nCardFunc CLI\n")
					if (command && module)
						console.log(`cardfunc ${ module.name } ${ command.name } <command>\n\n${ command.description }\n\nExamples:\n${ command.examples.map(example => `${ example.join("\t") }`).join("\n") }\n`)
					else if (module)
						console.log(`cardfunc ${ module.name } <command>\n\nCommands:\n${ [...new Set(Object.values(module.commands))].map(c => `${ c?.name }\t${ c?.description }`).join("\n") }\n`)
					else
						console.log(`To get started, set a server.\nThe server with the name default is used by default when no --server flag is used.\n\ncardfunc help <module>\n\nModules:\n${ [...new Set(Object.values(modules))].map(m => `${ m?.name.padEnd(16, " ")}${ m?.description.padStart(6, " ")}`).join("\n") }\n`)
					return true
				},
			},
		}
	}, "help", "h", "?")
	register({
		name: "version",
		description: "Shows version.",
		commands: {
			_: {
				name: "_",
				description: "Show version.",
				examples: [],
				execute: async (connection, argument, _) => {
					console.log("CardFunc CLI\nversion: " + configuration.version + "\n")
					return true
				},
			}
		}
	}, "version", "v")
}
