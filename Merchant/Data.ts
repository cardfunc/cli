import * as persist from "node-persist"
import * as authly from "authly"

const storage = persist.create({ dir: (process.env.HOME ?? ".") + "/.cardfunc" })
const initialized = storage.init()

export interface Data {
	name: string
	keys: { private: authly.Token, public: authly.Token }
	administrator?: { user: string, password: string }
}

export namespace Data {
	export async function save(merchant: Data): Promise<boolean> {
		return !!(await initialized && await storage.setItem(merchant.name, merchant)).file
	}
	export async function load(name: string): Promise<Data | undefined> {
		return name == "env" ? {
			name: "env",
			keys: {
				private: process.env.privateKey!,
				public: process.env.publicKey!,
			},
			administrator: { user: process.env.adminUser!, password: process.env.adminPassword! },
		} : await initialized && storage.getItem(name)
	}
}
