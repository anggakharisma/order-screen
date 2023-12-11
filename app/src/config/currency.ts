const idrCurrency = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" })
const usdCurrency = new Intl.NumberFormat("en-EN", { style: "currency", currency: "USD" })

export {
  idrCurrency,
  usdCurrency
}
