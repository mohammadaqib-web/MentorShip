const initialState = {
    user:{}
}

export const userReducer = (state=initialState,action)=>{

    switch (action.type) {
        // Case for successful user login
        case "LOGIN_SUCCESS":
            return {
                ...state,
                user:action.payload
            };

        // Case for login error
        case "LOGIN_ERROR":
            return initialState;
    
        default:
            return state;
    }
}