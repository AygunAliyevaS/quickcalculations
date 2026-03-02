import React, { useState } from 'react';
import {
  BookOpen, ChevronDown, ChevronRight, Lock, Code2,
  Terminal, Zap, ArrowRight, Copy, Check, Globe
} from 'lucide-react';
import CodeBlock from './CodeBlock';

const endpoints = [
  {
    method: 'POST',
    path: '/api/v1/multiply',
    title: 'Matrix Multiplication',
    description: 'Multiply two matrices A × B. Returns the result matrix with performance metadata.',
    request: `{
  "A": [[1, 2, 3], [4, 5, 6]],
  "B": [[7, 8], [9, 10], [11, 12]]
}`,
    response: `{
  "success": true,
  "result": [[58, 64], [139, 154]],
  "metadata": {
    "operation": "multiply",
    "duration_ms": 0.18,
    "gflops": 12.4,
    "matrix_size": "2x3 * 3x2"
  },
  "timestamp": "2026-02-19T08:00:00.000Z"
}`,
    params: [
      { name: 'A', type: 'number[][]', required: true, desc: 'First matrix (M×K)' },
      { name: 'B', type: 'number[][]', required: true, desc: 'Second matrix (K×N)' },
    ],
  },
  {
    method: 'POST',
    path: '/api/v1/transpose',
    title: 'Matrix Transpose',
    description: 'Compute the transpose of matrix A (swap rows and columns).',
    request: `{
  "A": [[1, 2, 3], [4, 5, 6]]
}`,
    response: `{
  "success": true,
  "result": [[1, 4], [2, 5], [3, 6]],
  "metadata": {
    "operation": "transpose",
    "duration_ms": 0.05,
    "matrix_size": "2x3"
  }
}`,
    params: [
      { name: 'A', type: 'number[][]', required: true, desc: 'Matrix to transpose (M×N)' },
    ],
  },
  {
    method: 'POST',
    path: '/api/v1/elementwise',
    title: 'Elementwise Operations',
    description: 'Perform elementwise operations (add, subtract, multiply, divide) on two matrices of the same dimensions.',
    request: `{
  "A": [[1, 2], [3, 4]],
  "B": [[5, 6], [7, 8]],
  "op": "add"
}`,
    response: `{
  "success": true,
  "result": [[6, 8], [10, 12]],
  "metadata": {
    "operation": "elementwise",
    "sub_operation": "add",
    "duration_ms": 0.03,
    "matrix_size": "2x2"
  }
}`,
    params: [
      { name: 'A', type: 'number[][]', required: true, desc: 'First matrix (M×N)' },
      { name: 'B', type: 'number[][]', required: true, desc: 'Second matrix (M×N, same dimensions)' },
      { name: 'op', type: 'string', required: false, desc: '"add" | "subtract" | "multiply" | "divide" (default: "add")' },
    ],
  },
  {
    method: 'POST',
    path: '/api/v1/random',
    title: 'Random Matrix Generation',
    description: 'Generate a random matrix with values between -100 and 100.',
    request: `{
  "rows": 3,
  "cols": 4
}`,
    response: `{
  "success": true,
  "result": [
    [42.15, -17.83, 91.02, -5.44],
    [73.21, 8.67, -44.55, 62.89],
    [-28.31, 55.12, 3.78, -88.64]
  ],
  "metadata": {
    "operation": "random",
    "duration_ms": 0.02,
    "matrix_size": "3x4"
  }
}`,
    params: [
      { name: 'rows', type: 'number', required: false, desc: 'Number of rows (default: 3, max: 500)' },
      { name: 'cols', type: 'number', required: false, desc: 'Number of columns (default: 3, max: 500)' },
    ],
  },
  {
    method: 'POST',
    path: '/api/v1/identity',
    title: 'Identity Matrix',
    description: 'Generate an identity matrix of given size.',
    request: `{
  "size": 4
}`,
    response: `{
  "success": true,
  "result": [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ],
  "metadata": {
    "operation": "identity",
    "duration_ms": 0.01,
    "matrix_size": "4x4"
  }
}`,
    params: [
      { name: 'size', type: 'number', required: false, desc: 'Matrix dimension (default: 3, max: 500)' },
    ],
  },
  {
    method: 'POST',
    path: '/api/v1/benchmark',
    title: 'Performance Benchmark',
    description: 'Run a benchmark test comparing baseline vs accelerated matrix multiplication performance.',
    request: `{
  "size": 100
}`,
    response: `{
  "success": true,
  "result": {
    "matrix_size": "100x100",
    "baseline_ms": 8.42,
    "accelerated_ms": 0.78,
    "speedup": "10.8x",
    "gflops_baseline": 0.237,
    "gflops_accelerated": 2.564
  },
  "metadata": {
    "operation": "benchmark",
    "duration_ms": 8.42,
    "matrix_size": "100x100"
  }
}`,
    params: [
      { name: 'size', type: 'number', required: false, desc: 'Square matrix dimension (default: 100, max: 300)' },
    ],
  },
];

const pythonExample = `import requests

API_KEY = "ma_sk_your_api_key_here"
BASE_URL = "https://api.matrixaccel.pro/v1"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# Matrix multiplication
response = requests.post(
    f"{BASE_URL}/multiply",
    headers=headers,
    json={
        "A": [[1, 2], [3, 4]],
        "B": [[5, 6], [7, 8]]
    }
)

data = response.json()
print(data["result"])      # [[19, 22], [43, 50]]
print(data["metadata"])    # Performance info`;

const curlExample = `curl -X POST https://api.matrixaccel.pro/v1/multiply \\
  -H "Authorization: Bearer ma_sk_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "A": [[1, 2], [3, 4]],
    "B": [[5, 6], [7, 8]]
  }'`;

const jsExample = `const response = await fetch(
  "https://api.matrixaccel.pro/v1/multiply",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer ma_sk_your_api_key_here",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      A: [[1, 2], [3, 4]],
      B: [[5, 6], [7, 8]]
    })
  }
);

const data = await response.json();
console.log(data.result);    // [[19, 22], [43, 50]]
console.log(data.metadata);  // Performance info`;

const sdkExample = `# pip install matrixaccel (coming soon)
from matrixaccel import Client
import numpy as np

client = Client(api_key="ma_sk_your_api_key_here")

A = np.random.rand(1000, 1000)
B = np.random.rand(1000, 1000)

# Drop-in replacement for np.matmul
result = client.multiply(A, B)
print(f"Computed in {result.duration_ms}ms")
print(f"Performance: {result.gflops} GFLOPS")`;

const ApiDocs: React.FC = () => {
  const [openEndpoint, setOpenEndpoint] = useState<number>(0);
  const [codeTab, setCodeTab] = useState<'python' | 'curl' | 'javascript' | 'sdk'>('python');

  const methodColor = 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">API Documentation</h1>
            <p className="text-sm text-slate-500">v2.4.1 — Last updated Feb 2026</p>
          </div>
        </div>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
          Complete reference for the MatrixAccel Pro REST API. All endpoints accept and return JSON.
          Authentication is via Bearer token using your API key.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Auth Info */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Authentication</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                Include your API key in the Authorization header:
              </p>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 font-mono text-xs text-slate-600 dark:text-slate-300 break-all">
                Authorization: Bearer ma_sk_...
              </div>
            </div>

            {/* Base URL */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Base URL</h3>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 font-mono text-xs text-blue-600 dark:text-cyan-400 break-all">
                https://api.matrixaccel.pro/v1
              </div>
            </div>

            {/* Endpoint Nav */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/50 p-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Endpoints</h3>
              <nav className="space-y-1">
                {endpoints.map((ep, i) => (
                  <button
                    key={i}
                    onClick={() => setOpenEndpoint(i)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-all flex items-center gap-2 ${
                      openEndpoint === i
                        ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300'
                        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-green-600 dark:text-green-400">POST</span>
                    {ep.path.replace('/api/v1', '')}
                  </button>
                ))}
              </nav>
            </div>

            {/* Rate Limits */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Rate Limits</h3>
              </div>
              <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex justify-between"><span>Free Trial</span><span className="font-mono">100/hr</span></div>
                <div className="flex justify-between"><span>Starter</span><span className="font-mono">1,000/hr</span></div>
                <div className="flex justify-between"><span>Pro</span><span className="font-mono">10,000/hr</span></div>
                <div className="flex justify-between"><span>Enterprise</span><span className="font-mono">Unlimited</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Code Examples */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/50 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700/50 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-blue-500" />
              <h2 className="font-semibold text-slate-900 dark:text-white">Quick Start</h2>
            </div>
            <div className="border-b border-slate-200 dark:border-slate-700/50">
              <div className="flex gap-1 px-4 pt-3">
                {([
                  { id: 'python', label: 'Python' },
                  { id: 'curl', label: 'cURL' },
                  { id: 'javascript', label: 'JavaScript' },
                  { id: 'sdk', label: 'Python SDK' },
                ] as const).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setCodeTab(tab.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
                      codeTab === tab.id
                        ? 'bg-[#0d1117] text-white'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <CodeBlock
              code={codeTab === 'python' ? pythonExample : codeTab === 'curl' ? curlExample : codeTab === 'javascript' ? jsExample : sdkExample}
              language={codeTab === 'curl' ? 'bash' : codeTab === 'javascript' ? 'javascript' : 'python'}
              className="border-0 rounded-none"
            />
          </div>

          {/* Endpoints */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-blue-500" />
              Endpoints
            </h2>

            {endpoints.map((ep, i) => (
              <div
                key={i}
                className={`rounded-2xl border overflow-hidden transition-all ${
                  openEndpoint === i
                    ? 'border-blue-300 dark:border-blue-700 shadow-lg shadow-blue-500/5'
                    : 'border-slate-200 dark:border-slate-700/50'
                } bg-white dark:bg-slate-900/50`}
              >
                <button
                  onClick={() => setOpenEndpoint(openEndpoint === i ? -1 : i)}
                  className="w-full px-5 py-4 flex items-center gap-3 text-left"
                >
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${methodColor}`}>POST</span>
                  <span className="font-mono text-sm text-slate-700 dark:text-slate-300 flex-1">{ep.path}</span>
                  <span className="text-sm text-slate-500 hidden sm:block">{ep.title}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openEndpoint === i ? 'rotate-180' : ''}`} />
                </button>

                {openEndpoint === i && (
                  <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">{ep.description}</p>

                    {/* Parameters */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Parameters</h4>
                      <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                              <th className="text-left px-4 py-2 text-slate-500 font-medium">Name</th>
                              <th className="text-left px-4 py-2 text-slate-500 font-medium">Type</th>
                              <th className="text-left px-4 py-2 text-slate-500 font-medium">Required</th>
                              <th className="text-left px-4 py-2 text-slate-500 font-medium">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {ep.params.map(p => (
                              <tr key={p.name}>
                                <td className="px-4 py-2 font-mono text-blue-600 dark:text-cyan-400 text-xs">{p.name}</td>
                                <td className="px-4 py-2 font-mono text-slate-500 text-xs">{p.type}</td>
                                <td className="px-4 py-2">
                                  <span className={`text-xs font-medium ${p.required ? 'text-red-500' : 'text-slate-400'}`}>
                                    {p.required ? 'Yes' : 'No'}
                                  </span>
                                </td>
                                <td className="px-4 py-2 text-slate-600 dark:text-slate-400 text-xs">{p.desc}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Request / Response */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Request Body</h4>
                        <CodeBlock code={ep.request} language="json" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Response</h4>
                        <CodeBlock code={ep.response} language="json" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Error Codes */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/50 p-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Error Codes</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="text-left px-4 py-2 text-slate-500 font-medium">Code</th>
                    <th className="text-left px-4 py-2 text-slate-500 font-medium">Meaning</th>
                    <th className="text-left px-4 py-2 text-slate-500 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[
                    { code: '400', meaning: 'Bad Request', desc: 'Invalid matrix format, dimension mismatch, or missing parameters' },
                    { code: '401', meaning: 'Unauthorized', desc: 'Missing or invalid API key' },
                    { code: '402', meaning: 'Payment Required', desc: 'GFLOPS quota exceeded — upgrade your plan' },
                    { code: '429', meaning: 'Rate Limited', desc: 'Too many requests — slow down or upgrade' },
                    { code: '500', meaning: 'Server Error', desc: 'Internal error — retry or contact support' },
                  ].map(e => (
                    <tr key={e.code}>
                      <td className="px-4 py-2 font-mono font-bold text-red-500">{e.code}</td>
                      <td className="px-4 py-2 font-medium text-slate-700 dark:text-slate-300">{e.meaning}</td>
                      <td className="px-4 py-2 text-slate-500 dark:text-slate-400">{e.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;
