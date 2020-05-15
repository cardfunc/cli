import * as gracely from "gracely"
import * as cardfunc from "@cardfunc/model"
import { Connection } from "../Connection"

export function capture(connection: Connection, authorization: string, amount?: number): Promise<cardfunc.Capture | gracely.Error> {
	return connection.post<cardfunc.Capture>("private", `authorization/${ authorization }/capture`, amount ? amount : { amount })
}
