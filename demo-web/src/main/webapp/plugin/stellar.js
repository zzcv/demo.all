/*!
 * Stellar.js v0.6.2
 * http://markdalgleish.com/projects/stellar.js
 * 
 * Copyright 2013, Mark Dalgleish
 * This content is released under the MIT license
 * http://markdalgleish.mit-license.org
 */
(function(f, k, m, d) {
	var j = "stellar",
	e = {
		scrollProperty: "scroll",
		positionProperty: "position",
		horizontalScrolling: true,
		verticalScrolling: true,
		horizontalOffset: 0,
		verticalOffset: 0,
		responsive: false,
		parallaxBackgrounds: true,
		parallaxElements: true,
		hideDistantElements: true,
		hideElement: function(p) {
			p.hide()
		},
		showElement: function(p) {
			p.show()
		}
	},
	g = {
		scroll: {
			getLeft: function(p) {
				return p.scrollLeft()
			},
			setLeft: function(p, q) {
				p.scrollLeft(q)
			},
			getTop: function(p) {
				return p.scrollTop()
			},
			setTop: function(p, q) {
				p.scrollTop(q)
			}
		},
		position: {
			getLeft: function(p) {
				return parseInt(p.css("left"), 10) * -1
			},
			getTop: function(p) {
				return parseInt(p.css("top"), 10) * -1
			}
		},
		margin: {
			getLeft: function(p) {
				return parseInt(p.css("margin-left"), 10) * -1
			},
			getTop: function(p) {
				return parseInt(p.css("margin-top"), 10) * -1
			}
		},
		transform: {
			getLeft: function(q) {
				var p = getComputedStyle(q[0])[i];
				return (p !== "none" ? parseInt(p.match(/(-?[0-9]+)/g)[4], 10) * -1 : 0)
			},
			getTop: function(q) {
				var p = getComputedStyle(q[0])[i];
				return (p !== "none" ? parseInt(p.match(/(-?[0-9]+)/g)[5], 10) * -1 : 0)
			}
		}
	},
	l = {
		position: {
			setLeft: function(p, q) {
				p.css("left", q)
			},
			setTop: function(p, q) {
				p.css("top", q)
			}
		},
		transform: {
			setPosition: function(r, t, q, s, p) {
				r[0].style[i] = "translate3d(" + (t - q) + "px, " + (s - p) + "px, 0)"
			}
		}
	},
	a = (function() {
		var r = /^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/,
		p = f("script")[0].style,
		q = "",
		s;
		for (s in p) {
			if (r.test(s)) {
				q = s.match(r)[0];
				break
			}
		}
		if ("WebkitOpacity" in p) {
			q = "Webkit"
		}
		if ("KhtmlOpacity" in p) {
			q = "Khtml"
		}
		return function(t) {
			return q + (q.length > 0 ? t.charAt(0).toUpperCase() + t.slice(1) : t)
		}
	} ()),
	i = a("transform"),
	c = f("<div />", {
		style: "background:#fff"
	}).css("background-position-x") !== d,
	b = (c ?
	function(q, p, r) {
		q.css({
			"background-position-x": p,
			"background-position-y": r
		})
	}: function(q, p, r) {
		q.css("background-position", p + " " + r)
	}),
	h = (c ?
	function(p) {
		return [p.css("background-position-x"), p.css("background-position-y")]
	}: function(p) {
		return p.css("background-position").split(" ")
	}),
	n = (k.requestAnimationFrame || k.webkitRequestAnimationFrame || k.mozRequestAnimationFrame || k.oRequestAnimationFrame || k.msRequestAnimationFrame ||
	function(p) {
		setTimeout(p, 1000 / 60)
	});
	function o(q, p) {
		this.element = q;
		this.options = f.extend({},
		e, p);
		this._defaults = e;
		this._name = j;
		this.init()
	}
	o.prototype = {
		init: function() {
			this.options.name = j + "_" + Math.floor(Math.random() * 1000000000);
			this._defineElements();
			this._defineGetters();
			this._defineSetters();
			this._handleWindowLoadAndResize();
			this._detectViewport();
			this.refresh({
				firstLoad: true
			});
			if (this.options.scrollProperty === "scroll") {
				this._handleScrollEvent()
			} else {
				this._startAnimationLoop()
			}
		},
		_defineElements: function() {
			if (this.element === m.body) {
				this.element = k
			}
			this.$scrollElement = f(this.element);
			this.$element = (this.element === k ? f("body") : this.$scrollElement);
			this.$viewportElement = (this.options.viewportElement !== d ? f(this.options.viewportElement) : (this.$scrollElement[0] === k || this.options.scrollProperty === "scroll" ? this.$scrollElement: this.$scrollElement.parent()))
		},
		_defineGetters: function() {
			var p = this,
			q = g[p.options.scrollProperty];
			this._getScrollLeft = function() {
				return q.getLeft(p.$scrollElement)
			};
			this._getScrollTop = function() {
				return q.getTop(p.$scrollElement)
			}
		},
		_defineSetters: function() {
			var p = this,
			s = g[p.options.scrollProperty],
			q = l[p.options.positionProperty],
			r = s.setLeft,
			t = s.setTop;
			this._setScrollLeft = (typeof r === "function" ?
			function(u) {
				r(p.$scrollElement, u)
			}: f.noop);
			this._setScrollTop = (typeof t === "function" ?
			function(u) {
				t(p.$scrollElement, u)
			}: f.noop);
			this._setPosition = q.setPosition ||
			function(w, y, v, x, u) {
				if (p.options.horizontalScrolling) {
					q.setLeft(w, y, v)
				}
				if (p.options.verticalScrolling) {
					q.setTop(w, x, u)
				}
			}
		},
		_handleWindowLoadAndResize: function() {
			var p = this,
			q = f(k);
			if (p.options.responsive) {
				q.bind("load." + this.name,
				function() {
					p.refresh()
				})
			}
			q.bind("resize." + this.name,
			function() {
				p._detectViewport();
				if (p.options.responsive) {
					p.refresh()
				}
			})
		},
		refresh: function(r) {
			var q = this,
			s = q._getScrollLeft(),
			p = q._getScrollTop();
			if (!r || !r.firstLoad) {
				this._reset()
			}
			this._setScrollLeft(0);
			this._setScrollTop(0);
			this._setOffsets();
			this._findParticles();
			this._findBackgrounds();
			if (r && r.firstLoad && /WebKit/.test(navigator.userAgent)) {
				f(k).load(function() {
					var u = q._getScrollLeft(),
					t = q._getScrollTop();
					q._setScrollLeft(u + 1);
					q._setScrollTop(t + 1);
					q._setScrollLeft(u);
					q._setScrollTop(t)
				})
			}
			this._setScrollLeft(s);
			this._setScrollTop(p)
		},
		_detectViewport: function() {
			var q = this.$viewportElement.offset(),
			p = q !== null && q !== d;
			this.viewportWidth = this.$viewportElement.width();
			this.viewportHeight = this.$viewportElement.height();
			this.viewportOffsetTop = (p ? q.top: 0);
			this.viewportOffsetLeft = (p ? q.left: 0)
		},
		_findParticles: function() {
			var p = this,
			s = this._getScrollLeft(),
			r = this._getScrollTop();
			if (this.particles !== d) {
				for (var q = this.particles.length - 1; q >= 0; q--) {
					this.particles[q].$element.data("stellar-elementIsActive", d)
				}
			}
			this.particles = [];
			if (!this.options.parallaxElements) {
				return
			}
			this.$element.find("[data-stellar-ratio]").each(function(A) {
				var E = f(this),
				C,
				H,
				u,
				D,
				z,
				t,
				G,
				y,
				w,
				B = 0,
				F = 0,
				v = 0,
				x = 0;
				if (!E.data("stellar-elementIsActive")) {
					E.data("stellar-elementIsActive", this)
				} else {
					if (E.data("stellar-elementIsActive") !== this) {
						return
					}
				}
				p.options.showElement(E);
				if (!E.data("stellar-startingLeft")) {
					E.data("stellar-startingLeft", E.css("left"));
					E.data("stellar-startingTop", E.css("top"))
				} else {
					E.css("left", E.data("stellar-startingLeft"));
					E.css("top", E.data("stellar-startingTop"))
				}
				u = E.position().left;
				D = E.position().top;
				z = (E.css("margin-left") === "auto") ? 0 : parseInt(E.css("margin-left"), 10);
				t = (E.css("margin-top") === "auto") ? 0 : parseInt(E.css("margin-top"), 10);
				y = E.offset().left - z;
				w = E.offset().top - t;
				E.parents().each(function() {
					var I = f(this);
					if (I.data("stellar-offset-parent") === true) {
						B = v;
						F = x;
						G = I;
						return false
					} else {
						v += I.position().left;
						x += I.position().top
					}
				});
				C = (E.data("stellar-horizontal-offset") !== d ? E.data("stellar-horizontal-offset") : (G !== d && G.data("stellar-horizontal-offset") !== d ? G.data("stellar-horizontal-offset") : p.horizontalOffset));
				H = (E.data("stellar-vertical-offset") !== d ? E.data("stellar-vertical-offset") : (G !== d && G.data("stellar-vertical-offset") !== d ? G.data("stellar-vertical-offset") : p.verticalOffset));
				p.particles.push({
					$element: E,
					$offsetParent: G,
					isFixed: E.css("position") === "fixed",
					horizontalOffset: C,
					verticalOffset: H,
					startingPositionLeft: u,
					startingPositionTop: D,
					startingOffsetLeft: y,
					startingOffsetTop: w,
					parentOffsetLeft: B,
					parentOffsetTop: F,
					stellarRatio: (E.data("stellar-ratio") !== d ? E.data("stellar-ratio") : 1),
					width: E.outerWidth(true),
					height: E.outerHeight(true),
					isHidden: false
				})
			})
		},
		_findBackgrounds: function() {
			var p = this,
			s = this._getScrollLeft(),
			r = this._getScrollTop(),
			q;
			this.backgrounds = [];
			if (!this.options.parallaxBackgrounds) {
				return
			}
			q = this.$element.find("[data-stellar-background-ratio]");
			if (this.$element.data("stellar-background-ratio")) {
				q = q.add(this.$element)
			}
			q.each(function() {
				var E = f(this),
				u = h(E),
				C,
				H,
				v,
				D,
				A,
				t,
				z,
				x,
				G,
				B = 0,
				F = 0,
				w = 0,
				y = 0;
				if (!E.data("stellar-backgroundIsActive")) {
					E.data("stellar-backgroundIsActive", this)
				} else {
					if (E.data("stellar-backgroundIsActive") !== this) {
						return
					}
				}
				if (!E.data("stellar-backgroundStartingLeft")) {
					E.data("stellar-backgroundStartingLeft", u[0]);
					E.data("stellar-backgroundStartingTop", u[1])
				} else {
					b(E, E.data("stellar-backgroundStartingLeft"), E.data("stellar-backgroundStartingTop"))
				}
				A = (E.css("margin-left") === "auto") ? 0 : parseInt(E.css("margin-left"), 10);
				t = (E.css("margin-top") === "auto") ? 0 : parseInt(E.css("margin-top"), 10);
				z = E.offset().left - A - s;
				x = E.offset().top - t - r;
				E.parents().each(function() {
					var I = f(this);
					if (I.data("stellar-offset-parent") === true) {
						B = w;
						F = y;
						G = I;
						return false
					} else {
						w += I.position().left;
						y += I.position().top
					}
				});
				C = (E.data("stellar-horizontal-offset") !== d ? E.data("stellar-horizontal-offset") : (G !== d && G.data("stellar-horizontal-offset") !== d ? G.data("stellar-horizontal-offset") : p.horizontalOffset));
				H = (E.data("stellar-vertical-offset") !== d ? E.data("stellar-vertical-offset") : (G !== d && G.data("stellar-vertical-offset") !== d ? G.data("stellar-vertical-offset") : p.verticalOffset));
				p.backgrounds.push({
					$element: E,
					$offsetParent: G,
					isFixed: E.css("background-attachment") === "fixed",
					horizontalOffset: C,
					verticalOffset: H,
					startingValueLeft: u[0],
					startingValueTop: u[1],
					startingBackgroundPositionLeft: (isNaN(parseInt(u[0], 10)) ? 0 : parseInt(u[0], 10)),
					startingBackgroundPositionTop: (isNaN(parseInt(u[1], 10)) ? 0 : parseInt(u[1], 10)),
					startingPositionLeft: E.position().left,
					startingPositionTop: E.position().top,
					startingOffsetLeft: z,
					startingOffsetTop: x,
					parentOffsetLeft: B,
					parentOffsetTop: F,
					stellarRatio: (E.data("stellar-background-ratio") === d ? 1 : E.data("stellar-background-ratio"))
				})
			})
		},
		_reset: function() {
			var t, s, r, q, p;
			for (p = this.particles.length - 1; p >= 0; p--) {
				t = this.particles[p];
				s = t.$element.data("stellar-startingLeft");
				r = t.$element.data("stellar-startingTop");
				this._setPosition(t.$element, s, s, r, r);
				this.options.showElement(t.$element);
				t.$element.data("stellar-startingLeft", null).data("stellar-elementIsActive", null).data("stellar-backgroundIsActive", null)
			}
			for (p = this.backgrounds.length - 1; p >= 0; p--) {
				q = this.backgrounds[p];
				q.$element.data("stellar-backgroundStartingLeft", null).data("stellar-backgroundStartingTop", null);
				b(q.$element, q.startingValueLeft, q.startingValueTop)
			}
		},
		destroy: function() {
			this._reset();
			this.$scrollElement.unbind("resize." + this.name).unbind("scroll." + this.name);
			this._animationLoop = f.noop;
			f(k).unbind("load." + this.name).unbind("resize." + this.name)
		},
		_setOffsets: function() {
			var p = this,
			q = f(k);
			q.unbind("resize.horizontal-" + this.name).unbind("resize.vertical-" + this.name);
			if (typeof this.options.horizontalOffset === "function") {
				this.horizontalOffset = this.options.horizontalOffset();
				q.bind("resize.horizontal-" + this.name,
				function() {
					p.horizontalOffset = p.options.horizontalOffset()
				})
			} else {
				this.horizontalOffset = this.options.horizontalOffset
			}
			if (typeof this.options.verticalOffset === "function") {
				this.verticalOffset = this.options.verticalOffset();
				q.bind("resize.vertical-" + this.name,
				function() {
					p.verticalOffset = p.options.verticalOffset()
				})
			} else {
				this.verticalOffset = this.options.verticalOffset
			}
		},
		_repositionElements: function() {
			var v = this._getScrollLeft(),
			s = this._getScrollTop(),
			A,
			E,
			z,
			D,
			q,
			C,
			w,
			u = true,
			p = true,
			y,
			B,
			t,
			r,
			x;
			if (this.currentScrollLeft === v && this.currentScrollTop === s && this.currentWidth === this.viewportWidth && this.currentHeight === this.viewportHeight) {
				return
			} else {
				this.currentScrollLeft = v;
				this.currentScrollTop = s;
				this.currentWidth = this.viewportWidth;
				this.currentHeight = this.viewportHeight
			}
			for (x = this.particles.length - 1; x >= 0; x--) {
				z = this.particles[x];
				D = (z.isFixed ? 1 : 0);
				if (this.options.horizontalScrolling) {
					y = (v + z.horizontalOffset + this.viewportOffsetLeft + z.startingPositionLeft - z.startingOffsetLeft + z.parentOffsetLeft) * -(z.stellarRatio + D - 1) + z.startingPositionLeft;
					t = y - z.startingPositionLeft + z.startingOffsetLeft
				} else {
					y = z.startingPositionLeft;
					t = z.startingOffsetLeft
				}
				if (this.options.verticalScrolling) {
					B = (s + z.verticalOffset + this.viewportOffsetTop + z.startingPositionTop - z.startingOffsetTop + z.parentOffsetTop) * -(z.stellarRatio + D - 1) + z.startingPositionTop;
					r = B - z.startingPositionTop + z.startingOffsetTop
				} else {
					B = z.startingPositionTop;
					r = z.startingOffsetTop
				}
				if (this.options.hideDistantElements) {
					p = !this.options.horizontalScrolling || t + z.width > (z.isFixed ? 0 : v) && t < (z.isFixed ? 0 : v) + this.viewportWidth + this.viewportOffsetLeft;
					u = !this.options.verticalScrolling || r + z.height > (z.isFixed ? 0 : s) && r < (z.isFixed ? 0 : s) + this.viewportHeight + this.viewportOffsetTop
				}
				if (p && u) {
					if (z.isHidden) {
						this.options.showElement(z.$element);
						z.isHidden = false
					}
					this._setPosition(z.$element, y, z.startingPositionLeft, B, z.startingPositionTop)
				} else {
					if (!z.isHidden) {
						this.options.hideElement(z.$element);
						z.isHidden = true
					}
				}
			}
			for (x = this.backgrounds.length - 1; x >= 0; x--) {
				q = this.backgrounds[x];
				D = (q.isFixed ? 0 : 1);
				C = (this.options.horizontalScrolling ? (v + q.horizontalOffset - this.viewportOffsetLeft - q.startingOffsetLeft + q.parentOffsetLeft - q.startingBackgroundPositionLeft) * (D - q.stellarRatio) + "px": q.startingValueLeft);
				w = (this.options.verticalScrolling ? (s + q.verticalOffset - this.viewportOffsetTop - q.startingOffsetTop + q.parentOffsetTop - q.startingBackgroundPositionTop) * (D - q.stellarRatio) + "px": q.startingValueTop);
				b(q.$element, C, w)
			}
		},
		_handleScrollEvent: function() {
			var q = this,
			r = false;
			var s = function() {
				q._repositionElements();
				r = false
			};
			var p = function() {
				if (!r) {
					n(s);
					r = true
				}
			};
			this.$scrollElement.bind("scroll." + this.name, p);
			p()
		},
		_startAnimationLoop: function() {
			var p = this;
			this._animationLoop = function() {
				n(p._animationLoop);
				p._repositionElements()
			};
			this._animationLoop()
		}
	};
	f.fn[j] = function(q) {
		var p = arguments;
		if (q === d || typeof q === "object") {
			return this.each(function() {
				if (!f.data(this, "plugin_" + j)) {
					f.data(this, "plugin_" + j, new o(this, q))
				}
			})
		} else {
			if (typeof q === "string" && q[0] !== "_" && q !== "init") {
				return this.each(function() {
					var r = f.data(this, "plugin_" + j);
					if (r instanceof o && typeof r[q] === "function") {
						r[q].apply(r, Array.prototype.slice.call(p, 1))
					}
					if (q === "destroy") {
						f.data(this, "plugin_" + j, null)
					}
				})
			}
		}
	};
	f[j] = function(p) {
		var q = f(k);
		return q.stellar.apply(q, Array.prototype.slice.call(arguments, 0))
	};
	f[j].scrollProperty = g;
	f[j].positionProperty = l;
	k.Stellar = o
} (jQuery, this, document));