import * as authly from "authly"

export interface Authentication {
    private: authly.Token
    public: authly.Token
    admin: {
        user: string,
        password: string,
    }
}
