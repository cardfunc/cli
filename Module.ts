import * as dotenv from "dotenv"
dotenv.config()
import * as authly from "authly"
import { Command } from "./Command"
import { Connection } from "./Connection"
import * as configuration from "./package.json"

export interface Module {
	readonly name: string
	readonly commands: { [command: string]: Command | undefined }
}
export namespace Module {
	const modules: { [name: string]: Module } = {}
	export async function execute(module: string, command: string, argument: string[], flags: { [flag: string]: string }): Promise<boolean> {
		const connection = await Connection.create({
			name: "env",
			keys: {
				private: process.env.privateKey as authly.Token,
				public: process.env.publicKey as authly.Token,
			},
			administrator: { user: process.env.adminUser!, password: process.env.adminPassword! },
		})
		return connection && (modules[module]?.commands[command] ? modules[module]?.commands[command]?.execute(connection, argument, flags) : modules[module]?.commands._?.execute(connection, [command, ...argument], flags)) || false
	}
	export function register(module: Module, ...names: string[]): void {
		names.forEach(name => modules[name] = module)
	}
	Module.register({
		name: "help",
		commands: {
			_: {
				name: "_",
				description: "",
				examples: [
					["", "Shows module overview."],
					["<module>", "Shows help for specific module."],
					["<module> <command>", "Shows help for specific command."],
				],
				execute: async (connection, argument, flags) => {
					const module = argument.length > 0 && modules[argument[0]]
					const command = module && argument.length > 1 && module.commands[argument[1]]
					console.log("\nCardFunc CLI\n")
					if (command && module)
						console.log(`cardfunc ${ module.name } ${ command.name } <command>\n\n${ command.description }\n\nCommands:\n${ command.examples.map(example => `${ example.join("\t") }`).join("\n") }\n`)
					else if (module)
						console.log(`cardfunc ${ module.name } <command>\n\nCommands:\n${ [...new Set(Object.values(module.commands))].map(c => `${ c?.name }\t${ c?.description }`).join("\n") }\n`)
					else
						console.log(`cardfunc help <module>\n\nModules:\n${ [...new Set(Object.values(modules))].map(m => m?.name).join("\n") }\n`)
					return true
				},
			},
		}
	}, "help", "h", "?")
	Module.register({
		name: "version",
		commands: {
			_: {
				name: "_",
				description: "Show version.",
				examples: [],
				execute: async (connection, argument, flags) => {
					console.log("CardFunc CLI\nversion: " + configuration.version + "\n")
					return true
				},
			}
		}
	}, "version", "v")
}
