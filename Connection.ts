import { default as fetch, RequestInit } from "node-fetch"
import * as authly from "authly"
import * as gracely from "gracely"
import * as cardfunc from "@cardfunc/model"
import * as Server from "./Server"

export class Connection {
	constructor(readonly storage: Server.Storage, readonly credentials: Server.Credentials | undefined, readonly url: string = "") {
	}
	private async fetch<T>(authentication: "private" | "public" | "admin", resource: string, init: RequestInit, body?: any): Promise<T | gracely.Error> {
		let result: T | gracely.Error
		if (!this.credentials)
			result = gracely.client.notFound()
		else {
			const url = this.url + "/" + resource
			if (body)
				init.body = JSON.stringify(body)
			init = {
				...init,
				headers: {
					"content-type": "application/json; charset=utf-8",
					accept: "application/json; charset=utf-8",
					authorization: authentication == "admin" ? `Basic ${ authly.Base64.encode(this.credentials.administrator?.user + ":" + this.credentials.administrator?.password, "standard", "=") }` : `Bearer ${ this.credentials.keys[authentication] }`,
					...init.headers,
				},
			}
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
	change(properties: { storage?: Server.Storage | string, credentials?: Server.Credentials | string, url?: string }): Promise<Connection | undefined> {
		return Connection.create(properties.storage ?? this.storage, properties.credentials ?? this.credentials, properties.url ?? this.url)
	}
	static async create(storage: string | Server.Storage, server?: string | Server.Credentials, url?: string): Promise<Connection | undefined> {
		if (typeof storage == "string")
			storage = Server.Storage.open(storage)
		if (typeof server == "string")
			server = await storage.load(server)
		const merchantKey = server && await cardfunc.Merchant.Key.KeyInfo.unpack(server.keys.public, "public")
		return new Connection(storage, server, url ?? storage.name == "cardfunc" ? merchantKey?.card.url : merchantKey?.iss)
	}
}
