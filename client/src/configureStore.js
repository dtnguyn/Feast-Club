import { createStore, combineReducers } from 'redux';
import allReducers from "./reducers";

const saveToLocalStorage = (state) => {
    try{
        const serializedState = JSON.stringify(state);
        console.log("save serialized: " + serializedState);
        localStorage.setItem("state", serializedState);
    } catch(e){
        console.log(e);
    }
}

const loadFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem('state');
        console.log("serialized: " + serializedState);
        if (serializedState === null) {
            console.log("Fail to load");
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch(e){
        console.log(e);
        return undefined;
    }
}

const persistedState = loadFromLocalStorage();

const store = createStore(
    allReducers,
    persistedState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

store.subscribe(() => saveToLocalStorage(store.getState()));

export default store;