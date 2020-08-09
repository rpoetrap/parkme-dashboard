import { createContext, useReducer, FunctionComponent, Dispatch } from 'react';

interface UserState {
	user: any;
	logout: boolean;
}

interface Action {
  type: 'set_user' | 'remove_user' | 'logout',
  payload?: any;
}

const initialState: UserState = {
  user: null,
  logout: false
};
const StateUserContext = createContext<UserState>(null as any);
const DispatchUserContext= createContext<Dispatch<Action>>(null as any);

const reducer = (state: UserState, action: Action) => {
  switch (action.type) {
    case 'set_user':
      return {
        ...state,
        user: action.payload,
        logout: false
      };
    case 'remove_user':
      return {
        ...state,
        user: null,
        logout: true
      };
    case 'logout':
      return {
        ...state,
        logout: true
      };
    default:
      throw new Error('No action type was given.');
  }
};

const UserProvider: FunctionComponent = (props) => {
	const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateUserContext.Provider value={state}>
      <DispatchUserContext.Provider value={dispatch}>
        {props.children}
      </DispatchUserContext.Provider>
    </StateUserContext.Provider>
  );
};

export { UserProvider, StateUserContext, DispatchUserContext };