// ============================================================
// skin-art.js — бібліотека унікальних псевдо-3D іконок для КОЖНОГО
// скіна проєкту (98 шт). Кожен запис: назва → u => ({defs, body}),
// де u — унікальний префікс id градієнтів (щоб кілька іконок на
// сторінці не конфліктували), body — SVG-вміст у полі 100×100.
// Об'ємність досягається радіальними градієнтами зі зміщеним
// центром світла (згори-зліва), відблисками та тінями — без
// жодного впливу на ігровий процес (чиста косметика).
// Підключається ПЕРЕД app.js: <script src="skin-art.js"></script>
// ============================================================
const SKIN_ART = {};
// hsl-колір
function _A(h,s,l){ return `hsl(${h},${s}%,${l}%)`; }
// Стандартний "об'ємний" градієнт: світло згори → тінь знизу, id="${u}l"
function _AD(u,h,s,l){
  return `<linearGradient id="${u}l" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${_A(h,s,Math.min(92,l+16))}"/>
    <stop offset="1" stop-color="${_A(h,s,Math.max(8,l-16))}"/>
  </linearGradient>`;
}
// Те саме, але з довільним суфіксом id (для другого градієнта в іконці)
function _AD2(u,h,s,l,sfx){
  return `<linearGradient id="${u}${sfx}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${_A(h,s,Math.min(92,l+16))}"/>
    <stop offset="1" stop-color="${_A(h,s,Math.max(8,l-16))}"/>
  </linearGradient>`;
}
// Радіальний "сферичний" градієнт (світло зі зміщенням вгору-вліво)
function _AR(u,h,s,l,sfx){
  return `<radialGradient id="${u}${sfx||'r'}" cx="35%" cy="30%" r="75%">
    <stop offset="0" stop-color="${_A(h,Math.max(20,s-10),Math.min(94,l+22))}"/>
    <stop offset="60%" stop-color="${_A(h,s,l)}"/>
    <stop offset="1" stop-color="${_A(h,s,Math.max(6,l-20))}"/>
  </radialGradient>`;
}
// М'яке світіння (filter), id="${u}g"
function _AG(u){
  return `<filter id="${u}g" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur stdDeviation="1.6" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>`;
}
// Тінь під фігурою
function _ASH(cx,cy,rx){ return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${Math.max(2.5,rx*0.22)}" fill="#000" opacity=".28"/>`; }
// Відблиск
function _AHL(cx,cy,rx,ry,rot){ return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".32" ${rot?`transform="rotate(${rot} ${cx} ${cy})"`:""}/>`; }
// ── RUNNER ПЕРСОНАЖІ (Rare) — 10 ─────────────────────────────
// Кожен — фігурка з головою-сферою та тілом-градієнтом + унікальний атрибут.
SKIN_ART["Класичний бігун"] = u => ({ defs:_AR(u,142,70,45,"b")+_AR(u,30,45,72,"h")+_AD(u,142,60,35),
  body:`${_ASH(50,92,24)}
  <path d="M36,50 Q50,42 64,50 L62,84 Q50,90 38,84 Z" fill="url(#${u}b)"/>
  <path d="M40,84 L36,93 M60,84 L64,93" stroke="${_A(142,60,30)}" stroke-width="7" stroke-linecap="round"/>
  <path d="M34,56 L22,68 M66,56 L80,62" stroke="url(#${u}l)" stroke-width="6.5" stroke-linecap="round"/>
  <circle cx="50" cy="28" r="14" fill="url(#${u}h)"/>
  <path d="M38,22 Q50,12 62,22 L62,27 L38,27 Z" fill="${_A(142,70,38)}"/>
  <circle cx="45" cy="29" r="2" fill="#1a2b45"/><circle cx="55" cy="29" r="2" fill="#1a2b45"/>
  <path d="M45,35 Q50,38 55,35" stroke="#1a2b45" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  ${_AHL(43,20,6,3,-20)}`});
SKIN_ART["Бізнес-кежуал"] = u => ({ defs:_AR(u,212,55,42,"b")+_AR(u,28,40,74,"h")+_AD(u,212,45,30),
  body:`${_ASH(50,92,24)}
  <path d="M35,50 Q50,43 65,50 L63,85 Q50,91 37,85 Z" fill="url(#${u}b)"/>
  <path d="M44,50 L50,60 L56,50 L53,48 L47,48 Z" fill="#fff"/>
  <path d="M48,52 L50,66 L52,52 Z" fill="${_A(354,70,48)}"/>
  <path d="M39,85 L36,93 M61,85 L64,93" stroke="${_A(220,30,22)}" stroke-width="7" stroke-linecap="round"/>
  <path d="M34,56 L24,70 M66,56 L76,70" stroke="url(#${u}l)" stroke-width="6" stroke-linecap="round"/>
  <circle cx="50" cy="27" r="13.5" fill="url(#${u}h)"/>
  <path d="M38,20 Q50,11 62,20 L62,25 L38,25 Z" fill="${_A(24,35,28)}"/>
  <circle cx="45" cy="28" r="2" fill="#1a2b45"/><circle cx="55" cy="28" r="2" fill="#1a2b45"/>
  <path d="M46,34 Q50,36 54,34" stroke="#1a2b45" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  ${_AHL(43,19,6,3,-20)}`});
SKIN_ART["Спортивна дівчина"] = u => ({ defs:_AR(u,328,80,58,"b")+_AR(u,26,45,75,"h")+_AD(u,328,70,45),
  body:`${_ASH(50,92,23)}
  <path d="M37,50 Q50,44 63,50 L61,80 Q50,86 39,80 Z" fill="url(#${u}b)"/>
  <path d="M41,80 L37,93 M59,80 L63,93" stroke="url(#${u}l)" stroke-width="6.5" stroke-linecap="round"/>
  <path d="M35,55 L20,48 M65,55 L82,44" stroke="url(#${u}b)" stroke-width="6" stroke-linecap="round"/>
  <circle cx="50" cy="27" r="13" fill="url(#${u}h)"/>
  <path d="M60,20 Q72,14 74,28 Q70,40 64,34" fill="${_A(16,70,40)}"/>
  <path d="M38,21 Q50,12 62,21 L62,24 L38,24 Z" fill="${_A(16,70,40)}"/>
  <rect x="37" y="18" width="26" height="4.5" rx="2" fill="${_A(328,85,68)}"/>
  <circle cx="45" cy="28" r="2" fill="#1a2b45"/><circle cx="55" cy="28" r="2" fill="#1a2b45"/>
  <path d="M46,34 Q50,37 54,34" stroke="#1a2b45" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  ${_AHL(43,19,5.5,3,-20)}`});
SKIN_ART["Офісна леді"] = u => ({ defs:_AR(u,268,45,42,"b")+_AR(u,27,42,73,"h")+_AD(u,268,40,32),
  body:`${_ASH(50,92,23)}
  <path d="M38,48 Q50,43 62,48 L60,64 L40,64 Z" fill="url(#${u}b)"/>
  <path d="M40,64 L34,84 L66,84 L60,64 Z" fill="url(#${u}l)"/>
  <path d="M41,84 L39,93 M59,84 L61,93" stroke="${_A(268,30,25)}" stroke-width="5.5" stroke-linecap="round"/>
  <path d="M37,53 L27,66 M63,53 L73,66" stroke="url(#${u}b)" stroke-width="5.5" stroke-linecap="round"/>
  <circle cx="50" cy="26" r="13" fill="url(#${u}h)"/>
  <path d="M37,22 Q50,10 63,22 L63,32 Q59,26 50,25 Q41,26 37,32 Z" fill="${_A(24,40,24)}"/>
  <circle cx="45" cy="27" r="2" fill="#1a2b45"/><circle cx="55" cy="27" r="2" fill="#1a2b45"/>
  <rect x="41" y="26" width="8" height="1.6" rx=".8" fill="#5a4a7a" opacity=".7"/><rect x="51" y="26" width="8" height="1.6" rx=".8" fill="#5a4a7a" opacity=".7"/>
  <path d="M46,33 Q50,35 54,33" stroke="#1a2b45" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  ${_AHL(43,18,5.5,3,-20)}`});
SKIN_ART["Ретро-спортсмен"] = u => ({ defs:_AR(u,24,85,50,"b")+_AR(u,29,45,72,"h")+_AD(u,24,75,40),
  body:`${_ASH(50,92,24)}
  <path d="M36,50 Q50,43 64,50 L62,82 Q50,88 38,82 Z" fill="url(#${u}b)"/>
  <rect x="37" y="60" width="26" height="5" fill="#fff" opacity=".85"/>
  <rect x="37" y="68" width="26" height="5" fill="#fff" opacity=".85"/>
  <path d="M40,82 L37,93 M60,82 L63,93" stroke="url(#${u}l)" stroke-width="7" stroke-linecap="round"/>
  <path d="M35,56 L23,66 M65,56 L77,66" stroke="url(#${u}b)" stroke-width="6" stroke-linecap="round"/>
  <circle cx="50" cy="27" r="13.5" fill="url(#${u}h)"/>
  <rect x="36" y="17" width="28" height="6" rx="3" fill="#fff"/>
  <rect x="36" y="17" width="28" height="2.4" rx="1.2" fill="${_A(24,85,55)}"/>
  <circle cx="45" cy="28" r="2" fill="#1a2b45"/><circle cx="55" cy="28" r="2" fill="#1a2b45"/>
  <path d="M44,34 Q50,38 56,34" stroke="#1a2b45" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M42,22 Q50,18 58,22" stroke="${_A(24,60,30)}" stroke-width="2" fill="none"/>
  ${_AHL(43,20,5.5,3,-20)}`});
SKIN_ART["Хіпстер-кур'єр"] = u => ({ defs:_AR(u,42,65,42,"b")+_AR(u,28,42,72,"h")+_AD(u,42,55,32)+_AD2(u,30,60,35,"bag"),
  body:`${_ASH(50,92,24)}
  <path d="M36,50 Q50,43 64,50 L62,84 Q50,90 38,84 Z" fill="url(#${u}b)"/>
  <path d="M36,52 L68,74" stroke="${_A(30,55,28)}" stroke-width="4.5" stroke-linecap="round"/>
  <rect x="58" y="68" width="18" height="14" rx="3" fill="url(#${u}bag)"/>
  <rect x="58" y="68" width="18" height="5" rx="2.5" fill="${_A(30,55,42)}"/>
  <path d="M40,84 L37,93 M60,84 L63,93" stroke="${_A(42,45,25)}" stroke-width="7" stroke-linecap="round"/>
  <path d="M35,56 L24,68" stroke="url(#${u}b)" stroke-width="6" stroke-linecap="round"/>
  <circle cx="50" cy="27" r="13.5" fill="url(#${u}h)"/>
  <path d="M36,20 Q50,9 64,20 L64,25 L36,25 Z" fill="${_A(42,55,30)}"/>
  <rect x="33" y="24" width="34" height="3.5" rx="1.7" fill="${_A(42,55,26)}"/>
  <circle cx="45" cy="29" r="2" fill="#1a2b45"/><circle cx="55" cy="29" r="2" fill="#1a2b45"/>
  <path d="M43,37 Q50,42 57,37 L57,40 Q50,45 43,40 Z" fill="${_A(24,40,26)}"/>
  ${_AHL(43,19,6,3,-20)}`});
SKIN_ART["Бізнес-леді на підборах"] = u => ({ defs:_AR(u,345,60,34,"b")+_AR(u,26,44,74,"h")+_AD(u,345,50,26),
  body:`${_ASH(50,93,22)}
  <path d="M38,48 Q50,43 62,48 L60,62 L40,62 Z" fill="url(#${u}b)"/>
  <path d="M40,62 L36,82 L64,82 L60,62 Z" fill="url(#${u}l)"/>
  <path d="M42,82 L41,90 M58,82 L59,90" stroke="${_A(345,40,22)}" stroke-width="5" stroke-linecap="round"/>
  <path d="M39,90 L44,90 L43,94 L39,94 Z M61,90 L56,90 L57,94 L61,94 Z" fill="${_A(345,70,45)}"/>
  <path d="M37,52 L28,64 M63,52 L72,64" stroke="url(#${u}b)" stroke-width="5.5" stroke-linecap="round"/>
  <circle cx="50" cy="25" r="13" fill="url(#${u}h)"/>
  <path d="M37,20 Q50,9 63,20 L63,34 Q60,25 50,24 Q40,25 37,34 Z" fill="${_A(10,50,22)}"/>
  <circle cx="45" cy="26" r="2" fill="#1a2b45"/><circle cx="55" cy="26" r="2" fill="#1a2b45"/>
  <path d="M46,32 Q50,34 54,32" stroke="${_A(345,70,45)}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  ${_AHL(43,17,5.5,3,-20)}`});
SKIN_ART["Скейтер-новачок"] = u => ({ defs:_AR(u,190,85,50,"b")+_AR(u,28,44,72,"h")+_AD(u,190,70,40)+_AD2(u,28,60,35,"bo"),
  body:`${_ASH(50,95,27)}
  <rect x="24" y="86" width="52" height="6" rx="3" fill="url(#${u}bo)"/>
  <circle cx="34" cy="94" r="4" fill="${_A(0,0,20)}"/><circle cx="34" cy="93" r="1.6" fill="${_A(0,0,55)}"/>
  <circle cx="66" cy="94" r="4" fill="${_A(0,0,20)}"/><circle cx="66" cy="93" r="1.6" fill="${_A(0,0,55)}"/>
  <path d="M37,50 Q50,44 63,50 L61,78 Q50,84 39,78 Z" fill="url(#${u}b)"/>
  <path d="M42,78 L39,87 M58,78 L61,87" stroke="${_A(190,60,32)}" stroke-width="6.5" stroke-linecap="round"/>
  <path d="M36,55 L25,50 M64,55 L76,49" stroke="url(#${u}b)" stroke-width="6" stroke-linecap="round"/>
  <circle cx="50" cy="28" r="13" fill="url(#${u}h)"/>
  <path d="M37,24 Q50,11 63,24 L63,27 L37,27 Z" fill="${_A(210,60,45)}"/>
  <circle cx="45" cy="29" r="2" fill="#1a2b45"/><circle cx="55" cy="29" r="2" fill="#1a2b45"/>
  <path d="M45,35 Q50,38 55,35" stroke="#1a2b45" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  ${_AHL(43,20,5.5,3,-20)}`});
SKIN_ART["Йогин у потоці"] = u => ({ defs:_AR(u,275,60,62,"b")+_AR(u,28,45,73,"h")+_AD(u,275,50,50),
  body:`${_ASH(50,88,28)}
  <path d="M32,80 Q50,70 68,80 L64,86 Q50,92 36,86 Z" fill="url(#${u}l)"/>
  <path d="M38,54 Q50,47 62,54 L60,78 Q50,84 40,78 Z" fill="url(#${u}b)"/>
  <path d="M36,58 Q26,50 30,40 M64,58 Q74,50 70,40" stroke="url(#${u}b)" stroke-width="5.5" stroke-linecap="round" fill="none"/>
  <circle cx="30" cy="38" r="3" fill="${_A(275,60,70)}"/><circle cx="70" cy="38" r="3" fill="${_A(275,60,70)}"/>
  <circle cx="50" cy="30" r="13" fill="url(#${u}h)"/>
  <circle cx="50" cy="21" r="2" fill="${_A(275,80,60)}"/>
  <circle cx="45" cy="31" r="1.8" fill="#1a2b45"/><circle cx="55" cy="31" r="1.8" fill="#1a2b45"/>
  <path d="M46,37 Q50,39 54,37" stroke="#1a2b45" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <circle cx="50" cy="52" r="20" fill="none" stroke="${_A(275,70,72)}" stroke-width="1" opacity=".5"><animate attributeName="r" values="18;24;18" dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" values=".5;.1;.5" dur="3s" repeatCount="indefinite"/></circle>
  ${_AHL(43,22,5.5,3,-20)}`});
SKIN_ART["Зимовий бігун"] = u => ({ defs:_AR(u,198,35,60,"b")+_AR(u,26,44,73,"h")+_AD(u,198,30,50)+_AD2(u,354,65,48,"sc"),
  body:`${_ASH(50,92,24)}
  <path d="M35,50 Q50,43 65,50 L63,84 Q50,90 37,84 Z" fill="url(#${u}b)"/>
  <path d="M38,50 Q50,45 62,50 L62,56 Q50,52 38,56 Z" fill="url(#${u}sc)"/>
  <path d="M58,52 L62,72 L56,72 L54,54 Z" fill="url(#${u}sc)"/>
  <path d="M40,84 L37,93 M60,84 L63,93" stroke="${_A(198,25,35)}" stroke-width="7" stroke-linecap="round"/>
  <path d="M34,56 L23,67 M66,56 L77,67" stroke="url(#${u}b)" stroke-width="6" stroke-linecap="round"/>
  <circle cx="50" cy="27" r="13" fill="url(#${u}h)"/>
  <path d="M37,22 Q50,10 63,22 L63,26 L37,26 Z" fill="${_A(354,60,42)}"/>
  <circle cx="50" cy="12" r="4.5" fill="#fff"/>
  <rect x="36" y="24" width="28" height="4" rx="2" fill="#fff" opacity=".9"/>
  <circle cx="45" cy="29" r="2" fill="#1a2b45"/><circle cx="55" cy="29" r="2" fill="#1a2b45"/>
  <path d="M46,35 Q50,37 54,35" stroke="#1a2b45" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  ${[[24,40],[76,36],[20,74],[80,78],[70,20]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="1.4" fill="#fff" opacity=".85"><animate attributeName="cy" values="${y};${y+6};${y}" dur="${2+i*.4}s" repeatCount="indefinite"/></circle>`).join("")}
  ${_AHL(43,19,5.5,3,-20)}`});
// ── RUNNER ПТИЦІ (Epic) — 16 ─────────────────────────────────
SKIN_ART["Папужка-помічник"] = u => ({ defs:_AR(u,145,75,50,"b")+_AD(u,145,65,40)+_AD2(u,0,80,55,"cr"),
  body:`${_ASH(50,86,22)}
  <ellipse cx="48" cy="56" rx="24" ry="19" fill="url(#${u}b)"/>
  <path d="M44,40 Q38,20 52,26 Q46,32 50,38 Z" fill="url(#${u}cr)"/>
  <path d="M42,52 Q20,46 12,60 Q28,58 42,64 Z" fill="url(#${u}l)"/>
  <circle cx="60" cy="50" r="6" fill="#fff"/><circle cx="61.5" cy="50" r="3" fill="#1a2b45"/><circle cx="62.6" cy="48.8" r="1" fill="#fff"/>
  <path d="M70,54 Q84,54 70,66 Q66,60 70,54 Z" fill="${_A(42,90,58)}"/>
  <path d="M30,72 L26,80 M38,74 L36,82" stroke="${_A(30,60,35)}" stroke-width="2.4" stroke-linecap="round"/>
  ${_AHL(38,46,8,4,-15)}`});
SKIN_ART["Сова-мудрець"] = u => ({ defs:_AR(u,30,35,42,"b")+_AD(u,30,30,32)+_AR(u,38,45,60,"br"),
  body:`${_ASH(50,88,23)}
  <ellipse cx="50" cy="55" rx="25" ry="26" fill="url(#${u}b)"/>
  <path d="M30,34 L22,16 L40,28 Z" fill="url(#${u}l)"/><path d="M70,34 L78,16 L60,28 Z" fill="url(#${u}l)"/>
  <ellipse cx="50" cy="62" rx="15" ry="16" fill="url(#${u}br)"/>
  <circle cx="40" cy="46" r="9.5" fill="#fdf6e3"/><circle cx="60" cy="46" r="9.5" fill="#fdf6e3"/>
  <circle cx="40" cy="46" r="4.6" fill="#2a1c0e"/><circle cx="60" cy="46" r="4.6" fill="#2a1c0e"/>
  <circle cx="41.6" cy="44.4" r="1.5" fill="#fff"/><circle cx="61.6" cy="44.4" r="1.5" fill="#fff"/>
  <path d="M46,55 L54,55 L50,63 Z" fill="${_A(30,85,52)}"/>
  <path d="M34,88 L34,94 M40,88 L40,94 M60,88 L60,94 M66,88 L66,94" stroke="${_A(30,60,35)}" stroke-width="2.4" stroke-linecap="round"/>
  ${_AHL(40,34,9,4,-12)}`});
SKIN_ART["Фламінго-піарник"] = u => ({ defs:_AR(u,335,80,64,"b")+_AD(u,335,70,55),
  body:`${_ASH(46,94,20)}
  <ellipse cx="44" cy="60" rx="21" ry="14" fill="url(#${u}b)"/>
  <path d="M40,56 Q18,50 14,64 Q30,62 42,68 Z" fill="url(#${u}l)"/>
  <path d="M60,54 Q76,44 72,26" stroke="url(#${u}b)" stroke-width="7" stroke-linecap="round" fill="none"/>
  <circle cx="71" cy="22" r="8" fill="url(#${u}b)"/>
  <circle cx="74" cy="21" r="2.2" fill="#1a2b45"/><circle cx="74.8" cy="20.2" r=".8" fill="#fff"/>
  <path d="M78,23 L92,20 L79,29 Z" fill="#2a2a2a"/><path d="M78,23 L86,21.6 L79,26 Z" fill="${_A(40,85,60)}"/>
  <path d="M40,72 L40,92 M50,72 L50,86 L50,92" stroke="${_A(335,60,52)}" stroke-width="2.8" stroke-linecap="round"/>
  <path d="M36,92 L44,92 M46,92 L54,92" stroke="${_A(335,60,52)}" stroke-width="2.4" stroke-linecap="round"/>
  ${_AHL(36,52,8,4,-15)}`});
SKIN_ART["Пінгвін-бухгалтер"] = u => ({ defs:_AR(u,215,25,26,"b")+_AD(u,215,20,20),
  body:`${_ASH(50,90,22)}
  <ellipse cx="50" cy="58" rx="22" ry="27" fill="url(#${u}b)"/>
  <ellipse cx="50" cy="63" rx="13.5" ry="19" fill="#f4f1e8"/>
  <ellipse cx="27" cy="52" rx="7" ry="15" fill="url(#${u}l)" transform="rotate(14 27 52)"/>
  <ellipse cx="73" cy="52" rx="7" ry="15" fill="url(#${u}l)" transform="rotate(-14 73 52)"/>
  <circle cx="43" cy="40" r="4.6" fill="#fff"/><circle cx="57" cy="40" r="4.6" fill="#fff"/>
  <circle cx="44" cy="40" r="2.2" fill="#1a2b45"/><circle cx="58" cy="40" r="2.2" fill="#1a2b45"/>
  <rect x="37" y="37" width="11" height="1.6" fill="#556" opacity=".8"/><rect x="52" y="37" width="11" height="1.6" fill="#556" opacity=".8"/>
  <path d="M46,47 L54,47 L50,53 Z" fill="${_A(42,90,58)}"/>
  <path d="M43,46 Q50,44 57,46 L56,50 Q50,48 44,50 Z" fill="${_A(354,60,44)}"/>
  <path d="M42,85 L38,92 L46,92 Z M58,85 L54,92 L62,92 Z" fill="${_A(42,90,55)}"/>
  ${_AHL(42,36,7,3.5,-12)}`});
SKIN_ART["Голуб-кур'єр"] = u => ({ defs:_AR(u,220,15,68,"b")+_AD(u,220,12,58)+_AD2(u,150,45,42,"nk"),
  body:`${_ASH(50,88,22)}
  <ellipse cx="50" cy="58" rx="24" ry="17" fill="url(#${u}b)"/>
  <path d="M46,50 Q24,42 16,56 Q32,56 46,62 Z" fill="url(#${u}l)"/>
  <ellipse cx="64" cy="44" rx="10" ry="9" fill="url(#${u}b)"/>
  <path d="M58,50 Q64,54 70,50 Q64,58 58,54 Z" fill="url(#${u}nk)" opacity=".7"/>
  <circle cx="67" cy="42" r="2.2" fill="#1a2b45"/><circle cx="67.8" cy="41.2" r=".8" fill="#fff"/>
  <path d="M73,44 L82,43 L73,48 Z" fill="${_A(30,50,45)}"/>
  <rect x="40" y="60" width="12" height="8" rx="2" fill="#f7f3e9" transform="rotate(-8 46 64)"/>
  <path d="M40,60 L46,64 L52,59" stroke="${_A(30,40,60)}" stroke-width="1.2" fill="none" transform="rotate(-8 46 64)"/>
  <path d="M38,74 L34,82 M46,75 L44,83" stroke="${_A(0,60,55)}" stroke-width="2.4" stroke-linecap="round"/>
  ${_AHL(42,50,8,4,-14)}`});
SKIN_ART["Тукан-дизайнер"] = u => ({ defs:_AR(u,220,20,18,"b")+_AD2(u,20,90,55,"bk")+_AD(u,220,15,14),
  body:`${_ASH(50,88,22)}
  <ellipse cx="44" cy="56" rx="21" ry="18" fill="url(#${u}b)"/>
  <ellipse cx="44" cy="62" rx="11" ry="10" fill="#f7f3e9"/>
  <path d="M38,50 Q18,46 12,58 Q26,58 38,62 Z" fill="url(#${u}l)"/>
  <circle cx="52" cy="44" r="4.4" fill="#fff"/><circle cx="53" cy="44" r="2.2" fill="#1a2b45"/>
  <path d="M56,42 Q86,36 90,48 Q88,58 60,52 Q54,48 56,42 Z" fill="url(#${u}bk)"/>
  <path d="M58,44 Q84,40 87,47" stroke="${_A(48,95,62)}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <circle cx="82" cy="50" r="1.6" fill="${_A(150,70,45)}"/><circle cx="74" cy="52" r="1.4" fill="${_A(335,80,60)}"/>
  <path d="M36,72 L32,80 M44,74 L42,82" stroke="${_A(220,20,40)}" stroke-width="2.4" stroke-linecap="round"/>
  ${_AHL(36,48,7,3.5,-14)}`});
SKIN_ART["Синичка-стажерка"] = u => ({ defs:_AR(u,55,85,58,"b")+_AD2(u,200,60,40,"hd")+_AD(u,55,75,48),
  body:`${_ASH(50,86,20)}
  <ellipse cx="48" cy="58" rx="21" ry="16" fill="url(#${u}b)"/>
  <path d="M44,52 Q24,46 16,58 Q30,58 44,64 Z" fill="url(#${u}hd)"/>
  <ellipse cx="60" cy="44" rx="9.5" ry="9" fill="url(#${u}hd)"/>
  <ellipse cx="60" cy="47" rx="5.5" ry="4.5" fill="#fff"/>
  <circle cx="63" cy="42" r="2" fill="#1a2b45"/><circle cx="63.8" cy="41.2" r=".7" fill="#fff"/>
  <path d="M68,45 L76,44 L68,49 Z" fill="#2a2a2a"/>
  <path d="M46,52 L52,70" stroke="${_A(200,50,30)}" stroke-width="3" stroke-linecap="round"/>
  <path d="M40,72 L37,80 M48,73 L46,81" stroke="${_A(200,40,40)}" stroke-width="2.2" stroke-linecap="round"/>
  ${_AHL(42,52,7,3.5,-12)}`});
SKIN_ART["Ластівка-таймкіпер"] = u => ({ defs:_AR(u,205,60,36,"b")+_AD(u,205,55,28),
  body:`${_ASH(50,86,20)}
  <ellipse cx="48" cy="54" rx="20" ry="13" fill="url(#${u}b)"/>
  <ellipse cx="48" cy="58" rx="10" ry="7" fill="#f7ded1"/>
  <path d="M44,48 Q20,36 10,46 Q26,48 42,58 Z" fill="url(#${u}l)"/>
  <path d="M62,58 Q76,68 88,62 M62,60 Q74,72 82,72" stroke="url(#${u}b)" stroke-width="3.4" stroke-linecap="round" fill="none"/>
  <ellipse cx="60" cy="44" rx="8.5" ry="8" fill="url(#${u}b)"/>
  <path d="M56,48 Q60,50 64,48 L63,52 Q60,53 57,52 Z" fill="${_A(14,75,52)}"/>
  <circle cx="63" cy="42" r="2" fill="#1a2b45"/><circle cx="63.7" cy="41.3" r=".7" fill="#fff"/>
  <path d="M67,44 L74,43 L67,47 Z" fill="#2a2a2a"/>
  <circle cx="34" cy="70" r="7" fill="#f4f1e8" stroke="${_A(42,60,45)}" stroke-width="1.6"/>
  <path d="M34,70 L34,66 M34,70 L37,71" stroke="${_A(205,50,25)}" stroke-width="1.4" stroke-linecap="round"/>
  ${_AHL(42,46,7,3,-14)}`});
SKIN_ART["Ворон-дедлайн"] = u => ({ defs:_AR(u,260,30,22,"b")+_AD(u,260,25,16)+_AG(u),
  body:`${_ASH(50,88,23)}
  <ellipse cx="50" cy="56" rx="24" ry="17" fill="url(#${u}b)"/>
  <path d="M46,48 Q22,38 12,52 Q30,52 44,60 Z" fill="url(#${u}l)"/>
  <path d="M54,48 Q78,38 88,52 Q70,52 56,60 Z" fill="url(#${u}l)"/>
  <ellipse cx="50" cy="40" rx="10" ry="9" fill="url(#${u}b)"/>
  <circle cx="46" cy="38" r="2.4" fill="${_A(0,90,55)}" filter="url(#${u}g)"/>
  <circle cx="54" cy="38" r="2.4" fill="${_A(0,90,55)}" filter="url(#${u}g)"/>
  <path d="M47,44 L53,44 L50,52 Z" fill="#3a3a44"/>
  <path d="M40,72 L36,82 M60,72 L64,82" stroke="#3a3a44" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M30,26 L34,30 M70,26 L66,30" stroke="${_A(260,40,40)}" stroke-width="1.6" stroke-linecap="round" opacity=".6"/>
  ${_AHL(42,34,7,3,-12)}`});
SKIN_ART["Яструб-аудитор"] = u => ({ defs:_AR(u,15,45,36,"b")+_AD(u,15,40,28)+_AD2(u,32,50,60,"ch"),
  body:`${_ASH(50,88,24)}
  <ellipse cx="50" cy="56" rx="24" ry="16" fill="url(#${u}b)"/>
  <ellipse cx="50" cy="60" rx="13" ry="10" fill="url(#${u}ch)"/>
  <path d="M46,48 Q20,34 8,50 Q28,50 44,60 Z" fill="url(#${u}l)"/>
  <path d="M54,48 Q80,34 92,50 Q72,50 56,60 Z" fill="url(#${u}l)"/>
  <ellipse cx="50" cy="40" rx="10" ry="8.5" fill="url(#${u}b)"/>
  <path d="M41,36 L48,39 M59,36 L52,39" stroke="#2a1c10" stroke-width="2" stroke-linecap="round"/>
  <circle cx="46" cy="40" r="2.2" fill="${_A(42,95,55)}"/><circle cx="54" cy="40" r="2.2" fill="${_A(42,95,55)}"/>
  <circle cx="46.6" cy="39.4" r=".7" fill="#1a1208"/><circle cx="54.6" cy="39.4" r=".7" fill="#1a1208"/>
  <path d="M47,45 L53,45 L50,51 Z" fill="#2a2a2a"/>
  <path d="M42,70 L38,80 M58,70 L62,80" stroke="${_A(42,80,50)}" stroke-width="2.8" stroke-linecap="round"/>
  <path d="M36,80 L34,84 M40,80 L39,85 M60,80 L58,85 M64,80 L62,84" stroke="${_A(42,80,50)}" stroke-width="1.8" stroke-linecap="round"/>
  ${_AHL(42,34,7,3,-12)}`});
SKIN_ART["Грак-конкурент"] = u => ({ defs:_AR(u,250,22,26,"b")+_AD(u,250,18,20),
  body:`${_ASH(50,88,23)}
  <ellipse cx="50" cy="57" rx="23" ry="16" fill="url(#${u}b)"/>
  <path d="M46,50 Q24,44 14,56 Q30,56 44,62 Z" fill="url(#${u}l)"/>
  <ellipse cx="58" cy="42" rx="10" ry="9" fill="url(#${u}b)"/>
  <circle cx="61" cy="40" r="2.4" fill="#e8e4f0"/><circle cx="61.8" cy="40" r="1.2" fill="#1a1a24"/>
  <path d="M66,42 Q80,40 82,46 Q74,48 66,47 Z" fill="#5a5a68"/>
  <path d="M40,52 L58,66 M44,50 L60,62" stroke="${_A(250,15,38)}" stroke-width="1.4" opacity=".55"/>
  <path d="M42,72 L38,82 M56,73 L58,83" stroke="#44444e" stroke-width="2.6" stroke-linecap="round"/>
  ${_AHL(42,36,7,3,-12)}`});
SKIN_ART["Сич-критик"] = u => ({ defs:_AR(u,40,42,46,"b")+_AD(u,40,36,36)+_AR(u,45,50,62,"br"),
  body:`${_ASH(50,88,21)}
  <ellipse cx="50" cy="56" rx="22" ry="23" fill="url(#${u}b)"/>
  <ellipse cx="50" cy="62" rx="13" ry="14" fill="url(#${u}br)"/>
  <path d="M34,38 Q30,28 40,32 Z M66,38 Q70,28 60,32 Z" fill="url(#${u}l)"/>
  <circle cx="41" cy="46" r="8" fill="#fdf6e3"/><circle cx="59" cy="46" r="8" fill="#fdf6e3"/>
  <circle cx="41" cy="47" r="3.6" fill="#2a1c0e"/><circle cx="59" cy="47" r="3.6" fill="#2a1c0e"/>
  <path d="M34,40 L47,43 M66,40 L53,43" stroke="${_A(40,50,28)}" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M46,55 L54,55 L50,61 Z" fill="${_A(30,80,50)}"/>
  <path d="M42,84 L42,92 M50,86 L50,93 M58,84 L58,92" stroke="${_A(40,50,32)}" stroke-width="2.4" stroke-linecap="round"/>
  ${_AHL(41,34,8,3.5,-10)}`});
SKIN_ART["Орел-начальник"] = u => ({ defs:_AR(u,35,65,42,"b")+_AD(u,35,55,32)+_AD2(u,28,30,88,"hd"),
  body:`${_ASH(50,90,25)}
  <ellipse cx="50" cy="58" rx="25" ry="17" fill="url(#${u}b)"/>
  <path d="M45,50 Q16,32 6,50 Q26,52 43,62 Z" fill="url(#${u}l)"/>
  <path d="M55,50 Q84,32 94,50 Q74,52 57,62 Z" fill="url(#${u}l)"/>
  <ellipse cx="50" cy="38" rx="11" ry="10" fill="url(#${u}hd)"/>
  <path d="M42,34 L49,37 M58,34 L51,37" stroke="#4a3a1a" stroke-width="2.2" stroke-linecap="round"/>
  <circle cx="46" cy="38" r="2.2" fill="${_A(42,95,52)}"/><circle cx="54" cy="38" r="2.2" fill="${_A(42,95,52)}"/>
  <circle cx="46.6" cy="37.4" r=".7" fill="#1a1208"/><circle cx="54.6" cy="37.4" r=".7" fill="#1a1208"/>
  <path d="M46,43 Q50,42 54,43 L52,49 L48,49 Z" fill="${_A(42,90,55)}"/>
  <path d="M38,26 L42,20 L46,25 L50,18 L54,25 L58,20 L62,26 Z" fill="${_A(45,90,55)}"/>
  <path d="M42,72 L38,82 M58,72 L62,82" stroke="${_A(42,80,48)}" stroke-width="3" stroke-linecap="round"/>
  ${_AHL(43,32,7,3,-12)}`});
SKIN_ART["Дрізд-саботажник"] = u => ({ defs:_AR(u,90,30,32,"b")+_AD(u,90,25,24)+_AD2(u,28,60,50,"bl"),
  body:`${_ASH(50,88,22)}
  <ellipse cx="50" cy="57" rx="22" ry="15" fill="url(#${u}b)"/>
  <path d="M46,50 Q24,44 14,56 Q30,56 44,62 Z" fill="url(#${u}l)"/>
  <ellipse cx="59" cy="43" rx="9.5" ry="8.5" fill="url(#${u}b)"/>
  <path d="M52,38 Q59,34 66,38 L66,42 Q59,39 52,42 Z" fill="#1a1a1a" opacity=".85"/>
  <circle cx="62" cy="42" r="2.2" fill="#f0ead8"/><circle cx="62.8" cy="42" r="1.1" fill="#1a1a14"/>
  <path d="M67,44 L75,43 L67,47 Z" fill="url(#${u}bl)"/>
  <path d="M42,72 L38,80 M54,73 L56,81" stroke="${_A(28,50,40)}" stroke-width="2.4" stroke-linecap="round"/>
  ${_AHL(42,37,6.5,3,-12)}`});
SKIN_ART["Крук-стрес"] = u => ({ defs:_AR(u,275,42,20,"b")+_AD(u,275,36,14)+_AG(u),
  body:`${_ASH(50,88,23)}
  <ellipse cx="50" cy="57" rx="24" ry="16" fill="url(#${u}b)"/>
  <path d="M46,49 Q20,40 10,54 Q30,54 44,61 Z" fill="url(#${u}l)"/>
  <path d="M54,49 Q80,40 90,54 Q70,54 56,61 Z" fill="url(#${u}l)"/>
  <ellipse cx="50" cy="40" rx="10" ry="9" fill="url(#${u}b)"/>
  <path d="M43,35 L48,38 M57,35 L52,38" stroke="${_A(275,60,60)}" stroke-width="1.8" stroke-linecap="round"/>
  <circle cx="46" cy="39" r="2.2" fill="${_A(275,85,66)}" filter="url(#${u}g)"/>
  <circle cx="54" cy="39" r="2.2" fill="${_A(275,85,66)}" filter="url(#${u}g)"/>
  <path d="M47,44 L53,44 L50,51 Z" fill="#3a3444"/>
  <path d="M26,24 Q30,30 26,34 M74,24 Q70,30 74,34" stroke="${_A(275,70,55)}" stroke-width="1.6" fill="none" opacity=".6"><animate attributeName="opacity" values=".6;.15;.6" dur="1.6s" repeatCount="indefinite"/></path>
  <path d="M42,72 L38,82 M58,72 L62,82" stroke="#3a3444" stroke-width="2.6" stroke-linecap="round"/>
  ${_AHL(42,34,7,3,-12)}`});
SKIN_ART["Сорока-пліткарка"] = u => ({ defs:_AR(u,0,0,22,"b")+_AD(u,210,20,80)+_AD2(u,200,60,45,"tl"),
  body:`${_ASH(50,88,23)}
  <ellipse cx="46" cy="56" rx="22" ry="15" fill="url(#${u}b)"/>
  <ellipse cx="46" cy="60" rx="12" ry="9" fill="url(#${u}l)"/>
  <path d="M42,49 Q22,42 12,54 Q28,54 40,60 Z" fill="url(#${u}tl)" opacity=".9"/>
  <path d="M60,60 Q78,66 90,60 Q78,72 62,68 Z" fill="url(#${u}tl)"/>
  <ellipse cx="57" cy="42" rx="9.5" ry="8.5" fill="url(#${u}b)"/>
  <circle cx="60" cy="41" r="2.3" fill="#f0f4f8"/><circle cx="60.8" cy="41" r="1.1" fill="#101418"/>
  <path d="M65,43 L73,42 L65,47 Z" fill="#2a2a30"/>
  <path d="M74,32 Q80,28 84,32 Q80,36 74,32 Z" fill="#fff" opacity=".9"/>
  <circle cx="78" cy="26" r="1.2" fill="#fff" opacity=".7"/><circle cx="82" cy="22" r=".9" fill="#fff" opacity=".5"/>
  <path d="M40,70 L36,79 M50,71 L52,80" stroke="#3a3a40" stroke-width="2.4" stroke-linecap="round"/>
  ${_AHL(40,36,6.5,3,-12)}`});
// ── RUNNER НАБОРИ ПЕРЕШКОД (Epic) — 8 ────────────────────────
SKIN_ART["Офісний набір перешкод"] = u => ({ defs:_AD(u,212,45,45)+_AD2(u,28,35,55,"dk"),
  body:`${_ASH(50,90,32)}
  <rect x="14" y="52" width="24" height="34" rx="3" fill="url(#${u}dk)"/>
  <rect x="17" y="56" width="18" height="10" rx="2" fill="${_A(28,30,40)}"/><rect x="17" y="69" width="18" height="10" rx="2" fill="${_A(28,30,40)}"/>
  <circle cx="33" cy="61" r="1.4" fill="${_A(45,70,60)}"/><circle cx="33" cy="74" r="1.4" fill="${_A(45,70,60)}"/>
  <rect x="44" y="34" width="22" height="52" rx="3" fill="url(#${u}l)"/>
  <rect x="47" y="38" width="16" height="12" rx="2" fill="#cfe3f7" opacity=".9"/>
  <rect x="47" y="53" width="16" height="3" rx="1.5" fill="#fff" opacity=".55"/><rect x="47" y="59" width="12" height="3" rx="1.5" fill="#fff" opacity=".4"/>
  <rect x="72" y="60" width="16" height="26" rx="3" fill="url(#${u}dk)"/>
  <rect x="74" y="56" width="12" height="6" rx="2" fill="${_A(212,40,55)}"/>
  ${_AHL(50,38,8,3,0)}`});
SKIN_ART["Будівельний набір перешкод"] = u => ({ defs:_AD(u,35,90,52)+_AD2(u,45,90,55,"y"),
  body:`${_ASH(50,90,32)}
  <path d="M18,86 L30,50 L42,86 Z" fill="url(#${u}l)"/>
  <path d="M22,76 L38,76 L36,70 L24,70 Z" fill="#fff" opacity=".85"/>
  <path d="M26,64 L34,64 L33,59 L27,59 Z" fill="#fff" opacity=".85"/>
  <rect x="48" y="42" width="10" height="44" rx="2" fill="url(#${u}y)"/>
  <rect x="48" y="46" width="10" height="7" fill="#1a1a1a" opacity=".8"/><rect x="48" y="60" width="10" height="7" fill="#1a1a1a" opacity=".8"/><rect x="48" y="74" width="10" height="7" fill="#1a1a1a" opacity=".8"/>
  <rect x="64" y="56" width="24" height="30" rx="3" fill="url(#${u}l)"/>
  <path d="M64,64 L88,64 M64,72 L88,72" stroke="#7a4a10" stroke-width="1.6"/>
  <path d="M70,56 L70,86 M80,56 L80,86" stroke="#7a4a10" stroke-width="1.4" opacity=".7"/>
  <circle cx="30" cy="44" r="4" fill="${_A(45,90,60)}"/><circle cx="29" cy="43" r="1.4" fill="#fff" opacity=".7"/>
  ${_AHL(28,56,4,8,14)}`});
SKIN_ART["Кухонний набір перешкод"] = u => ({ defs:_AD(u,5,60,48)+_AD2(u,210,15,75,"mt"),
  body:`${_ASH(50,90,32)}
  <path d="M20,60 Q20,52 28,52 L44,52 Q52,52 52,60 L50,86 L22,86 Z" fill="url(#${u}l)"/>
  <path d="M24,52 Q24,42 36,42 Q48,42 48,52" fill="none" stroke="url(#${u}mt)" stroke-width="4" stroke-linecap="round"/>
  <ellipse cx="36" cy="54" rx="14" ry="3.5" fill="#fff" opacity=".3"/>
  <rect x="62" y="36" width="8" height="50" rx="3" fill="url(#${u}mt)"/>
  <path d="M60,36 L72,36 L70,24 L62,24 Z" fill="url(#${u}mt)"/>
  <rect x="78" y="44" width="10" height="42" rx="4" fill="url(#${u}l)"/>
  <ellipse cx="83" cy="44" rx="5" ry="3" fill="${_A(5,50,62)}"/>
  <path d="M28,32 Q30,26 28,22 M36,34 Q38,28 36,24" stroke="#fff" stroke-width="1.8" fill="none" opacity=".5" stroke-linecap="round"><animate attributeName="opacity" values=".5;.1;.5" dur="2s" repeatCount="indefinite"/></path>
  ${_AHL(30,58,5,8,10)}`});
SKIN_ART["Новорічний набір перешкод"] = u => ({ defs:_AD(u,145,60,35)+_AD2(u,0,75,50,"rd")+_AG(u),
  body:`${_ASH(50,90,32)}
  <path d="M32,26 L46,50 L38,50 L50,70 L40,70 L52,88 L12,88 L24,70 L14,70 L26,50 L18,50 Z" fill="url(#${u}l)" transform="translate(4 0) scale(.92)"/>
  <circle cx="26" cy="52" r="2.4" fill="${_A(0,85,58)}" filter="url(#${u}g)"/>
  <circle cx="36" cy="66" r="2.4" fill="${_A(45,90,60)}" filter="url(#${u}g)"/>
  <circle cx="22" cy="74" r="2.4" fill="${_A(200,85,60)}" filter="url(#${u}g)"/>
  <path d="M30,22 L32,16 L34,22 L40,22 L35,26 L37,32 L32,28 L27,32 L29,26 L24,22 Z" fill="${_A(48,95,60)}" filter="url(#${u}g)"/>
  <rect x="60" y="58" width="28" height="28" rx="4" fill="url(#${u}rd)"/>
  <rect x="72" y="58" width="5" height="28" fill="${_A(48,90,60)}"/>
  <rect x="60" y="69" width="28" height="5" fill="${_A(48,90,60)}"/>
  <path d="M68,58 Q74,46 74,58 Q74,46 80,58" stroke="${_A(48,90,60)}" stroke-width="3" fill="none"/>
  ${[[16,20],[86,26],[90,46],[60,30]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="1.5" fill="#fff" opacity=".85"><animate attributeName="cy" values="${y};${y+7};${y}" dur="${2.2+i*.4}s" repeatCount="indefinite"/></circle>`).join("")}`});
SKIN_ART["Спортивний набір перешкод"] = u => ({ defs:_AD(u,260,60,50)+_AD2(u,30,80,55,"or"),
  body:`${_ASH(50,90,32)}
  <rect x="14" y="50" width="5" height="36" rx="2" fill="url(#${u}l)"/>
  <rect x="40" y="50" width="5" height="36" rx="2" fill="url(#${u}l)"/>
  <rect x="12" y="46" width="35" height="7" rx="3.5" fill="url(#${u}or)"/>
  <ellipse cx="29" cy="49" rx="14" ry="2" fill="#fff" opacity=".3"/>
  <circle cx="68" cy="70" r="16" fill="url(#${u}or)"/>
  <path d="M52,70 Q68,60 84,70 M68,54 Q60,70 68,86 M68,54 Q76,70 68,86" stroke="#1a1024" stroke-width="1.8" fill="none" opacity=".65"/>
  <circle cx="62" cy="62" r="4.5" fill="#fff" opacity=".35"/>
  <path d="M84,36 L92,32 L92,44 Z" fill="url(#${u}l)"/>
  <rect x="82" y="32" width="2.4" height="54" rx="1.2" fill="${_A(220,10,70)}"/>
  ${_AHL(24,48,6,2,0)}`});
SKIN_ART["Кіберпанк-набір перешкод"] = u => ({ defs:_AG(u)+`<linearGradient id="${u}n" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${_A(315,95,62)}"/><stop offset="1" stop-color="${_A(190,95,58)}"/></linearGradient>`,
  body:`<rect x="14" y="48" width="18" height="38" rx="2" fill="${_A(280,45,10)}"/>
  <rect x="14" y="48" width="18" height="38" rx="2" fill="none" stroke="url(#${u}n)" stroke-width="2" filter="url(#${u}g)"/>
  ${[0,1,2,3].map(i=>`<rect x="17" y="${53+i*8}" width="12" height="2.4" fill="${_A(315,95,62)}" opacity=".85"/>`).join("")}
  <rect x="40" y="24" width="20" height="62" rx="2" fill="${_A(280,45,12)}"/>
  <rect x="40" y="24" width="20" height="62" rx="2" fill="none" stroke="url(#${u}n)" stroke-width="2.2" filter="url(#${u}g)"/>
  ${[0,1,2,3,4,5].map(i=>`<rect x="43" y="${30+i*9}" width="14" height="2.6" fill="${_A(190,95,58)}" opacity=".85"/>`).join("")}
  <rect x="68" y="40" width="18" height="46" rx="2" fill="${_A(280,45,10)}"/>
  <rect x="68" y="40" width="18" height="46" rx="2" fill="none" stroke="url(#${u}n)" stroke-width="2" filter="url(#${u}g)"/>
  ${[0,1,2,3].map(i=>`<rect x="71" y="${46+i*9}" width="12" height="2.4" fill="${_A(315,95,62)}" opacity=".85"/>`).join("")}
  <circle cx="50" cy="16" r="2.4" fill="url(#${u}n)" filter="url(#${u}g)"><animate attributeName="opacity" values=".4;1;.4" dur="1.4s" repeatCount="indefinite"/></circle>`});
SKIN_ART["Набір перешкод «Джунглі»"] = u => ({ defs:_AD(u,100,55,35)+_AD2(u,28,50,32,"tr"),
  body:`${_ASH(50,90,32)}
  <rect x="22" y="44" width="9" height="42" rx="4" fill="url(#${u}tr)"/>
  <circle cx="26" cy="38" r="14" fill="url(#${u}l)"/>
  <circle cx="18" cy="46" r="8" fill="${_A(100,50,28)}"/><circle cx="36" cy="44" r="9" fill="${_A(100,55,42)}"/>
  <path d="M50,86 Q54,60 48,40 Q56,58 58,86 Z" fill="url(#${u}l)"/>
  <path d="M50,52 Q42,46 40,38 M52,62 Q60,58 64,50" stroke="${_A(100,50,30)}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <rect x="68" y="56" width="22" height="30" rx="3" fill="url(#${u}tr)"/>
  <path d="M68,64 L90,64 M68,72 L90,72 M74,56 L74,86 M82,56 L82,86" stroke="${_A(28,45,22)}" stroke-width="1.4" opacity=".8"/>
  <path d="M64,50 Q72,42 82,46 Q76,50 70,56" fill="${_A(100,55,38)}"/>
  ${_AHL(22,32,6,4,-15)}`});
SKIN_ART["Набір перешкод «Архів документів»"] = u => ({ defs:_AD(u,45,28,55)+_AD2(u,42,35,42,"bx"),
  body:`${_ASH(50,90,32)}
  <rect x="14" y="60" width="26" height="26" rx="2" fill="url(#${u}bx)"/>
  <rect x="14" y="60" width="26" height="7" fill="${_A(42,35,34)}"/>
  <path d="M22,64 L32,64" stroke="#f0e8d0" stroke-width="1.6"/>
  <rect x="18" y="40" width="22" height="20" rx="2" fill="url(#${u}l)"/>
  <path d="M24,46 L34,46 M24,50 L34,50 M24,54 L30,54" stroke="#8a7648" stroke-width="1.3"/>
  <rect x="50" y="30" width="20" height="56" rx="2" fill="url(#${u}bx)"/>
  ${[0,1,2,3].map(i=>`<rect x="52" y="${34+i*13}" width="16" height="10" rx="1.5" fill="${_A(45,30,62)}"/><circle cx="66" cy="${39+i*13}" r="1" fill="${_A(42,40,30)}"/>`).join("")}
  <path d="M76,86 L76,40 Q76,34 82,34 L88,34" stroke="url(#${u}l)" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M80,46 L92,42 L90,52 Z" fill="#f0e8d0"/>
  <path d="M83,46 L88,45" stroke="#8a7648" stroke-width="1"/>
  ${_AHL(24,44,7,2.5,0)}`});

// ── RUNNER ПОГОДА (Legendary) — 8 ────────────────────────────
SKIN_ART["Грозова злива"] = u => ({ defs:_AR(u,220,30,30,"c")+_AG(u),
  body:`<rect x="8" y="10" width="84" height="78" rx="6" fill="${_A(222,40,12)}"/>
  <ellipse cx="40" cy="34" rx="24" ry="13" fill="url(#${u}c)"/>
  <ellipse cx="62" cy="30" rx="18" ry="11" fill="${_A(220,28,24)}"/>
  <path d="M52,44 L44,60 L52,60 L42,80" stroke="${_A(48,95,60)}" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round" filter="url(#${u}g)"><animate attributeName="opacity" values="1;.2;1" dur="1.3s" repeatCount="indefinite"/></path>
  ${[[22,52],[30,64],[66,52],[74,62],[60,70],[18,74]].map(([x,y],i)=>`<path d="M${x},${y} L${x-2},${y+8}" stroke="${_A(205,70,60)}" stroke-width="1.8" stroke-linecap="round"><animate attributeName="opacity" values=".9;.2;.9" dur="${1+i*.2}s" repeatCount="indefinite"/></path>`).join("")}
  ${_AHL(32,28,10,4,-8)}`});
SKIN_ART["Снігова буря"] = u => ({ defs:_AR(u,210,25,70,"c"),
  body:`<rect x="8" y="10" width="84" height="78" rx="6" fill="${_A(212,35,26)}"/>
  <ellipse cx="42" cy="32" rx="24" ry="12" fill="url(#${u}c)"/>
  <ellipse cx="64" cy="28" rx="16" ry="10" fill="${_A(210,20,58)}"/>
  ${[[24,50],[36,60],[52,48],[64,58],[76,50],[30,74],[58,72],[74,76],[44,82]].map(([x,y],i)=>`<g transform="translate(${x} ${y})"><path d="M0,-3.4 L0,3.4 M-3,-1.7 L3,1.7 M-3,1.7 L3,-1.7" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".9"/><animateTransform attributeName="transform" type="translate" values="${x} ${y};${x-4} ${y+9};${x} ${y}" dur="${2.4+i*.3}s" repeatCount="indefinite"/></g>`).join("")}
  <path d="M8,84 Q30,78 50,84 T92,84 L92,88 L8,88 Z" fill="#fff" opacity=".85"/>
  ${_AHL(34,27,10,4,-8)}`});
SKIN_ART["Туман над офісом"] = u => ({ defs:_AD(u,222,28,30),
  body:`<rect x="8" y="10" width="84" height="78" rx="6" fill="${_A(226,25,20)}"/>
  <rect x="18" y="38" width="16" height="50" fill="url(#${u}l)"/>
  <rect x="42" y="26" width="18" height="62" fill="${_A(224,26,34)}"/>
  <rect x="68" y="46" width="14" height="42" fill="url(#${u}l)"/>
  ${[[21,44],[27,44],[21,52],[45,32],[52,32],[45,40],[52,48],[71,52],[77,60]].map(([x,y])=>`<rect x="${x}" y="${y}" width="3.6" height="4.4" fill="${_A(45,80,64)}" opacity=".8"/>`).join("")}
  ${[62,70,78].map((y,i)=>`<ellipse cx="50" cy="${y}" rx="46" ry="7" fill="#c8cede" opacity=".${28-i*6}"><animate attributeName="cx" values="46;54;46" dur="${5+i*1.5}s" repeatCount="indefinite"/></ellipse>`).join("")}
  ${_AHL(46,30,8,3,0)}`});
SKIN_ART["Веселка успіху"] = u => ({ defs:_AR(u,210,60,60,"sk"),
  body:`<rect x="8" y="10" width="84" height="78" rx="6" fill="${_A(255,45,26)}"/>
  ${[["0,85,58",30],["30,90,55",26],["48,95,58",22],["145,65,48",18],["210,80,55",14],["275,60,58",10]].map(([c,r])=>`<path d="M${50-r*1.55},78 A${r*1.55},${r*1.55} 0 0 1 ${50+r*1.55},78" fill="none" stroke="hsl(${c}%)" stroke-width="5" stroke-linecap="round"/>`).join("").replace(/hsl\(([\d]+),([\d]+),([\d]+)%\)/g,'hsl($1,$2%,$3%)')}
  <ellipse cx="20" cy="76" rx="12" ry="7" fill="#fff" opacity=".95"/>
  <ellipse cx="80" cy="76" rx="12" ry="7" fill="#fff" opacity=".95"/>
  <ellipse cx="26" cy="72" rx="8" ry="5" fill="#fff"/>
  <ellipse cx="74" cy="72" rx="8" ry="5" fill="#fff"/>
  ${[[36,26],[64,22],[50,16]].map(([x,y],i)=>`<path d="M${x},${y} l1.2,2.6 2.8,.4 -2,2 .5,2.8 -2.5,-1.3 -2.5,1.3 .5,-2.8 -2,-2 2.8,-.4 Z" fill="#ffe9a8"><animate attributeName="opacity" values=".4;1;.4" dur="${1.8+i*.4}s" repeatCount="indefinite"/></path>`).join("")}`});
SKIN_ART["Північне сяйво"] = u => ({ defs:`<linearGradient id="${u}a1" x1="0" y1="1" x2=".3" y2="0"><stop offset="0" stop-color="${_A(150,80,45)}" stop-opacity="0"/><stop offset=".5" stop-color="${_A(160,85,55)}" stop-opacity=".8"/><stop offset="1" stop-color="${_A(180,80,60)}" stop-opacity=".2"/></linearGradient><linearGradient id="${u}a2" x1="0" y1="1" x2="-.2" y2="0"><stop offset="0" stop-color="${_A(260,70,55)}" stop-opacity="0"/><stop offset=".55" stop-color="${_A(280,75,62)}" stop-opacity=".7"/><stop offset="1" stop-color="${_A(300,70,60)}" stop-opacity=".15"/></linearGradient>`,
  body:`<rect x="8" y="10" width="84" height="78" rx="6" fill="${_A(232,50,10)}"/>
  <path d="M18,84 Q26,44 22,18 L34,20 Q36,50 30,84 Z" fill="url(#${u}a1)"><animate attributeName="opacity" values="1;.5;1" dur="3.4s" repeatCount="indefinite"/></path>
  <path d="M40,84 Q50,40 46,14 L60,16 Q58,48 54,84 Z" fill="url(#${u}a2)"><animate attributeName="opacity" values=".6;1;.6" dur="4.2s" repeatCount="indefinite"/></path>
  <path d="M64,84 Q74,46 70,20 L82,22 Q84,52 76,84 Z" fill="url(#${u}a1)"><animate attributeName="opacity" values=".8;.4;.8" dur="3.8s" repeatCount="indefinite"/></path>
  ${[[16,22,1.2],[36,16,1],[62,12,1.3],[86,24,1.1],[88,50,1],[14,54,1.2]].map(([x,y,r],i)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"><animate attributeName="opacity" values=".3;1;.3" dur="${1.6+i*.35}s" repeatCount="indefinite"/></circle>`).join("")}
  <path d="M8,84 L24,70 L38,80 L56,66 L74,80 L92,72 L92,88 L8,88 Z" fill="${_A(230,35,16)}"/>`});
SKIN_ART["Пісочна буря"] = u => ({ defs:_AR(u,36,70,55,"s1")+_AR(u,32,65,45,"s2"),
  body:`<rect x="8" y="10" width="84" height="78" rx="6" fill="${_A(34,55,30)}"/>
  <circle cx="74" cy="26" r="9" fill="${_A(42,80,70)}" opacity=".8"/>
  <ellipse cx="34" cy="62" rx="30" ry="20" fill="url(#${u}s1)" opacity=".85"><animate attributeName="cx" values="30;40;30" dur="3.6s" repeatCount="indefinite"/></ellipse>
  <ellipse cx="64" cy="70" rx="26" ry="16" fill="url(#${u}s2)" opacity=".8"><animate attributeName="cx" values="68;58;68" dur="4.4s" repeatCount="indefinite"/></ellipse>
  <path d="M14,46 Q34,38 54,46 T92,44" stroke="${_A(38,70,62)}" stroke-width="2.4" fill="none" opacity=".7" stroke-linecap="round"><animate attributeName="opacity" values=".7;.2;.7" dur="2.4s" repeatCount="indefinite"/></path>
  <path d="M10,32 Q30,26 48,32 T88,30" stroke="${_A(38,65,58)}" stroke-width="2" fill="none" opacity=".5" stroke-linecap="round"><animate attributeName="opacity" values=".5;.15;.5" dur="3s" repeatCount="indefinite"/></path>
  ${[[26,40],[52,34],[76,44],[40,26]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="1.3" fill="${_A(40,75,68)}"><animate attributeName="cx" values="${x};${x+10};${x}" dur="${1.8+i*.3}s" repeatCount="indefinite"/></circle>`).join("")}
  <path d="M8,82 Q30,74 52,80 T92,78 L92,88 L8,88 Z" fill="${_A(34,60,38)}"/>`});
SKIN_ART["Золотий захід сонця"] = u => ({ defs:_AR(u,38,95,60,"sun")+`<linearGradient id="${u}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${_A(18,70,22)}"/><stop offset=".55" stop-color="${_A(28,80,38)}"/><stop offset="1" stop-color="${_A(42,90,52)}"/></linearGradient>`,
  body:`<rect x="8" y="10" width="84" height="78" rx="6" fill="url(#${u}sky)"/>
  <circle cx="50" cy="62" r="15" fill="url(#${u}sun)"/>
  <circle cx="50" cy="62" r="20" fill="none" stroke="${_A(42,95,62)}" stroke-width="1.4" opacity=".5"><animate attributeName="r" values="18;24;18" dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" values=".5;.1;.5" dur="3s" repeatCount="indefinite"/></circle>
  ${[0,1,2,3].map(i=>`<rect x="12" y="${66+i*6}" width="76" height="2" fill="${_A(20,60,20)}" opacity=".${7-i}"/>`).join("")}
  <path d="M8,78 L26,64 L40,74 L60,60 L78,74 L92,66 L92,88 L8,88 Z" fill="${_A(20,55,14)}"/>
  <path d="M30,40 Q34,36 38,40 M60,32 Q64,28 68,32" stroke="${_A(24,50,18)}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`});
SKIN_ART["Місячна ніч"] = u => ({ defs:_AR(u,50,25,88,"m")+_AG(u),
  body:`<rect x="8" y="10" width="84" height="78" rx="6" fill="${_A(232,55,8)}"/>
  <circle cx="66" cy="30" r="13" fill="url(#${u}m)" filter="url(#${u}g)"/>
  <circle cx="61" cy="27" r="2.4" fill="${_A(50,15,72)}" opacity=".7"/><circle cx="70" cy="34" r="1.8" fill="${_A(50,15,72)}" opacity=".6"/><circle cx="68" cy="25" r="1.3" fill="${_A(50,15,72)}" opacity=".5"/>
  ${[[18,22,1.4],[32,16,1],[46,26,1.2],[86,18,1.1],[88,44,1.3],[16,48,1],[28,38,.9]].map(([x,y,r],i)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"><animate attributeName="opacity" values=".3;1;.3" dur="${1.5+i*.3}s" repeatCount="indefinite"/></circle>`).join("")}
  <path d="M8,72 L22,60 L34,68 L52,54 L70,68 L84,60 L92,66 L92,88 L8,88 Z" fill="${_A(232,40,14)}"/>
  <path d="M52,54 L70,68 L52,68 Z" fill="${_A(232,35,20)}" opacity=".8"/>
  <ellipse cx="66" cy="80" rx="18" ry="2.5" fill="${_A(50,30,60)}" opacity=".25"/>`});
// ── RUNNER БОСИ (Legendary) — 8 ──────────────────────────────
SKIN_ART["Дракон-дедлайн"] = u => ({ defs:_AR(u,0,72,36,"b")+_AD(u,0,65,28)+_AG(u),
  body:`${_ASH(50,92,26)}
  <path d="M20,60 Q10,48 16,38 Q24,44 26,52 Z" fill="url(#${u}l)"/>
  <path d="M80,60 Q90,48 84,38 Q76,44 74,52 Z" fill="url(#${u}l)"/>
  <path d="M30,50 Q30,26 50,26 Q70,26 70,50 Q70,74 50,84 Q30,74 30,50 Z" fill="url(#${u}b)"/>
  <path d="M36,28 L30,12 L44,24 Z M64,28 L70,12 L56,24 Z" fill="url(#${u}l)"/>
  <circle cx="42" cy="46" r="4.4" fill="${_A(48,95,58)}" filter="url(#${u}g)"/><circle cx="58" cy="46" r="4.4" fill="${_A(48,95,58)}" filter="url(#${u}g)"/>
  <circle cx="42" cy="46" r="1.6" fill="#1a0a00"/><circle cx="58" cy="46" r="1.6" fill="#1a0a00"/>
  <path d="M42,62 Q50,68 58,62" stroke="#2a0808" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <path d="M44,63 L44,68 M50,65 L50,70 M56,63 L56,68" stroke="#ffe9c8" stroke-width="2" stroke-linecap="round"/>
  <path d="M50,84 L56,96 L44,93 Z" fill="url(#${u}l)"/>
  <path d="M32,20 Q36,14 34,8 M68,20 Q64,14 66,8" stroke="${_A(20,80,55)}" stroke-width="2" fill="none" opacity=".7" stroke-linecap="round"><animate attributeName="opacity" values=".7;.2;.7" dur="1.8s" repeatCount="indefinite"/></path>
  ${_AHL(42,34,7,3.5,-12)}`});
SKIN_ART["Робот-контролер"] = u => ({ defs:_AR(u,200,22,48,"b")+_AD(u,200,18,38)+_AG(u),
  body:`${_ASH(50,92,26)}
  <line x1="50" y1="22" x2="50" y2="10" stroke="url(#${u}l)" stroke-width="2.6"/>
  <circle cx="50" cy="9" r="3.4" fill="${_A(0,90,55)}" filter="url(#${u}g)"><animate attributeName="opacity" values="1;.4;1" dur="1.2s" repeatCount="indefinite"/></circle>
  <rect x="28" y="22" width="44" height="42" rx="8" fill="url(#${u}b)"/>
  <rect x="34" y="30" width="32" height="14" rx="4" fill="#0a1420"/>
  <circle cx="43" cy="37" r="3.6" fill="${_A(190,95,58)}" filter="url(#${u}g)"/><circle cx="57" cy="37" r="3.6" fill="${_A(190,95,58)}" filter="url(#${u}g)"/>
  <rect x="36" y="50" width="28" height="7" rx="2" fill="#0a1420"/>
  ${[0,1,2].map(i=>`<rect x="${38+i*9}" y="51.5" width="6" height="4" rx="1" fill="${_A(190,90,55)}"/>`).join("")}
  <rect x="34" y="64" width="32" height="22" rx="5" fill="url(#${u}l)"/>
  <circle cx="50" cy="74" r="6" fill="#0a1420"/><circle cx="50" cy="74" r="3" fill="${_A(45,95,55)}" filter="url(#${u}g)"/>
  <rect x="20" y="66" width="10" height="16" rx="4" fill="url(#${u}b)"/><rect x="70" y="66" width="10" height="16" rx="4" fill="url(#${u}b)"/>
  ${_AHL(38,28,8,3,-6)}`});
SKIN_ART["Принтер-монстр"] = u => ({ defs:_AR(u,222,55,42,"b")+_AD(u,222,50,32)+_AG(u),
  body:`${_ASH(50,92,28)}
  <rect x="20" y="38" width="60" height="34" rx="7" fill="url(#${u}b)"/>
  <rect x="26" y="30" width="48" height="10" rx="3" fill="url(#${u}l)"/>
  <circle cx="38" cy="50" r="5" fill="#fdf6e3"/><circle cx="62" cy="50" r="5" fill="#fdf6e3"/>
  <circle cx="39" cy="51" r="2.2" fill="${_A(0,85,50)}" filter="url(#${u}g)"/><circle cx="63" cy="51" r="2.2" fill="${_A(0,85,50)}" filter="url(#${u}g)"/>
  <rect x="32" y="62" width="36" height="14" rx="2" fill="#fdf6e3"/>
  <path d="M36,66 L64,66 M36,70 L58,70" stroke="#8a8478" stroke-width="1.4"/>
  <path d="M32,62 L36,76 L40,62 L44,76 L48,62 L52,76 L56,62 L60,76 L64,62 L68,76 L68,62 Z" fill="url(#${u}b)" opacity=".95"/>
  <rect x="26" y="78" width="48" height="10" rx="4" fill="url(#${u}l)"/>
  <circle cx="74" cy="34" r="2" fill="${_A(120,80,55)}" filter="url(#${u}g)"><animate attributeName="opacity" values="1;.3;1" dur="1.5s" repeatCount="indefinite"/></circle>
  ${_AHL(34,33,8,2.5,0)}`});
SKIN_ART["Королева бюрократії"] = u => ({ defs:_AR(u,320,55,38,"b")+_AD(u,320,50,28)+_AD2(u,46,95,55,"cr"),
  body:`${_ASH(50,92,26)}
  <path d="M30,22 L36,6 L44,18 L50,4 L56,18 L64,6 L70,22 Z" fill="url(#${u}cr)"/>
  <circle cx="36" cy="9" r="2" fill="${_A(0,80,60)}"/><circle cx="50" cy="7" r="2.2" fill="${_A(200,80,60)}"/><circle cx="64" cy="9" r="2" fill="${_A(140,70,55)}"/>
  <circle cx="50" cy="38" r="15" fill="url(#${u}b)"/>
  <circle cx="44" cy="36" r="2.2" fill="#f5e8f0"/><circle cx="56" cy="36" r="2.2" fill="#f5e8f0"/>
  <path d="M45,44 Q50,46 55,44" stroke="#f5e8f0" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path d="M34,52 Q28,86 22,90 L78,90 Q72,86 66,52 Q58,58 50,58 Q42,58 34,52 Z" fill="url(#${u}l)"/>
  <path d="M42,64 L58,64 M40,72 L60,72 M38,80 L62,80" stroke="${_A(320,40,20)}" stroke-width="1.6" opacity=".6"/>
  <rect x="44" y="58" width="12" height="16" rx="2" fill="#fdf6e3" transform="rotate(6 50 66)"/>
  <path d="M47,63 L54,63 M47,67 L54,67" stroke="#8a8478" stroke-width="1.1" transform="rotate(6 50 66)"/>
  ${_AHL(43,32,6,3,-12)}`});
SKIN_ART["Тінь минулого кварталу"] = u => ({ defs:`<radialGradient id="${u}b" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="${_A(265,45,34)}"/><stop offset=".7" stop-color="${_A(265,45,18)}"/><stop offset="1" stop-color="${_A(265,50,8)}" stop-opacity=".6"/></radialGradient>`+_AG(u),
  body:`<path d="M28,52 Q28,24 50,24 Q72,24 72,52 L72,84 Q66,76 60,86 Q54,76 48,86 Q42,76 36,86 Q30,76 28,84 Z" fill="url(#${u}b)" opacity=".92"/>
  <circle cx="42" cy="44" r="4" fill="${_A(190,90,62)}" filter="url(#${u}g)"><animate attributeName="opacity" values="1;.4;1" dur="2.2s" repeatCount="indefinite"/></circle>
  <circle cx="58" cy="44" r="4" fill="${_A(190,90,62)}" filter="url(#${u}g)"><animate attributeName="opacity" values="1;.4;1" dur="2.2s" repeatCount="indefinite" begin=".4s"/></circle>
  <path d="M43,56 Q50,60 57,56" stroke="${_A(190,60,50)}" stroke-width="1.8" fill="none" opacity=".6" stroke-linecap="round"/>
  <path d="M20,64 Q14,60 12,52 M80,64 Q86,60 88,52" stroke="${_A(265,40,30)}" stroke-width="2.4" fill="none" opacity=".5" stroke-linecap="round"><animate attributeName="opacity" values=".5;.1;.5" dur="2.6s" repeatCount="indefinite"/></path>
  <text x="50" y="76" font-size="9" font-family="monospace" fill="${_A(265,30,55)}" text-anchor="middle" opacity=".55">Q-1</text>
  ${_AHL(42,32,7,3.5,-10)}`});
SKIN_ART["Кракен звітів"] = u => ({ defs:_AR(u,190,62,32,"b")+_AD(u,190,55,24),
  body:`${_ASH(50,94,28)}
  <path d="M30,52 Q30,26 50,26 Q70,26 70,52 L70,64 L30,64 Z" fill="url(#${u}b)"/>
  <circle cx="42" cy="44" r="5" fill="#e8f6f8"/><circle cx="58" cy="44" r="5" fill="#e8f6f8"/>
  <circle cx="43" cy="45" r="2.4" fill="#08282e"/><circle cx="59" cy="45" r="2.4" fill="#08282e"/>
  ${[0,1,2,3].map(i=>{const tx=32+i*12;const d=i%2?1:-1;return `<path d="M${tx},62 Q${tx+d*7},78 ${tx-d*3},92 Q${tx-d*6},80 ${tx-4},62 Z" fill="url(#${u}l)"><animateTransform attributeName="transform" type="rotate" values="0 ${tx} 62;${d*6} ${tx} 62;0 ${tx} 62" dur="${2.4+i*.4}s" repeatCount="indefinite"/></path>`;}).join("")}
  ${[0,1,2].map(i=>`<circle cx="${36+i*4}" cy="${74+i*6}" r="1.4" fill="${_A(190,50,50)}" opacity=".7"/>`).join("")}
  <rect x="60" y="66" width="13" height="17" rx="2" fill="#fdf6e3" transform="rotate(10 66 74)"/>
  <path d="M63,71 L70,71 M63,75 L70,75 M63,79 L68,79" stroke="#8a8478" stroke-width="1.1" transform="rotate(10 66 74)"/>
  ${_AHL(42,34,7,3.5,-10)}`});
SKIN_ART["Голем із паперів"] = u => ({ defs:_AD(u,45,30,58)+_AD2(u,45,25,45,"dk")+_AG(u),
  body:`${_ASH(50,94,27)}
  <rect x="32" y="20" width="36" height="26" rx="5" fill="url(#${u}l)"/>
  <path d="M36,26 L50,26 M36,31 L46,31" stroke="#9a8a68" stroke-width="1.2" opacity=".7"/>
  <circle cx="43" cy="34" r="3" fill="${_A(35,95,50)}" filter="url(#${u}g)"/><circle cx="57" cy="34" r="3" fill="${_A(35,95,50)}" filter="url(#${u}g)"/>
  <rect x="26" y="48" width="48" height="34" rx="6" fill="url(#${u}dk)"/>
  <path d="M32,54 L54,54 M32,60 L48,60 M52,64 L68,64 M32,70 L44,70" stroke="#9a8a68" stroke-width="1.3" opacity=".65"/>
  <path d="M40,48 L42,58 M60,50 L57,62" stroke="${_A(45,20,30)}" stroke-width="1.4" opacity=".7"/>
  <rect x="12" y="50" width="12" height="24" rx="4" fill="url(#${u}l)" transform="rotate(-6 18 62)"/>
  <rect x="76" y="50" width="12" height="24" rx="4" fill="url(#${u}l)" transform="rotate(6 82 62)"/>
  <rect x="32" y="84" width="14" height="10" rx="3" fill="url(#${u}dk)"/><rect x="54" y="84" width="14" height="10" rx="3" fill="url(#${u}dk)"/>
  ${_AHL(40,24,7,2.5,0)}`});
SKIN_ART["Привид понеділка"] = u => ({ defs:`<radialGradient id="${u}b" cx="40%" cy="28%" r="80%"><stop offset="0" stop-color="${_A(180,20,86)}"/><stop offset=".65" stop-color="${_A(185,18,66)}"/><stop offset="1" stop-color="${_A(190,20,48)}" stop-opacity=".75"/></radialGradient>`,
  body:`<path d="M28,54 Q28,24 50,24 Q72,24 72,54 L72,86 Q66,78 60,88 Q54,78 48,88 Q42,78 36,88 Q30,78 28,86 Z" fill="url(#${u}b)" opacity=".95"/>
  <circle cx="42" cy="46" r="3.4" fill="#26323a"/><circle cx="58" cy="46" r="3.4" fill="#26323a"/>
  <path d="M40,42 Q42,40 44,42 M56,42 Q58,40 60,42" stroke="#26323a" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <ellipse cx="50" cy="58" rx="4" ry="5" fill="#26323a" opacity=".85"/>
  <path d="M34,30 Q30,22 34,16" stroke="${_A(185,20,60)}" stroke-width="2" fill="none" opacity=".5" stroke-linecap="round"/>
  <ellipse cx="38" cy="34" rx="7" ry="3.5" fill="#fff" opacity=".5" transform="rotate(-14 38 34)"/>
  <text x="72" y="30" font-size="10" fill="${_A(210,25,70)}" opacity=".7" font-family="sans-serif">z</text>
  <text x="78" y="22" font-size="7" fill="${_A(210,25,70)}" opacity=".5" font-family="sans-serif">z</text>
  <animateTransform attributeName="transform" type="translate" values="0 0;0 -3;0 0" dur="3s" repeatCount="indefinite"/>`});

// ── WORDLE ТАЙМЕРИ (Rare) — 8 ────────────────────────────────
SKIN_ART["Пісочний годинник"] = u => ({ defs:_AD(u,32,45,40)+_AD2(u,45,85,60,"sd"),
  body:`${_ASH(50,92,20)}
  <rect x="30" y="12" width="40" height="7" rx="3.5" fill="url(#${u}l)"/>
  <rect x="30" y="81" width="40" height="7" rx="3.5" fill="url(#${u}l)"/>
  <path d="M35,19 L65,19 L52,48 L52,52 L65,81 L35,81 L48,52 L48,48 Z" fill="${_A(195,35,80)}" opacity=".4"/>
  <path d="M40,22 L60,22 L51,42 L49,42 Z" fill="url(#${u}sd)"/>
  <path d="M50,52 L50,66" stroke="${_A(45,80,55)}" stroke-width="2" stroke-dasharray="1.5 2.4"><animate attributeName="stroke-dashoffset" values="0;-8" dur="1s" repeatCount="indefinite"/></path>
  <path d="M38,78 Q50,68 62,78 L62,80 L38,80 Z" fill="url(#${u}sd)"/>
  <path d="M35,19 L65,19 M35,81 L65,81" stroke="${_A(32,40,30)}" stroke-width="1.6"/>
  ${_AHL(40,30,4,8,18)}`});
SKIN_ART["Неоновий таймер"] = u => ({ defs:_AG(u)+`<linearGradient id="${u}n" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${_A(315,95,60)}"/><stop offset="1" stop-color="${_A(190,95,55)}"/></linearGradient>`,
  body:`<rect x="20" y="30" width="60" height="40" rx="9" fill="${_A(280,45,10)}"/>
  <rect x="20" y="30" width="60" height="40" rx="9" fill="none" stroke="url(#${u}n)" stroke-width="2.6" filter="url(#${u}g)"/>
  <text x="50" y="57" font-size="19" font-family="monospace" font-weight="bold" fill="url(#${u}n)" text-anchor="middle" filter="url(#${u}g)">1:23</text>
  <circle cx="50" cy="22" r="2" fill="url(#${u}n)" filter="url(#${u}g)"><animate attributeName="opacity" values="1;.3;1" dur="1s" repeatCount="indefinite"/></circle>
  <path d="M28,76 L72,76" stroke="url(#${u}n)" stroke-width="2" stroke-linecap="round" filter="url(#${u}g)" opacity=".7"/>`});
SKIN_ART["Механічний циферблат"] = u => ({ defs:_AR(u,42,30,72,"f")+_AD(u,40,45,42)+_AD2(u,210,15,70,"mt"),
  body:`${_ASH(50,92,24)}
  <circle cx="50" cy="50" r="32" fill="url(#${u}l)"/>
  <circle cx="50" cy="50" r="27" fill="url(#${u}f)"/>
  ${[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>{const a=i*30*Math.PI/180;const x1=50+Math.sin(a)*23,y1=50-Math.cos(a)*23,x2=50+Math.sin(a)*26,y2=50-Math.cos(a)*26;return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${_A(40,40,32)}" stroke-width="${i%3===0?2.4:1.2}"/>`;}).join("")}
  <line x1="50" y1="50" x2="50" y2="33" stroke="${_A(40,50,25)}" stroke-width="2.8" stroke-linecap="round"/>
  <line x1="50" y1="50" x2="62" y2="56" stroke="${_A(40,50,25)}" stroke-width="2.2" stroke-linecap="round"/>
  <circle cx="50" cy="50" r="3" fill="url(#${u}mt)"/>
  <circle cx="50" cy="15" r="4" fill="url(#${u}mt)"/><rect x="47" y="10" width="6" height="4" rx="2" fill="url(#${u}mt)"/>
  <path d="M28,26 Q24,22 26,18 M72,26 Q76,22 74,18" stroke="url(#${u}mt)" stroke-width="3" fill="none" stroke-linecap="round"/>
  ${_AHL(40,36,9,4.5,-25)}`});
SKIN_ART["Піксельний таймер"] = u => ({ defs:"",
  body:`${[[38,14],[46,14],[54,14],[62,14],[30,22],[70,22],[26,30],[74,30],[22,38],[78,38],[22,46],[78,46],[22,54],[78,54],[26,62],[74,62],[30,70],[70,70],[38,78],[46,78],[54,78],[62,78]].map(([x,y])=>`<rect x="${x-4}" y="${y-4}" width="8" height="8" fill="${_A(140,60,42)}"/>`).join("")}
  ${[[38,14],[46,14],[30,22],[26,30],[22,38]].map(([x,y])=>`<rect x="${x-4}" y="${y-4}" width="8" height="8" fill="${_A(140,65,55)}"/>`).join("")}
  <rect x="46" y="30" width="8" height="20" fill="${_A(140,90,60)}"><animate attributeName="opacity" values="1;.4;1" dur="1s" repeatCount="indefinite"/></rect>
  <rect x="54" y="50" width="12" height="8" fill="${_A(140,90,60)}"><animate attributeName="opacity" values="1;.4;1" dur="1s" repeatCount="indefinite" begin=".5s"/></rect>
  <rect x="34" y="86" width="32" height="6" fill="${_A(140,50,35)}"/>
  <rect x="34" y="86" width="20" height="6" fill="${_A(140,85,55)}"><animate attributeName="width" values="32;4;32" dur="4s" repeatCount="indefinite"/></rect>`});
SKIN_ART["Кавова пара"] = u => ({ defs:_AR(u,25,55,45,"c")+_AD(u,25,50,36)+_AD2(u,30,70,25,"cf"),
  body:`${_ASH(48,90,24)}
  <path d="M26,44 L70,44 L66,82 Q66,88 58,88 L38,88 Q30,88 30,82 Z" fill="url(#${u}c)"/>
  <path d="M70,50 Q84,50 84,60 Q84,70 68,68" fill="none" stroke="url(#${u}l)" stroke-width="4.5" stroke-linecap="round"/>
  <ellipse cx="48" cy="46" rx="20" ry="4.5" fill="url(#${u}cf)"/>
  <ellipse cx="42" cy="45" rx="6" ry="1.8" fill="${_A(32,60,42)}" opacity=".8"/>
  ${[0,1,2].map(i=>`<path d="M${38+i*10},34 Q${41+i*10},26 ${38+i*10},18" stroke="#e8ddd0" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".65"><animate attributeName="opacity" values=".65;.15;.65" dur="${2+i*.4}s" repeatCount="indefinite"/></path>`).join("")}
  <circle cx="60" cy="66" r="7.5" fill="#fdf6e3" opacity=".92"/>
  <line x1="60" y1="66" x2="60" y2="61.5" stroke="${_A(25,50,28)}" stroke-width="1.4" stroke-linecap="round"/>
  <line x1="60" y1="66" x2="63" y2="67.5" stroke="${_A(25,50,28)}" stroke-width="1.2" stroke-linecap="round"/>
  ${_AHL(38,56,4.5,10,14)}`});
SKIN_ART["Космічний таймер"] = u => ({ defs:_AR(u,255,55,20,"sp")+_AR(u,190,70,55,"pl")+_AG(u),
  body:`<circle cx="50" cy="50" r="40" fill="url(#${u}sp)"/>
  ${[[26,28,1.3],[74,24,1],[80,60,1.2],[24,68,1],[62,80,1.1],[38,16,.9]].map(([x,y,r],i)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"><animate attributeName="opacity" values=".3;1;.3" dur="${1.5+i*.3}s" repeatCount="indefinite"/></circle>`).join("")}
  <circle cx="50" cy="50" r="17" fill="url(#${u}pl)"/>
  <ellipse cx="50" cy="50" rx="27" ry="7" fill="none" stroke="${_A(45,85,62)}" stroke-width="2.2" transform="rotate(-18 50 50)" filter="url(#${u}g)"/>
  <line x1="50" y1="50" x2="50" y2="39" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>
  <line x1="50" y1="50" x2="58" y2="54" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>
  <circle cx="50" cy="50" r="2.2" fill="#fff"/>
  ${_AHL(43,42,5,3,-20)}`});
SKIN_ART["Дерев'яний годинник"] = u => ({ defs:_AR(u,36,40,66,"f")+_AD(u,28,45,34),
  body:`${_ASH(50,92,24)}
  <circle cx="50" cy="50" r="33" fill="url(#${u}l)"/>
  <circle cx="50" cy="50" r="26" fill="url(#${u}f)"/>
  <path d="M30,42 Q50,38 70,42 M28,52 Q50,48 72,52 M30,62 Q50,58 70,62" stroke="${_A(30,40,48)}" stroke-width="1.1" fill="none" opacity=".55"/>
  ${[0,3,6,9].map(i=>{const a=i*30*Math.PI/180;const x=50+Math.sin(a)*21,y=50-Math.cos(a)*21;return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.8" fill="${_A(28,45,28)}"/>`;}).join("")}
  <line x1="50" y1="50" x2="50" y2="35" stroke="${_A(28,50,22)}" stroke-width="2.8" stroke-linecap="round"/>
  <line x1="50" y1="50" x2="60" y2="57" stroke="${_A(28,50,22)}" stroke-width="2.2" stroke-linecap="round"/>
  <circle cx="50" cy="50" r="2.6" fill="${_A(28,50,22)}"/>
  <path d="M42,17 L50,10 L58,17" stroke="url(#${u}l)" stroke-width="4" fill="none" stroke-linecap="round"/>
  ${_AHL(40,37,8,4,-22)}`});
SKIN_ART["Таймер-блискавка"] = u => ({ defs:_AG(u)+_AD2(u,48,95,58,"bolt"),
  body:`<circle cx="50" cy="52" r="34" fill="${_A(230,40,14)}"/>
  <circle cx="50" cy="52" r="34" fill="none" stroke="${_A(48,90,55)}" stroke-width="2.4" filter="url(#${u}g)"/>
  <path d="M56,26 L40,54 L50,54 L44,78 L62,48 L52,48 Z" fill="url(#${u}bolt)" filter="url(#${u}g)"><animate attributeName="opacity" values="1;.55;1" dur="1.1s" repeatCount="indefinite"/></path>
  ${[0,2,4,6,8,10].map(i=>{const a=i*30*Math.PI/180;const x1=50+Math.sin(a)*29,y1=52-Math.cos(a)*29,x2=50+Math.sin(a)*32,y2=52-Math.cos(a)*32;return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${_A(48,80,55)}" stroke-width="1.8"/>`;}).join("")}
  <path d="M20,20 L26,26 M80,20 L74,26" stroke="${_A(48,90,60)}" stroke-width="2" stroke-linecap="round" opacity=".6"><animate attributeName="opacity" values=".6;.1;.6" dur="1.6s" repeatCount="indefinite"/></path>`});
// ── CIRCLE ФОНИ (Epic) — 8 ───────────────────────────────────
SKIN_ART["Зоряне небо"] = u => ({ defs:_AR(u,240,55,14,"sk")+_AG(u),
  body:`<rect x="8" y="10" width="84" height="78" rx="6" fill="url(#${u}sk)"/>
  ${[[20,24,1.5],[36,18,1],[52,28,1.3],[68,16,1.1],[82,30,1.4],[16,48,1],[30,42,1.2],[62,44,1],[78,52,1.2],[24,64,1.1],[46,58,1.4],[70,68,1],[86,74,1.2],[38,76,1]].map(([x,y,r],i)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"><animate attributeName="opacity" values=".25;1;.25" dur="${1.4+i*.25}s" repeatCount="indefinite"/></circle>`).join("")}
  <path d="M14,34 L20,30" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".8"><animate attributeName="opacity" values=".8;0;.8" dur="4s" repeatCount="indefinite"/></path>
  <g filter="url(#${u}g)"><path d="M56,60 l2,4.4 4.7,.7 -3.4,3.3 .8,4.7 -4.1,-2.2 -4.1,2.2 .8,-4.7 -3.4,-3.3 4.7,-.7 Z" fill="${_A(48,90,68)}"/></g>
  <path d="M28,20 Q44,10 60,18" stroke="${_A(240,40,45)}" stroke-width="1" fill="none" opacity=".4"/>`});
SKIN_ART["Океанські хвилі"] = u => ({ defs:_AD(u,200,70,45)+_AD2(u,195,75,35,"w2")+_AR(u,45,80,70,"sun"),
  body:`<rect x="8" y="10" width="84" height="78" rx="6" fill="${_A(198,60,68)}"/>
  <circle cx="76" cy="24" r="9" fill="url(#${u}sun)"/>
  <path d="M8,44 Q20,36 32,44 T56,44 T80,44 T104,44 L92,44 L92,60 L8,60 Z" fill="url(#${u}l)" opacity=".9"><animateTransform attributeName="transform" type="translate" values="0 0;-6 0;0 0" dur="3.4s" repeatCount="indefinite"/></path>
  <path d="M8,58 Q22,50 36,58 T64,58 T92,58 L92,74 L8,74 Z" fill="url(#${u}w2)" opacity=".92"><animateTransform attributeName="transform" type="translate" values="0 0;5 0;0 0" dur="4.2s" repeatCount="indefinite"/></path>
  <path d="M8,72 Q26,64 44,72 T80,72 T116,72 L92,72 L92,88 L8,88 Z" fill="${_A(210,70,26)}"/>
  ${[[26,40],[52,54],[74,68]].map(([x,y],i)=>`<path d="M${x},${y} q3,-2.4 6,0" stroke="#fff" stroke-width="1.4" fill="none" opacity=".8" stroke-linecap="round"><animate attributeName="opacity" values=".8;.2;.8" dur="${1.8+i*.4}s" repeatCount="indefinite"/></path>`).join("")}`});
SKIN_ART["Мегаполіс уночі"] = u => ({ defs:_AD(u,225,40,26)+_AG(u),
  body:`<rect x="8" y="10" width="84" height="78" rx="6" fill="${_A(230,45,9)}"/>
  <circle cx="80" cy="20" r="7" fill="#fdfbe8"/><circle cx="77.5" cy="18.5" r="5.4" fill="${_A(230,45,9)}"/>
  <rect x="12" y="40" width="15" height="48" fill="url(#${u}l)"/>
  <rect x="31" y="26" width="19" height="62" fill="${_A(226,36,20)}"/>
  <rect x="54" y="46" width="14" height="42" fill="url(#${u}l)"/>
  <rect x="72" y="34" width="16" height="54" fill="${_A(226,36,18)}"/>
  <path d="M31,26 L40,14 L50,26 Z" fill="${_A(226,36,20)}"/>
  <circle cx="40" cy="12" r="1.6" fill="${_A(0,90,58)}" filter="url(#${u}g)"><animate attributeName="opacity" values="1;.3;1" dur="1.3s" repeatCount="indefinite"/></circle>
  ${[[15,46],[21,46],[15,56],[21,66],[35,32],[43,32],[35,42],[43,52],[35,62],[57,52],[62,52],[57,62],[75,40],[81,40],[75,50],[81,62],[75,74]].map(([x,y])=>`<rect x="${x}" y="${y}" width="3.4" height="4.2" fill="${_A(48,90,66)}" opacity=".9"/>`).join("")}
  <rect x="8" y="84" width="84" height="4" fill="${_A(230,40,14)}"/>`});
SKIN_ART["Весняна галявина"] = u => ({ defs:_AD(u,110,55,45)+_AR(u,50,90,72,"sun"),
  body:`<rect x="8" y="10" width="84" height="78" rx="6" fill="${_A(195,65,74)}"/>
  <circle cx="22" cy="22" r="8" fill="url(#${u}sun)"/>
  <ellipse cx="60" cy="24" rx="13" ry="5" fill="#fff" opacity=".9"/><ellipse cx="70" cy="21" rx="9" ry="4" fill="#fff" opacity=".8"/>
  <path d="M8,58 Q30,48 52,56 T92,54 L92,88 L8,88 Z" fill="url(#${u}l)"/>
  ${[[24,66,0],[40,72,335],[58,64,48],[74,72,275],[86,64,10],[32,80,200]].map(([x,y,h])=>`<g transform="translate(${x} ${y})"><line x1="0" y1="0" x2="0" y2="7" stroke="${_A(110,50,32)}" stroke-width="1.4"/>${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-3" rx="2" ry="3.2" fill="${_A(h,80,70)}" transform="rotate(${a})"/>`).join("")}<circle cx="0" cy="0" r="1.8" fill="${_A(48,95,60)}"/></g>`).join("")}
  <path d="M46,38 q2,-3 4,0 q2,-3 4,0" stroke="${_A(230,30,40)}" stroke-width="1.3" fill="none" stroke-linecap="round"><animateTransform attributeName="transform" type="translate" values="0 0;6 -3;0 0" dur="4s" repeatCount="indefinite"/></path>`});
SKIN_ART["Абстрактні візерунки"] = u => ({ defs:`<linearGradient id="${u}a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${_A(315,75,55)}"/><stop offset="1" stop-color="${_A(255,70,50)}"/></linearGradient><linearGradient id="${u}b2" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${_A(190,85,55)}"/><stop offset="1" stop-color="${_A(150,70,50)}"/></linearGradient>`,
  body:`<rect x="8" y="10" width="84" height="78" rx="6" fill="${_A(250,40,14)}"/>
  <circle cx="32" cy="34" r="17" fill="url(#${u}a)" opacity=".9"/>
  <rect x="52" y="20" width="30" height="30" rx="7" fill="url(#${u}b2)" opacity=".85" transform="rotate(12 67 35)"/>
  <path d="M18,64 Q34,50 50,64 T82,64" stroke="url(#${u}a)" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M22,78 L34,66 L46,78 L58,66 L70,78 L82,66" stroke="url(#${u}b2)" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="72" cy="58" r="4.5" fill="${_A(48,95,60)}"/>
  <circle cx="26" cy="30" r="5" fill="#fff" opacity=".3"/>`});
SKIN_ART["Бібліотечні полиці"] = u => ({ defs:_AD(u,30,45,32),
  body:`<rect x="8" y="10" width="84" height="78" rx="6" fill="${_A(28,40,20)}"/>
  <rect x="12" y="14" width="76" height="5" rx="2" fill="url(#${u}l)"/>
  <rect x="12" y="46" width="76" height="5" rx="2" fill="url(#${u}l)"/>
  <rect x="12" y="78" width="76" height="5" rx="2" fill="url(#${u}l)"/>
  ${[[16,22,"0,60,45",7],[25,20,"200,55,42",8],[35,24,"140,45,38",6],[43,21,"45,75,50",7],[52,23,"275,45,48",8],[62,20,"355,65,42",7],[71,24,"190,60,40",6],[79,22,"30,70,45",7]].map(([x,y,c,w])=>`<rect x="${x}" y="${y}" width="${w}" height="${46-y}" rx="1.4" fill="hsl(${c}%)"/>`.replace(/hsl\(([\d]+),([\d]+),([\d]+)%\)/,'hsl($1,$2%,$3%)')).join("")}
  ${[[16,54,"215,50,40",8],[26,52,"45,70,48",6],[34,56,"355,55,45",7],[43,53,"140,50,42",8],[53,55,"275,50,45",6],[61,52,"25,65,48",8],[71,56,"195,55,42",7],[80,54,"310,40,45",6]].map(([x,y,c,w])=>`<rect x="${x}" y="${y}" width="${w}" height="${78-y}" rx="1.4" fill="hsl(${c}%)"/>`.replace(/hsl\(([\d]+),([\d]+),([\d]+)%\)/,'hsl($1,$2%,$3%)')).join("")}
  <rect x="35" y="24" width="6" height="22" fill="#fff" opacity=".12"/><rect x="61" y="52" width="8" height="26" fill="#fff" opacity=".1"/>`});
SKIN_ART["Осінній ліс"] = u => ({ defs:_AD(u,30,75,48)+_AD2(u,20,70,40,"tr")+_AR(u,25,80,55,"c1")+_AR(u,45,85,52,"c2"),
  body:`<rect x="8" y="10" width="84" height="78" rx="6" fill="${_A(38,55,70)}"/>
  <rect x="8" y="64" width="84" height="24" fill="${_A(30,50,36)}"/>
  <rect x="24" y="40" width="7" height="32" rx="3" fill="url(#${u}tr)"/>
  <circle cx="27" cy="34" r="15" fill="url(#${u}c1)"/>
  <rect x="56" y="46" width="6" height="26" rx="2.5" fill="url(#${u}tr)"/>
  <circle cx="59" cy="40" r="12" fill="url(#${u}c2)"/>
  <rect x="80" y="50" width="5" height="22" rx="2" fill="url(#${u}tr)"/>
  <circle cx="82" cy="45" r="9" fill="${_A(15,75,48)}"/>
  ${[[40,76,20],[50,82,300],[68,78,80],[16,80,220],[34,86,140]].map(([x,y,r])=>`<path d="M0,-3 Q3,0 0,3 Q-3,0 0,-3" fill="${_A(24,85,50)}" transform="translate(${x} ${y}) rotate(${r})"/>`).join("")}
  ${[[44,52],[74,42]].map(([x,y],i)=>`<path d="M${x},${y} Q${x+2},${y+6} ${x-1},${y+12}" stroke="${_A(24,80,52)}" stroke-width="1.6" fill="none" opacity=".8"><animateTransform attributeName="transform" type="translate" values="0 0;3 8;0 16" dur="${3+i}s" repeatCount="indefinite"/><animate attributeName="opacity" values=".8;.4;0" dur="${3+i}s" repeatCount="indefinite"/></path>`).join("")}`});
SKIN_ART["Пустеля на світанку"] = u => ({ defs:_AR(u,32,95,62,"sun")+`<linearGradient id="${u}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${_A(265,40,32)}"/><stop offset=".5" stop-color="${_A(15,65,45)}"/><stop offset="1" stop-color="${_A(35,85,58)}"/></linearGradient>`+_AD(u,36,65,48),
  body:`<rect x="8" y="10" width="84" height="78" rx="6" fill="url(#${u}sky)"/>
  <circle cx="50" cy="56" r="11" fill="url(#${u}sun)"/>
  <path d="M8,62 Q30,52 52,60 T92,58 L92,74 L8,74 Z" fill="url(#${u}l)"/>
  <path d="M8,72 Q34,64 60,70 T92,68 L92,88 L8,88 Z" fill="${_A(32,60,38)}"/>
  <path d="M22,68 L22,58 Q22,54 26,54 L26,64 M22,60 Q18,60 18,56" stroke="${_A(120,35,30)}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <path d="M74,64 L74,56 Q74,53 77,53 M74,58 Q71,58 71,55" stroke="${_A(120,35,30)}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <path d="M60,30 q3,-2 6,0 M32,24 q3,-2 6,0" stroke="${_A(20,40,60)}" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".7"/>`});

// ── CIRCLE ЛІТЕРИ (Legendary) — 8 ────────────────────────────
SKIN_ART["Кристалічні літери"] = u => ({ defs:`<linearGradient id="${u}cr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${_A(190,80,80)}"/><stop offset=".5" stop-color="${_A(200,75,58)}"/><stop offset="1" stop-color="${_A(215,70,42)}"/></linearGradient>`+_AG(u),
  body:`${_ASH(50,90,22)}
  <path d="M50,14 L74,82 L62,82 L57,66 L43,66 L38,82 L26,82 Z M50,36 L45,56 L55,56 Z" fill="url(#${u}cr)" filter="url(#${u}g)"/>
  <path d="M50,14 L58,36 L50,36 Z" fill="#fff" opacity=".35"/>
  <path d="M42,60 L38,78" stroke="#fff" stroke-width="1.4" opacity=".4"/>
  ${[[28,26],[74,32],[68,70]].map(([x,y],i)=>`<path d="M${x},${y} l1,2.2 2.3,.3 -1.7,1.6 .4,2.3 -2,-1.1 -2,1.1 .4,-2.3 -1.7,-1.6 2.3,-.3 Z" fill="#dff4ff"><animate attributeName="opacity" values=".3;1;.3" dur="${1.6+i*.4}s" repeatCount="indefinite"/></path>`).join("")}`});
SKIN_ART["Золоті руни"] = u => ({ defs:`<linearGradient id="${u}au" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${_A(46,95,72)}"/><stop offset=".5" stop-color="${_A(42,90,55)}"/><stop offset="1" stop-color="${_A(36,85,42)}"/></linearGradient>`+_AG(u),
  body:`${_ASH(50,90,22)}
  <path d="M50,12 L76,84 L62,84 L56,66 L44,66 L38,84 L24,84 Z M50,34 L45,56 L55,56 Z" fill="url(#${u}au)"/>
  <path d="M50,12 L60,38 L50,34 Z" fill="#fff" opacity=".4"/>
  <path d="M47,22 L53,22 M44,44 L40,48 M56,44 L60,48" stroke="${_A(36,80,32)}" stroke-width="1.6" stroke-linecap="round"/>
  <circle cx="50" cy="74" r="2.4" fill="${_A(46,95,70)}" filter="url(#${u}g)"><animate attributeName="opacity" values="1;.4;1" dur="1.8s" repeatCount="indefinite"/></circle>
  <path d="M20,20 L24,24 M80,20 L76,24 M22,68 L26,66" stroke="${_A(46,90,62)}" stroke-width="1.6" stroke-linecap="round" opacity=".7" filter="url(#${u}g)"/>`});
SKIN_ART["Неонові літери"] = u => ({ defs:_AG(u)+`<linearGradient id="${u}n" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${_A(315,95,62)}"/><stop offset="1" stop-color="${_A(190,95,58)}"/></linearGradient>`,
  body:`<rect x="10" y="12" width="80" height="76" rx="8" fill="${_A(280,45,8)}"/>
  <path d="M50,20 L72,80 L62,80 L57,66 L43,66 L38,80 L28,80 Z M50,38 L46,58 L54,58 Z" fill="none" stroke="url(#${u}n)" stroke-width="3.4" stroke-linejoin="round" filter="url(#${u}g)"><animate attributeName="opacity" values="1;.55;1" dur="2s" repeatCount="indefinite"/></path>
  <circle cx="22" cy="22" r="1.8" fill="${_A(315,95,62)}" filter="url(#${u}g)"><animate attributeName="opacity" values="1;.3;1" dur="1.4s" repeatCount="indefinite"/></circle>
  <circle cx="80" cy="76" r="1.8" fill="${_A(190,95,58)}" filter="url(#${u}g)"><animate attributeName="opacity" values=".3;1;.3" dur="1.4s" repeatCount="indefinite"/></circle>`});
SKIN_ART["Літери з мармуру"] = u => ({ defs:`<linearGradient id="${u}mb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${_A(210,10,92)}"/><stop offset=".5" stop-color="${_A(215,12,78)}"/><stop offset="1" stop-color="${_A(220,14,64)}"/></linearGradient>`,
  body:`${_ASH(50,92,24)}
  <rect x="28" y="82" width="44" height="8" rx="2" fill="${_A(218,12,58)}"/>
  <path d="M50,14 L74,82 L62,82 L57,66 L43,66 L38,82 L26,82 Z M50,36 L45,56 L55,56 Z" fill="url(#${u}mb)"/>
  <path d="M38,30 Q46,38 42,50 M58,44 Q62,54 58,64" stroke="${_A(220,15,55)}" stroke-width="1.1" fill="none" opacity=".6"/>
  <path d="M50,14 L58,36 L50,36 Z" fill="#fff" opacity=".5"/>
  <path d="M44,70 L40,80" stroke="#fff" stroke-width="1.2" opacity=".45"/>`});
SKIN_ART["Голографічні літери"] = u => ({ defs:`<linearGradient id="${u}ho" x1="0" y1="0" x2="1" y2=".8"><stop offset="0" stop-color="${_A(190,90,66)}"/><stop offset=".33" stop-color="${_A(255,80,68)}"/><stop offset=".66" stop-color="${_A(315,85,66)}"/><stop offset="1" stop-color="${_A(45,90,64)}"/></linearGradient>`+_AG(u),
  body:`<path d="M50,16 L73,82 L62,82 L57,66 L43,66 L38,82 L27,82 Z M50,37 L45,57 L55,57 Z" fill="url(#${u}ho)" opacity=".92" filter="url(#${u}g)"/>
  <path d="M50,16 L73,82 L62,82 L57,66 L43,66 L38,82 L27,82 Z" fill="none" stroke="#fff" stroke-width="1" opacity=".5"/>
  ${[26,40,54,68].map((y,i)=>`<line x1="18" y1="${y}" x2="82" y2="${y}" stroke="#fff" stroke-width=".8" opacity=".22"><animate attributeName="y1" values="${y};${y+4};${y}" dur="${2+i*.3}s" repeatCount="indefinite"/><animate attributeName="y2" values="${y};${y+4};${y}" dur="${2+i*.3}s" repeatCount="indefinite"/></line>`).join("")}
  <path d="M50,16 L58,38 L50,37 Z" fill="#fff" opacity=".45"/>`});
SKIN_ART["Літери-зірки"] = u => ({ defs:_AG(u)+_AD2(u,48,90,60,"st"),
  body:`<rect x="10" y="12" width="80" height="76" rx="8" fill="${_A(240,50,12)}"/>
  ${[[50,20],[46,32],[54,32],[42,44],[58,44],[40,56],[50,56],[60,56],[36,68],[64,68],[32,80],[44,80],[56,80],[68,80]].map(([x,y],i)=>`<path d="M${x},${y-3} l.9,1.9 2.1,.3 -1.5,1.5 .35,2.1 -1.85,-1 -1.85,1 .35,-2.1 -1.5,-1.5 2.1,-.3 Z" fill="url(#${u}st)" filter="url(#${u}g)"><animate attributeName="opacity" values=".5;1;.5" dur="${1.4+(i%5)*.3}s" repeatCount="indefinite"/></path>`).join("")}
  <path d="M50,20 L64,68 M50,20 L36,68 M42,44 L58,44" stroke="${_A(48,70,50)}" stroke-width=".9" opacity=".35"/>`});
SKIN_ART["Вогняні літери"] = u => ({ defs:`<linearGradient id="${u}fi" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${_A(15,95,48)}"/><stop offset=".55" stop-color="${_A(32,95,55)}"/><stop offset="1" stop-color="${_A(48,95,62)}"/></linearGradient>`+_AG(u),
  body:`<path d="M50,18 L73,84 L62,84 L57,68 L43,68 L38,84 L27,84 Z M50,39 L45,59 L55,59 Z" fill="url(#${u}fi)" filter="url(#${u}g)"/>
  <path d="M42,26 Q38,18 44,12 Q44,18 48,20 Q46,14 52,8 Q52,16 56,20 Q58,14 62,12 Q60,20 58,26 Z" fill="url(#${u}fi)" filter="url(#${u}g)"><animateTransform attributeName="transform" type="scale" values="1 1;1 1.12;1 1" dur="0.9s" repeatCount="indefinite" additive="sum"/></path>
  ${[[34,58],[68,50],[30,74]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="1.6" fill="${_A(35,95,60)}" filter="url(#${u}g)"><animate attributeName="cy" values="${y};${y-10}" dur="${1.4+i*.3}s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="${1.4+i*.3}s" repeatCount="indefinite"/></circle>`).join("")}
  <path d="M50,18 L57,39 L50,39 Z" fill="#fff" opacity=".3"/>`});
SKIN_ART["Крижані літери"] = u => ({ defs:`<linearGradient id="${u}ic" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${_A(195,60,88)}"/><stop offset=".5" stop-color="${_A(200,70,70)}"/><stop offset="1" stop-color="${_A(210,75,52)}"/></linearGradient>`+_AG(u),
  body:`${_ASH(50,92,23)}
  <path d="M50,14 L74,82 L62,82 L57,66 L43,66 L38,82 L26,82 Z M50,36 L45,56 L55,56 Z" fill="url(#${u}ic)" opacity=".94"/>
  <path d="M62,82 L64,90 L60,86 Z M38,82 L36,92 L40,86 Z M74,82 L74,88 L70,84 Z" fill="url(#${u}ic)"/>
  <path d="M50,14 L58,36 L50,36 Z" fill="#fff" opacity=".55"/>
  <path d="M42,60 L38,76 M55,48 L58,58" stroke="#fff" stroke-width="1.2" opacity=".5"/>
  ${[[30,28],[72,40],[64,72]].map(([x,y],i)=>`<g transform="translate(${x} ${y})"><path d="M0,-2.6 L0,2.6 M-2.3,-1.3 L2.3,1.3 M-2.3,1.3 L2.3,-1.3" stroke="#e8f8ff" stroke-width="1" stroke-linecap="round"/><animate attributeName="opacity" values=".4;1;.4" dur="${1.8+i*.4}s" repeatCount="indefinite"/></g>`).join("")}`});
// ── WORDLE ФОНИ (Epic) — 8 ───────────────────────────────────
SKIN_ART["Нічне місто"] = u => ({ defs:_AD(u,225,45,30),
  body:`<rect x="8" y="10" width="84" height="78" rx="6" fill="${_A(228,50,10)}"/>
  <circle cx="76" cy="22" r="8" fill="#fdfbe8"/><circle cx="73" cy="20" r="6" fill="${_A(228,50,10)}"/>
  <rect x="14" y="44" width="14" height="44" fill="url(#${u}l)"/>
  <rect x="32" y="30" width="17" height="58" fill="${_A(225,40,22)}"/>
  <rect x="53" y="50" width="13" height="38" fill="url(#${u}l)"/>
  <rect x="70" y="38" width="16" height="50" fill="${_A(225,40,20)}"/>
  ${[[17,48],[23,48],[17,58],[23,58],[36,36],[43,36],[36,46],[43,46],[36,56],[56,56],[61,56],[74,44],[80,44],[74,54],[80,64]].map(([x,y])=>`<rect x="${x}" y="${y}" width="3.4" height="4.2" fill="${_A(45,90,68)}" opacity=".9"/>`).join("")}
  <circle cx="20" cy="18" r="1.1" fill="#fff" opacity=".8"/><circle cx="46" cy="14" r="1" fill="#fff" opacity=".7"/><circle cx="60" cy="20" r="1.2" fill="#fff" opacity=".75"/>`});
SKIN_ART["Космос і зорі"] = u => ({ defs:`
  <radialGradient id="${u}nb" cx="35%" cy="35%" r="80%"><stop offset="0" stop-color="${_A(280,60,30)}"/><stop offset="55%" stop-color="${_A(255,55,18)}"/><stop offset="1" stop-color="${_A(240,50,8)}"/></radialGradient>
  <radialGradient id="${u}pl" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="${_A(180,70,68)}"/><stop offset="1" stop-color="${_A(210,70,32)}"/></radialGradient>
  <radialGradient id="${u}sp" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`,
  body:`<rect x="8" y="10" width="84" height="78" rx="6" fill="url(#${u}nb)"/>
  <circle cx="64" cy="40" r="15" fill="url(#${u}pl)"/>
  <ellipse cx="64" cy="40" rx="23" ry="6.5" fill="none" stroke="${_A(45,80,65)}" stroke-width="2.4" transform="rotate(-16 64 40)"/>
  <path d="M20,66 Q34,58 46,68" stroke="${_A(280,60,55)}" stroke-width="1.6" fill="none" opacity=".5"/>
  ${[[18,20,1.5],[32,30,1.1],[84,18,1.3],[26,76,1.2],[80,72,1.5],[46,22,1],[14,48,1.2]].map(([x,y,r],i)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"><animate attributeName="opacity" values=".3;1;.3" dur="${1.6+i*.4}s" repeatCount="indefinite"/></circle>`).join("")}
  <path d="M76,60 L79,63 L83,59" stroke="#fff" stroke-width="1.4" fill="none" opacity=".8"/>
  <ellipse cx="58" cy="33" rx="6" ry="4" fill="url(#${u}sp)" opacity=".7"/>`});
SKIN_ART["Осінній парк"] = u => ({ defs:_AD(u,30,75,48)+_AD2(u,18,70,40,"tr"),
  body:`<rect x="8" y="10" width="84" height="78" rx="6" fill="${_A(38,55,72)}"/>
  <rect x="8" y="66" width="84" height="22" rx="4" fill="${_A(32,50,38)}"/>
  <rect x="28" y="42" width="7" height="30" rx="3" fill="url(#${u}tr)"/>
  <circle cx="31" cy="36" r="16" fill="url(#${u}l)"/>
  <circle cx="24" cy="42" r="9" fill="${_A(18,80,50)}"/>
  <rect x="64" y="48" width="6" height="24" rx="2.5" fill="url(#${u}tr)"/>
  <circle cx="67" cy="42" r="13" fill="${_A(45,85,55)}"/>
  ${[[44,74,15],[54,80,30],[20,80,-20],[80,78,10]].map(([x,y,r])=>`<path d="M0,-3 Q3,0 0,3 Q-3,0 0,-3" fill="${_A(22,85,52)}" transform="translate(${x} ${y}) rotate(${r})"/>`).join("")}
  <ellipse cx="26" cy="30" rx="6" ry="4" fill="url(#${u}sp)" opacity=".6"/>`});
SKIN_ART["Підводний світ"] = u => ({ defs:_AD(u,195,70,40)+_AD2(u,25,80,55,"fish"),
  body:`<rect x="8" y="10" width="84" height="78" rx="6" fill="url(#${u}l)"/>
  <path d="M8,80 Q26,72 44,80 T92,78 L92,88 L8,88 Z" fill="${_A(45,50,55)}"/>
  <path d="M22,80 Q20,64 26,54 Q30,64 26,80 Z" fill="${_A(140,60,35)}"/>
  <path d="M78,80 Q76,66 82,58 Q86,68 82,80 Z" fill="${_A(140,60,32)}"/>
  <ellipse cx="50" cy="42" rx="12" ry="7" fill="url(#${u}fish)"/>
  <path d="M60,42 L70,36 L70,48 Z" fill="url(#${u}fish)"/>
  <circle cx="44" cy="40" r="1.8" fill="#062a33"/>
  ${[[30,30,2.4],[34,22,1.8],[64,26,2],[68,18,1.5]].map(([x,y,r],i)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity=".5"><animate attributeName="cy" values="${y};${y-8};${y}" dur="${3+i}s" repeatCount="indefinite"/></circle>`).join("")}
  <ellipse cx="46" cy="38" rx="4" ry="2.4" fill="url(#${u}sp)" opacity=".7"/>`});
SKIN_ART["Гірський краєвид"] = u => ({ defs:_AD(u,215,45,45),
  body:`<rect x="8" y="10" width="84" height="78" rx="6" fill="${_A(210,50,70)}"/>
  <circle cx="24" cy="24" r="8" fill="${_A(48,95,72)}"/>
  <path d="M8,74 L34,32 L54,74 Z" fill="url(#${u}l)"/>
  <path d="M34,32 L42,46 L38,46 L44,56 L30,56 L36,46 L31,46 Z" fill="#fff" opacity=".92"/>
  <path d="M40,74 L68,26 L92,74 Z" fill="${_A(218,45,32)}"/>
  <path d="M68,26 L78,44 L72,44 L79,56 L60,56 L67,44 L61,44 Z" fill="#fff" opacity=".95"/>
  <rect x="8" y="74" width="84" height="14" rx="4" fill="${_A(140,40,30)}"/>
  <ellipse cx="20" cy="20" rx="4" ry="2.6" fill="#fff" opacity=".8"/>`});
SKIN_ART["Неонове кіберполе"] = u => ({ defs:`
  <linearGradient id="${u}gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${_A(280,80,20)}"/><stop offset="1" stop-color="${_A(320,80,10)}"/></linearGradient>
  <filter id="${u}g"><feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <radialGradient id="${u}sp" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`,
  body:`<rect x="8" y="10" width="84" height="78" rx="6" fill="url(#${u}gr)"/>
  <circle cx="50" cy="38" r="13" fill="${_A(320,90,55)}" opacity=".85" filter="url(#${u}g)"/>
  ${[0,1,2,3,4].map(i=>`<line x1="8" y1="${52+i*8}" x2="92" y2="${52+i*8}" stroke="${_A(185,90,55)}" stroke-width="1.4" opacity="${.9-i*.12}" filter="url(#${u}g)"/>`).join("")}
  ${[-3,-2,-1,0,1,2,3].map(i=>`<line x1="${50+i*11}" y1="52" x2="${50+i*22}" y2="88" stroke="${_A(185,90,55)}" stroke-width="1.4" opacity=".7" filter="url(#${u}g)"/>`).join("")}
  <ellipse cx="45" cy="33" rx="5" ry="3" fill="url(#${u}sp)" opacity=".8"/>`});
SKIN_ART["Бібліотека знань"] = u => ({ defs:_AD(u,28,45,35)+_AD2(u,28,40,55,"sh"),
  body:`<rect x="8" y="10" width="84" height="78" rx="6" fill="url(#${u}l)"/>
  <rect x="14" y="18" width="72" height="6" rx="2" fill="url(#${u}sh)"/>
  <rect x="14" y="46" width="72" height="6" rx="2" fill="url(#${u}sh)"/>
  <rect x="14" y="74" width="72" height="6" rx="2" fill="url(#${u}sh)"/>
  ${[[17,26,0],[24,26,340],[31,26,0],[38,26,0],[46,26,8],[54,26,0],[62,26,0],[70,26,352],[78,26,0]].map(([x,y,r],i)=>`<rect x="${x}" y="${y}" width="5.5" height="19" rx="1" fill="${_A([0,120,210,45,275,15,190,330,90][i%9],55,45)}" transform="rotate(${r>180?r-360:r} ${x+2.7} ${y+9.5})"/>`).join("")}
  ${[[17,54],[25,54],[33,54],[41,54],[49,54],[57,54],[65,54],[73,54]].map(([x,y],i)=>`<rect x="${x}" y="${y}" width="6" height="19" rx="1" fill="${_A([200,30,90,260,10,150,320,50][i%8],50,42)}"/>`).join("")}
  <ellipse cx="24" cy="16" rx="6" ry="2.6" fill="#fff" opacity=".25"/>`});
SKIN_ART["Весняний сад áClub"] = u => ({ defs:_AD(u,130,60,45),
  body:`<rect x="8" y="10" width="84" height="78" rx="6" fill="${_A(150,45,78)}"/>
  <rect x="8" y="64" width="84" height="24" rx="4" fill="url(#${u}l)"/>
  <circle cx="26" cy="26" r="8" fill="${_A(48,95,70)}"/>
  ${[[24,58],[42,64],[62,60],[80,64],[34,74],[54,76],[72,78]].map(([x,y],i)=>`
  <g transform="translate(${x} ${y})">${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-3.4" rx="2.2" ry="3.4" fill="${_A([330,50,0,280,200][i%5],80,72)}" transform="rotate(${a})"/>`).join("")}<circle r="2" fill="${_A(48,95,60)}"/></g>`).join("")}
  <path d="M56,26 Q60,22 64,26 Q68,22 72,26 Q70,34 64,36 Q58,34 56,26 Z" fill="${_A(330,70,75)}" opacity=".9"/>
  <text x="64" y="49" font-size="11" font-weight="800" fill="${_A(150,60,30)}" text-anchor="middle" font-family="Arial">á</text>`});
// ── WORDLE КЛАВІАТУРИ (Legendary) — 8 ────────────────────────
function _kbBase(u, keysFill, boardFill, extra){
  return `<ellipse cx="50" cy="90" rx="34" ry="4" fill="#000" opacity=".3"/>
  <rect x="10" y="32" width="80" height="42" rx="7" fill="${boardFill}"/>
  ${[0,1,2,3,4].map(i=>`<rect x="${15+i*15}" y="38" width="12" height="10" rx="2.4" fill="${keysFill}"/>`).join("")}
  ${[0,1,2,3,4].map(i=>`<rect x="${15+i*15}" y="52" width="12" height="10" rx="2.4" fill="${keysFill}"/>`).join("")}
  <rect x="26" y="66" width="48" height="6" rx="3" fill="${keysFill}"/>
  ${extra||""}`;
}
SKIN_ART["Золота клавіатура"] = u => ({ defs:_AD(u,45,90,55)+_AD2(u,42,70,32,"d"),
  body:_kbBase(u, `url(#${u}l)`, `url(#${u}d)`,
  `<ellipse cx="26" cy="40" rx="8" ry="3" fill="#fff" opacity=".55"/>
  <circle cx="86" cy="30" r="2" fill="#fff" opacity=".9"><animate attributeName="opacity" values=".3;1;.3" dur="1.6s" repeatCount="indefinite"/></circle>
  <circle cx="14" cy="76" r="1.6" fill="#fff" opacity=".8"><animate attributeName="opacity" values=".2;.9;.2" dur="2s" repeatCount="indefinite"/></circle>`)});
SKIN_ART["Кристалічна клавіатура"] = u => ({ defs:`
  <linearGradient id="${u}cr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${_A(190,80,80)}" stop-opacity=".95"/><stop offset="1" stop-color="${_A(220,70,55)}" stop-opacity=".8"/></linearGradient>
  <linearGradient id="${u}bd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${_A(210,50,30)}"/><stop offset="1" stop-color="${_A(220,55,16)}"/></linearGradient>`,
  body:_kbBase(u, `url(#${u}cr)`, `url(#${u}bd)`,
  `<path d="M18,40 L24,46 M33,40 L39,46 M48,40 L54,46" stroke="#fff" stroke-width="1.2" opacity=".65"/>
  <path d="M12,28 L16,24 L20,28 L16,32 Z" fill="url(#${u}cr)"/>
  <path d="M84,78 L88,74 L92,78 L88,82 Z" fill="url(#${u}cr)"/>`)});
SKIN_ART["Клавіатура-хамелеон"] = u => ({ defs:`
  <linearGradient id="${u}rb" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="${_A(0,85,60)}"><animate attributeName="stop-color" values="${_A(0,85,60)};${_A(120,85,55)};${_A(240,85,60)};${_A(0,85,60)}" dur="6s" repeatCount="indefinite"/></stop>
    <stop offset="1" stop-color="${_A(240,85,60)}"><animate attributeName="stop-color" values="${_A(240,85,60)};${_A(0,85,60)};${_A(120,85,55)};${_A(240,85,60)}" dur="6s" repeatCount="indefinite"/></stop>
  </linearGradient>
  <linearGradient id="${u}bd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${_A(0,0,22)}"/><stop offset="1" stop-color="${_A(0,0,10)}"/></linearGradient>`,
  body:_kbBase(u, `url(#${u}rb)`, `url(#${u}bd)`,
  `<ellipse cx="30" cy="40" rx="10" ry="3" fill="#fff" opacity=".4"/>`)});
SKIN_ART["Ретро-друкарська машинка"] = u => ({ defs:_AD(u,20,30,30)+_AD2(u,35,25,55,"key"),
  body:`<ellipse cx="50" cy="92" rx="34" ry="4" fill="#000" opacity=".3"/>
  <rect x="14" y="40" width="72" height="36" rx="8" fill="url(#${u}l)"/>
  <rect x="22" y="24" width="56" height="20" rx="4" fill="${_A(20,30,20)}"/>
  <rect x="26" y="16" width="48" height="10" rx="2" fill="#f2ede0"/>
  <path d="M30,20 L64,20" stroke="#b9b09a" stroke-width="1.4"/>
  ${[0,1,2,3,4].map(i=>`<circle cx="${23+i*13.5}" cy="52" r="4.6" fill="url(#${u}key)"/><circle cx="${23+i*13.5}" cy="51" r="3" fill="${_A(35,20,72)}"/>`).join("")}
  ${[0,1,2,3].map(i=>`<circle cx="${30+i*13.5}" cy="64" r="4.6" fill="url(#${u}key)"/><circle cx="${30+i*13.5}" cy="63" r="3" fill="${_A(35,20,72)}"/>`).join("")}
  <rect x="16" y="34" width="68" height="4" rx="2" fill="${_A(20,35,14)}"/>
  <ellipse cx="26" cy="44" rx="7" ry="2.6" fill="#fff" opacity=".3"/>`});
SKIN_ART["Голографічна клавіатура"] = u => ({ defs:`
  <linearGradient id="${u}ho" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${_A(185,90,65)}" stop-opacity=".85"/><stop offset="1" stop-color="${_A(280,85,70)}" stop-opacity=".75"/></linearGradient>
  <filter id="${u}g"><feGaussianBlur stdDeviation="1.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`,
  body:`<ellipse cx="50" cy="88" rx="36" ry="5" fill="${_A(185,80,45)}" opacity=".25"/>
  <path d="M20,74 L80,74 L88,84 L12,84 Z" fill="${_A(210,40,20)}"/>
  <g opacity=".92">
  ${[0,1,2,3,4].map(i=>`<rect x="${17+i*14}" y="36" width="11" height="9" rx="2" fill="none" stroke="url(#${u}ho)" stroke-width="1.6" filter="url(#${u}g)"/>`).join("")}
  ${[0,1,2,3,4].map(i=>`<rect x="${17+i*14}" y="49" width="11" height="9" rx="2" fill="none" stroke="url(#${u}ho)" stroke-width="1.6" filter="url(#${u}g)"/>`).join("")}
  <rect x="28" y="62" width="44" height="6" rx="3" fill="none" stroke="url(#${u}ho)" stroke-width="1.6" filter="url(#${u}g)"/>
  </g>
  <path d="M30,74 L38,44 M70,74 L62,44" stroke="url(#${u}ho)" stroke-width="1" opacity=".45"/>
  <circle cx="86" cy="28" r="1.8" fill="${_A(185,90,70)}"><animate attributeName="opacity" values=".3;1;.3" dur="2s" repeatCount="indefinite"/></circle>`});
SKIN_ART["Клавіатура з рунами"] = u => ({ defs:_AD(u,215,25,28)+_AD2(u,190,80,55,"ru"),
  body:_kbBase(u, `${_A(215,25,18)}`, `url(#${u}l)`,
  `${[["M-2,-2 L2,2 M2,-2 L-2,2",21,43],["M0,-3 L0,3 M-2,-1 L2,-1",36,43],["M-2,3 L0,-3 L2,3",51,43],["M-2,-3 L2,-3 L-2,3 L2,3",66,43],["M0,-3 L-2,0 L0,3 L2,0 Z",81,43],["M-2,-2 L2,2 M-2,2 L0,0",21,57],["M0,-3 L0,3 M0,0 L3,-2",36,57],["M-2,0 L2,0 M0,-3 L0,3",51,57],["M-3,0 L3,0 M-1,-2 L1,2",66,57],["M-2,-2 Q2,0 -2,2",81,57]].map(([d,x,y])=>`<path d="${d}" stroke="url(#${u}ru)" stroke-width="1.5" fill="none" stroke-linecap="round" transform="translate(${x} ${y})"/>`).join("")}
  <circle cx="14" cy="28" r="1.6" fill="${_A(190,85,62)}"><animate attributeName="opacity" values=".3;1;.3" dur="2.4s" repeatCount="indefinite"/></circle>`)});
SKIN_ART["Клавіатура зі смарагдів"] = u => ({ defs:`
  <linearGradient id="${u}em" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${_A(150,80,58)}"/><stop offset="1" stop-color="${_A(160,85,32)}"/></linearGradient>
  <linearGradient id="${u}bd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${_A(48,60,42)}"/><stop offset="1" stop-color="${_A(42,65,26)}"/></linearGradient>`,
  body:_kbBase(u, `url(#${u}em)`, `url(#${u}bd)`,
  `<path d="M17,40 L20,38 L25,38 M32,40 L35,38 L40,38" stroke="#fff" stroke-width="1.1" opacity=".7" fill="none"/>
  <path d="M12,26 L16,22 L20,26 L16,30 Z" fill="url(#${u}em)"/>
  <ellipse cx="24" cy="70" rx="6" ry="2" fill="#fff" opacity=".3"/>`)});
SKIN_ART["Неонова клавіатура"] = u => ({ defs:`
  <linearGradient id="${u}nk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${_A(320,95,60)}"/><stop offset="1" stop-color="${_A(185,95,55)}"/></linearGradient>
  <filter id="${u}g"><feGaussianBlur stdDeviation="1.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`,
  body:`<ellipse cx="50" cy="90" rx="34" ry="4" fill="${_A(320,80,30)}" opacity=".3"/>
  <rect x="10" y="32" width="80" height="42" rx="7" fill="${_A(280,40,8)}"/>
  <rect x="10" y="32" width="80" height="42" rx="7" fill="none" stroke="url(#${u}nk)" stroke-width="2" filter="url(#${u}g)"/>
  ${[0,1,2,3,4].map(i=>`<rect x="${15+i*15}" y="38" width="12" height="10" rx="2.4" fill="none" stroke="${_A(i%2?185:320,95,60)}" stroke-width="1.6" filter="url(#${u}g)"/>`).join("")}
  ${[0,1,2,3,4].map(i=>`<rect x="${15+i*15}" y="52" width="12" height="10" rx="2.4" fill="none" stroke="${_A(i%2?320:185,95,60)}" stroke-width="1.6" filter="url(#${u}g)"/>`).join("")}
  <rect x="26" y="66" width="48" height="6" rx="3" fill="none" stroke="url(#${u}nk)" stroke-width="1.6" filter="url(#${u}g)"/>`});
// ── CIRCLE КОЛЕСА (Rare) — 8 ─────────────────────────────────
SKIN_ART["Дерев'яне колесо"] = u => ({ defs:_AD(u,28,50,40)+_AD2(u,32,45,58,"lt"),
  body:`<ellipse cx="50" cy="92" rx="26" ry="4" fill="#000" opacity=".3"/>
  <circle cx="50" cy="50" r="33" fill="none" stroke="url(#${u}l)" stroke-width="9"/>
  <circle cx="50" cy="50" r="33" fill="none" stroke="${_A(28,50,22)}" stroke-width="1.4" opacity=".6"/>
  ${[0,45,90,135].map(a=>`<line x1="50" y1="50" x2="${50+29*Math.cos(a*Math.PI/180)}" y2="${50+29*Math.sin(a*Math.PI/180)}" stroke="url(#${u}lt)" stroke-width="4.5"/><line x1="50" y1="50" x2="${50-29*Math.cos(a*Math.PI/180)}" y2="${50-29*Math.sin(a*Math.PI/180)}" stroke="url(#${u}lt)" stroke-width="4.5"/>`).join("")}
  <circle cx="50" cy="50" r="8" fill="url(#${u}r)"/>
  <circle cx="50" cy="50" r="3" fill="${_A(28,50,25)}"/>
  <ellipse cx="38" cy="28" rx="6" ry="3.5" fill="url(#${u}sp)" opacity=".6"/>`});
SKIN_ART["Неонове кільце"] = u => ({ defs:`
  <linearGradient id="${u}n" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${_A(320,95,62)}"/><stop offset="1" stop-color="${_A(185,95,55)}"/></linearGradient>
  <filter id="${u}g"><feGaussianBlur stdDeviation="2.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`,
  body:`<circle cx="50" cy="50" r="31" fill="none" stroke="url(#${u}n)" stroke-width="6" filter="url(#${u}g)"/>
  <circle cx="50" cy="50" r="22" fill="none" stroke="url(#${u}n)" stroke-width="1.6" opacity=".55" filter="url(#${u}g)"/>
  <circle cx="50" cy="19" r="4" fill="${_A(320,95,66)}" filter="url(#${u}g)">
    <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="4s" repeatCount="indefinite"/></circle>`});
SKIN_ART["Кільце із шестерень"] = u => ({ defs:_AD(u,210,20,50)+_AD2(u,42,60,45,"br"),
  body:`<ellipse cx="50" cy="92" rx="26" ry="4" fill="#000" opacity=".3"/>
  <g><animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="14s" repeatCount="indefinite"/>
  ${[0,30,60,90,120,150,180,210,240,270,300,330].map(a=>`<rect x="47" y="14" width="6" height="9" rx="1.5" fill="url(#${u}l)" transform="rotate(${a} 50 50)"/>`).join("")}
  <circle cx="50" cy="50" r="28" fill="none" stroke="url(#${u}l)" stroke-width="9"/></g>
  <g><animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="9s" repeatCount="indefinite"/>
  ${[0,60,120,180,240,300].map(a=>`<rect x="47.5" y="34" width="5" height="6" rx="1.2" fill="url(#${u}br)" transform="rotate(${a} 50 50)"/>`).join("")}
  <circle cx="50" cy="50" r="13" fill="none" stroke="url(#${u}br)" stroke-width="6"/></g>
  <circle cx="50" cy="50" r="4" fill="url(#${u}r)"/>
  <ellipse cx="36" cy="28" rx="6" ry="3.5" fill="url(#${u}sp)" opacity=".5"/>`});
SKIN_ART["Квітковий вінок"] = u => ({ defs:_AD(u,130,55,42),
  body:`<circle cx="50" cy="50" r="30" fill="none" stroke="url(#${u}l)" stroke-width="7"/>
  ${[0,45,90,135,180,225,270,315].map((a,i)=>`
  <g transform="translate(${50+30*Math.cos(a*Math.PI/180)} ${50+30*Math.sin(a*Math.PI/180)})">
    ${[0,72,144,216,288].map(p=>`<ellipse cx="0" cy="-3.6" rx="2.4" ry="3.6" fill="${_A([330,50,0,280,200,25,160,300][i],80,72)}" transform="rotate(${p})"/>`).join("")}
    <circle r="2.2" fill="${_A(48,95,60)}"/>
  </g>`).join("")}
  ${[22,67,112,157,202,247,292,337].map(a=>`<ellipse cx="${50+30*Math.cos(a*Math.PI/180)}" cy="${50+30*Math.sin(a*Math.PI/180)}" rx="3.4" ry="2" fill="${_A(140,55,38)}" transform="rotate(${a+90} ${50+30*Math.cos(a*Math.PI/180)} ${50+30*Math.sin(a*Math.PI/180)})"/>`).join("")}`});
SKIN_ART["Металевий обід"] = u => ({ defs:`
  <linearGradient id="${u}mt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${_A(210,10,85)}"/><stop offset="45%" stop-color="${_A(210,8,55)}"/><stop offset="55%" stop-color="${_A(210,10,78)}"/><stop offset="1" stop-color="${_A(210,10,38)}"/></linearGradient>
  <radialGradient id="${u}sp" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`,
  body:`<ellipse cx="50" cy="92" rx="26" ry="4" fill="#000" opacity=".3"/>
  <circle cx="50" cy="50" r="31" fill="none" stroke="url(#${u}mt)" stroke-width="10"/>
  <circle cx="50" cy="50" r="25.6" fill="none" stroke="${_A(210,12,30)}" stroke-width="1.2"/>
  <circle cx="50" cy="50" r="36.4" fill="none" stroke="${_A(210,12,30)}" stroke-width="1.2"/>
  ${[0,60,120,180,240,300].map(a=>`<circle cx="${50+31*Math.cos(a*Math.PI/180)}" cy="${50+31*Math.sin(a*Math.PI/180)}" r="2.4" fill="${_A(210,12,32)}"/>`).join("")}
  <ellipse cx="34" cy="26" rx="9" ry="4.5" fill="url(#${u}sp)" opacity=".8"/>`});
SKIN_ART["Кільце-веселка"] = u => ({ defs:``,
  body:`${[["#ff1744",34],["#ff9100",30.4],["#ffea00",26.8],["#00e676",23.2],["#2979ff",19.6],["#8e24aa",16]].map(([c,r])=>`<circle cx="50" cy="50" r="${r}" fill="none" stroke="${c}" stroke-width="3.6" opacity=".95"/>`).join("")}
  <circle cx="36" cy="30" r="6" fill="#fff" opacity=".35"/>
  <circle cx="50" cy="16" r="2.4" fill="#fff" opacity=".9"><animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="6s" repeatCount="indefinite"/></circle>`});
SKIN_ART["Кришталеве кільце"] = u => ({ defs:`
  <linearGradient id="${u}cr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${_A(195,70,85)}" stop-opacity=".95"/><stop offset="1" stop-color="${_A(230,60,60)}" stop-opacity=".8"/></linearGradient>
  <radialGradient id="${u}sp" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`,
  body:`${[0,45,90,135,180,225,270,315].map(a=>`<path d="M50,16 L56,26 L50,36 L44,26 Z" fill="url(#${u}cr)" stroke="#fff" stroke-width=".8" stroke-opacity=".6" transform="rotate(${a} 50 50)"/>`).join("")}
  <circle cx="50" cy="50" r="17" fill="none" stroke="url(#${u}cr)" stroke-width="3"/>
  ${[[30,24],[74,32],[26,70]].map(([x,y],i)=>`<path d="M${x-3},${y} L${x},${y-3} L${x+3},${y} L${x},${y+3} Z" fill="#fff" opacity=".8"><animate attributeName="opacity" values=".3;1;.3" dur="${1.8+i*.5}s" repeatCount="indefinite"/></path>`).join("")}
  <ellipse cx="42" cy="26" rx="5" ry="3" fill="url(#${u}sp)"/>`});
SKIN_ART["Кільце з піску"] = u => ({ defs:_AD(u,38,60,55)+_AD2(u,38,50,38,"d"),
  body:`<ellipse cx="50" cy="92" rx="26" ry="4" fill="#000" opacity=".25"/>
  <circle cx="50" cy="50" r="30" fill="none" stroke="url(#${u}l)" stroke-width="9" stroke-dasharray="10 4"/>
  <circle cx="50" cy="50" r="30" fill="none" stroke="url(#${u}d)" stroke-width="3" stroke-dasharray="3 8" opacity=".7"/>
  ${[[24,28,1.6],[76,30,1.3],[80,66,1.5],[22,68,1.2],[50,14,1.4],[52,86,1.3]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${_A(38,55,62)}" opacity=".8"/>`).join("")}
  <path d="M34,44 Q42,40 50,44 T66,44" stroke="${_A(38,50,45)}" stroke-width="1.6" fill="none" opacity=".5"/>
  <ellipse cx="38" cy="28" rx="6" ry="3" fill="url(#${u}sp)" opacity=".5"/>`});
// ── WORDLE ФОНИ (Epic) — 8 ───────────────────────────────────
