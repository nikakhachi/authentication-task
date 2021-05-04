import { IUser } from '../../utils/interfaces';
import { Typography, Button, makeStyles } from '@material-ui/core';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

interface IProps {
    data: {
        user: IUser
        userCount: number
    }
}

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

    const { user, userCount } = data;

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

    useEffect(() => {
        if(userCount > 3){
            dispatch({
                type: 'SNACKBAR_PRINT',
                payload: {
                    type: 'info',
                    text: 'You’re lucky person :)'
                }
            });
        }
    }, [userCount]);

    return (
        <div className={classes.container}>
            <Typography variant='h2'>
                Welcome <span className={classes.username}>{user.username}</span> !
            </Typography>
            <Typography variant='h4'>
                It's your {user.loginCount}th log in
            </Typography>
            <Button onClick={() => handleLogout()} className={classes.button} variant='contained' color='primary'>
                LOG OUT
            </Button>
        </div>
    )
};


export default PrivateScreen;