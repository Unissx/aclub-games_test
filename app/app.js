// ============================================================
// КОНФІГ
// ============================================================
const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzH8qt2_fUmnrLEw0Z56fsyMEH-D3uOgBSeTxwzUMCDTFDDoNBAowLTZqEGwSFo26ie9A/exec";
const GAME_SECRET = "aclub2026runnertest";
const RUNNER_URL = "https://unissx.github.io/aclub-games_test/runner/?v=1";
const WORDLE_URL = "https://unissx.github.io/aclub-games_test/wordle/?v=13";
const CIRCLE_URL = "https://unissx.github.io/aclub-games_test/circle/?v=4";

const tg = window.Telegram && window.Telegram.WebApp;
if (tg) { try { tg.ready(); tg.expand(); tg.setHeaderColor("#0A0C14"); tg.setBackgroundColor("#0A0C14"); } catch(e){} }

function getUserId(){
  const qs = new URLSearchParams(location.search);
  if (qs.get("tgid")) return qs.get("tgid");
  if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) return String(tg.initDataUnsafe.user.id);
  return null;
}
const USER_ID = getUserId();

async function api(action, payload){
  const body = { type:"web_action", userId: USER_ID, secret: GAME_SECRET, action, payload: payload || {} };
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(WEBAPP_URL, { method:"POST", headers:{ "Content-Type":"text/plain;charset=utf-8" }, body: JSON.stringify(body), signal: controller.signal });
    return await res.json();
  } finally { clearTimeout(t); }
}
async function apiRaw(type, payload){
  const body = Object.assign({ type, userId: USER_ID, secret: GAME_SECRET }, payload || {});
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(WEBAPP_URL, { method:"POST", headers:{ "Content-Type":"text/plain;charset=utf-8" }, body: JSON.stringify(body), signal: controller.signal });
    return await res.json();
  } finally { clearTimeout(t); }
}

function fmt(n){ return (n ?? 0).toLocaleString("uk-UA"); }
function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
// ПІБ зберігається як "Прізвище Ім'я По-батькові" — для привітання показуємо
// лише ім'я (друге слово), а не все ПІБ повністю. Скрізь, де ім'я
// використовується для звірки/пошуку записів (замовлення, ефекти тощо),
// продовжуємо використовувати повне DASH.name — ця функція лише для показу.
function firstNameOf(fullName){
  const parts = String(fullName||"").trim().split(/\s+/);
  return parts[1] || parts[0] || fullName || "";
}

function toast(msg, kind){
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = "toast show" + (kind ? " " + kind : "");
  clearTimeout(toast._h);
  toast._h = setTimeout(() => t.classList.remove("show"), 2600);
}

// Якщо бекенд повернув server_error/fatal_error — показуємо реальний
// текст помилки (detail), а не незрозумілий код на кшталт "server_error".
function apiErrText(r){
  if (r && (r.error === "server_error" || r.error === "fatal_error") && r.detail) return "Помилка сервера: " + r.detail;
  return (r && r.error) || "Помилка";
}

// Показуємо реальний текст будь-якої необробленої JS-помилки — щоб
// відрізняти "немає з'єднання з сервером" від справжнього бага в
// самому застосунку (без цього обидва виглядали як той самий текст).
window.addEventListener('error', function(e){
  try { toast('JS помилка: ' + (e.message || 'невідомо'), 'err'); } catch(_) {}
});
window.addEventListener('unhandledrejection', function(e){
  try {
    const m = (e.reason && (e.reason.message || e.reason.toString())) || 'невідомо';
    toast('JS помилка: ' + m, 'err');
  } catch(_) {}
});

function showModal(html){
  document.getElementById("modal").innerHTML = html;
  document.getElementById("modalBg").classList.add("show");
  document.getElementById("modal").classList.add("show");
}
function closeModal(){
  document.getElementById("modalBg").classList.remove("show");
  document.getElementById("modal").classList.remove("show");
}
document.getElementById("modalBg").addEventListener("click", closeModal);

// ============================================================
// СТАН
// ============================================================
let DASH = null;
let TAB = "home";
let SHOP_SUB = "abank";
const TABS = [
  { id:"home",      ic:"🏠", lb:"Головна" },
  { id:"games",     ic:"🎮", lb:"Ігри" },
  { id:"shop",      ic:"🏪", lb:"Магазин" },
  { id:"inventory", ic:"🎒", lb:"Інвентар" },
  { id:"support",   ic:"🆘", lb:"Підтримка" },
];

function renderNav(){
  const isAdmin = DASH && (DASH.isAdmin || DASH.isMerchAdmin);
  const tabs = TABS.concat(isAdmin ? [{ id:"admin", ic:"🔐", lb:"Адмін" }] : []);
  document.getElementById("navbar").innerHTML = tabs.map(t => `
    <button class="nav-btn ${TAB===t.id?'active':''}" data-nav="${t.id}">
      <div class="ic">${t.ic}</div><div class="lb">${t.lb}</div>
    </button>`).join("");
  document.querySelectorAll("[data-nav]").forEach(b => b.addEventListener("click", () => nav(b.getAttribute("data-nav"))));
}

function nav(tab){
  TAB = tab;
  renderNav();
  render();
}

let BOOT_WATCHDOG = null;

async function boot(){
  if (!USER_ID) {
    document.getElementById("screen").innerHTML = emptyBlock("🔒","Немає доступу","Відкрийте застосунок кнопкою в боті — так ми дізнаємось, хто ви.");
    renderNav();
    return;
  }
  BOOT_WATCHDOG = setTimeout(() => {
    document.getElementById("screen").innerHTML = emptyBlock("🐢","Довго вантажиться...","Сервер повільно відповідає. Перевірте інтернет.")
      + `<button class="btn" style="margin-top:14px;" onclick="location.reload()">🔄 Спробувати ще раз</button>`;
  }, 8000);

  const ok = await refreshDashboard();
  clearTimeout(BOOT_WATCHDOG);

  if (!ok) {
    if (LAST_DASHBOARD_ERROR === "admin_only_mode") {
      document.getElementById("screen").innerHTML = emptyBlock("🚧","Застосунок ще тестується","Зараз доступ мають лише адміни. Незабаром відкриємо для всіх — слідкуйте за оновленнями в чаті з ботом!");
    } else {
      document.getElementById("screen").innerHTML = emptyBlock("⚠️","Не вдалось завантажити","Перевірте інтернет-з'єднання і спробуйте ще раз.")
        + `<button class="btn" style="margin-top:14px;" onclick="location.reload()">🔄 Спробувати ще раз</button>`;
    }
    renderNav();
    return;
  }
  renderNav();
  render();
}

let LAST_DASHBOARD_ERROR = null;
async function refreshDashboard(){
  try {
    const d = await api("dashboard");
    if (d.ok) {
      DASH = d;
      document.getElementById("pillCoin").textContent = fmt(d.balance||0);
      document.getElementById("pillShard").textContent = fmt(d.shards||0);
      return true;
    }
    LAST_DASHBOARD_ERROR = d.error || null;
    return false;
  } catch(e) { toast("Немає з'єднання з сервером", "err"); return false; }
}

function emptyBlock(icon, title, sub){
  return `<div class="empty"><div class="ic">${icon}</div><div class="t">${esc(title)}</div><div class="s">${esc(sub)}</div></div>`;
}
function loadingBlock(){ return `<div class="loading"><div class="spin"></div></div>`; }

function render(){
  if (!DASH || !DASH.registered) {
    document.getElementById("screen").innerHTML = emptyBlock("🤖","Ви ще не зареєстровані",
      "Поверніться в чат з ботом і надішліть свій LDAP (наприклад AB120996RGN), щоб зареєструватись — після цього застосунок стане доступним.");
    return;
  }
  if (TAB === "home") return renderHome();
  if (TAB === "games") return renderGames();
  if (TAB === "shop") return renderShop();
  if (TAB === "inventory") return renderInventory();
  if (TAB === "support") return renderSupport();
  if (TAB === "admin") return renderAdmin();
}

// ============================================================
// ГОЛОВНА
// ============================================================
function renderHome(){
  const db = DASH.dailyBonus || {};
  const streak = db.streak || 0;
  const daysTo7 = streak >= 7 ? 0 : 7 - streak;
  const vip = DASH.vip || {};
  const badges = [];
  if (DASH.isMainAdmin) badges.push('<span class="badge" style="background:linear-gradient(155deg,#F2A93B,#B15EF0); color:#1a0f2e; font-weight:800;">⭐ ГОЛОВНИЙ АДМІН</span>');
  else if (DASH.isAdmin) badges.push('<span class="badge" style="background:var(--epic); color:#fff; font-weight:800;">🛡 АДМІН</span>');
  if (DASH.isMerchAdmin) badges.push('<span class="badge" style="background:var(--rare); color:#fff; font-weight:800;">📦 МЕРЧ-АДМІН</span>');
  if (vip.active) badges.push('<span class="badge ok" style="font-weight:800;">👑 VIP</span>');
  const screen = document.getElementById("screen");
  screen.innerHTML = `
    <div class="h1">👋 Привіт, ${esc(firstNameOf(DASH.name))}!</div>
    ${badges.length ? `<div class="row" style="flex-wrap:wrap; gap:6px; margin:-6px 2px 12px;">${badges.join("")}</div>` : ""}
    <div class="stat-row">
      <div class="stat-card coin"><div class="label">Баланс</div><div class="value mono">${fmt(DASH.balance)} 💰</div></div>
      <div class="stat-card shard"><div class="label">Осколки</div><div class="value mono">${fmt(DASH.shards)} 🔮</div></div>
    </div>

    <div class="card" style="margin-top:12px;">
      <div class="row between">
        <div class="display" style="font-weight:700; font-size:14px;">🎁 Щоденний бонус</div>
        <div class="badge">${streak} 🔥 стрік</div>
      </div>
      <div class="progress" style="margin:10px 0 6px;"><div style="width:${Math.min(100, streak/7*100)}%"></div></div>
      <div class="sub" style="margin:0 0 10px;">${streak>=7 ? 'Преміум-стрік активний — щодня +2 á-coin!' : `Ще ${daysTo7} дн. до бонусу ×2 щодня`}</div>
      <button class="btn" id="btnDaily" ${db.claimedToday ? 'disabled' : ''}>${db.claimedToday ? '✅ Вже отримано сьогодні' : '🎁 Забрати бонус'}</button>
    </div>

    <div class="h2">Швидкі дії</div>
    <div class="list">
      <div class="item" data-nav="games" style="cursor:pointer">
        <div class="ic">🎮</div><div class="txt"><div class="t">Заробити á-coin</div><div class="s">Ребус, Щасливчик, Runner, Wordle</div></div>
        <div class="right">→</div>
      </div>
      <div class="item" data-nav="inventory" style="cursor:pointer">
        <div class="ic">🎒</div><div class="txt"><div class="t">Інвентар</div><div class="s">Кейси, VIP, заряди, товари, мерч</div></div>
        <div class="right">→</div>
      </div>
    </div>

    <div class="h2">Історія<span class="hint" id="goHistory" style="cursor:pointer">вся історія →</span></div>
    <div class="list" id="historyPreview">${loadingBlock()}</div>
  `;
  screen.querySelectorAll("[data-nav]").forEach(el => el.addEventListener("click", () => nav(el.getAttribute("data-nav"))));
  document.getElementById("goHistory").addEventListener("click", () => openHistoryModal());
  document.getElementById("btnDaily").addEventListener("click", claimDaily);
  loadHistoryPreview();
}

async function claimDaily(){
  const btn = document.getElementById("btnDaily");
  btn.disabled = true; btn.textContent = "⏳ Нараховуємо бонус...";
  try {
    const r = await api("daily_bonus_claim");
    if (!r.ok) { toast(apiErrText(r), "err"); }
    else { toast("Бонус нараховано! Перевірте чат з ботом 🎉", "ok"); await refreshDashboard(); }
  } catch(e) { toast("Помилка з'єднання", "err"); }
  render();
}

async function loadHistoryPreview(){
  try {
    const r = await api("history_list");
    const wrap = document.getElementById("historyPreview");
    if (!wrap) return;
    if (!r.ok) { wrap.innerHTML = emptyBlock("📭","Немає даних",""); return; }
    const merged = [
      ...r.income.slice(0,4).map(x => ({...x, sign:"+"})),
      ...r.expense.slice(0,4).map(x => ({...x, sign:"-"}))
    ];
    if (!merged.length) { wrap.innerHTML = emptyBlock("📭","Історія порожня","Почніть грати, щоб тут щось з'явилось"); return; }
    wrap.innerHTML = merged.slice(0,6).map(historyRow).join("");
  } catch(e) {}
}
function historyRow(x){
  const pos = x.sign === "+";
  return `<div class="item">
    <div class="ic">${pos?'🔹':'🔸'}</div>
    <div class="txt"><div class="t">${esc(x.detail||x.type||'')}</div><div class="s">${esc(x.date||'')}</div></div>
    <div class="right mono" style="color:${pos?'var(--success)':'var(--danger)'}; font-weight:700;">${pos?'+':'-'}${fmt(x.amount)}</div>
  </div>`;
}
async function openHistoryModal(){
  showModal(`<div class="mh">📈 Історія</div><div id="histFull">${loadingBlock()}</div>`);
  try {
    const r = await api("history_list");
    const wrap = document.getElementById("histFull");
    if (!r.ok) { wrap.innerHTML = emptyBlock("📭","Помилка",""); return; }
    const merged = [
      ...r.income.map(x => ({...x, sign:"+"})),
      ...r.expense.map(x => ({...x, sign:"-"}))
    ];
    wrap.innerHTML = merged.length ? `<div class="list">${merged.map(historyRow).join("")}</div>` : emptyBlock("📭","Порожньо","");
  } catch(e){}
}

// ============================================================
// МОЇ ТОВАРИ (модалка, доступна з Головної та Магазину)
// ============================================================
async function loadMyItems(containerId){
  containerId = containerId || "myItemsWrap";
  const wrap = document.getElementById(containerId);
  if (!wrap) return;
  try {
    const r = await api("my_items");
    if (!r.ok || !r.items.length) { wrap.innerHTML = emptyBlock("🎁","Поки що порожньо","Товари з магазину з'являться тут."); return; }
    wrap.innerHTML = `<div class="list">` + r.items.map(it => {
      const shortName = (it.name||"").replace(/\s*\(\d+.*?\)/,"").trim();
      const selfUse = !it.isMerch && /^Кейс:|^Крафт:/.test(it.name||"");
      let statusTxt = selfUse ? "🎁 Готово до використання — натисніть" : "⏳ Очікує використання";
      if (it.isMerch) {
        const accepted = ["Прийнято","Відправлено"].includes(it.merchStatus);
        statusTxt = accepted ? (it.merchStatus==="Відправлено"?"📬 Відправлено":"📬 Прийнято") : (it.isOrdered ? "✅ Дані вказано, очікує" : "⏳ Потрібно вказати доставку");
      }
      return `<div class="item" data-item-row="${it.row}" data-merch="${it.isMerch?1:0}" style="cursor:pointer">
        <div class="ic">${it.isMerch?'📦':'🎁'}</div>
        <div class="txt"><div class="t">${esc(shortName)}</div><div class="s">${esc(statusTxt)}</div></div>
        <div class="right">→</div>
      </div>`;
    }).join("") + `</div><button class="btn secondary" style="margin-top:12px;" onclick="openMyMerchModal()">📦 Мій мерч — історія</button>`;
    wrap.querySelectorAll("[data-item-row]").forEach(el => {
      el.addEventListener("click", () => openItemDetail(parseInt(el.getAttribute("data-item-row")), el.getAttribute("data-merch")==="1", r.items.find(x=>x.row==el.getAttribute("data-item-row"))));
    });
  } catch(e) { wrap.innerHTML = emptyBlock("⚠️","Помилка з'єднання",""); }
}

async function openItemDetail(row, isMerch, it){
  const shortName = (it.name||"").replace(/\s*\(\d+.*?\)/,"").trim();
  let body = "";
  if (isMerch) {
    const accepted = ["Прийнято","Відправлено"].includes(it.merchStatus);
    if (accepted) {
      body = `<div class="sub">Статус: 📬 ${it.merchStatus==="Відправлено"?"Відправлено — посилка в дорозі":"Прийнято адміністратором"}</div>
        <div class="sub">По питаннях доставки: @tashkevych</div>`;
    } else {
      body = `<div class="sub" style="margin-bottom:10px;">${it.isOrdered ? "Дані доставки вказано, очікує підтвердження адміном." : "Потрібно вказати дані доставки."}</div>
        <button class="btn" onclick="openMerchForm(${row}, '${esc(shortName).replace(/'/g,"\\'")}')">📦 ${it.isOrdered?'Редагувати':'Вказати'} дані доставки</button>
        <button class="btn danger" style="margin-top:8px;" onclick="cancelItem(${row})">❌ Скасувати замовлення</button>`;
    }
  } else {
    const selfUse = /^Кейс:|^Крафт:/.test(it.name || "");
    const rarityMatch = (it.name || "").match(/^Крафт: предмет рівня (Rare|Epic|Legendary)$/);
    const pools = SKINS_CATALOG_CACHE || (await loadSkinsCatalog());
    if (!Object.keys(EQUIPPED_SKINS_CACHE).length) {
      try { const eq = await api("get_equipped_skins"); if (eq.ok) EQUIPPED_SKINS_CACHE = eq.equipped; } catch(e) {}
    }
    const pureName = (it.name||"").replace(/^Крафт: |^Кейс: /,"").replace(/\s*\([^)]*\)\s*$/,"");
    const poolKey = findPoolKeyForItem(pureName, pools);
    // ВАЖЛИВО: раніше екіпіруваним вважався лише скін персонажа Runner
    // (poolKey === "runner_rare_character"), а всі інші скіни (птиці, погода,
    // боси, перешкоди, скіни Wordle/Circle) потрапляли в гілку "Використати" —
    // бекенд позначав предмет використаним, і скін просто зникав з інвентаря
    // без жодного ефекту. Тепер екіпірується будь-який предмет зі SKIN_POOLS.
    const isEquippable = !!poolKey;
    const isEquipped = isEquippable && EQUIPPED_SKINS_CACHE[poolKey] === pureName;
    body = rarityMatch
      ? `<div class="sub" style="margin-bottom:10px;">Оберіть конкретний предмет цієї рідкості.</div>
        <button class="btn" onclick="closeModal(); openCraftPicker(${row}, '${rarityMatch[1]}')">🎁 Обрати предмет</button>
        <button class="btn danger" style="margin-top:8px;" onclick="cancelItem(${row})">❌ Скасувати</button>`
      : isEquippable
      ? `<div class="sub" style="margin-bottom:10px;">${isEquipped ? '✅ Зараз екіпіровано — застосовано в грі' : '🎨 Косметичний скін'}</div>
        ${!isEquipped ? `<button class="btn" onclick="equipSkin('${poolKey}','${esc(pureName).replace(/'/g,"\\'")}')">🎨 Екіпірувати</button>` : ''}`
      : selfUse
      ? `<div class="sub" style="margin-bottom:10px;">Предмет з кейсу/крафту — можна використати самостійно, без адміна.</div>
        <button class="btn" onclick="selfUseItem(${row})">✅ Використати</button>
        <button class="btn danger" style="margin-top:8px;" onclick="cancelItem(${row})">❌ Скасувати</button>`
      : `<div class="sub" style="margin-bottom:10px;">Для використання зверніться до СС особисто 💚</div>
        <button class="btn danger" onclick="cancelItem(${row})">❌ Скасувати покупку</button>`;
  }
  showModal(`<div class="mh">🎁 ${esc(shortName)}</div>${body}`);
}

async function selfUseItem(row){
  try {
    const r = await api("item_self_use", { row });
    if (!r.ok) { toast(r.error === "already_used" ? "Вже використано" : "Помилка", "err"); return; }
    toast("Використано! ✅", "ok");
    closeModal();
    if (document.getElementById("myItemsWrap")) loadMyItems("myItemsWrap");
    else if (TAB === "shop" && SHOP_SUB === "items") loadMyItems("shopBody");
    if (TAB === "inventory") renderInventory();
  } catch(e) { toast("Помилка з'єднання", "err"); }
}

async function cancelItem(row){
  if (!confirm("Скасувати покупку? Кошти повернуться на баланс.")) return;
  try {
    const r = await api("item_cancel", { row });
    if (!r.ok) { toast(r.error || "Помилка", "err"); return; }
    toast("Покупку скасовано, кошти повернено", "ok");
    await refreshDashboard();
    closeModal();
  } catch(e) { toast("Помилка з'єднання", "err"); }
}

function openMerchForm(row, itemName){
  showModal(`
    <div class="mh">📦 Дані доставки — ${esc(itemName)}</div>
    <div class="field-label">ПІБ отримувача</div><input class="field" id="mf_name" placeholder="Іван Іваненко">
    <div class="field-label">Місто</div><input class="field" id="mf_city" placeholder="Київ">
    <div class="field-label">Відділення / поштомат</div><input class="field" id="mf_branch" placeholder="№12">
    <div class="field-label">Телефон</div><input class="field" id="mf_phone" placeholder="+380...">
    <div class="field-label">Коментар (необов'язково)</div><textarea class="field" id="mf_comment" rows="2"></textarea>
    <button class="btn" style="margin-top:14px;" onclick="submitMerchForm(${row})">✅ Оформити замовлення</button>
  `);
}
async function submitMerchForm(row){
  const p = {
    row, name: document.getElementById("mf_name").value, city: document.getElementById("mf_city").value,
    branch: document.getElementById("mf_branch").value, phone: document.getElementById("mf_phone").value,
    comment: document.getElementById("mf_comment").value
  };
  if (!p.name || !p.phone) { toast("Вкажіть хоча б ПІБ і телефон", "err"); return; }
  try {
    const r = await api("merch_submit", p);
    if (!r.ok) { toast(r.error || "Помилка", "err"); return; }
    toast("Замовлення оформлено! 🎉", "ok");
    closeModal();
  } catch(e) { toast("Помилка з'єднання", "err"); }
}

async function openMyMerchModal(){
  showModal(`<div class="mh">📦 Мій мерч</div><div id="myMerchWrap">${loadingBlock()}</div>`);
  try {
    const r = await api("my_merch");
    const wrap = document.getElementById("myMerchWrap");
    if (!r.ok || !r.orders.length) { wrap.innerHTML = emptyBlock("📦","Замовлень немає",""); return; }
    wrap.innerHTML = `<div class="list">` + r.orders.map(m => {
      const icon = m.status==="Відправлено"?"✅":(m.status||"").includes("Скасован")?"❌":m.status==="Прийнято"?"📬":"⏳";
      return `<div class="item"><div class="ic">${icon}</div><div class="txt"><div class="t">${esc(m.item)}</div>
        <div class="s">${esc(m.date)} · ${esc(m.status)} ${m.city?('· '+esc(m.city)+' відд.'+esc(m.branch)):''}</div></div></div>`;
    }).join("") + `</div>`;
  } catch(e) {}
}

// ============================================================
// ІГРИ
// ============================================================
// Telegram не дозволяє відкрити ще один повноцінний Mini App поверх
// уже відкритого — tg.openLink() завжди відкриває звичайне посилання
// (у внутрішньому браузері Telegram або в зовнішньому на десктопі).
// Тому важкі ігри (Runner/Wordle/Circle) вбудовуємо прямо в застосунок
// через iframe на весь екран — це лишається "тут же", без переходів.
function openGameFrame(url, title){
  const full = url + "&tgid=" + encodeURIComponent(USER_ID);
  const wrap = document.createElement("div");
  wrap.id = "gameFrameOverlay";
  wrap.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:9999; background:var(--void); display:flex; flex-direction:column; overflow:hidden;";
  wrap.innerHTML = `
    <div style="flex:0 0 auto; display:flex; align-items:center; gap:10px; padding:10px 12px; padding-top:calc(10px + env(safe-area-inset-top)); background:var(--panel); border-bottom:1px solid var(--line);">
      <button onclick="closeGameFrame()" style="background:var(--panel3); border:1px solid var(--line); color:var(--text); border-radius:10px; padding:8px 12px; font-weight:700; font-size:13px;">← Назад</button>
      <div class="display" style="font-weight:700; font-size:13.5px;">${esc(title||"")}</div>
    </div>
    <div style="flex:1 1 auto; min-height:0; min-width:0; position:relative;">
      <iframe src="${full}" style="display:block; position:absolute; top:0; left:0; right:0; bottom:0; width:100%; height:100%; border:none; background:#050d1a;" allow="autoplay"></iframe>
    </div>
  `;
  document.body.appendChild(wrap);
}
function closeGameFrame(){
  const el = document.getElementById("gameFrameOverlay");
  if (el) el.remove();
}
// Fallback для випадку, коли гра у iframe — на іншому домені (постMessage
// працює навіть cross-origin, на відміну від прямого виклику window.parent.fn()).
window.addEventListener("message", (e) => {
  if (e && e.data && e.data.type === "closeGameFrame") closeGameFrame();
});

// Підтягуємо рівні апгрейдів (максимум, якщо VIP активний) і передаємо
// їх у query-параметрах, які Runner читає сам при старті.
async function playRunner(){
  let params = { bird:0, shield:0, magnet:0, uspeed:0, ulives:0, equippedCharacter:null, equippedBird:null, equippedObstacles:null, equippedWeather:null, equippedBoss:null };
  try {
    const r = await api("runner_launch_params");
    if (r.ok) params = r;
  } catch(e) {}
  const style = params.equippedCharacter
    ? (CHARACTER_SKIN_STYLES[params.equippedCharacter] || { hue: _hashHue(params.equippedCharacter), sat: 70, light: 45 })
    : null;
  const skinShape = params.equippedCharacter ? (CHARACTER_SHAPES[params.equippedCharacter] || "") : "";
  const birdStyle = params.equippedBird
    ? (BIRD_SKIN_STYLES[params.equippedBird] || { hue: _hashHue(params.equippedBird), sat: 70, light: 45 })
    : null;
  const obstacleStyle = params.equippedObstacles
    ? (OBSTACLE_SKIN_STYLES[params.equippedObstacles] || { hue: _hashHue(params.equippedObstacles), sat: 70, light: 50 })
    : null;
  const obsShape = params.equippedObstacles ? (OBSTACLE_SHAPES[params.equippedObstacles] || "") : "";
  const bossStyle = params.equippedBoss
    ? (BOSS_SKIN_STYLES[params.equippedBoss] || { hue: _hashHue(params.equippedBoss), sat: 60, light: 35 })
    : null;
  const bossShape = params.equippedBoss ? (BOSS_SHAPES[params.equippedBoss] || "") : "";
  const birdShape = params.equippedBird ? (BIRD_SHAPES[params.equippedBird] || "") : "";
  const weatherPreset = params.equippedWeather ? (WEATHER_SKIN_PRESETS[params.equippedWeather] || "") : "";
  const url = RUNNER_URL + `&bird=${params.bird}&shield=${params.shield}&magnet=${params.magnet}&uspeed=${params.uspeed}&ulives=${params.ulives}${style?`&skinhue=${style.hue}&skinsat=${style.sat}&skinlight=${style.light}`:""}${skinShape?`&skinshape=${skinShape}`:""}${birdStyle?`&birdhue=${birdStyle.hue}&birdsat=${birdStyle.sat}&birdlight=${birdStyle.light}`:""}${birdShape?`&birdshape=${birdShape}`:""}${obstacleStyle?`&obshue=${obstacleStyle.hue}&obssat=${obstacleStyle.sat}&obslight=${obstacleStyle.light}`:""}${obsShape?`&obsshape=${obsShape}`:""}${bossStyle?`&bosshue=${bossStyle.hue}&bosssat=${bossStyle.sat}&bosslight=${bossStyle.light}`:""}${bossShape?`&bossshape=${bossShape}`:""}${weatherPreset?`&weather=${weatherPreset}`:""}`;
  openGameFrame(url, "🏃 áClub Runner");
}

function renderGames(){
  const rebus = DASH.rebus || {};
  const lucky = DASH.lucky || { used:0, cap:3 };
  const vipActive = !!(DASH.vip && DASH.vip.active);
  const screen = document.getElementById("screen");
  screen.innerHTML = `
    <div class="h1">🎮 Заробити á-coin</div>

    <div class="game-card">
      <div class="gt">🧩 Ребус дня</div>
      <div class="gd">${rebus.active ? (rebus.answered ? "Ви вже відповіли — чекайте результатів." : "Розгадайте ребус і введіть відповідь одним словом.") : "На сьогодні ребусу поки немає."}</div>
      ${rebus.active ? `<div class="card" style="margin-bottom:10px; background:var(--panel3); border:none;">${esc(rebus.text)}</div>` : ""}
      ${rebus.active && !rebus.answered ? `
        <input class="field" id="rebusAnswer" placeholder="Ваша відповідь..." style="margin-bottom:8px;">
        <div class="btn-row">
          <button class="btn secondary sm" onclick="getRebusHint()">💡 Підказка</button>
          <button class="btn sm" onclick="submitRebusAnswer()">✍️ Відповісти</button>
        </div>` : ""}
      ${rebus.active && rebus.answered ? `
        <button class="btn secondary sm" style="${vipActive ? 'background:var(--success); color:#0a2a1c; border-color:var(--success);' : ''}" onclick="openChangeAnswer(${vipActive})">${vipActive ? '✏️ Змінити відповідь' : '🔒 Змінити відповідь (VIP)'}</button>` : ""}
    </div>

    <div class="game-card">
      <div class="gt">🎰 Щасливчик</div>
      <div class="gd" id="luckyGd">Вгадайте число від 1 до 6 і отримайте +${DASH.lucky && DASH.lucky.reward || 3} á-coin миттєво. Спроба ${lucky.used}/${lucky.cap}.</div>
      <div id="luckyPicker" class="btn-row" style="flex-wrap:wrap; gap:6px;">
        ${[1,2,3,4,5,6].map(n => `<button class="btn secondary sm" style="flex:1 1 27%;" onclick="rollLucky(${n})" ${lucky.used>=lucky.cap?'disabled':''}>${n}</button>`).join("")}
      </div>
      <div id="luckyResult"></div>
    </div>

    <div class="game-card">
      <div class="gt">🏃 áClub Runner</div>
      <div class="gd">Біжи через перешкоди, збирай яблука, потрапляй у топ тижневого турніру.</div>
      <button class="btn" onclick="playRunner()">🎮 Грати${vipActive ? ' (VIP: макс. прокачка)' : ''}</button>
    </div>

    <div class="game-card">
      <div class="gt">🔤 Вгадай слово</div>
      <div class="gd">Класичний Wordle українською — 6 спроб, нагорода за швидкість.</div>
      <button class="btn" onclick="openGameFrame('${WORDLE_URL}','🔤 Вгадай слово')">🔤 Грати</button>
    </div>

    <div class="game-card">
      <div class="gt">🔵 Слова по колу</div>
      <div class="gd">Знаходьте слова, з'єднуючи літери по колу.</div>
      <button class="btn" onclick="openGameFrame('${CIRCLE_URL}','🔵 Слова по колу')">🔵 Грати</button>
    </div>
  `;
}

async function openChangeAnswer(vipActive){
  if (!vipActive) {
    const ticketsCount = (DASH.vip && DASH.vip.ticketsCount) || 0;
    let ticketsHtml = "";
    if (ticketsCount > 0) {
      try {
        const tr = await api("vip_my_tickets");
        if (tr.ok && tr.tickets.length) {
          ticketsHtml = `<div class="sub" style="margin:10px 0 6px;">У вас є непроактивований VIP-тикет:</div>
            <div class="list">${tr.tickets.map(t => `
              <div class="item"><div class="ic">🎟</div><div class="txt"><div class="t">${esc((VIP_TICKET_DEFS[t.type]||{}).label || t.type)}</div></div>
              <button class="btn sm" style="width:auto; padding:8px 12px;" onclick="activateVipTicket(${t.row})">Активувати</button></div>
            `).join("")}</div>`;
        }
      } catch(e) {}
    }
    showModal(`<div class="mh">🔒 Доступно з VIP</div><div class="sub" style="margin-bottom:12px;">Зміна відповіді після відправки — привілей VIP-статусу.</div>
      ${ticketsHtml}
      <button class="btn" style="margin-top:10px;" onclick="closeModal(); nav('inventory');">👑 Придбати VIP</button>`);
    return;
  }
  showModal(`
    <div class="mh">✏️ Змінити відповідь</div>
    <input class="field" id="rebusAnswerEdit" placeholder="Нова відповідь..." style="margin-bottom:10px;">
    <button class="btn" onclick="submitChangeAnswer()">✅ Зберегти нову відповідь</button>
  `);
}
async function submitChangeAnswer(){
  const val = document.getElementById("rebusAnswerEdit").value.trim();
  if (!val) { toast("Введіть відповідь", "err"); return; }
  try {
    const r = await api("rebus_change_answer", { answer: val });
    if (!r.ok) { showModal(`<div class="mh">❌ Не вдалось</div><div class="sub">Спробуйте ще раз.</div>`); return; }
    showModal(`<div class="mh">✅ Відповідь оновлено!</div><div class="sub">Нова відповідь збережена. Приз до <b>+${r.prize} á-coin</b> після закриття ребусу.</div>`);
  } catch(e) { showModal(`<div class="mh">⚠️ Немає з'єднання</div>`); }
}

async function submitRebusAnswer(){
  const val = document.getElementById("rebusAnswer").value.trim();
  if (!val) { toast("Введіть відповідь", "err"); return; }
  try {
    const r = await api("rebus_answer", { answer: val });
    if (!r.ok) {
      showModal(`<div class="mh">❌ Не вдалось надіслати</div><div class="sub">${r.error === "already_answered" ? "Ви вже відповіли на цей ребус." : "Сталася помилка, спробуйте ще раз."}</div>`);
      return;
    }
    showModal(`<div class="mh">⏳ Відповідь прийнято!</div><div class="sub">Результати будуть після закриття ребусу.<br>Якщо відповідь правильна — отримаєте <b>+${r.prize} á-coin</b>.</div>`);
    await refreshDashboard(); renderGames();
  } catch(e) { showModal(`<div class="mh">⚠️ Немає з'єднання</div><div class="sub">Перевірте інтернет і спробуйте ще раз.</div>`); }
}
async function getRebusHint(){
  try {
    let r = await api("rebus_hint", { confirm:false });
    if (!r.ok) { showModal(`<div class="mh">⚠️ Помилка</div><div class="sub">${esc(r.error||"")}</div>`); return; }
    if (r.needConfirm) {
      if (!confirm("Підказка зменшує приз вдвічі. Продовжити?")) return;
      r = await api("rebus_hint", { confirm:true });
      if (!r.ok) { showModal(`<div class="mh">⚠️ Помилка</div>`); return; }
    }
    showModal(`<div class="mh">💡 Підказка</div><div class="sub">${esc(r.hint)}</div>`);
  } catch(e) { showModal(`<div class="mh">⚠️ Немає з'єднання</div>`); }
}

// Результат «Щасливчика» — рандомайзер на сервері, без анімованого
// кубика в Telegram-чаті. Показуємо власну SVG-анімацію кидка прямо
// в застосунку (замість плоских unicode-символів).
const DICE_PIPS = {
  1: [[50,50]],
  2: [[28,28],[72,72]],
  3: [[28,28],[50,50],[72,72]],
  4: [[28,28],[72,28],[28,72],[72,72]],
  5: [[28,28],[72,28],[50,50],[28,72],[72,72]],
  6: [[28,25],[72,25],[28,50],[72,50],[28,75],[72,75]],
};
function diceFaceSvg(value, extraClass){
  const pips = DICE_PIPS[value] || DICE_PIPS[1];
  const isSpinning = extraClass === "dice-spin";
  return `<svg class="${isSpinning ? '' : (extraClass||'')}" width="76" height="76" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="92" height="92" rx="20" fill="var(--panel3)" stroke="var(--brass-bright)" stroke-width="3"/>
    <g class="${isSpinning ? 'dice-pips-spin' : ''}">
      ${pips.map(([cx,cy]) => `<circle cx="${cx}" cy="${cy}" r="8" fill="var(--brass-bright)"/>`).join("")}
    </g>
  </svg>`;
}
async function rollLucky(guess){
  const resultEl = document.getElementById("luckyResult");
  document.querySelectorAll("#luckyPicker button").forEach(b => b.disabled = true);
  if (!resultEl) return;
  resultEl.innerHTML = `
    <div class="card" style="margin-top:10px; background:var(--panel3); border:none;">
      <div style="display:flex; justify-content:center; margin:4px 0;" id="diceFace">${diceFaceSvg(1,'dice-spin')}</div>
      <div class="sub" style="text-align:center;">Кидаємо...</div>
    </div>`;
  const faceEl = document.getElementById("diceFace");
  let spins = 0;
  const spinTimer = setInterval(() => {
    if (faceEl) faceEl.innerHTML = diceFaceSvg(1 + Math.floor(Math.random()*6), 'dice-spin');
    spins++;
  }, 90);

  let r;
  try {
    r = await api("lucky_roll", { guess });
  } catch(e) {
    clearInterval(spinTimer);
    resultEl.innerHTML = `<div class="card" style="margin-top:10px; background:var(--panel3); border:none;"><div class="sub" style="text-align:center; color:var(--danger);">⚠️ Немає з'єднання. Спробуйте ще раз.</div></div>`;
    document.querySelectorAll("#luckyPicker button").forEach(b => b.disabled = false);
    return;
  }
  await new Promise(res => setTimeout(res, Math.max(0, 550 - spins*90)));
  clearInterval(spinTimer);

  if (!r.ok) {
    const msg = r.error === "no_attempts_left" ? "Спроби на сьогодні вичерпано. Повертайтесь завтра 🌅" : "Сталася помилка, спробуйте ще раз.";
    resultEl.innerHTML = `<div class="card" style="margin-top:10px; background:var(--panel3); border:none;"><div class="sub" style="text-align:center;">❌ ${msg}</div></div>`;
    await refreshDashboard();
    updateLuckyStatus();
    return;
  }
  resultEl.innerHTML = `
    <div class="card" style="margin-top:10px; background:var(--panel3); border:none;">
      <div style="display:flex; justify-content:center; margin:4px 0;">${diceFaceSvg(r.diceVal, 'dice-land')}</div>
      <div class="mh" style="text-align:center; font-size:14px;">${r.isWin ? '🎉 Перемога!' : '😅 Не цього разу'}</div>
      <div class="sub" style="text-align:center; font-size:13px; margin-bottom:4px;">Випало число: <b style="color:var(--brass-bright); font-size:16px;">${r.diceVal}</b> (ви обрали ${guess})</div>
      <div class="sub" style="text-align:center;">${r.isWin ? `Нараховано <b style="color:var(--success);">+${r.reward} á-coin</b>` : "Спробуйте ще раз, якщо є спроби."}</div>
      <div class="sub" style="text-align:center; margin-top:4px;">Спроб залишилось сьогодні: <b>${r.attemptsLeft}</b></div>
    </div>`;
  await refreshDashboard();
  updateLuckyStatus();
}
// Точкове оновлення статусу "Щасливчика" (лічильник спроб, доступність
// кнопок) — без повного перемальовування екрана, щоб не стирати
// щойно показаний результат кидка.
function updateLuckyStatus(){
  const gd = document.getElementById("luckyGd");
  const lucky = (DASH && DASH.lucky) || { used:0, cap:3, reward:3 };
  if (gd) gd.textContent = `Вгадайте число від 1 до 6 і отримайте +${lucky.reward||3} á-coin миттєво. Спроба ${lucky.used}/${lucky.cap}.`;
  document.querySelectorAll("#luckyPicker button").forEach(b => b.disabled = lucky.used >= lucky.cap);
}

// ============================================================
// МАГАЗИН
// ============================================================
function renderShop(){
  const screen = document.getElementById("screen");
  screen.innerHTML = `
    <div class="h1">🏪 Магазин</div>
    <div class="tabs2" style="flex-wrap:wrap; gap:4px;">
      <div class="t2" style="flex:1 1 30%;" data-sub="abank">🎁 áBank</div>
      <div class="t2" style="flex:1 1 30%;" data-sub="chests">📦 Кейси</div>
      <div class="t2" style="flex:1 1 30%;" data-sub="runner">🏃 Runner</div>
      <div class="t2" style="flex:1 1 30%;" data-sub="wordle">🔤 Wordle</div>
      <div class="t2" style="flex:1 1 30%;" data-sub="items">🎽 Мої товари</div>
    </div>
    <div id="shopBody">${loadingBlock()}</div>
  `;
  screen.querySelectorAll("[data-sub]").forEach(el => {
    if (el.getAttribute("data-sub") === SHOP_SUB) el.classList.add("active");
    el.addEventListener("click", () => { SHOP_SUB = el.getAttribute("data-sub"); renderShop(); });
  });
  if (SHOP_SUB === "abank") loadShopAbank();
  else if (SHOP_SUB === "chests") loadShopChests();
  else if (SHOP_SUB === "runner") loadUpgrades("runner");
  else if (SHOP_SUB === "wordle") loadUpgrades("wordle");
  else loadMyItems("shopBody");
}

// ── Кейси (покупка — потрапляє у слот в «Інвентарі») ──
async function loadShopChests(){
  const wrap = document.getElementById("shopBody");
  if (!wrap) return; // не на вкладці Магазину (наприклад, кейс купили з модалки в Інвентарі) — нічого оновлювати
  try {
    const r = await apiRaw("get_inventory");
    if (!r.ok) { wrap.innerHTML = emptyBlock("⚠️","Помилка",""); return; }
    CHESTS_STATE = r;
    wrap.innerHTML = `<div class="sub" style="margin:-2px 2px 10px;">Кейс відкривається одразу після покупки.</div>
      <div class="list" id="buyChestList">${buyChestListHtml()}</div>`;
    wrap.querySelectorAll("[data-buy-chest]").forEach(el => el.addEventListener("click", () => openBuyChestSheet(el.getAttribute("data-buy-chest"))));
  } catch(e) { wrap.innerHTML = emptyBlock("⚠️","Помилка з'єднання",""); }
}

async function loadShopAbank(){
  const wrap = document.getElementById("shopBody");
  try {
    const r = await api("shop_list");
    if (!r.ok) { wrap.innerHTML = emptyBlock("⚠️","Помилка",""); return; }
    paintShopAbank(r);
  } catch(e) { wrap.innerHTML = emptyBlock("⚠️","Помилка з'єднання",""); }
}
function paintShopAbank(r){
  const wrap = document.getElementById("shopBody");
  if (!wrap) return;
  wrap.innerHTML = `<div class="list">` + r.items.map(it => `
    <div class="card">
      <div class="row between"><div style="font-weight:700; font-size:13.5px;">${it.type==='merch'?'📦':'🎁'} ${esc(it.name)}</div>
      <div class="mono" style="color:var(--brass-bright); font-weight:700;">${it.price} 💰</div></div>
      <div class="sub" style="margin:6px 0 10px;">${esc(it.desc)}</div>
      <button class="btn sm" ${r.balance < it.price ? 'disabled' : ''} onclick="buyShopItem('${it.id}', ${it.price})">
        ${r.balance < it.price ? 'Недостатньо á-coin' : 'Купити'}
      </button>
    </div>`).join("") + `</div>`;
}
async function buyShopItem(id, price){
  if (!confirm(`Придбати за ${price} á-coin?`)) return;
  try {
    const r = await api("shop_buy", { itemId:id });
    if (!r.ok) { toast(r.error === "insufficient_funds" ? "Недостатньо á-coin" : "Помилка", "err"); return; }
    toast("Придбано! Перевірте «Мої товари»", "ok");
    await refreshDashboard(); loadShopAbank();
  } catch(e) { toast("Помилка з'єднання", "err"); }
}

async function loadUpgrades(kind){
  const wrap = document.getElementById("shopBody");
  try {
    const r = await api(kind === "runner" ? "upgrades_runner_get" : "upgrades_wordle_get");
    if (!r.ok) { wrap.innerHTML = emptyBlock("⚠️","Помилка",""); return; }
    paintUpgrades(kind, r);
  } catch(e) { wrap.innerHTML = emptyBlock("⚠️","Помилка з'єднання",""); }
}
function paintUpgrades(kind, r){
  const wrap = document.getElementById("shopBody");
  if (!wrap) return;
  const entries = Object.entries(r.upgrades);
  wrap.innerHTML = `<div class="list">` + entries.map(([key, upg]) => {
    const maxLevel = upg.maxLevel || 5;
    const cur = r.current[key] || 0;
    const maxed = cur >= maxLevel;
    const price = !maxed ? upg.prices[cur] : 0;
    const effect = cur > 0 ? upg.effects[cur-1] : (key==='lives' ? "1 життя (базово)" : "не куплено");
    return `<div class="card">
      <div class="row between"><div style="font-weight:700; font-size:13.5px;">${esc(upg.name)}</div><div class="badge">${cur}/${maxLevel}</div></div>
      <div class="sub" style="margin:6px 0;">${esc(upg.desc)}</div>
      <div class="progress" style="margin-bottom:8px;"><div style="width:${cur/maxLevel*100}%"></div></div>
      <div class="sub" style="margin:0 0 10px;">Зараз: ${esc(effect)}${!maxed?` · Далі: ${esc(upg.effects[cur])} — ${price} 💰`:''}</div>
      <button class="btn sm" ${maxed || r.balance < price ? 'disabled' : ''} onclick="buyUpgrade('${kind}','${key}')">
        ${maxed ? '✅ Максимум' : (r.balance < price ? 'Недостатньо á-coin' : `Купити рів. ${cur+1} — ${price} 💰`)}
      </button>
    </div>`;
  }).join("") + `</div>`;
}
async function buyUpgrade(kind, key){
  try {
    const r = await api(kind === "runner" ? "upgrades_runner_buy" : "upgrades_wordle_buy", { key });
    if (!r.ok) { toast(r.error === "insufficient_funds" ? "Недостатньо á-coin" : "Помилка", "err"); return; }
    toast("Апгрейд придбано!", "ok");
    await refreshDashboard(); loadUpgrades(kind);
  } catch(e) { toast("Помилка з'єднання", "err"); }
}

// ============================================================
// ІНВЕНТАР — кейси-слоти (реальний таймер), VIP, заряди,
// товари з магазину/мерч, предмети з кейсів. Усе в одному місці.
// ============================================================
const CHEST_META = {
  avangard:    { icon:"💰", base:"#2f5233", lid:"#D9A94E", accent:"#8a6a1a", gem:"#F2C879" },
  singularity: { icon:"⚡️", base:"#2d1f4d", lid:"#8B7CF6", accent:"#4a3b7a", gem:"#c9bdff" },
  ultimatum:   { icon:"🏃", base:"#0d3b3f", lid:"#4E8FE0", accent:"#0a2a2d", gem:"#9fd0ff" },
  requiem:     { icon:"🌒", base:"#241b3d", lid:"#6b4fa0", accent:"#1a1430", gem:"#b79bf0" },
  collapse:    { icon:"🔤", base:"#4a2a10", lid:"#E8873A", accent:"#3a2008", gem:"#ffcf9e" },
  absolut:     { icon:"👑", base:"#241a05", lid:"#F2C879", accent:"#9c7530", gem:"#fff3d0" },
  silver:      { icon:"🥈", base:"#4a4a52", lid:"#C7CBD1", accent:"#8a8f99", gem:"#eef1f4" },
  gold:        { icon:"🥇", base:"#6b4e12", lid:"#F2C879", accent:"#a9791e", gem:"#fff0c2" },
  epic:        { icon:"💜", base:"#3a1f4d", lid:"#B15EF0", accent:"#6b2f8a", gem:"#e6c3ff" },
  legendary:   { icon:"🧡", base:"#5c3410", lid:"#F2A93B", accent:"#a35a12", gem:"#ffdca0" },
};
// Один шаблон 2D-скрині, розфарбований під кожен тип — узгоджено
// виглядає і в Магазині, і в слотах Інвентаря. animated=true —
// кришка окремою групою з CSS-анімацією відкриття.
// ============================================================
// Візуал скінів: своя форма-силует під кожну категорію + свій
// колір під кожну конкретну назву (з хешу тексту) — щоб усі ~96
// скінів виглядали розрізнювано, без потреби малювати кожен окремо.
// ============================================================
// Самі палітри (CHARACTER_SKIN_STYLES, BIRD_SKIN_STYLES, OBSTACLE_SKIN_STYLES,
// BOSS_SKIN_STYLES, WEATHER_SKIN_PRESETS, _hashHue) винесено в окремий файл
// runner-skins.js (підключений через <script> у <head>) — щоб додавати нові
// скіни, не треба лізти в цей файл.
function skinCategoryOf(poolKey){
  if (!poolKey) return "generic";
  if (poolKey.indexOf("character") >= 0) return "character";
  if (poolKey === "runner_epic_bird") return "bird";
  if (poolKey.indexOf("obstacles") >= 0) return "obstacles";
  if (poolKey.indexOf("weather") >= 0) return "weather";
  if (poolKey.indexOf("boss") >= 0) return "boss";
  if (poolKey.indexOf("timer") >= 0) return "timer";
  if (poolKey.indexOf("keyboard") >= 0) return "keyboard";
  if (poolKey.indexOf("background") >= 0) return "background";
  if (poolKey.indexOf("wheel") >= 0) return "wheel";
  if (poolKey.indexOf("letters") >= 0) return "letters";
  return "generic";
}
// Розпізнавання ЛИШЕ для категорії "погода" — там немає окремого силуету
// в грі (це просто інша палітра неба/землі + прапорці дощу/туману/зірок),
// тож іконка веселки лишається символічною відповідністю. Всі інші
// категорії (bird/obstacles/boss/character) тепер мають РЕАЛЬНІ форми, що
// збігаються з тим, що фактично малює гра (BIRD_SHAPES/OBSTACLE_SHAPES/
// BOSS_SHAPES/CHARACTER_SHAPES) — іконка більше нічого не вигадує.
function weatherIconOverride(name){
  if (/весел|райдуг/i.test(String(name||""))) return (c1,c2,c3,bg) => `
    <path d="M14,78 A36,36 0 0 1 86,78" fill="none" stroke="${c1}" stroke-width="8"/>
    <path d="M22,78 A28,28 0 0 1 78,78" fill="none" stroke="${c2}" stroke-width="8"/>
    <path d="M30,78 A20,20 0 0 1 70,78" fill="none" stroke="${c3}" stroke-width="8"/>
    <ellipse cx="24" cy="76" rx="10" ry="7" fill="#fff" opacity=".85"/>
    <ellipse cx="76" cy="76" rx="10" ry="7" fill="#fff" opacity=".85"/>`;
  return null;
}
function skinIconSvg(poolKey, itemName, size){
  size = size || 44;
  const cat = skinCategoryOf(poolKey);
  const key = itemName || poolKey || "x";
  // Для скіна персонажа використовуємо ТІ Ж САМІ кольори й форму, що й у
  // самій грі (CHARACTER_SKIN_STYLES / CHARACTER_ICON_ART), а не окремий
  // хеш-колір — інакше іконка в каталозі могла відрізнятись від реального
  // вигляду скіна в Runner.
  const curatedStyle = cat === "character" ? CHARACTER_SKIN_STYLES[key]
    : cat === "bird" ? BIRD_SKIN_STYLES[key]
    : cat === "obstacles" ? OBSTACLE_SKIN_STYLES[key]
    : cat === "boss" ? BOSS_SKIN_STYLES[key]
    : null;
  const hue = curatedStyle ? curatedStyle.hue : _hashHue(key);
  const sat = curatedStyle ? curatedStyle.sat : 62;
  const light = curatedStyle ? curatedStyle.light : 55;
  const variantIdx = _hashHue(key + "#v") ; // друге, незалежне число для вибору пози/дизайну (категорії без власного силуету)
  const c1 = `hsl(${hue},${sat}%,${light}%)`, c2 = `hsl(${hue},${Math.max(0,sat-8)}%,${Math.min(90,light+19)}%)`, c3 = `hsl(${hue},${Math.max(0,sat-12)}%,${Math.max(10,light-17)}%)`, bg = `hsl(${hue},${Math.max(0,sat-24)}%,16%)`;
  let shape = "";
  const weatherOverride = cat === "weather" ? weatherIconOverride(key) : null;
  if (weatherOverride) {
    shape = weatherOverride(c1,c2,c3,bg);
  } else
  switch(cat){
    case "character": {
      shape = (CHARACTER_ICON_ART[key] ? CHARACTER_ICON_ART[key](c1,c2,c3,bg) : null) || [
        `<circle cx="50" cy="28" r="13" fill="${c2}"/><path d="M31,88 Q31,52 50,52 Q69,52 69,88 Z" fill="${c1}"/><path d="M46,52 L50,64 L54,52 Z" fill="${c3}"/><rect x="30" y="52" width="8" height="30" rx="2" fill="${c3}" opacity=".6"/><rect x="62" y="52" width="8" height="30" rx="2" fill="${c3}" opacity=".6"/>`,
        `<circle cx="42" cy="26" r="13" fill="${c2}"/><path d="M30,50 Q40,48 50,55 L66,46" stroke="${c1}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M50,55 L44,88 M50,55 L66,80" stroke="${c1}" stroke-width="9" fill="none" stroke-linecap="round"/>`,
      ][variantIdx % 2];
      break;
    }
    case "bird": {
      // Той самий силует, що й drawBirdBody() у грі (owl/parrot/wader/raptor/penguin), впізнаваний за BIRD_SHAPES.
      const bshape = BIRD_SHAPES[key] || "songbird";
      if (bshape === "owl") {
        shape = `<ellipse cx="50" cy="55" rx="26" ry="26" fill="${c1}"/><path d="M30,32 L22,14 L38,26 Z" fill="${c2}"/><path d="M70,32 L78,14 L62,26 Z" fill="${c2}"/><circle cx="40" cy="48" r="10" fill="#fff"/><circle cx="60" cy="48" r="10" fill="#fff"/><circle cx="40" cy="48" r="4.5" fill="#1a237e"/><circle cx="60" cy="48" r="4.5" fill="#1a237e"/><path d="M46,58 L50,66 L54,58 Z" fill="#e65100"/>`;
      } else if (bshape === "parrot") {
        shape = `<ellipse cx="46" cy="56" rx="26" ry="17" fill="${c1}"/><path d="M46,38 L38,16 L52,32 Z" fill="${c3}"/><path d="M40,50 Q20,42 12,58 Q28,54 42,62 Z" fill="${c2}"/><circle cx="58" cy="52" r="5" fill="#fff"/><circle cx="59" cy="52" r="2.4" fill="#1a237e"/><path d="M68,54 Q82,54 68,66 Z" fill="#ffca28"/>`;
      } else if (bshape === "wader") {
        shape = `<ellipse cx="44" cy="62" rx="22" ry="14" fill="${c1}"/><path d="M56,58 Q76,48 70,24" stroke="${c1}" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="70" cy="22" r="7" fill="#fff"/><circle cx="72" cy="21" r="3" fill="#1a237e"/><path d="M76,22 L90,18 L76,28 Z" fill="#e65100"/><line x1="38" y1="74" x2="38" y2="90" stroke="${c3}" stroke-width="3"/><line x1="50" y1="74" x2="50" y2="90" stroke="${c3}" stroke-width="3"/>`;
      } else if (bshape === "penguin") {
        shape = `<ellipse cx="50" cy="58" rx="22" ry="26" fill="${c3}"/><ellipse cx="50" cy="62" rx="13" ry="18" fill="#f5f5f5"/><ellipse cx="27" cy="50" rx="8" ry="16" fill="${c1}"/><ellipse cx="73" cy="50" rx="8" ry="16" fill="${c1}"/><circle cx="42" cy="38" r="5" fill="#fff"/><circle cx="58" cy="38" r="5" fill="#fff"/><circle cx="43" cy="38" r="2.4" fill="#1a237e"/><circle cx="59" cy="38" r="2.4" fill="#1a237e"/><path d="M44,44 L56,44 L50,50 Z" fill="#ffca28"/>`;
      } else if (bshape === "raptor") {
        shape = `<ellipse cx="50" cy="55" rx="24" ry="16" fill="${c1}"/><path d="M50,42 Q20,30 8,52 Q30,45 50,55 Z" fill="${c3}"/><path d="M50,42 Q80,30 92,52 Q70,45 50,55 Z" fill="${c3}"/><path d="M38,42 L46,46" stroke="${bg}" stroke-width="3"/><path d="M62,42 L54,46" stroke="${bg}" stroke-width="3"/><circle cx="50" cy="48" r="3" fill="#ffca28"/><path d="M62,52 L78,50 L62,60 Z" fill="#212121"/>`;
      } else {
        shape = [
          `<ellipse cx="48" cy="56" rx="26" ry="17" fill="${c1}"/><path d="M50,45 L76,29 L60,53 Z" fill="${c2}"/><circle cx="33" cy="49" r="4" fill="${bg}"/>`,
          `<ellipse cx="50" cy="60" rx="27" ry="15" fill="${c1}"/><path d="M50,58 Q70,40 82,52 Q65,55 50,64 Z" fill="${c2}"/><circle cx="30" cy="55" r="4" fill="${bg}"/><path d="M22,55 L12,52 L22,60 Z" fill="${c2}"/>`,
        ][variantIdx % 2];
      }
      break;
    }
    case "obstacles": {
      // Кіберпанк — реальні неонові вежі, як і в грі; решта лишається
      // стандартним силуетом перешкод + свій тон.
      if (OBSTACLE_SHAPES[key] === "cyberpunk") {
        shape = `<rect x="16" y="50" width="16" height="36" fill="${bg}" stroke="${c1}" stroke-width="2"/><rect x="42" y="26" width="16" height="60" fill="${bg}" stroke="${c1}" stroke-width="2"/><rect x="68" y="42" width="16" height="44" fill="${bg}" stroke="${c1}" stroke-width="2"/>${[0,1,2,3,4].map(i=>`<rect x="18" y="${56+i*6}" width="12" height="2" fill="${c1}" opacity=".8"/>`).join("")}${[0,1,2,3,4,5,6].map(i=>`<rect x="44" y="${32+i*7}" width="12" height="2" fill="${c1}" opacity=".8"/>`).join("")}`;
      } else {
        shape = `<rect x="18" y="55" width="18" height="30" rx="3" fill="${c1}"/><rect x="43" y="38" width="18" height="47" rx="3" fill="${c2}"/><rect x="68" y="60" width="14" height="25" rx="3" fill="${c1}"/>`;
      }
      break;
    }
    case "boss": {
      // Той самий силует-акцент, що й у drawBoss() (BOSS_SHAPES), поверх базового монстро-тіла.
      const boshape = BOSS_SHAPES[key] || "";
      const base = `<path d="M20,50 Q20,20 50,20 Q80,20 80,50 Q80,75 50,85 Q20,75 20,50 Z" fill="${c1}"/><circle cx="38" cy="48" r="5" fill="${bg}"/><circle cx="62" cy="48" r="5" fill="${bg}"/>`;
      if (boshape === "dragon") {
        shape = base + `<path d="M28,26 L18,8 L34,22 Z" fill="${c3}"/><path d="M72,26 L82,8 L66,22 Z" fill="${c3}"/><path d="M18,55 L4,48 L16,68 Z" fill="${c2}"/><path d="M82,55 L96,48 L84,68 Z" fill="${c2}"/><path d="M50,85 L56,98 L44,94 Z" fill="${c3}"/>`;
      } else if (boshape === "robot") {
        shape = base + `<line x1="50" y1="20" x2="50" y2="8" stroke="${c2}" stroke-width="3"/><circle cx="50" cy="8" r="4" fill="#ff1744"/><rect x="35" y="60" width="30" height="8" fill="#0a0a0a"/><rect x="38" y="61" width="6" height="6" fill="#4fc3f7"/><rect x="47" y="61" width="6" height="6" fill="#4fc3f7"/><rect x="56" y="61" width="6" height="6" fill="#4fc3f7"/>`;
      } else if (boshape === "printer") {
        shape = base + `<rect x="22" y="16" width="56" height="10" fill="${c3}"/><rect x="35" y="58" width="30" height="18" fill="#f5f5f5"/><line x1="39" y1="64" x2="61" y2="64" stroke="#bbb" stroke-width="2"/><line x1="39" y1="70" x2="61" y2="70" stroke="#bbb" stroke-width="2"/>`;
      } else if (boshape === "queen") {
        shape = base + `<path d="M28,22 L36,4 L46,20 L54,4 L64,20 L72,4 L80,22 Z" fill="#ffd740"/>`;
      } else if (boshape === "ghost") {
        shape = `<path d="M20,55 Q20,20 50,20 Q80,20 80,55 L80,85 Q72,75 64,85 Q56,75 48,85 Q40,75 32,85 Q24,75 20,85 Z" fill="${c1}" opacity=".8"/><circle cx="38" cy="48" r="5" fill="${bg}"/><circle cx="62" cy="48" r="5" fill="${bg}"/>`;
      } else if (boshape === "kraken") {
        shape = base.replace(/Q20,75 20,50/,'Q20,75 20,50') + `${[0,1,2,3].map(i=>`<path d="M${28+i*15},80 Q${34+i*15},95 ${26+i*15},100 Q${20+i*15},92 ${28+i*15},80 Z" fill="${c3}"/>`).join("")}`;
      } else if (boshape === "golem") {
        shape = base + `<path d="M32,28 L40,50 L34,66" stroke="${c3}" stroke-width="2" fill="none"/><path d="M70,32 L60,55" stroke="${c3}" stroke-width="2" fill="none"/>`;
      } else {
        shape = `<circle cx="50" cy="52" r="27" fill="${c1}"/><path d="M22,42 L30,22 L38,42 M62,42 L70,22 L78,42" stroke="${c2}" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="40" cy="50" r="5" fill="${bg}"/><circle cx="60" cy="50" r="5" fill="${bg}"/>`;
      }
      break;
    }
    case "weather": {
      const variants = [
        `<ellipse cx="44" cy="42" rx="25" ry="15" fill="${c2}"/><ellipse cx="64" cy="48" rx="17" ry="12" fill="${c1}"/><line x1="35" y1="68" x2="30" y2="84" stroke="${c1}" stroke-width="4" stroke-linecap="round"/><line x1="55" y1="68" x2="50" y2="84" stroke="${c1}" stroke-width="4" stroke-linecap="round"/>`,
        `<circle cx="35" cy="30" r="14" fill="${c2}"/>${[0,1,2,3,4,5].map(i=>`<line x1="35" y1="30" x2="${35+22*Math.cos(i*Math.PI/3)}" y2="${30+22*Math.sin(i*Math.PI/3)}" stroke="${c2}" stroke-width="3" stroke-linecap="round"/>`).join("")}<ellipse cx="58" cy="65" rx="26" ry="16" fill="${c1}"/>`,
      ];
      shape = variants[variantIdx % variants.length];
      break;
    }
    case "timer": shape = `<circle cx="50" cy="56" r="27" fill="${c1}" stroke="${c2}" stroke-width="4"/><line x1="50" y1="56" x2="50" y2="40" stroke="${bg}" stroke-width="4" stroke-linecap="round"/><line x1="50" y1="56" x2="61" y2="56" stroke="${bg}" stroke-width="4" stroke-linecap="round"/><rect x="42" y="19" width="16" height="8" rx="3" fill="${c2}"/>`; break;
    case "background": shape = `<rect x="13" y="17" width="74" height="57" rx="6" fill="${bg}" stroke="${c2}" stroke-width="3"/><circle cx="30" cy="34" r="6" fill="${c2}"/><path d="M13,64 L38,44 L55,59 L70,41 L87,64 Z" fill="${c1}"/>`; break;
    case "keyboard": shape = `<rect x="13" y="36" width="74" height="38" rx="6" fill="${c1}"/>${[0,1,2,3].map(i=>`<rect x="${19+i*17}" y="44" width="12" height="9" rx="2" fill="${c2}"/><rect x="${19+i*17}" y="58" width="12" height="9" rx="2" fill="${c2}"/>`).join("")}`; break;
    case "wheel": shape = `<circle cx="50" cy="50" r="30" fill="none" stroke="${c1}" stroke-width="8"/><circle cx="50" cy="50" r="9" fill="${c2}"/>`; break;
    case "letters": shape = `<text x="50" y="68" font-size="52" font-family="'Unbounded',sans-serif" font-weight="800" fill="${c1}" text-anchor="middle">A</text>`; break;
    default: shape = `<circle cx="50" cy="50" r="28" fill="${c1}"/>`;
  }
  const gradId = 'g' + Math.abs(_hashHue(key + poolKey)).toString(36);
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="${gradId}h" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stop-color="${shadeColorCss(c2,18)}"/>
        <stop offset="100%" stop-color="${shadeColorCss(c1,-10)}"/>
      </radialGradient>
      <linearGradient id="${gradId}b" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${shadeColorCss(c1,16)}"/>
        <stop offset="100%" stop-color="${shadeColorCss(c1,-18)}"/>
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="96" height="96" rx="18" fill="${bg}"/>
    <ellipse cx="50" cy="90" rx="26" ry="5" fill="#000" opacity=".25"/>
    ${shape.replace(new RegExp(_escRe(c2),'g'), `url(#${gradId}h)`).replace(new RegExp(_escRe(c1),'g'), `url(#${gradId}b)`)}
  </svg>`;
}
function _escRe(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function shadeColorCss(hslStr, delta){
  const m = hslStr.match(/hsl\(([\d.]+),\s*([\d.]+)%,\s*([\d.]+)%\)/);
  if(!m) return hslStr;
  const h=parseFloat(m[1]), sat=parseFloat(m[2]), light=Math.max(0,Math.min(100,parseFloat(m[3])+delta));
  return `hsl(${h},${sat}%,${light}%)`;
}
// Кеш каталогу пулів (щоб не смикати сервер щоразу) + пошук, якому
// пулу належить конкретна назва — потрібно, щоб малювати правильну
// іконку для вже отриманого предмета (де відома лише назва).
let SKINS_CATALOG_CACHE = null;
async function loadSkinsCatalog(){
  if (SKINS_CATALOG_CACHE) return SKINS_CATALOG_CACHE;
  try {
    const r = await api("skins_catalog");
    if (r.ok) SKINS_CATALOG_CACHE = r.pools;
  } catch(e) {}
  return SKINS_CATALOG_CACHE || [];
}
function findPoolKeyForItem(name, pools){
  if (!name || !pools) return null;
  for (const p of pools) { if (p.items.includes(name)) return p.key; }
  return null;
}

function chestArtSvg(chestId, size, animated){
  size = size || 44;
  const m = CHEST_META[chestId] || { base:"#333a52", lid:"#8890AA", accent:"#232a45", gem:"#F3F1EA" };
  const lid = `
    <path d="M8,40 Q8,15 50,15 Q92,15 92,40 Z" fill="${m.lid}"/>
    <path d="M8,40 Q8,15 50,15 Q92,15 92,40 L92,29 Q92,21 50,21 Q8,21 8,29 Z" fill="#fff" opacity="0.18"/>
    <rect x="43" y="11" width="14" height="30" rx="2" fill="${m.accent}"/>`;
  return `<svg viewBox="0 0 100 82" width="${size}" height="${Math.round(size*0.82)}" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="76" rx="36" ry="4" fill="#000" opacity="0.28"/>
    <rect x="10" y="40" width="80" height="32" rx="7" fill="${m.base}"/>
    <rect x="10" y="40" width="80" height="9" fill="${m.accent}" opacity="0.55"/>
    <rect x="10" y="60" width="80" height="6" fill="${m.accent}" opacity="0.4"/>
    ${animated ? `<g class="chest-lid-anim">${lid}</g>` : lid}
    <rect x="42" y="35" width="16" height="19" rx="3" fill="${m.accent}"/>
    <circle cx="50" cy="42" r="3.4" fill="${m.gem}"/>
    <rect x="48.6" y="42" width="2.8" height="7" fill="${m.gem}"/>
  </svg>`;
}

// Повна сценка відкриття кейсу для модалки: кришка прочиняється,
// спалах + пара іскор, і з невеликою затримкою — сам приз "виринає".
function _rewardVisual(text){
  const t = String(text||"");
  if (/осколк/i.test(t))      return { icon:"🔮", color:"#8B7CF6" };
  if (/VIP|год\.\s*VIP/i.test(t)) return { icon:"👑", color:"#F2C879" };
  if (/á-coin|💰/i.test(t))   return { icon:"💰", color:"#3FE0A0" };
  if (/скін|предмет|косметик/i.test(t)) return { icon:"🎨", color:"#3FE0A0" };
  return { icon:"🎁", color:"#3FE0A0" };
}
function chestOpenSceneHtml(chestId, chestName, resultText){
  const sparks = ["✨","⭐","💫","✨"].map((s,i) => {
    const dx = [-40, 36, -18, 22][i], delay = 0.3 + i*0.07;
    return `<div class="chest-spark" style="--dx:${dx}px; animation-delay:${delay}s; left:${42+i*6}%;">${s}</div>`;
  }).join("");
  const rv = _rewardVisual(resultText);
  return `
    <div class="chest-open-wrap">
      <div class="chest-shock"></div>
      <div class="chest-flash"></div>
      <div class="chest-glow"></div>
      ${sparks}
      <div class="chest-shake">${chestArtSvg(chestId, 76, true)}</div>
    </div>
    <div class="mh reward-pop" style="text-align:center;">🎉 ${esc(chestName)} відкрито!</div>
    <div class="reward-card reward-pop" style="--rc:${rv.color};">
      <div class="reward-card-icon">${rv.icon}</div>
      <div class="reward-card-text">${esc(resultText).replace(/\*/g,'')}</div>
    </div>
  `;
}

function dropLabel(d){
  if (d.label) return d.label;
  if (d.pool) return `Косметика рівня ${d.rarity} (сюрприз)`;
  if (d.type === "coins") return d.amount + " á-coin";
  if (d.type === "shard") return d.amount + " осколок";
  if (d.type === "vipHours") return d.amount + " год. VIP (у банк)";
  return d.type;
}
let CHESTS_STATE = null;
let CHEST_ITEMS_STATE = [];
let CHEST_SLOTS_STATE = [];
let SLOT_TICK_TIMER = null;
const CHEST_SLOTS_MAX_CLIENT = 4;

async function renderInventory(){
  const screen = document.getElementById("screen");
  screen.innerHTML = `<div class="h1">🎒 Інвентар</div><div id="invBody">${loadingBlock()}</div>`;
  await loadInventoryData();
  paintInventory();
}
let VIP_TICKETS_STATE = [];
const VIP_TICKET_DEFS = {
  "24h":  { hours:24,  price:20,  label:"24 години" },
  "48h":  { hours:48,  price:35,  label:"48 годин" },
  "week": { hours:168, price:100, label:"Тиждень" },
  "month":{ hours:720, price:300, label:"Місяць" },
};
let EQUIPPED_SKINS_CACHE = {};
async function loadInventoryData(){
  try {
    const [r, myItems, slotsRes, ticketsRes, equippedRes] = await Promise.all([apiRaw("get_inventory"), api("my_items"), api("chest_slots_get"), api("vip_my_tickets"), api("get_equipped_skins"), loadSkinsCatalog()]);
    CHESTS_STATE = r.ok ? r : null;
    CHEST_ITEMS_STATE = (myItems.ok ? myItems.items : []).filter(it => !it.isMerch && /^Кейс:|^Крафт:/.test(it.name||""));
    CHEST_SLOTS_STATE = slotsRes.ok ? slotsRes.slots : [];
    VIP_TICKETS_STATE = ticketsRes.ok ? ticketsRes.tickets : [];
    EQUIPPED_SKINS_CACHE = equippedRes.ok ? equippedRes.equipped : {};
  } catch(e) { CHESTS_STATE = null; }
}
function paintInventory(){
  const wrap = document.getElementById("invBody");
  if (!wrap) return;
  if (!CHESTS_STATE) { wrap.innerHTML = emptyBlock("⚠️","Помилка з'єднання",""); return; }
  const eff = CHESTS_STATE.effects || {};
  const vip = (DASH && DASH.vip) || { active:false, until:null, bankedHours: eff.vipBankedHours||0 };
  wrap.innerHTML = `
    <div class="btn-row" style="margin-bottom:14px;">
      <button class="btn secondary" onclick="openMyItemsModal()">🛍 Товари aShop</button>
      <button class="btn secondary" onclick="openMySkinsModal()">🎨 Мої скіни</button>
    </div>

    <div class="h2">👑 VIP-статус</div>
    <div class="card">
      <div class="row between">
        <div style="font-weight:700; font-size:13.5px;">${vip.active ? '✅ VIP активний' : '😴 VIP не активний'}</div>
        <div class="badge ${vip.active?'ok':''}">${vip.active ? ('до '+fmtDate(vip.until)) : 'немає'}</div>
      </div>
      <div class="sub" style="margin:8px 0;">У банку: <b>${vip.bankedHours} год.</b></div>
      ${vip.bankedHours > 0 ? `
        <button class="btn" onclick="activateVipHours(${vip.bankedHours})">👑 Активувати ${vip.bankedHours} год.</button>` : `<div class="sub">Години падають з кейсів (Абсолют, Золота/Епічна/Легендарна скриня).</div>`}
      <div class="sub" style="margin-top:8px; font-size:11px;">VIP дає: максимальну прокачку в іграх, пріоритет у підтримці, безкоштовну підказку в ребусі, зміну відповіді в ребусі, +1 спробу в «Щасливчику», щоденні бонуси нижче.</div>
    </div>

    <div class="h2">🎟 VIP-тикети</div>
    <div class="sub" style="margin:-6px 2px 10px;">Активується одразу цілим тикетом (без розбиття на години), стакується з наявним VIP.</div>
    ${VIP_TICKETS_STATE.length ? `<div class="list" style="margin-bottom:10px;">${VIP_TICKETS_STATE.map(t => `
      <div class="item"><div class="ic">🎟</div><div class="txt"><div class="t">${esc((VIP_TICKET_DEFS[t.type]||{}).label || t.type)}</div><div class="s">Не активовано</div></div>
      <button class="btn sm" style="width:auto; padding:8px 12px;" onclick="activateVipTicket(${t.row})">Активувати</button></div>
    `).join("")}</div>` : ""}
    <div class="btn-row" style="flex-wrap:wrap;">
      ${Object.entries(VIP_TICKET_DEFS).map(([id,t]) => `<button class="btn secondary sm" style="flex:1 1 45%;" ${CHESTS_STATE.balance<t.price?'disabled':''} onclick="buyVipTicket('${id}')">${esc(t.label)}<br><span class="mono">${t.price} 💰</span></button>`).join("")}
    </div>

    <div class="h2">🎁 Щоденні VIP-бонуси</div>
    <div class="list">
      <div class="item"><div class="ic">🥈</div><div class="txt"><div class="t">Безкоштовний Silver Chest</div><div class="s">Раз на добу, потрапляє в слот</div></div>
        <button class="btn sm" style="width:auto; padding:8px 12px;" ${(!vip.active||vip.dailySilverClaimed)?'disabled':''} onclick="claimVipDaily('silver')">${vip.dailySilverClaimed?'Отримано':'Забрати'}</button></div>
      <div class="item"><div class="ic">💰</div><div class="txt"><div class="t">Безкоштовний «Авангард»</div><div class="s">Раз на добу, відкривається одразу</div></div>
        <button class="btn sm" style="width:auto; padding:8px 12px;" ${(!vip.active||vip.dailyAvangardClaimed)?'disabled':''} onclick="claimVipDaily('avangard')">${vip.dailyAvangardClaimed?'Отримано':'Забрати'}</button></div>
      <div class="item"><div class="ic">⚡️</div><div class="txt"><div class="t">Миттєве розблокування</div><div class="s">1 раз на добу, для кейсу що розблоковується</div></div>
        <div class="badge ${vip.dailyInstantUnlockClaimed?'ok':''}">${vip.dailyInstantUnlockClaimed?'Використано':(vip.active?'Доступно':'—')}</div></div>
    </div>

    <div class="h2">📦 Кейси-слоти <span class="hint">${CHEST_SLOTS_STATE.length}${(DASH && DASH.isAdmin) ? ' (без ліміту)' : ('/'+CHEST_SLOTS_MAX_CLIENT)}</span></div>
    <button class="btn secondary sm" style="margin-bottom:10px;" onclick="openPaidChestsModal()">🧧 Кейси — платні (відкрити зараз)</button>
    <div id="chestSlotsGrid">${slotsSectionHtml()}</div>

    <div class="h2">Заряди</div>
    <div class="list">
      <div class="item"><div class="ic">💡</div><div class="txt"><div class="t">Безкоштовна підказка</div><div class="s">Ребус — приз не зменшується</div></div><div class="right mono">${eff.freeHint||0}</div></div>
      <div class="item"><div class="ic">🎲</div><div class="txt"><div class="t">Бонус-спроба</div><div class="s">+1 спроба у «Щасливчику»</div></div><div class="right mono">${eff.diceBonus||0}</div></div>
      <div class="item"><div class="ic">🛡</div><div class="txt"><div class="t">Імунітет стріку</div><div class="s">Спрацьовує автоматично</div></div><div class="right mono">${eff.streakImmunity||0}</div></div>
      <div class="item"><div class="ic">⚡️</div><div class="txt"><div class="t">x3 щоденний бонус</div><div class="s">${eff.x3Active?('Діє до '+fmtDate(eff.x3Until)):'Не активний'}</div></div><div class="right">${eff.x3Active?'<span class="badge ok">АКТИВНО</span>':'<span class="mono">0</span>'}</div></div>
    </div>

    <div class="h2">Крафт з осколків <span class="hint">🔮 ${fmt(CHESTS_STATE.shards)}</span></div>
    <div class="btn-row" style="flex-wrap:wrap;">
      ${(CHESTS_STATE.craftRecipes||[]).map(rc => `<button class="btn secondary sm" style="flex:1 1 30%;" ${CHESTS_STATE.shards<rc.cost?'disabled':''} onclick="craftItem('${rc.id}')">${esc(rc.name)}<br><span class="mono">${rc.cost} 🔮</span></button>`).join("")}
    </div>
  `;
  startSlotTicker();
}

// ── Кнопка "🛍 Товари aShop" — той самий список товарів/мерчу, що й раніше
// на Головній/Магазині, тепер доступний і з Інвентаря окремою модалкою.
function openMyItemsModal(){
  showModal(`<div class="mh">🛍 Товари aShop</div><div id="myItemsWrap">${loadingBlock()}</div>`);
  loadMyItems("myItemsWrap");
}

// ── Кнопка "🧧 Кейси — платні" — каталог платних кейсів (той самий, що в
// Магазині), відкриття кейса й нарахування призу відбувається одразу, без
// слотів (це стосується лише безкоштовних кейсів з ігор).
function openPaidChestsModal(){
  showModal(`<div class="mh">🧧 Кейси — платні</div>
    <div class="sub" style="margin:-2px 2px 10px;">Кейс відкривається одразу після покупки, за поточну вартість.</div>
    <div class="list" id="buyChestListModal">${buyChestListHtml()}</div>`);
  document.querySelectorAll("#buyChestListModal [data-buy-chest]").forEach(el =>
    el.addEventListener("click", () => openBuyChestSheet(el.getAttribute("data-buy-chest"))));
}

// ── Мої скіни: спочатку обираємо гру, потім бачимо скіни саме з неї ──
function openMySkinsModal(){
  showModal(`<div class="mh">🎨 Мої скіни</div><div id="mySkinsSection">${loadingBlock()}</div>`);
  paintMySkins();
}
let MY_SKINS_GAME = "runner";
function skinGameOf(poolKey){
  if (!poolKey) return null;
  if (poolKey.indexOf("runner") === 0) return "runner";
  if (poolKey.indexOf("wordle") === 0) return "wordle";
  if (poolKey.indexOf("circle") === 0) return "circle";
  return null;
}
function paintMySkins(){
  const sec = document.getElementById("mySkinsSection");
  if (!sec) return;
  if (!CHEST_ITEMS_STATE.length) { sec.innerHTML = emptyBlock("🎒","Поки що порожньо","Відкривайте кейси або крафтіть із осколків"); return; }

  const groups = {};
  CHEST_ITEMS_STATE.forEach(it => {
    const shortName = (it.name||"").replace(/\s*\(\d+.*?\)/,"").trim();
    if (!groups[shortName]) groups[shortName] = { name: shortName, comment: it.comment, items: [] };
    groups[shortName].items.push(it);
  });
  const pools = SKINS_CATALOG_CACHE || [];
  const resolvedGroups = Object.values(groups).map(g => {
    const pureName = g.name.replace(/^Крафт: |^Кейс: /,"").replace(/\s*\([^)]*\)\s*$/,"");
    const poolKey = findPoolKeyForItem(pureName, pools);
    return Object.assign(g, { poolKey, game: skinGameOf(poolKey) });
  });

  const games = [
    { id:"runner", ic:"🏃", lb:"Runner" },
    { id:"wordle", ic:"🔤", lb:"Вгадай слово" },
    { id:"circle", ic:"🔵", lb:"Слова по колу" },
  ];
  const tabsHtml = games.map(g => {
    const count = resolvedGroups.filter(x => x.game === g.id).length;
    return `<div class="t2" data-my-skins-game="${g.id}">${g.ic} ${g.lb} <span class="badge" style="margin-left:3px;">${count}</span></div>`;
  }).join("");

  const shown = resolvedGroups.filter(g => g.game === MY_SKINS_GAME);
  const gridHtml = shown.length ? `<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(84px, 1fr)); gap:10px;">` +
    shown.map(g => {
      const available = g.items.filter(x => x.status === "Не використано");
      const countLabel = g.items.length > 1 ? `<div class="badge" style="position:absolute; top:-4px; right:-4px;">×${g.items.length}</div>` : "";
      const cleanName = g.name.replace(/^Крафт: предмет рівня /,"").replace(/^Крафт: |^Кейс: /,"").replace(/\s*\([^)]*\)\s*$/,"");
      const isEquipped = !!g.poolKey && EQUIPPED_SKINS_CACHE[g.poolKey] === cleanName;
      return `<div data-chest-group="${esc(g.name)}" style="cursor:pointer; text-align:center; position:relative;">
        ${countLabel}
        <div style="opacity:${available.length>0?1:.4}; ${isEquipped?'filter:drop-shadow(0 0 6px var(--success));':''}">${skinIconSvg(g.poolKey, cleanName, 68)}</div>
        <div class="sub" style="font-size:10px; margin-top:3px; line-height:1.25;">${esc(cleanName)}</div>
        ${isEquipped ? `<div class="badge ok" style="margin-top:2px;">✓ Екіпіровано</div>` : (available.length>0 ? `<div class="badge new" style="margin-top:2px;">Обрати →</div>` : `<div class="badge ok" style="margin-top:2px;">Отримано</div>`)}
      </div>`;
    }).join("") + `</div>` : emptyBlock("🎨","Тут поки порожньо","Скіни цієї гри ще не випадали");

  sec.innerHTML = `<div class="tabs2" style="flex-wrap:wrap; gap:4px;">${tabsHtml}</div>${gridHtml}`;
  sec.querySelectorAll("[data-my-skins-game]").forEach(el => {
    if (el.getAttribute("data-my-skins-game") === MY_SKINS_GAME) el.classList.add("active");
    el.addEventListener("click", () => { MY_SKINS_GAME = el.getAttribute("data-my-skins-game"); paintMySkins(); });
  });
  sec.querySelectorAll("[data-chest-group]").forEach(el => el.addEventListener("click", () => openItemGroup(el.getAttribute("data-chest-group"))));
}

// ── Слоти кейсів ──
function fmtSecs(sec){
  if (sec<=0) return "готово!";
  const h = Math.floor(sec/3600), m = Math.floor((sec%3600)/60), s = sec%60;
  if (h>0) return `${h}г ${m}хв`;
  if (m>0) return `${m}хв ${s}с`;
  return `${s}с`;
}
function slotsSectionHtml(){
  const slots = CHEST_SLOTS_STATE;
  const cells = [];
  const totalCells = Math.max(CHEST_SLOTS_MAX_CLIENT, slots.length); // адмінам ліміт не застосовується — покажемо всі
  for (let i=0;i<totalCells;i++){
    const s = slots[i];
    if (!s) { cells.push(`<div class="card" style="text-align:center; opacity:.5;"><div style="font-size:24px;">➕</div><div class="sub" style="margin-top:4px;">Порожньо</div></div>`); continue; }
    let body;
    if (s.status === "Очікує") {
      const anyUnlocking = slots.some(x=>x.status==="Розблоковується");
      body = `<div class="btn-row" style="margin-top:8px;">
        <button class="btn secondary sm" ${anyUnlocking?'disabled':''} onclick="chestSlotStart(${s.row})">🔓 Почати</button>
        <button class="btn danger sm" style="flex:none; width:auto; padding:9px 11px;" onclick="chestSlotDispose(${s.row},'${s.kind}')">${s.kind==='paid'?'♻️':'💰'}</button>
      </div>`;
    } else if (s.status === "Розблоковується" && !s.ready) {
      const vip = (DASH && DASH.vip) || {};
      const canInstant = vip.active && !vip.dailyInstantUnlockClaimed;
      body = `<div class="sub mono" style="text-align:center; font-size:14px; margin:6px 0 8px;">⏳ ${fmtSecs(s.secondsLeft)}</div>
        <div class="btn-row">
          <button class="btn secondary sm" onclick="openRushModal(${s.row})">⚡</button>
          <button class="btn danger sm" style="flex:none; width:auto; padding:9px 11px;" onclick="chestSlotDispose(${s.row},'${s.kind}')">${s.kind==='paid'?'♻️':'💰'}</button>
        </div>
        ${canInstant ? `<button class="btn sm" style="margin-top:6px; background:linear-gradient(155deg,#F2A93B,#B15EF0); color:#1a0f2e;" onclick="claimVipInstantUnlock(${s.row})">👑 Миттєво (безкоштовно)</button>` : ""}`;
    } else {
      body = `<button class="btn sm" style="margin-top:8px;" onclick="chestSlotOpen(${s.row})">🎁 Відкрити!</button>`;
    }
    cells.push(`<div class="card" style="text-align:center;">
      <div style="display:flex; justify-content:center;">${chestArtSvg(s.chestId, 52)}</div>
      <div style="font-weight:700; font-size:11.5px; margin-top:4px; line-height:1.3;">${esc(s.name)}</div>
      ${body}
    </div>`);
  }
  return `<div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">${cells.join("")}</div>`;
}
function startSlotTicker(){
  if (SLOT_TICK_TIMER) clearInterval(SLOT_TICK_TIMER);
  SLOT_TICK_TIMER = setInterval(() => {
    if (TAB !== "inventory") { clearInterval(SLOT_TICK_TIMER); SLOT_TICK_TIMER = null; return; }
    CHEST_SLOTS_STATE.forEach(s => {
      if (s.status === "Розблоковується" && s.secondsLeft > 0) {
        s.secondsLeft -= 1;
        if (s.secondsLeft <= 0) s.ready = true;
      }
    });
    const grid = document.getElementById("chestSlotsGrid");
    if (grid) grid.innerHTML = slotsSectionHtml();
  }, 1000);
}
async function chestSlotStart(row){
  try {
    const r = await api("chest_slot_start", { row });
    if (!r.ok) { toast(r.error === "another_unlocking" ? "Спочатку завершіть поточне розкриття" : "Помилка", "err"); return; }
    toast("Розблокування розпочато! 🔓", "ok");
    await loadInventoryData(); paintInventory();
  } catch(e) { toast("Помилка з'єднання", "err"); }
}
function chestSlotDispose(row, kind){
  if (kind === "paid") {
    if (!confirm("Розібрати кейс на осколки? Шанс отримати 1 осколок — 50%.")) return;
    disposeChestSlot(row, "dismantle");
  } else {
    if (!confirm("Продати кейс боту за фіксовану ціну á-coin?")) return;
    disposeChestSlot(row, "sell");
  }
}
async function disposeChestSlot(row, mode){
  try {
    const r = await api(mode === "dismantle" ? "chest_slot_dismantle" : "chest_slot_sell", { row });
    if (!r.ok) { toast("Помилка", "err"); return; }
    if (mode === "dismantle") toast(r.won ? "🔮 +1 осколок!" : "Нічого не випало", r.won?"ok":undefined);
    else toast(`Продано за ${r.price} á-coin`, "ok");
    await Promise.all([refreshDashboard(), loadInventoryData()]); paintInventory();
  } catch(e) { toast("Помилка з'єднання", "err"); }
}
function openRushModal(row){
  showModal(`
    <div class="mh">⚡ Прискорити розкриття</div>
    <div class="sub" style="margin-bottom:10px;">1 á-coin = 2 години. Баланс: ${fmt(DASH.balance)} 💰</div>
    <input class="field" id="rushAcoin" type="number" min="1" placeholder="Кількість á-coin" style="margin-bottom:10px;">
    <button class="btn" onclick="submitRush(${row})">⚡ Прискорити</button>
  `);
}
async function submitRush(row){
  const acoin = parseInt(document.getElementById("rushAcoin").value);
  if (!acoin || acoin<=0) { toast("Вкажіть кількість", "err"); return; }
  try {
    const r = await api("chest_slot_rush", { row, acoin });
    if (!r.ok) { toast(r.error === "insufficient_funds" ? "Недостатньо á-coin" : "Помилка", "err"); return; }
    toast(`Витрачено ${r.spent} á-coin`, "ok");
    closeModal();
    await Promise.all([refreshDashboard(), loadInventoryData()]); paintInventory();
  } catch(e) { toast("Помилка з'єднання", "err"); }
}
async function chestSlotOpen(row){
  try {
    const r = await api("chest_slot_open", { row });
    if (!r.ok) { toast(r.error === "not_ready" ? "Ще не готово" : "Помилка", "err"); return; }
    showModal(chestOpenSceneHtml(r.chestId, r.chestName, r.resultText));
    await Promise.all([refreshDashboard(), loadInventoryData()]); paintInventory();
  } catch(e) { toast("Помилка з'єднання", "err"); }
}

// ── Покупка кейсу — платні кейси відкриваються МИТТЄВО (не через
// слоти — слоти лише для безкоштовних кейсів з ігор) ──
function buyChestListHtml(){
  const r = CHESTS_STATE;
  if (!r) return "";
  return (r.chests||[]).map(c => {
    const locked = r.balance < c.cost;
    return `<div class="item" data-buy-chest="${c.id}" style="cursor:pointer">
      <div style="flex:none;">${chestArtSvg(c.id, 34)}</div>
      <div class="txt"><div class="t">${esc(c.name)}</div><div class="s">${esc(c.desc)}</div></div>
      <div class="right mono" style="color:${locked?'var(--text-faint)':'var(--brass-bright)'}; font-weight:700;">${c.cost} 💰</div>
    </div>`;
  }).join("");
}
function openBuyChestSheet(chestId){
  const c = CHESTS_STATE.chests.find(x => x.id === chestId);
  if (!c) return;
  const locked = CHESTS_STATE.balance < c.cost;
  showModal(`
    <div style="display:flex; justify-content:center; margin-bottom:8px;">${chestArtSvg(c.id, 84)}</div>
    <div class="mh" style="text-align:center;">${esc(c.name)}</div>
    <div class="sub" style="margin-bottom:10px; text-align:center;">${esc(c.desc)}</div>
    <div class="list" style="margin-bottom:14px;">${c.drops.map(d => `
      <div class="item"><div class="ic mono" style="font-size:12px;">${d.chance}%</div><div class="txt"><div class="t">${esc(dropLabel(d))}</div></div></div>
    `).join("")}</div>
    <button class="btn" ${locked?'disabled':''} onclick="buyChest('${c.id}')">${locked?'Недостатньо á-coin':('🎁 Відкрити зараз — '+c.cost+' 💰')}</button>
  `);
}
async function buyChest(chestId){
  closeModal();
  toast("Відкриваємо кейс...", "ok");
  try {
    const r = await apiRaw("chest_open", { chestId });
    if (!r.ok) { toast(r.error === "insufficient_funds" ? "Недостатньо á-coin" : "Помилка", "err"); return; }
    showModal(chestOpenSceneHtml(r.chest.id, r.chest.name, r.resultText));
    await refreshDashboard();
    await loadShopChests(); // no-op, якщо ми не на вкладці Магазину (наприклад, купили з Інвентаря)
  } catch(e) { toast("Помилка з'єднання", "err"); }
}

// ── Предмети з кейсів (самообслуговування) ──
function openItemGroup(name){
  const items = CHEST_ITEMS_STATE.filter(it => (it.name||"").replace(/\s*\(\d+.*?\)/,"").trim() === name);
  const rarityMatch = name.match(/^Крафт: предмет рівня (Rare|Epic|Legendary)$/);
  const pools = SKINS_CATALOG_CACHE || [];
  const pureName = name.replace(/^Крафт: |^Кейс: /,"").replace(/\s*\([^)]*\)\s*$/,"");
  const poolKey = findPoolKeyForItem(pureName, pools);
  const isEquippable = !!poolKey; // будь-який предмет зі SKIN_POOLS можна екіпірувати
  const isEquipped = isEquippable && EQUIPPED_SKINS_CACHE[poolKey] === pureName;
  showModal(`
    <div style="display:flex; justify-content:center; margin-bottom:8px;">${skinIconSvg(poolKey, pureName, 84)}</div>
    <div class="mh" style="text-align:center;">${esc(name)} <span class="hint">×${items.length}</span></div>
    ${isEquippable ? `
      <div class="sub" style="text-align:center; margin-bottom:10px;">${isEquipped ? '✅ Зараз екіпіровано — застосовано в грі' : '🎨 Косметичний скін'}</div>
      ${!isEquipped ? `<button class="btn" onclick="equipSkin('${poolKey}','${esc(pureName).replace(/'/g,"\\'")}')">🎨 Екіпірувати</button>` : ''}
    ` : `
      <div class="list">${items.map(it => `
        <div class="item">
          <div class="txt"><div class="t">${it.status==='Не використано' ? '⏳ Не використано' : '✅ Використано'}</div><div class="s">${esc(it.comment||'')}</div></div>
          ${it.status==='Не використано' ? (rarityMatch
            ? `<button class="btn sm" style="width:auto; padding:8px 14px;" onclick="openCraftPicker(${it.row}, '${rarityMatch[1]}')">Обрати предмет</button>`
            : `<button class="btn sm" style="width:auto; padding:8px 14px;" onclick="selfUseItem(${it.row})">Використати</button>`) : ''}
        </div>
      `).join("")}</div>
    `}
  `);
}
async function equipSkin(poolKey, itemName){
  try {
    const r = await api("equip_skin", { poolKey, itemName });
    if (!r.ok) { toast(r.error === "not_owned" ? "У вас немає цього предмета" : "Помилка", "err"); return; }
    EQUIPPED_SKINS_CACHE[poolKey] = itemName;
    toast("Екіпіровано! Побачите у Runner 🎉", "ok");
    closeModal();
  } catch(e) { toast("Помилка з'єднання", "err"); }
}
async function openCraftPicker(row, rarity){
  showModal(`<div class="mh">🎁 Оберіть предмет <span class="hint">${esc(rarity)}</span></div>${loadingBlock()}`);
  try {
    const [r, pools] = await Promise.all([api("craft_catalog_get"), loadSkinsCatalog()]);
    const items = (r.ok && r.catalog[rarity]) || [];
    showModal(`
      <div class="mh">🎁 Оберіть предмет <span class="hint">${esc(rarity)}</span></div>
      <div class="list">${items.map(it => {
        const poolKey = findPoolKeyForItem(it, pools);
        return `<div class="item" style="cursor:pointer" onclick="pickCraftItem(${row}, '${esc(it).replace(/'/g,"\\'")}')">
          <div style="flex:none;">${skinIconSvg(poolKey, it, 36)}</div>
          <div class="txt"><div class="t">${esc(it)}</div></div><div class="right">→</div>
        </div>`;
      }).join("")}</div>
    `);
  } catch(e) { showModal(`<div class="mh">⚠️ Немає з'єднання</div>`); }
}
async function pickCraftItem(row, itemName){
  try {
    const r = await api("craft_pick_item", { row, itemName });
    if (!r.ok) { toast(r.error === "already_used" ? "Вже використано" : "Помилка", "err"); return; }
    toast(`Отримано: ${itemName} ✅`, "ok");
    closeModal();
    if (TAB === "inventory") { await loadInventoryData(); paintInventory(); }
  } catch(e) { toast("Помилка з'єднання", "err"); }
}
async function activateVipHours(hours){
  hours = parseInt(hours);
  if (!hours || hours <= 0) { toast("Немає годин для активації", "err"); return; }
  try {
    const r = await api("vip_activate", { hours });
    if (!r.ok) { toast(r.error === "insufficient_hours" ? "Недостатньо годин у банку" : "Помилка", "err"); return; }
    toast(`VIP активовано на ${hours} год.! 👑`, "ok");
    await refreshDashboard();
    paintInventory();
  } catch(e) { toast("Помилка з'єднання", "err"); }
}
async function buyVipTicket(ticketId){
  const t = VIP_TICKET_DEFS[ticketId];
  if (!confirm(`Придбати VIP-тикет «${t.label}» за ${t.price} á-coin?`)) return;
  try {
    const r = await api("vip_buy_ticket", { ticketId });
    if (!r.ok) { toast(r.error === "insufficient_funds" ? "Недостатньо á-coin" : "Помилка", "err"); return; }
    toast("Тикет придбано! Активуйте, коли захочете", "ok");
    await Promise.all([refreshDashboard(), loadInventoryData()]); paintInventory();
  } catch(e) { toast("Помилка з'єднання", "err"); }
}
async function activateVipTicket(row){
  if (!confirm("Активувати цей VIP-тикет цілком прямо зараз?")) return;
  try {
    const r = await api("vip_activate_ticket", { row });
    if (!r.ok) { toast("Помилка", "err"); return; }
    toast("VIP активовано! 👑", "ok");
    await refreshDashboard();
    if (TAB === "inventory") { await loadInventoryData(); paintInventory(); }
    else if (TAB === "games") { closeModal(); renderGames(); }
  } catch(e) { toast("Помилка з'єднання", "err"); }
}
async function claimVipDaily(kind){
  try {
    const r = await api(kind === "silver" ? "vip_daily_silver" : "vip_daily_avangard");
    if (!r.ok) {
      const msg = r.error === "already_claimed" ? "Вже отримано сьогодні" : (r.error === "vip_required" ? "Потрібен активний VIP" : (r.error === "inventory_full" ? "Інвентар кейсів заповнений" : "Помилка"));
      toast(msg, "err"); return;
    }
    if (kind === "avangard") {
      showModal(chestOpenSceneHtml(r.chestId || "avangard", r.chestName || "«Авангард»", r.resultText));
    } else {
      toast("Кейс додано в слот! 🥈", "ok");
    }
    await Promise.all([refreshDashboard(), loadInventoryData()]); paintInventory();
  } catch(e) { toast("Помилка з'єднання", "err"); }
}
async function claimVipInstantUnlock(row){
  try {
    const r = await api("vip_daily_instant_unlock", { row });
    if (!r.ok) {
      const msg = r.error === "already_claimed" ? "Вже використано сьогодні" : (r.error === "vip_required" ? "Потрібен активний VIP" : "Помилка");
      toast(msg, "err"); return;
    }
    toast("Розблоковано миттєво! 👑", "ok");
    await Promise.all([refreshDashboard(), loadInventoryData()]); paintInventory();
  } catch(e) { toast("Помилка з'єднання", "err"); }
}
function fmtDate(iso){
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("uk-UA",{day:"2-digit",month:"2-digit"}) + " " + d.toLocaleTimeString("uk-UA",{hour:"2-digit",minute:"2-digit"});
}
async function craftItem(rarity){
  if (!confirm("Витратити осколки на крафт?")) return;
  try {
    const r = await apiRaw("craft_item", { rarity });
    if (!r.ok) { toast(r.error || "Помилка", "err"); return; }
    toast("Крафт виконано! Дивіться нижче в «Мої скіни»", "ok");
    await Promise.all([refreshDashboard(), loadInventoryData()]); paintInventory();
  } catch(e) { toast("Помилка з'єднання", "err"); }
}

// ============================================================
// ПІДТРИМКА
// ============================================================
let SUPPORT_TYPE = "Питання";
function renderSupport(){
  const screen = document.getElementById("screen");
  screen.innerHTML = `
    <div class="h1">🆘 Підтримка</div>
    <div class="tabs2">
      <div class="t2 ${SUPPORT_TYPE==='Питання'?'active':''}" data-st="Питання">❓ Питання</div>
      <div class="t2 ${SUPPORT_TYPE==='Технічна заявка'?'active':''}" data-st="Технічна заявка">🐞 Технічна заявка</div>
    </div>
    <div class="card">
      <textarea class="field" id="supportQ" rows="4" placeholder="${SUPPORT_TYPE==='Технічна заявка' ? 'Опишіть проблему детально...' : 'Опишіть ваше питання...'}"></textarea>
      <button class="btn" style="margin-top:10px;" onclick="askSupport()">📨 Надіслати</button>
      <div class="sub" style="margin-top:8px;">${SUPPORT_TYPE==='Технічна заявка' ? 'Якщо потрібно прикріпити фото/відео — надішліть його прямо в чат з ботом після цього.' : ''}</div>
    </div>
    <div id="supportAnswer"></div>
    <div class="h2">Мої звернення<span class="hint" id="refreshTickets" style="cursor:pointer">оновити</span></div>
    <div class="list" id="myTickets">${loadingBlock()}</div>
  `;
  screen.querySelectorAll("[data-st]").forEach(el => el.addEventListener("click", () => { SUPPORT_TYPE = el.getAttribute("data-st"); renderSupport(); }));
  document.getElementById("refreshTickets").addEventListener("click", loadMyTickets);
  loadMyTickets();
}
async function askSupport(){
  const q = document.getElementById("supportQ").value.trim();
  if (!q) { toast("Введіть текст", "err"); return; }
  try {
    const r = await api("support_ask", { question:q, ticketType:SUPPORT_TYPE });
    if (!r.ok) { toast(r.error === "has_open_ticket" ? "У вас вже є необроблене звернення" : "Помилка", "err"); return; }
    const wrap = document.getElementById("supportAnswer");
    if (r.faqMatch) {
      wrap.innerHTML = `<div class="card"><div style="font-weight:700; margin-bottom:6px;">🤖 Відповідь:</div><div class="sub" style="margin:0 0 10px;">${esc(r.answer)}</div>
        <div class="btn-row"><button class="btn secondary sm" onclick="cancelSupport()">✅ Дякую, допомогло</button><button class="btn sm" onclick="escalateSupport()">📨 До адміна</button></div></div>`;
    } else {
      wrap.innerHTML = `<div class="card"><div class="sub" style="margin:0 0 10px;">Автоматичної відповіді не знайдено. Передати адміну?</div>
        <div class="btn-row"><button class="btn secondary sm" onclick="cancelSupport()">❌ Скасувати</button><button class="btn sm" onclick="escalateSupport()">📨 Так, передати</button></div></div>`;
    }
  } catch(e) { toast("Помилка з'єднання", "err"); }
}
async function escalateSupport(){
  try {
    const r = await api("support_escalate");
    if (!r.ok) { toast("Помилка", "err"); return; }
    toast(`Заявку №${r.ticketId} передано адміну`, "ok");
    document.getElementById("supportAnswer").innerHTML = "";
    document.getElementById("supportQ").value = "";
    loadMyTickets();
  } catch(e) { toast("Помилка з'єднання", "err"); }
}
async function cancelSupport(){
  await api("support_cancel");
  document.getElementById("supportAnswer").innerHTML = "";
  document.getElementById("supportQ").value = "";
}
async function loadMyTickets(){
  const wrap = document.getElementById("myTickets");
  if (!wrap) return;
  try {
    const r = await api("support_my_tickets");
    if (!r.ok || !r.tickets.length) { wrap.innerHTML = emptyBlock("📭","Звернень немає",""); return; }
    wrap.innerHTML = r.tickets.map(t => `
      <div class="item"><div class="ic">${t.type==='Технічна заявка'?'🐞':'❓'}</div>
        <div class="txt"><div class="t">№${t.ticketId} · ${esc(t.status)}</div><div class="s">${esc(t.question).slice(0,60)}</div></div>
        <div class="right badge ${t.status==='Нове'?'new':(t.status==='Закрито'?'ok':'')}">${esc(t.status)}</div></div>`).join("");
  } catch(e) {}
}

// ============================================================
// АДМІНКА
// ============================================================
let ADMIN_SUB = "state";
function renderAdmin(){
  const screen = document.getElementById("screen");
  const tabs = [
    ["state","📊","Огляд"], ["rebus","🧩","Ребус"], ["tournament","🏆","Турнір"],
    ["award","💰","Нарахування"], ["skins","🎨","Скіни"], ["admins","👤","Адміни"], ["support","📨","Звернення"], ["merch","📦","Мерч"]
  ];
  screen.innerHTML = `
    <div class="h1">🔐 Адмін-панель</div>
    <div class="admin-tabs">
      ${tabs.map(([id,icon,lb]) => `<div class="admin-tab" data-asub="${id}"><div class="aicon">${icon}</div><div class="alabel">${lb}</div></div>`).join("")}
    </div>
    <div id="adminBody">${loadingBlock()}</div>
  `;
  screen.querySelectorAll("[data-asub]").forEach(el => {
    if (el.getAttribute("data-asub") === ADMIN_SUB) el.classList.add("active");
    el.addEventListener("click", () => { ADMIN_SUB = el.getAttribute("data-asub"); renderAdmin(); });
  });
  const loaders = { state:loadAdminState, rebus:loadAdminRebus, tournament:loadAdminTournament, award:loadAdminAward, skins:loadAdminSkins, admins:loadAdminAdmins, support:loadAdminSupport, merch:loadAdminMerch };
  (loaders[ADMIN_SUB] || loadAdminState)();
}

let ADMIN_SKINS_CATALOG = null;
async function loadAdminSkins(){
  const wrap = document.getElementById("adminBody");
  try {
    if (!ADMIN_SKINS_CATALOG) {
      const r = await api("admin_skins_catalog");
      if (!r.ok) { wrap.innerHTML = emptyBlock("⚠️","Помилка",""); return; }
      ADMIN_SKINS_CATALOG = r.pools;
      SKINS_CATALOG_CACHE = r.pools; // той самий кеш, що й для іконок власних скінів
    }
    wrap.innerHTML = `
      <div class="card">
        <div style="font-weight:700; font-size:13.5px; margin-bottom:8px;">🎁 Видати скін вручну</div>
        <div class="field-label">LDAP співробітника</div>
        <input class="field" id="skinGrantLdap" placeholder="AB120996RGN">
        <div class="field-label">Категорія</div>
        <select class="field" id="skinGrantPool" onchange="renderSkinItemSelect()">
          ${ADMIN_SKINS_CATALOG.map(p => `<option value="${p.key}">${esc(p.label)}</option>`).join("")}
        </select>
        <div class="field-label">Конкретний предмет</div>
        <div class="row" style="gap:8px;">
          <select class="field" id="skinGrantItem" onchange="updateSkinPreview()" style="flex:1;"></select>
          <div id="skinPreview" style="flex:none;"></div>
        </div>
        <button class="btn sm" style="margin-top:10px;" onclick="submitGrantSkin()">✅ Видати</button>
      </div>

      <div class="h2">Каталог усіх скінів <span class="hint">${ADMIN_SKINS_CATALOG.reduce((s,p)=>s+p.items.length,0)} шт.</span></div>
      ${ADMIN_SKINS_CATALOG.map(p => `
        <div class="card" style="margin-bottom:10px;">
          <div class="row between" style="margin-bottom:10px;">
            <div style="font-weight:700; font-size:13.5px;">${esc(p.label)}</div>
            <div class="badge">${p.items.length} шт.</div>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(84px, 1fr)); gap:10px;">
            ${p.items.map(it => `
              <div style="text-align:center;">
                ${skinIconSvg(p.key, it, 64)}
                <div class="sub" style="font-size:10.5px; margin-top:4px; line-height:1.25;">${esc(it)}</div>
              </div>
            `).join("")}
          </div>
        </div>
      `).join("")}
    `;
    renderSkinItemSelect();
  } catch(e) { wrap.innerHTML = emptyBlock("⚠️","Помилка з'єднання",""); }
}
function updateSkinPreview(){
  const poolKey = document.getElementById("skinGrantPool").value;
  const itemName = document.getElementById("skinGrantItem").value;
  const el = document.getElementById("skinPreview");
  if (el) el.innerHTML = skinIconSvg(poolKey, itemName, 44);
}
function renderSkinItemSelect(){
  const poolKey = document.getElementById("skinGrantPool").value;
  const pool = ADMIN_SKINS_CATALOG.find(p => p.key === poolKey);
  const sel = document.getElementById("skinGrantItem");
  sel.innerHTML = (pool ? pool.items : []).map(it => `<option value="${esc(it)}">${esc(it)}</option>`).join("");
  updateSkinPreview();
}
async function submitGrantSkin(){
  const ldap = document.getElementById("skinGrantLdap").value.trim();
  const poolKey = document.getElementById("skinGrantPool").value;
  const itemName = document.getElementById("skinGrantItem").value;
  if (!ldap) { toast("Введіть LDAP", "err"); return; }
  if (!itemName) { toast("Оберіть предмет", "err"); return; }
  try {
    const r = await api("admin_grant_skin", { ldap, poolKey, itemName });
    if (!r.ok) {
      const msg = r.error === "user_not_found" ? "Співробітника з таким LDAP не знайдено (або він ще не зареєстрований у застосунку)" : "Помилка";
      toast(msg, "err"); return;
    }
    toast(`Видано «${itemName}» користувачу ${r.userName}`, "ok");
  } catch(e) { toast("Помилка з'єднання", "err"); }
}

async function loadAdminState(){
  const wrap = document.getElementById("adminBody");
  try {
    const r = await api("admin_state");
    if (!r.ok) { wrap.innerHTML = emptyBlock("⚠️","Помилка",""); return; }
    wrap.innerHTML = `
      <div class="stat-row"><div class="stat-card"><div class="label">Ребус</div><div class="value" style="font-size:14px;">${r.rebusActive?'✅ Активний':'😴 Немає'}</div></div>
      <div class="stat-card"><div class="label">Турнір</div><div class="value" style="font-size:14px;">${r.tournamentActive?'✅ Активний':'😴 Немає'}</div></div></div>
      <div class="stat-row" style="margin-top:10px;"><div class="stat-card"><div class="label">Нові звернення</div><div class="value mono">${r.newTickets}</div></div>
      <div class="stat-card"><div class="label">Нові замовл. мерчу</div><div class="value mono">${r.merchNew}</div></div></div>
      ${r.rebusText ? `<div class="card" style="margin-top:12px;"><div class="sub">${esc(r.rebusText)}</div></div>` : ""}
    `;
  } catch(e) { wrap.innerHTML = emptyBlock("⚠️","Помилка з'єднання",""); }
}

async function loadAdminRebus(){
  const wrap = document.getElementById("adminBody");
  try {
    const r = await api("admin_state");
    wrap.innerHTML = `
      <div class="card">
        <div class="sub" style="margin-bottom:12px;">${r.rebusActive ? ('Активний: ' + esc(r.rebusText||'')) : 'Немає активного ребусу.'}</div>
        <div class="btn-row">
          <button class="btn secondary sm" onclick="adminAction('admin_rebus_publish', null, 'Ребус опубліковано')">📢 Опублікувати</button>
          <button class="btn sm" onclick="adminAction('admin_rebus_close', null, 'Ребус закрито, призи нараховано')">🔒 Закрити + підсумки</button>
        </div>
      </div>`;
  } catch(e) { wrap.innerHTML = emptyBlock("⚠️","Помилка",""); }
}

async function loadAdminTournament(){
  const wrap = document.getElementById("adminBody");
  const r = await api("admin_state").catch(()=>({ok:false}));
  wrap.innerHTML = `
    <div class="card">
      <div class="sub" style="margin-bottom:12px;">${r.ok && r.tournamentActive ? 'Турнір зараз активний.' : 'Турнір неактивний.'}</div>
      <div class="btn-row">
        <button class="btn secondary sm" onclick="adminAction('admin_tournament_start', null, 'Турнір стартував')">🏆 Запустити</button>
        <button class="btn sm" onclick="adminAction('admin_tournament_close', null, 'Турнір закрито, призи нараховано')">🏁 Закрити</button>
      </div>
    </div>
    <div class="h2">Лідерборд на дату</div>
    <div class="card">
      <div class="field-label">Дата й час (напр. 2026-07-03T20:00)</div>
      <input class="field" type="datetime-local" id="lbCutoff">
      <div class="btn-row" style="margin-top:10px;">
        <button class="btn secondary sm" onclick="adminLeaderboardGet()">👁 Показати</button>
        <button class="btn danger sm" onclick="adminLeaderboardRollback()">⏪ Відкат (вилучити пізніші)</button>
      </div>
      <div class="sub" id="lbResult" style="margin-top:10px; white-space:pre-wrap;"></div>
    </div>
  `;
}
async function adminLeaderboardGet(){
  const v = document.getElementById("lbCutoff").value;
  if (!v) { toast("Вкажіть дату", "err"); return; }
  const r = await api("admin_leaderboard_get", { cutoffIso: new Date(v).toISOString() });
  document.getElementById("lbResult").textContent = r.ok ? (r.text || "Немає даних на цю дату") : "Помилка";
}
async function adminLeaderboardRollback(){
  const v = document.getElementById("lbCutoff").value;
  if (!v) { toast("Вкажіть дату", "err"); return; }
  if (!confirm("Вилучити всі результати ПІСЛЯ цієї дати? Дію не можна скасувати.")) return;
  const r = await api("admin_leaderboard_rollback", { cutoffIso: new Date(v).toISOString() });
  if (r.ok) toast(`Вилучено результатів: ${r.excluded}`, "ok"); else toast("Помилка", "err");
}

function loadAdminAward(){
  const wrap = document.getElementById("adminBody");
  wrap.innerHTML = `
    <div class="card">
      <div class="field-label">💰 Нарахування á-coin (LDAP кількість, по рядку)</div>
      <textarea class="field" id="awardCoins" rows="3" placeholder="AB120996RGN 50\nAB110996RGN -10"></textarea>
      <button class="btn sm" style="margin-top:8px;" onclick="submitAward('coins')">Нарахувати á-coin</button>
    </div>
    <div class="card" style="margin-top:10px;">
      <div class="field-label">🔮 Нарахування осколків (LDAP кількість, по рядку)</div>
      <textarea class="field" id="awardShards" rows="3" placeholder="AB120996RGN 20"></textarea>
      <button class="btn sm" style="margin-top:8px;" onclick="submitAward('shards')">Нарахувати осколки</button>
    </div>
    <div class="card" style="margin-top:10px;">
      <div class="field-label">👑 VIP-статус вручну</div>
      <input class="field" id="vipLdap" placeholder="LDAP співробітника: AB120996RGN">
      <div class="btn-row" style="margin-top:8px;">
        <input class="field" id="vipHours" type="number" placeholder="Годин" style="flex:1;">
        <button class="btn secondary sm" style="flex:1;" onclick="submitAdminVipGrant()">Видати</button>
      </div>
      <button class="btn danger sm" style="margin-top:8px;" onclick="submitAdminVipRevoke()">❌ Забрати VIP</button>
    </div>
    <div class="sub" id="awardResult" style="margin-top:10px; white-space:pre-wrap;"></div>
  `;
}
async function submitAdminVipGrant(){
  const ldap = document.getElementById("vipLdap").value.trim();
  const hours = parseInt(document.getElementById("vipHours").value);
  if (!ldap) { toast("Введіть LDAP", "err"); return; }
  if (!hours || hours<=0) { toast("Вкажіть кількість годин", "err"); return; }
  try {
    const r = await api("admin_vip_grant", { ldap, hours });
    if (!r.ok) { toast(r.error === "user_not_found" ? "Співробітника не знайдено" : "Помилка", "err"); return; }
    toast(`VIP видано ${r.userName} на ${hours} год.`, "ok");
  } catch(e) { toast("Помилка з'єднання", "err"); }
}
async function submitAdminVipRevoke(){
  const ldap = document.getElementById("vipLdap").value.trim();
  if (!ldap) { toast("Введіть LDAP", "err"); return; }
  if (!confirm(`Забрати активний VIP-статус у ${ldap}?`)) return;
  try {
    const r = await api("admin_vip_revoke", { ldap });
    if (!r.ok) { toast(r.error === "user_not_found" ? "Співробітника не знайдено" : "Помилка", "err"); return; }
    toast(r.wasActive ? `VIP забрано у ${r.userName}` : `У ${r.userName} і так не було активного VIP`, "ok");
  } catch(e) { toast("Помилка з'єднання", "err"); }
}
async function submitAward(kind){
  const text = document.getElementById(kind==='coins'?'awardCoins':'awardShards').value.trim();
  if (!text) { toast("Введіть хоча б один рядок", "err"); return; }
  const r = await api(kind==='coins' ? 'admin_manual_award' : 'admin_manual_award_shards', { text });
  if (!r.ok) { toast("Помилка", "err"); return; }
  toast("Готово, перевірте чат", "ok");
  if (r.results) document.getElementById("awardResult").textContent = r.results.join("\n");
  await refreshDashboard(); // якщо адмін нарахував самому собі — пілюлі баланс/осколки оновляться одразу
}

async function loadAdminAdmins(){
  const wrap = document.getElementById("adminBody");
  if (!DASH.isMainAdmin) {
    wrap.innerHTML = emptyBlock("🔒","Доступно лише Головному адміну","Керувати списком адмінів може тільки Головний адмін.");
    return;
  }
  try {
    const r = await api("admin_admins_list");
    wrap.innerHTML = `
      <div class="card">
        <div class="field-label">Telegram ID</div>
        <input class="field" id="newAdminId" placeholder="707696805">
        <div class="field-label">Роль</div>
        <select class="field" id="newAdminType">
          <option value="ADMIN">🛡 Адмін</option>
          <option value="MAIN_ADMIN">⭐ Головний адмін</option>
        </select>
        <button class="btn sm" style="margin-top:8px;" onclick="addAdminId()">➕ Надати права</button>
      </div>
      <div class="list" style="margin-top:10px;">${r.admins.map(a => `
        <div class="item"><div class="ic">${a.type==='MAIN_ADMIN'?'⭐':'🛡'}</div>
        <div class="txt"><div class="t">${esc(a.ldap||a.id)}</div><div class="s">${esc(a.id)} · ${a.type==='MAIN_ADMIN'?'Головний адмін':'Адмін'}</div></div>
        <button class="btn danger sm" style="width:auto; padding:7px 10px;" onclick="removeAdminId('${a.id}')">🗑</button></div>
      `).join("")}</div>
    `;
  } catch(e) { wrap.innerHTML = emptyBlock("⚠️","Помилка",""); }
}
async function addAdminId(){
  const tgId = document.getElementById("newAdminId").value.trim();
  const type = document.getElementById("newAdminType").value;
  if (!tgId) return;
  const r = await api("admin_admin_add", { tgId, type });
  if (r.ok) { toast("Права надано", "ok"); loadAdminAdmins(); } else toast(r.error === "forbidden_not_main_admin" ? "Лише Головний адмін може це робити" : "Помилка", "err");
}
async function removeAdminId(tgId){
  if (!confirm("Забрати права адміна в " + tgId + "?")) return;
  const r = await api("admin_admin_remove", { tgId });
  if (r.ok) { toast("Права забрано", "ok"); loadAdminAdmins(); }
  else toast(r.error === "last_main_admin" ? "Не можна видалити останнього Головного адміна" : "Помилка", "err");
}

async function loadAdminSupport(){
  const wrap = document.getElementById("adminBody");
  try {
    const r = await api("admin_support_list");
    if (!r.ok || !r.tickets.length) { wrap.innerHTML = emptyBlock("✅","Немає відкритих звернень",""); return; }
    wrap.innerHTML = `<div class="list">` + r.tickets.map(t => `
      <div class="item" style="cursor:pointer" onclick="openAdminTicket(${t.row})">
        <div class="ic">${t.type==='Технічна заявка'?'🐞':'❓'}</div>
        <div class="txt"><div class="t">№${t.ticketId} · ${esc(t.name)}${t.isVip?' 👑':''}</div><div class="s">${esc(t.question).slice(0,50)}</div></div>
        <div class="right badge ${t.takenBy?'':'new'}">${t.takenBy?('в роботі: '+esc(t.takenByName)):'нове'}</div>
      </div>`).join("") + `</div>`;
  } catch(e) { wrap.innerHTML = emptyBlock("⚠️","Помилка",""); }
}
async function openAdminTicket(row){
  const r = await api("admin_support_ticket", { row });
  if (!r.ok) { toast("Помилка", "err"); return; }
  const t = r.ticket;
  showModal(`
    <div class="mh">${t.type==='Технічна заявка'?'🐞':'❓'} Заявка №${t.ticketId}</div>
    <div class="sub">👤 ${esc(t.name)} · LDAP ${esc(t.ldap||'—')}</div>
    <div class="sub" style="margin:8px 0;">${esc(t.question)}</div>
    <textarea class="field" id="ticketReply" rows="3" placeholder="Відповідь..."></textarea>
    <div class="btn-row" style="margin-top:10px;">
      <button class="btn secondary sm" onclick="adminTicketClose(${row})">🔒 Закрити без відповіді</button>
      <button class="btn sm" onclick="adminTicketReply(${row})">✍️ Відповісти</button>
    </div>
  `);
}
async function adminTicketReply(row){
  const answer = document.getElementById("ticketReply").value.trim();
  if (!answer) { toast("Введіть відповідь", "err"); return; }
  const r = await api("admin_support_reply", { row, answer });
  if (r.ok) { toast("Відповідь надіслано", "ok"); closeModal(); loadAdminSupport(); } else toast("Помилка", "err");
}
async function adminTicketClose(row){
  const r = await api("admin_support_close", { row });
  if (r.ok) { toast("Закрито", "ok"); closeModal(); loadAdminSupport(); } else toast("Помилка", "err");
}

async function loadAdminMerch(){
  const wrap = document.getElementById("adminBody");
  try {
    const r = await api("admin_merch_list", { onlyNew:true });
    if (!r.ok || !r.orders.length) { wrap.innerHTML = emptyBlock("✅","Нових замовлень немає",""); return; }
    wrap.innerHTML = `<div class="list">` + r.orders.map(m => `
      <div class="card">
        <div style="font-weight:700; font-size:13px;">${esc(m.name)}</div>
        <div class="sub" style="margin:4px 0;">🎁 ${esc(m.item)}<br>👥 ${esc(m.recipient||m.name)} · ${esc(m.city)} відд.${esc(m.branch)} · 📱 ${esc(m.phone)}</div>
        <div class="btn-row">
          <button class="btn secondary sm" onclick="adminMerchAct('accept', ${m.row})">✅ Прийнято</button>
          <button class="btn secondary sm" onclick="adminMerchAct('sent', ${m.row})">📬 Відправлено</button>
          <button class="btn danger sm" onclick="adminMerchAct('cancel', ${m.row})">❌</button>
        </div>
      </div>`).join("") + `</div>`;
  } catch(e) { wrap.innerHTML = emptyBlock("⚠️","Помилка",""); }
}
async function adminMerchAct(kind, row){
  const action = { accept:"admin_merch_accept", sent:"admin_merch_sent", cancel:"admin_merch_cancel" }[kind];
  const r = await api(action, { row });
  if (r.ok) { toast("Готово", "ok"); loadAdminMerch(); } else toast("Помилка", "err");
}

async function adminAction(action, payload, okMsg){
  try {
    const r = await api(action, payload || {});
    if (!r.ok) { toast("Помилка", "err"); return; }
    toast(okMsg || "Готово", "ok");
    renderAdmin();
  } catch(e) { toast("Помилка з'єднання", "err"); }
}

// ============================================================
// СТАРТ
// ============================================================
boot();
