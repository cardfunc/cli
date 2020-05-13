import * as dotenv from "dotenv"
dotenv.config()
import { Connection } from "./Connection"
import * as normal from "./normal"

async function run(argument: string[]): Promise<number> {
	console.log("test")
	const connection = await Connection.create({
		private: argument[2] || process.env.privateKey!,
		public: argument[3] || process.env.publicKey!,
		admin: { user: argument[4] || process.env.adminUser!, password: argument[5] || process.env.adminPassword! }
	})
	const result = connection && await normal.test(connection) ? 0 : 1
	console.log("done")
	return result
}
run(process.argv).then(result => process.exit(result), _ => process.exit(1))
