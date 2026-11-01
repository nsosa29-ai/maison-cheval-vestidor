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
    "#mc-vest{position:relative;width:100%;aspect-ratio:1500/2009;overflow:hidden;background:#c9c9cb;border-radius:4px}",
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
    /* La etiqueta de la derecha muestra la prenda enfocada y, cuando hay zoom, sirve para volver al outfit completo.
       Reemplaza al botón de abajo, que en celular tapaba los zapatos. */
    "#mc-vest .mc-hint{right:12px;color:#efe6d6;font-family:Arial,sans-serif;letter-spacing:.12em;cursor:default}",
    "#mc-vest .mc-hint.zoom{cursor:pointer;border:1px solid #c9a24f88}",
    "#mc-vest .mc-hint .mc-x{display:none;margin-left:6px;color:#c9a24f}",
    "#mc-vest .mc-hint.zoom .mc-x{display:inline}",
    "#mc-vest .mc-load{position:absolute;inset:0;z-index:40;display:flex;align-items:center;justify-content:center;background:#c9c9cb;color:#555;font:12px Arial,sans-serif;letter-spacing:.2em;text-transform:uppercase}",
    "@media (prefers-reduced-motion:reduce){#mc-vest .mc-cam,#mc-vest img.mc-l{transition:none}#mc-vest .mc-sweep.go{animation:none}}"
  ].join("\n");

  function norm(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  }

  var cfg, W, H, root, cam, hint, sweep;
  var bySlot = {};
  var view = null; // capa enfocada o null = outfit completo

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
      '<button type="button" class="mc-pill mc-hint" aria-label="Ver outfit completo"><span class="mc-t">Outfit completo</span><span class="mc-x">✕</span></button>' +
      '<div class="mc-cam"></div><div class="mc-sweep"></div>' +
      '<div class="mc-load">Preparando el probador…</div>';
    cam = root.querySelector(".mc-cam");
    hint = root.querySelector(".mc-hint");
    sweep = root.querySelector(".mc-sweep");
    hint.onclick = function () { if (view) focus(null); };

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
    var w = root.clientWidth, h = root.clientHeight;
    var f = view ? view.focus : [W / 2, H / 2, 1];
    var s = f[2];
    var x = w / 2 - (f[0] / W) * w * s;
    var y = h / 2 - (f[1] / H) * h * s;
    x = Math.min(0, Math.max(w - w * s, x));
    y = Math.min(0, Math.max(h - h * s, y));
    cam.style.transform = "translate(" + x + "px," + y + "px) scale(" + s + ")";
  }

  function focus(L) {
    view = L;
    hint.querySelector(".mc-t").textContent = L ? L.name : "Outfit completo";
    hint.classList.toggle("zoom", !!L);
    frame();
  }

  function show(L, n, animate) {
    if (n < 0 || n === L.cur || !L.imgs) return;
    var prev = L.imgs[L.cur], next = L.imgs[n];
    L.imgs.forEach(function (i) { if (i !== prev && i !== next) i.classList.remove("on", "under"); });
    prev.classList.remove("on");
    prev.classList.add("under");
    next.style.zIndex = L.z + 1;
    next.classList.add("on");
    var done = function () { prev.classList.remove("under"); next.style.zIndex = L.z; };
    if (REDUCED || !animate) done(); else setTimeout(done, 320);
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
    if (animate) focus(L);
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
