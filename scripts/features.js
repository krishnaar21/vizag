/* features.js

   Features and fixes added on top of the main app. Each part is self-contained and wrapped so that if one part fails, the rest of the app keeps working.

   Parts, in the order they run:
    1. Nav bar style picker (Dot, 3D, Shadow) in Customisation.
    2. Atlas chat star: the sparkle effect when you press it.
    3. Atlas chat sheet: drag down to close.
    4. Settings polish: on/off rows become switches, labels and hidden rows, pull down to refresh, double-tap a title to open chat.
    5. Long-press the Home tab to turn the Atlas star on or off.
    6. Sounds, the AI reply glow, the 'chat needs an assistant' prompt, and the Pass & Atlas features sheet.
    7. Plans sheet: builds the plan cards, tabs, compare table and add-on.
    8. Group avatars and the Top travellers board (real board shows once 20+ travellers have finished trips).
    9. Turns the custom app icon into PNG images for the home screen.
   10. Hand-drawn strike-through in the theme colour, bottom blur over the nav, keyboard-aware login, long-press fixes.
   11. Hairline and soft blur under whichever top bar is stuck, and the icon customiser inside App icon.
   12. Sounds set to 'wood', retired nav styles fall back to Dot, More page footer rows, one 'Others' settings group.
   13. Page slide animations: slide in when opening a sub-page, slide back on the back button.
   14. Pull-to-refresh: gradient for the spinner.
   15. Pull-to-refresh: the spinning Kosway globe.
   16. Signature at the bottom of More: loads the handwriting font and writes 'Krishna AR'.
   17. Pull-to-refresh: 'Refreshing...' roll under the Home title.
   18. Signature font options.
   19. Home title: tap opens the online sheet, double-tap refreshes (beta only).
   20. Profile level progress bar, onboarding art carousel on the sign-in screen, double-tap the sign-in title to hard refresh (beta).
   21. Tapping your avatar or name on the account card opens your profile.
   22. Refresh animation picker (Blades, Halftone, Wireframe, Orbit) in Customisation.
   23. Theme sheet section labels.
   24. Moves notifications from the old Updates page into Plan.
   25. More tab setup, swipe on text in sign-in and onboarding, pull-to-refresh drags the page, notifications grouped by day.
   26. Plans sheet: places the limited-time offer timer.
   27. Keeps the More tab icon correct.
   28. Home card: tidies the Span block in merged cards.
   29. Signature: prepares the letter-by-letter writing animation.
   30. Notification style picker (Grouped, Cards, Plain, Compact, Timeline).
   31. Signature: marks the writing animation as finished; tap to replay.
   32. Plans sheet: swipe the plan card left or right to switch plans.
   33. Theme and notification sheets: hint text.
   34. Swipe sideways between sub-tabs on Days, Plan and Explore.
   35. Landscape art at the bottom of More, and its placement.
   36. Home card: hides a stay row when the same stay is already listed above it.
   37. Keeps the More page art sitting exactly on top of the nav bar.
   38. Group sheet editor: add members first, member circles on top, tap a circle to edit.
   39. Group sheet button: 'Add to group' while typing, otherwise 'Save group' or 'Update group'.
   40. Asks for confirmation before editing a trip.
   41. Demo mode: keeps your own trips aside and shows the sample trip; Leave demo brings them back. Also the Demo mode tag roll on Home.
   42. Plans: halftone icons for Free, Trip pass, Atlas, Yearly and the Customisation add-on.
   43. Developer options: remembers your own settings before the first dev change and puts them back when dev options are turned off.
   44. Past trips: only lists trips that have ended.
*/

/* ==========================================================================
   Nav bar style picker (Dot, 3D, Shadow) in Customisation.
   ========================================================================== */
try {
  (function () {
    var ST = [
      ["dot", "Dot"],
      ["rot3d", "3D"],
      ["glow", "Shadow"],
    ];
    function cur() {
      return document.documentElement.getAttribute("data-navind") || "dot";
    }
    function name() {
      var c = cur();
      return (ST.filter(function (x) {
        return x[0] === c;
      })[0] || ST[0])[1];
    }
    var sh = null;
    function build() {
      if (sh) return sh;
      var ic = document.querySelector(".nav button svg");
      sh = document.createElement("div");
      sh.className = "sheet lsheet psheet";
      sh.id = "nv-sheet";
      sh.hidden = !0;
      sh.setAttribute("role", "dialog");
      sh.setAttribute("aria-label", "Selected tab");
      sh.innerHTML =
        '<div class="shtitle"><span>Selected tab</span><button type="button" class="shclose" aria-label="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div><div class="nvgrid">' +
        ST.map(function (x) {
          return (
            '<button type="button" class="nvt" data-s="' +
            x[0] +
            '" aria-pressed="false"><span class="nvb on">' +
            (ic ? ic.outerHTML : "") +
            '</span><span class="nvl">' +
            x[1] +
            "</span></button>"
          );
        }).join("") +
        "</div>";
      document.body.appendChild(sh);
      sh.addEventListener("click", function (e) {
        e.stopPropagation();
        var t = e.target.closest(".nvt");
        if (t) {
          var v = t.dataset.s;
          document.documentElement.setAttribute("data-navind", v);
          try {
            localStorage.setItem("vizag-navind", v);
          } catch (_) {}
          var b = t.querySelector(".nvb");
          b.classList.remove("on");
          void b.offsetWidth;
          b.classList.add("on");
          paint();
        }
        if (e.target.closest(".shclose")) close();
      });
      var sc = document.getElementById("scrim");
      sc &&
        sc.addEventListener("click", function () {
          sh && !sh.hidden && close();
        });
      return sh;
    }
    function close() {
      sh.hidden = !0;
      var sc = document.getElementById("scrim");
      sc && (sc.hidden = !0);
    }
    function paint() {
      var o = document.getElementById("nv-open");
      o && (o.textContent = name());
      sh &&
        sh.querySelectorAll(".nvt").forEach(function (t) {
          t.setAttribute("aria-pressed", t.dataset.s === cur() ? "true" : "false");
        });
    }
    document.addEventListener(
      "click",
      function (e) {
        var o = e.target.closest && e.target.closest("#nv-open");
        if (!o) return;
        e.stopPropagation();
        build();
        paint();
        sh.hidden = !1;
        var sc = document.getElementById("scrim");
        sc && (sc.hidden = !1);
      },
      !0,
    );
    paint();
    window.__nvOpen = function () {
      document.getElementById("nv-open") && document.getElementById("nv-open").click();
    };
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Nav bar style picker (Dot, 3D, Shadow) in Customisation.", err);
}

/* ==========================================================================
   Atlas chat star: the sparkle effect when you press it.
   ========================================================================== */
try {
  (function () {
    var SPK =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C12.8 7.6 16.4 11.2 22 12C16.4 12.8 12.8 16.4 12 22C11.2 16.4 7.6 12.8 2 12C7.6 11.2 11.2 7.6 12 2Z"/></svg>';
    document.addEventListener(
      "pointerdown",
      function (e) {
        var b = e.target.closest && e.target.closest("#chatbub");
        b && (window.__bubR = b.getBoundingClientRect());
      },
      !0,
    );
    function mode() {
      return document.documentElement.classList.contains("chsheet") ? "sheet" : "full";
    }
    function paint() {
      document.querySelectorAll("[data-chl]").forEach(function (b) {
        var v = b.getAttribute("data-chl") === mode() ? "true" : "false";
        b.getAttribute("aria-pressed") !== v && b.setAttribute("aria-pressed", v);
      });
    }
    document.addEventListener(
      "click",
      function (e) {
        var b = e.target.closest && e.target.closest("[data-chl]");
        if (!b) return;
        e.stopPropagation();
        var v = b.getAttribute("data-chl");
        document.documentElement.classList.toggle("chsheet", v === "sheet");
        try {
          localStorage.setItem("vizag-chatlaunch", v);
        } catch (_) {}
        paint();
      },
      !0,
    );
    new MutationObserver(paint).observe(document.body, { childList: !0, subtree: !0 });
    paint();
    function play() {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      setTimeout(function () {
        var C = document.getElementById("chat"),
          bx = C && C.querySelector(".chatbox");
        if (!bx) return;
        var o = bx.querySelector(".chpre");
        o && o.remove();
        var L = document.createElement("div");
        L.className = "chpre";
        L.setAttribute("aria-hidden", "true");
        L.innerHTML =
          '<svg class="cpstar" viewBox="0 0 48 48"><path class="cpg" pathLength="1" d="M24 5C25.6 17 31 22.4 43 24C31 25.6 25.6 31 24 43C22.4 31 17 25.6 5 24C17 22.4 22.4 17 24 5Z"/><path class="cps" pathLength="1" d="M24 5C25.6 17 31 22.4 43 24C31 25.6 25.6 31 24 43C22.4 31 17 25.6 5 24C17 22.4 22.4 17 24 5Z"/><circle class="cpd" cx="38" cy="10" r="2.6"/></svg>';
        bx.appendChild(L);
        setTimeout(function () {
          L.remove();
        }, 1500);
      }, 0);
    }
    (function hook() {
      if (typeof window.__chat !== "function") {
        setTimeout(hook, 300);
        return;
      }
      if (window.__chat.__chl) return;
      var o = window.__chat,
        n = function () {
          play();
          return o.apply(this, arguments);
        };
      n.__chl = 1;
      window.__chat = n;
    })();
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Atlas chat star: the sparkle effect when you press it.", err);
}

/* ==========================================================================
   Atlas chat sheet: drag down to close.
   ========================================================================== */
try {
  (function () {
    var C = document.getElementById("chat");
    if (!C) return;
    var box = C.querySelector(".chatbox"),
      log = C.querySelector(".chatlog"),
      y0 = null,
      dy = 0,
      t0 = 0,
      on = 0,
      fromHead = 0;
    function sheet() {
      return document.documentElement.classList.contains("chsheet");
    }
    C.addEventListener(
      "touchstart",
      function (e) {
        if (document.documentElement.classList.contains("kbd") || e.touches.length > 1) return;
        var t = e.target;
        fromHead = !!t.closest(".chathead");
        if (!fromHead && !(t.closest(".chatlog") && log.scrollTop <= 0)) return;
        if (t.closest("button,input,.csug,.chatsugg")) return;
        y0 = e.touches[0].clientY;
        t0 = Date.now();
        dy = 0;
        on = 0;
      },
      { passive: !0 },
    );
    C.addEventListener(
      "touchmove",
      function (e) {
        if (y0 == null) return;
        var d = e.touches[0].clientY - y0;
        if (!on) {
          if (Math.abs(d) < 6) return;
          if (
            d < 0 &&
            !(sheet() && fromHead && !C.classList.contains("chtall")) &&
            !(sheet() && log.scrollTop <= 0 && !C.classList.contains("chtall"))
          ) {
            y0 = null;
            return;
          }
          if (d > 0 && !fromHead && log.scrollTop > 0) {
            y0 = null;
            return;
          }
          on = 1;
          box.style.transition = "none";
        }
        dy = d;
        if (e.cancelable) e.preventDefault();
        box.style.transform = "translateY(" + (d > 0 ? d : d * 0.35) + "px)";
      },
      { passive: !1 },
    );
    function end() {
      if (y0 == null) {
        return;
      }
      y0 = null;
      if (!on) return;
      on = 0;
      var v = dy / Math.max(1, Date.now() - t0);
      box.style.transition = "";
      var tl = C.classList.contains("chtall");
      if (tl ? dy > 220 : dy > 110 || (dy > 40 && v > 0.5)) {
        box.style.transform = "translateY(105%)";
        setTimeout(function () {
          var b = C.querySelector("[data-chatclose].shclose") || C.querySelector("[data-chatclose]");
          b && b.click();
          setTimeout(function () {
            box.style.transform = "";
            C.classList.remove("chtall");
          }, 400);
        }, 260);
      } else {
        if (dy < -50 && sheet()) C.classList.add("chtall");
        else if (dy > 50 && C.classList.contains("chtall")) C.classList.remove("chtall");
        box.style.transform = "";
      }
      dy = 0;
    }
    C.addEventListener("touchend", end, { passive: !0 });
    C.addEventListener("touchcancel", end, { passive: !0 });
    new MutationObserver(function () {
      C.hidden && (C.classList.remove("chtall"), (box.style.transform = ""));
    }).observe(C, { attributes: !0, attributeFilter: ["hidden"] });
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Atlas chat sheet: drag down to close.", err);
}

/* ==========================================================================
   Settings polish: on/off rows become switches, labels and hidden rows, pull down to refresh, double-tap a title to open chat.
   ========================================================================== */
try {
  (function () {
    var D = document,
      R = D.documentElement;
    function q(x, r) {
      return (r || D).querySelector(x);
    }
    function qa(x, r) {
      return [].slice.call((r || D).querySelectorAll(x));
    }
    function ls(k, v) {
      try {
        if (v === undefined) return localStorage.getItem(k);
        v === null ? localStorage.removeItem(k) : localStorage.setItem(k, v);
      } catch (e) {}
    }
    var CHEV = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 6l6 6-6 6"/></svg>';
    var X = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
    /* ---------- toggles (on/off segs become switches) ---------- */
    var T = {
      tf: ["24", "12"],
      now: ["on", "off"],
      cmode: ["bubble", "off"],
      navedge: ["wave", "line"],
      homeone: ["one", "sep"],
    };
    function pair(k) {
      if (T[k]) return T[k];
      return ["on", "off"];
    }
    function kebab(k) {
      return k.replace(/[A-Z]/g, function (c) {
        return "-" + c.toLowerCase();
      });
    }
    function btn(k, v) {
      return qa("[data-" + kebab(k) + '="' + v + '"]').filter(function (b) {
        return !b.classList.contains("tgl");
      })[0];
    }
    function mkT(k) {
      var b = D.createElement("button");
      b.type = "button";
      b.className = "tgl";
      b.setAttribute("role", "switch");
      b.dataset.k = k;
      b.setAttribute("aria-checked", "false");
      b.innerHTML = "<i></i>";
      return b;
    }
    function convert() {
      qa(".setrow .seg").forEach(function (sg) {
        if (sg.__t || sg.classList.contains("vphide")) return;
        var bs = qa("button", sg);
        if (bs.length !== 2) return;
        var k = Object.keys(bs[0].dataset)[0];
        if (!k) return;
        var vals = bs
          .map(function (b) {
            return b.dataset[k];
          })
          .sort()
          .join(",");
        var p = pair(k);
        if (!(T[k] || vals === "off,on")) return;
        sg.__t = 1;
        sg.classList.add("tghide");
        var t = mkT(k);
        t.setAttribute("aria-label", sg.getAttribute("aria-label") || "");
        sg.after(t);
      });
      paintT();
    }
    function devT() {
      var x = q(".devexp");
      if (!x || q('.tgl[data-k="devx"]')) return;
      var t = mkT("devx");
      t.setAttribute("aria-label", "Developer options");
      x.after(t);
      x.classList.add("tghide");
    }
    function paintT() {
      var dx = q(".devexp"),
        dt = q('.tgl[data-k="devx"]');
      dx &&
        dt &&
        dt.setAttribute("aria-checked", dx.getAttribute("aria-expanded") === "true" ? "true" : "false");
      qa('.tgl:not([data-k="devx"]):not(.ntg)').forEach(function (t) {
        var on = btn(t.dataset.k, pair(t.dataset.k)[0]),
          v = on && on.getAttribute("aria-pressed") === "true" ? "true" : "false";
        t.getAttribute("aria-checked") !== v && t.setAttribute("aria-checked", v);
      });
    }
    D.addEventListener(
      "click",
      function (e) {
        var t = e.target.closest && e.target.closest(".tgl");
        if (!t || t.classList.contains("ntg")) return;
        e.stopPropagation();
        if (t.dataset.k === "devx") {
          var dx = q(".devexp");
          dx && dx.click();
          setTimeout(paintT, 0);
          return;
        }
        var p = pair(t.dataset.k),
          on = t.getAttribute("aria-checked") === "true",
          b = btn(t.dataset.k, on ? p[1] : p[0]);
        b && b.click();
        setTimeout(paintT, 0);
        setTimeout(rows, 0);
      },
      !0,
    );
    /* ---------- labels, hidden rows ---------- */
    function relabel(row, t, sm) {
      var l = q(".setl", row);
      if (!l) return;
      var tn = l.firstChild;
      if (tn && tn.nodeType === 3) {
        if (tn.nodeValue !== t) tn.nodeValue = t;
      }
      var s = q("small", l);
      if (s && sm != null && s.textContent !== sm) s.textContent = sm;
    }
    function nb0() {
      var t = q("#nv-open span") || q("#nv-open");
      return t ? t.textContent.trim() : "";
    }
    function rowOf(x) {
      var e = typeof x === "string" ? q(x) : x;
      return e && e.closest(".setrow");
    }
    function rows() {
      var r;
      if ((r = rowOf("[data-tf]"))) relabel(r, "24-hour time", "Follows your phone until you change it");
      if ((r = rowOf("[data-now]"))) relabel(r, "Open at now", "Starts on today’s current stop");
      if ((r = rowOf("#th-pill"))) relabel(r, "Theme & app icon", "Colours and app icon");
      if ((r = rowOf("[data-cmode]"))) {
        relabel(r, "Atlas chat", "Star on Home. Long-press the Home tab to open");
        pullRow(r);
      }
      if ((r = rowOf("#nv-open"))) {
        relabel(r, "Nav bar", "Edge style and selected tab");
        var ns = q("#nv-sheet .nvsel");
        ns && ns.textContent !== nb0() && (ns.textContent = nb0());
        var nb = q("#nv-open");
        if (!q("svg", nb)) {
          var nt = nb.textContent.trim();
          nb.className = "vpill";
          nb.innerHTML = "<span>" + nt + "</span>" + CHEV;
        }
      }
      if ((r = rowOf('.seg[aria-label="Nav bar edge"]'))) r.classList.add("rowhide");
      if ((r = rowOf("#dev-refresh"))) r.classList.add("rowhide");
      homeRow();

      var pr = q("#pull-row");
      pr && (pr.hidden = !0);
      thName();
    }
    /* ---------- pull down: refresh or chat ---------- */
    function pullRow(after) {
      if (q("#pull-row")) return;
      var r = D.createElement("div");
      r.className = "setrow hcsub";
      r.id = "pull-row";
      r.innerHTML =
        '<span class="setl">Pull down<small class="pullsm"></small></span><button type="button" class="vpill" id="pd-open"></button>';
      after.after(r);
      paintPull();
    }
    function pullMode() {
      return "refresh";
    }
    function paintPull() {
      var ch = ls("vizag-pullto") === "chat",
        ps = q(".pullsm"),
        pt = ch ? "Opens Atlas" : "Refreshes the page";
      ps && ps.textContent !== pt && (ps.textContent = pt);
      var pb = q("#pd-open"),
        ph = "<span>" + (ch ? "Chat" : "Refresh") + "</span>" + CHEV;
      pb && pb.__h !== ph && ((pb.innerHTML = ph), (pb.__h = ph));
      qa("#pd-sheet .pdopt").forEach(function (o) {
        o.classList.toggle("on", o.dataset.v === (ch ? "chat" : "refresh"));
      });
      var h = q(".sethint");
      if (h) {
        var ht =
          ls("vizag-chatmode") === "off"
            ? "Pull down on any page to refresh. Turn on Atlas to ask about your trip."
            : "Tap the star on Home to open Atlas. Pull down on any page to refresh.";
        h.textContent !== ht && (h.textContent = ht);
      }
      qa("[data-pullto]").forEach(function (b) {
        var v = b.dataset.pullto === (ls("vizag-pullto") === "chat" ? "chat" : "refresh") ? "true" : "false";
        b.getAttribute("aria-pressed") !== v && b.setAttribute("aria-pressed", v);
      });
    }
    var pd = null;
    function pdClose() {
      pd.hidden = !0;
      var sc = q("#scrim");
      sc && (sc.hidden = !0);
    }
    function pdBuild() {
      if (pd) return;
      pd = D.createElement("div");
      pd.className = "sheet lsheet psheet";
      pd.id = "pd-sheet";
      pd.hidden = !0;
      pd.setAttribute("role", "dialog");
      pd.setAttribute("aria-label", "Pull down");
      pd.innerHTML =
        '<div class="shtitle"><span>Pull down</span><button type="button" class="shclose" aria-label="Close">' +
        X +
        '</button></div><p class="pdlead">Choose what happens when you pull down from the top of any page.</p><button type="button" class="pdopt" data-v="refresh"><span class="pdi"><svg class="ph"><use href="#i-hugeicons-repeat"/></svg></span><span class="pdt"><b>Refresh</b><small>Reloads the page with your latest trip details and any app update.</small></span><i class="pdck"></i></button><button type="button" class="pdopt" data-v="chat"><span class="pdi"><svg class="ph"><use href="#i-hugeicons-chat"/></svg></span><span class="pdt"><b>Chat</b><small>Opens Atlas about the page you’re on. To refresh, close and reopen the app.</small></span><i class="pdck"></i></button>';
      D.body.appendChild(pd);
      pd.addEventListener("click", function (e) {
        e.stopPropagation();
        if (e.target.closest(".shclose")) return pdClose();
        var o = e.target.closest(".pdopt");
        if (o) {
          ls("vizag-pullto", o.dataset.v);
          paintPull();
          setTimeout(pdClose, 320);
        }
      });
      var sc = q("#scrim");
      sc &&
        sc.addEventListener("click", function () {
          pd.hidden || pdClose();
        });
    }
    D.addEventListener(
      "click",
      function (e) {
        var b = e.target.closest && e.target.closest("#pd-open");
        if (!b) return;
        e.stopPropagation();
        pdBuild();
        paintPull();
        pd.hidden = !1;
        var sc = q("#scrim");
        sc && (sc.hidden = !1);
      },
      !0,
    );
    window.__pullGo = function () {
      var v = R.dataset.view || "home";
      if (pullMode() === "chat" && window.__chat) window.__chat(v);
      else location.reload();
    };
    /* chat turned on: hint once per turn-on */
    D.addEventListener("click", function (e) {
      var t = e.target.closest && e.target.closest('.tgl[data-k="cmode"]');
      if (!t) return;
      setTimeout(function () {
        if (ls("vizag-chatmode") !== "off") {
          window.__toast && window.__toast("Tap the star on Home to open Atlas");
        }
        rows();
      }, 60);
    });
    /* double-tap a page title opens chat */
    var lt = 0,
      lx = null;
    function dbl(h) {
      return;
      var v = h.closest(".view");
      window.__chat(v && v.id ? v.id.replace(/^v-/, "") : R.dataset.view || "home");
    }
    D.addEventListener(
      "touchend",
      function (e) {
        var h = e.target.closest && e.target.closest(".view h1");
        if (!h) {
          lt = 0;
          return;
        }
        var n = Date.now();
        if (n - lt < 320 && lx === h) {
          lt = 0;
          e.preventDefault();
          dbl(h);
        } else {
          lt = n;
          lx = h;
        }
      },
      { passive: !1 },
    );
    D.addEventListener("dblclick", function (e) {
      var h = e.target.closest && e.target.closest(".view h1");
      h && dbl(h);
    });
    /* ---------- theme pill shows palette name ---------- */
    function thName() {
      var p = q("#th-pill");
      if (!p) return;
      var pal = R.getAttribute("data-pal"),
        n = pal
          ? pal.charAt(0).toUpperCase() + pal.slice(1)
          : (q("#skin-name") && q("#skin-name").textContent) || "Classic";
      var h = "<span>" + n + "</span>" + CHEV;
      p.__h !== h && ((p.innerHTML = h), (p.__h = h));
    }
    new MutationObserver(thName).observe(R, { attributes: !0, attributeFilter: ["data-pal"] });
    /* ---------- Home cards sheet ---------- */
    var hs = null;
    function homeRow() {
      var sg = q('.seg[aria-label="Home cards"]');
      if (!sg) return;
      var r = sg.closest(".setrow");
      if (!r || q("#hl-open")) return paintHome();
      ["Home cards", "Trip card", "Day details"].forEach(function (n) {
        var x = q('.seg[aria-label="' + n + '"]');
        x && x.closest(".setrow").classList.add("rowhide");
      });
      var nr = D.createElement("div");
      nr.className = "setrow";
      nr.id = "hl-row";
      nr.innerHTML =
        '<span class="setl">Home cards<small>Trip and day as one card</small></span><button type="button" class="vpill" id="hl-open"></button>';
      r.before(nr);
      paintHome();
    }
    function cur(n) {
      var x = q('.seg[aria-label="' + n + '"] [aria-pressed="true"]');
      return x ? x.textContent.trim() : "";
    }
    function paintHome() {
      var b = q("#hl-open");
      if (!b) return;
      var m = cur("Home cards") === "Merged",
        h = "<span>" + (m ? "Merged" : cur("Trip card") || "Split") + "</span>" + CHEV;
      b.__h !== h && ((b.innerHTML = h), (b.__h = h));
      if (hs) {
        hs.classList.toggle("merged", m);
        qa(".vpopt", hs).forEach(function (o) {
          var on = cur(o.dataset.seg) === o.dataset.v;
          o.classList.toggle("on", on);
        });
        var sm = q(".hlsm", hs),
          st = m
            ? "One card for your trip and the chosen day, with the trip on top and that day right below it."
            : "Two separate cards. Pick how the trip card and the day look below.";
        sm && sm.textContent !== st && (sm.textContent = st);
        qa(".hlsel", hs).forEach(function (x) {
          var v = cur(x.dataset.seg);
          x.textContent !== v && (x.textContent = v);
        });
        if (hs.__m === !1 && m && !hs.hidden)
          setTimeout(function () {
            hs.hidden || closeHome();
          }, 380);
        hs.__m = m;
      }
    }
    function buildHome() {
      if (hs) return hs;
      var Dd = window.__vpD || {},
        Ss = window.__vpS || {};
      hs = D.createElement("div");
      hs.className = "sheet lsheet psheet vpsheet";
      hs.id = "hl-sheet";
      hs.hidden = !0;
      hs.setAttribute("role", "dialog");
      hs.setAttribute("aria-label", "Home cards");
      function sec(n) {
        var bs = qa('.seg[aria-label="' + n + '"] button');
        return (
          '<div class="hlsec"><div class="hlcap"><span>' +
          n +
          '</span><b class="hlsel" data-seg="' +
          n +
          '"></b></div><div class="vpgrid">' +
          bs
            .map(function (b) {
              var v = b.textContent.trim();
              return (
                '<button type="button" class="vpopt" data-seg="' +
                n +
                '" data-v="' +
                v +
                '"><span class="vpv">' +
                (Dd[v] || "") +
                '</span><span class="vpn"><b>' +
                v +
                "</b><small>" +
                (Ss[v] || "") +
                "</small></span></button>"
              );
            })
            .join("") +
          "</div></div>"
        );
      }
      hs.innerHTML =
        '<div class="shtitle"><span>Home cards</span><button type="button" class="shclose" aria-label="Close">' +
        X +
        '</button></div><div class="shcard"><div class="setrow hlm"><span class="setl">Merge trip &amp; day<small class="hlsm"></small></span></div></div>' +
        sec("Trip card") +
        sec("Day details");
      q(".hlm", hs).appendChild(mkT("homeone"));
      D.body.appendChild(hs);
      hs.addEventListener("click", function (e) {
        e.stopPropagation();
        if (e.target.closest(".shclose")) return closeHome();
        var o = e.target.closest(".vpopt");
        if (o) {
          var b = qa('.seg[aria-label="' + o.dataset.seg + '"] button').filter(function (x) {
            return x.textContent.trim() === o.dataset.v;
          })[0];
          b && b.getAttribute("aria-pressed") !== "true" && b.click();
          setTimeout(paintHome, 0);
        }
      });
      var sc = q("#scrim");
      sc &&
        sc.addEventListener("click", function () {
          hs.hidden || closeHome();
        });
      return hs;
    }
    function closeHome() {
      hs.hidden = !0;
      var sc = q("#scrim");
      sc && (sc.hidden = !0);
    }
    D.addEventListener(
      "click",
      function (e) {
        var b = e.target.closest && e.target.closest("#hl-open");
        if (!b) return;
        e.stopPropagation();
        buildHome();
        paintHome();
        paintT();
        hs.hidden = !1;
        var sc = q("#scrim");
        sc && (sc.hidden = !1);
      },
      !0,
    );
    /* ---------- Nav bar sheet: add edge switch ---------- */
    function navSheet() {
      var s = q("#nv-sheet");
      if (!s || s.__e) return;
      s.__e = 1;
      var t = q(".shtitle span", s);
      t && (t.textContent = "Nav bar");
      s.setAttribute("aria-label", "Nav bar");
      var r = D.createElement("div");
      r.className = "setrow hlm";
      r.innerHTML = '<span class="setl">Wave edge<small>Curved top edge on the bar</small></span>';
      r.appendChild(mkT("navedge"));
      var c = D.createElement("div");
      c.className = "hlcap";
      c.innerHTML = '<span>Selected tab</span><b class="nvsel"></b>';
      var g = q(".nvgrid", s),
        cd = D.createElement("div");
      cd.className = "shcard";
      cd.appendChild(r);
      g.before(cd);
      g.before(c);
      paintT();
    }
    /* ---------- Profile card: collapsed by default ---------- */
    function acct() {
      var a = q("#acct"),
        ed = q("#acct-edit");
      if (!a || !ed) return;
      if (!q(".acchev", a)) {
        var b = D.createElement("button");
        b.type = "button";
        b.className = "aico2 acchev";
        b.setAttribute("aria-label", "Show profile details");
        b.setAttribute("aria-expanded", "false");
        b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9.5l6 6 6-6"/></svg>';
        ed.after(b);
        b.addEventListener("click", function (e) {
          e.stopPropagation();
          var c = a.classList.toggle("accol");
          b.setAttribute("aria-expanded", c ? "false" : "true");
          b.setAttribute("aria-label", c ? "Show profile details" : "Hide profile details");
        });
        a.classList.add("accol");
      }
    }
    function club() {
      var a = q("#acct"),
        pt = q(".plantop"),
        st = a && q(".acstats", a),
        ft = st && q(".acfoot", st);
      if (!a || !pt || !st) return;
      pt.parentNode !== st && st.insertBefore(pt, ft || null);
      var ai = q(".ai .an", a),
        bd = q(".acplan", a),
        on = !pt.hidden && !!pt.firstChild,
        pro = !!q(".plancard.pro", pt),
        tx = pro ? "Pro" : "Free";
      if (!on) {
        bd && bd.remove();
        return;
      }
      if (!bd) {
        bd = D.createElement("span");
        bd.className = "acplan";
        ai && ai.after(bd);
      }
      bd.classList.toggle("pro", pro);
      bd.textContent !== tx && (bd.textContent = tx);
    }
    function planTag() {
      var h = q("#v-profile .pghead");
      if (!h) return;
      if (!q("#plan-tag", h)) {
        h.classList.add("pgflat", "yrhost");
        var b = D.createElement("button");
        b.type = "button";
        b.className = "yrpill plantag";
        b.id = "plan-tag";
        b.setAttribute("aria-label", "Your plan");
        b.addEventListener("click", function (e) {
          e.stopPropagation();
          window.__openPlans && window.__openPlans();
        });
        h.appendChild(b);
      }
      var pl = {};
      try {
        pl = JSON.parse(ls("vizag-plan") || "{}") || {};
      } catch (e) {}
      var t = pl.plan === "pro" ? "Pro" : pl.plan === "plus" ? "Plus" : "Free",
        b2 = q("#plan-tag");
      b2.textContent !== t && (b2.textContent = t);
      b2.classList.toggle("pro", t === "Pro");
      var bd = q("#acct .acplan");
      bd && bd.remove();
      var pt = q(".plantop");
      pt && pt.classList.add("rowhide");
    }
    function devOrder() {
      var o = q(".devopts"),
        r = q("#dev-off");
      r = r && r.closest(".setrow");
      o && r && o.firstElementChild !== r && o.insertBefore(r, o.firstElementChild);
      var t = q("[data-devthv2]");
      t && (t = t.closest(".setrow")) && t.classList.add("rowhide");
      tags();
    }
    var TG = [
      ["#pdf-row", "plus"],
      [".setrow:has([data-now])", "pro"],
      ['.setrow:has(.tgl[data-k="cmode"])', "pro"],
    ];
    function tag(el, k) {
      if (!el || q(".ptag", el)) return;
      var i = D.createElement("i");
      i.className = "ptag " + k;
      (i.innerHTML =
        k === "pro"
          ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 8.5l4.6 3.6L12 5.5l3.9 6.6 4.6-3.6-1.8 9.7H5.3z"/></svg>'
          : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5c.9 4.6 3.4 7.1 8 8-4.6.9-7.1 3.4-8 8-.9-4.6-3.4-7.1-8-8 4.6-.9 7.1-3.4 8-8z"/></svg>'),
        i.setAttribute("role", "img"),
        i.setAttribute("aria-label", k === "pro" ? "Pro" : "Plus"),
        (i.title = k === "pro" ? "Pro" : "Plus");
      el.appendChild(i);
    }
    function tags() {
      TG.forEach(function (x) {
        var r = q(x[0]),
          l = r && q(".setl", r);
        if (l && r.querySelector(":scope>.seti") && !q(".ptag", r.querySelector(":scope>.seti"))) {
          var i = D.createElement("i");
          i.className = "ptag " + x[1];
          (i.innerHTML =
            x[1] === "pro"
              ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 8.5l4.6 3.6L12 5.5l3.9 6.6 4.6-3.6-1.8 9.7H5.3z"/></svg>'
              : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5c.9 4.6 3.4 7.1 8 8-4.6.9-7.1 3.4-8 8-.9-4.6-3.4-7.1-8-8 4.6-.9 7.1-3.4 8-8z"/></svg>'),
            i.setAttribute("role", "img"),
            i.setAttribute("aria-label", x[1] === "pro" ? "Pro" : "Plus"),
            (i.title = x[1] === "pro" ? "Pro" : "Plus");
          var st = r.querySelector(":scope>.seti");
          st && !q(".ptag", st) && st.appendChild(i);
        }
      });
      qa("#nv-sheet .nvt").forEach(function (t) {
        var s = t.dataset.s;
        s === "dot" || tag(t, /^(rot3d|draw|flip)$/.test(s) ? "plus" : "pro");
      });
      qa("#hl-sheet .vpopt").forEach(function (o) {
        tag(o, "plus");
      });
    }
    function collapse() {
      var a = q("#acct");
      a &&
        (a.classList.add("accol"), q(".acchev", a) && q(".acchev", a).setAttribute("aria-expanded", "false"));
    }
    var lv = R.dataset.view;
    new MutationObserver(function () {
      var v = R.dataset.view;
      if (v !== lv) {
        lv = v;
        collapse();
      }
    }).observe(R, { attributes: !0, attributeFilter: ["data-view"] });
    D.addEventListener(
      "click",
      function (e) {
        var n = e.target.closest && e.target.closest(".nav button");
        n && setTimeout(collapse, 0);
      },
      !0,
    );
    /* ---------- icons (Hugeicons sprite) ---------- */
    var M = [
      ["24-hour", "clock"],
      ["Time format", "clock"],
      ["Open at now", "now"],
      ["Jump to now", "now"],
      ["Sections", "grid"],
      ["Trip PDF", "pdf"],
      ["Theme", "palette"],
      ["Nav bar", "sliders"],
      ["Home cards", "home"],
      ["AI assistant", "sparkle"],
      ["Atlas chat", "chat"],
      ["Pull down", "repeat"],
      ["Notifications", "bell"],
      ["Reset app", "history"],
      ["Delete my data", "trash"],
      ["Contact support", "mail"],
      ["FAQ", "note"],
      ["About", "info"],
      ["What", "star"],
      ["Developer", "code"],
      ["Turn off dev", "x"],
      ["Pinch", "search"],
      ["Any trip dates", "calendar"],
      ["Preview scene people", "users"],
      ["Preview scene weather", "cloudsun"],
      ["Preview offline", "wifioff"],
      ["Preview empty", "package"],
      ["Sample updates", "alert"],
      ["Onboarding", "open"],
      ["Restore sample", "repeat"],
      ["Simulate", "medal"],
      ["Places", "pin"],
      ["Themes v2", "shapes"],
      ["Merge trip", "home"],
      ["Wave edge", "waves"],
      ["Plus & Pro", "crown"],
      ["Sounds", "volume"],
    ];
    function ico(t) {
      var k = null,
        b = -1;
      M.forEach(function (m) {
        t.indexOf(m[0]) === 0 && m[0].length > b && ((k = m[1]), (b = m[0].length));
      });
      return k;
    }
    function icons() {
      qa(".setrow>.setl").forEach(function (l) {
        var r = l.parentNode,
          tn = l.firstChild,
          t = (tn && tn.nodeType === 3 ? tn.nodeValue : l.textContent).trim(),
          k = ico(t),
          s = r.querySelector(":scope>.seti");
        if (!k) {
          s && s.remove();
          return;
        }
        if (s && s.dataset.k === k) return;
        s ||
          ((s = D.createElement("span")),
          (s.className = "seti"),
          s.setAttribute("aria-hidden", "true"),
          r.insertBefore(s, l));
        s.dataset.k = k;
        s.innerHTML = '<svg class="ph"><use href="#i-hugeicons-' + k + '"/></svg>';
      });
    }
    /* ---------- run ---------- */
    function all() {
      devT();
      convert();
      planTag();
      devOrder();
      rows();
      navSheet();
      acct();
      icons();
      paintT();
      paintPull();
    }
    all();
    var qq = 0;
    new MutationObserver(function () {
      qq ||
        (qq = requestAnimationFrame(function () {
          qq = 0;
          all();
        }));
    }).observe(D.body, { childList: !0, subtree: !0 });
    new MutationObserver(function () {
      paintT();
      paintHome();
    }).observe(D.body, { attributes: !0, subtree: !0, attributeFilter: ["aria-pressed", "aria-expanded"] });
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Settings polish: on/off rows become switches, labels and hid", err);
}

/* ==========================================================================
   Long-press the Home tab to turn the Atlas star on or off.
   ========================================================================== */
try {
  (function () {
    var D = document;
    function home() {
      return D.querySelector('.nav button[data-v="home"]');
    }
    var tm = 0,
      fired = !1,
      sx = 0,
      sy = 0,
      btn = null;
    function open() {
      btn && btn.classList.remove("lp");
      if (D.documentElement.dataset.view !== "home") {
        var hh = home();
        hh && hh.click();
      }
      fired = !0;
      navigator.vibrate && navigator.vibrate(15);
      var on = !1;
      try {
        on = localStorage.getItem("vizag-chatmode") === "bubble";
      } catch (e) {}
      var cb = D.querySelector('[data-cmode="bubble"]');
      cb && cb.click();
      window.__toast && window.__toast(on ? "AI star is back on Home" : "AI star is on. Tap it to chat");
    }
    D.addEventListener(
      "pointerdown",
      function (e) {
        var b = e.target.closest && e.target.closest('.nav button[data-v="home"]');
        if (!b) return;
        btn = b;
        fired = !1;
        sx = e.clientX;
        sy = e.clientY;
        b.classList.add("lp");
        clearTimeout(tm);
        tm = setTimeout(open, 360);
      },
      !0,
    );
    function cancel() {
      clearTimeout(tm);
      btn && btn.classList.remove("lp");
    }
    D.addEventListener(
      "pointermove",
      function (e) {
        btn && Math.abs(e.clientX - sx) + Math.abs(e.clientY - sy) > 10 && cancel();
      },
      !0,
    );
    D.addEventListener("pointerup", cancel, !0);
    D.addEventListener("pointercancel", cancel, !0);
    D.addEventListener(
      "click",
      function (e) {
        if (fired && e.target.closest && e.target.closest('.nav button[data-v="home"]')) {
          e.preventDefault();
          e.stopImmediatePropagation();
          fired = !1;
        }
      },
      !0,
    );
    D.addEventListener(
      "contextmenu",
      function (e) {
        e.target.closest && e.target.closest('.nav button[data-v="home"]') && e.preventDefault();
      },
      !0,
    );
    var h = home();
    h &&
      ((h.style.webkitTouchCallout = "none"), h.setAttribute("aria-description", "Long-press to open Atlas"));
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Long-press the Home tab to turn the Atlas star on or off.", err);
}

/* ==========================================================================
   Sounds, the AI reply glow, the 'chat needs an assistant' prompt, and the Pass & Atlas features sheet.
   ========================================================================== */
try {
  (function () {
    var D = document,
      R = D.documentElement;
    function ls(k) {
      try {
        return localStorage.getItem(k);
      } catch (e) {
        return null;
      }
    }
    function ss(k, v) {
      try {
        v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v);
      } catch (e) {}
    }
    /* ---------- sounds ---------- */
    var AC = null;
    function ac() {
      if (!AC) {
        var C = window.AudioContext || window.webkitAudioContext;
        if (!C) return null;
        try {
          AC = new C();
        } catch (e) {
          return null;
        }
      }
      AC.state !== "running" && AC.resume && AC.resume().catch(function () {});
      return AC;
    }
    function tone(f, t0, d, g, type, f2) {
      var a = ac();
      if (!a) return;
      var o = a.createOscillator(),
        v = a.createGain(),
        t = a.currentTime + t0;
      o.type = type || "sine";
      o.frequency.setValueAtTime(f, t);
      f2 && o.frequency.exponentialRampToValueAtTime(f2, t + d);
      v.gain.setValueAtTime(0, t);
      v.gain.linearRampToValueAtTime(g, t + 0.008);
      v.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(v);
      v.connect(a.destination);
      o.start(t);
      o.stop(t + d + 0.02);
    }
    var ST = {
      soft: {
        tap: function () {
          tone(1250, 0, 0.045, 0.035, "triangle", 900);
        },
        on: function () {
          tone(700, 0, 0.07, 0.045);
          tone(1050, 0.055, 0.09, 0.045);
        },
        off: function () {
          tone(1050, 0, 0.07, 0.04);
          tone(700, 0.055, 0.09, 0.04);
        },
        pull: function () {
          tone(380, 0, 0.18, 0.05, "sine", 920);
        },
      },
      pop: {
        tap: function () {
          tone(520, 0, 0.06, 0.06, "sine", 1500);
        },
        on: function () {
          tone(480, 0, 0.08, 0.06, "sine", 1300);
          tone(900, 0.06, 0.08, 0.05, "sine", 1800);
        },
        off: function () {
          tone(1300, 0, 0.08, 0.05, "sine", 480);
        },
        pull: function () {
          tone(300, 0, 0.22, 0.06, "sine", 1600);
        },
      },
      wood: {
        tap: function () {
          tone(340, 0, 0.03, 0.09, "triangle");
          tone(1020, 0, 0.02, 0.03, "sine");
        },
        on: function () {
          tone(520, 0, 0.04, 0.08, "triangle");
          tone(780, 0.05, 0.05, 0.08, "triangle");
        },
        off: function () {
          tone(780, 0, 0.04, 0.07, "triangle");
          tone(520, 0.05, 0.05, 0.07, "triangle");
        },
        pull: function () {
          tone(220, 0, 0.05, 0.09, "triangle");
          tone(330, 0.07, 0.05, 0.08, "triangle");
          tone(440, 0.14, 0.06, 0.08, "triangle");
        },
      },
    };
    function sty() {
      return "wood";
    }
    var S = {
      tap: function () {
        ST[sty()].tap();
      },
      on: function () {
        ST[sty()].on();
      },
      off: function () {
        ST[sty()].off();
      },
      pull: function () {
        ST[sty()].pull();
      },
      win: function () {
        [1047, 1319, 1568, 2093].forEach(function (f, i) {
          tone(f, i * 0.085, 0.32, 0.05);
        });
      },
      dev: function () {
        tone(784, 0, 0.14, 0.05);
        tone(1175, 0.1, 0.24, 0.05);
      },
    };
    function on() {
      return ls("vizag-snd") !== "off";
    }
    window.__snd = function (k) {
      if (!on() || !S[k]) return;
      try {
        S[k]();
      } catch (e) {}
    };
    function unl() {
      var a = ac();
      if (!a) return;
      try {
        var b = a.createBuffer(1, 1, 22050),
          s = a.createBufferSource();
        s.buffer = b;
        s.connect(a.destination);
        s.start(0);
      } catch (e) {}
      a.state === "running" &&
        (D.removeEventListener("touchend", unl, !0), D.removeEventListener("click", unl, !0));
    }
    D.addEventListener("touchend", unl, !0);
    D.addEventListener("click", unl, !0);
    D.addEventListener("visibilitychange", function () {
      D.hidden || (AC && AC.state !== "running" && AC.resume && AC.resume().catch(function () {}));
    });
    D.addEventListener(
      "click",
      function (e) {
        var t = e.target.closest && e.target.closest(".nav button");
        t && window.__snd("tap");
      },
      !0,
    );
    D.addEventListener(
      "click",
      function (e) {
        var t = e.target.closest && e.target.closest(".tgl");
        if (!t) return;
        window.__snd(t.getAttribute("aria-checked") === "true" ? "off" : "on");
      },
      !0,
    );
    var pg = window.__pullGo;
    pg &&
      (window.__pullGo = function () {
        window.__snd("pull");
        setTimeout(pg, 170);
      });
    var tt = window.__toast;
    tt &&
      (window.__toast = function (m) {
        /Developer options are on/.test(m || "") && window.__snd("dev");
        return tt.apply(this, arguments);
      });
    /* sounds row in Customisation */
    function sndRow() {
      if (D.getElementById("snd-row")) return;
      var g = D.querySelector(".setgrp.hcgrp");
      if (!g) return;
      var r = D.createElement("div");
      r.className = "setrow";
      r.id = "snd-row";
      r.innerHTML =
        '<span class="setl">Sounds<small>Soft clicks for taps, switches and refresh</small></span><div class="seg" role="group" aria-label="Sounds"><button type="button" data-snd="off">Off</button><button type="button" data-snd="on">On</button></div>';
      g.appendChild(r);
      var r2 = D.createElement("div");
      r2.className = "setrow sndsub";
      r2.id = "snd-style";
      r2.innerHTML =
        '<span class="setl">Sound style</span><div class="seg" role="group" aria-label="Sound style"><button type="button" data-sndst="soft">Soft</button><button type="button" data-sndst="pop">Pop</button><button type="button" data-sndst="wood">Wood</button></div>';
      r.after(r2);
      r2.querySelectorAll("[data-sndst]").forEach(function (b) {
        b.addEventListener("click", function (e) {
          e.stopPropagation();
          ss("vizag-sndst", b.dataset.sndst);
          paintS();
          window.__snd("on");
        });
      });
      r.querySelectorAll("[data-snd]").forEach(function (b) {
        b.addEventListener("click", function (e) {
          e.stopPropagation();
          ss("vizag-snd", b.dataset.snd === "off" ? "off" : null);
          paintS();
        });
      });
      paintS();
    }
    function paintS() {
      var v = on() ? "on" : "off";
      D.querySelectorAll("[data-snd]").forEach(function (b) {
        b.setAttribute("aria-pressed", b.dataset.snd === v ? "true" : "false");
      });
      var st = sty();
      D.querySelectorAll("[data-sndst]").forEach(function (b) {
        b.setAttribute("aria-pressed", b.dataset.sndst === st ? "true" : "false");
      });
      var r2 = D.getElementById("snd-style");
      r2 && (r2.hidden = v === "off");
    }
    /* ---------- AI reply glow ---------- */
    var log = D.getElementById("chat-log");
    log &&
      new MutationObserver(function (ms) {
        ms.forEach(function (m) {
          m.addedNodes.forEach(function (n) {
            if (
              n.nodeType === 1 &&
              n.classList.contains("cm-ai") &&
              !/typing|cm-wait|cm-dots/.test(n.className) &&
              !n.querySelector(".ctyping,.dots")
            ) {
              n.classList.add("aiglow");
              setTimeout(function () {
                n.classList.remove("aiglow");
              }, 1700);
            }
          });
        });
      }).observe(log, { childList: !0 });
    /* ---------- AI chat needs an assistant ---------- */
    function aiSrc() {
      try {
        return (JSON.parse(ls("vizag-ai2") || "{}") || {}).src || "off";
      } catch (e) {
        return "off";
      }
    }
    var need = !1;
    function openAI() {
      var b = D.getElementById("ai-open");
      b && b.click();
    }
    D.addEventListener(
      "click",
      function (e) {
        var t = e.target.closest && e.target.closest('.tgl[data-k="cmode"]');
        if (!t || t.getAttribute("aria-checked") === "true") return;
        if (aiSrc() === "off") {
          need = !0;
          setTimeout(function () {
            var i = D.querySelector("#ai-sheet .aiintro");
            i &&
              (i.__o || (i.__o = i.textContent),
              (i.textContent = "Atlas needs an AI assistant. Pick one to finish turning it on."));
            openAI();
          }, 120);
        }
      },
      !0,
    );
    var as = D.getElementById("ai-sheet");
    as &&
      new MutationObserver(function () {
        if (!as.hidden || !need) return;
        need = !1;
        var i = D.querySelector("#ai-sheet .aiintro");
        i && i.__o && (i.textContent = i.__o);
        if (aiSrc() === "off" && ls("vizag-chatmode") !== "off") {
          var b = D.querySelector('[data-cmode="off"]');
          b && b.click();
          setTimeout(function () {
            D.querySelectorAll('.tgl[data-k="cmode"]').forEach(function (t) {
              t.setAttribute("aria-checked", "false");
            });
          }, 30);
          window.__toast && window.__toast("Atlas stays off until you pick an AI assistant");
        }
      }).observe(as, { attributes: !0, attributeFilter: ["hidden"] });
    D.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest(".caiset");
      if (!b) return;
      setTimeout(function () {
        var p = D.querySelector('.nav button[data-v="profile"]');
        p && p.click();
        setTimeout(openAI, 250);
      }, 260);
    });
    /* ---------- Plus & Pro features sheet ---------- */
    var PF = [
      {
        k: "pass",
        f: function () {
          var b = D.getElementById("pdf-row");
          return b && (b.closest(".setrow") || b);
        },
      },
      {
        k: "pass",
        f: function () {
          var b = D.querySelector("[data-now]");
          return b && b.closest(".setrow");
        },
      },
      {
        k: "atlas",
        f: function () {
          var b = D.getElementById("ai-open");
          return b && b.closest(".setrow");
        },
      },
      {
        k: "atlas",
        f: function () {
          var b = D.querySelector('.tgl[data-k="cmode"],[data-cmode]');
          return b && b.closest(".setrow");
        },
      },
    ];
    var sh = null,
      grp = null,
      ent = null,
      sc = D.getElementById("scrim");
    function plan() {
      try {
        return (JSON.parse(ls("vizag-plan") || "{}") || {}).plan || "free";
      } catch (e) {
        return "free";
      }
    }
    function has(k) {
      var E = window.__ent,
        p = plan();
      if (E && (E.on("yearly") || E.on(k))) return !0;
      return p === "pro" || (k === "pass" && p === "plus");
    }
    function close() {
      sh.hidden = !0;
      sc && !D.querySelector(".sheet:not(.inpage):not([hidden])") && (sc.hidden = !0);
    }
    function build() {
      if (sh) return;
      sh = D.createElement("div");
      sh.className = "sheet lsheet psheet";
      sh.id = "pf-sheet";
      sh.hidden = !0;
      sh.setAttribute("role", "dialog");
      sh.setAttribute("aria-label", "Paid features");
      sh.innerHTML =
        '<div class="shtitle"><span>Pass &amp; Atlas</span><button type="button" class="shclose" aria-label="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div><p class="pfintro">Try these here. Once you upgrade, they move into your main settings.</p><div class="setgrp" id="pf-grp"></div><button type="button" class="btn full" id="pf-plans">See plans</button>';
      D.body.appendChild(sh);
      grp = sh.querySelector("#pf-grp");
      sh.addEventListener("click", function (e) {
        e.stopPropagation();
      });
      sh.querySelector(".shclose").onclick = close;
      sh.querySelector("#pf-plans").onclick = function () {
        close();
        window.__openPlans && window.__openPlans();
      };
      sc &&
        sc.addEventListener("click", function () {
          sh.hidden || close();
        });
    }
    function entry() {
      if (ent && D.body.contains(ent)) return;
      var cap = D.querySelector("#settings-profile>.setcap");
      if (!cap) return;
      ent = D.createElement("div");
      ent.className = "setgrp pfent";
      ent.innerHTML =
        '<div class="setrow" id="pf-row"><span class="seti pfcrown" data-x="1"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 8.5l4.6 3.6L12 5.5l3.9 6.6 4.6-3.6-1.8 9.7H5.3z"/></svg></span><span class="setl">Pass &amp; Atlas features<small id="pf-sub">Trip PDF, Jump to now, Atlas</small></span><button type="button" class="vpill" id="pf-open"><span id="pf-n"></span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 6l6 6-6 6"/></svg></button></div>';
      cap.before(ent);
      function op(e) {
        e.stopPropagation();
        build();
        D.querySelectorAll(".sheet:not(.inpage):not([hidden])").forEach(function (x) {
          x.hidden = !0;
        });
        sh.hidden = !1;
        sc && (sc.hidden = !1);
      }
      ent.querySelector("#pf-row").addEventListener("click", op);
    }
    function sync() {
      build();
      entry();
      var p = plan();
      R.classList.toggle("pl-plus", p === "plus");
      R.classList.toggle("pl-pro", p === "pro");
      var n = 0;
      PF.forEach(function (x) {
        var r = x.f();
        if (!r) return;
        if (!r.__ph) {
          r.__ph = D.createComment("pf");
          r.before(r.__ph);
        }
        var inS = grp.contains(r);
        if (has(x.k)) {
          if (inS) {
            r.__ph.after(r);
          }
        } else {
          n++;
          inS || grp.appendChild(r);
        }
      });
      D.querySelectorAll("#settings-profile>.setgrp").forEach(function (g) {
        if (g === ent) return;
        var vis = [].some.call(g.children, function (c) {
          return c.classList.contains("setrow") && !c.hidden && !c.classList.contains("rowhide");
        });
        var cap = g.previousElementSibling;
        g.classList.toggle("pfempty", !vis);
        g.style.display = vis ? "" : "none";
        cap &&
          cap.classList.contains("setcap") &&
          !cap.classList.contains("devcap") &&
          (cap.style.display = vis ? "" : "none");
      });
      ent && (ent.style.display = n ? "" : "none");
      var pn = D.getElementById("pf-n");
      pn && pn.textContent !== String(n) && (pn.textContent = String(n));
      if (!n && sh && !sh.hidden) close();
    }
    var lt = 0;
    function kick() {
      clearTimeout(lt);
      lt = setTimeout(function () {
        sndRow();
        sync();
      }, 60);
    }
    new MutationObserver(kick).observe(D.getElementById("settings-profile") || D.body, {
      childList: !0,
      subtree: !0,
    });
    window.__pfsync = function () {
      sndRow();
      sync();
    };
    var ret = null;
    new MutationObserver(function (ms) {
      if (!sh) return;
      ms.forEach(function (m) {
        var t = m.target;
        if (t === sh || !t.classList || !t.classList.contains("sheet") || t.classList.contains("inpage"))
          return;
        if (!t.hidden && !sh.hidden) {
          sh.hidden = !0;
          ret = t;
        } else if (t.hidden && ret === t) {
          ret = null;
          t.id === "ai-sheet" && ((sh.hidden = !1), sc && (sc.hidden = !1));
        }
      });
    }).observe(D.body, { attributes: !0, attributeFilter: ["hidden"], subtree: !0 });
    var lp = plan();
    setInterval(function () {
      var p = plan();
      (p !== lp || !ent || !D.body.contains(ent) || !D.getElementById("snd-row")) &&
        ((lp = p), sndRow(), sync());
    }, 1000);
    kick();
    setTimeout(kick, 600);
    window.addEventListener("load", kick);
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Sounds, the AI reply glow, the 'chat needs an assistant' pro", err);
}

/* ==========================================================================
   Plans sheet: builds the plan cards, tabs, compare table and add-on.
   ========================================================================== */
try {
  (function () {
    var D = document,
      A = D.getElementById("plans-sheet");
    if (!A) return;
    D.body.insertAdjacentHTML(
      "afterbegin",
      '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="plg-t" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7bd88f"/><stop offset="1" stop-color="#1f9d61"/></linearGradient><linearGradient id="plg-r" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6fc8ff"/><stop offset="1" stop-color="#2f62f5"/></linearGradient><linearGradient id="plg-a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe08a"/><stop offset="1" stop-color="#e8941a"/></linearGradient></defs></svg>',
    );
    function ls(k) {
      try {
        return localStorage.getItem(k);
      } catch (e) {
        return null;
      }
    }
    function ss(k, v) {
      try {
        v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v);
      } catch (e) {}
    }
    var IC = {
      trail:
        '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="23.5" cy="8" r="3.2" fill="url(#plg-t)" opacity=".55"/><path d="M2.5 27 12 12.5l5.2 7.4 4.2-5.4L29.5 27z" fill="url(#plg-t)"/><path d="M12 12.5l-2.7 4.1 2.7-1.3 2.3 1.6z" fill="#fff" opacity=".8"/></svg>',
      route:
        '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 25.5c6.5 0 3.5-8.5 10-8.5 4.5 0 5-4 6-6" fill="none" stroke="url(#plg-r)" stroke-width="2.6" stroke-linecap="round" stroke-dasharray=".1 4.3"/><circle cx="7" cy="25.5" r="3.4" fill="url(#plg-r)"/><path d="M24 2.5c3.1 0 5.6 2.4 5.6 5.4 0 4-5.6 8.6-5.6 8.6s-5.6-4.6-5.6-8.6c0-3 2.5-5.4 5.6-5.4z" fill="url(#plg-r)"/><circle cx="24" cy="7.9" r="2.1" fill="#fff"/></svg>',
      atlas:
        '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="15" cy="17.5" r="10" fill="url(#plg-a)"/><path d="M5 17.5h20M15 7.5c3.2 3 3.2 17 0 20M15 7.5c-3.2 3-3.2 17 0 20" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1.3"/><ellipse cx="15" cy="17.5" rx="14.2" ry="4.4" transform="rotate(-20 15 17.5)" fill="none" stroke="url(#plg-a)" stroke-width="1.5"/><path d="M26.5 1.5c.5 3 1.8 4.3 4.8 4.8-3 .5-4.3 1.8-4.8 4.8-.5-3-1.8-4.3-4.8-4.8 3-.5 4.3-1.8 4.8-4.8z" fill="url(#plg-a)"/></svg>',
    };
    function ic(k) {
      return '<svg class="ph" aria-hidden="true"><use href="#i-hugeicons-' + k + '"/></svg>';
    }
    var sel = null,
      bill = "yr",
      goingPay = !1,
      body = A.querySelector(".pp-body"),
      chip = A.querySelector("#pp-chip"),
      up = A.querySelector("#pl-upgrade"),
      line = A.querySelector(".pp-line"),
      orig = up && up.onclick;
    function offerLeft() {
      var u = +ls("vizag-offer-until") || 0;
      return Math.max(0, u - Date.now());
    }
    function rup(n) {
      return "₹" + n.toLocaleString("en-IN");
    }
    function hms(ms) {
      var t = Math.floor(ms / 1e3),
        h = Math.floor(t / 3600),
        m = Math.floor((t % 3600) / 60),
        x = t % 60;
      return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0") + ":" + String(x).padStart(2, "0");
    }
    IC.free = IC.trail;
    IC.pass = IC.route;
    IC.yearly =
      '<svg viewBox="0 0 32 32" aria-hidden="true"><defs><linearGradient id="plg-y" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c9a8ff"/><stop offset="1" stop-color="#6c4cf5"/></linearGradient></defs><path d="M16 4.5a11.5 11.5 0 1 1-10.6 7" fill="none" stroke="url(#plg-y)" stroke-width="3" stroke-linecap="round"/><path d="M3.2 6.8l2.4 4.9 5-2.2" fill="none" stroke="url(#plg-y)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 10.5c.6 3.2 1.9 4.6 5 5.2-3.1.6-4.4 2-5 5.2-.6-3.2-1.9-4.6-5-5.2 3.1-.6 4.4-2 5-5.2z" fill="url(#plg-y)"/></svg>';
    IC.free =
      '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 29.5c-.8 0-1.4-.6-1.4-1.4v-9.3C8.2 18.6 4 14.4 4 8.6V5.4C4 4.6 4.6 4 5.4 4h1.5c5.4 0 9.1 3.6 9.1 9.1 0-5.5 3.7-9.1 9.1-9.1h1.5c.8 0 1.4.6 1.4 1.4v3.2c0 5.8-4.2 10-10.6 10.2v9.3c0 .8-.6 1.4-1.4 1.4z" fill="url(#plg-t)"/><path d="M8.5 8.5c2.6.6 4.6 2.6 5.3 5.6" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.6" stroke-linecap="round"/></svg>';
    IC.pass =
      '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 6.5h22a2.5 2.5 0 0 1 2.5 2.5v3.6a3.4 3.4 0 0 0 0 6.8V23a2.5 2.5 0 0 1-2.5 2.5H5A2.5 2.5 0 0 1 2.5 23v-3.6a3.4 3.4 0 0 0 0-6.8V9A2.5 2.5 0 0 1 5 6.5z" fill="url(#plg-r)"/><path d="M21 9.5v13" stroke="#fff" stroke-opacity=".7" stroke-width="1.6" stroke-linecap="round" stroke-dasharray=".1 3.2"/><path d="M8 13h8.5M8 17.5h5.5" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>';
    IC.atlas =
      '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M14 3.5c.9 5.6 3.4 8.1 9 9-5.6.9-8.1 3.4-9 9-.9-5.6-3.4-8.1-9-9 5.6-.9 8.1-3.4 9-9z" fill="url(#plg-a)"/><path d="M25 18.5c.5 3 1.9 4.4 4.9 4.9-3 .5-4.4 1.9-4.9 4.9-.5-3-1.9-4.4-4.9-4.9 3-.5 4.4-1.9 4.9-4.9z" fill="url(#plg-a)" opacity=".75"/><circle cx="7" cy="24.5" r="2.4" fill="url(#plg-a)" opacity=".55"/></svg>';
    IC.yearly =
      '<svg viewBox="0 0 32 32" aria-hidden="true"><defs><linearGradient id="plg-y2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c9a8ff"/><stop offset="1" stop-color="#6c4cf5"/></linearGradient></defs><rect x="9" y="2.5" width="3" height="6" rx="1.5" fill="url(#plg-y2)"/><rect x="20" y="2.5" width="3" height="6" rx="1.5" fill="url(#plg-y2)"/><path d="M7 6h18a4 4 0 0 1 4 4v14.5a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4z" fill="url(#plg-y2)"/><path d="M3 12.5h26" stroke="#fff" stroke-opacity=".35" stroke-width="1.4"/><path d="M16 15.2l1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z" fill="#fff"/></svg>';
    IC.trail = IC.free;
    IC.route = IC.pass;
    var P = {
      free: {
        n: "Free",
        d: "Try Kosway on your first two trips",
        rows: [
          ["map", "Trips", "2 free"],
          ["wallet", "Budget and packing", "Included"],
          ["users", "Groups and sync", "Included"],
          ["wifioff", "Works offline", "Yes"],
          ["sparkle", "Atlas AI", "Not included"],
        ],
      },
      pass: {
        n: "Trip pass",
        d: "Everything for one trip, for 30 days",
        rows: [
          ["map", "Trips", "Unlimited for 30 days"],
          ["pdf", "Trip PDF", "Included"],
          ["now", "Jump to now", "Included"],
          ["sparkle", "Atlas AI", "Add for ₹99 a month"],
          ["wallet", "Renewal", "None. Buy again next trip"],
        ],
      },
      atlas: {
        n: "Atlas",
        d: "Your AI travel companion",
        rows: [
          ["chat", "Atlas chat", "300 replies a month"],
          ["sparkle", "Ask about any page", "Included"],
          ["map", "Works with", "Your free trips or a pass"],
          ["wallet", "Billing", "Monthly. Cancel any time"],
        ],
      },
      yearly: {
        n: "Yearly",
        d: "Unlimited trips and Atlas all year",
        rows: [
          ["map", "Trips", "Unlimited all year"],
          ["chat", "Atlas chat", "300 replies a month"],
          ["pdf", "Trip PDF", "Included"],
          ["now", "Jump to now", "Included"],
          ["palette", "Customisation", "Included"],
        ],
      },
    };
    var PILL = {
      free: ["Free", "2 trips"],
      pass: ["One-time", "No auto-renew"],
      atlas: ["Monthly", "Cancel any time"],
      yearly: ["Best value", "Renews yearly"],
    };
    var KS = ["free", "pass", "atlas", "yearly"],
      BASE = { pass: 199, atlas: 99, yearly: 999, custom: 99 },
      PER = { pass: "for 30 days", atlas: "a month", yearly: "a year", custom: "one time" };
    function today() {
      return new Date().toISOString().slice(0, 10);
    }
    function ent() {
      var e = {};
      try {
        e = JSON.parse(ls("vizag-ent") || "{}") || {};
      } catch (x) {}
      return e;
    }
    function on(k) {
      var e = ent();
      if (k === "custom") return !!e.custom || on("yearly");
      return !!(e[k] && e[k] >= today());
    }
    function mirror() {
      var e = ent(),
        v = null;
      if (on("yearly") || on("atlas")) v = { plan: "pro", renew: on("yearly") ? e.yearly : e.atlas };
      else if (on("pass")) v = { plan: "plus", renew: e.pass };
      ss("vizag-plan", v ? JSON.stringify(v) : null);
    }
    window.__ent = { on: on, get: ent, mirror: mirror };
    function cur() {
      return on("yearly") ? "yearly" : on("pass") ? "pass" : on("atlas") ? "atlas" : "free";
    }
    function price(k) {
      var o = offerLeft() > 0,
        b = BASE[k] || 0,
        n = o && b ? Math.round(b * 0.9) : b;
      return { now: n, was: o && b ? b : 0, per: PER[k] || "always" };
    }
    function render() {
      var c = cur();
      sel || (sel = c === "free" ? "pass" : c);
      var k = sel,
        pl = P[k],
        pr = price(k),
        own = k !== "free" && on(k),
        ol = offerLeft();
      var CK =
          '<svg class="p2ck" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7"/></svg>',
        NO = '<i class="p2no" aria-label="Not included">–</i>';
      var CMP = [
          ["Trips", "2", "30 days", 0, "All year"],
          ["Budget, packing, offline", 1, 1, 1, 1],
          ["Trip PDF", 0, 1, 0, 1],
          ["Jump to now", 0, 1, 0, 1],
          ["Atlas AI", 0, "₹99/mo", 1, 1],
          ["Customisation", "₹99", "₹99", "₹99", 1],
          ["Price", "Free", "₹199", "₹99/mo", "₹999/yr"],
        ],
        ci = KS.indexOf(k);
      function cell(v) {
        return v === 1 ? CK : v === 0 ? NO : "<span>" + v + "</span>";
      }
      var tag = own
        ? '<i class="p2tag">Active</i>'
        : k === "yearly"
          ? '<i class="p2tag">Best value</i>'
          : k === "pass"
            ? '<i class="p2tag">No auto-renew</i>'
            : "";
      var per =
        k === "free"
          ? "Plan two trips with everything except Atlas. Upgrade when you’re ready."
          : k === "pass"
            ? "Pay once when you travel. It ends after 30 days, nothing renews."
            : k === "atlas"
              ? "Billed monthly. Cancel any time."
              : "Just " +
                rup(Math.round(pr.now / 12)) +
                " a month. Atlas alone is " +
                rup(BASE.atlas * 12) +
                " a year.";
      var ad = on("custom")
        ? '<div class="p2add own"><span class="p2ai">' +
          ic("palette") +
          '</span><span class="p2at"><b>Customisation</b><small>' +
          (on("yearly") ? "Included with Yearly" : "Yours forever") +
          '</small></span><i class="p2tag">Owned</i></div>'
        : '<button type="button" class="p2add" data-addon="custom"><span class="p2ai">' +
          ic("palette") +
          '</span><span class="p2at"><b>Customisation add-on</b><small>All themes, nav styles, home cards and app icons. Yours forever.</small></span><span class="p2ap"><b>' +
          rup(price("custom").now) +
          "</b><small>one time</small></span></button>";
      body.innerHTML =
        '<div class="p2seg p2seg4" role="tablist" aria-label="Plans">' +
        KS.map(function (x) {
          return (
            '<button type="button" role="tab" data-pk="' +
            x +
            '" aria-selected="' +
            (x === k) +
            '">' +
            (x === "pass" ? "Pass" : P[x].n) +
            (x === c && x !== "free" ? '<i class="p2dot" aria-label="active"></i>' : "") +
            "</button>"
          );
        }).join("") +
        "</div>" +
        '<div class="p2card p2-' +
        k +
        (ol > 0 && k !== "free" ? " hasofl" : "") +
        '">' +
        '<div class="p2head p2hr"><span class="p2nm"><b>' +
        pl.n +
        "</b><small>" +
        pl.d +
        '</small></span><span class="ptile">' +
        IC[k] +
        "</span></div>" +
        (ol > 0 && k !== "free"
          ? '<div class="p2ofl"><span>10% off, just for you</span><span>Ends in <time class="ofcd">' +
            hms(ol) +
            "</time></span></div>"
          : "") +
        '<div class="p2price"><b>' +
        (k === "free" ? "Free" : rup(pr.now)) +
        "</b><span>" +
        (k === "free" ? "2 trips" : pr.per) +
        "</span>" +
        (pr.was ? "<s>" + rup(pr.was) + "</s>" : "") +
        "</div>" +
        '<p class="p2per">' +
        per +
        '</p><div class="p2pills">' +
        (own ? '<i class="on">Active</i>' : "") +
        PILL[k]
          .map(function (x) {
            return "<i>" + x + "</i>";
          })
          .join("") +
        "</div>" +
        '<ul class="p2inc">' +
        pl.rows
          .map(function (r) {
            return "<li>" + ic(r[0]) + "<span>" + r[1] + "</span><em>" + r[2] + "</em></li>";
          })
          .join("") +
        "</ul></div>" +
        '<div class="p2cap">Add-on</div>' +
        ad +
        '<div class="p2cap">Compare</div><div class="p2cmp p2cmp4" style="--ci:' +
        ci +
        '"><div class="p2r p2h"><span></span>' +
        KS.map(function (x, i) {
          return '<b class="' + (i === ci ? "on" : "") + '">' + (x === "pass" ? "Pass" : P[x].n) + "</b>";
        }).join("") +
        "</div>" +
        CMP.map(function (r) {
          return (
            '<div class="p2r"><span>' +
            r[0] +
            "</span>" +
            [1, 2, 3, 4]
              .map(function (i) {
                return '<em class="' + (i - 1 === ci ? "on" : "") + '">' + cell(r[i]) + "</em>";
              })
              .join("") +
            "</div>"
          );
        }).join("") +
        "</div>";
      body.querySelectorAll("[data-pk]").forEach(function (b) {
        b.onclick = function (e) {
          e.stopPropagation();
          if (sel === b.dataset.pk) return;
          sel = b.dataset.pk;
          window.__snd && window.__snd("tap");
          render();
        };
      });
      var adb = body.querySelector("[data-addon]");
      adb &&
        (adb.onclick = function (e) {
          e.stopPropagation();
          buy = "custom";
          goingPay = !0;
          fill();
          orig && orig.call(up, e);
        });
      chip.innerHTML =
        '<span class="ptile">' +
        IC[k] +
        '</span><span class="cn"><b>' +
        pl.n +
        "</b><small>" +
        (k === "free" ? "2 trips" : rup(pr.now) + " " + pr.per) +
        '</small></span><span class="cc">Change<svg viewBox="0 0 24 24"><path d="M9.5 6l6 6-6 6"/></svg></span>';
      var t,
        dis = !1,
        ln = "";
      if (k === "free") {
        t = c === "free" ? "You’re on Free" : "Free is always here";
        dis = !0;
        ln = c === "free" ? tripsLeft() + " of 2 free trips left" : "";
      } else if (own) {
        t = pl.n + " is active";
        dis = !0;
        ln = "Active until " + fmt(ent()[k]);
      } else if (k === "pass" && on("yearly")) {
        t = "Yearly already includes this";
        dis = !0;
      } else if (k === "atlas" && on("yearly")) {
        t = "Yearly already includes Atlas";
        dis = !0;
      } else {
        t = k === "pass" ? "Get Trip pass" : k === "atlas" ? "Get Atlas" : "Get Yearly";
        ln =
          k === "pass"
            ? "One payment. Nothing renews."
            : k === "atlas"
              ? rup(pr.now) + " a month. Cancel any time."
              : rup(pr.now) + " a year. Cancel any time.";
      }
      up.textContent = t;
      up.disabled = dis;
      line.textContent = ln;
    }
    function fmt(d) {
      try {
        return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      } catch (e) {
        return d;
      }
    }
    function made() {
      return +ls("vizag-trips-made") || 0;
    }
    function tripsLeft() {
      return Math.max(0, 2 - made());
    }
    window.__tripGate = function () {
      if (on("pass") || on("yearly")) {
        ss("vizag-trips-made", String(made() + 1));
        return !0;
      }
      if (made() < 2) {
        ss("vizag-trips-made", String(made() + 1));
        return !0;
      }
      sel = "pass";
      window.__openPlans && window.__openPlans();
      setTimeout(function () {
        window.__toast && window.__toast("You’ve used your 2 free trips. Get a pass to plan more.");
      }, 400);
      return !1;
    };
    /* picker */
    var buy = null;
    var pk = D.createElement("div");
    pk.className = "sheet lsheet psheet";
    pk.id = "pl-pick";
    pk.hidden = !0;
    pk.setAttribute("role", "dialog");
    pk.setAttribute("aria-label", "Choose a plan");
    D.body.appendChild(pk);
    pk.addEventListener("click", function (e) {
      e.stopPropagation();
    });
    function pick() {
      var c = cur();
      pk.innerHTML =
        '<div class="shtitle"><span>Choose a plan</span><button type="button" class="shclose" aria-label="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div><div class="pkc">' +
        KS.map(function (k) {
          var pr = price(k),
            pl = P[k];
          return (
            '<button type="button" class="pk' +
            (k === sel ? " sel" : "") +
            '" data-k="' +
            k +
            '" aria-pressed="' +
            (k === sel) +
            '">' +
            (k === "yearly" ? '<span class="kbest">Best value</span>' : "") +
            '<span class="ptile">' +
            IC[k] +
            '</span><span class="kn"><b>' +
            pl.n +
            (k === c && k !== "free" ? ' <i class="plcur2">Active</i>' : "") +
            "</b><small>" +
            pl.d +
            '</small></span><span class="kp">' +
            (pr.was ? '<span class="pp-was">' + rup(pr.was) + "</span>" : "") +
            "<b>" +
            (k === "free" ? "Free" : rup(pr.now)) +
            "</b></span></button>"
          );
        }).join("") +
        "</div>";
      pk.querySelector(".shclose").onclick = function () {
        pk.hidden = !0;
      };
      pk.querySelectorAll(".pk").forEach(function (b) {
        b.onclick = function () {
          sel = b.dataset.k;
          window.__snd && window.__snd("tap");
          pk.querySelectorAll(".pk").forEach(function (x) {
            x.classList.toggle("sel", x === b);
          });
          setTimeout(function () {
            pk.hidden = !0;
            render();
          }, 160);
        };
      });
      pk.hidden = !1;
    }
    chip.addEventListener("click", function (e) {
      e.stopPropagation();
      pick();
    });
    /* checkout */
    var NM = { pass: "Trip pass", atlas: "Atlas", yearly: "Yearly", custom: "Customisation" },
      BL = {
        pass: ["30 days of unlimited trips", "Trip PDF and Jump to now", "Nothing renews"],
        atlas: ["300 Atlas replies a month", "Cancel any time in Settings"],
        yearly: [
          "Unlimited trips all year",
          "Atlas and customisation included",
          "Cancel any time in Settings",
        ],
        custom: ["All themes, nav styles and home cards", "App icon colours", "Pay once, yours forever"],
      };
    function fill() {
      var co = D.getElementById("checkout-sheet");
      if (!co) return;
      var k = buy || sel,
        pr = price(k),
        ti = co.querySelector(".shtitle span");
      ti && (ti.textContent = "Get " + NM[k]);
      var cd = co.querySelector(".plcard");
      cd &&
        (cd.innerHTML =
          '<div class="plh"><b>' +
          NM[k] +
          "</b><span>" +
          rup(pr.now) +
          " " +
          pr.per +
          "</span></div><ul>" +
          BL[k]
            .map(function (x) {
              return "<li>" + x + "</li>";
            })
            .join("") +
          "</ul>");
      var pay = co.querySelector("#co-pay");
      if (!pay) return;
      var lb = "Pay " + rup(pr.now);
      pay.textContent = lb;
      pay.onclick = function () {
        var q = this;
        q.disabled = !0;
        q.textContent = "Processing…";
        setTimeout(function () {
          q.disabled = !1;
          q.textContent = lb;
          var e = ent(),
            G = new Date();
          if (k === "custom") e.custom = !0;
          else {
            if (k === "yearly") G.setFullYear(G.getFullYear() + 1);
            else if (k === "atlas") G.setMonth(G.getMonth() + 1);
            else G.setDate(G.getDate() + 30);
            var base = e[k] && e[k] >= today() ? new Date(e[k] + "T00:00:00") : null;
            if (base && k === "pass") {
              base.setDate(base.getDate() + 30);
              G = base;
            }
            e[k] = G.toISOString().slice(0, 10);
          }
          ss("vizag-ent", JSON.stringify(e));
          mirror();
          buy = null;
          ss("vizag-offer-until", null);
          var x = co.querySelector(".shclose");
          x && x.click();
          window.__paintPlan && window.__paintPlan();
          window.__pfsync && window.__pfsync();
          window.__snd && window.__snd("win");
          window.__toast &&
            window.__toast(NM[k] + (k === "custom" ? " is yours. Enjoy!" : " is active. Enjoy!"));
          A.hidden || render();
        }, 1200);
      };
    }
    up &&
      (up.onclick = function (e) {
        if (up.disabled) return;
        buy = null;
        goingPay = !0;
        fill();
        orig && orig.call(this, e);
      });
    var op = window.__openPlans;
    window.__openPlans = function () {
      var keep = sel;
      sel = null;
      goingPay = !1;
      render();
      if (keep && keep !== sel && KS.indexOf(keep) >= 0 && cur() === "free") {
        sel = keep;
        render();
      }
      op && op();
    };
    render();

    /* countdown tick */
    setInterval(function () {
      var l = offerLeft(),
        t = D.querySelectorAll(".ofcd");
      if (!t.length) return;
      if (l <= 0) {
        A.hidden || render();
        return;
      }
      t.forEach(function (x) {
        x.textContent = hms(l);
      });
    }, 1000);
    /* first-close offer */
    var of = null;
    function offer() {
      if (of) of.remove();
      of = D.createElement("div");
      of.className = "sheet lsheet";
      of.id = "offer-sheet";
      of.setAttribute("role", "dialog");
      of.setAttribute("aria-label", "Special offer");
      of.innerHTML =
        '<div class="lohead locent"><span class="ofic">%</span><div class="t">10% off, just for you</div><div class="s">Get a pass, Atlas or Yearly for less. This offer ends in</div><div class="ofclock ofcd">' +
        hms(offerLeft()) +
        '</div></div><button type="button" class="btn full" id="of-go">See offer</button><button type="button" class="btn ghost full" id="of-skip">Not now</button>';
      D.body.appendChild(of);
      var sc = D.getElementById("scrim");
      sc && (sc.hidden = !1);
      function cl() {
        of.remove();
        of = null;
        sc && !D.querySelector(".sheet:not(.inpage):not([hidden])") && (sc.hidden = !0);
      }
      of.addEventListener("click", function (e) {
        e.stopPropagation();
      });
      of.querySelector("#of-skip").onclick = cl;
      of.querySelector("#of-go").onclick = function () {
        cl();
        window.__openPlans && window.__openPlans();
      };
      sc &&
        sc.addEventListener("click", function f() {
          of && cl();
          sc.removeEventListener("click", f);
        });
    }
    new MutationObserver(function () {
      if (!A.hidden) {
        return;
      }
      pk.hidden = !0;
      if (goingPay) return;
      if (cur() !== "free" || ls("vizag-offer-seen")) return;
      ss("vizag-offer-seen", "1");
      ss("vizag-offer-until", String(Date.now() + 864e5));
      setTimeout(offer, 280);
    }).observe(A, { attributes: !0, attributeFilter: ["hidden"] });
    /* dev: reset offer */
    function dev() {
      var o = D.querySelector(".devopts");
      if (!o || D.getElementById("dev-offer")) return;
      var r = D.createElement("div");
      r.className = "setrow";
      r.id = "dev-offer";
      r.innerHTML =
        '<span class="setl">Reset 10% offer<small>Shows again next time Plans closes</small></span><button type="button" class="setbtn">Reset</button>';
      r.querySelector("button").onclick = function (e) {
        e.stopPropagation();
        ss("vizag-offer-seen", null);
        ss("vizag-offer-until", null);
        window.__toast && window.__toast("Offer reset");
      };
      o.appendChild(r);
    }
    setTimeout(dev, 800);
    setInterval(dev, 3000);
    /* profile: name or photo opens edit profile */

    /* AI sheet: show intro only when needed */
    var as = D.getElementById("ai-sheet");
    as &&
      new MutationObserver(function () {
        var i = as.querySelector(".aiintro");
        as.classList.toggle("need", !!(i && i.__o && i.textContent !== i.__o));
      }).observe(as, { attributes: !0, attributeFilter: ["hidden"], subtree: !1 });
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Plans sheet: builds the plan cards, tabs, compare table and ", err);
}

/* ==========================================================================
   Group avatars and the Top travellers board (real board shows once 20+ travellers have finished trips).
   ========================================================================== */
try {
  (function () {
    var D = document;
    var COL = ["#ffd6a5", "#caffbf", "#bdb2ff", "#ffc6ff", "#9bf6ff", "#fdffb6", "#ffadad", "#a0e7e5"];
    function hc(t) {
      var h = 0;
      for (var i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) >>> 0;
      return COL[h % COL.length];
    }
    function ini(n) {
      n = String(n || "?")
        .replace(/^@/, "")
        .trim();
      var p = n.split(/\s+/);
      return ((p[0] || "?").charAt(0) + (p[1] ? p[1].charAt(0) : "")).toUpperCase();
    }
    function esc(t) {
      return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    }
    /* groups: stacked avatars */
    window.__gstack = function (g, n) {
      var m = (g.members || []).map(function (x) {
        return x.name || x.user || x.email || x.id || "?";
      });
      if (!m.length) {
        m = [];
        for (var i = 0; i < Math.min(n || 0, 3); i++) m.push(String.fromCharCode(65 + i));
      }
      var h = m
        .slice(0, 3)
        .map(function (x) {
          return '<i style="background:' + hc(x) + '">' + esc(ini(x)) + "</i>";
        })
        .join("");
      m.length > 3 && (h += '<i class="more">+' + (m.length - 3) + "</i>");
      return '<span class="gstack">' + (h || '<i class="more">0</i>') + "</span>";
    };
    function deco() {
      var e = D.getElementById("grp-list");
      if (!e || !window.__groups) return;
      var G = window.__groups();
      e.querySelectorAll("[data-gi]").forEach(function (r) {
        var g = G[+r.dataset.gi];
        if (!g) return;
        var v = r.querySelector(".gav");
        if (v) {
          var n = g.members ? g.members.length : (g.women || 0) + (g.men || 0) + (g.kids || 0);
          v.outerHTML = window.__gstack(g, n);
        }
        var c = r.querySelector(".achev");
        if (c) {
          c.className = "gedit";
          c.innerHTML = '<svg class="ph" aria-hidden="true"><use href="#i-hugeicons-edit"/></svg>';
        }
      });
    }
    var gle = D.getElementById("grp-list");
    gle && (new MutationObserver(deco).observe(gle, { childList: !0 }), deco());
    /* leaderboard data (sample until public profiles exist) */
    var LB = [
      ["Ananya Rao", "ananya", 2840, 14, 9, 46, "Kerala"],
      ["Kabir Mehta", "kabirm", 2615, 12, 8, 41, "Ladakh"],
      ["Meera Iyer", "meera.i", 2480, 11, 10, 38, "Goa"],
      ["Rohan Das", "rohand", 2210, 10, 7, 33, "Sikkim"],
      ["Ishita Sen", "ishita", 2045, 9, 7, 30, "Rajasthan"],
      ["Arjun Nair", "arjun.n", 1930, 9, 6, 29, "Kerala"],
      ["Zoya Khan", "zoyak", 1820, 8, 6, 27, "Kashmir"],
      ["Vikram Singh", "vikram", 1705, 8, 5, 25, "Rajasthan"],
      ["Priya Menon", "priyam", 1590, 7, 5, 24, "Karnataka"],
      ["Aditya Joshi", "adijo", 1480, 7, 5, 22, "Uttarakhand"],
      ["Sana Qureshi", "sanaq", 1365, 6, 4, 20, "Himachal"],
      ["Karthik Reddy", "karthik", 1250, 6, 4, 19, "Andhra Pradesh"],
      ["Nisha Patel", "nisha.p", 1140, 5, 4, 17, "Gujarat"],
      ["Dev Malhotra", "devm", 1020, 5, 3, 15, "Punjab"],
      ["Tara Bose", "tarab", 960, 4, 3, 14, "West Bengal"],
    ];
    var TIER = {
      ananya: "pro",
      "meera.i": "plus",
      rohand: "pro",
      zoyak: "plus",
      adijo: "pro",
      karthik: "plus",
    };
    function tier(u) {
      var t = TIER[u];
      return t ? ' <i class="lbtier ' + t + '">' + (t === "pro" ? "Pro" : "Plus") + "</i>" : "";
    }
    function rav(n, sz, r) {
      return '<span class="lavw">' + av(n, sz, !0) + '<b class="rtag r' + r + '">' + r + "</b></span>";
    }
    function av(n, sz, pent) {
      return (
        '<i class="lav ' + sz + '" style="background:' + hc(n) + ';border-radius:50%">' + esc(ini(n)) + "</i>"
      );
    }
    var CROWN =
      '<svg class="crown" viewBox="0 0 34 24" aria-hidden="true"><defs><linearGradient id="lbcr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe08a"/><stop offset="1" stop-color="#e8941a"/></linearGradient></defs><path d="M3 7l7.5 6L17 2l6.5 11L31 7l-3 15H6z" fill="url(#lbcr)" stroke="#c97a00" stroke-width="1" stroke-linejoin="round"/><circle cx="17" cy="15" r="2" fill="#fff" opacity=".85"/></svg>';
    function me() {
      var n = (window.__profName && window.__profName()) || {},
        pts = 0;
      try {
        var t = window.__profSummary && window.__profSummary();
        var mm = /([\d,]+) travel points/.exec(t || "");
        mm && (pts = +mm[1].replace(/,/g, ""));
      } catch (e) {}
      return { n: n.name || n.user || "You", pts: pts };
    }
    var sc = D.getElementById("scrim");
    function sheet(id, cls) {
      var x = D.getElementById(id);
      if (x) return x;
      x = D.createElement("div");
      x.className = "sheet lsheet psheet" + (cls ? " " + cls : "");
      x.id = id;
      x.hidden = !0;
      x.setAttribute("role", "dialog");
      D.body.appendChild(x);
      x.addEventListener("click", function (e) {
        e.stopPropagation();
      });
      return x;
    }
    function shut(x) {
      x.hidden = !0;
      sc && !D.querySelector(".sheet:not(.inpage):not([hidden])") && (sc.hidden = !0);
    }
    function openSoon() {
      var x = sheet("lb-sheet");
      x.setAttribute("aria-label", "Top travellers");
      var tips = [
        ["Plan and finish trips", "Every finished trip adds travel points."],
        ["Tick off places", "Mark places as you visit them on the day."],
        ["Rate where you went", "Ratings help others and count towards your rank."],
        ["Keep your profile public", "Only public profiles appear on the board."],
      ];
      x.innerHTML =
        '<div class="shtitle"><span>Top travellers</span><button type="button" class="shclose" aria-label="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div><div class="lbsoon">' +
        (function () {
          var K =
            window.__kavf ||
            function (i) {
              return "";
            };
          function P(r, a) {
            return (
              '<div class="lbp p' +
              r +
              '">' +
              (r === 1
                ? '<svg class="lbcr" viewBox="0 0 24 16"><path d="M3 13 1.5 4l6 4.5L12 1l4.5 7.5 6-4.5L21 13z"/></svg>'
                : "") +
              '<span class="lbav">' +
              K(a) +
              '</span><span class="lbblk"><b>' +
              r +
              "</b></span></div>"
            );
          }
          return (
            '<div class="lbsz" aria-hidden="true"><i class="lbsp s1"></i><i class="lbsp s2"></i><i class="lbsp s3"></i>' +
            P(2, "kav3") +
            P(1, "kav1") +
            P(3, "kav6") +
            "</div>"
          );
        })() +
        '<b>Coming soon!</b><p>The board opens once 20+ travellers have finished trips with Kosway. Here’s how to be on it from day one:</p></div><ol class="lbtips lbtl">' +
        tips
          .map(function (t, i) {
            return (
              "<li><span>" + (i + 1) + "</span><div><b>" + t[0] + "</b><small>" + t[1] + "</small></div></li>"
            );
          })
          .join("") +
        "</ol>";
      x.querySelector(".shclose").onclick = function () {
        shut(x);
      };
      D.querySelectorAll(".sheet:not(.inpage):not([hidden])").forEach(function (o) {
        o.hidden = !0;
      });
      x.hidden = !1;
      x.scrollTop = 0;
      sc && (sc.hidden = !1);
    }
    function openLB() {
      var RL = window.__lbData;
      if (RL && RL.length >= 20) {
        LB = RL;
      } else {
        return openSoon();
      }
      var x = sheet("lb-sheet");
      x.setAttribute("aria-label", "Top travellers");
      var m = me(),
        top = LB.slice(0, 3),
        need = Math.max(0, LB[14][2] - m.pts + 1);
      var mx = LB[0][2];
      function ra(n, c) {
        return (
          '<i class="lra' + (c ? " " + c : "") + '" style="background:' + hc(n) + '">' + esc(ini(n)) + "</i>"
        );
      }
      function row(n, u, sub, pts, rk, you) {
        return (
          '<div class="lrow' +
          (you ? " you" : "") +
          '"><span class="lrk">' +
          rk +
          "</span>" +
          ra(n) +
          '<span class="lnm"><b>' +
          esc(n) +
          (u ? tier(u) : "") +
          "</b><small>" +
          sub +
          '</small><i class="lbar"><i style="width:' +
          Math.max(4, Math.min(100, Math.round((pts / mx) * 100))) +
          '%"></i></i></span><span class="lpt">' +
          pts.toLocaleString("en-IN") +
          "</span></div>"
        );
      }
      var pod = [1, 0, 2]
        .map(function (k) {
          var p = top[k];
          return (
            '<button type="button" class="lpd p' +
            (k + 1) +
            '" data-i="' +
            k +
            '" aria-label="' +
            esc(p[0]) +
            ", rank " +
            (k + 1) +
            '"><span class="lpa">' +
            ra(p[0]) +
            '<b class="lpr">' +
            (k + 1) +
            '</b></span><span class="pn">' +
            esc(p[0].split(" ")[0]) +
            '</span><span class="lpp">' +
            p[2].toLocaleString("en-IN") +
            ' pts</span><span class="lst"></span></button>'
          );
        })
        .join("");
      x.innerHTML =
        '<div class="shtitle"><span>Top travellers</span><button type="button" class="shclose" aria-label="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div><p class="lbsub2">This month · public profiles</p><div class="lbpod">' +
        pod +
        '</div><div class="lbcap">Rankings</div><div class="lbl2">' +
        LB.slice(3)
          .map(function (p, i) {
            return row(p[0], p[1], "@" + esc(p[1]) + " · " + p[4] + " states", p[2], i + 4);
          })
          .join("") +
        '</div><div class="lbcap">You</div><div class="lbl2">' +
        row(
          m.n,
          "",
          need ? need.toLocaleString("en-IN") + " more points to reach the top 15" : "You’re in the top 15",
          m.pts,
          (function () {
            var r = 1;
            LB.forEach(function (p) {
              p[2] > m.pts && r++;
            });
            return r > 15 ? "16+" : String(r);
          })(),
          1,
        ) +
        '</div><p class="lbnote">Only public profiles appear here. Sample travellers for now.</p>';
      x.querySelector(".shclose").onclick = function () {
        var t = D.getElementById("tp-sheet"),
          b = D.getElementById("tp-blur");
        t && (t.hidden = !0);
        b && (b.hidden = !0);
        shut(x);
      };
      x.querySelectorAll(".lbpod button").forEach(function (b) {
        b.onclick = function () {
          openTP(+b.dataset.i);
        };
      });
      D.querySelectorAll(".sheet:not(.inpage):not([hidden])").forEach(function (o) {
        o.hidden = !0;
      });
      x.hidden = !1;
      x.scrollTop = 0;
      sc && (sc.hidden = !1);
    }
    function openTP(i) {
      var p = LB[i],
        x = sheet("tp-sheet");
      x.setAttribute("aria-label", p[0]);
      x.innerHTML =
        '<div class="shtitle"><span></span><button type="button" class="shclose" aria-label="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div><div class="tph">' +
        av(p[0], "xl", !0) +
        "<b>" +
        esc(p[0]) +
        tier(p[1]) +
        "</b><small>@" +
        esc(p[1]) +
        '</small><span class="tprank">' +
        ["1st", "2nd", "3rd"][i] +
        ' this month</span></div><div class="tpg"><div><b>' +
        p[2].toLocaleString("en-IN") +
        "</b><small>Points</small></div><div><b>" +
        p[3] +
        "</b><small>Trips</small></div><div><b>" +
        p[4] +
        "</b><small>States</small></div><div><b>" +
        p[5] +
        '</b><small>Days</small></div></div><div class="tpfav"><span>Loves ' +
        esc(p[6]) +
        '</span><span>Explorer level</span></div><button type="button" class="btn full tpok">Close</button>';
      var bl = D.getElementById("tp-blur");
      if (!bl) {
        bl = D.createElement("div");
        bl.id = "tp-blur";
        bl.hidden = !0;
        D.body.appendChild(bl);
      }
      function c() {
        x.hidden = !0;
        bl.hidden = !0;
      }
      bl.onclick = function (e) {
        e.stopPropagation();
        c();
      };
      x.querySelector(".shclose").onclick = c;
      x.querySelector(".tpok").onclick = c;
      x.parentNode.insertBefore(bl, x);
      bl.hidden = !1;
      x.hidden = !1;
    }
    window.__openLeaderboard = openLB;
    /* entry in Profile */
    function ent() {
      var a = D.getElementById("acct");
      if (!a || D.getElementById("lb-ent")) return;
      var b = D.createElement("button");
      b.type = "button";
      b.className = "lbent";
      b.id = "lb-ent";
      b.innerHTML =
        '<span class="lbs">' +
        LB.slice(0, 3)
          .map(function (p) {
            return av(p[0], "s", !0);
          })
          .join("") +
        '</span><span class="lbt"><b>Top travellers</b><small>See who’s explored the most this month</small></span><span class="lbgo"><svg viewBox="0 0 24 24"><path d="M9.5 6l6 6-6 6"/></svg></span>';
      b.onclick = function (e) {
        e.stopPropagation();
        openLB();
      };
      var host = D.getElementById("acct-empty");
      (a.hidden && host && !host.hidden ? host : a).after(b);
    }
    setTimeout(ent, 500);
    setInterval(ent, 2500);
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Group avatars and the Top travellers board (real board shows", err);
}

/* ==========================================================================
   Turns the custom app icon into PNG images for the home screen.
   ========================================================================== */
try {
  (function () {
    var D = document,
      last = "";
    function png(svg, sz, cb) {
      var i = new Image();
      i.onload = function () {
        try {
          var c = D.createElement("canvas");
          c.width = c.height = sz;
          var x = c.getContext("2d");
          x.drawImage(i, 0, 0, sz, sz);
          cb(c.toDataURL("image/png"));
        } catch (e) {}
      };
      i.src = svg;
    }
    function link(rel, href, sizes) {
      var l = D.querySelector('link[rel="' + rel + '"]' + (sizes ? '[sizes="' + sizes + '"]' : ""));
      if (!l) {
        l = D.createElement("link");
        l.rel = rel;
        sizes && l.setAttribute("sizes", sizes);
        D.head.appendChild(l);
      }
      l.href = href;
    }
    window.__iconPng = function (svg) {
      if (!svg || svg === last) return;
      last = svg;
      png(svg, 180, function (u) {
        link("apple-touch-icon", u, "180x180");
      });
      png(svg, 512, function (u512) {
        png(svg, 192, function (u192) {
          try {
            var base = location.href
              .split("#")[0]
              .split("?")[0]
              .replace(/[^/]*$/, "");
            var m = {
              name: "Vizag · Araku · Vanjangi",
              short_name: "Vizag trip",
              start_url: base,
              scope: base,
              display: "standalone",
              background_color: "#F2F2F2",
              theme_color: "#151515",
              icons: [
                { src: u192, sizes: "192x192", type: "image/png" },
                { src: u512, sizes: "512x512", type: "image/png", purpose: "any" },
              ],
            };
            var ml = D.querySelector('link[rel="manifest"]');
            ml && (ml.href = "data:application/manifest+json," + encodeURIComponent(JSON.stringify(m)));
          } catch (e) {}
        });
      });
    };
    var ic = D.querySelector('link[rel="icon"]');
    ic && /^data:image\/svg/.test(ic.href) && window.__iconPng(ic.href);
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Turns the custom app icon into PNG images for the home scree", err);
}

/* ==========================================================================
   Hand-drawn strike-through in the theme colour, bottom blur over the nav, keyboard-aware login, long-press fixes.
   ========================================================================== */
try {
  (function () {
    var D = document,
      R = D.documentElement;
    function ls(k) {
      try {
        return localStorage.getItem(k);
      } catch (e) {
        return null;
      }
    }
    function ss(k, v) {
      try {
        v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v);
      } catch (e) {}
    }
    /* coloured hand-drawn strike from the theme accent */
    var la = "";
    function strike() {
      var a = getComputedStyle(R).getPropertyValue("--accent").trim();
      if (!a || a === la) return;
      la = a;
      var svg =
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 12' preserveAspectRatio='none'><path d='M1 7.2C12 4.6 22 8.8 36 6.4S62 4.2 78 6.9 94 5.8 99 4.8' fill='none' stroke='" +
        a +
        "' stroke-width='2.2' stroke-linecap='round' vector-effect='non-scaling-stroke'/></svg>";
      R.style.setProperty(
        "--strike",
        'url("data:image/svg+xml,' + encodeURIComponent(svg).replace(/'/g, "%27") + '")',
      );
    }
    strike();
    setInterval(strike, 1200);
    /* bottom blur sits on top of the nav */
    var bb = D.createElement("div");
    bb.className = "bblur";
    bb.setAttribute("aria-hidden", "true");
    D.body.appendChild(bb);
    function bpos() {
      var n = D.querySelector(".nav");
      if (!n) return;
      var r = n.getBoundingClientRect();
      if (!r.height || r.top < innerHeight * 0.5) {
        bb.style.display = "none";
        return;
      }
      bb.style.display = "";
      R.style.setProperty("--bbot", Math.max(0, Math.round(innerHeight - r.top - 1)) + "px");
    }
    bpos();
    addEventListener("resize", bpos);
    setInterval(bpos, 1000);
    /* login: track the visible area above the keyboard */
    var vv = window.visualViewport;
    function vset() {
      if (!vv) return;
      R.style.setProperty("--vvh", Math.round(vv.height) + "px");
      R.style.setProperty("--vvt", Math.round(vv.offsetTop) + "px");
    }
    vv && (vv.addEventListener("resize", vset), vv.addEventListener("scroll", vset), vset());
    /* long-press Home: stop the iOS loupe, keep short taps working */
    var hs = null,
      hx = 0,
      hy = 0,
      ht = 0;
    D.addEventListener(
      "touchstart",
      function (e) {
        var b = e.target.closest && e.target.closest('.nav button[data-v="home"]');
        if (!b) return;
        hs = b;
        ht = Date.now();
        hx = e.touches[0].clientX;
        hy = e.touches[0].clientY;
        e.preventDefault();
      },
      { passive: !1, capture: !0 },
    );
    D.addEventListener(
      "touchend",
      function (e) {
        if (!hs) return;
        var b = hs;
        hs = null;
        var t = e.changedTouches[0],
          mv = Math.abs(t.clientX - hx) + Math.abs(t.clientY - hy);
        if (mv < 12 && Date.now() - ht < 350) b.click();
      },
      !0,
    );
    /* Trip section (24-hour time) goes below Customisation */
    function moveTrip() {
      var sp = D.getElementById("settings-profile");
      if (!sp || sp.__tm) return;
      var caps = [].slice.call(sp.querySelectorAll(":scope>.setcap")),
        tc = null,
        cc = null;
      caps.forEach(function (c) {
        var t = c.textContent.trim().toLowerCase();
        t === "trip" && (tc = c);
        /^customi[sz]ation$/.test(t) && (cc = c);
      });
      if (!tc || !cc) return;
      var tg = tc.nextElementSibling,
        cg = cc.nextElementSibling;
      if (!tg || !cg) return;
      cg.after(tc);
      tc.after(tg);
      sp.__tm = 1;
    }
    /* combined profile card: Top travellers + Plus & Pro */
    var COL = ["#ffd6a5", "#caffbf", "#bdb2ff", "#ffc6ff", "#9bf6ff", "#fdffb6", "#ffadad", "#a0e7e5"];
    function hc(t) {
      var h = 0;
      for (var i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) >>> 0;
      return COL[h % COL.length];
    }
    var ax = null;
    function acx() {
      var a = D.getElementById("acct"),
        em = D.getElementById("acct-empty");
      if (!a) return;
      if (!ax) {
        ax = D.createElement("div");
        ax.className = "acx";
        ax.innerHTML =
          '<button type="button" id="acx-lb"><span class="xc"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8.5 20h7M10 17h4"/></svg></span><span class="xt"><b>Top travellers</b><small>Coming soon</small></span></button><button type="button" id="acx-pf"><span class="xc"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 8.5l4.6 3.6L12 5.5l3.9 6.6 4.6-3.6-1.8 9.7H5.3z"/></svg></span><span class="xt"><b>Pass &amp; Atlas</b><small id="acx-n">Features</small></span></button>';
        ax.querySelector("#acx-lb").onclick = function (e) {
          e.stopPropagation();
          window.__openLeaderboard && window.__openLeaderboard();
        };
        ax.querySelector("#acx-pf").onclick = function (e) {
          e.stopPropagation();
          var r = D.getElementById("pf-row");
          r && r.click();
        };
      }
      var host = a.hidden && em && !em.hidden ? em : a;
      ax.parentNode !== host && host.appendChild(ax);
      var pe = D.querySelector(".pfent"),
        n = (D.getElementById("pf-n") || {}).textContent || "",
        pb = ax.querySelector("#acx-pf"),
        off = !pe || pe.style.display === "none";
      pb.hidden = off;
      ax.style.gridTemplateColumns = off ? "1fr" : "";
      var sm = ax.querySelector("#acx-n"),
        t = n ? n + " to unlock" : "Features";
      sm.textContent !== t && (sm.textContent = t);
      moveTrip();
    }
    setTimeout(acx, 600);
    setInterval(acx, 1200);
    /* new group sheet: live preview banner */
    function gprev() {
      var g = D.getElementById("grp-sheet");
      if (!g || g.__gp) return;
      var host = g.querySelector(".pfgrp");
      if (!host) return;
      g.__gp = 1;
      var pv = D.createElement("div");
      pv.className = "gprev";
      pv.setAttribute("aria-hidden", "true");
      host.before(pv);
      function ini(n) {
        n = String(n || "?")
          .replace(/^@/, "")
          .trim();
        var p = n.split(/\s+/);
        return ((p[0] || "?").charAt(0) + (p[1] ? p[1].charAt(0) : "")).toUpperCase();
      }
      function esc(t) {
        return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) {
          return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
      }
      function paint() {
        var nm = (g.querySelector("#grp-name") || {}).value || "",
          ms = [].map.call(g.querySelectorAll(".gmt b"), function (b) {
            return b.textContent;
          });
        g.querySelectorAll(".gmh").forEach(function (h) {
          var v = h.querySelector(".gmav"),
            b = h.querySelector(".gmt b");
          v && b && (v.style.background = hc(b.textContent));
        });
        var st =
          ms
            .slice(0, 4)
            .map(function (m) {
              return '<i style="background:' + hc(m) + '">' + esc(ini(m)) + "</i>";
            })
            .join("") +
          (ms.length > 4
            ? '<i style="background:var(--soft);color:var(--muted)">+' + (ms.length - 4) + "</i>"
            : "") +
          '<i class="add">+</i>';
        pv.innerHTML =
          '<span class="gstack">' +
          st +
          "</span><b>" +
          esc(nm.trim() || "Your group") +
          "</b><small>" +
          (ms.length
            ? ms.length + (ms.length === 1 ? " person" : " people")
            : "Add the people you travel with") +
          "</small>";
      }
      g.addEventListener("input", paint);
      var gm = g.querySelector("#grp-members");
      gm && new MutationObserver(paint).observe(gm, { childList: !0, subtree: !0 });
      new MutationObserver(paint).observe(g, { attributes: !0, attributeFilter: ["hidden"] });
      paint();
    }
    setTimeout(gprev, 700);
    setInterval(gprev, 2000);
    /* dev: test plan switch */
    function dev() {
      var o = D.querySelector(".devopts");
      if (!o || D.getElementById("dev-plan")) return;
      var r = D.createElement("div");
      r.className = "setrow";
      r.id = "dev-plan";
      r.innerHTML =
        '<span class="setl">Test plan<small>Switch to see Free, Plus or Pro</small></span><div class="seg" role="group" aria-label="Test plan"><button type="button" data-tp="free">Free</button><button type="button" data-tp="plus">Plus</button><button type="button" data-tp="pro">Pro</button></div>';
      function cur() {
        var p = {};
        try {
          p = JSON.parse(ls("vizag-plan") || "{}") || {};
        } catch (e) {}
        return p.plan === "pro" ? "pro" : p.plan === "plus" ? "plus" : "free";
      }
      function paint() {
        var c = cur();
        r.querySelectorAll("[data-tp]").forEach(function (b) {
          b.setAttribute("aria-pressed", String(b.dataset.tp === c));
        });
      }
      r.querySelectorAll("[data-tp]").forEach(function (b) {
        b.addEventListener("click", function (e) {
          e.stopPropagation();
          var k = b.dataset.tp,
            v = null;
          if (k === "plus") v = { plan: "plus" };
          else if (k === "pro") {
            var G = new Date();
            G.setFullYear(G.getFullYear() + 1);
            v = { plan: "pro", renew: G.toISOString().slice(0, 10), trial: !1, bill: "yr" };
          }
          ss("vizag-plan", v ? JSON.stringify(v) : null);
          paint();
          window.__paintPlan && window.__paintPlan();
          window.__pfsync && window.__pfsync();
          window.__toast &&
            window.__toast(
              "Testing as " + (k === "free" ? "Free" : k === "plus" ? "Route · Plus" : "Atlas · Pro"),
            );
        });
      });
      paint();
      o.appendChild(r);
    }
    setTimeout(dev, 900);
    setInterval(dev, 3000);
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Hand-drawn strike-through in the theme colour, bottom blur o", err);
}

/* ==========================================================================
   Hairline and soft blur under whichever top bar is stuck, and the icon customiser inside App icon.
   ========================================================================== */
try {
  (function () {
    var D = document,
      R = D.documentElement;
    function ls(k) {
      try {
        return localStorage.getItem(k);
      } catch (e) {
        return null;
      }
    }
    /* 1. hairline + soft blur under whichever top bar is stuck */
    var tq = 0,
      tv = "";
    function tpos(full) {
      tq = 0;
      var best = null,
        y = -1;
      if (window.scrollY > 4) {
        D.querySelectorAll(".hometop,.pghead,.chips").forEach(function (e) {
          var r = e.getBoundingClientRect();
          if (r.width < 200 || !r.height || r.bottom <= 0 || r.top > 220) return;
          if (e.closest("[hidden],.sheet")) return;
          var cs = getComputedStyle(e),
            p = cs.position;
          if (p !== "sticky" && p !== "fixed") return;
          var st = parseFloat(cs.top) || 0;
          if (p === "sticky" && r.top - st > 2) return;
          if (r.bottom > y) {
            y = r.bottom;
            best = e;
          }
        });
      }
      if (best !== tv) {
        tv && tv.classList.remove("tstk");
        best && best.classList.add("tstk");
        tv = best;
      }
    }
    function tk() {
      tq || (tq = requestAnimationFrame(tpos));
    }
    addEventListener("scroll", tk, { passive: !0 });
    addEventListener("resize", function () {
      tpos(!0);
    });
    D.addEventListener(
      "click",
      function () {
        setTimeout(function () {
          tpos(!0);
        }, 350);
      },
      !0,
    );
    setInterval(function () {
      window.scrollY > 4 || tpos(!0);
    }, 1500);
    /* 9. icon customiser right in the App icon section */
    var kzi = null;
    function kz() {
      var A = window.__kzApi,
        pv = D.getElementById("kz-pv");
      if (!A || !pv) return;
      var box = pv.closest(".kz-now");
      R.classList.add("kzinl");
      var m = ls("vizag-icon-match") === "1";
      R.classList.toggle("kzmatch", m);
      if (!kzi) {
        kzi = D.createElement("div");
        kzi.className = "kzi";
        box.appendChild(kzi);
      }
      var c = A.get(),
        th = R.getAttribute("data-skin") === "light" || !R.getAttribute("data-skin") ? "light" : "dark",
        key = JSON.stringify(c) + th;
      if (kzi.__k === key) return;
      kzi.__k = key;
      function row(k, list, label) {
        var curv = c[k],
          nm = (list.filter(function (o) {
            return o[0] === curv;
          })[0] || ["", ""])[1];
        return (
          '<div class="kzc"><span>' +
          label +
          "</span><b>" +
          nm +
          '</b></div><div class="kzr" role="group" aria-label="' +
          label +
          '">' +
          list
            .map(function (o) {
              var p = Object.assign({}, c);
              p[k] = o[0];
              p.mk = "circle";
              p.tilt = "left";
              p.tint = "off";
              return (
                '<button type="button" data-k="' +
                k +
                '" data-v="' +
                o[0] +
                '" aria-label="' +
                o[1] +
                '" title="' +
                o[1] +
                '" aria-pressed="' +
                (o[0] === curv) +
                '">' +
                A.svg(p, th).replace(/<g[\s\S]*<\/g>/, "") +
                "</button>"
              );
            })
            .join("") +
          "</div>"
        );
      }
      var cv = (A.colors.filter(function (o) {
        return o[0] === c.color;
      })[0] || ["", ""])[1];
      kzi.innerHTML =
        '<div class="kzc"><span>Colour</span><b>' +
        cv +
        '</b></div><div class="kzr kzsw" role="group" aria-label="Colour">' +
        A.colors
          .map(function (o) {
            return (
              '<button type="button" data-k="color" data-v="' +
              o[0] +
              '" aria-label="' +
              o[1] +
              '" title="' +
              o[1] +
              '" aria-pressed="' +
              (o[0] === c.color) +
              '" style="background:linear-gradient(150deg,' +
              o[4] +
              "," +
              o[2] +
              " 45%," +
              o[3] +
              ')"></button>'
            );
          })
          .join("") +
        "</div>" +
        row("bg", A.bgs, "Background");
      kzi.querySelectorAll("button").forEach(function (b) {
        b.onclick = function (e) {
          e.stopPropagation();
          var o = {};
          o[b.dataset.k] = b.dataset.v;
          A.set(o);
          window.__snd && window.__snd("tap");
          kz();
        };
      });
    }
    setTimeout(kz, 800);
    setInterval(kz, 700);
    D.addEventListener("kz-match", kz);
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Hairline and soft blur under whichever top bar is stuck, and", err);
}

/* ==========================================================================
   Sounds set to 'wood', retired nav styles fall back to Dot, More page footer rows, one 'Others' settings group.
   ========================================================================== */
try {
  (function () {
    var D = document;
    var CH = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>',
      COL = ["#ffd6a5", "#caffbf", "#bdb2ff", "#ffc6ff", "#9bf6ff", "#fdffb6", "#ffadad", "#a0e7e5"];
    function hc(t) {
      var h = 0;
      for (var i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) >>> 0;
      return COL[h % COL.length];
    }
    function fix() {
      /* sound: wood only */
      try {
        localStorage.getItem("vizag-sndst") !== "wood" && localStorage.setItem("vizag-sndst", "wood");
      } catch (e) {}
      /* nav: retired styles fall back to dot */
      var R = D.documentElement,
        n = R.getAttribute("data-navind");
      if (n && !/^(rot3d|dot|glow)$/.test(n)) {
        R.setAttribute("data-navind", "dot");
        try {
          localStorage.setItem("vizag-navind", "dot");
        } catch (e) {}
      }
      /* profile footer rows */
      var lb = D.getElementById("acx-lb"),
        pf = D.getElementById("acx-pf");
      if (lb && !lb.querySelector(".xr")) {
        var r = D.createElement("span");
        r.className = "xr";
        r.innerHTML =
          '<span class="xav kxav" aria-hidden="true">' +
          ["kav3", "kav1", "kav6"]
            .map(function (x) {
              return "<i>" + (window.__kavf ? window.__kavf(x) : "") + "</i>";
            })
            .join("") +
          "</span>" +
          CH;
        lb.appendChild(r);
      }
      if (pf && !pf.querySelector(".xr")) {
        var r2 = D.createElement("span");
        r2.className = "xr";
        r2.innerHTML = CH;
        pf.appendChild(r2);
      }
      /* settings: one Others group */
      var sp = D.getElementById("settings-profile");
      if (sp) {
        var rows = [].slice.call(sp.querySelectorAll(".setrow")),
          nt = null,
          clk = null;
        rows.forEach(function (r) {
          var l = r.querySelector(".setl"),
            t = l ? l.textContent.trim() : "";
          /^Notifications/.test(t) && (nt = r);
          /^24-hour time/.test(t) && (clk = r);
        });
        if (nt) {
          var g = nt.parentNode;
          if (clk && clk.parentNode !== g) {
            nt.after(clk);
          }
          var sm = D.getElementById("secmode-row");
          sm && sm.parentNode !== g && clk && clk.after(sm);
          var c = g.previousElementSibling;
          c && c.classList.contains("setcap") && c.textContent !== "Others" && (c.textContent = "Others");
        }
      }
      /* theme sheet: match toggle becomes the App icon header */
      var kn = D.querySelector("#theme-sheet .kz-now"),
        pm = D.querySelector("#theme-sheet .pl-match");
      if (kn && pm) {
        var pv = D.getElementById("kz-pv");
        pm.parentNode !== kn && pv && pv.after(pm);
        var on = pm.getAttribute("aria-checked") === "true",
          b = pm.querySelector("b"),
          sm2 = pm.querySelector("small");
        b && b.textContent !== "App icon" && (b.textContent = "App icon");
        var st = on ? "Matches your theme" : "Your colour and background";
        sm2 && sm2.textContent !== st && (sm2.textContent = st);
        D.querySelectorAll("#theme-sheet .pl-match").length > 1 &&
          [].slice.call(D.querySelectorAll("#theme-sheet .pl-match")).forEach(function (x) {
            x.parentNode !== kn && x.remove();
          });
      }
    }
    fix();
    setInterval(fix, 600);
    D.addEventListener(
      "click",
      function () {
        setTimeout(fix, 60);
      },
      !0,
    );
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Sounds set to 'wood', retired nav styles fall back to Dot, M", err);
}

/* ==========================================================================
   Page slide animations: slide in when opening a sub-page, slide back on the back button.
   ========================================================================== */
try {
  (function () {
    var D = document,
      cur = null;
    var tabT = 0,
      backT = 0;
    D.addEventListener(
      "click",
      function (e) {
        var t = e.target.closest && e.target;
        if (!t) return;
        t.closest(".nav") && (tabT = Date.now());
        t.closest(".hback") && (backT = Date.now());
      },
      !0,
    );
    function vis() {
      var v = null;
      D.querySelectorAll("main .view").forEach(function (x) {
        !x.hidden && x.offsetParent !== null && (v = x);
      });
      return v;
    }
    function back(v) {
      return !!(v && v.querySelector(":scope .pghead .hback"));
    }
    function run() {
      var v = vis();
      if (!v || v === cur) return;
      var prev = cur;
      cur = v;
      if (!prev) return;
      if (Date.now() - tabT < 700) return;
      var c =
        back(v) && !back(prev) ? "vpush" : back(prev) && !back(v) && Date.now() - backT < 700 ? "vpop" : "";
      if (!c) return;
      v.classList.remove("vpush", "vpop");
      void v.offsetWidth;
      v.classList.add(c);
      setTimeout(function () {
        v.classList.remove(c);
      }, 520);
    }
    var q = 0;
    new MutationObserver(function () {
      q ||
        (q = requestAnimationFrame(function () {
          q = 0;
          run();
        }));
    }).observe(D.querySelector("main") || D.body, {
      attributes: !0,
      subtree: !0,
      attributeFilter: ["hidden", "class"],
    });
    setTimeout(run, 300);
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Page slide animations: slide in when opening a sub-page, sli", err);
}

/* ==========================================================================
   Pull-to-refresh: gradient for the spinner.
   ========================================================================== */
try {
  (function () {
    var D = document;
    function hook() {
      var t = D.querySelector(".ptr");
      if (!t) {
        setTimeout(hook, 500);
        return;
      }
      var sv = t.querySelector("svg");
      if (sv && !sv.querySelector("#ptrgr"))
        sv.insertAdjacentHTML(
          "afterbegin",
          '<defs><linearGradient id="ptrgr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--kg1)"/><stop offset=".55" style="stop-color:var(--kg2)"/><stop offset="1" style="stop-color:var(--kg3)"/></linearGradient></defs>',
        );
      new MutationObserver(function () {
        if (!t.classList.contains("fire") || t.__f) return;
        t.__f = 1;
        setTimeout(function () {
          t.__f = 0;
        }, 900);
        var r = t.getBoundingClientRect(),
          x = r.left + r.width / 2,
          y = r.top + r.height / 2,
          fx = D.createElement("div");
        fx.className = "ptrfx";
        fx.setAttribute("aria-hidden", "true");
        fx.innerHTML = "";
        [].forEach.call(fx.querySelectorAll(".bl,.rp"), function (i) {
          i.style.left = x + "px";
          i.style.top = y + "px";
        });
        D.body.appendChild(fx);
        setTimeout(function () {
          fx.remove();
        }, 1000);
      }).observe(t, { attributes: !0, attributeFilter: ["class"] });
    }
    hook();
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Pull-to-refresh: gradient for the spinner.", err);
}

/* ==========================================================================
   Pull-to-refresh: the spinning Kosway globe.
   ========================================================================== */
try {
  (function () {
    var D = document;
    function go() {
      var t = D.querySelector(".ptr");
      if (!t) {
        setTimeout(go, 500);
        return;
      }
      if (t.querySelector(".kgl")) return;
      t.insertAdjacentHTML(
        "beforeend",
        '<svg class="kgl" viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="kglg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--kg1)"/><stop offset=".55" style="stop-color:var(--kg2)"/><stop offset="1" style="stop-color:var(--kg3)"/></linearGradient><clipPath id="kglc"><circle cx="50" cy="50" r="34"/></clipPath></defs><circle class="kgr" cx="50" cy="50" r="44"/><path class="kgp" pathLength="1" d="M50 6a44 44 0 1 1 0 88a44 44 0 1 1 0-88"/><g clip-path="url(#kglc)"><g class="kgb"></g></g></svg>',
      );
      var g = t.querySelector(".kgb"),
        pr = t.querySelector(".kgp"),
        ph = 0,
        last = 0,
        raf = 0;
      function draw() {
        var h = "",
          R = 34,
          st = window.__globeStyle && window.__globeStyle();
        if (st && st !== "blades") {
          g.parentNode.removeAttribute("clip-path");
          g.innerHTML = window.__globe(ph, R, "var(--ink)");
          return;
        }
        g.parentNode.setAttribute("clip-path", "url(#kglc)");
        for (var k = 0; k < 18; k++) {
          var th = ((ph + k * 20) * Math.PI) / 180,
            c = Math.cos(th);
          if (c < 0.04) continue;
          var x = 50 + R * Math.sin(th),
            hh = Math.sqrt(Math.max(0, R * R - (x - 50) * (x - 50))),
            w = 4.2 * c;
          h +=
            '<path d="M' +
            x.toFixed(2) +
            " " +
            (50 - hh).toFixed(2) +
            "Q" +
            (x + w).toFixed(2) +
            " 50 " +
            x.toFixed(2) +
            " " +
            (50 + hh).toFixed(2) +
            "Q" +
            (x - w).toFixed(2) +
            " 50 " +
            x.toFixed(2) +
            " " +
            (50 - hh).toFixed(2) +
            'Z" fill="var(--ink)" opacity="' +
            (0.35 + 0.65 * c).toFixed(2) +
            '"/>';
        }
        g.innerHTML = h;
      }
      function tick(ts) {
        raf = 0;
        if (!t.classList.contains("on") && !t.classList.contains("fire")) {
          last = 0;
          return;
        }
        var dt = last ? Math.min(64, ts - last) : 16;
        last = ts;
        var p = parseFloat(getComputedStyle(t).getPropertyValue("--p")) || 0;
        if (t.classList.contains("fire")) ph += dt * 0.9;
        else if (t.classList.contains("go")) ph += dt * 0.22;
        else ph = p * 120;
        pr.style.strokeDasharray = "1";
        pr.style.strokeDashoffset = String(
          t.classList.contains("go") || t.classList.contains("fire") ? 0 : 1 - p,
        );
        draw();
        raf = requestAnimationFrame(tick);
      }
      new MutationObserver(function () {
        raf || (raf = requestAnimationFrame(tick));
      }).observe(t, { attributes: !0, attributeFilter: ["class", "style"] });
      draw();
    }
    go();
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Pull-to-refresh: the spinning Kosway globe.", err);
}

/* ==========================================================================
   Signature at the bottom of More: loads the handwriting font and writes 'Krishna AR'.
   ========================================================================== */
try {
  (function () {
    var D = document;
    var gf = D.createElement("link");
    gf.rel = "stylesheet";
    gf.href =
      "https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&display=swap&text=" +
      encodeURIComponent("Krishna AR");
    D.head.appendChild(gf);
    var vd = window.__vpD,
      vs = window.__vpS;
    if (vd && !vd.Both) {
      vd.Both =
        '<i class="vb s4 spn"><i class="vrow"><i class="vl w2 sm"></i><i class="vl w2 sm"></i></i><i class="vrow mid"><i class="vv"></i><i class="vgrad"></i><i class="vv"></i></i><i class="vsep"></i><i class="vl w3 sm"></i><i class="vl w6"></i></i>';
      vs && (vs.Both = "The day bar with what it costs");
    }
    var ob = null;
    function sig() {
      var b = D.querySelector(".setbeach");
      if (!b) return;
      var sv = b.querySelector(":scope>svg");
      if (sv) {
        var k = [].slice.call(sv.children);
        if (k.length === 21)
          k.forEach(function (c, i) {
            if (((i >= 1 && i <= 12) || i === 19 || i === 20) && c.style.display !== "none") {
              c.classList.add("bzoff");
              c.style.setProperty("display", "none", "important");
            }
          });
      }
      if (b.__sig) return;
      b.__sig = 1;
      var g = D.createElement("div");
      g.className = "sig";
      g.setAttribute("aria-label", "Made by Krishna AR");
      g.innerHTML =
        '<small>made by</small><svg viewBox="0 0 170 46" aria-hidden="true"><text x="85" y="36" text-anchor="middle">Krishna AR</text></svg>';
      b.appendChild(g);
      ob = new IntersectionObserver(
        function (es) {
          es.forEach(function (e) {
            if (e.isIntersecting) {
              g.classList.remove("go");
              void g.offsetWidth;
              g.classList.add("go");
            } else g.classList.remove("go");
          });
        },
        { threshold: 0.6 },
      );
      ob.observe(g);
    }
    function fit() {
      D.querySelectorAll(".acx").forEach(function (ax) {
        var h = ax.parentElement;
        if (!h || !ax.offsetParent) return;
        var hr = h.getBoundingClientRect(),
          hc = getComputedStyle(h),
          ar = ax.getBoundingClientRect(),
          cs = getComputedStyle(ax),
          bl = parseFloat(hc.borderLeftWidth) || 0,
          br = parseFloat(hc.borderRightWidth) || 0,
          bb = parseFloat(hc.borderBottomWidth) || 0;
        var dl = ar.left - (hr.left + bl),
          dr = hr.right - br - ar.right,
          db = hr.bottom - bb - ar.bottom;
        Math.abs(dl) > 0.5 &&
          ax.style.setProperty("margin-left", parseFloat(cs.marginLeft) - dl + "px", "important");
        Math.abs(dr) > 0.5 &&
          ax.style.setProperty("margin-right", parseFloat(cs.marginRight) - dr + "px", "important");
        Math.abs(db) > 0.5 &&
          ax.style.setProperty("margin-bottom", parseFloat(cs.marginBottom) - db + "px", "important");
      });
    }
    function lab() {
      D.querySelectorAll("#theme-sheet .pl-s, #theme-sheet .kzr button").forEach(function (b) {
        if (b.querySelector(".pln")) return;
        var t = (b.getAttribute("aria-label") || "").replace("Match colour", "Match");
        var e = D.createElement("em");
        e.className = "pln";
        e.textContent = t;
        b.appendChild(e);
      });
    }
    function tg() {
      var pm = D.querySelector("#theme-sheet .pl-match");
      if (!pm) return;
      var on = String(localStorage.getItem("vizag-icon-match") === "1");
      pm.getAttribute("aria-checked") !== on && pm.setAttribute("aria-checked", on);
      var sm = pm.querySelector("small"),
        st = on === "true" ? "Matches your theme" : "Your colour and background";
      sm && sm.textContent !== st && (sm.textContent = st);
    }
    function all() {
      try {
        sig();
        lab();
        tg();
      } catch (e) {}
    }
    all();
    setInterval(all, 500);
    D.addEventListener(
      "click",
      function () {
        setTimeout(all, 30);
        setTimeout(all, 200);
      },
      !0,
    );
    addEventListener("resize", all);
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Signature at the bottom of More: loads the handwriting font ", err);
}

/* ==========================================================================
   Pull-to-refresh: 'Refreshing...' roll under the Home title.
   ========================================================================== */
try {
  (function () {
    var D = document;
    function blades(ph, R) {
      var h = "";
      for (var k = 0; k < 18; k++) {
        var th = ((ph + k * 20) * Math.PI) / 180,
          c = Math.cos(th);
        if (c < 0.04) continue;
        var x = 50 + R * Math.sin(th),
          hh = Math.sqrt(Math.max(0, R * R - (x - 50) * (x - 50))),
          w = 4.6 * c;
        h +=
          '<path d="M' +
          x.toFixed(1) +
          " " +
          (50 - hh).toFixed(1) +
          "Q" +
          (x + w).toFixed(1) +
          " 50 " +
          x.toFixed(1) +
          " " +
          (50 + hh).toFixed(1) +
          "Q" +
          (x - w).toFixed(1) +
          " 50 " +
          x.toFixed(1) +
          " " +
          (50 - hh).toFixed(1) +
          'Z" opacity="' +
          (0.35 + 0.65 * c).toFixed(2) +
          '"/>';
      }
      return h;
    }
    function roll() {
      if ((D.documentElement.dataset.view || "home") !== "home") return;
      var tg = D.querySelector("#v-home .offtag"),
        tx = tg && tg.querySelector(".otx");
      if (!tg || !tx || tg.classList.contains("rfx")) return;
      tx.textContent = "Refreshing…";
      tg.classList.remove("reveal", "fade");
      tg.hidden = !1;
      tg.classList.add("rfx");
      var w = tx.getBoundingClientRect().width || 80;
      var sv = D.createElementNS("http://www.w3.org/2000/svg", "svg");
      sv.setAttribute("viewBox", "0 0 100 100");
      sv.setAttribute("class", "kgs");
      sv.setAttribute("aria-hidden", "true");
      sv.style.setProperty("--kx", Math.round(w + 4) + "px");
      sv.style.fill = "var(--ink)";
      tg.appendChild(sv);
      var tr = tx.getBoundingClientRect(),
        gr = tg.getBoundingClientRect();
      sv.style.top = tr.top - gr.top + tr.height / 2 + "px";
      var t0 = 0;
      function f(ts) {
        t0 || (t0 = ts);
        var e = ts - t0;
        sv.innerHTML =
          window.__globeStyle && window.__globeStyle() !== "blades"
            ? window.__globe(e * 0.7, 40, "currentColor")
            : blades(e * 0.7, 40);
        e < 1000 ? requestAnimationFrame(f) : sv.remove();
      }
      requestAnimationFrame(f);
    }
    function hook() {
      var t = D.querySelector(".ptr");
      if (!t) {
        setTimeout(hook, 500);
        return;
      }
      new MutationObserver(function () {
        t.classList.contains("fire") && roll();
      }).observe(t, { attributes: !0, attributeFilter: ["class"] });
    }
    hook();
    window.__titleRoll = roll;
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Pull-to-refresh: 'Refreshing...' roll under the Home title.", err);
}

/* ==========================================================================
   Signature font options.
   ========================================================================== */
try {
  (function () {
    var D = document;
    var F = [
      ["A", "Caveat", "Caveat:wght@400;600", 600, 40, "", 700],
      ["L", "Nanum Pen Script", "Nanum+Pen+Script", 400, 46, "", 800],
    ];
    var N = "Krishna AR";
    var gf = D.createElement("link");
    gf.rel = "stylesheet";
    gf.href =
      "https://fonts.googleapis.com/css2?" +
      F.map(function (f) {
        return "family=" + f[2];
      }).join("&") +
      "&display=swap&text=" +
      encodeURIComponent(N + N.toLowerCase());
    D.head.appendChild(gf);
    var H = F.map(function (f) {
      return (
        '<div class="sgo' +
        (f[5] ? " " + f[5] + " wide" : "") +
        '" role="button" tabindex="0" aria-label="Signature ' +
        f[0] +
        '" style="--fs:' +
        f[4] +
        "px;--da:" +
        f[6] +
        '"><b>' +
        f[0] +
        "</b>" +
        (f[7] ? "<em>" + f[7] + "</em>" : "") +
        '<small>made by</small><svg viewBox="0 0 200 56"><text x="100" y="42" text-anchor="middle" style="font-family:\'' +
        f[1] +
        "',cursive;font-weight:" +
        f[3] +
        '">' +
        (f[0] === "A" ? N : N.toLowerCase()) +
        '</text></svg><i class="sgf">' +
        f[1] +
        "</i></div>"
      );
    }).join("");
    function play(t) {
      t.classList.remove("go");
      void t.offsetWidth;
      t.classList.add("go");
    }
    function mount() {
      var sp = D.getElementById("settings-profile");
      if (!sp || sp.querySelector(".sigpick")) return;
      var w = D.createElement("div");
      w.className = "sigpick";
      w.innerHTML = H;
      sp.appendChild(w);
      var io = new IntersectionObserver(
        function (es) {
          es.forEach(function (e) {
            e.isIntersecting && !e.target.dataset.seen && ((e.target.dataset.seen = 1), play(e.target));
          });
        },
        { threshold: 0.7 },
      );
      w.querySelectorAll(".sgo").forEach(function (o) {
        io.observe(o);
        o.addEventListener("click", function () {
          play(o);
        });
        o.addEventListener("keydown", function (e) {
          (e.key === "Enter" || e.key === " ") && (e.preventDefault(), play(o));
        });
      });
    }
    mount();
    setInterval(mount, 1500);
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Signature font options.", err);
}

/* ==========================================================================
   Home title: tap opens the online sheet, double-tap refreshes (beta only).
   ========================================================================== */
try {
  (function () {
    var beta = /\/beta\//.test(location.pathname) || /^(localhost|127\.0\.0\.1)$/.test(location.hostname),
      own = 0,
      t = null,
      last = 0;
    function go() {
      var T = document.querySelector("#v-home .htitle");
      if (!T) {
        setTimeout(go, 400);
        return;
      }
      function sheet() {
        var o = T.querySelector(".offtag");
        if (!o || o.hidden) return;
        own = 1;
        o.dispatchEvent(new MouseEvent("click", { bubbles: !0, cancelable: !0 }));
        own = 0;
      }
      function refresh() {
        var h = T.querySelector("h1");
        if (!h) return;
        own = 1;
        h.dispatchEvent(new MouseEvent("dblclick", { bubbles: !0, cancelable: !0 }));
        own = 0;
      }
      ["dblclick", "touchend"].forEach(function (n) {
        T.addEventListener(
          n,
          function (e) {
            if (!own) e.stopPropagation();
          },
          !0,
        );
      });
      T.addEventListener(
        "click",
        function (e) {
          if (own) return;
          e.stopPropagation();
          e.preventDefault();
          if (!beta) {
            sheet();
            return;
          }
          var now = Date.now();
          if (t && now - last < 320) {
            clearTimeout(t);
            t = null;
            last = 0;
            refresh();
            return;
          }
          last = now;
          t = setTimeout(function () {
            t = null;
            sheet();
          }, 300);
        },
        !0,
      );
    }
    go();
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Home title: tap opens the online sheet, double-tap refreshes", err);
}

/* ==========================================================================
   Profile level progress bar, onboarding art carousel on the sign-in screen, double-tap the sign-in title to hard refresh (beta).
   ========================================================================== */
try {
  (function () {
    var D = document;
    /* profile level progress bar */
    function bar() {
      var pb = D.getElementById("prof-body");
      if (!pb) return;
      var lv = pb.querySelector(".plevel");
      if (!lv || lv.querySelector(".plbar")) return;
      var b = lv.querySelector(".ppts b"),
        s = lv.querySelector(".ppts small");
      var pts = parseInt(((b && b.textContent) || "0").replace(/\D/g, ""), 10) || 0,
        m = ((s && s.textContent) || "").match(/(\d[\d,]*)\s+to\s/),
        nx = m ? parseInt(m[1].replace(/,/g, ""), 10) : 0;
      var w = nx ? Math.max(3, Math.min(100, (pts / (pts + nx)) * 100)) : 100;
      var e = D.createElement("i");
      e.className = "plbar";
      e.innerHTML = '<i style="width:0"></i>';
      lv.appendChild(e);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          e.firstChild.style.width = w.toFixed(1) + "%";
        });
      });
    }
    function pwatch() {
      var pb = D.getElementById("prof-body");
      if (!pb) {
        setTimeout(pwatch, 600);
        return;
      }
      new MutationObserver(bar).observe(pb, { childList: !0 });
      bar();
    }
    pwatch();
    /* login: onboarding art carousel */
    function lob() {
      var la = D.querySelector(".lart"),
        lc = D.querySelector(".lcopy");
      if (!la || !lc || la.querySelector(".lob")) return;
      var A = window.__obArt,
        W = window.__obCopy;
      if (!A || !W) return;
      var src = W.map(function (_, i) {
        var o = D.querySelectorAll("#onb .onbart")[i];
        return (o ? o.innerHTML : A[i]).replace(/id="o/g, 'id="lo').replace(/url\(#o/g, "url(#lo");
      });
      var b = D.createElement("div");
      b.className = "lob";
      b.innerHTML = src
        .map(function (x, i) {
          return '<div class="lobs' + (i ? "" : " on") + '">' + x + "</div>";
        })
        .join("");
      la.appendChild(b);
      var c = D.createElement("div");
      c.className = "lobc";
      c.innerHTML =
        '<div class="lobw">' +
        W.map(function (t, i) {
          return '<div class="lobs' + (i ? "" : " on") + '"><h2>' + t[0] + "</h2><p>" + t[1] + "</p></div>";
        }).join("") +
        '</div><div class="lobd">' +
        W.map(function (_, i) {
          return "<i" + (i ? "" : ' class="on"') + "></i>";
        }).join("") +
        "</div>";
      lc.appendChild(c);
      var S1 = b.querySelectorAll(".lobs"),
        S2 = c.querySelectorAll(".lobs"),
        Dt = c.querySelectorAll(".lobd i"),
        k = 0;
      function sw(L, a, n) {
        L[a].classList.remove("on");
        L[a].classList.add("out");
        var o = L[a];
        setTimeout(function () {
          o.classList.remove("out");
        }, 560);
        L[n].classList.add("on");
      }
      function go(n) {
        n = (n + S1.length) % S1.length;
        if (n === k) return;
        sw(S1, k, n);
        sw(S2, k, n);
        k = n;
        Dt.forEach(function (d, i) {
          d.classList.toggle("on", i === k);
        });
      }
      var lp = la.closest(".lpage") || D.body;
      var lt0 = Date.now(),
        hold = 0;
      function hd(e) {
        hold = 1;
      }
      function hu() {
        hold = 0;
        lt0 = Date.now();
      }
      [la, c].forEach(function (z) {
        z.addEventListener("pointerdown", hd, !0);
        z.addEventListener("pointerup", hu, !0);
        z.addEventListener("pointercancel", hu, !0);
        z.addEventListener("contextmenu", function (e) {
          e.preventDefault();
        });
      });
      setInterval(function () {
        if (hold || lp.classList.contains("kb") || !la.offsetParent || Date.now() - lt0 < 3400) return;
        lt0 = Date.now();
        go(k + 1);
      }, 250);
      var x0 = null;
      la.addEventListener(
        "pointerdown",
        function (e) {
          x0 = e.clientX;
        },
        !0,
      );
      la.addEventListener(
        "pointerup",
        function (e) {
          if (x0 === null) return;
          var dx = e.clientX - x0;
          x0 = null;
          Math.abs(dx) > 30 && go(k + (dx < 0 ? 1 : -1));
        },
        !0,
      );
    }
    setTimeout(lob, 600);
    setInterval(lob, 2000);
    /* login: double tap title = hard refresh (beta) */
    var beta = /\/beta\//.test(location.pathname) || /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
    function hard() {
      var t = D.getElementById("login-title");
      t && (t.textContent = "Refreshing…");
      var N = [];
      try {
        navigator.serviceWorker &&
          N.push(
            navigator.serviceWorker.getRegistrations().then(function (h) {
              return Promise.all(
                h.map(function (j) {
                  return j.unregister();
                }),
              );
            }),
          );
        window.caches &&
          N.push(
            caches.keys().then(function (h) {
              return Promise.all(
                h.map(function (j) {
                  return caches.delete(j);
                }),
              );
            }),
          );
      } catch (e) {}
      Promise.all(N)
        .catch(function () {})
        .then(function () {
          setTimeout(function () {
            var h = location.href.split("#")[0].replace(/[?&]_r=\d+/, "");
            location.replace(h + (h.indexOf("?") < 0 ? "?" : "&") + "_r=" + Date.now());
          }, 600);
        });
    }
    function lt() {
      var t = D.getElementById("login-title");
      if (!t) {
        setTimeout(lt, 800);
        return;
      }
      if (!beta) return;
      t.style.userSelect = "none";
      t.style.webkitUserSelect = "none";
      t.style.touchAction = "manipulation";
      t.addEventListener("dblclick", hard);
      var c = 0;
      t.addEventListener("touchend", function (e) {
        var n = Date.now();
        if (n - c < 320) {
          e.preventDefault();
          hard();
        }
        c = n;
      });
    }
    lt();
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Profile level progress bar, onboarding art carousel on the s", err);
}

/* ==========================================================================
   Tapping your avatar or name on the account card opens your profile.
   ========================================================================== */
try {
  (function () {
    var D = document;
    D.addEventListener(
      "click",
      function (e) {
        var t = e.target;
        if (t && t.closest && t.closest("#acct-av, #acct-name")) {
          e.stopImmediatePropagation();
          e.preventDefault();
          var c = D.getElementById("prof-open");
          c && c.click();
        }
      },
      !0,
    );
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Tapping your avatar or name on the account card opens your p", err);
}

/* ==========================================================================
   Refresh animation picker (Blades, Halftone, Wireframe, Orbit) in Customisation.
   ========================================================================== */
try {
  (function () {
    var D = document,
      K = "vizag-globe",
      ST = ["blades", "dots", "wire", "orbit"],
      NM = { blades: "Blades", dots: "Halftone", wire: "Wireframe", orbit: "Orbit" };
    function get() {
      try {
        var v = localStorage.getItem(K);
        return ST.indexOf(v) < 0 ? "blades" : v;
      } catch (e) {
        return "blades";
      }
    }
    function bl(ph, R, f) {
      var h = "";
      for (var k = 0; k < 18; k++) {
        var th = ((ph + k * 20) * Math.PI) / 180,
          c = Math.cos(th);
        if (c < 0.04) continue;
        var x = 50 + R * Math.sin(th),
          hh = Math.sqrt(Math.max(0, R * R - (x - 50) * (x - 50))),
          w = R * 0.125 * c;
        h +=
          '<path d="M' +
          x.toFixed(2) +
          " " +
          (50 - hh).toFixed(2) +
          "Q" +
          (x + w).toFixed(2) +
          " 50 " +
          x.toFixed(2) +
          " " +
          (50 + hh).toFixed(2) +
          "Q" +
          (x - w).toFixed(2) +
          " 50 " +
          x.toFixed(2) +
          " " +
          (50 - hh).toFixed(2) +
          'Z" fill="' +
          f +
          '" opacity="' +
          (0.35 + 0.65 * c).toFixed(2) +
          '"/>';
      }
      return h;
    }
    function dots(ph, R, f) {
      var h = "",
        r = Math.PI / 180;
      for (var la = -72; la <= 72; la += 18) {
        var cl = Math.cos(la * r),
          n = Math.max(4, Math.round(18 * cl));
        for (var i = 0; i < n; i++) {
          var lo = (ph + (i * 360) / n) * r,
            z = Math.cos(lo) * cl;
          if (z < 0.02) continue;
          var x = 50 + R * cl * Math.sin(lo),
            y = 50 - R * Math.sin(la * r);
          h +=
            '<circle cx="' +
            x.toFixed(2) +
            '" cy="' +
            y.toFixed(2) +
            '" r="' +
            (R * 0.035 + R * 0.075 * z).toFixed(2) +
            '" fill="' +
            f +
            '" opacity="' +
            (0.3 + 0.7 * z).toFixed(2) +
            '"/>';
        }
      }
      return h;
    }
    function wire(ph, R, f) {
      var h =
          '<circle cx="50" cy="50" r="' +
          (R - 1).toFixed(1) +
          '" fill="none" stroke="' +
          f +
          '" stroke-width="' +
          (R * 0.07).toFixed(2) +
          '"/>',
        r = Math.PI / 180;
      for (var k = 0; k < 6; k++) {
        var a = ((ph + k * 30) % 180) * r,
          rx = Math.abs(R * Math.cos(a));
        h +=
          '<ellipse cx="50" cy="50" rx="' +
          Math.max(0.3, rx - 1).toFixed(2) +
          '" ry="' +
          (R - 1).toFixed(1) +
          '" fill="none" stroke="' +
          f +
          '" stroke-width="' +
          (R * 0.055).toFixed(2) +
          '" opacity="' +
          (0.3 + 0.7 * Math.abs(Math.sin(a))).toFixed(2) +
          '"/>';
      }
      [-0.5, 0, 0.5].forEach(function (t) {
        var y = 50 - R * t,
          w = R * Math.sqrt(1 - t * t);
        h +=
          '<ellipse cx="50" cy="' +
          y.toFixed(2) +
          '" rx="' +
          (w - 1).toFixed(2) +
          '" ry="' +
          (w * 0.16).toFixed(2) +
          '" fill="none" stroke="' +
          f +
          '" stroke-width="' +
          (R * 0.05).toFixed(2) +
          '" opacity=".55"/>';
      });
      return h;
    }
    function orbit(ph, R, f) {
      var r = Math.PI / 180,
        ex = R * 0.98,
        ey = R * 0.28,
        rot = -20,
        c = Math.cos(rot * r),
        sn = Math.sin(rot * r);
      function pt(a) {
        var x = ex * Math.cos(a),
          y = ey * Math.sin(a);
        return [50 + x * c - y * sn, 50 + x * sn + y * c];
      }
      function arc(a0, a1) {
        var h = "",
          n = 24;
        for (var i = 0; i <= n; i++) {
          var p = pt(a0 + ((a1 - a0) * i) / n);
          h += (i ? "L" : "M") + p[0].toFixed(2) + " " + p[1].toFixed(2);
        }
        return h;
      }
      var sw = (R * 0.055).toFixed(2),
        back =
          '<path d="' +
          arc(Math.PI, 2 * Math.PI) +
          '" fill="none" stroke="' +
          f +
          '" stroke-width="' +
          sw +
          '" stroke-dasharray="' +
          (R * 0.12).toFixed(1) +
          " " +
          (R * 0.1).toFixed(1) +
          '" opacity=".45"/>',
        front =
          '<path d="' +
          arc(0, Math.PI) +
          '" fill="none" stroke="' +
          f +
          '" stroke-width="' +
          sw +
          '" stroke-linecap="round"/>',
        gl = bl(ph * 0.5, R * 0.72, f),
        a = ph * 1.6 * r,
        p = pt(a),
        inFront = Math.sin(a) > 0,
        dot =
          '<circle cx="' +
          p[0].toFixed(2) +
          '" cy="' +
          p[1].toFixed(2) +
          '" r="' +
          (R * 0.1).toFixed(2) +
          '" fill="' +
          f +
          '"/>';
      return back + (inFront ? "" : dot) + gl + front + (inFront ? dot : "");
    }
    var FN = { blades: bl, dots: dots, wire: wire, orbit: orbit };
    window.__globeStyle = get;
    window.__globe = function (ph, R, f, st) {
      return FN[st || get()](ph, R, f || "currentColor");
    };
    function mount() {
      var sp = D.getElementById("settings-profile");
      if (!sp || sp.querySelector(".gpick")) return;
      var cap = [].find.call(sp.querySelectorAll(".setcap"), function (c) {
        return /custom/i.test(c.textContent);
      });
      var g = cap && cap.nextElementSibling;
      if (!g || !g.classList.contains("setgrp")) return;
      var w = D.createElement("div");
      w.className = "gpick";
      w.innerHTML =
        '<div class="gph"><span class="setl">Refresh animation<small>The globe you see when you pull to refresh</small></span></div><div class="gpr" role="group" aria-label="Refresh animation">' +
        ST.map(function (s) {
          return (
            '<button type="button" data-g="' +
            s +
            '" aria-pressed="' +
            (get() === s) +
            '"><svg viewBox="0 0 100 100" aria-hidden="true"></svg>' +
            NM[s] +
            "</button>"
          );
        }).join("") +
        "</div>";
      g.appendChild(w);
      var bs = w.querySelectorAll("button");
      function draw(b, ph) {
        b.firstChild.innerHTML = window.__globe(ph, 38, "var(--ink)", b.dataset.g);
      }
      bs.forEach(function (b) {
        draw(b, 30);
        b.addEventListener("click", function () {
          try {
            localStorage.setItem(K, b.dataset.g);
          } catch (e) {}
          bs.forEach(function (x) {
            x.setAttribute("aria-pressed", String(x === b));
          });
          var t0 = 0;
          function f(ts) {
            t0 || (t0 = ts);
            var e = ts - t0;
            draw(b, 30 + e * 0.25);
            e < 1200 && requestAnimationFrame(f);
          }
          requestAnimationFrame(f);
        });
      });
    }
    mount();
    setInterval(mount, 1500);
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Refresh animation picker (Blades, Halftone, Wireframe, Orbit", err);
}

/* ==========================================================================
   Theme sheet section labels.
   ========================================================================== */
try {
  (function () {
    var D = document;
    function fix() {
      var t = D.getElementById("theme-sheet");
      if (!t || t.dataset.lbl) return;
      var c = t.querySelectorAll(".thcap>span");
      if (c.length < 2) return;
      t.dataset.lbl = 1;
      c[0].textContent = "App theme";
      c[1].textContent = "Home screen icon";
      var h = D.createElement("p");
      h.className = "thhint";
      h.textContent =
        "Colours and backgrounds here change only the app icon on your home screen, not the app theme.";
      c[1].parentNode.after(h);
      var wb = t.querySelector("[data-k=bg][data-v=white]");
      if (wb) {
        var em = wb.querySelector(".pln");
        em && (em.textContent = "Plain");
        wb.setAttribute("aria-label", "Plain");
        wb.title = "Plain";
      }
      t.querySelectorAll(".kzc>span").forEach(function (s) {
        s.textContent = /back/i.test(s.textContent)
          ? "Icon background"
          : /col/i.test(s.textContent)
            ? "Icon colour"
            : s.textContent;
      });
    }
    fix();
    setInterval(fix, 1500);
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Theme sheet section labels.", err);
}

/* ==========================================================================
   Moves notifications from the old Updates page into Plan.
   ========================================================================== */
try {
  (function () {
    var D = document;
    function move() {
      var va = D.getElementById("v-alerts"),
        vp = D.getElementById("v-plan");
      if (!va || !vp) return setTimeout(move, 500);
      if (vp.querySelector(".subp.alw")) return;
      var avz = va.querySelector(":scope>.vz"),
        ct = D.getElementById("ct-alerts"),
        seg = vp.querySelector(".seg-days"),
        pvz = vp.querySelector(":scope>.vz") || vp.querySelector(".vz");
      if (!avz || !seg || !pvz) return setTimeout(move, 500);
      var w = D.createElement("div");
      w.className = "subp alw";
      w.dataset.sub = "alerts";
      w.hidden = !0;
      w.appendChild(avz);
      ct && w.appendChild(ct);
      var last = [].slice.call(pvz.querySelectorAll(":scope>.subp")).pop();
      last ? last.after(w) : pvz.appendChild(w);
      var c = seg.querySelector(".schip").cloneNode(!0);
      c.dataset.sub = "alerts";
      c.setAttribute("aria-pressed", "false");
      c.innerHTML = '<span>Alerts</span><i class="utc" id="pl-alc"></i>';
      seg.appendChild(c);
      seg.classList.remove("seg-3");
      seg.classList.add("seg-4");
      function sel() {
        [].forEach.call(vp.querySelectorAll(".subp"), function (s) {
          if (s === w || w.contains(s)) return;
          if (!s.closest(".alw")) s.hidden = !0;
        });
        w.hidden = !1;
        var inner = avz.querySelector(".subp");
        inner && (inner.hidden = !1);
        seg.querySelectorAll(".schip").forEach(function (b) {
          b.setAttribute("aria-pressed", String(b === c));
        });
        try {
          localStorage.setItem("vizag-sub-plan", "alerts");
        } catch (e) {}
        window.scrollTo(0, 0);
      }
      c.addEventListener("click", sel);
      seg.querySelectorAll(".schip").forEach(function (b) {
        b !== c &&
          b.addEventListener("click", function () {
            w.hidden = !0;
          });
      });
      var ua = D.getElementById("ut-a");
      function cnt() {
        var t = ua ? ua.textContent.trim() : "";
        D.getElementById("pl-alc").textContent = t;
        D.getElementById("pl-alc").hidden = !t;
      }
      cnt();
      ua && new MutationObserver(cnt).observe(ua, { childList: !0, characterData: !0, subtree: !0 });
      try {
        localStorage.getItem("vizag-sub-plan") === "alerts" && sel();
      } catch (e) {}
      window.__openAlerts = function () {
        var nb = D.querySelectorAll(".nav button")[2];
        nb && nb.click();
        setTimeout(sel, 60);
      };
      /* updates page -> notifications only */
      var h = va.querySelector(".pghead h2");
      h && (h.textContent = "Notifications");
      function nt() {
        if (va.hidden) return;
        var n = va.querySelector('[data-ut="n"]');
        n && n.getAttribute("aria-selected") !== "true" && n.click();
        var nb = va.querySelector(".nbar");
        if (nb && !nb.querySelector(".ncount")) {
          var s = D.createElement("span");
          s.className = "ncount";
          nb.insertBefore(s, nb.firstChild);
        }
        var u = va.querySelector(".nstats .mv");
        s = va.querySelector(".ncount");
        s && (s.textContent = (u ? u.textContent : "0") + " unread");
      }
      new MutationObserver(nt).observe(va, { attributes: !0, attributeFilter: ["hidden"] });
      nt();
      setInterval(function () {
        va.hidden || nt();
      }, 1500);
    }
    move();
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Moves notifications from the old Updates page into Plan.", err);
}

/* ==========================================================================
   More tab setup, swipe on text in sign-in and onboarding, pull-to-refresh drags the page, notifications grouped by day.
   ========================================================================== */
try {
  (function () {
    var D = document;
    /* More tab */
    function more() {
      var nb = D.querySelector('.nav button[data-v="profile"]');
      if (!nb) return setTimeout(more, 500);
      if (nb.dataset.more) return;
      nb.dataset.more = 1;
      var u = nb.querySelector("use");
      u &&
        (u.setAttribute("href", "#i-hugeicons-" + (window.__moreIc || "more-a")),
        u.setAttribute("data-p", window.__moreIc || "more-a"));
      [].forEach.call(nb.childNodes, function (n) {
        n.nodeType === 3 && n.textContent.trim() && (n.textContent = "More");
      });
      nb.setAttribute("aria-label", "More");
      var h = D.querySelector("#v-profile .pghead h2");
      h && (h.textContent = "More");
    }
    more();
    function cap() {
      var sp = D.getElementById("settings-profile");
      if (!sp) return;
      if (sp.querySelector(".procap")) return;
      var a = D.getElementById("acct"),
        e = D.getElementById("acct-empty"),
        f = a && a.parentNode === sp ? a : e;
      if (!f) return;
      var c = D.createElement("div");
      c.className = "setcap procap";
      c.textContent = "Profile";
      var first = a && e ? (a.compareDocumentPosition(e) & 4 ? a : e) : f;
      first.parentNode.insertBefore(c, first);
    }
    cap();
    setInterval(cap, 1500);
    /* login: swipe on text */
    function lsw() {
      var lc = D.querySelector(".lcopy .lobc"),
        la = D.querySelector(".lart");
      if (!lc || !la || lc.dataset.sw) return;
      lc.dataset.sw = 1;
      var x0 = null;
      lc.style.touchAction = "pan-y";
      lc.addEventListener("pointerdown", function (e) {
        x0 = e.clientX;
      });
      lc.addEventListener("pointerup", function (e) {
        if (x0 === null) return;
        var dx = e.clientX - x0;
        x0 = null;
        if (Math.abs(dx) > 30) {
          var o = new PointerEvent("pointerdown", { clientX: 200, bubbles: !0 });
          la.dispatchEvent(o);
          la.dispatchEvent(
            new PointerEvent("pointerup", { clientX: 200 + (dx < 0 ? -60 : 60), bubbles: !0 }),
          );
        }
      });
    }
    setInterval(lsw, 1500);
    /* onboarding: swipe on text too */
    function osw() {
      var o = D.getElementById("onb");
      if (!o || o.dataset.sw) return;
      o.dataset.sw = 1;
      var x0 = null,
        y0 = 0;
      o.addEventListener(
        "touchstart",
        function (e) {
          if (e.target.closest(".onbart,.onbtrack .onbart")) return;
          var t = e.touches[0];
          x0 = t.clientX;
          y0 = t.clientY;
        },
        { passive: !0 },
      );
      o.addEventListener(
        "touchend",
        function (e) {
          if (x0 === null) return;
          var t = e.changedTouches[0],
            dx = t.clientX - x0,
            dy = t.clientY - y0;
          x0 = null;
          if (Math.abs(dx) < 40 || Math.abs(dy) > Math.abs(dx)) return;
          var ds = o.querySelectorAll(".onbdots button"),
            k = [].findIndex.call(o.querySelectorAll(".onbs"), function (s) {
              return s.getAttribute("aria-hidden") === "false";
            }),
            n = k + (dx < 0 ? 1 : -1);
          ds[n] && ds[n].click();
        },
        { passive: !0 },
      );
    }
    setInterval(osw, 1500);
    /* pull to refresh drags the page */
    function ptr() {
      var t = D.querySelector(".ptr");
      if (!t) return setTimeout(ptr, 500);
      var cur = null;
      new MutationObserver(function () {
        var v = D.getElementById("v-" + (D.documentElement.dataset.view || "home"));
        if (!v) return;
        var m = /translate\(-50%,\s*([\d.]+)px\)/.exec(t.style.transform || ""),
          d = m ? parseFloat(m[1]) : 0,
          fire = t.classList.contains("fire"),
          drag = t.classList.contains("on") && !fire && d > 0;
        if (cur && cur !== v) {
          cur.style.transform = "";
          cur.style.transition = "";
          cur.__tf = "";
        }
        cur = v;
        var on = fire || (window.scrollY <= 0 && d >= 8),
          tf = on ? "translateY(" + (fire ? 56 : Math.round(d * 0.8)) + "px)" : "";
        if (v.__tf === tf) return;
        v.style.transition = drag ? "none" : "transform .45s cubic-bezier(.32,.72,0,1)";
        v.style.transform = tf;
        v.__tf = tf;
      }).observe(t, { attributes: !0, attributeFilter: ["style", "class"] });
      addEventListener(
        "scroll",
        function () {
          if (cur && cur.__tf && window.scrollY > 0 && !t.classList.contains("fire")) {
            cur.style.transition = "none";
            cur.style.transform = "";
            cur.__tf = "";
          }
        },
        { passive: !0 },
      );
    }
    ptr();
    /* notifications grouped by day */
    function grp() {
      var l = D.querySelector("#v-alerts .nlist");
      if (!l) return setTimeout(grp, 600);
      var busy = 0;
      function run() {
        if (busy) return;
        var main = l.querySelector(":scope>.ncards");
        if (!main) return;
        busy = 1;
        l.querySelectorAll(":scope>.ngrp,:scope>.ncards.ngx").forEach(function (x) {
          if (x.classList.contains("ngx")) while (x.firstChild) main.appendChild(x.firstChild);
          x.remove();
        });
        var cards = [].slice.call(main.querySelectorAll(":scope>.ncard"));
        function lab(c) {
          var t = (c.querySelector("em") || {}).textContent || "";
          return /just|min|\bh\b|hour|now|today/i.test(t)
            ? "Today"
            : /yesterday/i.test(t)
              ? "Yesterday"
              : "Earlier this week";
        }
        var groups = [],
          map = {};
        cards.forEach(function (c) {
          var k = lab(c);
          map[k] || ((map[k] = []), groups.push(k));
          map[k].push(c);
        });
        if (groups.length) {
          var h = D.createElement("div");
          h.className = "ngrp";
          h.textContent = groups[0];
          main.before(h);
          var prev = main;
          groups.slice(1).forEach(function (k) {
            var hh = D.createElement("div");
            hh.className = "ngrp";
            hh.textContent = k;
            var box = D.createElement("div");
            box.className = "ncards ngx";
            map[k].forEach(function (c) {
              box.appendChild(c);
            });
            prev.after(hh);
            hh.after(box);
            prev = box;
          });
        }
        setTimeout(function () {
          busy = 0;
        }, 0);
      }
      new MutationObserver(function () {
        busy || run();
      }).observe(l, { childList: !0, subtree: !0 });
      run();
    }
    grp();
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "More tab setup, swipe on text in sign-in and onboarding, pul", err);
}

/* ==========================================================================
   Plans sheet: places the limited-time offer timer.
   ========================================================================== */
try {
  (function () {
    var D = document;
    function mv() {
      var sh = D.getElementById("plans-sheet");
      if (!sh || sh.hidden) return;
      var c = sh.querySelector(".p2card"),
        o = c && c.querySelector(":scope>.p2off"),
        ex = sh.querySelector(".p2offx");
      var live = 0;
      try {
        live = +localStorage.getItem("vizag-offer-until") > Date.now();
      } catch (e) {}
      o && (window.__offH = o.innerHTML);
      var H = o ? o.innerHTML : live ? window.__offH : "";
      if (!H) {
        ex && ex.remove();
        return;
      }
      if (!ex) {
        ex = D.createElement("div");
        ex.className = "p2offx";
      }
      var at = sh.querySelector(".p2seg") || c;
      if (ex.nextElementSibling !== at) at.before(ex);
      if (ex.innerHTML !== H) ex.innerHTML = H;
    }
    setInterval(mv, 250);
    var mo = 0;
    (function w() {
      var sh = D.getElementById("plans-sheet");
      if (!sh) return setTimeout(w, 800);
      new MutationObserver(function () {
        mo || ((mo = 1), mv(), (mo = 0));
      }).observe(sh, { childList: !0, subtree: !0 });
    })();
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Plans sheet: places the limited-time offer timer.", err);
}

/* ==========================================================================
   Keeps the More tab icon correct.
   ========================================================================== */
try {
  (function () {
    var D = document;
    function ic() {
      var nb = D.querySelector('.nav button[data-v="profile"]');
      if (!nb) return setTimeout(ic, 500);
      var u = nb.querySelector("use");
      u &&
        (u.setAttribute("href", "#i-hugeicons-" + (window.__moreIc || "more-a")),
        u.setAttribute("data-p", window.__moreIc || "more-a"));
    }
    ic();
    setTimeout(ic, 1500);
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Keeps the More tab icon correct.", err);
}

/* ==========================================================================
   Home card: tidies the Span block in merged cards.
   ========================================================================== */
try {
  (function () {
    var D = document,
      R = D.documentElement;
    function fx() {
      if (!R.classList.contains("homeone")) return;
      D.querySelectorAll(".hday .summary>.dspan,.ctday2 .summary>.dspan").forEach(function (x) {
        var sp = x.parentNode.querySelector(":scope>.dspend");
        sp && x.previousElementSibling !== sp && sp.after(x);
      });
    }
    var q = 0;
    new MutationObserver(function () {
      q ||
        (q = requestAnimationFrame(function () {
          q = 0;
          fx();
        }));
    }).observe(D.body, { childList: !0, subtree: !0 });
    fx();
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Home card: tidies the Span block in merged cards.", err);
}

/* ==========================================================================
   Signature: prepares the letter-by-letter writing animation.
   ========================================================================== */
try {
  (function () {
    var D = document;
    function cv() {
      D.querySelectorAll(".sigpick .sgo").forEach(function (o) {
        if (o.querySelector(".sgw")) return;
        var sv = o.querySelector("svg"),
          t = sv && sv.querySelector("text");
        if (!t) return;
        var w = D.createElement("span");
        w.className = "sgw";
        w.setAttribute("aria-label", t.textContent);
        w.style.fontFamily = t.style.fontFamily;
        w.style.fontWeight = t.style.fontWeight;
        var n = 0;
        w.innerHTML = t.textContent
          .split("")
          .map(function (c) {
            return c === " "
              ? '<i style="--i:' + n++ + '"> </i>'
              : '<i aria-hidden="true" style="--i:' + n++ + '">' + c + "</i>";
          })
          .join("");
        sv.replaceWith(w);
        if (o.classList.contains("go")) {
          o.classList.remove("go");
          void o.offsetWidth;
          o.classList.add("go");
        }
      });
    }
    cv();
    setInterval(cv, 700);
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Signature: prepares the letter-by-letter writing animation.", err);
}

/* ==========================================================================
   Notification style picker (Grouped, Cards, Plain, Compact, Timeline).
   ========================================================================== */
try {
  (function () {
    var D = document,
      K = "vizag-nstyle",
      N = [
        ["1", "Grouped"],
        ["2", "Cards"],
        ["3", "Plain"],
        ["4", "Compact"],
        ["5", "Timeline"],
      ];
    function g() {
      try {
        var v = localStorage.getItem(K);
        return /^[1-5]$/.test(v) ? v : "1";
      } catch (e) {
        return "1";
      }
    }
    function mount() {
      var va = D.getElementById("v-alerts"),
        nl = va && va.querySelector(".nlist");
      if (!nl) return;
      var v = g();
      va.dataset.nst !== "2" && (va.dataset.nst = "2");
      var ox = va.querySelector(".nstyles");
      ox && ox.remove();
      return;
      var w = D.createElement("div");
      w.className = "nstyles";
      w.setAttribute("role", "group");
      w.setAttribute("aria-label", "Notification style");
      w.innerHTML = N.map(function (n) {
        return (
          '<button type="button" data-nst="' +
          n[0] +
          '" aria-pressed="' +
          (n[0] === v) +
          '">' +
          n[1] +
          "</button>"
        );
      }).join("");
      nl.before(w);
      w.addEventListener("click", function (e) {
        var b = e.target.closest("button");
        if (!b) return;
        e.stopPropagation();
        try {
          localStorage.setItem(K, b.dataset.nst);
        } catch (x) {}
        va.dataset.nst = b.dataset.nst;
        w.querySelectorAll("button").forEach(function (x) {
          x.setAttribute("aria-pressed", String(x === b));
        });
        window.__snd && window.__snd("tap");
      });
    }
    mount();
    setInterval(mount, 1500);
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Notification style picker (Grouped, Cards, Plain, Compact, T", err);
}

/* ==========================================================================
   Signature: marks the writing animation as finished; tap to replay.
   ========================================================================== */
try {
  (function () {
    var D = document;
    D.addEventListener(
      "animationend",
      function (e) {
        e.animationName === "sgwr" && e.target.classList.add("sgdn");
      },
      !0,
    );
    D.addEventListener(
      "click",
      function (e) {
        var o = e.target.closest && e.target.closest(".sgo");
        o &&
          o.querySelectorAll(".sgdn").forEach(function (i) {
            i.classList.remove("sgdn");
          });
      },
      !0,
    );
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Signature: marks the writing animation as finished; tap to r", err);
}

/* ==========================================================================
   Plans sheet: swipe the plan card left or right to switch plans.
   ========================================================================== */
try {
  (function () {
    var D = document,
      x0 = null,
      y0 = 0,
      lk = 0,
      dx = 0,
      lt = 0,
      lx = 0,
      v = 0,
      busy = 0;
    var EZ = "cubic-bezier(.32,.72,0,1)";
    function card() {
      var sh = D.getElementById("plans-sheet");
      return sh && sh.querySelector(".p2card");
    }
    function tabs() {
      var sh = D.getElementById("plans-sheet");
      return sh ? [].slice.call(sh.querySelectorAll("[data-pk]")) : [];
    }
    function cur(t) {
      for (var i = 0; i < t.length; i++) if (t[i].getAttribute("aria-selected") === "true") return i;
      return -1;
    }
    D.addEventListener(
      "touchstart",
      function (e) {
        var sh = e.target.closest && e.target.closest("#plans-sheet");
        if (busy || !sh || e.touches.length > 1 || e.target.closest("input,textarea,.p2seg")) {
          x0 = null;
          return;
        }
        x0 = e.touches[0].clientX;
        y0 = e.touches[0].clientY;
        lk = 0;
        dx = 0;
        v = 0;
        lt = e.timeStamp;
        lx = x0;
      },
      { passive: !0 },
    );
    D.addEventListener(
      "touchmove",
      function (e) {
        if (x0 == null) return;
        var t = e.touches[0],
          mx = t.clientX - x0,
          my = t.clientY - y0;
        if (!lk) {
          if (Math.abs(mx) < 8 && Math.abs(my) < 8) return;
          lk = Math.abs(mx) > Math.abs(my) * 1.2 ? 1 : -1;
          if (lk === 1) window.__hsw = 1;
        }
        if (lk !== 1) return;
        e.cancelable && e.preventDefault();
        var dt = Math.max(1, e.timeStamp - lt);
        v = 0.7 * ((t.clientX - lx) / dt) + 0.3 * v;
        lt = e.timeStamp;
        lx = t.clientX;
        var T = tabs(),
          i = cur(T),
          edge = (mx > 0 && i <= 0) || (mx < 0 && i >= T.length - 1);
        dx = edge ? mx * 0.3 : mx;
        var c = card();
        if (c) {
          c.style.transition = "none";
          c.style.transform = "translate3d(" + dx + "px,0,0)";
          c.style.opacity = String(1 - Math.min(0.35, Math.abs(dx) / 900));
        }
      },
      { passive: !1 },
    );
    function end() {
      if (x0 == null) return;
      x0 = null;
      var was = lk === 1;
      lk = 0;
      setTimeout(function () {
        window.__hsw = 0;
      }, 0);
      if (!was) return;
      var c = card();
      if (!c) return;
      var T = tabs(),
        i = cur(T),
        dir = dx < 0 ? 1 : -1,
        j = i + dir,
        W = c.offsetWidth || 360,
        go =
          j >= 0 &&
          j < T.length &&
          (Math.abs(dx) > W * 0.22 || (Math.abs(v) > 0.35 && Math.abs(dx) > 24 && (v < 0 ? 1 : -1) === dir));
      if (!go) {
        c.style.transition = "transform .45s " + EZ + ",opacity .3s ease";
        c.style.transform = "";
        c.style.opacity = "";
        setTimeout(function () {
          c.style.transition = "";
        }, 460);
        return;
      }
      busy = 1;
      var h0 = c.offsetHeight;
      c.style.transition = "transform .2s cubic-bezier(.4,0,1,1),opacity .2s ease";
      c.style.transform = "translate3d(" + -dir * W * 0.9 + "px,0,0)";
      c.style.opacity = "0";
      setTimeout(function () {
        T[j].click();
        var n = card();
        if (!n) {
          busy = 0;
          return;
        }
        var h1 = n.offsetHeight;
        n.classList.add("p2hs");
        n.style.transition = "none";
        n.style.height = h0 + "px";
        n.style.transform = "translate3d(" + dir * W * 0.5 + "px,0,0)";
        n.style.opacity = "0";
        void n.offsetWidth;
        n.style.transition = "transform .42s " + EZ + ",opacity .3s ease,height .42s " + EZ;
        n.style.transform = "";
        n.style.opacity = "";
        n.style.height = h1 + "px";
        setTimeout(function () {
          n.style.transition = "";
          n.style.height = "";
          n.classList.remove("p2hs");
          busy = 0;
        }, 440);
      }, 190);
    }
    D.addEventListener("touchend", end, { passive: !0 });
    D.addEventListener("touchcancel", end, { passive: !0 });
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Plans sheet: swipe the plan card left or right to switch pla", err);
}

/* ==========================================================================
   Theme and notification sheets: hint text.
   ========================================================================== */
try {
  (function () {
    var D = document;
    function hint() {
      var th = D.getElementById("theme-sheet");
      if (!th) return;
      var h = [].slice.call(th.querySelectorAll(".thhint")).filter(function (p) {
        return /home screen, not the app theme/.test(p.textContent);
      })[0];
      if (h && !/Re-add/.test(h.textContent))
        h.textContent = h.textContent.trim() + " Re-add to Home Screen to see the new icon.";
    }
    function nt() {
      var s = D.getElementById("notif-sheet");
      if (!s) return;
      s.querySelectorAll(".setrow>.seg").forEach(function (g) {
        var b0 = g.querySelector('[data-v="0"]'),
          b1 = g.querySelector('[data-v="1"]');
        if (!b0 || !b1) return;
        g.classList.add("ntseg");
        var t = g.nextElementSibling;
        if (!t || !t.classList.contains("tgl")) {
          t = D.createElement("button");
          t.type = "button";
          t.className = "tgl ntg";
          t.setAttribute("role", "switch");
          t.setAttribute("aria-label", g.getAttribute("aria-label") || "");
          t.innerHTML = "<i></i>";
          g.after(t);
          t.addEventListener("click", function (e) {
            e.stopPropagation();
            var on = t.getAttribute("aria-checked") === "true";
            (on ? b0 : b1).click();
            setTimeout(nt, 0);
          });
        }
        var on = b1.getAttribute("aria-pressed") === "true" || b1.classList.contains("on");
        t.setAttribute("aria-checked", String(on));
      });
    }
    function all() {
      hint();
      nt();
    }
    all();
    setInterval(all, 1500);
    D.addEventListener(
      "click",
      function () {
        setTimeout(all, 60);
      },
      !0,
    );
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Theme and notification sheets: hint text.", err);
}

/* ==========================================================================
   Swipe sideways between sub-tabs on Days, Plan and Explore.
   ========================================================================== */
try {
  (function () {
    var D = document,
      EZ = "cubic-bezier(.32,.72,0,1)",
      st = null;
    function hsc(e, stop) {
      for (var n = e; n && n !== stop; n = n.parentElement) {
        if (n.nodeType !== 1) continue;
        var cs = getComputedStyle(n);
        if (/(auto|scroll)/.test(cs.overflowX) && n.scrollWidth > n.clientWidth + 2) return !0;
      }
      return !1;
    }
    function panel(vz) {
      return [].slice.call(vz.children).filter(function (e) {
        return !e.classList.contains("chips") && !e.hidden && e.offsetHeight > 0;
      })[0];
    }
    D.addEventListener(
      "touchstart",
      function (e) {
        st = null;
        if (e.touches.length > 1) return;
        var t = e.target;
        if (!t.closest) return;
        var V = t.closest("#v-days,#v-plan,#v-route");
        if (!V || V.hidden) return;
        var vz = t.closest(".vz");
        if (
          !vz ||
          t.closest(
            ".chips,input,textarea,select,[contenteditable],input[type=range],.sheet,.noswipe,iframe",
          ) ||
          hsc(t, vz)
        )
          return;
        var ch = vz.querySelector(":scope>.chips");
        if (!ch) return;
        var bs = [].slice.call(ch.querySelectorAll("button.chip"));
        var i = bs.findIndex(function (b) {
          return b.getAttribute("aria-pressed") === "true";
        });
        if (i < 0 || bs.length < 2) return;
        st = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          lk: 0,
          dx: 0,
          v: 0,
          lt: e.timeStamp,
          lx: e.touches[0].clientX,
          vz: vz,
          bs: bs,
          i: i,
          pn: null,
        };
      },
      { passive: !0 },
    );
    D.addEventListener(
      "touchmove",
      function (e) {
        if (!st) return;
        var t = e.touches[0],
          mx = t.clientX - st.x,
          my = t.clientY - st.y;
        if (!st.lk) {
          if (Math.abs(mx) < 10 && Math.abs(my) < 10) return;
          st.lk = Math.abs(mx) > Math.abs(my) * 1.3 ? 1 : -1;
          if (st.lk === 1) {
            st.pn = panel(st.vz);
            window.__hsw = 1;
          }
        }
        if (st.lk !== 1 || !st.pn) return;
        e.cancelable && e.preventDefault();
        var dt = Math.max(1, e.timeStamp - st.lt);
        st.v = 0.7 * ((t.clientX - st.lx) / dt) + 0.3 * st.v;
        st.lt = e.timeStamp;
        st.lx = t.clientX;
        var edge = (mx > 0 && st.i === 0) || (mx < 0 && st.i === st.bs.length - 1);
        st.dx = edge ? mx * 0.25 : mx;
        st.pn.style.transition = "none";
        st.pn.style.transform = "translate3d(" + st.dx + "px,0,0)";
        st.pn.style.opacity = String(1 - Math.min(0.4, Math.abs(st.dx) / 800));
      },
      { passive: !1 },
    );
    function end() {
      var S = st;
      st = null;
      setTimeout(function () {
        window.__hsw = 0;
      }, 0);
      if (!S || S.lk !== 1 || !S.pn) return;
      var pn = S.pn,
        dir = S.dx < 0 ? 1 : -1,
        j = S.i + dir,
        W = pn.offsetWidth || 360,
        go =
          j >= 0 &&
          j < S.bs.length &&
          (Math.abs(S.dx) > W * 0.25 ||
            (Math.abs(S.v) > 0.35 && Math.abs(S.dx) > 30 && (S.v < 0 ? 1 : -1) === dir));
      if (!go) {
        pn.style.transition = "transform .45s " + EZ + ",opacity .3s ease";
        pn.style.transform = "";
        pn.style.opacity = "";
        setTimeout(function () {
          pn.style.transition = "";
        }, 460);
        return;
      }
      pn.style.transition = "transform .18s cubic-bezier(.4,0,1,1),opacity .18s ease";
      pn.style.transform = "translate3d(" + -dir * W * 0.6 + "px,0,0)";
      pn.style.opacity = "0";
      setTimeout(function () {
        pn.style.transition = "none";
        pn.style.transform = "";
        pn.style.opacity = "";
        S.bs[j].click();
        window.__snd && window.__snd("tap");
        try {
          S.bs[j].scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
        } catch (x) {}
        var n = panel(S.vz);
        if (!n) return;
        n.style.transition = "none";
        n.style.transform = "translate3d(" + dir * W * 0.4 + "px,0,0)";
        n.style.opacity = "0";
        void n.offsetWidth;
        n.style.transition = "transform .4s " + EZ + ",opacity .28s ease";
        n.style.transform = "";
        n.style.opacity = "";
        setTimeout(function () {
          n.style.transition = "";
        }, 420);
      }, 170);
    }
    D.addEventListener("touchend", end, { passive: !0 });
    D.addEventListener("touchcancel", end, { passive: !0 });
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Swipe sideways between sub-tabs on Days, Plan and Explore.", err);
}

/* ==========================================================================
   Landscape art at the bottom of More, and its placement.
   ========================================================================== */
try {
  (function () {
    var A =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 238" fill="currentColor" role="img" aria-label="Beach, trek, road trip and camping, drawn as one landscape"><svg x="0" y="0" width="260" height="236" viewBox="40 0 260 236" overflow="hidden"><path d="M129.5 334.2l.3.6.6.7.9.7 1.2.7 1.5.7 1.7.6 1.9.4 2.1.2 2.3 0 2-.2 1.6-.2 1.3-.4.9-.5 1.3-.4 1.7-.2 1.9-.1 2.3 0 2.4.3 2.5.8 2.6 1.1 2.7 1.5 2.3 1.1 1.9.8 1.4.4 1.1 0 .9 0 .6.1.4.2.2.3.8.1 1.5 0 2.2-.1 2.8-.3 2.9-.5 3-.9 3.1-1.2 3.2-1.5 2.9-1.1 2.6-.8 2.3-.3 2.1 0 2.4.3 2.6.8 2.9 1.1 3.2 1.5 3.1 1.1 3 .8 2.9.4 2.8 0 2.1-.1 1.5-.1.9-.2.2-.3.2-.2.4-.1.5 0 .6 0 .6-.2.8-.2.9-.4 1-.5 1-.6 1.1-.8 1.2-.9 1.2-1 1.1-.8 1-.6 1-.5.8-.3.7-.4.4-.3.2-.4-.1-.3-.4-.3-.9-.2-1.1-.1-1.6 0-1.2.1-.9.1-.5.2-.2.2-.5.3-.7.2-1.1.3-1.3.2-1.1.3-1 .4-.9.5-.7.4-1.1.4-1.5.3-1.9.1-2.3 0-2.5-.4-2.6-.7-2.8-1.1-2.9-1.6-3-1.1-3.1-.7-3.3-.4-3.3 0-3.2.4-3.1.7-3.1 1.1-2.9 1.6-2.8 1.1-2.6.9-2.5.6-2.3.2-1.8.2-1.2 0-.7-.2-.2-.2-.4-.2-.5-.1-.6-.1-.8 0-1.3-.4-1.8-.7-2.2-1.1-2.7-1.6-2.2-1.1-1.7-.7-1.3-.4-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.6-.2-1-.1-1.4-.1-1.8 0-1.4.1-1 .1-.6.2-.2.2-.3.2-.4.1-.4.1-.6 0-.5.1-.4.1-.2.2-.2.2-.3.2-.4.1-.4.1-.6 0-.7.1-.7.3-.9.4-.9.4-1.4.4-1.7.1-2.2 0-2.7-.2-1.9 0-1.1.3zM85.5 307.2l.3.6.3.5.3.3.3.2.3 0 .7.3 1 .8 1.3 1.1 1.7 1.5 1.4 1.1 1.1.8.9.4.6 0 .5-.2.7-.2.6-.4.7-.5 1-.4 1.4-.2 1.7-.1 2.1 0 2 .3 1.8.6 1.8.9 1.7 1.3 1.7 1 1.6.7 1.6.5 1.6.3 1.2.2.8.3.6.2.2.3.6.2 1 .1 1.4.1 1.8 0 1.4-.1 1-.1.6-.2.2-.3.3-.2.5-.1.7 0 .8 0 1.4-.5 2-.9 2.6-1.3 3.2-1.7 3.1-1.3 3-.9 2.9-.4 2.8 0 2.9.4 3 .9 3.1 1.3 3.2 1.7 2.6 1.3 2 .9 1.4.5.8 0 .6 0 .5.1.4.2.2.3.7.2 1.2.1 1.8.1 2.3 0 1.8-.1 1.3-.1.7-.2.2-.3.3-.2.5-.1.7 0 .8 0 1-.2 1.1-.4 1.4-.6 1.4-.7 1.3-.7 1-.6.7-.6.4-.5.5-.4.5-.2.5-.1.6 0 .6-.2.8-.2.8-.4.9-.5 1.2-.4 1.4-.2 1.6-.1 1.8 0 1.4 0 1 .1.6.2.2.3.4.2.8.3 1 .2 1.3.3 1.1.3.9.4.7.4.4.5.7.6 1 .6 1.2.7 1.5.7 1.3.6 1.2.4 1 .2.8 0 .6 0 .5.1.4.2.2.3.7.2 1.2.1 1.8.1 2.3 0 1.8-.1 1.3-.1.7-.2.2-.3.3-.2.5-.1.7 0 .8 0 1.4-.4 2-.8 2.6-1.1 3.2-1.5 2.8-1.1 2.5-.8 2.2-.3 1.8 0 1.7.1 1.7.4 1.6.6 1.4.7 1.3.7 1 .6.7.6.4.5.6.4.7.4.9.3 1.1.3 1.2 0 1.3-.3 1.4-.5 1.4-.7 1.7-1 1.8-1.3 1.9-1.6 2.1-1.8 1.5-1.4 1-1.1.6-.7 0-.3-.1-.2-.2-.2-.3-.1-.4-.1-.3 0-.3.1-.2.2-.2.2-.6.3-.8.2-1.2.3-1.6.2-1.2.3-.9.2-.5.3-.2.2-.6.2-.8.1-1.2.1-1.6 0-1.4-.1-1.1-.3-.9-.4-.7-.4-.6-.4-.7-.3-.5-.1-.6 0-.7-.1-.7-.3-.9-.4-.9-.4-1.2-.4-1.5-.3-1.8-.1-2.1 0-1.5.1-1.2.1-.6.2-.2.2-.4.2-.5.1-.6.1-.8 0-1.2.3-1.5.6-1.8 1-2.2 1.2-2 1-1.9.8-1.7.5-1.6.2-1.2.3-.9.2-.5.3-.2.2-.4.2-.6.1-.9.1-1.1 0-.8-.1-.6-.1-.4-.2-.2-.2-.6-.3-.8-.2-1.2-.3-1.6-.2-1.4-.4-1.3-.5-1.1-.6-.9-.8-1.1-.7-1.4-.6-1.6-.6-1.8-.4-1.4-.5-1-.4-.6-.3-.2-.2-.9-.2-1.5-.1-2.1-.1-2.8 0-3.1.4-3.2.9-3.5 1.3-3.7 1.8-3.5 1.3-3.4.9-3.2.4-3.1 0-2.9-.4-2.9-.7-2.8-1.1-2.7-1.6-2.6-1.2-2.7-1-2.5-.8-2.6-.4-2-.4-1.3-.1-.8.1-.2.2-.5.2-.7.1-1.1.1-1.3 0-1 .1-.8.1-.4.2-.2.2-.3.2-.4.1-.4.1-.6 0-1.1.4-1.6.7-2.2 1.1-2.7 1.6-2.7 1.1-2.7.7-2.8.4-2.8 0-2.9-.4-2.8-.9-3-1.3-2.9-1.8-2.8-1.3-2.8-.9-2.6-.4-2.6 0-2 .1-1.3.1-.8.2-.2.2-.5.2-.7.1-1.1.1-1.3 0-1-.1-.8-.1-.4-.2-.2-.2-.5-.2-.8-.1-1.1 0-1.3.1-1 .2-.5.3zM64 288.5l1.3 1.3 1.2 1.1 1.2.9 1.1.7 1 .5 1.2.4 1.4.2 1.6.2 1.8 0 1.8-.3 1.9-.5 1.9-.8 1.9-1 1.6-.7 1.3-.5.9-.2.6 0 .5-.2.7-.2.6-.4.7-.5 1-.4 1.4-.2 1.7-.1 2.1 0 2.4.4 2.8.9 3.1 1.3 3.4 1.7 3.4 1.4 3.4 1 3.3.6 3.3.3 2.6.1 1.7 0 1-.1.2-.3.5-.2.9-.3 1.2-.2 1.6-.3 1.9-.5 2.2-.9 2.6-1.2 2.9-1.5 2.9-1.1 2.7-.8 2.7-.3 2.6 0 2.7.4 3 .9 3.3 1.3 3.4 1.7 3.2 1.4 3 1 2.8.6 2.6.3 1.9.1 1.4 0 .8-.1.2-.3.4-.2.8-.1 1 0 1.3 0 1.1-.1.7-.1.5-.2.2-.3.2-.2.4-.1.5 0 .6 0 1.1-.4 1.6-.8 2.1-1.1 2.7-1.5 2.7-1.1 2.6-.8 2.6-.3 2.6 0 2.7.4 3 .9 3.3 1.3 3.4 1.7 3.2 1.4 3 1 2.8.6 2.6.3 1.9.1 1.4 0 .8-.1.2-.3.4-.2.8-.1 1 0 1.3 0 1.1-.1.7-.1.5-.2.2-.3.2-.2.4-.1.5 0 .6 0 1.1-.4 1.8-.8 2.3-1.1 2.9-1.5 2.9-1.1 2.7-.8 2.7-.3 2.6 0 2.8.4 3.1.9 3.4 1.3 3.7 1.7 3.6 1.3 3.5.9 3.4.5 3.3 0 2.6-.1 1.7-.1 1-.2.2-.3.6-.3 1-.4 1.4-.4 1.8-.5 1.9-.8 1.9-1.2 2-1.5 2.1-1.8 1.5-1.4 1-1.1.6-.7 0-.3-.5-.2-1-.2-1.4-.1-1.8-.1-2.2.3-2.4.7-2.7 1.1-2.9 1.6-2.7 1.1-2.3.7-2.1.4-1.8 0-1.4-.1-1-.1-.6-.2-.2-.2-.6-.3-1-.4-1.4-.5-1.8-.4-1.5-.6-1.1-.4-.8-.6-.4-.4-.5-.4-.5-.3-.5-.1-.6 0-.6-.1-.6-.3-.7-.4-.7-.4-.7-.4-.9-.3-1-.1-1.1 0-.8-.1-.6-.1-.4-.2-.2-.2-.6-.2-.8-.1-1.2-.1-1.6 0-1.2.1-.9.1-.5.2-.2.2-.4.2-.5.1-.6.1-.8 0-1.6.4-2.2.9-3 1.3-3.7 1.8-3.4 1.3-3.3.9-3 .4-2.8 0-3-.4-3.1-.9-3.3-1.3-3.4-1.8-2.9-1.3-2.2-.9-1.7-.4-1.1 0-.8-.1-.6-.1-.4-.2-.2-.2-.8-.2-1.4 0-1.9.2-2.6.2-2.8.6-3 1-3.2 1.4-3.4 1.8-3.3 1.3-3.2.9-2.9.4-2.8 0-2.2-.1-1.5-.1-.8-.2-.2-.2-.3-.2-.4-.1-.4-.1-.6 0-.8-.2-1-.4-1.3-.5-1.5-.8-1.2-.7-1-.6-.7-.6-.4-.4-.8-.5-1-.4-1.2-.3-1.6-.2-1.2-.3-.9-.2-.5-.3-.2-.2-.9-.2-1.5 0-2.1.2-2.8.2-3.1.6-3.2 1-3.5 1.4-3.7 1.8-3.4 1.3-3.3.9-3 .4-2.8 0-2.2-.1-1.5-.1-.8-.2-.2-.2-.5-.3-.7-.2-1.1-.3-1.3-.2-1.1-.3-.9-.4-.6-.5-.4-.4-.6-.6-.7-.4-.9-.6-1-.4-1.1-.5-1.3-.4-1.4-.3-1.6-.2-1.2-.3-.9-.2-.5-.3-.2-.2-.6-.2-.8-.1-1.2-.1-1.6 0-1.2.1-.9.1-.5.2-.2.2-.4.2-.5.1-.6.1-.8 0-1.3.3-1.6.6-2 1-2.4 1.2-2.3 1-2.1.6-2 .3-1.8 0-1.4-.1-1-.1-.6-.2-.2-.2-.4-.2-.5-.1-.6-.1-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.4-.2-.6-.1-.9-.1-1.1 0-.8.1-.5.2-.3.3-.1.3.3.6.6.9zM38 258.7l0 .3.2.4.4.5.5.6.8.7.5.6.4.5.2.4 0 .3.3.5.5.7.8.9 1.1 1.1 1 .8.9.5.9.3.8 0 .6 0 .5.1.4.2.2.3.3.2.5.1.7.1.8 0 .6 0 .5.1.4.2.2.3.2.2.4.1.5.1.6 0 .6.1.8.2.8.4.9.5 1.1.4 1.1.2 1.2.2 1.3 0 1.1 0 .7.1.5.2.2.3.2.1.4 0 .4-.1.5-.3.8-.2 1-.1 1.3 0 1.6 0 1.2-.1.8-.1.6-.2.2-.3.2-.2.4-.1.5 0 .6 0 1.1-.4 1.6-.8 2.1-1.1 2.7-1.5 2.2-1.1 1.8-.8 1.3-.3.8 0 .6-.1.5-.1.4-.2.2-.3.7-.1 1.2 0 1.8.1 2.3.3 2.4.5 2.5.9 2.6 1.2 2.7 1.5 2.5 1.2 2.2.9 2.1.5 1.8.3 1.4.2 1 .3.6.2.2.3.8.1 1.5 0 2.2-.1 2.8-.3 2.9-.6 3.2-1 3.3-1.4 3.4-1.7 3.3-1.3 3.3-.9 3.1-.4 3.1 0 3.2.4 3.2.9 3.4 1.3 3.4 1.7 3.5 1.3 3.5.9 3.5.5 3.6 0 3.5-.5 3.5-.9 3.5-1.3 3.4-1.7 2.8-1.3 2.1-.9 1.5-.4.8 0 .6-.1.5-.1.4-.2.2-.3.7-.1 1.2 0 1.8.1 2.3.3 2.4.5 2.5.9 2.6 1.2 2.7 1.5 2.5 1.2 2.2.9 2.1.5 1.8.3 1.4.2 1 .3.6.2.2.3.7.1 1.2 0 1.8-.1 2.3-.3 1.8-.2 1.3-.3.7-.2.2-.3.6-.3 1-.4 1.4-.4 1.8-.5 1.6-.6 1.4-.6 1.1-.7.9-.7 1.1-.7 1.3-.4 1.4-.4 1.6-.3 1.2-.2.8-.3.6-.2.2-.3.7-.1 1.2 0 1.8.1 2.3.3 2.6.6 2.9 1 3.2 1.4 3.4 1.7 3.5 1.3 3.5.9 3.5.5 3.6 0 2.7-.1 1.9-.1 1-.2.2-.3.2-.2.4-.1.5 0 .6 0 .7-.2.8-.4 1.1-.6 1.2-.7 1-.6.9-.4.7-.1.6 0 .6-.2.8-.2.8-.4.9-.5 1.1-.4 1.1-.2 1.2-.1 1.3 0 1.1 0 .7.1.5.2.2.3.5.2.9.3 1.2.2 1.6.3 1.6-.4 1.7-.9 1.7-1.4 1.8-2.1 1.4-1.6.8-1.3.5-.8-.1-.3-1.1-.3-2-.2-3.1-.1-4.1 0-3.1.1-2.1.1-1.1.2-.2.2-.6.3-.8.2-1.2.3-1.6.2-1.9.6-2.3.9-2.6 1.1-2.9 1.6-2.8 1.1-2.6.7-2.5.4-2.3 0-1.8-.1-1.2-.1-.7-.2-.2-.2-.4-.2-.5-.1-.6-.1-.8 0-1.4-.4-1.9-.7-2.4-1.1-2.9-1.6-2.4-1.1-1.9-.7-1.3-.4-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.7-.2-1.1-.1-1.6-.1-2.1 0-1.5.1-1.2.1-.6.2-.2.2-.4.2-.5.1-.6.1-.8 0-1.5.4-2.1.9-2.8 1.3-3.4 1.8-3.3 1.3-3.2.9-2.9.4-2.8 0-3-.4-3.1-.9-3.3-1.3-3.4-1.8-2.8-1.3-2.1-.9-1.5-.4-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.7-.2-1.1-.1-1.6-.1-2.1 0-1.5.1-1.2.1-.6.2-.2.2-.4.2-.5.1-.6.1-.8 0-.8.1-.8.3-.7.4-.7.4-.6.4-.7.3-.5.1-.6 0-.5.1-.5.3-.5.4-.4.4-.8.6-1.2.4-1.4.6-1.8.4-1.4.5-1 .4-.6.3-.2.2-.8.2-1.4.1-1.9.1-2.6 0-2.8-.4-3-.9-3.2-1.3-3.4-1.8-2.8-1.3-2.1-.9-1.5-.4-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.7-.2-1.1-.1-1.6-.1-2.1 0-1.5.1-1.2.1-.6.2-.2.2-.4.2-.5.1-.6.1-.8 0-1.3.4-1.8.7-2.2 1.1-2.7 1.6-2.2 1.1-1.7.7-1.3.4-.8 0-.7.1-.5.1-.3.2-.2.2-.9.2-1.5.1-2.1.1-2.8 0-3-.4-3.1-.9-3.3-1.3-3.4-1.8-2.8-1.3-2.1-.9-1.5-.4-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.7-.2-1.1-.1-1.6-.1-2.1 0-1.5.1-1.2.1-.6.2-.2.2-.6.3-.8.2-1.2.3-1.6.2-1.9.6-2.3.9-2.6 1.1-2.9 1.6-2.8 1.1-2.8.7-2.6.4-2.6 0-2.8-.4-3-.9-3.2-1.3-3.4-1.8-2.8-1.3-2.1-.9-1.5-.4-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.5-.2-.8-.1-1.1 0-1.3.1-1.1.1-.7.2zM182.8 172.2l-.6-.1-.6.1-.5.2-.5.4-.4.4-.5.5-.6.3-.5.2-.7.1-.3.2 0 .2.3.3.7.3.7 0 .8-.3 1-.6 1.1-.8.6-.7.2-.5zM114.8 165.2l-.6-.1-.7.1-.6.4-.7.5-.7.8-.7.4-.9.1-.9-.2-1-.4-.9-.4-.8-.2-.7 0-.7.1-.3.1 0 .1.3.1.7.1.6.2.7.4.6.6.7.7.6.6.5.4.4.2.3 0 .6-.3.8-.6 1.1-.8 1.3-1.2.8-.8.4-.6zM198.8 88.6l1.9.1 1.5-.1 1-.1.7-.1.2-.3.4-.2.5-.2.7-.1.8-.2.2-.1-.4-.1-1 0-1.6-.1-1.3 0-.9.1-.6.2-.3.2-.4.2-.7.2-.8.2-1.1.1-.3.1.4.1zM37.6 130.4l.3.2.6-.3.8-.5 1-.9 1.2-1.3.9-.9.8-.6.5-.3.3 0 .5-.2.7-.4.8-.6 1-.7.8-.5.5-.3.4-.1.1.2-.1.4-.3.6-.5.7-.8.9-.5.8-.3.7-.1.5.1.4.5-.2.9-.7 1.3-1.2 1.7-1.7 1.4-1.3 1-.9.6-.4.3 0 .3 0 .2.1.2.1.1.2-.1.4-.3.6-.5.7-.8.9-.4.8-.2.5.1.3.3.2.5 0 .4-.1.5-.2.6-.3.5-.4.3-.4.2-.4.2-.4.3-.4.4-.3.7-.3.8-.3.8-.3.7-.6.7-.6.7-.7.6-.5.6-.3.5-.1.4.2.1.5-.4.6-.9 1-1.2 1.2-.9 1-.6.7-.3.6.1.4.6-.1 1.1-.6 1.7-1 2.3-1.5 1.8-1.1 1.3-.6.9-.3.4.2.1.3-.3.5-.6.5-1 .7-.7.6-.5.6-.2.4.1.4.3.1.5 0 .8-.3 1.1-.5.9-.5.8-.5.6-.5.4-.5.6-.5.9-.5 1-.5 1.3-.5 1-.3.7 0 .5.3.3.5.8.5 1.5.4 2.1.4 2.7.4 2 .3 1.2.3.6.2-.1.2-.6.2-1.1.2-1.6.3-2.1.2-1.5.3-1.2.2-.6.3-.2.2-.5.3-.7.2-1.1.3-1.3.2-1.6.5-1.9.8-2.2 1-2.5 1.2-2.2 1.2-1.8 1.1-1.5 1.1-1.2 1-1 .7-.7.6-.6.2-.3 0-.5.3-.9.7-1 1-1.3 1.3-1 1-.5.9-.1.5.2.3.1.3-.1.2-.3.2-.4.1-.4.3-.4.3-.3.5-.3.7-.5.6-.5.7-.6.6-.8.7-.6.7-.5.6-.4.5-.2.5-.2.5 0 .5.2.6.2.6.1.5-.1.5-.4.5-.4.4-.5.7-.4 1-.3 1.2-.2 1.5-.3 1.2-.2.9-.3.5-.2.3-.2.3-.1.5 0 .5.1.6.4-.2.8-1.1 1.1-1.9 1.5-2.7 1.2-2.1 1-1.3.7-.6.4.2.3.1.1.3-.1.2-.2.3-.2.6 0 .8 0 1.1.1 1.3.2.7.2.1.3-.5.3-1.2.5-1.3.7-1.5.9-1.7 1.2-1.8.9-1.3.6-.8.4-.1.2.4.1.4 0 .4-.2.3-.2.2-.3.6-.2.9-.2 1.2-.2 1.6 0 1.1.1.6.2.2.4-.3.4-.7.5-1 .6-1.3.6-1.7.5-1.3.4-.7.3-.4.2.2.2.3.1.4 0 .7 0 .8 0 .6.1.4.2.2.2 0 .2-.3.4-.4.4-.8.5-1 .4-.9.2-.8.2-.6 0-.6.2-.8.4-.9.7-1.2.8-1.4.7-1 .6-.6.3-.2.2.2 0 .4-.1.6-.4.8-.4 1-.4 1-.2 1-.1 1.1.1 1.1.1.7.2.3.3.1.4-.3.6-.9.7-1.3.9-2 1.2-2.4.9-1.8.6-1.1.4-.6.2.2.1.2 0 .3-.2.4-.2.5-.2.6 0 .7 0 .8.1.8.3.3.6-.5.7-1.1.9-1.7.8-1.2.6-.4.5.1.3.7.4.3.4-.2.5-.6.6-1.2.8-1.1.9-1.3 1.2-1.3 1.4-1.4 1.1-1 .7-.6.5-.2.2.2 0 .3-.3.5-.5.5-.8.7-.6.7-.5.6-.3.7-.2.6.3 0 .8-.5 1.3-1.2 1.7-1.7 1.4-1.3 1.1-.8.8-.4.4.2-.2 1.1-.9 2.2-1.6 3.2-2.2 4.3-1.7 3.3-1.1 2.4-.6 1.5 0 .6-.3 1-.6 1.5-1 2-1.2 2.4-1 2-.6 1.6-.3 1.3 0 .8-.2 1.1-.6 1.4-.7 1.6-1 1.9-.8 1.9-.6 1.9-.5 1.9-.2 1.8-.3 1.4-.2 1-.3.6-.2.2-.3.5-.2.9-.3 1.2-.2 1.6-.3 1.4-.4 1.2-.5 1.1-.4.9-.4 1-.3 1-.1 1 0 1.1-.1.9-.1.6-.2.4-.2.2-.2.4-.1.6-.1.8 0 1.1-.1.9-.1.6-.2.4-.2.2-.2.4-.1.8-.1 1 0 1.3-.1 1.1-.1.7-.2.5-.2.2-.2.4-.1.6-.1.8 0 1.1-.1.9-.1.6-.2.4-.2.2-.2.6-.1 1-.1 1.4 0 1.8-.1 1.4-.1 1-.2.6-.2.2-.2.4-.1.6-.1.8 0 1.1-.1.9-.1.6-.2.4-.2.2-.2.9-.1 1.8-.1 2.5 0 3.3-.1 2.6-.1 1.7-.2 1-.2.2-.2.4-.1.6-.1.8 0 1.1 0 .8-.1.6-.2.4-.2.1-.2-.1-.3-.2-.3-.5-.4-.7-.6-.9-.8-1-1.1-1.1-1.3-1.3-1.2-1.1-1.1-.8-.9-.5-.8-.2-.3.3.1.9.7 1.5 1.2 2.1.9 1.6.6 1.4.3.9 0 .6 0 .4-.1.4-.2.2-.2.1-.3-.1-.6-.3-.8-.5-.9-.8-1-.5-1.1-.4-1.3-.2-1.3 0-.9.1-.5.2-.2.4.3.4.3.4.5.4.6.4.7.4.5.3.3.4.2.3 0 .3-.2.4-.3.3-.4.4-.7.3-.6.3-.6.2-.5.1-.6 0-.6.1-.6.3-.7.4-.7.4-.6.4-.7.3-.5.1-.6 0-.4.1-.3.2-.2.4 0 .4 3.6.3 7.2.2 10.7.2 14.3 0 10.8-.1 7.3-.1 3.7-.2.2-.3 9.9-.2 19.6-.1 29.3 0 39.1 0 29.3 0 19.7.1 9.9.2.2.3.9.2 1.8.1 2.5.1 3.3 0 2.6-.1 1.7-.1 1-.2.2-.3 1.8-.2 3.5-.1 5.2 0 6.8 0 5.1 0 3.5.1 1.9.2.2.3 2 .1 3.7.1 5.6.1 7.4-.1 5.5-.1 3.7-.3 1.8-.3-.1-.3-.4-.4-.9-.3-1.1-.3-1.6-.2-1.2-.3-.9-.2-.5-.3-.2-.2-.3-.2-.4-.1-.4-.1-.6 0-.7-.1-.7-.3-.9-.4-.9-.4-.9-.4-.9-.3-.8-.1-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.4-.2-.5-.1-.6-.1-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.4-.2-.5-.1-.6-.1-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.4-.2-.5-.1-.6-.1-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.4-.2-.5-.1-.6-.1-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.4-.2-.6-.1-.9-.1-1.1 0-.8-.1-.6-.1-.4-.2-.2-.2-.6-.3-1-.2-1.4-.3-1.8-.2-1.5-.3-1.1-.3-.7-.4-.4-.3-.2-.5-.1-.5 0-.5.2-.7.1-.4-.1-.3-.2-.2-.3 0-.3.1-.4.3-.4.4-.4.4-.7.4-.9.3-1.1.1-1.3 0-1.1-.1-1-.2-.8-.3-.6-.3-.5-.5-.3-.6-.1-.7 0-.8-.1-.7-.1-.5-.2-.3-.3-.2-.2-.6-.1-.8 0-1.2 0-1.6-.1-1.2-.1-.9-.2-.5-.3-.2-.2-.4-.1-.5 0-.6 0-.8-.1-.7-.1-.5-.2-.3-.3-.2-.2-.6-.1-.8 0-1.2 0-1.6-.1-1.2-.1-.9-.2-.5-.3-.2-.2-.4-.1-.5 0-.6 0-.8-.1-.7-.1-.5-.2-.3-.3-.2-.2-.5-.1-.7 0-1.1 0-1.3-.1-1-.1-.8-.2-.4-.3-.2-.2-.4-.1-.6 0-.9 0-1.1-.1-.8-.1-.6-.2-.4-.3-.2-.2-.4-.1-.5 0-.6 0-.8-.1-.7-.1-.5-.2-.3-.3-.2-.3-.9-.4-1.5-.4-2.1-.5-2.8-.5-2.4-.5-1.9-.5-1.4-.5-.9-.4-1-.2-1-.1-1 0-1.1-.2-.9-.2-.7-.4-.6-.5-.4-.4-.6-.2-.8-.1-.9 0-1.1-.2-.9-.2-.9-.4-.8-.5-.7-.4-.9-.4-1.1-.3-1.3-.3-1.6-.3-1.4-.4-1.1-.4-.9-.5-.7-.6-1.2-.6-1.7-.7-2.3-.7-2.8-.8-2.4-.7-2-.8-1.6-.7-1.2-.7-1.4-.6-1.7-.6-1.8-.5-2.1-.3-1.5-.2-1.1 0-.6.2-.2.5.3.8.6 1.1 1 1.3 1.4 1.1 1.1.7.9.4.6.1.4 0 .2.1-.1.1-.2.2-.4 0-.4-.1-.2-.1-.2-.3-.1-.2-.1-.1-.2 0-.3 0-.4 0-.3.1-.3.1-.1.2-.2.4.4.6 1 .7 1.5.9 2 .8 1.2.5.4.3-.3.2-1.2.1-.8.2-.7.1-.3.2-.2.3.4.4.7.5 1.3.7 1.7.6 1.3.5.9.6.6.4.2.4.2.3.4.1.5 0 .6.1.5.1.6.3.5.3.6.2.1.3-.4.1-.9.2-1.4.1-1.1.2-.7.1-.4.2-.2.3.2.4.5.5.8.7 1.2.5 1.2.5 1.2.4 1.3.3 1.4.3 1 .4.7.3.3.4-.1.3-.4.2-.7.1-1 0-1.3 0-1 .1-.7.1-.4.2-.2.3.5.5 1.1.5 1.6.7 2.3.6 1.6.6 1 .4.3.4-.3.2-.4.1-.4-.1-.4-.3-.6-.1-.5 0-.6 0-.6.2-.7.3-.4.2-.2.4.1.3.4.3.4.2.4.1.5 0 .5.1.6.3.6.4.7.4.7.4.7.3.7.1.6 0 .6.1.5.1.6.3.5.3.6.2.1.3-.4.1-.9.2-1.4.1-1.1.2-.7.1-.4.2-.2.4.5.6 1.1.7 1.6.9 2.3.8 1.3.5.5.3-.5.2-1.4 0-1.1-.1-.7-.1-.5-.3-.2-.2-.4-.1-.6 0-.9 0-1.1-.4-1.3-.6-1.6-.9-1.9-1.3-2.2-.9-1.8-.6-1.4-.3-.9 0-.6-.4-.8-.6-.9-1-1.1-1.3-1.3-1.3-1.1-1.2-.9-1.1-.8-1.1-.4-.9-.6-.9-.6-.8-.7-.7-.8-.7-.6-.7-.5-.8-.4-.8-.2-.9-.4-.8-.5-1-.6-.9-.8-.8-.5-.8-.4-.6-.2-.6 0-.5-.1-.3-.1-.2-.2-.2-.2 0-.3.1-.2.1-.2.3-.2 0-.2-.1-.4-.3-.4-.5-.5-.3-.4-.2-.3 0-.2.2-.2.7.2 1.1.4 1.5.7 2 1 1.5.7 1 .4.6 0 .1-.3-.2-.5-.3-.5-.6-.6-.7-.8-.5-.6-.3-.5-.1-.3.2-.2.5.2.8.5 1.2.9 1.4 1.3 1.3 1 1.1.7 1 .5.8.3.5 0 .4-.2 0-.4-.2-.6-.2-.5-.4-.4-.4-.3-.5-.2-.3-.3-.2-.3 0-.4.2-.4.5 0 .6.4 1 .8 1.2 1.3 1 1 .9.7.7.5.6.3.3-.1.2-.3 0-.6-.2-.8-.2-.8-.4-.7-.4-.5-.5-.4-.4-.4-.2-.4-.1-.4 0-.3 0-.2.1-.3.1-.1.2-.2.5.3.9.7 1.2 1.1 1.4 1.5 1.2 1 .8.6.4.1.1-.4-.1-.4-.2-.6-.4-.6-.5-.7-.3-.5-.2-.5 0-.3.2-.2.6.4 1.1.9 1.5 1.5 1.9 2 1.5 1.2.9.6.4-.1-.2-.8-.2-.7-.3-.7-.4-.5-.5-.6-.3-.4-.2-.3-.1-.3.2-.2.2 0 .3 0 .5.1.6.3.8.6 1.1 1 1.4 1.4 1.7 1.7 1.3 1.2.9.7.5.2.2-.4-.1-.4-.2-.4-.3-.4-.5-.4-.4-.6-.4-.6-.3-.7-.3-.8-.5-1-.8-1-1-1.2-1.3-1.3-1.2-1.1-1.1-.8-.9-.5-.8-.2-.7-.3-.7-.4-.5-.5-.4-.4-.5-.5-.4-.3-.5-.2-.4-.1-.2-.2 0-.1.3-.2.5-.2.4 0 .3 0 .1.1.1.3.2.2.4.3.4.2.7.3.4.1.2-.1-.1-.3-.2-.4-.7-.6-1.1-.7-1.6-.9-2-1-1.9-.7-1.8-.4-1.6 0-1.6.2-1.2.1-.7-.1-.4-.4.1-.4-.3-.4-.6-.3-1-.1-1.3 0-1 .1-.8.1-.4.2-.2.2-.5.2-.7.1-1.1.1-1.3 0-1 .1-.8.1-.4.2-.2.2-.5.3-.7.2-1.1.3-1.3.2-1.2.3-1.2.4-1 .5-1 .4-.9.6-.7.4-.6.6-.4.4-.4.3-.3 0-.3-.2-.2-.4.6-.8 1.4-1.2 2.2-1.6 3-1.9 2-1.5 1-1-.1-.6-1.2-.1-.9 0-.8 0-.7.2-.5.2-.4.1-.2 0-.2-.2 0-.3.6-.4 1-.6 1.6-.7 2.2-.8 1-.7-.2-.6-1.2-.5-2.4-.3-1.8-.5-1.2-.4-.6-.5 0-.6.2-.3.4 0 .6.2.7.5.7.3.4.1.4 0 .3-.3.3-.2.4-.1.5 0 .6 0 .5-.2.5-.2.5-.4.6-.5.5-.3.5-.2.5 0 .6.2.3.1.2-.1-.1-.3-.3-.3-.4-.3-.4-.2-.5-.1-.6 0-.4-.1-.3-.1-.2-.3 0-.3.4-.3.8-.3 1.2-.2 1.6-.3 1.2-.2.9-.3.6-.2.2-.3.6-.2.9-.1 1.2 0 1.4 0 1.2-.1.7-.1.4-.1 0-.2-.4-.2-.9-.1-1.2-.2-1.7-.1-1.3-.2-.8-.2-.4-.3 0-.3.1-.4.3-.4.5-.6.6-.6.7-.5.6-.2.7-.1.7.2.5.1.3.2.1.1-.1.2-.2.2-.3.1-.5 0-.6 0-.5 0-.3.1-.2.2 0 .2.2.1.3.1.4.1.6 0 .4-.1.4-.1.2-.2.1-.3.6-.2 1-.1 1.4 0 1.9 0 1.4-.1.9-.1.5-.1 0-.2-.2-.2-.4-.1-.5 0-.8 0-.6-.1-.5-.1-.4-.2-.2-.2-.7-.2-1.2-.1-1.6-.1-2.1 0-1.5-.1-1.2-.1-.6-.2-.2-.2-.4-.1-.6.1-.8.4-1 .4-.9.4-.8.1-.6-.1-.6-.2-.4-.1-.2 0 0 .3.2.3.1.4-.1.4-.3.4-.3.3-.4.2-.3-.1-.3-.3-.2-.4-.3-.4-.3-.3-.3-.1-.3 0-.6.4-.9.7-1.1 1.1-1.4 1.6-1.2 1-.9.6-.6.2-.3-.2-.4-.1-.4.2-.5.3-.6.6-.4.6-.4.7-.4.8-.2.8-.3.7-.4.6-.5.6-.4.4-.4.5-.3.7-.1.7 0 .8-.1.9-.2.9-.4 1.1-.4 1.1-.5.1-.7-1.1-.8-2.1-.8-3.2-.8-2.4-.6-1.8-.4-1-.3-.3-.3-.2-.4 0-.3.1-.3.2-.3.1-.4 0-.3-.3-.4-.3-.3-.5-.3-.6-.3-.7-.3-.8-.4-.9-.7-.9-.8-1-1.1-1.1-.9-.8-.9-.5-.6-.3-.6 0-.5-.1-.4-.3-.2-.4-.2-.4-.4-.5-.6-.4-.9-.3-1.1-.2-.8-.3-.6-.2-.4-.3-.2-.2-.2-.1-.1.1 0 .4 0 .4-.3.4-.5.1-.8-.1-1.1-.2-.9-.1-.8.2-.7.3-.6.6-.3.5-.2.4.1.3.2.3.2.2 0 .2 0 .2-.1.2-.3.2-.5.1-.7.2-.9.1-.6.2-.2.2 0 .3.3.3.6.2.9.2 1.3.1 1.6 0 1.2 0 .9.1.6.2.2.3.3.2.4.1.4.1.6 0 .3 0 .3.2.1.2 0 .3-.3.3-.5.1-.8.1-1.1 0-.9.1-.8.2-.7.3-.6.3.3.4 1 .3 1.8.4 2.7.3 2 .3 1.5.4 1 .3.3.4.2.4.1.3-.2.4-.3.4-.4.3-.4.2-.6.1-.6.1-.5 0-.4-.1-.3-.2-.2-.2-.3-.2-.4 0-.5 0-.7.1 0 .2.6.3 1.1.4 1.8.6.9.4.2.3-.7.2-1.4.1-1.1.2-.7.2-.4.4-.1.3.3.4.6.3 1.1.4 1.3.3 1.1.3.7.3.3.3 0 .3-.2.3-.3.2-.4.2-.7.1 0 .4.6.8 1.2 1 1.8 1.3 1.5 1 1 .6.7.4.3 0 .4.1.5.4.5.5.7.7.4.5.2.4 0 .3-.2.1-.2 0-.3-.2-.4-.4-.4-.4-.7-.6-1-.6-1.3-.7-1.4-.8-1.5-.6-1.4-.5-1.4-.4-1.3-.2-1-.3-.8-.2-.4-.3-.2-.2-.6-.2-.8-.1-1.2-.1-1.6 0-1.2-.1-.9-.1-.5-.2-.2-.2-.8-.2-1.4 0-1.9.2-2.6.2-2.1.3-1.6.4-1.2.5-.7.4-.7.5-.9.4-1 .3-1.1.2-.9.4-.8.4-.7.4-.6.6-.3.5-.2.4.1.4.2.3 0 .5-.3.6-.6.7-.9.9-.7.6-.6.5-.5.2-.3 0-.6.5-.9.9-1.3 1.3-1.6 1.8-1.2 1.5-.9 1.2-.6.8-.2.5-.2.5-.1.6 0 .6.1.6.1.3.2 0 .3-.3.4-.6.7-.9 1.2-1.1 1.5-1.4 1.8-1.6 1.5-1.2 1-.7.6-.3.2.2 0 .3-.1.5-.4.5-.4.7-.4.6-.2.6-.1.4.1.4.5-.2 1.1-.8 1.5-1.4 2.1-2 1.6-1.5 1.1-.9.6-.4.1.2 0 .3-.2.3-.4.4-.4.4-.6.6-.4.7-.6.9-.4 1-.3.7-.1.6.2.3.3.2.9-.5 1.2-1.1 1.8-1.6 2.2-2.3 1.7-1.6 1.1-.9.7-.2.2.4 0 .5-.3.6-.5.6-.8.7-.6.8-.6.9-.6 1-.4 1.2.3.4 1-.3 1.8-1.1 2.5-1.7 1.9-1.3 1.4-.8.7-.3.2.2 0 .3-.3.3-.5.4-.8.4-.6.5-.6.7-.6.8-.4.8-.1.6.2.3.5.1.8-.3.7-.3.6-.4.6-.4.4-.5.7-.6 1-.6 1.2-.7 1.5-.7 1.2-.5.8-.3.5-.1.2.2 0 .3-.3.2-.4.4-.7.3-.7.5-.6.5-.5.6-.5.7-.1.5.3.2.6 0 1.1-.3.9-.2.6-.3.4-.2.2-.3.5-.2.9-.1 1.2 0 1.6 0 1.1 0 .8.2.4.2 0 .3-.5.4-.9.4-1.3.5-1.8.4-1.9.8-1.9 1-2 1.3-2.1 1.6-1.6 1.3-1.2 1-.7.8-.2.5-.2.5 0 .5.2.6.2.6 0 .6-.4.8-.7.8-1 .9-.7 1-.6.8-.2.9 0 .8-.1.6-.1.5-.2.4-.2.2-.2.2-.1.4-.1.5 0 .6.1.4.1.4.2.3.2.2.2.2 0 .4-.2.4-.2.5-.2 1.1-.1 1.8-.1 2.4 0 3.1.1 2.2.2 1.3.4.4.4-.6.3-.7.2-.9.2-1.1 0-1.3 0-1 .1-.8.2-.4.3-.2.2-.4.1-.5.1-.6 0-.8 0-.7.2-.6.3-.5.4-.4.3-.2.3-.2.2 0 .2.2.2.4.1.7 0 1 0 1.3 0 1 .1.7.2.3.2 0 .1-.3.1-.4.1-.8 0-1 0-.8.1-.6.2-.5.3-.2.2-.5.1-.6.1-.9 0-1.1 0-.9.1-.8.2-.6.3-.5.2-.4.3-.2.3-.2.3 0 .3.5.2 1 .2 1.4.1 1.8.2 1.3.2.7.3 0 .3-.6.2-.8.2-1 .1-1.3 0-1.6 0-1.3.1-1 .2-.8.3-.5.2-.4.3-.2.3-.2.3 0 .3.4.2.7.2 1 .1 1.4.2.9.2.6.3.1.3-.3.2-.6.2-.8.1-1.1 0-1.3 0-1.1.1-.9.2-.7.3-.5.2-.4.3-.2.3-.2.3 0 .3.3.2.6.2.8.1 1.2.2.3.4-.3.4-1.2.6-1.8.5-1.4.4-1 .4-.5.3 0 .3.3.2.4.2.7.1.8.2.6.4.1.4-.2.6-.6.4-.5.3-.4.2-.4 0-.3.3-.6.7-.8 1.1-1.1 1.4-1.4 1.2-1 .7-.6.5-.2.1.2-.1.5-.5.6-.7 1-1 1.2-.7 1-.6.9-.2.7 0 .6-.1.5-.3.7-.4.6-.4.7-.4.8-.3.9-.1.9 0 1.1-.1.9-.1.6-.2.4-.2.2-.2.4-.1.6-.1.8 0 1.1.1.8.1.6.2.4.2.1.2.4.1.6.1.9 0 1.1.1 1 .3.9.4.8.4.7.4.7.3.8.1.8 0 .8.1.7.2.7.3.6.3.6.3 0 .3-.7.1-1.3.1-1.8-.1-1.5-.1-1-.1-.6-.3-.2-.2-.3-.1-.4 0-.4 0-.6 0-.4.2-.3.2-.2.3 0 .3.2.1.3.1.4 0 .6.1.5.2.6.3.5.3.6.4.3.3 0 .4-.3.3-.6.2-.8 0-1.2-.1-1.5-.3-1.8-.1-1.4 0-1 0-.5.2-.2.2.1.1.1.2.3.1.4.2.4.1.2.2.1.2 0 .1-.3.1-.7.1-1 0-1.3 0-1 .1-.8.2-.4.3-.2.2-.3.2-.5.1-.5.2-.7.1-.5.3-.2.3-.1.4.2.3-.2.2-.7.1-1.1 0-1.6 0-1.2.1-.9.1-.4.2-.2.4.3.5.8.7 1.2.9 1.6.6 1.4.5 1.1.2.8 0 .6.1.4.1.4.2.3.2.2.2.2.1.4.1.5 0 .6.1.4.1.4.2.3.2.2.2.2.1.4.1.5 0 .6.1.6.3.8.4.8.4.9.4 1 .3.8.1.9 0 .8.1.8.3.9.4.9.4.9.4 1 .3 1 .1 1 0 1.1.1 1 .3.9.4.7.4.7.4.9.3 1 .1 1.1 0 1.3.1 1.1.1.7.2.5.2.2.2.5.1.9.1 1.2 0 1.6-.7 1.8-1.5 2.3-2.1 2.5-2.9 2.9-2.2 2.1-1.6 1.5-1 .7-.3 0-.6.4-1 .7-1.4 1.1-1.7 1.6-1.4 1.1-1.3.9-1 .6-.8.2-.9.5-1 .6-1.1.8-1.2 1-1.4 1-1.6 1-1.8 1-2 1-1.7.4-1.3-.2-1-.8-.7-1.3-.7-1.2-.6-.9-.5-.7-.5-.6-.3-.4-.2-.3 0-.3.2-.2.3 0 .3 0 .4.1.6.3.4.1.4-.1.4-.2.3-.4.1-.3 0-.4-.1-.3-.3-.3-.4-.3-.5-.2-.6-.2-.7-.1-.5-.3-.2-.5 0-.6.3-.8-.1-.8-.4-.9-.7-.8-1.1-.8-1-.6-.9-.4-.9-.2-.8 0-.7.1-.7.3-.5.4-.4.4-.6.4-.6.3-.7.1-.8 0-.8-.1-.6-.1-.6-.2-.5-.2-.5-.1-.4 0-.3.3-.3.3 0 .6.3.6.7.8 1 .9.7.8.4.6 0 .4-.2.3-.2.5-.1.8-.1 1 0 1.3.2 1.1.4.9.5.7.8.6.4.4.2.5-.1.4-.3.3-.5.3-.6.2-.7.1-.8 0-1.1.5-1.2 1-1.5 1.5-1.7 2-1.4 1.6-1.1 1.1-.7.7-.6.2-.5.2-.7.1-.7.1-.8 0-.7.1-.5.1-.3.2-.2.2-.6.1-1-.1-1.4-.4-1.8-.4-1.4-.5-1-.4-.6-.3-.2-.2-.4-.2-.5-.1-.6-.1-.8 0-.9-.2-.8-.4-1-.5-.9-.8-1-.5-1.1-.2-1.3 0-1.3.2-1 0-.7-.2-.4-.4-.2-.7-.2-.6-.5-.6-.6-.5-.7-.4-.6-.5-.4-.5-.1-.5 0-.6.1-.7.2-.8.4-.8.5-1 .2-.9-.2-.8-.5-.7-.8-.6-.7-.4-.5-.3-.5-.1-.3 0-.4.1-.4.3-.5.4-.6.6-.4.7-.3.8-.1.9 0 1.1.1.9.3.8.4.6.4.4.4.5.1.7-.1.7-.2.8-.4.8-.6.9-.7.8-.9.9-.8.6-.7.5-.6.2-.6 0-.8-.4-1-.9-1.2-1.3-1.4-1.8-1.3-1.4-1.2-1-.9-.6-.8-.2-.7-.3-.6-.3-.5-.4-.4-.3-.3-.4-.2-.3 0-.4 0-.3.1-.3.2-.2.4-.2.5-.2.4-.3.2-.4.2-.4 0-.6 0-.5.1-.4.2-.2.3-.2.1-.5 0-.7-.1-1.1-.3-1.3 0-1.1.1-.9.3-.6.5-.4.4-.4.2-.4.2-.4 0-.3-.3-.2-.4 0-.7 0-.8.2-.9 0-.7-.1-.8-.4-.7-.4-.7-.4-.9-.3-1-.1-1.1 0-1 .2-.9.4-.9.6-.8.8-.7.8-.5.7-.4.6-.2.6-.2.4 0 .4.2.3.2.2.3.4.2.6.3.8.2 1.1.3.9.4.8.5.6.4.6.3.5-.1.7-.3.8-.7.9-.7.7-.8.6-1 .4-1.1.2-.8.4-.7.4-.5.5-.3.7-.4.5-.3.3-.5.3-.4.1-.7-.1-1-.3-1.2-.5-1.5-.8-1.2-.7-1-.6-.7-.6-.4-.4-.6-.5-.6-.4-.7-.3-.8-.2-.7-.3-.7-.4-.5-.5-.4-.4-.7-.6-.9-.4-1.1-.6-1.3-.4-1.3-.7-1.2-.7-1.2-.9-1.2-1-1.1-.8-1-.6-.9-.5-.8-.2-1.2-.8-1.5-1.2-1.8-1.8-2.2-2.2-1.8-1.8-1.5-1.3-1-.9-.7-.3-.6-.5-.5-.5-.4-.5-.3-.7-.4-.5-.5-.5-.6-.5-.7-.3-.5-.8-.4-1.1-.1-1.4 0-1.8.1-1.6.2-1.4.4-1.2.5-.9.4-.9.2-.9.2-.8 0-.8.1-.8.2-.8.4-.7.5-.7.4-.7.2-.7.2-.8 0-.8 0-.7.1-.5.2-.3.3-.2.2-.3.1-.4.1-.4 0-.6.1-.7.2-.7.4-.9.5-.9.4-.9.2-.9.2-.8 0-.8.4-1.6 1-2.4 1.6-3.3 2-4 1.5-3 1.2-2.2.8-1.3.4-.4.3-.3.4-.2.3 0 .3 0 .6.4.9.9 1.3 1.3 1.4 1.7 1.2 1.2.8.6.4 0 .1-.6-.1-.5-.2-.5-.4-.5-.5-.6-.3-.4-.2-.5 0-.5.2-.4.3-.2.4.1.5.4.7.6.6.7.5.8.6 1 .4 1 .4.8.3.8.1.7 0 .6.1.5.1.4.3.4.3.3.2-.1.3-.6.1-.9.2-1.4 0-1.1-.1-.8-.1-.5-.3-.3-.1-.2 0-.2 0-.1.2-.2.3.2.4.3.5.7.7.8.5 1.1.4 1.4.4 1.6.2 1.8.3 1.4.3 1.1.3.7.3.3.2-.3.3-.7.1-1.4.2-1.8.1-1.5.2-1 .1-.5.2-.2.3.3.2.7.4 1 .3 1.4.4 1.2.3.8.3.5.2.2.2.5.2.7.1 1.1.1 1.4.1.8.2.3.3-.4.4-.8.3-.9.2-1 .1-.9 0-1-.1-.8-.1-.6-.2-.4-.3-.2-.1-.3 0-.3 0-.4.2-.4.3-.2.2.1.4.4.3.6.4 1.1.3 1.6.3 2.1.2 2.6.3 1.9.2 1.3.2.6.2 0 .2-.4.3-.7.3-1.1.4-1.4.4-.9.4-.2.4.3.4.8.4 1.1.2 1.2.2 1.5.1 1.6.1.9.2.1.3-.6.4-1.4.3-1 .4-.7.3-.4.3 0 .3.8.4 1.4.3 2.2.3 2.8.3 2 .4 1 .3.1.4-.8.3-1.2.2-1.5.1-2 0-2.3-.1-1.8-.1-1.2-.2-.7-.3-.2-.2-.3-.1-.4 0-.4 0-.6-.2-.7-.2-.8-.4-.8-.5-1-.3-.8-.2-.6 0-.3.2-.2.3.1.3.2.4.3.4.5.4.3.2.2.2.1.2-.2-.1-.3-.2-.6-.3-.7-.5-1-.5-.9-.5-.7-.5-.6-.5-.4-.4-.4-.2-.4-.1-.4 0-.3-.2-.4-.4-.5-.6-.6-.7-.7-.6-.5-.3-.5-.1-.3.2-.2.1 0 .2 0 .1.1.2.3.2.1.2.1.2 0 .2-.2-.3-.4-.7-.9-1.1-1.2-1.6-1.6-1.9-1.4-2.2-1.4-2.6-1.3-2.9-1.2-2-.9-1-.6 0-.4.9-.2 1.2.1 1.5.3 1.7.6 2 .7 1.3.4.7 0 0-.5-.7-.8-.5-.6-.2-.5-.1-.4.2-.2.5.2.8.5 1.2.9 1.4 1.3 1.1.9.9.6.6.4.3 0 .2-.2-.1-.3-.3-.4-.4-.6-.3-.4-.1-.4-.1-.3.2-.2.1-.1.3-.1.2 0 .3 0 .4.1.4.2.4.4.4.5.4.4.4.2.4.1.4-.1.1-.3-.2-.5-.5-.8-.7-1-.5-.8-.3-.6-.1-.4.2-.2.7.4 1.2.9 1.8 1.5 2.2 2 1.7 1.4 1.2.8.6.2.1-.4-.1-.5-.2-.7-.4-.8-.5-1-.5-.9-.5-.7-.5-.6-.5-.4-.3-.4-.2-.3 0-.3.2-.2.7.5 1.2 1 1.7 1.6 2.2 2.3 1.7 1.7 1.2 1.1.8.6.3 0 0-.5-.3-.9-.6-1.4-.9-1.8-.7-1.4-.4-1-.1-.6.2-.2.6.3.9.7 1.2 1.2 1.7 1.6 1.2 1.3.8 1 .4.6 0 .3.1.4.3.4.4.5.6.6.4.2.2-.1.1-.6-.2-.8-.2-.9-.3-.7-.4-.8-.5-.7-.3-.5-.2-.5-.1-.3.2-.2.2 0 .3 0 .5.1.6.3.5.3.4.5.5.6.3.7.7.8.9 1 1.2 1.1 1.4 1.2.9.5.3-.3-.2-1-.7-1.8-1.1-1.9-1.6-2-1.8-2.1-2.3-2.2-1.6-1.7-1-1.3-.4-.8.3-.3-.1-.4-.4-.6-.7-.7-1.1-.8-.9-.6-.9-.4-.6-.2-.6 0-.6-.1-.6-.3-.7-.4-.7-.4-.7-.4-.9-.3-1-.1-1.1 0-.8-.1-.6-.1-.4-.2-.2-.2-.7-.2-1.1-.1-1.6-.1-2.1 0-1.5.1-1.2.1-.6.2-.2.2-.5.2-.7.1-1.1.1-1.3 0-1 .1-.8.1-.4.2-.2.2-.5.3-.7.2-1.1.3-1.3.2-1.1.3-1 .4-.9.5-.7.4-.5.4-.5.2-.3 0-.2-.1.2-.3.4-.6.8-.7 1.2-.9 1.2-1 1.4-.8 1.5-.9 1.6-.8.9-.6.3-.5-.4-.3-1.2-.1-1.1 0-1 .2-1 .4-1 .4-.8.4-.6.1-.3 0-.2-.2 0-.2.2-.3.2-.3.4-.4.4-.3.5-.2.5 0 .6 0 .7-.2 1-.4 1.3-.6 1.4-.7 1.4-.6 1.2-.4 1.2-.2 1.2-.1.8-.1.5-.3.3-.3-.1-.3-.7-.3-1.3-.2-1.9-.1-2.6 0-2 0-1.3-.1-.7-.2-.2-.2 0-.2.2-.3.2-.3.4-.4.5-.3.6-.2.7 0 .8 0 .6-.1.5-.1.4-.2.2-.3.7-.2 1.2-.1 1.8 0 2.3 0 1.8-.1 1.1-.1.6-.1 0-.2-.1-.2-.3-.1-.3 0-.6 0-.4-.1-.4-.1-.3-.2-.2-.2-.5-.2-.8-.1-1.1-.1-1.3 0-1 0-.7-.1-.4-.2-.2-.2.1-.2.3-.3.5-.3.7-.4.7-.3.9-.2.9 0 1 0 .8-.1.6-.1.4-.2.2-.3.4-.2.8-.1 1 0 1.3 0 1-.1.7-.1.3-.1 0-.2-.1-.2-.3-.1-.3 0-.6 0-.4-.1-.5-.2-.5-.4-.4-.4-.1-.4.3-.2.6-.2.9-.2.7-.1.6-.2.4-.2.2-.3.5-.2.9-.1 1.2 0 1.6 0 1.1-.1.8-.1.4-.1 0-.2-.1-.2-.3-.1-.3 0-.6 0-.4-.1-.4-.1-.3-.2-.2-.2-.9-.2-1.4-.1-1.9-.1-2.6 0-2 .1-1.3.1-.8.2-.2.2-.4.2-.5.1-.6.1-.8 0-.7.1-.5.1-.4.2-.3.2-.1.3-.1.4-.1.5.1.4-.1.4-.3.2-.5 0-.7-.1-.4-.3-.2-.5.2-.7.4-.9 0-.5-.4-.2-.9.2-1.3.4-1.2.7-1.1.7-1.1.9-.9 1-.8.7-.6.4-.5 0-.3-.2-.5.1-.9.5-1 1-1.3 1.3-1 1-.7.9-.3.5 0 .3-.1.4-.3.4-.4.4-.4.4-.6.6-.4.7-.6.9-.4 1-.5 1.1-.5 1.4-.4 1.5-.3 1.7-.5.7-.5-.1-.6-1-.7-1.9-.7-1.5-.6-.9-.5-.5-.5.1-.3-.1-.1-.2 0-.4.3-.6.1-.4-.1-.2-.2 0-.4.2-.4-.1-.3-.4-.4-.6-.4-.9-.7-1.1-.9-1.1-1.3-1.2-1.6-1.3-1.2-.9-.9-.4-.7.1-.3.4-.5.2-.8-.3-.9-.6-1.2-1-1-.7-.8-.5-.6-.2-.3.1-.3.1 0 .1.1.2.2.3.2.2 0 .2 0 .2-.1.2-.4 0-.5-.1-.8-.4-1-.4-1.1-.4-1.3-.3-1.4-.1-1.6 0-1.2.1-.9.1-.5.2-.2.2-.3.2-.4.1-.4.1-.6 0-.3.1 0 .2.2.4.5.4.7.3.9.2 1.1.2 1.3 0 1.2 0 .9.2.8.3.7.4.4.3.3.3 0 .2-.1.2-.3.2-.5.1-.6 0-.8 0-.6 0-.4.1-.3.2 0 .2.6.2 1.2.4 1.7.4 2.3.5 1.9.5 1.3.4.9.4.3.4.3.3.1.3 0 .2-.1.2-.4.1-.6 0-.8-.2-1.1-.2-1-.1-.9 0-.9.3-.8.3 0 .4.8.3 1.6.4 2.3.3 1.9.3 1.4.4.9.3.3.4.3.3.1.3 0 .2-.1.2-.5.2-.9.1-1.2.2-1.7.1-.7.2.1.4 1 .4 1.9.6 1.5.5 1.1.5.8.4.3.4.3.3.1.3 0 .2-.1.2-.2.1-.2 0-.2-.2-.2-.2-.5-.2-.7 0-.9 0-1.1.1-.6.2-.2.2.4.3.9.3 1 .6 1.3.9 1.4 1.1 1.7 1.4 1.1 1.2.8.7.2.5-.2.1-.3-.1-.6-.3-.8-.5-.9-.8-.8-.5-.8-.4-.6-.2-.6 0-.7-.1-.7-.3-.9-.4-.9-.4-1.6-.6-2.2-.4-2.9-.6-3.6-.4-2.8-.3-2.2 0-1.4.3-.7.4-.7.4-.9.3-1 .1-1.1 0-.9.1-.9.3-.8.4-.7.4-.7.5-.9.4-1 .3-1.1.2-.8.3-.7.3-.5.4-.3.3-.2.3-.1.3.1.1.2.1.1-.1.2-.1 0-.1.1-.3.1-.1.2 0 .2 0 .2.2.1.3 0 .2-.3.4-.3.3-.5.3-.4 0-.5-.1-.6-.2-.4-.1-.2 0 0 .3.2.3 0 .4-.3.4-.4.4-.7.3-1.1 1-1.5 1.4-1.9 2-2.3 2.6-1.7 2-.9 1.3zM161 208.7l0 .3-.1.3-.2.2-.4.2-.4.1-.6.4-.8.7-1 1-1.2 1.2-1 .9-.8.6-.7.2-.4-.1-.1-.3.3-.4.6-.6 1-.8.8-.6.5-.5.3-.5 0-.3.1-.4.3-.4.5-.6.6-.6.6-.5.5-.2.5-.1.4.2.4.1.2.3zM250 180.1l0 .6.1.4.1.4.2.3.2.2.2.4.1.8.1 1 0 1.3.1 1.1.1.7.2.5.2.2.2.4.1.6.1.8 0 1.1.1.9.1.6.2.4.2.2.3.9.2 1.8.3 2.5.2 3.3.3 2.6.2 1.7.3 1 .2.2.2 1.6 0 3.1 0 4.5-.1 5.9-.2 4.4-.3 2.8-.4 1.3-.6-.2-.6-.2-.8-.1-.9-.1-1.1 0-.8-.1-.6-.1-.4-.2-.2-.2-3.5-.2-6.6-.2-10-.2-13.2-.1-9.6-.3-6.2-.4-2.6-.5.8-.7 1.1-.7 1.4-.7 1.6-.8 1.8-.7 1.5-.8 1.3-.7.9-.8.7-.7.6-.6.5-.4.4-.1.3 0 .4-.2.5-.4.6-.6.7-.7.6-.6.5-.4.4-.1.3 0 1.4-1.2 2.4-2.3 3.5-3.4 4.6-4.6 3.4-3.5 2.3-2.4 1.2-1.4 0-.3.1-.4.4-.5.6-.6.7-.7.6-.6.4-.5.2-.4 0-.3.9-1.1 1.8-2 2.7-2.8 3.6-3.6 2.8-2.7 1.9-1.7 1-.9.2.2.2.2.1.3zM79.4 178.1l.4-.2 2.5 2.1 4.4 4.3 6.5 6.6 8.4 8.7 6.4 6.6 4.4 4.4 2.3 2.2.3 0 .4.1.5.4.6.6.7.7.6.6.5.4.4.2.3 0 .5.2.6.5.8.7.9 1 .8.8.6.5.5.3.3 0 .4.1.4.2.4.4.4.5.5.4.7.4.7.3.8.3.8.3.9.5.8.6.9.7.4.5 0 .4-.5.3-.9.1-.8.2-.6.2-.3.2-.2.2-.7.2-1.3.1-1.8.1-2.3 0-1.8.1-1.2.1-.7.2-.2.2-.9.3-1.7.2-2.3.3-3.1.2-2.3.3-1.6.2-.9.3-.2.2-.4.2-.6.1-.8.1-1 0-.8.1-.6.1-.5.2-.2.2-.3.1-.4-.2-.4-.4-.4-.7-.3-.6-.3-.6-.1-.6-.1-.7-1.4-.4-2.7-.3-4-.2-5.3 0-4 .3-2.7.7-1.3 1.1-.1 1.3 0 1.1.1.8.2.5.2.2.2.2.1.4.1.5 0 .6-.1.5-.2.4-.4.5-.4.3-.4.1-.2-.3-.2-.6-.2-.9-.1-.8-.2-.6-.2-.3-.3-.2-.2-1.8-.1-3.4 0-4.9 0-6.6 0-5 .1-3.3.2-1.8.3-.2.2-1.2.3-2.1.2-3.1.3-4.1.2-3.1.3-2.1.2-1.1.3-.2.2-.7.3-1.3.2-1.8.3-2.3.3-1.7.3-1.3zM246.5 125.1l1.2-.2 1 0 .7.1.5.1.2.3.3.2.4.1.4.1.6 0 .4 0 .3.1.2.2.1.3-.1.2-.4.1-.7.1-.9.1-1-.1-1.1-.1-1-.4-1.2-.4-.5-.4 0-.2zM243.5 99.9l.2.2.1.1 0 .3-.1.3-.2.4 0 .3.1.3.3.1.4.2.3.2.2.4 0 .6-.1.7-.2.5-.2.3-.3.2-.3 0-.3-.2-.4-.3-.3-.4-.4-.7-.2-.6 0-.7.2-.6.4-.7.3-.5.3-.3zM71.2 92.1l.9-.2.8.1.6.1.6.3.3.4.1.4-.1.3-.4.2-.7.1-.7 0-.6-.2-.7-.3-.6-.4-.2-.4.1-.2z"/></svg><svg x="260" y="0" width="260" height="236" viewBox="40 0 260 236" overflow="hidden"><clipPath id="kac5"><path clip-rule="evenodd" d="M40 0H300V236H40Z M40 185H66V236H40Z M294 185H300V236H294Z"/></clipPath><g clip-path="url(#kac5)"><path d="M196 58.4l-.2.2-.7.2-1.1.1-1.6.1-2.1 0-1.5.1-1.2.1-.6.2-.2.2-.5.3-.7.2-1.1.3-1.3.2-1.5.5-1.6.6-1.9.8-2 1-2 1.3-2.2 1.5-2.2 1.8-2.3 2.1-1.8 1.6-1.1 1.2-.6.7 0 .3-.2.4-.4.5-.5.6-.8.7-.8 1-.9 1.4-.9 1.6-1 2-.7 1.7-.6 1.3-.2.9 0 .6-.1.6-.3.8-.4.8-.4.9-.4 1.3-.3 1.5-.1 1.7 0 2.1-.1 1.6-.1 1.2-.2.7-.2.2-.2.3 0 .2.2.2.2.2.2.6.1 1.2.1 1.5 0 2.1.1 1.6.1 1.1.2.7.2.2.3.4.2.8.3 1 .2 1.3.5 1.5.6 1.7.8 1.8 1 2 1.3 2.1 1.5 2.1 1.8 2.3 2.1 2.3 1.6 1.7 1.2 1.2.7.6.3 0 .4.1.5.4.6.6.7.7 1 .8 1.4.9 1.6.9 2 1 1.7.8 1.3.5.9.3.6 0 .6.1.8.2.8.4.9.5 1.3.4 1.5.2 1.7.2 2.1 0 1.6 0 1.2.1.7.2.2.3.3.1.2 0 .2-.1.2-.3.6-.2 1.2-.1 1.5 0 2.1 0 1.6-.1 1.1-.1.7-.2.2-.3.4-.2.8-.3 1-.2 1.3-.3 1.5-.4 1.7-.6 1.8-.9 2-1 2.1-1.2 2.1-1.5 2.3-1.8 2.3-2.1 1.7-1.6 1.2-1.2.6-.8 0-.3.1-.4.4-.5.6-.6.7-.7.8-1 .9-1.3.9-1.7 1-2 .8-1.6.5-1.3.3-.9 0-.6.1-.7.2-.7.4-.9.5-.9.4-1.2.2-1.5.2-1.8 0-2.1 0-1.6.1-1.1.2-.7.3-.3.1-.2 0-.2-.1-.2-.3-.2-.2-.7-.1-1.1 0-1.6 0-2.1-.1-1.5-.1-1.2-.2-.6-.3-.2-.2-.5-.3-.7-.2-1.1-.3-1.3-.4-1.5-.6-1.6-.9-1.9-1-2-1.2-2-1.5-2.2-1.8-2.2-2.1-2.3-1.6-1.8-1.2-1.1-.8-.6-.3 0-.4-.2-.5-.4-.6-.5-.7-.8-1-.8-1.3-.9-1.7-.9-2-1-1.6-.7-1.3-.6-.9-.2-.6 0-.7-.1-.7-.3-.9-.4-.9-.4-1.2-.4-1.5-.3-1.8-.1-2.1 0-1.6-.1-1.1-.1-.7-.2-.3-.2-.2-.2-.2 0z" transform="translate(16 -14)"/><path d="M129.4 337.8l.2 1.1.5.9.6.9.9.6 1.1.6 1 .4 1.1.3 1 .2 1.1 0 .9-.1.6-.1.4-.2.2-.3 6.2-.2 12.2-.1 18.3 0 24.3 0 18.3 0 12.3.1 6.2.2.2.3.4.2.6.1.8.1 1.1 0 .9-.1.6-.1.4-.2.2-.3.2-.2.4-.1.5 0 .6 0 .5-.3.6-.4.5-.6.6-.8.4-.9.1-.9 0-1-.3-1.1-.4-.9-.7-.8-.8-.7-1.1-.6-1.2-.4-1.4-.3-1.6-.1-1.8 0-1.4-.1-1-.1-.7-.2-.3-.2-.2-.1-.2 0-.1.3-.1.3-.2.3-.2.3-.4.2-.4.1-.4 0-.3-.2-.3-.4-.3-.4-.3-.3-.3 0-.4.3-.4.4-.4.4-.4.3-.4.1-.3 0-.3-.1-.4-.3-.5-.4-.5-.4-.4-.3-.3.1-.1.3-.1.7-.2.5-.2.3-.4.3-.4.1-.4 0-.4-.1-.4-.3-.4-.3-.3-.5-.2-.5-.2-.5-.2-.7-.2-.2-.2 0-.4.4-.4.8-.4.4-.4.1-.3-.2-.2-.4-.4-.4-.4-.3-.4-.1-.6 0-.5.1-.4.3-.2.4-.2.4-.2.3-.2 0-.3-.3-.2-.4-.3-.3-.4 0-.4.3-.6.4-.4.3-.6 0-.4-.3-.6-.4-.4-.3-.4 0-.4.3-.3.4-.3.3-.3 0-.2-.3-.3-.4-.3-.3-.4 0-.4.3-.5.4-.5.3-.6 0-.7-.3-.7-.4-.6-.4-.5-.1-.4.1-.3.2-.3.1-.2-.1-.2-.4-.2-.4-.2-.3-.2 0-.3.3-.2.4-.3.4-.3.3-.3.1-.3 0-.3-.2-.2-.4-.2-.5-.2-.8-.2-.4-.2-.1-.3.2-.2.4-.4.4-.4.3-.4.1-.6 0-.5.1-.4.1-.3.2-.3.2-.2.4-.2.5-.2.6-.2.8-.2.5-.2.3-.2.1-.2-.1-.1-.3-.1-.5-.1-.7-.1-.9-.1-.6-.2-.3-.2 0-.2.2-.3.2-.2 0-.3-.2-.2-.2-.3-.2-.4 0-.4.2-.6.2-.4.2-.4 0-.3-.2-.2-.2-.3-.2-.3 0-.3.2-.3.2-.3.1-.3-.1-.2-.4-.3-.4-.2-.2-.3.1-.2.4-.3.8-.2.3-.3 0-.2-.3-.3-.8-.2-.4-.2-.1-.2.2-.2.4-.3.4-.4.1-.4-.1-.6-.2-.7-.1-.8.1-.8.4-1 .4-.9.3-.7.1-.5-.2-.4-.3-.3-.5-.2-.5-.2-.5-.2-.7-.2-.1-.4.3-.6.8-.7 1.2-.7.8-.9.4-.9-.1-1-.4-.9-.3-.8 0-.6.3-.6.4-.5.2-.4-.1-.2-.4-.2-.8-.2-.3-.3 0-.3.3-.3.8-.3.3-.2 0-.2-.3-.2-.8-.2-.4-.3-.1-.3.2-.3.4-.3.3-.2 0-.2-.3-.2-.4-.2-.4-.3-.1-.3.1-.3.2-.3.1-.2-.1-.2-.4-.2-.4-.2-.3-.2 0-.3.3-.2.4-.4.4-.4.1-.4-.1-.6-.2-.5-.1-.4.1-.2.4-.2.4-.3.3-.3 0-.4-.3-.6-.4-.4-.4-.4-.1-.4.1-.3.2-.3.1-.4-.1-.5-.4-.5-.4-.4-.3-.3.1-.1.3-.1.7-.1.5-.1.3-.2.3-.2.1-.2 0-.2-.2-.2-.4-.3-.4-.2-.2-.3.1-.2.4-.3.8-.2.4-.2.1-.2-.2-.2-.4-.4-.4-.5-.1-.6.1-.8.2-.7 0-.7-.2-.5-.5-.4-.8-.4-.4-.4-.1-.3.2-.2.4-.3.3-.3 0-.3-.3-.3-.4-.3-.3-.2 0-.2.3-.2.4-.4.4-.5.3-.6.1-.8 0-1 .3-1 .5-1.2.8-1.3 1.1-1 1-.5 1.1zM85.4 312.8l.2 1.1.5.9.6.9.9.6 1.1.6 12.6.4 24.4.3 35.9.2 47.6 0 35.7-.1 23.9-.1 12-.2.2-.3.2-.2.4-.1.5 0 .6 0 .5-.3.6-.4.5-.6.6-.8.4-.7.3-.7.2-.6 0-.6-.2-.6-.3-.7-.4-.8-.6-.8-.5-.6-.6-.4-.5-.2-.6 0-.5-.1-.4-.1-.2-.2-.2-.2-.5-.2-.7-.1-1-.1-1.2 0-1-.1-.8-.1-.5-.2-.2-.2-.3-.1-.3.1-.3.4-.3.4-.3.3-.4 0-.5-.3-.5-.4-.4-.3-.4 0-.2.3-.2.4-.3.4-.5.3-.6.1-.8 0-.6.1-.5.1-.5.2-.3.2-.3 0-.2-.2-.2-.5-.2-.8-.3-.4-.3-.1-.4.2-.6.4-.4.4-.3.2-.3 0-.2-.1-.1-.3-.1-.3-.1-.5-.1-.7-.1-.3-.2-.1-.2.3-.2.4-.4.4-.4.1-.4-.1-.6-.2-.5-.1-.4.1-.2.4-.2.4-.3.4-.4.3-.4.1-.6 0-.5-.1-.4-.3-.2-.4-.2-.4-.3-.4-.4-.1-.4.1-.6.2-.5.1-.5-.1-.5-.4-.4-.4-.5-.4-.4-.2-.4-.1-.3.1-.4.2-.2.4-.2.5-.1.7-.3.3-.4 0-.6-.4-.8-.8-.7-.4-.6-.1-.5.2-.6.4-.4.4-.4.1-.3-.1-.2-.2-.3-.2-.3 0-.3.2-.3.2-.3.1-.3-.1-.2-.4-.3-.4-.2-.2-.2.1-.2.4-.2.8-.2.4-.2.1-.3-.2-.2-.4-.3-.3-.2 0-.3.3-.2.4-.3.3-.2 0-.3-.3-.2-.4-.5-.3-.6 0-.8.3-1 .4-.8.3-.6 0-.5-.3-.2-.4-.3-.4-.3-.1-.3.1-.3.2-.3.2-.3 0-.2-.2-.3-.2-.3 0-.3.4-.4.7-.4 1-.4.6-.4.1-.3-.3-.2-.8-.4-.3-.5 0-.7.3-.8.8-.7.3-.5-.1-.3-.6-.2-1-.2-.6-.3-.1-.3.3-.3.8-.3.4-.4.1-.4-.2-.4-.4-.5-.5-.4-.3-.5-.2-.4-.1-.3-.2-.3-.3-.1-.3-.1-.3-.1-.2-.3-.1-.3.2-.3.3-.4.4-.2.5-.2.6-.1.7-.2.4-.2.1-.2-.3-.2-.4-.4-.3-.4 0-.4.3-.6.4-.5.2-.5-.1-.5-.4-.4-.8-.5-.5-.5-.2-.4 0-.6.2-.4.2-.4 0-.3-.2-.2-.2-.3-.2-.3 0-.3.2-.3.2-.3.1-.2-.1-.2-.4-.2-.4-.2-.2-.2.1-.3.4-.2.8-.3.5-.2.2-.3 0-.2-.2-.4-.2-.4 0-.4.2-.6.2-.6.1-.7-.1-.7-.4-.7-.4-.6-.2-.5.1-.3.4-.2.8-.2.4-.2.1-.3-.2-.2-.4-.4-.4-.5-.1-.7.1-.8.2-.7.1-.5-.1-.3-.4-.2-.4-.2-.3-.2 0-.3.3-.2.4-.4.4-.5.1-.7-.1-.8-.2-.8-.1-.6.1-.6.4-.5.4-.5.2-.6-.3-.7-.6-.7-1-.5-.6-.5-.1-.4.3-.2.8-.3.4-.2.1-.3-.2-.2-.4-.3-.4-.3-.1-.3.1-.3.2-.3.1-.4-.1-.5-.4-.5-.4-.4-.3-.4 0-.3.3-.3.4-.2.3-.3 0-.2-.3-.3-.4-.3-.2-.3.1-.4.4-.4.8-.4.4-.4.1-.4-.2-.3-.4-.3-.4-.3-.1-.2.1-.3.2-.3.2-.4.1-.4.1-.5 0-.4.1-.4.3-.2.4-.2.4-.3.3-.3 0-.4-.3-.6-.4-.4-.4-.4-.3-.4-.1-.3 0-.3.1-.2.3-.2.4-.2.4-.3.3-.4 0-.4-.3-.6-.4-.5-.2-.4.1-.2.4-.2.8-.2.4-.2.1-.3-.2-.2-.4-.4-.4-.5-.3-.7-.1-.8 0-.7-.1-.7-.3-.5-.4-.4-.4-.5-.4-.5-.1-.4.1-.6.2-.5.2-.5 0-.5-.2-.6-.2-.5-.1-.4.1-.2.4-.2.4-.3.4-.4.3-.4.1-.6 0-.5-.1-.4-.1-.3-.2-.3-.2-.3-.1-.4.1-.4.4-.5.4-.5.1-.5-.4-.4-.8-.4-1.2-.5-.7-.5-.1-.4.4-.6 1-.4.7-.3.4-.3.1-.2-.2-.2-.1-.3 0-.3.1-.4.2-.3 0-.3-.1-.2-.4-.2-.4-.3-.3-.3 0-.4.3-.6.4-.4.4-.4.3-.4.1-.3 0-.3-.1-.4-.3-.4-.4-.4-.4-.6-.4-.6-.1-.7.1-.8.2-.7.1-.5-.1-.4-.4-.3-.4-.2-.3-.1.1-.1.3-.1.7-.1.5-.1.3-.2.3-.2.1-.2 0-.2 0-.2-.2-.3-.2-.3-.1-.3.1-.4.4-.4.4-.5.4-.4.2-.5 0-.4-.1-.3-.3-.3-.5-.1-.7-.1-.9-.1-.5-.2-.2-.2.2-.2.4-.3.3-.3 0-.3-.3-.3-.4-.3-.2-.2.1-.2.4-.2.8-.3.4-.3.1-.4-.2-.6-.4-.5-.3-.5 0-.5.3-.6.4-.6.2-.5-.1-.5-.4-.5-.8-.5-.3-.5 0-.4.3-.4.8-.4.5-.4.4-.4.2-.3 0-.2-.1-.3-.2-.1-.4-.2-.4-.1-.3-.3-.3-.3-.1-.4-.1-.3.2-.3.5-.2.7-.2 1-.2.7-.2.5-.2.1-.2-.1-.1-.4-.1-.6-.1-.9-.1-1.1-.2-.7-.3-.3-.3.1-.6.4-.4.3-.4 0-.3-.3-.2-.4-.3-.4-.3-.1-.3.1-.3.2-.3.2-.4 0-.5-.2-.5-.2-.5-.1-.5 0-.6.2-.6.3-.4.3-.4.4-.2.4-.1.4-.2.3-.1.2-.2-.1-.2-.2-.2-.1-.3 0-.3.1-.4.2-.3 0-.3-.1-.2-.4-.2-.4-.2-.4-.3-.3-.3-.1-.3 0-.3.1-.3.3-.2.4-.3.4-.2.3-.2 0-.2-.3-.2-.4-.3-.4-.4-.1-.4.1-.6.2-.5.1-.4-.1-.3-.4-.3-.4-.2-.3-.2 0-.1.2-.2.4-.4.6-.8.8-1.1.9-1.4 1.2-1.1 1.1-.6 1.1zM62.4 288.8l.2 1.1.5.9.6.9.9.6 1.1.6 15.6.4 30.2.3 44.7.2 59.3 0 44.6-.1 29.7-.1 15-.2.2-.3.2-.2.4-.1.5 0 .6 0 .5-.3.6-.4.5-.6.6-.8.4-.9.1-.9 0-1-.3-1.1-.2-.8-.3-.7-.3-.5-.3-.3-.4-.3-.4-.1-.5-.1-.6 0-.5-.1-.5-.3-.5-.4-.4-.4-.4-.4-.4-.1-.3.1-.2.2-.4.2-.5.1-.6.1-.8 0-.6-.1-.5-.1-.5-.2-.3-.2-.2-.1-.2 0-.1.3-.1.3-.2.3-.2.3-.4.2-.4.1-.4 0-.5 0-.5-.2-.5-.2-.4-.3-.4-.4-.3-.5-.3-.4-.2-.2-.2.1-.2.4-.2.8-.4.4-.5.1-.6-.2-.8-.4-.7-.2-.5.1-.4.4-.3.8-.2.3-.2 0-.2-.3-.2-.8-.2-.5-.3-.2-.3 0-.3.2-.3.2-.2 0-.2-.2-.2-.2-.2-.2-.2 0-.3.2-.2.2-.3.2-.3 0-.3-.2-.3-.2-.3-.1-.3.1-.2.4-.3.4-.2.3-.2-.1-.1-.4-.2-.7-.1-.5-.3-.4-.3-.2-.4-.1-.3.1-.2.3-.1.4-.1.7-.2.5-.4.5-.4.5-.7.3-.5.2-.4-.1-.4-.3-.2-.4-.3-.4-.3-.3-.3-.1-.3 0-.3.1-.2.3-.2.4-.2.4-.2.3-.2 0-.3-.3-.2-.4-.3-.4-.3-.3-.3-.1-.3 0-.3.1-.3.3-.2.4-.3.4-.2.2-.2-.1-.2-.4-.2-.8-.2-.4-.2 0-.2.3-.2.7-.2.5-.3.4-.3.2-.4.1-.3-.2-.3-.5-.3-.7-.3-1-.3-.6-.3-.1-.4.3-.4.8-.5.4-.4.2-.4-.2-.3-.4-.4-.1-.2.1-.2.4-.1.7-.2.4-.3.1-.4-.3-.6-.4-.5-.4-.5-.1-.5.1-.6.2-.5.1-.4-.1-.3-.4-.3-.4-.2-.2-.1.2-.1.5-.1.9-.1.7-.1.5-.2.3-.2.1-.2-.3-.3-.7-.4-1-.4-1.6-.4-1-.4-.6-.4-.2-.3.2-.3.4-.2.5-.2.6-.2.8-.2.3-.2 0-.3-.3-.2-.8-.3-.4-.2-.1-.3.2-.2.4-.3.3-.3 0-.3-.3-.3-.4-.2-.3-.2.1-.1.3-.1.7-.1.5-.1.3-.2.3-.2.1-.2 0-.2-.2-.2-.4-.3-.4-.2-.2-.2.1-.2.4-.2.8-.3.5-.2.2-.4-.1-.3-.3-.4-.4-.2-.5-.2-.6-.1-.7-.2-.3-.2 0-.2.4-.2.8-.3.5-.3.4-.3.2-.3 0-.3-.1-.2-.3-.2-.4-.2-.4-.2-.3-.2 0-.3.3-.2.4-.3.3-.2 0-.3-.3-.2-.4-.3-.4-.3-.1-.3.1-.3.2-.3.2-.3 0-.2-.2-.3-.2-.3-.1-.3.1-.4.4-.4.4-.4.4-.4.1-.4-.1-.3-.2-.3-.1-.2.1-.2.4-.2.4-.3.2-.3-.1-.4-.4-.6-.8-.4-.5-.4-.2-.3 0-.2.2-.3.2-.2 0-.3-.2-.2-.2-.4-.2-.5-.1-.7-.1-.8 0-.7.1-.5.1-.4.2-.3.2-.3.1-.3-.1-.4-.4-.4-.4-.4-.2-.4.1-.3.4-.2.8-.3.5-.2.2-.3 0-.2-.2-.4-.2-.4 0-.4.2-.6.2-.5.1-.5-.1-.5-.4-.4-.4-.5-.3-.5 0-.4.3-.6.4-.4.4-.4.1-.3-.1-.2-.2-.3-.2-.4 0-.4.2-.6.2-.4.2-.4 0-.3-.2-.2-.2-.5-.2-.6 0-.9.2-1.1.2-.8.1-.6-.1-.4-.4-.2-.4-.3-.4-.3-.1-.4.1-.6.2-.5.2-.5 0-.5-.2-.6-.2-.5-.1-.4.1-.2.4-.2.4-.3.4-.3.1-.4-.1-.6-.2-.4-.2-.4 0-.4.2-.3.2-.3.1-.2-.1-.2-.4-.2-.4-.3-.4-.4-.3-.4-.1-.6 0-.5.1-.4.3-.2.4-.2.4-.2.4-.3.1-.3-.1-.3-.2-.3-.2-.4 0-.5.2-.5.2-.4.1-.4-.1-.2-.4-.2-.4-.3-.4-.3-.3-.4-.1-.6 0-.4-.1-.4-.1-.3-.2-.2-.2-.3 0-.2.2-.3.5-.2.8-.4.5-.5.4-.7.2-.8 0-.7-.2-.5-.4-.4-.5-.3-.8-.2-.4-.2-.1-.2.2-.2.4-.3.4-.2.1-.4 0-.3-.2-.4.1-.2.2-.2.5-.1.7-.2.3-.2 0-.2-.4-.2-.8-.3-.4-.2-.1-.3.2-.2.4-.3.4-.3.1-.3-.1-.3-.2-.3-.2-.2 0-.2.2-.2.2-.2.2-.2 0-.3-.2-.2-.2-.3-.2-.4 0-.4.2-.6.2-.4.2-.4 0-.3-.2-.2-.2-.4-.2-.4 0-.4.2-.6.2-.5.1-.4-.1-.2-.4-.2-.4-.2-.4-.3-.1-.3.1-.3.2-.5.2-.6 0-.8-.2-1-.2-1-.1-.8.1-.8.4-.7.4-.6.4-.5.3-.4.1-.3 0-.3-.1-.2-.3-.2-.4-.2-.4-.3-.3-.5 0-.6.3-.8.4-.7.3-.6 0-.5-.3-.6-.4-.4-.4-.4-.1-.3.1-.2.2-.3.2-.3 0-.3-.2-.3-.2-.3-.1-.3.1-.2.4-.3.4-.2.3-.2 0-.2-.3-.2-.4-.4-.4-.5-.1-.6.1-.8.2-.7.1-.5-.1-.4-.4-.3-.4-.3-.2-.3.1-.4.4-.4.8-.4.4-.4.1-.3-.2-.2-.4-.3-.3-.3 0-.3.3-.3.4-.3.2-.4-.1-.5-.4-.5-.8-.4-.3-.4 0-.2.3-.2.8-.2.5-.3.2-.3 0-.3-.2-.4-.2-.5 0-.7.2-.7.2-.6 0-.6-.2-.3-.5-.3-.8-.2-.4-.2 0-.1.3-.2.7-.1.5-.3.4-.3.2-.4.1-.3-.1-.3-.2-.3-.4-.3-.4-.2-.2-.3.1-.2.4-.3.8-.3.4-.3.2-.3-.1-.4-.3-.3-.5-.2-.7-.2-.7-.2-.9-.1-.5-.1-.1-.1.3-.2.7-.1.5-.3.4-.3.2-.4.1-.4.2-.4.4-.4.6-.4.8-.4.5-.3.3-.3.1-.2-.1-.1-.3-.1-.5 0-.6 0-.8-.1-.6-.2-.3-.3-.1-.4.2-.3 0-.3-.1-.2-.4-.2-.4-.2-.3-.1.1-.2.3-.1.7-.2.5-.1.3-.2.3-.2.1-.2 0-.4 0-.4-.2-.5-.2-.4-.1-.4.1-.2.4-.2.4-.3.3-.3 0-.4-.3-.6-.4-.5-.4-.5-.3-.5-.1-.6 0-.5-.1-.4-.1-.2-.2-.2-.2-.2-.2-.3-.1-.3-.1-.3 0-.2.1-.2.2-.1.3-.1.3-.2.3-.2.3-.4.2-.4.1-.5 0-.5-.1-.5-.2-.6-.3-.4-.3-.4-.4-.2-.4-.1-.4-.2-.2-.2.2-.2.4-.2.8-.3.3-.4 0-.4-.3-.6-.8-.4-.4-.4-.1-.3.2-.2.4-.3.4-.3.1-.3-.1-.3-.2-.2-.1-.2 0-.1.3-.1.3-.2.3-.2.3-.4.2-.4.1-.4-.1-.3-.3-.3-.5-.3-.8-.2-.4-.2-.1-.2.2-.2.4-.3.4-.4.1-.4-.1-.6-.2-.5 0-.4.2-.2.5-.2.8-.2.3-.3-.1-.3-.6-.3-1-.2-.5-.2-.1-.1.4-.1.9-.1.7-.1.5-.2.3-.2.1-.2 0-.3-.1-.3-.3-.4-.3-.3-.5-.2-.5-.1-.5-.1-.7-.1-.3-.2-.1-.2.3-.2.4-.3.4-.4.1-.4-.1-.6-.2-.5-.2-.5 0-.5.2-.6.2-.5.1-.4-.1-.2-.4-.2-.4-.2-.3-.3 0-.3.3-.3.4-.3.3-.3 0-.2-.3-.3-.4-.3-.2-.3.1-.4.4-.4.8-.4.5-.4.2-.3 0-.2-.2-.6-.2-.9 0-1.2.2-1.6.2-1.2.1-.9-.1-.5-.4-.2-.4-.2-.4-.3-.1-.3.1-.3.2-.5.2-.6.1-.8.1-1 0-1.1.3-1.2.5-1.2.8-1.3 1.1-1 1-.5 1.1zM328.9 263l-.6-.8-.5-.6-.6-.4-.5-.2-.6 0-.6-.1-.6-.3-.7-.4-.7-.4-.5-.4-.5-.1-.4.1-.2.2-.4.2-.5.1-.7.1-.8 0-.8-.1-.6-.1-.6-.2-.5-.2-.4 0-.3.3-.1.6-.1.9-.1.7-.1.5-.2.3-.2.1-.2-.1-.3-.5-.4-.7-.4-1-.4-.6-.4-.1-.4.3-.3.8-.2.4-.3.2-.1-.2-.2-.4-.1-.3-.3-.1-.3 0-.4.2-.4 0-.4-.3-.4-.5-.4-.8-.4-.4-.4-.1-.3.2-.2.4-.4.4-.6.1-.7 0-.9-.2-.7.2-.5.5-.3.8-.1 1.2-.2.9-.1.5-.2.2-.2-.1-.1-.3-.1-.5-.1-.7-.1-.9-.1-.7-.2-.6-.2-.4-.2-.2-.3-.2-.2 0-.3.2-.2.2-.4.2-.4.1-.4.1-.6 0-.5-.1-.4-.3-.2-.4-.2-.4-.3-.2-.3.1-.4.4-.6.8-.4.3-.4 0-.4-.3-.3-.8-.3-.4-.2-.1-.2.2-.2.4-.2.4-.3.1-.3-.1-.3-.2-.3-.2-.3 0-.2.2-.3.2-.2.2-.3 0-.2-.2-.3-.2-.2-.2-.2 0-.2.2-.2.2-.3.2-.4.1-.4.1-.6 0-.5.1-.4.3-.2.4-.2.4-.2.2-.2-.1-.3-.4-.2-.8-.3-.5-.3-.4-.3-.2-.3 0-.3.1-.2.3-.2.4-.2.4-.2.4-.3.1-.3-.1-.3-.2-.3-.2-.4 0-.4.2-.4.2-.4.2-.4 0-.3-.2-.2-.2-.3-.2-.2 0-.3.2-.2.2-.4.2-.4 0-.4-.2-.6-.2-.5-.2-.4 0-.3.2-.3.2-.3 0-.5-.2-.6-.5-.7-.8-.6-.3-.6 0-.5.3-.6.8-.4.4-.4.1-.3-.2-.2-.4-.3-.3-.4 0-.4.3-.6.4-.4.3-.4 0-.3-.3-.2-.4-.3-.3-.4 0-.4.3-.6.4-.4.3-.4 0-.4-.3-.3-.4-.3-.2-.2.1-.2.4-.2.8-.2.3-.2 0-.3-.3-.2-.8-.3-.4-.4-.1-.4.2-.6.4-.4.4-.4.3-.4.1-.3 0-.3-.1-.3-.3-.2-.4-.3-.4-.3-.2-.3.1-.4.4-.4.8-.5.4-.5.1-.4-.2-.6-.4-.4-.4-.4-.1-.3.1-.2.2-.4.2-.5.1-.6.1-.8 0-.6-.1-.5-.1-.5-.2-.3-.2-.3-.1-.3.1-.2.4-.3.4-.3.3-.3 0-.4-.3-.4-.4-.5-.4-.5-.3-.5-.1-.6 0-.5-.1-.4-.3-.2-.4-.2-.4-.3-.2-.3.1-.4.4-.6.8-.4.5-.4.2-.4 0-.3-.2-.4-.2-.5-.1-.7-.1-.7 0-.6-.1-.6-.3-.3-.4-.3-.4-.2-.3-.2 0-.1.2-.2.4-.1.4-.3.4-.2.3-.3.3-.3.2-.4 0-.3-.1-.3-.2-.3-.1-.3.1-.2.4-.3.4-.3.2-.5-.3-.6-.6-.7-1-.7-.6-.9-.3-1 .2-1.1.4-.8.2-.6-.1-.4-.4-.2-.8-.2-.3-.2 0-.3.3-.2.8-.4.6-.5.5-.7.4-.8.2-.7.1-.5-.1-.4-.4-.3-.4-.3-.2-.3.1-.4.4-.4.8-.5.3-.5 0-.4-.3-.6-.8-.4-.5-.4-.4-.4-.2-.3 0-.3.1-.2.3-.2.4-.2.4-.2.3-.2 0-.3-.3-.2-.4-.3-.3-.2 0-.3.3-.2.4-.3.4-.3.1-.3-.1-.3-.2-.3-.2-.4-.1-.5-.1-.5 0-.4.1-.4.1-.2.2-.2.2-.2.2-.3 0-.3-.2-.3-.2-.3-.2-.4 0-.5.2-.5.2-.5 0-.5-.2-.4-.5-.4-.8-.4-.3-.4 0-.3.3-.2.8-.3.5-.3.4-.4.1-.3-.1-.4-.2-.2-.4-.3-.5-.2-.7-.2-.2-.1.1-.2.6-.2 1-.2.7-.2.5-.2.1-.2-.1-.1-.3-.1-.5-.1-.7-.1-.9-.1-.5-.2-.2-.2.2-.2.4-.3.4-.3.1-.3-.1-.3-.2-.3-.1-.4.1-.4.4-.4.4-.4.3-.4 0-.3-.3-.2-.4-.4-.4-.4-.3-.4-.1-.6 0-.5.1-.4.1-.2.2-.2.2-.2.2-.2 0-.3-.2-.2-.2-.3-.2-.2 0-.3.2-.2.2-.4.2-.4 0-.4-.2-.6-.2-.5-.1-.4.1-.2.4-.2.4-.2.3-.2 0-.3-.3-.2-.4-.3-.3-.2 0-.3.3-.2.4-.4.3-.5 0-.7-.3-.8-.4-.7-.4-.5-.1-.3.1-.2.2-.4.2-.6.1-.9.1-1.1 0-.9.1-.8.1-.6.2-.5.2-.4.1-.4-.1-.2-.4-.2-.4-.4-.4-.5-.1-.6.1-.8.2-.7.1-.5-.1-.4-.4-.3-.4-.2-.3-.2 0-.1.2-.2.4-.2.4-.3.4-.5.3-.6.3-.5.3-.6.1-.5.1-.6 0-.6-.1-.5-.3-.5-.4-.5-.4-.4-.2-.4.1-.2.4-.2.8-.3.5-.3.2-.4 0-.6-.2-.4-.2-.4 0-.4.2-.3.2-.3 0-.2-.2-.2-.5-.2-.8-.2-.5-.3-.4-.3-.2-.3 0-.2.1-.2.2-.1.3-.1.3-.2.3-.2.3-.4.2-.4.1-.5 0-.5-.1-.5-.2-.6-.3-.4-.3-.4-.4-.2-.4-.1-.4-.2-.2-.2 0-.2.3-.2.4-.7.4-1 .1-1.4-.1-1.8-.2-1.5-.1-1.1.1-.8.4-.4.4-.6.4-.8.3-.9.1-1.1 0-.8-.1-.7-.3-.4-.4-.3-.4-.2-.3-.3 0-.2.3-.3.4-.2.3-.2-.1-.1-.4-.2-.7-.1-.5-.3-.4-.3-.2-.4-.1-.3 0-.2.2-.1.3-.1.3-.2.4-.4.4-.4.4-.7.3-.5.3-.4 0-.4-.1-.2-.2-.3-.2-.3 0-.3.2-.3.2-.5.1-.6-.1-.8-.4-.9-.4-.8-.3-.6 0-.5.3-.3.4-.3.3-.2 0-.2-.3-.2-.4-.2-.4-.3-.3-.3-.1-.3 0-.3.2-.2.6-.2.7-.2 1-.3.6-.3.2-.4-.2-.4-.7-.3-.6-.3-.6-.1-.6-.1-.7-.2-.3-.4 0-.4.2-.7.6-.5.5-.3.5-.3.5-.1.4-.3.3-.4 0-.5-.2-.7-.3-.6-.5-.3-.5-.2-.5-.1-.7-.2-.2-.3 0-.3.4-.6.8-.4.4-.4.1-.3-.2-.2-.4-.3-.4-.4-.1-.4.1-.6.2-.5.2-.7.1-.7.1-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.2-.2-.2 0-.3.2-.2.2-.4.2-.4.1-.4.1-.6 0-.5-.1-.4-.1-.3-.2-.3-.2-.3 0-.3.2-.4.5-.4.8-.6.3-.6-.1-.6-.6-.8-1-.6-.5-.5 0-.4.5-.2 1-.3.7-.3.6-.3.2-.3 0-.3-.2-.4-.4-.4-.5-.4-.8-.4-.5-.4-.2-.4 0-.3.2-.3.1-.2-.1-.2-.4-.2-.4-.2-.2-.2.1-.3.4-.2.8-.3.5-.3.4-.3.2-.3 0-.3-.1-.2-.3-.2-.4-.2-.4-.2-.3-.2 0-.3.3-.2.4-.3.3-.2 0-.3-.3-.2-.4-.3-.3-.4 0-.4.3-.6.4-.4.4-.4.3-.4.1-.3 0-.3-.2-.3-.4-.2-.5-.3-.8-.2-.3-.2.1-.2.6-.2 1-.3.6-.5.3-.6-.2-.8-.4-.7-.4-.6-.1-.6.1-.6.2-.5.1-.4-.1-.2-.4-.2-.4-.2-.3-.2 0-.3.3-.2.4-.3.4-.2.1-.2 0-.2-.2-.2-.1-.3 0-.3.1-.4.2-.3 0-.3-.1-.2-.4-.2-.4-.4-.3-.6 0-.9.3-1.1.4-.9.3-.8.1-.7-.1-.6-.3-.4-.3-.4-.4-.2-.4-.1-.4-.2-.2-.2.2-.2.4-.2.8-.3.5-.3.4-.3.2-.3 0-.3-.1-.2-.3-.2-.4-.2-.4-.2-.3-.2 0-.3.3-.2.4-.3.4-.2.1-.3-.1-.2-.2-.3-.2-.2 0-.3.2-.2.2-.4.2-.4.1-.4.1-.6 0-.5-.1-.4-.3-.2-.4-.2-.4-.2-.3-.3 0-.3.3-.3.4-.3.2-.4-.1-.5-.4-.5-.8-.6-.3-.7 0-.9.3-.9.8-.8.5-.6.4-.5.2-.3 0-.4.2-.6.4-.7.6-.8.8-.6.8-.4.7-.2.6 0 .6.1.5.1.6.3.5.3.6.5.6.6.5.9.5 1 .5 18.3.4 35.6.2 53 .2 70.3 0 53-.2 35.7-.3 18.4-.4 1.1-.6.8-.6.7-.9.4-.9.3-1.1 0-1-.1-.9zM296.7 220.8l-1.1 3.9-.7 3-.4 2.1 0 1.2.3.3.7.2 1 .2 1.5.1 1.8 0 1.2-.1.7-.2.1-.3-.4-.4-.2-.3.2-.3.4-.1.7-.2.5-.1.4-.3.2-.3.1-.4-.2-.4-.3-.4-.6-.4-.7-.4-.6-.7-.4-.9-.1-1.1 0-1.3-.2-1.1-.2-.9-.4-.6-.5-.4-.4-.7-.3-.7-.2-1-.2-1.1-.3.1-.6 1.4zM39.1 248.8l.1.4 3.6.3 7.2.2 10.7.1 14.3 0 10.8-.1 7.3-.1 3.7-.2.2-.3 9.9-.2 19.6-.1 29.3 0 39.1 0 29.3 0 19.7.1 9.9.2.2.3.9.2 1.8.1 2.5.1 3.3 0 2.6-.1 1.7-.1 1-.2.2-.3 1.8-.2 3.5-.1 5.2 0 6.8 0 5.1 0 3.5.1 1.9.2.2.3 2 .1 3.7.1 5.6.1 7.4-.1 5.5-.1 3.7-.3 1.8-.3-.1-.3-.4-.4-.9-.3-1.1-.3-1.6-.2-1.2-.3-.9-.2-.5-.3-.2-.2-.3-.2-.4-.1-.4-.1-.6 0-.7-.1-.7-.3-.9-.4-.9-.4-.9-.4-.9-.3-.8-.1-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.4-.2-.5-.1-.6-.1-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.4-.2-.5-.1-.6-.1-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.4-.2-.5-.1-.6-.1-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.4-.2-.5-.1-.6-.1-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.4-.2-.6-.1-.9-.1-1.1 0-.8-.1-.6-.1-.4-.2-.2-.2-.4-.2-.5-.1-.6-.1-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.4-.2-.5-.1-.6-.1-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.4-.2-.5-.1-.6-.1-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.4-.2-.6-.1-.9-.1-1.1 0-.8-.1-.6-.1-.4-.2-.2-.2-.4-.2-.5-.1-.6-.1-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.4-.2-.6-.1-.9-.1-1.1 0-.8-.1-.6-.1-.4-.2-.2-.2-.4-.2-.5-.1-.6-.1-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.7-.3-1.3-.2-1.8-.3-2.3-.2-1.8-.3-1.2-.2-.7-.3-.2-.2-2.9-.2-5.7-.1-8.3-.1-11.1 0-8.3-.1-5.6-.1-2.9-.2-.2-.2-.3-.2-.4-.1-.4-.1-.6 0-.7-.1-.7-.3-.9-.4-.9-.4-1-.4-1-.3-1-.1-1.1 0-.8-.1-.6-.1-.4-.2-.2-.2-1.2-.2-2.3 0-3.3.2-4.3.2-3.3.1-2.4-.1-1.4-.4-.4-.4-.6-.5-.8-.4-.9-.3-1.1-.2-.9-.4-.9-.4-.7-.5-.6-.7-.5-2.1-.3-3.6-.1-5 0-6.6-.1-5.1-.1-3.5-.2-2-.3-.5 0-.5.2-.4.4-.4.6-.4.7-.3.8-.2.8-.1.8-.1.7-.6.4-1.2.3-1.8 0-2.3 0-1.8.2-1.4.3-.8.4-.4.4-.3.5-.2.5 0 .6 0 .4 0 .4.1.4.2.2.3.3.1.3 0 .3-.2.3-.3.2-.5.2-.5.1-.7 0-.8-.5-1.1-.9-1.2-1.3-1.5-1.7-1.7-1.3-1.3-.9-1-.4-.7 0-.3-.2-.4-.4-.5-.6-.6-.7-.7-.6-.6-.4-.5-.1-.4 0-.3-.2-.3-.2-.4-.4-.4-.5-.4-.5-.6-.5-.7-.5-.9-.5-1-.3-1.1-.1-1.3 0-1.4.3-1.6.1-1.2 0-.9-.1-.5-.3-.2-.3-.6-.4-1-.4-1.4-.5-1.8-.6-1.6-.6-1.2-.7-1-.7-.7-.6-.7-.4-.7-.1-.8 0-.8.2-.7.5-.4.7-.3.9-.2.8-.1.6-.3.5-.2.3-.3.2-.5.2-.5.1-.7 0-.8 0-.7.1-.5.2-.3.3-.2.1-.3 0-.3-.1-.4-.3-.6-.2-.6-.1-.8 0-.9 0-1.1 0-.9.1-.8.2-.6.3-.5-.2-.6-.7-.6-1.1-.8-1.6-.8-1.5-.5-1.6-.3-1.5 0-1.6.2-1.3.3-1 .4-.7.5-.4.4-.6.4-.8.3-.9.1-1.1 0-1 .2-.9.4-.9.6-.8.8-.7.9-.5.9-.4 1-.2 1.1-.4 1-.5.9-.7.9-.8.8-.8.7-.6.4-.5.3-.4.2-.2.1.2.2.4.2.8.3.3.3 0 .4-.3.5-.8.6-.4.4-.2.3.1.2.3.1.4-.1.2-.1.3-.1.2-.3.2-.1.1 0 .2 0 .2.2-.2.6-.5 1.1-.9 1.5-1.2 1.9-1 1.8-.6 1.7-.3 1.4 0 1.3.1 1.1.1.8.2.5.2.2.1.3-.1.4-.4.4-.4.4-.4.5-.3.5-.1.5 0 .6-.1.4-.1.4-.2.3-.2.2-.2.9-.1 1.8-.1 2.5 0 3.3.1 2.6.1 1.9.2 1.2.2.6.5.5.6.7.9.7 1.1.8.9.6.8.3.7 0 .6-.3.6-.1.7.1.8.3.9.4.6.4.3.4 0 .3-.2.2-.2.7-.1 1-.1 1.3 0 1.8-.2 1.4-.3 1.2-.4.9-.7.7-.8.6-1.2.6-1.3.6-1.7.7-1 .5-.4.4.1.3.8.2.5.2.2.2 0 .3-.2.3-.1.3.2.4.3.3.6.3.7.2.9.3 1 .1 1.2.2 1 .2.7.3.5.4.2.5.2.7.1.9.1 1.1 0 1.3-.3 1.4-.6 1.5-1 1.6-1.2 1.7-1.1 1.9-.9 2-.7 2.1-.4 2.3-.6 2-.4 1.7-.6 1.3-.4 1-.6.9-.6.7-.7.6-.8.4-.5.5-.4.7-.2.7 0 .8-.2.7-.3.6-.4.5-.7.3-.9.3-1.4.2-1.7.1-2.1 0-1.6-.1-1.3-.3-.8-.4-.4-.4-.5-.5-.4-.3-.5-.2-.4-.1-.3-.2-.2-.4-.1-.4 0-.6-.1-.5-.1-.4-.2-.2-.3-.2-.2-.5-.1-.7 0-1.1 0-1.3 0-1 .1-.8.2-.4.3-.2.2-1.6.1-3 .1-4.4 0-5.8-.1-4.4-.1-3-.2-1.6-.3-.2-.2-.4-.1-.5 0-.6 0-.8-.1-.7-.1-.5-.2-.3-.3-.2-.3-.7-.4-1.1-.4-1.6-.5-2.1-.5-1.7-.5-1.4-.5-1-.5-.7-.4-1-.2-1.3-.1-1.7 0-2-.1-1.6-.1-1.1-.2-.8-.3-.3-.1-.3.1-.4.3-.3.4-.4.4-.2.3.1.2.2.1.4.5.8 1 1.1 1.3 1.3 1.8 1.7 1.3 1.5.9 1.4.4 1.2 0 1.1.1.9.1.7.3.5.3.3.4.2.4.2.5.1.6 0 .5-.2.6-.3.5-.4.6-.6.4-.5.3-.4.2-.4 0-.3-.3-.5-.5-.6-.8-.8-1-.9-1-1.2-1-1.5-1-1.7-1-2-.7-1.6-.5-1.3-.2-.9 0-.6-.2-.7-.4-.9-.6-1-.7-1.2-.6-1.1-.4-1-.1-.9 0-.8 0-.7.1-.5.2-.3.3-.2.2-.3.1-.4.1-.4 0-.6-.1-.5-.1-.4-.2-.2-.3-.2-.2-.7-.1-1.3 0-1.8 0-2.3-.4-2.1-.6-1.9-.9-1.7-1.3-1.5-.8-1.3-.3-1.2.2-1.1.6-.8.7-.7.7-.4.8-.2.8 0 .7-.1.5-.2.5-.2.3-.3.2-.4.2-.4.1-.5 0-.6 0-.5.1-.4.2-.2.3-.2.1-.6 0-.8-.1-1.2-.3-1.6.1-1.2.3-.9.7-.4.9-.2.8-.2.6-.4.5-.5.3-.6-.1-.5-.6-.3-.9-.2-1.4-.1-1.3-.3-1.3-.5-1.2-.8-1.2-1-1.2-.7-1.1-.6-1.1-.2-1.1 0-1 .1-1 .3-1 .4-1 .4-.8.5-.5.5-.3.4-.1.3-.2.4-.3.4-.4.5-.4.4-.4.6-.3.7-.1.9 0 1.1.1 1 .3 1 .4 1 .4.9.4 1 .3.8.1.9 0 .8-.2.7-.3.8-.4.6-.7.7-.9.4-1.2.2-1.5-.1-1.8-.2-1.6-.1-1.2.1-1 .4-.7.4-.7.4-.7.3-.8.1-.8 0-.8.1-.7.3-.6.4-.6.6-.4.8-.4 1.1-.4 1.3-.2 1.6-.3 1.2-.2.8-.3.6-.2.2-.2.2-.1.4-.1.5 0 .6.1.4.1.4.2.4.2.2 0 .5-.4.7-.7 1-1 1.2-.8 1.8-.6 2.5-.5 3.2-.2 3.8-.1 3.1.1 2.4.4 1.7.4 1 .7.9.8.8.9.6 1.1.6 1.2.5 1.3.3 1.6.2 1.7.2 1.2 1 .9 2 .4 2.9 0 3.8-.1 2.9-.1 2-.2 1.1-.2.2-.2.5-.1.9-.1 1.2 0 1.6-.1 1.2-.1.8-.2.6-.2.2-.2.2 0 .2.2.3.2.3-.2.6-.6.7-1 1-1.6 1.2-1.3 1.5-1.3 1.9-1.1 2.2-1 2.6-1.1 2.2-1.3 2-1.3 1.8-1.6 1.4-1 1.3-.7 1.2-.3 1.1.1.9-.2.7-.4.5-.8.2-1.1 0-.9-.1-.7-.3-.6-.4-.4-.4-.5-.5-.6-.3-.6-.2-.7-.1-.5-.2-.4-.4-.1-.4 0-.6.1-.5.2-.4.4-.3.5-.3.2-.3-.1-.5-.5-.6-.7-.7-.5-.7-.3-.7 0-.8.3-.8 0-.7-.1-.7-.3-.5-.5-.4-.5-1-.4-1.4-.3-1.9-.3-2.3-.4-1.8-.3-1.2-.4-.5-.3.1-.3.2-.2.4-.1.7 0 .8-.1.8-.3.7-.4.7-.4.7-.4.7-.1.6.1.6.2.6.1.5-.1.7-.4.6-.4.7-.4.7-.1.6.1.5.2.5.2.5 0 .5-.2.5-.2.5-.2 1.5-.1 2.4-.1 3.3 0 4.3 1.2 3.3 2.5 2.2 3.6 1.1 4.9.1 3.7.2 2.5.3 1.3.6.1.7 0 .6-.1.5-.3.5-.3.3-.5.3-.4.2-.5.1-.6 0-.7.1-.7.3-.9.4-.9.4-.9.4-.9.3-.8.1-.8 0-.7.1-.5.1-.3.2-.2.2-.3.2-.4.1-.4.1-.6 0-.5.1-.4.1-.2.2-.2.2-.3.2-.4.1-.4.1-.6 0-.5.1-.4.1-.2.2-.2.2-.9.4-1.5.5-2.1.6-2.8.8-2.3.7-1.8.6-1.2.6-.7.4-.6.4-.7.3-.5.1-.6 0-.6.1-.6.3-.7.4-.7.4-.6.4-.7.3-.6.2-.7.1-.4.1-.3.2zM155.8 196.1l.9.8.6.8.5.8.2.6 0 .6.1.4.1.4.2.3.2.2.2.2 0 .4-.2.4-.2.5-.2.8-.1 1.2-.1 1.5 0 1.8.1 1.4.1 1 .2.6.2.2.2.2.1.4.1.5 0 .6.1.6.3.8.4.8.4.9.4 1 .3.8.1.9 0 .8.1.6.1.5.2.4.2.2.2.2 0 .4-.2.4-.2.5-.2.6-.1.6-.1.8 0 .8-.2.6-.3.5-.5.3-.7.1-.6.2-.4.2-.3.2-.2.2-.8.2-1.4.1-1.9.1-2.6 0-2 .1-1.3.1-.8.2-.2.2-.4.2-.5.1-.6.1-.8 0-.9-.3-1-.5-1-.9-1.2-1.1-.8-1.1-.6-1.1-.2-1.1 0-1.1.1-1 .4-1 .6-1 .7-.9.8-1.1.7-1.2.8-1.4.7-1.6.7-1.3.6-1 .6-.7.5-.4.4-.4.2-.4.2-.4 0-.3.1-.4.4-.5.6-.6.7-.7.8-.9.7-1.1.8-1.3.7-1.4.6-1.3.4-1 .2-.8 0-.6.1-.5.2-.5.3-.4.4-.4.6-.1.6.3zM102.9 191.3l.4.4.6.7.6.9.6 1.3.8 1.6.7 1.2.6 1 .6.8.4.4.4.5.3.5.1.5 0 .6-.1.4-.1.4-.2.3-.2.2-.2.6-.1 1-.1 1.4 0 1.8.1 1.4.1 1 .2.6.2.2.2.6.1 1.2.1 1.5 0 2.1.1 1.6.1 1.1.2.7.2.2.2.7 0 1.1 0 1.7-.1 2.2-.3 1.7-.5 1.1-.6.5-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.4-.2-.5-.1-.6-.1-.8 0-.9-.1-.8-.3-1-.4-.9-.4-1-.4-1-.3-1-.1-1.1 0-.8-.1-.6-.1-.4-.2-.2-.2-.4-.2-.5-.1-.6-.1-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.4-.2-.6-.1-.9-.1-1.1 0-.9-.1-.8-.1-.6-.2-.5-.2-.5-.4-.4-.4-.4-.5-.4-.7-.2-.7-.1-.8.1-1 .3-1.1 1.1-1.7 2-2.3 2.9-3.1 3.7-3.7 3-3 2.1-2.3 1.3-1.7.5-1 .4-1 .2-.9.2-.8 0-.8.1-.9.3-.8.5-.9.6-.8.6-.6.5-.3zM160.7 166.8l.3 0 .6.3.9.8 1.2 1.1 1.4 1.5 1.1 1.1.9.8.6.4.3 0 .5.2.8.4.9.7 1.1.8.9.8.5.7.3.6 0 .5-.2.5-.3.6-.4.7-.7.7-.7.4-.8.1-1-.3-1.1-.4-1.2-.8-1.3-1.1-1.5-1.3-1.6-1.7-1.2-1.5-.8-1.6-.3-1.5.2-1.4.1-1.1.3-.7zM148.7 129.9l.1 1.4.2 1.2.3 1 .5.7.4.4.4.4.3.4.1.3 0 .3-.4.5-.7.8-1.1.9-1.4 1.1-1.2.7-1.1.4-.8-.1-.6-.4-.3-.5.1-.6.4-.6.7-.7.6-.6.6-.6.3-.5.3-.6.2-.7.1-.9.1-1.1 0-1.3.1-1.1.2-.8.3-.6.4-.4.4.1.3.5z"/></g></svg><svg x="520" y="0" width="260" height="236" viewBox="40 0 260 236" overflow="hidden"><path d="M274.3 227.5l-.3.2-2 .2-3.6.1-5.2.2-6.9.1-4.9.1-2.9.1-.9.1 1.1.1.9.1.9.3.9.4.7.5.7.2.7 0 .6-.2.6-.5.4-.3.4-.2.2 0 .1.2 0 .2 0 .2-.2.2-.2.2-.1.1 0 .2.3.1.3.2.4-.1.5-.2.4-.3.6-.5 1.3-.4 2.1-.2 2.9-.1 3.8 0 2.9-.1 2-.2 1.2-.3.3-.4.1-.2 0-.1zM230.3 210l-.8 0-.8.1-.7.1-.6.3-.6.3-.4.4-.3.4-.1.5 0 .6-.1.4-.1.4-.2.4-.2.2-.2 1-.1 1.7-.1 2.5 0 3.2 0 2.5-.1 1.7-.2 1.1-.2.4 0 .3.3.1.4.1.6-.1.5-.2.3-.3.2-.4 0-.6.1-.7.4-.7.6-.9.7-.9.5-.7.2-.6-.1-.3-.4-.1-.4-.3-.3-.3-.4-.5-.4-.7-.3-.6-.2-.8 0-.7 0-.8.1-.7.4-.7.6-.5.7-.4.6-.6.4-.6.2-.7 0-.8.1-.7.2-.4.3-.3.4-.2.4-.1.2-.2.1-.1 0-.2-.2-.2-.4-.1zM223.5 209.2l-.2 0-.3.3-.2.5-.4.7-.3.9-2 .7-3.4.5-5 .2-6.6 0-5-.1-3.4-.3-1.8-.4-.3-.4-.2-.3-.1-.1-.1.2-.1.3.1.5.2.6.4.6.4.8.3.6 0 .5-.3.3-.4.2-.4.8-.3 1.3-.1 2 0 2.6.2 2 .3 1.4.4.9.7.3.5.1.5 0 .4-.1.3-.3.3-.5.3-.7.2-.9.3-1.1.3-.8.5-.8.5-.5.6-.4.6-.3.6-.2.6 0 .6 0 .6.2.7.4.8.7.9.8.6.8.5.8.2.6 0 .6.1.5.1.6.3.5.3.6 1.1.4 1.9.3 2.8.2 3.6 0 2.6-.3 1.9-.6.9-.8.1-1.2.1-.9.1-.7.2-.4.3-.3.2-1 .1-1.9.1-2.7 0-3.5-.1-2.6-.1-1.8zM247.1 190.8l-1.2-.3-.9-.4-.8-.4-.6-.5-.4-.4-.8-.4-1.1-.3-1.4-.1-1.8 0-1.3.1-1 .1-.7.2-.2.2-.5.3-.8.2-1.1.3-1.3.2-1 .2-.8 0-.4-.2-.2-.2-.3-.2-.5-.2-.5-.2-.7-.1-.4-.2-.2-.3.2-.3.4-.3.2-.3 0-.2-.3-.1-.6 0-.5.1-.4.1-.3.2-.3.2-.4.2-.7.2-.8.1-1.1.1-.5 0 0 .1.6.1 1.1.2.9.1.5.3.3.2 0 .3-.4.3-.8.1-1.2.1-1.7 0-1.2-.1-.9-.1-.5-.2-.1-.2-.2-.2-.2-.1-.3-.1-.3 0-.2 0-.2.1-.1.2 0 .2.2.1.2.2.3 0 .4.1.3.1.2.2 0 .2-.1.2-.4.2-.8.1-1 .1-1.3 0-1 .1-.8.1-.4.2-.2.2-.4.2-.5.1-.6.1-.8 0-.7.1-.5.1-.3.2-.2.2-.5.3-.8.3-1.1.4-1.3.3-.5.4.3.3 1.3.4 2.1.3 1.7.1 1.3-.1.9-.3.4-.5.8-.4 1.1-.2 1.5-.1 1.8 0 1.3 0 .9.2.5.2 0 .3-.2.3-.3.2-.4.2-.7.1-.2.1.1.1.5.1.9.1.8-.1.7-.1.6-.2.6-.3.4-.3.1-.4 0-.3-.3-.3-.1-.3.1-.4.2-.3.4-.4.3-.2.3-.1.3.1.3.3.4.2.7.1.8.1 1.1 0 .8-.1.6-.1.4-.2.1-.3.4-.2.6-.1.8 0 1.1 0 .8-.1.7-.1.4-.2.3-.3.6-.2 1-.1 1.5 0 1.8 0 1.4 0 1 .1.6.2.2.3.5.1.9.1 1.3 0 1.6-.2.9-.1.3-.3z"/><path d="M129.5 334.2l.3.6.6.7.9.7 1.2.7 1.5.7 1.7.6 1.9.4 2.1.2 2.3 0 2-.2 1.6-.2 1.3-.4.9-.5 1.3-.4 1.7-.2 1.9-.1 2.3 0 2.4.3 2.5.8 2.6 1.1 2.7 1.5 2.3 1.1 1.9.8 1.4.4 1.1 0 .9 0 .6.1.4.2.2.3.8.1 1.5 0 2.2-.1 2.8-.3 2.9-.5 3-.9 3.1-1.2 3.2-1.5 2.9-1.1 2.6-.8 2.3-.3 2.1 0 2.4.3 2.6.8 2.9 1.1 3.2 1.5 3.1 1.1 3 .8 2.9.4 2.8 0 2.1-.1 1.5-.1.9-.2.2-.3.2-.2.4-.1.5 0 .6 0 .6-.2.8-.2.9-.4 1-.5 1-.6 1.1-.8 1.2-.9 1.2-1 1.1-.8 1-.6 1-.5.8-.3.7-.4.4-.3.2-.4-.1-.3-.4-.3-.9-.2-1.1-.1-1.6 0-1.2.1-.9.1-.5.2-.2.2-.5.3-.7.2-1.1.3-1.3.2-1.1.3-1 .4-.9.5-.7.4-1.1.4-1.5.3-1.9.1-2.3 0-2.5-.4-2.6-.7-2.8-1.1-2.9-1.6-3-1.1-3.1-.7-3.3-.4-3.3 0-3.2.4-3.1.7-3.1 1.1-2.9 1.6-2.8 1.1-2.6.9-2.5.6-2.3.2-1.8.2-1.2 0-.7-.2-.2-.2-.4-.2-.5-.1-.6-.1-.8 0-1.3-.4-1.8-.7-2.2-1.1-2.7-1.6-2.2-1.1-1.7-.7-1.3-.4-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.6-.2-1-.1-1.4-.1-1.8 0-1.4.1-1 .1-.6.2-.2.2-.3.2-.4.1-.4.1-.6 0-.5.1-.4.1-.2.2-.2.2-.3.2-.4.1-.4.1-.6 0-.7.1-.7.3-.9.4-.9.4-1.4.4-1.7.1-2.2 0-2.7-.2-1.9 0-1.1.3zM85.5 307.2l.3.6.3.5.3.3.3.2.3 0 .7.3 1 .8 1.3 1.1 1.7 1.5 1.4 1.1 1.1.8.9.4.6 0 .5-.2.7-.2.6-.4.7-.5 1-.4 1.4-.2 1.7-.1 2.1 0 2 .3 1.8.6 1.8.9 1.7 1.3 1.7 1 1.6.7 1.6.5 1.6.3 1.2.2.8.3.6.2.2.3.6.2 1 .1 1.4.1 1.8 0 1.4-.1 1-.1.6-.2.2-.3.3-.2.5-.1.7 0 .8 0 1.4-.5 2-.9 2.6-1.3 3.2-1.7 3.1-1.3 3-.9 2.9-.4 2.8 0 2.9.4 3 .9 3.1 1.3 3.2 1.7 2.6 1.3 2 .9 1.4.5.8 0 .6 0 .5.1.4.2.2.3.7.2 1.2.1 1.8.1 2.3 0 1.8-.1 1.3-.1.7-.2.2-.3.3-.2.5-.1.7 0 .8 0 1-.2 1.1-.4 1.4-.6 1.4-.7 1.3-.7 1-.6.7-.6.4-.5.5-.4.5-.2.5-.1.6 0 .6-.2.8-.2.8-.4.9-.5 1.2-.4 1.4-.2 1.6-.1 1.8 0 1.4 0 1 .1.6.2.2.3.4.2.8.3 1 .2 1.3.3 1.1.3.9.4.7.4.4.5.7.6 1 .6 1.2.7 1.5.7 1.3.6 1.2.4 1 .2.8 0 .6 0 .5.1.4.2.2.3.7.2 1.2.1 1.8.1 2.3 0 1.8-.1 1.3-.1.7-.2.2-.3.3-.2.5-.1.7 0 .8 0 1.4-.4 2-.8 2.6-1.1 3.2-1.5 2.8-1.1 2.5-.8 2.2-.3 1.8 0 1.7.1 1.7.4 1.6.6 1.4.7 1.3.7 1 .6.7.6.4.5.6.4.7.4.9.3 1.1.3 1.2 0 1.3-.3 1.4-.5 1.4-.7 1.7-1 1.8-1.3 1.9-1.6 2.1-1.8 1.5-1.4 1-1.1.6-.7 0-.3-.1-.2-.2-.2-.3-.1-.4-.1-.3 0-.3.1-.2.2-.2.2-.6.3-.8.2-1.2.3-1.6.2-1.2.3-.9.2-.5.3-.2.2-.6.2-.8.1-1.2.1-1.6 0-1.4-.1-1.1-.3-.9-.4-.7-.4-.6-.4-.7-.3-.5-.1-.6 0-.7-.1-.7-.3-.9-.4-.9-.4-1.2-.4-1.5-.3-1.8-.1-2.1 0-1.5.1-1.2.1-.6.2-.2.2-.4.2-.5.1-.6.1-.8 0-1.2.3-1.5.6-1.8 1-2.2 1.2-2 1-1.9.8-1.7.5-1.6.2-1.2.3-.9.2-.5.3-.2.2-.4.2-.6.1-.9.1-1.1 0-.8-.1-.6-.1-.4-.2-.2-.2-.6-.3-.8-.2-1.2-.3-1.6-.2-1.4-.4-1.3-.5-1.1-.6-.9-.8-1.1-.7-1.4-.6-1.6-.6-1.8-.4-1.4-.5-1-.4-.6-.3-.2-.2-.9-.2-1.5-.1-2.1-.1-2.8 0-3.1.4-3.2.9-3.5 1.3-3.7 1.8-3.5 1.3-3.4.9-3.2.4-3.1 0-2.9-.4-2.9-.7-2.8-1.1-2.7-1.6-2.6-1.2-2.7-1-2.5-.8-2.6-.4-2-.4-1.3-.1-.8.1-.2.2-.5.2-.7.1-1.1.1-1.3 0-1 .1-.8.1-.4.2-.2.2-.3.2-.4.1-.4.1-.6 0-1.1.4-1.6.7-2.2 1.1-2.7 1.6-2.7 1.1-2.7.7-2.8.4-2.8 0-2.9-.4-2.8-.9-3-1.3-2.9-1.8-2.8-1.3-2.8-.9-2.6-.4-2.6 0-2 .1-1.3.1-.8.2-.2.2-.5.2-.7.1-1.1.1-1.3 0-1-.1-.8-.1-.4-.2-.2-.2-.5-.2-.8-.1-1.1 0-1.3.1-1 .2-.5.3zM64 288.5l1.3 1.3 1.2 1.1 1.2.9 1.1.7 1 .5 1.2.4 1.4.2 1.6.2 1.8 0 1.8-.3 1.9-.5 1.9-.8 1.9-1 1.6-.7 1.3-.5.9-.2.6 0 .5-.2.7-.2.6-.4.7-.5 1-.4 1.4-.2 1.7-.1 2.1 0 2.4.4 2.8.9 3.1 1.3 3.4 1.7 3.4 1.4 3.4 1 3.3.6 3.3.3 2.6.1 1.7 0 1-.1.2-.3.5-.2.9-.3 1.2-.2 1.6-.3 1.9-.5 2.2-.9 2.6-1.2 2.9-1.5 2.9-1.1 2.7-.8 2.7-.3 2.6 0 2.7.4 3 .9 3.3 1.3 3.4 1.7 3.2 1.4 3 1 2.8.6 2.6.3 1.9.1 1.4 0 .8-.1.2-.3.4-.2.8-.1 1 0 1.3 0 1.1-.1.7-.1.5-.2.2-.3.2-.2.4-.1.5 0 .6 0 1.1-.4 1.6-.8 2.1-1.1 2.7-1.5 2.7-1.1 2.6-.8 2.6-.3 2.6 0 2.7.4 3 .9 3.3 1.3 3.4 1.7 3.2 1.4 3 1 2.8.6 2.6.3 1.9.1 1.4 0 .8-.1.2-.3.4-.2.8-.1 1 0 1.3 0 1.1-.1.7-.1.5-.2.2-.3.2-.2.4-.1.5 0 .6 0 1.1-.4 1.8-.8 2.3-1.1 2.9-1.5 2.9-1.1 2.7-.8 2.7-.3 2.6 0 2.8.4 3.1.9 3.4 1.3 3.7 1.7 3.6 1.3 3.5.9 3.4.5 3.3 0 2.6-.1 1.7-.1 1-.2.2-.3.6-.3 1-.4 1.4-.4 1.8-.5 1.9-.8 1.9-1.2 2-1.5 2.1-1.8 1.5-1.4 1-1.1.6-.7 0-.3-.5-.2-1-.2-1.4-.1-1.8-.1-2.2.3-2.4.7-2.7 1.1-2.9 1.6-2.7 1.1-2.3.7-2.1.4-1.8 0-1.4-.1-1-.1-.6-.2-.2-.2-.6-.3-1-.4-1.4-.5-1.8-.4-1.5-.6-1.1-.4-.8-.6-.4-.4-.5-.4-.5-.3-.5-.1-.6 0-.6-.1-.6-.3-.7-.4-.7-.4-.7-.4-.9-.3-1-.1-1.1 0-.8-.1-.6-.1-.4-.2-.2-.2-.6-.2-.8-.1-1.2-.1-1.6 0-1.2.1-.9.1-.5.2-.2.2-.4.2-.5.1-.6.1-.8 0-1.6.4-2.2.9-3 1.3-3.7 1.8-3.4 1.3-3.3.9-3 .4-2.8 0-3-.4-3.1-.9-3.3-1.3-3.4-1.8-2.9-1.3-2.2-.9-1.7-.4-1.1 0-.8-.1-.6-.1-.4-.2-.2-.2-.8-.2-1.4 0-1.9.2-2.6.2-2.8.6-3 1-3.2 1.4-3.4 1.8-3.3 1.3-3.2.9-2.9.4-2.8 0-2.2-.1-1.5-.1-.8-.2-.2-.2-.3-.2-.4-.1-.4-.1-.6 0-.8-.2-1-.4-1.3-.5-1.5-.8-1.2-.7-1-.6-.7-.6-.4-.4-.8-.5-1-.4-1.2-.3-1.6-.2-1.2-.3-.9-.2-.5-.3-.2-.2-.9-.2-1.5 0-2.1.2-2.8.2-3.1.6-3.2 1-3.5 1.4-3.7 1.8-3.4 1.3-3.3.9-3 .4-2.8 0-2.2-.1-1.5-.1-.8-.2-.2-.2-.5-.3-.7-.2-1.1-.3-1.3-.2-1.1-.3-.9-.4-.6-.5-.4-.4-.6-.6-.7-.4-.9-.6-1-.4-1.1-.5-1.3-.4-1.4-.3-1.6-.2-1.2-.3-.9-.2-.5-.3-.2-.2-.6-.2-.8-.1-1.2-.1-1.6 0-1.2.1-.9.1-.5.2-.2.2-.4.2-.5.1-.6.1-.8 0-1.3.3-1.6.6-2 1-2.4 1.2-2.3 1-2.1.6-2 .3-1.8 0-1.4-.1-1-.1-.6-.2-.2-.2-.4-.2-.5-.1-.6-.1-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.4-.2-.6-.1-.9-.1-1.1 0-.8.1-.5.2-.3.3-.1.3.3.6.6.9zM38 258.7l0 .3.2.4.4.5.5.6.8.7.5.6.4.5.2.4 0 .3.3.5.5.7.8.9 1.1 1.1 1 .8.9.5.9.3.8 0 .6 0 .5.1.4.2.2.3.3.2.5.1.7.1.8 0 .6 0 .5.1.4.2.2.3.2.2.4.1.5.1.6 0 .6.1.8.2.8.4.9.5 1.1.4 1.1.2 1.2.2 1.3 0 1.1 0 .7.1.5.2.2.3.2.1.4 0 .4-.1.5-.3.8-.2 1-.1 1.3 0 1.6 0 1.2-.1.8-.1.6-.2.2-.3.2-.2.4-.1.5 0 .6 0 1.1-.4 1.6-.8 2.1-1.1 2.7-1.5 2.2-1.1 1.8-.8 1.3-.3.8 0 .6-.1.5-.1.4-.2.2-.3.7-.1 1.2 0 1.8.1 2.3.3 2.4.5 2.5.9 2.6 1.2 2.7 1.5 2.5 1.2 2.2.9 2.1.5 1.8.3 1.4.2 1 .3.6.2.2.3.8.1 1.5 0 2.2-.1 2.8-.3 2.9-.6 3.2-1 3.3-1.4 3.4-1.7 3.3-1.3 3.3-.9 3.1-.4 3.1 0 3.2.4 3.2.9 3.4 1.3 3.4 1.7 3.5 1.3 3.5.9 3.5.5 3.6 0 3.5-.5 3.5-.9 3.5-1.3 3.4-1.7 2.8-1.3 2.1-.9 1.5-.4.8 0 .6-.1.5-.1.4-.2.2-.3.7-.1 1.2 0 1.8.1 2.3.3 2.4.5 2.5.9 2.6 1.2 2.7 1.5 2.5 1.2 2.2.9 2.1.5 1.8.3 1.4.2 1 .3.6.2.2.3.7.1 1.2 0 1.8-.1 2.3-.3 1.8-.2 1.3-.3.7-.2.2-.3.6-.3 1-.4 1.4-.4 1.8-.5 1.6-.6 1.4-.6 1.1-.7.9-.7 1.1-.7 1.3-.4 1.4-.4 1.6-.3 1.2-.2.8-.3.6-.2.2-.3.7-.1 1.2 0 1.8.1 2.3.3 2.6.6 2.9 1 3.2 1.4 3.4 1.7 3.5 1.3 3.5.9 3.5.5 3.6 0 2.7-.1 1.9-.1 1-.2.2-.3.2-.2.4-.1.5 0 .6 0 .7-.2.8-.4 1.1-.6 1.2-.7 1-.6.9-.4.7-.1.6 0 .6-.2.8-.2.8-.4.9-.5 1.1-.4 1.1-.2 1.2-.1 1.3 0 1.1 0 .7.1.5.2.2.3.5.2.9.3 1.2.2 1.6.3 1.6-.4 1.7-.9 1.7-1.4 1.8-2.1 1.4-1.6.8-1.3.5-.8-.1-.3-1.1-.3-2-.2-3.1-.1-4.1 0-3.1.1-2.1.1-1.1.2-.2.2-.6.3-.8.2-1.2.3-1.6.2-1.9.6-2.3.9-2.6 1.1-2.9 1.6-2.8 1.1-2.6.7-2.5.4-2.3 0-1.8-.1-1.2-.1-.7-.2-.2-.2-.4-.2-.5-.1-.6-.1-.8 0-1.4-.4-1.9-.7-2.4-1.1-2.9-1.6-2.4-1.1-1.9-.7-1.3-.4-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.7-.2-1.1-.1-1.6-.1-2.1 0-1.5.1-1.2.1-.6.2-.2.2-.4.2-.5.1-.6.1-.8 0-1.5.4-2.1.9-2.8 1.3-3.4 1.8-3.3 1.3-3.2.9-2.9.4-2.8 0-3-.4-3.1-.9-3.3-1.3-3.4-1.8-2.8-1.3-2.1-.9-1.5-.4-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.7-.2-1.1-.1-1.6-.1-2.1 0-1.5.1-1.2.1-.6.2-.2.2-.4.2-.5.1-.6.1-.8 0-.8.1-.8.3-.7.4-.7.4-.6.4-.7.3-.5.1-.6 0-.5.1-.5.3-.5.4-.4.4-.8.6-1.2.4-1.4.6-1.8.4-1.4.5-1 .4-.6.3-.2.2-.8.2-1.4.1-1.9.1-2.6 0-2.8-.4-3-.9-3.2-1.3-3.4-1.8-2.8-1.3-2.1-.9-1.5-.4-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.7-.2-1.1-.1-1.6-.1-2.1 0-1.5.1-1.2.1-.6.2-.2.2-.4.2-.5.1-.6.1-.8 0-1.3.4-1.8.7-2.2 1.1-2.7 1.6-2.2 1.1-1.7.7-1.3.4-.8 0-.7.1-.5.1-.3.2-.2.2-.9.2-1.5.1-2.1.1-2.8 0-3-.4-3.1-.9-3.3-1.3-3.4-1.8-2.8-1.3-2.1-.9-1.5-.4-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.7-.2-1.1-.1-1.6-.1-2.1 0-1.5.1-1.2.1-.6.2-.2.2-.6.3-.8.2-1.2.3-1.6.2-1.9.6-2.3.9-2.6 1.1-2.9 1.6-2.8 1.1-2.8.7-2.6.4-2.6 0-2.8-.4-3-.9-3.2-1.3-3.4-1.8-2.8-1.3-2.1-.9-1.5-.4-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.5-.2-.8-.1-1.1 0-1.3.1-1.1.1-.7.2zM208 197.2l-1.8-.1-1.6.1-1.3.2-1.1.4-.9.6-.7.7-.6.9-.4 1.1-.2 1.3-.3 1-.3.9-.4.6-.3.4-.4.3-.3.1-.4-.1-.3-.2-.3-.1-.3.2-.3.4-.3.7-.2.5.1.5.2.4.3.3.5 0 .6-.2.7-.6.8-.8.6-.7.4-.7.3-.5 0-.6.1-.6.4-.9.5-1 .7-1.2.7-.9.9-.6.9-.2 1 0 .8 0 .7.2.6.3.3.4.3.5 0 .8-.1.8-.2 1.1-.3.9-.4.8-.5.6-.4.6-.2.3.2.3.5.2.9.1.8-.6.7-1.1.6-1.8.6-2.4 0-1.8-.7-1.2zM226.2 195.8l-.4-.3-.5-.3-.7-.1-.8-.1-1 0-.8.1-.6.1-.4.2-.2.2-.5.2-.7.1-1 .1-1.2 0-1.1.1-.9.1-.7.2-.6.2-.5.3-.4.3-.4.4-.3.3-.3.8-.3 1.2-.3 1.6-.2 2 .5 1.5 1.3 1 2.1.6 2.9.1 2.3-.1 1.7-.1 1-.1.6-.3.5-.8.5-1.3.5-1.8.6-2.4.3-1.8.1-1.4zM240.8 195.4l-.6-.6-.7-.3-.6-.2-.7.1-.7.2-1 .2-1.2.2-1.6.1-1.9.1-1.5.6-1.2 1.2-.9 1.7-.4 2.3-.3 1.8-.1 1.4.1.8.3.3 1.1.2 1.9.2 2.8.1 3.6 0 2.6-.4 1.9-.7.9-1 .1-1.4-.1-1.1-.1-.7-.1-.5-.3-.2-.2-.4-.1-.5 0-.6 0-.8-.2-.8-.3-.7zM43.6 128.4l.3.2.7-.1.9-.3 1.2-.6 1.4-.7 1.3-.6 1.3-.4 1.1-.1 1.1 0 .8 0 .5.2.3.2 0 .3-.2.3-.5.4-.6.3-.9.3-.5.2-.1.3.2.1.7.2.7-.1.7-.2.9-.3.9-.5 1.2-.4 1.4-.4 1.6-.3 1.8-.3 1.3-.1.9 0 .5.2 0 .3-.3.4-.5.4-.8.5-1.1.4-.9.4-.8.3-.6.1-.5 0-.5.1-.4.2-.3.3-.3.3.5.3 1.2.1 2.1-.1 2.9-.2 2.1 0 1.5 0 .7.2 0 .3-.2.3-.5.2-.6.2-.9.1-.2.1.3.1 1 .1 1.7.1 1.2.1.9.1.5.1.1.2 0 .3-.3.2-.4.4-.7.3-.6.3-.6.2-.5.1-.6 0-.4.1-.3.2-.2.4 0 .4.6.3 1.2.2 1.7.2 2.3 0 1.8 0 1.1.2.6.2 0 .3-.3.3-.7.2-1.1.2-1.3.1-.7.2 0 .2.7.3 1.3.3 1.5.5 1.7.7 1.7.9 1.9 1.2 1.3.9.9.6.3.4-.2.2-.4 0-.7-.3-.9-.5-1.2-.8-1.2-.5-1.3-.4-1.3-.2-1.3 0-1-.1-.8-.1-.4-.2-.2-.2-.5-.2-.7-.1-1.1-.1-1.3 0-1.1-.1-.9-.1-.7-.2-.5-.2-.4-.2-.4 0-.2.2-.2.2-.4.2-.6.1-.9.1-1.1 0-.8.1-.6.1-.4.2-.2.2-.6.3-1 .2-1.4.3-1.8.2-1.4.3-.9.2-.5.2 0 .2.2.2.4.1.5.2.7.2.2.2-.3.1-.7.2-1.2.1-1.1.2-1.1.3-1 .5-1 .4-1 .6-.9.7-.9.7-.8.8-.5.7-.4.4 0 .3.2.2.2 0 .1-.1.2-.1.2-.3.2-.1.1 0 .2 0 .1.2-.3.6-.8.9-1.3 1.3-1.8 1.7-1.3 1.4-.9 1-.4.6 0 .3-.2.5-.4.6-.5.8-.8.9-.6 1-.5.9-.3.9-.2.8.4.1.9-.7 1.4-1.4 2-2.3 1.6-1.6 1.1-.9.6-.3.2.4.1.5-.2.6-.3.8-.4.8.2.1.8-.7 1.4-1.4 2.1-2.3 1.6-1.6 1.1-1 .6-.5.1.2 0 .3-.2.5-.4.5-.4.7-.4.7-.2.6 0 .7.1.6.6-.1 1-.8 1.5-1.5 1.9-2.3 1.5-1.6 1.1-1 .6-.5.2.2 0 .3-.1.3-.4.4-.4.4-.4.5-.3.5-.1.5 0 .6.3.1.5-.1.8-.6 1.1-.9.8-.7.7-.5.5-.2.3 0 .3 0 .2.1.2.2.1.3 0 .3-.2.3-.4.3-.4.4-.4.4-.2.3 0 .4.1.4.2.1.2-.1.3-.4.3-.6.6-.8.8-.8 1.1-1 1.4-1.2 1.1-.7.8-.3.5.1.3.5.3.2.6 0 .6-.2.7-.5.7-.3.6-.2.5-.1.4.2.3.1.2.3-.1.3-.2.4 0 .3.2.2.3.1.5 0 .6-.2.8-.2.9-.4 1-.5 1.1-.3 1.2-.2 1.3-.1 1.4.2 1 .2.4.2-.1.4-.7.4-.7.4-.8.2-.9.1-1 0-1.3.2-1.7.6-2 .7-2.3 1-2.2 1.1-2 1.3-2 1.4-1.8 1.6-1.7 1.9-1.7 2.3-1.5 2.7-1.6 3-1.1 2.6-.7 2.3-.4 1.9 0 1.6-.1 1.2-.1.8-.2.6-.2.2-.2.5-.1.9 0 1.3.1 1.6.1 1.1.2.5.3 0 .4-.6.3-.6.2-.7.1-.7 0-.8 0-.7.1-.5.2-.3.3-.2.2-.5.3-.7.2-1.1.3-1.3.2-1 .3-.6.3-.4.3 0 .3.3.1.5.1.8 0 1.1.1.8.2.6.3.3.3.1.3-.3.3-.7.1-1 .1-1.4.3-1.5.5-1.5.7-1.7 1-1.7.9-1.3.6-.9.5-.5.3 0 .3.2.2.3.2.5.1.6.3 0 .4-.5.5-1.2.7-1.7.7-1.3.6-.9.6-.4.6 0 .5-.2.5-.4.5-.6.4-.7.4-.4.4 0 .3.4.3.7.3.4.4-.1.3-.5.3-.8.4-.8.4-.8.6-.7.6-.6.5-.5.4-.2.3-.1.2.2.1.1 0 .2-.2.1-.2.2-.2.2 0 .2 0 .2.1.2.5-.2.7-.5 1.2-.9 1.4-1.3 1.1-.8.8-.4.5 0 .2.4 0 .5-.1.4-.4.5-.4.4-.4.5-.3.5-.1.5 0 .6-.3 1-.6 1.5-1 2-1.2 2.6-1.1 1.9-.9 1.5-.7 1-.4.4-.6.6-.4.7-.6.9-.4 1-.4.8-.3.8-.1.7 0 .6-.2.7-.4.8-.5 1.1-.8 1.2-.5 1-.4.9-.2.7 0 .6-.2.9-.6 1.2-.7 1.6-1 1.9-.7 1.7-.6 1.4-.2 1.1 0 .8-.2.9-.4 1.2-.5 1.3-.8 1.4-.5 1.3-.4 1.1-.2 1 0 .8-.1.8-.3.9-.4.9-.4.9-.4 1-.3.8-.1.9 0 .8-.1.6-.1.5-.2.4-.2.2-.2.3-.1.5-.1.7 0 .8-.1.6-.1.5-.2.4-.2.2-.2.3-.1.5-.1.7 0 .8-.1.6-.1.5-.2.4-.2.2-.2.5-.1.9-.1 1.2 0 1.6-.1 1.2-.1.8-.2.6-.2.2-.2.3-.1.5-.1.7 0 .8-.1.6-.1.5-.2.4-.2.2-.2.7-.1 1.2-.1 1.8 0 2.3-.1 1.9-.1 1.4-.2.9-.2.6 0 .4.2.4.5.3.8.2.2.3-.4.3-.9.4-1.4.3-1.1.4-.8.3-.5.3-.2.2-.3.2-.4.1-.4.1-.6 0-.9.2-1.3.6-1.6.7-1.9 1-1.6.7-1.2.6-.9.2-.6 0-.4.1-.3.2-.2.4 0 .4 3.6.3 7.2.2 10.7.2 14.3 0 10.8-.1 7.3-.1 3.7-.2.2-.3 9.9-.2 19.6-.1 29.3 0 39.1 0 29.3 0 19.7.1 9.9.2.2.3.9.2 1.8.1 2.5.1 3.3 0 2.6-.1 1.7-.1 1-.2.2-.3 1.8-.2 3.5-.1 5.2 0 6.8 0 5.1 0 3.5.1 1.9.2.2.3 2 .1 3.7.1 5.6.1 7.4-.1 5.5-.1 3.7-.3 1.8-.3-.1-.3-.2-.3-.3-.2-.4-.1-.6 0-.5-.1-.4-.1-.2-.2-.2-.2-.4-.2-.5-.1-.6-.1-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.3-.2-.4-.1-.4-.1-.6 0-.7-.1-.7-.3-.9-.4-.9-.4-.9-.4-.9-.3-.8-.1-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.4-.2-.5-.1-.6-.1-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.4-.2-.5-.1-.6-.1-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.4-.2-.5-.1-.6-.1-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.4-.2-.6-.2-.7-.2-.9-.1-.7-1.1-.5-1.9-.2-2.9 0-3.8-.1-2.9-.1-2-.2-1.1-.3-.2-.2-.4-.1-.6 0-.9 0-1.1-.1-.8-.1-.6-.2-.4-.3-.2-.2-.4-.1-.6 0-.9 0-1.1-.1-.8-.1-.6-.2-.4-.3-.2-.2-.4-.1-.5 0-.6 0-.8-.2-.9-.2-.8-.4-1-.5-.9-.4-.9-.2-.9-.1-.8 0-.8-.2-.8-.2-.8-.4-.7-.5-.7-.4-.7-.2-.7-.1-.8 0-.8-.7-1.9-1.2-2.9-1.9-3.9-2.5-5-2.3-4.3-2.2-3.4-2-2.6-1.8-1.8-1.4-1.3-1.1-.9-.8-.4-.3.1-.4.1-.3.3-.3.4-.2.5-.2.6-.1.6-.1.8 0 .8-.1.6-.1.5-.2.4-.2.2-.2.9-.1 1.7-.1 2.5 0 3.3.1 2.5.1 1.7.2 1 .2.3.2.6.1 1 .1 1.4 0 1.7.1 1.6.3 1.4.4 1.2.4 1 .4 1 .3 1 .1 1 0 1.1.1.9.1.6.2.4.2.2.2.2.1.4.1.5 0 .6.1.6.3.8.4.8.4.9.4.9.3.9.1.8 0 .7.2 1.1.6 1.4.7 1.6 1 2 .7 1.7.6 1.3.2.9 0 .6.4 1.1.7 1.6 1.1 2.1 1.6 2.7 1 2.1.7 1.4.3.8-.1.2-.2.1-.2 0-.2-.2-.2-.2-.4-.2-.5-.1-.7-.1-.8 0-.9-.1-.8-.2-.9-.3-.8-.3-.5-.4-.1-.3.4-.3.7-.2.6-.4.4-.5.2-.7 0-.8-.3-1.1-.5-1.2-.8-1.5-1-1.7-.7-1.4-.5-1.1-.2-.8 0-.6-.2-.6-.2-.6-.4-.7-.5-.7-.4-.7-.2-.7-.1-.7 0-.8-.2-.7-.2-.8-.4-.7-.5-.8-.4-.7-.2-.8-.1-.8 0-.8-.2-.8-.2-.7-.4-.7-.5-.6-.4-.8-.2-1-.1-1.2 0-1.4-.1-1.1-.1-.7-.2-.5-.3-.2-.2-.9-.3-1.5-.3-2.2-.3-2.9-.4-2.2-.4-1.6-.4-.9-.6-.2-.6-.2-.8-.1-.9-.1-1.1 0-.8-.1-.6-.1-.4-.2-.2-.2-1.1-.2-1.9-.2-2.8-.2-3.7-.1-2.7-.2-1.6-.3-.7-.4.4-.4 1.1-.3 1.8-.2 2.6-.1 3.3 0 2.6-.1 1.8-.2 1.1-.2.3-.3.1-.4 0-.3-.1-.4-.3-.3-.7-.3-1.1-.2-1.4-.1-1.8 0-1.4-.1-1-.1-.6-.2-.2-.2-1-.2-1.7-.1-2.6-.1-3.3 0-2.5.1-1.8.1-1 .2-.3.2-.6.2-1 .1-1.4.1-1.7 0-1.6.1-1.3.3-1.2.4-.9.4-1.3.5-1.8.4-2.1.3-2.6.2-2.2.4-1.8.4-1.4.5-1.1.7-.7.5-.4.5 0 .4.3.3.5.2.7.2.8.1 1.1 0 .8 0 .6.1.3.2.1.3-.2.2-.4.1-.6.1-.8.1-.7.1-.8.3-.6.3-.7.3.1.3.8.1 1.4-.1 2.1-.2 1.6-.2 1.2-.2.6-.2.1-.3.5-.2.9-.1 1.2 0 1.7 0 1.2-.1.8-.1.4-.1 0-.2-.3-.2-.5-.1-.8 0-1.1 0-.8 0-.6-.1-.3-.2-.2-.2.4-.2.9-.3 1.5-.3 1.9-.4 1.5-.2 1-.1.6 0 .1.2 0 .2-.2.1-.3.2-.4.1-.3.2-.2.1-.2.2 0 .2 1 0 2 0 3-.1 4-.3 3.4 0 2.6.1 2 .3 1.3.5 1.1.5.9.5.6.4.3.4-.9.4-2.1.3-3.4.2-4.7.1-3.6.2-2.5.2-1.3.2-.3.2-.6.2-1 .1-1.4.1-1.7 0-1.3 0-.9.1-.5.2 0 .2.6.1 1.1.1 1.7.1 2.3 0 1.7-.1 1.3-.1.8-.2.3-.3 2-.2 3.7-.1 5.3 0 7 0 5.2.1 3.6.3 1.7.4 0 .6-.8.3-1.7.2-2.6 0-3.3-.2-2.6 0-1.8 0-1.1.1-.2.3-.2.3-.1.4-.1.5 0 .6.1.4.1.4.2.3.2.2.3.5.2.9.3 1.2.2 1.6.3 1.2.3.9.3.7.3.3 1.1.2 1.9.2 2.8.1 3.6 0 2.8 0 2 .1 1.2.2.6.3.4.3.3.3.2.3.1.4.1.3 0 .3-.1.2-.1.2-2.7.2-5.2.1-7.8 0-10.3 0-7.7.9-5.2 1.8-2.6 2.6-.1 3.6-.1 2.7-.2 1.9-.2 1.1-.2.3-.2.5-.2.7-.2.9-.1 1.2-1 .9-1.8.6-2.7.3-3.6 0-2.8-.2-1.9-.3-1.2-.4-.4-.7-.3-.6-.2-.6 0-.5 0-.6-.3-.6-.5-.7-.8-.8-1.1-.8-.9-.6-.7-.4-.5-.2-.3 0-.4.2-.6.4-.7.6-.8.8-.6.8-.4.7-.2.6 0 .6-.1.5-.2.4-.3.5-.3.3-.5.3-.4 0-.5-.1-.6-.2-.5-.1-.5.1-.5.4-.4.4-.7.4-.9.3-1.1.1-1.3 0-1-.4-.7-.9-.4-1.2-.2-1.7-.1-1.3-.2-1-.2-.5-.3-.2-.2-.3-.1-.4 0-.4 0-.6-.2-.8-.4-1-.6-1.3-.7-1.5-.9-1.3-1-1.2-1.2-1-1.3-.8-1.3-.7-1.2-.5-1.1-.4-1.1-.2-.8-.3-.8-.3-.5-.4-.4-.3-.3-.5-.2-.4 0-.5 0-.6.1-.5.2-.5.4-.5.5-.4.4-.8.2-1 .2-1.2 0-1.6-.1-1.3-.1-1-.2-.8-.3-.5-.3-.5-.4-.4-.5-.3-.6-.3-.6-.3-.9-.1-.9-.1-1.1 0-1 .2-1 .4-1 .5-.9.8-.9.5-.9.3-.9 0-.9-.2-.6 0-.5 0-.2.2 0 .3.2.4.4.4.5.4.8.4.6.8.5 1.3.4 1.6.2 2.1.4 1.6.5 1.2.6.7.8.2.3.4 0 .4-.5.5-.9.7-.9.5-1 .4-1 .4-1.1.2-.9.4-.8.4-.7.4-.6.6-.4.6-.3.5-.1.6 0 .6-.1.6-.3.8-.4.8-.4.9-.4 1.1-.3 1.3-.1 1.4 0 1.6-.1 1.3-.2 1.1-.3.8-.3.7-.5.4-.5.3-.6 0-.7-.1-.5-.2-.4-.4-.1-.4 0-.6 0-.5.1-.4.2-.3.3-.3.1-.2 0-.2-.1-.2-.3-.2-.2-.4-.1-.5 0-.6 0-.8-.1-.7-.1-.5-.2-.3-.3-.2-.2-.4-.3-.6-.2-.9-.3-1.1-.5-.9-.7-.9-1-.8-1.3-.7-.8-.6-.4-.6.1-.5.5-.6.4-.4.2-.4.2-.4 0-.3-.2-.4-.2-.5-.4-.6-.5-.7-.4-.9-.4-1.3-.3-1.5-.3-1.8-.3-1.5-.4-1-.5-.7-.6-.3-.7-.3-.9-.1-1.2-.1-1.3 0-1.1.2-.9.4-.8.6-.6.8-.4.8-.3.9-.1.8 0 .8-.1.6-.1.5-.2.4-.2.2-.2.5-.1.9-.1 1.2 0 1.6.1 1.2.1.9.2.6.2.2.2.2 0 .2-.1.2-.2.1-.2 0-.2 0-.2-.2-.3-.2-.2-.1-.1 0-.1.3-.1.3-.3.5-.5.5-.8.6-1 .7-.8.7-.6.6-.5.5-.2.5-.2.6-.1.6-.1.8 0 .8-.1.6-.1.5-.2.4-.2.2-.2.3-.1.5-.1.7 0 .8-.3.6-.6.5-.9.3-1.2.1-.9-.3-.6-.6-.4-1.1-.2-1.4-.1-1.1-.2-.8-.2-.5-.3-.2-.2-.5-.3-.7-.2-1.1-.3-1.3-.3-1.1-.4-.9-.5-.8-.6-.6-.8-.5-1.1-.6-1.4-.6-1.7-.7-1.3-.5-.8-.5-.4-.4 0-.3.1-.3.4-.4.6-.4.7-.4.6-.5.4-.5.2-.5 0-.6 0-.5.1-.4.2-.2.3-.2.1-.2 0-.2-.1-.3-.3-.2-.2-.4-.1-.4 0-.4 0-.6.1-.5.2-.5.4-.5.5-.4.4-.4.2-.4.2-.4 0-.3-.2-.2-.3-.2-.5-.1-.6-.1-.6-.2-.5-.3-.5-.4-.4-.4-.6-.5-.6-.4-.7-.3-.8-.2-.7-.2-.5 0-.3.2-.2.2-.3.2-.4.1-.4.1-.6 0-.4.1-.4.2-.1.3-.1.3-.2.4-.3.4-.4.5-.4.4-.4.6-.3.7-.1.9 0 1.1.1 1 .3.9.4.7.4.7.4.7.3.6.1.6 0 .6-.3.6-.7.7-1.1.8-1.3.9-1.3.6-1.1.5-.9.2-.8 0-.8.2-.9.4-.8.6-.8.8-.7 1.1-.7 1.3-.6 1.6-.4 1.8-.5 1.4-.4 1-.3.6-.2.2-.2.2 0 .4.2.5.2.6-.5.4-1.2.4-1.9.2-2.7.1-2.1.4-1.3.8-.7 1.1-.1 1.3 0 1.1.1.8.2.5.2.2.2.2.1.4.1.5 0 .6-.1.5-.2.4-.3.5-.3.3-.6.3-.7.2-.9.1-1.1 0-.9.1-.7.3-.6.4-.4.4-.6.4-.6.3-.7.1-.8 0-.7-1.1-.4-2.2-.3-3.4-.2-4.4 0-3.4.1-2.3.1-1.2.3-.2.2-.7.1-1.3.1-1.8 0-2.3 0-1.8.1-1.2.2-.7.3-.2.3-1 .4-1.9.4-2.7.5-3.6.4-2.7.4-1.9.3-1 .3-.2.2-.6.3-.8.2-1.2.3-1.6.3-1.4.4-1.1.4-.9.5-.7.4-.6.2-.7.2-.5 0-.6 0-.5.1-.4.2-.2.3-.2.4-.9.4-1.5.7-2.1.7-2.8.8-2.6.9-2.2.9-2 1-1.7.9-1.5.6-1.4.4-1.2.3-1.1.3-.9.4-.7.4-.6.5-.4.5-.6.5-.8.5-.9.5-1.1.5-.8.5-.5.6-.3.6 0 .4.4.4.6.4 1 .2 1.3.3 1.1.3.8.3.6.3.3.3.1.3-.1.2-.3.3-.5.2-.3.2-.2.2-.1.2.2.2.5.1 1 .1 1.5.1 1.8 0 1.3.1.6.1 0 .2-.6.2-.6.2-.5.3-.4.4-.4.3-.2.3-.2.2 0 .2.2.1.1 0 .2-.2.2-.2.3-.2.6-.1.9 0 1.3.1 1.6.1 1.1.2.7.3.1.4-.4.3-.4.2-.4.1-.5 0-.5 0-.4.2-.2.2-.2.3 0 .2.6 0 1-.1 1.5-.2 2.1-.1 1.5 0 .9.3.4.3-.2.4-.3.3-.5.3-.6.2-.7.2-.2.2.3.2.9.1 1.4 0 1.2 0 1-.2.7-.2.6-.1.3.1.2.4.1.4-.1.4.1.1.2-.1.4-.2.5-.2.5-.1.6 0 .6.1.6.1.1.2-.3.3-.9.4-1.4.3-1 .4-.7.3-.4.3 0 .3.4.1.8.1 1.2 0 1.6-.1 1.2-.1.8-.2.6-.2.2-.2.4 0 .6 0 .9.1 1.2.2.7.2.2.3-.1.3-.6.2-.5.2-.6.1-.5 0-.6 0-.5.1-.4.2-.2.3-.2.2-.7.1-1.1.1-1.6 0-2.1 0-1.5.1-1.2.2-.6.3-.2.1-.6 0-.8-.1-1.2-.3-1.6 0-1.2.1-.8.3-.4.5 0 0-.7-.5-1.5-1-2.2-1.5-3-1.5-2.6-1.4-2.2-1.3-1.7-1.3-1.3-1.1-1-.8-.7-.6-.3-.3 0-.2-.1-.2-.1-.1-.3 0-.3.3-.2.4 0 .6.1.8.3.9.4 1 .6 1.1.8 1.2 1 .9.7.8.4.5.1.3-.3.5.1.6.6.8.8.9 1.3.8.9.6.4.5.2.3-.3.4.1.4.6.4.8.4 1.3.4.6.2.1.2-.5.2-1.2.1-.8.2-.7.1-.3.2-.2.3.3.2.7.4 1 .3 1.4.4 1.2.3.8.3.5.2.2.2.2.1.4.1.5 0 .6.1.5.1.4.3.4.3.3.2 0 .3-.2.1-.6.2-.8 0-.7-.1-.5-.1-.4-.3-.2-.2-.4-.1-.4 0-.4 0-.6 0-.5.1-.3.1-.2.2-.2.3 0 .2.2.4.2.3.4.4.9.3 1.3.4 1.9.3 2.4.3 1.8.4 1.1.3.6.4-.1.3-.4.2-.9.1-1.1 0-1.6 0-1.2.1-.9.1-.4.2-.2.3.2.2.3.4.7.3.8.3 1.2.3 1.3.1 1.7.1 1.8.1 1.4.2.7.3.3.4-.3.3-.5.2-.5.1-.7 0-.8 0-.6.2-.4.2-.3.3 0 .3.2.1.2.1.4 0 .5.1.4.1.4.2.3.2.3.2.6.2 1.1.1 1.5.1 1.8.1 1.4.2.9.3.5.4-.1.3-.8.2-1.4.1-2.1 0-2.8-.2-2.4-.2-1.9-.4-1.4-.5-.9-.4-.9-.2-.7-.1-.7 0-.7 0-.5.1-.4.2-.3.3-.2.1-.1 0-.2-.1-.1-.3-.2-.3-.4-.4-.7-.4-1.1-.5-1.4-.5-1-.4-.8-.4-.3-.4-.1-.3-.2-.3-.2-.1-.4-.2-.4-.3-.6-.6-.7-.8-.9-1.1-1.1-1-.9-.9-.6-.9-.5-.8-.2-.7-.3-.7-.4-.5-.5-.4-.4-.6-.4-.6-.3-.7-.1-.8 0-.8-.1-.8-.3-.7-.4-.7-.4-1.1-.5-1.5-.4-1.9-.3-2.3-.2-1.7-.3-1.2-.3-.6-.3 0-.3.4-.2.8-.2 1.2 0 1.6 0 1.2-.1.8-.1.5-.2.1-.3.3-.2.5-.1.7 0 .9 0 .9.1.9.2 1 .4 1 .5.6.2.3 0-.1-.4-.4-.6-.4-.5-.5-.4-.5-.3-.5-.2-.2-.2.1-.2.4-.2.7-.2.6 0 .5.1.5.3.3.4.7.6 1 .6 1.3.7 1.7.8 1.2.5.8.3.5-.1.1-.4-.3-.5-.6-.7-.9-.8-1.3-.9-.9-.7-.5-.6-.2-.4.2-.2.7.3 1.2.6 1.8 1.1 2.2 1.5 1.7 1 1 .5.4-.1-.2-.6-.3-.6-.5-.6-.6-.7-.7-.8-.5-.6-.3-.5-.1-.3.2-.2.7.3 1.2.8 1.8 1.3 2.2 1.7 1.7 1.2 1 .5.4 0-.2-.6-.3-.7-.5-.7-.6-.7-.7-.7-.5-.6-.3-.5-.1-.2.2-.2.3 0 .3.1.4.1.6.3.7.5 1 .9 1.3 1.2 1.4 1.5 1.2 1 .8.6.4.1.1-.4-.1-.4-.2-.4-.4-.4-.5-.4-.3-.5-.2-.4 0-.5.2-.4.7.2 1.2.8 1.7 1.4 2.2 2 1.6 1.4 1.2 1 .6.4.2-.2-.1-.3-.2-.6-.3-.7-.5-1-.9-1.3-1.2-1.5-1.6-1.7-2-1.9-1.6-1.6-1.2-1.3-.7-.9-.3-.7-.6-.6-.9-.7-1.3-.7-1.4-.8-1.4-.5-1.1-.4-1-.2-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.8-.2-1.4-.1-1.9-.1-2.6 0-2 .1-1.3.1-.8.2-.2.2-.4.2-.6.1-.9.1-1.1 0-.8.1-.6.1-.4.2-.2.2-.3.2-.4.1-.4.1-.6 0-.9.2-1.3.6-1.7.7-2 1-1.6.9-1.2.7-.8.7-.4.4-.4.4-.3.2-.3 0-.2-.1.5-.6 1-1.1 1.6-1.5 2.3-2 1.6-1.5.9-1.1.3-.6-.4-.1-.5 0-.5.2-.7.4-.7.4-.6.4-.5.1-.2 0-.2-.2 0-.2.2-.3.2-.3.4-.4.7-.5 1.2-.6 1.5-.7 1.8-.8 1.2-.6.3-.5-.3-.3-1.2-.1-.9 0-.8 0-.7.2-.5.2-.4.2-.3 0-.2-.1-.2-.2.6-.5 1.3-.8 2.1-1.2 2.7-1.5 1.7-1.1.6-.8-.5-.4-1.6-.1-1.3.1-1.2.2-.9.4-.8.4-.6.4-.5.1-.3 0-.2-.2 0-.3.3-.4.4-.5.6-.6.7-.6.8-.6 1-.5 1-.5.8-.4.8-.2.7-.1.6 0 .6-.2.6-.2.7-.4.8-.5.7-.4.6-.3.6-.1.6-.1.1-.1-.4-.1-.9-.1-1.4-.1-1.1-.2-.7-.1-.4-.2-.2-.2 0-.2.2-.3.2-.3.4-.4.5-.3.8-.3.8-.3 1.1-.3.9-.2.6-.3.4-.2.2-.3.3-.2.5-.1.7 0 .8 0 .7-.2.7-.2.5-.3.6-.4-.1-.4-.7-.2-1.2-.1-1.8 0-1.4.1-1 .1-.6.2-.2.2-.4.2-.5.1-.6.1-.8 0-.9.2-1 .4-1.1.5-1.2.8-1 .5-.6.3-.5 0-.2-.2 0-.2 0-.2.1-.2.3-.3.1-.2-.1-.1-.2-.1-.4-.1-.6.3-.9.7-1.2 1.1-1.4 1.6-1.2 1.1-.9.7-.6.4-.3 0-.4.1-.4.3-.5.4-.6.6-.4.6-.4.6-.2.7-.1.7-.2.4-.3.3-.3 0-.3-.2-.4.1-.5.4-.5.8-.4 1-.4.8-.3.8-.1.7 0 .6-.1.4-.1.4-.2.3-.2.2-.3.7-.3 1.1-.4 1.7-.3 2.2-.6 1.2-.6.1-.8-.9-.9-1.9-1-1.7-.8-1.4-.9-1.1-.8-.8-.6-.5-.5-.4-.3 0-.1.2 0 .2 0 .1.2.2.2.2.2.2 0 .1-.1.2-.2.1-.5-.3-.8-.7-1.1-1-1.4-1.6-1.3-1-1-.6-.7-.2-.6.2-.6.1-.6-.1-.7-.4-.7-.4-.7-.4-.9-.3-1-.1-1.1 0-.8-.1-.6-.1-.4-.2-.2-.2-.7-.2-1.3-.1-1.8-.1-2.3 0-1.8.1-1.4.3-.9.4-.4.4-.5.4-.5.3-.5.1-.6 0-.8.2-1 .4-1.3.5-1.5.8-1.3.7-1 .6-.8.6-.6.6-.3.5-.1.3zM286.9 232.1l.4.8.3.9.2.7 0 .8-.1.7-.2.3-.3-.1-.4-.5-.4-.9-.3-.8-.1-.8-.1-.7.2-.7.2-.3.2.1zM261 231.1l2.2-.2 1.7 0 1.1 0 .7.1.1.2-.4.2-1.1.1-1.6.2-2.2.1-1.6.1-1.2-.1-.6-.1-.2-.2.5-.1 1-.2zM244.9 228.2l.2-.2 1.9-.1 3.6-.1 5.4 0 7.2.1 5.4.1 3.5.2 1.7.2-.1.2-1 .2-2 .1-2.8.1-3.8 0-2.9.1-2.1.3-1.3.4-.6.4-.5.4-.7.3-.7.1-.8 0-.8-.1-.8-.3-.8-.4-.7-.4-.9-.5-1.1-.3-1.2-.2-1.4-.1-1-.2-.6-.1zM202.7 227.3l-.9.7-.7.5-.5.2-.4.1-.2-.1 0-.3.1-.4.2-.5.4-.7.4-.5.6-.3.6-.1.7.2.3.2-.1.4zM283.9 221.1l.4.8.3.9.2.7 0 .8-.1.7-.2.3-.3-.1-.4-.5-.4-.9-.3-.8-.1-.8-.1-.7.2-.7.2-.3.2.1zM248.3 215.7l.4-.4.4-.3.5-.2.5 0 .6 0 .5.1.4.4.5.5.3.7.2.6 0 .5-.2.5-.3.3-.5.3-.4.2-.5.1-.6 0-.5-.2-.5-.3-.4-.5-.4-.7-.2-.6 0-.6zM281.9 214.1l.4.8.3.9.2.7 0 .8-.1.7-.2.3-.3-.1-.4-.5-.4-.9-.3-.8-.1-.8-.1-.7.2-.7.2-.3.2.1zM231.7 210l.1.2 0 .2-.2.2-.4.2-.4.2-.4.3-.3.5-.1.7 0 .8-.2.7-.4.6-.5.6-.8.4-.5.5-.4.7-.2.7 0 .8.1.7.1.7.2.5.2.6.3.4.4.4.5.3.4.2.2.4-.1.6-.4.8-.8.9-.5.9-.4.7-.2.7 0 .6-.2.4-.3.4-.5.2-.7.1-.5-.8-.3-1.8-.1-2.6.2-3.7.1-2.7.2-2 .2-1.1.3-.2.2-.4.1-.5.1-.7 0-.8.3-.7.7-.4 1.1-.3 1.4-.2 1.2 0 .7 0zM277.7 199.3l.9 2.4.7 1.9.4 1.6.1 1.1-.1.7-.2.3-.3.1-.4-.3-.4-.7-.3-.6-.2-.8-.1-.7 0-.8-.2-.9-.2-.8-.4-1-.5-.9-.3-.9-.2-.8-.1-.7.2-.7.3.1.5.8zM235.5 186.1l1.2-.2.9 0 .7 0 .4.1.1.2-.2.2-.5.1-.9.2-1.2.1-.9.1-.6-.1-.4-.1-.2-.2.2-.1.6-.2zM239.4 182.9l-.3.4-.8.4-1.1.2-1.4.1-1.8 0-1.4.1-1 .1-.6.2-.2.2-.5.2-.8 0-1.2 0-1.4-.1-1-.2-.7-.1-.3-.2.2-.2.7-.2 1.3-.2 1.9-.2 2.5-.3 2-.2 1.4-.3.8-.2.3-.3.5-.1.6-.1.7 0 .9.2.5.2.3.2zM271.9 181.1l.4.8.4.8.2.8.1.6 0 .6.1.5.3.7.4.6.4.7.4.7.2.7 0 .7-.1.7-.2.3-.3.1-.4-.3-.4-.7-.4-.8-.3-.9-.3-1.2-.3-1.3-.2-1-.3-.8-.2-.4-.3-.2-.1-.3-.1-.5 0-.5.2-.7.2-.3.2.1z"/></svg><svg x="780" y="0" width="260" height="236" viewBox="40 0 260 236" overflow="hidden"><clipPath id="kac0"><path clip-rule="evenodd" d="M40 0H300V236H40Z M40 104H90L83.5 236H40Z"/></clipPath><g clip-path="url(#kac0)"><path d="M225.9 187.2l-.3.8-.3.8-.2.9-.1.8 0 .8-.2 1-.6 1.3-.7 1.4-1 1.7-.8 1.7-.6 1.6-.5 1.6-.2 1.6-.3 1.2-.2.8-.2.5-.2.1-.2 0-.3-.1-.3-.3-.4-.3-.3-.5-.2-.4 0-.5 0-.6-.1-.5-.2-.4-.3-.4-.4-.3-.3.1-.4.5-.3 1-.3 1.3-.5 1.4-.5 1.2-.6 1.3-.8 1.2-.5 1.3-.4 1.5-.2 1.7 0 1.8.2 1.6.4 1.4.5 1.2.8 1 .4.8 0 .5-.3.4-.7.1-.6.2-.5.2-.4.3-.3.3-.3.3-.1.4 0 .3.1.4.7.3 1.3.1 2 .1 2.6-.1 1.8-.2.9-.3.1-.3-.7-.6-.7-.7-.4-1-.4-1.3-.3-1.6 0-1.2.3-.7.5-.4.7.1.6-.2.5-.6.2-.9.2-1.2.2-.8.4-.5.5-.2.6.2.6-.3.7-.9.6-1.4.6-1.9.6-1.3.5-.7.5 0 .4.6.4.6.2.6.1.6 0 .6.2.6.4.8.5.8.8.9.5.9.4.9.2.8 0 .7-.1.7-.1.5-.2.4-.2.3-.1.3 0 .2.3.1.3.1.4-.2.3-.4.4-.7.3-.8.3-.7.3-.4.3-.3.3 0 .3.4.1.6.1 1 0 1.3-.1 1.3-.3 1.1-.4 1.1-.4 1-.6.8-.4.6-.6.5-.4.2.2.2 1 .1 1.7.1 2.4 0 1.7-.1 1.1-.2.4-.3-.3-.3-.4-.4-.5-.2-.6-.3-.7-.2-.4-.2-.1-.1.2-.2.5-.2.6-.4.6-.6.7-.8.7-1 .6-1.3.4-1.5.2-1.8 0-2.1-.1-1.6-.2-1.4-.2-.9-.3-.6-.4-.4-.5-.4-.6-.2-.7-.1-.6-.6-.3-1.2-.2-1.6-.1-2.1-.1-1.4-.3-.6-.3.1-.3.9-.4.7-.4.7-.4.5-.3.3-.4.3-.2.1-.3 0-.2-.1-.2-.6-.2-.9-.2-1.4-.3-1.8-.5-2-.8-2.2-1-2.4-1.3-2.6-1.1-1.7-.9-.9zM100 215.2l0 1.3.1 1.3.3 1.1.4 1 .4.9.4 1 .3.9.2.9.1.8.4.7.8.4 1.2.3 1.6 0 1.2-.1.8-.1.6-.2.2-.3.9-.2 1.8-.3 2.5-.2 3.3-.3 2.7-.4 1.9-.5 1.2-.7.6-.8.4-.7.3-.7.2-.6 0-.6.3-1.2.8-1.8 1.1-2.3 1.5-3 1.3-2.4 1-1.7.7-1.1.5-.4.6-.9.8-1.2.8-1.7 1-2.1 1.7-2.7 2.4-3.5 3-4.2 3.7-4.8 2.8-1.4 1.9 2.2 1 5.6.1 9.2 0 7 0 4.6-.2 2.5-.2.2-.2.3-.1.5-.1.7 0 .8-.1.6-.1.5-.2.4-.2.2-.2.4-.1.8-.1 1 0 1.3-.4 1-.9.8-1.2.4-1.7.1-1.3.2-.8.3-.5.4 0 .4 3.6.3 7.2.2 10.8.1 14.4-.1 10.6-.2 7-.3 3.2-.3-.5-.6-.7-1-.9-1.7-1-2.2-1.3-2.8-1-2.3-.9-1.6-.7-1-.5-.4-.4-.6-.4-.6-.3-.7-.3-.8-.3-.7-.4-.7-.4-.5-.5-.4-.4-.6-.4-.6-.3-.7-.3-.8-.3-.8-.6-.8-.6-.7-.7-.7-.7-.7-.6-.9-.6-1-.5-1.1-1.3-1.7-2.2-2.4-3-3.2-3.8-3.8-2.9-2.8-2.1-1.9-1.2-1-.3 0-.4-.2-.5-.4-.6-.5-.7-.8-.6-.5-.5-.4-.4-.2-.3 0-.4-.2-.5-.4-.6-.5-.7-.8-.6-.5-.5-.4-.4-.2-.3 0-.5-.2-.8-.6-.9-.7-1.2-1-1.1-.7-1-.6-.9-.2-.8 0-1 .2-1.1.4-1.3.5-1.4.8-1.3.5-1 .4-.7.2-.6 0-.7.2-.9.4-1 .5-1.2.8-1.1.5-.8.4-.7.2-.6 0-.7.2-.7.4-.9.5-.9.8-.9.6-.9.5-.8.4-.8.2-.8.4-.8.5-.7.6-.7.8-.6.5-.5.4-.4.2-.3 0-.5.3-.8.6-.9 1-1.2 1.2-1 1-.7.6-.6.3-.3 0-.7.6-1.2 1.1-1.6 1.8-2.1 2.3-1.6 1.8-1 1.3-.5.8 0 .3-.2.4-.4.5-.5.6-.8.7-.6.7-.5.8-.4.8-.2.8-.3.7-.4.6-.5.6-.4.4-.5.5-.4.7-.3.7-.2.8-.4.8-.5.9-.6.9-.8.9-.5 1.1-.4 1.1zM154.7 178.4l.9 1.2.7.9.5.7.2.5 0 .3.2.4.4.5.5.6.8.7.5.6.4.5.2.4 0 .3.4.8.7 1.1 1.1 1.5 1.6 1.9 1.1 1.7.9 1.4.6 1.1.2.8.5.9.6 1 .8 1.1 1 1.2.8 1.1.6 1 .5.9.2.8.3.7.4.6.5.6.4.4.5.5.4.7.3.7.2.8.3.7.4.6.5.6.4.4.7.9.9 1.5 1.1 2 1.2 2.5.9 2 .6 1.5.2.9-.1.4-.2.3-.3.1-.4-.1-.6-.2-.7-.2-1-.1-1.3-.1-1.6 0-1.2.1-.9.1-.5.2-.2.2-1.1.2-2.1 0-3 0-3.9-.1-3.1-.2-2.1-.3-1.1-.4-.3-.6-.2-.5-.1-.7 0-.7 0-.8-.2-.8-.2-.8-.4-.7-.5-.7-.4-2.9-.3-5.2-.2-7.4-.2-9.7.2-7 .4-4.3z"/><path d="M282.2 153.1l-.7.8-.8.6-1.1.4-1.2.2-1.3.1-1.1.1-.7.4-.3.4 0 .6.1.5.1.4.3.4.3.3.4.2.5.3.6.1.7.2.5.6.5 1.3.4 1.7.2 2.3.4 1.9.4 1.4.4 1 .6.6.7.5.7.3.9.2.9.2.7.2.5.3.2.5 0 .6-.1.4-.2.4-.4.2-.4.1-.5.3-.5.5-.5.6-.6.8-.4.8-.3.7-.1.6 0 .6-.1.4-.1.4-.2.3-.2.2-.2.2-.1.4-.1.5 0 .6-.1.4-.1.4-.2.3-.2.2-.2.2-.1.4-.1.5 0 .6-.1.6-.3.8-.4.9-.4 1-.5.8-.5.7-.4.6-.3.3-.6.4-.7.3-.9.3-1.1.2-.8.3-.6.2-.4.3-.2.2-.6.2-1 .1-1.4.1-1.8 0-1.5-.1-1.1-.3-.8-.4-.4-.4-.6-.4-.6-.3-.7-.1-.8 0-.8.1-.7.3-.6.4-.6.6-.4.6-.3.7-.1.8 0 .8.1.7.1.5.3.5.3.3.4.2.6.2.7.1.8 0 .6.1.5.2.3.3.1.4 0 .6-.2.7-.4.8-.4.9-.5 2.1-.4 3.3-.3 4.4-.2 5.6-.4 4.3-.5 3-.6 1.7-.8.6-.3.3.2.3.7.2 1.1.1.9-.1.7-.1.5-.1.2-.3.2 0 .1.1 0 .3-.1.5.3.4.7.4 1 .2 1.4.2 1-.1.5-.4.2-.8-.3-1.1-.1-.8 0-.6.1-.4.3-.2.2-.4.1-.5.1-.6 0-.8.1-.9.2-.8.4-1 .5-.9.4-1.1.2-1.2.2-1.4 0-1.6.1-1.2.2-.9.3-.4.4-.2.6.2.6.3.8.7.9.8.6.8.5.6.2.4 0 .3.3.7.6 1 1 1.3 1.2 1.7 1 1.4.6 1.1.3.9 0 .6-.2.7-.6.8-.7 1.1-1 1.2-.8 1-.6.9-.4.8-.2.6 0 .5 0 .3.2.2.3 0 .4-.2.4-.3.5-.4.6-.6.4-.5.3-.4.2-.4 0-.3.1-.4.3-.4.5-.6.6-.6.6-.5.4-.3.4-.1.3 0 .4.2.5.6.5.9.7 1.2.6 1 .5.8.6.7.4.4.4.4.3.4.1.3 0 .3.1.3.1.4.3.3.3.3.3.2.4.1.3.1.4-.1.3-.1.2-.2.1-.3 0-.3-.2-.3-.2-.4-.4-.4-.5-.4-.4-.4-.2-.4-.1-.4 0-.3-.4-.6-.6-1-.9-1.4-1.3-1.7-.8-1.4-.4-1.1.1-.7.5-.6.3-.4.1-.4 0-.4-.3-.3 0-.3.1-.3.3-.2.5-.3.3-.2 0-.1-.1-.1-.4-.1-.4.1-.3.2-.4.4-.4.4-.4.4-.3.3-.4.1-.4 0-.6-.4-.7-.8-.9-1.2-1.2-1.7-.6-1.2-.3-.9.3-.6.7-.2.5 0 .5 0 .3.1.2.3.4.2.6.3.8.2 1.1.3.9.3.6.4.5.4.2.5.5.4.6.2.8.2 1 0 1.3.5 1.5 1.2 1.9 1.8 2.1 2.4 1.2 2.1.3 2-.5 1.7-1.6 1.5-1.1 1.3-.7 1-.3.9.1.6.3.2.6-.2.8-.6 1.2-1.1.9-1 .8-.9.5-.7.4-.7.3-.5.4-.4.3-.1.3 0 .9.6 1.3 1.4 2 2.1 2.4 2.7 2 2.1 1.6 1.4 1.3.7.8 0 .5-.4.4-.7 0-1-.2-1.4-.2-1.1-.3-.8-.4-.5-.4-.3-.4 0-.2.3-.1.6 0 .8 0 .6-.1.5-.2.3-.2.1-.7-.5-1.3-1.2-1.8-1.8-2.4-2.4-1.3-2.3-.4-2.1.7-2.1 1.7-1.8 1.3-1.3 1.1-.6.7.1.3.7.4 1 .3 1.5.3 1.9.2 2.2.3 1.7.4 1.1.4.6.4 0 .3-.5.1-.9-.1-1.3-.3-1.8-.2-1.5-.3-1-.2-.6-.3-.3-.2-.4-.1-.6 0-.8 0-1-.1-.9-.1-.6-.2-.4-.3-.3.2-.6.6-1 1.1-1.3 1.5-1.7 1.1-1.3.8-1 .4-.7 0-.3-.2-.3-.2-.3-.4-.2-.5-.3-.3-.3-.1-.5 0-.6.3-.7.2-.8.1-1 .1-1.2 0-1.3 0-1 .1-.8.2-.4.3-.2.2-.5.1-.7.1-1.1 0-1.3 0-1 .1-.8.2-.4.3-.2.2-.3.1-.4.1-.4 0-.6.1-.7.2-.7.4-.9.5-.9.4-.9.2-.9.2-.8 0-.8.1-1 .4-1.2.6-1.3.7-1.5.5-1.2.2-.9-.1-.6-.4-.3-.5-.1-.7.2-.8.5-.9.8-1.1.5-1.2.4-1.4.2-1.6 0-1.2.1-.8.2-.4.3-.1.3-.2.3-.2.3-.4.2-.4.1-.4-.3-.4-.8-.4-1.2-.4-1.7-.7-1.7-.9-1.6-1.3-1.6-1.6-1.6-1.4-1.2-1.2-1-1.1-.7-.9-.3-.7-.5-.5-.6-.2-.7 0-.8.1-.7.2-.7.4-.5.5-.4.2-1 0-1.3-.2-1.9-.5-2.3-.5-1.9-.5-1.4-.6-1-.6-.6-.9-.4-1.3-.3-1.7-.1-2.1 0-1.7.2-1.4.4zM307 214.7l0 .3-.2.5-.6.6-.7.8-1 .9-.7.8-.6.6-.2.5 0 .3-.3.6-.7.9-1.1 1.1-1.3 1.3-1.1 1-.8.4-.5 0-.2-.4-.5-.7-.8-.9-1.2-1.2-1.5-1.4-1.1-1.2-.7-.8-.3-.5.2-.2.4-.1.7-.1 1 0 1.3 0 1.1-.1.7-.1.5-.2.2-.3.2-.2.4-.1.5 0 .6 0 .4-.1.4-.1.3-.2.2-.3.2-.2.4-.1.5 0 .6 0 .6-.2.8-.2.8-.4.9-.5.8-.3.6-.2.3-.1.2.2.2.1.1.3zM309.7 203.9l.1 2.2 0 1.7-.1 1.2-.3.9-.3.4-.5.4-.6.2-.7.1-.8 0-.7 0-.4-.1-.3-.2-.2-.2.2-.7.6-1.3.8-1.8 1.2-2.4.9-1.2.7-.2zM284.8 196.4l-.1 1.4-.6 1-1 .6-1.5 0-1.9-.3-1.1-.5-.3-.5.6-.6 1.4-.7 1.2-.7 1-.6.7-.5.4-.5.4-.3.3-.2.2-.1.2.2.1.4.1.8z"/><path d="M223.2 224.4l-1.1-.6-1-.4-.9-.3-.9-.1-.8 0-.7.1-.4.2-.3.4-.2.4-.1.3-.3.1-.3 0-.4-.2-.4-.1-.5 0-.5.1-.6.2-.5 0-.4-.1-.5-.3-.3-.4-.4-.4-.3-.2-.4-.1-.3 0-.3.1-.3.3-.2.4-.3.4-1.4.3-2.4 0-3.7-.3-4.7-.4-3.7-.5-2.5-.5-1.5-.4-.4-.3-.2-1-.1-1.6.1-2.2.3-2.8.2-2.2.2-1.4.2-.8.2-.2.2.1.2.2.2.3.2.5.2.4.2.2.3.2.3 0 .3-.4.4-.7.3-1 .3-1.4.1-1.1-.1-.9-.3-.7-.5-.4-.4-.6-.4-.6-.3-.7-.3-.8-.4-.8-.5-.9-.7-.8-.8-.8-.7-.6-.5-.4-.5-.2-.3 0-.2.3-.2.5-.1.9-.1 1.1-.1.9-.2.7-.2.4-.2.2-.2.6-.1 1-.1 1.4 0 1.8-.2 1.7-.4 1.6-.5 1.6-.8 1.4-.5 1.4-.4 1.4-.2 1.3 0 1.3.1 1.1.1.7.2.5.2.2.2.3 0 .4-.1.6-.2.7-.3.5-.5.3-.7.1-.8-.1-.6-.1-.5-.3-.3-.3-.1-.4-1.4-.4-2.6-.2-3.8-.1-5.1 0-3.8.1-2.6.1-1.4.2-.2.2-1.3.2-2.4.1-3.4.1-4.6 0-3.5.1-2.4.1-1.3.2-.3.2-.7.2-1.1.2-1.6.2-2.1.1 4.4.1 10.8 0 17.2 0 23.7-.1 17.5-.1 11.3-.4zM173.4 11l-2.1 0-1.5.1-1.2.1-.6.2-.2.2-.4.2-.6.1-.9.1-1.1 0-.8.1-.6.1-.4.2-.2.2-.5.3-.7.2-1.1.3-1.3.2-1.7.6-2 .9-2.4 1.1-2.7 1.6-2.8 1.8-2.8 2.1-2.8 2.5-2.8 2.8-2.1 2.2-1.4 1.6-.7.9 0 .3-.2.4-.4.5-.5.6-.8.7-.5.6-.4.5-.2.4 0 .3-.2.4-.4.5-.5.6-.8.7-.5.6-.4.5-.2.4 0 .3-.2.6-.6.7-.7 1-1 1.2-.9 1.3-.9 1.5-.8 1.7-.8 1.8-.6 1.4-.6 1.1-.6.8-.4.3-.4.1-.2-.3-.2-.6-.2-.9-.1-.8-.2-.6-.2-.3-.3-.2-.2-.4-.1-.5 0-.6 0-.8-.2-.8-.4-.8-.6-.7-.7-.7-.6-.7-.4-.7-.1-.8 0-.8-.1-.7-.1-.5-.2-.3-.3-.2-.2-.3-.1-.4 0-.4 0-.6-.2-.8-.4-1-.6-1.3-.7-1.5-1.3-2-1.8-2.5-2.3-3.1-2.8-3.6-2.2-2.6-1.5-1.8-1-.9-.3 0-.6-.4-1-.7-1.4-1.1-1.7-1.6-1.7-1.3-1.9-1.3-1.9-1.1-2-1-2-.8-1.9-.6-1.8-.5-1.8-.2-1.4-.3-1-.2-.6-.3-.2-.2-.4-.2-.6-.1-.9-.1-1.1 0-.8-.1-.6-.1-.4-.2-.2-.2-.7-.2-1.1-.1-1.6-.1-2.1 0-1.6.1-1.2.1-.7.3-.3.3-.3.3-.1.4 0 .3.1.4.2.3.4.2.7.1.8 0 .6 0 .5.1.4.2.2.3.6.3 1.2.4 1.5.4 2.1.5 1.7.5 1.4.5 1 .5.7.5.7.4.6.2.6.2.6 0 .6.1.8.2.9.4 1 .5.8.5.7.4.6.4.3.4.2.3 0 .3-.3.2-.4.2-.4.1-.3 0-.3-.2-.3-.2-.6-.2-1-.1-1.4-.1-1.7 0-1.3.1-.9.2-.5.4 0 .4.6.4 1 .5 1.5.5 2.1.5 1.9.6 1.8.6 1.7.7 1.4.7 1.5.8 1.3.8 1.2.9 1.1.8.7.7.4.6-.1.3-.4.2-.4.1-.3 0-.3-.2-.3-.2-.5-.2-.7-.1-1-.1-1.3 0-.9.1-.7.2-.3.3-.1.3.5.6 1 .7 1.6.9 2.1 1.1 1.9 1 1.8 1.1 1.6 1.1 1.3 1.2 1 .9.4.6 0 .4-.4.2-.4.1-.3 0-.3-.2-.3-.2-.4-.2-.4-.1-.7-.1-.7 0-.6-.1-.5-.1-.3-.2-.2-.2-.3-.2-.4-.1-.5 0-.7.1-.4.1-.3.2-.1.3.1.4.3.4.5.4.8.5 1.1.5 1 .6.9.6.7.7.7.7.6.6.5.4.4.2.3 0 .6.2.9.6 1.1.8 1.3 1.2 1 .9.4.6 0 .4-.4.2-.5 0-.6-.1-.6-.4-.7-.4-.6-.4-.5-.2-.5-.1-.3.1-.3.1-.2.2-.1.2 0 .3.6.8 1.1 1.3 1.7 1.7 2.2 2.2 1.7 1.7 1.1 1.2.6.8 0 .3.2.4.4.5.5.6.8.7.6.7.5.6.4.6.2.6.1.4-.1.4-.3.2-.4.1-.5-.1-.6-.3-.6-.5-.7-.8-.6-.5-.5-.4-.4-.2-.3 0-.7-.4-1.1-.7-1.6-1.1-1.9-1.6-1.9-1.3-2-1.3-2-1.1-2-1-1.6-.7-1.3-.6-.9-.2-.6 0-.6-.1-.6-.3-.7-.4-.7-.4-.6-.4-.7-.3-.5-.1-.6 0-.5-.1-.4-.1-.2-.2-.2-.2-.3-.2-.4-.1-.4-.1-.6 0-.7-.1-.7-.3-.9-.4-.9-.4-1-.4-1-.3-1-.1-1.1 0-.8-.1-.6-.1-.4-.2-.2-.2-1.3-.2-2.4-.1-3.4-.1-4.6 0-3.5.1-2.4.1-1.2.2-.2.2-.6.3-1 .2-1.4.3-1.8.2-2.2.6-2.5 1-2.9 1.4-3.3 1.8-2.9 1.9-2.7 2-2.3 2.2-2.1 2.3-1.6 1.9-1 1.4-.5 1 0 .6.1.4.2.3.3.2.3.1.5-.2.5-.3.6-.6.7-.7.6-.6.5-.4.4-.1.3 0 .6-.3.7-.5 1-.8 1.2-1 1.7-1.1 2.4-1.2 3-1.4 3.6-1.5 2.7-1 1.8-.5 1-.1.1.4 0 .4-.2.3-.4.3-.4.2-.9.6-1.3 1.1-1.6 1.5-2 2-1.5 1.6-1 1.2-.4.8.1.4.2.2.4.1.7-.1.8-.3.7-.3.6-.4.6-.4.4-.5.5-.4.7-.4.7-.3.8-.3.7-.3.6-.4.6-.4.4-.5.7-.6 1-.6 1.2-.7 1.5-.7 1.5-.7 1.5-.4 1.6-.4 1.6-.3 1.1-.1.8 0 .4.2 0 .3-.1.3-.2.2-.3.1-.3.1-.7.3-.9.7-1.2.9-1.6 1.3-1.1 1.1-.7.9-.3.8.1.6.5.2 1-.2 1.5-.6 2-1 2.1-.8 2-.8 2-.6 2.1-.5 1.6-.3 1.1-.2.6 0 .1.2 0 .3-.1.2-.3.4-.3.3-.4.3-.3.2-.4.1-.3 0-.4.2-.5.4-.6.5-.7.8-.6.6-.5.4-.5.2-.3.1-.3.1-.2.2 0 .3.1.4.1.2.3.1.4-.1.5-.3.6-.2.6-.1.8 0 .8 0 .8-.2.9-.2.9-.4.9-.5 1-.4 1-.2 1-.1 1.1 0 .9-.1.6-.1.5-.2.2-.3.2-.1.2 0 .2 0 .1.2 0 .3-.3.4-.4.5-.7.7-.5.4-.5.4-.5.2-.3.1-.3.1-.2.2 0 .3.1.4.8.1 1.7 0 2.5-.3 3.3-.5 2.5-.3 1.8-.2.9 0 .1.2 0 .2-.2.2-.4.2-.4.2-.4.2-.2.3-.1.3.1.4.8.4 1.5.4 2.3.5 3.1.5 2.3.4 1.7.4.9.3.2.3.2.2.4.1.5.1.6 0 .5 0 .6.2.6.3.7.4.4.3.3.3 0 .2-.1.2-.7.2-1.2.1-1.8 0-2.3 0-1.8.1-1.2.1-.7.2-.2.2-.4.2-.6.1-.9.1-1.1 0-.8.1-.6.1-.4.2-.2.2-.6.3-1 .2-1.4.3-1.8.2-1.4.3-1 .2-.6.3-.2.2-.5.3-.7.2-1.1.3-1.3.2-1.5.5-1.6.6-1.9.8-2 1-1.6.9-1.2.7-.8.7-.4.4-.6.5-.6.4-.7.3-.8.2-.9.5-.8.6-1 .8-.9 1-.8.7-.6.6-.5.2-.3 0-.6.5-.9.9-1.3 1.3-1.6 1.8-1.1 1.5-.8 1-.4.7 0 .3-.3.7-.6 1-1 1.3-1.2 1.7-1 1.6-.7 1.4-.5 1.2-.2 1.2 0 .8 0 .6.2.3.3 0 .9-.7 1.5-1.4 2.1-2.1 2.7-2.7 2.1-2 1.4-1.1.8-.4.2.4 0 .5-.1.6-.4.6-.4.7-.4.7-.2.6-.1.7.1.6.1.5.2.3.2.2.3 0 .3-.1.2-.2.1-.3.1-.4.1-.3.3-.3.3-.1.4-.2.4-.2.4-.4.4-.5.3-.6.6-.8.8-1 1.1-1.2 1.4-1.4 1.1-1 .7-.6.5-.2.2.2 0 .3-.1.5-.4.5-.4.7-.4.6-.2.6-.1.4.1.4.1.3.2.2.2.1.3 0 .8-.6 1.1-1 1.5-1.4 1.9-2 1.5-1.5 1.1-.9.6-.4.2.2 0 .3-.1.5-.4.5-.4.7-.4.6-.2.6-.1.4.1.4.1.3.2.2.2.1.3 0 .8-.6 1.3-1 1.7-1.4 2.2-2 1.7-1.5 1.1-.9.7-.4.2.2.1.3 0 .3-.2.4-.2.6-.1.3 0 .3.3.2.3.1.7-.3 1.1-.6 1.3-.9 1.7-1.3 1.5-.8 1.2-.6 1.1-.1.8.3 1.1-.2 1.5-.4 1.9-.9 2.2-1.3 1.8-.9 1.3-.6 1-.3.6 0 .5-.2.7-.2.6-.4.7-.5.6-.3.6-.2.5-.1.4.2.2.4-.2.8-.4 1.2-.8 1.5-.5 1.3-.4 1-.2.8 0 .6-.2.8-.6 1.1-.7 1.4-1 1.7-.9 1.7-.7 1.8-.7 1.8-.4 1.8-.6 1.5-.4 1.3-.6.9-.4.7-.6 1-.4 1.4-.6 1.7-.4 2.1-.6 1.7-.4 1.4-.6 1-.4.7-.5.9-.4 1.1-.3 1.4-.2 1.6-.3 1.2-.2.8-.3.6-.2.2-.2.2-.1.4-.1.5 0 .6-.1.4-.1.4-.2.3-.2.2-.2.2-.1.4-.1.5 0 .6-.1.6-.3.8-.4.8-.4.9-.4 1-.3.8-.1.9 0 .8-.1.8-.3.9-.4.9-.4.9-.5 1.2-.4 1.4-.3 1.6-.2 1.8-.3 1.4-.3 1.1-.4.8-.3.3-.6.1-.7-.2-.8-.4-1-.8-.9-.5-.8-.4-.6-.2-.6 0-.7-.1-.7-.3-.9-.4-.9-.4-1.5-.4-2.2-.3-2.7-.1-3.3 0-2.5.1-1.8.1-.9.2-.2.2-.5.2-.6.2-1 .2-1.2.1-.6-.1-.1-.5.4-.7 1-1 .8-.9.5-.8.3-.6 0-.6.3-.6.6-.6.9-.7 1.3-.7.9-.6.6-.5.4-.4 0-.3-.2-.3-.2-.3-.4-.2-.5-.3 0-.4.5-.6 1-.8 1.5-.9 1.1-.8.7-.6.4-.6-.1-.3-.2-.3-.3 0-.3.1-.6.2-.4.2-.5 0-.5-.1-.4-.2-.2-.2-.1-.3.2-.3.4-.4.7-.5 1.1-.5 1.5-.7 1.8-.7 1.4-.7.9-.5.5-.5.1-.4-.1-.3-.2-.3-.4-.2-.5-.2-.3-.3 0-.3.1-.4.4-.4.4-.3.5-.2.5-.1.6 0 .7-.2.8-.4 1.1-.6 1.2-.7 1.1-.6 1-.4.9-.1.8 0 .6-.2.4-.2.2-.3 0-.4-.6-.4-1.1-.2-1.8-.1-2.3 0-1.8.1-1.2.1-.7.2-.2.2-.5.3-.7.2-1.1.3-1.3.2-1.3.4-1.4.5-1.5.6-1.5.8-1.6 1-1.6 1.3-1.8 1.5-1.8 1.8-1.3 1.5-.9 1-.5.7 0 .3-.1.4-.3.4-.4.4-.4.4-.6.7-.6 1-.7 1.2-.8 1.5-.5 1.3-.4 1-.2.8 0 .6-.1.5-.2.4-.3.5-.3.3-.6-.3-.8-1-1-1.8-1.2-2.4-1.3-2.3-1.5-2.1-1.7-2-1.8-1.8-1.8-1.6-1.9-1.4-2-1.2-2-1-1.7-.7-1.4-.6-1.1-.2-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.7-.2-1.1-.1-1.6-.1-2.1 0-1.5.1-1.2.1-.6.2-.2.2-.4.2-.5.2-.7.1-.9.1-.6.1-.4.2-.2.3.1.4.6.3 1.2.3 1.7.3 2.3.3 1.9.4 1.5.6 1.1.8.7 1 .9.9 1 .6 1.1.4 1.3.3 1.1.3.9.3.6.4.3.4.2.4 0 .3-.3.2-.4.1-.3.2-.3.2-.1.4-.1.3.3.5.6.4 1.1.5 1.3.6 1.1.5.7.4.5.2.1.2 0 .3 0 .3-.2.4-.2.6 0 .5.4.6.7.6 1 .7.7.7.6.6.2.6 0 .6.1.4.2.3.3.2.3.1.5.2.7.5.7.8.9.9.5.7.3.6-.2.3-.4.1-.4 0-.3 0-.2-.2-.2-.2-.4-.2-.5-.1-.6-.1-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.9-.2-1.7-.1-2.3-.1-3.1 0-2.3.1-1.6.1-.9.2-.2.2-.4.2-.5.1-.6.1-.8 0-1.1.2-1.4.6-1.8.7-2 1-1.9 1.2-1.9 1.4-1.9 1.6-1.8 1.8-1.5 1.6-1.1 1.4-.9 1.3-.4 1-.4.8-.3.8-.1.7 0 .6.1.4.2.3.3.2.3.1.4-.2.3-.2.4-.5.3-.6.6-.8 1-1 1.3-1.2 1.6-1.4 1.3-.9.9-.4.6 0 .3.5.3.4.4.2.5.2.6 0 .5-.2.7-.4.6-.6.7-.7.8-.5.9-.3.9 0 1.1.3 1 0 .9-.1.7-.3.7-.5.7-.3.8-.1.8 0 .8.3.6.1.5 0 .4-.1.2-.3.7-.2 1.2-.1 1.8 0 2.3 0 1.8-.1 1.3-.1.7-.2.2-.3.2-.2.4-.1.5 0 .6 0 .4 0 .4.1.2.1.1.2-.1.3-.2.2-.5.4-.7.3-.8.6-.8.7-.9.8-.9 1-.8.7-.6.6-.5.2-.3 0-.2.1-.2.2-.1.3-.1.3-.3.6-.5.6-.8.8-1 .9-.9 1.1-.9 1.2-.8 1.4-.8 1.5-.5 1.3-.4 1-.2.8 0 .6-.1.4-.1.4-.2.3-.2.2-.2.8-.1 1.5-.1 2.2 0 2.8.1 2.1.1 1.5.2.9.2.2.3.4.2.6.3.8.2 1.1.3.8.3.6.4.3.3.1.3-.5.3-1.1.1-1.5.1-2.2.1-1.7.1-1.3.2-.9.3-.5.2-.4.3-.2.3-.2.3 0 .3.2.2.3.1.5.1.6.1.5.2.2.3.2.4-.1.3-.6.3-1 .3-1.6.3-2.1.2-1.5.2-1.1.2-.6.2-.2.2.1.2.2.2.3.2.5.2.4.3.2.3.1.4-.1.4-.5.4-.9.5-1.4.5-1.8.5-1.5.4-1.1.4-.7.4-.4.4-.3.5-.2.6-.1.6-.1.6-.4.6-.7.5-1 .5-1.3.6-1.2.7-1.3.9-1.1.9-1.2.8-.6.6-.3.6.2.3.6.3.6.2.6.1.6 0 .6.1.5.3.7.4.6.4.7.4.7.3.6.1.6 0 .6.1.5.3.7.4.6.4.7.4.7.3.6.1.6 0 .6.1.5.3.7.4.6.4.7.4.7.3.6.1.6 0 .6.1.5.3.7.4.6.4.7.5.9.4 1 .3 1.1.2 1.3.3 1.2.4 1 .5.8.4.7.4.7.3.6.1.6 0 .6.1.4.1.4.2.3.2.2.2.2.1.4.1.5 0 .6.1.4.1.4.2.3.2.2.2.2.1.4.1.5 0 .6.1.4.1.4.2.3.2.2.2.2.1.4.1.5 0 .6.1.4.1.4.2.3.2.2.2.2.1.4.1.5 0 .6.1.6.3.8.4.8.4.9.4 1 .3.8.1.9 0 .8.1.6.1.5.2.4.2.2.2.3.1.5.1.7 0 .8.1.8.3.9.4.9.4.9.4 1 .3.8.1.9 0 .8.1.6.1.5.2.4.2.2.2.3.1.5.1.7 0 .8.1.6.1.5.2.4.2.2.3.6.3 1 .3 1.5.3 1.8 1.6 1.4 3 .9 4.3.5 5.6-.1 4.1-.3 2.6-.5 1-.8-.5-1-.4-1-.2-.9-.1-.8 0-.8-.1-.7-.1-.5-.2-.3-.3-.2-.2-.4-.1-.5 0-.6 0-.8-.1-.7-.1-.5-.2-.3-.3-.2-.2-.4-.1-.6 0-.9 0-1.1-.1-.8-.1-.6-.2-.4-.3-.2-.2-.6-.1-.8 0-1.2 0-1.6-.1-1.2-.1-.9-.2-.5-.3-.2-.2-.9-.1-1.5 0-2.1 0-2.8-.1-2.2-.1-1.5-.2-.8-.3-.2-.2-1.3-.1-2.4 0-3.4 0-4.6 0-3.5.1-2.4.2-1.2.3-.2.2-.9.1-1.5.1-2.1 0-2.8 0-2.2.1-1.5.2-.8.3-.2.2-1 .3-1.9.2-2.7.3-3.6.2-2.7.3-1.9.2-1 .3-.2.2-.4.1-.6.1-.9 0-1.1 0-.8.1-.6.2-.4.3-.2.2-.4.1-.6.1-.9 0-1.1 0-.8.1-.6.2-.4.3-.2.2-.4.1-.6.1-.9 0-1.1 0-.8.1-.6.2-.4.3-.2.2-.4.1-.5.1-.6 0-.8 0-.7.1-.5.2-.3.3-.2.3-.9.4-1.5.4-2.1.5-2.8.4-2.2.4-1.5.3-.8.3-.2.2-.3.1-.4.1-.4 0-.6 0-.5.1-.4.2-.2.3-.2.2-.3.1-.4.1-.4 0-.6.1-.7.2-.7.4-.9.5-.9.4-.9.2-.9.2-.8 0-.8.1-.8.2-.8.4-.7.5-.7.4-.6.2-.7.2-.5 0-.6.1-.6.2-.6.4-.7.5-.7.4-.6.2-.7.2-.5 0-.6.1-.6.2-.6.4-.7.5-.7.4-.6.2-.7.2-.5 0-.6.1-.7.2-.8.4-.8.5-1 .5-.8.6-.6.7-.3.7-.2.7-.3.7-.6.7-.8.8-1 1.1-.2 1.4.6 1.8 1.3 2.1 2.2 1.6 1.7 1.1 1.2.6.8.1.4.1.2.4.1.4-.1.6-.3.6.1.7.3.8.6.9.8.8 1.1.9 1.2.8 1.5.8 1.6.7 1.2.6.8.5.4.4-.1.3-.2.2-.3.1-.4 0-.6-.1-.5-.1-.4-.2-.2-.3-.2-.1-.3 0-.5 0-.5.2-.7.4-.3.5.3.7.6.9 1.2.8 1.3.9 1.5.8 1.7.8 1.8.7 1.4.6.9.5.5.4-.1.3-.3.2-.6.1-.8 0-1.1 0-.8.2-.5.2-.3.3 0 .7.8.9 1.6 1.2 2.3 1.6 3.2 1.3 2.3.9 1.5.7.8.4-.1.3-.4.2-.7.1-1 0-1.3 0-1 .2-.6.2-.4.3 0 .3.2.1.2.1.4 0 .5.2.9.6 1.2.7 1.6 1 2 .8 1.8.5 1.4.3 1.2.1.8.1.7.2.4.3.2.4-.1.3-.4.2-.9.1-1.1 0-1.6 0-1.2.1-.9.1-.4.2-.2.4.3.5.6.7 1 .9 1.4.6 1.2.5.9.2.8 0 .6.1.4.2.3.3.2.3.1.3-.5.3-1.1.1-1.5.1-2.2-.1-1.6-.1-1.2-.1-.6-.3-.2-.2-.4-.1-.5 0-.6 0-.8-.1-.7-.1-.5-.2-.3-.3-.2-.2-.4-.1-.6 0-.9 0-1.1-.3-1.3-.5-1.5-.8-1.8-1-2-1-1.7-1-1.5-1-1.2-1-.9-.7-.8-.5-.6-.2-.5 0-.3-.2-.4-.3-.4-.4-.5-.6-.6-.5-.4-.4-.3-.4-.1-.3 0-.5-.3-.8-.6-.9-1-1.2-1.2-1-1-.7-.6-.6-.3-.3 0-.3-.1-.4-.3-.4-.4-.4-.4-.6-.5-.6-.4-.7-.3-.8-.2-.9-.4-.8-.5-1-.6-.9-.8-.8-.5-.8-.4-.6-.2-.6 0-.9-.2-1.2-.5-1.6-.7-1.8-.9-.4-.8 1.2-.5 2.6-.3 4.2-.2 3.2-.1 2.2-.2 1.2-.2.2-.3.6-.1 1 0 1.4.1 1.8.3 1.4.1.9-.1.5-.2.1-.4.1-.3.3-.3.3-.1.4-.2.5.1.6.2.6.3.7.5.9.4 1 .4 1.1.3 1.3.3 1 0 .5-.2.2-.4-.2-.6 0-.5.1-.4.3-.2.4-.2.4 0 .3.1.3.1.2.3.2.2.4.1.5.1.6 0 .8.1 1 .4 1.3.6 1.4.7 1.2.4.8.1.4-.2.1-.6-.1-.5-.1-.4-.1-.4-.3-.3 0-.2.2-.3.5-.1.7-.2.7.1.8.3.9.6.9.7 1 .7 1 .6 1 .6 1 .5.8.4.8.2.7.2.6 0 .4-.1.3-.2.2-.3.1-.4-.2-.4-.3-.6-.6-.6-.7-.7-.5-.5-.1-.5.1-.3.4-.2.6 0 .7.2.9.3 1 .5.9.5.7.5.6.5.4.5.4.4.4.2.3.2.3 0 .4.1.4.2.4.4.4.5.4.4.4.2.3.2.3 0 .6.3.7.6 1 .9 1.2 1.3 1 .9.9.6.8.3.6-.1.4-.4 0-.7-.2-1-.5-1.3-.6-1.2-.8-1.1-.9-1.1-1-.9-.7-.8-.5-.6-.3-.6-.1-.3-.1-.3-.2-.2-.3-.1-.3 0-.6-.4-1-.7-1.4-1.1-1.7-1.6-1.7-1.3-1.9-1.3-1.9-1.1-2-1-1.6-.7-1.3-.6-.9-.2-.6 0-.5-.1-.4-.1-.2-.2-.2-.2-.4-.2-.5-.1-.6-.1-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.4-.2-.5-.1-.6-.1-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-1.6-.2-2.8-.1-4.2-.1-5.6 0-4.2.1-2.9.1-1.5.2-.2.2-.4.2-.6.1-.9.1-1.1 0-.8.1-.6.1-.4.2-.2.2-.6.3-1 .2-1.4.3-1.8.2-1.6.3-1.4.4-1.2.5-.9.4-.8.4-.7.2-.6 0-.4-.1.1-.5.6-.7 1.1-1.2 1.6-1.4 1.3-1.1 1-.7.6-.3.3 0 .4-.2.4-.4.4-.6.4-.7.5-.7.7-.5.8-.4.8-.3.8-.5.5-.7.4-.9.3-1.1.3-.8.4-.6.4-.4.5-.2.4-.3.2-.4.2-.4 0-.6-.2-.5-.2-.4-.4-.3-.5-.3-.3-.3 0-.3.1-.3.4-.4.5-.3.6-.3.7-.3.8-.3.7-.3.6-.6.6-.6.4-.7.7-.8 1.1-.8 1.3-.8 1.6-.8 1.2-.7.8-.6.4-.5-.1-.3-.3-.3-.5-.2-.8-.1-1 0-.8.1-.6.1-.5.2-.2.2-.3.2-.4 0-.4-.1-.4-.2 0-.3.3-.6.7-.7 1.2-.8.9-.7.7-.4.5-.2.3 0 .4-.2.4-.4.4-.6.4-.7.7-.7 1.1-.7 1.3-.6 1.6-.6 1.2-.5.8-.4.4-.5-.1-.3-.3-.3-.4-.2-.6-.1-.8 0-.7.1-.5.1-.3.2-.2.2-.2.2-.2 0-.2-.1-.2-.2 0-.2.1-.3.2-.3.4-.4.6-.4.8-.4 1.1-.5 1.3-.5 1-.6.6-.6.3-.7-.1-.7.1-.6.3-.4.4-.1.6 0 .6-.2.8-.2.8-.4.9-.5 1-.4.8-.2.9-.1.8 0 .7-.1.7-.2.6-.2.6-.3.4-.4.3-.3.1-.4-.1-.3-.6-.3-1-.2zM57 149.1l.5.3.6.2.6.1.8.1.8 0 .6 0 .5.1.4.2.2.3.3.2.5.1.7.1.8 0 .7-.1.5-.1.4-.2.2-.3.5.1.7.4 1 .6 1.2 1 1 .8.7.5.6.2.4-.1.2-.2.1-.3-.1-.3-.3-.6-.1-.4-.1-.3 0-.3.2-.2.3 0 .6.2.8.3 1.1.5.8.2.5-.1.2-.5-.1-.7.3-.5.5-.1.7.2 1.1.5.8.2.5-.1.2-.5-.1-.7.1-.6.3-.4.4-.1.6 0 .5.1.5.2.5.4.4.5.4.4.5.3.4.2.4.2.3.5.1 1-.1 1.4-.2 1.8-.3 1.4-.2 1-.3.6-.2.2-.2.5-.1.9-.1 1.2 0 1.6-.1 1.2-.1.8-.2.6-.2.2-.2.5-.1.9-.1 1.2 0 1.6-.1 1.2-.1.8-.2.6-.2.2-.2.6-.1 1.2-.1 1.5 0 2.1-.1 1.6-.1 1.1-.2.7-.2.2-.2 1.5-.2 2.8-.2 4.1-.1 5.4-.3 3.9-.4 2.3-.5.7-.7-.9-.5-.8-.4-.7-.1-.6 0-.6-.4-1-.6-1.5-.9-2-1.3-2.4-.9-2-.6-1.5-.3-1 0-.6-.2-.7-.4-.9-.6-1-.7-1.2-.6-1.1-.4-.8-.1-.7 0-.6-.4-1-.6-1.3-.9-1.8-1.3-2.2-.9-1.8-.6-1.4-.3-.9 0-.6-.2-.7-.4-.9-.6-1-.7-1.2-.6-1.1-.4-.8-.1-.7 0-.6-.4-1.1-.8-1.6-1.1-2.2-1.5-2.7-1.1-2.1-.7-1.6-.3-1 .2-.4.2-.3.3-.1z"/><path d="M129.5 334.2l.3.6.6.7.9.7 1.2.7 1.5.7 1.7.6 1.9.4 2.1.2 2.3 0 2-.2 1.6-.2 1.3-.4.9-.5 1.3-.4 1.7-.2 1.9-.1 2.3 0 2.4.3 2.5.8 2.6 1.1 2.7 1.5 2.3 1.1 1.9.8 1.4.4 1.1 0 .9 0 .6.1.4.2.2.3.8.1 1.5 0 2.2-.1 2.8-.3 2.9-.5 3-.9 3.1-1.2 3.2-1.5 2.9-1.1 2.6-.8 2.3-.3 2.1 0 2.4.3 2.6.8 2.9 1.1 3.2 1.5 3.1 1.1 3 .8 2.9.4 2.8 0 2.1-.1 1.5-.1.9-.2.2-.3.2-.2.4-.1.5 0 .6 0 .6-.2.8-.2.9-.4 1-.5 1-.6 1.1-.8 1.2-.9 1.2-1 1.1-.8 1-.6 1-.5.8-.3.7-.4.4-.3.2-.4-.1-.3-.4-.3-.9-.2-1.1-.1-1.6 0-1.2.1-.9.1-.5.2-.2.2-.5.3-.7.2-1.1.3-1.3.2-1.1.3-1 .4-.9.5-.7.4-1.1.4-1.5.3-1.9.1-2.3 0-2.5-.4-2.6-.7-2.8-1.1-2.9-1.6-3-1.1-3.1-.7-3.3-.4-3.3 0-3.2.4-3.1.7-3.1 1.1-2.9 1.6-2.8 1.1-2.6.9-2.5.6-2.3.2-1.8.2-1.2 0-.7-.2-.2-.2-.4-.2-.5-.1-.6-.1-.8 0-1.3-.4-1.8-.7-2.2-1.1-2.7-1.6-2.2-1.1-1.7-.7-1.3-.4-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.6-.2-1-.1-1.4-.1-1.8 0-1.4.1-1 .1-.6.2-.2.2-.3.2-.4.1-.4.1-.6 0-.5.1-.4.1-.2.2-.2.2-.3.2-.4.1-.4.1-.6 0-.7.1-.7.3-.9.4-.9.4-1.4.4-1.7.1-2.2 0-2.7-.2-1.9 0-1.1.3zM85.5 307.2l.3.6.3.5.3.3.3.2.3 0 .7.3 1 .8 1.3 1.1 1.7 1.5 1.4 1.1 1.1.8.9.4.6 0 .5-.2.7-.2.6-.4.7-.5 1-.4 1.4-.2 1.7-.1 2.1 0 2 .3 1.8.6 1.8.9 1.7 1.3 1.7 1 1.6.7 1.6.5 1.6.3 1.2.2.8.3.6.2.2.3.6.2 1 .1 1.4.1 1.8 0 1.4-.1 1-.1.6-.2.2-.3.3-.2.5-.1.7 0 .8 0 1.4-.5 2-.9 2.6-1.3 3.2-1.7 3.1-1.3 3-.9 2.9-.4 2.8 0 2.9.4 3 .9 3.1 1.3 3.2 1.7 2.6 1.3 2 .9 1.4.5.8 0 .6 0 .5.1.4.2.2.3.7.2 1.2.1 1.8.1 2.3 0 1.8-.1 1.3-.1.7-.2.2-.3.3-.2.5-.1.7 0 .8 0 1-.2 1.1-.4 1.4-.6 1.4-.7 1.3-.7 1-.6.7-.6.4-.5.5-.4.5-.2.5-.1.6 0 .6-.2.8-.2.8-.4.9-.5 1.2-.4 1.4-.2 1.6-.1 1.8 0 1.4 0 1 .1.6.2.2.3.4.2.8.3 1 .2 1.3.3 1.1.3.9.4.7.4.4.5.7.6 1 .6 1.2.7 1.5.7 1.3.6 1.2.4 1 .2.8 0 .6 0 .5.1.4.2.2.3.7.2 1.2.1 1.8.1 2.3 0 1.8-.1 1.3-.1.7-.2.2-.3.3-.2.5-.1.7 0 .8 0 1.4-.4 2-.8 2.6-1.1 3.2-1.5 2.8-1.1 2.5-.8 2.2-.3 1.8 0 1.7.1 1.7.4 1.6.6 1.4.7 1.3.7 1 .6.7.6.4.5.6.4.7.4.9.3 1.1.3 1.2 0 1.3-.3 1.4-.5 1.4-.7 1.7-1 1.8-1.3 1.9-1.6 2.1-1.8 1.5-1.4 1-1.1.6-.7 0-.3-.1-.2-.2-.2-.3-.1-.4-.1-.3 0-.3.1-.2.2-.2.2-.6.3-.8.2-1.2.3-1.6.2-1.2.3-.9.2-.5.3-.2.2-.6.2-.8.1-1.2.1-1.6 0-1.4-.1-1.1-.3-.9-.4-.7-.4-.6-.4-.7-.3-.5-.1-.6 0-.7-.1-.7-.3-.9-.4-.9-.4-1.2-.4-1.5-.3-1.8-.1-2.1 0-1.5.1-1.2.1-.6.2-.2.2-.4.2-.5.1-.6.1-.8 0-1.2.3-1.5.6-1.8 1-2.2 1.2-2 1-1.9.8-1.7.5-1.6.2-1.2.3-.9.2-.5.3-.2.2-.4.2-.6.1-.9.1-1.1 0-.8-.1-.6-.1-.4-.2-.2-.2-.6-.3-.8-.2-1.2-.3-1.6-.2-1.4-.4-1.3-.5-1.1-.6-.9-.8-1.1-.7-1.4-.6-1.6-.6-1.8-.4-1.4-.5-1-.4-.6-.3-.2-.2-.9-.2-1.5-.1-2.1-.1-2.8 0-3.1.4-3.2.9-3.5 1.3-3.7 1.8-3.5 1.3-3.4.9-3.2.4-3.1 0-2.9-.4-2.9-.7-2.8-1.1-2.7-1.6-2.6-1.2-2.7-1-2.5-.8-2.6-.4-2-.4-1.3-.1-.8.1-.2.2-.5.2-.7.1-1.1.1-1.3 0-1 .1-.8.1-.4.2-.2.2-.3.2-.4.1-.4.1-.6 0-1.1.4-1.6.7-2.2 1.1-2.7 1.6-2.7 1.1-2.7.7-2.8.4-2.8 0-2.9-.4-2.8-.9-3-1.3-2.9-1.8-2.8-1.3-2.8-.9-2.6-.4-2.6 0-2 .1-1.3.1-.8.2-.2.2-.5.2-.7.1-1.1.1-1.3 0-1-.1-.8-.1-.4-.2-.2-.2-.5-.2-.8-.1-1.1 0-1.3.1-1 .2-.5.3zM64 288.5l1.3 1.3 1.2 1.1 1.2.9 1.1.7 1 .5 1.2.4 1.4.2 1.6.2 1.8 0 1.8-.3 1.9-.5 1.9-.8 1.9-1 1.6-.7 1.3-.5.9-.2.6 0 .5-.2.7-.2.6-.4.7-.5 1-.4 1.4-.2 1.7-.1 2.1 0 2.4.4 2.8.9 3.1 1.3 3.4 1.7 3.4 1.4 3.4 1 3.3.6 3.3.3 2.6.1 1.7 0 1-.1.2-.3.5-.2.9-.3 1.2-.2 1.6-.3 1.9-.5 2.2-.9 2.6-1.2 2.9-1.5 2.9-1.1 2.7-.8 2.7-.3 2.6 0 2.7.4 3 .9 3.3 1.3 3.4 1.7 3.2 1.4 3 1 2.8.6 2.6.3 1.9.1 1.4 0 .8-.1.2-.3.4-.2.8-.1 1 0 1.3 0 1.1-.1.7-.1.5-.2.2-.3.2-.2.4-.1.5 0 .6 0 1.1-.4 1.6-.8 2.1-1.1 2.7-1.5 2.7-1.1 2.6-.8 2.6-.3 2.6 0 2.7.4 3 .9 3.3 1.3 3.4 1.7 3.2 1.4 3 1 2.8.6 2.6.3 1.9.1 1.4 0 .8-.1.2-.3.4-.2.8-.1 1 0 1.3 0 1.1-.1.7-.1.5-.2.2-.3.2-.2.4-.1.5 0 .6 0 1.1-.4 1.8-.8 2.3-1.1 2.9-1.5 2.9-1.1 2.7-.8 2.7-.3 2.6 0 2.8.4 3.1.9 3.4 1.3 3.7 1.7 3.6 1.3 3.5.9 3.4.5 3.3 0 2.6-.1 1.7-.1 1-.2.2-.3.6-.3 1-.4 1.4-.4 1.8-.5 1.9-.8 1.9-1.2 2-1.5 2.1-1.8 1.5-1.4 1-1.1.6-.7 0-.3-.5-.2-1-.2-1.4-.1-1.8-.1-2.2.3-2.4.7-2.7 1.1-2.9 1.6-2.7 1.1-2.3.7-2.1.4-1.8 0-1.4-.1-1-.1-.6-.2-.2-.2-.6-.3-1-.4-1.4-.5-1.8-.4-1.5-.6-1.1-.4-.8-.6-.4-.4-.5-.4-.5-.3-.5-.1-.6 0-.6-.1-.6-.3-.7-.4-.7-.4-.7-.4-.9-.3-1-.1-1.1 0-.8-.1-.6-.1-.4-.2-.2-.2-.6-.2-.8-.1-1.2-.1-1.6 0-1.2.1-.9.1-.5.2-.2.2-.4.2-.5.1-.6.1-.8 0-1.6.4-2.2.9-3 1.3-3.7 1.8-3.4 1.3-3.3.9-3 .4-2.8 0-3-.4-3.1-.9-3.3-1.3-3.4-1.8-2.9-1.3-2.2-.9-1.7-.4-1.1 0-.8-.1-.6-.1-.4-.2-.2-.2-.8-.2-1.4 0-1.9.2-2.6.2-2.8.6-3 1-3.2 1.4-3.4 1.8-3.3 1.3-3.2.9-2.9.4-2.8 0-2.2-.1-1.5-.1-.8-.2-.2-.2-.3-.2-.4-.1-.4-.1-.6 0-.8-.2-1-.4-1.3-.5-1.5-.8-1.2-.7-1-.6-.7-.6-.4-.4-.8-.5-1-.4-1.2-.3-1.6-.2-1.2-.3-.9-.2-.5-.3-.2-.2-.9-.2-1.5 0-2.1.2-2.8.2-3.1.6-3.2 1-3.5 1.4-3.7 1.8-3.4 1.3-3.3.9-3 .4-2.8 0-2.2-.1-1.5-.1-.8-.2-.2-.2-.5-.3-.7-.2-1.1-.3-1.3-.2-1.1-.3-.9-.4-.6-.5-.4-.4-.6-.6-.7-.4-.9-.6-1-.4-1.1-.5-1.3-.4-1.4-.3-1.6-.2-1.2-.3-.9-.2-.5-.3-.2-.2-.6-.2-.8-.1-1.2-.1-1.6 0-1.2.1-.9.1-.5.2-.2.2-.4.2-.5.1-.6.1-.8 0-1.3.3-1.6.6-2 1-2.4 1.2-2.3 1-2.1.6-2 .3-1.8 0-1.4-.1-1-.1-.6-.2-.2-.2-.4-.2-.5-.1-.6-.1-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.4-.2-.6-.1-.9-.1-1.1 0-.8.1-.5.2-.3.3-.1.3.3.6.6.9zM38 258.7l0 .3.2.4.4.5.5.6.8.7.5.6.4.5.2.4 0 .3.3.5.5.7.8.9 1.1 1.1 1 .8.9.5.9.3.8 0 .6 0 .5.1.4.2.2.3.3.2.5.1.7.1.8 0 .6 0 .5.1.4.2.2.3.2.2.4.1.5.1.6 0 .6.1.8.2.8.4.9.5 1.1.4 1.1.2 1.2.2 1.3 0 1.1 0 .7.1.5.2.2.3.2.1.4 0 .4-.1.5-.3.8-.2 1-.1 1.3 0 1.6 0 1.2-.1.8-.1.6-.2.2-.3.2-.2.4-.1.5 0 .6 0 1.1-.4 1.6-.8 2.1-1.1 2.7-1.5 2.2-1.1 1.8-.8 1.3-.3.8 0 .6-.1.5-.1.4-.2.2-.3.7-.1 1.2 0 1.8.1 2.3.3 2.4.5 2.5.9 2.6 1.2 2.7 1.5 2.5 1.2 2.2.9 2.1.5 1.8.3 1.4.2 1 .3.6.2.2.3.8.1 1.5 0 2.2-.1 2.8-.3 2.9-.6 3.2-1 3.3-1.4 3.4-1.7 3.3-1.3 3.3-.9 3.1-.4 3.1 0 3.2.4 3.2.9 3.4 1.3 3.4 1.7 3.5 1.3 3.5.9 3.5.5 3.6 0 3.5-.5 3.5-.9 3.5-1.3 3.4-1.7 2.8-1.3 2.1-.9 1.5-.4.8 0 .6-.1.5-.1.4-.2.2-.3.7-.1 1.2 0 1.8.1 2.3.3 2.4.5 2.5.9 2.6 1.2 2.7 1.5 2.5 1.2 2.2.9 2.1.5 1.8.3 1.4.2 1 .3.6.2.2.3.7.1 1.2 0 1.8-.1 2.3-.3 1.8-.2 1.3-.3.7-.2.2-.3.6-.3 1-.4 1.4-.4 1.8-.5 1.6-.6 1.4-.6 1.1-.7.9-.7 1.1-.7 1.3-.4 1.4-.4 1.6-.3 1.2-.2.8-.3.6-.2.2-.3.7-.1 1.2 0 1.8.1 2.3.3 2.6.6 2.9 1 3.2 1.4 3.4 1.7 3.5 1.3 3.5.9 3.5.5 3.6 0 2.7-.1 1.9-.1 1-.2.2-.3.2-.2.4-.1.5 0 .6 0 .7-.2.8-.4 1.1-.6 1.2-.7 1-.6.9-.4.7-.1.6 0 .6-.2.8-.2.8-.4.9-.5 1.1-.4 1.1-.2 1.2-.1 1.3 0 1.1 0 .7.1.5.2.2.3.5.2.9.3 1.2.2 1.6.3 1.6-.4 1.7-.9 1.7-1.4 1.8-2.1 1.4-1.6.8-1.3.5-.8-.1-.3-1.1-.3-2-.2-3.1-.1-4.1 0-3.1.1-2.1.1-1.1.2-.2.2-.6.3-.8.2-1.2.3-1.6.2-1.9.6-2.3.9-2.6 1.1-2.9 1.6-2.8 1.1-2.6.7-2.5.4-2.3 0-1.8-.1-1.2-.1-.7-.2-.2-.2-.4-.2-.5-.1-.6-.1-.8 0-1.4-.4-1.9-.7-2.4-1.1-2.9-1.6-2.4-1.1-1.9-.7-1.3-.4-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.7-.2-1.1-.1-1.6-.1-2.1 0-1.5.1-1.2.1-.6.2-.2.2-.4.2-.5.1-.6.1-.8 0-1.5.4-2.1.9-2.8 1.3-3.4 1.8-3.3 1.3-3.2.9-2.9.4-2.8 0-3-.4-3.1-.9-3.3-1.3-3.4-1.8-2.8-1.3-2.1-.9-1.5-.4-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.7-.2-1.1-.1-1.6-.1-2.1 0-1.5.1-1.2.1-.6.2-.2.2-.4.2-.5.1-.6.1-.8 0-.8.1-.8.3-.7.4-.7.4-.6.4-.7.3-.5.1-.6 0-.5.1-.5.3-.5.4-.4.4-.8.6-1.2.4-1.4.6-1.8.4-1.4.5-1 .4-.6.3-.2.2-.8.2-1.4.1-1.9.1-2.6 0-2.8-.4-3-.9-3.2-1.3-3.4-1.8-2.8-1.3-2.1-.9-1.5-.4-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.7-.2-1.1-.1-1.6-.1-2.1 0-1.5.1-1.2.1-.6.2-.2.2-.4.2-.5.1-.6.1-.8 0-1.3.4-1.8.7-2.2 1.1-2.7 1.6-2.2 1.1-1.7.7-1.3.4-.8 0-.7.1-.5.1-.3.2-.2.2-.9.2-1.5.1-2.1.1-2.8 0-3-.4-3.1-.9-3.3-1.3-3.4-1.8-2.8-1.3-2.1-.9-1.5-.4-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.7-.2-1.1-.1-1.6-.1-2.1 0-1.5.1-1.2.1-.6.2-.2.2-.6.3-.8.2-1.2.3-1.6.2-1.9.6-2.3.9-2.6 1.1-2.9 1.6-2.8 1.1-2.8.7-2.6.4-2.6 0-2.8-.4-3-.9-3.2-1.3-3.4-1.8-2.8-1.3-2.1-.9-1.5-.4-.8 0-.7-.1-.5-.1-.3-.2-.2-.2-.5-.2-.8-.1-1.1 0-1.3.1-1.1.1-.7.2zM39.1 242.4l.1.3 3.6.2 7.2.2 10.7 0 14.3 0 10.8 0 7.3-.1 3.7-.2.2-.2 9.9-.1 19.6-.1 29.3 0 39.1 0 29.3 0 19.7.1 9.9.1.2.2.9.2 1.8.1 2.5 0 3.3 0 2.6 0 1.7-.1 1-.2.2-.2 1.8-.1 3.5-.1 5.2 0 6.8 0 5.1 0 3.5.1 1.9.1.2.2 2 .1 3.7.1 5.6.1 7.4-.1 5.5-.1 3.7-.2 1.8-.2-.1-.2-.4-.3-.9-.2-1.1-.2-1.6-.2-1.2-.2-.9-.2-.5-.2-.2-.1-.3-.2-.4 0-.4-.1-.6 0-.7-.1-.7-.2-.9-.3-.9-.3-.9-.3-.9-.2-.8 0-.8 0-.7-.1-.5-.1-.3-.1-.2-.2-.4-.1-.5-.1-.6-.1-.8 0-.7 0-.5-.1-.3-.1-.2-.2-.4-.1-.5-.1-.6-.1-.8 0-.7-.1-.5 0-.3-.2-.2-.1-.4-.2-.5 0-.6-.1-.8 0-.7-.1-.5 0-.3-.2-.2-.1-.4-.2-.5 0-.6-.1-.8 0-.7-.1-.5-.1-.3-.1-.2-.2-.4-.1-.6-.1-.9 0-1.1 0-.8-.1-.6-.1-.4-.1-.2-.2-.4-.1-.5-.1-.6-.1-.8 0-.7 0-.5-.1-.3-.1-.2-.2-.4-.1-.5-.1-.6-.1-.8 0-.7-.1-.5 0-.3-.2-.2-.1-.4-.2-.5 0-.6-.1-.8 0-.7-.1-.5 0-.3-.2-.2-.1-.4-.2-.6 0-.9-.1-1.1 0-.8-.1-.6-.1-.4-.1-.2-.2-.4-.1-.5-.1-.6 0-.8 0-.7-.1-.5-.1-.3-.1-.2-.2-.4-.1-.6-.1-.9-.1-1.1 0-.8 0-.6-.1-.4-.1-.2-.2-.4-.1-.5-.1-.6-.1-.8 0-.7-.1-.5 0-.3-.2-.2-.1-.4-.2-.6 0-.9-.1-1.1 0-.8-.1-.6 0-.4-.2-.2-.1-.4-.2-.6 0-.9-.1-1.1 0-.8-.1-.6-.1-.4-.1-.2-.2-.6-.1-.8-.1-1.2 0-1.6 0-1.2-.1-.9-.1-.5-.1-.2-.2-.6-.1-.8-.1-1.2-.1-1.6 0-1.2 0-.9-.2-.5-.3-.2-.3-6.7-.3-13.1-.2-19.6-.1-26.1 0-19.5.1-13.2 0-6.6.2-.2.1-.7.2-1.3 0-1.8.1-2.3 0-1.8.1-1.2.1-.7.1-.2.2-.9.2-1.7.1-2.3.2-3.1.2-2.3.2-1.6.1-.9.2-.2.2-.4.1-.6.1-.8.1-1 0-.8.1-.6 0-.5.2-.2.1-.3.1-.4-.2-.4-.2-.4-.6-.3-.4-.3-.4-.1-.4-.1-.6-1.4-.2-2.7-.3-4-.1-5.3 0-4 .2-2.7.5-1.3.8-.1.9 0 .8.1.6.2.4.2.1.2.2.1.3.1.3 0 .4-.1.4-.2.3-.3.4-.3.2-.5.2-.4.1-.5.1-.6 0-.7.1-.7.2-.9.3-.9.3-.9.3-.9.2-.8 0-.8 0-.7.1-.5.1-.3.1-.2.2-.3.1-.4.1-.4.1-.6 0-.5 0-.4.1-.2.1-.2.2-.3.1-.4.1-.4.1-.6 0-.5.1-.4 0-.2.2-.2.1-.9.3-1.5.4-2.1.4-2.8.6-2.3.5-1.8.4-1.2.4-.7.3-.6.3-.7.2-.5.1-.6 0-.6.1-.6.2-.7.3-.7.3-.6.3-.7.2-.6.1-.7.1-.4.1-.3.1z"/></g></svg><rect x="0" y="232" width="1040" height="6" rx="3"/></svg>';
    function put() {
      var sp = document.querySelector("#v-profile .sigpick");
      if (!sp || (sp.nextElementSibling && sp.nextElementSibling.classList.contains("khart"))) return;
      var d = document.createElement("div");
      d.className = "khart";
      d.setAttribute("aria-hidden", "true");
      d.innerHTML = A;
      sp.after(d);
    }
    put();
    setInterval(put, 2000);
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Landscape art at the bottom of More, and its placement.", err);
}

/* ==========================================================================
   Home card: hides a stay row when the same stay is already listed above it.
   ========================================================================== */
try {
  (function () {
    var q = 0;
    function run() {
      q = 0;
      document.querySelectorAll("#v-home .summary").forEach(function (c) {
        var li = [].slice.call(c.querySelectorAll(".dsrows li")).filter(function (l) {
          return l.getClientRects().length;
        });
        c.querySelectorAll(".dpstay").forEach(function (d) {
          var t = d.textContent.trim();
          var dup =
            !!t &&
            li.some(function (l) {
              return l.textContent.indexOf(t) >= 0;
            });
          d.classList.toggle("kdup", dup);
        });
      });
    }
    function go() {
      q || (q = requestAnimationFrame(run));
    }
    var h = document.getElementById("v-home");
    if (h) new MutationObserver(go).observe(h, { childList: !0, subtree: !0 });
    new MutationObserver(go).observe(document.documentElement, {
      attributes: !0,
      attributeFilter: ["class"],
    });
    go();
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Home card: hides a stay row when the same stay is already li", err);
}

/* ==========================================================================
   Keeps the More page art sitting exactly on top of the nav bar.
   ========================================================================== */
try {
  (function () {
    function fit() {
      var a = document.querySelector("#v-profile .khart"),
        n = document.querySelector("nav.nav");
      if (!a || !n || !a.getClientRects().length) return;
      var cur = parseFloat(a.style.marginBottom) || 0,
        r = a.getBoundingClientRect(),
        D = document.documentElement.scrollHeight - (r.bottom + scrollY) - cur,
        W = innerHeight - n.getBoundingClientRect().top,
        m = Math.round(W - D);
      if (Math.abs(m - cur) > 0.5) a.style.marginBottom = m + "px";
    }
    var t = 0;
    function go() {
      clearTimeout(t);
      t = setTimeout(fit, 120);
    }
    addEventListener("resize", go);
    document.addEventListener("click", function (e) {
      e.target.closest && e.target.closest(".nav") && setTimeout(fit, 400);
    });
    setInterval(fit, 2500);
    go();
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Keeps the More page art sitting exactly on top of the nav ba", err);
}

/* ==========================================================================
   Group sheet editor: add members first, member circles on top, tap a circle to edit.
   ========================================================================== */
try {
  (function () {
    var AG = [
        ["kid", "Kid", "under 13"],
        ["teen", "Teen", "13–17"],
        ["adult", "Adult", "18–59"],
        ["senior", "Senior", "60+"],
      ],
      GN = [
        ["woman", "Woman"],
        ["man", "Man"],
        ["nb", "Other"],
      ];
    function seg(f, list) {
      return (
        '<div class="segc gxseg" data-f="' +
        f +
        '">' +
        list
          .map(function (o) {
            return (
              '<button type="button" data-val="' +
              o[0] +
              '" aria-pressed="false"><b>' +
              o[1] +
              "</b>" +
              (o[2] ? "<small>" + o[2] + "</small>" : "") +
              "</button>"
            );
          })
          .join("") +
        "</div>"
      );
    }
    function init() {
      var g = document.getElementById("grp-sheet");
      if (!g || g.__gx) return;
      var gadd = g.querySelector(".gadd"),
        gm = g.querySelector("#grp-members"),
        who = g.querySelector("#grp-who"),
        add = g.querySelector("#grp-addm");
      if (!gadd || !gm || !who || !add) return;
      g.__gx = 1;
      g.classList.add("gxon");
      var ed = document.createElement("div");
      ed.className = "gxed";
      ed.innerHTML =
        '<div class="gxhead" hidden><span class="gxav"></span><div><b class="gxname"></b><small class="gxsub"></small></div></div><div class="gmrow2"><span>Age</span>' +
        seg("age", AG) +
        '</div><div class="gmrow2"><span>Gender</span>' +
        seg("gender", GN) +
        '</div><div class="gxfoot" hidden><button type="button" class="gmrm gxrm">Remove</button><button type="button" class="gmdone gxdone">Done</button></div>';
      gadd.after(ed);
      var mode = -1,
        pend = { age: "", gender: "" },
        count = gm.querySelectorAll(".gmc").length;
      function setSeg(f, v) {
        ed.querySelectorAll('.gxseg[data-f="' + f + '"] button').forEach(function (b) {
          b.setAttribute("aria-pressed", b.dataset.val === v ? "true" : "false");
        });
      }
      function cards() {
        return gm.querySelectorAll(".gmc");
      }
      function openK(k, want) {
        var c = cards()[k];
        if (!c) return;
        var open = c.classList.contains("open");
        if (open !== want) {
          var h = c.querySelector(".gmh");
          h && h.click();
        }
      }
      function memberVals(k) {
        var c = cards()[k],
          o = { age: "", gender: "" };
        if (!c) return o;
        ["age", "gender"].forEach(function (f) {
          var b = c.querySelector('.segc[data-mf="' + f + '"] button[aria-pressed="true"]');
          o[f] = b ? b.dataset.val : "";
        });
        return o;
      }
      function newMode() {
        if (mode >= 0) openK(mode, !1);
        mode = -1;
        pend = { age: "", gender: "" };
        setSeg("age", "");
        setSeg("gender", "");
        g.classList.remove("gxedit");
        ed.querySelector(".gxhead").hidden = !0;
        ed.querySelector(".gxfoot").hidden = !0;
        sel();
      }
      function editMode(k) {
        var c = cards()[k];
        if (!c) return;
        if (mode >= 0 && mode !== k) openK(mode, !1);
        mode = k;
        openK(k, !0);
        setTimeout(function () {
          var c2 = cards()[k];
          if (!c2) return;
          var v = memberVals(k);
          setSeg("age", v.age);
          setSeg("gender", v.gender);
          var nm = (c2.querySelector(".gmt b") || {}).textContent || "",
            av = c2.querySelector(".gmav");
          var h = ed.querySelector(".gxhead");
          h.hidden = !1;
          h.querySelector(".gxname").textContent = nm;
          h.querySelector(".gxsub").textContent = (
            (c2.querySelector(".gmt small") || {}).textContent || ""
          ).split(" · ")[0];
          var a = h.querySelector(".gxav");
          a.textContent = av ? av.textContent : "";
          a.style.background = av ? av.style.background : "";
          ed.querySelector(".gxfoot").hidden = !1;
          g.classList.add("gxedit");
          sel();
        }, 30);
      }
      function sel() {
        var pv = g.querySelector(".gprev");
        pv && pv.setAttribute("data-sel", String(mode));
      }
      ed.addEventListener("click", function (e) {
        var b = e.target.closest(".gxseg button");
        if (b) {
          var f = b.closest(".gxseg").dataset.f,
            on = b.getAttribute("aria-pressed") === "true",
            v = on ? "" : b.dataset.val;
          setSeg(f, v);
          if (mode < 0) {
            pend[f] = v;
          } else {
            var c = cards()[mode];
            if (c) {
              var mb = c.querySelector('.segc[data-mf="' + f + '"] button[data-val="' + b.dataset.val + '"]');
              mb && mb.click();
            }
          }
          return;
        }
        if (e.target.closest(".gxrm")) {
          var k = mode;
          mode = -1;
          var c = cards()[k],
            x = c && c.querySelector("[data-mx]");
          if (!x && c) {
            openK(k, !0);
            c = cards()[k];
            x = c && c.querySelector("[data-mx]");
          }
          x && x.click();
          setTimeout(newMode, 30);
          return;
        }
        if (e.target.closest(".gxdone")) {
          newMode();
        }
      });
      new MutationObserver(function () {
        var n = cards().length;
        if (n > count && mode < 0 && (pend.age || pend.gender)) {
          var k = n - 1,
            p = pend;
          pend = { age: "", gender: "" };
          count = n;
          setSeg("age", "");
          setSeg("gender", "");
          openK(k, !0);
          setTimeout(function () {
            var c = cards()[k];
            if (c) {
              ["age", "gender"].forEach(function (f) {
                if (p[f]) {
                  var mb = c.querySelector('.segc[data-mf="' + f + '"] button[data-val="' + p[f] + '"]');
                  mb && mb.getAttribute("aria-pressed") !== "true" && mb.click();
                }
              });
              setTimeout(function () {
                openK(k, !1);
              }, 20);
            }
          }, 20);
          return;
        }
        count = n;
        if (mode >= n) newMode();
      }).observe(gm, { childList: !0 });
      g.addEventListener("click", function (e) {
        var i = e.target.closest(".gprev .gstack i");
        if (!i) return;
        e.stopPropagation();
        if (i.classList.contains("add")) {
          newMode();
          who.focus();
          return;
        }
        var k = [].indexOf.call(i.parentNode.children, i);
        if (k < 4) editMode(k);
      });
      new MutationObserver(function (m) {
        if (g.hidden) {
          mode = -1;
          newMode();
        }
      }).observe(g, { attributes: !0, attributeFilter: ["hidden"] });
      var pv = g.querySelector(".gprev");
      if (pv) {
        pv.removeAttribute("aria-hidden");
        new MutationObserver(function () {
          pv.querySelectorAll(".gstack i").forEach(function (i, k) {
            i.setAttribute("role", "button");
            i.setAttribute("tabindex", "0");
            i.setAttribute(
              "aria-label",
              i.classList.contains("add") ? "Add a member" : "Edit member " + (k + 1),
            );
          });
        }).observe(pv, { childList: !0, subtree: !0 });
      }
    }
    setTimeout(init, 900);
    setInterval(init, 2000);
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Group sheet editor: add members first, member circles on top", err);
}

/* ==========================================================================
   Group sheet button: 'Add to group' while typing, otherwise 'Save group' or 'Update group'.
   ========================================================================== */
try {
  (function () {
    function init() {
      var g = document.getElementById("grp-sheet");
      if (!g || g.__gb) return;
      var b = g.querySelector("#grp-save"),
        w = g.querySelector("#grp-who"),
        a = g.querySelector("#grp-addm"),
        t = g.querySelector("#grp-title");
      if (!b || !w || !a) return;
      g.__gb = 1;
      function st() {
        var add = !!w.value.trim() && !g.classList.contains("gxedit");
        b.classList.toggle("gxadd", add);
        b.textContent = add
          ? "Add to group"
          : t && /edit/i.test(t.textContent)
            ? "Update group"
            : "Save group";
      }
      b.addEventListener(
        "click",
        function (e) {
          if (b.classList.contains("gxadd")) {
            e.preventDefault();
            e.stopImmediatePropagation();
            a.click();
            w.blur();
            setTimeout(st, 30);
          }
        },
        !0,
      );
      w.addEventListener("input", st);
      w.addEventListener("keydown", function () {
        setTimeout(st, 30);
      });
      g.addEventListener("click", function () {
        setTimeout(st, 60);
      });
      new MutationObserver(function () {
        setTimeout(st, 30);
      }).observe(g, { attributes: !0, attributeFilter: ["hidden", "class"] });
      t && new MutationObserver(st).observe(t, { childList: !0, characterData: !0, subtree: !0 });
      st();
    }
    setTimeout(init, 900);
    setInterval(init, 2000);
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Group sheet button: 'Add to group' while typing, otherwise '", err);
}

/* ==========================================================================
   Asks for confirmation before editing a trip.
   ========================================================================== */
try {
  (function () {
    var ok = 0;
    document.addEventListener(
      "click",
      function (e) {
        var b = e.target.closest && e.target.closest("#vz-edit,#home-edit,[data-ctedit]");
        if (!b || ok || !window.__confirm) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        var vz = !document.documentElement.classList.contains("ct-on");
        window.__confirm(
          vz ? "Edit this trip?" : "Edit trip details?",
          vz
            ? "You’ll edit dates, travellers and places. Saving replaces the full Vizag trip, and its days and stops are rebuilt from your changes."
            : "You’ll edit dates, travellers and places. Saving updates the full trip, and its days and stops are rebuilt from your changes.",
          "Continue",
          function () {
            ok = 1;
            try {
              b.click();
            } finally {
              ok = 0;
            }
          },
          "trip",
        );
      },
      !0,
    );
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Asks for confirmation before editing a trip.", err);
}

/* ==========================================================================
   Demo mode: keeps your own trips aside and shows the sample trip; Leave demo brings them back. Also the Demo mode tag roll on Home.
   ========================================================================== */
try {
  (function () {
    var D = document,
      LS;
    try {
      LS = window.localStorage;
    } catch (e) {
      return;
    }
    var KEYS = [
      "vizag-trips",
      "vizag-trips-made",
      "vizag-active-trip",
      "vizag-profile",
      "vizag-hide-vz",
      "vizag-places",
      "vizag-places-v2",
      "vizag-favs",
      "vizag-groups",
      "vizag-checks",
      "vizag-ct-ticks",
      "vizag-ct-later",
      "vizag-later",
      "vizag-chat",
      "vizag-notifs",
      "vizag-notifs-seen",
      "vizag-trip-planner",
      "vizag-day",
      "vizag-anydates",
      "vizag-gphoto",
      "vizag-wimg",
      "vizag-last-sync",
    ];
    function g(k) {
      try {
        return LS.getItem(k);
      } catch (e) {
        return null;
      }
    }
    function si() {
      return !!(window.__signedIn && window.__signedIn());
    }
    window.__isDemo = function () {
      return g("vizag-demo") === "1";
    };
    function enter() {
      if (window.__isDemo()) return !0;
      var st = {};
      KEYS.forEach(function (k) {
        var v = g(k);
        v !== null && (st[k] = v);
      });
      try {
        LS.setItem("vizag-real-stash", JSON.stringify(st));
      } catch (e) {
        return !1;
      }
      KEYS.forEach(function (k) {
        try {
          LS.removeItem(k);
        } catch (e) {}
      });
      try {
        LS.setItem("vizag-active-trip", "vizag");
        LS.setItem("vizag-demo", "1");
      } catch (e) {}
      return !0;
    }
    function leave() {
      if (!window.__isDemo()) return;
      var st = null;
      try {
        st = JSON.parse(g("vizag-real-stash") || "null");
      } catch (e) {}
      if (!st || typeof st !== "object") st = {};
      KEYS.forEach(function (k) {
        try {
          LS.removeItem(k);
        } catch (e) {}
      });
      Object.keys(st).forEach(function (k) {
        if (KEYS.indexOf(k) >= 0)
          try {
            LS.setItem(k, String(st[k]));
          } catch (e) {}
      });
      try {
        LS.removeItem("vizag-real-stash");
        LS.removeItem("vizag-demo");
      } catch (e) {}
    }
    window.__leaveDemo = function () {
      leave();
      location.reload();
    };
    /* Try demo mode: keep the person's own data aside, load the sample trip */
    D.addEventListener(
      "click",
      function (e) {
        var b = e.target.closest && e.target.closest("#login-cancel");
        if (!b || si() || window.__isDemo()) return;
        var f = D.getElementById("login-form");
        if (f && f.dataset.preview) return;
        if (enter())
          setTimeout(function () {
            location.reload();
          }, 60);
      },
      !0,
    );
    /* Home tag in demo mode: explain and offer a way out */
    D.addEventListener(
      "click",
      function (e) {
        var t = e.target.closest && e.target.closest("#v-home .offtag");
        if (!t || !window.__isDemo() || si() || navigator.onLine === !1 || !window.__confirm) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        window.__confirm(
          "You’re in demo mode",
          "You’re looking at a sample trip on this phone, and nothing syncs online. Leave demo to get your own trips back, or sign in from More to sync them.",
          "Leave demo",
          window.__leaveDemo,
          "demo",
        );
      },
      !0,
    );
    /* Signing in ends demo mode, so the person's own data is what syncs */
    setInterval(function () {
      si() && window.__isDemo() && window.__leaveDemo();
    }, 1500);
    /* Rolling reveal on the Demo mode tag when Home opens */
    var R =
        '<svg class="netroll" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z"/></svg>',
      done = 0;
    function roll() {
      var s = D.querySelector("#v-home .offtag");
      if (
        !s ||
        !window.__isDemo() ||
        si() ||
        navigator.onLine === !1 ||
        !s.offsetParent ||
        D.hidden ||
        D.getElementById("kssplash") ||
        s.classList.contains("rfx") ||
        s.classList.contains("reveal") ||
        s.classList.contains("fade") ||
        matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return setTimeout(roll, done ? 5000 : 500);
      }
      done = 1;
      setTimeout(roll, 5000);
      var o = s.querySelector(".netroll");
      o && o.remove();
      s.classList.add("reveal");
      s.insertAdjacentHTML("afterbegin", R);
      var w = s.querySelector(":scope > i");
      w && s.style.setProperty("--dx", w.offsetLeft + w.offsetWidth / 2 - 7 + "px");
      setTimeout(function () {
        s.classList.remove("reveal");
        var v = s.querySelector(".netroll");
        v && v.remove();
      }, 2900);
    }
    setTimeout(roll, 900);
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Demo mode: keeps your own trips aside and shows the sample t", err);
}

/* ==========================================================================
   Plans: halftone icons for Free, Trip pass, Atlas, Yearly and the Customisation add-on.
   ========================================================================== */
try {
  (function () {
    var D = document,
      n = 0;
    var SH = {
      free: '<path d="M22 41s-11-9.6-11-18a11 11 0 0 1 22 0c0 8.4-11 18-11 18z"/>',
      pass: '<path d="M5 14a3 3 0 0 1 3-3h28a3 3 0 0 1 3 3v4.6a4.4 4.4 0 0 0 0 8.8V32a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-4.6a4.4 4.4 0 0 0 0-8.8z"/>',
      atlas:
        '<path d="M22 4c1.6 11.2 6.8 16.4 18 18-11.2 1.6-16.4 6.8-18 18-1.6-11.2-6.8-16.4-18-18 11.2-1.6 16.4-6.8 18-18z"/>',
      yearly: '<circle cx="22" cy="22" r="15"/>',
      custom:
        '<path d="M22 6a16 16 0 1 0 0 32c2.2 0 3.2-1.6 2.6-3.4-.7-2 .4-3.8 2.6-3.8H32a6 6 0 0 0 6-6C38 13.6 30.8 6 22 6z"/>',
    };
    var IN = {
      free: '<circle cx="22" cy="22.5" r="4.2" fill="B" stroke="var(--accent)" stroke-width="1.3"/>',
      pass: '<path d="M29 13v20" fill="none" stroke="var(--ink)" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="1.4 3.2"/><rect x="11" y="17" width="12" height="12" rx="2.5" fill="B"/>',
      atlas: '<path d="M22 14c.8 5 3 7.2 8 8-5 .8-7.2 3-8 8-.8-5-3-7.2-8-8 5-.8 7.2-3 8-8z" fill="B"/>',
      yearly:
        '<ellipse cx="22" cy="22" rx="21" ry="7.5" transform="rotate(-22 22 22)" fill="none" stroke="var(--ink)" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="2.2 3.4"/><path d="M8 22h28M22 7.5c3.6 4 5.4 8.8 5.4 14.5S25.6 32.5 22 36.5c-3.6-4-5.4-8.8-5.4-14.5S18.4 11.5 22 7.5" fill="none" stroke="var(--ink)" stroke-width="1.5"/><circle cx="40.5" cy="14.5" r="3.4" fill="B"/>',
      custom:
        '<circle cx="14.5" cy="21" r="2.8" fill="var(--ink)"/><circle cx="20" cy="13.5" r="3" fill="B"/><circle cx="28.5" cy="14.5" r="2.8" fill="var(--ink)" fill-opacity=".45"/>',
    };
    function art(k) {
      if (!SH[k]) return "";
      var u = "kp" + ++n,
        A = "url(#" + u + "a)",
        B = "url(#" + u + "b)";
      return (
        '<svg class="kpic" viewBox="0 0 48 48" aria-hidden="true"><defs><pattern id="' +
        u +
        'a" width="2.6" height="2.6" patternUnits="userSpaceOnUse"><circle cx="1.3" cy="1.3" r=".85" style="fill:var(--ink);fill-opacity:.5"/></pattern><pattern id="' +
        u +
        'b" width="2" height="2" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".78" style="fill:var(--accent)"/></pattern></defs>' +
        '<g transform="translate(4.5 4.5)" fill="' +
        A +
        '">' +
        SH[k] +
        "</g>" +
        '<g fill="var(--surface)" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round">' +
        SH[k] +
        "</g>" +
        IN[k].replace(/"B"/g, '"' + B + '"') +
        "</svg>"
      );
    }
    window.__planArt = art;
    function paint() {
      var s = D.getElementById("plans-sheet");
      if (!s) return;
      s.querySelectorAll(".p2card").forEach(function (c) {
        var m = (c.className.match(/p2-(free|pass|atlas|yearly)/) || [])[1],
          t = c.querySelector(".ptile");
        if (m && t && t.dataset.kp !== m) {
          t.dataset.kp = m;
          t.innerHTML = art(m);
          t.classList.add("kpt");
        }
      });
      s.querySelectorAll('.p2add[data-addon="custom"] .p2ai').forEach(function (t) {
        if (t.dataset.kp) return;
        t.dataset.kp = "custom";
        t.innerHTML = art("custom");
        t.classList.add("kpt");
      });
    }
    var mo = new MutationObserver(function () {
      mo.disconnect();
      paint();
      go();
    });
    function go() {
      var s = D.getElementById("plans-sheet");
      s ? (paint(), mo.observe(s, { childList: !0, subtree: !0 })) : setTimeout(go, 800);
    }
    go();
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Plans: halftone icons for Free, Trip pass, Atlas, Yearly and", err);
}

/* ==========================================================================
   Developer options: remembers your own settings before the first dev change and puts them back when dev options are turned off.
   ========================================================================== */
try {
  (function () {
    var D = document,
      DK = [
        "vizag-plan",
        "vizag-renew-skip",
        "vizag-anydates",
        "vizag-zoom",
        "vizag-themes-v2",
        "vizag-offer-until",
        "vizag-offer-seen",
      ],
      SN = "vizag-dev-snap";
    function g(k) {
      try {
        return localStorage.getItem(k);
      } catch (e) {
        return null;
      }
    }
    function p(k, v) {
      try {
        v === null ? localStorage.removeItem(k) : localStorage.setItem(k, v);
      } catch (e) {}
    }
    /* Before the first dev change, remember the person's own settings */
    D.addEventListener(
      "click",
      function (e) {
        var t = e.target.closest && e.target.closest("#devgrp button");
        if (!t || t.id === "dev-off" || t.closest(".devhead") || g(SN)) return;
        var s = {};
        DK.forEach(function (k) {
          s[k] = g(k);
        });
        p(SN, JSON.stringify(s));
      },
      !0,
    );
    /* Turning dev options off puts those settings back */
    D.addEventListener(
      "click",
      function (e) {
        var t = e.target.closest && e.target.closest("#dev-off");
        if (!t) return;
        var s = null;
        try {
          s = JSON.parse(g(SN) || "null");
        } catch (x) {}
        if (s && typeof s === "object") {
          DK.forEach(function (k) {
            p(k, k in s ? s[k] : null);
          });
        } else {
          p("vizag-anydates", null);
          p("vizag-zoom", null);
          p("vizag-renew-skip", null);
          var pl = {};
          try {
            pl = JSON.parse(g("vizag-plan") || "{}") || {};
          } catch (x) {}
          (pl.plan === "pro" || pl.plan === "plus") && p("vizag-plan", null);
        }
        p(SN, null);
        try {
          sessionStorage.removeItem("vizag-dev-empty");
        } catch (x) {}
        setTimeout(function () {
          location.reload();
        }, 250);
      },
      !0,
    );
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "Developer options: remembers your own settings before the fi", err);
}

/* ==========================================================================
   Past trips: only lists trips that have ended.
   ========================================================================== */
try {
  window.__pastTrip = function (id) {
    var E = { vizag: "2026-12-08" };
    try {
      (JSON.parse(localStorage.getItem("vizag-trips") || "[]") || []).forEach(function (t) {
        if (!t || !t.id) return;
        var e = t.end || "";
        if (!e && t.start && t.days) {
          var d = new Date(t.start);
          d.setDate(d.getDate() + (+t.days || 1) - 1);
          e = d.toISOString().slice(0, 10);
        }
        E[t.id] = e;
      });
    } catch (x) {}
    var e = E[id];
    if (!e) return !1;
    var n = new Date(),
      t =
        n.getFullYear() +
        "-" +
        String(n.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(n.getDate()).padStart(2, "0");
    return e < t;
  };
} catch (err) {
  console.error("[Kosway] part failed:", "Past trips: only lists trips that have ended.", err);
}
