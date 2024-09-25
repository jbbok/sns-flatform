import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBasRItMMAH9oiX4G1spU8ArIxzMSNIRAQ",
  authDomain: "sns-flatform-240924.firebaseapp.com",
  projectId: "sns-flatform-240924",
  storageBucket: "sns-flatform-240924.appspot.com",
  messagingSenderId: "330628468172",
  appId: "1:330628468172:web:53a22aecb22585153ee169",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
