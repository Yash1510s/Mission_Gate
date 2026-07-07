import { useState, useEffect } from 'react';

// Comprehensive Topic-wise Question Bank for GATE CS & DA
const topicQuestionBank = {
  cs: {
    'Data Structures & Algorithms': [
      {
        id: 101, type: 'MCQ', marks: 2, negMarks: 0.66,
        question: 'What is the worst-case time complexity of QuickSort when picking the first element as pivot on an already sorted array of n elements?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
        correctAnswer: 2,
        solution: 'When the array is sorted and the first element is chosen as pivot, QuickSort partitions into sizes 0 and n-1 at each step. This leads to the recurrence T(n) = T(n-1) + O(n) = O(n²).'
      },
      {
        id: 102, type: 'MSQ', marks: 2, negMarks: 0,
        question: 'Which of the following data structures can be used to implement a Priority Queue with O(log n) insertion and deletion? (Select all correct options)',
        options: ['Binary Heap', 'AVL Tree (Balanced BST)', 'Singly Linked List', 'Red-Black Tree'],
        correctAnswer: [0, 1, 3],
        solution: 'Binary Heaps, AVL Trees, and Red-Black Trees all support O(log n) insertion and extraction of minimum/maximum. A simple singly linked list requires O(n) for either insertion or searching.'
      },
      {
        id: 103, type: 'NAT', marks: 2, negMarks: 0,
        question: 'Consider an undirected graph with 10 vertices and 15 edges. What is the sum of degrees of all vertices in this graph?',
        correctAnswer: '30',
        solution: 'By the Handshaking Lemma, sum of degrees = 2 × (number of edges) = 2 × 15 = 30.'
      },
      {
        id: 104, type: 'MCQ', marks: 1, negMarks: 0.33,
        question: 'In a binary search tree (BST), which traversal always outputs the elements in strictly increasing order?',
        options: ['Pre-order traversal', 'Post-order traversal', 'In-order traversal', 'Level-order traversal'],
        correctAnswer: 2,
        solution: 'In-order traversal (Left, Root, Right) on a valid BST always visits nodes in monotonically increasing order.'
      },
      {
        id: 105, type: 'NAT', marks: 2, negMarks: 0,
        question: 'What is the minimum number of stacks required to implement a FIFO queue with amortized O(1) time complexity per operation?',
        correctAnswer: '2',
        solution: 'A standard FIFO queue requires exactly 2 stacks: one for push operations (inbox) and one for pop operations (outbox).'
      }
    ],
    'Engineering Mathematics': [
      {
        id: 201, type: 'NAT', marks: 2, negMarks: 0,
        question: 'Let A be a 3×3 matrix with eigenvalues 2, 3, and 5. What is the determinant of the matrix A²?',
        correctAnswer: '900',
        solution: 'The eigenvalues of A² are 2²=4, 3²=9, and 5²=25. The determinant is the product of eigenvalues: 4 × 9 × 25 = 900.'
      },
      {
        id: 202, type: 'MCQ', marks: 2, negMarks: 0.66,
        question: 'If the rank of a 4×5 matrix B is 3, what is the dimension of the null space (kernel) of B?',
        options: ['1', '2', '3', '4'],
        correctAnswer: 1,
        solution: 'By the Rank-Nullity Theorem: Rank(B) + Nullity(B) = number of columns. 3 + Nullity = 5 => Nullity = 2.'
      },
      {
        id: 203, type: 'MSQ', marks: 2, negMarks: 0,
        question: 'Which of the following functions are strictly increasing and continuous for all real x > 0? (Select all that apply)',
        options: ['f(x) = ln(x)', 'f(x) = e^x', 'f(x) = 1/x', 'f(x) = x³ + 2x'],
        correctAnswer: [0, 1, 3],
        solution: 'ln(x), e^x, and x³+2x all have strictly positive first derivatives for x > 0, so they are strictly increasing. 1/x is decreasing.'
      },
      {
        id: 204, type: 'NAT', marks: 1, negMarks: 0,
        question: 'What is the value of the limit as x approaches 0 of (sin 3x) / x?',
        correctAnswer: '3',
        solution: 'Using L\'Hopital\'s rule or standard trigonometric limits: lim (sin 3x)/x = 3 × lim (sin 3x)/(3x) = 3 × 1 = 3.'
      }
    ],
    'Database Management Systems': [
      {
        id: 301, type: 'MCQ', marks: 2, negMarks: 0.66,
        question: 'Which normal form is based on the concept of multi-valued dependencies?',
        options: ['Second Normal Form (2NF)', 'Third Normal Form (3NF)', 'Boyce-Codd Normal Form (BCNF)', 'Fourth Normal Form (4NF)'],
        correctAnswer: 3,
        solution: 'Fourth Normal Form (4NF) deals specifically with eliminating non-trivial multi-valued dependencies.'
      },
      {
        id: 302, type: 'MSQ', marks: 2, negMarks: 0,
        question: 'Which of the following concurrency control protocols guarantee freedom from deadlock? (Select all correct answers)',
        options: ['Wait-Die scheme', 'Wound-Wait scheme', 'Basic Two-Phase Locking (2PL)', 'Timestamp Ordering protocol'],
        correctAnswer: [0, 1, 3],
        solution: 'Wait-Die, Wound-Wait (using timestamps), and Timestamp Ordering inherently prevent deadlocks. Basic 2PL allows cyclic waits and hence deadlocks.'
      },
      {
        id: 303, type: 'NAT', marks: 2, negMarks: 0,
        question: 'A B+ tree index has leaf nodes capable of holding 100 search key values and 101 pointers. What is the maximum number of pointers in an internal node?',
        correctAnswer: '101',
        solution: 'In a B+ tree of order n, each internal node has at most n children pointers and n-1 search keys. Here n = 101.'
      }
    ],
    'Operating Systems & Networks': [
      {
        id: 401, type: 'MCQ', marks: 2, negMarks: 0.66,
        question: 'In a virtual memory system with 32-bit virtual addresses and 4 KB page size, how many entries are there in a single-level page table per process?',
        options: ['2¹⁰', '2¹²', '2²⁰', '2²⁴'],
        correctAnswer: 2,
        solution: 'Page size = 4 KB = 2¹² bytes. Number of pages = 2³² / 2¹² = 2²⁰ entries in the page table.'
      },
      {
        id: 402, type: 'MSQ', marks: 2, negMarks: 0,
        question: 'Which of the following conditions are necessary for a deadlock to occur in an operating system? (Select all that apply)',
        options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption allowed', 'Circular Wait'],
        correctAnswer: [0, 1, 3],
        solution: 'The 4 Coffman conditions for deadlock are: Mutual Exclusion, Hold and Wait, No Preemption (NOT preemption allowed), and Circular Wait.'
      },
      {
        id: 403, type: 'NAT', marks: 2, negMarks: 0,
        question: 'In TCP congestion control, if the current congestion window (cwnd) is 16 KB and a timeout occurs, what does the new slow start threshold (ssthresh) become in KB?',
        correctAnswer: '8',
        solution: 'Upon a timeout, ssthresh is set to half of the current congestion window: 16 KB / 2 = 8 KB.'
      }
    ]
  },
  da: {
    'Machine Learning & Deep Learning': [
      {
        id: 501, type: 'MCQ', marks: 2, negMarks: 0.66,
        question: 'Which of the following loss functions is most robust against outliers in regression problems?',
        options: ['Mean Squared Error (L2 Loss)', 'Mean Absolute Error (L1 Loss)', 'Cross-Entropy Loss', 'Kullback-Leibler Divergence'],
        correctAnswer: 1,
        solution: 'MAE (L1 loss) penalizes errors linearly, making it much more robust to outliers than MSE (L2 loss), which squares large errors.'
      },
      {
        id: 502, type: 'MSQ', marks: 2, negMarks: 0,
        question: 'Which of the following statements regarding Principal Component Analysis (PCA) are true? (Select all that apply)',
        options: ['PCA is an unsupervised linear dimensionality reduction technique.', 'Principal components are orthogonal to each other.', 'PCA always increases classification accuracy on non-linear data.', 'The first principal component captures the maximum variance in the data.'],
        correctAnswer: [0, 1, 3],
        solution: 'PCA is unsupervised, finds orthogonal variance-maximizing axes, and the first PC captures max variance. It does not guarantee accuracy gains on non-linear data.'
      },
      {
        id: 503, type: 'NAT', marks: 2, negMarks: 0,
        question: 'In K-Means clustering, if K=5 and the dataset has 500 points, exactly how many cluster centroids are updated at each iteration?',
        correctAnswer: '5',
        solution: 'There is exactly 1 centroid for each of the K clusters. Since K=5, exactly 5 centroids are recomputed at each iteration.'
      },
      {
        id: 504, type: 'MCQ', marks: 2, negMarks: 0.66,
        question: 'What is the primary purpose of Dropout in training Deep Neural Networks?',
        options: ['To speed up forward propagation', 'To prevent overfitting by randomly dropping neurons', 'To eliminate exploding gradients', 'To convert non-linear activation into linear'],
        correctAnswer: 1,
        solution: 'Dropout randomly zeroes out a percentage of activations during training, preventing co-adaptation of neurons and significantly reducing overfitting.'
      }
    ],
    'Probability & Statistics': [
      {
        id: 601, type: 'NAT', marks: 2, negMarks: 0,
        question: 'A fair coin is tossed 4 times. What is the probability (as a decimal rounded to 2 decimal places) of getting exactly 2 heads?',
        correctAnswer: '0.38',
        solution: 'Using binomial probability: C(4,2) × (0.5)² × (0.5)² = 6 × 0.0625 = 0.375. Rounded to two decimal places is 0.38.'
      },
      {
        id: 602, type: 'MCQ', marks: 2, negMarks: 0.66,
        question: 'If two random variables X and Y are independent, what is their covariance Cov(X, Y)?',
        options: ['1', '0', '-1', 'Var(X) × Var(Y)'],
        correctAnswer: 1,
        solution: 'If two random variables are independent, their covariance and correlation are always exactly 0.'
      },
      {
        id: 603, type: 'MSQ', marks: 2, negMarks: 0,
        question: 'Which of the following probability distributions are continuous? (Select all correct options)',
        options: ['Normal (Gaussian) Distribution', 'Poisson Distribution', 'Exponential Distribution', 'Binomial Distribution'],
        correctAnswer: [0, 2],
        solution: 'Normal and Exponential distributions model continuous variables (like time or height). Poisson and Binomial model discrete counts.'
      }
    ],
    'Linear Algebra & Calculus': [
      {
        id: 701, type: 'MCQ', marks: 2, negMarks: 0.66,
        question: 'What is the rank of the 3×3 identity matrix I₃?',
        options: ['0', '1', '2', '3'],
        correctAnswer: 3,
        solution: 'The identity matrix I₃ has 3 linearly independent rows and columns, so its rank is 3.'
      },
      {
        id: 702, type: 'NAT', marks: 2, negMarks: 0,
        question: 'What is the Euclidean distance (L2 norm) between the vectors u = (1, 2, 2) and v = (4, 6, 2)?',
        correctAnswer: '5',
        solution: 'Distance = √((4-1)² + (6-2)² + (2-2)²) = √(3² + 4² + 0) = √(9 + 16) = √25 = 5.'
      },
      {
        id: 703, type: 'MSQ', marks: 2, negMarks: 0,
        question: 'Which of the following matrices are always symmetric? (Select all that apply)',
        options: ['Any diagonal matrix', 'AᵀA for any real matrix A', 'A + Aᵀ for any square matrix A', 'A - Aᵀ for any square matrix A'],
        correctAnswer: [0, 1, 2],
        solution: 'Diagonal matrices equal their transpose. (AᵀA)ᵀ = Aᵀ(Aᵀ)ᵀ = AᵀA. (A+Aᵀ)ᵀ = Aᵀ+A. But A-Aᵀ is skew-symmetric, not symmetric.'
      }
    ]
  }
};

const sampleTests = [
  {
    id: 'cs-mini-1',
    title: 'GATE CS — Full Mini Mock Test (DSA & Math)',
    duration: 30 * 60,
    totalQuestions: 5,
    totalMarks: 9,
    questions: [
      ...topicQuestionBank.cs['Data Structures & Algorithms'].slice(0, 3),
      ...topicQuestionBank.cs['Engineering Mathematics'].slice(0, 2)
    ]
  },
  {
    id: 'da-mini-1',
    title: 'GATE DA — Full Mini Mock Test (AI & Math)',
    duration: 30 * 60,
    totalQuestions: 5,
    totalMarks: 10,
    questions: [
      ...topicQuestionBank.da['Machine Learning & Deep Learning'].slice(0, 3),
      ...topicQuestionBank.da['Probability & Statistics'].slice(0, 2)
    ]
  }
];

export default function Mocks() {
  const [activeTest, setActiveTest] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [questionStatus, setQuestionStatus] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);

  // Custom Topic Selector States
  const [selectedPaper, setSelectedPaper] = useState('cs');
  const [selectedTopic, setSelectedTopic] = useState('Data Structures & Algorithms');
  const [selectedCount, setSelectedCount] = useState(5);

  useEffect(() => {
    // Reset default topic when paper changes
    const topics = Object.keys(topicQuestionBank[selectedPaper]);
    if (!topics.includes(selectedTopic)) {
      setSelectedTopic(topics[0]);
    }
  }, [selectedPaper]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (activeTest && !testSubmitted && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && activeTest && !testSubmitted) {
      handleSubmitTest();
      alert('⏰ Time is up! Your mock test has been auto-submitted.');
    }
    return () => clearInterval(timer);
  }, [activeTest, testSubmitted, timeLeft]);

  const startTest = (test) => {
    setActiveTest(test);
    setCurrentQIndex(0);
    setUserAnswers({});
    const initialStatus = {};
    test.questions.forEach((q, i) => {
      initialStatus[i] = i === 0 ? 'visited' : 'not_visited';
    });
    setQuestionStatus(initialStatus);
    setTimeLeft(test.duration);
    setTestSubmitted(false);
    setScoreResult(null);
  };

  const handleGenerateTopicMock = () => {
    const questionsPool = topicQuestionBank[selectedPaper][selectedTopic] || [];
    if (questionsPool.length === 0) return;

    // Duplicate or slice pool to match selectedCount
    let testQuestions = [...questionsPool];
    while (testQuestions.length < selectedCount && testQuestions.length > 0) {
      testQuestions = [...testQuestions, ...questionsPool.map(q => ({ ...q, id: q.id + Math.random() }))];
    }
    testQuestions = testQuestions.slice(0, selectedCount);

    const totalMarks = testQuestions.reduce((sum, q) => sum + q.marks, 0);
    const generatedTest = {
      id: `custom-${selectedPaper}-${Date.now()}`,
      title: `GATE ${selectedPaper.toUpperCase()} — Topic CBT: ${selectedTopic}`,
      duration: selectedCount * 4 * 60, // 4 mins per question
      totalQuestions: testQuestions.length,
      totalMarks: totalMarks,
      questions: testQuestions
    };

    startTest(generatedTest);
  };

  const handleSelectOption = (qIndex, optIndex, type) => {
    if (testSubmitted) return;
    const currentAns = userAnswers[qIndex];
    let nextAns;
    if (type === 'MCQ') {
      nextAns = optIndex;
    } else if (type === 'MSQ') {
      const arr = Array.isArray(currentAns) ? [...currentAns] : [];
      const idx = arr.indexOf(optIndex);
      if (idx > -1) arr.splice(idx, 1);
      else arr.push(optIndex);
      arr.sort();
      nextAns = arr;
    }
    setUserAnswers({ ...userAnswers, [qIndex]: nextAns });
    setQuestionStatus({ ...questionStatus, [qIndex]: 'answered' });
  };

  const handleNatChange = (qIndex, val) => {
    if (testSubmitted) return;
    setUserAnswers({ ...userAnswers, [qIndex]: val });
    setQuestionStatus({ ...questionStatus, [qIndex]: val ? 'answered' : 'visited' });
  };

  const handleMarkReview = () => {
    const isAns = userAnswers[currentQIndex] !== undefined && userAnswers[currentQIndex] !== '';
    setQuestionStatus({
      ...questionStatus,
      [currentQIndex]: isAns ? 'answered_review' : 'review'
    });
  };

  const handleNext = () => {
    if (currentQIndex < activeTest.questions.length - 1) {
      const nextIdx = currentQIndex + 1;
      setCurrentQIndex(nextIdx);
      if (questionStatus[nextIdx] === 'not_visited') {
        setQuestionStatus({ ...questionStatus, [nextIdx]: 'visited' });
      }
    }
  };

  const handleSubmitTest = () => {
    if (!activeTest) return;
    let totalScore = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;

    activeTest.questions.forEach((q, idx) => {
      const ans = userAnswers[idx];
      if (ans === undefined || ans === '' || (Array.isArray(ans) && ans.length === 0)) {
        unattemptedCount++;
        return;
      }

      if (q.type === 'MCQ') {
        if (ans === q.correctAnswer) {
          totalScore += q.marks;
          correctCount++;
        } else {
          totalScore -= q.negMarks;
          wrongCount++;
        }
      } else if (q.type === 'MSQ') {
        const userArr = Array.isArray(ans) ? [...ans].sort() : [];
        const corrArr = [...q.correctAnswer].sort();
        if (JSON.stringify(userArr) === JSON.stringify(corrArr)) {
          totalScore += q.marks;
          correctCount++;
        } else {
          wrongCount++;
        }
      } else if (q.type === 'NAT') {
        if (parseFloat(ans) === parseFloat(q.correctAnswer)) {
          totalScore += q.marks;
          correctCount++;
        } else {
          wrongCount++;
        }
      }
    });

    setScoreResult({
      score: Math.max(0, totalScore).toFixed(2),
      totalMarks: activeTest.totalMarks,
      correct: correctCount,
      wrong: wrongCount,
      unattempted: unattemptedCount,
      accuracy: (correctCount + wrongCount) > 0 ? Math.round((correctCount / (correctCount + wrongCount)) * 100) : 0
    });
    setTestSubmitted(true);
  };

  const formatClock = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!activeTest) {
    const availableTopics = Object.keys(topicQuestionBank[selectedPaper]);

    return (
      <div>
        <div className="page-header">
          <p className="page-header__eyebrow">Custom Topic-Wise & CBT Studio</p>
          <h1 className="page-header__title">GATE Mock Test Simulator</h1>
          <p className="page-header__subtitle">
            Generate customized topic-wise practice tests or take full-length official TCS iON CBT mock exams with real marking schemes (+2 / -0.66).
          </p>
        </div>

        {/* AI TOPIC-WISE MOCK GENERATOR WIZARD */}
        <div className="card" style={{ marginBottom: 32, padding: '28px', background: 'linear-gradient(135deg, rgba(91,140,255,0.15) 0%, rgba(168,85,247,0.15) 50%, rgba(224,95,208,0.15) 100%)', border: '2px solid rgba(91,140,255,0.4)', borderRadius: 20, boxShadow: '0 0 35px rgba(91,140,255,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <span style={{ fontSize: 28 }}>⚡</span>
            <div>
              <h2 style={{ fontSize: 22, margin: 0, color: '#fff' }}>Topic-Wise Mock Test Generator</h2>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: 0 }}>
                Select a specific GATE subject to generate a targeted practice CBT test with instant solutions!
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginTop: 20 }}>
            {/* 1. Paper Select */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>
                1. Select GATE Paper
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setSelectedPaper('cs')}
                  style={{ flex: 1, padding: '10px', borderRadius: 10, fontWeight: 700, fontSize: 14, background: selectedPaper === 'cs' ? 'var(--accent-cs)' : 'rgba(255,255,255,0.06)', color: selectedPaper === 'cs' ? '#fff' : 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer' }}
                >
                  💻 GATE CS
                </button>
                <button
                  onClick={() => setSelectedPaper('da')}
                  style={{ flex: 1, padding: '10px', borderRadius: 10, fontWeight: 700, fontSize: 14, background: selectedPaper === 'da' ? 'var(--accent-da)' : 'rgba(255,255,255,0.06)', color: selectedPaper === 'da' ? '#fff' : 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer' }}
                >
                  🤖 GATE DA
                </button>
              </div>
            </div>

            {/* 2. Topic Select */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>
                2. Select Subject / Topic
              </label>
              <select
                value={selectedTopic}
                onChange={e => setSelectedTopic(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: '#0a0d18', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', fontSize: 14, fontWeight: 600, outline: 'none', cursor: 'pointer' }}
              >
                {availableTopics.map(top => (
                  <option key={top} value={top}>{top}</option>
                ))}
              </select>
            </div>

            {/* 3. Question Count */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>
                3. Number of Questions
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[3, 5, 10].map(cnt => (
                  <button
                    key={cnt}
                    onClick={() => setSelectedCount(cnt)}
                    style={{ flex: 1, padding: '10px', borderRadius: 10, fontWeight: 700, fontSize: 14, background: selectedCount === cnt ? '#10b981' : 'rgba(255,255,255,0.06)', color: selectedCount === cnt ? '#fff' : 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer' }}
                  >
                    {cnt} Qs
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleGenerateTopicMock}
              className="btn btn--primary"
              style={{ padding: '14px 36px', fontSize: 16, fontWeight: 800, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 0 25px rgba(16,185,129,0.4)', borderRadius: 12, border: '1px solid #34d399' }}
            >
              🚀 Launch Topic-Wise CBT Mock →
            </button>
          </div>
        </div>

        {/* Pre-built Mocks Section */}
        <h3 style={{ marginBottom: 16 }}>🏆 Pre-Built Full & Mini Mock Tests</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
          {sampleTests.map(test => (
            <div key={test.id} className="card card--interactive" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div className="card__header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="tag tag--cs">30 Mins CBT</span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{test.totalQuestions} Questions</span>
              </div>
              <div className="card__body" style={{ padding: '20px', flex: 1 }}>
                <h3 style={{ fontSize: 18, marginBottom: 10 }}>{test.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Includes MCQ, MSQ, and Numerical Answer Type (NAT) questions. Exact GATE marking scheme with negative marking for wrong MCQs.
                </p>
                <div style={{ display: 'flex', gap: 14, marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>
                  <span>🏆 Total Marks: <strong>{test.totalMarks}</strong></span>
                  <span>⏱️ Duration: <strong>30 Mins</strong></span>
                </div>
              </div>
              <div className="card__footer" style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button
                  onClick={() => startTest(test)}
                  className="btn btn--primary"
                  style={{ width: '100%', padding: '12px', fontSize: 15, fontWeight: 700, background: 'linear-gradient(135deg, #5b8cff 0%, #a855f7 100%)', boxShadow: '0 0 20px rgba(91,140,255,0.3)' }}
                >
                  🚀 Start CBT Mock Test
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions Card */}
        <div className="card" style={{ marginTop: 28, background: 'linear-gradient(135deg, rgba(91,140,255,0.06) 0%, rgba(224,95,208,0.06) 100%)' }}>
          <div className="card__body" style={{ padding: '22px 24px' }}>
            <h4 style={{ marginBottom: 12 }}>📌 Official GATE CBT Instructions</h4>
            <ul style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: 0 }}>
              <li>● <strong>MCQ (Multiple Choice):</strong> 1 correct answer. 1/3rd negative marking (-0.66 marks for 2-mark question).</li>
              <li>● <strong>MSQ (Multiple Select):</strong> One or more correct answers. No negative marking, but NO partial credit.</li>
              <li>● <strong>NAT (Numerical Answer Type):</strong> Type the number directly. No negative marking.</li>
              <li>● <strong>Question Palette Colors:</strong> Green = Answered, Red = Not Answered, Purple = Marked for Review.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const q = activeTest.questions[currentQIndex];

  return (
    <div>
      {/* CBT Top Bar */}
      <div className="card" style={{ padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, background: 'linear-gradient(135deg, rgba(30,41,68,0.95) 0%, rgba(15,23,42,0.98) 100%)' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16 }}>{activeTest.title}</h3>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Question {currentQIndex + 1} of {activeTest.totalQuestions}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>⏱️</span>
            <span style={{ fontSize: 20, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: timeLeft < 300 ? '#f87171' : '#60a5fa' }}>
              {formatClock(timeLeft)}
            </span>
          </div>

          {!testSubmitted ? (
            <button
              onClick={() => { if (window.confirm('Are you sure you want to submit the test?')) handleSubmitTest(); }}
              className="btn btn--primary"
              style={{ padding: '8px 20px', background: 'var(--danger)', fontWeight: 700 }}
            >
              🏁 Submit Test
            </button>
          ) : (
            <button
              onClick={() => setActiveTest(null)}
              className="btn"
              style={{ padding: '8px 20px', background: 'rgba(255,255,255,0.1)', fontWeight: 700 }}
            >
              ← Back to All Mocks
            </button>
          )}
        </div>
      </div>

      {/* RESULTS SCORECARD (If Submitted) */}
      {testSubmitted && scoreResult && (
        <div className="card" style={{ marginBottom: 24, padding: '24px', background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(59,130,246,0.15) 100%)', border: '1px solid rgba(16,185,129,0.5)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 20 }}>🎯 Mock Test Evaluation Report</h2>
          <div className="mock-scorecard-grid">
            <div style={{ padding: 16, background: 'rgba(0,0,0,0.3)', borderRadius: 12 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>FINAL SCORE</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#4ade80', fontFamily: "'JetBrains Mono', monospace" }}>{scoreResult.score} / {scoreResult.totalMarks}</div>
            </div>
            <div style={{ padding: 16, background: 'rgba(0,0,0,0.3)', borderRadius: 12 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>ACCURACY</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#60a5fa', fontFamily: "'JetBrains Mono', monospace" }}>{scoreResult.accuracy}%</div>
            </div>
            <div style={{ padding: 16, background: 'rgba(0,0,0,0.3)', borderRadius: 12 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>CORRECT</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#4ade80', fontFamily: "'JetBrains Mono', monospace" }}>{scoreResult.correct}</div>
            </div>
            <div style={{ padding: 16, background: 'rgba(0,0,0,0.3)', borderRadius: 12 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>WRONG</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#f87171', fontFamily: "'JetBrains Mono', monospace" }}>{scoreResult.wrong}</div>
            </div>
          </div>
          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>
            Review detailed solutions below for each question!
          </p>
        </div>
      )}

      {/* CBT MAIN LAYOUT (Question Area + Right Palette) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Question Panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: 450 }}>
          <div className="card__header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="tag" style={{ background: q.type === 'MCQ' ? 'var(--accent-cs-soft)' : q.type === 'MSQ' ? 'var(--accent-da-soft)' : 'rgba(245,158,11,0.2)', color: q.type === 'MCQ' ? 'var(--accent-cs)' : q.type === 'MSQ' ? 'var(--accent-da)' : '#f59e0b', fontWeight: 700 }}>
                {q.type} Question
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>+{q.marks} Marks / -{q.negMarks} Neg</span>
            </div>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Q.{currentQIndex + 1}</span>
          </div>

          <div className="card__body" style={{ padding: '24px', flex: 1 }}>
            <p style={{ fontSize: 16, lineHeight: 1.7, fontWeight: 500, marginBottom: 24, color: 'var(--text-primary)' }}>
              {q.question}
            </p>

            {/* MCQ Options */}
            {q.type === 'MCQ' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {q.options.map((opt, i) => {
                  const isSel = userAnswers[currentQIndex] === i;
                  const isCorrect = testSubmitted && q.correctAnswer === i;
                  const isWrong = testSubmitted && isSel && !isCorrect;

                  return (
                    <div
                      key={i}
                      onClick={() => handleSelectOption(currentQIndex, i, 'MCQ')}
                      style={{
                        padding: '14px 18px', borderRadius: 12, cursor: testSubmitted ? 'default' : 'pointer',
                        border: isCorrect ? '2px solid #4ade80' : isWrong ? '2px solid #f87171' : isSel ? '2px solid var(--accent-cs)' : '1px solid rgba(255,255,255,0.08)',
                        background: isCorrect ? 'rgba(74,222,128,0.15)' : isWrong ? 'rgba(248,113,113,0.15)' : isSel ? 'rgba(91,140,255,0.15)' : 'rgba(255,255,255,0.03)',
                        display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, background: isSel ? 'var(--accent-cs)' : 'transparent', color: isSel ? '#fff' : 'var(--text-secondary)' }}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span style={{ fontSize: 14.5, color: 'var(--text-primary)' }}>{opt}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* MSQ Options */}
            {q.type === 'MSQ' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {q.options.map((opt, i) => {
                  const arr = Array.isArray(userAnswers[currentQIndex]) ? userAnswers[currentQIndex] : [];
                  const isSel = arr.includes(i);
                  const isCorrect = testSubmitted && q.correctAnswer.includes(i);
                  const isWrong = testSubmitted && isSel && !q.correctAnswer.includes(i);

                  return (
                    <div
                      key={i}
                      onClick={() => handleSelectOption(currentQIndex, i, 'MSQ')}
                      style={{
                        padding: '14px 18px', borderRadius: 12, cursor: testSubmitted ? 'default' : 'pointer',
                        border: isCorrect ? '2px solid #4ade80' : isWrong ? '2px solid #f87171' : isSel ? '2px solid var(--accent-da)' : '1px solid rgba(255,255,255,0.08)',
                        background: isCorrect ? 'rgba(74,222,128,0.15)' : isWrong ? 'rgba(248,113,113,0.15)' : isSel ? 'rgba(224,95,208,0.15)' : 'rgba(255,255,255,0.03)',
                        display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ width: 22, height: 22, borderRadius: 6, border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, background: isSel ? 'var(--accent-da)' : 'transparent', color: isSel ? '#fff' : 'var(--text-secondary)' }}>
                        {isSel ? '✓' : ''}
                      </div>
                      <span style={{ fontSize: 14.5, color: 'var(--text-primary)' }}>{opt}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* NAT Input */}
            {q.type === 'NAT' && (
              <div style={{ marginTop: 10 }}>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>
                  Enter Numerical Value (e.g., 30 or 0.38):
                </label>
                <input
                  type="number"
                  step="any"
                  disabled={testSubmitted}
                  value={userAnswers[currentQIndex] || ''}
                  onChange={e => handleNatChange(currentQIndex, e.target.value)}
                  placeholder="Type number here..."
                  style={{ width: '100%', maxWidth: 300, padding: '14px 18px', fontSize: 18, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(91,140,255,0.4)', color: 'var(--text-primary)' }}
                />
                {testSubmitted && (
                  <div style={{ marginTop: 14, fontSize: 14, color: '#4ade80', fontWeight: 700 }}>
                    Official GATE Answer: {q.correctAnswer}
                  </div>
                )}
              </div>
            )}

            {/* Solution Box (When Submitted) */}
            {testSubmitted && (
              <div style={{ marginTop: 28, padding: '16px 20px', background: 'rgba(255,255,255,0.04)', borderRadius: 12, borderLeft: '4px solid #60a5fa' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#60a5fa', marginBottom: 6 }}>💡 Detailed Solution / Explanation:</div>
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {q.solution}
                </p>
              </div>
            )}
          </div>

          {/* Bottom Action Bar */}
          <div className="card__footer" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              {!testSubmitted && (
                <button
                  onClick={handleMarkReview}
                  className="btn"
                  style={{ padding: '8px 16px', background: 'rgba(168,85,247,0.2)', color: '#c084fc', border: '1px solid #c084fc', fontSize: 13, fontWeight: 600 }}
                >
                  🟣 Mark for Review
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex(i => Math.max(0, i - 1))}
                className="btn"
                style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.06)', opacity: currentQIndex === 0 ? 0.4 : 1 }}
              >
                ← Previous
              </button>
              <button
                disabled={currentQIndex === activeTest.questions.length - 1}
                onClick={handleNext}
                className="btn btn--primary"
                style={{ padding: '8px 20px', fontWeight: 700, opacity: currentQIndex === activeTest.questions.length - 1 ? 0.4 : 1 }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Right Palette Panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 'fit-content' }}>
          <div className="card__header">
            <h4>🔢 Question Palette</h4>
          </div>
          <div className="card__body" style={{ padding: '20px' }}>
            {/* Palette Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 24 }}>
              {activeTest.questions.map((_, idx) => {
                const st = questionStatus[idx] || 'not_visited';
                const isCurr = currentQIndex === idx;
                let bg = 'rgba(255,255,255,0.08)';
                let border = '1px solid rgba(255,255,255,0.15)';
                let color = 'var(--text-secondary)';

                if (st === 'visited') { bg = '#f87171'; color = '#fff'; border = 'none'; }
                if (st === 'answered') { bg = '#10b981'; color = '#fff'; border = 'none'; }
                if (st === 'review') { bg = '#a855f7'; color = '#fff'; border = 'none'; }
                if (st === 'answered_review') { bg = '#8b5cf6'; color = '#fff'; border = '2px solid #10b981'; }

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentQIndex(idx);
                      if (questionStatus[idx] === 'not_visited') {
                        setQuestionStatus({ ...questionStatus, [idx]: 'visited' });
                      }
                    }}
                    style={{
                      height: 44, borderRadius: 10, fontWeight: 700, fontSize: 14,
                      background: bg, border: isCurr ? '2px solid #fff' : border, color: color,
                      boxShadow: isCurr ? '0 0 12px rgba(255,255,255,0.5)' : 'none',
                      cursor: 'pointer', transition: 'all 0.2s ease'
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: '#10b981' }} /> Answered</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: '#f87171' }} /> Not Answered</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: '#a855f7' }} /> Marked for Review</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(255,255,255,0.1)' }} /> Not Visited</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
