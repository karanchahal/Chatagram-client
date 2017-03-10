export function increment(index) {
  return {
      type:'INCREMENT',
      index
    }
}


export function addComment(postid,author,comment) {
  return {
      type:'ADD_COMMENT',
      postid,
      author,
      comment
    }
}

export function removeComment(postId,i) {
  return {
    type: 'REMOVE_COMMENT',
    postId,
    i
  }
}
