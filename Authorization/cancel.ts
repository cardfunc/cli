import * as gracely from "gracely"
import * as cardfunc from "@cardfunc/model"
import { Connection } from "../Connection"

export function cancel(connection: Connection, authorization: string): Promise<cardfunc.Cancel | gracely.Error> {
	return connection.post<cardfunc.Cancel>("private", `authorization/${ authorization }/cancel`, {})
}
