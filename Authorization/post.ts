import * as gracely from "gracely"
import * as authly from "authly"
import * as cardfunc from "@cardfunc/model"
import { Connection } from "../Connection"

export function post(connection: Connection, authorization: cardfunc.Authorization.Creatable): Promise<authly.Token | gracely.Error> {
	return connection.postToken("public", "authorization", authorization)
}
