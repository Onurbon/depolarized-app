import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { GlobalProvider, useGlobal } from './global';
import { syncAuthChanges } from './firebase';
import "./index.css"
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { Toaster } from 'react-hot-toast';

import Home from './pages/home'
import Account from "./pages/account"
import Details from './pages/details';
import Welcome from './pages/welcome';
import NewConversation from './pages/new';
import Generate from './pages/generate';
import Verif from './pages/verif';
import Report from './pages/report';
import { User } from './global/types';
import { useRefresh } from './refresh';
import AIPlayground from './ai/playground';

const hasDetails = (user: User) =>
  user.displayName && user.displayName.length &&
  user.email && user.email.length

const Routing = () => {
  const [state, { setUser }] = useGlobal()
  useEffect(() => { syncAuthChanges(setUser) }, [])
  useRefresh()
  if (!('user' in state)) return <div>loading...</div>
  if (!state.user) return <Welcome />
  if (!hasDetails(state.user)) return <Details />
  const root = state.path.split('/')[1]
  if (!root || root === 'home' || root === 'conversation') return <Home />
  if (root === 'account') return <Account />
  if (root === 'new') return <NewConversation />
  if (root === 'generate') return <Generate />
  if (root === 'verif') return <Verif />
  if (root === 'ai') return <AIPlayground />
  if (root === 'report') return <Report />
  return <div><h1>404</h1><pre>page not found: {root}</pre></div >
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <GlobalProvider>
      <Toaster position="bottom-center" />
      <Routing />
    </GlobalProvider>
  </React.StrictMode>
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
