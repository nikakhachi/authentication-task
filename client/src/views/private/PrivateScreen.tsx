import { IUser } from '../../utils/interfaces';
import { Typography, Button, makeStyles } from '@material-ui/core';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import io from 'socket.io-client';

interface IProps {
    data: {
        user: IUser
        userCount: number
    }
}

interface ISocketMessage {
    text: string;
}

let socket: any;

const useStyles = makeStyles(themes => ({
    container: {
        paddingTop: '10%',
    },
    username: {
        color: themes.palette.primary.main
    },
    button: {
        marginTop: '3%'
    }
}))

const PrivateScreen: React.FC<IProps> = ({data}) => {

    const { user } = data;

    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    async function handleLogout() {
        const { data } = await axios.post('/api/auth/logout');
        dispatch({
            type: 'SNACKBAR_PRINT',
            payload: {
                type: 'info',
                text: data.msg
            }
        });
        history.push('/login');
    }

    // Connection to Socket.io
    useEffect(() => {
        socket = io.connect('/', {query:`user=${user.username}&room=general`});
        socket.emit('join', { user, room: 'general'}, () => {
        });
        return () => {
            socket.disconnect();
            socket.off();
        }
    }, [user]);


    // If 3 or more users are registrated. On every user registration, other connected users will see a popup
    useEffect(() => {
        socket.on('message', (message: ISocketMessage) => {
            dispatch({
                type: 'SNACKBAR_PRINT',
                payload: {
                    type: 'info',
                    text: message.text
                }
            });
        })
        return () => {
            socket.off('message')};
    }, [dispatch]);

    return (
        <div className={classes.container}>

            {/* After Registration, user will only see Welcome message, but after second and more logins 
                User will see login count */}
            {user.loginCount === 1 
            ? <Typography variant='h2'>
                Welcome <span className={classes.username}>{user.username}</span> !
                </Typography>
            : <Typography variant='h4'>
                It's your {user.loginCount}th log in
              </Typography>
            }
            <Button onClick={() => handleLogout()} className={classes.button} variant='contained' color='primary'>
                LOG OUT
            </Button>
        </div>
    )
};


export default PrivateScreen;