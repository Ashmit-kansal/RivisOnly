export const mockSubjects = [
  {
    id: 'subj-1',
    name: 'Organic Chemistry II',
    code: 'CHEM-302',
    color: '#c84b31',
    totalFiles: 34,
    decayAlert: false,
    revisionDue: '18 hrs',
    folders: [
      {
        id: 'folder-1',
        name: 'Reaction Mechanisms',
        reminder: { type: 'ai', status: 'Decay Alert (62%)', nextDate: '2026-09-18' },
        files: [
          {
            id: 'file-1',
            name: 'Synthesis_Pathways_Notes.doc',
            type: 'doc',
            size: '34 KB',
            updatedAt: '12 mins ago',
            tags: ['Live Edit', 'Auto-Saved', 'High-Yield'],
            reminder: { type: 'ai', basis: 'SuperMemo-2 AI Spaced', interval: '3 days', score: 62, status: 'decaying', nextDate: '2026-09-18' },
            content: `<h2>Unit 3: Nucleophilic Aromatic Substitution (SNAr)</h2><p>Reaction rate depends strongly on the electron-withdrawing power of substituents situated in the <strong>ortho</strong> or <strong>para</strong> positions relative to the leaving halogen.</p><blockquote style="border-left: 3px solid #9e3c26; padding-left: 12px; margin: 12px 0; color: #78716c; font-style: italic;"><strong>The Meisenheimer Complex:</strong> Unlike aliphatic SN2 substitutions, this is an addition-elimination mechanism. The negative charge is delocalized onto electronegative nitro oxygens.</blockquote><div style="background: rgba(158, 60, 38, 0.08); padding: 10px 14px; border-radius: 8px; font-family: monospace; font-weight: bold; margin: 12px 0; text-align: center;">Rate = k [Ar-X] [Nu⁻]</div><h3>Key Reaction Steps:</h3><ol><li><strong>Addition of Nucleophile (Rate Determining Step):</strong> Attack disrupts the 6π aromatic ring to generate the sp3 hybridized Meisenheimer intermediate.</li><li><strong>Expulsion of Halide Leaving Group:</strong> Fast rearomatization regenerates the planar aromatic system with thermodynamic release.</li></ol><h3>Experimental Yields Observed:</h3><ul><li>p-Nitrochlorobenzene + NaOMe → <strong>88% yield</strong></li><li>2,4-Dinitrochlorobenzene + NaOMe → <strong>97% yield</strong> (reaction completes under 5 mins at 25°C)</li></ul>`
          },
          {
            id: 'file-2',
            name: 'Lecture_08_Spectroscopy.pdf',
            type: 'pdf',
            size: '4.2 MB',
            updatedAt: '2 days ago',
            tags: ['AI Review in 18 hrs', 'Vectorized'],
            reminder: { type: 'ai', basis: 'AI Forgetting Curve', interval: '18 hrs', score: 78, status: 'stable', nextDate: '2026-09-16' },
            content: `13C-NMR spectroscopy notes, chemical shift correlations from 160-185 ppm, quaternary carbon relaxation times, and DEPT-135 distortionless enhancement polarization transfer.`
          },
          {
            id: 'file-3',
            name: 'Benzene_Ring_Diagram.png',
            type: 'png',
            size: '1.8 MB',
            updatedAt: 'Yesterday',
            tags: ['Manual tomorrow 9:00 AM', '4 Bookmarks'],
            reminder: { type: 'manual', basis: 'Manual Schedule', interval: 'Tomorrow 9:00 AM', score: 85, status: 'fresh', nextDate: '2026-09-16' },
            content: `Tactile molecular orbital schema for pi-electron density in substituted benzene rings. Ortho/Para resonance contributors with carbocation stability maps.`
          },
          {
            id: 'file-4',
            name: 'Lab_Report_Final.docx',
            type: 'docx',
            size: '620 KB',
            updatedAt: '3 days ago',
            tags: ['Synced', 'Cloud Stored'],
            reminder: { type: 'manual', basis: 'Manual Schedule', interval: 'In 5 days', score: 92, status: 'fresh', nextDate: '2026-09-20' },
            content: `<h2>Lab Report: Friedel-Crafts Acylation of Anisole</h2><p>This experiment investigates the regioselective acylation of anisole catalyzed by anhydrous aluminum chloride (AlCl3) in dry dichloromethane.</p><h3>Experimental Protocol:</h3><ul><li>Equip a dry 100 mL round-bottom flask with a reflux condenser and CaCl2 drying tube.</li><li>Dissolve 5.4 g anisole in 30 mL dry DCM and cool to 0°C in an ice-water bath.</li><li>Add 7.3 g anhydrous AlCl3 portionwise over 15 minutes while stirring continuously.</li><li>Add acetyl chloride (4.2 mL) dropwise via addition funnel.</li></ul><blockquote><strong>Safety Notice:</strong> HCl gas is evolved vigorously during reagent addition. Keep apparatus connected to gas absorption trap.</blockquote>`
          }
        ]
      },
      {
        id: 'folder-2',
        name: 'Stereochemistry & Isomerism',
        reminder: { type: 'ai', status: 'AI Optimized (Day 7/30)', nextDate: '2026-09-22' },
        files: [
          {
            id: 'file-5',
            name: 'Chirality_Flash_Notes.doc',
            type: 'doc',
            size: '28 KB',
            updatedAt: 'Yesterday',
            tags: ['Due Today 4:00 PM', 'High Priority'],
            reminder: { type: 'manual', basis: 'Manual Task', interval: 'Today 4:00 PM', score: 78, status: 'stable', nextDate: '2026-09-15' },
            content: `<h2>Chirality & Optical Activity Flash Summary</h2><ul><li><strong>Enantiomers:</strong> Rotate plane-polarized light in equal and opposite directions ([α]D).</li><li><strong>Diastereomers:</strong> Have different physical properties (melting points, Rf values, boiling points).</li><li><strong>Meso Compounds:</strong> Contain internal stereocenters with an internal plane of symmetry (C2 or σ plane).</li><li><strong>Cahn-Ingold-Prelog (CIP) Rules:</strong> Prioritized by atomic number; isotopes differentiated by mass number.</li></ul>`
          }
        ]
      }
    ]
  },
  {
    id: 'subj-2',
    name: 'Linear Algebra',
    code: 'MATH-201',
    color: '#4f7cac',
    totalFiles: 21,
    decayAlert: false,
    revisionDue: '3 days',
    folders: [
      {
        id: 'folder-3',
        name: 'Eigenvalues & Diagonalization',
        reminder: { type: 'ai', status: 'AI Review in 3d', nextDate: '2026-09-19' },
        files: [
          {
            id: 'file-6',
            name: 'Eigenvectors_Spectral_Theorem.doc',
            type: 'doc',
            size: '42 KB',
            updatedAt: '4 days ago',
            tags: ['AI Vectorized', 'Exam Prep'],
            reminder: { type: 'ai', basis: 'AI Forgetting Curve', interval: '3 days', score: 88, status: 'fresh', nextDate: '2026-09-19' },
            content: `<h2>Spectral Decomposition & Orthogonal Projections</h2><p>Every real symmetric matrix A can be orthogonally diagonalized: <strong>A = Q Λ Qᵀ</strong>, where Q is an orthogonal matrix and Λ is a real diagonal matrix of eigenvalues.</p><h3>Key Properties:</h3><ol><li>Eigenvectors corresponding to distinct eigenvalues are mutually orthogonal.</li><li>The algebraic multiplicity of each eigenvalue equals its geometric multiplicity.</li><li>Positive definite matrices satisfy <strong>xᵀ A x &gt; 0</strong> for all non-zero vectors x.</li></ol>`
          },
          {
            id: 'file-7',
            name: 'Gram_Schmidt_Process.pdf',
            type: 'pdf',
            size: '2.1 MB',
            updatedAt: 'Last week',
            tags: ['Vectorized', 'Formula Sheet'],
            reminder: { type: 'manual', basis: 'Manual Schedule', interval: 'Weekly', score: 84, status: 'fresh', nextDate: '2026-09-22' },
            content: `Step-by-step orthonormalization algorithm for spanning subspaces in R^n.`
          }
        ]
      }
    ]
  },
  {
    id: 'subj-3',
    name: 'Cognitive Neuroscience',
    code: 'NEURO-410',
    color: '#2d7d46',
    totalFiles: 28,
    decayAlert: true,
    revisionDue: 'Decay Alert',
    folders: [
      {
        id: 'folder-4',
        name: 'Synaptic Plasticity & Memory',
        reminder: { type: 'ai', status: 'Decay Alert (58%)', nextDate: '2026-09-16' },
        files: [
          {
            id: 'file-8',
            name: 'LTP_NMDA_Mechanisms.doc',
            type: 'doc',
            size: '56 KB',
            updatedAt: '5 days ago',
            tags: ['Decay Alert', 'AI Re-test'],
            reminder: { type: 'ai', basis: 'SuperMemo-2 AI Spaced', interval: 'Today', score: 58, status: 'decaying', nextDate: '2026-09-15' },
            content: `<h2>Long-Term Potentiation (LTP) in Hippocampal CA1</h2><p>Long-term potentiation serves as the primary cellular correlate of episodic memory consolidation and synaptic plasticity.</p><h3>Induction Cascade:</h3><ul><li><strong>Glutamate Release:</strong> Activates postsynaptic AMPA receptors causing rapid sodium influx.</li><li><strong>Mg²⁺ Block Relief:</strong> Membrane depolarization to ~-30 mV expels the magnesium ion blocking the NMDA channel pore.</li><li><strong>Calcium Influx:</strong> Intracellular Ca²⁺ activates CaMKII and Protein Kinase C (PKC).</li><li><strong>Retrograde Signaling:</strong> Nitric oxide (NO) diffuses back to presynaptic terminal to enhance subsequent vesicular probability.</li></ul>`
          }
        ]
      }
    ]
  },
  {
    id: 'subj-4',
    name: 'Macroeconomics',
    code: 'ECON-305',
    color: '#d4a017',
    totalFiles: 15,
    decayAlert: false,
    revisionDue: '5 days',
    folders: [
      {
        id: 'folder-5',
        name: 'IS-LM & Monetary Transmission',
        reminder: { type: 'manual', status: 'Manual Scheduled', nextDate: '2026-09-21' },
        files: [
          {
            id: 'file-9',
            name: 'Monetary_Policy_Taylor_Rule.doc',
            type: 'doc',
            size: '30 KB',
            updatedAt: '1 week ago',
            tags: ['Manual Review', 'Policy Papers'],
            reminder: { type: 'manual', basis: 'Manual Schedule', interval: 'In 5 days', score: 84, status: 'stable', nextDate: '2026-09-21' },
            content: `<h2>Taylor Rule & Central Bank Reaction Functions</h2><div style="background: rgba(158, 60, 38, 0.08); padding: 10px 14px; border-radius: 8px; font-family: monospace; font-weight: bold; margin: 12px 0; text-align: center;">i_t = r* + π_t + 0.5(π_t - π*) + 0.5(y_t - y*)</div><h3>Variable Definitions:</h3><ul><li><strong>i_t:</strong> Target short-term nominal interest rate (Federal Funds Rate)</li><li><strong>r*:</strong> Equilibrium real interest rate (neutral rate of interest)</li><li><strong>π_t:</strong> Current rate of inflation measured over trailing quarters</li><li><strong>y_t - y*:</strong> Logarithmic output gap (percent deviation of real GDP from potential)</li></ul>`
          }
        ]
      },
      {
        id: 'folder-6',
        name: 'Open Economy & Exchange Rates',
        reminder: { type: 'ai', status: 'AI Monitored', nextDate: '2026-09-24' },
        files: []
      }
    ]
  }
];
