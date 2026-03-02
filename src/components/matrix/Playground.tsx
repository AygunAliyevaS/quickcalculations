import React, { useState } from 'react';
import {
  Play, Loader2, RotateCcw, ChevronDown, Clock, Zap,
  AlertCircle, Check, ArrowRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import CodeBlock from './CodeBlock';

interface PlaygroundProps {
  userId: string;
}

const operations = [
  { id: 'multiply', label: 'Matrix Multiply', desc: 'A × B', needsB: true },
  { id: 'transpose', label: 'Transpose', desc: 'Aᵀ', needsB: false },
  { id: 'elementwise', label: 'Elementwise', desc: 'A ⊕ B', needsB: true },
  { id: 'random', label: 'Random Matrix', desc: 'Generate', needsB: false },
  { id: 'identity', label: 'Identity Matrix', desc: 'I(n)', needsB: false },
  { id: 'benchmark', label: 'Benchmark', desc: 'Speed test', needsB: false },
];

const elementwiseOps = ['add', 'subtract', 'multiply', 'divide'];

const defaultA = '[[1, 2, 3],\n [4, 5, 6],\n [7, 8, 9]]';
const defaultB = '[[9, 8, 7],\n [6, 5, 4],\n [3, 2, 1]]';

const Playground: React.FC<PlaygroundProps> = ({ userId }) => {
  const [operation, setOperation] = useState('multiply');
  const [matrixA, setMatrixA] = useState(defaultA);
  const [matrixB, setMatrixB] = useState(defaultB);
  const [subOp, setSubOp] = useState('add');
  const [size, setSize] = useState('50');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentOp = operations.find(o => o.id === operation)!;

  const parseMatrix = (str: string): number[][] | null => {
    try {
      const parsed = JSON.parse(str);
      if (!Array.isArray(parsed) || !parsed.every(r => Array.isArray(r) && r.every(v => typeof v === 'number'))) return null;
      return parsed;
    } catch { return null; }
  };

  const runComputation = async () => {
    setError('');
    setResult(null);
    setLoading(true);

    try {
      let body: any = { operation };

      if (['multiply', 'transpose', 'elementwise'].includes(operation)) {
        const A = parseMatrix(matrixA);
        if (!A) { setError('Invalid matrix A. Use JSON format: [[1,2],[3,4]]'); setLoading(false); return; }
        body.A = A;

        if (currentOp.needsB) {
          const B = parseMatrix(matrixB);
          if (!B) { setError('Invalid matrix B. Use JSON format: [[1,2],[3,4]]'); setLoading(false); return; }
          body.B = B;
        }

        if (operation === 'elementwise') body.op = subOp;
      } else if (operation === 'random') {
        body.rows = parseInt(size) || 3;
        body.cols = parseInt(size) || 3;
      } else if (operation === 'identity') {
        body.size = parseInt(size) || 3;
      } else if (operation === 'benchmark') {
        body.size = Math.min(parseInt(size) || 50, 300);
      }

      const { data, error: fnError } = await supabase.functions.invoke('matrix-compute', { body });

      if (fnError) throw fnError;
      if (!data.success) throw new Error(data.error);

      setResult(data);

      // Log usage
      const gflopsUsed = data.metadata?.gflops || 0.001;
      await supabase.from('usage_logs').insert({
        user_id: userId,
        operation,
        matrix_size: data.metadata?.matrix_size || `${size}x${size}`,
        duration_ms: data.metadata?.duration_ms || 0,
        gflops_used: gflopsUsed,
        status: 'success',
      });

      // Update user gflops
      await supabase.rpc('increment_gflops', { uid: userId, amount: gflopsUsed }).catch(() => {
        // If RPC doesn't exist, do manual update
        supabase.from('user_profiles')
          .select('gflops_used')
          .eq('id', userId)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              supabase.from('user_profiles')
                .update({ gflops_used: Number(profile.gflops_used) + gflopsUsed })
                .eq('id', userId)
                .then(() => {});
            }
          });
      });

    } catch (err: any) {
      setError(err.message || 'Computation failed');
      await supabase.from('usage_logs').insert({
        user_id: userId,
        operation,
        matrix_size: size + 'x' + size,
        duration_ms: 0,
        gflops_used: 0,
        status: 'error',
      });
    }
    setLoading(false);
  };

  const formatResult = (res: any): string => {
    if (!res) return '';
    return JSON.stringify(res, null, 2);
  };

  const reset = () => {
    setMatrixA(defaultA);
    setMatrixB(defaultB);
    setSize('50');
    setResult(null);
    setError('');
  };

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">API Playground</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Test matrix operations in real-time. Results are computed on our accelerated backend.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-4">
          {/* Operation Selector */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/50 p-5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Operation</label>
            <div className="grid grid-cols-3 gap-2">
              {operations.map(op => (
                <button
                  key={op.id}
                  onClick={() => { setOperation(op.id); setResult(null); setError(''); }}
                  className={`p-3 rounded-xl text-left transition-all border ${
                    operation === op.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                      : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                >
                  <p className={`text-sm font-medium ${operation === op.id ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>
                    {op.label}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{op.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Matrix Inputs */}
          {['multiply', 'transpose', 'elementwise'].includes(operation) && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/50 p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Matrix A (JSON)</label>
                <textarea
                  value={matrixA}
                  onChange={e => setMatrixA(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              {currentOp.needsB && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Matrix B (JSON)</label>
                  <textarea
                    value={matrixB}
                    onChange={e => setMatrixB(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              )}
              {operation === 'elementwise' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Sub-operation</label>
                  <div className="flex gap-2">
                    {elementwiseOps.map(op => (
                      <button
                        key={op}
                        onClick={() => setSubOp(op)}
                        className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-all ${
                          subOp === op
                            ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-transparent'
                        }`}
                      >
                        {op}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Size Input */}
          {['random', 'identity', 'benchmark'].includes(operation) && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/50 p-5">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {operation === 'benchmark' ? 'Benchmark Size (max 300)' : 'Matrix Size'}
              </label>
              <input
                type="number"
                value={size}
                onChange={e => setSize(e.target.value)}
                min={1}
                max={operation === 'benchmark' ? 300 : 500}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-400 mt-1.5">
                {operation === 'random' && `Generates a ${size}x${size} random matrix`}
                {operation === 'identity' && `Generates a ${size}x${size} identity matrix`}
                {operation === 'benchmark' && `Benchmarks ${size}x${size} matrix multiplication`}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={runComputation}
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-blue-500/25"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {loading ? 'Computing...' : 'Run Computation'}
            </button>
            <button
              onClick={reset}
              className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="space-y-4">
          {error && (
            <div className="flex items-start gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-400">Error</p>
                <p className="text-sm text-red-600 dark:text-red-300 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {result && (
            <>
              {/* Metadata */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/50 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">Success</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {result.metadata?.duration_ms !== undefined && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                        <Clock className="w-3.5 h-3.5" /> Duration
                      </div>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{result.metadata.duration_ms}ms</p>
                    </div>
                  )}
                  {result.metadata?.gflops !== undefined && result.metadata.gflops !== null && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                        <Zap className="w-3.5 h-3.5" /> GFLOPS
                      </div>
                      <p className="text-lg font-bold text-blue-600 dark:text-cyan-400">{result.metadata.gflops}</p>
                    </div>
                  )}
                  {result.metadata?.matrix_size && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                        <ArrowRight className="w-3.5 h-3.5" /> Size
                      </div>
                      <p className="text-lg font-bold text-slate-900 dark:text-white font-mono">{result.metadata.matrix_size}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Result */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/50 overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-700/50">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Result</h3>
                </div>
                <div className="max-h-96 overflow-auto">
                  <CodeBlock
                    code={formatResult(result.result)}
                    language="json"
                    className="border-0 rounded-none"
                  />
                </div>
              </div>

              {/* Full Response */}
              <details className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/50 overflow-hidden">
                <summary className="px-5 py-3 cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  View Full Response
                </summary>
                <div className="max-h-64 overflow-auto">
                  <CodeBlock code={formatResult(result)} language="json" className="border-0 rounded-none" />
                </div>
              </details>
            </>
          )}

          {!result && !error && (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Ready to compute</p>
              <p className="text-xs text-slate-400">Select an operation and click "Run Computation"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Playground;
