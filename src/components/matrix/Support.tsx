import React, { useState } from 'react';
import { Mail, LifeBuoy, MessageCircle } from 'lucide-react';

const Support: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const resp = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, subject, message }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data && data.error ? data.error : 'Request failed');
      alert('Support request submitted. We will contact you soon.');
      setEmail(''); setSubject(''); setMessage('');
    } catch (err) {
      console.error(err);
      alert('Failed to submit request. Please try again or email support@matrixaccel.pro');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-4">Customer Support</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Need help? Browse our knowledge base, open a ticket, or send us a message and our support team will respond.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-3 mb-3">
                <LifeBuoy className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold">Knowledge Base</h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Find articles and guides for common tasks and troubleshooting.</p>
              <a href="/third_party/uvdesk/README.md" className="text-sm text-blue-600 hover:underline">View Helpdesk docs (local)</a>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="w-6 h-6 text-emerald-500" />
                <h3 className="text-lg font-semibold">Email Support</h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Send us a detailed message and we'll get back to you within 1 business day.</p>
              <a href="mailto:support@matrixaccel.pro" className="text-sm text-blue-600 hover:underline">support@matrixaccel.pro</a>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle className="w-6 h-6 text-indigo-500" />
                <h3 className="text-lg font-semibold">Open a Ticket</h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">If you have an account, you can open a ticket via our UVDesk helpdesk installation.</p>
              <a href="/helpdesk" className="text-sm text-blue-600 hover:underline">Open Helpdesk (self-hosted path)</a>
            </div>
          </div>

          <div>
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <h3 className="text-lg font-semibold mb-3">Contact Support</h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input type="email" required placeholder="Your email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
                <input type="text" required placeholder="Subject" value={subject} onChange={e=>setSubject(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
                <textarea required placeholder="Describe your issue" value={message} onChange={e=>setMessage(e.target.value)} rows={6} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
                <div className="flex justify-end">
                  <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm">Send Message</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
