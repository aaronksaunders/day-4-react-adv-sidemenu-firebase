import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import firebase from "firebase";
import { useState } from "react";
import { useHistory } from "react-router";

// import firebase client
import { firebaseAuth, firebaseApp } from "../../store/firebase";

// START OF COMPONENT
const CreateAccountPage: React.FC = () => {
  // for routing between pages
  const history = useHistory();

  // variables from the page that are needed to create
  // the user
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // used to render platform specific alerts
  const [present] = useIonAlert();

  const doCreateAccount = async () => {
    try {
      // STEP 1 - CREATE USER
      // firebase documentation
      // https://firebase.google.com/docs/auth/web/password-auth?authuser=0
      const response = await firebaseAuth.createUserWithEmailAndPassword(
        email,
        password
      );

      // STEP 2 - ADD USER INFO TO PROFILE
      // writing to firebase databases...
      //
      // Overview
      // https://firebase.google.com/docs/firestore/quickstart?authuser=0
      //
      // Adding Data
      // https://firebase.google.com/docs/firestore/manage-data/add-data?authuser=0

      firebaseApp
        .firestore()
        .collection("profiles")
        .doc(response.user?.uid)
        .set({
          first,
          last,
          updated_at: firebase.firestore.Timestamp.now(),
          username: email,
        });

      // if no error, then render home page
      history.replace("/home");
    } catch (error: any) {
      // error check for adding user profile...
      if (error) {
        present({
          header: "Error Creating Account",
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
          <IonTitle>CREATE ACCOUNT</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <IonItem>
          <IonLabel position="fixed">First</IonLabel>
          <IonInput
            onIonChange={(event: any) => setFirst(event.target.value)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="fixed">Last</IonLabel>
          <IonInput onIonChange={(event: any) => setLast(event.target.value)} />
        </IonItem>
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
        <IonButton onClick={() => doCreateAccount()}>CREATE ACCOUNT</IonButton>
        <IonButton routerLink={"/auth/login"}>CANCEL</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default CreateAccountPage;
