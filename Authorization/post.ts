import * as gracely from "gracely"
import * as cardfunc from "@cardfunc/model"
import { Connection } from "../Connection"

export function post(connection: Connection, authorization: cardfunc.Authorization.Creatable): Promise<cardfunc.Authorization | gracely.Error> {
	return connection.post<cardfunc.Authorization>("public", "authorization", authorization)
}
