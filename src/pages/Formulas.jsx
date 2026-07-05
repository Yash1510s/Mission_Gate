import { useState } from 'react';

const formulaData = [
  {
    subject: 'Discrete Mathematics',
    icon: '🔢',
    formulas: [
      { name: 'Pigeonhole Principle', formula: 'If n items into m containers and n > m, then at least one container has ≥ ⌈n/m⌉ items' },
      { name: 'Permutations', formula: 'P(n,r) = n! / (n-r)!' },
      { name: 'Combinations', formula: 'C(n,r) = n! / [r! × (n-r)!]' },
      { name: 'Derangement', formula: 'D(n) = n! × Σ(i=0 to n) [(-1)^i / i!]' },
      { name: 'Euler\'s Formula (Graphs)', formula: 'V - E + F = 2 (for connected planar graphs)' },
      { name: 'Handshaking Lemma', formula: 'Σ deg(v) = 2|E|' },
      { name: 'Catalan Number', formula: 'Cₙ = C(2n,n) / (n+1)' },
    ]
  },
  {
    subject: 'Linear Algebra',
    icon: '📐',
    formulas: [
      { name: 'Determinant (2×2)', formula: 'det = ad - bc for [[a,b],[c,d]]' },
      { name: 'Eigenvalue Equation', formula: 'Av = λv  →  det(A - λI) = 0' },
      { name: 'Rank-Nullity Theorem', formula: 'rank(A) + nullity(A) = n (number of columns)' },
      { name: 'Cayley-Hamilton', formula: 'Every matrix satisfies its own characteristic equation' },
      { name: 'Trace', formula: 'tr(A) = Σ λᵢ = Σ aᵢᵢ' },
      { name: 'Determinant & Eigenvalues', formula: 'det(A) = Π λᵢ' },
    ]
  },
  {
    subject: 'Probability & Statistics',
    icon: '🎲',
    formulas: [
      { name: 'Bayes\' Theorem', formula: 'P(A|B) = P(B|A) × P(A) / P(B)' },
      { name: 'Variance', formula: 'Var(X) = E[X²] - (E[X])²' },
      { name: 'Binomial Distribution', formula: 'P(X=k) = C(n,k) × p^k × (1-p)^(n-k)' },
      { name: 'Poisson Distribution', formula: 'P(X=k) = e^(-λ) × λ^k / k!' },
      { name: 'Normal Distribution', formula: 'f(x) = (1/σ√2π) × e^(-(x-μ)²/2σ²)' },
      { name: 'Conditional Probability', formula: 'P(A|B) = P(A ∩ B) / P(B)' },
      { name: 'Total Probability', formula: 'P(A) = Σ P(A|Bᵢ) × P(Bᵢ)' },
    ]
  },
  {
    subject: 'Algorithms',
    icon: '⚡',
    formulas: [
      { name: 'Master Theorem', formula: 'T(n) = aT(n/b) + f(n)  → Case 1,2,3 based on log_b(a) vs d' },
      { name: 'Binary Search', formula: 'O(log n) time, O(1) space' },
      { name: 'Merge Sort', formula: 'O(n log n) time, O(n) space' },
      { name: 'Quick Sort (avg)', formula: 'O(n log n) avg, O(n²) worst' },
      { name: 'Dijkstra', formula: 'O((V+E) log V) with min-heap' },
      { name: 'BFS/DFS', formula: 'O(V + E) time' },
      { name: 'Bellman-Ford', formula: 'O(V × E) time' },
      { name: 'Floyd-Warshall', formula: 'O(V³) time' },
    ]
  },
  {
    subject: 'Operating Systems',
    icon: '🖥️',
    formulas: [
      { name: 'CPU Utilization', formula: '1 - p^n (where p = I/O wait probability, n = degree of multiprogramming)' },
      { name: 'Effective Access Time (TLB)', formula: 'EAT = h × (t_TLB + t_mem) + (1-h) × (t_TLB + 2 × t_mem)' },
      { name: 'Page Fault Rate', formula: 'EAT = (1-p) × memory_access + p × page_fault_time' },
      { name: 'Disk Access Time', formula: 'Seek Time + Rotational Latency + Transfer Time' },
      { name: 'Turnaround Time', formula: 'Completion Time - Arrival Time' },
      { name: 'Waiting Time', formula: 'Turnaround Time - Burst Time' },
    ]
  },
  {
    subject: 'Computer Networks',
    icon: '🌐',
    formulas: [
      { name: 'Throughput', formula: 'Throughput = Window Size / RTT' },
      { name: 'Propagation Delay', formula: 'Tₚ = Distance / Speed' },
      { name: 'Transmission Delay', formula: 'Tₜ = Packet Size / Bandwidth' },
      { name: 'Efficiency (Stop & Wait)', formula: 'η = Tₜ / (Tₜ + 2Tₚ)' },
      { name: 'Efficiency (Sliding Window)', formula: 'η = W × Tₜ / (Tₜ + 2Tₚ) if W < 1+2a' },
      { name: 'Subnetting', formula: 'Hosts = 2^(32-prefix) - 2' },
      { name: 'Shannon Capacity', formula: 'C = B × log₂(1 + SNR)' },
    ]
  },
  {
    subject: 'DBMS',
    icon: '🗄️',
    formulas: [
      { name: 'Normalization Rule', formula: '1NF → 2NF → 3NF → BCNF (no partial/transitive/overlapping dependencies)' },
      { name: 'B-Tree Order m', formula: 'Keys: ⌈m/2⌉-1 to m-1, Children: ⌈m/2⌉ to m' },
      { name: 'B+ Tree Levels', formula: 'Height ≈ ⌈log_⌈m/2⌉(N)⌉' },
      { name: 'ACID', formula: 'Atomicity, Consistency, Isolation, Durability' },
      { name: 'Relational Algebra', formula: 'σ (select), π (project), ⋈ (join), ∪ (union), - (difference)' },
    ]
  },
];

export default function Formulas() {
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const copyFormula = (text, idx) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    });
  };

  const filteredData = searchQuery
    ? formulaData.map(section => ({
        ...section,
        formulas: section.formulas.filter(f =>
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.formula.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(s => s.formulas.length > 0)
    : formulaData;

  return (
    <div>
      <div className="page-header">
        <p className="page-header__eyebrow">Quick Reference</p>
        <h1 className="page-header__title">Formula Sheets</h1>
        <p className="page-header__subtitle">
          Key formulas and quick references for every GATE subject. Click to copy any formula.
        </p>
      </div>

      {/* Search */}
      <div className="topbar__search" style={{ maxWidth: 400, marginBottom: 28 }}>
        <svg className="topbar__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          placeholder="Search formulas..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredData.map((section, si) => (
        <div key={si} style={{ marginBottom: 32 }}>
          <h3 style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>{section.icon}</span>
            {section.subject}
            <span className="tag tag--cs">{section.formulas.length}</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 10 }}>
            {section.formulas.map((f, fi) => {
              const globalIdx = `${si}-${fi}`;
              return (
                <div key={fi} className="formula-block" onClick={() => copyFormula(f.formula, globalIdx)}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>
                    {f.name}
                  </div>
                  <div style={{ fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                    {f.formula}
                  </div>
                  <button className="formula-block__copy" onClick={(e) => { e.stopPropagation(); copyFormula(f.formula, globalIdx); }}>
                    {copiedIdx === globalIdx ? '✓' : '📋'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
