export const updateCurrentLocation = (location) => {
    return {
        type: "",
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