import * as gracely from "gracely"
import * as authly from "authly"
import * as cardfunc from "@cardfunc/model"
import { Connection } from "../Connection"
import { getPares } from "./getPares"
import { post } from "./post"

export async function create(connection: Connection, authorization: cardfunc.Authorization.Creatable): Promise<authly.Token | gracely.Error> {
	const error = await post(connection, authorization)
	const pares = (await getPares(error)).PaRes
	return connection.postToken("public", "authorization", { ...authorization, pares })
}
