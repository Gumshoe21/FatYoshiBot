import { combineReducers } from 'redux'
import { triviaReducer } from './triviaReducer'

const rootReducer = combineReducers({
  trivia: triviaReducer
})

export default rootReducer;
