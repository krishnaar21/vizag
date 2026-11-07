/* themes.js

   Theme palettes and the theme sheet.

   Parts, in the order they run:
    1. Theme palettes. Applies the chosen palette (Classic, Mono, Paper, Ocean, Sage, Lilac) and keeps the theme sheet in sync.
*/

/* ==========================================================================
   Theme palettes. Applies the chosen palette (Classic, Mono, Paper, Ocean, Sage, Lilac) and keeps the theme sheet in sync.
   ========================================================================== */
try {
  (function () {
    var META = {
        mono: {
          n: "Mono",
          l: "#F0F0F2",
          d: "#09090B",
          sl: "#F0F0F2",
          sd: "#1E1F22",
          bl: "#141416",
          bd: "#F0F0F2",
          gl: { sun0: "#E4E4EA", sun1: "#B5B5C4", edge: "#8A8AA0", ray: "#9292AA" },
          gd: { moon: "#F6F6F8", beam: "#FAFAFB", fly: "#9A9AAF", dot: "#CECED9", star: "#C0C0CE" },
        },
        paper: {
          n: "Paper",
          l: "#F2F0EC",
          d: "#0E0D0D",
          sl: "#F2F0EC",
          sd: "#211E1D",
          bl: "#A35F0B",
          bd: "#F2B45A",
          gl: { sun0: "#F5E9D9", sun1: "#E4C195", edge: "#CC9B5E", ray: "#D8A464" },
          gd: { moon: "#F6EBDC", beam: "#FBE8CE", fly: "#DBAF6E", dot: "#EED8B9", star: "#E9CDA5" },
        },
        ocean: {
          n: "Ocean",
          l: "#ECF0F7",
          d: "#080B14",
          sl: "#ECF0F7",
          sd: "#171E30",
          bl: "#1D5FD1",
          bd: "#6EA8FF",
          gl: { sun0: "#D9E3F5", sun1: "#95B2E4", edge: "#5E86CC", ray: "#648ED8" },
          gd: { moon: "#DEE9FA", beam: "#D4E5FF", fly: "#6E9ADB", dot: "#B9CEEE", star: "#A5C0E9" },
        },
        sage: {
          n: "Sage",
          l: "#EBEFE8",
          d: "#0B0E0A",
          sl: "#EBEFE8",
          sd: "#1E271B",
          bl: "#3D7747",
          bd: "#93D1A0",
          gl: { sun0: "#D9F5DE", sun1: "#95E4A2", edge: "#5ECC71", ray: "#64D878" },
          gd: { moon: "#E5F0E9", beam: "#DFF1E2", fly: "#6EDB85", dot: "#B9EEC4", star: "#A5E9B3" },
        },
        lilac: {
          n: "Lilac",
          l: "#F0ECF6",
          d: "#0E0B14",
          sl: "#F0ECF6",
          sd: "#251E31",
          bl: "#6A4FCB",
          bd: "#B9A3FF",
          gl: { sun0: "#DFD9F5", sun1: "#A695E4", edge: "#765ECC", ray: "#7D64D8" },
          gd: { moon: "#ECE8FA", beam: "#EAE3FF", fly: "#886EDB", dot: "#C6B9EE", star: "#B5A5E9" },
        },
        classic: {
          n: "Classic",
          l: "#EFEFF2",
          d: "#101012",
          sl: "#EFEFF2",
          sd: "#141416",
          bl: "#2563EB",
          bd: "#5B9DFF",
        },
      },
      ORDER = ["classic", "mono", "paper", "ocean", "sage", "lilac"],
      ICON = {
        auto: '<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 0 0 16z" fill="currentColor"/>',
        light:
          '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
        graphite: '<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>',
      };
    var root = document.documentElement,
      LS = "vizag-pal";
    function ls(k, v) {
      try {
        if (v === undefined) return localStorage.getItem(k);
        localStorage.setItem(k, v);
      } catch (e) {
        return null;
      }
    }
    var pal = ls(LS),
      sk = ls("vizag-skin2");
    function skinBtn(m) {
      return document.querySelector('button[data-skin="' + m + '"]');
    }
    /* old Navy and Midnight themes become Ocean / Classic in Dark mode */
    /* Themes v2 is a developer option; off = original themes (v1) */
    function v2() {
      return true;
    }
    if (!META[pal]) pal = "classic";
    function migrate() {
      var k = ls("vizag-skin2");
      if (k === "navy" || k === "midnight") {
        if (k === "navy" && pal === "classic") {
          pal = "ocean";
          ls(LS, pal);
        }
        var gb = skinBtn("graphite");
        if (gb) gb.click();
      }
    }
    if (v2()) migrate();
    function mode() {
      var m = ls("vizag-skin2");
      return m === "light" || m === "graphite" ? m : "auto";
    }
    function dark() {
      return root.getAttribute("data-skin") !== "light";
    }
    function label() {
      var el = document.getElementById("skin-name");
      if (!el) return;
      var t = META[pal].n + (mode() === "auto" ? "" : mode() === "light" ? " \u00b7 Light" : " \u00b7 Dark");
      if (v2() && el.textContent !== t) el.textContent = t;
    }
    function meta() {
      if (!v2()) return;
      var m = document.querySelector('meta[name="theme-color"]');
      if (m) m.setAttribute("content", dark() ? META[pal].d : META[pal].l);
    }
    var ui = null;
    /* palette -> app icon preset */
    var ICONSET = {
      classic: "classic",
      mono: "classic",
      paper: "paper",
      ocean: "ocean",
      sage: "sage",
      lilac: "lilac",
    };
    function matchIcon() {
      if (window.__kzPreset) window.__kzPreset(ICONSET[pal] || "classic");
    }
    document.addEventListener("kz-match", function () {
      paint();
    });
    /* sticky sheet headers take the exact background of the sheet they sit in, so header and body read as one surface */
    var hq = 0;
    function hdrSync() {
      hq = 0;
      root.classList.toggle("sh-open", shOpen());
      document
        .querySelectorAll(".lshead,.pshd,.sheet:not(.inpage)>.shtitle,.vpsheet .shtitle")
        .forEach(function (h) {
          if (!h.offsetParent) return;
          var p = h.parentElement,
            c = "";
          while (p && p !== document.documentElement) {
            var b = getComputedStyle(p).backgroundColor;
            if (b && b !== "transparent" && !/rgba\([^)]*,\s*0\)$/.test(b)) {
              c = b;
              break;
            }
            p = p.parentElement;
          }
          if (c && h.style.getPropertyValue("background") !== c) {
            h.style.setProperty("background", c, "important");
            h.style.setProperty("box-shadow", "0 -40px 0 0 " + c, "important");
          }
        });
    }
    /* while a sheet is open, the page behind never scrolls: touches only scroll a scrollable box inside the sheet */
    var tY = 0,
      tX = 0;
    function shOpen() {
      return !!document.querySelector(
        "#scrim:not([hidden]),.placesh:not([hidden]),.passsh:not([hidden]),.vpsheet:not([hidden])",
      );
    }
    document.addEventListener(
      "touchstart",
      function (e) {
        if (e.touches[0]) {
          tY = e.touches[0].clientY;
          tX = e.touches[0].clientX;
        }
      },
      { passive: true },
    );
    document.addEventListener(
      "touchmove",
      function (e) {
        if (!root.classList.contains("sh-open") || !e.touches[0] || e.touches.length > 1) return;
        var t = e.target;
        if (
          t.closest &&
          t.closest("input,textarea,select,[contenteditable],.hkart,.wgbox,iframe,.noscrolllock")
        )
          return;
        var dy = e.touches[0].clientY - tY,
          dx = e.touches[0].clientX - tX,
          n = t;
        while (n && n.nodeType === 1 && n !== document.body) {
          var cs = getComputedStyle(n);
          if (Math.abs(dx) > Math.abs(dy)) {
            if (/(auto|scroll)/.test(cs.overflowX) && n.scrollWidth > n.clientWidth + 1) return;
          } else if (/(auto|scroll)/.test(cs.overflowY) && n.scrollHeight > n.clientHeight + 1) {
            if ((dy > 0 && n.scrollTop > 0) || (dy < 0 && n.scrollTop + n.clientHeight < n.scrollHeight - 1))
              return;
          }
          n = n.parentElement;
        }
        if (e.cancelable) e.preventDefault();
      },
      { passive: false },
    );
    /* the walking-globe scene follows the real sky: live weather (rain, snow, fog, cloud) and local time (sun by day, moon by night) */
    window.__sceneWx = function () {
      var s = document.getElementById("on-sheet"),
        w = s && s.getAttribute("data-wx"),
        h = new Date().getHours();
      var a = s && s.querySelector(".hkart"),
        t = a && a.getAttribute("data-tod");
      var night = w === "night" || (t ? t === "night" : h >= 19 || h < 5);
      var sky = !w || w === "night" ? "clear" : w;
      return { sky: sky, night: night };
    };
    var wxKey = "";
    function wxSync() {
      var x = window.__sceneWx(),
        k = x.sky + x.night;
      root.classList.toggle("sky-night", x.night);
      root.classList.toggle("sky-day", !x.night);
      if (k !== wxKey) {
        wxKey = k;
        try {
          window.dispatchEvent(new Event("pal-change"));
        } catch (e) {}
      }
    }
    new MutationObserver(wxSync).observe(document.documentElement, {
      attributes: true,
      subtree: true,
      attributeFilter: ["data-wx", "data-tod"],
    });
    setInterval(wxSync, 60000);
    wxSync();
    function obSync() {
      var o = document.getElementById("offline"),
        h = 0;
      if (o && !o.hidden && getComputedStyle(o).display !== "none")
        h = Math.max(0, Math.round(o.getBoundingClientRect().bottom));
      root.style.setProperty("--obh", h + "px");
    }
    (function () {
      var o = document.getElementById("offline");
      if (!o) return;
      if (window.ResizeObserver) new ResizeObserver(obSync).observe(o);
      new MutationObserver(obSync).observe(o, {
        attributes: true,
        attributeFilter: ["hidden", "class", "style"],
      });
      window.addEventListener("online", function () {
        setTimeout(obSync, 50);
      });
      window.addEventListener("offline", function () {
        setTimeout(obSync, 50);
      });
      obSync();
    })();
    function hdrQ() {
      if (!hq) {
        hq = 1;
        requestAnimationFrame(hdrSync);
      }
    }
    new MutationObserver(hdrQ).observe(document.documentElement, {
      attributes: true,
      subtree: true,
      attributeFilter: ["hidden", "class", "data-skin", "data-pal", "open"],
    });
    var v1name = { auto: "Auto", light: "Light", graphite: "Dark", midnight: "Midnight", navy: "Navy" };
    var lastG = null;
    window.__palGlow = function () {
      if (!v2() || pal === "classic") return null;
      var x = META[pal];
      var g = {},
        a = x.gl || {},
        b = x.gd || {},
        i;
      ["fly", "dot", "star"].forEach(function (k) {
        if (b[k]) g[k] = b[k];
      });
      var cs = getComputedStyle(root),
        ac = cs.getPropertyValue("--accent").trim(),
        bg = cs.getPropertyValue("--bg").trim(),
        ik = cs.getPropertyValue("--ink").trim(),
        dk = dark();
      var mx = function (p, c) {
        return "color-mix(in srgb," + ac + " " + p + "%," + (c || bg) + ")";
      };
      if (ac && bg)
        g.vars = dk
          ? {
              "--ray": mx(75, ik),
              "--sea0": mx(6),
              "--sea1": mx(12),
              "--sea2": mx(20),
              "--land": mx(10),
              "--coast": mx(45),
              "--seadot": mx(40),
              "--g1": mx(35, ik),
              "--g2": mx(50),
              "--g3": mx(30),
              "--g4": mx(14),
              "--cl1": mx(42),
              "--cl2": mx(26),
            }
          : {
              "--sea0": mx(8),
              "--sea1": mx(16),
              "--sea2": mx(26),
              "--land": mx(12),
              "--coast": mx(50),
              "--seadot": mx(45),
              "--g1": mx(30, ik),
              "--g2": mx(55),
              "--g3": mx(32),
              "--g4": mx(16),
              "--cl1": mx(40),
              "--cl2": mx(22),
            };
      return g;
    };
    function glowSync() {
      var k = (v2() ? pal : "") + (dark() ? "d" : "l");
      if (k !== lastG) {
        lastG = k;
        try {
          window.dispatchEvent(new Event("pal-change"));
        } catch (e) {}
      }
    }
    function paint() {
      var on = v2();
      if (ui) {
        ui.hidden = !on;
        ui.parentNode.querySelectorAll(".swrow").forEach(function (o) {
          o.classList.toggle("pl-hide", on);
        });
      }
      document.querySelectorAll("[data-devthv2]").forEach(function (b) {
        b.setAttribute("aria-pressed", String((b.dataset.devthv2 === "on") === on));
      });
      setTimeout(glowSync, 0);
      if (!on) {
        root.removeAttribute("data-pal");
        var el = document.getElementById("skin-name"),
          k = ls("vizag-skin2") || "light";
        if (el && v1name[k] && el.textContent !== v1name[k]) el.textContent = v1name[k];
        return;
      }
      root.setAttribute("data-pal", pal);
      meta();
      label();
      if (!ui) return;
      ui.querySelectorAll("[data-pm]").forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.dataset.pm === mode()));
      });
      ui.querySelectorAll("[data-pl]").forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.dataset.pl === pal));
      });
      var s = ui.querySelector(".pl-sub b");
      if (s) s.textContent = META[pal].n;
      var mt = ui.querySelector(".pl-match");
      if (mt) mt.setAttribute("aria-checked", String(ls("vizag-icon-match") === "1"));
    }
    function build() {
      var sh = document.getElementById("theme-sheet");
      if (!sh || ui) return;
      var sec = sh.querySelector(".thsec");
      if (!sec) return;
      ui = document.createElement("div");
      ui.className = "pl-ui";
      ui.innerHTML =
        '<div class="pl-mode" role="group" aria-label="Mode">' +
        [
          ["auto", "Auto"],
          ["light", "Light"],
          ["graphite", "Dark"],
        ]
          .map(function (m) {
            return (
              '<button type="button" data-pm="' +
              m[0] +
              '" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true">' +
              ICON[m[0]] +
              "</svg>" +
              m[1] +
              "</button>"
            );
          })
          .join("") +
        "</div>" +
        '<div class="pl-sub"><span>Palette</span><b>' +
        META[pal].n +
        '</b></div><div class="pl-row">' +
        ORDER.map(function (id) {
          var p = META[id];
          return (
            '<button type="button" class="pl-s" data-pl="' +
            id +
            '" aria-label="' +
            p.n +
            '" title="' +
            p.n +
            '" aria-pressed="false" style="background:linear-gradient(135deg,' +
            p.sl +
            " 50%," +
            p.sd +
            ' 50%)"><i style="background:linear-gradient(135deg,' +
            p.bl +
            " 50%," +
            p.bd +
            ' 50%)"></i></button>'
          );
        }).join("") +
        "</div>";
      ui.innerHTML +=
        '<button type="button" class="pl-match" role="switch" aria-checked="false"><span><b>Match app icon to theme</b><small>Uses the icon set for your palette</small></span><i aria-hidden="true"></i></button>';
      sec.appendChild(ui);
      ui.querySelector(".pl-match").onclick = function () {
        var on = ls("vizag-icon-match") !== "1";
        ls("vizag-icon-match", on ? "1" : "0");
        if (on) matchIcon();
        paint();
      };
      ui.querySelectorAll("[data-pm]").forEach(function (b) {
        b.onclick = function () {
          var sb = skinBtn(b.dataset.pm);
          if (sb) sb.click();
          paint();
        };
      });
      ui.querySelectorAll("[data-pl]").forEach(function (b) {
        b.onclick = function () {
          pal = b.dataset.pl;
          ls(LS, pal);
          if (ls("vizag-icon-match") === "1") matchIcon();
          paint();
        };
      });
      paint();
    }
    new MutationObserver(function () {
      meta();
      label();
    }).observe(root, { attributes: true, attributeFilter: ["data-skin"] });
    var sn = document.getElementById("skin-name");
    if (sn) new MutationObserver(label).observe(sn, { childList: true, characterData: true, subtree: true });
    /* developer option row */
    var dg = document.querySelector("#devgrp .devopts");
    if (dg && !dg.querySelector("[data-devthv2]")) {
      var row = document.createElement("div");
      row.className = "setrow";
      row.innerHTML =
        '<span class="setl">Themes v2<small>Mode + colour palettes in Theme &amp; app icon</small></span><div class="seg" role="group" aria-label="Themes v2"><button type="button" data-devthv2="off">Off</button><button type="button" data-devthv2="on">On</button></div>';
      dg.insertBefore(row, dg.firstChild);
      row.querySelectorAll("[data-devthv2]").forEach(function (b) {
        b.onclick = function (e) {
          e.stopPropagation();
          var on = b.dataset.devthv2 === "on";
          ls("vizag-themes-v2", on ? "1" : "0");
          if (on) migrate();
          else {
            var k = ls("vizag-skin2");
            var sb = skinBtn(k === "light" || k === "graphite" ? k : "auto");
            if (sb) sb.click();
          }
          paint();
          if (window.__toast) window.__toast(on ? "Themes v2 on" : "Themes v2 off");
        };
      });
    }
    build();
    paint();
    if (!ui)
      document.addEventListener(
        "click",
        function () {
          build();
        },
        true,
      );
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Theme palettes. Applies the chosen palette (Classic, Mono, P", err);
}
