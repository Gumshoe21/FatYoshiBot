import { SET_TRIVIA_ACTIVE } from './actionTypes.js'

export function setTriviaActive(bool) {
  return {
    type: SET_TRIVIA_ACTIVE,
    payload: bool,
  };
}
