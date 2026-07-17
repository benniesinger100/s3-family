// Original, minimal cartoon motifs — no third-party artwork.
// Archie = Bennie's apricot goldendoodle (blue collar); the tabby cat is
// also Bennie's; the whale is Leora's (pastel pink); the Moms avatar is a
// friendly cartoon of the two of them.

export function ArchieIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 64 64" role="img" aria-label="Archie the goldendoodle">
      <ellipse cx="13" cy="36" rx="9" ry="14" fill="#c98f47" transform="rotate(-12 13 36)" />
      <ellipse cx="51" cy="36" rx="9" ry="14" fill="#c98f47" transform="rotate(12 51 36)" />
      <g fill="#e0a959">
        <circle cx="19" cy="15" r="7" />
        <circle cx="32" cy="10" r="8" />
        <circle cx="45" cy="15" r="7" />
        <circle cx="13" cy="25" r="6.5" />
        <circle cx="51" cy="25" r="6.5" />
      </g>
      <circle cx="32" cy="30" r="19" fill="#e9b56e" />
      <ellipse cx="32" cy="39" rx="12" ry="9.5" fill="#f6e2ba" />
      <circle cx="24" cy="29" r="3" fill="#3b2a17" />
      <circle cx="40" cy="29" r="3" fill="#3b2a17" />
      <circle cx="25" cy="28" r="1" fill="#fff" />
      <circle cx="41" cy="28" r="1" fill="#fff" />
      <ellipse cx="32" cy="35" rx="4.2" ry="3.2" fill="#2b2320" />
      <path d="M32 38 q-4 5 -8 3" fill="none" stroke="#7a5a33" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M32 38 q4 5 8 3" fill="none" stroke="#7a5a33" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M30 40 q2 6 4 0 z" fill="#ef7a9b" />
      <path d="M18 48 q14 8 28 0" fill="none" stroke="#274b8f" strokeWidth="4" strokeLinecap="round" />
      <circle cx="32" cy="53" r="2.4" fill="#f4c430" />
    </svg>
  )
}

export function CatIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 64 64" role="img" aria-label="Bennie's tabby cat">
      {/* ears */}
      <path d="M16 20 L20 4 L30 18 Z" fill="#8a7a5f" />
      <path d="M48 20 L44 4 L34 18 Z" fill="#8a7a5f" />
      <path d="M20 17 L22 8 L27 16 Z" fill="#e6a6a0" />
      <path d="M44 17 L42 8 L37 16 Z" fill="#e6a6a0" />
      {/* head */}
      <ellipse cx="32" cy="34" rx="19" ry="17" fill="#9c8a6b" />
      {/* tabby stripes */}
      <g stroke="#6b5c44" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M32 20 v6" />
        <path d="M27 21 l1 6" />
        <path d="M37 21 l-1 6" />
      </g>
      {/* white muzzle */}
      <ellipse cx="32" cy="42" rx="12" ry="9" fill="#f2ece0" />
      {/* green eyes */}
      <ellipse cx="25" cy="33" rx="3.4" ry="3" fill="#7fbf5a" />
      <ellipse cx="39" cy="33" rx="3.4" ry="3" fill="#7fbf5a" />
      <ellipse cx="25" cy="33" rx="1.1" ry="2.6" fill="#22301a" />
      <ellipse cx="39" cy="33" rx="1.1" ry="2.6" fill="#22301a" />
      {/* pink nose + mouth */}
      <path d="M29 40 h6 l-3 3 z" fill="#e58aa0" />
      <path d="M32 43 q-3 3 -6 1" stroke="#7a6a50" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M32 43 q3 3 6 1" stroke="#7a6a50" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      {/* whiskers */}
      <g stroke="#d8cfbf" strokeWidth="1" strokeLinecap="round">
        <path d="M20 41 L6 38" />
        <path d="M20 44 L7 45" />
        <path d="M44 41 L58 38" />
        <path d="M44 44 L57 45" />
      </g>
    </svg>
  )
}

export function WhaleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 64 64" role="img" aria-label="Whale">
      <g stroke="#9fd3ec" strokeWidth="2.4" strokeLinecap="round" fill="none">
        <path d="M18 18 q0 -6 0 -9" />
        <path d="M18 18 q4 -5 8 -6" />
        <path d="M18 18 q-4 -5 -8 -6" />
      </g>
      <path d="M44 38 L63 30 Q60 38 63 46 Z" fill="#f18ec4" />
      <ellipse cx="26" cy="38" rx="23" ry="16" fill="#f9a8d4" />
      <path d="M7 40 a20 13 0 0 0 38 0 z" fill="#fcd3e7" />
      <path d="M24 46 q7 8 15 5 q-8 3 -17 -2 z" fill="#f18ec4" />
      <circle cx="17" cy="35" r="2.3" fill="#5b2b46" />
      <circle cx="17.8" cy="34.2" r="0.7" fill="#fff" />
      <path d="M11 40 q6 5 13 3" fill="none" stroke="#d76aa0" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

// A friendly cartoon of the two moms — left: wavy light hair, right: dark curls.
export function MomsAvatar({ className }) {
  return (
    <svg className={className} viewBox="0 0 64 64" role="img" aria-label="The moms">
      {/* left mom */}
      <g>
        <ellipse cx="23" cy="35" rx="15" ry="16" fill="#b7a992" />
        <circle cx="23" cy="35" r="11" fill="#f1c7a0" />
        <path d="M12 32 q1 -15 11 -15 q10 0 11 15 q-4 -7 -11 -7 q-7 0 -11 7 z" fill="#b7a992" />
        <circle cx="19" cy="34" r="1.4" fill="#3a2a1c" />
        <circle cx="27" cy="34" r="1.4" fill="#3a2a1c" />
        <path d="M19 39 q4 3 8 0" stroke="#a9694f" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </g>
      {/* right mom (overlaps slightly in front) */}
      <g>
        <ellipse cx="43" cy="33" rx="15" ry="16" fill="#5e4130" />
        <circle cx="43" cy="33" r="11" fill="#eec097" />
        <g fill="#5e4130">
          <circle cx="34" cy="25" r="6" />
          <circle cx="41" cy="21" r="6" />
          <circle cx="49" cy="23" r="6" />
          <circle cx="53" cy="31" r="6" />
          <circle cx="33" cy="33" r="5" />
        </g>
        <circle cx="39" cy="32" r="1.4" fill="#2a1c12" />
        <circle cx="47" cy="32" r="1.4" fill="#2a1c12" />
        <path d="M39 37 q4 3 8 0" stroke="#a9694f" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  )
}

// Picks the right motif(s) for a person.
export function PersonMotif({ identity, className }) {
  if (identity === 'Bennie')
    return (
      <>
        <ArchieIcon className={className} />
        <CatIcon className={className} />
      </>
    )
  if (identity === 'Leora') return <WhaleIcon className={className} />
  if (identity === 'Moms' || identity === 'Mom') return <MomsAvatar className={className} />
  return null
}
