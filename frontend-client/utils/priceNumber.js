export const priceNumber = (price, currency='vietnam') => {
	if(currency ==='vietnam') {
		let p = parseInt(price).toString()

		let l = p.length
		let i = l - 3
		let res = ""
		while (i > 0) {
			res = p.substring(i, i + 3) + "." + res
			i -= 3
		}

		i = i
		res = p.substring(0, i + 3) + "." + res
		return res.substring(0, res.length - 1)
	}

	return price
}
