#!/usr/bin/env node
import * as dotenv from "dotenv"
dotenv.config()
import { Module } from "./Module"

import "./Authorization"
import "./Server"
import "./Test"

async function run(argument: string[]): Promise<boolean> {
	const result = await Module.execute(argument.slice(2))
	console.log(result ? "succeeded" : "failed")
	return result
}
run(process.argv).then(result => process.exit(result ? 0 : 1), _ => process.exit(1))
