const currentUserReducer = (
state = {
    id: "",
    name: "",
    email: ""
}
, action) => {
    switch(action.type){
        case 'USER_SIGN_IN':
            if(action.payload != undefined)
                return action.payload;
            else return state
        case 'USER_SIGN_OUT':
            return null
        default:
            return state;
    }

}

export default currentUserReducer;