// ============================================================
// weather-presets.js — ОКРЕМИЙ файл з пресетами локацій для скінів
// погоди Runner (runner_legendary_weather). Винесено з основного
// 1.1_runner.txt, щоб не захаращувати головний код гри — тут лише
// візуальні дані (кольори неба/землі, наявність дощу/туману/зірок).
//
// Підключається в 1.1_runner.txt через:
//   <script src="weather-presets.js"></script>
// (файл має лежати в тій самій папці на GitHub Pages, що й index.html
// Runner — тобто в папці runner/, поряд з runner/index.html)
//
// Щоб додати новий пресет погоди — додайте новий ключ в об'єкт нижче
// і відповідний запис у WEATHER_SKIN_PRESETS у runner-skins.js (app/).
// ============================================================

// Пресети локацій для екіпірованих скінів погоди (runner_legendary_weather).
// Раніше такого зв'язку не існувало — погода завжди циклічно перемикалась
// між 4 стандартними пресетами вище залежно від score, незалежно від того,
// який скін погоди екіпірований.
const WEATHER_PRESETS = {
  storm:       { name:'⛈ Грозова злива',    sky:['#0a0d10','#141a1f','#1c2831'], ground:['#080f08','#040a04'], line:'#4fc3f7', bld1:'#06090c', bld2:'#0c161c', stars:false, rain:true,  fog:false },
  snow:        { name:'❄️ Снігова буря',     sky:['#1a222c','#2a3a4a','#3d5266'], ground:['#1a2228','#0d1418'], line:'#e1f5fe', bld1:'#141c24', bld2:'#22323f', stars:false, rain:true,  fog:true  },
  office_fog:  { name:'🌫 Туман над офісом', sky:['#22242e','#31333f','#3f414f'], ground:['#181a20','#0c0d10'], line:'#b0bec5', bld1:'#1c1e26', bld2:'#282a36', stars:false, rain:false, fog:true  },
  rainbow:     { name:'🌈 Веселка успіху',   sky:['#0d1b2e','#3a2d5c','#6b3d8c'], ground:['#122a1a','#08150c'], line:'#ffca28', bld1:'#141a2a', bld2:'#2a2050', stars:true,  rain:false, fog:false },
  aurora:      { name:'🌌 Північне сяйво',   sky:['#050a14','#0a2438','#0d4a4a'], ground:['#0a1a18','#04100e'], line:'#69f0ae', bld1:'#081420', bld2:'#0e2f38', stars:true,  rain:false, fog:false },
  sandstorm:   { name:'🏜 Пісочна буря',     sky:['#2e2210','#4a3418','#6b4a20'], ground:['#241a0c','#120d06'], line:'#ffb74d', bld1:'#221a0e', bld2:'#3a2c14', stars:false, rain:false, fog:true  },
  gold_sunset: { name:'🌇 Золотий захід сонця', sky:['#2a1006','#5c2410','#8c4418'], ground:['#1a0e08','#0d0704'], line:'#ffd740', bld1:'#200c04', bld2:'#3a1808', stars:false, rain:false, fog:false },
  moon_night:  { name:'🌕 Місячна ніч',      sky:['#02040a','#081020','#122238'], ground:['#040a08','#020504'], line:'#c5cae9', bld1:'#04070e', bld2:'#0a1526', stars:true,  rain:false, fog:false },
};
