const initialState = {
  active: false,
}

export function triviaReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_TRIVIA_ACTIVE':
      return {
        ...state,
        active: action.payload,
      }
    default:
      return state
  }
}
