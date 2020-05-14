import * as authly from "authly"

export interface Merchant {
	name: string
	keys: { private: authly.Token, public: authly.Token }
	administrator?: { user: string, password: string }
}
