import { Action } from '@ngrx/store';
import { User } from '../_models/user.model';

export enum AuthActionTypes {
    Login = '[Login] Action',
    LoginSuccess = '[LoginSuccess] Action',
    AuthSuccess = '[Auth Success] Action',
    Logout = '[Logout] Action',
    // Register = '[Register] Action',
    // UserRequested = '[Request User] Action',
    // UserLoaded = '[Load User] Auth API'
}

export class Login implements Action {
    readonly type = AuthActionTypes.Login;
    constructor(public payload: { authToken: string }) { }
}

export class LoginSuccess implements Action {
    readonly type = AuthActionTypes.LoginSuccess;
    constructor(public payload: User) { }
}

export class AuthSuccess implements Action {
    readonly type = AuthActionTypes.AuthSuccess;
    constructor(public payload) { }
}

export class Logout implements Action {
    readonly type = AuthActionTypes.Logout;
}

// export class Register implements Action {
//     readonly type = AuthActionTypes.Register;
//     constructor(public payload: { authToken: string }) { }
// }


// export class UserRequested implements Action {
//     readonly type = AuthActionTypes.UserRequested;
// }

// export class UserLoaded implements Action {
//     readonly type = AuthActionTypes.UserLoaded;
//     constructor(public payload: { user: User }) { }
// }



export type AuthActions = Login | LoginSuccess | AuthSuccess | Logout 
// | Register | UserRequested | UserLoaded
;
