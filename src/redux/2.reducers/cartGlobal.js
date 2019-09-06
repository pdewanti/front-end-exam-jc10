const INITIAL_STATE = {cartLength : 0}

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case 'CARTING':
            return {...state, cartLength: action.payload.cartLength}
        default:
            return state
    }
}