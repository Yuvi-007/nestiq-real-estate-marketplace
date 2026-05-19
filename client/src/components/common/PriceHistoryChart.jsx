import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { formatPrice } from '../../utils/formatPrice'

function PriceHistoryChart({ price }) {
  const currentPrice = Number(price || 0)
  const data = [
    { month: 'Jan', price: Math.round(currentPrice * 0.92) },
    { month: 'Feb', price: Math.round(currentPrice * 0.94) },
    { month: 'Mar', price: Math.round(currentPrice * 0.95) },
    { month: 'Apr', price: Math.round(currentPrice * 0.97) },
    { month: 'May', price: Math.round(currentPrice * 0.99) },
    { month: 'Now', price: currentPrice },
  ]

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold text-primary">Price History</h2>
      <p className="mt-1 text-sm text-slate-600">Mock trend based on current listing price.</p>

      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: 4, right: 10, top: 10, bottom: 0 }}>
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748B', fontSize: 12 }}
              tickFormatter={(value) => formatPrice(value)}
              width={82}
            />
            <Tooltip formatter={(value) => [formatPrice(value), 'Price']} />
            <Line type="monotone" dataKey="price" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default PriceHistoryChart
