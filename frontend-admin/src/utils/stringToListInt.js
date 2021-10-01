export const stringToListInt = (s) => {
    let rs = [];
    let t = s.trim()
    if(t !== '') {
        try {
            rs = t.split(" ").map(i => parseInt(i));
        } catch (error) {
            return []
        }
    }
    return rs;
}
