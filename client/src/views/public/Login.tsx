import { Avatar, Button, Container, Grid, Typography } from '@material-ui/core';
import { useStyles } from '../../themes/formDesign';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { Field, Form, Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import InputField from '../../components/InputField';
import { loginSchema } from '../../utils/validation';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import { IResponse } from '../../utils/interfaces';

import { Observable } from 'rxjs';

interface SubmitProps {
  username: string;
  password: string;
}

export default function Login() {

  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  async function handleSubmit(values: SubmitProps){

    // try {
    //   const { data }: IResponse = await axios.post('/api/auth/login', values);
    //   if(data) history.push('/');
    // } catch (error) {
    //   dispatch({
    //     type: 'SNACKBAR_PRINT',
    //     payload: {
    //       type: 'error',
    //       text: error.response.data.error
    //     }
    //   })
    // }

    let observable$ = Observable.create( ( observer: any ) => {
      axios.post('/api/auth/login', values)
      .then((response) => {
          observer.next(response.data);
          observer.complete(response.data);
      })
      .catch((error) => {
          observer.error(error.response.data.error);
      });
    });
    observable$.subscribe({
      next: (data: IResponse) => history.push('/'),
      complete: (data: IResponse) => dispatch({
        type: 'SNACKBAR_PRINT',
        payload: {
          type: 'info',
          text: 'Logged In Successfully'
        }
      }),
      error: (error: string) => dispatch({
        type: 'SNACKBAR_PRINT',
        payload: {
          type: 'error',
          text: error
        }
      }),
    });
  }

  return (
    <Container maxWidth="sm">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOpenIcon />
        </Avatar>
        <Typography color='textPrimary' component="h1" variant="h5">
          Login
        </Typography>
        <Formik
            initialValues={{
                username: '',
                password: '',
            }}
            onSubmit={(values) => handleSubmit(values)} 
            validationSchema={loginSchema}
            validateOnChange={false}
            validateOnBlur={false}
        >
            {() => {
              return (
                <Form>
                 <Field
                   name="username"
                   textFieldProps={{
                    variant: "outlined",
                    margin: "normal",
                    label: 'Username',
                   }}
                   component={InputField}
                 />
                 <Field
                   name="password"
                   textFieldProps={{
                    variant: "outlined",
                    margin: "normal",
                    label: 'Password',
                    type: 'password'
                   }}
                   component={InputField}
                 />
                 <Button
                   type="submit"
                   fullWidth
                   variant="contained"
                   color="primary"
                   className={classes.submit}
                 >
                   Login
                 </Button>
                 </Form>
            )}
            }
        </Formik>
          <Grid container>
            <Grid item>
              <Link to="/register">
                <Typography color='textSecondary' variant="subtitle1">
                  Register
                </Typography>
              </Link>
            </Grid>
          </Grid>
      </div>
    </Container>
  );
}