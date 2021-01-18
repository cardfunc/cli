import { create } from "./create"
// import { capture } from "./capture"
// import { refund } from "./refund"
// import { cancel } from "./cancel"

const clearhausModule = {
	name: "clearhaus",
	description: "Create a clearhaus authorization.",
	commands: {
		create: create.command,
	},
}

export { create, clearhausModule as module }
