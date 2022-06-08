import React, {useReducer, useState, useEffect} from 'react';
import jwt_decode from 'jwt-decode';

import AuthReducer from '../reducers/Auth.reducer';
import { setCurrentUser } from '../actions/Auth.actions';
import AuthGlobal from './AuthGlobal';

import AsyncStorage from '@react-native-async-storage/async-storage';


const Auth = props => {
    const[stateUser, dispatch] = useReducer(AuthReducer, {
        isAuthenticated: null,
        user: {}
    });
    const [showChild, setShowChild] = useState(false);

    useEffect(() => {
        setShowChild(true);
        if(AsyncStorage.jwt){
            const decoded = AsyncStorage.jwt ? AsyncStorage.jwt : "" ;
            if(setShowChild){
                dispatch(setCurrentUser(jwt_decode(decoded)))
            }
        }
        return () => setShowChild(true)
    }, [])

    if(!showChild){
        return null;
    } else {
        return(
            <AuthGlobal.Provider
                value={{
                    stateUser,
                    dispatch 
                }}
            >
            {props.children}
            </AuthGlobal.Provider>
        )
    }
}

 export default Auth;