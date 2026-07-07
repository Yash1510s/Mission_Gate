import { useState } from 'react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState(0);
  const [angleMode, setAngleMode] = useState('DEG');
  const [history, setHistory] = useState([]);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [operator, setOperator] = useState(null);
  const [operand, setOperand] = useState(null);

  const handleDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setOperator(null);
    setOperand(null);
    setWaitingForOperand(false);
  };

  const handleBackspace = () => {
    if (waitingForOperand) return;
    if (display.length === 1 || (display.length === 2 && display.startsWith('-'))) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const toRad = (val) => (angleMode === 'DEG' ? (val * Math.PI) / 180 : val);
  const fromRad = (val) => (angleMode === 'DEG' ? (val * 180) / Math.PI : val);

  const handleScientific = (func) => {
    const val = parseFloat(display);
    if (isNaN(val)) return;
    let res;
    switch (func) {
      case 'sin': res = Math.sin(toRad(val)); break;
      case 'cos': res = Math.cos(toRad(val)); break;
      case 'tan': res = Math.tan(toRad(val)); break;
      case 'asin': res = fromRad(Math.asin(val)); break;
      case 'acos': res = fromRad(Math.acos(val)); break;
      case 'atan': res = fromRad(Math.atan(val)); break;
      case 'log': res = Math.log10(val); break;
      case 'ln': res = Math.log(val); break;
      case 'sqrt': res = Math.sqrt(val); break;
      case 'cbrt': res = Math.cbrt(val); break;
      case 'sqr': res = Math.pow(val, 2); break;
      case 'cube': res = Math.pow(val, 3); break;
      case 'inv': res = 1 / val; break;
      case 'abs': res = Math.abs(val); break;
      case 'fact':
        if (val < 0 || !Number.isInteger(val)) res = 'Error';
        else { let f = 1; for (let i = 2; i <= val; i++) f *= i; res = f; }
        break;
      case 'exp': res = Math.exp(val); break;
      case '10x': res = Math.pow(10, val); break;
      default: return;
    }
    const resStr = typeof res === 'number' ? Number(res.toFixed(8)).toString() : String(res);
    setHistory(h => [`${func}(${val}) = ${resStr}`, ...h.slice(0, 9)]);
    setDisplay(resStr);
    setWaitingForOperand(true);
  };

  const handleConstant = (constName) => {
    const val = constName === 'PI' ? Math.PI : Math.E;
    setDisplay(Number(val.toFixed(8)).toString());
    setWaitingForOperand(true);
  };

  const handleOperator = (nextOp) => {
    const val = parseFloat(display);
    if (operand === null) {
      setOperand(val);
    } else if (operator) {
      const res = evaluate(operand, val, operator);
      setOperand(res);
      setDisplay(String(res));
      setHistory(h => [`${operand} ${operator} ${val} = ${res}`, ...h.slice(0, 9)]);
    }
    setWaitingForOperand(true);
    setOperator(nextOp);
  };

  const evaluate = (op1, op2, op) => {
    switch (op) {
      case '+': return op1 + op2;
      case '-': return op1 - op2;
      case '×': return op1 * op2;
      case '÷': return op2 !== 0 ? op1 / op2 : 'Error';
      case 'mod': return op1 % op2;
      case 'x^y': return Math.pow(op1, op2);
      default: return op2;
    }
  };

  const handleEquals = () => {
    if (operator && operand !== null) {
      const val = parseFloat(display);
      const res = evaluate(operand, val, operator);
      setHistory(h => [`${operand} ${operator} ${val} = ${res}`, ...h.slice(0, 9)]);
      setDisplay(String(res));
      setOperand(null);
      setOperator(null);
      setWaitingForOperand(true);
    }
  };

  const handleMemory = (action) => {
    const val = parseFloat(display);
    if (isNaN(val)) return;
    switch (action) {
      case 'MC': setMemory(0); break;
      case 'MR': setDisplay(String(memory)); setWaitingForOperand(true); break;
      case 'MS': setMemory(val); setWaitingForOperand(true); break;
      case 'M+': setMemory(m => m + val); setWaitingForOperand(true); break;
      case 'M-': setMemory(m => m - val); setWaitingForOperand(true); break;
      default: break;
    }
  };

  return (
    <div>
      <div className="page-header">
        <p className="page-header__eyebrow">Official TCS iON Tool</p>
        <h1 className="page-header__title">Virtual GATE Scientific Calculator</h1>
        <p className="page-header__subtitle">
          In actual GATE CBT exams, physical calculators are strictly prohibited. Master this on-screen scientific calculator to calculate numerical answers effortlessly!
        </p>
      </div>

      <div className="calc-outer-grid">
        {/* ── Main Calculator Panel ── */}
        <div className="calc-panel">

          {/* Top Bar */}
          <div className="calc-topbar">
            <div className="calc-angle-btns">
              <button
                className={`calc-angle-btn ${angleMode === 'DEG' ? 'active' : ''}`}
                onClick={() => setAngleMode('DEG')}
              >DEG</button>
              <button
                className={`calc-angle-btn ${angleMode === 'RAD' ? 'active' : ''}`}
                onClick={() => setAngleMode('RAD')}
              >RAD</button>
            </div>
            {memory !== 0 && (
              <span className="tag tag--warning" style={{ fontSize: 11 }}>M = {memory}</span>
            )}
          </div>

          {/* Display */}
          <div className="calc-display">
            <div className="calc-display__expr">
              {operand !== null ? `${operand} ${operator || ''}` : ''}
            </div>
            <div className="calc-display__value">{display}</div>
          </div>

          {/* Memory Row */}
          <div className="calc-mem-row">
            <button className="calc-btn calc-btn--mem" onClick={() => handleMemory('MC')}>MC</button>
            <button className="calc-btn calc-btn--mem" onClick={() => handleMemory('MR')}>MR</button>
            <button className="calc-btn calc-btn--mem" onClick={() => handleMemory('MS')}>MS</button>
            <button className="calc-btn calc-btn--mem" onClick={() => handleMemory('M+')}>M+</button>
            <button className="calc-btn calc-btn--mem" onClick={() => handleMemory('M-')}>M−</button>
          </div>

          {/* Main Button Grid — 5 columns */}
          <div className="calc-btn-grid">
            {/* Row 1: trig + clear/backspace */}
            <button className="calc-btn calc-btn--fn" onClick={() => handleScientific('sin')}>sin</button>
            <button className="calc-btn calc-btn--fn" onClick={() => handleScientific('cos')}>cos</button>
            <button className="calc-btn calc-btn--fn" onClick={() => handleScientific('tan')}>tan</button>
            <button className="calc-btn calc-btn--danger" onClick={handleClear}>C</button>
            <button className="calc-btn calc-btn--danger" onClick={handleBackspace}>⌫</button>

            {/* Row 2: inv trig + factorial + divide */}
            <button className="calc-btn calc-btn--fn" onClick={() => handleScientific('asin')}>sin⁻¹</button>
            <button className="calc-btn calc-btn--fn" onClick={() => handleScientific('acos')}>cos⁻¹</button>
            <button className="calc-btn calc-btn--fn" onClick={() => handleScientific('atan')}>tan⁻¹</button>
            <button className="calc-btn calc-btn--fn" onClick={() => handleScientific('fact')}>n!</button>
            <button className="calc-btn calc-btn--op" onClick={() => handleOperator('÷')}>÷</button>

            {/* Row 3: log/sqrt + multiply */}
            <button className="calc-btn calc-btn--fn" onClick={() => handleScientific('log')}>log</button>
            <button className="calc-btn calc-btn--fn" onClick={() => handleScientific('ln')}>ln</button>
            <button className="calc-btn calc-btn--fn" onClick={() => handleScientific('sqrt')}>√x</button>
            <button className="calc-btn calc-btn--fn" onClick={() => handleScientific('cbrt')}>∛x</button>
            <button className="calc-btn calc-btn--op" onClick={() => handleOperator('×')}>×</button>

            {/* Row 4: power functions + subtract */}
            <button className="calc-btn calc-btn--fn" onClick={() => handleScientific('sqr')}>x²</button>
            <button className="calc-btn calc-btn--fn" onClick={() => handleScientific('cube')}>x³</button>
            <button className="calc-btn calc-btn--fn" onClick={() => handleOperator('x^y')}>xʸ</button>
            <button className="calc-btn calc-btn--fn" onClick={() => handleScientific('inv')}>1/x</button>
            <button className="calc-btn calc-btn--op" onClick={() => handleOperator('-')}>−</button>

            {/* Row 5: π + 7 8 9 + add */}
            <button className="calc-btn calc-btn--fn" onClick={() => handleConstant('PI')}>π</button>
            <button className="calc-btn" onClick={() => handleDigit(7)}>7</button>
            <button className="calc-btn" onClick={() => handleDigit(8)}>8</button>
            <button className="calc-btn" onClick={() => handleDigit(9)}>9</button>
            <button className="calc-btn calc-btn--op" onClick={() => handleOperator('+')}>+</button>

            {/* Row 6: e + 4 5 6 + mod */}
            <button className="calc-btn calc-btn--fn" onClick={() => handleConstant('E')}>e</button>
            <button className="calc-btn" onClick={() => handleDigit(4)}>4</button>
            <button className="calc-btn" onClick={() => handleDigit(5)}>5</button>
            <button className="calc-btn" onClick={() => handleDigit(6)}>6</button>
            <button className="calc-btn calc-btn--op" onClick={() => handleOperator('mod')}>mod</button>

            {/* Row 7: |x| + 1 2 3 + = (spans 2 rows) */}
            <button className="calc-btn calc-btn--fn" onClick={() => handleScientific('abs')}>|x|</button>
            <button className="calc-btn" onClick={() => handleDigit(1)}>1</button>
            <button className="calc-btn" onClick={() => handleDigit(2)}>2</button>
            <button className="calc-btn" onClick={() => handleDigit(3)}>3</button>
            <button className="calc-btn calc-btn--equals" onClick={handleEquals}>=</button>

            {/* Row 8: 10ˣ + 0 (span 2) + . */}
            <button className="calc-btn calc-btn--fn" onClick={() => handleScientific('10x')}>10ˣ</button>
            <button className="calc-btn calc-btn--zero" onClick={() => handleDigit(0)}>0</button>
            <button className="calc-btn" onClick={handleDecimal}>.</button>
          </div>
        </div>

        {/* ── Right Panel: History & Tips ── */}
        <div className="calc-side-panel">
          <div className="card">
            <div className="card__header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h4>📜 Recent Calculations</h4>
              {history.length > 0 && (
                <button onClick={() => setHistory([])} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer' }}>Clear</button>
              )}
            </div>
            <div className="card__body" style={{ padding: '16px 20px', minHeight: 120, maxHeight: 260, overflowY: 'auto' }}>
              {history.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px 0', fontSize: 13 }}>No calculations yet</div>
              ) : (
                history.map((item, idx) => (
                  <div key={idx} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: 'var(--text-secondary)' }}>
                    {item}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(91,140,255,0.08) 0%, rgba(224,95,208,0.08) 100%)', border: '1px solid rgba(91,140,255,0.3)' }}>
            <div className="card__body" style={{ padding: '20px' }}>
              <h4 style={{ marginBottom: 10, color: 'var(--text-primary)' }}>💡 GATE Calculator Pro Tips</h4>
              <ul style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: 0, listStyle: 'none' }}>
                <li style={{ marginBottom: 8 }}>● <strong>Always Check DEG vs RAD:</strong> Trigonometric questions in GATE often mix degrees and radians. Look at the top left indicator!</li>
                <li style={{ marginBottom: 8 }}>● <strong>Use Memory (MS / MR):</strong> For multi-step NAT questions, save intermediate results to memory instead of rounding off!</li>
                <li>● <strong>No Keyboard Support in Exam:</strong> Practice clicking buttons with your mouse, as keyboard numpads are disabled in TCS iON centers.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
