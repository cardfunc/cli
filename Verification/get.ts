import * as authly from "authly"
import * as paramly from "paramly"
import { Connection } from "../Connection"
import { Error as VerificationError } from "./Error"
import { Pares } from "./Pares"
import { Method } from "./Method"
import { Challenge } from "./Challenge"
import * as model from "@payfunc/model-card"
import { postForm, extractFromHtml } from "../utility"

export async function get(
	request: VerificationError | { url: string; [property: string]: string | undefined },
	merchant?: model.Merchant & authly.Payload,
	cardToken?: authly.Token
): Promise<string | undefined> {
	let result: string | undefined
	if (Pares.is(request))
		result = await Pares.get(request)
	else if (Method.is(request) && merchant && cardToken)
		result = await Method.get(request, merchant, cardToken)
	else if (Challenge.is(request) && merchant && cardToken)
		result = await Challenge.get(request, merchant, cardToken)
	return result
}

export namespace get {
	export const command: paramly.Command<Connection> = {
		name: "get",
		description: "Performs 3D. Only works with 3D simulator.",
		examples: [
			[
				"<url> <pareq> | <url> <transactionId> <cardToken> | <url> <transactionId> <acsTransactionId> <cardToken>",
				"Perform 3D for given URL and PaReq.",
			],
		],
		execute: async (connection, argument, flags) => {
			// 			const test = extractFromHtml(
			// 				`

			//       @media (min-width: 601px) and (min-height: 601px) {
			//         .container {
			//           border-radius: 10px;
			//         }
			//       }
			//   </style>
			//   </head>
			//     <body>
			//         <div class="container">
			//             <div class="logo-container row">
			//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1077.5 289.27" class="logo-two-third">
			//                     <defs>
			//                         <style>
			//                             .cls-1,.cls-7{fill:#39757c;}
			//                             .cls-2{fill:#709ba0;}
			//                             .cls-3{fill:#8baeb3;}
			//                             .cls-4{fill:#99b8bb;}
			//                             .cls-5{fill:#639297;}
			//                             .cls-6{fill:#7da4aa;}
			//                             .cls-7{
			//                                 font-size:123px;
			//                                 font-family:Montserrat-Medium, Montserrat;font-weight:500;
			//                             }
			//                             .cls-8{
			//                                 letter-spacing:-0.01em;
			//                             }
			//                         </style>
			//                     </defs>
			//                     <title>3DSecure.io</title>
			//                     <g id="Lag_2" data-name="Lag 2">
			//                         <g id="Lag_1-2" data-name="Lag 1">
			//                             <path class="cls-1" d="M245.67,212V76.39a8.83,8.83,0,0,0-4.31-7.58l-114-67.58a8.81,8.81,0,0,0-9,0L4.32,68.81A8.81,8.81,0,0,0,0,76.39V212a8.8,8.8,0,0,0,4.32,7.58l114,67.58a8.81,8.81,0,0,0,9,0l114-67.58A8.81,8.81,0,0,0,245.67,212Z"/>
			//                             <path class="cls-2" d="M123,32.1V146.54a11.68,11.68,0,0,0-5.81,1.55l-66.55,38L40.47,180.3A8.8,8.8,0,0,1,36,172.64V84.91a8.81,8.81,0,0,1,4.47-7.67l77.69-44A8.74,8.74,0,0,1,123,32.1Z"/>
			//                             <path class="cls-3" d="M209,84.91v87.73a8.8,8.8,0,0,1-4.47,7.66l-9.6,5.44-66.12-37.66a11.7,11.7,0,0,0-5.81-1.54V32.1a8.67,8.67,0,0,1,3.84,1.13l77.69,44A8.81,8.81,0,0,1,209,84.91Z"/>
			//                             <path class="cls-4" d="M194.93,185.74l-68.09,38.57a8.67,8.67,0,0,1-3.84,1.13v-78.9a11.7,11.7,0,0,1,5.81,1.54Z"/>
			//                             <path class="cls-5" d="M123,146.54v78.9a8.74,8.74,0,0,1-4.84-1.13L50.64,186.06l66.55-38A11.68,11.68,0,0,1,123,146.54Z"/>
			//                             <path class="cls-6" d="M203.1,210.79,128.81,253.1a11.7,11.7,0,0,1-11.62,0L43,210.78a11.73,11.73,0,0,1,0-20.38l7.6-4.34,67.52,38.25a8.8,8.8,0,0,0,8.68,0l68.09-38.57,8.17,4.65A11.74,11.74,0,0,1,203.1,210.79Z"/>
			//                             <text class="cls-7" transform="translate(348.43 186.56)">3dsecure.io</text>
			//                         </g>
			//                     </g>
			//                 </svg>
			//             </div>

			//   <main class="row">
			//       <h2>Challenge</h2>
			//       <p>
			//         This is the sandbox stand-in challenge page.

			//         Please choose whether or not to pass the challenge.
			//       </p>
			//       <p>
			//         This determines the callback received.
			//       </p>
			//   </main>
			//   <form method="post" class="button-wrapper row" action="https://acs.sandbox.3dsecure.io/continueBrowserChallenge">
			//     <input type="hidden" name="threeDSServerTransID" value="3cee5d15-5a60-47ec-ada6-9413c1f4c4df"/>
			//     <button name="challengeStatus" value="pass" class="submit">Pass challenge</button>
			//     <button name="challengeStatus" value="fail" class="submit">Fail challenge</button>
			//   </form>

			//         </div>
			//     </body>
			// </html>`,
			// 				true
			// 			)
			// 			console.log("test: ", test)
			const merchant = (await authly.Verifier.create("public").verify(
				connection?.credentials?.keys.public
			)) as model.Merchant
			const result = merchant
				? argument.length == 2
					? await get({ url: argument[0], pareq: argument[1] })
					: argument.length == 3
					? await get({ url: argument[0], transactionId: argument[1] }, merchant, argument[2])
					: argument.length == 4
					? await get(
							{ url: argument[0], transactionId: argument[1], ascTransactionId: argument[2] },
							merchant,
							argument[3]
					  )
					: undefined
				: undefined
			return !!result
		},
	}
}
