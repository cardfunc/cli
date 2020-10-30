import { cancel } from "./cancel"
import { capture } from "./capture"
import { create } from "./create"
import { list } from "./list"
import { refund } from "./refund"
import { verify } from "./verify"

export const authorizationModule = {
	name: "authorization",
	description: "Creates an authorization.",
	commands: {
		cancel: cancel.command,
		capture: capture.command,
		create: create.command,
		list: list.command,
		refund: refund.command,
		verify: verify.command,
	},
}

export { cancel, capture, create, list, refund, verify, authorizationModule as module }
