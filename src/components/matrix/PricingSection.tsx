import React, { useState } from 'react';
import { Check, X, Zap, ArrowRight, Building2, Mail } from 'lucide-react';

interface PricingSectionProps {
  onSelectPlan: (plan: string) => void;
  onContactEnterprise: () => void;
  currentPlan?: string;
}

const plans = [
  {
    id: 'free_trial',
    name: 'Free Trial',
    price: '$0',
    period: 'forever',
    description: 'Perfect for testing and small projects',
    gflops: '10,000 GFLOPS lifetime',
    highlight: false,
    features: [
      { text: '10,000 GFLOPS total', included: true },
      { text: '100 requests/hour', included: true },
      { text: 'All operations', included: true },
      { text: 'Community support', included: true },
      { text: 'API playground', included: true },
      { text: 'Priority support', included: false },
      { text: 'Custom SLA', included: false },
      { text: 'Dedicated endpoint', included: false },
    ],
    cta: 'Get Started Free',
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '$29',
    period: '/month',
    description: 'For growing teams and regular workloads',
    gflops: '+ $0.005 per 1,000 GFLOPS',
    highlight: false,
    features: [
      { text: 'Unlimited GFLOPS', included: true },
      { text: '1,000 requests/hour', included: true },
      { text: 'All operations', included: true },
      { text: 'Email support', included: true },
      { text: 'API playground', included: true },
      { text: 'Usage analytics', included: true },
      { text: 'Custom SLA', included: false },
      { text: 'Dedicated endpoint', included: false },
    ],
    cta: 'Start Starter Plan',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$99',
    period: '/month',
    description: 'For production workloads and power users',
    gflops: '+ $0.003 per 1,000 GFLOPS',
    highlight: true,
    features: [
      { text: 'Unlimited GFLOPS', included: true },
      { text: '10,000 requests/hour', included: true },
      { text: 'All operations', included: true },
      { text: 'Priority support (4hr SLA)', included: true },
      { text: 'API playground', included: true },
      { text: 'Advanced analytics', included: true },
      { text: '99.9% uptime SLA', included: true },
      { text: 'Webhook notifications', included: true },
    ],
    cta: 'Start Pro Plan',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large-scale deployments and custom needs',
    gflops: 'Volume discounts available',
    highlight: false,
    features: [
      { text: 'Unlimited everything', included: true },
      { text: 'Unlimited requests', included: true },
      { text: 'Custom operations', included: true },
      { text: 'Dedicated support team', included: true },
      { text: 'Private deployment', included: true },
      { text: 'Custom analytics', included: true },
      { text: '99.99% uptime SLA', included: true },
      { text: 'Dedicated endpoint', included: true },
    ],
    cta: 'Contact Sales',
  },
];

const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan, onContactEnterprise, currentPlan }) => {
  const [showEnterprise, setShowEnterprise] = useState(false);
  const [enterpriseForm, setEnterpriseForm] = useState({ name: '', email: '', company: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleEnterprise = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setShowEnterprise(false); setSubmitted(false); setEnterpriseForm({ name: '', email: '', company: '', message: '' }); }, 2000);
  };

  return (
    <section className="py-24 bg-white dark:bg-slate-950" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300 text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Simple, Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Pay only for what you compute
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Start free, scale as you grow. No hidden fees, no long-term commitments.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-6 flex flex-col transition-all hover:shadow-lg ${
                plan.highlight
                  ? 'border-blue-500 dark:border-blue-400 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-900 shadow-lg shadow-blue-500/10'
                  : 'border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/50'
              } ${currentPlan === plan.id ? 'ring-2 ring-blue-500' : ''}`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold">
                  Most Popular
                </div>
              )}
              {currentPlan === plan.id && (
                <div className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-green-500 text-white text-xs font-bold">
                  Current Plan
                </div>
              )}

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{plan.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">{plan.description}</p>

              <div className="mb-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{plan.price}</span>
                <span className="text-slate-500 dark:text-slate-400 text-sm">{plan.period}</span>
              </div>
              <p className="text-xs text-blue-600 dark:text-cyan-400 font-medium mb-6">{plan.gflops}</p>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-2 text-sm">
                    {f.included ? (
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mt-0.5 flex-shrink-0" />
                    )}
                    <span className={f.included ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-600'}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => plan.id === 'enterprise' ? setShowEnterprise(true) : onSelectPlan(plan.id)}
                className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  plan.highlight
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 shadow-lg shadow-blue-500/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Enterprise Contact Modal */}
        {showEnterprise && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowEnterprise(false)}>
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Contact Enterprise Sales</h3>
                  <p className="text-sm text-slate-500">We'll get back within 24 hours</p>
                </div>
              </div>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-white">Request submitted!</p>
                  <p className="text-sm text-slate-500 mt-1">Our team will reach out shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleEnterprise} className="space-y-4">
                  <input
                    type="text" placeholder="Full Name" required
                    value={enterpriseForm.name} onChange={e => setEnterpriseForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email" placeholder="Work Email" required
                    value={enterpriseForm.email} onChange={e => setEnterpriseForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text" placeholder="Company" required
                    value={enterpriseForm.company} onChange={e => setEnterpriseForm(p => ({ ...p, company: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    placeholder="Tell us about your workload..." rows={3}
                    value={enterpriseForm.message} onChange={e => setEnterpriseForm(p => ({ ...p, message: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setShowEnterprise(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold hover:from-blue-700 hover:to-cyan-600 flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4" /> Send Request
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingSection;
