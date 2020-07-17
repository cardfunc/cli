import * as paramly from "paramly"
import * as configuration from "./package.json"
import { Connection } from "./Connection"
import * as Authorization from "./Authorization"
import * as Card from "./Card"
import * as Server from "./Server"
import * as Test from "./Test"

export const application = new paramly.Application("CardFunc CLI", "cardfunc", configuration.version, [
		{
			short: "s",
			long: "server",
			arguments: 1,
			description: "Use diffrent server than default.",
			usage: "<server name>",
		},
		{
			short: "u",
			long: "url",
			arguments: 1,
			description: "Use diffrent url than default.",
			usage: "<url>",
		},
	],
	async (f) => Connection.create("cardfunc", (f.s ?? f.server)?.[0] ?? "default", (f.u ?? f.url)?.[0])
)
application.register(Authorization.module, "authorization", "a")
application.register(Card.module, "card", "c")
application.register(Server.module, "server", "s")
application.register(Test.module, "test", "t")
