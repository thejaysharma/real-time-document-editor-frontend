import './App.css';
import Registration from "./components/Registration/Registration";
import Login from "./components/Login/Login"
import DocumentEditor from "./components/Document/Document.js"

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom"
import { v4 as uuidV4 } from "uuid"

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/register' exact component={Registration} />
        <Route path='/login' exact component={Login} />
        {/* <Route path='/dashboard' exact component={Dashboard} /> */}
        <Route path="/" exact>
          <Redirect to={`/documents/${uuidV4()}`} />
        </Route>
        <Route path="/documents/:id">
          <DocumentEditor />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
