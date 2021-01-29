#!/usr/bin/env node
import * as dotenv from "dotenv"
dotenv.config()

import * as paramly from "paramly"
import * as configuration from "./package.json"
import * as cli from "./index"

export const application = new paramly.Application(
	"PayFunc Card Tokenizing CLI",
	"payfunc-card",
	configuration.version,
	[
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
	async f => cli.Connection.create("payfunc-card", (f.s ?? f.server)?.[0] ?? "default", (f.u ?? f.url)?.[0])
)
application.register(cli.Card.module, "card", "c")
application.register(cli.Verification.module, "verification", "v")
application.register(cli.Verification.Pares.module, "pares", "p")
application.register(cli.Verification.Method.module, "method", "m")
application.register(cli.Verification.Challenge.module, "challenge", "ch")
application.register(cli.Server.module, "server", "s")
application.register(cli.Test.module, "test", "t")

application.run(process.argv).then(
	result => process.exit(result ? 0 : 1),
	_ => process.exit(1)
)
