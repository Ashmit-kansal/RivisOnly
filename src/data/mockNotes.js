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
            content: `# Unit 3: Nucleophilic Aromatic Substitution (SNAr)

Reaction rate depends strongly on the electron-withdrawing power of substituents situated in the *ortho* or *para* positions relative to the leaving halogen.

> **The Meisenheimer Complex**:
> Unlike aliphatic SN2 substitutions, this is an addition-elimination mechanism. The negative charge is delocalized onto electronegative nitro oxygens.

$$Rate = k [Ar-X][Nu^-]$$

### Key Steps:
1. **Addition of Nucleophile (Rate Determining Step)**: Attack disrupts the 6pi aromatic ring to generate the sp3 hybridized Meisenheimer intermediate.
2. **Expulsion of Halide Leaving Group**: Fast rearomatization regenerates the planar aromatic system with thermodynamic release.

### Experimental Yields:
- p-Nitrochlorobenzene + NaOMe -> 88%
- 2,4-Dinitrochlorobenzene + NaOMe -> 97% (reaction completes under 5 mins at 25°C)
`,
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
            content: `Experimental protocol for Friedel-Crafts Acylation of Anisole using AlCl3 catalyst in dry dichloromethane solvent.`
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
            content: `# Chirality & Optical Activity Flash Summary

- Enantiomers rotate plane-polarized light in equal and opposite directions ([alpha]D).
- Diastereomers have different physical properties (melting point, Rf, boiling point).
- Meso compounds contain internal stereocenters with an internal plane of symmetry (C2 or sigma plane).
- Cahn-Ingold-Prelog (CIP) priority rules: atomic number based; isotope tiebreaker by mass.
`
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
            content: `# Spectral Decomposition & Orthogonal Projections

Every real symmetric matrix A can be orthogonally diagonalized:
$$A = Q \\Lambda Q^T$$
where Q is orthogonal ($Q^T Q = I$) and $\\Lambda$ is a real diagonal matrix of eigenvalues.

### Properties:
1. Eigenvectors corresponding to distinct eigenvalues are mutually orthogonal.
2. The algebraic multiplicity of each eigenvalue equals its geometric multiplicity.
3. Positive definite matrices satisfy $x^T A x > 0$ for all non-zero $x$.
`
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
            content: `# Long-Term Potentiation (LTP) in Hippocampal CA1

Long-term potentiation serves as the primary cellular correlate of episodic memory consolidation.

### Induction Cascade:
- **Glutamate Release**: Activates postsynaptic AMPA receptors causing sodium influx and partial depolarization.
- **Mg2+ Block Relief**: Membrane depolarization to approx. -30 mV expels the magnesium ion blocking the NMDA receptor channel pore.
- **Calcium Influx**: Intracellular Ca2+ activates CaMKII and Protein Kinase C (PKC).
- **Retrograde Signaling**: Nitric oxide (NO) diffuses back to the presynaptic terminal to enhance subsequent vesicular probability.
`
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
            content: `# Taylor Rule & Central Bank Reaction Functions

$$i_t = r^* + \\pi_t + 0.5(\\pi_t - \\pi^*) + 0.5(y_t - y^*)$$

Where:
- $i_t$: Target short-term nominal interest rate
- $r^*$: Equilibrium real interest rate (natural rate)
- $\\pi_t$: Current rate of inflation
- $y_t - y^*$: Log output gap
`
          }
        ]
      }
    ]
  }
];
