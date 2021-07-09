import * as KeyValueStore from "node-persist"
import { Credentials } from "./Credentials"

export class Storage {
	backend: KeyValueStore.LocalStorage
	name: string
	initialized: Promise<KeyValueStore.InitOptions>
	private constructor(name: string) {
		this.name = name
		this.backend = KeyValueStore.create({ dir: (process.env.HOME ?? ".") + "/." + name })
		this.initialized = this.backend.init()
	}
	async save(merchant: Credentials): Promise<boolean> {
		return !!((await this.initialized) && (await this.backend.setItem(merchant.name, merchant))).file
	}
	async load(name: string): Promise<Credentials | undefined> {
		const envName: string = name == "env" ? "" : name
		const envCapitalized: string | undefined =
			envName.length > 0 ? envName.substring(0, 1).toUpperCase() + envName.substring(1, envName.length) : undefined
		const result =
			this.checkEnv(name, envName) ??
			this.checkEnv(name, envCapitalized) ??
			((await this.initialized) && this.backend.getItem(name))
		return result
	}
	async list(): Promise<string[]> {
		return (await this.initialized) && this.backend.keys()
	}
	async remove(name: string): Promise<boolean> {
		const result = (await this.initialized) && (await this.backend.removeItem(name))
		return result.removed
	}
	private checkEnv(name: string, envName: string | undefined): Credentials | undefined {
		return envName != undefined && process.env["privateKey" + envName] && process.env["publicKey" + envName]
			? {
					name,
					keys: {
						private: process.env["privateKey" + envName] ?? undefined,
						public: process.env["publicKey" + envName] ?? undefined,
						agent: process.env["agentKey" + envName] ?? undefined,
					},
					administrator: {
						user: process.env["adminUser" + envName] ?? undefined,
						password: process.env["adminPassword" + envName] ?? undefined,
					},
			  }
			: undefined
	}
	private static opened: { [name: string]: Storage } = {}
	static open(name: string): Storage {
		const result = this.opened[name] ?? new Storage(name)
		this.opened[name] = result
		return result
	}
}
