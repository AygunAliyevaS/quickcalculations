import React, { useState, useEffect } from 'react';
import {
  Key, Copy, Check, Plus, Trash2, Eye, EyeOff,
  Activity, TrendingUp, Clock, Zap, RefreshCw,
  ArrowUpRight, Shield, AlertTriangle, Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface DashboardProps {
  userId: string;
  userEmail: string;
  userPlan: string;
  onNavigate: (page: string) => void;
}

interface ApiKeyData {
  id: string;
  key_name: string;
  api_key: string;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
}

interface UsageLog {
  id: string;
  operation: string;
  matrix_size: string;
  duration_ms: number;
  gflops_used: number;
  status: string;
  created_at: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userId, userEmail, userPlan, onNavigate }) => {
  const [apiKeys, setApiKeys] = useState<ApiKeyData[]>([]);
  const [usageLogs, setUsageLogs] = useState<UsageLog[]>([]);
  const [totalGflops, setTotalGflops] = useState(0);
  const [gflopsLimit, setGflopsLimit] = useState(10000);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [newKeyName, setNewKeyName] = useState('');
  const [showNewKey, setShowNewKey] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [keysRes, logsRes, profileRes] = await Promise.all([
        supabase.from('api_keys').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('usage_logs').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(50),
        supabase.from('user_profiles').select('gflops_used, gflops_limit').eq('id', userId).single(),
      ]);

      if (keysRes.data) setApiKeys(keysRes.data);
      if (logsRes.data) setUsageLogs(logsRes.data);
      if (profileRes.data) {
        setTotalGflops(Number(profileRes.data.gflops_used) || 0);
        setGflopsLimit(Number(profileRes.data.gflops_limit) || 10000);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
    setLoading(false);
  };

  const generateApiKey = async () => {
    const keyName = newKeyName.trim() || `Key ${apiKeys.length + 1}`;
    const apiKey = 'ma_sk_' + crypto.randomUUID().replace(/-/g, '').substring(0, 32);

    const { data, error } = await supabase.from('api_keys').insert({
      user_id: userId,
      key_name: keyName,
      api_key: apiKey,
      is_active: true,
    }).select().single();

    if (data) {
      setApiKeys(prev => [data, ...prev]);
      setNewKeyName('');
      setShowNewKey(false);
      setVisibleKeys(prev => new Set(prev).add(data.id));
    }
  };

  const revokeKey = async (keyId: string) => {
    await supabase.from('api_keys').update({ is_active: false }).eq('id', keyId);
    setApiKeys(prev => prev.map(k => k.id === keyId ? { ...k, is_active: false } : k));
  };

  const deleteKey = async (keyId: string) => {
    await supabase.from('api_keys').delete().eq('id', keyId);
    setApiKeys(prev => prev.filter(k => k.id !== keyId));
  };

  const copyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const maskKey = (key: string) => key.substring(0, 10) + '...' + key.substring(key.length - 4);

  const usagePercent = gflopsLimit > 0 ? Math.min((totalGflops / gflopsLimit) * 100, 100) : 0;
  const planNames: Record<string, string> = { free_trial: 'Free Trial', starter: 'Starter', pro: 'Pro', enterprise: 'Enterprise' };
  const requestCount = usageLogs.length;
  const avgDuration = usageLogs.length > 0 ? (usageLogs.reduce((s, l) => s + (Number(l.duration_ms) || 0), 0) / usageLogs.length).toFixed(1) : '0';

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, {userEmail} &middot; <span className="capitalize text-blue-600 dark:text-blue-400 font-medium">{planNames[userPlan] || userPlan}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadData} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={() => onNavigate('playground')} className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all flex items-center gap-1.5">
            <Zap className="w-4 h-4" /> Open Playground
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'GFLOPS Used', value: totalGflops.toLocaleString(), sub: `of ${gflopsLimit.toLocaleString()} limit`, icon: TrendingUp, color: 'text-blue-500' },
          { label: 'API Requests', value: requestCount.toString(), sub: 'Total calls made', icon: Activity, color: 'text-green-500' },
          { label: 'Avg Response', value: `${avgDuration}ms`, sub: 'Average latency', icon: Clock, color: 'text-amber-500' },
          { label: 'Active Keys', value: apiKeys.filter(k => k.is_active).length.toString(), sub: `${apiKeys.length} total keys`, icon: Key, color: 'text-purple-500' },
        ].map((stat) => (
          <div key={stat.label} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Usage Bar */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/50 mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">GFLOPS Usage</h3>
            <p className="text-sm text-slate-500">{totalGflops.toLocaleString()} / {gflopsLimit.toLocaleString()} GFLOPS</p>
          </div>
          {usagePercent > 80 && (
            <div className="flex items-center gap-1.5 text-amber-600 text-sm">
              <AlertTriangle className="w-4 h-4" />
              {usagePercent >= 100 ? 'Quota exceeded' : 'Approaching limit'}
            </div>
          )}
          <button onClick={() => onNavigate('pricing')} className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            Upgrade <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              usagePercent >= 100 ? 'bg-red-500' : usagePercent > 80 ? 'bg-amber-500' : 'bg-gradient-to-r from-blue-500 to-cyan-400'
            }`}
            style={{ width: `${Math.min(usagePercent, 100)}%` }}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* API Keys */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/50 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-slate-900 dark:text-white">API Keys</h3>
            </div>
            <button onClick={() => setShowNewKey(!showNewKey)} className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              <Plus className="w-4 h-4" /> New Key
            </button>
          </div>

          {showNewKey && (
            <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-700/50 bg-blue-50/50 dark:bg-blue-950/20 flex gap-2">
              <input
                type="text" placeholder="Key name (optional)" value={newKeyName}
                onChange={e => setNewKeyName(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={generateApiKey} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
                Generate
              </button>
            </div>
          )}

          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto">
            {apiKeys.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400">
                No API keys yet. Generate one to get started.
              </div>
            ) : apiKeys.map(key => (
              <div key={key.id} className="px-5 py-3 flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${key.is_active ? 'bg-green-500' : 'bg-slate-300'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{key.key_name}</p>
                  <p className="text-xs font-mono text-slate-400 truncate">
                    {visibleKeys.has(key.id) ? key.api_key : maskKey(key.api_key)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setVisibleKeys(prev => {
                      const next = new Set(prev);
                      next.has(key.id) ? next.delete(key.id) : next.add(key.id);
                      return next;
                    })}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {visibleKeys.has(key.id) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => copyKey(key.api_key, key.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {copiedKey === key.id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  {key.is_active ? (
                    <button onClick={() => revokeKey(key.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30" title="Revoke">
                      <Shield className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button onClick={() => deleteKey(key.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Request History */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/50 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700/50 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Recent Requests</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {usageLogs.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-400 mb-2">No API calls yet</p>
                <button onClick={() => onNavigate('playground')} className="text-sm text-blue-600 hover:underline">
                  Try the Playground
                </button>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 sticky top-0">
                  <tr>
                    <th className="text-left px-4 py-2 text-slate-500 font-medium">Operation</th>
                    <th className="text-left px-4 py-2 text-slate-500 font-medium">Size</th>
                    <th className="text-right px-4 py-2 text-slate-500 font-medium">Time</th>
                    <th className="text-right px-4 py-2 text-slate-500 font-medium">GFLOPS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {usageLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${
                          log.status === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        }`}>
                          {log.operation}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-slate-500 text-xs">{log.matrix_size || '-'}</td>
                      <td className="px-4 py-2.5 text-right font-mono text-slate-500 text-xs">{Number(log.duration_ms).toFixed(1)}ms</td>
                      <td className="px-4 py-2.5 text-right font-mono text-blue-600 dark:text-cyan-400 text-xs">{Number(log.gflops_used).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
