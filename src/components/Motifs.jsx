// Original, minimal cartoon motifs — no third-party artwork.
// Archie is Bennie's apricot goldendoodle (with his blue collar);
// the whale is Leora's, in pastel pink.

export function ArchieIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 64 64" role="img" aria-label="Archie the goldendoodle">
      {/* floppy ears */}
      <ellipse cx="13" cy="36" rx="9" ry="14" fill="#c98f47" transform="rotate(-12 13 36)" />
      <ellipse cx="51" cy="36" rx="9" ry="14" fill="#c98f47" transform="rotate(12 51 36)" />
      {/* curly doodle fur around the crown */}
      <g fill="#e0a959">
        <circle cx="19" cy="15" r="7" />
        <circle cx="32" cy="10" r="8" />
        <circle cx="45" cy="15" r="7" />
        <circle cx="13" cy="25" r="6.5" />
        <circle cx="51" cy="25" r="6.5" />
      </g>
      {/* head */}
      <circle cx="32" cy="30" r="19" fill="#e9b56e" />
      {/* muzzle */}
      <ellipse cx="32" cy="39" rx="12" ry="9.5" fill="#f6e2ba" />
      {/* eyes */}
      <circle cx="24" cy="29" r="3" fill="#3b2a17" />
      <circle cx="40" cy="29" r="3" fill="#3b2a17" />
      <circle cx="25" cy="28" r="1" fill="#fff" />
      <circle cx="41" cy="28" r="1" fill="#fff" />
      {/* nose + mouth + tongue */}
      <ellipse cx="32" cy="35" rx="4.2" ry="3.2" fill="#2b2320" />
      <path d="M32 38 q-4 5 -8 3" fill="none" stroke="#7a5a33" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M32 38 q4 5 8 3" fill="none" stroke="#7a5a33" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M30 40 q2 6 4 0 z" fill="#ef7a9b" />
      {/* blue collar with a little tag */}
      <path d="M18 48 q14 8 28 0" fill="none" stroke="#274b8f" strokeWidth="4" strokeLinecap="round" />
      <circle cx="32" cy="53" r="2.4" fill="#f4c430" />
    </svg>
  )
}

export function WhaleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 64 64" role="img" aria-label="Whale">
      {/* water spout */}
      <g stroke="#9fd3ec" strokeWidth="2.4" strokeLinecap="round" fill="none">
        <path d="M18 18 q0 -6 0 -9" />
        <path d="M18 18 q4 -5 8 -6" />
        <path d="M18 18 q-4 -5 -8 -6" />
      </g>
      {/* tail fluke */}
      <path d="M44 38 L63 30 Q60 38 63 46 Z" fill="#f18ec4" />
      {/* body */}
      <ellipse cx="26" cy="38" rx="23" ry="16" fill="#f9a8d4" />
      {/* belly */}
      <path d="M7 40 a20 13 0 0 0 38 0 z" fill="#fcd3e7" />
      {/* side fin */}
      <path d="M24 46 q7 8 15 5 q-8 3 -17 -2 z" fill="#f18ec4" />
      {/* eye + smile */}
      <circle cx="17" cy="35" r="2.3" fill="#5b2b46" />
      <circle cx="17.8" cy="34.2" r="0.7" fill="#fff" />
      <path d="M11 40 q6 5 13 3" fill="none" stroke="#d76aa0" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

// Picks the right motif for a person (Moms gets both, small).
export function PersonMotif({ identity, className }) {
  if (identity === 'Bennie') return <ArchieIcon className={className} />
  if (identity === 'Leora') return <WhaleIcon className={className} />
  return null
}
