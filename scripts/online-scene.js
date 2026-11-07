/* online-scene.js

   The globe and weather scene in the online and offline sheets.

   Parts, in the order they run:
    1. Online sheet scene. Builds the animated globe and weather scene shown in the 'You're online' and offline sheets.
*/

/* ==========================================================================
   Online sheet scene. Builds the animated globe and weather scene shown in the 'You're online' and offline sheets.
   ========================================================================== */
try {
  (function () {
    var src = document.getElementById("wgsrc");
    if (!src) return;
    var fr = null,
      box = null;
    function hk() {
      return document.querySelector("#on-sheet .hkart");
    }
    // the online globe and grass, as is: cloned once, ids renamed, sky, weather and the online walker's extras removed
    var HIDE =
      ".twwrap,.sky2,.k2,.k2cat,.hkpupw,.hkleash,.wxsky,.wxrays,.wxmoon,.wxstars,.wxclouds,.wxdark,.wxbolt,.wxrain,.wxheavy,.wxsnow,.wxfog,.wxflash,.wxsun,.wxc0,.wxdl,.wxrr,.wxs1,.wxfl,.wxreel";
    function globe(h) {
      var t = document.createElement("div");
      t.innerHTML = h.outerHTML;
      var g = t.firstElementChild;
      var e = t.innerHTML,
        ids = {};
      e.replace(/\sid="([^"]+)"/g, function (m, k) {
        ids[k] = 1;
        return m;
      });
      Object.keys(ids).forEach(function (k) {
        var q = k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        e = e
          .replace(new RegExp('id="' + q + '"', "g"), 'id="' + k + '_ds"')
          .replace(new RegExp("url\\(#" + q + "\\)", "g"), "url(#" + k + "_ds)")
          .replace(new RegExp('href="#' + q + '"', "g"), 'href="#' + k + '_ds"');
      });
      t.innerHTML = e;
      g = t.firstElementChild;
      g.setAttribute("class", "hkart dsglobe");
      g.removeAttribute("style");
      g.setAttribute("aria-hidden", "true");
      if (window.__hkLandAt) {
        var r = window.__hkLandAt(window.__hkP ? window.__hkP() : 0);
        g.querySelectorAll(".hkland").forEach(function (x) {
          x.setAttribute("d", r[0]);
        });
        var gr = g.querySelector(".hkgrat");
        if (gr) gr.setAttribute("d", r[1]);
      }
      return g;
    }
    function build() {
      var sh = document.getElementById("off-sheet");
      if (!sh) return null;
      if (box && sh.contains(box)) return box;
      var art = sh.querySelector(".dsart"),
        h = hk();
      if (!art || !h || !h.querySelector(".grass2")) return null;
      box = document.createElement("div");
      box.className = "wgbox dsbox";
      box.setAttribute("aria-hidden", "true");
      box.appendChild(globe(h));
      fr = document.createElement("iframe");
      fr.className = "wgfr dsfr";
      fr.title = "Walker searching for signal on the globe";
      fr.setAttribute("aria-hidden", "true");
      fr.setAttribute("tabindex", "-1");
      fr.srcdoc = src.textContent.replace(/<\\\/script/g, "</script");
      box.appendChild(fr);
      art.replaceWith(box);
      return box;
    }
    var PV = [
      ["man", 0, "Man"],
      ["man", 1, "Man"],
      ["woman", 0, "Woman"],
      ["woman", 1, "Woman"],
      ["nb", 0, "Non-binary"],
      ["nb", 1, "Non-binary"],
    ];
    function ls(k, v) {
      try {
        if (v === undefined) return localStorage.getItem(k);
        v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v);
      } catch (e) {}
      return null;
    }
    function pvOn() {
      return ls("vizag-dev-ofp") === "1";
    }
    function pv() {
      var n = PV.length,
        i = ((+(ls("vizag-dev-ofi") || 0) % n) + n) % n;
      return PV[i];
    }
    function cap() {
      if (!box) return;
      var c = box.parentNode && box.parentNode.querySelector(".dscap");
      if (!pvOn()) {
        if (c) c.remove();
        return;
      }
      if (!c) {
        c = document.createElement("p");
        c.className = "dscap";
        box.after(c);
      }
      var q = pv();
      c.textContent = q[2] + " \u00b7 " + (q[1] ? "Night" : "Day") + " \u00b7 preview, swipe to switch";
    }
    function step(d) {
      ls("vizag-dev-ofi", String(+(ls("vizag-dev-ofi") || 0) + d));
      post();
      cap();
    }
    function swipe() {
      if (box.__sw) return;
      box.__sw = 1;
      var x0 = null,
        y0 = 0;
      box.addEventListener("pointerdown", function (e) {
        if (pvOn()) {
          x0 = e.clientX;
          y0 = e.clientY;
        }
      });
      box.addEventListener("pointerup", function (e) {
        if (x0 == null) return;
        var dx = e.clientX - x0,
          dy = e.clientY - y0;
        x0 = null;
        if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy) * 1.3) step(dx < 0 ? 1 : -1);
      });
      box.addEventListener("pointercancel", function () {
        x0 = null;
      });
    }
    function devRow() {
      var bs = document.querySelectorAll("[data-devofp]");
      if (!bs.length) {
        setTimeout(devRow, 800);
        return;
      }
      var op = document.querySelector("[data-devofopen]");
      if (op)
        op.addEventListener("click", function (e) {
          e.stopPropagation();
          if (window.__offOpen) window.__offOpen();
        });
      function paint() {
        bs.forEach(function (b) {
          b.setAttribute(
            "aria-pressed",
            (b.getAttribute("data-devofp") === "on") === pvOn() ? "true" : "false",
          );
        });
        if (op) op.hidden = !pvOn();
      }
      bs.forEach(function (b) {
        b.addEventListener("click", function (e) {
          e.stopPropagation();
          var on = b.getAttribute("data-devofp") === "on";
          ls("vizag-dev-ofp", on ? "1" : null);
          if (!on) ls("vizag-dev-ofi", null);
          paint();
          cap();
          post();
          if (on && window.__offOpen) window.__offOpen();
        });
      });
      paint();
    }
    devRow();
    function dark() {
      var v = getComputedStyle(document.body).backgroundColor.match(/\d+/g) || [255, 255, 255];
      return 0.299 * v[0] + 0.587 * v[1] + 0.114 * v[2] < 128;
    }
    function who() {
      if (pvOn()) return pv()[0];
      var g = "";
      try {
        g = JSON.parse(localStorage.getItem("vizag-profile") || "{}").gender || "";
      } catch (e) {}
      try {
        if (localStorage.getItem("vizag-dev-scp") === "1") {
          var w = localStorage.getItem("vizag-dev-who");
          if (w) g = w === "w" ? "woman" : w === "nb" ? "nb" : "man";
        }
      } catch (e) {}
      return g === "woman" ? "woman" : g === "nb" ? "nb" : "man";
    }
    function post() {
      if (!fr || !fr.contentWindow) return;
      var cs = getComputedStyle(document.documentElement),
        sh = document.getElementById("off-sheet"),
        hr = new Date().getHours();
      fr.contentWindow.postMessage(
        {
          wg: 1,
          emb: !0,
          pal: {
            ink: cs.getPropertyValue("--ink").trim() || "#111",
            bg: getComputedStyle(document.body).backgroundColor,
            muted: cs.getPropertyValue("--muted").trim() || "#777",
            line: cs.getPropertyValue("--line").trim() || "#ddd",
          },
          theme: dark() ? "dark" : "light",
          bg: sh ? getComputedStyle(sh).backgroundColor : "",
          who: who(),
          glow: window.__palGlow ? window.__palGlow() : null,
          wx: { sky: "clear", night: pvOn() ? !!pv()[1] : hr >= 19 || hr < 5 },
          desert: 1,
        },
        "*",
      );
    }
    addEventListener("message", function (e) {
      if (fr && e.source === fr.contentWindow && e.data && e.data.wgready) post();
    });
    addEventListener("pal-change", function () {
      setTimeout(post, 40);
    });
    new MutationObserver(function () {
      setTimeout(post, 60);
    }).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "data-skin", "data-pal", "class"],
    });
    function watch() {
      var sh = document.getElementById("off-sheet");
      if (!sh) {
        setTimeout(watch, 600);
        return;
      }
      new MutationObserver(function () {
        if (!sh.hidden) {
          if (build()) {
            swipe();
            cap();
          }
          post();
          try {
            fr.contentWindow.postMessage({ wg: 1, dsReplay: 1 }, "*");
          } catch (e) {}
        }
      }).observe(sh, { attributes: true, attributeFilter: ["hidden"] });
    }
    watch();
    window.__dsScene = { build: build, post: post };
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Online sheet scene. Builds the animated globe and weather sc", err);
}
