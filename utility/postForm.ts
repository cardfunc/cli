import { default as fetch } from "node-fetch"
import * as querystring from "querystring"
export async function postForm(
	url: string,
	data: { [field: string]: string },
	action = false
): Promise<{ [field: string]: string }> {
	let result: { [field: string]: string } = {}
	const response = await fetch(url, {
		body: querystring.encode(data),
		method: "POST",
		headers: { "content-type": "application/x-www-form-urlencoded" },
	})
	const body = response.ok && (await response.text())
	console.log("postForm response, body: ", response, body)
	if (!body)
		console.error(await response.text())
	result = body ? extractFromHtml(body, action) : {}
	return result
}
export function extractFromHtml(body: string, action = false) {
	let result: { [field: string]: string } = {}
	let matches = body
		.match(/input type="hidden" name="([a-zA-z0-9]+)" value="(.+)"/g)
		?.map(v => v.match(/input type="hidden" name="([a-zA-z0-9]+)" value="(.+)"/)?.slice(1))
	const formTarget =
		action && body ? body.match(/(action)="(.+)"/g)?.map(v => v.match(/(action)="(.+)"/)?.slice(1)) : undefined
	if (matches && formTarget)
		matches = matches.concat(formTarget)
	result =
		matches?.reduce<{ [field: string]: string }>((r, e) => {
			if (e)
				r[e[0]] = e[1]
			return r
		}, {}) ?? {}
	return result
}
