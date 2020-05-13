import * as gracely from "gracely"
import * as cardfunc from "@cardfunc/model"
import { Connection } from "../Connection"

export function refund(connection: Connection, authorization: string, amount?: number): Promise<cardfunc.Refund | gracely.Error> {
	return connection.post<cardfunc.Refund>("private", `authorization/${ authorization }/refund`, amount ? amount : { amount })
}
