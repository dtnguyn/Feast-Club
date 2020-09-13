export const updateCurrentLocation = (location) => {
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

export const currentUserSignOut = () => {
    return {
        type: "USER_SIGN_OUT",
        payload: null
    }
}

