import * as paramly from "paramly"
import * as configuration from "./package.json"
import { Connection } from "./Connection"

export const application = new paramly.Application("PayFunc CLI", "payfunc", configuration.version, { s: 1, server: 1, u: 1, url: 1 }, async (f) => Connection.create((f.s ?? f.server)?.[0] ?? "default", (f.u ?? f.url)?.[0]))
