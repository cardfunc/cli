#!/usr/bin/env node
import * as dotenv from "dotenv"
dotenv.config()

import { application } from "./application"
import "./Authorization"
import "./Card"
import "./Merchant"
import "./Server"
import "./Test"

application.run(process.argv).then(result => process.exit(result ? 0 : 1), _ => process.exit(1))
