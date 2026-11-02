/*
 * Ajustes de la tienda Maison Cheval (corre en todas las páginas de la tienda).
 * - Solo se vende el outfit completo: oculta y redirige las prendas sueltas.
 * - Carrito: foto del color elegido, precio único del combo y total correcto.
 * - Inicio y encabezado: arreglos visuales que el editor de Tienda Nube no permite.
 */
(function () {
  if (window.__mcTienda || /^\/admin/.test(location.pathname)) return;
  window.__mcTienda = true;

  var COMBO_URL = "/productos/outfit-combo-vvmz65/";
  var COMBO_ID = "378243472";
  var COMBO_PRICE = 149000;
  // Las cinco prendas del combo. El valor es el id de la capa del vestidor (el reloj no tiene colores).
  var PIEZAS = { "378236786": "shirt", "378237068": "pants", "378238684": "shoes", "378238946": "belt", "378239316": null };

  var path = location.pathname;
  var script = document.currentScript;
  var BASE = script ? script.src.replace(/[^/]*(\?.*)?$/, "") : "https://subtle-centaur-dc0a3a.netlify.app/";

  // Prendas sueltas y buscador: todo lleva al armador del outfit.
  if ((/^\/productos\/[^/]+/.test(path) && !/^\/productos\/outfit-combo/.test(path)) || /^\/search(\/|$)/.test(path)) {
    location.replace(COMBO_URL);
    return;
  }

  var CSS = [
    /* Inicio en celular: la copia del carrusel se mostraba como un segundo bloque principal. */
    "#ns-section-slideshow .swiper-slide.swiper-slide-duplicate{display:none!important}",
    /* Encabezado: sin buscador y con fondo sólido para que no se transparente el contenido. */
    ".js-search-expand-form,.search-floating-container{display:none!important}",
    ".sticky-header-wrapper{background:#0A0908!important}",
    "@media(max-width:767px){.head-main .head-row{padding-top:4px!important;padding-bottom:4px!important;grid-template-rows:auto!important;row-gap:0!important}}",
    /* Espacios entre secciones. */
    "#ns-section-rich-text_1793496225546 .btn{margin:0 0 32px!important}",
    "[id^='ns-section-rich-text_']{padding-top:36px!important}",
    "#ns-section-banners_grid_3_vertical{padding-top:32px!important}",
    "#ns-section-banners_grid_3_vertical::before{margin-bottom:28px!important}",
    ".rich-text-section{padding-top:12px!important;padding-bottom:12px!important}",
    "#ns-section-icon-text_1793497152414{padding:24px 0!important}",
    "#ns-section-icon-text_1793497152414>div{padding:0!important}",
    "#ns-block-slide_2 .placeholder{display:none!important}",
    "#ns-section-newsletter_1793497205771{padding:0 16px 40px!important}",
    /* Imagen Estatus / Velocidad / Oportunidad: textos corregidos encima de la imagen. */
    "#ns-block-slide_2 .media-visual{position:relative}",
    "#ns-block-slide_2 .mc-estatus-fix{position:absolute;inset:0;background:url(" + BASE + "estatus-fix.webp) center/100% 100% no-repeat;pointer-events:none}",
    /* Listado: solo el combo, con su precio único. */
    ".js-item-product:not([data-product-id='" + COMBO_ID + "']){display:none!important}",
    ".js-category-controls,.page-header-count{display:none!important}",
    ".product-item-price-compare,.product-item-discount{display:none!important}",
    /* Página del combo: mientras carga Bundle Flow no se muestra el botón ni el precio de fábrica. */
    "form[data-store='product-form-" + COMBO_ID + "'] .form-quantity-container,form[data-store='product-form-" + COMBO_ID + "'] .buy-button-container{display:none!important}",
    ".template-product .js-price-container{display:none!important}",
    "form[data-store='product-form-" + COMBO_ID + "'] .product-actions:not(:has(.bf-mix-match))::before{content:'Cargando opciones…';display:block;padding:32px 0;text-align:center;color:#BDB19C;font-size:18px}",
    /* Textos de ejemplo del tema. */
    "#ns-block-icon_returns,#ns-block-icon_security{display:none!important}",
    /* Recuadro del combo. */
    ".bf-mix-match-title{color:#140F08!important}",
    ".bf-mix-match-title::after{margin-left:0!important}",
    ".bf-mix-match-summary-list,.bf-mix-match-summary-savings{display:none!important}",
    /* Carrito: el outfit se compra entero. */
    ".mc-combo .cart-item-quantity,.mc-combo .cart-item-delete,.mc-combo .cart-item-subtotal,.mc-combo .js-total-promotions{display:none!important}",
    ".js-payment-discount-price-cart-container,.cart-continue-shopping{display:none!important}",
    ".mc-thumb{object-fit:contain!important;background:#ECE8E0!important;padding:4px;box-sizing:border-box}",
    ".mc-vaciar{display:none;background:none;border:0;padding:8px 0;margin:0 0 8px;color:#C9A45C;font:inherit;font-size:15px;text-decoration:underline;cursor:pointer}",
    ".mc-combo .mc-vaciar{display:inline-block}"
  ].join("\n");
  var style = document.createElement("style");
  style.id = "mc-tienda-css";
  style.textContent = CSS;
  (document.head || document.documentElement).appendChild(style);

  // El botón de compra del listado abría una compra rápida del combo sin elegir colores.
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    var card = t.closest(".js-item-product[data-product-id='" + COMBO_ID + "']");
    if (card && t.closest("button,input[type=submit],.js-addtocart,.js-quickshop-modal-open,.btn")) {
      e.preventDefault();
      e.stopPropagation();
      location.href = COMBO_URL;
    }
  }, true);

  // Bundle Flow espera la primera interacción para cargar: se lo despierta enseguida.
  function wakeBundleFlow() {
    window.dispatchEvent(new Event("scroll"));
  }
  if (/^\/productos\/outfit-combo/.test(path)) {
    if (document.readyState === "complete") setTimeout(wakeBundleFlow, 50);
    else window.addEventListener("load", function () { setTimeout(wakeBundleFlow, 50); });
  }

  function norm(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
  }
  function money(n) {
    var p = n.toFixed(2).split(".");
    return "$" + p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "," + p[1];
  }
  function setText(el, txt) {
    if (el && el.textContent.trim() !== txt) el.textContent = txt;
  }

  var colores = null;
  fetch(BASE + "config.json", { cache: "no-cache" })
    .then(function (r) { return r.json(); })
    .then(function (c) {
      colores = {};
      c.layers.forEach(function (L) { colores[L.id] = L.colors; });
      schedule();
    })
    .catch(function () {});

  function fixThumb(item) {
    var capa = PIEZAS[(item.getAttribute("data-store") || "").replace("cart-item-", "")];
    if (!capa || !colores) return;
    var img = item.querySelector(".cart-item-image");
    var variante = item.querySelector(".cart-item-variant");
    if (!img || !variante) return;
    var color = norm(variante.textContent.replace(/[()]/g, "").split(",")[0]);
    var n = (colores[capa] || []).map(norm).indexOf(color);
    if (n < 0) return;
    var src = BASE + capa + "-" + n + ".webp";
    if (img.getAttribute("src") === src) return;
    img.classList.remove("lazyload");
    img.removeAttribute("srcset");
    img.removeAttribute("data-srcset");
    img.removeAttribute("data-src");
    img.classList.add("mc-thumb");
    img.src = src;
  }

  // Devuelve cuántos outfits completos hay en el carrito (0 si no están las cinco prendas por igual).
  function outfits(items) {
    var cant = {};
    items.forEach(function (it) {
      var id = (it.getAttribute("data-store") || "").replace("cart-item-", "");
      var q = it.querySelector(".js-cart-quantity-input");
      cant[id] = (cant[id] || 0) + (q ? parseInt(q.value, 10) || 0 : 1);
    });
    var ids = Object.keys(cant), n = 0;
    if (ids.length !== Object.keys(PIEZAS).length) return 0;
    for (var i = 0; i < ids.length; i++) {
      if (!(ids[i] in PIEZAS) || (n && cant[ids[i]] !== n)) return 0;
      n = cant[ids[i]];
    }
    return n;
  }

  function fixCart(box) {
    var items = [].slice.call(box.querySelectorAll(".js-cart-item")).filter(function (it) {
      return it.style.display !== "none";
    });
    items.forEach(fixThumb);
    var n = outfits(items);
    box.classList.toggle("mc-combo", n > 0);
    if (!n) return;

    var coupon = [].some.call(box.querySelectorAll(".js-coupon-discount-row"), function (r) {
      return getComputedStyle(r).display !== "none";
    });
    if (coupon) return;

    var precio = COMBO_PRICE * n;
    setText(box.querySelector(".js-cart-subtotal"), money(precio));
    var costo = box.querySelector("#shipping-cost");
    var envio = 0;
    if (costo && getComputedStyle(costo).display !== "none") {
      var m = costo.textContent.replace(/[^\d,]/g, "").replace(",", ".");
      envio = parseFloat(m) || 0;
    }
    var total = box.querySelector(".js-cart-total");
    if (total) setText(total, "$ " + money(precio + envio).slice(1));

    if (!box.querySelector(".mc-vaciar")) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "mc-vaciar";
      b.textContent = "Quitar el outfit del carrito";
      b.onclick = vaciar;
      var fila = box.querySelector(".cart-subtotals-container");
      if (fila) fila.parentNode.insertBefore(b, fila);
    }
  }

  // Quita las cinco prendas juntas. En la página del carrito el tema recarga al borrar: se sigue al volver.
  function vaciar() {
    try { sessionStorage.setItem("mc-vaciar", "1"); } catch (e) {}
    siguiente();
  }
  function siguiente() {
    var b = document.querySelector("#modal-cart .js-cart-item .js-cart-item-remove") ||
      document.querySelector("main .js-cart-item .js-cart-item-remove");
    if (b) {
      b.click();
      setTimeout(siguiente, 1500);
    } else {
      try { sessionStorage.removeItem("mc-vaciar"); } catch (e) {}
    }
  }

  function fixEstatus() {
    [].forEach.call(document.querySelectorAll("#ns-block-slide_2 .media-visual"), function (v) {
      if (v.querySelector(".mc-estatus-fix")) return;
      var d = document.createElement("div");
      d.className = "mc-estatus-fix";
      v.appendChild(d);
    });
  }

  // Resumen del checkout: la misma foto del color elegido que en el carrito.
  var POR_NOMBRE = [[/^camisa/, "shirt"], [/^pantalon/, "pants"], [/^zapato/, "shoes"], [/^cinturon/, "belt"]];
  function fixCheckout() {
    if (!colores) return;
    [].forEach.call(document.images, function (img) {
      var m = /^(.+?)\s*\(([^,)]+)/.exec(img.alt || "");
      if (!m) return;
      var capa = null;
      POR_NOMBRE.forEach(function (p) { if (p[0].test(norm(m[1]))) capa = p[1]; });
      if (!capa) return;
      var n = (colores[capa] || []).map(norm).indexOf(norm(m[2]));
      if (n < 0) return;
      var src = BASE + capa + "-" + n + ".webp";
      if (img.getAttribute("src") === src) return;
      img.removeAttribute("srcset");
      img.classList.add("mc-thumb");
      img.src = src;
    });
  }

  function run() {
    if (/^\/checkout\//.test(path)) { fixCheckout(); return; }
    fixEstatus();
    var boxes = [document.getElementById("modal-cart")];
    if (/^\/comprar/.test(path)) boxes.push(document.querySelector("main"));
    boxes.forEach(function (b) { if (b) fixCart(b); });
  }

  var timer;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(run, 120);
  }

  function boot() {
    run();
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["src"] });
    try { if (sessionStorage.getItem("mc-vaciar")) setTimeout(siguiente, 800); } catch (e) {}
  }
  if (document.body) boot();
  else document.addEventListener("DOMContentLoaded", boot);
})();

/*
 * Vestidor Maison Cheval
 * Muestra un maniquí que se viste con los colores elegidos en el combo de Bundle Flow.
 *
 * Para agregar o cambiar colores/prendas: editar config.json y subir las imágenes
 * <id>-<n>.webp (n = posición del color en la lista "colors", empezando en 0).
 * El nombre del color tiene que coincidir con el de Tienda Nube
 * (no importan mayúsculas ni acentos).
 */
(function () {
  if (!/\/productos\/outfit-combo/.test(location.pathname) || window.__mcVest) return;
  window.__mcVest = true;

  var script = document.currentScript;
  var BASE = script ? script.src.replace(/[^/]*(\?.*)?$/, "") : "https://subtle-centaur-dc0a3a.netlify.app/";
  var REDUCED = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  var CSS = [
    "#mc-vest{position:relative;width:100%;aspect-ratio:1500/2009;overflow:hidden;background:#b1a99a;border-radius:4px}",
    "#mc-vest .mc-cam{position:absolute;inset:0;transform-origin:0 0;transition:transform .7s cubic-bezier(.65,.05,.25,1);will-change:transform}",
    "#mc-vest img{position:absolute;display:block;max-width:none;margin:0;padding:0;border:0;user-select:none;-webkit-user-drag:none;pointer-events:none}",
    "#mc-vest img.mc-l{opacity:0;visibility:hidden;transition:opacity .3s ease}",
    "#mc-vest img.mc-l.on{opacity:1;visibility:visible}",
    "#mc-vest img.mc-l.under{opacity:1;visibility:visible;transition:none}",
    "#mc-vest .mc-sweep{position:absolute;inset:0;pointer-events:none;opacity:0;background:linear-gradient(100deg,#fff0 35%,#ffffff66 50%,#fff0 65%);background-size:250% 100%}",
    "#mc-vest .mc-sweep.go{animation:mcsw .6s ease-out}",
    "@keyframes mcsw{0%{opacity:1;background-position:120% 0}100%{opacity:0;background-position:-30% 0}}",
    "#mc-vest .mc-pill{position:absolute;top:12px;z-index:30;background:#0d0b09cc;padding:5px 10px;border-radius:999px;font:500 11px/1.4 'Cinzel',Georgia,serif;letter-spacing:.25em;color:#c9a24f;text-transform:uppercase;border:0;margin:0}",
    "#mc-vest .mc-lab{left:12px}",
    /* Botón de arriba a la derecha (abajo tapaba los zapatos en celular).
       "Ver outfit completo": vuelve a la vista entera y la deja fija mientras se eligen colores.
       "Acercar prendas": vuelve a enfocar cada prenda al elegirla. */
    "#mc-vest .mc-hint{right:12px;display:none;align-items:center;gap:6px;min-height:32px;padding:6px 14px;background:#c9a24f;color:#0d0b09;font:700 11px/1 Arial,sans-serif;letter-spacing:.12em;cursor:pointer;box-shadow:0 2px 8px #0005;transition:background .2s}",
    "#mc-vest .mc-hint.show{display:inline-flex}",
    "#mc-vest .mc-hint:hover{background:#dbb560}",
    "#mc-vest .mc-hint:focus-visible{outline:2px solid #fff;outline-offset:2px}",
    "#mc-vest .mc-hint.alt{background:#0d0b09cc;color:#efe6d6;border:1px solid #c9a24f88}",
    "#mc-vest .mc-hint svg{width:14px;height:14px;flex:none}",
    "#mc-vest .mc-load{position:absolute;inset:0;z-index:40;display:flex;align-items:center;justify-content:center;background:#b1a99a;color:#3d382f;font:12px Arial,sans-serif;letter-spacing:.2em;text-transform:uppercase}",
    "@media (prefers-reduced-motion:reduce){#mc-vest .mc-cam,#mc-vest img.mc-l{transition:none}#mc-vest .mc-sweep.go{animation:none}}"
  ].join("\n");

  function norm(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  }

  var cfg, W, H, root, cam, hint, lab, sweep;
  var bySlot = {};
  var view = null; // capa enfocada o null = outfit completo
  var auto = true; // true = al elegir un color se acerca a esa prenda
  var last = null; // última prenda tocada
  var ICON_FULL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';
  var ICON_ZOOM = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21M10.5 7.5v6M7.5 10.5h6"/></svg>';

  function place(el, box) {
    el.style.left = (box[0] / W) * 100 + "%";
    el.style.top = (box[1] / H) * 100 + "%";
    el.style.width = (box[2] / W) * 100 + "%";
    el.style.height = (box[3] / H) * 100 + "%";
  }

  function build(host) {
    var style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    root = document.createElement("div");
    root.id = "mc-vest";
    root.innerHTML =
      '<span class="mc-pill mc-lab">Vestidor</span>' +
      '<button type="button" class="mc-pill mc-hint"><span class="mc-i"></span><span class="mc-t"></span></button>' +
      '<div class="mc-cam"></div><div class="mc-sweep"></div>' +
      '<div class="mc-load">Preparando el probador…</div>';
    cam = root.querySelector(".mc-cam");
    hint = root.querySelector(".mc-hint");
    sweep = root.querySelector(".mc-sweep");
    lab = root.querySelector(".mc-lab");
    hint.onclick = function () {
      if (auto && view) { auto = false; focus(null); }   // ver outfit completo y dejarlo fijo
      else { auto = true; focus(last); }                  // volver a acercar prendas
    };
    paint();

    var loads = [];
    function img(file, box, z, cls) {
      var i = new Image();
      i.alt = "";
      if (cls) i.className = cls;
      i.style.zIndex = z;
      place(i, box);
      loads.push(new Promise(function (res) { i.onload = i.onerror = res; }));
      i.src = BASE + file;
      cam.appendChild(i);
      return i;
    }

    img(cfg.background, [0, 0, W, H], 1);
    img(cfg.base, [0, 0, W, H], 20);
    cfg.layers.forEach(function (L) {
      L.cur = 0;
      L.imgs = L.colors.map(function (_, n) {
        return img(L.id + "-" + n + ".webp", L.box, L.z, "mc-l" + (n === 0 ? " on" : ""));
      });
      // Capa extra que cambia con este color pero va por encima de otra prenda
      // (por ejemplo, las presillas del pantalón sobre el cinturón).
      if (L.over) {
        L.overImgs = L.colors.map(function (_, n) {
          return img(L.over.id + "-" + n + ".webp", L.over.box, L.over.z, "mc-l" + (n === 0 ? " on" : ""));
        });
      }
      bySlot[L.slot] = L;
    });
    Promise.all(loads).then(function () { root.querySelector(".mc-load").style.display = "none"; });

    host.innerHTML = "";
    host.appendChild(root);
    window.addEventListener("resize", frame);
    frame();
  }

  function frame() {
    if (!root) return;
    paint();
    var w = root.clientWidth, h = root.clientHeight;
    var f = view ? view.focus : [W / 2, H / 2, 1];
    var s = f[2];
    var x = w / 2 - (f[0] / W) * w * s;
    var y = h / 2 - (f[1] / H) * h * s;
    x = Math.min(0, Math.max(w - w * s, x));
    y = Math.min(0, Math.max(h - h * s, y));
    cam.style.transform = "translate(" + x + "px," + y + "px) scale(" + s + ")";
  }

  function paint() {
    if (!lab) return;
    lab.textContent = view ? view.name : "Vestidor";
    var full = auto && view;          // hay zoom: ofrecer ver todo
    var back = !auto;                 // vista fija: ofrecer volver a acercar
    hint.classList.toggle("show", !!(full || back));
    hint.classList.toggle("alt", back);
    hint.querySelector(".mc-i").innerHTML = back ? ICON_ZOOM : ICON_FULL;
    var narrow = root.clientWidth < 400; // en celular, texto corto para no chocar con la etiqueta de la izquierda
    hint.querySelector(".mc-t").textContent = back ? (narrow ? "Acercar" : "Acercar prendas") : (narrow ? "Ver todo" : "Ver outfit completo");
    hint.setAttribute("aria-label", back ? "Acercar cada prenda al elegirla" : "Ver el outfit completo");
  }

  function focus(L) {
    view = L;
    paint();
    frame();
  }

  function swap(imgs, from, to, z, animate) {
    var prev = imgs[from], next = imgs[to];
    imgs.forEach(function (i) { if (i !== prev && i !== next) i.classList.remove("on", "under"); });
    prev.classList.remove("on");
    prev.classList.add("under");
    next.style.zIndex = z + 1;
    next.classList.add("on");
    var done = function () { prev.classList.remove("under"); next.style.zIndex = z; };
    if (REDUCED || !animate) done(); else setTimeout(done, 320);
  }

  function show(L, n, animate) {
    if (n < 0 || n === L.cur || !L.imgs) return;
    swap(L.imgs, L.cur, n, L.z, animate);
    if (L.overImgs) swap(L.overImgs, L.cur, n, L.over.z, animate);
    L.cur = n;
    if (animate && !REDUCED) { sweep.classList.remove("go"); void sweep.offsetWidth; sweep.classList.add("go"); }
  }

  function sync(sel, animate) {
    var row = sel.closest(".bf-mix-match-unit-row");
    if (!row) return;
    var L = bySlot[row.getAttribute("data-bf-slot")];
    if (!L) return;
    // El primer selector de cada fila es el color; los demás (talle) solo enfocan la prenda.
    if (row.querySelectorAll("select.bf-mix-match-attr-select")[0] === sel) {
      var v = norm(sel.value);
      if (v) {
        for (var n = 0; n < L.colors.length; n++) {
          if (norm(L.colors[n]) === v) { show(L, n, animate); break; }
        }
      }
    }
    if (animate) { last = L; if (auto) focus(L); }
  }

  document.addEventListener("change", function (e) {
    var t = e.target;
    if (root && t && t.classList && t.classList.contains("bf-mix-match-attr-select")) sync(t, true);
  }, true);

  function start() {
    var tries = 0;
    (function tick() {
      var host = document.querySelector("#ns-block-product_media") || document.querySelector(".js-product-images");
      if (host && !root) build(host);
      var sels = document.querySelectorAll("select.bf-mix-match-attr-select");
      if (root && sels.length) { for (var i = 0; i < sels.length; i++) sync(sels[i], false); }
      else if (++tries < 80) setTimeout(tick, 250);
    })();
  }

  fetch(BASE + "config.json", { cache: "no-cache" })
    .then(function (r) { return r.json(); })
    .then(function (c) { cfg = c; W = c.canvas[0]; H = c.canvas[1]; start(); })
    .catch(function (e) { console.warn("[vestidor] no se pudo cargar config.json", e); });
})();
