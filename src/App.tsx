import {
  IonApp,
  IonLoading,
  IonRouterOutlet,
  IonSplitPane,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import CreateAccountPage from "./pages/auth/CreateAccountPage";
import { useEffect, useState } from "react";
import { firebaseAuth } from "./store/firebase";

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState<any>(true);

  useEffect(() => {
    console.log("start up");
    setSession(firebaseAuth.currentUser);

    firebaseAuth.onAuthStateChanged((response) => {
      console.log("onAuthStateChanged");
      setSession(response);
      setLoading(false);
    });

    console.log("session", session);
  }, []);

  // if we have't checked for session yet, then display loading screen
  if (loading)
    return (
      <IonApp>
        <IonLoading isOpen={loading} />
      </IonApp>
    );

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet id="main">
          <Route path="/" exact={true}>
            <Redirect to="/home" />
          </Route>
          <PrivateRoute
            path="/home"
            exact={true}
            component={HomePage}
          ></PrivateRoute>
          <Route path="/auth/login" exact={true}>
            <LoginPage />
          </Route>
          <Route path="/auth/create-account" exact={true}>
            <CreateAccountPage />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;

/**
 *
 * @param param0
 * @returns
 */
const PrivateRoute = ({ component: Component, ...rest }: any) => {
  // useAuth is some custom hook to get the current user's auth state
  const isAuth = firebaseAuth.currentUser;

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuth ? <Component {...props} /> : <Redirect to="/auth/login" />
      }
    />
  );
};
