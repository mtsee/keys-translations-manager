import { combineReducers } from 'redux'
import messages from './messages'
import counts from './counts'
import errors from './errors'
import translations from './translations'

const rootReducer = combineReducers({
	messages, counts, errors, translations
})

export default rootReducer
