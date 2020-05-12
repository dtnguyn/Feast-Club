const currentUserReducer = (
state = {
    id: "",
    name: "",
    email: ""
}
, action) => {
    console.log("heheheheheheheheheh: " + JSON.stringify(action.payload))
    switch(action.type){
        case 'USER_SIGN_IN':
            if(action.payload != undefined)
                return action.payload;
            else return state
        case 'USER_SIGN_OUT':
            return {
                id: "",
                name: "",
                email: ""
            };
        default:
            return state;
    }

}

export default currentUserReducer;