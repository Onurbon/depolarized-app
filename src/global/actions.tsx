
import { State, LoginStep } from './state'

export const actionSpecs = (state: State) => ({
  setUser: (user: any) => { state.user = user },
  setLoginStep: (step: LoginStep) => { state.loginStep = step },
  setLoginError: (err: null | string) => { state.loginError = err },
  setProposalOrder: (key: string, list: string[]) => { state.proposalOrder[key] = list },
  incr: (num: number = 1) => { state.count += num },
  goto: (path: string) => {
    state.previousPath = state.path
    state.path = path.startsWith('/') ? path : ('/' + path)
  },
  goBack: (defaultPath: string) => {
    state.path = state.previousPath ? state.previousPath : defaultPath
  },
  markViewedInfoModal: (uid: string) => {
    const viewed = state.user!.viewedInfoModals
    if (!viewed.includes(uid)) viewed.push(uid)
  }
})

export type Actions = ReturnType<typeof actionSpecs>
