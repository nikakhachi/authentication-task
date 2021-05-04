import { Route, Redirect } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { CircularProgress } from '@material-ui/core';

import { IUser, IResponse } from '../utils/interfaces';

interface IProps {
    component: any;
    exact: boolean;
    path: string;
}

interface IUserState {
    user: IUser;
    usersCount: number;
}

function PrivateRoute({component: Component}: IProps){

    const dispatch = useDispatch();

    const [loading, setLoading] = useState<boolean>(true);
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<IUserState | undefined>(undefined);

    useEffect(() => {
        async function authorize(){
            try {
                const { data }: IResponse = await axios.get('/api/private');
                if(data) {
                    setAuthenticated(true);
                    setUser(data.data);
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                dispatch({
                    type: 'SNACKBAR_PRINT',
                    payload: {
                      type: 'error',
                      text: error.response.data.error
                    }
                  })
            }
        }
        authorize();
    }, []);

    return <Route exact path='/' render={() => 
    loading
    ? <CircularProgress color='inherit' size='7rem'/>
    : authenticated ? <Component data={user} />
    : <Redirect to='/login' />} />
}

export default PrivateRoute;