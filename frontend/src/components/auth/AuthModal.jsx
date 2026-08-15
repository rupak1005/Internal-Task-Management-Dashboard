import { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { LogIn, UserPlus, Shield, User } from 'lucide-react';

export function AuthModal({ isOpen, onClose }) {
  const { login, register, switchDemoUser, users } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Member'
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, val) => {
    setFormData((p) => ({ ...p, [field]: val }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: null }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrors({
        email: !formData.email ? 'Email is required' : null,
        password: !formData.password ? 'Password is required' : null
      });
      return;
    }
    try {
      setLoading(true);
      await login({ email: formData.email, password: formData.password });
      toast.success('Logged in successfully');
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      setLoading(true);
      await register(formData);
      toast.success('Account created and logged in');
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (email) => {
    try {
      setLoading(true);
      await switchDemoUser(email, 'password123');
      toast.success('Switched account');
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={tab === 'login' ? 'Team Member Sign In' : 'Register New Account'}
      subtitle={tab === 'login' ? 'Access your workspace deliverables and dashboard' : 'Join the internal workspace team'}
      maxWidth="max-w-md"
    >
      <div className="space-y-5">
        {/* Tab switch */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200/80 dark:border-slate-700">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              tab === 'login'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              tab === 'register'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            Register
          </button>
        </div>

        {/* 1-Click Demo Accounts */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Instant Demo Accounts</span>
            <span className="text-[10px] text-slate-400">Pass: password123</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoClick('sarah.chen@enterprise.io')}
              disabled={loading}
              className="p-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-blue-500 text-left transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600">
                <Shield className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Sarah Chen</span>
              </div>
              <div className="text-[10px] text-slate-400">Admin Role</div>
            </button>

            <button
              onClick={() => handleDemoClick('alex.rivera@enterprise.io')}
              disabled={loading}
              className="p-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-blue-500 text-left transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600">
                <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>Alex Rivera</span>
              </div>
              <div className="text-[10px] text-slate-400">Member Role</div>
            </button>
          </div>
        </div>

        {/* Sign in / Register Form */}
        {tab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. sarah.chen@enterprise.io"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={errors.password}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              icon={LogIn}
              isLoading={loading}
            >
              Sign In to Workspace
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <Input
              label="Full Name"
              placeholder="e.g. Jordan Matthews"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={errors.name}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. jordan@company.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={errors.password}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Workspace Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="Member">Member (View & manage deliverables)</option>
                <option value="Admin">Admin (Full administrative control)</option>
              </select>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              icon={UserPlus}
              isLoading={loading}
            >
              Create Account
            </Button>
          </form>
        )}
      </div>
    </Modal>
  );
}
