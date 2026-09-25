(() => {
  function H(e) {
    typeof e == "string" && (e = e.replace(",", "."));
    let t = parseFloat(e);
    if (isNaN(t)) return e;
    let o = t.toFixed(2).replace(".", ",");
    return o.endsWith(",00")
      ? o.substring(0, o.length - 3)
      : o.includes(",") && o.endsWith("0")
        ? o.substring(0, o.length - 1)
        : o;
  }
  function V() {
    let e = document.querySelector(".mobile-menu-btn"),
      t = document.querySelector(".nav-center");
    !e ||
      !t ||
      (e.addEventListener("click", () => {
        (t.classList.toggle("active"), e.classList.toggle("open"));
      }),
      document.querySelectorAll(".nav-center a").forEach((o) => {
        o.addEventListener("click", (ev) => {
          // Check if this link goes to contact.html — intercept and open modal instead
          const href = o.getAttribute("href") || "";
          if (href.includes("contact.html") && !href.includes("#")) {
            const cm = document.getElementById("contact-modal");
            if (cm) {
              ev.preventDefault();
              t.classList.remove("active");
              e.classList.remove("open");
              if (typeof window._tl_openModal === "function") {
                window._tl_openModal(cm, "contact-modal");
              } else {
                cm.classList.add("active");
                void 0;
              }
              return;
            }
          }
          (t.classList.remove("active"), e.classList.remove("open"));
        });
      }));
  }
  function G() {
    let e = document.querySelector(".navbar");
    if (!e) return;
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          e.style.boxShadow =
            window.scrollY > 50 ? "0 4px 20px rgba(0,0,0,0.05)" : "none";
          ticking = false;
        });
        ticking = true;
      }
    });
  }
  function K() {
    let e = document.getElementById("notification-btn"),
      t = document.getElementById("notification-panel");
    !e ||
      !t ||
      (e.addEventListener("click", (o) => {
        (o.stopPropagation(), t.classList.toggle("show"));
      }),
      document.addEventListener("click", (o) => {
        t.contains(o.target) || t.classList.remove("show");
      }));
  }
  function Z() {
    let e = document.getElementById("lightbox"),
      t = document.getElementById("lightbox-img"),
      o = document.querySelector(".lightbox-close");
    if (!e) return;
    document.addEventListener("click", (r) => {
      let n = r.target.closest(".lightbox-trigger");
      if (!n) return;
      (r.preventDefault(),
        (e.style.display = "flex"),
        requestAnimationFrame(() => {
          e.classList.add("show");
        }));
      let d =
          n.src ||
          n.currentSrc ||
          (n.querySelector("source")
            ? n.querySelector("source").getAttribute("data-src") ||
              n.querySelector("source").src
            : ""),
        s = e.querySelector("video");
      d.endsWith(".mp4") || n.tagName.toLowerCase() === "video"
        ? (t && (t.style.display = "none"),
          s ||
            ((s = document.createElement("video")),
            Object.assign(s.style, {
              maxWidth: "90%",
              maxHeight: "80vh",
              borderRadius: "8px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
            }),
            (s.controls = !0),
            (s.autoplay = !0),
            (s.className = "lightbox-video"),
            e.appendChild(s)),
          (s.style.display = "block"),
          (s.src = d),
          s.play())
        : (s && ((s.style.display = "none"), s.pause()),
          t && ((t.style.display = "block"), (t.src = d)));
    });
    let i = () => {
      e.classList.remove("show");
      let r = e.querySelector("video");
      (r && r.pause(),
        setTimeout(() => {
          e.style.display = "none";
        }, 300));
    };
    return (
      o && o.addEventListener("click", i),
      e.addEventListener("click", (r) => {
        (r.target === e || r.target === o) && i();
      }),
      document.addEventListener("keydown", (r) => {
        r.key === "Escape" && e.classList.contains("show") && i();
      }),
      e
    );
  }
  function ee() {
    if (!("IntersectionObserver" in window)) return;
    let e = new IntersectionObserver(
      (t, o) => {
        t.forEach((i) => {
          if (!i.isIntersecting) return;
          let r = i.target,
            n = r.querySelector("source[data-src]");
          (n &&
            ((n.src = n.dataset.src),
            r.load(),
            r.play().catch(() => {}),
            n.removeAttribute("data-src")),
            o.unobserve(r));
        });
      },
      { rootMargin: "0px 0px 200px 0px" },
    );
    document.querySelectorAll("video").forEach((t) => {
      t.querySelector("source[data-src]") && e.observe(t);
    });
  }
  var O = {
    state: { items: [] },
    init() {
      let e = localStorage.getItem("hdm_cart");
      if (e)
        try {
          this.state.items = JSON.parse(e);
        } catch {}
      let t = document.querySelector(".floating-cart-bar");
      (t &&
        ((t.style.cursor = "pointer"),
        t.addEventListener("click", () => {
          let o = window.location.pathname.includes("/pages/");
          window.location.href = o ? "cart.html" : "pages/cart.html";
        })),
        this.updateUI());
    },
    save() {
      (localStorage.setItem("hdm_cart", JSON.stringify(this.state.items)),
        this.updateUI(),
        window.renderCartPage && window.renderCartPage());
    },
    addItem(e) {
      let t = this.state.items.find(
        (o) =>
          o.title === e.title &&
          o.size === e.size &&
          o.addonsTotal === e.addonsTotal &&
          JSON.stringify(o.extras || []) === JSON.stringify(e.extras || []),
      );
      (t ? (t.qty += e.qty) : this.state.items.push(e), this.save());
    },
    updateItemQty(e, t) {
      t < 1 ||
        (this.state.items[e] && ((this.state.items[e].qty = t), this.save()));
    },
    removeItem(e) {
      (this.state.items.splice(e, 1), this.save());
    },
    getTotalItems() {
      return this.state.items.reduce((e, t) => e + t.qty, 0);
    },
    getSubtotal() {
      return this.state.items.reduce(
        (e, t) => e + (t.basePrice + (t.addonsTotal || 0)) * t.qty,
        0,
      );
    },
    updateUI() {
      let e = window.matchMedia('(max-width: 768px)').matches ? 768 : 1024,
        t = this.getTotalItems(),
        o = this.getSubtotal(),
        i = `Rs ${H(o)}`;
      document.querySelectorAll('a[href*="cart.html"] .badge').forEach((y) => {
        ((y.textContent = t), (y.style.display = t > 0 ? "flex" : "none"));
      });
      let r = document.querySelector(".floating-cart-bar"),
        n = document.querySelector(".chatbot-widget");
      if (r)
        if (
          t > 0 &&
          !window.location.pathname.includes("cart.html") &&
          !window.location.pathname.includes("checkout.html")
        ) {
          ((r.style.display = "flex"),
            document.documentElement.style.setProperty(
              "--cart-offset",
              "75px",
            ));
          let y = r.querySelector(".cart-count"),
            l = r.querySelector(".cart-total");
          (y && (y.textContent = `${t} item${t > 1 ? "s" : ""}`),
            l && (l.textContent = i),
            n && e <= 768 && (n.style.bottom = "152px"));
        } else
          ((r.style.display = "none"),
            document.documentElement.style.setProperty("--cart-offset", "0px"),
            n && e <= 768 && (n.style.bottom = "84px"));
      let d = (JSON.parse(localStorage.getItem("hdm_orders")) || []).filter(
        (y) => y.status !== "DELIVERED" && y.status !== "CANCELLED",
      ).length;
      document.querySelectorAll('a[href*="orders.html"]').forEach((y) => {
        if (y.closest(".mobile-tab-bar")) {
          let l = y.querySelector(".orders-badge");
          (l ||
            ((l = document.createElement("span")),
            (l.className = "badge orders-badge"),
            (l.style.position = "absolute"),
            (l.style.top = "0"),
            (l.style.right = "10px"),
            (l.style.backgroundColor =
              "var(--clr-badge-danger, var(--clr-primary))"),
            (l.style.color = "white"),
            (l.style.borderRadius = "50%"),
            (l.style.width = "18px"),
            (l.style.height = "18px"),
            (l.style.fontSize = "0.7rem"),
            (l.style.display = "flex"),
            (l.style.alignItems = "center"),
            (l.style.justifyContent = "center"),
            (y.style.position = "relative"),
            y.appendChild(l)),
            (l.textContent = d),
            (l.style.display = d > 0 ? "flex" : "none"));
        }
      });
      let s = document.getElementById("desktop-floating-orders");
      s && s.remove();
    },
  };
  function te() {
    let e = window.location.pathname.includes("cart.html"),
      t = window.location.pathname.includes("checkout.html");
    (!e && !t) ||
      ((window.renderCartPage = function () {
        let o = O.state.items,
          i = document.querySelector(".empty-cart-state"),
          r = document.querySelector(".checkout-summary-box"),
          n = document.querySelector(".cart-items-wrapper");
        if (o.length === 0) {
          if (
            (n && (n.style.display = "none"),
            r && (r.style.display = "none"),
            i && (i.style.display = "block"),
            t && !window.isOrdering)
          ) {
            (alert("Your cart is empty. Redirecting to menu."),
              (window.location.href = "menu.html"));
            return;
          }
        } else
          (n && (n.style.display = "block"),
            r && (r.style.display = "flex"),
            i && (i.style.display = "none"));
        n &&
          ((n.innerHTML = ""),
          o.forEach((u, E) => {
            let b = (u.basePrice + (u.addonsTotal || 0)) * u.qty;
            n.insertAdjacentHTML(
              "beforeend",
              `
                <div class="cart-item">
                    <img loading="lazy" src="${u.image}" class="cart-item-img lightbox-trigger" alt="${u.title}">
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${u.title}</h4>
                        ${u.size ? `<p style="font-size:0.85rem;color:#666;margin-bottom:0.1rem;font-weight:500;">Size/Litre: ${u.size}</p>` : ""}
                        ${u.extras && u.extras.length > 0 ? `<p style="font-size:0.8rem;color:#888;margin-bottom:0.2rem;">+ ${u.extras.join(", ")}</p>` : u.addonsTotal > 0 ? `<p style="font-size:0.8rem;color:#888;margin-bottom:0.2rem;">+ Add-ons (Rs ${H(u.addonsTotal)})</p>` : ""}
                        <span class="cart-item-price">Rs ${H(b)}</span>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-stepper">
                            <button class="stepper-btn" onclick="window.CartManager.updateItemQty(${E}, ${u.qty - 1})">-</button>
                            <span class="stepper-value">${u.qty}</span>
                            <button class="stepper-btn" onclick="window.CartManager.updateItemQty(${E}, ${u.qty + 1})">+</button>
                        </div>
                        <button class="cart-remove-btn" onclick="window.CartManager.removeItem(${E})" aria-label="Remove">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                </div>
            `,
            );
          }));
        let d = O.getSubtotal(),
          s = 12,
          y = document.querySelector(".subtotal-val"),
          l = document.querySelector(".total-val");
        (y && (y.textContent = `Rs ${H(d)}`),
          l && (l.textContent = `Rs ${H(d + s)}`));
        let h = document.querySelectorAll('input[name="payment_method"]'),
          v = document.getElementById("payment-instructions");
        if (h.length > 0 && v) {
          let u = {
              "Cash on Delivery":
                "Please keep the exact change ready at the time of delivery.",
              Easypaisa:
                "Transfer the total amount to Easypaisa account: +92 3002442483. Include your order ID in the reference.",
              JazzCash:
                "Transfer the total amount to JazzCash account: +92 3002442483. Include your order ID in the reference.",
              Wallet:
                "Your order total will be seamlessly deducted from your available Wallet balance.",
            },
            E = () => {
              let b = document.querySelector(
                'input[name="payment_method"]:checked',
              );
              if (b && u[b.value]) {
                let a = u[b.value];
                if (b.value === "Wallet") {
                  let m = window.userWalletBalance || 2500;
                  a += ` You currently have Rs ${m.toLocaleString()} available in your wallet.`;
                }
                ((v.innerHTML = `<strong>${b.value} Instructions:</strong><br>${a}`),
                  (v.style.display = "block"));
              } else v.style.display = "none";
            };
          (h.forEach((b) => {
            (b.addEventListener("change", E), b.addEventListener("click", E));
          }),
            E());
        }
      }),
      window.renderCartPage());
  }
  function re() {
    let e = document.querySelector(".chatbot-toggle"),
      t = document.querySelector(".chatbot-container"),
      o = document.querySelector(".chatbot-close"),
      i = document.getElementById("chat-input-field"),
      r = document.getElementById("chat-send-btn"),
      n = document.querySelector(".chatbot-messages"),
      d = document.getElementById("chatbot-backdrop");
    if (!e || !t) return;
    let s = !1,
      y = e.querySelector("svg");
    if ((y && y.classList.add("icon-chat"), !e.querySelector(".icon-close"))) {
      let a = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      (a.setAttribute("class", "icon-close"),
        a.setAttribute("viewBox", "0 0 24 24"),
        a.setAttribute("width", "26"),
        a.setAttribute("height", "26"),
        a.setAttribute("stroke", "currentColor"),
        a.setAttribute("stroke-width", "2"),
        a.setAttribute("fill", "none"),
        a.setAttribute("stroke-linecap", "round"),
        a.setAttribute("stroke-linejoin", "round"),
        (a.innerHTML =
          '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>'),
        e.appendChild(a));
    }
    let l = () => {
      t.classList.contains("show")
        ? (t.classList.remove("show"),
          e.classList.remove("active"),
          d && d.classList.remove("show"),
          i && i.blur(),
          (void 0),
          history.state && history.state.chatbotOpen && history.back())
        : (t.classList.add("show"),
          e.classList.add("active"),
          d && d.classList.add("show"),
          window.matchMedia('(max-width: 768px)').matches &&
            ((void 0),
            history.pushState({ chatbotOpen: !0 }, "")));
    };
    (window.addEventListener("popstate", (a) => {
      t.classList.contains("show") &&
        (!a.state || !a.state.chatbotOpen) &&
        (t.classList.remove("show"),
        e.classList.remove("active"),
        d && d.classList.remove("show"),
        (void 0));
    }),
      e.addEventListener("click", l),
      o && o.addEventListener("click", l),
      d && d.addEventListener("click", l));
    let h = (a, m) => {
        let p = document.createElement("div");
        ((p.className = `chat-message ${m}`),
          (p.innerHTML = `<div class="msg-content">${a}</div>`),
          n.appendChild(p),
          (n.scrollTop = n.scrollHeight));
      },
      v = () => {
        ((s = !0), r && (r.disabled = !0));
        let a = document.createElement("div");
        ((a.className = "chat-message bot typing-indicator"),
          (a.innerHTML =
            '<div class="msg-content"><div class="typing-bubble"><span></span><span></span><span></span></div></div>'),
          n.appendChild(a),
          (n.scrollTop = n.scrollHeight));
      },
      u = () => {
        ((s = !1), r && (r.disabled = !1));
        let a = n.querySelector(".typing-indicator");
        a && a.remove();
      },
      E = () => {
        if (s) return;
        let a = i?.value.trim();
        a &&
          (h(a, "user"),
          (i.value = ""),
          r && (r.disabled = !0),
          v(),
          setTimeout(() => {
            (u(),
              h(
                "Sorry, I am a demo chatbot. I will be fully functional after integration.",
                "bot",
              ));
          }, 1500));
      };
    (r && (r.addEventListener("click", E), (r.disabled = !0)),
      i &&
        (i.addEventListener("keypress", (a) => {
          a.key === "Enter" && E();
        }),
        i.addEventListener("input", () => {
          r && (r.disabled = i.value.trim().length === 0 || s);
        })),
      document.querySelectorAll(".chat-suggestion-btn").forEach((a) => {
        a.addEventListener("click", () => {
          if (s) return;
          let p = a.textContent;
          (h(p, "user"),
            v(),
            setTimeout(() => {
              u();
              let c = "Sorry, I didn't understand that.";
              (p.includes("Menu")
                ? (c =
                    "You can view our complete menu by <a href='menu.html' style='color:var(--clr-primary);text-decoration:underline;'>clicking here</a>.")
                : p.includes("located")
                  ? (c =
                      "We are located at 58 Main Shadman Market Rd, Shadman 1, Lahore, 58 Main Shadman Market Rd, Shadman 1, Lahore, 58 Main Shadman Market Rd, Shadman 1, Lahore, 58 Main Shadman Market Rd, Shadman 1, Lahore, 58 Main Shadman Market Rd, Shadman 1, Lahore. Come visit us!")
                  : p.includes("Contact")
                    ? (c =
                        "You can reach us at +92 3002442483 or email us at info@bigbites.com.")
                    : p.includes("Hours")
                      ? (c =
                          "We are open Monday to Sunday from 10:00 AM to 12:00 AM.")
                      : p.includes("Reservation") &&
                        (c =
                          "You can easily make a reservation by visiting our <a href='reservations.html' style='color:var(--clr-primary);text-decoration:underline;'>Reservations page</a>."),
                h(c, "bot"));
            }, 1e3));
        });
        let m = document.getElementById("mobile-search-tab");
        (m &&
          m.addEventListener("click", (p) => {
            p.preventDefault();
            let c = document.querySelector(".header-desktop-search"),
              B = document.getElementById("desktop-search-input");
            c &&
              B &&
              (c.classList.add("mobile-force-show"),
              setTimeout(() => B.focus(), 50));
          }),
          document.addEventListener("click", (p) => {
            let c = document.querySelector(".header-desktop-search");
            if (c && c.classList.contains("mobile-force-show")) {
              let B = p.target.closest(".search-close-icon"),
                $ = p.target.closest("#mobile-search-fab");
              if (
                (!c.contains(p.target) &&
                  (!m || !m.contains(p.target)) &&
                  !$) ||
                B
              ) {
                c.classList.remove("mobile-force-show");
                let A = document.getElementById("desktop-search-input");
                A &&
                  ((A.value = ""),
                  A.dispatchEvent(new Event("input")),
                  A.blur());
              }
            }
          }));
      }));
  }
  function ce() {
    let e = document.getElementById("hero-carousel-track"),
      t = document.getElementById("hero-carousel-container");
    if (!e) return;
    let o = e.querySelectorAll(".hero-full-img, img");
    o.length === 1 &&
      (e.appendChild(o[0].cloneNode(!0)), e.appendChild(o[0].cloneNode(!0)));
    let i = document.querySelectorAll("#hero-indicators .indicator");
    if (!i.length) return;
    let r = i.length,
      n = 0,
      d,
      s = !1,
      y = 0,
      l = !1,
      h = !1,
      v = () => {
        i.forEach((m, p) => {
          let c = p === n;
          (m.classList.toggle("active", c),
            (m.style.opacity = c ? "1" : "0.5"));
        });
      },
      u = () => {
        h ||
          ((h = !0),
          (e.style.transition = "transform 0.5s ease-in-out"),
          (e.style.transform = "translateX(-33.3333%)"),
          setTimeout(() => {
            ((e.style.transition = "none"),
              e.appendChild(e.firstElementChild),
              (e.style.transform = "translateX(0)"),
              (n = (n + 1) % r),
              v(),
              (h = !1));
          }, 500));
      },
      E = () => {
        h ||
          ((h = !0),
          (e.style.transition = "none"),
          e.insertBefore(e.lastElementChild, e.firstElementChild),
          (e.style.transform = "translateX(-33.3333%)"),
          requestAnimationFrame(() => {
            ((e.style.transition = "transform 0.5s ease-in-out"),
              (e.style.transform = "translateX(0)"));
          }),
          setTimeout(() => {
            ((n = (n - 1 + r) % r), v(), (h = !1));
          }, 500));
      },
      b = () => {
        (clearInterval(d), (d = setInterval(u, 3500)));
      },
      a = () => clearInterval(d);
    if (
      (i.forEach((m, p) => {
        m.addEventListener("click", (c) => {
          (c.stopPropagation(), p !== n && u(), b());
        });
      }),
      t)
    ) {
      t.addEventListener("click", (c) => {
        if (l) {
          l = !1;
          return;
        }
        c.target.closest("#hero-indicators") ||
          c.target.closest(".hero-order-btn") ||
          (u(), b());
      });
      let m = (c) => {
          ((s = !0),
            (l = !1),
            (y = c.type.includes("touch") ? c.touches[0].clientX : c.pageX),
            a());
        },
        p = (c) => {
          if (!s) return;
          s = !1;
          let B =
            (c.type.includes("touch")
              ? (c.changedTouches[0]?.clientX ?? y)
              : c.pageX) - y;
          (Math.abs(B) > 40 && ((l = !0), B < 0 ? u() : E()), b());
        };
      (t.addEventListener("mousedown", m),
        t.addEventListener("touchstart", m, { passive: !0 }),
        t.addEventListener("mouseup", p),
        t.addEventListener("touchend", p, { passive: !0 }),
        t.addEventListener("mouseleave", (c) => {
          s && p(c);
        }));
    }
    (e
      .querySelectorAll("img")
      .forEach((m) =>
        m.addEventListener("dragstart", (p) => p.preventDefault()),
      ),
      b());
  }
  function oe() {
    let e = document.getElementById("category-sticky-wrapper");
    if (!e) return;
    let t = document.querySelector(".navbar"),
      o = t ? t.offsetHeight : 60;
    e.style.top = o + "px";
    let i = document.createElement("div");
    ((i.style.cssText = "height:1px;pointer-events:none;position:relative;"),
      e.parentElement.insertBefore(i, e),
      new IntersectionObserver(
        ([s]) => e.classList.toggle("is-sticky", !s.isIntersecting),
        { rootMargin: `-${o}px 0px 0px 0px`, threshold: 0 },
      ).observe(i));
    let r = e.querySelectorAll(".category-circle-btn");
    r.forEach((s) => {
      s.addEventListener("click", () => {
        (r.forEach((y) => y.classList.remove("active")),
          s.classList.add("active"));
      });
    });
    let n = document.querySelectorAll(
        '[id="combos"],[id="burgers"],[id="pizzas"],[id="rolls"],[id="fries"],[id="drinks"]',
      ),
      d = new IntersectionObserver(
        (s) => {
          s.forEach((y) => {
            if (y.isIntersecting) {
              let l = y.target.id;
              r.forEach((h) => {
                let v = h.getAttribute("href") === `#${l}`;
                if (
                  (h.classList.toggle("active", v),
                  v && window.matchMedia('(max-width: 768px)').matches)
                ) {
                  let u = e.querySelector(".category-circles-wrapper");
                  if (u) {
                    let E = h.offsetLeft,
                      b = h.clientWidth,
                      a = u.clientWidth;
                    requestAnimationFrame(() => {
                      u.scrollTo({
                        left: E - a / 2 + b / 2,
                        behavior: "smooth",
                      });
                    });
                  }
                }
              });
            }
          });
        },
        { rootMargin: `-${o + 80}px 0px -60% 0px`, threshold: 0 },
      );
    n.forEach((s) => {
      s && d.observe(s);
    });
  }
  function ne() {
    let e = document.getElementById("desktop-search-input"),
      t = document.getElementById("menu-filter-clear");
    if (!e) return;
    let o = document.querySelectorAll(".product-card"),
      i = document.getElementById("menu-no-results");
    if (!i) {
      ((i = document.createElement("div")),
        (i.id = "menu-no-results"),
        (i.style.cssText =
          "display:none;text-align:center;padding:3rem 1rem;color:#999;"),
        (i.innerHTML =
          '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ddd" stroke-width="2" style="margin-bottom:1rem;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg><p style="font-size:1.15rem;font-weight:700;margin:0 0 0.4rem;color:var(--clr-text-primary);">No dishes found</p><p style="font-size:0.85rem;margin:0;">Try a different search term</p>'));
      let d =
        document.getElementById("cardapio") ||
        document.getElementById("menu-section");
      d && d.querySelector(".container").appendChild(i);
    }
    let r =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>',
      n =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    (t &&
      t.addEventListener("click", () => {
        e.value.length > 0 &&
          ((e.value = ""), e.dispatchEvent(new Event("input")));
      }),
      e.addEventListener("input", (d) => {
        let s = d.target.value.toLowerCase().trim();
        if (
          (t &&
            ((t.innerHTML = s.length > 0 ? n : r),
            (t.style.color =
              s.length > 0 ? "var(--clr-primary)" : "var(--clr-text-primary)")),
          !s)
        ) {
          (document.body.classList.remove("search-active"),
            o.forEach((l) => {
              l.style.display = "";
            }),
            document.querySelectorAll(".menu-grid").forEach((l) => {
              let h = l.previousElementSibling;
              (h &&
                (h.tagName === "H3" || h.querySelector("h3") || h.id) &&
                (h.style.display = "flex"),
                (l.style.display = ""));
            }),
            i && (i.style.display = "none"));
          return;
        }
        let y = !1;
        (o.forEach((l) => {
          let h = l.querySelector("h3")?.textContent.toLowerCase() || "",
            v = l.querySelector(".card-desc")?.textContent.toLowerCase() || "",
            u = h.includes(s) || v.includes(s);
          ((l.style.display = u ? "" : "none"), u && (y = !0));
        }),
          document.querySelectorAll(".menu-grid").forEach((l) => {
            let h = Array.from(l.querySelectorAll(".product-card")).some(
                (u) => u.style.display !== "none",
              ),
              v = l.previousElementSibling;
            (v &&
              (v.tagName === "H3" || v.querySelector("h3") || v.id) &&
              (v.style.display = h ? "flex" : "none"),
              (l.style.display = h ? "" : "none"));
          }),
          i && (i.style.display = y ? "none" : "block"));
      }));
  }
  function _(e, t) {
    (e.classList.add("active"),
      window.matchMedia('(max-width: 768px)').matches && (void 0),
      history.pushState({ modalOpen: t }, ""));
    let o = (i) => {
      (!i.state || i.state.modalOpen !== t) &&
        (e.classList.remove("active"),
        window.matchMedia('(max-width: 768px)').matches && (void 0),
        window.removeEventListener("popstate", o),
        delete e._popStateListener);
    };
    (window.addEventListener("popstate", o), (e._popStateListener = o));
  }
  function R(e) {
    e.classList.contains("active") &&
      (e.classList.remove("active"),
      window.matchMedia('(max-width: 768px)').matches && (void 0),
      e._popStateListener &&
        (window.removeEventListener("popstate", e._popStateListener),
        delete e._popStateListener,
        history.state && history.state.modalOpen && history.back()));
  }
  ((window._tl_openModal = _), (window._tl_closeModal = R));
  function le(e, t) {
    let o = document.getElementById("contact-modal"),
      i = document.getElementById("contact-modal-close");
    o &&
      (document.querySelectorAll(".contact-header-btn").forEach((f) => {
        f.addEventListener("click", (g) => {
          (g.preventDefault(), _(o, "contact-modal"));
        });
      }),
      i && i.addEventListener("click", () => R(o)));
    let r = document.getElementById("item-modal");
    if (!r) return;
    let n = document.getElementById("modal-item-img"),
      d = document.getElementById("modal-item-category"),
      s = document.getElementById("modal-item-name"),
      y = document.getElementById("modal-item-desc"),
      l = document.getElementById("modal-item-price"),
      h = document.getElementById("modal-add-total"),
      v = document.getElementById("modal-qty-val"),
      u = document.getElementById("modal-qty-minus"),
      E = document.getElementById("modal-qty-plus"),
      b = document.getElementById("modal-addons-wrap"),
      a = document.getElementById("modal-addon-options"),
      m = document.getElementById("modal-sizes-wrap"),
      p = document.getElementById("modal-size-options"),
      c = document.getElementById("modal-add-to-cart"),
      B = 0,
      $ = 1,
      A = 0,
      j = 0,
      P = () => {
        h.textContent = `Rs ${H((B + j + A) * $)}`;
      };
    ((window.openItemModalWithData = function (f, g) {
      let x = f ? f.querySelector(".card-image img") : null,
        L = f ? f.querySelector("h3") : null,
        w = f ? f.querySelector(".card-desc") : null,
        z = f ? f.querySelector(".price") : null,
        F = f ? f.querySelector(".original-price") : null,
        T = "Menu Item",
        X = f ? f.closest(".menu-grid") : null;
      if (X) {
        if (window.location.pathname.includes("offers.html")) T = "Offer";
        else if (X.previousElementSibling) {
          let M = X.previousElementSibling.querySelector("h3, h2");
          M && (T = M.textContent.trim());
        }
      } else g && g.category && (T = g.category);
      if (f && f.dataset.category) T = f.dataset.category;
      let U = L ? L.textContent : g ? g.name : "",
        Y = x ? x.src : g ? g.img : "",
        Q = w ? w.innerHTML : g ? g.desc : "";
      (Y && (n.src = Y),
        U && (s.textContent = U),
        (y.innerHTML = Q),
        (d.textContent = T));
      let J = document.getElementById("modal-original-price");
      J &&
        (F
          ? ((J.textContent = F.textContent), (J.style.display = "inline"))
          : (J.style.display = "none"));
      let D = 0;
      z
        ? (D =
            parseFloat(
              z.textContent.replace(/[^\d.,]/g, "").replace(",", "."),
            ) || 0)
        : g &&
          g.price &&
          (D =
            parseFloat(
              g.price
                .toString()
                .replace(/[^\d.,]/g, "")
                .replace(",", "."),
            ) || 0);
      let S = null,
        q = null;
      if (
        window.Store &&
        window.Store.state &&
        window.Store.state.products &&
        ((S = window.Store.state.products.find((M) => M.name === U.trim())), S)
      ) {
        if (
          ((q = window.Store.state.categories.find(
            (I) => I.id === S.categoryId,
          )),
          (D = S.price),
          x || Y)
        ) {
          let I = S.image || S.img || Y;
          (window.location.pathname.includes("/pages/") ||
            (I = I.replace("../", "./")),
            (n.src = I));
        }
        (y && (y.textContent = S.desc || Q),
          d && (d.textContent = q ? q.name : T));
        let M = document.getElementById("modal-item-status"),
          k = document.getElementById("modal-item-prep");
        (M &&
          ((M.textContent = S.status || "Available"),
          (M.style.backgroundColor =
            S.status === "Available" ? "#e8f5e9" : "#ffebee"),
          (M.style.color = S.status === "Available" ? "#2e7d32" : "#c62828")),
          k &&
            (k.textContent = S.prepTime
              ? "Prep: " + S.prepTime
              : "Prep: 15-20 mins"));
      } else if (window.BIGBITES_MENU) {
        let menuS = window.BIGBITES_MENU.find(
          (M) => M.name.toLowerCase() === U.trim().toLowerCase(),
        );
        if (menuS) {
          T = menuS.category || T;
          d && (d.textContent = T);
        }
      }
      if (
        (l && (l.textContent = "Rs " + H(D)),
        (B = D),
        ($ = 1),
        (A = 0),
        (j = 0),
        v && (v.textContent = 1),
        m && p)
      ) {
        p.innerHTML = "";
        let k = (q ? q.name : T).toLowerCase();
        if (S && q)
          q.name === "Pizzas"
            ? ((m.style.display = "block"),
              (p.innerHTML = `
                        <div class="addon-chip selected" data-size-price="0">Small</div>
                        <div class="addon-chip" data-size-price="250">Regular</div>
                        <div class="addon-chip" data-size-price="500">Large</div>
                    `))
            : q.name === "Drinks"
              ? ((m.style.display = "block"),
                (p.innerHTML = `
                        <div class="addon-chip selected" data-size-price="0">Regular</div>
                        <div class="addon-chip" data-size-price="100">1 Liter</div>
                        <div class="addon-chip" data-size-price="150">1.5 Liters</div>
                    `))
              : (m.style.display = "none");
        else if (k.includes("pizza") || k.includes("drink")) {
          m.style.display = "block";
          let I = k.includes("pizza") ? -150 : -30,
            N = k.includes("pizza") ? 250 : 50,
            ae = k.includes("drink") ? "Regular" : "Small",
            se = k.includes("drink") ? "Large" : "Medium",
            de = k.includes("drink") ? "1 Liter" : "Large";
          p.innerHTML = `
                            <div class="addon-chip" data-size-price="${I}">${ae}</div>
                            <div class="addon-chip selected" data-size-price="0">${se}</div>
                            <div class="addon-chip" data-size-price="${N}">${de}</div>
                        `;
        } else m.style.display = "none";
        p.querySelectorAll(".addon-chip").forEach((I) => {
          I.addEventListener("click", () => {
            (p
              .querySelectorAll(".addon-chip")
              .forEach((N) => N.classList.remove("selected")),
              I.classList.add("selected"),
              (j = parseFloat(I.getAttribute("data-size-price"))),
              P());
          });
        });
      }
      if (a && b) {
        a.innerHTML = "";
        let k = (q ? q.name : T).toLowerCase();
        (S && q
          ? q.name === "Pizzas"
            ? ((b.style.display = "block"),
              (a.innerHTML =
                '<div class="addon-chip" data-price="150">+ Extra Cheese (Rs 150)</div>'))
            : q.name === "Burgers" || q.name === "Fries" || q.name === "Rolls"
              ? ((b.style.display = "block"),
                (a.innerHTML =
                  '<div class="addon-chip" data-price="300">+ Make it a Meal (Rs 300)</div>'))
              : (b.style.display = "none")
          : k.includes("burger") ||
              k.includes("sandwich") ||
              k.includes("fries") ||
              k.includes("rolls")
            ? ((b.style.display = "block"),
              (a.innerHTML =
                '<div class="addon-chip" data-price="300">+ Make it a Meal (Rs 300)</div>'))
            : k.includes("pizza")
              ? ((b.style.display = "block"),
                (a.innerHTML =
                  '<div class="addon-chip" data-price="150">+ Extra Cheese (Rs 150)</div>'))
              : (b.style.display = "none"),
          a.querySelectorAll(".addon-chip").forEach((I) => {
            I.addEventListener("click", () => {
              I.classList.toggle("selected");
              let N = parseFloat(I.getAttribute("data-price"));
              ((A += I.classList.contains("selected") ? N : -N), P());
            });
          }));
      }
      (c &&
        (S && S.status !== "Available"
          ? ((c.style.opacity = "0.5"), (c.style.pointerEvents = "none"))
          : ((c.style.opacity = "1"), (c.style.pointerEvents = "auto"))),
        P(),
        (r.style.zIndex = "100000"),
        _(r, "item-modal"));
    }),
      n &&
        e &&
        t &&
        ((n.style.cursor = "pointer"),
        n.addEventListener("click", () => {
          ((t.src = n.src),
            (e.style.display = "flex"),
            requestAnimationFrame(() => {
              e.classList.add("show");
            }));
        })),
      u &&
        E &&
        (u.addEventListener("click", () => {
          $ > 1 && ($--, (v.textContent = $), P());
        }),
        E.addEventListener("click", () => {
          $ < 99 && ($++, (v.textContent = $), P());
        })),
      document.querySelectorAll(".product-card").forEach((f) => {
        f.addEventListener("click", (g) => {
          (g.preventDefault(), window.openItemModalWithData(f, null));
        });
      }),
      c &&
        c.addEventListener("click", () => {
          if (!localStorage.getItem("tl_location_name")) {
            let w = document.getElementById("location-modal");
            w &&
              (w.classList.add("active"),
              (void 0));
            return;
          }
          let f = c.innerHTML;
          ((c.innerHTML = "Added! \u2713"), (c.style.background = "#4CAF50"));
          let g = s.textContent,
            x = null;
          if (m && m.style.display === "block" && p) {
            let w = p.querySelector(".addon-chip.selected");
            w && (x = w.textContent.replace(/\s*\(.*\)/, ""));
          }
          let L = [];
          (b &&
            b.style.display === "block" &&
            a &&
            a.querySelectorAll(".addon-chip.selected").forEach((w) => {
              L.push(w.textContent.split(" (")[0].replace("+ ", ""));
            }),
            O.addItem({
              title: g,
              image: n.src,
              basePrice: B + j,
              size: x,
              extras: L,
              addonsTotal: A,
              qty: $,
            }),
            setTimeout(() => {
              ((c.innerHTML = f),
                (c.style.background = ""),
                r.classList.remove("active"));
            }, 800));
        }));
    let C = r.querySelector(".modal-sheet");
    if (C) {
      let f = 0,
        g = 0,
        x = !1;
      (C.addEventListener(
        "touchstart",
        (L) => {
          (C.querySelector(".modal-body") || C).scrollTop <= 0 &&
            ((f = L.touches[0].clientY),
            (x = !0),
            (C.style.transition = "none"));
        },
        { passive: !0 },
      ),
        C.addEventListener(
          "touchmove",
          (L) => {
            if (!x) return;
            if ((C.querySelector(".modal-body") || C).scrollTop > 0) {
              x = !1;
              return;
            }
            g = L.touches[0].clientY;
            let z = g - f;
            z > 0 &&
              (L.preventDefault(), (C.style.transform = `translateY(${z}px)`));
          },
          { passive: !1 },
        ),
        C.addEventListener("touchend", (L) => {
          x &&
            ((x = !1),
            (C.style.transition = ""),
            g - f > 60 && R(r),
            (C.style.transform = ""),
            (f = 0),
            (g = 0));
        }));
    }
    let W = document.getElementById("offer-modal");
    if (W) {
      document.querySelectorAll(".offer-image-trigger").forEach((x) => {
        x.addEventListener("click", (L) => {
          (L.preventDefault(), _(W, "offer-modal"));
        });
      });
      let f = document.getElementById("offer-modal-add-to-cart");
      f &&
        f.addEventListener("click", () => {
          if (!localStorage.getItem("tl_location_name")) {
            let w = document.getElementById("location-modal");
            w &&
              (w.classList.add("active"),
              (void 0));
            return;
          }
          let x = f.innerHTML;
          ((f.innerHTML = "Added! \u2713"), (f.style.background = "#4CAF50"));
          let L = window.location.pathname.includes("pages/")
            ? "../assets/images/combo-2.avif"
            : "./assets/images/combo-2.avif";
          (O.addItem({
            title: "Combo 2",
            image: L,
            basePrice: 1799,
            addonsTotal: 0,
            qty: 1,
          }),
            setTimeout(() => {
              ((f.innerHTML = x), (f.style.background = ""), R(W));
            }, 800));
        });
      let g = W.querySelector(".modal-sheet");
      if (g) {
        let x = 0,
          L = 0,
          w = !1;
        (g.addEventListener(
          "touchstart",
          (z) => {
            (g.querySelector(".modal-body") || g).scrollTop <= 0 &&
              ((x = z.touches[0].clientY),
              (w = !0),
              (g.style.transition = "none"));
          },
          { passive: !0 },
        ),
          g.addEventListener(
            "touchmove",
            (z) => {
              if (!w) return;
              if ((g.querySelector(".modal-body") || g).scrollTop > 0) {
                w = !1;
                return;
              }
              L = z.touches[0].clientY;
              let T = L - x;
              T > 0 &&
                (z.preventDefault(),
                (g.style.transform = `translateY(${T}px)`));
            },
            { passive: !1 },
          ),
          g.addEventListener("touchend", (z) => {
            w &&
              ((w = !1),
              (g.style.transition = ""),
              L - x > 100 && R(W),
              (g.style.transform = ""),
              (L = 0),
              (x = 0));
          }));
      }
    }
    document.querySelectorAll(".modal-overlay").forEach((f) => {
      f.addEventListener("click", (g) => {
        g.target === f && R(f);
      });
    });
  }
  function ie() {
    let e = document.querySelector(".dynamic-orders-wrapper");
    if (!window.location.pathname.includes("orders.html") || !e) return;
    let t = JSON.parse(localStorage.getItem("hdm_orders")) || [];
    if (t.length === 0) return;
    let o = "";
    (t.forEach((r) => {
      let n = r.items
        .map(
          (d) =>
            `<strong style="color:#333;">${d.qty}x</strong> ${d.title} ${d.size ? `(${d.size})` : ""} ${d.extras && d.extras.length > 0 ? `<span style="color:#888;font-size:0.85em;">(+ ${d.extras.join(", ")})</span>` : ""}`,
        )
        .join("<br>");
      o += `
        <div class="order-card active-order" style="background:white;border-radius:16px;padding:1.5rem;margin-bottom:2rem;box-shadow:0 4px 15px rgba(0,0,0,0.05);border:2px solid var(--clr-primary);">
            <div class="order-header" style="display:flex;justify-content:space-between;border-bottom:1px solid var(--clr-border);padding-bottom:1rem;margin-bottom:1rem;">
                <div>
                    <span class="order-status" style="display:inline-block;background:#e8f5e9;color:#2e7d32;padding:0.3rem 0.8rem;border-radius:50px;font-size:0.75rem;font-weight:700;margin-bottom:0.5rem;">${r.status}</span>
                    <h3 class="order-id" style="margin:0 0 0.2rem 0;font-size:1.2rem;color:var(--clr-text-primary);">Order #${r.id}</h3>
                    <span class="order-time" style="color:#666;font-size:0.85rem;">${r.date}</span>
                </div>
                <div style="text-align:right;">
                    <span class="order-price" style="font-weight:700;color:var(--clr-text-primary);font-size:1.2rem;display:block;margin-bottom:0.5rem;">Rs ${H(r.total)}</span>
                    <span style="font-size:0.8rem;color:#888;">${r.items.reduce((d, s) => d + s.qty, 0)} items</span>
                </div>
            </div>
            <div class="order-items-list" style="margin-bottom:1.5rem;">
                <p class="order-items" style="margin:0;color:#555;line-height:1.6;font-size:0.95rem;">${n}</p>
            </div>
            ${
              r.customer
                ? `
            <div class="order-details-box" style="margin-bottom:1.5rem; font-size: 0.9rem; color: #666; border-left: 3px solid var(--clr-primary); padding-left: 1rem;">
                <p style="margin:0 0 0.2rem 0;"><strong>Payment Method:</strong> ${r.paymentMethod || "Cash on Delivery"}</p>
                <p style="margin:0 0 0.2rem 0;"><strong>Deliver to:</strong> ${r.customer.name} (${r.customer.phone})</p>
                <p style="margin:0;"><strong>Address:</strong> ${r.customer.address}, ${r.customer.city}</p>
                ${r.customer.notes ? `<p style="margin:0.2rem 0 0 0;"><strong>Notes:</strong> ${r.customer.notes}</p>` : ""}
            </div>`
                : ""
            }
            <div class="order-progress-box" style="background:#f9f9f9;padding:1rem;border-radius:12px;">
                <strong class="order-progress-title" style="display:block;margin-bottom:0.8rem;color:var(--clr-text-primary);font-size:0.95rem;">Estimated Delivery: +30-45 mins</strong>
                <div class="order-progress-bar" style="height:8px;background:#e0e0e0;border-radius:4px;margin-bottom:0.8rem;overflow:hidden;">
                    <div class="order-progress-fill" style="height:100%;width:50%;background:var(--clr-primary);border-radius:4px;"></div>
                </div>
                <div class="order-progress-steps" style="display:flex;justify-content:space-between;font-size:0.8rem;color:#888;font-weight:500;">
                    <span style="color:var(--clr-primary);">Confirmed</span>
                    <span style="color:var(--clr-primary);font-weight:700;">Preparing</span>
                    <span>Out for Delivery</span>
                </div>
            </div>
        </div>`;
    }),
      (e.innerHTML = o));
    let i = document.querySelector(".empty-orders-state");
    i && (i.style.display = "none");
  }
  function ee() {
    const pageName = location.pathname.split("/").pop() || "index.html";
    if (pageName !== "menu.html" && pageName !== "offers.html") return;
    if (document.getElementById("socialProofToast")) return;
    document.body.insertAdjacentHTML(
      "beforeend",
      `<div class="social-proof-toast" id="socialProofToast">
        <div class="toast-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="100%" height="100%"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <div class="toast-text" id="socialProofText">Someone just ordered the Tower Burger!</div>
      </div>`,
    );
    if (pageName === "menu.html" && window.innerWidth <= 768) {
      const toast = document.getElementById("socialProofToast");
      if (toast) toast.classList.add("menu-mobile-toast");
    }
    const msgs = [
      "Usman just ordered a Smash Burger!",
      "Hurry! Only 2 'Mega Feast Combo' deals left.",
      "Sara just got 20% off on the Family Feast Combo.",
      "Ahmed just claimed the Crispy Combo deal!",
      "Hot deal! 3 people are viewing Crown BigBites Pizza.",
      "Only 1 Combo 4 remaining at this price!",
      "Ali just ordered the BBQ Burger.",
      "Ayesha just saved Rs 600 on Combo 3!",
      "Someone just bought the Chicken Fajita Pizza.",
      "Imran just added Tower Burger to his cart!",
    ];
    const toast = document.getElementById("socialProofToast");
    const textEl = document.getElementById("socialProofText");
    if (!toast || !textEl) return;
    const show = () => {
      textEl.textContent = msgs[Math.floor(Math.random() * msgs.length)];
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 3000);
    };
    setTimeout(() => { show(); setInterval(show, 8000); }, 2000);
  }

  document.addEventListener("DOMContentLoaded", () => {
    (console.log("Hotbox - Script Loaded"),
      (window.CartManager = O),
      V(),
      G(),
      K(),
      ee(),
      O.init(),
      te());
    let e = Z(),
      t = document.getElementById("lightbox-img");
    (re(),
      oe(),
      ne(),
      le(e, t),
      ie(),
      document.querySelectorAll(".category-btn").forEach((r) => {
        r.addEventListener("click", () => {
          (document
            .querySelectorAll(".category-btn")
            .forEach((n) => n.classList.remove("active")),
            r.classList.add("active"));
        });
      }));
    let o = document.getElementById("reservationForm");
    (o &&
      o.addEventListener("submit", (r) => {
        (r.preventDefault(),
          alert(
            "Your reservation has been submitted! We will get in touch soon.",
          ),
          o.reset());
      }),
      window.addEventListener("resize", () => O.updateUI()));
    let i = document.getElementById("checkout-form");
    (i &&
      i.addEventListener("submit", function (r) {
        (r.preventDefault(), (window.isOrdering = !0));
        let n = document.getElementById("cust-name").value,
          d = document.getElementById("cust-phone").value,
          s = document.getElementById("cust-address").value,
          y = document.getElementById("cust-city").value,
          l = document.querySelector(
            'input[name="payment_method"]:checked',
          ).value,
          cO =
            localStorage.getItem("tl_location_type") === "outlet"
              ? "Pickup"
              : "Delivery",
          v = window.CartManager.getSubtotal() + (cO === "Delivery" ? 12 : 0);
        if (l === "Wallet") {
          if (!(localStorage.getItem("isLoggedIn") === "true")) {
            alert("Please login to use your Wallet balance.");
            return;
          }
          if (
            typeof window.userWalletBalance > "u" ||
            v > window.userWalletBalance
          ) {
            alert(
              "Insufficient Wallet balance to complete this order. Your total is Rs " +
                v +
                ", but your balance is Rs " +
                (window.userWalletBalance || 0) +
                ".",
            );
            return;
          }
        }
        let u = {
            id: Math.floor(1e5 + Math.random() * 9e5),
            date:
              new Date().toLocaleDateString() +
              " " +
              new Date().toLocaleTimeString(),
            timestamp: Date.now(),
            total: v,
            status: "Pending",
            paymentMethod: l,
            type: cO,
            customer: {
              name: n,
              phone: d,
              address: s,
              city: y,
              notes: document.getElementById("cust-notes").value,
            },
            items: window.CartManager.state.items,
          },
          E = document.getElementById("order-confirm-modal");
        E && E.remove();
        let b = `
          <div class="modal-overlay active" id="order-confirm-modal" style="z-index:10002; display:flex; padding: 1rem; align-items:center; justify-content:center;">
            <div class="modal-sheet" style="max-width:850px; width:100%; max-height:90vh; padding:0; display:flex; flex-direction:column; background:var(--clr-surface, #fff); overflow:hidden; border-radius:24px;">
              
              <div class="scrollable-content" style="flex:1; overflow-y:auto; display:flex; flex-direction:row;">
                <!-- Left side: Customer Info -->
                <div class="modal-left-pane" style="flex:1; background:var(--clr-primary); color:white; padding: 3rem 2.5rem; display:flex; flex-direction:column; justify-content:center;">
                  <h2 style="font-size:2rem; margin-bottom:0.5rem; font-weight:700;">Confirm Order</h2>
                  <p style="font-size:1.05rem; opacity:0.9; margin-bottom:2.5rem;">Please review your details carefully.</p>
                  
                  <div style="background: rgba(0,0,0,0.15); padding: 1.5rem; border-radius: 12px;">
                    <h4 style="margin:0 0 1rem 0; font-size:1.1rem; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom:0.5rem;">Customer Details</h4>
                    <p style="margin:0 0 0.5rem 0;"><strong>Name:</strong> ${n}</p>
                    <p style="margin:0 0 0.5rem 0;"><strong>Phone:</strong> ${d}</p>
                    <p style="margin:0 0 0.5rem 0;"><strong>Address:</strong> ${s}, ${y}</p>
                    ${document.getElementById("cust-notes").value ? `<p style="margin:0;"><strong>Notes:</strong> ${document.getElementById("cust-notes").value}</p>` : ""}
                  </div>
                </div>
                
                <!-- Right side: Summary -->
                <div class="modal-right-pane" style="flex:1; padding: 2.5rem; background:var(--clr-background, #fafafa); color:var(--clr-text-primary); display:flex; flex-direction:column;">
                  <h3 style="font-size:1.3rem; margin-bottom:1.5rem; color:var(--clr-text-primary); border-bottom:1px solid var(--clr-border); padding-bottom:1rem;">Order Summary</h3>
                  <div style="flex:1; margin-bottom:1.5rem;">
                    ${window.CartManager.state.items
                      .map(
                        (m) => `
                      <div style="display:flex; justify-content:space-between; margin-bottom:1rem; align-items:center;">
                        <div>
                          <strong style="color:var(--clr-text-primary);">${m.qty}x</strong> <span style="color:var(--clr-text-primary);">${m.title}</span>
                          ${m.size ? `<div style="font-size:0.85rem; color:var(--clr-text-secondary, #666);">${m.size}</div>` : ""}
                        </div>
                        <div style="font-weight:600; color:var(--clr-text-primary);">Rs ${m.qty * (m.basePrice + (m.addonsTotal || 0))}</div>
                      </div>
                    `,
                      )
                      .join("")}
                  </div>
                  <div style="border-top:1px solid var(--clr-border); padding-top:1.5rem;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; color:var(--clr-text-secondary, #555);">
                      <span>Payment Method</span>
                      <span style="font-weight:600; color:var(--clr-text-primary);">${l}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-top:1rem; font-size:1.3rem; font-weight:700;">
                      <span style="color:var(--clr-text-primary);">Total</span>
                      <span style="color:var(--clr-primary);">Rs ${v}</span>
                    </div>
                  </div>
                  <!-- Desktop buttons (hidden on mobile) -->
                  <div id="order-confirm-modal-buttons-desktop" style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                    <button class="confirm-modal-back btn" style="flex:1; border-radius:50px; padding:0.8rem 1rem; font-weight:600; cursor:pointer;">Back</button>
                    <button class="confirm-modal-submit btn btn-primary" style="flex:2; border-radius:50px; padding:0.8rem 1rem; font-weight:700; cursor:pointer;">Confirm Order</button>
                  </div>
                </div>
              </div>

              <!-- Sticky Mobile Buttons (hidden on desktop) -->
              <div id="order-confirm-modal-buttons-mobile" style="display: flex; gap: 1rem; padding: 1rem; background: var(--clr-surface); border-top: 1px solid var(--clr-border); z-index: 10;">
                <button class="confirm-modal-back btn" style="flex:1; border-radius:50px; padding:0.8rem 0.5rem; font-weight:600; cursor:pointer; font-size: 0.95rem;">Back</button>
                <button class="confirm-modal-submit btn btn-primary" style="flex:2; border-radius:50px; padding:0.8rem 0.5rem; font-weight:700; cursor:pointer; font-size: 0.95rem;">Confirm Order</button>
              </div>

            </div>
          </div>
          <style>
            #order-confirm-modal-buttons-mobile { display: none !important; }
            html.dark-mode #order-confirm-modal .modal-right-pane { background: var(--clr-surface-dark) !important; }
            html.dark-mode #order-confirm-modal-buttons-mobile { border-top-color: rgba(255,255,255,0.05) !important; }
            html.dark-mode #order-confirm-modal .modal-right-pane h3 { border-bottom-color: rgba(255,255,255,0.05) !important; }
            html.dark-mode #order-confirm-modal .modal-right-pane > div:nth-child(3) { border-top-color: rgba(255,255,255,0.05) !important; }
            .confirm-modal-back { background: #888; border: 2px solid #888; color: #fff !important; transition: all 0.3s; }
            .confirm-modal-back:hover, .confirm-modal-back:active { background: #666; color: #fff !important; border-color: #666; }
            html.dark-mode .confirm-modal-back { border: 2px solid rgba(255,255,255,0.3) !important; color: #ddd !important; }
            html.dark-mode .confirm-modal-back:hover, html.dark-mode .confirm-modal-back:active { background: rgba(255,255,255,0.1) !important; color: #fff !important; border-color: rgba(255,255,255,0.5) !important; }
            @media (max-width: 768px) {
              #order-confirm-modal-buttons-desktop { display: none !important; }
              #order-confirm-modal-buttons-mobile { display: flex !important; }
              #order-confirm-modal .scrollable-content { flex-direction: column !important; }
              #order-confirm-modal .modal-left-pane { padding: 1.5rem !important; justify-content: flex-start !important; flex: none !important; }
              #order-confirm-modal .modal-left-pane h2 { font-size: 1.5rem !important; margin-bottom: 0.2rem !important; }
              #order-confirm-modal .modal-left-pane p { margin-bottom: 1rem !important; font-size: 0.95rem !important; }
              #order-confirm-modal .modal-right-pane { padding: 1.5rem !important; flex: none !important; }
            }
          </style>
        `;
        document.body.insertAdjacentHTML("beforeend", b);
        const a = document.getElementById("order-confirm-modal");
        (a.addEventListener("click", (m) => {
          m.target === a && (a.remove(), (window.isOrdering = !1));
        }),
          document.querySelectorAll(".confirm-modal-back").forEach((m) => {
            m.addEventListener("click", () => {
              (a.remove(), (window.isOrdering = !1));
            });
          }),
          document.querySelectorAll(".confirm-modal-submit").forEach((m) => {
            m.addEventListener("click", () => {
              let p = JSON.parse(localStorage.getItem("hdm_orders")) || [];
              (p.unshift(u),
                localStorage.setItem("hdm_orders", JSON.stringify(p)),
                (window.CartManager.state.items = []),
                window.CartManager.save(),
                (window.location.href = "orders.html"));
            });
          }));
      }),
      window.addEventListener("load", () => {
        let r = document.getElementById("page-loader");
        r &&
          ((r.style.transition = "opacity 0.5s ease"),
          (r.style.opacity = "0"),
          setTimeout(() => {
            r.style.display = "none";
          }, 500));
      }));
  });
})();
// --- Custom Cart & Checkout Modals ---
(function () {
  // 1. Create Modal HTML and inject to body
  const modalHTML = `
    <style>
        .cc-modal-overlay {
            position: fixed; left: 0; width: 100%;
            background: transparent; z-index: 9000;
            display: flex; justify-content: flex-end;
            opacity: 0; visibility: hidden; transition: opacity 0.3s, visibility 0.3s;
            pointer-events: none;
            /* Desktop: sit exactly below the sticky header */
            top: var(--header-height, 70px);
            height: calc(100dvh - var(--header-height, 70px));
        }
        .cc-modal-overlay.active { opacity: 1; visibility: visible; pointer-events: auto; }
        .cc-modal-overlay::before {
            content: '';
            position: absolute;
            inset: 0;
            background: rgba(0,0,0,0.5);
            pointer-events: none;
        }
        .cc-modal-sheet {
            position: relative; z-index: 1;
            width: 480px; max-width: 100%;
            height: 100%;
            background: var(--clr-surface, #fff);
            transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex; flex-direction: column;
            box-shadow: -8px 0 32px rgba(0,0,0,0.15);
        }
        .cc-modal-overlay.active .cc-modal-sheet { transform: translateX(0); }
        @media (max-width: 768px) {
            .cc-modal-overlay {
                top: 0;
                height: 100dvh;
                justify-content: center; align-items: flex-end;
            }
            .cc-modal-sheet { 
                height: 90dvh; width: 100%;
                transform: translateY(100%); border-radius: 20px 20px 0 0; 
                box-shadow: 0 -8px 32px rgba(0,0,0,0.15);
            }
            .cc-modal-overlay.active .cc-modal-sheet { transform: translateY(0); }
        }
        
        .cc-header {
            padding: 1.5rem; border-bottom: 1px solid var(--clr-border);
            display: flex; justify-content: space-between; align-items: center;
        }
        .cc-title { font-size: 1.5rem; font-weight: 700; margin: 0; color: var(--clr-text-primary); }
        .cc-close { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--clr-text-primary); }
        
        .cc-body { flex: 1; overflow-y: auto; padding: 1.5rem; scrollbar-width: none; -ms-overflow-style: none; }
        .cc-body::-webkit-scrollbar { display: none; }
        
        /* Checkout Form Styling inside modal */
        .cc-input {
            width: 100%; padding: 0.8rem 1rem; border: 1px solid var(--clr-border); border-radius: 8px;
            margin-bottom: 1rem; font-family: inherit; font-size: 1rem; background: var(--clr-background, #fff); color: var(--clr-text-primary);
        }
        .cc-input:focus {
            outline: none; border-color: var(--clr-primary);
        }
        .cc-label { display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 0.4rem; color: var(--clr-text-secondary); }
        
        /* Method Selector Styling */
        .cc-method-label {
            flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 1rem; 
            border: 1px solid var(--clr-border); border-radius: 8px; cursor: pointer; text-align: center;
            transition: all 0.3s; background: var(--clr-surface, #fff);
        }
        .cc-method-label:hover { border-color: var(--clr-primary); }
        .cc-method-label input[type="radio"] { accent-color: var(--clr-primary); transform: scale(1.2); margin: 0; }
        .cc-method-label:has(input:checked) { border-color: var(--clr-primary); background: var(--clr-primary); color: #fff; }
        .cc-method-label:has(input:checked) span { color: #fff !important; }


        
        html.dark-mode .cc-header { border-bottom-color: var(--clr-border) !important; }
        html.dark-mode #cc-cart-summary { border-top-color: var(--clr-border) !important; }
        html.dark-mode .cc-input {
            border-color: var(--clr-border);
            background: var(--clr-surface);
        }
        /* Fix Back to Cart button hover in light mode */
        .cc-modal-overlay #cc-back-cart:hover {
            background: var(--clr-border, #e0e0e0) !important;
            color: var(--clr-text-primary) !important;
        }
        
        .cc-cart-item {
            display: flex; align-items: center; gap: 1rem; padding: 1rem;
            border: 1px solid var(--clr-border); border-radius: 12px; margin-bottom: 1rem;
            background: var(--clr-surface); box-shadow: 0 2px 4px rgba(0,0,0,0.02);
            transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
        }
        .cc-cart-item:hover {
            border-color: var(--clr-primary); box-shadow: 0 4px 12px rgba(0,0,0,0.05); transform: translateY(-2px);
        }
        html.dark-mode .cc-cart-item {
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        html.dark-mode .cc-cart-item:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
        
        .cc-qty-btn {
            width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--clr-border);
            background: var(--clr-surface); color: var(--clr-text-primary); cursor: pointer;
            display: flex; align-items: center; justify-content: center; font-size: 1.1rem;
            transition: all 0.2s;
        }
        .cc-qty-btn:hover { background: var(--clr-primary); color: #fff; border-color: var(--clr-primary); }

    </style>
    <div class="cc-modal-overlay" id="custom-cart-modal">
        <div class="cc-modal-sheet">
            <div class="cc-header">
                <h2 class="cc-title" id="cc-modal-title">Your Cart</h2>
                <button class="cc-close" id="cc-modal-close">&times;</button>
            </div>
            <div class="cc-body" id="cc-modal-body">
                <!-- Cart Items will be injected here -->
                <div id="cc-cart-view">
                    <div id="cc-cart-items"></div>
                    <div id="cc-cart-empty" style="display:none; text-align:center; padding: 2rem;">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--clr-border, #ccc)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1.5rem; display:inline-block;"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                        <h3 style="font-size: 1.5rem; color: var(--clr-text-primary); margin-bottom: 0.5rem;">Your cart is empty</h3>
                        <p style="color: var(--clr-text-secondary); margin-bottom: 2rem;">It looks like you haven't added any delicious items to your order yet.</p>
                        <button class="btn btn-primary" onclick="document.getElementById('cc-modal-close').click()" style="padding: 0.8rem 2rem; border-radius: 50px;">Explore Menu</button>
                    </div>
                    <div id="cc-cart-summary" style="margin-top: 1.5rem; border-top: 1px solid var(--clr-border); padding-top: 1.5rem;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; color: var(--clr-text-primary);">
                            <span>Subtotal</span><span id="cc-subtotal">Rs 0</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:1rem; color: var(--clr-text-primary);" id="cc-delivery-fee-row">
                            <span>Delivery Fee</span><span>Rs 12</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; font-weight:700; font-size:1.2rem; margin-bottom:1.5rem; color: var(--clr-text-primary);">
                            <span>Total</span><span id="cc-total">Rs 12</span>
                        </div>
                        <button class="btn btn-primary" style="width:100%; padding:1rem; border-radius:50px; font-weight:700;" id="cc-go-checkout">Proceed to Checkout</button>
                    </div>
                </div>
                
                <!-- Checkout Form -->
                <div id="cc-checkout-view" style="display:none;">
                    <form id="cc-checkout-form">
                        
                        <label class="cc-label">Phone Number *</label>
                        <input type="tel" id="cc-phone" class="cc-input" required placeholder="0300 1234567">
                        
                        <label class="cc-label">Full Name (Optional)</label>
                        <input type="text" id="cc-name" class="cc-input" placeholder="John Doe">
                        
                        <label class="cc-label">Email (Optional)</label>
                        <input type="email" id="cc-email" class="cc-input" placeholder="name@example.com">
                        
                        <!-- Delivery Location Field -->
                        <div id="cc-delivery-area-group">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <label class="cc-label" id="cc-location-label">Delivery Area/City *</label>
                                <a href="#" id="cc-edit-location" style="font-size:0.85rem; color:var(--clr-primary); text-decoration:none;">Edit</a>
                            </div>
                            <input type="text" id="cc-city" class="cc-input" required readonly style="background:var(--clr-background); cursor:not-allowed; border-color:var(--clr-border);">
                        </div>
                        
                        <!-- Delivery Address Field -->
                        <div id="cc-delivery-address-group">
                            <label class="cc-label">Delivery Address *</label>
                            <textarea id="cc-address" class="cc-input" required placeholder="House/Apartment #, Street, etc." rows="2"></textarea>
                        </div>
                        
                        <!-- Pickup Time Field -->
                        <div id="cc-pickup-time-group" style="display:none; margin-bottom:1rem;">
                            <label class="cc-label">Pickup Time *</label>
                            <div style="display:flex; gap:0.5rem; margin-bottom:0.8rem;">
                                <button type="button" id="cc-time-asap" style="flex:1; padding:0.8rem; border-radius:8px; font-size:0.9rem; font-weight:600; border:2px solid var(--clr-primary); background:var(--clr-primary); color:#fff; cursor:pointer; transition:all 0.2s;">ASAP (~20 min)</button>
                                <button type="button" id="cc-time-later" style="flex:1; padding:0.8rem; border-radius:8px; font-size:0.9rem; font-weight:600; border:2px solid var(--clr-border); background:var(--clr-surface); color:var(--clr-text-primary); cursor:pointer; transition:all 0.2s;">Schedule</button>
                            </div>
                            <div id="cc-time-input-wrap" style="display:none;">
                                <input type="time" id="cc-time-input" class="cc-input" style="padding:0.8rem;">
                            </div>
                        </div>
                        
                        <label class="cc-label" style="margin-top:0.5rem; margin-bottom:0.8rem;">Payment Method</label>
                        <div style="display:flex; gap:1rem; margin-bottom:1.5rem;">
                            <label class="cc-method-label">
                                <input type="radio" name="cc_payment" value="Cash on Delivery" checked>
                                <span style="font-size:0.9rem; font-weight:600; color:var(--clr-text-primary);">Cash on Delivery</span>
                            </label>
                            <label class="cc-method-label">
                                <input type="radio" name="cc_payment" value="Wallet">
                                <span style="font-size:0.9rem; font-weight:600; color:var(--clr-text-primary);">Wallet</span>
                            </label>
                        </div>
                        
                        <div style="display:flex; flex-wrap:nowrap; gap:1rem; margin-top:1.5rem; justify-content:center;">
                            <button type="button" class="btn btn-outline" style="flex:1; padding:0.8rem 0.5rem; border-radius:50px; font-weight:600; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" id="cc-back-cart">Back to Cart</button>
                            <button type="submit" class="btn btn-primary" style="flex:1; padding:0.8rem 0.5rem; border-radius:50px; font-weight:700; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" id="cc-place-order">Place Order</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modal = document.getElementById("custom-cart-modal");
  const closeBtn = document.getElementById("cc-modal-close");
  const cartView = document.getElementById("cc-cart-view");
  const checkoutView = document.getElementById("cc-checkout-view");
  const modalTitle = document.getElementById("cc-modal-title");

  let originalCityValue = "";

  // Helper: apply correct form state based on location type from localStorage
  function applyLocationTypeToForm() {
    const locName = localStorage.getItem("tl_location_name");
    const locArea = localStorage.getItem("tl_location_area");
    let cityStr = locName || "";
    if (locArea) cityStr += ` (${locArea})`;
    originalCityValue = cityStr;

    const locType = localStorage.getItem("tl_location_type") || "delivery";
    const isPickup = locType === "outlet";

    const locLabel = document.getElementById("cc-location-label");
    const addrGroup = document.getElementById("cc-delivery-address-group");
    const cityInput = document.getElementById("cc-city");
    const editBtn = document.getElementById("cc-edit-location");
    const feeRow = document.getElementById("cc-delivery-fee-row");
    const addrInput = document.getElementById("cc-address");
    const timeGrp = document.getElementById("cc-pickup-time-group");

    if (isPickup) {
      if (locLabel) locLabel.textContent = "Pickup At *";
      if (cityInput) cityInput.value = cityStr || "Main Branch (Default)";
      if (addrGroup) addrGroup.style.display = "none";
      if (editBtn) editBtn.style.display = "block";
      if (feeRow) feeRow.style.display = "none";
      if (addrInput) addrInput.removeAttribute("required");
      if (timeGrp) timeGrp.style.display = "block";
    } else {
      if (locLabel) locLabel.textContent = "Delivery Area/City *";
      if (cityInput) cityInput.value = cityStr;
      if (addrGroup) addrGroup.style.display = "block";
      if (editBtn) editBtn.style.display = "block";
      if (feeRow) feeRow.style.display = "flex";
      if (addrInput) addrInput.setAttribute("required", "true");
      if (timeGrp) timeGrp.style.display = "none";
    }
  }

  function openModal() {
    // Measure actual navbar height
    const navbar = document.querySelector(".navbar");
    const navH = navbar ? navbar.offsetHeight : 70;
    requestAnimationFrame(() => {
      document.documentElement.style.setProperty("--header-height", navH + "px");
      modal.classList.add("active");
      renderCart();
      showCartView();
    });
  }

  function closeModal() {
    modal.classList.remove("active");
    void 0;
  }

  closeBtn.addEventListener("click", closeModal);

  // Close on outside click for cart modal
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document
    .querySelectorAll(".cart-icon-link, .floating-cart-bar")
    .forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        openModal();
      });
    });

  // Delegate cart clicks
  document.body.addEventListener(
    "click",
    (e) => {
      let target = e.target.closest("a");
      if (
        target &&
        target.href &&
        (target.href.includes("cart.html") ||
          target.href.includes("checkout.html"))
      ) {
        e.preventDefault();
        openModal();
      }

      let targetDiv = e.target.closest(".floating-cart-bar");
      if (targetDiv) {
        e.preventDefault();
        e.stopPropagation();
        openModal();
      }
    },
    true,
  );

  // Override CartManager.updateUI so the floating bar doesn't navigate
  setTimeout(() => {
    const floatBar = document.querySelector(".floating-cart-bar");
    if (floatBar) {
      const newBar = floatBar.cloneNode(true);
      floatBar.parentNode.replaceChild(newBar, floatBar);
      newBar.addEventListener("click", (e) => {
        e.preventDefault();
        openModal();
      });
    }
  }, 1000);

  function H(e) {
    typeof e == "string" && (e = e.replace(",", "."));
    let t = parseFloat(e);
    if (isNaN(t)) return e;
    let o = t.toFixed(2).replace(".", ",");
    return o.endsWith(",00")
      ? o.substring(0, o.length - 3)
      : o.includes(",") && o.endsWith("0")
        ? o.substring(0, o.length - 1)
        : o;
  }

  function renderCart() {
    const items = window.CartManager ? window.CartManager.state.items : [];
    const itemsContainer = document.getElementById("cc-cart-items");
    const emptyState = document.getElementById("cc-cart-empty");
    const summary = document.getElementById("cc-cart-summary");

    if (!items || items.length === 0) {
      itemsContainer.style.display = "none";
      summary.style.display = "none";
      emptyState.style.display = "block";
      return;
    }

    itemsContainer.style.display = "block";
    summary.style.display = "block";
    emptyState.style.display = "none";

    let html = "";
    let subtotal = window.CartManager.getSubtotal();

    items.forEach((item, index) => {
      let itemTotal = (item.basePrice + (item.addonsTotal || 0)) * item.qty;
      let imagePath = item.image;
      if (!window.location.pathname.includes("/pages/")) {
        imagePath = imagePath.replace("../", "./");
      }

      html += `
            <div class="cc-cart-item" style="cursor:pointer;" onclick="if(!event.target.closest('button')) { window.openItemModalWithData(null, {name: \`${item.title}\`, price: ${item.basePrice}, img: \`${imagePath}\`}); }">
                <img loading="lazy" src="${imagePath}" style="width:70px; height:70px; border-radius:8px; object-fit:cover; border:1px solid var(--clr-border);">
                <div style="flex:1;">
                    <h4 style="margin:0; font-size:1rem; color:var(--clr-text-primary);">${item.title}</h4>
                    ${item.size ? `<p style="margin:0; font-size:0.8rem; color:var(--clr-text-secondary);">${item.size}</p>` : ""}
                    <div style="display:flex; align-items:center; gap:0.5rem; margin-top:0.5rem;">
                        <button class="cc-qty-btn" onclick="window.CartManager.updateItemQty(${index}, ${item.qty - 1}); setTimeout(()=>window._renderCC(), 50)">-</button>
                        <span style="color:var(--clr-text-primary); font-weight:600; min-width:16px; text-align:center;">${item.qty}</span>
                        <button class="cc-qty-btn" onclick="window.CartManager.updateItemQty(${index}, ${item.qty + 1}); setTimeout(()=>window._renderCC(), 50)">+</button>
                    </div>
                </div>
                <div style="text-align:right;">
                    <div style="font-weight:700; color:var(--clr-primary); font-size: 1.1rem;">Rs ${H(itemTotal)}</div>
                    <button onclick="window.CartManager.removeItem(${index}); setTimeout(()=>window._renderCC(), 50)" aria-label="Remove item" style="margin-top:0.5rem; background:none; border:none; color:#e74c3c; cursor:pointer; padding:4px; display:flex; align-items:center; justify-content:flex-end; transition:opacity 0.2s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg></button>
                </div>
            </div>`;
    });

    itemsContainer.innerHTML = html;
    const locType = localStorage.getItem("tl_location_type") || "delivery";
    const selectedType = locType === "outlet" ? "Pickup" : "Delivery";
    const fee = selectedType === "Delivery" ? 12 : 0;
    const feeRow = document.getElementById("cc-delivery-fee-row");
    if (feeRow)
      feeRow.style.display = selectedType === "Pickup" ? "none" : "flex";

    document.getElementById("cc-subtotal").textContent = `Rs ${H(subtotal)}`;
    document.getElementById("cc-total").textContent = `Rs ${H(subtotal + fee)}`;
  }

  window._renderCC = renderCart;

  // View Switching
  function showCartView() {
    cartView.style.display = "block";
    checkoutView.style.display = "none";
    modalTitle.textContent = "Your Cart";
  }

  function showCheckoutView() {
    cartView.style.display = "none";
    checkoutView.style.display = "block";
    modalTitle.textContent = "Checkout";
    // Scroll modal body to top
    const body = document.getElementById("cc-modal-body");
    if (body) body.scrollTop = 0;

    // Auto-fill logged in user data from profile
    if (localStorage.getItem("isLoggedIn") === "true") {
      const fillName = localStorage.getItem("profileName") || "";
      const fillEmail = localStorage.getItem("profileEmail") || "";
      const fillPhone = localStorage.getItem("profilePhone") || "";
      const nameEl = document.getElementById("cc-name");
      const emailEl = document.getElementById("cc-email");
      const phoneEl = document.getElementById("cc-phone");
      if (nameEl && fillName) nameEl.value = fillName;
      if (emailEl && fillEmail) emailEl.value = fillEmail;
      if (phoneEl && fillPhone) phoneEl.value = fillPhone;
    }

    // Apply location type (Pickup vs Delivery) from header selection
    applyLocationTypeToForm();
  }

  // When user changes location/type from the header, update cart & checkout instantly
  window.addEventListener("tl_location_changed", () => {
    renderCart();
    // If checkout view is currently visible, re-apply form state
    if (checkoutView && checkoutView.style.display !== "none") {
      applyLocationTypeToForm();
    }
  });

  document
    .getElementById("cc-go-checkout")
    .addEventListener("click", showCheckoutView);
  document
    .getElementById("cc-back-cart")
    .addEventListener("click", showCartView);

  document.getElementById("cc-time-asap").addEventListener("click", () => {
    document.getElementById("cc-time-asap").style.background =
      "var(--clr-primary)";
    document.getElementById("cc-time-asap").style.color = "#fff";
    document.getElementById("cc-time-asap").style.borderColor =
      "var(--clr-primary)";
    document.getElementById("cc-time-later").style.background =
      "var(--clr-surface)";
    document.getElementById("cc-time-later").style.color =
      "var(--clr-text-primary)";
    document.getElementById("cc-time-later").style.borderColor =
      "var(--clr-border)";
    document.getElementById("cc-time-input-wrap").style.display = "none";
    document.getElementById("cc-time-input").value = "";
  });

  document.getElementById("cc-time-later").addEventListener("click", () => {
    document.getElementById("cc-time-later").style.background =
      "var(--clr-primary)";
    document.getElementById("cc-time-later").style.color = "#fff";
    document.getElementById("cc-time-later").style.borderColor =
      "var(--clr-primary)";
    document.getElementById("cc-time-asap").style.background =
      "var(--clr-surface)";
    document.getElementById("cc-time-asap").style.color =
      "var(--clr-text-primary)";
    document.getElementById("cc-time-asap").style.borderColor =
      "var(--clr-border)";
    document.getElementById("cc-time-input-wrap").style.display = "block";
  });

  document.getElementById("cc-edit-location").addEventListener("click", (e) => {
    e.preventDefault();
    const locModal = document.getElementById("location-modal");
    if (locModal && window._tl_openModal) {
      window._tl_openModal(locModal, "location-modal");

      // Watch for location update
      const observer = new MutationObserver(() => {
        const locName = localStorage.getItem("tl_location_name");
        const locArea = localStorage.getItem("tl_location_area");
        let cityStr = locName || "";
        if (locArea) cityStr += ` (${locArea})`;
        originalCityValue = cityStr;
        const currentLocType =
          localStorage.getItem("tl_location_type") || "delivery";
        document.getElementById("cc-city").value = cityStr;
      });
      observer.observe(document.getElementById("current-location-text"), {
        characterData: true,
        childList: true,
        subtree: true,
      });
    }
  });

  // Order Submission
  document
    .getElementById("cc-checkout-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();

      const phone = document.getElementById("cc-phone").value;
      const name = document.getElementById("cc-name").value;
      const email = document.getElementById("cc-email").value;
      const city = document.getElementById("cc-city").value;
      const address = document.getElementById("cc-address").value;
      const payment = document.querySelector(
        'input[name="cc_payment"]:checked',
      ).value;
      const locType = localStorage.getItem("tl_location_type") || "delivery";
      const orderType = locType === "outlet" ? "Pickup" : "Delivery";
      const total =
        window.CartManager.getSubtotal() + (orderType === "Delivery" ? 12 : 0);

      if (orderType === "Delivery" && !city) {
        alert("Please select a Delivery Area/City first.");
        return;
      }

      const orderId = Math.floor(100000 + Math.random() * 900000);

      let selectedTime = "ASAP";
      if (orderType === "Pickup") {
        const laterBtn = document.getElementById("cc-time-later");
        if (laterBtn && laterBtn.style.background === "var(--clr-primary)") {
          const timeInput = document.getElementById("cc-time-input");
          if (timeInput && timeInput.value) {
            selectedTime = timeInput.value;
          }
        }
      }

      const newOrder = {
        id: orderId,
        timestamp: Date.now(),
        date:
          new Date().toLocaleDateString() +
          " " +
          new Date().toLocaleTimeString(),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        total: total,
        status: "Pending",
        paymentMethod: payment,
        type: orderType,
        pickupTime: selectedTime,
        customer: {
          name: name || "Guest",
          phone: phone,
          email: email,
          address: orderType === "Delivery" ? address : "Pickup",
          city: city,
          notes: "",
        },
        items: window.CartManager.state.items,
      };

      // Show the huge confirmation modal "like the previous one"
      const confirmHtml = `
            <div class="modal-overlay active" id="order-confirm-modal" style="z-index:10015; display:flex; padding: 1rem; align-items:center; justify-content:center;">
              <div class="modal-sheet" style="max-width:850px; width:100%; max-height:90vh; padding:0; display:flex; flex-direction:column; background:var(--clr-surface, #fff); overflow:hidden; border-radius:24px;">
                
                <div class="scrollable-content" style="flex:1; overflow-y:auto; display:flex; flex-direction:row;">
                  <!-- Left side: Customer Info -->
                  <div class="modal-left-pane" style="flex:1; background:var(--clr-primary); color:white; padding: 3rem 2.5rem; display:flex; flex-direction:column; justify-content:center;">
                    <div style="margin-bottom: 2rem;">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1rem; opacity: 0.9;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      <h2 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; color: #fff;">Review Your Order</h2>
                      <p style="opacity: 0.9; font-size: 1.05rem; line-height: 1.5; margin: 0;">Please review your details, ${name || "Guest"}.</p>
                    </div>
                    
                    <div style="background: rgba(0,0,0,0.15); border-radius: 16px; padding: 1.5rem; margin-bottom: 1.5rem;">
                      <h4 style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8; margin-bottom: 1rem; color: #fff;">${orderType === "Pickup" ? "Pickup Details" : "Delivery Details"}</h4>
                      
                      <div style="display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1rem;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity:0.8; flex-shrink:0; margin-top:2px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        <div>
                          <p style="margin:0; font-weight:600; font-size:1rem; color:#fff;">${orderType === "Pickup" ? "Pickup At: " + city : city}</p>
                          ${
                            orderType === "Delivery"
                              ? `<p style="margin:0.2rem 0 0; opacity:0.8; font-size:0.9rem; line-height:1.4;">${address}</p>`
                              : `<p style="margin:0.2rem 0 0; font-size:0.9rem; color: rgba(255,255,255,0.9); font-weight: 500;">Time: ${
                                  selectedTime === "ASAP"
                                    ? "ASAP (~20 mins)"
                                    : "Scheduled for " +
                                      (function (t) {
                                        if (!t.includes(":")) return t;
                                        const [h, m] = t.split(":");
                                        const hi = parseInt(h);
                                        return (
                                          (hi % 12 || 12) +
                                          ":" +
                                          m +
                                          " " +
                                          (hi >= 12 ? "PM" : "AM")
                                        );
                                      })(selectedTime)
                                }</p>`
                          }
                        </div>
                      </div>
                      
                      <div style="display: flex; align-items: center; gap: 1rem;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity:0.8; flex-shrink:0;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        <p style="margin:0; font-weight:500; font-size:1rem; color:#fff;">${phone}</p>
                      </div>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div id="order-confirm-modal-buttons" style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                      <button type="button" class="confirm-modal-back btn" id="modal-btn-back">Back</button>
                      <button type="button" class="confirm-modal-submit btn" id="modal-btn-confirm">Confirm Order</button>
                    </div>
                  </div>
                  
                  <!-- Right side: Order Summary -->
                  <div class="modal-right-pane" style="flex:1; padding: 3rem 2.5rem; display:flex; flex-direction:column; background:var(--clr-surface, #fff);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 2rem;">
                      <h3 style="font-size: 1.3rem; font-weight: 700; margin:0; color:var(--clr-text-primary);">Order Summary</h3>
                      <span style="background: rgba(167, 2, 1, 0.1); color: var(--clr-primary); font-size: 0.85rem; font-weight: 700; padding: 0.3rem 0.8rem; border-radius: 50px;">ORD-${orderId}</span>
                    </div>
                    
                    <div style="flex:1; overflow-y:auto; max-height:220px; padding-right:0.5rem; margin-bottom:1.5rem; border-bottom:1px solid var(--clr-border);">
                      ${window.CartManager.state.items
                        .map((m) => {
                          let imgPath = m.image;
                          if (!window.location.pathname.includes("/pages/"))
                            imgPath = imgPath.replace("../", "./");
                          return `
                        <div style="display:flex; justify-content:space-between; margin-bottom:1rem; align-items:center;">
                          <div style="display:flex; gap:1rem; align-items:center;">
                            <img loading="lazy" src="${imgPath}" style="width:48px; height:48px; border-radius:8px; object-fit:cover;">
                            <div>
                              <p style="margin:0; font-weight:600; font-size:0.95rem; color:var(--clr-text-primary);">${m.qty}x ${m.title}</p>
                              ${m.size ? `<p style="margin:0; font-size:0.8rem; color:var(--clr-text-secondary);">${m.size}</p>` : ""}
                            </div>
                          </div>
                          <span style="font-weight:600; font-size:0.95rem; color:var(--clr-text-primary);">Rs ${(m.basePrice + (m.addonsTotal || 0)) * m.qty}</span>
                        </div>
                      `;
                        })
                        .join("")}
                    </div>
                    
                    <div>
                      <div style="display:flex; justify-content:space-between; margin-bottom:0.8rem; color:var(--clr-text-secondary); font-size:0.95rem;">
                        <span>Subtotal</span>
                        <span style="font-weight:500;">Rs ${total - (orderType === "Delivery" ? 12 : 0)}</span>
                      </div>
                      ${
                        orderType === "Delivery"
                          ? `
                      <div style="display:flex; justify-content:space-between; margin-bottom:1.2rem; color:var(--clr-text-secondary); font-size:0.95rem;">
                        <span>Delivery Fee</span>
                        <span style="font-weight:500;">Rs 12</span>
                      </div>`
                          : ""
                      }
                      <div style="display:flex; justify-content:space-between; margin-top:1rem; padding-top:1rem; border-top:1px solid var(--clr-border); font-size:1.2rem; font-weight:700; color:var(--clr-text-primary);">
                        <span>Total</span>
                        <span>Rs ${total}</span>
                      </div>
                      <div style="margin-top:1rem; text-align:right; color:var(--clr-text-secondary); font-size:0.85rem;">
                        Payment Method: <strong>${payment}</strong>
                      </div>
                    </div>
                  </div>
                </div>
  
              </div>
            </div>
            <style>
              #modal-btn-back {
                flex: 1;
                background: rgba(255,255,255,0.15);
                color: #ffffff;
                border: 2px solid #ffffff;
                border-radius: 50px;
                padding: 0.8rem 1rem;
                font-weight: 600;
                transition: all 0.3s ease;
              }
              #modal-btn-back:hover {
                background: rgba(255,255,255,0.25);
                color: #ffffff;
              }
              #modal-btn-back:active {
                background: rgba(255,255,255,0.35);
              }
              #modal-btn-confirm {
                flex: 2;
                background: #ffffff !important;
                color: var(--clr-primary, #E31B23) !important;
                border: 2px solid #ffffff !important;
                border-radius: 50px;
                padding: 0.8rem 1rem;
                font-weight: 700;
                transition: all 0.3s ease;
              }
              #modal-btn-confirm:hover {
                background: #f8f8f8 !important;
                color: var(--clr-primary, #E31B23) !important;
                transform: translateY(-2px);
              }
              #modal-btn-confirm:active {
                transform: translateY(0);
                background: #f0f0f0 !important;
              }

              @media (max-width: 768px) {
                #order-confirm-modal .scrollable-content { flex-direction: column !important; }
                #order-confirm-modal .modal-left-pane { padding: 1.5rem !important; justify-content: flex-start !important; flex: none !important; }
                #order-confirm-modal .modal-left-pane h2 { font-size: 1.5rem !important; margin-bottom: 0.2rem !important; }
                #order-confirm-modal .modal-left-pane p { margin-bottom: 1rem !important; font-size: 0.95rem !important; }
                #order-confirm-modal .modal-right-pane { padding: 1.5rem !important; flex: none !important; }
              }
              html.dark-mode #order-confirm-modal .modal-right-pane { background: var(--clr-surface) !important; }
              html.dark-mode #order-confirm-modal .modal-right-pane h3 { border-bottom-color: rgba(255,255,255,0.08) !important; }
              html.dark-mode #order-confirm-modal .modal-right-pane > div:nth-child(3) { border-top-color: rgba(255,255,255,0.08) !important; }
              html.dark-mode #modal-btn-confirm {
                background: #ffffff !important;
                color: var(--clr-primary, #E31B23) !important;
                border-color: #ffffff !important;
              }
              html.dark-mode #modal-btn-confirm:hover {
                background: #f0f0f0 !important;
                color: var(--clr-primary, #E31B23) !important;
              }
            </style>
        `;

      document.body.insertAdjacentHTML("beforeend", confirmHtml);

      const confirmModal = document.getElementById("order-confirm-modal");

      // Close on outside click for confirm modal
      confirmModal.addEventListener("click", (e) => {
        if (e.target === confirmModal) {
          confirmModal.remove();
        }
      });

      // Handle Back / Cancel
      confirmModal.querySelectorAll(".confirm-modal-back").forEach((btn) => {
        btn.addEventListener("click", () => {
          confirmModal.remove();
        });
      });

      // Handle Confirm Order
      confirmModal.querySelectorAll(".confirm-modal-submit").forEach((btn) => {
        btn.addEventListener("click", () => {
          let orders = JSON.parse(localStorage.getItem("hdm_orders")) || [];
          orders.unshift(newOrder);
          localStorage.setItem("hdm_orders", JSON.stringify(orders));

          window.CartManager.state.items = [];
          window.CartManager.save();
          confirmModal.remove();
          closeModal();
          window.location.href = window.location.pathname.includes("/pages/")
            ? "orders.html"
            : "pages/orders.html";
        });
      });
    });
})();

// ===== FIXES PATCH =====
// 1. Cart badge: hide by default until items added
(function hideBadgeDefault() {
  // Inject a style that hides badge until JS reveals it
  const style = document.createElement("style");
  style.textContent = `
        a[href*="cart.html"] .badge { display: none !important; }
        a[href*="cart.html"] .badge.has-items { display: flex !important; }
    `;
  document.head.appendChild(style);

  // After CartManager initializes, it will set display via updateUI
  // We also watch for the badge to be set to "flex" by updateUI and apply has-items class
  const observer = new MutationObserver(() => {
    document
      .querySelectorAll('a[href*="cart.html"] .badge')
      .forEach((badge) => {
        const count = parseInt(badge.textContent) || 0;
        if (count > 0) {
          badge.classList.add("has-items");
        } else {
          badge.classList.remove("has-items");
        }
      });
  });

  // Observe badge changes after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      document.querySelectorAll('a[href*="cart.html"] .badge').forEach((b) => {
        observer.observe(b, {
          characterData: true,
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["style"],
        });
      });
    });
  } else {
    document.querySelectorAll('a[href*="cart.html"] .badge').forEach((b) => {
      observer.observe(b, {
        characterData: true,
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style"],
      });
    });
  }
})();

// 2. Orders page: comprehensive renderer with full details and fixed progress pipeline
(function fixOrdersPage() {
  if (!window.location.pathname.includes("orders.html")) return;

  const STAGES = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Out for Delivery",
    "Delivered",
  ];

  function getProgressPercent(statusIndex) {
    if (statusIndex <= 0) return 0;
    if (statusIndex >= STAGES.length - 1) return 100;
    return (statusIndex / (STAGES.length - 1)) * 100;
  }

  function handleReorder(orderId) {
    let orders = JSON.parse(localStorage.getItem("hdm_orders")) || [];
    let orderToClone = orders.find((o) => o.id == orderId);
    if (!orderToClone) return;

    let newOrder = JSON.parse(JSON.stringify(orderToClone)); // Deep clone
    newOrder.id = Math.floor(100000 + Math.random() * 900000);
    newOrder.date =
      new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
    newOrder.timestamp = Date.now();
    newOrder.status = "Pending";
    delete newOrder.lastUpdated;
    delete newOrder.statusTimestamps;
    delete newOrder._elapsed;

    orders.unshift(newOrder);
    localStorage.setItem("hdm_orders", JSON.stringify(orders));

    // Show success and reload
    alert("Order #" + orderId + " reordered successfully!");
    window.location.reload();
  }

  function renderFullOrders() {
    const wrapper = document.querySelector(".dynamic-orders-wrapper");
    const emptyState = document.querySelector(".empty-orders-state");
    if (!wrapper) return;

    let orders = JSON.parse(localStorage.getItem("hdm_orders")) || [];
    const STAGE_DELAY_MS = 6000;

    if (orders.length === 0) {
      wrapper.style.display = "none";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    wrapper.style.display = "block";
    if (emptyState) emptyState.style.display = "none";

    let needsUpdate = false;
    let html = "";

    orders.forEach((order) => {
      let STAGES = ["Confirmed", "Preparing", "Out for Delivery", "Delivered"];
      if (order.type === "Pickup" || order.type === "Takeaway") {
        STAGES = ["Confirmed", "Preparing", "Ready", "Delivered"];
      }
      if (order.status === "Cancelled") {
        STAGES.push("Cancelled");
      } else if (order.status === "Refunded") {
        STAGES.push("Refunded");
      }

      let currentStatusIndex = STAGES.indexOf(order.status);
      if (currentStatusIndex === -1) {
        if (order.status === "New" || order.status === "Accepted") {
          currentStatusIndex =
            STAGES.indexOf("Confirmed") !== -1
              ? STAGES.indexOf("Confirmed")
              : 0;
        } else if (order.status === "Picked Up") {
          currentStatusIndex = STAGES.indexOf("Delivered");
        } else {
          currentStatusIndex = 0;
        }
      }

      const now = Date.now();
      if (!order.lastUpdated) order.lastUpdated = now;

      let progressPercent = 0;
      if (currentStatusIndex > 0) {
        progressPercent =
          currentStatusIndex >= STAGES.length - 1
            ? 100
            : (currentStatusIndex / (STAGES.length - 1)) * 100;
      }

      const isDelivered =
        order.status === "Delivered" ||
        order.status === "Picked Up" ||
        order.status === "Completed" ||
        order.status === "Cancelled" ||
        order.status === "Refunded";

      // Build timeline steps
      const stepsHtml = STAGES.map((stage, idx) => {
        let cls = "timeline-step";
        if (idx < currentStatusIndex) cls += " completed";
        else if (idx === currentStatusIndex && !isDelivered)
          cls += " pulsing completed";
        else if (idx === currentStatusIndex && isDelivered) cls += " completed";

        let displayStage = stage;
        if (order.type === "Pickup" || order.type === "Takeaway") {
          if (stage === "Confirmed") displayStage = "Confirm";
          else if (stage === "Ready") displayStage = "Ready for Pickup";
          else if (stage === "Delivered") displayStage = "Picked Up";
        } else {
          if (stage === "Confirmed") displayStage = "Accept";
        }
        if (stage === "Cancelled") displayStage = "Cancel";

        let colorOverrides = "";
        if (stage === "Cancelled")
          colorOverrides =
            "color: var(--clr-danger); border-color: var(--clr-danger);";
        if (stage === "Refunded")
          colorOverrides =
            "color: var(--clr-info); border-color: var(--clr-info);";

        const stepTime =
          (order.statusTimestamps && order.statusTimestamps[stage]) ||
          (idx === 0 ? order.time : "");

        return `<div class="${cls}" style="${colorOverrides}"><div class="step-icon" style="${colorOverrides ? "border-color:inherit;background:currentColor;" : ""}"></div><span style="${colorOverrides}">${displayStage}${stepTime ? `<br><small style="font-size:0.65rem;opacity:0.75;">${stepTime}</small>` : ""}</span></div>`;
      }).join("");

      // Build items html with images and full details
      let itemsHtml = "";
      if (order.items && order.items.length > 0) {
        itemsHtml = order.items
          .map((item) => {
            let imgPath = item.image || "";
            if (imgPath && !window.location.pathname.includes("/pages/")) {
              imgPath = imgPath.replace("../", "./");
            }
            const itemPrice = item.basePrice || item.price || 0;
            const itemTotal = itemPrice * item.qty;
            const sizeText = item.size
              ? `<span style="font-size:0.8rem;color:var(--clr-text-secondary);">Size: ${item.size}</span>`
              : "";
            const extrasText =
              item.extras && item.extras.length > 0
                ? `<span style="font-size:0.8rem;color:var(--clr-text-secondary);">+ ${item.extras.join(", ")}</span>`
                : "";
            return `
                        <div style="display:flex;gap:0.75rem;align-items:flex-start;padding:0.75rem 0;border-bottom:1px solid var(--clr-border);">
                            ${imgPath ? `<img loading="lazy" src="${imgPath}" alt="${item.title}" style="width:52px;height:52px;border-radius:8px;object-fit:cover;flex-shrink:0;">` : `<div style="width:52px;height:52px;border-radius:8px;background:var(--clr-primary);opacity:0.2;flex-shrink:0;"></div>`}
                            <div style="flex:1;min-width:0;">
                                <p style="font-weight:600;font-size:0.9rem;margin:0 0 0.2rem;color:var(--clr-text-primary);">${item.title} <span style="color:var(--clr-text-secondary);">x${item.qty}</span></p>
                                ${sizeText}
                                ${extrasText}
                            </div>
                            <span style="font-weight:700;font-size:0.9rem;color:var(--clr-text-primary);white-space:nowrap;flex-shrink:0;">Rs ${itemTotal}</span>
                        </div>`;
          })
          .join("");
      }

      // Customer info section
      const cust = order.customer || {};
      const custHtml =
        cust.phone || cust.name || cust.address
          ? `
                <div style="background:rgba(0,0,0,0.03);border-left:3px solid var(--clr-primary);border-radius:0 8px 8px 0;padding:0.75rem 1rem;margin-bottom:1rem;font-size:0.88rem;">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.3rem 1rem;">
                        ${cust.name ? `<div style="grid-column:1/-1;"><span style="color:var(--clr-text-secondary);font-weight:600;">Name:</span> <span style="color:var(--clr-text-primary);">${cust.name}</span></div>` : ""}
                        ${cust.phone ? `<div style="grid-column:1/-1;"><span style="color:var(--clr-text-secondary);font-weight:600;">Phone:</span> <span style="color:var(--clr-text-primary);">${cust.phone}</span></div>` : ""}
                        ${cust.email ? `<div style="grid-column:1/-1;"><span style="color:var(--clr-text-secondary);font-weight:600;">Email:</span> <span style="color:var(--clr-text-primary);">${cust.email}</span></div>` : ""}
                        ${cust.address && cust.address !== "Pickup" ? `<div style="grid-column:1/-1;"><span style="color:var(--clr-text-secondary);font-weight:600;">Address:</span> <span style="color:var(--clr-text-primary);">${cust.address}</span></div>` : ""}
                        ${cust.city ? `<div style="grid-column:1/-1;"><span style="color:var(--clr-text-secondary);font-weight:600;">Area/City:</span> <span style="color:var(--clr-text-primary);">${cust.city}</span></div>` : ""}
                        ${cust.notes ? `<div style="grid-column:1/-1;"><span style="color:var(--clr-text-secondary);font-weight:600;">Notes:</span> <span style="color:var(--clr-text-primary);">${cust.notes}</span></div>` : ""}
                    </div>
                </div>`
          : "";

      // Totals
      const subtotal = order.items
        ? order.items.reduce(
            (sum, i) => sum + (i.basePrice || i.price || 0) * i.qty,
            0,
          )
        : order.total;
      const deliveryFee = order.type === "Pickup" ? 0 : 12;
      const grandTotal = order.total || subtotal + deliveryFee;

      const statusBadgeColor = isDelivered ? "#e8f5e9" : "rgba(167,2,1,0.1)";
      const statusTextColor = isDelivered ? "#2e7d32" : "var(--clr-primary)";
      let timeDisplayStr = "Est. Delivery: ~35 mins";
      if (order.type === "Pickup") {
        const pTime = order.pickupTime || "ASAP";
        if (pTime === "ASAP") {
          timeDisplayStr = "Est. Pickup: ~20 mins";
        } else {
          let formattedTime = pTime;
          if (pTime.includes(":")) {
            const [h, m] = pTime.split(":");
            const hInt = parseInt(h);
            const ampm = hInt >= 12 ? "PM" : "AM";
            const h12 = hInt % 12 || 12;
            formattedTime = `${h12}:${m} ${ampm}`;
          }
          timeDisplayStr = `Scheduled Pickup: ${formattedTime}`;
        }
      }

      html += `
            <div class="order-card" style="margin-bottom:1.5rem;padding:1.5rem;background:var(--clr-bg-app);border-radius:12px;border:1px solid var(--clr-border);">
                <!-- Header -->
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem;border-bottom:1px solid var(--clr-border);padding-bottom:1rem;">
                    <div>
                        <h4 style="margin:0 0 0.4rem;font-size:1.1rem;color:var(--clr-text-primary);">Order #${order.id}</h4>
                        <p style="margin:0 0 0.6rem;font-size:0.85rem;color:var(--clr-text-secondary);">${order.date}</p>
                        <p style="margin:0;font-size:0.85rem;color:var(--clr-text-secondary);">
                            ${order.type ? `<strong>${order.type}</strong> &bull; ` : ""}
                            ${order.paymentMethod || "Cash on Delivery"}
                        </p>
                    </div>
                    <span style="background:${statusBadgeColor};color:${statusTextColor};font-size:0.78rem;font-weight:700;padding:0.3rem 0.8rem;border-radius:50px;text-transform:uppercase;">${order.status}</span>
                </div>
                
                <!-- Progress Timeline -->
                <div class="order-timeline" style="margin-bottom:1.5rem;">
                    <div class="timeline-track">
                        <div class="timeline-progress" style="width:${progressPercent}%;"></div>
                    </div>
                    ${stepsHtml}
                </div>
                
                ${!isDelivered ? `<p style="font-size:0.85rem;color:var(--clr-primary);font-weight:600;margin:0 0 1rem;display:flex;align-items:center;gap:0.4rem;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>${timeDisplayStr}</p>` : `<p style="font-size:0.85rem;color:#2e7d32;font-weight:600;margin:0 0 1rem;display:flex;align-items:center;gap:0.4rem;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>${order.type === "Pickup" ? "Picked Up Successfully" : "Delivered Successfully"}</p>`}
                
                <!-- Customer Details -->
                ${custHtml}
                
                <!-- Order Items -->
                <div style="border-top:1px solid var(--clr-border);padding-top:0.75rem;margin-bottom:0.75rem;">
                    ${itemsHtml}
                </div>
                
                <!-- Totals -->
                <div style="border-top:1px solid var(--clr-border);padding-top:0.75rem;">
                    ${
                      subtotal !== grandTotal
                        ? `
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.3rem;font-size:0.88rem;color:var(--clr-text-secondary);">
                        <span>Subtotal</span><span>Rs ${subtotal}</span>
                    </div>
                    ${deliveryFee > 0 ? `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;font-size:0.88rem;color:var(--clr-text-secondary);"><span>Delivery Fee</span><span>Rs ${deliveryFee}</span></div>` : ""}`
                        : ""
                    }
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <span style="font-size:0.9rem;font-weight:600;color:var(--clr-text-primary);">Total</span>
                        <span style="font-size:1.15rem;font-weight:800;color:var(--clr-text-primary);">Rs ${grandTotal}</span>
                    </div>
                </div>
                
                <!-- Actions -->
                <div style="margin-top:1rem;display:flex;gap:0.75rem;flex-wrap:wrap;">
                    <a href="javascript:void(0)" class="btn btn-primary reorder-btn" data-order-id="${order.id}" style="border-radius:50px;padding:0.6rem 1.25rem;font-size:0.85rem;font-weight:600;text-decoration:none;">Reorder</a>
                </div>
            </div>`;
    });

    if (wrapper.innerHTML !== html) {
      wrapper.innerHTML = html;
      // Bind reorder buttons
      wrapper.querySelectorAll(".reorder-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const orderId = e.target.getAttribute("data-order-id");
          handleReorder(orderId);
        });
      });
    }

    if (needsUpdate) {
      localStorage.setItem("hdm_orders", JSON.stringify(orders));
    }
  }

  // Run immediately and then on interval
  document.addEventListener("DOMContentLoaded", () => {
    renderFullOrders();
    setInterval(renderFullOrders, 1500);
  });

  // Also run now if DOM is already ready
  if (document.readyState !== "loading") {
    renderFullOrders();
    setInterval(renderFullOrders, 1500);
  }
})();

// 3. MASTER INTERCEPTOR FOR MODALS
// Catch all clicks globally so it doesn't matter when DOM elements are injected
document.body.addEventListener(
  "click",
  function (e) {
    // 1. Contact buttons (phone icon in header AND hamburger menu contact link)
    const isContactBtn =
      e.target.closest(".contact-header-btn") ||
      e.target.closest("#contact-header-btn");
    const isContactLink =
      e.target.closest("a") &&
      (e.target.closest("a").getAttribute("href") || "").includes(
        "contact.html",
      );

    if (isContactBtn || (isContactLink && !e.target.closest(".footer"))) {
      e.preventDefault();
      e.stopPropagation();

      // Close mobile menu if open
      const navCenter = document.querySelector(".nav-center");
      const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
      if (navCenter) navCenter.classList.remove("active");
      if (mobileMenuBtn) mobileMenuBtn.classList.remove("open");

      // Open Contact Modal
      const cm = document.getElementById("contact-modal");
      if (cm) {
        if (typeof window._tl_openModal === "function") {
          window._tl_openModal(cm, "contact-modal");
        } else {
          cm.classList.add("active");
          if (window.matchMedia('(max-width: 768px)').matches) {
            void 0;
          }
        }
      }
      return;
    }

    // 2. Cart buttons (Header cart icon AND floating bottom bar)
    const isCartLink =
      e.target.closest(".cart-icon-link") ||
      (e.target.closest("a") &&
        ((e.target.closest("a").getAttribute("href") || "").includes(
          "cart.html",
        ) ||
          (e.target.closest("a").getAttribute("href") || "").includes(
            "checkout.html",
          )));
    const isFloatingCart = e.target.closest(".floating-cart-bar");

    if (isCartLink || isFloatingCart) {
      e.preventDefault();
      e.stopPropagation();

      // Open Cart Modal
      const cartModal = document.getElementById("custom-cart-modal");
      if (cartModal) {
        cartModal.classList.add("active");
        if (window.matchMedia('(max-width: 768px)').matches) {
          void 0;
        }
        if (typeof window._renderCC === "function") {
          window._renderCC();
          document.getElementById("cc-cart-view").style.display = "block";
          document.getElementById("cc-checkout-view").style.display = "none";
          document.getElementById("cc-modal-title").textContent = "Your Cart";
        }
      }
      return;
    }
  },
  true,
); // Use capture phase to guarantee we beat other inline or attached listeners

// ============================================================
// CUSTOMER ORDERS PAGE — Enhanced Renderer (replaces old ie())
// ============================================================
(function () {
  "use strict";
  if (!window.location.pathname.includes("orders.html")) return;

  function fmt(n) {
    return "Rs " + Number(n || 0).toLocaleString();
  }

  var DELIVERY_STEPS = [
    { key: "Pending", label: "Confirmed" },
    { key: "Accepted", label: "Accepted" },
    { key: "Preparing", label: "Preparing" },
    { key: "Out for Delivery", label: "Out for Delivery" },
    { key: "Delivered", label: "Delivered" },
  ];
  var PICKUP_STEPS = [
    { key: "Pending", label: "Confirmed" },
    { key: "Accepted", label: "Accepted" },
    { key: "Preparing", label: "Preparing" },
    { key: "Ready", label: "Ready for Pickup" },
    { key: "Completed", label: "Picked Up" },
  ];
  var STATUS_RANK = {
    Pending: 0,
    New: 0,
    Accepted: 1,
    "Sent for Preparing": 1,
    Preparing: 2,
    "Out for Delivery": 3,
    Dispatched: 3,
    Ready: 3,
    Delivered: 4,
    Completed: 4,
  };

  function isPickup(o) {
    var t = (o.type || "").toLowerCase();
    return t === "pickup" || t === "takeaway";
  }
  function getActiveIdx(o) {
    if (o.status === "Cancelled") return -1;
    return STATUS_RANK[o.status] !== undefined ? STATUS_RANK[o.status] : 0;
  }
  function statusStyle(s) {
    var sl = (s || "").toLowerCase();
    if (sl === "delivered" || sl === "completed" || sl === "ready")
      return "background:#e8f5e9;color:#2e7d32;";
    if (sl === "cancelled") return "background:#ffebee;color:#c62828;";
    if (sl === "preparing" || sl === "out for delivery")
      return "background:#fff3e0;color:#e65100;";
    return "background:#e3f2fd;color:#0d47a1;";
  }

  function buildTimeline(order) {
    var steps = isPickup(order) ? PICKUP_STEPS : DELIVERY_STEPS;
    var ai = getActiveIdx(order);
    var isCancelled = order.status === "Cancelled";
    var pct =
      ai < 0 || steps.length < 2
        ? 0
        : Math.min(100, Math.round((ai / (steps.length - 1)) * 100));

    var stepsHtml = steps
      .map(function (step, i) {
        var cls =
          !isCancelled && i < ai
            ? "completed"
            : !isCancelled && i === ai
              ? "pulsing"
              : "";
        return (
          '<div class="timeline-step ' +
          cls +
          '"><div class="step-icon"></div><span>' +
          step.label +
          "</span></div>"
        );
      })
      .join("");

    var etaMsg = "";
    if (!isCancelled) {
      if (order.status === "Out for Delivery")
        etaMsg = "Arriving soon — please be available.";
      else if (order.status === "Delivered")
        etaMsg = "Order delivered. Enjoy your meal!";
      else if (order.status === "Ready")
        etaMsg = "Your order is ready for pickup!";
      else if (order.status === "Completed")
        etaMsg = isPickup(order) ? "Order picked up!" : "Order completed!";
      else
        etaMsg = isPickup(order)
          ? "Est. pickup: 15–25 mins"
          : "Est. delivery: 30–45 mins";
    }

    return (
      '<div style="background:var(--clr-bg-app,#f9f9f9);padding:1.25rem;border-radius:12px;margin-top:1rem;">' +
      (etaMsg
        ? '<p style="font-size:0.88rem;font-weight:600;color:var(--clr-text-primary);margin:0 0 0.75rem 0;">' +
          etaMsg +
          "</p>"
        : "") +
      '<div class="order-timeline"><div class="timeline-track"><div class="timeline-progress" style="width:' +
      pct +
      '%;"></div></div>' +
      stepsHtml +
      "</div>" +
      (isCancelled
        ? '<p style="color:#c62828;font-size:0.82rem;margin-top:0.5rem;text-align:center;">This order was cancelled.</p>'
        : "") +
      "</div>"
    );
  }

  function buildCard(order) {
    var itemsHtml = (order.items || [])
      .map(function (item) {
        var name = item.title || item.name || "";
        var ex = [];
        if (item.size) ex.push(item.size);
        if (item.extras && item.extras.length) ex = ex.concat(item.extras);
        return (
          '<div style="display:flex;justify-content:space-between;font-size:0.88rem;margin-bottom:0.25rem;">' +
          "<span><strong>" +
          (item.qty || 1) +
          "x</strong> " +
          name +
          (ex.length
            ? ' <span style="color:var(--clr-text-secondary,#888);font-size:0.8em;">(' +
              ex.join(", ") +
              ")</span>"
            : "") +
          "</span>" +
          "</div>"
        );
      })
      .join("");

    var delivBox = "";
    if (!isPickup(order) && order.customer) {
      delivBox =
        '<div style="margin:0.6rem 0;font-size:0.83rem;color:var(--clr-text-secondary,#666);border-left:3px solid var(--clr-primary);padding-left:0.75rem;">' +
        '<p style="margin:0 0 0.1rem 0;"><strong>Deliver to:</strong> ' +
        (order.customer.name || "") +
        (order.customer.phone ? " · " + order.customer.phone : "") +
        "</p>" +
        (order.customer.address
          ? '<p style="margin:0;">' +
            order.customer.address +
            (order.customer.city ? ", " + order.customer.city : "") +
            "</p>"
          : "") +
        "</div>";
    }

    var isActive =
      order.status !== "Delivered" &&
      order.status !== "Completed" &&
      order.status !== "Cancelled";
    var border = isActive
      ? "var(--clr-primary,#a70201)"
      : "var(--clr-border,#eee)";

    var dateStr = "";
    if (order.timestamp) {
      var d = new Date(order.timestamp);
      dateStr =
        d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }) +
        " · " +
        d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    } else if (order.date) {
      dateStr = order.date;
    }

    return (
      '<div class="order-card" style="background:var(--clr-surface,#fff);border-radius:16px;padding:1.5rem;margin-bottom:1.5rem;box-shadow:0 4px 15px rgba(0,0,0,0.06);border:2px solid ' +
      border +
      ';">' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid var(--clr-border,#eee);padding-bottom:0.75rem;margin-bottom:0.75rem;">' +
      "<div>" +
      '<div style="display:flex;align-items:center;gap:0.4rem;margin-bottom:0.35rem;">' +
      '<span style="' +
      statusStyle(order.status) +
      'padding:0.2rem 0.65rem;border-radius:50px;font-size:0.73rem;font-weight:700;">' +
      (order.status || "Pending") +
      "</span>" +
      '<span style="font-size:0.73rem;color:var(--clr-text-secondary,#888);">' +
      (isPickup(order) ? "🏪 Pickup" : "🛵 Delivery") +
      "</span>" +
      "</div>" +
      '<h3 style="margin:0 0 0.1rem 0;font-size:1.05rem;color:var(--clr-text-primary);">Order #' +
      order.id +
      "</h3>" +
      '<span style="color:var(--clr-text-secondary,#888);font-size:0.78rem;">' +
      dateStr +
      "</span>" +
      "</div>" +
      '<div style="text-align:right;">' +
      '<span style="font-weight:700;font-size:1.1rem;color:var(--clr-text-primary);display:block;">' +
      fmt(order.total) +
      "</span>" +
      '<span style="font-size:0.76rem;color:var(--clr-text-secondary,#888);">' +
      (order.items || []).reduce(function (s, i) {
        return s + (i.qty || 1);
      }, 0) +
      " items</span>" +
      "</div>" +
      "</div>" +
      '<div style="margin-bottom:0.5rem;">' +
      itemsHtml +
      "</div>" +
      delivBox +
      buildTimeline(order) +
      '<div style="margin-top:0.9rem;display:flex;justify-content:flex-end;">' +
      '<button class="btn btn-outline reorder-btn" data-order-id="' +
      order.id +
      '" style="font-size:0.8rem;padding:0.35rem 0.9rem;border-radius:50px;cursor:pointer;font-weight:600;">↩ Reorder</button>' +
      "</div>" +
      "</div>"
    );
  }

  function renderOrders() {
    var wrapper = document.querySelector(".dynamic-orders-wrapper");
    if (!wrapper) return;
    var orders = [];
    try {
      orders = JSON.parse(localStorage.getItem("hdm_orders")) || [];
    } catch (e) {}
    var emptyState = document.querySelector(".empty-orders-state");
    if (orders.length === 0) {
      wrapper.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
      return;
    }
    if (emptyState) emptyState.style.display = "none";
    wrapper.innerHTML = orders.map(buildCard).join("");
    attachReorderHandlers(orders);
  }

  function attachReorderHandlers(orders) {
    document.querySelectorAll(".reorder-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-order-id");
        var orig = orders.find(function (o) {
          return String(o.id) === String(id);
        });
        if (orig) showReorderModal(orig);
      });
    });
  }

  function showReorderModal(orig) {
    var prev = document.getElementById("reorder-confirm-modal");
    if (prev) prev.remove();

    var itemsHtml = (orig.items || [])
      .map(function (i) {
        return (
          '<div style="font-size:0.88rem;padding:0.25rem 0;">' +
          "<strong>" +
          (i.qty || 1) +
          "x</strong> " +
          (i.title || i.name || "") +
          "</div>"
        );
      })
      .join("");

    var modal = document.createElement("div");
    modal.id = "reorder-confirm-modal";
    modal.style.cssText =
      "position:fixed;inset:0;z-index:100010;display:flex;align-items:center;justify-content:center;padding:1rem;background:rgba(0,0,0,0.55);";
    modal.innerHTML =
      '<div style="background:var(--clr-surface,#fff);border-radius:20px;max-width:400px;width:100%;padding:2rem;box-shadow:0 20px 60px rgba(0,0,0,0.3);">' +
      '<h3 style="margin:0 0 0.4rem 0;font-size:1.25rem;color:var(--clr-text-primary);">Reorder #' +
      orig.id +
      "</h3>" +
      '<p style="color:var(--clr-text-secondary,#666);font-size:0.88rem;margin:0 0 1rem 0;">Add these items to your cart?</p>' +
      '<div style="background:var(--clr-bg-app,#f9f9f9);border-radius:10px;padding:1rem;margin-bottom:1.5rem;">' +
      itemsHtml +
      "</div>" +
      '<div style="display:flex;gap:0.75rem;">' +
      '<button id="reorder-cancel-btn" class="btn" style="flex:1;border-radius:50px;padding:0.75rem;background:#888;color:#fff;border:none;cursor:pointer;font-weight:600;">Cancel</button>' +
      '<button id="reorder-confirm-btn" class="btn btn-primary" style="flex:2;border-radius:50px;padding:0.75rem;cursor:pointer;font-weight:700;">Yes, Reorder</button>' +
      "</div>" +
      "</div>";
    document.body.appendChild(modal);

    document.getElementById("reorder-cancel-btn").onclick = function () {
      modal.remove();
    };
    modal.addEventListener("click", function (e) {
      if (e.target === modal) modal.remove();
    });
    document.getElementById("reorder-confirm-btn").onclick = function () {
      if (window.CartManager) {
        (orig.items || []).forEach(function (item) {
          window.CartManager.addItem({
            title: item.title || item.name || "",
            image: item.image || "",
            basePrice: item.basePrice || 0,
            size: item.size || null,
            extras: item.extras || [],
            addonsTotal: item.addonsTotal || 0,
            qty: item.qty || 1,
          });
        });
      }
      modal.remove();
      window.location.href = "cart.html";
    };
  }

  // Live updates: storage event (instant) + 30s polling
  window.addEventListener("storage", function (e) {
    if (e.key === "hdm_orders") renderOrders();
  });
  setInterval(renderOrders, 30000);

  // Boot after DOM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderOrders);
  } else {
    renderOrders();
  }
})();
