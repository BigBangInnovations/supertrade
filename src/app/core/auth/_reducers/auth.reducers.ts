// Actions
import { AuthActions, AuthActionTypes } from '../_actions/auth.actions';
// Models
import { User } from '../_models/user.model';
import { APP_CONSTANTS } from '../../../../config/default/constants'
import { environment } from '../../../../environments/environment'

export interface AuthState {
    loggedIn: boolean;
    user: any;
    isRetailer: boolean;
    isDistributor: boolean;
    activeSalesSchemeId: string;
    activePurchaseSchemeId: string;
}

export const initialAuthState: AuthState = {
    loggedIn: false,
    user: undefined,
    isRetailer: false,
    isDistributor: false,
    activeSalesSchemeId: '',
    activePurchaseSchemeId: '',
};

export function authReducer(state = initialAuthState, action: AuthActions): AuthState {
    switch (action.type) {
        case AuthActionTypes.Login: {
            const _token: string = action.payload.authToken;
            return {
                loggedIn: true,
                user: undefined,
                isRetailer: false,
                isDistributor: false,
                activeSalesSchemeId: '',
                activePurchaseSchemeId: '',
            };
        }

        case AuthActionTypes.LoginSuccess: {
            const user:User = action.payload;
            return {
                loggedIn: true,
                user: JSON.stringify(user),
                isRetailer: (user.Company_Type_ID == APP_CONSTANTS.USER_ROLE.RETAILER_TYPE) ? true : false,
                isDistributor: (user.Company_Type_ID == APP_CONSTANTS.USER_ROLE.DISTRIBUTOR_TYPE) ? true : false,
                activeSalesSchemeId: user.salesActiveScheme[0].scheme_id,
                activePurchaseSchemeId: user.purchaseActiveScheme[0].scheme_id,
            };
        }

        case AuthActionTypes.AuthSuccess: {
            const user = JSON.parse(action.payload);
            return {
                loggedIn: true,
                user: JSON.stringify(user),
                isRetailer: (user.Company_Type_ID == APP_CONSTANTS.USER_ROLE.RETAILER_TYPE) ? true : false,
                isDistributor: (user.Company_Type_ID == APP_CONSTANTS.USER_ROLE.DISTRIBUTOR_TYPE) ? true : false,
                activeSalesSchemeId: user.salesActiveScheme[0].scheme_id,
                activePurchaseSchemeId: user.purchaseActiveScheme[0].scheme_id,
            };
        }

        // case AuthActionTypes.Register: {
        //     const _token: string = action.payload.authToken;
        //     return {
        //         loggedIn: true,
        //         authToken: _token,
        //         user: undefined,
        //         isUserLoaded: false
        //     };
        // }

        case AuthActionTypes.Logout:
            return initialAuthState;

        // case AuthActionTypes.UserLoaded: {
        //     const _user: User = action.payload.user;
        //     return {
        //         ...state,
        //         user: _user,
        //         isUserLoaded: true
        //     };
        // }

        default:
            return state;
    }
}
