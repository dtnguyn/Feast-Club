export const updateCurrentLocation = (location) => {
    console.log("Hello World user2: ", location);
    return {
        type: "UPDATE_LOCATION",
        payload: location
    };
}

export const signOut = () => {
    return {
        type: "SIGN_OUT"
    }
}

export const signIn = () => {
    return {
        type: "SIGN_IN"
    }
}

export const currentUserSignIn = (userInfo) => {
    return {
        type: "USER_SIGN_IN",
        payload: userInfo
    }
}

export const currentUserSignOUt = () => {
    return {
        type: "USER_SIGN_OUT",
        payload: null
    }
}