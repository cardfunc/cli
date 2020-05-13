import { default as fetch } from "node-fetch"
import * as querystring from "querystring"
export async function postForm(url: string, data: { [field: string]: string }): Promise<{ [field: string]: string }> {
	let result: { [field: string]: string } = {}
	const response = await fetch(url, { body: querystring.encode(data), method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" } })
	const body = response.ok && await response.text()
	result = body && body.match(/input type="hidden" name="([a-zA-z0-9]+)" value="(.+)"/g)?.map(v => v.match(/input type="hidden" name="([a-zA-z0-9]+)" value="(.+)"/)?.slice(1)).reduce<{ [field: string]: string }>((r, e) => {
		if (e)
			r[e[0]] = e[1]
		return r
	}, {}) || {}
	return result
}
