import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import { User, LogOut, Shield } from 'lucide-react'

const ProfilePage = () => {
  const { user, logout } = useAuth()

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <Shield className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Guest Account</h2>
          <p className="text-sm text-slate-600 mb-6">
            You are currently using Veridex as a guest. Sign in to save preferences and get unlimited checks.
          </p>
          <Button to="/signin" variant="primary" className="w-full justify-center">
            Sign In to Veridex
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto my-12 p-6">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700 font-bold text-xl">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User size={24} />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 m-0">{user.name}</h2>
            <p className="text-xs font-mono text-slate-500 m-0">{user.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Account Type</span>
            <p className="text-sm font-semibold text-slate-900 mt-1 capitalize">{user.provider || 'Veridex Account'} (Unlimited Checks)</p>
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Checks Performed</span>
            <p className="text-sm font-semibold text-slate-900 mt-1 font-mono">{user.usageCount || 0} analyses</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-3">
          <button
            onClick={logout}
            className="w-full py-2.5 px-4 font-semibold text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2 cursor-pointer bg-white"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage