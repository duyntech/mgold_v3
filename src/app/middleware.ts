import { Action, Dispatch } from "@reduxjs/toolkit"
import { setLogined } from "../slices/app.slice"
export const customMiddleware = ({ dispatch }: { dispatch: Dispatch<Action> }) => (next: (arg0: any) => void) => (action: any) => {
    if(action.payload){
        const {message}=action.payload
        if(message){
            if(message==="Session expired"){
                dispatch(setLogined(false))
                return;
            }
        }
    }
    next(action);
}