import React, { useState } from 'react';
import { ChevronDown, Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Dr. Sarah Chen',
    role: 'Lead ML Engineer',
    company: 'DeepVision AI',
    text: 'MatrixAccel Pro cut our preprocessing pipeline from 45 minutes to under 4 minutes. The API is incredibly simple and the performance gains are real.',
    avatar: 'SC',
    rating: 5,
  },
  {
    name: 'James Rodriguez',
    role: 'Quantitative Analyst',
    company: 'Apex Capital',
    text: 'We run Monte Carlo simulations with 10K+ matrices daily. Switching to MatrixAccel saved us $2,400/month in compute costs while being 12x faster.',
    avatar: 'JR',
    rating: 5,
  },
  {
    name: 'Dr. Priya Sharma',
    role: 'Research Scientist',
    company: 'MIT CSAIL',
    text: 'The zero-setup API approach is perfect for our research team. We went from prototype to production in a single afternoon. Remarkable performance.',
    avatar: 'PS',
    rating: 5,
  },
  {
    name: 'Marcus Thompson',
    role: 'CTO',
    company: 'DataFlow Systems',
    text: 'We evaluated GPU cloud solutions but MatrixAccel Pro on CPU outperformed them for our matrix sizes. The cost savings alone justified the switch.',
    avatar: 'MT',
    rating: 5,
  },
];

const faqs = [
  {
    q: 'How does MatrixAccel Pro achieve faster speeds than NumPy without GPUs?',
    a: 'We use advanced CPU-optimized algorithms including SIMD vectorization, cache-aware tiling, multi-threaded parallelism, and custom memory allocators. Our engine is written in optimized C++ with hand-tuned assembly for critical paths, delivering 5-15x speedups for typical matrix sizes.',
  },
  {
    q: 'What matrix sizes are supported?',
    a: 'We support matrices from 1x1 up to 50,000x50,000 elements. For the free tier, the maximum is 1,000x1,000. Starter supports up to 10,000x10,000, and Pro/Enterprise handle the full range. Sparse matrix support is coming in Q2 2026.',
  },
  {
    q: 'Is my data secure? Do you store matrices?',
    a: 'Absolutely. All data is transmitted over TLS 1.3, processed in isolated containers, and immediately discarded after computation. We never store your matrix data. Our infrastructure is SOC2 Type II certified and we undergo regular third-party security audits.',
  },
  {
    q: 'How is GFLOPS usage calculated?',
    a: 'GFLOPS (Giga Floating-Point Operations Per Second) measures computational work. For matrix multiplication of size NxN, we calculate 2*N³ floating-point operations. Your usage is the sum of all operations performed. You can monitor real-time usage in your dashboard.',
  },
  {
    q: 'Can I use MatrixAccel Pro with my existing Python/NumPy code?',
    a: 'Yes! Our Python SDK (pip install matrixaccel) provides a drop-in replacement for numpy.matmul, numpy.transpose, and other operations. Simply replace your imports and your existing code works with our accelerated backend. We also support raw REST API calls from any language.',
  },
  {
    q: 'What happens if I exceed my rate limit or GFLOPS quota?',
    a: 'You\'ll receive a clear 429 (rate limit) or 402 (quota exceeded) error response with details. Free tier users can upgrade anytime. We never throttle without warning — you\'ll get email alerts at 80% and 95% usage.',
  },
  {
    q: 'Do you offer on-premise or private cloud deployment?',
    a: 'Yes, our Enterprise plan includes options for private cloud deployment (AWS, GCP, Azure) or on-premise installation. Contact our sales team for architecture details and pricing.',
  },
  {
    q: 'What operations are supported beyond matrix multiplication?',
    a: 'We support: multiplication (matmul), transpose, elementwise operations (add, subtract, multiply, divide), random matrix generation, identity matrix generation, determinant, inverse, eigenvalue decomposition, SVD, and benchmarking. More operations are added monthly.',
  },
];

const TestimonialsAndFAQ: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      {/* Testimonials */}
      <section className="py-24 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Trusted by engineering teams worldwide
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              See what developers and data scientists are saying about MatrixAccel Pro
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="relative mb-4">
                  <Quote className="absolute -top-1 -left-1 w-8 h-8 text-blue-100 dark:text-blue-900/50" />
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-6">
                    {t.text}
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.role} at {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '2,400+', label: 'Active developers' },
              { value: '99.97%', label: 'Uptime SLA' },
              { value: '12.4B', label: 'GFLOPS processed' },
              { value: '<50ms', label: 'Avg response time' },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                <p className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Frequently asked questions
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Everything you need to know about MatrixAccel Pro
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/50 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-sm font-medium text-slate-900 dark:text-white pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default TestimonialsAndFAQ;
