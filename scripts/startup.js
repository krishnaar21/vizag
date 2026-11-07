/* startup.js

   Runs first, before the page is shown: safe defaults, dark start, avatar faces and the splash screen.

   Parts, in the order they run:
    1. Write guard. Stops the app from re-writing an attribute or class that already has the same value, which used to make headers flicker.
    2. One-time defaults (set once per phone): dot nav indicator, merged Home card, colour themes on.
    3. One-time defaults (set once per phone): Auto theme, Classic palette, 'Jump to now' on, Atlas chat off.
    4. Dark start. Paints the page dark before anything loads when the phone is in dark mode, so there is no white flash.
    5. Clears a leftover 'chat sheet open' flag from the last session.
    6. Applies the saved nav-bar indicator style (dot, 3D or shadow).
    7. One-time cache refresh for phones that were stuck on a very old build.
    8. Avatar faces. The eight original face avatars (kav1 to kav8) as small drawings, plus a helper that says whether demo mode is on.
    9. Splash screen. Fades the Kosway splash out as soon as the page is ready (or after 4 seconds at most).
*/

/* ==========================================================================
   Write guard. Stops the app from re-writing an attribute or class that already has the same value, which used to make headers flicker.
   ========================================================================== */
try {
  (function () {
    try {
      var E = Element.prototype,
        sa = E.setAttribute;
      E.setAttribute = function (n, v) {
        if (this.tagName !== "IFRAME" && n !== "value" && this.getAttribute(n) === String(v)) return;
        return sa.call(this, n, v);
      };
      var T = DOMTokenList.prototype,
        ad = T.add,
        rm = T.remove,
        tg = T.toggle;
      T.add = function () {
        for (var i = 0; i < arguments.length; i++)
          if (!this.contains(arguments[i])) return ad.apply(this, arguments);
      };
      T.remove = function () {
        for (var i = 0; i < arguments.length; i++)
          if (this.contains(arguments[i])) return rm.apply(this, arguments);
      };
      T.toggle = function (t, f) {
        if (f !== void 0) {
          f = !!f;
          if (this.contains(t) === f) return f;
        }
        return tg.apply(this, arguments);
      };
      var H = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "hidden");
      H &&
        H.set &&
        Object.defineProperty(HTMLElement.prototype, "hidden", {
          configurable: !0,
          enumerable: H.enumerable,
          get: H.get,
          set: function (v) {
            var b = typeof v === "boolean" ? v : !!v;
            if (typeof v === "boolean" && H.get.call(this) === b) return;
            H.set.call(this, v);
          },
        });
      var L = Object.getOwnPropertyDescriptor(HTMLLinkElement.prototype, "href");
      L &&
        Object.defineProperty(HTMLLinkElement.prototype, "href", {
          configurable: !0,
          enumerable: L.enumerable,
          get: L.get,
          set: function (v) {
            if (this.getAttribute("href") === String(v)) return;
            L.set.call(this, v);
          },
        });
      var C = Object.getOwnPropertyDescriptor(Element.prototype, "className");
      C &&
        Object.defineProperty(Element.prototype, "className", {
          configurable: !0,
          enumerable: C.enumerable,
          get: C.get,
          set: function (v) {
            if (C.get.call(this) === String(v)) return;
            C.set.call(this, v);
          },
        });
      var X = Object.getOwnPropertyDescriptor(Node.prototype, "textContent");
      X &&
        Object.defineProperty(Node.prototype, "textContent", {
          configurable: !0,
          enumerable: X.enumerable,
          get: X.get,
          set: function (v) {
            if (
              this.nodeType === 1 &&
              !this.firstElementChild &&
              X.get.call(this) === String(v == null ? "" : v)
            )
              return;
            X.set.call(this, v);
          },
        });
    } catch (e) {}
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Write guard. Stops the app from re-writing an attribute or c", err);
}

/* ==========================================================================
   One-time defaults (set once per phone): dot nav indicator, merged Home card, colour themes on.
   ========================================================================== */
try {
  (function () {
    try {
      if (localStorage.getItem("vizag-def477")) return;
      var L = localStorage;
      L.setItem("vizag-navind", "dot");
      L.setItem("vizag-homeone", "one");
      L.setItem("vizag-themes-v2", "1");
      L.setItem("vizag-def477", "1");
    } catch (e) {}
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "One-time defaults (set once per phone): dot nav indicator, m", err);
}

/* ==========================================================================
   One-time defaults (set once per phone): Auto theme, Classic palette, 'Jump to now' on, Atlas chat off.
   ========================================================================== */
try {
  (function () {
    try {
      if (localStorage.getItem("vizag-def474")) return;
      var L = localStorage;
      L.setItem("vizag-homeone", "one");
      L.removeItem("vizag-tf");
      L.setItem("vizag-now", "on");
      L.setItem("vizag-skin2", "auto");
      L.setItem("vizag-pal", "classic");
      L.setItem("vizag-themes-v2", "1");
      L.setItem("vizag-navind", "dot");
      L.setItem("vizag-chatmode", "off");
      L.setItem("vizag-def474", "1");
    } catch (e) {}
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "One-time defaults (set once per phone): Auto theme, Classic ", err);
}

/* ==========================================================================
   Dark start. Paints the page dark before anything loads when the phone is in dark mode, so there is no white flash.
   ========================================================================== */
try {
  (function () {
    try {
      var k = localStorage.getItem("vizag-skin2") || "auto",
        d = k === "auto" ? matchMedia("(prefers-color-scheme: dark)").matches : k !== "light";
      if (d) {
        var r = document.documentElement;
        r.style.background = "#0b0b0d";
        r.style.colorScheme = "dark";
        r.classList.add("bootdk");
        var u = function () {
          r.classList.remove("bootdk");
        };
        addEventListener("DOMContentLoaded", function () {
          requestAnimationFrame(function () {
            requestAnimationFrame(u);
          });
        });
        setTimeout(u, 2500);
        addEventListener("load", function () {
          setTimeout(function () {
            r.style.background = "";
            r.style.colorScheme = "";
          }, 400);
        });
      }
    } catch (e) {}
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Dark start. Paints the page dark before anything loads when ", err);
}

/* ==========================================================================
   Clears a leftover 'chat sheet open' flag from the last session.
   ========================================================================== */
try {
  (function () {
    try {
      document.documentElement.classList.remove("chsheet");
    } catch (e) {}
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Clears a leftover 'chat sheet open' flag from the last sessi", err);
}

/* ==========================================================================
   Applies the saved nav-bar indicator style (dot, 3D or shadow).
   ========================================================================== */
try {
  (function () {
    try {
      var n = localStorage.getItem("vizag-navind");
      document.documentElement.setAttribute(
        "data-navind",
        n === "line" ? "rot3d" : /^(rot3d|dot|glow)$/.test(n || "") ? n : "dot",
      );
    } catch (e) {
      document.documentElement.setAttribute("data-navind", "dot");
    }
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Applies the saved nav-bar indicator style (dot, 3D or shadow", err);
}

/* ==========================================================================
   One-time cache refresh for phones that were stuck on a very old build.
   ========================================================================== */
try {
  (function () {
    try {
      var K = "vizag-hr-once",
        V = "457";
      if (localStorage.getItem(K) === V || navigator.onLine === false) return;
      localStorage.setItem(K, V);
      var L = [];
      navigator.serviceWorker &&
        L.push(
          navigator.serviceWorker.getRegistrations().then(function (a) {
            return Promise.all(
              a.map(function (r) {
                return r.unregister();
              }),
            );
          }),
        );
      window.caches &&
        L.push(
          caches.keys().then(function (a) {
            return Promise.all(
              a.map(function (k) {
                return caches.delete(k);
              }),
            );
          }),
        );
      Promise.all(L)
        .catch(function () {})
        .then(function () {
          var u = new URL(location.href);
          u.hash = "";
          u.searchParams.set("_r", Date.now());
          location.replace(u.toString());
        });
    } catch (e) {}
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "One-time cache refresh for phones that were stuck on a very ", err);
}

/* ==========================================================================
   Avatar faces. The eight original face avatars (kav1 to kav8) as small drawings, plus a helper that says whether demo mode is on.
   ========================================================================== */
try {
  window.__kav = {
    kav1: '<svg viewBox="0 0 64 64" class="kav" aria-hidden="true" style="--kb0:#d5e3ff;--kf0:#3b78ec;--kc0:#1c1c21;--kb1:#1b2845;--kf1:#4b83ee;--kc1:#1c1c21"><rect width="64" height="64" fill="var(--kb)"/><g fill="var(--kf)"><path d="M-4 70 L26 20 Q29 15 32 20 L38 30 L45 21 Q48 17 51 21 L74 70Z"/></g><g fill="none" stroke="var(--kc)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" transform="translate(31 44) scale(1.15)"><path d="M-8.5 1.2q2.5-3.6 5 0M3.5 1.2q2.5-3.6 5 0"/><path d="M-4 6q4 4 8 0"/></g></svg>',
    kav2: '<svg viewBox="0 0 64 64" class="kav" aria-hidden="true" style="--kb0:#fbe4c4;--kf0:#f0a13f;--kc0:#1c1c21;--kb1:#43311f;--kf1:#f1a94e;--kc1:#1c1c21"><rect width="64" height="64" fill="var(--kb)"/><g fill="var(--kf)"><circle cx="36" cy="40" r="17"/><circle cx="36.0" cy="23.0" r="7.5"/><circle cx="46.9" cy="27.0" r="7.5"/><circle cx="52.7" cy="37.0" r="7.5"/><circle cx="50.7" cy="48.5" r="7.5"/><circle cx="41.8" cy="56.0" r="7.5"/><circle cx="30.2" cy="56.0" r="7.5"/><circle cx="21.3" cy="48.5" r="7.5"/><circle cx="19.3" cy="37.0" r="7.5"/><circle cx="25.1" cy="27.0" r="7.5"/></g><g fill="none" stroke="var(--kc)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" transform="translate(36 40) scale(1.15)"><circle cx="-6" cy="0" r="1.6" fill="var(--kc)" stroke="none"/><circle cx="6" cy="0" r="1.6" fill="var(--kc)" stroke="none"/><path d="M-5 5.5q5 5.5 10 0z" fill="var(--kc)"/></g></svg>',
    kav3: '<svg viewBox="0 0 64 64" class="kav" aria-hidden="true" style="--kb0:#d4ead8;--kf0:#4d9a60;--kc0:#1c1c21;--kb1:#1f3026;--kf1:#5ba26d;--kc1:#1c1c21"><rect width="64" height="64" fill="var(--kb)"/><g fill="var(--kf)"><ellipse cx="40" cy="48" rx="32" ry="27" transform="rotate(-18 40 48)"/></g><g fill="none" stroke="var(--kc)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" transform="translate(36 42) scale(1.15)"><path d="M-8.5-.8q2.5 3.2 5 0M3.5-.8q2.5 3.2 5 0"/><path d="M-4 6q4 4 8 0"/></g></svg>',
    kav4: '<svg viewBox="0 0 64 64" class="kav" aria-hidden="true" style="--kb0:#e3dcff;--kf0:#8a6cf2;--kc0:#1c1c21;--kb1:#2c2646;--kf1:#9378f3;--kc1:#1c1c21"><rect width="64" height="64" fill="var(--kb)"/><g fill="var(--kf)"><g><circle cx="16" cy="48" r="13"/><circle cx="30" cy="36" r="15"/><circle cx="46" cy="38" r="13"/><circle cx="56" cy="52" r="13"/><circle cx="30" cy="58" r="18"/></g></g><g fill="none" stroke="var(--kc)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" transform="translate(32 47) scale(1.15)"><circle cx="-6" cy="0" r="1.6" fill="var(--kc)" stroke="none"/><path d="M3.5 .6q2.5-3 5 0"/><path d="M-1 7q3.5 2.5 6-1"/></g></svg>',
    kav5: '<svg viewBox="0 0 64 64" class="kav" aria-hidden="true" style="--kb0:#cfe9f8;--kf0:#2b8fd6;--kc0:#1c1c21;--kb1:#182e40;--kf1:#3c98d9;--kc1:#1c1c21"><rect width="64" height="64" fill="var(--kb)"/><g fill="var(--kf)"><path d="M-4 34 C8 20 22 20 30 31 C36 40 48 41 68 27 V70 H-4Z"/></g><g fill="none" stroke="var(--kc)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" transform="translate(30 48) scale(1.15)"><circle cx="-6" cy="0" r="1.6" fill="var(--kc)" stroke="none"/><circle cx="6" cy="0" r="1.6" fill="var(--kc)" stroke="none"/><path d="M-2.2 6.5q2.2 2.2 4.4 0"/></g></svg>',
    kav6: '<svg viewBox="0 0 64 64" class="kav" aria-hidden="true" style="--kb0:#e7e7ea;--kf0:#2a2a30;--kc0:#ffffff;--kb1:#26262c;--kf1:#d9d9de;--kc1:#1c1c21"><rect width="64" height="64" fill="var(--kb)"/><g fill="var(--kf)"><path d="M8 70 L32 18 Q34 14 36 18 L60 70Z"/><path d="M28 70 L34 58 L40 70" fill="var(--kb)" stroke="var(--kb)" stroke-width="2.4" stroke-linecap="round"/></g><g fill="none" stroke="var(--kc)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" transform="translate(34 44) scale(1.15)"><circle cx="-6" cy="0" r="1.6" fill="var(--kc)" stroke="none"/><circle cx="6" cy="0" r="1.6" fill="var(--kc)" stroke="none"/><path d="M-2.2 6.5q2.2 2.2 4.4 0"/></g></svg>',
    kav7: '<svg viewBox="0 0 64 64" class="kav" aria-hidden="true" style="--kb0:#ffd9cf;--kf0:#ec6a4e;--kc0:#1c1c21;--kb1:#422522;--kf1:#ee765c;--kc1:#1c1c21"><rect width="64" height="64" fill="var(--kb)"/><g fill="var(--kf)"><rect x="12" y="24" width="44" height="40" rx="9" transform="rotate(-8 34 44)"/><path d="M26 22 v-5 q0-3 3-3 h8 q3 0 3 3 v5" fill="none" stroke="var(--kf)" stroke-width="3.2" transform="rotate(-8 34 44)"/></g><g fill="none" stroke="var(--kc)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" transform="translate(34 42) scale(1.15)"><path d="M-6-2.6v5.2M-8.6 0h5.2M6-2.6v5.2M3.4 0h5.2" stroke-width="2"/><path d="M-5 5.5q5 5.5 10 0z" fill="var(--kc)"/></g></svg>',
    kav8: '<svg viewBox="0 0 64 64" class="kav" aria-hidden="true" style="--kb0:#fff0b8;--kf0:#f2c230;--kc0:#1c1c21;--kb1:#43391c;--kf1:#f3c741;--kc1:#1c1c21"><rect width="64" height="64" fill="var(--kb)"/><g fill="var(--kf)"><path d="M70 70 H-4 V48 C10 30 20 10 44 8 C58 7 68 14 72 20Z"/></g><g fill="none" stroke="var(--kc)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" transform="translate(36 38) scale(1.15)"><path d="M-8.5 1.2q2.5-3.6 5 0M3.5 1.2q2.5-3.6 5 0"/><circle cx="0" cy="7" r="1.9"/></g></svg>',
  };
  window.__kavf = function (i) {
    return window.__kav[i] || i;
  };
  window.__isDemo = function () {
    try {
      return localStorage.getItem("vizag-demo") === "1";
    } catch (e) {
      return !1;
    }
  };
} catch (err) {
  console.error("[Kosway] part failed:", "Avatar faces. The eight original face avatars (kav1 to kav8)", err);
}

/* ==========================================================================
   Splash screen. Fades the Kosway splash out as soon as the page is ready (or after 4 seconds at most).
   ========================================================================== */
try {
  (function () {
    var d = document,
      done = 0;
    function hide() {
      if (done) return;
      done = 1;
      var e = d.getElementById("kssplash");
      if (!e) return;
      e.classList.add("go");
      setTimeout(function () {
        e.remove();
      }, 320);
    }
    d.addEventListener("DOMContentLoaded", function () {
      requestAnimationFrame(function () {
        requestAnimationFrame(hide);
      });
    });
    setTimeout(hide, 4000);
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Splash screen. Fades the Kosway splash out as soon as the pa", err);
}
