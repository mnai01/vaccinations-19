import './scss/style.scss';
import { UserProvider, UserContext } from './covidContext';
import {
  Route,
  Link,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Navbar from './components/layout/Navbar';
import { Test } from './components/Test';

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path='/' component={Dashboard} />
          <Route exact path='/test' component={Test} />
        </Switch>
      </Router>
    </UserProvider>
  );
}

export default App;
