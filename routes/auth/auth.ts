import { RoutePath, RouteSetting } from "routes/RouteSetting";

export class AuthRouteParams {
    passAuth: boolean;

    constructor(passAuth: boolean) {
        this.passAuth = passAuth;
    }
}


export class AuthRouteSetting extends RouteSetting<AuthRouteParams> {
    protected _path = RoutePath.auth;
    shouldBeAuth = false;

}

export class EmailSignupRouteSetting extends RouteSetting {
    protected _path = RoutePath.emailSignUp;
    shouldBeAuth = false;
}

export class EmailLoginRouteSetting extends RouteSetting {
    protected _path = RoutePath.emailLogin;
    shouldBeAuth = false;
}