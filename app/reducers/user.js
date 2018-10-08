import { DO_LOGIN, DO_LOGOUT } from '../actions/User/index';

export default function user(state: object = {}, action: {}){
    switch(action.type){
        case DO_LOGIN: {
            if (action.payload){
                return ({ ...action.payload });
            }
            return state;
        }
        break;

        case DO_LOGOUT: {
            return {};
        }
    }
    return state;
}