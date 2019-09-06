  
const INITIAL_STATE = { histoLength: 0 };

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "HISTORY_SHOP":
      return { ...state, histoLength: action.payload.historyLength };
    default:
      return state;
  }
};