import React from 'react';
import {
  Zap, Shield, Code2, DollarSign, Server, Puzzle,
  ArrowRight
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Blazing Fast Compute',
    description: 'CPU-optimized matrix operations delivering 5-15x speedup over standard NumPy. SIMD-accelerated with cache-aware algorithms.',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950/20',
  },
  {
    icon: Code2,
    title: 'Simple REST API',
    description: 'Clean JSON-based API with comprehensive documentation. Send matrices, get results — multiply, transpose, elementwise, and more.',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
  },
  {
    icon: DollarSign,
    title: 'Usage-Based Pricing',
    description: 'Pay only for what you use. Start free with 10,000 GFLOPS, then scale with transparent per-GFLOPS pricing. No hidden fees.',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'End-to-end encryption, SOC2 compliance, and zero data retention. Your matrices are processed and immediately discarded.',
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
  },
  {
    icon: Server,
    title: 'No GPU Required',
    description: 'Our CPU-optimized engine outperforms GPU solutions for matrices under 10K dimensions. Save 80% on infrastructure costs.',
    color: 'from-rose-500 to-pink-500',
    bgColor: 'bg-rose-50 dark:bg-rose-950/20',
  },
  {
    icon: Puzzle,
    title: 'Python SDK & Integrations',
    description: 'Native Python SDK with NumPy compatibility. Drop-in replacement for np.matmul with automatic batching and retry logic.',
    color: 'from-cyan-500 to-teal-500',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950/20',
  },
];

const useCases = [
  { title: 'ML Preprocessing', desc: 'Feature engineering, PCA, and data transformations at scale' },
  { title: 'Financial Modeling', desc: 'Monte Carlo simulations, portfolio optimization, risk analysis' },
  { title: 'Scientific Computing', desc: 'Physics simulations, signal processing, linear algebra' },
  { title: 'Computer Vision', desc: 'Image transformations, convolution kernels, batch processing' },
];

const Features: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50/50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
            <Server className="w-4 h-4" />
            Built for Performance
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Everything you need for{' '}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              high-performance compute
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            From rapid prototyping to production workloads, MatrixAccel Pro handles your matrix operations with unmatched speed and reliability.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-lg hover:shadow-blue-500/5"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 bg-gradient-to-r ${feature.color} bg-clip-text`} style={{ color: feature.color.includes('amber') ? '#f59e0b' : feature.color.includes('blue') ? '#3b82f6' : feature.color.includes('green') ? '#22c55e' : feature.color.includes('purple') ? '#a855f7' : feature.color.includes('rose') ? '#f43f5e' : '#06b6d4' }} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Use Cases */}
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Built for your workload</h3>
          <p className="text-slate-600 dark:text-slate-400">Trusted by teams across industries for mission-critical computation</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {useCases.map((uc) => (
            <div key={uc.title} className="p-5 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all group cursor-default">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                {uc.title}
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">{uc.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
