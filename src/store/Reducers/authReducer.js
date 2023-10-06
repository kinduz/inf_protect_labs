const initialState = {
  isAuth: false,
  userRole: null,
  userLogin: null,
  userPassword: null,
  isBlock: null,
  isIndividual: null,
  users: null,
};

const LOGIN = "LOGIN";
const ADD_USERS = "ADD_USERS";
const CHANGE_USER_PASS = "CHANGE_USER_PASS";
const LOGOUT = "LOGOUT";
const SET_NEW_LIMITS = 'SET_NEW_LIMITS';

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isAuth: true,
        userRole: action.payload.role,
        userLogin: action.payload.login,
        userPassword: action.payload.password,
        users: state.users,
        isBlock: action.payload.isBlock,
        isIndividual: action.payload.isIndividual
      };
    case ADD_USERS:
      return { ...state, users: action.payload };
      case LOGOUT:
        return {
          ...state,
          isAuth: false,
          userRole: null,
          userLogin: null,
          userPassword: null,
          users: null,
          isBlock: null, 
          isIndividual: null
        };
    case CHANGE_USER_PASS:
      return {
        ...state,
        isAuth: true,
        userRole: state.userRole,
        userLogin: state.userLogin,
        userPassword: action.payload,
        users: state.users,
        isBlock: state.isBlock,
        isIndividual: state.isIndividual
      };
    case SET_NEW_LIMITS:
      return {
        ...state,
        isAuth: true,
        userRole: state.userRole,
        userLogin: state.userLogin,
        userPassword: state.userPassword,
        users: state.users,
        isBlock: action.payload.isBlock,
        isIndividual: action.payload.isIndividual
      }
    default:
      return state;
  }
};

export const loginAction = (role, login, isBlock, isIndividual, password) => {
  const data = { role, login, isBlock, isIndividual, password };
  return { type: LOGIN, payload: data };
};

export const addNewUsersAction = (users) => {
  return { type: ADD_USERS, payload: users };
};

export const setNewPasswordAction = (password) => {
    return {type: CHANGE_USER_PASS, payload: password}
}

export const setNewLimitsAction = (isBlock, isIndividual) => {
  const data = { isBlock, isIndividual };
  return {type: SET_NEW_LIMITS, payload: data}
}

export const logoutAction = () => {
  return { type: LOGOUT };
};
