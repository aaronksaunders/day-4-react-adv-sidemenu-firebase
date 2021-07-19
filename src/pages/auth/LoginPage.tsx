import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  // import for rendering alerts
  useIonAlert,
  IonToolbar,
} from "@ionic/react";
import { useState } from "react";
import { useHistory } from "react-router";

// import supabase client
import { firebaseAuth } from "../../store/firebase";

const LoginPage: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // used to render platform specific alerts
  const [present] = useIonAlert();

  // firebase documentation
  // https://firebase.google.com/docs/auth/web/password-auth?authuser=0
  const doLogin = async () => {
    try {
      // STEP 1 - LOGIN USER
      // response contains, error, data, user, session
      await firebaseAuth.signInWithEmailAndPassword(email, password);

      history.replace("/home");
    } catch (error: any) {
      // error check for creating user...
      if (error) {
        present({
          header: "Error Logging In User",
          message: error?.message,
          buttons: ["OK"],
        });
        return;
      }
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>LOGIN PAGE</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <IonItem>
          <IonLabel position="fixed">email</IonLabel>
          <IonInput
            onIonChange={(event: any) => setEmail(event.target.value)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="fixed">password</IonLabel>
          <IonInput
            type="password"
            onIonChange={(event: any) => setPassword(event.target.value)}
          />
        </IonItem>
        <IonButton onClick={() => doLogin()}>LOGIN</IonButton>
        <IonButton routerLink={"/auth/create-account"}>
          CREATE ACCOUNT
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
