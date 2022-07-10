const initialState = {
    token: null,
  }
  
const reducer = (state = initialState, action) => {
    switch (action.type){
    case 'SET_TOKEN':  
        return {...state, 
            token:
            action.token
            };
    case 'REMOVE_TOKEN':  
        return {...state, 
            token: initialState.token
            };
    default:
      return state
    }
  };

 export default reducer;