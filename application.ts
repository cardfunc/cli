import * as paramly from "paramly"
import * as configuration from "./package.json"
import { Connection } from "./Connection"

export const application = new paramly.Application("CardFunc CLI", "cardfunc", configuration.version, [
	{
		short: "s",
		long: "server",
		arguments: 1,
		description: "Use diffrent server than default.",
		usage: "<server name>",
	}, {
		short: "u",
		long: "url",
		arguments: 1,
		description: "Use diffrent url than default.",
		usage: "<url>",
	}], async (f) => Connection.create((f.s ?? f.server)?.[0] ?? "default", (f.u ?? f.url)?.[0]))
