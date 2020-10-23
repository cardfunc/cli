import * as authly from "authly"

export interface Credentials {
	name: string
	keys: { private: authly.Token, public: authly.Token, agent: authly.Token }
	administrator?: { user: string, password: string }
}
