import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const chartColors = ['#0F172A', '#F59E0B', '#10B981', '#F43F5E', '#64748B', '#38BDF8']

function EmptyChart({ title }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-extrabold text-primary">{title}</h3>
      <div className="mt-4 flex h-64 items-center justify-center rounded-lg bg-slate-50 text-sm font-semibold text-slate-500">
        No chart data yet
      </div>
    </div>
  )
}

function DonutChart({ title, data }) {
  if (!data?.length) {
    return <EmptyChart title={title} />
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-extrabold text-primary">{title}</h3>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold text-slate-600">
        {data.map((item, index) => (
          <span key={item.name} className="inline-flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: chartColors[index % chartColors.length] }}
            />
            {item.name}: {item.value}
          </span>
        ))}
      </div>
    </div>
  )
}

function StatusChart({ data }) {
  if (!data?.length) {
    return <EmptyChart title="Listing Status" />
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
      <h3 className="text-lg font-extrabold text-primary">Listing Status</h3>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function AdminCharts({ stats }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <DonutChart title="User Roles" data={stats?.userRoleBreakdown || []} />
      <DonutChart title="Property Types" data={stats?.propertyTypeBreakdown || []} />
      <StatusChart data={stats?.listingStatusBreakdown || []} />
    </div>
  )
}

export default AdminCharts
