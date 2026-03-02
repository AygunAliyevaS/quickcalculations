import React, { useEffect, useState } from 'react';
import { ArrowRight, Zap, Shield, Clock, Code2, TrendingUp, Server } from 'lucide-react';
import CodeBlock from './CodeBlock';

interface HeroProps {
  onGetStarted: () => void;
  onViewDocs: () => void;
}

const benchmarks = [
  { size: '100x100', numpy: '0.8ms', accel: '0.09ms', speedup: '8.9x' },
  { size: '500x500', numpy: '95ms', accel: '8.2ms', speedup: '11.6x' },
  { size: '1000x1000', numpy: '2.5s', accel: '0.18s', speedup: '13.9x' },
  { size: '2000x2000', numpy: '19.8s', accel: '1.6s', speedup: '12.4x' },
  { size: '5000x5000', numpy: '312s', accel: '28.4s', speedup: '11.0x' },
];

const pythonExample = `import requests

response = requests.post(
    "https://api.matrixaccel.pro/v1/multiply",
    headers={"Authorization": "Bearer ma_sk_..."},
    json={
        "A": [[1, 2, 3], [4, 5, 6]],
        "B": [[7, 8], [9, 10], [11, 12]]
    }
)

result = response.json()
print(result["result"])     # [[58, 64], [139, 154]]
print(result["metadata"])   # {gflops: 12.4, duration_ms: 0.18}`;

const Hero: React.FC<HeroProps> = ({ onGetStarted, onViewDocs }) => {
  const [activeRow, setActiveRow] = useState(0);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRow(prev => (prev + 1) % benchmarks.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const target = 13.9;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCounter(target);
        clearInterval(timer);
      } else {
        setCounter(Math.round(current * 10) / 10);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-900" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-purple-500/10 dark:from-blue-500/5 dark:via-cyan-500/5 dark:to-purple-500/5 blur-3xl rounded-full" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-cyan-400/5 blur-3xl rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Up to {counter}x faster than NumPy
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">10x Faster</span>{' '}
              Matrix Math in the Cloud
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 mb-4 max-w-xl leading-relaxed">
              High-performance matrix computation API for data scientists, ML engineers, and developers.
              No GPUs needed — CPU-optimized for blazing speed.
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400 mb-8">
              {[
                { icon: Clock, text: 'Sub-millisecond latency' },
                { icon: Shield, text: 'SOC2 compliant' },
                { icon: Server, text: 'No GPU required' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5">
                  <Icon className="w-4 h-4 text-blue-500" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mb-10">
              <button
                onClick={onGetStarted}
                className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={onViewDocs}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
              >
                <Code2 className="w-4 h-4" />
                View API Docs
              </button>
            </div>

            <p className="text-xs text-slate-400 dark:text-slate-500">
              10,000 GFLOPS free — no credit card required
            </p>
          </div>

          {/* Right: Code + Benchmark */}
          <div className="space-y-4">
            <CodeBlock code={pythonExample} language="python" title="example.py" />

            {/* Benchmark Table */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/80 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700/50 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-semibold text-slate-900 dark:text-white">Benchmark: Matrix Multiplication (matmul)</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                      <th className="text-left px-4 py-2.5 text-slate-500 dark:text-slate-400 font-medium">Size</th>
                      <th className="text-right px-4 py-2.5 text-slate-500 dark:text-slate-400 font-medium">NumPy</th>
                      <th className="text-right px-4 py-2.5 text-slate-500 dark:text-slate-400 font-medium">MatrixAccel</th>
                      <th className="text-right px-4 py-2.5 text-slate-500 dark:text-slate-400 font-medium">Speedup</th>
                    </tr>
                  </thead>
                  <tbody>
                    {benchmarks.map((row, i) => (
                      <tr
                        key={row.size}
                        className={`border-t border-slate-100 dark:border-slate-800 transition-colors duration-500 ${
                          i === activeRow ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                        }`}
                      >
                        <td className="px-4 py-2.5 font-mono text-slate-700 dark:text-slate-300">{row.size}</td>
                        <td className="px-4 py-2.5 text-right text-slate-500 dark:text-slate-400 font-mono">{row.numpy}</td>
                        <td className="px-4 py-2.5 text-right text-blue-600 dark:text-cyan-400 font-mono font-semibold">{row.accel}</td>
                        <td className="px-4 py-2.5 text-right">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                            i === activeRow
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            {row.speedup}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
