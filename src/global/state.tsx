import { User } from "./types"

export type LoginStep = 'loggedout' | 'askNumber' | 'askCode' | 'showError'

export type State = {
  user?: User | null,
  path: string,
  previousPath?: string,
  test: string,
  count: number,
  proposalOrder: { [key: string]: string[] },
  loginStep: LoginStep,
  loginError: null | string,
}

export const initState = (): State => {
  return {
    path: window.location.pathname,
    proposalOrder: {},
    test: 'hello',
    count: 1,
    loginStep: 'loggedout',
    loginError: null,
  }
}

