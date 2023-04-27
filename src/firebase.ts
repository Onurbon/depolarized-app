import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from "./secrets";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  onSnapshot,
  query,
  getDocs,
  where,
  orderBy,
  limit,
  serverTimestamp,
  setDoc,
  updateDoc as updateDoc2,
  deleteDoc,
  collectionGroup,
  arrayRemove,
  arrayUnion,
  deleteField,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateProfile,
  updateEmail,
  sendEmailVerification,
} from "firebase/auth";

// initialize
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth();

let unsubscribe = () => {};

export const syncAuthChanges = (setUser: any) => {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      setUser(null);
    } else {
      unsubscribe(); // make sure we're not watching several time at once...
      unsubscribe = onSnapshot(doc(db, `users/${user.uid}`), async (snap) => {
        const exist = snap.exists();
        const record = exist ? snap.data() : {};
        setUser({ ...user, ...record });
      });
    }
  });
};

// database hooks
export const useFirestoreDoc = <A>(path: string) => {
  const [state, setState] = useState({
    fetching: true,
    missing: false,
    error: false,
    data: null as A,
  });
  useEffect(() => {
    getDoc(doc(db, path))
      .then((snap) => {
        const exists = snap.exists();
        setState({
          fetching: false,
          missing: !exists,
          error: false,
          data: (exists && snap.data()) as A,
        });
      })
      .catch((e) => {
        console.error(e);
        setState({
          fetching: false,
          missing: false,
          error: e.message,
          data: null as A,
        });
      });
  }, []);
  return state;
};

export const getFirestoreDoc = (path: any) => getDoc(doc(db, path));

export { where, orderBy, limit, serverTimestamp, deleteField };

const collectionOrGroup = (db: any, path: string) =>
  path.startsWith("group:")
    ? collectionGroup(db, path.split(":")[1])
    : collection(db, path);

export const useFirestoreQuery = <A>(path: string, ...modifiers: any) => {
  const [state, setState] = useState({
    fetching: true,
    error: false,
    data: [] as Array<A>,
  });
  useEffect(() => {
    setState({ fetching: true, error: false, data: [] });
    getDocs(query(collectionOrGroup(db, path), ...modifiers))
      .then((snap) => {
        const data: any = [];
        snap.forEach((doc) => {
          data.push({ id: doc.id, path: doc.ref.path, ...doc.data() });
        });
        setState({ fetching: false, error: false, data });
      })
      .catch((e) => {
        console.error(e);
        setState({ fetching: false, error: e.message, data: [] });
      });
  }, [JSON.stringify({ path, modifiers })]);
  return state;
};

export const useFirestoreLiveQuery = <A>(path: string, ...modifiers: any) => {
  const [state, setState] = useState({
    fetching: true,
    error: false,
    data: [] as Array<A>,
  });
  useEffect(() => {
    setState({ fetching: true, error: false, data: [] });
    const unsusbcribe = onSnapshot(
      query(collectionOrGroup(db, path), ...modifiers),
      // on success
      (snap) => {
        const data: any = [];
        snap.forEach((doc) => {
          data.push({ id: doc.id, path: doc.ref.path, ...doc.data() });
        });
        setState({ fetching: false, error: false, data });
      },
      // on error
      (e: any) => {
        console.error(e);
        setState({ fetching: false, error: e.message, data: [] });
      }
    );
    return unsusbcribe;
  }, [JSON.stringify({ path, modifiers })]);
  return state;
};

export const useFirestoreLiveDoc = <A>(
  path: string,
  defaultValue: A,
  initdoc?: any
) => {
  const [state, setState] = useState<A>(defaultValue);
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, path), async (doc) => {
      if (doc.exists()) {
        setState({
          id: doc.id,
          path: doc.ref.path,
          ...defaultValue,
          ...doc.data(),
        } as any);
      } else if (initdoc) {
        updateDoc(path, initdoc);
      }
    });
    return unsubscribe;
  }, [path]);
  return state;
};

export const setupRecaptchaVerifier = () => {
  // @ts-ignore
  window.recaptchaVerifier = new RecaptchaVerifier(
    "sign-in-button",
    {
      size: "invisible",
      callback: (response: any) => {
        console.log("appVerifier callback", response);
      },
    },
    auth
  );
};

const resetCaptcha = () => {
  // @ts-ignore
  window.recaptchaVerifier.clear();
  // @ts-ignore
  grecaptcha.reset();
};

// TODO: use a widget recapca and reset it when needed...
export const submitNumber = (
  phoneNumber: string,
  onSuccess: any,
  onError: any
) => {
  console.log("called submitNumber");
  // @ts-ignore
  signInWithPhoneNumber(
    auth,
    phoneNumber,
    // @ts-ignore
    window.recaptchaVerifier
  )
    .then((confirmationResult) => {
      console.log("signInWithPhoneNumber success", confirmationResult);
      // @ts-ignore
      window.confirmationResult = confirmationResult;
      onSuccess();
    })
    .catch((e) => {
      console.log("signInWithPhoneNumber failed...");
      // HACK to work around reCAPTCHA issues...
      alert(`${e.message}, please try again...`);
      window.location.reload();
      // onError(e);
    });
};

export const submitCode = (code: string, onSuccess: any, onError: any) => {
  // @ts-ignore
  window.confirmationResult
    .confirm(code)
    .then((result: any) => {
      console.log("submitCode success", result.user);
      onSuccess();
    })
    .catch(onError);
};

export const setProfileName = (name: any) => {
  return Promise.all([
    updateProfile(auth!.currentUser!, { displayName: name }),
    setDoc(
      doc(db, `users/${auth!.currentUser!.uid}`),
      { displayName: name },
      { merge: true }
    ),
  ]);
};

export const setProfileEmail = (email: any) => {
  return Promise.all([
    updateEmail(auth!.currentUser!, email),
    setDoc(
      doc(db, `users/${auth!.currentUser!.uid}`),
      { email },
      { merge: true }
    ),
  ]);
};

export const sendEmailVerif = () => {
  return sendEmailVerification(auth!.currentUser!);
};

export const insertDoc = <A>(path: string, data: A) => {
  return addDoc(collection(db, path), data as any);
};

export { arrayRemove, arrayUnion };

export const updateDoc = <A>(path: string, data: Partial<A>) => {
  return setDoc(doc(db, path), data as any, { merge: true });
};

export const updateDocNested = <A>(path: string, data: Partial<A>) => {
  // because dot notations only work with the original updateDoc...
  return updateDoc2(doc(db, path), data as any);
};

export const removeDoc = <A>(path: string) => {
  return deleteDoc(doc(db, path));
};
