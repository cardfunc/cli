import { default as fetch, RequestInit } from "node-fetch"
import * as authly from "authly"
import * as gracely from "gracely"
import * as Server from "./Server/Credentials"

export class Connection {
	constructor(readonly merchant: Server.Credentials, readonly url: string) {
	}
	private async fetch<T>(authentication: "private" | "public" | "admin", resource: string, init: RequestInit, body?: any): Promise<T | gracely.Error> {
		const url = this.url + "/" + resource
		if (body)
			init.body = JSON.stringify(body)
		init = {
			...init,
			headers: {
				"content-type": "application/json; charset=utf-8",
				accept: "application/json; charset=utf-8",
				authorization: authentication == "admin" ? `Basic ${ authly.Base64.encode(this.merchant.administrator?.user + ":" + this.merchant.administrator?.password, "standard", "=") }` : `Bearer ${ this.merchant.keys[authentication] }`,
				...init.headers,
			},
		}
		let result: T | gracely.Error
		try {
			const response = await fetch(url, init)
			switch (response.headers.get("Content-Type")) {
				case "application/json; charset=utf-8":
					result = await response.json() as T
					break
				case "application/jwt; charset=utf-8":
					result = await response.text() as any as T
					break
				default:
					result = { status: response.status, type: "unknown" }
					break
			}
		} catch (error) {
			result = gracely.client.notFound()
		}
		return result
	}
	get<T>(authentication: "private" | "public" | "admin", resource: string): Promise<T | gracely.Error> {
		return this.fetch<T>(authentication, resource, { method: "GET" })
	}
	put<T>(authentication: "private" | "public" | "admin", resource: string, body: any): Promise<T | gracely.Error> {
		return this.fetch<T>(authentication, resource, { method: "PUT" }, body)
	}
	post<T>(authentication: "private" | "public" | "admin", resource: string, body: any): Promise<T | gracely.Error> {
		return this.fetch<T>(authentication, resource, { method: "POST" }, body)
	}
	postToken(authentication: "private" | "public" | "admin", resource: string, body: any): Promise<authly.Token | gracely.Error> {
		return this.fetch<authly.Token>(authentication, resource, { method: "POST", headers: { accept: "application/jwt; charset=utf-8" } }, body)
	}
	patch<T>(authentication: "private" | "public" | "admin", resource: string, body: any): Promise<T | gracely.Error> {
		return this.fetch<T>(authentication, resource, { method: "PATCH" }, body)
	}
	delete<T>(authentication: "private" | "public" | "admin", resource: string): Promise<T | gracely.Error> {
		return this.fetch(authentication, resource, { method: "DELETE" })
	}
	options<T>(authentication: "private" | "public" | "admin", resource: string): Promise<T | gracely.Error> {
		return this.fetch(authentication, resource, { method: "OPTIONS" })
	}
	static async create(server?: string | Server.Credentials, url?: string): Promise<Connection | undefined> {
		if (typeof server == "string")
			server = await Server.Credentials.load(server)
		const m = server && await authly.Verifier.create("public")?.verify(server.keys.public)
		return server && m && m.iss ? new Connection(server, url ?? m.iss) : undefined
	}
}
