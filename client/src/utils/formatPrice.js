export const formatPrice = (price) => {
  const amount = Number(price)

  if (Number.isNaN(amount)) {
    return 'Price on request'
  }

  if (amount >= 10000000) {
    const crores = amount / 10000000
    return `\u20B9${crores.toFixed(crores >= 10 ? 1 : 2)} Cr`
  }

  if (amount >= 100000) {
    const lakhs = amount / 100000
    return `\u20B9${lakhs.toFixed(lakhs >= 10 ? 1 : 2)} L`
  }

  const formattedAmount = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount)

  return `\u20B9${formattedAmount}`
}
