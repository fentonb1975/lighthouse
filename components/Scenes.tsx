// Hand-drawn room illustrations, ported unchanged from prototype/index.html.

import type { ReactElement } from "react";

// Shared filter that gives every illustration its shaky, hand-inked line.
export function SketchFilter() {
  return (
    <svg className="defs" aria-hidden="true" focusable="false">
      <filter id="wobble" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.5" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </svg>
  );
}

export const scenes: Record<string, ReactElement> = {
  stair: (
    <svg data-room="stair" viewBox="0 0 320 180" role="img" aria-label="Iron steps spiralling around a stone column, lit by a slit window">
      <g className="art">
        <rect className="none" x="0" y="0" width="320" height="180" fill="#d9cbb0"/>
        <path className="thin line" d="M10 30 H55 M20 58 H50 M8 86 H52 M18 118 H56 M6 148 H40 M268 110 H310 M280 140 H312 M262 168 H300"/>
        <path className="thin line" d="M32 30 V58 M40 86 V118 M24 148 V172 M290 110 V140"/>
        <path d="M270 34 L282 34 L282 92 L270 92 Z" fill="#eef4f6"/>
        <path className="none" d="M270 36 L282 90 L210 176 L140 176 Z" fill="#fffaf0" opacity="0.45"/>
        <path className="line thin" d="M60 150 Q160 138 260 122 M260 122 Q160 110 60 94 M60 94 Q160 82 260 66 M260 66 Q160 54 60 38 M60 38 Q160 26 260 10" strokeDasharray="3 5"/>
        <rect x="145" y="-4" width="30" height="188" fill="#bdb098"/>
        <path className="thin line" d="M150 20 L170 24 M150 64 L170 60 M150 110 L170 114 M150 150 L170 146"/>
        <path d="M145 160 L60 150 L60 160 L145 172 Z" fill="#7d838b"/>
        <path d="M175 132 L260 122 L260 132 L175 144 Z" fill="#7d838b"/>
        <path d="M145 104 L60 94 L60 104 L145 116 Z" fill="#7d838b"/>
        <path d="M175 76 L260 66 L260 76 L175 88 Z" fill="#7d838b"/>
        <path d="M145 48 L60 38 L60 48 L145 60 Z" fill="#7d838b"/>
        <path d="M175 20 L260 10 L260 20 L175 32 Z" fill="#7d838b"/>
        <path className="line" d="M60 150 V122 M260 122 V94 M60 94 V66 M260 66 V38 M60 38 V10"/>
      </g>
    </svg>
  ),
  lamp: (
    <svg data-room="lamp" viewBox="0 0 320 180" role="img" aria-label="A great glass lens throwing golden beams over a night sea">
      <g className="art">
        <rect className="none" x="0" y="0" width="320" height="180" fill="#e6d7b8"/>
        <rect x="18" y="16" width="284" height="124" fill="#2f4660"/>
        <path className="none" d="M18 100 H302 V140 H18 Z" fill="#22364b"/>
        <path className="line thin" d="M18 100 H302" style={{ stroke: "#9fb3c4" }}/>
        <path className="line thin" d="M40 118 q6 -4 12 0 M240 112 q6 -4 12 0 M270 126 q6 -4 12 0" style={{ stroke: "#9fb3c4" }}/>
        <circle className="none" cx="48" cy="34" r="1.6" fill="#f3ead6"/>
        <circle className="none" cx="260" cy="30" r="1.6" fill="#f3ead6"/>
        <circle className="none" cx="286" cy="58" r="1.2" fill="#f3ead6"/>
        <circle className="none" cx="72" cy="62" r="1.2" fill="#f3ead6"/>
        <path className="none" d="M160 88 L18 50 L18 112 Z" fill="#f7d774" opacity="0.45"/>
        <path className="none" d="M160 88 L302 60 L302 118 Z" fill="#f7d774" opacity="0.45"/>
        <path className="line" d="M90 16 V140 M230 16 V140"/>
        <rect className="none" x="0" y="140" width="320" height="40" fill="#b3946a"/>
        <path className="line thin" d="M0 140 H320 M0 160 H320 M60 140 V180 M150 160 V180 M250 140 V160"/>
        <rect x="140" y="138" width="40" height="28" fill="#7a5a3c"/>
        <path d="M126 40 Q160 26 194 40 L198 136 Q160 146 122 136 Z" fill="#f2c14e" opacity="0.85"/>
        <path className="line thin" d="M124 56 Q160 48 196 56 M123 72 Q160 64 197 72 M123 104 Q160 112 197 104 M123 120 Q160 128 197 120"/>
        <circle cx="160" cy="88" r="13" fill="#fff6cc"/>
        <path className="line thin" d="M160 68 V74 M160 102 V108 M140 88 H146 M174 88 H180"/>
      </g>
    </svg>
  ),
  kitchen: (
    <svg data-room="kitchen" viewBox="0 0 320 180" role="img" aria-label="A warm stove with a kettle, and a table with an open logbook and bread">
      <g className="art">
        <rect className="none" x="0" y="0" width="320" height="180" fill="#ead8b4"/>
        <rect className="none" x="0" y="150" width="320" height="30" fill="#a57e56"/>
        <path className="line thin" d="M0 150 H320 M0 165 H320 M40 150 V165 M120 165 V180 M200 150 V165 M280 165 V180"/>
        <rect x="170" y="22" width="56" height="50" fill="#bcd3dc"/>
        <path className="line thin" d="M198 22 V72 M170 47 H226"/>
        <rect x="34" y="-4" width="14" height="86" fill="#3a3a3f"/>
        <rect x="28" y="82" width="82" height="70" fill="#2f2f34"/>
        <rect x="42" y="104" width="54" height="36" fill="#454549"/>
        <rect className="none" x="52" y="126" width="34" height="8" fill="#e0773a"/>
        <path className="line thin" d="M50 118 H88" style={{ stroke: "#6d6d72" }}/>
        <path d="M50 82 Q48 60 69 58 Q90 60 88 82 Z" fill="#b85c38"/>
        <path className="line" d="M86 72 L102 60"/>
        <path className="line" d="M56 62 Q69 44 82 62"/>
        <path className="line thin" d="M104 52 q-6 -8 0 -16 q6 -8 0 -16 M114 50 q-5 -7 0 -14 q5 -7 0 -14" style={{ stroke: "#8b8378" }}/>
        <rect x="146" y="110" width="160" height="9" fill="#8b5e3c"/>
        <path className="line" d="M156 119 V150 M296 119 V150"/>
        <path d="M184 110 L186 97 Q200 92 214 99 L214 110 Q199 105 184 110 Z" fill="#fbf6ea"/>
        <path d="M214 99 Q228 92 242 97 L244 110 Q229 105 214 110 Z" fill="#fbf6ea"/>
        <path className="line thin" d="M190 101 H208 M190 105 H206 M220 101 H238 M220 105 H236"/>
        <path d="M258 110 Q262 96 276 97 Q290 99 289 110 Z" fill="#d49a57"/>
        <path className="line thin" d="M266 101 L270 107 M275 100 L279 106 M283 102 L286 107"/>
      </g>
    </svg>
  ),
  rocks: (
    <svg data-room="rocks" viewBox="0 0 320 180" role="img" aria-label="Waves crashing on dark rocks at the foot of the lighthouse door">
      <g className="art">
        <rect className="none" x="0" y="0" width="320" height="110" fill="#cfdde3"/>
        <path d="M-4 110 Q40 104 80 110 T160 110 T240 110 T324 110 V184 H-4 Z" fill="#7fa3b0"/>
        <path d="M44 184 L54 -4 L102 -4 L112 184 Z" fill="#f1e8d6"/>
        <path d="M51 40 L105 40 L106 62 L50 62 Z" fill="#c4553b"/>
        <path d="M64 150 V120 Q75 106 86 120 V150 Z" fill="#6b4a35"/>
        <circle className="none" cx="82" cy="136" r="1.8" fill="#e8c46a"/>
        <path className="line" d="M246 40 q7 -8 14 0 q7 -8 14 0 M214 58 q5 -6 10 0 q5 -6 10 0"/>
        <path className="line thin" d="M140 128 q10 -7 20 0 t20 0 M230 138 q10 -7 20 0 t20 0 M170 150 q8 -6 16 0 t16 0" style={{ stroke: "#f3ead6" }}/>
        <path d="M-4 184 L-4 152 L26 140 L52 148 L90 142 L120 152 L150 144 L176 160 L200 152 L216 184 Z" fill="#4a4a54"/>
        <path d="M228 184 L244 154 L268 146 L292 160 L306 184 Z" fill="#3f3f48"/>
        <path className="line thin" d="M30 160 L44 170 M100 158 L112 172 M160 160 L170 170 M258 160 L266 172" style={{ stroke: "#8a8a96" }}/>
        <path className="line" d="M190 146 q-4 -12 4 -20 M200 144 q2 -14 12 -18 M208 148 q8 -8 18 -6 M236 150 q-2 -10 6 -16" style={{ stroke: "#f3ead6" }}/>
        <circle className="none" cx="196" cy="118" r="2" fill="#f3ead6"/>
        <circle className="none" cx="216" cy="122" r="1.6" fill="#f3ead6"/>
        <circle className="none" cx="228" cy="130" r="1.4" fill="#f3ead6"/>
      </g>
    </svg>
  ),
};
