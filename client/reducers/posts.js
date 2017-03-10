
function posts(state = [], action) {

  switch(action.type) {
    case 'INCREMENT_LIKES':
        console.log('Incrementing likes')
        const i = action.index
        return [
          ...state.slice(0,i),
          {...state[i], likes: state[i].likes+1},
          ...state.slice(i+1)
        ]
    // RETURN THE UPDATED state
    default:
      return state;
  }


}

export default posts;
