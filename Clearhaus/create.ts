import * as gracely from "gracely"
import * as isoly from "isoly"
import * as authly from "authly"
import * as paramly from "paramly"
import * as model from "@payfunc/model"
import * as cardModel from "@payfunc/model-card"
import { Connection } from "../Connection"
import * as clearhaus from "@payfunc/service-clearhaus"
// import { create as createCard } from "../Card"
import * as cardModule from "../Card"

export async function create(
	connection: Connection,
	request: clearhaus.api.Authorization.Request,
	card: authly.Token
): Promise<clearhaus.api.Authorization.Response | gracely.Error> {
	const key = connection.credentials?.keys.public
	const merchant = key ? await model.Key.unpack(key, "public") : undefined
	return key && merchant
		? await clearhaus.authorization.create(key, merchant, request, card)
		: gracely.client.unauthorized()
	// return connection.post<clearhaus.api.Authorization.Response>("public", "clearhaus", clearhaus)
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
				typeof Number.parseInt(argument[1]) != "number" ||
				isNaN(Number.parseInt(argument[1])) ||
				!isoly.Currency.is(argument[2]) ||
				!authly.Identifier.is(argument[3]) ||
				(argument.length == 5 && (argument[4] == "true" || argument[4] == "false"))
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
					amount: Number.parseInt(argument[1]),
					currency: argument[2],
					reference: argument[3],
				}
				if (argument.length == 5)
					request.recurring = argument[4] == "true"
				result =
					!!connection && clearhaus.api.Authorization.Request.is(argument) && !!card && !gracely.Error.is(card)
						? await create(connection, request, card)
						: gracely.client.invalidContent("parameters", "invalid input or unknown error")
			}
			console.info(typeof result == "string" ? result : JSON.stringify(result, undefined, "\t"))
			return !!(typeof result == "string" && authly.Token.is(result))
		},
	}
}
