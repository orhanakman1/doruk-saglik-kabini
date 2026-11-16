/* Doruk Sağlık Kabini */
(() => {
  "use strict";

  const WA_NUMBER = "905078448085";
  const waLink = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Hizmetler ---------- */
  const SERVICES = [
    ["Serum Tedavi", "Hekim istemiyle sıvı, vitamin ve ilaç içeren serum uygulamaları; rahat bir koltukta, takipli."],
    ["Enjeksiyon", "Kas içi, damar içi ve deri altı enjeksiyonlar. Reçetenizle gelmeniz yeterli."],
    ["Pansuman Hizmetleri", "Ameliyat sonrası, yanık ve kronik yara bakımı; steril, tek kullanımlık malzemeyle."],
    ["Dikiş Atılması – Alınması", "Basit kesiklerde dikiş ve zamanı gelen dikişlerin özenle alınması."],
    ["Ağrısız Kulak Delme", "Çocuk ve yetişkinler için hijyenik, ağrıyı en aza indiren yöntemle."],
    ["Kulak Yıkama", "Kulak kiri tıkacında (buşon) rahatlatan, kontrollü kulak yıkama."],
    ["Kan Grubu Öğrenme", "Birkaç damla kanla, dakikalar içinde kan grubu tespiti."],
    ["Gebelik Testi", "Hızlı sonuç, tam gizlilik."],
    ["Sonda Takılması", "Üriner sonda takılması ve değişimi; kabinde ya da evinizde."],
    ["Evde Bakım Hizmetleri", "Yatağa bağımlı ve yaşlı hastalarınız için evde uygulama ve bakım."]
  ];
  const svcList = $("#svcList");
  if (svcList) {
    svcList.innerHTML = SERVICES.map(([t, d], i) => `
      <li class="reveal"><a href="${waLink(`Merhaba, "${t}" hizmeti hakkında bilgi almak istiyorum.`)}" target="_blank" rel="noopener">
        <span class="svc__n">${String(i + 1).padStart(2, "0")}</span>
        <span class="svc__t">${t}</span>
        <span class="svc__go">Sor <svg class="ico" aria-hidden="true"><use href="#i-arrow"/></svg></span>
        <span class="svc__d">${d}</span>
      </a></li>`).join("");
  }

  /* ---------- WhatsApp linkleri ---------- */
  $$("[data-wa]").forEach((a) => (a.href = waLink(a.dataset.wa)));

  /* ---------- Nav, reveal, video ---------- */
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", scrollY > 10);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal, .ecg").forEach((el) => io.observe(el));

  const video = $("#heroVideo"), vBtn = $("#videoToggle");
  if (video && vBtn) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) video.pause();
    const sync = () => {
      vBtn.innerHTML = `<svg class="ico" aria-hidden="true"><use href="#i-${video.paused ? "play" : "pause"}"/></svg>`;
      vBtn.setAttribute("aria-label", video.paused ? "Videoyu oynat" : "Videoyu durdur");
    };
    vBtn.addEventListener("click", () => (video.paused ? video.play() : video.pause()));
    video.addEventListener("play", sync); video.addEventListener("pause", sync); sync();
  }
  // Galeri videoları yalnızca ekranda görünürken oynar
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const vio = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting && !reduce) e.target.play().catch(() => {}); else e.target.pause(); });
  }, { threshold: 0.35 });
  $$("#reel video").forEach((v) => vio.observe(v));

  $("#year").textContent = new Date().getFullYear();

  /* =========================================================
     HASTALIĞIM NE? — vücut haritası ile belirti değerlendirme
     Kural tabanlı bilgilendirme aracıdır; tanı koymaz.
     ========================================================= */

  const SYM = {
    // baş
    basagrisi: { t: "Baş ağrısı" },
    basdonmesi: { t: "Baş dönmesi" },
    isik: { t: "Işığa / sese hassasiyet" },
    yuz: { t: "Yüzde, alında basınç hissi" },
    burun: { t: "Burun akıntısı / tıkanıklığı" },
    hapsirma: { t: "Hapşırma" },
    goz: { t: "Gözlerde kaşıntı, sulanma" },
    kulakagri: { t: "Kulak ağrısı" },
    kulaktikali: { t: "Kulakta tıkanıklık, az duyma" },
    cinlama: { t: "Kulak çınlaması" },
    felc: { t: "Yüzde kayma, konuşma bozukluğu", acil: true },
    bilinc: { t: "Bilinç bulanıklığı, bayılma", acil: true },
    // boyun
    bogaz: { t: "Boğaz ağrısı" },
    yutma: { t: "Yutkunurken ağrı" },
    ses: { t: "Ses kısıklığı" },
    boyunsislik: { t: "Boyunda şişlik (bez)" },
    ense: { t: "Ateşle birlikte ense sertliği", acil: true },
    // göğüs
    oksuruk: { t: "Öksürük" },
    balgam: { t: "Balgam" },
    gogushassas: { t: "Göğüslerde hassasiyet", sex: "k" },
    gogusagri: { t: "Göğüs ağrısı / baskı hissi", acil: true },
    nefes: { t: "Nefes almakta zorlanma", acil: true },
    // karın
    bulanti: { t: "Bulantı" },
    kusma: { t: "Kusma" },
    ishal: { t: "İshal" },
    karin: { t: "Karın ağrısı / kramp" },
    siskinlik: { t: "Şişkinlik, gaz" },
    mideyanma: { t: "Mide yanması, ekşime" },
    kanlikusma: { t: "Kanlı kusma ya da siyah dışkı", acil: true },
    anikarin: { t: "Ani başlayan çok şiddetli karın ağrısı", acil: true },
    // kasık
    idraryanma: { t: "İdrarda yanma" },
    sikidrar: { t: "Sık idrara çıkma" },
    kasik: { t: "Kasık / alt karın ağrısı" },
    adet: { t: "Adet gecikmesi", sex: "k" },
    // kol & bacak & cilt
    kas: { t: "Kas ve eklem ağrısı" },
    sislik: { t: "Şişlik" },
    kesik: { t: "Kesik / açık yara" },
    kizariklik: { t: "Yarada kızarıklık, ısı artışı" },
    akinti: { t: "Yarada akıntı" },
    gucsuzluk: { t: "Kolda / bacakta ani güçsüzlük", acil: true },
    dokuntu: { t: "Döküntü, kaşıntı" },
    kanama: { t: "Durmayan kanama", acil: true },
    // sırt
    bel: { t: "Bel / sırt ağrısı" },
    tutukluk: { t: "Hareketle artan ağrı, tutukluk" },
    // genel
    ates: { t: "Ateş / titreme" },
    halsizlik: { t: "Halsizlik, yorgunluk" },
    istahsizlik: { t: "İştahsızlık" },
    agizkuru: { t: "Ağız kuruluğu, aşırı susama" },
    yuksekates: { t: "39,5 °C üzeri, düşmeyen ateş", acil: true }
  };

  const REGIONS = {
    bas:   { n: "Baş",         items: ["basagrisi", "basdonmesi", "isik", "yuz", "burun", "hapsirma", "goz", "kulakagri", "kulaktikali", "cinlama", "felc", "bilinc"] },
    boyun: { n: "Boyun & boğaz", items: ["bogaz", "yutma", "ses", "boyunsislik", "ense"] },
    gogus: { n: "Göğüs",       items: ["oksuruk", "balgam", "gogushassas", "gogusagri", "nefes"] },
    karin: { n: "Karın",       items: ["bulanti", "kusma", "ishal", "karin", "siskinlik", "mideyanma", "kanlikusma", "anikarin"] },
    kasik: { n: "Kasık",       items: ["idraryanma", "sikidrar", "kasik", "adet"] },
    kol:   { n: "Kollar",      items: ["kas", "sislik", "kesik", "kizariklik", "akinti", "gucsuzluk"] },
    bacak: { n: "Bacaklar",    items: ["kas", "sislik", "kesik", "kizariklik", "akinti", "gucsuzluk"] },
    sirt:  { n: "Sırt & bel",  items: ["bel", "tutukluk", "kas"] },
    cilt:  { n: "Cilt",        items: ["dokuntu", "kizariklik", "kesik", "akinti", "sislik", "kanama"] },
    genel: { n: "Genel",       items: ["ates", "halsizlik", "istahsizlik", "agizkuru", "basdonmesi", "kas", "yuksekates"] }
  };

  // core: belirleyici (x2), sup: destekleyici (x1)
  const CONDITIONS = [
    { n: "Soğuk algınlığı", core: ["burun", "hapsirma", "bogaz"], sup: ["oksuruk", "basagrisi", "halsizlik", "ses"],
      d: "Üst solunum yollarının viral enfeksiyonudur; genellikle 7–10 gün içinde kendiliğinden geçer.",
      b: "Aile Hekimi", s: null },
    { n: "Grip (influenza)", core: ["ates", "kas", "halsizlik"], sup: ["basagrisi", "oksuruk", "bogaz", "istahsizlik"],
      d: "Ani başlayan ateş, kas ağrısı ve belirgin halsizlikle seyreden viral enfeksiyon.",
      b: "Aile Hekimi / Dahiliye", s: "Hekiminiz ilaç önerirse enjeksiyonunuzu kabinde yapabiliriz." },
    { n: "Farenjit / bademcik iltihabı", core: ["bogaz", "yutma"], sup: ["ates", "boyunsislik", "basagrisi", "halsizlik"],
      d: "Boğaz ve bademciklerin iltihabı. Bakteriyel olup olmadığını hekim muayenesi belirler.",
      b: "Kulak Burun Boğaz", s: "Reçeteli enjeksiyon tedaviniz kabinde uygulanabilir." },
    { n: "Larenjit", core: ["ses"], sup: ["bogaz", "oksuruk", "ates"],
      d: "Ses tellerinin iltihabı; ses kısıklığı ve kuru öksürükle kendini gösterir.",
      b: "Kulak Burun Boğaz", s: null },
    { n: "Sinüzit", core: ["yuz", "burun"], sup: ["basagrisi", "oksuruk", "ates"],
      d: "Sinüslerin iltihabı; yüzde basınç, burun tıkanıklığı ve öne eğilince artan baş ağrısı tipiktir.",
      b: "Kulak Burun Boğaz", s: null },
    { n: "Akut bronşit", core: ["oksuruk", "balgam"], sup: ["ates", "halsizlik", "bogaz"],
      d: "Bronşların iltihabı; günlerce süren balgamlı öksürükle seyreder.",
      b: "Göğüs Hastalıkları", s: "Reçeteli tedaviniz kabinde uygulanabilir." },
    { n: "Alerjik rinit / alerjik reaksiyon", core: ["hapsirma", "goz", "dokuntu"], sup: ["burun", "sislik"],
      d: "Polen, toz ya da gıdalara karşı vücudun aşırı tepkisi. Dudak-dil şişmesi veya nefes darlığı olursa acildir.",
      b: "İmmünoloji ve Alerji / Dermatoloji", s: "Hekim istemindeki alerji enjeksiyonunuzu yapabiliriz." },
    { n: "Mide-bağırsak enfeksiyonu (gastroenterit)", core: ["ishal", "kusma", "bulanti"], sup: ["karin", "ates", "halsizlik", "agizkuru"],
      d: "Genellikle viral; ishal ve kusmaya bağlı sıvı kaybı en önemli risktir.",
      b: "Dahiliye", s: "Sıvı alamıyorsanız, hekim istemiyle serum tedavisi uygulayabiliriz." },
    { n: "Besin zehirlenmesi", core: ["bulanti", "kusma", "karin"], sup: ["ishal", "halsizlik", "ates"],
      d: "Bozulmuş ya da mikroplu yiyecek sonrası birkaç saat içinde başlayan şikâyetler.",
      b: "Dahiliye", s: "Hekim istemiyle serum ve enjeksiyon uygulanabilir." },
    { n: "Gastrit / reflü", core: ["mideyanma", "siskinlik"], sup: ["bulanti", "karin", "istahsizlik"],
      d: "Mide zarının tahrişi ya da mide içeriğinin yemek borusuna kaçması.",
      b: "Dahiliye (Gastroenteroloji)", s: "Reçeteli enjeksiyonunuzu kabinde yapabiliriz." },
    { n: "Sıvı kaybı (dehidratasyon)", core: ["agizkuru", "basdonmesi"], sup: ["halsizlik", "kusma", "ishal", "basagrisi"],
      d: "Vücudun yeterli sıvıyı alamaması; sıcak havalarda, ishal ve kusmada sık görülür.",
      b: "Dahiliye", s: "Hekim istemiyle serum tedavisi yapılabilir." },
    { n: "Migren / gerilim tipi baş ağrısı", core: ["basagrisi", "isik"], sup: ["bulanti", "kusma", "basdonmesi"],
      d: "Tekrarlayan, zonklayıcı ya da baskı şeklinde baş ağrıları.",
      b: "Nöroloji", s: "Reçeteli ağrı kesici enjeksiyonunuzu yapabiliriz." },
    { n: "Kulak kiri tıkacı (buşon)", core: ["kulaktikali"], sup: ["cinlama", "basdonmesi"],
      d: "Kulak yolunda biriken kirin kulağı tıkaması; ani işitme azalması ve dolgunluk hissi yapar.",
      b: "Kulak Burun Boğaz", s: "Kulak yıkama ile rahatlayabilirsiniz. (Kulak ağrısı ya da akıntı varsa önce hekim muayenesi gerekir.)" },
    { n: "Kulak iltihabı (otit)", core: ["kulakagri"], sup: ["ates", "kulaktikali", "burun"],
      d: "Orta ya da dış kulak iltihabı; özellikle çocuklarda sık görülür.",
      b: "Kulak Burun Boğaz", s: null },
    { n: "İdrar yolu enfeksiyonu", core: ["idraryanma", "sikidrar"], sup: ["kasik", "ates", "bel"],
      d: "İdrar yollarının bakteriyel enfeksiyonu; kadınlarda daha sık görülür. Ateş ve bel ağrısı eklenirse böbreğe ilerlemiş olabilir.",
      b: "Üroloji / Dahiliye", s: "Reçeteli antibiyotik enjeksiyonunuzu kabinde yapabiliriz." },
    { n: "Gebelik olasılığı", core: ["adet"], sup: ["bulanti", "gogushassas", "halsizlik", "sikidrar"], sex: "k", minAge: 1,
      d: "Adet gecikmesine bulantı ve göğüs hassasiyeti eşlik ediyorsa gebelik ihtimali değerlendirilmelidir.",
      b: "Kadın Hastalıkları ve Doğum", s: "Kabinimizde hızlı ve gizli gebelik testi yapabilirsiniz." },
    { n: "Yara enfeksiyonu", core: ["kizariklik", "akinti"], sup: ["sislik", "ates", "kesik"],
      d: "Yarada kızarıklık, ısı artışı ve akıntı enfeksiyon belirtisi olabilir.",
      b: "Genel Cerrahi", s: "Düzenli steril pansuman için kabinde ya da evde hizmet veriyoruz." },
    { n: "Kesi / açık yara", core: ["kesik"], sup: ["kanama", "sislik"],
      d: "Derin ya da ayrık kenarlı kesiklerin dikiş açısından ilk saatler içinde değerlendirilmesi gerekir.",
      b: "Acil Servis / Genel Cerrahi", s: "Uygun yaralarda dikiş atılması ve pansuman yapabiliriz." },
    { n: "Kas zorlanması / bel-boyun ağrısı", core: ["bel", "tutukluk"], sup: ["kas"],
      d: "Ani hareket, ağır kaldırma ya da duruş bozukluğuna bağlı kas ve eklem ağrıları.",
      b: "Fizik Tedavi / Ortopedi", s: "Reçeteli kas gevşetici ve ağrı kesici enjeksiyonunuzu yapabiliriz." },
    { n: "Demir eksikliği / kansızlık", core: ["halsizlik", "basdonmesi"], sup: ["basagrisi", "istahsizlik"],
      d: "Uzun süren yorgunluk ve baş dönmesinin sık nedenlerinden biri; kan tahlili ile anlaşılır.",
      b: "Dahiliye", s: "Hekim istemiyle demir / vitamin enjeksiyonu ve serum uygulayabiliriz." }
  ];

  const AGES = [["cocuk", "0–12", "çocuk"], ["genc", "13–17", "genç"], ["yetiskin", "18–64", "yetişkin"], ["yasli", "65+", "ileri yaş"]];

  const state = { step: 0, sex: null, age: null, region: "bas", picked: new Set(), q: "" };

  const drawer = $("#checker"), scrim = $("#scrim"), body = $("#checkerBody"), foot = $("#checkerFoot"), bar = $("#progressBar");
  let lastFocus = null;

  const visible = (id) => !(SYM[id].sex && state.sex && SYM[id].sex !== state.sex);
  const regionOf = (id) => Object.entries(REGIONS).find(([, r]) => r.items.includes(id))?.[1].n || "";
  const countIn = (rk) => REGIONS[rk].items.filter((id) => state.picked.has(id)).length;

  function open() {
    lastFocus = document.activeElement;
    scrim.hidden = false;
    requestAnimationFrame(() => { scrim.classList.add("is-open"); drawer.classList.add("is-open"); });
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    render();
    setTimeout(() => $(".checker__close").focus(), 300);
  }
  function close() {
    scrim.classList.remove("is-open"); drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    setTimeout(() => (scrim.hidden = true), 350);
    lastFocus?.focus();
  }
  $$("[data-open-checker]").forEach((b) => b.addEventListener("click", open));
  $$("[data-close-checker]").forEach((b) => b.addEventListener("click", close));
  scrim.addEventListener("click", close);
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("is-open")) close();
    if (e.key === "Tab" && drawer.classList.contains("is-open")) {
      const f = $$("button, a[href], input, [tabindex='0']", drawer).filter((el) => !el.disabled && el.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  const NOTE = `<p class="cf__note">Sonuçlar yanıltıcı olabilir; bu araç bilgilendirme amaçlıdır, tanı ve tedavi yerine geçmez.</p>`;

  function render() {
    bar.style.width = `${((state.step + 1) / 3) * 100}%`;
    [stepPerson, stepMap, stepResult][state.step]();
    body.scrollTop = 0;
  }
  const go = (n) => { state.step = n; render(); };

  /* ---- Adım 1: kişi ---- */
  function stepPerson() {
    const femaleSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="9" r="5"/><path d="M12 14v7M9 18h6"/></svg>`;
    const maleSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="10" cy="14" r="5"/><path d="M14 10l6-6M15 4h5v5"/></svg>`;
    body.innerHTML = `
      <p class="step-title">Kimin için değerlendiriyorsunuz?</p>
      <p class="step-sub">Olası durumlar cinsiyet ve yaşa göre farklılık gösterir.</p>
      <div class="field">
        <span class="field__label">Cinsiyet</span>
        <div class="seg seg--2" role="radiogroup" aria-label="Cinsiyet">
          <label class="opt"><input type="radio" name="sex" value="k" ${state.sex === "k" ? "checked" : ""}><span>${femaleSvg}Kadın</span></label>
          <label class="opt"><input type="radio" name="sex" value="e" ${state.sex === "e" ? "checked" : ""}><span>${maleSvg}Erkek</span></label>
        </div>
      </div>
      <div class="field">
        <span class="field__label">Yaş</span>
        <div class="seg seg--4" role="radiogroup" aria-label="Yaş aralığı">
          ${AGES.map(([v, l, s]) => `<label class="opt"><input type="radio" name="age" value="${v}" ${state.age === v ? "checked" : ""}><span>${l}<small>${s}</small></span></label>`).join("")}
        </div>
      </div>
      <div class="privacy">
        <svg class="ico" aria-hidden="true" style="flex:none;margin-top:1px"><use href="#i-steth"/></svg>
        <span>Seçimleriniz hiçbir yere kaydedilmez, yalnızca bu sayfada kullanılır. Sonucu isterseniz WhatsApp'tan bize iletebilirsiniz.</span>
      </div>`;
    $$("input", body).forEach((i) => i.addEventListener("change", () => {
      state[i.name] = i.value;
      if (i.name === "sex") [...state.picked].forEach((id) => !visible(id) && state.picked.delete(id));
      footPerson();
    }));
    footPerson();
  }
  function footPerson() {
    foot.innerHTML = `<div class="cf__row">
        <span class="cf__count">Adım <b>1</b> / 3</span>
        <button class="cbtn cbtn--pri" type="button" id="next" ${state.sex && state.age ? "" : "disabled"}>Belirtilere geç <svg class="ico" aria-hidden="true"><use href="#i-arrow"/></svg></button>
      </div>${NOTE}`;
    $("#next").addEventListener("click", () => go(1));
  }

  /* ---- Adım 2: vücut haritası ---- */
  function figureSvg() {
    const rg = (k, d, label) => `<path class="rg" data-r="${k}" d="${d}" tabindex="0" role="button" aria-label="${label}"/>`;
    const badge = (k, x, y) => { const c = countIn(k); return c ? `<g class="badge"><circle cx="${x}" cy="${y}" r="10" fill="#16171A"/><text x="${x}" y="${y + 4}" text-anchor="middle">${c}</text></g>` : ""; };
    return `<svg class="figure" viewBox="0 0 220 440" aria-label="Vücut haritası">
      ${rg("bacak", "M70 266 L80 420 Q80 434 92 434 Q104 434 104 420 L108 290 Q86 290 70 266 Z", "Bacaklar")}
      ${rg("bacak", "M150 266 L140 420 Q140 434 128 434 Q116 434 116 420 L112 290 Q134 290 150 266 Z", "Bacaklar")}
      ${rg("kol", "M62 100 Q44 104 40 126 L26 236 Q24 254 36 255 Q48 256 49 240 L64 150 Z", "Kollar")}
      ${rg("kol", "M158 100 Q176 104 180 126 L194 236 Q196 254 184 255 Q172 256 171 240 L156 150 Z", "Kollar")}
      ${rg("kasik", "M70 236 H150 Q154 254 150 268 Q132 290 110 290 Q88 290 70 268 Q66 254 70 236 Z", "Kasık")}
      ${rg("karin", "M68 170 H152 Q146 202 150 234 H70 Q74 202 68 170 Z", "Karın")}
      ${rg("gogus", "M64 104 Q68 91 90 90 H130 Q152 91 156 104 L152 168 H68 Z", "Göğüs")}
      ${rg("boyun", "M97 72 H123 V90 H97 Z", "Boyun ve boğaz")}
      ${rg("bas", "M110 6 C130 6 140 22 140 40 C140 62 126 76 110 76 C94 76 80 62 80 40 C80 22 90 6 110 6 Z", "Baş")}
      ${badge("bas", 128, 22)}${badge("boyun", 132, 82)}${badge("gogus", 110, 132)}${badge("karin", 110, 204)}
      ${badge("kasik", 110, 262)}${badge("kol", 36, 196)}${badge("bacak", 92, 360)}
    </svg>`;
  }

  function stepMap() {
    body.innerHTML = `
      <p class="step-title">Şikâyetiniz nerede?</p>
      <p class="step-sub">Vücut üzerinde bir bölgeye dokunun ve yaşadığınız belirtileri işaretleyin. Birden fazla bölge seçebilirsiniz.</p>
      <div class="map">
        <div class="map__fig">
          <div id="fig"></div>
          <div>
            <div class="map__extra" id="extra">
              ${["sirt", "cilt", "genel"].map((k) => `<button type="button" class="xbtn" data-r="${k}">${REGIONS[k].n}</button>`).join("")}
            </div>
            <p class="map__hint">Ateş, halsizlik gibi şikâyetler için “Genel”.</p>
          </div>
        </div>
        <div>
          <label class="search"><span class="sr" style="position:absolute;left:-9999px">Belirti ara</span>
            <input type="search" id="symSearch" placeholder="Belirti ara… (ör. öksürük)" value="${esc(state.q)}" autocomplete="off">
          </label>
          <div id="symPane"></div>
          <div class="picked" id="picked"></div>
        </div>
      </div>`;
    const s = $("#symSearch");
    s.addEventListener("input", () => { state.q = s.value; paintList(); });
    $$(".xbtn", body).forEach((b) => b.addEventListener("click", () => selectRegion(b.dataset.r)));
    paintMap(); paintList(); footMap();
  }

  function selectRegion(k) { state.region = k; state.q = ""; const s = $("#symSearch"); if (s) s.value = ""; paintMap(); paintList(); }

  function paintMap() {
    $("#fig").innerHTML = figureSvg();
    $$("#fig .rg").forEach((p) => {
      const k = p.dataset.r;
      p.classList.toggle("is-active", k === state.region);
      p.classList.toggle("has", countIn(k) > 0);
      p.setAttribute("aria-pressed", k === state.region);
      p.addEventListener("click", () => selectRegion(k));
      p.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectRegion(k); setTimeout(() => $(`#fig .rg[data-r="${k}"]`)?.focus(), 0); } });
    });
    $$("#extra .xbtn").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.r === state.region);
      b.classList.toggle("has", countIn(b.dataset.r) > 0);
    });
  }

  function paintList() {
    const q = state.q.trim().toLocaleLowerCase("tr");
    let ids, title, sub;
    if (q) {
      ids = Object.keys(SYM).filter((id) => visible(id) && SYM[id].t.toLocaleLowerCase("tr").includes(q));
      title = "Arama"; sub = `${ids.length} sonuç`;
    } else {
      ids = REGIONS[state.region].items.filter(visible);
      title = REGIONS[state.region].n; sub = `${ids.length} belirti`;
    }
    $("#symPane").innerHTML = `
      <div class="region-title"><h3>${title}</h3><span>${sub}</span></div>
      ${ids.length ? `<ul class="sym">${ids.map((id) => `
        <li><label>
          <input type="checkbox" value="${id}" ${state.picked.has(id) ? "checked" : ""}>
          <span class="box" aria-hidden="true"></span>
          <span>${SYM[id].t}</span>
          ${SYM[id].acil ? `<span class="tag">Acil</span>` : q ? `<span class="where">${regionOf(id)}</span>` : ""}
        </label></li>`).join("")}</ul>` : `<p class="muted">Bu ifadeyle eşleşen belirti bulunamadı.</p>`}`;
    $$("#symPane input").forEach((i) => i.addEventListener("change", () => {
      i.checked ? state.picked.add(i.value) : state.picked.delete(i.value);
      paintMap(); paintPicked(); footMap();
    }));
    paintPicked();
  }

  function paintPicked() {
    const el = $("#picked");
    el.innerHTML = [...state.picked].map((id) => `<span class="pill">${SYM[id].t}<button type="button" data-rm="${id}" aria-label="${SYM[id].t} kaldır"><svg class="ico" aria-hidden="true"><use href="#i-x"/></svg></button></span>`).join("");
    $$("[data-rm]", el).forEach((b) => b.addEventListener("click", () => { state.picked.delete(b.dataset.rm); paintMap(); paintList(); footMap(); }));
  }

  function footMap() {
    const n = state.picked.size;
    foot.innerHTML = `<div class="cf__row">
        <button class="cbtn cbtn--sec" type="button" id="back"><svg class="ico" aria-hidden="true"><use href="#i-back"/></svg> Geri</button>
        <span class="cf__count"><b>${n}</b> belirti seçildi</span>
        <button class="cbtn cbtn--pri" type="button" id="next" ${n ? "" : "disabled"}>Sonuçları gör <svg class="ico" aria-hidden="true"><use href="#i-arrow"/></svg></button>
      </div>${NOTE}`;
    $("#back").addEventListener("click", () => go(0));
    $("#next").addEventListener("click", () => go(2));
  }

  /* ---- Adım 3: sonuç ---- */
  function evaluate() {
    const sel = [...state.picked].filter((id) => !SYM[id].acil);
    const out = [];
    for (const c of CONDITIONS) {
      if (c.sex && c.sex !== state.sex) continue;
      if (c.minAge && state.age === "cocuk") continue;
      const coreHit = c.core.filter((id) => state.picked.has(id));
      if (!coreHit.length) continue;
      const supHit = c.sup.filter((id) => state.picked.has(id));
      const W = c.core.length * 2 + c.sup.length;
      const coverage = (coreHit.length * 2 + supHit.length) / W;
      const explain = sel.length ? (coreHit.length + supHit.length) / sel.length : 0;
      const score = 0.6 * coverage + 0.4 * explain;
      if (score < 0.2) continue;
      out.push({ c, score, hits: [...coreHit, ...supHit] });
    }
    return out.sort((a, b) => b.score - a.score).slice(0, 4);
  }

  function stepResult() {
    const acil = [...state.picked].filter((id) => SYM[id].acil);
    const res = evaluate();
    const child = state.age === "cocuk";
    const sexTxt = state.sex === "k" ? "Kadın" : "Erkek";
    const ageTxt = AGES.find((a) => a[0] === state.age)?.[1] + " yaş";

    let html = "";
    if (acil.length) {
      html += `<div class="alert" role="alert">
        <svg class="ico" aria-hidden="true"><use href="#i-alert"/></svg>
        <div><h4>Acil değerlendirme gerekebilir</h4>
        <p>${acil.map((id) => SYM[id].t).join(", ")} — bu belirtiler beklemeden müdahale gerektirebilir. Lütfen 112'yi arayın ya da en yakın acil servise başvurun.</p>
        <a href="tel:112"><svg class="ico" aria-hidden="true" style="width:18px;height:18px"><use href="#i-phone"/></svg> 112'yi ara</a></div>
      </div>`;
    }
    if (child) html += `<div class="note">Çocuklarda belirtiler hızla değişebilir; değerlendirme için <b>Çocuk Sağlığı ve Hastalıkları</b> polikliniğine başvurun.</div>`;
    if (state.age === "yasli") html += `<div class="note">65 yaş üzerinde şikâyetler daha hızlı ağırlaşabilir; belirtiler 1–2 gün içinde düzelmezse beklemeden hekime başvurun.</div>`;

    if (res.length) {
      html += `<p class="step-title">Belirtilerinizle uyumlu olabilecek durumlar</p>
        <p class="step-sub">${sexTxt}, ${ageTxt} · ${state.picked.size} belirti</p>
        <ol class="res">${res.map(({ c, score, hits }) => {
          const pct = Math.min(95, Math.round(score * 100));
          return `<li>
            <div class="res__top"><h4 class="res__name">${c.n}</h4><span class="res__pct">%${pct} uyum</span></div>
            <div class="res__bar"><span data-w="${pct}"></span></div>
            <p class="res__desc">${c.d}</p>
            <div class="res__meta">
              <div class="res__box"><b>İlgili poliklinik</b>${child ? "Çocuk Sağlığı ve Hastalıkları" : c.b}</div>
              <div class="res__box ${c.s ? "res__box--us" : ""}"><b>${c.s ? "Doruk Sağlık Kabini" : "Öneri"}</b>${c.s || "Dinlenin, bol sıvı alın; 3 günde düzelmezse hekime başvurun."}</div>
            </div>
            <p class="res__match">Eşleşen: ${hits.map((id) => SYM[id].t).join(", ")}</p>
          </li>`;
        }).join("")}</ol>`;
    } else {
      html += `<div class="empty"><h4>Net bir eşleşme bulunamadı</h4><p>Seçtiğiniz belirtiler tek bir duruma işaret etmiyor. Şikâyetiniz sürüyorsa bir hekime başvurun ya da bize yazın, sizi doğru yere yönlendirelim.</p></div>`;
    }
    html += `<p class="res__fine">Sonuçlar yanıltıcı olabilir; kesin tanı için hekime başvurun.</p>`;
    body.innerHTML = html;
    requestAnimationFrame(() => $$(".res__bar span", body).forEach((s) => (s.style.width = s.dataset.w + "%")));

    const msg = [
      "Merhaba, sitenizdeki “Hastalığım ne?” aracını kullandım.",
      `Kişi: ${sexTxt}, ${ageTxt}`,
      `Belirtiler: ${[...state.picked].map((id) => SYM[id].t).join(", ")}`,
      res.length ? `Olası: ${res.slice(0, 2).map((r) => r.c.n).join(" / ")}` : "",
      "Bilgi almak istiyorum."
    ].filter(Boolean).join("\n");

    foot.innerHTML = `<div class="cf__row">
        <button class="cbtn cbtn--sec" type="button" id="back"><svg class="ico" aria-hidden="true"><use href="#i-back"/></svg> Belirtiler</button>
        <button class="cbtn cbtn--sec" type="button" id="reset">Baştan başla</button>
        <a class="cbtn cbtn--wa" href="${waLink(msg)}" target="_blank" rel="noopener"><svg class="ico" aria-hidden="true"><use href="#i-wa"/></svg> Bize gönderin</a>
      </div>${NOTE}`;
    $("#back").addEventListener("click", () => go(1));
    $("#reset").addEventListener("click", () => { state.picked.clear(); state.q = ""; state.region = "bas"; go(0); });
  }
})();
