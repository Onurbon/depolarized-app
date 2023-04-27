
import { createContext, useContext, useState } from "react"
import { initState, State } from "./state"
import { actionSpecs, Actions } from "./actions"
import { derive } from "./derive"
import produce from "immer"

const GlobalContext = createContext<[State, Actions]>(null as any);

const makeActions = (specs: any, setState: any) => {
  const res: any = {}
  Object.keys(specs(null as any)).forEach(name => {
    res[name] = (...args: any) => {
      setState((state: any) => {
        const next = produce(state,
          (s: any) => {
            specs(s)[name](...args);
            derive(s)
          }
        )
        console.log({ action: name, args, prev: state, next })
        return next
      })
    }
  })
  return res
}

export const GlobalProvider = ({ children }: any) => {
  const [state, setState] = useState(initState())
  const actions = makeActions(actionSpecs, setState)
  return <GlobalContext.Provider value={[state, actions]}>
    {children}
  </GlobalContext.Provider>
}

export const useGlobal = () => {
  return useContext(GlobalContext)
}

