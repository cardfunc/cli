import * as Server from "node-persist"
import * as authly from "authly"

const storage = Server.create({ dir: (process.env.HOME ?? ".") + "/.cardfunc" })
const initialized = storage.init()

export interface Credentials {
	name: string
	keys: { private: authly.Token, public: authly.Token }
	administrator?: { user: string, password: string }
}

export namespace Credentials {
	export async function save(merchant: Credentials): Promise<boolean> {
		return !!(await initialized && await storage.setItem(merchant.name, merchant)).file
	}
	export async function load(name: string): Promise<Credentials | undefined> {
		return name == "env" ? {
			name: "env",
			keys: {
				private: process.env.privateKey!,
				public: process.env.publicKey!,
			},
			administrator: { user: process.env.adminUser!, password: process.env.adminPassword! },
		} : await initialized && storage.getItem(name)
	}
	export async function list(): Promise<string[]> {
		return await initialized && storage.keys()
	}
}
