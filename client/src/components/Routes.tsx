import Login from '../views/public/Login';
import Register from '../views/public/Register';
import PrivateScreen from '../views/private/PrivateScreen';

import { Switch, Route } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';

const Routes: React.FC = () => {
    return (
        <>
        <Switch>
            <PrivateRoute exact path='/' component={PrivateScreen} />
            <Route exact path='/login' component={Login}/>
            <Route exact path='/register' component={Register}/>
        </Switch>
        </>
    )
};

export default Routes;