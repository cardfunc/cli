import * as authly from "authly"
import * as gracely from "gracely"
import * as cardfunc from "@cardfunc/model"
import { Authentication } from "./Authentication"

export class Connection {
	constructor(readonly keys: Authentication, readonly url: string) {
	}
	private async fetch<T>(authentication: "private" | "public" | "admin", resource: string, init: RequestInit, body?: any): Promise<T | gracely.Error> {
		const url = this.url + resource
		if (body)
			init.body = JSON.stringify(body)
		init = {
			...init,
			headers: {
				...init.headers,
				"Content-Type": "application/json; charset=utf-8",
				Accept: "application/json; charset=utf-8",
				Authorization: authentication == "admin" ? `Basic ${ authly.Base64.encode(this.keys.admin.user + ":" + this.keys.admin.password, "url") }` : `Bearer ${ this.keys[authentication] }`,
			},
		}
		const response = await fetch(url, init)
		return response.headers.get("Content-Type") == "application/json; charset=utf-8" ? await response.json() as T | gracely.Error : { status: response.status, type: "unknown" }
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
	patch<T>(authentication: "private" | "public" | "admin", resource: string, body: any): Promise<T | gracely.Error> {
		return this.fetch<T>(authentication, resource, { method: "PATCH" }, body)
	}
	delete<T>(authentication: "private" | "public" | "admin", resource: string): Promise<T | gracely.Error> {
		return this.fetch(authentication, resource, { method: "DELETE" })
	}
	options<T>(authentication: "private" | "public" | "admin", resource: string): Promise<T | gracely.Error> {
		return this.fetch(authentication, resource, { method: "OPTIONS" })
	}
	static async create(keys: Authentication): Promise<Connection> {
		const merchant = await authly.Verifier.create("cardfunc", authly.Algorithm.none()).verify(keys.public)
		return new Connection(keys, merchant.iss)
	}
}