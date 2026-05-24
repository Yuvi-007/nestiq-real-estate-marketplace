import { ShieldCheck, ShieldX, Trash2 } from 'lucide-react'

import Card from '../ui/Card'
import EmptyState from '../ui/EmptyState'
import StatusBadge from '../ui/StatusBadge'

const roles = ['buyer', 'seller', 'agent', 'admin']

function AdminUsersTable({ users, currentUserId, onUpdateUser, onDeleteUser, busyUserId }) {
  if (users.length === 0) {
    return (
      <EmptyState
        title="No users found"
        description="Try clearing the role filter or refreshing the table."
      />
    )
  }

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-extrabold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Email</th>
              <th className="px-5 py-4">Role</th>
              <th className="px-5 py-4">Phone</th>
              <th className="px-5 py-4">Verified</th>
              <th className="px-5 py-4">Created</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => {
              const isBusy = busyUserId === user._id
              const isCurrentUser = currentUserId === user._id

              return (
                <tr key={user._id} className="align-top">
                  <td className="px-5 py-4 font-bold text-primary">{user.name || '-'}</td>
                  <td className="px-5 py-4 text-slate-600">{user.email || '-'}</td>
                  <td className="px-5 py-4">
                    <select
                      value={user.role}
                      disabled={isBusy}
                      onChange={(event) => onUpdateUser(user._id, { role: event.target.value })}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-primary outline-none transition focus:border-accent disabled:cursor-wait disabled:opacity-60"
                      aria-label={`Change role for ${user.name}`}
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{user.phone || '-'}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={user.isVerified ? 'approved' : 'sold'} className="normal-case">
                      {user.isVerified ? 'Verified' : 'Unverified'}
                    </StatusBadge>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onUpdateUser(user._id, { isVerified: !user.isVerified })}
                        disabled={isBusy}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-success hover:text-success disabled:cursor-wait disabled:opacity-60"
                        aria-label={user.isVerified ? 'Unverify user' : 'Verify user'}
                        title={user.isVerified ? 'Unverify user' : 'Verify user'}
                      >
                        {user.isVerified ? <ShieldX size={16} /> : <ShieldCheck size={16} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteUser(user._id)}
                        disabled={isBusy || isCurrentUser}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-danger hover:text-danger disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Delete user"
                        title={isCurrentUser ? 'Admins cannot delete themselves' : 'Delete user'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default AdminUsersTable
