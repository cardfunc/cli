import * as gracely from "gracely"
import * as authly from "authly"
import * as cardModel from "@payfunc/model-card"
import { Connection } from "../Connection"

export function post(connection: Connection, authorization: cardModel.Authorization.Creatable): Promise<authly.Token | gracely.Error> {
	return connection.postToken("public", "authorization", authorization)
}
