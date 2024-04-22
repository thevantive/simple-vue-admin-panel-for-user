const yearconfig = { month: 'long', year: 'numeric' }
const timeconfig = { hour: 'numeric', minute: 'numeric', hour12: false }
const daysName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

export const Formatter = {
  currencyToNumber(value) {
    return parseInt(value.toString().replace(/[^\d]/g, ''))
  },
  currency(value) {
    value = this.currencyToNumber(value)

    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    })

    return formatter.format(value)
  },
  date(value) {
    const date = new Date(value)
    if (!value || value == '0001-01-01T00:00:00Z') return 'n/a'
    return `${date.getDate()} ${date.toLocaleDateString('id-ID', yearconfig)}`
  },
  datetime(value) {
    const date = new Date(value)
    if (!value || value == '0001-01-01T00:00:00Z') return 'n/a'
    return `${daysName[date.getDay()]} ${this.time(date)} WIB, ${date.getDate()} ${date.toLocaleDateString('id-ID', yearconfig)}`
  },
  time(value) {
    return value.toLocaleTimeString('id-ID', timeconfig)
  }
}
