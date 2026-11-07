/* app-icon.js

   Home-screen app icon maker.

   Parts, in the order they run:
    1. App icon maker. Builds the home-screen icon from the chosen colour, background, fill pattern and route.
*/

/* ==========================================================================
   App icon maker. Builds the home-screen icon from the chosen colour, background, fill pattern and route.
   ========================================================================== */
try {
  (function () {
    var P = "#FBF9F5",
      K = "#121212";
    /* backgrounds: [id, name, light top, light bottom, dark top, dark bottom]; every tile is a soft vertical gradient */
    var BGS = [
      ["white", "White", "#FFFFFF", "#ECEEF1", "#1E1E20", "#000000"],
      ["lilac", "Lilac", "#F7F4FD", "#DDD3F3", "#36284E", "#120D1B"],
      ["sage", "Sage", "#F1F5ED", "#D2DDC8", "#2A3B21", "#0C130A"],
      ["match", "Match colour", "", "", "", ""],
      ["grain", "Grain", "#FFFDF8", "#EEE8DC", "#2B2723", "#12100E"],
      ["grad", "Sunrise", "", "", "", ""],
    ];
    function mixHex(a, b, t) {
      var p = function (h) {
        h = h.replace("#", "");
        return [0, 2, 4].map(function (i) {
          return parseInt(h.substr(i, 2), 16);
        });
      };
      var x = p(a),
        y = p(b);
      return (
        "#" +
        x
          .map(function (v, i) {
            var r = Math.round(v + (y[i] - v) * t).toString(16);
            return r.length < 2 ? "0" + r : r;
          })
          .join("")
      );
    }
    var bgN = 0;
    function bgStops(id, c, dark) {
      var t = c.accent || c.mid;
      if (id === "match")
        return dark
          ? [mixHex("#0E0E0E", c.deep, 0.42), mixHex("#0E0E0E", c.deep, 0.16)]
          : [mixHex("#FFFFFF", t, 0.07), mixHex("#FFFFFF", t, 0.22)];
      if (id === "grad")
        return dark
          ? [mixHex("#0E0E0E", c.deep, 0.5), "#0A0A0A"]
          : [mixHex("#FFFFFF", t, 0.05), mixHex("#FFFFFF", t, 0.36)];
      var b =
        BGS.filter(function (x) {
          return x[0] === id;
        })[0] || BGS[0];
      return dark ? [b[4], b[5]] : [b[2], b[3]];
    }
    /* overlay layers drawn over the tile: the gradient, plus noise for Grain */
    function bgOver(id, c, dark) {
      var u = "bo" + ++bgN,
        st = bgStops(id, c, dark);
      var defs =
          '<linearGradient id="' +
          u +
          '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' +
          st[0] +
          '"/><stop offset="1" stop-color="' +
          st[1] +
          '"/></linearGradient>',
        layers = ['fill="url(#' + u + ')"'];
      if (id === "grain") {
        defs +=
          '<filter id="' +
          u +
          'n" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="9" stitchTiles="stitch" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 ' +
          (dark ? 1 : 0) +
          "  0 0 0 0 " +
          (dark ? 1 : 0) +
          "  0 0 0 0 " +
          (dark ? 1 : 0) +
          "  " +
          (dark ? "0.2 0 0 0 -0.07" : "0.2 0 0 0 -0.075") +
          '" result="g"/><feComposite in="g" in2="SourceGraphic" operator="in"/></filter>';
        layers.push('fill="#000" filter="url(#' + u + 'n)"');
      }
      return { defs: defs, layers: layers };
    }
    /* round swatch: light half top-left, dark half bottom-right */
    function bgSwatch(id, c) {
      var h = "",
        d = "";
      [false, true].forEach(function (dk) {
        var o = bgOver(id, c, dk),
          cp = "bs" + ++bgN;
        var pts = dk ? "40,0 40,40 0,40" : "0,0 40,0 0,40";
        d += '<clipPath id="' + cp + '"><polygon points="' + pts + '"/></clipPath>' + o.defs;
        h +=
          '<g clip-path="url(#' +
          cp +
          ')">' +
          o.layers
            .map(function (a) {
              return '<rect width="40" height="40" ' + a + "/>";
            })
            .join("") +
          "</g>";
      });
      return (
        '<svg viewBox="0 0 40 40" aria-hidden="true"><defs>' +
        d +
        "</defs>" +
        h +
        '<circle cx="20" cy="20" r="19.5" fill="none" stroke="rgba(127,127,127,.4)"/></svg>'
      );
    }
    /* solid stand-in (used for knock-out strokes): middle of the gradient */
    function bgFor(id, c, dark) {
      var st = bgStops(id, c, dark);
      return mixHex(st[0], st[1], 0.5);
    }
    var COLORS = [
      { id: "ink", name: "Ink", deep: "#111111", mid: "#6B665E", light: "#EDEAE4" },
      { id: "lagoon", name: "Lagoon", deep: "#0E7490", mid: "#2BB3C9", light: "#5EEAD4" },
      { id: "turmeric", name: "Turmeric", deep: "#B86E06", mid: "#F5A524", light: "#FFD34D" },
      { id: "plum", name: "Plum", deep: "#6D28D9", mid: "#8B5CF6", light: "#C4B5FD" },
      { id: "moon", name: "Moonlight", deep: "#3F4450", mid: "#7A8294", light: "#FFFFFF" },
      { id: "rose", name: "Rose", deep: "#BE185D", mid: "#EC4899", light: "#F9A8D4" },
    ];
    var OPTS = {
      bg: BGS.map(function (b) {
        return [b[0], b[1]];
      }),
      shape: [
        ["both", "Both"],
        ["globe", "Globe"],
        ["pin", "Pin"],
      ],
      theme: [
        ["light", "Light"],
        ["dark", "Dark"],
      ],
      pattern: [
        ["grad", "Fade"],
        ["grain", "Grain"],
        ["half", "Halftone"],
        ["stipple", "Stipple"],
      ],
      fill: [
        ["blades", "Blades"],
        ["shape", "Full shape"],
        ["outline", "Outline"],
      ],
      pin: [
        ["cut", "Negative space"],
        ["filled", "Filled pin"],
      ],
      ring: [
        ["on", "Ring on"],
        ["off", "Ring off"],
      ],
      icon: [
        ["globe", "Globe"],
        ["pin", "Pin"],
        ["squircle", "Squircle"],
        ["rsquare", "Rounded square"],
        ["hexagon", "Hexagon"],
        ["octagon", "Octagon"],
        ["diamond", "Diamond"],
        ["triangle", "Triangle"],
        ["shield", "Shield"],
        ["arch", "Arch"],
        ["pill", "Pill"],
        ["drop", "Drop"],
        ["leaf", "Leaf"],
        ["semicircle", "Semicircle"],
        ["heart", "Heart"],
        ["star", "Star"],
      ],
      map: [
        ["off", "Pattern only"],
        ["on", "Globe map"],
      ],
      mk: [
        ["circle", "Cutout"],
        ["fill", "Filled"],
        ["none", "No marker"],
      ],
      tilt: [
        ["left", "Rising"],
        ["right", "Falling"],
      ],
      road: [
        ["none", "No route"],
        ["band", "Orbit band"],
        ["dashed", "Dashed orbit"],
        ["taper", "Tapered orbit"],
      ],
    };
    var LAND = [
      [
        [-168, 66],
        [-156, 71],
        [-130, 70],
        [-110, 72],
        [-95, 72],
        [-82, 68],
        [-78, 62],
        [-64, 60],
        [-56, 52],
        [-66, 45],
        [-70, 42],
        [-76, 38],
        [-81, 31],
        [-80, 25],
        [-84, 30],
        [-90, 29],
        [-97, 26],
        [-97, 22],
        [-92, 18],
        [-87, 21],
        [-84, 15],
        [-79, 9],
        [-82, 8],
        [-86, 12],
        [-92, 15],
        [-105, 20],
        [-110, 24],
        [-112, 31],
        [-117, 32],
        [-121, 35],
        [-124, 40],
        [-124, 48],
        [-130, 54],
        [-140, 60],
        [-152, 58],
        [-160, 58],
        [-165, 62],
      ],
      [
        [-78, 9],
        [-72, 12],
        [-63, 10],
        [-52, 5],
        [-50, 0],
        [-44, -2],
        [-35, -6],
        [-38, -13],
        [-40, -21],
        [-48, -26],
        [-53, -34],
        [-58, -38],
        [-65, -41],
        [-67, -47],
        [-70, -53],
        [-74, -50],
        [-73, -42],
        [-72, -30],
        [-71, -18],
        [-76, -14],
        [-81, -6],
        [-80, -1],
        [-77, 4],
      ],
      [
        [-17, 21],
        [-16, 12],
        [-12, 7],
        [-6, 5],
        [2, 6],
        [9, 4],
        [10, -2],
        [12, -6],
        [13, -12],
        [12, -18],
        [15, -27],
        [18, -34],
        [22, -34],
        [27, -33],
        [32, -28],
        [35, -22],
        [40, -15],
        [41, -10],
        [39, -5],
        [42, 2],
        [47, 6],
        [51, 11],
        [44, 11],
        [43, 13],
        [38, 18],
        [35, 25],
        [32, 31],
        [25, 32],
        [20, 31],
        [11, 33],
        [10, 37],
        [3, 37],
        [-6, 36],
        [-10, 30],
        [-13, 27],
      ],
      [
        [-10, 36],
        [-9, 43],
        [-2, 44],
        [-4, 48],
        [2, 51],
        [5, 53],
        [8, 55],
        [10, 58],
        [5, 62],
        [11, 64],
        [17, 69],
        [25, 71],
        [31, 70],
        [40, 68],
        [44, 66],
        [55, 68],
        [60, 70],
        [70, 73],
        [80, 73],
        [100, 76],
        [115, 74],
        [130, 71],
        [142, 72],
        [160, 70],
        [175, 66],
        [180, 64],
        [170, 60],
        [162, 58],
        [156, 51],
        [142, 47],
        [140, 40],
        [130, 34],
        [127, 38],
        [121, 40],
        [122, 31],
        [119, 25],
        [110, 21],
        [107, 17],
        [109, 12],
        [104, 9],
        [103, 2],
        [98, 8],
        [98, 16],
        [93, 19],
        [90, 22],
        [86, 20],
        [80, 15],
        [77, 8],
        [73, 16],
        [72, 21],
        [67, 24],
        [62, 25],
        [57, 26],
        [56, 22],
        [59, 22],
        [52, 17],
        [45, 13],
        [43, 17],
        [39, 22],
        [35, 28],
        [34, 32],
        [36, 36],
        [30, 36],
        [26, 38],
        [28, 41],
        [22, 40],
        [24, 37],
        [20, 40],
        [16, 38],
        [15, 41],
        [12, 44],
        [13, 45],
        [9, 44],
        [3, 43],
      ],
      [
        [114, -22],
        [114, -26],
        [115, -34],
        [118, -35],
        [124, -34],
        [130, -32],
        [135, -35],
        [138, -35],
        [141, -38],
        [147, -39],
        [150, -37],
        [153, -31],
        [153, -25],
        [150, -22],
        [146, -19],
        [145, -15],
        [142, -11],
        [141, -17],
        [136, -12],
        [132, -11],
        [129, -15],
        [124, -17],
        [121, -19],
      ],
      [
        [-52, 60],
        [-44, 60],
        [-38, 66],
        [-22, 70],
        [-18, 77],
        [-20, 82],
        [-35, 83],
        [-60, 82],
        [-70, 78],
        [-60, 75],
        [-55, 70],
      ],
      [
        [-6, 50],
        [-3, 51],
        [1, 52],
        [0, 54],
        [-2, 57],
        [-5, 59],
        [-6, 56],
        [-5, 54],
      ],
      [
        [130, 31],
        [133, 34],
        [136, 35],
        [140, 36],
        [141, 40],
        [140, 42],
        [137, 38],
        [133, 36],
      ],
      [
        [44, -25],
        [47, -25],
        [50, -16],
        [49, -12],
        [45, -16],
        [43, -22],
      ],
    ];
    var RAD = Math.PI / 180;
    function proj(lon, lat, c) {
      var lam = (lon - c.lon) * RAD,
        ph = lat * RAD,
        t = c.lat * RAD;
      var vis = Math.sin(t) * Math.sin(ph) + Math.cos(t) * Math.cos(ph) * Math.cos(lam);
      var x = c.r * Math.cos(ph) * Math.sin(lam),
        y = c.r * (Math.cos(t) * Math.sin(ph) - Math.sin(t) * Math.cos(ph) * Math.cos(lam));
      if (vis < 0) {
        var hh = Math.hypot(x, y) || 1;
        x = (x / hh) * c.r;
        y = (y / hh) * c.r;
      }
      return [c.x + x, c.y - y, vis >= 0];
    }
    function landPath(c) {
      return LAND.map(function (poly) {
        var any = false,
          out = "";
        var pts = poly.map(function (q) {
          var r = proj(q[0], q[1], c);
          if (r[2]) any = true;
          return r;
        });
        if (!any) return "";
        pts.forEach(function (r, i) {
          out += (i ? "L" : "M") + f(r[0]) + " " + f(r[1]);
        });
        return out + "Z";
      }).join("");
    }
    function gratPath(c) {
      var u = "",
        lon,
        lat,
        seg,
        r;
      for (lon = -180; lon < 180; lon += 30) {
        seg = "";
        for (lat = -80; lat <= 80; lat += 10) {
          r = proj(lon, lat, c);
          if (r[2]) seg += (seg ? "L" : "M") + f(r[0]) + " " + f(r[1]);
          else if (seg) {
            u += seg;
            seg = "";
          }
        }
        u += seg;
      }
      [-60, -30, 0, 30, 60].forEach(function (la) {
        seg = "";
        for (lon = -180; lon <= 180; lon += 10) {
          r = proj(lon, la, c);
          if (r[2]) seg += (seg ? "L" : "M") + f(r[0]) + " " + f(r[1]);
          else if (seg) {
            u += seg;
            seg = "";
          }
        }
        u += seg;
      });
      return u;
    }
    var ICONS = {
      squircle: {
        sil: "M50 12C82 12 88 18 88 50S82 88 50 88 12 82 12 50 18 12 50 12Z",
        mx: 60,
        my: 38,
        r: 8,
      },
      rsquare: {
        sil: "M28 14h44a14 14 0 0 1 14 14v44a14 14 0 0 1-14 14H28a14 14 0 0 1-14-14V28a14 14 0 0 1 14-14z",
        mx: 60,
        my: 38,
        r: 8,
      },
      hexagon: { sil: "M50 10l35 20v40L50 90 15 70V30z", mx: 58, my: 40, r: 8 },
      octagon: { sil: "M35 12h30l23 23v30L65 88H35L12 65V35z", mx: 58, my: 40, r: 8 },
      diamond: { sil: "M50 8l42 42-42 42L8 50z", mx: 50, my: 38, r: 8 },
      triangle: { sil: "M50 12l40 72H10z", mx: 50, my: 54, r: 8 },
      shield: { sil: "M50 10l34 12v26c0 22-15 36-34 44-19-8-34-22-34-44V22z", mx: 50, my: 40, r: 8 },
      arch: { sil: "M16 88V46a34 34 0 0 1 68 0v42z", mx: 50, my: 42, r: 9 },
      pill: { sil: "M32 24h36a26 26 0 0 1 0 52H32a26 26 0 0 1 0-52z", mx: 62, my: 42, r: 7 },
      drop: { sil: "M50 8C50 8 82 44 82 62a32 32 0 0 1-64 0C18 44 50 8 50 8z", mx: 50, my: 52, r: 9 },
      leaf: { sil: "M14 86C14 40 40 14 86 14C86 60 60 86 14 86z", mx: 54, my: 42, r: 8 },
      semicircle: { sil: "M8 72a42 42 0 0 1 84 0z", mx: 56, my: 50, r: 7 },
      heart: {
        sil: "M50 86C22 66 10 52 10 36a20 20 0 0 1 40-6 20 20 0 0 1 40 6c0 16-12 30-40 50z",
        mx: 50,
        my: 44,
        r: 8,
      },
      star: { sil: "M50 6l12 28 30 2-23 20 8 30-27-16-27 16 8-30-23-20 30-2z", mx: 50, my: 46, r: 7.5 },
    };

    function f(n) {
      return Math.round(n * 100) / 100;
    }
    function lens(x, t, b, w) {
      var m = (t + b) / 2;
      return (
        "M" +
        f(x) +
        " " +
        f(t) +
        "Q" +
        f(x + w) +
        " " +
        f(m) +
        " " +
        f(x) +
        " " +
        f(b) +
        "Q" +
        f(x - w) +
        " " +
        f(m) +
        " " +
        f(x) +
        " " +
        f(t) +
        "Z"
      );
    }

    var uidN = 0;
    function mark(s, shape) {
      var uid = "kz" + ++uidN;
      var c =
        COLORS.filter(function (x) {
          return x.id === s.color;
        })[0] || COLORS[0];
      var dark = s.theme === "dark";
      var bg = bgFor(s.bg || "paper", c, dark),
        bgOv = bgOver(s.bg, c, dark),
        bgO = bgOv.layers
          .map(function (a) {
            return '<rect width="100" height="100" rx="22.4" ' + a + "/>";
          })
          .join("");
      var main = dark ? c.light : c.deep;
      var acc = dark ? c.light : c.accent || main;
      if (s.tint === "never") {
        c = COLORS[0];
        main = dark ? c.light : c.deep;
      } else if (c.accent) {
        c = { id: c.id, deep: c.accent, mid: c.accent, light: c.light };
        main = c.deep;
      } /* whole icon uses one hue: the swatch colour */ /* fill stays ink and only the orbit takes the colour; with no orbit ('Colour fill') the shape itself takes it */
      var a, b;
      switch (s.pattern) {
        case "water":
          a = dark ? c.mid : c.deep;
          b = dark ? c.light : c.light;
          if (!dark && c.light === "#EDEAE4") b = "#C9C2B6";
          break;
        case "grain":
          a = dark ? c.light : c.mid;
          b = dark ? c.mid : c.deep;
          break;
        case "grad":
          a = dark ? c.light : c.mid;
          b = dark ? c.mid : c.deep;
          break;
        default:
          a = main;
          b = c.mid;
      }
      var isGlobe = shape === "globe";
      var textured = s.pattern !== "solid";
      var step = textured ? 7 : 5,
        wmax = textured ? 3.1 : 2.4;
      if (
        s.pattern === "rings" ||
        s.pattern === "stipple" ||
        s.pattern === "topo" ||
        s.pattern === "strata"
      ) {
        step = 8;
        wmax = 3.6;
      }
      var IC = ICONS[shape];
      var silhouette = IC
        ? IC.sil
        : isGlobe
          ? "M14 50a36 36 0 1 0 72 0a36 36 0 1 0 -72 0z"
          : "M50 90L26 58A30 30 0 1 1 74 58Z";
      var d = "",
        k,
        x,
        dd,
        t,
        bt,
        w;
      if (s.fill !== "blades" || s.map === "on") d = silhouette;
      else if (IC) {
        for (k = -12; k <= 12; k++) {
          x = 50 + k * step;
          dd = x - 50;
          if (Math.abs(dd) > 44) continue;
          w = 0.5 + (wmax - 0.5) * Math.sqrt(1 - (dd / 46) * (dd / 46));
          if (s.road === "spot") w *= 0.4 + 2.1 * Math.exp(-Math.pow((x - IC.mx) / 11, 2));
          d += lens(x, 4, 96, w);
        }
      } else if (isGlobe) {
        for (k = -10; k <= 10; k++) {
          x = 50 + k * step;
          dd = x - 50;
          if (Math.abs(dd) > 34.8) continue;
          var h = Math.sqrt(1296 - dd * dd);
          w = 0.5 + (wmax - 0.5) * Math.sqrt(1 - (dd / 36) * (dd / 36));
          if (s.road === "spot") w *= 0.4 + 2.1 * Math.exp(-Math.pow((x - 64) / 11, 2));
          d += lens(x, 50 - h, 50 + h, w);
        }
      } else {
        for (k = -10; k <= 10; k++) {
          x = 50 + k * step;
          dd = x - 50;
          if (Math.abs(dd) > 28.8) continue;
          t = 40 - Math.sqrt(900 - dd * dd);
          bt = Math.abs(dd) <= 24 ? 90 - (32 * Math.abs(dd)) / 24 : 40 + Math.sqrt(900 - dd * dd);
          w = 0.5 + (wmax - 0.5) * Math.sqrt(1 - (dd / 30) * (dd / 30));
          if (s.road === "spot") w *= 0.4 + 2.1 * Math.exp(-Math.pow((x - 50) / 9, 2));
          d += lens(x, t, bt, w);
        }
      }
      var mk =
        isGlobe && !IC
          ? "none"
          : s.mk === "fill"
            ? "circle"
            : s.mk === "circle" || s.mk === "none"
              ? s.mk
              : "pin"; /* globe never carries a marker */
      var M = {
        globe: {
          pin: {
            hole: "M64 17a12 12 0 0 1 12 12C76 39 64 53 64 53S52 39 52 29a12 12 0 0 1 12-12z",
            dx: 64,
            dy: 29,
            dr: 4,
            road: "M6 68C24 46 42 74 64 53",
          },
          circle: {
            hole: "M54 34a10 10 0 1 0 20 0a10 10 0 1 0 -20 0z",
            dx: 64,
            dy: 34,
            dr: 4.2,
            road: "M6 68C24 46 42 72 64 44",
          },
          none: { hole: "", dx: 64, dy: 32, dr: 0, road: "M6 68C24 46 42 72 64 44" },
        },
        pin: {
          circle: {
            hole: "M42.5 40a7.5 7.5 0 1 0 15 0a7.5 7.5 0 1 0 -15 0z",
            dx: 50,
            dy: 40,
            dr: 4,
            road: "M12 66C26 46 38 64 50 47",
          },
          pin: {
            hole: "M50 26a9.5 9.5 0 0 1 9.5 9.5C59.5 43 50 53 50 53S40.5 43 40.5 35.5a9.5 9.5 0 0 1 9.5-9.5z",
            dx: 50,
            dy: 35.5,
            dr: 3.4,
            road: "M12 66C26 46 38 66 50 53",
          },
          none: { hole: "", dx: 50, dy: 40, dr: 0, road: "M12 66C26 46 38 64 50 47" },
        },
      }[isGlobe ? "globe" : "pin"][mk];
      if (IC) {
        var R = IC.r,
          X = IC.mx,
          Y = IC.my;
        if (mk === "pin")
          M = {
            hole:
              "M" +
              X +
              " " +
              f(Y - R) +
              "a" +
              R +
              " " +
              R +
              " 0 0 1 " +
              R +
              " " +
              R +
              "C" +
              f(X + R) +
              " " +
              f(Y + 0.8 * R) +
              " " +
              X +
              " " +
              f(Y + 1.9 * R) +
              " " +
              X +
              " " +
              f(Y + 1.9 * R) +
              "S" +
              f(X - R) +
              " " +
              f(Y + 0.8 * R) +
              " " +
              f(X - R) +
              " " +
              Y +
              "a" +
              R +
              " " +
              R +
              " 0 0 1 " +
              R +
              " " +
              -R +
              "z",
            dx: X,
            dy: Y,
            dr: f(R * 0.38),
            road: IC.rs + X + " " + f(Y + 1.9 * R),
          };
        else if (mk === "circle")
          M = {
            hole:
              "M" +
              f(X - R) +
              " " +
              Y +
              "a" +
              R +
              " " +
              R +
              " 0 1 0 " +
              2 * R +
              " 0a" +
              R +
              " " +
              R +
              " 0 1 0 " +
              -2 * R +
              " 0z",
            dx: X,
            dy: Y,
            dr: f(R * 0.45),
            road: IC.rs + X + " " + f(Y + R),
          };
        else M = { hole: "", dx: X, dy: Y, dr: 0, road: IC.rs + X + " " + Y };
      }
      var rt = s.road || "orbit";
      var line = null,
        line2 = null;
      var E = IC
        ? { x: 50, y: 52, rx: 48, ry: 13 }
        : isGlobe
          ? { x: 50, y: 52, rx: 47, ry: 13 }
          : { x: 50, y: 46, rx: 40, ry: 11 };
      function arcs(e, rot) {
        var fr = "",
          bk = "",
          r = rot * RAD;
        for (var i = 0; i <= 64; i++) {
          var t = (i / 64) * 2 * Math.PI,
            ex = e.rx * Math.cos(t),
            ey = e.ry * Math.sin(t);
          var px = f(e.x + ex * Math.cos(r) - ey * Math.sin(r)),
            py = f(e.y + ex * Math.sin(r) + ey * Math.cos(r));
          if (i <= 32) fr += (i ? "L" : "M") + px + " " + py;
          if (i >= 32) bk += (i > 32 ? "L" : "M") + px + " " + py;
        }
        return {
          front: fr,
          back: bk,
          at: function (t) {
            var ex = e.rx * Math.cos(t),
              ey = e.ry * Math.sin(t);
            return [
              f(e.x + ex * Math.cos(r) - ey * Math.sin(r)),
              f(e.y + ex * Math.sin(r) + ey * Math.cos(r)),
            ];
          },
        };
      }
      var rings = [];
      var tr = s.tilt === "right" ? -1 : 1;
      if (rt === "orbit") rings.push({ a: arcs(E, -18 * tr), w: 1.3, cut: 6.4 });
      else if (rt === "dashed") rings.push({ a: arcs(E, -18 * tr), w: 2.1, cut: 7.2, dash: "7 4.5" });
      else if (rt === "double") {
        rings.push({ a: arcs(E, -18 * tr), w: 1.1, cut: 5.6 });
        rings.push({
          a: arcs({ x: E.x, y: E.y - 2, rx: E.rx - 3, ry: E.ry - 2 }, 22 * tr),
          w: 1.1,
          cut: 5.6,
        });
      } else if (rt === "taper") rings.push({ a: arcs(E, -18 * tr), w: 0.6, cut: 7.6, taper: 3.4 });
      else if (rt === "sat") rings.push({ a: arcs(E, -18 * tr), w: 1.1, cut: 6, sat: true });
      else if (rt === "band") rings.push({ a: arcs(E, -18 * tr), w: 2.7, cut: 7.8 });
      else if (rt === "halo")
        rings.push({
          a: arcs({ x: 50, y: IC ? 26 : isGlobe ? 26 : 22, rx: IC ? 32 : isGlobe ? 30 : 26, ry: 7 }, -8),
          w: 1.2,
          cut: 4,
        });
      var holeD = M.hole;
      var dx = M.dx,
        dy = M.dy,
        dr = M.dr,
        ringR = 7;
      var dot = main;
      var defs = "",
        body = "";
      defs += '<clipPath id="c' + uid + '"><path d="' + d + '"/></clipPath>';
      defs +=
        '<mask id="m' +
        uid +
        '"><rect width="100" height="100" fill="#fff"/>' +
        rings
          .map(function (g) {
            return '<path d="' + g.a.front + '" fill="none" stroke="#000" stroke-width="' + g.cut + '"/>';
          })
          .join("") +
        '<path d="' +
        holeD +
        '" fill="#000" stroke="#000" stroke-width="4"/></mask>';
      var fillInner = "";
      if (s.pattern === "solid") fillInner = '<rect width="100" height="100" fill="' + a + '"/>';
      else if (s.pattern === "half") {
        defs +=
          '<pattern id="p' +
          uid +
          '" width="2.6" height="2.6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="1.3" cy="1.3" r="0.65" fill="' +
          a +
          '"/></pattern>';
        defs +=
          '<pattern id="q' +
          uid +
          '" width="2.6" height="2.6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="1.3" cy="1.3" r="1.22" fill="' +
          a +
          '"/></pattern>';
        defs +=
          '<linearGradient id="g' +
          uid +
          '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient><mask id="f' +
          uid +
          '"><rect width="100" height="100" fill="url(#g' +
          uid +
          ')"/></mask>';
        fillInner =
          '<rect width="100" height="100" fill="url(#p' +
          uid +
          ')"/><rect width="100" height="100" fill="url(#q' +
          uid +
          ')" mask="url(#f' +
          uid +
          ')"/>';
      } else if (s.pattern === "water") {
        defs +=
          '<pattern id="p' +
          uid +
          '" width="10" height="4.6" patternUnits="userSpaceOnUse"><path d="M-2.5 2.3C0 -0.2 2.5 -0.2 5 2.3S10 4.8 12.5 2.3" fill="none" stroke="' +
          b +
          '" stroke-width="1.3" stroke-linecap="round"/></pattern>';
        fillInner =
          '<rect width="100" height="100" fill="' +
          a +
          '"/><rect width="100" height="100" fill="url(#p' +
          uid +
          ')"/>';
      } else if (s.pattern === "grain") {
        var gm =
          (dark ? "0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  " : "0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  ") +
          "1.3 0 0 0 -0.45";
        defs +=
          '<linearGradient id="g' +
          uid +
          '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' +
          a +
          '"/><stop offset="1" stop-color="' +
          b +
          '"/></linearGradient>';
        defs +=
          '<filter id="n' +
          uid +
          '" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" stitchTiles="stitch" result="n"/><feColorMatrix in="n" type="matrix" values="' +
          gm +
          '" result="g"/><feComposite in="g" in2="SourceGraphic" operator="atop"/></filter>';
        fillInner = '<rect width="100" height="100" fill="url(#g' + uid + ')" filter="url(#n' + uid + ')"/>';
      } else if (s.pattern === "grad") {
        defs +=
          '<linearGradient id="g' +
          uid +
          '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' +
          a +
          '"/><stop offset="1" stop-color="' +
          b +
          '"/></linearGradient>';
        fillInner = '<rect width="100" height="100" fill="url(#g' + uid + ')"/>';
      } else if (s.pattern === "rings") {
        fillInner = "";
        for (var i = 1; i <= 22; i++)
          fillInner +=
            '<circle cx="' +
            dx +
            '" cy="' +
            dy +
            '" r="' +
            f(i * 3.2) +
            '" fill="none" stroke="' +
            a +
            '" stroke-width="1.6"/>';
      } else if (s.pattern === "stipple") {
        var tbl = [];
        for (var j = 0; j < 10; j++) tbl.push(j / 10 >= 0.38 ? 1 : 0);
        defs +=
          '<filter id="n' +
          uid +
          '" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="1" seed="4" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="al"/><feComponentTransfer in="al" result="th"><feFuncA type="discrete" tableValues="' +
          tbl.join(" ") +
          '"/></feComponentTransfer><feFlood flood-color="' +
          a +
          '" result="fl"/><feComposite in="fl" in2="th" operator="in"/></filter>';
        fillInner = '<rect width="100" height="100" fill="' + bg + '" filter="url(#n' + uid + ')"/>';
      } else if (s.pattern === "strata") {
        fillInner = "";
        for (var sy = 3; sy < 100; sy += 3.6)
          fillInner +=
            '<rect x="0" y="' +
            f(sy) +
            '" width="100" height="' +
            f(0.45 + (2.3 * sy) / 100) +
            '" fill="' +
            a +
            '"/>';
      } else if (s.pattern === "topo") {
        var tt = [];
        for (var q2 = 0; q2 < 18; q2++) tt.push(q2 % 2);
        defs +=
          '<filter id="n' +
          uid +
          '" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="7" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.2 0 0 0 -0.6" result="al"/><feComponentTransfer in="al" result="th"><feFuncA type="discrete" tableValues="' +
          tt.join(" ") +
          '"/></feComponentTransfer><feFlood flood-color="' +
          a +
          '" result="fl"/><feComposite in="fl" in2="th" operator="in"/></filter>';
        fillInner = '<rect width="100" height="100" fill="' + bg + '" filter="url(#n' + uid + ')"/>';
      }
      if (s.map === "on") {
        var gc = IC
          ? { x: 50, y: 50, r: 42, lon: 80, lat: 22 }
          : isGlobe
            ? { x: 50, y: 50, r: 36, lon: 80, lat: 22 }
            : { x: 50, y: 40, r: 30, lon: 80, lat: 22 };
        defs += '<clipPath id="l' + uid + '"><path d="' + landPath(gc) + '"/></clipPath>';
        defs +=
          '<pattern id="o' +
          uid +
          '" width="1.6" height="1.6" patternUnits="userSpaceOnUse"><circle cx="0.8" cy="0.8" r="0.34" fill="' +
          main +
          '" fill-opacity="0.45"/></pattern>';
        fillInner =
          '<rect width="100" height="100" fill="url(#o' +
          uid +
          ')"/><g clip-path="url(#l' +
          uid +
          ')">' +
          (s.pattern === "stipple" ? '<rect width="100" height="100" fill="' + bg + '"/>' : "") +
          fillInner +
          "</g>" +
          '<path d="' +
          gratPath(gc) +
          '" fill="none" stroke="' +
          main +
          '" stroke-opacity="0.35" stroke-width="0.4"/>';
      }
      if (rings.length) {
        defs +=
          '<mask id="b' +
          uid +
          '"><rect width="100" height="100" fill="#fff"/><path d="' +
          silhouette +
          '" fill="#000"/></mask>';
        body +=
          '<g mask="url(#b' +
          uid +
          ')">' +
          rings
            .map(function (g) {
              return (
                '<path d="' +
                g.a.back +
                '" fill="none" stroke="' +
                acc +
                '" stroke-width="' +
                g.w +
                '" stroke-opacity="0.85"' +
                (g.dash ? ' stroke-dasharray="' + g.dash + '"' : "") +
                "/>"
              );
            })
            .join("") +
          "</g>";
      }
      if (s.fill === "outline") {
        body +=
          '<g mask="url(#m' +
          uid +
          ')"><path d="' +
          silhouette +
          '" fill="none" stroke="' +
          main +
          '" stroke-width="3.2" stroke-linejoin="round"/></g>';
        if (s.pin === "cut")
          body += '<path d="' + holeD + '" fill="none" stroke="' + main + '" stroke-width="2"/>';
      } else {
        body +=
          '<g mask="url(#m' +
          uid +
          ')"><g clip-path="url(#s' +
          uid +
          ')"><g clip-path="url(#c' +
          uid +
          ')">' +
          fillInner +
          "</g></g></g>";
      }
      var lineCol = main;
      if (s.pin === "filled" && holeD) body += '<path d="' + holeD + '" fill="' + dot + '"/>';
      defs +=
        '<clipPath id="s' +
        uid +
        '"><path d="' +
        silhouette +
        '"/></clipPath><mask id="h' +
        uid +
        '"><rect width="100" height="100" fill="#fff"/><path d="' +
        holeD +
        '" fill="#000" stroke="#000" stroke-width="4"/></mask>';
      if (rings.length)
        body +=
          '<g mask="url(#h' +
          uid +
          ')">' +
          rings
            .map(function (g) {
              var o = "";
              if (g.taper) {
                for (var ti = 0; ti < 48; ti++) {
                  var t0 = (ti / 48) * Math.PI,
                    t1 = ((ti + 1) / 48) * Math.PI,
                    p0 = g.a.at(t0),
                    p1 = g.a.at(t1);
                  o +=
                    '<path d="M' +
                    p0[0] +
                    " " +
                    p0[1] +
                    "L" +
                    p1[0] +
                    " " +
                    p1[1] +
                    '" stroke="' +
                    acc +
                    '" stroke-linecap="round" stroke-width="' +
                    f(g.w + (g.taper - g.w) * Math.pow(Math.sin((t0 + t1) / 2), 1.6)) +
                    '"/>';
                }
              } else
                o =
                  '<path d="' +
                  g.a.front +
                  '" fill="none" stroke="' +
                  acc +
                  '" stroke-width="' +
                  g.w +
                  '"' +
                  (g.dash ? ' stroke-dasharray="' + g.dash + '"' : "") +
                  "/>";
              if (g.sat) {
                var q = g.a.at(Math.PI * 0.3);
                o +=
                  '<circle cx="' +
                  q[0] +
                  '" cy="' +
                  q[1] +
                  '" r="3.4" fill="' +
                  acc +
                  '" stroke="' +
                  bg +
                  '" stroke-width="1.6"/>';
              }
              return o;
            })
            .join("") +
          "</g>";
      [line, line2].forEach(function (line) {
        if (line)
          body +=
            (line.clip ? '<g clip-path="url(#s' + uid + ')">' : "<g>") +
            '<g mask="url(#h' +
            uid +
            ')"><path d="' +
            line.d +
            '" fill="none" stroke="' +
            (line.col || lineCol) +
            '" stroke-width="' +
            line.w +
            '"' +
            (line.dash ? ' stroke-dasharray="' + line.dash + '"' : "") +
            (line.cap ? ' stroke-linecap="' + line.cap + '"' : "") +
            "/></g></g>";
      });
      if (holeD && s.mk === "fill")
        body +=
          '<circle cx="' +
          dx +
          '" cy="' +
          dy +
          '" r="' +
          f(dr * 1.42) +
          '" fill="' +
          acc +
          '"/>'; /* filled marker: solid dot inside the cut-out */
      if (holeD && s.pin !== "hole")
        body +=
          '<circle cx="' +
          dx +
          '" cy="' +
          dy +
          '" r="' +
          dr +
          '" fill="' +
          (s.pin === "filled" ? bg : dot) +
          '"/>';
      if (s.ring === "on" && s.pin !== "filled")
        body +=
          '<circle cx="' +
          dx +
          '" cy="' +
          dy +
          '" r="' +
          ringR +
          '" fill="none" stroke="' +
          dot +
          '" stroke-width="0.9"/>';
      defs += bgOv.defs;
      return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="Kosway ' +
        shape +
        ' icon"><defs>' +
        defs +
        '</defs><rect width="100" height="100" rx="22.4" fill="' +
        bg +
        '"/>' +
        bgO +
        body +
        "</svg>"
      );
    }

    /* ---- app integration ---- */
    var PRESETS = [
      {
        id: "classic",
        name: "Classic",
        th: "dark",
        color: "ink",
        pattern: "half",
        mk: "circle",
        tint: "off",
        map: "off",
        road: "dashed",
        bg: "white",
      },
      {
        id: "paper",
        name: "Paper",
        th: "light",
        color: "ink",
        pattern: "grain",
        mk: "none",
        tint: "off",
        map: "off",
        road: "dashed",
        bg: "grain",
      },
      {
        id: "ocean",
        name: "Ocean",
        th: "dark",
        color: "lagoon",
        pattern: "grain",
        mk: "none",
        tint: "on",
        map: "off",
        road: "dashed",
        bg: "grad",
      },
      {
        id: "sage",
        name: "Sage",
        th: "dark",
        color: "moon",
        pattern: "grain",
        mk: "none",
        tint: "off",
        map: "off",
        road: "dashed",
        bg: "sage",
      },
      {
        id: "lilac",
        name: "Lilac",
        th: "light",
        color: "plum",
        pattern: "grain",
        mk: "none",
        tint: "on",
        map: "off",
        road: "dashed",
        bg: "lilac",
      },
    ];
    var KEYS = ["color", "bg", "pattern", "mk", "tint", "map", "road", "tilt"];
    var DEF = {
      color: "ink",
      bg: "white",
      pattern: "half",
      mk: "circle",
      tint: "off",
      map: "off",
      road: "dashed",
      tilt: "left",
    };
    var FIXED = { fill: "blades", pin: "hole", ring: "off" }; /* marker = clean circular cut-out */
    var STORE = "vizag-kosway-icon";
    function norm(p) {
      var o = {};
      KEYS.forEach(function (k) {
        o[k] = p[k] || DEF[k];
      });
      o.map = "off";
      /* globe removed: pin only */ return o;
    }
    function valid(k, v) {
      return k === "color"
        ? COLORS.some(function (c) {
            return c.id === v;
          })
        : k === "map" || k === "tint"
          ? v === "on" || v === "off"
          : (OPTS[k] || []).some(function (o) {
              return o[0] === v;
            });
    }
    var cur = norm(PRESETS[0]);
    try {
      var sv = JSON.parse(localStorage.getItem(STORE) || "null");
      if (sv && typeof sv === "object")
        KEYS.forEach(function (k) {
          if (valid(k, sv[k])) cur[k] = sv[k];
        });
    } catch (e) {}
    cur.map = "off";
    function cfg(p, theme) {
      var o = Object.assign({}, FIXED, { theme: theme });
      KEYS.forEach(function (k) {
        o[k] = p[k];
      });
      return o;
    }
    function svgFor(p, theme) {
      p = norm(p);
      return mark(cfg(p, theme), p.map === "on" ? "globe" : "pin");
    }
    function matchPreset() {
      return PRESETS.filter(function (p) {
        var n = norm(p);
        return KEYS.every(function (k) {
          return n[k] === cur[k];
        });
      })[0];
    }
    /* the app has several themes and skins, so read the real surface colour instead of one attribute */
    function appTheme() {
      try {
        var c = getComputedStyle(document.body).backgroundColor.match(/\d+(\.\d+)?/g);
        if (c && c.length >= 3) return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2] < 128 ? "dark" : "light";
      } catch (e) {}
      return "light";
    }
    function colName(id) {
      return (
        (
          COLORS.filter(function (c) {
            return c.id === id;
          })[0] || {}
        ).name || ""
      );
    }
    function optName(k, v) {
      var o = (OPTS[k] || []).filter(function (x) {
        return x[0] === v;
      })[0];
      return o ? o[1] : "";
    }
    /* home-screen icon + favicon follow the chosen icon (dark variant when the app theme is dark) */
    function applyIcon() {
      var url = "data:image/svg+xml," + encodeURIComponent(svgFor(cur, appTheme()));
      ["icon"].forEach(function (rel) {
        var l = document.querySelector('link[rel="' + rel + '"]');
        if (!l) {
          l = document.createElement("link");
          l.rel = rel;
          document.head.appendChild(l);
        }
        l.href = url;
      });
      window.__iconPng && window.__iconPng(url);
    }
    function save() {
      try {
        localStorage.setItem(STORE, JSON.stringify(cur));
      } catch (e) {}
      applyIcon();
      paintAll();
    }

    var sheet = document.getElementById("theme-sheet"),
      grid = sheet && sheet.querySelector(".icgrid");
    if (!grid) {
      applyIcon();
      return;
    }
    var sec = grid.parentNode,
      selEl = document.getElementById("th-seli");
    var box = document.createElement("div");
    box.innerHTML =
      '<div class="kz-now"><span class="kz-pv" id="kz-pv"></span><button type="button" class="kz-btn" id="kz-open">Customise</button></div><div class="thcap kz-pcap"><span>Presets</span></div><div class="kz-row" id="kz-presets" role="group" aria-label="Icon presets"></div>';
    sec.replaceChild(box, grid);
    var pr = document.getElementById("kz-presets");
    PRESETS.forEach(function (p) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "kz-t";
      b.dataset.p = p.id;
      b.setAttribute("aria-label", p.name);
      b.title = p.name;
      b.innerHTML = svgFor(p, p.th);
      b.onclick = function () {
        cur = norm(p);
        save();
        noMatch();
      };
      pr.appendChild(b);
    });
    /* picking an icon by hand turns off 'Match app icon to theme' */
    function noMatch() {
      try {
        localStorage.setItem("vizag-icon-match", "0");
      } catch (e) {}
      document.dispatchEvent(new Event("kz-match"));
    }
    window.__kzApi = {
      get: function () {
        return norm(cur);
      },
      set: function (o) {
        Object.keys(o).forEach(function (k) {
          if (valid(k, o[k])) cur[k] = o[k];
        });
        cur.mk = "circle";
        cur.tilt = "left";
        cur.tint = "off";
        save();
      },
      svg: function (p, th) {
        return svgFor(p, th);
      },
      colors: COLORS.map(function (c) {
        return [c.id, c.name, c.mid, c.deep, c.light];
      }),
      bgs: OPTS.bg,
    };
    window.__kzPreset = function (id) {
      var p = PRESETS.filter(function (x) {
        return x.id === id;
      })[0];
      if (p) {
        cur = norm(p);
        save();
      }
    };

    /* custom sheet */
    var ks = document.createElement("div");
    ks.className = "sheet lsheet psheet";
    ks.id = "kz-sheet";
    ks.hidden = true;
    ks.setAttribute("role", "dialog");
    ks.setAttribute("aria-label", "Custom app icon");
    ks.innerHTML =
      '<div class="kz-head"><span class="kz-ttl">Custom icon</span><button type="button" class="kz-reset" id="kz-reset" aria-label="Reset to the default icon" title="Reset to default"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4h4"/></svg>Reset</button><button type="button" class="kz-apply" id="kz-apply">Apply</button><button type="button" class="kz-x" id="kz-close" aria-label="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div><div class="kz-hero" style="margin-top:14px"><div class="kz-stage" id="kz-stage"></div><div class="kz-bar" id="kz-bar"></div></div><div id="kz-ctl"></div>';
    document.body.appendChild(ks);
    ks.addEventListener("click", function (e) {
      e.stopPropagation();
    });
    var scrim = document.getElementById("scrim");
    var draft = null;
    function openKs() {
      draft = {};
      KEYS.forEach(function (k) {
        draft[k] = cur[k];
      });
      sheet.hidden = true;
      ks.hidden = false;
      if (scrim) scrim.hidden = false;
      paintAll();
    }
    function closeKs() {
      ks.hidden = true;
      sheet.hidden = false;
      draft = null;
      paintAll();
    }
    document.getElementById("kz-open").onclick = function (e) {
      e.stopPropagation();
      openKs();
    };
    document.getElementById("kz-close").onclick = closeKs;
    function sameAsCur() {
      return (
        !!draft &&
        KEYS.every(function (k) {
          return draft[k] === cur[k];
        })
      );
    }
    document.getElementById("kz-apply").onclick = function () {
      if (!draft || sameAsCur()) return;
      noMatch();
      KEYS.forEach(function (k) {
        cur[k] = draft[k];
      });
      save();
      closeKs();
    };
    function edit(k, v) {
      draft[k] = v;
      paintAll();
    }
    document.getElementById("kz-reset").onclick = function () {
      if (!draft) return;
      var d = norm(PRESETS[0]);
      KEYS.forEach(function (k) {
        draft[k] = d[k];
      });
      paintAll();
    };
    if (scrim)
      scrim.addEventListener("click", function () {
        if (!ks.hidden) {
          ks.hidden = true;
          scrim.hidden = true;
          draft = null;
        }
      });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !ks.hidden) closeKs();
    });

    var PN = "M12 21s-6-6.2-6-11a6 6 0 0 1 12 0c0 4.8-6 11-6 11z";
    function hole(r) {
      return (
        "M" +
        (12 - r) +
        " 10a" +
        r +
        " " +
        r +
        " 0 1 0 " +
        2 * r +
        " 0a" +
        r +
        " " +
        r +
        " 0 1 0 " +
        -2 * r +
        " 0z"
      );
    }
    function ringG(rot, pin) {
      var T = ' transform="rotate(' + rot + ' 12 10.4)"',
        F = "M1.5 10.4A10.5 3.2 0 0 0 22.5 10.4",
        B = "M22.5 10.4A10.5 3.2 0 0 0 1.5 10.4";
      var pe =
        pin === "outline"
          ? '<path d="' + PN + '" stroke-width="1.4" stroke-opacity=".45" mask="url(#gA)"/>'
          : '<path d="' +
            PN +
            '" fill="currentColor" stroke="none"' +
            (pin === "faint" ? ' fill-opacity=".3"' : "") +
            ' mask="url(#gA)"/>';
      return (
        '<defs><mask id="gA"><rect x="-2" y="-2" width="28" height="28" fill="#fff"/><path d="' +
        F +
        '" fill="none" stroke="#000" stroke-width="3.6"' +
        T +
        '/></mask><mask id="gB"><rect x="-2" y="-2" width="28" height="28" fill="#fff"/><path d="' +
        PN +
        '" fill="#000"/></mask></defs>' +
        pe +
        '<path d="' +
        F +
        '"' +
        T +
        ' stroke-width="1.9"/><path d="' +
        B +
        '"' +
        T +
        ' stroke-width="1.9" mask="url(#gB)"/>'
      );
    }
    var I = {
      cut: '<path fill="currentColor" stroke="none" fill-rule="evenodd" d="' + PN + hole(2.7) + '"/>',
      fdot:
        '<path fill="currentColor" stroke="none" fill-rule="evenodd" d="' +
        PN +
        hole(3.4) +
        '"/><circle cx="12" cy="10" r="1.9" fill="currentColor" stroke="none"/>',
      plain: '<path fill="currentColor" stroke="none" d="' + PN + '"/>',
      up: ringG(-18, "faint"),
      down: ringG(18, "faint"),
      orbit: ringG(-16, "outline"),
      whole: ringG(-16, "solid"),
    };
    var QG = [
      {
        key: "mk",
        label: "Marker",
        opts: [
          ["circle", "Cutout", "cut"],
          ["fill", "Filled", "fdot"],
          ["none", "None", "plain"],
        ],
      },
      {
        key: "tilt",
        label: "Tilt",
        opts: [
          ["left", "Rising", "up"],
          ["right", "Falling", "down"],
        ],
      },
      {
        key: "tint",
        label: "Colour",
        opts: [
          ["off", "Orbit", "orbit"],
          ["on", "Whole", "whole"],
        ],
      },
    ];
    var bar = document.getElementById("kz-bar");
    function nextOpt(g, v) {
      var i = g.opts
        .map(function (x) {
          return x[0];
        })
        .indexOf(v);
      return g.opts[(i + 1) % g.opts.length];
    }

    QG.forEach(function (g) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "kz-qb";
      b.id = "kz-q-" + g.key;
      b.onclick = function () {
        if (!b.disabled) edit(g.key, nextOpt(g, draft[g.key])[0]);
      };
      bar.appendChild(b);
    });
    var ctl = document.getElementById("kz-ctl");
    function grp(key, label) {
      var d = document.createElement("section");
      d.className = "kz-g";
      d.innerHTML = '<div class="kz-gh"><span>' + label + '</span><b data-kz="' + key + '"></b></div>';
      ctl.appendChild(d);
      return d;
    }
    var cw = document.createElement("div");
    cw.className = "kz-sw";
    grp("color", "Colour").appendChild(cw);
    COLORS.forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "kz-s";
      b.dataset.v = c.id;
      b.setAttribute("aria-label", c.name);
      b.title = c.name;
      b.onclick = function () {
        edit("color", c.id);
      };
      cw.appendChild(b);
    });
    var bw = document.createElement("div");
    bw.className = "kz-sw kz-bgw";
    grp("bg", "Background").appendChild(bw);
    BGS.forEach(function (x) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "kz-s kz-bgs";
      b.dataset.v = x[0];
      b.setAttribute("aria-label", x[1]);
      b.title = x[1];
      b.onclick = function () {
        edit("bg", x[0]);
      };
      bw.appendChild(b);
    });
    function tiles(key, label) {
      var r = document.createElement("div");
      r.className = "kz-row";
      grp(key, label).appendChild(r);
      OPTS[key].forEach(function (o) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "kz-t grey";
        b.dataset.k = key;
        b.dataset.v = o[0];
        b.setAttribute("aria-label", o[1]);
        b.title = o[1];
        b.onclick = function () {
          edit(key, o[0]);
        };
        r.appendChild(b);
      });
    }
    tiles("pattern", "Fill pattern");
    tiles("road", "Route");

    function paintAll() {
      var th = appTheme(),
        m = matchPreset(),
        nm = m ? m.name : "Custom";
      document.getElementById("kz-pv").innerHTML = svgFor(cur, "light") + svgFor(cur, "dark");
      if (selEl) selEl.textContent = nm;
      pr.querySelectorAll(".kz-t").forEach(function (b) {
        b.setAttribute("aria-pressed", String(!!m && m.id === b.dataset.p));
      });
      if (ks.hidden || !draft) return;
      var D = draft,
        ap = document.getElementById("kz-apply"),
        same = sameAsCur();
      ap.classList.toggle("done", same);
      ap.setAttribute("aria-disabled", String(same));
      ap.innerHTML = same
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>Applied'
        : "Apply";
      document.getElementById("kz-stage").innerHTML = svgFor(D, "light") + svgFor(D, "dark");
      var glb = D.map === "on";
      QG.forEach(function (g) {
        var b = document.getElementById("kz-q-" + g.key),
          off = g.key === "mk" && glb;
        var o = off
            ? g.opts[1]
            : g.opts.filter(function (x) {
                return x[0] === D[g.key];
              })[0] || g.opts[0],
          nx = nextOpt(g, o[0]);
        b.disabled = off;
        b.setAttribute(
          "aria-label",
          g.label + ": " + o[1] + (off ? " (globe has no marker)" : ". Tap for " + nx[1]),
        );
        b.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          I[o[2]]
            .replace(/id="(\w+)"/g, 'id="$1' + g.key + '"')
            .replace(/url\(#(\w+)\)/g, "url(#$1" + g.key + ")") +
          '</svg><span class="qt"><span class="qc">' +
          g.label +
          '</span><span class="qv">' +
          o[1] +
          '</span></span><span class="qd" aria-hidden="true">' +
          g.opts
            .map(function (x) {
              return "<i" + (x === o ? ' class="on"' : "") + "></i>";
            })
            .join("") +
          "</span>";
      });
      bw.querySelectorAll(".kz-s").forEach(function (b) {
        var c =
          COLORS.filter(function (x) {
            return x.id === D.color;
          })[0] || COLORS[0];
        b.style.background = "none";
        b.innerHTML = bgSwatch(b.dataset.v, c);
        b.setAttribute("aria-pressed", String(D.bg === b.dataset.v));
      });
      cw.querySelectorAll(".kz-s").forEach(function (b) {
        var c = COLORS.filter(function (x) {
          return x.id === b.dataset.v;
        })[0];
        b.style.background = th === "dark" ? c.light : c.accent || c.deep;
        b.setAttribute("aria-pressed", String(D.color === c.id));
      });
      ctl.querySelectorAll(".kz-t").forEach(function (b) {
        var k = b.dataset.k,
          v = b.dataset.v,
          p = {};
        KEYS.forEach(function (x) {
          p[x] = D[x];
        });
        p[k] = v;
        if (k === "pattern") {
          p.road = "none";
          p.mk = "none";
        }
        b.innerHTML = svgFor(p, th);
        b.setAttribute("aria-pressed", String(D[k] === v));
      });
      ctl.querySelectorAll("[data-kz]").forEach(function (el) {
        var k = el.dataset.kz;
        el.textContent = k === "color" ? colName(D.color) : optName(k, D[k]);
      });
    }
    new MutationObserver(function () {
      applyIcon();
      paintAll();
    }).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "data-skin", "class", "style"],
    });
    /* the old icon picker also writes this label; keep it showing the Kosway preset name */
    if (selEl)
      new MutationObserver(function () {
        var m = matchPreset(),
          nm = m ? m.name : "Custom";
        if (selEl.textContent !== nm) selEl.textContent = nm;
      }).observe(selEl, { childList: true, characterData: true, subtree: true });
    applyIcon();
    paintAll();
  })();
} catch (err) {
  console.error("[Kosway] part failed:", "App icon maker. Builds the home-screen icon from the chosen ", err);
}
