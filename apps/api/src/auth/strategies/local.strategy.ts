import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(private readonly authService: AuthService) {
        super({
            usernameField: 'email',
            passwordField: 'password'
        })
    }

    // Validate append what is returned here to the request. (e.g. request.user)
    validate(email: string, password: string) {
        return this.authService.validateLocalUser(email, password);
    }
}