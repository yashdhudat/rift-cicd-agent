import { createContext, useContext, useReducer } from 'react'

const AgentContext = createContext(null)

const initialState = {
  phase: 'idle',       // idle | running | done
  repo: '',
  team: '',
  leader: '',
  logs: [],
  result: null,
  error: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_INPUT':
      return { ...state, [action.field]: action.value }
    case 'RUN_START':
      return { ...state, phase: 'running', logs: [], result: null, error: null }
    case 'ADD_LOG':
      return { ...state, logs: [...state.logs, action.log] }
    case 'SET_RESULT':
      return { ...state, phase: 'done', result: action.result }
    case 'SET_ERROR':
      return { ...state, phase: 'idle', error: action.error }
    case 'RESET':
      return { ...initialState }
    default:
      return state
  }
}

export function AgentProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <AgentContext.Provider value={{ state, dispatch }}>
      {children}
    </AgentContext.Provider>
  )
}

export function useAgent() {
  const ctx = useContext(AgentContext)
  if (!ctx) throw new Error('useAgent must be used within AgentProvider')
  return ctx
}