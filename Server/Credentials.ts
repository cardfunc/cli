import * as authly from "authly"

export interface Credentials {
	name: string
	keys: {
		private: authly.Token | undefined
		public: authly.Token | undefined
		agent: authly.Token | undefined
	}
	administrator?: {
		user: string | undefined
		password: string | undefined
	}
}
