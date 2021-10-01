export const uuid = (length) => {
    let rs = ''
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let charactersLength = characters.length
    for ( let i = 0; i < length; i++ ) {
      rs += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return rs
}
