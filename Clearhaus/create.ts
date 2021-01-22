import * as gracely from "gracely"
import * as isoly from "isoly"
import * as authly from "authly"
import * as paramly from "paramly"
import * as model from "@payfunc/model"
import * as cardModel from "@payfunc/model-card"
import { default as fetch } from "node-fetch"
import { Connection } from "../Connection"
import * as clearhaus from "@payfunc/service-clearhaus"
// import { create as createCard } from "../Card"
import * as cardModule from "../Card"

export async function create(
	connection: Connection,
	request: clearhaus.api.Authorization.Request,
	card: authly.Token
): Promise<clearhaus.api.Authorization.Response | gracely.Error> {
	console.log("running create")
	const key = connection.credentials?.keys.public
	const merchant = key ? await model.Key.unpack(key, "public") : undefined
	console.log("key, merchant, request, card: ", key, { ...merchant, token: undefined }, request, card)
	//const result = key && merchant ? await outerHelper(key, merchant, request, card) : gracely.client.unauthorized()
	const result =
		key && merchant ? await clearhaus.authorization.create(key, merchant, request, card) : gracely.client.unauthorized()
	console.log("const result: ", result)
	return result
	// return connection.post<clearhaus.api.Authorization.Response>("public", "clearhaus", clearhaus)
}
interface Configuration {
	url: string
	key: string
}
async function outerHelper(
	key: authly.Token,
	merchant: model.Key,
	request: clearhaus.api.Authorization.Request,
	token: authly.Token
): Promise<clearhaus.api.Authorization.Response | gracely.Error> {
	console.log("a", merchant.card, merchant.card?.acquirer.protocol)
	return !merchant.card || merchant.card.acquirer.protocol != "clearhaus"
		? gracely.client.unauthorized()
		: outerPost<clearhaus.api.Authorization.Request, clearhaus.api.Authorization.Response | gracely.Error>(
				{ url: merchant.card.url, key },
				request,
				token
		  )
}
export async function outerPost<Request, Response>(
	configuration: Configuration,
	request: Request,
	token: authly.Token
): Promise<Response | gracely.Error> {
	console.log("b")
	return post(configuration, `card/${token}/clearhaus/authorization`, request)
}
async function post<Request, Response>(
	configuration: Configuration,
	endpoint: string,
	request: Request
): Promise<Response | gracely.Error> {
	console.log("c1")
	const response = await fetch(configuration.url + "/" + endpoint, {
		method: "POST",
		headers: { "Content-Type": "application/json; charset=utf-8", authorization: "Bearer " + configuration.key },
		body: JSON.stringify(request),
	}).catch(_ => undefined)
	console.log("c2")
	return !response
		? gracely.server.unavailable()
		: response.headers.get("Content-Type")?.startsWith("application/json")
		? response.json()
		: response.text()
}
export namespace create {
	export const command: paramly.Command<Connection> = {
		name: "create",
		description: "Create a clearhaus authorization.",
		examples: [
			["clearhaus", "Create a new clearhaus authorization."],
			[
				"clearhaus <card token> <amount> <currency> <recurring>",
				"Attempts to create a new authorization with clearhaus.",
			],
		],
		execute: async (connection, argument, flags) => {
			let result: clearhaus.api.Authorization.Response | gracely.Error
			if (argument.length < 3 || argument.length > 5)
				result = gracely.client.invalidContent("parameters", "3 or 4 arguments required.")
			else if (
				typeof Number.parseInt(argument[0]) != "number" ||
				isNaN(Number.parseInt(argument[0])) ||
				!isoly.Currency.is(argument[1]) ||
				!authly.Identifier.is(argument[2]) ||
				(argument.length == 4 && !(argument[3] == "true" || argument[3] == "false"))
			) {
				result = gracely.client.invalidContent("parameters", "Invalid parameter data.")
			} else {
				const card =
					connection &&
					(await cardModule.create(connection, {
						pan: "4111111111111111",
						expires: [2, 32],
						csc: "987",
					}))
				const request: clearhaus.api.Authorization.Request = {
					amount: Number.parseInt(argument[0]),
					currency: argument[1],
					reference: argument[2],
				}
				if (argument.length == 4)
					request.recurring = argument[3] == "true"
				console.info("card, request: ", card, request)
				result =
					!!connection && clearhaus.api.Authorization.Request.is(request) && !!card && !gracely.Error.is(card)
						? await create(connection, request, card)
						: gracely.client.invalidContent("parameters", "invalid input or unknown error")
				console.info("result from clearhaus create: ", result)
			}
			console.info(result) //JSON.stringify(result, undefined, "\t"))
			return !gracely.Error.is(result)
		},
	}
}
