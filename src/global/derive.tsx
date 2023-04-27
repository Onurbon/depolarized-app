import { State } from './state'

export const derive = (state: State): void => {
  if (state.path !== window.location.pathname) {
    window.history.pushState({}, "", state.path);
  }
}
