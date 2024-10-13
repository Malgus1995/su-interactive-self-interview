const _e = {
  existsSync: (...e) => window.fs.existsSync(...e),
  readFileSync: (...e) => window.fs.readFileSync(...e),
  readdirSync: (...e) => window.fs.readdirSync(...e),
  copyFileSync: (...e) => window.fs.copyFileSync(...e)
}, Ma = (e) => window.imagesLoaded[e];
var Fa = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function lo(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var rr = {}, Ua = {
  get exports() {
    return rr;
  },
  set exports(e) {
    rr = e;
  }
}, fo = {}, De = {}, Ct = {}, ir = {}, W = {}, nr = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor(E) {
      if (super(), !e.IDENTIFIER.test(E))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = E;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  }
  e.Name = r;
  class n extends t {
    constructor(E) {
      super(), this._items = typeof E == "string" ? [E] : E;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const E = this._items[0];
      return E === "" || E === '""';
    }
    get str() {
      var E;
      return (E = this._str) !== null && E !== void 0 ? E : this._str = this._items.reduce((P, A) => `${P}${A}`, "");
    }
    get names() {
      var E;
      return (E = this._names) !== null && E !== void 0 ? E : this._names = this._items.reduce((P, A) => (A instanceof r && (P[A.str] = (P[A.str] || 0) + 1), P), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function s(m, ...E) {
    const P = [m[0]];
    let A = 0;
    for (; A < E.length; )
      u(P, E[A]), P.push(m[++A]);
    return new n(P);
  }
  e._ = s;
  const o = new n("+");
  function a(m, ...E) {
    const P = [b(m[0])];
    let A = 0;
    for (; A < E.length; )
      P.push(o), u(P, E[A]), P.push(o, b(m[++A]));
    return p(P), new n(P);
  }
  e.str = a;
  function u(m, E) {
    E instanceof n ? m.push(...E._items) : E instanceof r ? m.push(E) : m.push(d(E));
  }
  e.addCodeArg = u;
  function p(m) {
    let E = 1;
    for (; E < m.length - 1; ) {
      if (m[E] === o) {
        const P = c(m[E - 1], m[E + 1]);
        if (P !== void 0) {
          m.splice(E - 1, 3, P);
          continue;
        }
        m[E++] = "+";
      }
      E++;
    }
  }
  function c(m, E) {
    if (E === '""')
      return m;
    if (m === '""')
      return E;
    if (typeof m == "string")
      return E instanceof r || m[m.length - 1] !== '"' ? void 0 : typeof E != "string" ? `${m.slice(0, -1)}${E}"` : E[0] === '"' ? m.slice(0, -1) + E.slice(1) : void 0;
    if (typeof E == "string" && E[0] === '"' && !(m instanceof r))
      return `"${m}${E.slice(1)}`;
  }
  function i(m, E) {
    return E.emptyStr() ? m : m.emptyStr() ? E : a`${m}${E}`;
  }
  e.strConcat = i;
  function d(m) {
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : b(Array.isArray(m) ? m.join(",") : m);
  }
  function w(m) {
    return new n(b(m));
  }
  e.stringify = w;
  function b(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = b;
  function h(m) {
    return typeof m == "string" && e.IDENTIFIER.test(m) ? new n(`.${m}`) : s`[${m}]`;
  }
  e.getProperty = h;
  function y(m) {
    if (typeof m == "string" && e.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  e.getEsmExportName = y;
  function _(m) {
    return new n(m.toString());
  }
  e.regexpCode = _;
})(nr);
var hn = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = nr;
  class r extends Error {
    constructor(c) {
      super(`CodeGen: "code" for ${c} not defined`), this.value = c.value;
    }
  }
  var n;
  (function(p) {
    p[p.Started = 0] = "Started", p[p.Completed = 1] = "Completed";
  })(n = e.UsedValueState || (e.UsedValueState = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class s {
    constructor({ prefixes: c, parent: i } = {}) {
      this._names = {}, this._prefixes = c, this._parent = i;
    }
    toName(c) {
      return c instanceof t.Name ? c : this.name(c);
    }
    name(c) {
      return new t.Name(this._newName(c));
    }
    _newName(c) {
      const i = this._names[c] || this._nameGroup(c);
      return `${c}${i.index++}`;
    }
    _nameGroup(c) {
      var i, d;
      if (!((d = (i = this._parent) === null || i === void 0 ? void 0 : i._prefixes) === null || d === void 0) && d.has(c) || this._prefixes && !this._prefixes.has(c))
        throw new Error(`CodeGen: prefix "${c}" is not allowed in this scope`);
      return this._names[c] = { prefix: c, index: 0 };
    }
  }
  e.Scope = s;
  class o extends t.Name {
    constructor(c, i) {
      super(i), this.prefix = c;
    }
    setValue(c, { property: i, itemIndex: d }) {
      this.value = c, this.scopePath = (0, t._)`.${new t.Name(i)}[${d}]`;
    }
  }
  e.ValueScopeName = o;
  const a = (0, t._)`\n`;
  class u extends s {
    constructor(c) {
      super(c), this._values = {}, this._scope = c.scope, this.opts = { ...c, _n: c.lines ? a : t.nil };
    }
    get() {
      return this._scope;
    }
    name(c) {
      return new o(c, this._newName(c));
    }
    value(c, i) {
      var d;
      if (i.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const w = this.toName(c), { prefix: b } = w, h = (d = i.key) !== null && d !== void 0 ? d : i.ref;
      let y = this._values[b];
      if (y) {
        const E = y.get(h);
        if (E)
          return E;
      } else
        y = this._values[b] = /* @__PURE__ */ new Map();
      y.set(h, w);
      const _ = this._scope[b] || (this._scope[b] = []), m = _.length;
      return _[m] = i.ref, w.setValue(i, { property: b, itemIndex: m }), w;
    }
    getValue(c, i) {
      const d = this._values[c];
      if (d)
        return d.get(i);
    }
    scopeRefs(c, i = this._values) {
      return this._reduceValues(i, (d) => {
        if (d.scopePath === void 0)
          throw new Error(`CodeGen: name "${d}" has no value`);
        return (0, t._)`${c}${d.scopePath}`;
      });
    }
    scopeCode(c = this._values, i, d) {
      return this._reduceValues(c, (w) => {
        if (w.value === void 0)
          throw new Error(`CodeGen: name "${w}" has no value`);
        return w.value.code;
      }, i, d);
    }
    _reduceValues(c, i, d = {}, w) {
      let b = t.nil;
      for (const h in c) {
        const y = c[h];
        if (!y)
          continue;
        const _ = d[h] = d[h] || /* @__PURE__ */ new Map();
        y.forEach((m) => {
          if (_.has(m))
            return;
          _.set(m, n.Started);
          let E = i(m);
          if (E) {
            const P = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            b = (0, t._)`${b}${P} ${m} = ${E};${this.opts._n}`;
          } else if (E = w == null ? void 0 : w(m))
            b = (0, t._)`${b}${E}${this.opts._n}`;
          else
            throw new r(m);
          _.set(m, n.Completed);
        });
      }
      return b;
    }
  }
  e.ValueScope = u;
})(hn);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = nr, r = hn;
  var n = nr;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
    return n.strConcat;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
    return n.getProperty;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
    return n.regexpCode;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } });
  var s = hn;
  Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
    return s.Scope;
  } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
    return s.ValueScope;
  } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
    return s.ValueScopeName;
  } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
    return s.varKinds;
  } }), e.operators = {
    GT: new t._Code(">"),
    GTE: new t._Code(">="),
    LT: new t._Code("<"),
    LTE: new t._Code("<="),
    EQ: new t._Code("==="),
    NEQ: new t._Code("!=="),
    NOT: new t._Code("!"),
    OR: new t._Code("||"),
    AND: new t._Code("&&"),
    ADD: new t._Code("+")
  };
  class o {
    optimizeNodes() {
      return this;
    }
    optimizeNames(l, v) {
      return this;
    }
  }
  class a extends o {
    constructor(l, v, j) {
      super(), this.varKind = l, this.name = v, this.rhs = j;
    }
    render({ es5: l, _n: v }) {
      const j = l ? r.varKinds.var : this.varKind, z = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${j} ${this.name}${z};` + v;
    }
    optimizeNames(l, v) {
      if (l[this.name.str])
        return this.rhs && (this.rhs = se(this.rhs, l, v)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class u extends o {
    constructor(l, v, j) {
      super(), this.lhs = l, this.rhs = v, this.sideEffects = j;
    }
    render({ _n: l }) {
      return `${this.lhs} = ${this.rhs};` + l;
    }
    optimizeNames(l, v) {
      if (!(this.lhs instanceof t.Name && !l[this.lhs.str] && !this.sideEffects))
        return this.rhs = se(this.rhs, l, v), this;
    }
    get names() {
      const l = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return pe(l, this.rhs);
    }
  }
  class p extends u {
    constructor(l, v, j, z) {
      super(l, j, z), this.op = v;
    }
    render({ _n: l }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + l;
    }
  }
  class c extends o {
    constructor(l) {
      super(), this.label = l, this.names = {};
    }
    render({ _n: l }) {
      return `${this.label}:` + l;
    }
  }
  class i extends o {
    constructor(l) {
      super(), this.label = l, this.names = {};
    }
    render({ _n: l }) {
      return `break${this.label ? ` ${this.label}` : ""};` + l;
    }
  }
  class d extends o {
    constructor(l) {
      super(), this.error = l;
    }
    render({ _n: l }) {
      return `throw ${this.error};` + l;
    }
    get names() {
      return this.error.names;
    }
  }
  class w extends o {
    constructor(l) {
      super(), this.code = l;
    }
    render({ _n: l }) {
      return `${this.code};` + l;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(l, v) {
      return this.code = se(this.code, l, v), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class b extends o {
    constructor(l = []) {
      super(), this.nodes = l;
    }
    render(l) {
      return this.nodes.reduce((v, j) => v + j.render(l), "");
    }
    optimizeNodes() {
      const { nodes: l } = this;
      let v = l.length;
      for (; v--; ) {
        const j = l[v].optimizeNodes();
        Array.isArray(j) ? l.splice(v, 1, ...j) : j ? l[v] = j : l.splice(v, 1);
      }
      return l.length > 0 ? this : void 0;
    }
    optimizeNames(l, v) {
      const { nodes: j } = this;
      let z = j.length;
      for (; z--; ) {
        const V = j[z];
        V.optimizeNames(l, v) || (Re(l, V.names), j.splice(z, 1));
      }
      return j.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((l, v) => B(l, v.names), {});
    }
  }
  class h extends b {
    render(l) {
      return "{" + l._n + super.render(l) + "}" + l._n;
    }
  }
  class y extends b {
  }
  class _ extends h {
  }
  _.kind = "else";
  class m extends h {
    constructor(l, v) {
      super(v), this.condition = l;
    }
    render(l) {
      let v = `if(${this.condition})` + super.render(l);
      return this.else && (v += "else " + this.else.render(l)), v;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const l = this.condition;
      if (l === !0)
        return this.nodes;
      let v = this.else;
      if (v) {
        const j = v.optimizeNodes();
        v = this.else = Array.isArray(j) ? new _(j) : j;
      }
      if (v)
        return l === !1 ? v instanceof m ? v : v.nodes : this.nodes.length ? this : new m(ot(l), v instanceof m ? [v] : v.nodes);
      if (!(l === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(l, v) {
      var j;
      if (this.else = (j = this.else) === null || j === void 0 ? void 0 : j.optimizeNames(l, v), !!(super.optimizeNames(l, v) || this.else))
        return this.condition = se(this.condition, l, v), this;
    }
    get names() {
      const l = super.names;
      return pe(l, this.condition), this.else && B(l, this.else.names), l;
    }
  }
  m.kind = "if";
  class E extends h {
  }
  E.kind = "for";
  class P extends E {
    constructor(l) {
      super(), this.iteration = l;
    }
    render(l) {
      return `for(${this.iteration})` + super.render(l);
    }
    optimizeNames(l, v) {
      if (super.optimizeNames(l, v))
        return this.iteration = se(this.iteration, l, v), this;
    }
    get names() {
      return B(super.names, this.iteration.names);
    }
  }
  class A extends E {
    constructor(l, v, j, z) {
      super(), this.varKind = l, this.name = v, this.from = j, this.to = z;
    }
    render(l) {
      const v = l.es5 ? r.varKinds.var : this.varKind, { name: j, from: z, to: V } = this;
      return `for(${v} ${j}=${z}; ${j}<${V}; ${j}++)` + super.render(l);
    }
    get names() {
      const l = pe(super.names, this.from);
      return pe(l, this.to);
    }
  }
  class k extends E {
    constructor(l, v, j, z) {
      super(), this.loop = l, this.varKind = v, this.name = j, this.iterable = z;
    }
    render(l) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(l);
    }
    optimizeNames(l, v) {
      if (super.optimizeNames(l, v))
        return this.iterable = se(this.iterable, l, v), this;
    }
    get names() {
      return B(super.names, this.iterable.names);
    }
  }
  class S extends h {
    constructor(l, v, j) {
      super(), this.name = l, this.args = v, this.async = j;
    }
    render(l) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(l);
    }
  }
  S.kind = "func";
  class C extends b {
    render(l) {
      return "return " + super.render(l);
    }
  }
  C.kind = "return";
  class M extends h {
    render(l) {
      let v = "try" + super.render(l);
      return this.catch && (v += this.catch.render(l)), this.finally && (v += this.finally.render(l)), v;
    }
    optimizeNodes() {
      var l, v;
      return super.optimizeNodes(), (l = this.catch) === null || l === void 0 || l.optimizeNodes(), (v = this.finally) === null || v === void 0 || v.optimizeNodes(), this;
    }
    optimizeNames(l, v) {
      var j, z;
      return super.optimizeNames(l, v), (j = this.catch) === null || j === void 0 || j.optimizeNames(l, v), (z = this.finally) === null || z === void 0 || z.optimizeNames(l, v), this;
    }
    get names() {
      const l = super.names;
      return this.catch && B(l, this.catch.names), this.finally && B(l, this.finally.names), l;
    }
  }
  class F extends h {
    constructor(l) {
      super(), this.error = l;
    }
    render(l) {
      return `catch(${this.error})` + super.render(l);
    }
  }
  F.kind = "catch";
  class L extends h {
    render(l) {
      return "finally" + super.render(l);
    }
  }
  L.kind = "finally";
  class x {
    constructor(l, v = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...v, _n: v.lines ? `
` : "" }, this._extScope = l, this._scope = new r.Scope({ parent: l }), this._nodes = [new y()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(l) {
      return this._scope.name(l);
    }
    // reserves unique name in the external scope
    scopeName(l) {
      return this._extScope.name(l);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(l, v) {
      const j = this._extScope.value(l, v);
      return (this._values[j.prefix] || (this._values[j.prefix] = /* @__PURE__ */ new Set())).add(j), j;
    }
    getScopeValue(l, v) {
      return this._extScope.getValue(l, v);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(l) {
      return this._extScope.scopeRefs(l, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(l, v, j, z) {
      const V = this._scope.toName(v);
      return j !== void 0 && z && (this._constants[V.str] = j), this._leafNode(new a(l, V, j)), V;
    }
    // `const` declaration (`var` in es5 mode)
    const(l, v, j) {
      return this._def(r.varKinds.const, l, v, j);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(l, v, j) {
      return this._def(r.varKinds.let, l, v, j);
    }
    // `var` declaration with optional assignment
    var(l, v, j) {
      return this._def(r.varKinds.var, l, v, j);
    }
    // assignment code
    assign(l, v, j) {
      return this._leafNode(new u(l, v, j));
    }
    // `+=` code
    add(l, v) {
      return this._leafNode(new p(l, e.operators.ADD, v));
    }
    // appends passed SafeExpr to code or executes Block
    code(l) {
      return typeof l == "function" ? l() : l !== t.nil && this._leafNode(new w(l)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...l) {
      const v = ["{"];
      for (const [j, z] of l)
        v.length > 1 && v.push(","), v.push(j), (j !== z || this.opts.es5) && (v.push(":"), (0, t.addCodeArg)(v, z));
      return v.push("}"), new t._Code(v);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(l, v, j) {
      if (this._blockNode(new m(l)), v && j)
        this.code(v).else().code(j).endIf();
      else if (v)
        this.code(v).endIf();
      else if (j)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(l) {
      return this._elseNode(new m(l));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new _());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(m, _);
    }
    _for(l, v) {
      return this._blockNode(l), v && this.code(v).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(l, v) {
      return this._for(new P(l), v);
    }
    // `for` statement for a range of values
    forRange(l, v, j, z, V = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const Y = this._scope.toName(l);
      return this._for(new A(V, Y, v, j), () => z(Y));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(l, v, j, z = r.varKinds.const) {
      const V = this._scope.toName(l);
      if (this.opts.es5) {
        const Y = v instanceof t.Name ? v : this.var("_arr", v);
        return this.forRange("_i", 0, (0, t._)`${Y}.length`, (Z) => {
          this.var(V, (0, t._)`${Y}[${Z}]`), j(V);
        });
      }
      return this._for(new k("of", z, V, v), () => j(V));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(l, v, j, z = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(l, (0, t._)`Object.keys(${v})`, j);
      const V = this._scope.toName(l);
      return this._for(new k("in", z, V, v), () => j(V));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(E);
    }
    // `label` statement
    label(l) {
      return this._leafNode(new c(l));
    }
    // `break` statement
    break(l) {
      return this._leafNode(new i(l));
    }
    // `return` statement
    return(l) {
      const v = new C();
      if (this._blockNode(v), this.code(l), v.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(C);
    }
    // `try` statement
    try(l, v, j) {
      if (!v && !j)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const z = new M();
      if (this._blockNode(z), this.code(l), v) {
        const V = this.name("e");
        this._currNode = z.catch = new F(V), v(V);
      }
      return j && (this._currNode = z.finally = new L(), this.code(j)), this._endBlockNode(F, L);
    }
    // `throw` statement
    throw(l) {
      return this._leafNode(new d(l));
    }
    // start self-balancing block
    block(l, v) {
      return this._blockStarts.push(this._nodes.length), l && this.code(l).endBlock(v), this;
    }
    // end the current self-balancing block
    endBlock(l) {
      const v = this._blockStarts.pop();
      if (v === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const j = this._nodes.length - v;
      if (j < 0 || l !== void 0 && j !== l)
        throw new Error(`CodeGen: wrong number of nodes: ${j} vs ${l} expected`);
      return this._nodes.length = v, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(l, v = t.nil, j, z) {
      return this._blockNode(new S(l, v, j)), z && this.code(z).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(S);
    }
    optimize(l = 1) {
      for (; l-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(l) {
      return this._currNode.nodes.push(l), this;
    }
    _blockNode(l) {
      this._currNode.nodes.push(l), this._nodes.push(l);
    }
    _endBlockNode(l, v) {
      const j = this._currNode;
      if (j instanceof l || v && j instanceof v)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${v ? `${l.kind}/${v.kind}` : l.kind}"`);
    }
    _elseNode(l) {
      const v = this._currNode;
      if (!(v instanceof m))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = v.else = l, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const l = this._nodes;
      return l[l.length - 1];
    }
    set _currNode(l) {
      const v = this._nodes;
      v[v.length - 1] = l;
    }
  }
  e.CodeGen = x;
  function B(R, l) {
    for (const v in l)
      R[v] = (R[v] || 0) + (l[v] || 0);
    return R;
  }
  function pe(R, l) {
    return l instanceof t._CodeOrName ? B(R, l.names) : R;
  }
  function se(R, l, v) {
    if (R instanceof t.Name)
      return j(R);
    if (!z(R))
      return R;
    return new t._Code(R._items.reduce((V, Y) => (Y instanceof t.Name && (Y = j(Y)), Y instanceof t._Code ? V.push(...Y._items) : V.push(Y), V), []));
    function j(V) {
      const Y = v[V.str];
      return Y === void 0 || l[V.str] !== 1 ? V : (delete l[V.str], Y);
    }
    function z(V) {
      return V instanceof t._Code && V._items.some((Y) => Y instanceof t.Name && l[Y.str] === 1 && v[Y.str] !== void 0);
    }
  }
  function Re(R, l) {
    for (const v in l)
      R[v] = (R[v] || 0) - (l[v] || 0);
  }
  function ot(R) {
    return typeof R == "boolean" || typeof R == "number" || R === null ? !R : (0, t._)`!${D(R)}`;
  }
  e.not = ot;
  const yt = O(e.operators.AND);
  function Mt(...R) {
    return R.reduce(yt);
  }
  e.and = Mt;
  const gt = O(e.operators.OR);
  function U(...R) {
    return R.reduce(gt);
  }
  e.or = U;
  function O(R) {
    return (l, v) => l === t.nil ? v : v === t.nil ? l : (0, t._)`${D(l)} ${R} ${D(v)}`;
  }
  function D(R) {
    return R instanceof t.Name ? R : (0, t._)`(${R})`;
  }
})(W);
var re = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.checkStrictMode = e.getErrorPath = e.Type = e.useFunc = e.setEvaluated = e.evaluatedPropsToName = e.mergeEvaluated = e.eachItem = e.unescapeJsonPointer = e.escapeJsonPointer = e.escapeFragment = e.unescapeFragment = e.schemaRefOrVal = e.schemaHasRulesButRef = e.schemaHasRules = e.checkUnknownRules = e.alwaysValidSchema = e.toHash = void 0;
  const t = W, r = nr;
  function n(S) {
    const C = {};
    for (const M of S)
      C[M] = !0;
    return C;
  }
  e.toHash = n;
  function s(S, C) {
    return typeof C == "boolean" ? C : Object.keys(C).length === 0 ? !0 : (o(S, C), !a(C, S.self.RULES.all));
  }
  e.alwaysValidSchema = s;
  function o(S, C = S.schema) {
    const { opts: M, self: F } = S;
    if (!M.strictSchema || typeof C == "boolean")
      return;
    const L = F.RULES.keywords;
    for (const x in C)
      L[x] || k(S, `unknown keyword: "${x}"`);
  }
  e.checkUnknownRules = o;
  function a(S, C) {
    if (typeof S == "boolean")
      return !S;
    for (const M in S)
      if (C[M])
        return !0;
    return !1;
  }
  e.schemaHasRules = a;
  function u(S, C) {
    if (typeof S == "boolean")
      return !S;
    for (const M in S)
      if (M !== "$ref" && C.all[M])
        return !0;
    return !1;
  }
  e.schemaHasRulesButRef = u;
  function p({ topSchemaRef: S, schemaPath: C }, M, F, L) {
    if (!L) {
      if (typeof M == "number" || typeof M == "boolean")
        return M;
      if (typeof M == "string")
        return (0, t._)`${M}`;
    }
    return (0, t._)`${S}${C}${(0, t.getProperty)(F)}`;
  }
  e.schemaRefOrVal = p;
  function c(S) {
    return w(decodeURIComponent(S));
  }
  e.unescapeFragment = c;
  function i(S) {
    return encodeURIComponent(d(S));
  }
  e.escapeFragment = i;
  function d(S) {
    return typeof S == "number" ? `${S}` : S.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  e.escapeJsonPointer = d;
  function w(S) {
    return S.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  e.unescapeJsonPointer = w;
  function b(S, C) {
    if (Array.isArray(S))
      for (const M of S)
        C(M);
    else
      C(S);
  }
  e.eachItem = b;
  function h({ mergeNames: S, mergeToName: C, mergeValues: M, resultToName: F }) {
    return (L, x, B, pe) => {
      const se = B === void 0 ? x : B instanceof t.Name ? (x instanceof t.Name ? S(L, x, B) : C(L, x, B), B) : x instanceof t.Name ? (C(L, B, x), x) : M(x, B);
      return pe === t.Name && !(se instanceof t.Name) ? F(L, se) : se;
    };
  }
  e.mergeEvaluated = {
    props: h({
      mergeNames: (S, C, M) => S.if((0, t._)`${M} !== true && ${C} !== undefined`, () => {
        S.if((0, t._)`${C} === true`, () => S.assign(M, !0), () => S.assign(M, (0, t._)`${M} || {}`).code((0, t._)`Object.assign(${M}, ${C})`));
      }),
      mergeToName: (S, C, M) => S.if((0, t._)`${M} !== true`, () => {
        C === !0 ? S.assign(M, !0) : (S.assign(M, (0, t._)`${M} || {}`), _(S, M, C));
      }),
      mergeValues: (S, C) => S === !0 ? !0 : { ...S, ...C },
      resultToName: y
    }),
    items: h({
      mergeNames: (S, C, M) => S.if((0, t._)`${M} !== true && ${C} !== undefined`, () => S.assign(M, (0, t._)`${C} === true ? true : ${M} > ${C} ? ${M} : ${C}`)),
      mergeToName: (S, C, M) => S.if((0, t._)`${M} !== true`, () => S.assign(M, C === !0 ? !0 : (0, t._)`${M} > ${C} ? ${M} : ${C}`)),
      mergeValues: (S, C) => S === !0 ? !0 : Math.max(S, C),
      resultToName: (S, C) => S.var("items", C)
    })
  };
  function y(S, C) {
    if (C === !0)
      return S.var("props", !0);
    const M = S.var("props", (0, t._)`{}`);
    return C !== void 0 && _(S, M, C), M;
  }
  e.evaluatedPropsToName = y;
  function _(S, C, M) {
    Object.keys(M).forEach((F) => S.assign((0, t._)`${C}${(0, t.getProperty)(F)}`, !0));
  }
  e.setEvaluated = _;
  const m = {};
  function E(S, C) {
    return S.scopeValue("func", {
      ref: C,
      code: m[C.code] || (m[C.code] = new r._Code(C.code))
    });
  }
  e.useFunc = E;
  var P;
  (function(S) {
    S[S.Num = 0] = "Num", S[S.Str = 1] = "Str";
  })(P = e.Type || (e.Type = {}));
  function A(S, C, M) {
    if (S instanceof t.Name) {
      const F = C === P.Num;
      return M ? F ? (0, t._)`"[" + ${S} + "]"` : (0, t._)`"['" + ${S} + "']"` : F ? (0, t._)`"/" + ${S}` : (0, t._)`"/" + ${S}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return M ? (0, t.getProperty)(S).toString() : "/" + d(S);
  }
  e.getErrorPath = A;
  function k(S, C, M = S.opts.strictSchema) {
    if (M) {
      if (C = `strict mode: ${C}`, M === !0)
        throw new Error(C);
      S.self.logger.warn(C);
    }
  }
  e.checkStrictMode = k;
})(re);
var Ge = {};
Object.defineProperty(Ge, "__esModule", { value: !0 });
const $e = W, za = {
  // validation function arguments
  data: new $e.Name("data"),
  // args passed from referencing schema
  valCxt: new $e.Name("valCxt"),
  instancePath: new $e.Name("instancePath"),
  parentData: new $e.Name("parentData"),
  parentDataProperty: new $e.Name("parentDataProperty"),
  rootData: new $e.Name("rootData"),
  dynamicAnchors: new $e.Name("dynamicAnchors"),
  // function scoped variables
  vErrors: new $e.Name("vErrors"),
  errors: new $e.Name("errors"),
  this: new $e.Name("this"),
  // "globals"
  self: new $e.Name("self"),
  scope: new $e.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new $e.Name("json"),
  jsonPos: new $e.Name("jsonPos"),
  jsonLen: new $e.Name("jsonLen"),
  jsonPart: new $e.Name("jsonPart")
};
Ge.default = za;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = W, r = re, n = Ge;
  e.keywordError = {
    message: ({ keyword: _ }) => (0, t.str)`must pass "${_}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: _, schemaType: m }) => m ? (0, t.str)`"${_}" keyword must be ${m} ($data)` : (0, t.str)`"${_}" keyword is invalid ($data)`
  };
  function s(_, m = e.keywordError, E, P) {
    const { it: A } = _, { gen: k, compositeRule: S, allErrors: C } = A, M = d(_, m, E);
    P ?? (S || C) ? p(k, M) : c(A, (0, t._)`[${M}]`);
  }
  e.reportError = s;
  function o(_, m = e.keywordError, E) {
    const { it: P } = _, { gen: A, compositeRule: k, allErrors: S } = P, C = d(_, m, E);
    p(A, C), k || S || c(P, n.default.vErrors);
  }
  e.reportExtraError = o;
  function a(_, m) {
    _.assign(n.default.errors, m), _.if((0, t._)`${n.default.vErrors} !== null`, () => _.if(m, () => _.assign((0, t._)`${n.default.vErrors}.length`, m), () => _.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = a;
  function u({ gen: _, keyword: m, schemaValue: E, data: P, errsCount: A, it: k }) {
    if (A === void 0)
      throw new Error("ajv implementation error");
    const S = _.name("err");
    _.forRange("i", A, n.default.errors, (C) => {
      _.const(S, (0, t._)`${n.default.vErrors}[${C}]`), _.if((0, t._)`${S}.instancePath === undefined`, () => _.assign((0, t._)`${S}.instancePath`, (0, t.strConcat)(n.default.instancePath, k.errorPath))), _.assign((0, t._)`${S}.schemaPath`, (0, t.str)`${k.errSchemaPath}/${m}`), k.opts.verbose && (_.assign((0, t._)`${S}.schema`, E), _.assign((0, t._)`${S}.data`, P));
    });
  }
  e.extendErrors = u;
  function p(_, m) {
    const E = _.const("err", m);
    _.if((0, t._)`${n.default.vErrors} === null`, () => _.assign(n.default.vErrors, (0, t._)`[${E}]`), (0, t._)`${n.default.vErrors}.push(${E})`), _.code((0, t._)`${n.default.errors}++`);
  }
  function c(_, m) {
    const { gen: E, validateName: P, schemaEnv: A } = _;
    A.$async ? E.throw((0, t._)`new ${_.ValidationError}(${m})`) : (E.assign((0, t._)`${P}.errors`, m), E.return(!1));
  }
  const i = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function d(_, m, E) {
    const { createErrors: P } = _.it;
    return P === !1 ? (0, t._)`{}` : w(_, m, E);
  }
  function w(_, m, E = {}) {
    const { gen: P, it: A } = _, k = [
      b(A, E),
      h(_, E)
    ];
    return y(_, m, k), P.object(...k);
  }
  function b({ errorPath: _ }, { instancePath: m }) {
    const E = m ? (0, t.str)`${_}${(0, r.getErrorPath)(m, r.Type.Str)}` : _;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, E)];
  }
  function h({ keyword: _, it: { errSchemaPath: m } }, { schemaPath: E, parentSchema: P }) {
    let A = P ? m : (0, t.str)`${m}/${_}`;
    return E && (A = (0, t.str)`${A}${(0, r.getErrorPath)(E, r.Type.Str)}`), [i.schemaPath, A];
  }
  function y(_, { params: m, message: E }, P) {
    const { keyword: A, data: k, schemaValue: S, it: C } = _, { opts: M, propertyName: F, topSchemaRef: L, schemaPath: x } = C;
    P.push([i.keyword, A], [i.params, typeof m == "function" ? m(_) : m || (0, t._)`{}`]), M.messages && P.push([i.message, typeof E == "function" ? E(_) : E]), M.verbose && P.push([i.schema, S], [i.parentSchema, (0, t._)`${L}${x}`], [n.default.data, k]), F && P.push([i.propertyName, F]);
  }
})(ir);
Object.defineProperty(Ct, "__esModule", { value: !0 });
Ct.boolOrEmptySchema = Ct.topBoolOrEmptySchema = void 0;
const Va = ir, La = W, qa = Ge, Ha = {
  message: "boolean schema is false"
};
function Ka(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? po(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(qa.default.data) : (t.assign((0, La._)`${n}.errors`, null), t.return(!0));
}
Ct.topBoolOrEmptySchema = Ka;
function Ba(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), po(e)) : r.var(t, !0);
}
Ct.boolOrEmptySchema = Ba;
function po(e, t) {
  const { gen: r, data: n } = e, s = {
    gen: r,
    keyword: "false schema",
    data: n,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e
  };
  (0, Va.reportError)(s, Ha, void 0, t);
}
var cr = {}, ht = {};
Object.defineProperty(ht, "__esModule", { value: !0 });
ht.getRules = ht.isJSONType = void 0;
const Ga = ["string", "number", "integer", "boolean", "null", "object", "array"], Ja = new Set(Ga);
function Wa(e) {
  return typeof e == "string" && Ja.has(e);
}
ht.isJSONType = Wa;
function xa() {
  const e = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...e, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, e.number, e.string, e.array, e.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
ht.getRules = xa;
var We = {};
Object.defineProperty(We, "__esModule", { value: !0 });
We.shouldUseRule = We.shouldUseGroup = We.schemaHasRulesForType = void 0;
function Xa({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && ho(e, n);
}
We.schemaHasRulesForType = Xa;
function ho(e, t) {
  return t.rules.some((r) => mo(e, r));
}
We.shouldUseGroup = ho;
function mo(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
We.shouldUseRule = mo;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.reportTypeError = e.checkDataTypes = e.checkDataType = e.coerceAndCheckDataType = e.getJSONTypes = e.getSchemaTypes = e.DataType = void 0;
  const t = ht, r = We, n = ir, s = W, o = re;
  var a;
  (function(P) {
    P[P.Correct = 0] = "Correct", P[P.Wrong = 1] = "Wrong";
  })(a = e.DataType || (e.DataType = {}));
  function u(P) {
    const A = p(P.type);
    if (A.includes("null")) {
      if (P.nullable === !1)
        throw new Error("type: null contradicts nullable: false");
    } else {
      if (!A.length && P.nullable !== void 0)
        throw new Error('"nullable" cannot be used without "type"');
      P.nullable === !0 && A.push("null");
    }
    return A;
  }
  e.getSchemaTypes = u;
  function p(P) {
    const A = Array.isArray(P) ? P : P ? [P] : [];
    if (A.every(t.isJSONType))
      return A;
    throw new Error("type must be JSONType or JSONType[]: " + A.join(","));
  }
  e.getJSONTypes = p;
  function c(P, A) {
    const { gen: k, data: S, opts: C } = P, M = d(A, C.coerceTypes), F = A.length > 0 && !(M.length === 0 && A.length === 1 && (0, r.schemaHasRulesForType)(P, A[0]));
    if (F) {
      const L = y(A, S, C.strictNumbers, a.Wrong);
      k.if(L, () => {
        M.length ? w(P, A, M) : m(P);
      });
    }
    return F;
  }
  e.coerceAndCheckDataType = c;
  const i = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function d(P, A) {
    return A ? P.filter((k) => i.has(k) || A === "array" && k === "array") : [];
  }
  function w(P, A, k) {
    const { gen: S, data: C, opts: M } = P, F = S.let("dataType", (0, s._)`typeof ${C}`), L = S.let("coerced", (0, s._)`undefined`);
    M.coerceTypes === "array" && S.if((0, s._)`${F} == 'object' && Array.isArray(${C}) && ${C}.length == 1`, () => S.assign(C, (0, s._)`${C}[0]`).assign(F, (0, s._)`typeof ${C}`).if(y(A, C, M.strictNumbers), () => S.assign(L, C))), S.if((0, s._)`${L} !== undefined`);
    for (const B of k)
      (i.has(B) || B === "array" && M.coerceTypes === "array") && x(B);
    S.else(), m(P), S.endIf(), S.if((0, s._)`${L} !== undefined`, () => {
      S.assign(C, L), b(P, L);
    });
    function x(B) {
      switch (B) {
        case "string":
          S.elseIf((0, s._)`${F} == "number" || ${F} == "boolean"`).assign(L, (0, s._)`"" + ${C}`).elseIf((0, s._)`${C} === null`).assign(L, (0, s._)`""`);
          return;
        case "number":
          S.elseIf((0, s._)`${F} == "boolean" || ${C} === null
              || (${F} == "string" && ${C} && ${C} == +${C})`).assign(L, (0, s._)`+${C}`);
          return;
        case "integer":
          S.elseIf((0, s._)`${F} === "boolean" || ${C} === null
              || (${F} === "string" && ${C} && ${C} == +${C} && !(${C} % 1))`).assign(L, (0, s._)`+${C}`);
          return;
        case "boolean":
          S.elseIf((0, s._)`${C} === "false" || ${C} === 0 || ${C} === null`).assign(L, !1).elseIf((0, s._)`${C} === "true" || ${C} === 1`).assign(L, !0);
          return;
        case "null":
          S.elseIf((0, s._)`${C} === "" || ${C} === 0 || ${C} === false`), S.assign(L, null);
          return;
        case "array":
          S.elseIf((0, s._)`${F} === "string" || ${F} === "number"
              || ${F} === "boolean" || ${C} === null`).assign(L, (0, s._)`[${C}]`);
      }
    }
  }
  function b({ gen: P, parentData: A, parentDataProperty: k }, S) {
    P.if((0, s._)`${A} !== undefined`, () => P.assign((0, s._)`${A}[${k}]`, S));
  }
  function h(P, A, k, S = a.Correct) {
    const C = S === a.Correct ? s.operators.EQ : s.operators.NEQ;
    let M;
    switch (P) {
      case "null":
        return (0, s._)`${A} ${C} null`;
      case "array":
        M = (0, s._)`Array.isArray(${A})`;
        break;
      case "object":
        M = (0, s._)`${A} && typeof ${A} == "object" && !Array.isArray(${A})`;
        break;
      case "integer":
        M = F((0, s._)`!(${A} % 1) && !isNaN(${A})`);
        break;
      case "number":
        M = F();
        break;
      default:
        return (0, s._)`typeof ${A} ${C} ${P}`;
    }
    return S === a.Correct ? M : (0, s.not)(M);
    function F(L = s.nil) {
      return (0, s.and)((0, s._)`typeof ${A} == "number"`, L, k ? (0, s._)`isFinite(${A})` : s.nil);
    }
  }
  e.checkDataType = h;
  function y(P, A, k, S) {
    if (P.length === 1)
      return h(P[0], A, k, S);
    let C;
    const M = (0, o.toHash)(P);
    if (M.array && M.object) {
      const F = (0, s._)`typeof ${A} != "object"`;
      C = M.null ? F : (0, s._)`!${A} || ${F}`, delete M.null, delete M.array, delete M.object;
    } else
      C = s.nil;
    M.number && delete M.integer;
    for (const F in M)
      C = (0, s.and)(C, h(F, A, k, S));
    return C;
  }
  e.checkDataTypes = y;
  const _ = {
    message: ({ schema: P }) => `must be ${P}`,
    params: ({ schema: P, schemaValue: A }) => typeof P == "string" ? (0, s._)`{type: ${P}}` : (0, s._)`{type: ${A}}`
  };
  function m(P) {
    const A = E(P);
    (0, n.reportError)(A, _);
  }
  e.reportTypeError = m;
  function E(P) {
    const { gen: A, data: k, schema: S } = P, C = (0, o.schemaRefOrVal)(P, S, "type");
    return {
      gen: A,
      keyword: "type",
      data: k,
      schema: S.type,
      schemaCode: C,
      schemaValue: C,
      parentSchema: S,
      params: {},
      it: P
    };
  }
})(cr);
var Kr = {};
Object.defineProperty(Kr, "__esModule", { value: !0 });
Kr.assignDefaults = void 0;
const Pt = W, Ya = re;
function Qa(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      Ts(e, s, r[s].default);
  else
    t === "array" && Array.isArray(n) && n.forEach((s, o) => Ts(e, o, s.default));
}
Kr.assignDefaults = Qa;
function Ts(e, t, r) {
  const { gen: n, compositeRule: s, data: o, opts: a } = e;
  if (r === void 0)
    return;
  const u = (0, Pt._)`${o}${(0, Pt.getProperty)(t)}`;
  if (s) {
    (0, Ya.checkStrictMode)(e, `default is ignored for: ${u}`);
    return;
  }
  let p = (0, Pt._)`${u} === undefined`;
  a.useDefaults === "empty" && (p = (0, Pt._)`${p} || ${u} === null || ${u} === ""`), n.if(p, (0, Pt._)`${u} = ${(0, Pt.stringify)(r)}`);
}
var Ke = {}, X = {};
Object.defineProperty(X, "__esModule", { value: !0 });
X.validateUnion = X.validateArray = X.usePattern = X.callValidateCode = X.schemaProperties = X.allSchemaProperties = X.noPropertyInData = X.propertyInData = X.isOwnProperty = X.hasPropFunc = X.reportMissingProp = X.checkMissingProp = X.checkReportMissingProp = void 0;
const ae = W, Pn = re, et = Ge, Za = re;
function ei(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(Rn(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, ae._)`${t}` }, !0), e.error();
  });
}
X.checkReportMissingProp = ei;
function ti({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, ae.or)(...n.map((o) => (0, ae.and)(Rn(e, t, o, r.ownProperties), (0, ae._)`${s} = ${o}`)));
}
X.checkMissingProp = ti;
function ri(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
X.reportMissingProp = ri;
function yo(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, ae._)`Object.prototype.hasOwnProperty`
  });
}
X.hasPropFunc = yo;
function On(e, t, r) {
  return (0, ae._)`${yo(e)}.call(${t}, ${r})`;
}
X.isOwnProperty = On;
function ni(e, t, r, n) {
  const s = (0, ae._)`${t}${(0, ae.getProperty)(r)} !== undefined`;
  return n ? (0, ae._)`${s} && ${On(e, t, r)}` : s;
}
X.propertyInData = ni;
function Rn(e, t, r, n) {
  const s = (0, ae._)`${t}${(0, ae.getProperty)(r)} === undefined`;
  return n ? (0, ae.or)(s, (0, ae.not)(On(e, t, r))) : s;
}
X.noPropertyInData = Rn;
function go(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
X.allSchemaProperties = go;
function si(e, t) {
  return go(t).filter((r) => !(0, Pn.alwaysValidSchema)(e, t[r]));
}
X.schemaProperties = si;
function oi({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: o }, it: a }, u, p, c) {
  const i = c ? (0, ae._)`${e}, ${t}, ${n}${s}` : t, d = [
    [et.default.instancePath, (0, ae.strConcat)(et.default.instancePath, o)],
    [et.default.parentData, a.parentData],
    [et.default.parentDataProperty, a.parentDataProperty],
    [et.default.rootData, et.default.rootData]
  ];
  a.opts.dynamicRef && d.push([et.default.dynamicAnchors, et.default.dynamicAnchors]);
  const w = (0, ae._)`${i}, ${r.object(...d)}`;
  return p !== ae.nil ? (0, ae._)`${u}.call(${p}, ${w})` : (0, ae._)`${u}(${w})`;
}
X.callValidateCode = oi;
const ai = (0, ae._)`new RegExp`;
function ii({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, o = s(r, n);
  return e.scopeValue("pattern", {
    key: o.toString(),
    ref: o,
    code: (0, ae._)`${s.code === "new RegExp" ? ai : (0, Za.useFunc)(e, s)}(${r}, ${n})`
  });
}
X.usePattern = ii;
function ci(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, o = t.name("valid");
  if (s.allErrors) {
    const u = t.let("valid", !0);
    return a(() => t.assign(u, !1)), u;
  }
  return t.var(o, !0), a(() => t.break()), o;
  function a(u) {
    const p = t.const("len", (0, ae._)`${r}.length`);
    t.forRange("i", 0, p, (c) => {
      e.subschema({
        keyword: n,
        dataProp: c,
        dataPropType: Pn.Type.Num
      }, o), t.if((0, ae.not)(o), u);
    });
  }
}
X.validateArray = ci;
function ui(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((p) => (0, Pn.alwaysValidSchema)(s, p)) && !s.opts.unevaluated)
    return;
  const a = t.let("valid", !1), u = t.name("_valid");
  t.block(() => r.forEach((p, c) => {
    const i = e.subschema({
      keyword: n,
      schemaProp: c,
      compositeRule: !0
    }, u);
    t.assign(a, (0, ae._)`${a} || ${u}`), e.mergeValidEvaluated(i, u) || t.if((0, ae.not)(a));
  })), e.result(a, () => e.reset(), () => e.error(!0));
}
X.validateUnion = ui;
Object.defineProperty(Ke, "__esModule", { value: !0 });
Ke.validateKeywordUsage = Ke.validSchemaType = Ke.funcKeywordCode = Ke.macroKeywordCode = void 0;
const we = W, dt = Ge, li = X, di = ir;
function fi(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: o, it: a } = e, u = t.macro.call(a.self, s, o, a), p = vo(r, n, u);
  a.opts.validateSchema !== !1 && a.self.validateSchema(u, !0);
  const c = r.name("valid");
  e.subschema({
    schema: u,
    schemaPath: we.nil,
    errSchemaPath: `${a.errSchemaPath}/${n}`,
    topSchemaRef: p,
    compositeRule: !0
  }, c), e.pass(c, () => e.error(!0));
}
Ke.macroKeywordCode = fi;
function pi(e, t) {
  var r;
  const { gen: n, keyword: s, schema: o, parentSchema: a, $data: u, it: p } = e;
  mi(p, t);
  const c = !u && t.compile ? t.compile.call(p.self, o, a, p) : t.validate, i = vo(n, s, c), d = n.let("valid");
  e.block$data(d, w), e.ok((r = t.valid) !== null && r !== void 0 ? r : d);
  function w() {
    if (t.errors === !1)
      y(), t.modifying && Cs(e), _(() => e.error());
    else {
      const m = t.async ? b() : h();
      t.modifying && Cs(e), _(() => hi(e, m));
    }
  }
  function b() {
    const m = n.let("ruleErrs", null);
    return n.try(() => y((0, we._)`await `), (E) => n.assign(d, !1).if((0, we._)`${E} instanceof ${p.ValidationError}`, () => n.assign(m, (0, we._)`${E}.errors`), () => n.throw(E))), m;
  }
  function h() {
    const m = (0, we._)`${i}.errors`;
    return n.assign(m, null), y(we.nil), m;
  }
  function y(m = t.async ? (0, we._)`await ` : we.nil) {
    const E = p.opts.passContext ? dt.default.this : dt.default.self, P = !("compile" in t && !u || t.schema === !1);
    n.assign(d, (0, we._)`${m}${(0, li.callValidateCode)(e, i, E, P)}`, t.modifying);
  }
  function _(m) {
    var E;
    n.if((0, we.not)((E = t.valid) !== null && E !== void 0 ? E : d), m);
  }
}
Ke.funcKeywordCode = pi;
function Cs(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, we._)`${n.parentData}[${n.parentDataProperty}]`));
}
function hi(e, t) {
  const { gen: r } = e;
  r.if((0, we._)`Array.isArray(${t})`, () => {
    r.assign(dt.default.vErrors, (0, we._)`${dt.default.vErrors} === null ? ${t} : ${dt.default.vErrors}.concat(${t})`).assign(dt.default.errors, (0, we._)`${dt.default.vErrors}.length`), (0, di.extendErrors)(e);
  }, () => e.error());
}
function mi({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function vo(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, we.stringify)(r) });
}
function yi(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
Ke.validSchemaType = yi;
function gi({ schema: e, opts: t, self: r, errSchemaPath: n }, s, o) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(o) : s.keyword !== o)
    throw new Error("ajv implementation error");
  const a = s.dependencies;
  if (a != null && a.some((u) => !Object.prototype.hasOwnProperty.call(e, u)))
    throw new Error(`parent schema must have dependencies of ${o}: ${a.join(",")}`);
  if (s.validateSchema && !s.validateSchema(e[o])) {
    const p = `keyword "${o}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(p);
    else
      throw new Error(p);
  }
}
Ke.validateKeywordUsage = gi;
var st = {};
Object.defineProperty(st, "__esModule", { value: !0 });
st.extendSubschemaMode = st.extendSubschemaData = st.getSubschema = void 0;
const qe = W, $o = re;
function vi(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: o, topSchemaRef: a }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const u = e.schema[t];
    return r === void 0 ? {
      schema: u,
      schemaPath: (0, qe._)`${e.schemaPath}${(0, qe.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: u[r],
      schemaPath: (0, qe._)`${e.schemaPath}${(0, qe.getProperty)(t)}${(0, qe.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, $o.escapeFragment)(r)}`
    };
  }
  if (n !== void 0) {
    if (s === void 0 || o === void 0 || a === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: s,
      topSchemaRef: a,
      errSchemaPath: o
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
st.getSubschema = vi;
function $i(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: o, propertyName: a }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: u } = t;
  if (r !== void 0) {
    const { errorPath: c, dataPathArr: i, opts: d } = t, w = u.let("data", (0, qe._)`${t.data}${(0, qe.getProperty)(r)}`, !0);
    p(w), e.errorPath = (0, qe.str)`${c}${(0, $o.getErrorPath)(r, n, d.jsPropertySyntax)}`, e.parentDataProperty = (0, qe._)`${r}`, e.dataPathArr = [...i, e.parentDataProperty];
  }
  if (s !== void 0) {
    const c = s instanceof qe.Name ? s : u.let("data", s, !0);
    p(c), a !== void 0 && (e.propertyName = a);
  }
  o && (e.dataTypes = o);
  function p(c) {
    e.data = c, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, c];
  }
}
st.extendSubschemaData = $i;
function _i(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: o }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), o !== void 0 && (e.allErrors = o), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
st.extendSubschemaMode = _i;
var ve = {}, _o = function e(t, r) {
  if (t === r)
    return !0;
  if (t && r && typeof t == "object" && typeof r == "object") {
    if (t.constructor !== r.constructor)
      return !1;
    var n, s, o;
    if (Array.isArray(t)) {
      if (n = t.length, n != r.length)
        return !1;
      for (s = n; s-- !== 0; )
        if (!e(t[s], r[s]))
          return !1;
      return !0;
    }
    if (t.constructor === RegExp)
      return t.source === r.source && t.flags === r.flags;
    if (t.valueOf !== Object.prototype.valueOf)
      return t.valueOf() === r.valueOf();
    if (t.toString !== Object.prototype.toString)
      return t.toString() === r.toString();
    if (o = Object.keys(t), n = o.length, n !== Object.keys(r).length)
      return !1;
    for (s = n; s-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(r, o[s]))
        return !1;
    for (s = n; s-- !== 0; ) {
      var a = o[s];
      if (!e(t[a], r[a]))
        return !1;
    }
    return !0;
  }
  return t !== t && r !== r;
}, mn = {}, wi = {
  get exports() {
    return mn;
  },
  set exports(e) {
    mn = e;
  }
}, nt = wi.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  Er(t, n, s, e, "", e);
};
nt.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
nt.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
nt.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
nt.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function Er(e, t, r, n, s, o, a, u, p, c) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, o, a, u, p, c);
    for (var i in n) {
      var d = n[i];
      if (Array.isArray(d)) {
        if (i in nt.arrayKeywords)
          for (var w = 0; w < d.length; w++)
            Er(e, t, r, d[w], s + "/" + i + "/" + w, o, s, i, n, w);
      } else if (i in nt.propsKeywords) {
        if (d && typeof d == "object")
          for (var b in d)
            Er(e, t, r, d[b], s + "/" + i + "/" + bi(b), o, s, i, n, b);
      } else
        (i in nt.keywords || e.allKeys && !(i in nt.skipKeywords)) && Er(e, t, r, d, s + "/" + i, o, s, i, n);
    }
    r(n, s, o, a, u, p, c);
  }
}
function bi(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
Object.defineProperty(ve, "__esModule", { value: !0 });
ve.getSchemaRefs = ve.resolveUrl = ve.normalizeId = ve._getFullPath = ve.getFullPath = ve.inlineRef = void 0;
const Ei = re, Si = _o, Pi = mn, Oi = /* @__PURE__ */ new Set([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum",
  "const"
]);
function Ri(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !yn(e) : t ? wo(e) <= t : !1;
}
ve.inlineRef = Ri;
const Ni = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function yn(e) {
  for (const t in e) {
    if (Ni.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(yn) || typeof r == "object" && yn(r))
      return !0;
  }
  return !1;
}
function wo(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !Oi.has(r) && (typeof e[r] == "object" && (0, Ei.eachItem)(e[r], (n) => t += wo(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function bo(e, t = "", r) {
  r !== !1 && (t = Nt(t));
  const n = e.parse(t);
  return Eo(e, n);
}
ve.getFullPath = bo;
function Eo(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
ve._getFullPath = Eo;
const Ti = /#\/?$/;
function Nt(e) {
  return e ? e.replace(Ti, "") : "";
}
ve.normalizeId = Nt;
function Ci(e, t, r) {
  return r = Nt(r), e.resolve(t, r);
}
ve.resolveUrl = Ci;
const Ai = /^[a-z_][-a-z0-9._]*$/i;
function ji(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = Nt(e[r] || t), o = { "": s }, a = bo(n, s, !1), u = {}, p = /* @__PURE__ */ new Set();
  return Pi(e, { allKeys: !0 }, (d, w, b, h) => {
    if (h === void 0)
      return;
    const y = a + w;
    let _ = o[h];
    typeof d[r] == "string" && (_ = m.call(this, d[r])), E.call(this, d.$anchor), E.call(this, d.$dynamicAnchor), o[w] = _;
    function m(P) {
      const A = this.opts.uriResolver.resolve;
      if (P = Nt(_ ? A(_, P) : P), p.has(P))
        throw i(P);
      p.add(P);
      let k = this.refs[P];
      return typeof k == "string" && (k = this.refs[k]), typeof k == "object" ? c(d, k.schema, P) : P !== Nt(y) && (P[0] === "#" ? (c(d, u[P], P), u[P] = d) : this.refs[P] = y), P;
    }
    function E(P) {
      if (typeof P == "string") {
        if (!Ai.test(P))
          throw new Error(`invalid anchor "${P}"`);
        m.call(this, `#${P}`);
      }
    }
  }), u;
  function c(d, w, b) {
    if (w !== void 0 && !Si(d, w))
      throw i(b);
  }
  function i(d) {
    return new Error(`reference "${d}" resolves to more than one schema`);
  }
}
ve.getSchemaRefs = ji;
Object.defineProperty(De, "__esModule", { value: !0 });
De.getData = De.KeywordCxt = De.validateFunctionCode = void 0;
const So = Ct, As = cr, Nn = We, Dr = cr, Ii = Kr, Yt = Ke, tn = st, q = W, G = Ge, Di = ve, xe = re, Gt = ir;
function ki(e) {
  if (Ro(e) && (No(e), Oo(e))) {
    Ui(e);
    return;
  }
  Po(e, () => (0, So.topBoolOrEmptySchema)(e));
}
De.validateFunctionCode = ki;
function Po({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, o) {
  s.code.es5 ? e.func(t, (0, q._)`${G.default.data}, ${G.default.valCxt}`, n.$async, () => {
    e.code((0, q._)`"use strict"; ${js(r, s)}`), Fi(e, s), e.code(o);
  }) : e.func(t, (0, q._)`${G.default.data}, ${Mi(s)}`, n.$async, () => e.code(js(r, s)).code(o));
}
function Mi(e) {
  return (0, q._)`{${G.default.instancePath}="", ${G.default.parentData}, ${G.default.parentDataProperty}, ${G.default.rootData}=${G.default.data}${e.dynamicRef ? (0, q._)`, ${G.default.dynamicAnchors}={}` : q.nil}}={}`;
}
function Fi(e, t) {
  e.if(G.default.valCxt, () => {
    e.var(G.default.instancePath, (0, q._)`${G.default.valCxt}.${G.default.instancePath}`), e.var(G.default.parentData, (0, q._)`${G.default.valCxt}.${G.default.parentData}`), e.var(G.default.parentDataProperty, (0, q._)`${G.default.valCxt}.${G.default.parentDataProperty}`), e.var(G.default.rootData, (0, q._)`${G.default.valCxt}.${G.default.rootData}`), t.dynamicRef && e.var(G.default.dynamicAnchors, (0, q._)`${G.default.valCxt}.${G.default.dynamicAnchors}`);
  }, () => {
    e.var(G.default.instancePath, (0, q._)`""`), e.var(G.default.parentData, (0, q._)`undefined`), e.var(G.default.parentDataProperty, (0, q._)`undefined`), e.var(G.default.rootData, G.default.data), t.dynamicRef && e.var(G.default.dynamicAnchors, (0, q._)`{}`);
  });
}
function Ui(e) {
  const { schema: t, opts: r, gen: n } = e;
  Po(e, () => {
    r.$comment && t.$comment && Co(e), Hi(e), n.let(G.default.vErrors, null), n.let(G.default.errors, 0), r.unevaluated && zi(e), To(e), Gi(e);
  });
}
function zi(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, q._)`${r}.evaluated`), t.if((0, q._)`${e.evaluated}.dynamicProps`, () => t.assign((0, q._)`${e.evaluated}.props`, (0, q._)`undefined`)), t.if((0, q._)`${e.evaluated}.dynamicItems`, () => t.assign((0, q._)`${e.evaluated}.items`, (0, q._)`undefined`));
}
function js(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, q._)`/*# sourceURL=${r} */` : q.nil;
}
function Vi(e, t) {
  if (Ro(e) && (No(e), Oo(e))) {
    Li(e, t);
    return;
  }
  (0, So.boolOrEmptySchema)(e, t);
}
function Oo({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function Ro(e) {
  return typeof e.schema != "boolean";
}
function Li(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && Co(e), Ki(e), Bi(e);
  const o = n.const("_errs", G.default.errors);
  To(e, o), n.var(t, (0, q._)`${o} === ${G.default.errors}`);
}
function No(e) {
  (0, xe.checkUnknownRules)(e), qi(e);
}
function To(e, t) {
  if (e.opts.jtd)
    return Is(e, [], !1, t);
  const r = (0, As.getSchemaTypes)(e.schema), n = (0, As.coerceAndCheckDataType)(e, r);
  Is(e, r, !n, t);
}
function qi(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, xe.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function Hi(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, xe.checkStrictMode)(e, "default is ignored in the schema root");
}
function Ki(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, Di.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function Bi(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Co({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const o = r.$comment;
  if (s.$comment === !0)
    e.code((0, q._)`${G.default.self}.logger.log(${o})`);
  else if (typeof s.$comment == "function") {
    const a = (0, q.str)`${n}/$comment`, u = e.scopeValue("root", { ref: t.root });
    e.code((0, q._)`${G.default.self}.opts.$comment(${o}, ${a}, ${u}.schema)`);
  }
}
function Gi(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: o } = e;
  r.$async ? t.if((0, q._)`${G.default.errors} === 0`, () => t.return(G.default.data), () => t.throw((0, q._)`new ${s}(${G.default.vErrors})`)) : (t.assign((0, q._)`${n}.errors`, G.default.vErrors), o.unevaluated && Ji(e), t.return((0, q._)`${G.default.errors} === 0`));
}
function Ji({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof q.Name && e.assign((0, q._)`${t}.props`, r), n instanceof q.Name && e.assign((0, q._)`${t}.items`, n);
}
function Is(e, t, r, n) {
  const { gen: s, schema: o, data: a, allErrors: u, opts: p, self: c } = e, { RULES: i } = c;
  if (o.$ref && (p.ignoreKeywordsWithRef || !(0, xe.schemaHasRulesButRef)(o, i))) {
    s.block(() => Io(e, "$ref", i.all.$ref.definition));
    return;
  }
  p.jtd || Wi(e, t), s.block(() => {
    for (const w of i.rules)
      d(w);
    d(i.post);
  });
  function d(w) {
    (0, Nn.shouldUseGroup)(o, w) && (w.type ? (s.if((0, Dr.checkDataType)(w.type, a, p.strictNumbers)), Ds(e, w), t.length === 1 && t[0] === w.type && r && (s.else(), (0, Dr.reportTypeError)(e)), s.endIf()) : Ds(e, w), u || s.if((0, q._)`${G.default.errors} === ${n || 0}`));
  }
}
function Ds(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, Ii.assignDefaults)(e, t.type), r.block(() => {
    for (const o of t.rules)
      (0, Nn.shouldUseRule)(n, o) && Io(e, o.keyword, o.definition, t.type);
  });
}
function Wi(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (xi(e, t), e.opts.allowUnionTypes || Xi(e, t), Yi(e, e.dataTypes));
}
function xi(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      Ao(e.dataTypes, r) || Tn(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), Zi(e, t);
  }
}
function Xi(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && Tn(e, "use allowUnionTypes to allow union type keyword");
}
function Yi(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, Nn.shouldUseRule)(e.schema, s)) {
      const { type: o } = s.definition;
      o.length && !o.some((a) => Qi(t, a)) && Tn(e, `missing type "${o.join(",")}" for keyword "${n}"`);
    }
  }
}
function Qi(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function Ao(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function Zi(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    Ao(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function Tn(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, xe.checkStrictMode)(e, t, e.opts.strictTypes);
}
class jo {
  constructor(t, r, n) {
    if ((0, Yt.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, xe.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", Do(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, Yt.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", G.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, q.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, q.not)(t), void 0, r);
  }
  fail(t) {
    if (t === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(t), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(t) {
    if (!this.$data)
      return this.fail(t);
    const { schemaCode: r } = this;
    this.fail((0, q._)`${r} !== undefined && (${(0, q.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? Gt.reportExtraError : Gt.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Gt.reportError)(this, this.def.$dataError || Gt.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Gt.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = q.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = q.nil, r = q.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: s, schemaType: o, def: a } = this;
    n.if((0, q.or)((0, q._)`${s} === undefined`, r)), t !== q.nil && n.assign(t, !0), (o.length || a.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== q.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: s, it: o } = this;
    return (0, q.or)(a(), u());
    function a() {
      if (n.length) {
        if (!(r instanceof q.Name))
          throw new Error("ajv implementation error");
        const p = Array.isArray(n) ? n : [n];
        return (0, q._)`${(0, Dr.checkDataTypes)(p, r, o.opts.strictNumbers, Dr.DataType.Wrong)}`;
      }
      return q.nil;
    }
    function u() {
      if (s.validateSchema) {
        const p = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, q._)`!${p}(${r})`;
      }
      return q.nil;
    }
  }
  subschema(t, r) {
    const n = (0, tn.getSubschema)(this.it, t);
    (0, tn.extendSubschemaData)(n, this.it, t), (0, tn.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return Vi(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = xe.mergeEvaluated.props(s, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = xe.mergeEvaluated.items(s, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, q.Name)), !0;
  }
}
De.KeywordCxt = jo;
function Io(e, t, r, n) {
  const s = new jo(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, Yt.funcKeywordCode)(s, r) : "macro" in r ? (0, Yt.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, Yt.funcKeywordCode)(s, r);
}
const ec = /^\/(?:[^~]|~0|~1)*$/, tc = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Do(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, o;
  if (e === "")
    return G.default.rootData;
  if (e[0] === "/") {
    if (!ec.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, o = G.default.rootData;
  } else {
    const c = tc.exec(e);
    if (!c)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const i = +c[1];
    if (s = c[2], s === "#") {
      if (i >= t)
        throw new Error(p("property/index", i));
      return n[t - i];
    }
    if (i > t)
      throw new Error(p("data", i));
    if (o = r[t - i], !s)
      return o;
  }
  let a = o;
  const u = s.split("/");
  for (const c of u)
    c && (o = (0, q._)`${o}${(0, q.getProperty)((0, xe.unescapeJsonPointer)(c))}`, a = (0, q._)`${a} && ${o}`);
  return a;
  function p(c, i) {
    return `Cannot access ${c} ${i} levels up, current level is ${t}`;
  }
}
De.getData = Do;
var ur = {};
Object.defineProperty(ur, "__esModule", { value: !0 });
class rc extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
ur.default = rc;
var lr = {};
Object.defineProperty(lr, "__esModule", { value: !0 });
const rn = ve;
class nc extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, rn.resolveUrl)(t, r, n), this.missingSchema = (0, rn.normalizeId)((0, rn.getFullPath)(t, this.missingRef));
  }
}
lr.default = nc;
var Pe = {};
Object.defineProperty(Pe, "__esModule", { value: !0 });
Pe.resolveSchema = Pe.getCompilingSchema = Pe.resolveRef = Pe.compileSchema = Pe.SchemaEnv = void 0;
const Ae = W, sc = ur, lt = Ge, Ie = ve, ks = re, oc = De;
class Br {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, Ie.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
Pe.SchemaEnv = Br;
function Cn(e) {
  const t = ko.call(this, e);
  if (t)
    return t;
  const r = (0, Ie.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: o } = this.opts, a = new Ae.CodeGen(this.scope, { es5: n, lines: s, ownProperties: o });
  let u;
  e.$async && (u = a.scopeValue("Error", {
    ref: sc.default,
    code: (0, Ae._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const p = a.scopeName("validate");
  e.validateName = p;
  const c = {
    gen: a,
    allErrors: this.opts.allErrors,
    data: lt.default.data,
    parentData: lt.default.parentData,
    parentDataProperty: lt.default.parentDataProperty,
    dataNames: [lt.default.data],
    dataPathArr: [Ae.nil],
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: a.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Ae.stringify)(e.schema) } : { ref: e.schema }),
    validateName: p,
    ValidationError: u,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: Ae.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Ae._)`""`,
    opts: this.opts,
    self: this
  };
  let i;
  try {
    this._compilations.add(e), (0, oc.validateFunctionCode)(c), a.optimize(this.opts.code.optimize);
    const d = a.toString();
    i = `${a.scopeRefs(lt.default.scope)}return ${d}`, this.opts.code.process && (i = this.opts.code.process(i, e));
    const b = new Function(`${lt.default.self}`, `${lt.default.scope}`, i)(this, this.scope.get());
    if (this.scope.value(p, { ref: b }), b.errors = null, b.schema = e.schema, b.schemaEnv = e, e.$async && (b.$async = !0), this.opts.code.source === !0 && (b.source = { validateName: p, validateCode: d, scopeValues: a._values }), this.opts.unevaluated) {
      const { props: h, items: y } = c;
      b.evaluated = {
        props: h instanceof Ae.Name ? void 0 : h,
        items: y instanceof Ae.Name ? void 0 : y,
        dynamicProps: h instanceof Ae.Name,
        dynamicItems: y instanceof Ae.Name
      }, b.source && (b.source.evaluated = (0, Ae.stringify)(b.evaluated));
    }
    return e.validate = b, e;
  } catch (d) {
    throw delete e.validate, delete e.validateName, i && this.logger.error("Error compiling schema, function code:", i), d;
  } finally {
    this._compilations.delete(e);
  }
}
Pe.compileSchema = Cn;
function ac(e, t, r) {
  var n;
  r = (0, Ie.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let o = uc.call(this, e, r);
  if (o === void 0) {
    const a = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: u } = this.opts;
    a && (o = new Br({ schema: a, schemaId: u, root: e, baseId: t }));
  }
  if (o !== void 0)
    return e.refs[r] = ic.call(this, o);
}
Pe.resolveRef = ac;
function ic(e) {
  return (0, Ie.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Cn.call(this, e);
}
function ko(e) {
  for (const t of this._compilations)
    if (cc(t, e))
      return t;
}
Pe.getCompilingSchema = ko;
function cc(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function uc(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || Gr.call(this, e, t);
}
function Gr(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, Ie._getFullPath)(this.opts.uriResolver, r);
  let s = (0, Ie.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return nn.call(this, r, e);
  const o = (0, Ie.normalizeId)(n), a = this.refs[o] || this.schemas[o];
  if (typeof a == "string") {
    const u = Gr.call(this, e, a);
    return typeof (u == null ? void 0 : u.schema) != "object" ? void 0 : nn.call(this, r, u);
  }
  if (typeof (a == null ? void 0 : a.schema) == "object") {
    if (a.validate || Cn.call(this, a), o === (0, Ie.normalizeId)(t)) {
      const { schema: u } = a, { schemaId: p } = this.opts, c = u[p];
      return c && (s = (0, Ie.resolveUrl)(this.opts.uriResolver, s, c)), new Br({ schema: u, schemaId: p, root: e, baseId: s });
    }
    return nn.call(this, r, a);
  }
}
Pe.resolveSchema = Gr;
const lc = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function nn(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const u of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const p = r[(0, ks.unescapeFragment)(u)];
    if (p === void 0)
      return;
    r = p;
    const c = typeof r == "object" && r[this.opts.schemaId];
    !lc.has(u) && c && (t = (0, Ie.resolveUrl)(this.opts.uriResolver, t, c));
  }
  let o;
  if (typeof r != "boolean" && r.$ref && !(0, ks.schemaHasRulesButRef)(r, this.RULES)) {
    const u = (0, Ie.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    o = Gr.call(this, n, u);
  }
  const { schemaId: a } = this.opts;
  if (o = o || new Br({ schema: r, schemaId: a, root: n, baseId: t }), o.schema !== o.root.schema)
    return o;
}
const dc = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", fc = "Meta-schema for $data reference (JSON AnySchema extension proposal)", pc = "object", hc = [
  "$data"
], mc = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, yc = !1, gc = {
  $id: dc,
  description: fc,
  type: pc,
  required: hc,
  properties: mc,
  additionalProperties: yc
};
var An = {}, kr = {}, vc = {
  get exports() {
    return kr;
  },
  set exports(e) {
    kr = e;
  }
};
/** @license URI.js v4.4.1 (c) 2011 Gary Court. License: http://github.com/garycourt/uri-js */
(function(e, t) {
  (function(r, n) {
    n(t);
  })(Fa, function(r) {
    function n() {
      for (var g = arguments.length, f = Array(g), $ = 0; $ < g; $++)
        f[$] = arguments[$];
      if (f.length > 1) {
        f[0] = f[0].slice(0, -1);
        for (var T = f.length - 1, N = 1; N < T; ++N)
          f[N] = f[N].slice(1, -1);
        return f[T] = f[T].slice(1), f.join("");
      } else
        return f[0];
    }
    function s(g) {
      return "(?:" + g + ")";
    }
    function o(g) {
      return g === void 0 ? "undefined" : g === null ? "null" : Object.prototype.toString.call(g).split(" ").pop().split("]").shift().toLowerCase();
    }
    function a(g) {
      return g.toUpperCase();
    }
    function u(g) {
      return g != null ? g instanceof Array ? g : typeof g.length != "number" || g.split || g.setInterval || g.call ? [g] : Array.prototype.slice.call(g) : [];
    }
    function p(g, f) {
      var $ = g;
      if (f)
        for (var T in f)
          $[T] = f[T];
      return $;
    }
    function c(g) {
      var f = "[A-Za-z]", $ = "[0-9]", T = n($, "[A-Fa-f]"), N = s(s("%[EFef]" + T + "%" + T + T + "%" + T + T) + "|" + s("%[89A-Fa-f]" + T + "%" + T + T) + "|" + s("%" + T + T)), H = "[\\:\\/\\?\\#\\[\\]\\@]", K = "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]", ee = n(H, K), oe = g ? "[\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]" : "[]", le = g ? "[\\uE000-\\uF8FF]" : "[]", Q = n(f, $, "[\\-\\.\\_\\~]", oe);
      s(f + n(f, $, "[\\+\\-\\.]") + "*"), s(s(N + "|" + n(Q, K, "[\\:]")) + "*");
      var ne = s(s("25[0-5]") + "|" + s("2[0-4]" + $) + "|" + s("1" + $ + $) + "|" + s("0?[1-9]" + $) + "|0?0?" + $), de = s(ne + "\\." + ne + "\\." + ne + "\\." + ne), J = s(T + "{1,4}"), ie = s(s(J + "\\:" + J) + "|" + de), he = s(s(J + "\\:") + "{6}" + ie), ce = s("\\:\\:" + s(J + "\\:") + "{5}" + ie), Ze = s(s(J) + "?\\:\\:" + s(J + "\\:") + "{4}" + ie), Ue = s(s(s(J + "\\:") + "{0,1}" + J) + "?\\:\\:" + s(J + "\\:") + "{3}" + ie), ze = s(s(s(J + "\\:") + "{0,2}" + J) + "?\\:\\:" + s(J + "\\:") + "{2}" + ie), St = s(s(s(J + "\\:") + "{0,3}" + J) + "?\\:\\:" + J + "\\:" + ie), ct = s(s(s(J + "\\:") + "{0,4}" + J) + "?\\:\\:" + ie), Te = s(s(s(J + "\\:") + "{0,5}" + J) + "?\\:\\:" + J), Ve = s(s(s(J + "\\:") + "{0,6}" + J) + "?\\:\\:"), ut = s([he, ce, Ze, Ue, ze, St, ct, Te, Ve].join("|")), Je = s(s(Q + "|" + N) + "+");
      s("[vV]" + T + "+\\." + n(Q, K, "[\\:]") + "+"), s(s(N + "|" + n(Q, K)) + "*");
      var Kt = s(N + "|" + n(Q, K, "[\\:\\@]"));
      return s(s(N + "|" + n(Q, K, "[\\@]")) + "+"), s(s(Kt + "|" + n("[\\/\\?]", le)) + "*"), {
        NOT_SCHEME: new RegExp(n("[^]", f, $, "[\\+\\-\\.]"), "g"),
        NOT_USERINFO: new RegExp(n("[^\\%\\:]", Q, K), "g"),
        NOT_HOST: new RegExp(n("[^\\%\\[\\]\\:]", Q, K), "g"),
        NOT_PATH: new RegExp(n("[^\\%\\/\\:\\@]", Q, K), "g"),
        NOT_PATH_NOSCHEME: new RegExp(n("[^\\%\\/\\@]", Q, K), "g"),
        NOT_QUERY: new RegExp(n("[^\\%]", Q, K, "[\\:\\@\\/\\?]", le), "g"),
        NOT_FRAGMENT: new RegExp(n("[^\\%]", Q, K, "[\\:\\@\\/\\?]"), "g"),
        ESCAPE: new RegExp(n("[^]", Q, K), "g"),
        UNRESERVED: new RegExp(Q, "g"),
        OTHER_CHARS: new RegExp(n("[^\\%]", Q, ee), "g"),
        PCT_ENCODED: new RegExp(N, "g"),
        IPV4ADDRESS: new RegExp("^(" + de + ")$"),
        IPV6ADDRESS: new RegExp("^\\[?(" + ut + ")" + s(s("\\%25|\\%(?!" + T + "{2})") + "(" + Je + ")") + "?\\]?$")
        //RFC 6874, with relaxed parsing rules
      };
    }
    var i = c(!1), d = c(!0), w = function() {
      function g(f, $) {
        var T = [], N = !0, H = !1, K = void 0;
        try {
          for (var ee = f[Symbol.iterator](), oe; !(N = (oe = ee.next()).done) && (T.push(oe.value), !($ && T.length === $)); N = !0)
            ;
        } catch (le) {
          H = !0, K = le;
        } finally {
          try {
            !N && ee.return && ee.return();
          } finally {
            if (H)
              throw K;
          }
        }
        return T;
      }
      return function(f, $) {
        if (Array.isArray(f))
          return f;
        if (Symbol.iterator in Object(f))
          return g(f, $);
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      };
    }(), b = function(g) {
      if (Array.isArray(g)) {
        for (var f = 0, $ = Array(g.length); f < g.length; f++)
          $[f] = g[f];
        return $;
      } else
        return Array.from(g);
    }, h = 2147483647, y = 36, _ = 1, m = 26, E = 38, P = 700, A = 72, k = 128, S = "-", C = /^xn--/, M = /[^\0-\x7E]/, F = /[\x2E\u3002\uFF0E\uFF61]/g, L = {
      overflow: "Overflow: input needs wider integers to process",
      "not-basic": "Illegal input >= 0x80 (not a basic code point)",
      "invalid-input": "Invalid input"
    }, x = y - _, B = Math.floor, pe = String.fromCharCode;
    function se(g) {
      throw new RangeError(L[g]);
    }
    function Re(g, f) {
      for (var $ = [], T = g.length; T--; )
        $[T] = f(g[T]);
      return $;
    }
    function ot(g, f) {
      var $ = g.split("@"), T = "";
      $.length > 1 && (T = $[0] + "@", g = $[1]), g = g.replace(F, ".");
      var N = g.split("."), H = Re(N, f).join(".");
      return T + H;
    }
    function yt(g) {
      for (var f = [], $ = 0, T = g.length; $ < T; ) {
        var N = g.charCodeAt($++);
        if (N >= 55296 && N <= 56319 && $ < T) {
          var H = g.charCodeAt($++);
          (H & 64512) == 56320 ? f.push(((N & 1023) << 10) + (H & 1023) + 65536) : (f.push(N), $--);
        } else
          f.push(N);
      }
      return f;
    }
    var Mt = function(f) {
      return String.fromCodePoint.apply(String, b(f));
    }, gt = function(f) {
      return f - 48 < 10 ? f - 22 : f - 65 < 26 ? f - 65 : f - 97 < 26 ? f - 97 : y;
    }, U = function(f, $) {
      return f + 22 + 75 * (f < 26) - (($ != 0) << 5);
    }, O = function(f, $, T) {
      var N = 0;
      for (
        f = T ? B(f / P) : f >> 1, f += B(f / $);
        /* no initialization */
        f > x * m >> 1;
        N += y
      )
        f = B(f / x);
      return B(N + (x + 1) * f / (f + E));
    }, D = function(f) {
      var $ = [], T = f.length, N = 0, H = k, K = A, ee = f.lastIndexOf(S);
      ee < 0 && (ee = 0);
      for (var oe = 0; oe < ee; ++oe)
        f.charCodeAt(oe) >= 128 && se("not-basic"), $.push(f.charCodeAt(oe));
      for (var le = ee > 0 ? ee + 1 : 0; le < T; ) {
        for (
          var Q = N, ne = 1, de = y;
          ;
          /* no condition */
          de += y
        ) {
          le >= T && se("invalid-input");
          var J = gt(f.charCodeAt(le++));
          (J >= y || J > B((h - N) / ne)) && se("overflow"), N += J * ne;
          var ie = de <= K ? _ : de >= K + m ? m : de - K;
          if (J < ie)
            break;
          var he = y - ie;
          ne > B(h / he) && se("overflow"), ne *= he;
        }
        var ce = $.length + 1;
        K = O(N - Q, ce, Q == 0), B(N / ce) > h - H && se("overflow"), H += B(N / ce), N %= ce, $.splice(N++, 0, H);
      }
      return String.fromCodePoint.apply(String, $);
    }, R = function(f) {
      var $ = [];
      f = yt(f);
      var T = f.length, N = k, H = 0, K = A, ee = !0, oe = !1, le = void 0;
      try {
        for (var Q = f[Symbol.iterator](), ne; !(ee = (ne = Q.next()).done); ee = !0) {
          var de = ne.value;
          de < 128 && $.push(pe(de));
        }
      } catch (Bt) {
        oe = !0, le = Bt;
      } finally {
        try {
          !ee && Q.return && Q.return();
        } finally {
          if (oe)
            throw le;
        }
      }
      var J = $.length, ie = J;
      for (J && $.push(S); ie < T; ) {
        var he = h, ce = !0, Ze = !1, Ue = void 0;
        try {
          for (var ze = f[Symbol.iterator](), St; !(ce = (St = ze.next()).done); ce = !0) {
            var ct = St.value;
            ct >= N && ct < he && (he = ct);
          }
        } catch (Bt) {
          Ze = !0, Ue = Bt;
        } finally {
          try {
            !ce && ze.return && ze.return();
          } finally {
            if (Ze)
              throw Ue;
          }
        }
        var Te = ie + 1;
        he - N > B((h - H) / Te) && se("overflow"), H += (he - N) * Te, N = he;
        var Ve = !0, ut = !1, Je = void 0;
        try {
          for (var Kt = f[Symbol.iterator](), Ps; !(Ve = (Ps = Kt.next()).done); Ve = !0) {
            var Os = Ps.value;
            if (Os < N && ++H > h && se("overflow"), Os == N) {
              for (
                var mr = H, yr = y;
                ;
                /* no condition */
                yr += y
              ) {
                var gr = yr <= K ? _ : yr >= K + m ? m : yr - K;
                if (mr < gr)
                  break;
                var Rs = mr - gr, Ns = y - gr;
                $.push(pe(U(gr + Rs % Ns, 0))), mr = B(Rs / Ns);
              }
              $.push(pe(U(mr, 0))), K = O(H, Te, ie == J), H = 0, ++ie;
            }
          }
        } catch (Bt) {
          ut = !0, Je = Bt;
        } finally {
          try {
            !Ve && Kt.return && Kt.return();
          } finally {
            if (ut)
              throw Je;
          }
        }
        ++H, ++N;
      }
      return $.join("");
    }, l = function(f) {
      return ot(f, function($) {
        return C.test($) ? D($.slice(4).toLowerCase()) : $;
      });
    }, v = function(f) {
      return ot(f, function($) {
        return M.test($) ? "xn--" + R($) : $;
      });
    }, j = {
      /**
       * A string representing the current Punycode.js version number.
       * @memberOf punycode
       * @type String
       */
      version: "2.1.0",
      /**
       * An object of methods to convert from JavaScript's internal character
       * representation (UCS-2) to Unicode code points, and back.
       * @see <https://mathiasbynens.be/notes/javascript-encoding>
       * @memberOf punycode
       * @type Object
       */
      ucs2: {
        decode: yt,
        encode: Mt
      },
      decode: D,
      encode: R,
      toASCII: v,
      toUnicode: l
    }, z = {};
    function V(g) {
      var f = g.charCodeAt(0), $ = void 0;
      return f < 16 ? $ = "%0" + f.toString(16).toUpperCase() : f < 128 ? $ = "%" + f.toString(16).toUpperCase() : f < 2048 ? $ = "%" + (f >> 6 | 192).toString(16).toUpperCase() + "%" + (f & 63 | 128).toString(16).toUpperCase() : $ = "%" + (f >> 12 | 224).toString(16).toUpperCase() + "%" + (f >> 6 & 63 | 128).toString(16).toUpperCase() + "%" + (f & 63 | 128).toString(16).toUpperCase(), $;
    }
    function Y(g) {
      for (var f = "", $ = 0, T = g.length; $ < T; ) {
        var N = parseInt(g.substr($ + 1, 2), 16);
        if (N < 128)
          f += String.fromCharCode(N), $ += 3;
        else if (N >= 194 && N < 224) {
          if (T - $ >= 6) {
            var H = parseInt(g.substr($ + 4, 2), 16);
            f += String.fromCharCode((N & 31) << 6 | H & 63);
          } else
            f += g.substr($, 6);
          $ += 6;
        } else if (N >= 224) {
          if (T - $ >= 9) {
            var K = parseInt(g.substr($ + 4, 2), 16), ee = parseInt(g.substr($ + 7, 2), 16);
            f += String.fromCharCode((N & 15) << 12 | (K & 63) << 6 | ee & 63);
          } else
            f += g.substr($, 9);
          $ += 9;
        } else
          f += g.substr($, 3), $ += 3;
      }
      return f;
    }
    function Z(g, f) {
      function $(T) {
        var N = Y(T);
        return N.match(f.UNRESERVED) ? N : T;
      }
      return g.scheme && (g.scheme = String(g.scheme).replace(f.PCT_ENCODED, $).toLowerCase().replace(f.NOT_SCHEME, "")), g.userinfo !== void 0 && (g.userinfo = String(g.userinfo).replace(f.PCT_ENCODED, $).replace(f.NOT_USERINFO, V).replace(f.PCT_ENCODED, a)), g.host !== void 0 && (g.host = String(g.host).replace(f.PCT_ENCODED, $).toLowerCase().replace(f.NOT_HOST, V).replace(f.PCT_ENCODED, a)), g.path !== void 0 && (g.path = String(g.path).replace(f.PCT_ENCODED, $).replace(g.scheme ? f.NOT_PATH : f.NOT_PATH_NOSCHEME, V).replace(f.PCT_ENCODED, a)), g.query !== void 0 && (g.query = String(g.query).replace(f.PCT_ENCODED, $).replace(f.NOT_QUERY, V).replace(f.PCT_ENCODED, a)), g.fragment !== void 0 && (g.fragment = String(g.fragment).replace(f.PCT_ENCODED, $).replace(f.NOT_FRAGMENT, V).replace(f.PCT_ENCODED, a)), g;
    }
    function ue(g) {
      return g.replace(/^0*(.*)/, "$1") || "0";
    }
    function ke(g, f) {
      var $ = g.match(f.IPV4ADDRESS) || [], T = w($, 2), N = T[1];
      return N ? N.split(".").map(ue).join(".") : g;
    }
    function vt(g, f) {
      var $ = g.match(f.IPV6ADDRESS) || [], T = w($, 3), N = T[1], H = T[2];
      if (N) {
        for (var K = N.toLowerCase().split("::").reverse(), ee = w(K, 2), oe = ee[0], le = ee[1], Q = le ? le.split(":").map(ue) : [], ne = oe.split(":").map(ue), de = f.IPV4ADDRESS.test(ne[ne.length - 1]), J = de ? 7 : 8, ie = ne.length - J, he = Array(J), ce = 0; ce < J; ++ce)
          he[ce] = Q[ce] || ne[ie + ce] || "";
        de && (he[J - 1] = ke(he[J - 1], f));
        var Ze = he.reduce(function(Te, Ve, ut) {
          if (!Ve || Ve === "0") {
            var Je = Te[Te.length - 1];
            Je && Je.index + Je.length === ut ? Je.length++ : Te.push({ index: ut, length: 1 });
          }
          return Te;
        }, []), Ue = Ze.sort(function(Te, Ve) {
          return Ve.length - Te.length;
        })[0], ze = void 0;
        if (Ue && Ue.length > 1) {
          var St = he.slice(0, Ue.index), ct = he.slice(Ue.index + Ue.length);
          ze = St.join(":") + "::" + ct.join(":");
        } else
          ze = he.join(":");
        return H && (ze += "%" + H), ze;
      } else
        return g;
    }
    var Ft = /^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?(\[[^\/?#\]]+\]|[^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n|\r)*))?/i, Ut = "".match(/(){0}/)[1] === void 0;
    function Oe(g) {
      var f = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, $ = {}, T = f.iri !== !1 ? d : i;
      f.reference === "suffix" && (g = (f.scheme ? f.scheme + ":" : "") + "//" + g);
      var N = g.match(Ft);
      if (N) {
        Ut ? ($.scheme = N[1], $.userinfo = N[3], $.host = N[4], $.port = parseInt(N[5], 10), $.path = N[6] || "", $.query = N[7], $.fragment = N[8], isNaN($.port) && ($.port = N[5])) : ($.scheme = N[1] || void 0, $.userinfo = g.indexOf("@") !== -1 ? N[3] : void 0, $.host = g.indexOf("//") !== -1 ? N[4] : void 0, $.port = parseInt(N[5], 10), $.path = N[6] || "", $.query = g.indexOf("?") !== -1 ? N[7] : void 0, $.fragment = g.indexOf("#") !== -1 ? N[8] : void 0, isNaN($.port) && ($.port = g.match(/\/\/(?:.|\n)*\:(?:\/|\?|\#|$)/) ? N[4] : void 0)), $.host && ($.host = vt(ke($.host, T), T)), $.scheme === void 0 && $.userinfo === void 0 && $.host === void 0 && $.port === void 0 && !$.path && $.query === void 0 ? $.reference = "same-document" : $.scheme === void 0 ? $.reference = "relative" : $.fragment === void 0 ? $.reference = "absolute" : $.reference = "uri", f.reference && f.reference !== "suffix" && f.reference !== $.reference && ($.error = $.error || "URI is not a " + f.reference + " reference.");
        var H = z[(f.scheme || $.scheme || "").toLowerCase()];
        if (!f.unicodeSupport && (!H || !H.unicodeSupport)) {
          if ($.host && (f.domainHost || H && H.domainHost))
            try {
              $.host = j.toASCII($.host.replace(T.PCT_ENCODED, Y).toLowerCase());
            } catch (K) {
              $.error = $.error || "Host's domain name can not be converted to ASCII via punycode: " + K;
            }
          Z($, i);
        } else
          Z($, T);
        H && H.parse && H.parse($, f);
      } else
        $.error = $.error || "URI can not be parsed.";
      return $;
    }
    function zt(g, f) {
      var $ = f.iri !== !1 ? d : i, T = [];
      return g.userinfo !== void 0 && (T.push(g.userinfo), T.push("@")), g.host !== void 0 && T.push(vt(ke(String(g.host), $), $).replace($.IPV6ADDRESS, function(N, H, K) {
        return "[" + H + (K ? "%25" + K : "") + "]";
      })), (typeof g.port == "number" || typeof g.port == "string") && (T.push(":"), T.push(String(g.port))), T.length ? T.join("") : void 0;
    }
    var $t = /^\.\.?\//, _t = /^\/\.(\/|$)/, wt = /^\/\.\.(\/|$)/, Vt = /^\/?(?:.|\n)*?(?=\/|$)/;
    function Me(g) {
      for (var f = []; g.length; )
        if (g.match($t))
          g = g.replace($t, "");
        else if (g.match(_t))
          g = g.replace(_t, "/");
        else if (g.match(wt))
          g = g.replace(wt, "/"), f.pop();
        else if (g === "." || g === "..")
          g = "";
        else {
          var $ = g.match(Vt);
          if ($) {
            var T = $[0];
            g = g.slice(T.length), f.push(T);
          } else
            throw new Error("Unexpected dot segment condition");
        }
      return f.join("");
    }
    function be(g) {
      var f = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, $ = f.iri ? d : i, T = [], N = z[(f.scheme || g.scheme || "").toLowerCase()];
      if (N && N.serialize && N.serialize(g, f), g.host && !$.IPV6ADDRESS.test(g.host)) {
        if (f.domainHost || N && N.domainHost)
          try {
            g.host = f.iri ? j.toUnicode(g.host) : j.toASCII(g.host.replace($.PCT_ENCODED, Y).toLowerCase());
          } catch (ee) {
            g.error = g.error || "Host's domain name can not be converted to " + (f.iri ? "Unicode" : "ASCII") + " via punycode: " + ee;
          }
      }
      Z(g, $), f.reference !== "suffix" && g.scheme && (T.push(g.scheme), T.push(":"));
      var H = zt(g, f);
      if (H !== void 0 && (f.reference !== "suffix" && T.push("//"), T.push(H), g.path && g.path.charAt(0) !== "/" && T.push("/")), g.path !== void 0) {
        var K = g.path;
        !f.absolutePath && (!N || !N.absolutePath) && (K = Me(K)), H === void 0 && (K = K.replace(/^\/\//, "/%2F")), T.push(K);
      }
      return g.query !== void 0 && (T.push("?"), T.push(g.query)), g.fragment !== void 0 && (T.push("#"), T.push(g.fragment)), T.join("");
    }
    function bt(g, f) {
      var $ = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, T = arguments[3], N = {};
      return T || (g = Oe(be(g, $), $), f = Oe(be(f, $), $)), $ = $ || {}, !$.tolerant && f.scheme ? (N.scheme = f.scheme, N.userinfo = f.userinfo, N.host = f.host, N.port = f.port, N.path = Me(f.path || ""), N.query = f.query) : (f.userinfo !== void 0 || f.host !== void 0 || f.port !== void 0 ? (N.userinfo = f.userinfo, N.host = f.host, N.port = f.port, N.path = Me(f.path || ""), N.query = f.query) : (f.path ? (f.path.charAt(0) === "/" ? N.path = Me(f.path) : ((g.userinfo !== void 0 || g.host !== void 0 || g.port !== void 0) && !g.path ? N.path = "/" + f.path : g.path ? N.path = g.path.slice(0, g.path.lastIndexOf("/") + 1) + f.path : N.path = f.path, N.path = Me(N.path)), N.query = f.query) : (N.path = g.path, f.query !== void 0 ? N.query = f.query : N.query = g.query), N.userinfo = g.userinfo, N.host = g.host, N.port = g.port), N.scheme = g.scheme), N.fragment = f.fragment, N;
    }
    function Lt(g, f, $) {
      var T = p({ scheme: "null" }, $);
      return be(bt(Oe(g, T), Oe(f, T), T, !0), T);
    }
    function at(g, f) {
      return typeof g == "string" ? g = be(Oe(g, f), f) : o(g) === "object" && (g = Oe(be(g, f), f)), g;
    }
    function qt(g, f, $) {
      return typeof g == "string" ? g = be(Oe(g, $), $) : o(g) === "object" && (g = be(g, $)), typeof f == "string" ? f = be(Oe(f, $), $) : o(f) === "object" && (f = be(f, $)), g === f;
    }
    function hr(g, f) {
      return g && g.toString().replace(!f || !f.iri ? i.ESCAPE : d.ESCAPE, V);
    }
    function Ne(g, f) {
      return g && g.toString().replace(!f || !f.iri ? i.PCT_ENCODED : d.PCT_ENCODED, Y);
    }
    var it = {
      scheme: "http",
      domainHost: !0,
      parse: function(f, $) {
        return f.host || (f.error = f.error || "HTTP URIs must have a host."), f;
      },
      serialize: function(f, $) {
        var T = String(f.scheme).toLowerCase() === "https";
        return (f.port === (T ? 443 : 80) || f.port === "") && (f.port = void 0), f.path || (f.path = "/"), f;
      }
    }, gs = {
      scheme: "https",
      domainHost: it.domainHost,
      parse: it.parse,
      serialize: it.serialize
    };
    function vs(g) {
      return typeof g.secure == "boolean" ? g.secure : String(g.scheme).toLowerCase() === "wss";
    }
    var Ht = {
      scheme: "ws",
      domainHost: !0,
      parse: function(f, $) {
        var T = f;
        return T.secure = vs(T), T.resourceName = (T.path || "/") + (T.query ? "?" + T.query : ""), T.path = void 0, T.query = void 0, T;
      },
      serialize: function(f, $) {
        if ((f.port === (vs(f) ? 443 : 80) || f.port === "") && (f.port = void 0), typeof f.secure == "boolean" && (f.scheme = f.secure ? "wss" : "ws", f.secure = void 0), f.resourceName) {
          var T = f.resourceName.split("?"), N = w(T, 2), H = N[0], K = N[1];
          f.path = H && H !== "/" ? H : void 0, f.query = K, f.resourceName = void 0;
        }
        return f.fragment = void 0, f;
      }
    }, $s = {
      scheme: "wss",
      domainHost: Ht.domainHost,
      parse: Ht.parse,
      serialize: Ht.serialize
    }, Pa = {}, _s = "[A-Za-z0-9\\-\\.\\_\\~\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]", Fe = "[0-9A-Fa-f]", Oa = s(s("%[EFef]" + Fe + "%" + Fe + Fe + "%" + Fe + Fe) + "|" + s("%[89A-Fa-f]" + Fe + "%" + Fe + Fe) + "|" + s("%" + Fe + Fe)), Ra = "[A-Za-z0-9\\!\\$\\%\\'\\*\\+\\-\\^\\_\\`\\{\\|\\}\\~]", Na = "[\\!\\$\\%\\'\\(\\)\\*\\+\\,\\-\\.0-9\\<\\>A-Z\\x5E-\\x7E]", Ta = n(Na, '[\\"\\\\]'), Ca = "[\\!\\$\\'\\(\\)\\*\\+\\,\\;\\:\\@]", Aa = new RegExp(_s, "g"), Et = new RegExp(Oa, "g"), ja = new RegExp(n("[^]", Ra, "[\\.]", '[\\"]', Ta), "g"), ws = new RegExp(n("[^]", _s, Ca), "g"), Ia = ws;
    function en(g) {
      var f = Y(g);
      return f.match(Aa) ? f : g;
    }
    var bs = {
      scheme: "mailto",
      parse: function(f, $) {
        var T = f, N = T.to = T.path ? T.path.split(",") : [];
        if (T.path = void 0, T.query) {
          for (var H = !1, K = {}, ee = T.query.split("&"), oe = 0, le = ee.length; oe < le; ++oe) {
            var Q = ee[oe].split("=");
            switch (Q[0]) {
              case "to":
                for (var ne = Q[1].split(","), de = 0, J = ne.length; de < J; ++de)
                  N.push(ne[de]);
                break;
              case "subject":
                T.subject = Ne(Q[1], $);
                break;
              case "body":
                T.body = Ne(Q[1], $);
                break;
              default:
                H = !0, K[Ne(Q[0], $)] = Ne(Q[1], $);
                break;
            }
          }
          H && (T.headers = K);
        }
        T.query = void 0;
        for (var ie = 0, he = N.length; ie < he; ++ie) {
          var ce = N[ie].split("@");
          if (ce[0] = Ne(ce[0]), $.unicodeSupport)
            ce[1] = Ne(ce[1], $).toLowerCase();
          else
            try {
              ce[1] = j.toASCII(Ne(ce[1], $).toLowerCase());
            } catch (Ze) {
              T.error = T.error || "Email address's domain name can not be converted to ASCII via punycode: " + Ze;
            }
          N[ie] = ce.join("@");
        }
        return T;
      },
      serialize: function(f, $) {
        var T = f, N = u(f.to);
        if (N) {
          for (var H = 0, K = N.length; H < K; ++H) {
            var ee = String(N[H]), oe = ee.lastIndexOf("@"), le = ee.slice(0, oe).replace(Et, en).replace(Et, a).replace(ja, V), Q = ee.slice(oe + 1);
            try {
              Q = $.iri ? j.toUnicode(Q) : j.toASCII(Ne(Q, $).toLowerCase());
            } catch (ie) {
              T.error = T.error || "Email address's domain name can not be converted to " + ($.iri ? "Unicode" : "ASCII") + " via punycode: " + ie;
            }
            N[H] = le + "@" + Q;
          }
          T.path = N.join(",");
        }
        var ne = f.headers = f.headers || {};
        f.subject && (ne.subject = f.subject), f.body && (ne.body = f.body);
        var de = [];
        for (var J in ne)
          ne[J] !== Pa[J] && de.push(J.replace(Et, en).replace(Et, a).replace(ws, V) + "=" + ne[J].replace(Et, en).replace(Et, a).replace(Ia, V));
        return de.length && (T.query = de.join("&")), T;
      }
    }, Da = /^([^\:]+)\:(.*)/, Es = {
      scheme: "urn",
      parse: function(f, $) {
        var T = f.path && f.path.match(Da), N = f;
        if (T) {
          var H = $.scheme || N.scheme || "urn", K = T[1].toLowerCase(), ee = T[2], oe = H + ":" + ($.nid || K), le = z[oe];
          N.nid = K, N.nss = ee, N.path = void 0, le && (N = le.parse(N, $));
        } else
          N.error = N.error || "URN can not be parsed.";
        return N;
      },
      serialize: function(f, $) {
        var T = $.scheme || f.scheme || "urn", N = f.nid, H = T + ":" + ($.nid || N), K = z[H];
        K && (f = K.serialize(f, $));
        var ee = f, oe = f.nss;
        return ee.path = (N || $.nid) + ":" + oe, ee;
      }
    }, ka = /^[0-9A-Fa-f]{8}(?:\-[0-9A-Fa-f]{4}){3}\-[0-9A-Fa-f]{12}$/, Ss = {
      scheme: "urn:uuid",
      parse: function(f, $) {
        var T = f;
        return T.uuid = T.nss, T.nss = void 0, !$.tolerant && (!T.uuid || !T.uuid.match(ka)) && (T.error = T.error || "UUID is not valid."), T;
      },
      serialize: function(f, $) {
        var T = f;
        return T.nss = (f.uuid || "").toLowerCase(), T;
      }
    };
    z[it.scheme] = it, z[gs.scheme] = gs, z[Ht.scheme] = Ht, z[$s.scheme] = $s, z[bs.scheme] = bs, z[Es.scheme] = Es, z[Ss.scheme] = Ss, r.SCHEMES = z, r.pctEncChar = V, r.pctDecChars = Y, r.parse = Oe, r.removeDotSegments = Me, r.serialize = be, r.resolveComponents = bt, r.resolve = Lt, r.normalize = at, r.equal = qt, r.escapeComponent = hr, r.unescapeComponent = Ne, Object.defineProperty(r, "__esModule", { value: !0 });
  });
})(vc, kr);
Object.defineProperty(An, "__esModule", { value: !0 });
const Mo = kr;
Mo.code = 'require("ajv/dist/runtime/uri").default';
An.default = Mo;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = De;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = W;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return r.CodeGen;
  } });
  const n = ur, s = lr, o = ht, a = Pe, u = W, p = ve, c = cr, i = re, d = gc, w = An, b = (U, O) => new RegExp(U, O);
  b.code = "new RegExp";
  const h = ["removeAdditional", "useDefaults", "coerceTypes"], y = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), _ = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, m = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, E = 200;
  function P(U) {
    var O, D, R, l, v, j, z, V, Y, Z, ue, ke, vt, Ft, Ut, Oe, zt, $t, _t, wt, Vt, Me, be, bt, Lt;
    const at = U.strict, qt = (O = U.code) === null || O === void 0 ? void 0 : O.optimize, hr = qt === !0 || qt === void 0 ? 1 : qt || 0, Ne = (R = (D = U.code) === null || D === void 0 ? void 0 : D.regExp) !== null && R !== void 0 ? R : b, it = (l = U.uriResolver) !== null && l !== void 0 ? l : w.default;
    return {
      strictSchema: (j = (v = U.strictSchema) !== null && v !== void 0 ? v : at) !== null && j !== void 0 ? j : !0,
      strictNumbers: (V = (z = U.strictNumbers) !== null && z !== void 0 ? z : at) !== null && V !== void 0 ? V : !0,
      strictTypes: (Z = (Y = U.strictTypes) !== null && Y !== void 0 ? Y : at) !== null && Z !== void 0 ? Z : "log",
      strictTuples: (ke = (ue = U.strictTuples) !== null && ue !== void 0 ? ue : at) !== null && ke !== void 0 ? ke : "log",
      strictRequired: (Ft = (vt = U.strictRequired) !== null && vt !== void 0 ? vt : at) !== null && Ft !== void 0 ? Ft : !1,
      code: U.code ? { ...U.code, optimize: hr, regExp: Ne } : { optimize: hr, regExp: Ne },
      loopRequired: (Ut = U.loopRequired) !== null && Ut !== void 0 ? Ut : E,
      loopEnum: (Oe = U.loopEnum) !== null && Oe !== void 0 ? Oe : E,
      meta: (zt = U.meta) !== null && zt !== void 0 ? zt : !0,
      messages: ($t = U.messages) !== null && $t !== void 0 ? $t : !0,
      inlineRefs: (_t = U.inlineRefs) !== null && _t !== void 0 ? _t : !0,
      schemaId: (wt = U.schemaId) !== null && wt !== void 0 ? wt : "$id",
      addUsedSchema: (Vt = U.addUsedSchema) !== null && Vt !== void 0 ? Vt : !0,
      validateSchema: (Me = U.validateSchema) !== null && Me !== void 0 ? Me : !0,
      validateFormats: (be = U.validateFormats) !== null && be !== void 0 ? be : !0,
      unicodeRegExp: (bt = U.unicodeRegExp) !== null && bt !== void 0 ? bt : !0,
      int32range: (Lt = U.int32range) !== null && Lt !== void 0 ? Lt : !0,
      uriResolver: it
    };
  }
  class A {
    constructor(O = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), O = this.opts = { ...O, ...P(O) };
      const { es5: D, lines: R } = this.opts.code;
      this.scope = new u.ValueScope({ scope: {}, prefixes: y, es5: D, lines: R }), this.logger = B(O.logger);
      const l = O.validateFormats;
      O.validateFormats = !1, this.RULES = (0, o.getRules)(), k.call(this, _, O, "NOT SUPPORTED"), k.call(this, m, O, "DEPRECATED", "warn"), this._metaOpts = L.call(this), O.formats && M.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), O.keywords && F.call(this, O.keywords), typeof O.meta == "object" && this.addMetaSchema(O.meta), C.call(this), O.validateFormats = l;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: O, meta: D, schemaId: R } = this.opts;
      let l = d;
      R === "id" && (l = { ...d }, l.id = l.$id, delete l.$id), D && O && this.addMetaSchema(l, l[R], !1);
    }
    defaultMeta() {
      const { meta: O, schemaId: D } = this.opts;
      return this.opts.defaultMeta = typeof O == "object" ? O[D] || O : void 0;
    }
    validate(O, D) {
      let R;
      if (typeof O == "string") {
        if (R = this.getSchema(O), !R)
          throw new Error(`no schema with key or ref "${O}"`);
      } else
        R = this.compile(O);
      const l = R(D);
      return "$async" in R || (this.errors = R.errors), l;
    }
    compile(O, D) {
      const R = this._addSchema(O, D);
      return R.validate || this._compileSchemaEnv(R);
    }
    compileAsync(O, D) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: R } = this.opts;
      return l.call(this, O, D);
      async function l(Z, ue) {
        await v.call(this, Z.$schema);
        const ke = this._addSchema(Z, ue);
        return ke.validate || j.call(this, ke);
      }
      async function v(Z) {
        Z && !this.getSchema(Z) && await l.call(this, { $ref: Z }, !0);
      }
      async function j(Z) {
        try {
          return this._compileSchemaEnv(Z);
        } catch (ue) {
          if (!(ue instanceof s.default))
            throw ue;
          return z.call(this, ue), await V.call(this, ue.missingSchema), j.call(this, Z);
        }
      }
      function z({ missingSchema: Z, missingRef: ue }) {
        if (this.refs[Z])
          throw new Error(`AnySchema ${Z} is loaded but ${ue} cannot be resolved`);
      }
      async function V(Z) {
        const ue = await Y.call(this, Z);
        this.refs[Z] || await v.call(this, ue.$schema), this.refs[Z] || this.addSchema(ue, Z, D);
      }
      async function Y(Z) {
        const ue = this._loading[Z];
        if (ue)
          return ue;
        try {
          return await (this._loading[Z] = R(Z));
        } finally {
          delete this._loading[Z];
        }
      }
    }
    // Adds schema to the instance
    addSchema(O, D, R, l = this.opts.validateSchema) {
      if (Array.isArray(O)) {
        for (const j of O)
          this.addSchema(j, void 0, R, l);
        return this;
      }
      let v;
      if (typeof O == "object") {
        const { schemaId: j } = this.opts;
        if (v = O[j], v !== void 0 && typeof v != "string")
          throw new Error(`schema ${j} must be string`);
      }
      return D = (0, p.normalizeId)(D || v), this._checkUnique(D), this.schemas[D] = this._addSchema(O, R, D, l, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(O, D, R = this.opts.validateSchema) {
      return this.addSchema(O, D, !0, R), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(O, D) {
      if (typeof O == "boolean")
        return !0;
      let R;
      if (R = O.$schema, R !== void 0 && typeof R != "string")
        throw new Error("$schema must be a string");
      if (R = R || this.opts.defaultMeta || this.defaultMeta(), !R)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const l = this.validate(R, O);
      if (!l && D) {
        const v = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(v);
        else
          throw new Error(v);
      }
      return l;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(O) {
      let D;
      for (; typeof (D = S.call(this, O)) == "string"; )
        O = D;
      if (D === void 0) {
        const { schemaId: R } = this.opts, l = new a.SchemaEnv({ schema: {}, schemaId: R });
        if (D = a.resolveSchema.call(this, l, O), !D)
          return;
        this.refs[O] = D;
      }
      return D.validate || this._compileSchemaEnv(D);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(O) {
      if (O instanceof RegExp)
        return this._removeAllSchemas(this.schemas, O), this._removeAllSchemas(this.refs, O), this;
      switch (typeof O) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const D = S.call(this, O);
          return typeof D == "object" && this._cache.delete(D.schema), delete this.schemas[O], delete this.refs[O], this;
        }
        case "object": {
          const D = O;
          this._cache.delete(D);
          let R = O[this.opts.schemaId];
          return R && (R = (0, p.normalizeId)(R), delete this.schemas[R], delete this.refs[R]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(O) {
      for (const D of O)
        this.addKeyword(D);
      return this;
    }
    addKeyword(O, D) {
      let R;
      if (typeof O == "string")
        R = O, typeof D == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), D.keyword = R);
      else if (typeof O == "object" && D === void 0) {
        if (D = O, R = D.keyword, Array.isArray(R) && !R.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (se.call(this, R, D), !D)
        return (0, i.eachItem)(R, (v) => Re.call(this, v)), this;
      yt.call(this, D);
      const l = {
        ...D,
        type: (0, c.getJSONTypes)(D.type),
        schemaType: (0, c.getJSONTypes)(D.schemaType)
      };
      return (0, i.eachItem)(R, l.type.length === 0 ? (v) => Re.call(this, v, l) : (v) => l.type.forEach((j) => Re.call(this, v, l, j))), this;
    }
    getKeyword(O) {
      const D = this.RULES.all[O];
      return typeof D == "object" ? D.definition : !!D;
    }
    // Remove keyword
    removeKeyword(O) {
      const { RULES: D } = this;
      delete D.keywords[O], delete D.all[O];
      for (const R of D.rules) {
        const l = R.rules.findIndex((v) => v.keyword === O);
        l >= 0 && R.rules.splice(l, 1);
      }
      return this;
    }
    // Add format
    addFormat(O, D) {
      return typeof D == "string" && (D = new RegExp(D)), this.formats[O] = D, this;
    }
    errorsText(O = this.errors, { separator: D = ", ", dataVar: R = "data" } = {}) {
      return !O || O.length === 0 ? "No errors" : O.map((l) => `${R}${l.instancePath} ${l.message}`).reduce((l, v) => l + D + v);
    }
    $dataMetaSchema(O, D) {
      const R = this.RULES.all;
      O = JSON.parse(JSON.stringify(O));
      for (const l of D) {
        const v = l.split("/").slice(1);
        let j = O;
        for (const z of v)
          j = j[z];
        for (const z in R) {
          const V = R[z];
          if (typeof V != "object")
            continue;
          const { $data: Y } = V.definition, Z = j[z];
          Y && Z && (j[z] = gt(Z));
        }
      }
      return O;
    }
    _removeAllSchemas(O, D) {
      for (const R in O) {
        const l = O[R];
        (!D || D.test(R)) && (typeof l == "string" ? delete O[R] : l && !l.meta && (this._cache.delete(l.schema), delete O[R]));
      }
    }
    _addSchema(O, D, R, l = this.opts.validateSchema, v = this.opts.addUsedSchema) {
      let j;
      const { schemaId: z } = this.opts;
      if (typeof O == "object")
        j = O[z];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof O != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let V = this._cache.get(O);
      if (V !== void 0)
        return V;
      R = (0, p.normalizeId)(j || R);
      const Y = p.getSchemaRefs.call(this, O, R);
      return V = new a.SchemaEnv({ schema: O, schemaId: z, meta: D, baseId: R, localRefs: Y }), this._cache.set(V.schema, V), v && !R.startsWith("#") && (R && this._checkUnique(R), this.refs[R] = V), l && this.validateSchema(O, !0), V;
    }
    _checkUnique(O) {
      if (this.schemas[O] || this.refs[O])
        throw new Error(`schema with key or id "${O}" already exists`);
    }
    _compileSchemaEnv(O) {
      if (O.meta ? this._compileMetaSchema(O) : a.compileSchema.call(this, O), !O.validate)
        throw new Error("ajv implementation error");
      return O.validate;
    }
    _compileMetaSchema(O) {
      const D = this.opts;
      this.opts = this._metaOpts;
      try {
        a.compileSchema.call(this, O);
      } finally {
        this.opts = D;
      }
    }
  }
  e.default = A, A.ValidationError = n.default, A.MissingRefError = s.default;
  function k(U, O, D, R = "error") {
    for (const l in U) {
      const v = l;
      v in O && this.logger[R](`${D}: option ${l}. ${U[v]}`);
    }
  }
  function S(U) {
    return U = (0, p.normalizeId)(U), this.schemas[U] || this.refs[U];
  }
  function C() {
    const U = this.opts.schemas;
    if (U)
      if (Array.isArray(U))
        this.addSchema(U);
      else
        for (const O in U)
          this.addSchema(U[O], O);
  }
  function M() {
    for (const U in this.opts.formats) {
      const O = this.opts.formats[U];
      O && this.addFormat(U, O);
    }
  }
  function F(U) {
    if (Array.isArray(U)) {
      this.addVocabulary(U);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const O in U) {
      const D = U[O];
      D.keyword || (D.keyword = O), this.addKeyword(D);
    }
  }
  function L() {
    const U = { ...this.opts };
    for (const O of h)
      delete U[O];
    return U;
  }
  const x = { log() {
  }, warn() {
  }, error() {
  } };
  function B(U) {
    if (U === !1)
      return x;
    if (U === void 0)
      return console;
    if (U.log && U.warn && U.error)
      return U;
    throw new Error("logger must implement log, warn and error methods");
  }
  const pe = /^[a-z_$][a-z0-9_$:-]*$/i;
  function se(U, O) {
    const { RULES: D } = this;
    if ((0, i.eachItem)(U, (R) => {
      if (D.keywords[R])
        throw new Error(`Keyword ${R} is already defined`);
      if (!pe.test(R))
        throw new Error(`Keyword ${R} has invalid name`);
    }), !!O && O.$data && !("code" in O || "validate" in O))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function Re(U, O, D) {
    var R;
    const l = O == null ? void 0 : O.post;
    if (D && l)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: v } = this;
    let j = l ? v.post : v.rules.find(({ type: V }) => V === D);
    if (j || (j = { type: D, rules: [] }, v.rules.push(j)), v.keywords[U] = !0, !O)
      return;
    const z = {
      keyword: U,
      definition: {
        ...O,
        type: (0, c.getJSONTypes)(O.type),
        schemaType: (0, c.getJSONTypes)(O.schemaType)
      }
    };
    O.before ? ot.call(this, j, z, O.before) : j.rules.push(z), v.all[U] = z, (R = O.implements) === null || R === void 0 || R.forEach((V) => this.addKeyword(V));
  }
  function ot(U, O, D) {
    const R = U.rules.findIndex((l) => l.keyword === D);
    R >= 0 ? U.rules.splice(R, 0, O) : (U.rules.push(O), this.logger.warn(`rule ${D} is not defined`));
  }
  function yt(U) {
    let { metaSchema: O } = U;
    O !== void 0 && (U.$data && this.opts.$data && (O = gt(O)), U.validateSchema = this.compile(O, !0));
  }
  const Mt = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function gt(U) {
    return { anyOf: [U, Mt] };
  }
})(fo);
var jn = {}, In = {}, Dn = {};
Object.defineProperty(Dn, "__esModule", { value: !0 });
const $c = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Dn.default = $c;
var mt = {};
Object.defineProperty(mt, "__esModule", { value: !0 });
mt.callRef = mt.getValidate = void 0;
const _c = lr, Ms = X, Ee = W, Ot = Ge, Fs = Pe, vr = re, wc = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: o, validateName: a, opts: u, self: p } = n, { root: c } = o;
    if ((r === "#" || r === "#/") && s === c.baseId)
      return d();
    const i = Fs.resolveRef.call(p, c, s, r);
    if (i === void 0)
      throw new _c.default(n.opts.uriResolver, s, r);
    if (i instanceof Fs.SchemaEnv)
      return w(i);
    return b(i);
    function d() {
      if (o === c)
        return Sr(e, a, o, o.$async);
      const h = t.scopeValue("root", { ref: c });
      return Sr(e, (0, Ee._)`${h}.validate`, c, c.$async);
    }
    function w(h) {
      const y = Fo(e, h);
      Sr(e, y, h, h.$async);
    }
    function b(h) {
      const y = t.scopeValue("schema", u.code.source === !0 ? { ref: h, code: (0, Ee.stringify)(h) } : { ref: h }), _ = t.name("valid"), m = e.subschema({
        schema: h,
        dataTypes: [],
        schemaPath: Ee.nil,
        topSchemaRef: y,
        errSchemaPath: r
      }, _);
      e.mergeEvaluated(m), e.ok(_);
    }
  }
};
function Fo(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Ee._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
mt.getValidate = Fo;
function Sr(e, t, r, n) {
  const { gen: s, it: o } = e, { allErrors: a, schemaEnv: u, opts: p } = o, c = p.passContext ? Ot.default.this : Ee.nil;
  n ? i() : d();
  function i() {
    if (!u.$async)
      throw new Error("async schema referenced by sync schema");
    const h = s.let("valid");
    s.try(() => {
      s.code((0, Ee._)`await ${(0, Ms.callValidateCode)(e, t, c)}`), b(t), a || s.assign(h, !0);
    }, (y) => {
      s.if((0, Ee._)`!(${y} instanceof ${o.ValidationError})`, () => s.throw(y)), w(y), a || s.assign(h, !1);
    }), e.ok(h);
  }
  function d() {
    e.result((0, Ms.callValidateCode)(e, t, c), () => b(t), () => w(t));
  }
  function w(h) {
    const y = (0, Ee._)`${h}.errors`;
    s.assign(Ot.default.vErrors, (0, Ee._)`${Ot.default.vErrors} === null ? ${y} : ${Ot.default.vErrors}.concat(${y})`), s.assign(Ot.default.errors, (0, Ee._)`${Ot.default.vErrors}.length`);
  }
  function b(h) {
    var y;
    if (!o.opts.unevaluated)
      return;
    const _ = (y = r == null ? void 0 : r.validate) === null || y === void 0 ? void 0 : y.evaluated;
    if (o.props !== !0)
      if (_ && !_.dynamicProps)
        _.props !== void 0 && (o.props = vr.mergeEvaluated.props(s, _.props, o.props));
      else {
        const m = s.var("props", (0, Ee._)`${h}.evaluated.props`);
        o.props = vr.mergeEvaluated.props(s, m, o.props, Ee.Name);
      }
    if (o.items !== !0)
      if (_ && !_.dynamicItems)
        _.items !== void 0 && (o.items = vr.mergeEvaluated.items(s, _.items, o.items));
      else {
        const m = s.var("items", (0, Ee._)`${h}.evaluated.items`);
        o.items = vr.mergeEvaluated.items(s, m, o.items, Ee.Name);
      }
  }
}
mt.callRef = Sr;
mt.default = wc;
Object.defineProperty(In, "__esModule", { value: !0 });
const bc = Dn, Ec = mt, Sc = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  bc.default,
  Ec.default
];
In.default = Sc;
var kn = {}, Mn = {};
Object.defineProperty(Mn, "__esModule", { value: !0 });
const Mr = W, tt = Mr.operators, Fr = {
  maximum: { okStr: "<=", ok: tt.LTE, fail: tt.GT },
  minimum: { okStr: ">=", ok: tt.GTE, fail: tt.LT },
  exclusiveMaximum: { okStr: "<", ok: tt.LT, fail: tt.GTE },
  exclusiveMinimum: { okStr: ">", ok: tt.GT, fail: tt.LTE }
}, Pc = {
  message: ({ keyword: e, schemaCode: t }) => (0, Mr.str)`must be ${Fr[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, Mr._)`{comparison: ${Fr[e].okStr}, limit: ${t}}`
}, Oc = {
  keyword: Object.keys(Fr),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Pc,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, Mr._)`${r} ${Fr[t].fail} ${n} || isNaN(${r})`);
  }
};
Mn.default = Oc;
var Fn = {};
Object.defineProperty(Fn, "__esModule", { value: !0 });
const Qt = W, Rc = {
  message: ({ schemaCode: e }) => (0, Qt.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, Qt._)`{multipleOf: ${e}}`
}, Nc = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Rc,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, o = s.opts.multipleOfPrecision, a = t.let("res"), u = o ? (0, Qt._)`Math.abs(Math.round(${a}) - ${a}) > 1e-${o}` : (0, Qt._)`${a} !== parseInt(${a})`;
    e.fail$data((0, Qt._)`(${n} === 0 || (${a} = ${r}/${n}, ${u}))`);
  }
};
Fn.default = Nc;
var Un = {}, zn = {};
Object.defineProperty(zn, "__esModule", { value: !0 });
function Uo(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
zn.default = Uo;
Uo.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Un, "__esModule", { value: !0 });
const ft = W, Tc = re, Cc = zn, Ac = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, ft.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, ft._)`{limit: ${e}}`
}, jc = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: Ac,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, o = t === "maxLength" ? ft.operators.GT : ft.operators.LT, a = s.opts.unicode === !1 ? (0, ft._)`${r}.length` : (0, ft._)`${(0, Tc.useFunc)(e.gen, Cc.default)}(${r})`;
    e.fail$data((0, ft._)`${a} ${o} ${n}`);
  }
};
Un.default = jc;
var Vn = {};
Object.defineProperty(Vn, "__esModule", { value: !0 });
const Ic = X, Ur = W, Dc = {
  message: ({ schemaCode: e }) => (0, Ur.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Ur._)`{pattern: ${e}}`
}, kc = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: Dc,
  code(e) {
    const { data: t, $data: r, schema: n, schemaCode: s, it: o } = e, a = o.opts.unicodeRegExp ? "u" : "", u = r ? (0, Ur._)`(new RegExp(${s}, ${a}))` : (0, Ic.usePattern)(e, n);
    e.fail$data((0, Ur._)`!${u}.test(${t})`);
  }
};
Vn.default = kc;
var Ln = {};
Object.defineProperty(Ln, "__esModule", { value: !0 });
const Zt = W, Mc = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, Zt.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, Zt._)`{limit: ${e}}`
}, Fc = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: Mc,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? Zt.operators.GT : Zt.operators.LT;
    e.fail$data((0, Zt._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
Ln.default = Fc;
var qn = {};
Object.defineProperty(qn, "__esModule", { value: !0 });
const Jt = X, er = W, Uc = re, zc = {
  message: ({ params: { missingProperty: e } }) => (0, er.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, er._)`{missingProperty: ${e}}`
}, Vc = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: zc,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: o, it: a } = e, { opts: u } = a;
    if (!o && r.length === 0)
      return;
    const p = r.length >= u.loopRequired;
    if (a.allErrors ? c() : i(), u.strictRequired) {
      const b = e.parentSchema.properties, { definedProperties: h } = e.it;
      for (const y of r)
        if ((b == null ? void 0 : b[y]) === void 0 && !h.has(y)) {
          const _ = a.schemaEnv.baseId + a.errSchemaPath, m = `required property "${y}" is not defined at "${_}" (strictRequired)`;
          (0, Uc.checkStrictMode)(a, m, a.opts.strictRequired);
        }
    }
    function c() {
      if (p || o)
        e.block$data(er.nil, d);
      else
        for (const b of r)
          (0, Jt.checkReportMissingProp)(e, b);
    }
    function i() {
      const b = t.let("missing");
      if (p || o) {
        const h = t.let("valid", !0);
        e.block$data(h, () => w(b, h)), e.ok(h);
      } else
        t.if((0, Jt.checkMissingProp)(e, r, b)), (0, Jt.reportMissingProp)(e, b), t.else();
    }
    function d() {
      t.forOf("prop", n, (b) => {
        e.setParams({ missingProperty: b }), t.if((0, Jt.noPropertyInData)(t, s, b, u.ownProperties), () => e.error());
      });
    }
    function w(b, h) {
      e.setParams({ missingProperty: b }), t.forOf(b, n, () => {
        t.assign(h, (0, Jt.propertyInData)(t, s, b, u.ownProperties)), t.if((0, er.not)(h), () => {
          e.error(), t.break();
        });
      }, er.nil);
    }
  }
};
qn.default = Vc;
var Hn = {};
Object.defineProperty(Hn, "__esModule", { value: !0 });
const tr = W, Lc = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, tr.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, tr._)`{limit: ${e}}`
}, qc = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Lc,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? tr.operators.GT : tr.operators.LT;
    e.fail$data((0, tr._)`${r}.length ${s} ${n}`);
  }
};
Hn.default = qc;
var Kn = {}, dr = {};
Object.defineProperty(dr, "__esModule", { value: !0 });
const zo = _o;
zo.code = 'require("ajv/dist/runtime/equal").default';
dr.default = zo;
Object.defineProperty(Kn, "__esModule", { value: !0 });
const sn = cr, ge = W, Hc = re, Kc = dr, Bc = {
  message: ({ params: { i: e, j: t } }) => (0, ge.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, ge._)`{i: ${e}, j: ${t}}`
}, Gc = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Bc,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: o, schemaCode: a, it: u } = e;
    if (!n && !s)
      return;
    const p = t.let("valid"), c = o.items ? (0, sn.getSchemaTypes)(o.items) : [];
    e.block$data(p, i, (0, ge._)`${a} === false`), e.ok(p);
    function i() {
      const h = t.let("i", (0, ge._)`${r}.length`), y = t.let("j");
      e.setParams({ i: h, j: y }), t.assign(p, !0), t.if((0, ge._)`${h} > 1`, () => (d() ? w : b)(h, y));
    }
    function d() {
      return c.length > 0 && !c.some((h) => h === "object" || h === "array");
    }
    function w(h, y) {
      const _ = t.name("item"), m = (0, sn.checkDataTypes)(c, _, u.opts.strictNumbers, sn.DataType.Wrong), E = t.const("indices", (0, ge._)`{}`);
      t.for((0, ge._)`;${h}--;`, () => {
        t.let(_, (0, ge._)`${r}[${h}]`), t.if(m, (0, ge._)`continue`), c.length > 1 && t.if((0, ge._)`typeof ${_} == "string"`, (0, ge._)`${_} += "_"`), t.if((0, ge._)`typeof ${E}[${_}] == "number"`, () => {
          t.assign(y, (0, ge._)`${E}[${_}]`), e.error(), t.assign(p, !1).break();
        }).code((0, ge._)`${E}[${_}] = ${h}`);
      });
    }
    function b(h, y) {
      const _ = (0, Hc.useFunc)(t, Kc.default), m = t.name("outer");
      t.label(m).for((0, ge._)`;${h}--;`, () => t.for((0, ge._)`${y} = ${h}; ${y}--;`, () => t.if((0, ge._)`${_}(${r}[${h}], ${r}[${y}])`, () => {
        e.error(), t.assign(p, !1).break(m);
      })));
    }
  }
};
Kn.default = Gc;
var Bn = {};
Object.defineProperty(Bn, "__esModule", { value: !0 });
const gn = W, Jc = re, Wc = dr, xc = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, gn._)`{allowedValue: ${e}}`
}, Xc = {
  keyword: "const",
  $data: !0,
  error: xc,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: o } = e;
    n || o && typeof o == "object" ? e.fail$data((0, gn._)`!${(0, Jc.useFunc)(t, Wc.default)}(${r}, ${s})`) : e.fail((0, gn._)`${o} !== ${r}`);
  }
};
Bn.default = Xc;
var Gn = {};
Object.defineProperty(Gn, "__esModule", { value: !0 });
const Xt = W, Yc = re, Qc = dr, Zc = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Xt._)`{allowedValues: ${e}}`
}, eu = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: Zc,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: o, it: a } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const u = s.length >= a.opts.loopEnum;
    let p;
    const c = () => p ?? (p = (0, Yc.useFunc)(t, Qc.default));
    let i;
    if (u || n)
      i = t.let("valid"), e.block$data(i, d);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const b = t.const("vSchema", o);
      i = (0, Xt.or)(...s.map((h, y) => w(b, y)));
    }
    e.pass(i);
    function d() {
      t.assign(i, !1), t.forOf("v", o, (b) => t.if((0, Xt._)`${c()}(${r}, ${b})`, () => t.assign(i, !0).break()));
    }
    function w(b, h) {
      const y = s[h];
      return typeof y == "object" && y !== null ? (0, Xt._)`${c()}(${r}, ${b}[${h}])` : (0, Xt._)`${r} === ${y}`;
    }
  }
};
Gn.default = eu;
Object.defineProperty(kn, "__esModule", { value: !0 });
const tu = Mn, ru = Fn, nu = Un, su = Vn, ou = Ln, au = qn, iu = Hn, cu = Kn, uu = Bn, lu = Gn, du = [
  // number
  tu.default,
  ru.default,
  // string
  nu.default,
  su.default,
  // object
  ou.default,
  au.default,
  // array
  iu.default,
  cu.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  uu.default,
  lu.default
];
kn.default = du;
var Jn = {}, It = {};
Object.defineProperty(It, "__esModule", { value: !0 });
It.validateAdditionalItems = void 0;
const pt = W, vn = re, fu = {
  message: ({ params: { len: e } }) => (0, pt.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, pt._)`{limit: ${e}}`
}, pu = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: fu,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, vn.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Vo(e, n);
  }
};
function Vo(e, t) {
  const { gen: r, schema: n, data: s, keyword: o, it: a } = e;
  a.items = !0;
  const u = r.const("len", (0, pt._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, pt._)`${u} <= ${t.length}`);
  else if (typeof n == "object" && !(0, vn.alwaysValidSchema)(a, n)) {
    const c = r.var("valid", (0, pt._)`${u} <= ${t.length}`);
    r.if((0, pt.not)(c), () => p(c)), e.ok(c);
  }
  function p(c) {
    r.forRange("i", t.length, u, (i) => {
      e.subschema({ keyword: o, dataProp: i, dataPropType: vn.Type.Num }, c), a.allErrors || r.if((0, pt.not)(c), () => r.break());
    });
  }
}
It.validateAdditionalItems = Vo;
It.default = pu;
var Wn = {}, Dt = {};
Object.defineProperty(Dt, "__esModule", { value: !0 });
Dt.validateTuple = void 0;
const Us = W, Pr = re, hu = X, mu = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return Lo(e, "additionalItems", t);
    r.items = !0, !(0, Pr.alwaysValidSchema)(r, t) && e.ok((0, hu.validateArray)(e));
  }
};
function Lo(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: o, keyword: a, it: u } = e;
  i(s), u.opts.unevaluated && r.length && u.items !== !0 && (u.items = Pr.mergeEvaluated.items(n, r.length, u.items));
  const p = n.name("valid"), c = n.const("len", (0, Us._)`${o}.length`);
  r.forEach((d, w) => {
    (0, Pr.alwaysValidSchema)(u, d) || (n.if((0, Us._)`${c} > ${w}`, () => e.subschema({
      keyword: a,
      schemaProp: w,
      dataProp: w
    }, p)), e.ok(p));
  });
  function i(d) {
    const { opts: w, errSchemaPath: b } = u, h = r.length, y = h === d.minItems && (h === d.maxItems || d[t] === !1);
    if (w.strictTuples && !y) {
      const _ = `"${a}" is ${h}-tuple, but minItems or maxItems/${t} are not specified or different at path "${b}"`;
      (0, Pr.checkStrictMode)(u, _, w.strictTuples);
    }
  }
}
Dt.validateTuple = Lo;
Dt.default = mu;
Object.defineProperty(Wn, "__esModule", { value: !0 });
const yu = Dt, gu = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, yu.validateTuple)(e, "items")
};
Wn.default = gu;
var xn = {};
Object.defineProperty(xn, "__esModule", { value: !0 });
const zs = W, vu = re, $u = X, _u = It, wu = {
  message: ({ params: { len: e } }) => (0, zs.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, zs._)`{limit: ${e}}`
}, bu = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: wu,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, vu.alwaysValidSchema)(n, t) && (s ? (0, _u.validateAdditionalItems)(e, s) : e.ok((0, $u.validateArray)(e)));
  }
};
xn.default = bu;
var Xn = {};
Object.defineProperty(Xn, "__esModule", { value: !0 });
const Ce = W, $r = re, Eu = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Ce.str)`must contain at least ${e} valid item(s)` : (0, Ce.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Ce._)`{minContains: ${e}}` : (0, Ce._)`{minContains: ${e}, maxContains: ${t}}`
}, Su = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: Eu,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: o } = e;
    let a, u;
    const { minContains: p, maxContains: c } = n;
    o.opts.next ? (a = p === void 0 ? 1 : p, u = c) : a = 1;
    const i = t.const("len", (0, Ce._)`${s}.length`);
    if (e.setParams({ min: a, max: u }), u === void 0 && a === 0) {
      (0, $r.checkStrictMode)(o, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (u !== void 0 && a > u) {
      (0, $r.checkStrictMode)(o, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, $r.alwaysValidSchema)(o, r)) {
      let y = (0, Ce._)`${i} >= ${a}`;
      u !== void 0 && (y = (0, Ce._)`${y} && ${i} <= ${u}`), e.pass(y);
      return;
    }
    o.items = !0;
    const d = t.name("valid");
    u === void 0 && a === 1 ? b(d, () => t.if(d, () => t.break())) : a === 0 ? (t.let(d, !0), u !== void 0 && t.if((0, Ce._)`${s}.length > 0`, w)) : (t.let(d, !1), w()), e.result(d, () => e.reset());
    function w() {
      const y = t.name("_valid"), _ = t.let("count", 0);
      b(y, () => t.if(y, () => h(_)));
    }
    function b(y, _) {
      t.forRange("i", 0, i, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: $r.Type.Num,
          compositeRule: !0
        }, y), _();
      });
    }
    function h(y) {
      t.code((0, Ce._)`${y}++`), u === void 0 ? t.if((0, Ce._)`${y} >= ${a}`, () => t.assign(d, !0).break()) : (t.if((0, Ce._)`${y} > ${u}`, () => t.assign(d, !1).break()), a === 1 ? t.assign(d, !0) : t.if((0, Ce._)`${y} >= ${a}`, () => t.assign(d, !0)));
    }
  }
};
Xn.default = Su;
var qo = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = W, r = re, n = X;
  e.error = {
    message: ({ params: { property: p, depsCount: c, deps: i } }) => {
      const d = c === 1 ? "property" : "properties";
      return (0, t.str)`must have ${d} ${i} when property ${p} is present`;
    },
    params: ({ params: { property: p, depsCount: c, deps: i, missingProperty: d } }) => (0, t._)`{property: ${p},
    missingProperty: ${d},
    depsCount: ${c},
    deps: ${i}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(p) {
      const [c, i] = o(p);
      a(p, c), u(p, i);
    }
  };
  function o({ schema: p }) {
    const c = {}, i = {};
    for (const d in p) {
      if (d === "__proto__")
        continue;
      const w = Array.isArray(p[d]) ? c : i;
      w[d] = p[d];
    }
    return [c, i];
  }
  function a(p, c = p.schema) {
    const { gen: i, data: d, it: w } = p;
    if (Object.keys(c).length === 0)
      return;
    const b = i.let("missing");
    for (const h in c) {
      const y = c[h];
      if (y.length === 0)
        continue;
      const _ = (0, n.propertyInData)(i, d, h, w.opts.ownProperties);
      p.setParams({
        property: h,
        depsCount: y.length,
        deps: y.join(", ")
      }), w.allErrors ? i.if(_, () => {
        for (const m of y)
          (0, n.checkReportMissingProp)(p, m);
      }) : (i.if((0, t._)`${_} && (${(0, n.checkMissingProp)(p, y, b)})`), (0, n.reportMissingProp)(p, b), i.else());
    }
  }
  e.validatePropertyDeps = a;
  function u(p, c = p.schema) {
    const { gen: i, data: d, keyword: w, it: b } = p, h = i.name("valid");
    for (const y in c)
      (0, r.alwaysValidSchema)(b, c[y]) || (i.if(
        (0, n.propertyInData)(i, d, y, b.opts.ownProperties),
        () => {
          const _ = p.subschema({ keyword: w, schemaProp: y }, h);
          p.mergeValidEvaluated(_, h);
        },
        () => i.var(h, !0)
        // TODO var
      ), p.ok(h));
  }
  e.validateSchemaDeps = u, e.default = s;
})(qo);
var Yn = {};
Object.defineProperty(Yn, "__esModule", { value: !0 });
const Ho = W, Pu = re, Ou = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Ho._)`{propertyName: ${e.propertyName}}`
}, Ru = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: Ou,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, Pu.alwaysValidSchema)(s, r))
      return;
    const o = t.name("valid");
    t.forIn("key", n, (a) => {
      e.setParams({ propertyName: a }), e.subschema({
        keyword: "propertyNames",
        data: a,
        dataTypes: ["string"],
        propertyName: a,
        compositeRule: !0
      }, o), t.if((0, Ho.not)(o), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(o);
  }
};
Yn.default = Ru;
var Jr = {};
Object.defineProperty(Jr, "__esModule", { value: !0 });
const _r = X, je = W, Nu = Ge, wr = re, Tu = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, je._)`{additionalProperty: ${e.additionalProperty}}`
}, Cu = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: Tu,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: o, it: a } = e;
    if (!o)
      throw new Error("ajv implementation error");
    const { allErrors: u, opts: p } = a;
    if (a.props = !0, p.removeAdditional !== "all" && (0, wr.alwaysValidSchema)(a, r))
      return;
    const c = (0, _r.allSchemaProperties)(n.properties), i = (0, _r.allSchemaProperties)(n.patternProperties);
    d(), e.ok((0, je._)`${o} === ${Nu.default.errors}`);
    function d() {
      t.forIn("key", s, (_) => {
        !c.length && !i.length ? h(_) : t.if(w(_), () => h(_));
      });
    }
    function w(_) {
      let m;
      if (c.length > 8) {
        const E = (0, wr.schemaRefOrVal)(a, n.properties, "properties");
        m = (0, _r.isOwnProperty)(t, E, _);
      } else
        c.length ? m = (0, je.or)(...c.map((E) => (0, je._)`${_} === ${E}`)) : m = je.nil;
      return i.length && (m = (0, je.or)(m, ...i.map((E) => (0, je._)`${(0, _r.usePattern)(e, E)}.test(${_})`))), (0, je.not)(m);
    }
    function b(_) {
      t.code((0, je._)`delete ${s}[${_}]`);
    }
    function h(_) {
      if (p.removeAdditional === "all" || p.removeAdditional && r === !1) {
        b(_);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: _ }), e.error(), u || t.break();
        return;
      }
      if (typeof r == "object" && !(0, wr.alwaysValidSchema)(a, r)) {
        const m = t.name("valid");
        p.removeAdditional === "failing" ? (y(_, m, !1), t.if((0, je.not)(m), () => {
          e.reset(), b(_);
        })) : (y(_, m), u || t.if((0, je.not)(m), () => t.break()));
      }
    }
    function y(_, m, E) {
      const P = {
        keyword: "additionalProperties",
        dataProp: _,
        dataPropType: wr.Type.Str
      };
      E === !1 && Object.assign(P, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(P, m);
    }
  }
};
Jr.default = Cu;
var Qn = {};
Object.defineProperty(Qn, "__esModule", { value: !0 });
const Au = De, Vs = X, on = re, Ls = Jr, ju = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: o } = e;
    o.opts.removeAdditional === "all" && n.additionalProperties === void 0 && Ls.default.code(new Au.KeywordCxt(o, Ls.default, "additionalProperties"));
    const a = (0, Vs.allSchemaProperties)(r);
    for (const d of a)
      o.definedProperties.add(d);
    o.opts.unevaluated && a.length && o.props !== !0 && (o.props = on.mergeEvaluated.props(t, (0, on.toHash)(a), o.props));
    const u = a.filter((d) => !(0, on.alwaysValidSchema)(o, r[d]));
    if (u.length === 0)
      return;
    const p = t.name("valid");
    for (const d of u)
      c(d) ? i(d) : (t.if((0, Vs.propertyInData)(t, s, d, o.opts.ownProperties)), i(d), o.allErrors || t.else().var(p, !0), t.endIf()), e.it.definedProperties.add(d), e.ok(p);
    function c(d) {
      return o.opts.useDefaults && !o.compositeRule && r[d].default !== void 0;
    }
    function i(d) {
      e.subschema({
        keyword: "properties",
        schemaProp: d,
        dataProp: d
      }, p);
    }
  }
};
Qn.default = ju;
var Zn = {};
Object.defineProperty(Zn, "__esModule", { value: !0 });
const qs = X, br = W, Hs = re, Ks = re, Iu = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: o } = e, { opts: a } = o, u = (0, qs.allSchemaProperties)(r), p = u.filter((y) => (0, Hs.alwaysValidSchema)(o, r[y]));
    if (u.length === 0 || p.length === u.length && (!o.opts.unevaluated || o.props === !0))
      return;
    const c = a.strictSchema && !a.allowMatchingProperties && s.properties, i = t.name("valid");
    o.props !== !0 && !(o.props instanceof br.Name) && (o.props = (0, Ks.evaluatedPropsToName)(t, o.props));
    const { props: d } = o;
    w();
    function w() {
      for (const y of u)
        c && b(y), o.allErrors ? h(y) : (t.var(i, !0), h(y), t.if(i));
    }
    function b(y) {
      for (const _ in c)
        new RegExp(y).test(_) && (0, Hs.checkStrictMode)(o, `property ${_} matches pattern ${y} (use allowMatchingProperties)`);
    }
    function h(y) {
      t.forIn("key", n, (_) => {
        t.if((0, br._)`${(0, qs.usePattern)(e, y)}.test(${_})`, () => {
          const m = p.includes(y);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: y,
            dataProp: _,
            dataPropType: Ks.Type.Str
          }, i), o.opts.unevaluated && d !== !0 ? t.assign((0, br._)`${d}[${_}]`, !0) : !m && !o.allErrors && t.if((0, br.not)(i), () => t.break());
        });
      });
    }
  }
};
Zn.default = Iu;
var es = {};
Object.defineProperty(es, "__esModule", { value: !0 });
const Du = re, ku = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, Du.alwaysValidSchema)(n, r)) {
      e.fail();
      return;
    }
    const s = t.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, s), e.failResult(s, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
es.default = ku;
var ts = {};
Object.defineProperty(ts, "__esModule", { value: !0 });
const Mu = X, Fu = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: Mu.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
ts.default = Fu;
var rs = {};
Object.defineProperty(rs, "__esModule", { value: !0 });
const Or = W, Uu = re, zu = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Or._)`{passingSchemas: ${e.passing}}`
}, Vu = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: zu,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const o = r, a = t.let("valid", !1), u = t.let("passing", null), p = t.name("_valid");
    e.setParams({ passing: u }), t.block(c), e.result(a, () => e.reset(), () => e.error(!0));
    function c() {
      o.forEach((i, d) => {
        let w;
        (0, Uu.alwaysValidSchema)(s, i) ? t.var(p, !0) : w = e.subschema({
          keyword: "oneOf",
          schemaProp: d,
          compositeRule: !0
        }, p), d > 0 && t.if((0, Or._)`${p} && ${a}`).assign(a, !1).assign(u, (0, Or._)`[${u}, ${d}]`).else(), t.if(p, () => {
          t.assign(a, !0), t.assign(u, d), w && e.mergeEvaluated(w, Or.Name);
        });
      });
    }
  }
};
rs.default = Vu;
var ns = {};
Object.defineProperty(ns, "__esModule", { value: !0 });
const Lu = re, qu = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((o, a) => {
      if ((0, Lu.alwaysValidSchema)(n, o))
        return;
      const u = e.subschema({ keyword: "allOf", schemaProp: a }, s);
      e.ok(s), e.mergeEvaluated(u);
    });
  }
};
ns.default = qu;
var ss = {};
Object.defineProperty(ss, "__esModule", { value: !0 });
const zr = W, Ko = re, Hu = {
  message: ({ params: e }) => (0, zr.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, zr._)`{failingKeyword: ${e.ifClause}}`
}, Ku = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: Hu,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, Ko.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = Bs(n, "then"), o = Bs(n, "else");
    if (!s && !o)
      return;
    const a = t.let("valid", !0), u = t.name("_valid");
    if (p(), e.reset(), s && o) {
      const i = t.let("ifClause");
      e.setParams({ ifClause: i }), t.if(u, c("then", i), c("else", i));
    } else
      s ? t.if(u, c("then")) : t.if((0, zr.not)(u), c("else"));
    e.pass(a, () => e.error(!0));
    function p() {
      const i = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, u);
      e.mergeEvaluated(i);
    }
    function c(i, d) {
      return () => {
        const w = e.subschema({ keyword: i }, u);
        t.assign(a, u), e.mergeValidEvaluated(w, a), d ? t.assign(d, (0, zr._)`${i}`) : e.setParams({ ifClause: i });
      };
    }
  }
};
function Bs(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, Ko.alwaysValidSchema)(e, r);
}
ss.default = Ku;
var os = {};
Object.defineProperty(os, "__esModule", { value: !0 });
const Bu = re, Gu = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, Bu.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
os.default = Gu;
Object.defineProperty(Jn, "__esModule", { value: !0 });
const Ju = It, Wu = Wn, xu = Dt, Xu = xn, Yu = Xn, Qu = qo, Zu = Yn, el = Jr, tl = Qn, rl = Zn, nl = es, sl = ts, ol = rs, al = ns, il = ss, cl = os;
function ul(e = !1) {
  const t = [
    // any
    nl.default,
    sl.default,
    ol.default,
    al.default,
    il.default,
    cl.default,
    // object
    Zu.default,
    el.default,
    Qu.default,
    tl.default,
    rl.default
  ];
  return e ? t.push(Wu.default, Xu.default) : t.push(Ju.default, xu.default), t.push(Yu.default), t;
}
Jn.default = ul;
var as = {}, is = {};
Object.defineProperty(is, "__esModule", { value: !0 });
const fe = W, ll = {
  message: ({ schemaCode: e }) => (0, fe.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, fe._)`{format: ${e}}`
}, dl = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: ll,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: o, schemaCode: a, it: u } = e, { opts: p, errSchemaPath: c, schemaEnv: i, self: d } = u;
    if (!p.validateFormats)
      return;
    s ? w() : b();
    function w() {
      const h = r.scopeValue("formats", {
        ref: d.formats,
        code: p.code.formats
      }), y = r.const("fDef", (0, fe._)`${h}[${a}]`), _ = r.let("fType"), m = r.let("format");
      r.if((0, fe._)`typeof ${y} == "object" && !(${y} instanceof RegExp)`, () => r.assign(_, (0, fe._)`${y}.type || "string"`).assign(m, (0, fe._)`${y}.validate`), () => r.assign(_, (0, fe._)`"string"`).assign(m, y)), e.fail$data((0, fe.or)(E(), P()));
      function E() {
        return p.strictSchema === !1 ? fe.nil : (0, fe._)`${a} && !${m}`;
      }
      function P() {
        const A = i.$async ? (0, fe._)`(${y}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, fe._)`${m}(${n})`, k = (0, fe._)`(typeof ${m} == "function" ? ${A} : ${m}.test(${n}))`;
        return (0, fe._)`${m} && ${m} !== true && ${_} === ${t} && !${k}`;
      }
    }
    function b() {
      const h = d.formats[o];
      if (!h) {
        E();
        return;
      }
      if (h === !0)
        return;
      const [y, _, m] = P(h);
      y === t && e.pass(A());
      function E() {
        if (p.strictSchema === !1) {
          d.logger.warn(k());
          return;
        }
        throw new Error(k());
        function k() {
          return `unknown format "${o}" ignored in schema at path "${c}"`;
        }
      }
      function P(k) {
        const S = k instanceof RegExp ? (0, fe.regexpCode)(k) : p.code.formats ? (0, fe._)`${p.code.formats}${(0, fe.getProperty)(o)}` : void 0, C = r.scopeValue("formats", { key: o, ref: k, code: S });
        return typeof k == "object" && !(k instanceof RegExp) ? [k.type || "string", k.validate, (0, fe._)`${C}.validate`] : ["string", k, C];
      }
      function A() {
        if (typeof h == "object" && !(h instanceof RegExp) && h.async) {
          if (!i.$async)
            throw new Error("async format in sync schema");
          return (0, fe._)`await ${m}(${n})`;
        }
        return typeof _ == "function" ? (0, fe._)`${m}(${n})` : (0, fe._)`${m}.test(${n})`;
      }
    }
  }
};
is.default = dl;
Object.defineProperty(as, "__esModule", { value: !0 });
const fl = is, pl = [fl.default];
as.default = pl;
var At = {};
Object.defineProperty(At, "__esModule", { value: !0 });
At.contentVocabulary = At.metadataVocabulary = void 0;
At.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
At.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(jn, "__esModule", { value: !0 });
const hl = In, ml = kn, yl = Jn, gl = as, Gs = At, vl = [
  hl.default,
  ml.default,
  (0, yl.default)(),
  gl.default,
  Gs.metadataVocabulary,
  Gs.contentVocabulary
];
jn.default = vl;
var cs = {}, Bo = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.DiscrError = void 0, function(t) {
    t.Tag = "tag", t.Mapping = "mapping";
  }(e.DiscrError || (e.DiscrError = {}));
})(Bo);
Object.defineProperty(cs, "__esModule", { value: !0 });
const Rt = W, $n = Bo, Js = Pe, $l = re, _l = {
  message: ({ params: { discrError: e, tagName: t } }) => e === $n.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, Rt._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, wl = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: _l,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: o } = e, { oneOf: a } = s;
    if (!o.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const u = n.propertyName;
    if (typeof u != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!a)
      throw new Error("discriminator: requires oneOf keyword");
    const p = t.let("valid", !1), c = t.const("tag", (0, Rt._)`${r}${(0, Rt.getProperty)(u)}`);
    t.if((0, Rt._)`typeof ${c} == "string"`, () => i(), () => e.error(!1, { discrError: $n.DiscrError.Tag, tag: c, tagName: u })), e.ok(p);
    function i() {
      const b = w();
      t.if(!1);
      for (const h in b)
        t.elseIf((0, Rt._)`${c} === ${h}`), t.assign(p, d(b[h]));
      t.else(), e.error(!1, { discrError: $n.DiscrError.Mapping, tag: c, tagName: u }), t.endIf();
    }
    function d(b) {
      const h = t.name("valid"), y = e.subschema({ keyword: "oneOf", schemaProp: b }, h);
      return e.mergeEvaluated(y, Rt.Name), h;
    }
    function w() {
      var b;
      const h = {}, y = m(s);
      let _ = !0;
      for (let A = 0; A < a.length; A++) {
        let k = a[A];
        k != null && k.$ref && !(0, $l.schemaHasRulesButRef)(k, o.self.RULES) && (k = Js.resolveRef.call(o.self, o.schemaEnv.root, o.baseId, k == null ? void 0 : k.$ref), k instanceof Js.SchemaEnv && (k = k.schema));
        const S = (b = k == null ? void 0 : k.properties) === null || b === void 0 ? void 0 : b[u];
        if (typeof S != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${u}"`);
        _ = _ && (y || m(k)), E(S, A);
      }
      if (!_)
        throw new Error(`discriminator: "${u}" must be required`);
      return h;
      function m({ required: A }) {
        return Array.isArray(A) && A.includes(u);
      }
      function E(A, k) {
        if (A.const)
          P(A.const, k);
        else if (A.enum)
          for (const S of A.enum)
            P(S, k);
        else
          throw new Error(`discriminator: "properties/${u}" must have "const" or "enum"`);
      }
      function P(A, k) {
        if (typeof A != "string" || A in h)
          throw new Error(`discriminator: "${u}" values must be unique strings`);
        h[A] = k;
      }
    }
  }
};
cs.default = wl;
const bl = "http://json-schema.org/draft-07/schema#", El = "http://json-schema.org/draft-07/schema#", Sl = "Core schema meta-schema", Pl = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $ref: "#"
    }
  },
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    allOf: [
      {
        $ref: "#/definitions/nonNegativeInteger"
      },
      {
        default: 0
      }
    ]
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, Ol = [
  "object",
  "boolean"
], Rl = {
  $id: {
    type: "string",
    format: "uri-reference"
  },
  $schema: {
    type: "string",
    format: "uri"
  },
  $ref: {
    type: "string",
    format: "uri-reference"
  },
  $comment: {
    type: "string"
  },
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  readOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  additionalItems: {
    $ref: "#"
  },
  items: {
    anyOf: [
      {
        $ref: "#"
      },
      {
        $ref: "#/definitions/schemaArray"
      }
    ],
    default: !0
  },
  maxItems: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  contains: {
    $ref: "#"
  },
  maxProperties: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/definitions/stringArray"
  },
  additionalProperties: {
    $ref: "#"
  },
  definitions: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  properties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependencies: {
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $ref: "#"
        },
        {
          $ref: "#/definitions/stringArray"
        }
      ]
    }
  },
  propertyNames: {
    $ref: "#"
  },
  const: !0,
  enum: {
    type: "array",
    items: !0,
    minItems: 1,
    uniqueItems: !0
  },
  type: {
    anyOf: [
      {
        $ref: "#/definitions/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/definitions/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  format: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentEncoding: {
    type: "string"
  },
  if: {
    $ref: "#"
  },
  then: {
    $ref: "#"
  },
  else: {
    $ref: "#"
  },
  allOf: {
    $ref: "#/definitions/schemaArray"
  },
  anyOf: {
    $ref: "#/definitions/schemaArray"
  },
  oneOf: {
    $ref: "#/definitions/schemaArray"
  },
  not: {
    $ref: "#"
  }
}, Nl = {
  $schema: bl,
  $id: El,
  title: Sl,
  definitions: Pl,
  type: Ol,
  properties: Rl,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = void 0;
  const r = fo, n = jn, s = cs, o = Nl, a = ["/properties"], u = "http://json-schema.org/draft-07/schema";
  class p extends r.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((h) => this.addVocabulary(h)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const h = this.opts.$data ? this.$dataMetaSchema(o, a) : o;
      this.addMetaSchema(h, u, !1), this.refs["http://json-schema.org/schema"] = u;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(u) ? u : void 0);
    }
  }
  e.exports = t = p, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = p;
  var c = De;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return c.KeywordCxt;
  } });
  var i = W;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return i._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return i.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return i.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return i.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return i.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return i.CodeGen;
  } });
  var d = ur;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return d.default;
  } });
  var w = lr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return w.default;
  } });
})(Ua, rr);
const Ws = /* @__PURE__ */ lo(rr);
var Vr = {}, Tl = {
  get exports() {
    return Vr;
  },
  set exports(e) {
    Vr = e;
  }
}, Go = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
  function t(F, L) {
    return { validate: F, compare: L };
  }
  e.fullFormats = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: t(o, a),
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: t(p, c),
    "date-time": t(d, w),
    // duration: https://tools.ietf.org/html/rfc3339#appendix-A
    duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
    uri: y,
    "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
    // uri-template: https://tools.ietf.org/html/rfc6570
    "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
    // For the source: https://gist.github.com/dperini/729294
    // For test cases: https://mathiasbynens.be/demo/url-regex
    url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
    email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
    // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
    ipv4: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
    ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
    regex: M,
    // uuid: http://tools.ietf.org/html/rfc4122
    uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
    // JSON-pointer: https://tools.ietf.org/html/rfc6901
    // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
    "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
    "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
    // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
    "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
    // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
    // byte: https://github.com/miguelmota/is-base64
    byte: m,
    // signed 32 bit integer
    int32: { type: "number", validate: A },
    // signed 64 bit integer
    int64: { type: "number", validate: k },
    // C-type float
    float: { type: "number", validate: S },
    // C-type double
    double: { type: "number", validate: S },
    // hint to the UI to hide input strings
    password: !0,
    // unchecked string payload
    binary: !0
  }, e.fastFormats = {
    ...e.fullFormats,
    date: t(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, a),
    time: t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, c),
    "date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, w),
    // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
    uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
    "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
    // email (sources from jsen validator):
    // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
    // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
    email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
  }, e.formatNames = Object.keys(e.fullFormats);
  function r(F) {
    return F % 4 === 0 && (F % 100 !== 0 || F % 400 === 0);
  }
  const n = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, s = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function o(F) {
    const L = n.exec(F);
    if (!L)
      return !1;
    const x = +L[1], B = +L[2], pe = +L[3];
    return B >= 1 && B <= 12 && pe >= 1 && pe <= (B === 2 && r(x) ? 29 : s[B]);
  }
  function a(F, L) {
    if (F && L)
      return F > L ? 1 : F < L ? -1 : 0;
  }
  const u = /^(\d\d):(\d\d):(\d\d)(\.\d+)?(z|[+-]\d\d(?::?\d\d)?)?$/i;
  function p(F, L) {
    const x = u.exec(F);
    if (!x)
      return !1;
    const B = +x[1], pe = +x[2], se = +x[3], Re = x[5];
    return (B <= 23 && pe <= 59 && se <= 59 || B === 23 && pe === 59 && se === 60) && (!L || Re !== "");
  }
  function c(F, L) {
    if (!(F && L))
      return;
    const x = u.exec(F), B = u.exec(L);
    if (x && B)
      return F = x[1] + x[2] + x[3] + (x[4] || ""), L = B[1] + B[2] + B[3] + (B[4] || ""), F > L ? 1 : F < L ? -1 : 0;
  }
  const i = /t|\s/i;
  function d(F) {
    const L = F.split(i);
    return L.length === 2 && o(L[0]) && p(L[1], !0);
  }
  function w(F, L) {
    if (!(F && L))
      return;
    const [x, B] = F.split(i), [pe, se] = L.split(i), Re = a(x, pe);
    if (Re !== void 0)
      return Re || c(B, se);
  }
  const b = /\/|:/, h = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function y(F) {
    return b.test(F) && h.test(F);
  }
  const _ = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function m(F) {
    return _.lastIndex = 0, _.test(F);
  }
  const E = -(2 ** 31), P = 2 ** 31 - 1;
  function A(F) {
    return Number.isInteger(F) && F <= P && F >= E;
  }
  function k(F) {
    return Number.isInteger(F);
  }
  function S() {
    return !0;
  }
  const C = /[^\\]\\Z/;
  function M(F) {
    if (C.test(F))
      return !1;
    try {
      return new RegExp(F), !0;
    } catch {
      return !1;
    }
  }
})(Go);
var Jo = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
  const t = rr, r = W, n = r.operators, s = {
    formatMaximum: { okStr: "<=", ok: n.LTE, fail: n.GT },
    formatMinimum: { okStr: ">=", ok: n.GTE, fail: n.LT },
    formatExclusiveMaximum: { okStr: "<", ok: n.LT, fail: n.GTE },
    formatExclusiveMinimum: { okStr: ">", ok: n.GT, fail: n.LTE }
  }, o = {
    message: ({ keyword: u, schemaCode: p }) => r.str`should be ${s[u].okStr} ${p}`,
    params: ({ keyword: u, schemaCode: p }) => r._`{comparison: ${s[u].okStr}, limit: ${p}}`
  };
  e.formatLimitDefinition = {
    keyword: Object.keys(s),
    type: "string",
    schemaType: "string",
    $data: !0,
    error: o,
    code(u) {
      const { gen: p, data: c, schemaCode: i, keyword: d, it: w } = u, { opts: b, self: h } = w;
      if (!b.validateFormats)
        return;
      const y = new t.KeywordCxt(w, h.RULES.all.format.definition, "format");
      y.$data ? _() : m();
      function _() {
        const P = p.scopeValue("formats", {
          ref: h.formats,
          code: b.code.formats
        }), A = p.const("fmt", r._`${P}[${y.schemaCode}]`);
        u.fail$data(r.or(r._`typeof ${A} != "object"`, r._`${A} instanceof RegExp`, r._`typeof ${A}.compare != "function"`, E(A)));
      }
      function m() {
        const P = y.schema, A = h.formats[P];
        if (!A || A === !0)
          return;
        if (typeof A != "object" || A instanceof RegExp || typeof A.compare != "function")
          throw new Error(`"${d}": format "${P}" does not define "compare" function`);
        const k = p.scopeValue("formats", {
          key: P,
          ref: A,
          code: b.code.formats ? r._`${b.code.formats}${r.getProperty(P)}` : void 0
        });
        u.fail$data(E(k));
      }
      function E(P) {
        return r._`${P}.compare(${c}, ${i}) ${s[d].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  const a = (u) => (u.addKeyword(e.formatLimitDefinition), u);
  e.default = a;
})(Jo);
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  const r = Go, n = Jo, s = W, o = new s.Name("fullFormats"), a = new s.Name("fastFormats"), u = (c, i = { keywords: !0 }) => {
    if (Array.isArray(i))
      return p(c, i, r.fullFormats, o), c;
    const [d, w] = i.mode === "fast" ? [r.fastFormats, a] : [r.fullFormats, o], b = i.formats || r.formatNames;
    return p(c, b, d, w), i.keywords && n.default(c), c;
  };
  u.get = (c, i = "full") => {
    const w = (i === "fast" ? r.fastFormats : r.fullFormats)[c];
    if (!w)
      throw new Error(`Unknown format "${c}"`);
    return w;
  };
  function p(c, i, d, w) {
    var b, h;
    (b = (h = c.opts.code).formats) !== null && b !== void 0 || (h.formats = s._`require("ajv-formats/dist/formats").${w}`);
    for (const y of i)
      c.addFormat(y, d[y]);
  }
  e.exports = t = u, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = u;
})(Tl, Vr);
const xs = /* @__PURE__ */ lo(Vr);
function an(e, t) {
  const r = {};
  for (const [n] of Object.entries(t || {}))
    r[n] = e[n];
  return r;
}
function Cl(e, t) {
  var w, b, h;
  let r = {}, n = {};
  const s = e.namespace || "", o = () => s ? t[s] || {} : t;
  function a(y) {
    return y.replace(/^\//, "").replace(/\//g, ".");
  }
  const u = (y, _) => {
    const m = new Ws({ allErrors: !0, allowUnionTypes: !0 });
    xs(m);
    const E = m.compile(y);
    if (!E(o())) {
      const A = E.errors;
      if (!A)
        throw new Error("Unknown error");
      const k = A[0], S = new Error(k.message);
      throw S.namespace = s, S.params = k.params, S.property = k.params.missingProperty ?? a(k.instancePath), S;
    }
  };
  if (e.server && Object.keys(e.server).length > 0) {
    try {
      u(e.server, "server");
    } catch (_) {
      throw _;
    }
    const y = an(o(), e.server.properties);
    s ? r[s] = y : r = y;
  }
  if (e.client && Object.keys(e.client).length > 0) {
    try {
      u(e.client, "client");
    } catch (_) {
      throw _;
    }
    const y = an(o(), e.client.properties);
    s ? n[s] = y : n = y;
  }
  if (e["*"] && Object.keys(e["*"]).length > 0) {
    const y = an(o(), e["*"].properties);
    try {
      u(e["*"], "both");
    } catch (_) {
      throw _;
    }
    s ? (r[s] = { ...r[s], ...y }, n[s] = { ...n[s], ...y }) : (r = { ...r, ...y }, n = { ...n, ...y });
  }
  function p(y) {
    if (y.type === "object" && ("additionalProperties" in y || (y.additionalProperties = !1), y.properties))
      for (const _ in y.properties)
        y.properties[_] = p(y.properties[_]);
    return y;
  }
  function c(y, _) {
    var A;
    const m = new Ws({ allErrors: !0, allowUnionTypes: !0 });
    xs(m);
    const E = m.compile(p(y));
    if (E(_))
      return [];
    {
      const k = [];
      return (A = E.errors) == null || A.forEach((S) => {
        var C;
        if (S.keyword === "additionalProperties") {
          const M = a(S.instancePath), F = M + (M ? "." : "") + ((C = S.params) == null ? void 0 : C.additionalProperty);
          k.push(F);
        }
      }), k;
    }
  }
  const i = {
    ...((w = e.server) == null ? void 0 : w.properties) || {},
    ...((b = e.client) == null ? void 0 : b.properties) || {},
    ...((h = e["*"]) == null ? void 0 : h.properties) || {}
  }, d = c({ type: "object", properties: i }, o()).filter((y) => y !== "modules").map((y) => s ? `${s}.${y}` : y);
  return { server: r, client: n, namespace: s, extraProps: d };
}
const Le = {
  yellow: (e) => e,
  blue: (e) => e,
  red: (e) => e,
  dim: (e) => e
}, Al = {
  compilerOptions: {
    type: "object",
    properties: {
      alias: {
        type: "object",
        additionalProperties: {
          type: "string"
        }
      },
      build: {
        type: "object",
        properties: {
          pwaEnabled: {
            type: "boolean"
          },
          assetsPath: {
            type: "string"
          },
          outputDir: {
            type: "string"
          },
          serverUrl: {
            type: "string"
          }
        }
      },
      spritesheetDirectories: {
        type: "array",
        items: {
          type: "string"
        }
      }
    }
  },
  vite: {
    type: "object",
    additionalProperties: !0
  },
  modulesRoot: {
    type: "string"
  },
  autostart: {
    type: "boolean"
  },
  spritesheetDirectories: {
    type: "array",
    items: {
      type: "string"
    }
  }
}, jl = {
  canvas: {
    type: "object",
    properties: {
      transparent: {
        type: "boolean"
      },
      autoDensity: {
        type: "boolean"
      },
      antialias: {
        type: "boolean"
      },
      resolution: {
        type: "number"
      },
      preserveDrawingBuffer: {
        type: "boolean"
      },
      backgroundColor: {
        type: "number"
      }
    }
  },
  selector: {
    type: "string"
  },
  selectorGui: {
    type: "string"
  },
  selectorCanvas: {
    type: "string"
  },
  standalone: {
    type: "boolean"
  },
  drawMap: {
    type: "boolean"
  },
  maxFps: {
    type: "number"
  },
  serverFps: {
    type: "number"
  }
}, Il = {
  express: {
    type: "object",
    properties: {
      static: {
        type: "string"
      },
      port: {
        type: "integer"
      },
      json: {
        type: "object",
        additionalProperties: !0
      },
      cors: {
        type: "object",
        additionalProperties: !0
      },
      socketIo: {
        type: "object",
        additionalProperties: !0
      }
    }
  }
}, Dl = {
  vitest: {
    type: "object",
    additionalProperties: !0
  }
}, kl = {
  socketIoClient: {
    type: "object",
    additionalProperties: !0
  }
}, Ml = {
  server: {
    type: "object",
    properties: {
      startMap: {
        type: "string"
      },
      start: {
        type: "object",
        properties: {
          map: {
            type: "string"
          },
          graphic: {
            type: "string"
          },
          hitbox: {
            type: "array",
            items: [
              { type: "integer" },
              { type: "integer" }
            ],
            additionalItems: !1,
            minItems: 2,
            maxItems: 2
          }
        }
      },
      api: {
        type: "object",
        properties: {
          enabled: {
            type: "boolean"
          },
          authSecret: {
            type: "string"
          }
        },
        required: ["enabled", "authSecret"]
      },
      ...Al,
      ...Il,
      ...Dl
    }
  },
  client: {
    type: "object",
    properties: {
      shortName: {
        type: "string"
      },
      description: {
        type: "string"
      },
      themeColor: {
        type: "string"
      },
      icons: {
        type: "array",
        items: {
          type: "object",
          properties: {
            src: {
              type: "string"
            },
            sizes: {
              type: "array",
              items: {
                type: "number",
                minimum: 0
              }
            },
            type: {
              type: "string"
            }
          }
        }
      },
      themeCss: {
        type: "string"
      },
      matchMakerService: {
        type: "string"
      },
      pwa: {
        type: "object",
        additionalProperties: !0
      },
      ...jl,
      ...kl
    }
  },
  "*": {
    type: "object",
    properties: {
      inputs: {
        type: "object",
        additionalProperties: {
          oneOf: [
            {
              type: "object",
              properties: {
                repeat: {
                  type: "boolean",
                  default: !1
                },
                bind: {
                  type: [
                    "string",
                    "array"
                  ]
                },
                delay: {
                  type: "object",
                  properties: {
                    duration: {
                      type: "number",
                      minimum: 0
                    },
                    otherControls: {
                      type: "array",
                      items: {
                        type: "string"
                      }
                    }
                  },
                  required: [
                    "duration"
                  ]
                }
              },
              required: [
                "bind"
              ]
            }
          ]
        }
      },
      name: {
        type: "string"
      }
    }
  }
};
function Wo(e, t) {
  for (var r = 0, n = e.length - 1; n >= 0; n--) {
    var s = e[n];
    s === "." ? e.splice(n, 1) : s === ".." ? (e.splice(n, 1), r++) : r && (e.splice(n, 1), r--);
  }
  if (t)
    for (; r--; r)
      e.unshift("..");
  return e;
}
var Fl = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/, us = function(e) {
  return Fl.exec(e).slice(1);
};
function _n() {
  for (var e = "", t = !1, r = arguments.length - 1; r >= -1 && !t; r--) {
    var n = r >= 0 ? arguments[r] : "/";
    if (typeof n != "string")
      throw new TypeError("Arguments to path.resolve must be strings");
    if (!n)
      continue;
    e = n + "/" + e, t = n.charAt(0) === "/";
  }
  return e = Wo(ls(e.split("/"), function(s) {
    return !!s;
  }), !t).join("/"), (t ? "/" : "") + e || ".";
}
function xo(e) {
  var t = Xo(e), r = Bl(e, -1) === "/";
  return e = Wo(ls(e.split("/"), function(n) {
    return !!n;
  }), !t).join("/"), !e && !t && (e = "."), e && r && (e += "/"), (t ? "/" : "") + e;
}
function Xo(e) {
  return e.charAt(0) === "/";
}
function Ul() {
  var e = Array.prototype.slice.call(arguments, 0);
  return xo(ls(e, function(t, r) {
    if (typeof t != "string")
      throw new TypeError("Arguments to path.join must be strings");
    return t;
  }).join("/"));
}
function zl(e, t) {
  e = _n(e).substr(1), t = _n(t).substr(1);
  function r(c) {
    for (var i = 0; i < c.length && c[i] === ""; i++)
      ;
    for (var d = c.length - 1; d >= 0 && c[d] === ""; d--)
      ;
    return i > d ? [] : c.slice(i, d - i + 1);
  }
  for (var n = r(e.split("/")), s = r(t.split("/")), o = Math.min(n.length, s.length), a = o, u = 0; u < o; u++)
    if (n[u] !== s[u]) {
      a = u;
      break;
    }
  for (var p = [], u = a; u < n.length; u++)
    p.push("..");
  return p = p.concat(s.slice(a)), p.join("/");
}
var Vl = "/", Ll = ":";
function ql(e) {
  var t = us(e), r = t[0], n = t[1];
  return !r && !n ? "." : (n && (n = n.substr(0, n.length - 1)), r + n);
}
function Hl(e, t) {
  var r = us(e)[2];
  return t && r.substr(-1 * t.length) === t && (r = r.substr(0, r.length - t.length)), r;
}
function Kl(e) {
  return us(e)[3];
}
const me = {
  extname: Kl,
  basename: Hl,
  dirname: ql,
  sep: Vl,
  delimiter: Ll,
  relative: zl,
  join: Ul,
  isAbsolute: Xo,
  normalize: xo,
  resolve: _n
};
function ls(e, t) {
  if (e.filter)
    return e.filter(t);
  for (var r = [], n = 0; n < e.length; n++)
    t(e[n], n, e) && r.push(e[n]);
  return r;
}
var Bl = "ab".substr(-1) === "b" ? function(e, t, r) {
  return e.substr(t, r);
} : function(e, t, r) {
  return t < 0 && (t = e.length + t), e.substr(t, r);
};
function Lr(e) {
  console.log(Le.yellow(`⚠️  Warning - ${e}`));
}
function Gl(e) {
  console.log(Le.blue(`ℹ️  Info - ${e}`));
}
function Jl(e) {
  console.log(Le.red(`❌  Error - ${e}`));
}
const Wl = (e) => {
  Jl(`${e.response.status} - ${e.response.data.error}`);
};
function xl(e, t, r) {
  let n = {}, s = {}, o = [];
  const a = r.side == "server", u = (c, i) => {
    try {
      const d = Cl(c, t);
      d.server && (s = { ...s, ...d.server }), d.client && (n = { ...n, ...d.client }), d.extraProps && (o = [...o, ...d.extraProps]);
    } catch (d) {
      if (!d.property)
        throw console.log(d), d;
      if (!a)
        return !1;
      let w = Le.red(`Invalidate "${i}" module: ${d.message}`), b = `[${d.namespace}]
  ${d.property} = YOUR_VALUE`;
      throw i || (w = Le.red(`Invalidate config: ${d.message}`), b = `${d.property} = YOUR_VALUE`), console.log("----------"), console.log(w), d.params.allowedValues && console.log(`
${Le.dim("➜ Authorize values:")} ${Le.dim(d.params.allowedValues.join(", "))}`), console.log(`${Le.dim("➜")} ${Le.dim(`you need to put the following configuration in rpg.toml:

${b}`)}`), console.log("----------"), d;
    }
  };
  u(Ml);
  let p = [];
  for (let c of e) {
    let i = c;
    i[0] != "." && (i = me.join("node_modules", i));
    const d = me.resolve(process.cwd(), i, "config.json");
    if (_e.existsSync(d)) {
      const w = _e.readFileSync(d).toString(), b = JSON.parse(w);
      b.namespace && p.push(b.namespace), u(b, c);
    }
  }
  if (a) {
    const c = o.filter((i) => p.indexOf(i) == -1);
    if (c.length > 0) {
      Lr("In rpg.toml, you put the following properties, but they are not used by the modules. Check the names of the properties.");
      for (let i of c)
        console.log(`  - ${Le.yellow(i)}`);
    }
  }
  return {
    configClient: n,
    configServer: s
  };
}
const cn = () => [], Xl = (e) => [
  ...cn(),
  ...cn(),
  ...cn()
], Yl = (e) => me.join(e, "assets");
function sr(e) {
  return e.replace(/\\/g, "/");
}
function Yo(e) {
  const { cwd: t } = process;
  return sr(
    "./" + sr(me.relative(t(), e))
  );
}
function Qo(e, t) {
  const r = e.indexOf(t);
  if (r === -1)
    throw new Error("Project path not found in absolute path");
  return e.substring(r);
}
function Xs(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(s) {
      return Object.getOwnPropertyDescriptor(e, s).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Ys(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Xs(Object(r), !0).forEach(function(n) {
      Ql(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Xs(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function Ql(e, t, r) {
  return t = Zl(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function Zl(e) {
  var t = ed(e, "string");
  return typeof t == "symbol" ? t : String(t);
}
function ed(e, t) {
  if (typeof e != "object" || e === null)
    return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t || "default");
    if (typeof n != "object")
      return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
const Se = Zo({});
function Zo(e) {
  return t.withOptions = (r) => Zo(Ys(Ys({}, e), r)), t;
  function t(r, ...n) {
    const s = typeof r == "string" ? [r] : r.raw, {
      escapeSpecialCharacters: o = Array.isArray(r)
    } = e;
    let a = "";
    for (let c = 0; c < s.length; c++) {
      let i = s[c];
      o && (i = i.replace(/\\\n[ \t]*/g, "").replace(/\\`/g, "`").replace(/\\\$/g, "$").replace(/\\{/g, "{")), a += i, c < n.length && (a += n[c]);
    }
    const u = a.split(`
`);
    let p = null;
    for (const c of u) {
      const i = c.match(/^(\s+)\S+/);
      if (i) {
        const d = i[1].length;
        p ? p = Math.min(p, d) : p = d;
      }
    }
    if (p !== null) {
      const c = p;
      a = u.map((i) => i[0] === " " || i[0] === "	" ? i.slice(c) : i).join(`
`);
    }
    return a.trim().replace(/\\n/g, `
`);
  }
}
var Qs = Object.freeze, td = Object.defineProperty, rd = (e, t) => Qs(td(e, "raw", { value: Qs(t || e.slice()) })), Zs;
const Wt = "virtual-modules", Rr = "virtual-config-client", Nr = "virtual-config-server", { cwd: or, exit: nd } = process;
function qr(e) {
  return e = e.replace(/\./g, ""), e.replace(/[.@\/ -]/g, "_");
}
function ea(e) {
  return e.startsWith("@rpgjs") || e.startsWith("rpgjs") ? "node_modules/" + e : e;
}
function Wr(e) {
  const t = [], r = _e.readdirSync(e, { withFileTypes: !0 });
  for (const n of r) {
    const s = me.join(e, n.name);
    if (n.isDirectory()) {
      const o = Wr(s);
      t.push(...o);
    } else
      t.push(s);
  }
  return t;
}
function He(e, t, r, n, s) {
  let o = "", a = "";
  const u = me.resolve(t, e);
  return _e.existsSync(u) ? {
    variablesString: Wr(u).filter((c) => typeof r == "string" ? c.endsWith(r) : r.some((i) => c.endsWith(i))).filter((c) => s != null && s.customFilter ? s.customFilter(c) : !0).map((c) => {
      const i = Yo(c), d = qr(i);
      return a = i, o = o + `
import ${d} from '${i}'`, n ? n(i, d) : d;
    }).join(","),
    importString: o,
    folder: u,
    relativePath: a
  } : {
    variablesString: "",
    importString: "",
    folder: "",
    relativePath: ""
  };
}
function Tt(e, t, r) {
  const n = me.resolve(or(), ea(e), t + ".ts");
  let s = "";
  return _e.existsSync(n) && (s = `import ${r || t} from '${e}/${t}.ts'`), s;
}
function ta(e, t, r) {
  var y, _, m;
  const { modulesCreated: n } = t;
  n.includes(e) || n.push(e);
  const s = Tt(e, "player"), o = Tt(e, "server"), a = He("maps", e, ".ts"), u = He("maps", e, ".tmx", (E, P) => `
            {
                id: '${E.replace(".tmx", "")}',
                file: ${P}
            }
        `, {
    customFilter: (E) => {
      const P = E.replace(".tmx", ".ts");
      return !_e.existsSync(P);
    }
  }), p = !!(u != null && u.variablesString), c = He("worlds", e, ".world"), i = He("database", e, ".ts"), d = He("events", e, ".ts"), w = (y = r.start) == null ? void 0 : y.hitbox, b = (E) => Se`
        [${E == null ? void 0 : E.variablesString}].map((val) => {
            if (!val) {
                throw new Error('Do you have "export default" in this file ? :  ${E == null ? void 0 : E.relativePath}')
            }
            return val
        })
    `;
  return `
        import { type RpgServer, RpgModule } from '@rpgjs/server'
        ${u == null ? void 0 : u.importString}
        ${a == null ? void 0 : a.importString}
        ${c == null ? void 0 : c.importString}
        ${s || "const player = {}"}
        ${d == null ? void 0 : d.importString}
        ${i == null ? void 0 : i.importString}
        ${o}

        ${n.length == 1 ? Se`const _lastConnectedCb = player.onConnected
            player.onConnected = async (player) => {
                if (_lastConnectedCb) await _lastConnectedCb(player)
                if (!player.server.module.customHookExists('server.player.onAuth')) {
                    ${(_ = r.start) != null && _.graphic ? `player.setGraphic('${(m = r.start) == null ? void 0 : m.graphic}')` : ""}
                    ${w ? `player.setHitbox(${w[0]}, ${w[1]})` : ""}
                    ${r.startMap ? `await player.changeMap('${r.startMap}')` : ""}
                }
            }` : ""}

        @RpgModule<RpgServer>({ 
            player,
            events: ${b(d)},
            ${o ? "engine: server," : ""}
            database: ${b(i)},
            maps: [${u == null ? void 0 : u.variablesString}${p ? "," : ""}${a == null ? void 0 : a.variablesString}],
            worldMaps: [${c == null ? void 0 : c.variablesString}] 
        })
        export default class RpgServerModuleEngine {} 
    `;
}
function Tr(e, t, r, n = !1) {
  const s = He(e, t, ".ts");
  let o = "";
  if (s != null && s.importString) {
    const a = s.folder;
    let u = "", p = "";
    const c = a.replace(or(), "/");
    if (Wr(a).filter((i) => [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp", ".svg"].some((w) => i.toLowerCase().endsWith(w))).forEach(async (i) => {
      const d = me.basename(i), w = d.replace(me.extname(i), "");
      if (r.serveMode === !1) {
        const { outputDir: b = "dist" } = r.config.compilerOptions.build, h = me.join(b, Yl(r.type === "rpg" ? "" : "client"), d);
        _e.copyFileSync(i, h);
      }
      p = i, u += `"${w}": "${sr(Qo(i, c.replace(/^\/+/, "")))}",
`;
    }), !p)
      Lr(`No spritesheet image found in ${e} folder`);
    else {
      const i = Ma(p);
      o = `
            ${s == null ? void 0 : s.variablesString}.images = {
                ${u}
            }
            ${s == null ? void 0 : s.variablesString}.prototype.width = ${i.width}
            ${s == null ? void 0 : s.variablesString}.prototype.height = ${i.height}
        `;
    }
  } else
    n && Lr(`No spritesheet folder found in ${e} folder`);
  return {
    ...s,
    propImagesString: o
  };
}
function ra(e, t, r) {
  const n = Tt(e, "scene-map", "sceneMap"), s = Tt(e, "sprite"), o = Tt(e, "client", "engine"), a = He("gui", e, [".vue", ".tsx", ".jsx"]);
  let u = [];
  const p = {
    config: r,
    ...t
  };
  r.spritesheetDirectories && (u = r.spritesheetDirectories.map((h) => Tr(h, e, p))), (r.spritesheetDirectories ?? []).some((h) => h === "characters") || u.push(Tr("characters", e, p, !1));
  const c = "spritesheets", i = me.join(e, c);
  if (_e.existsSync(i)) {
    const h = _e.readdirSync(i, { withFileTypes: !0 });
    for (const y of h)
      y.isDirectory() && u.push(Tr(me.join(c, y.name), e, p));
  }
  const d = He("sounds", e, ".ts"), w = He("sounds", e, [".mp3", ".ogg"], void 0, {
    customFilter: (h) => {
      const y = h.replace(/\.(mp3|ogg)$/, ".ts");
      return !_e.existsSync(y);
    }
  }), b = !!(w != null && w.variablesString);
  return u = u.filter((h) => h.importString), Se`
        import { type RpgClient, RpgModule } from '@rpgjs/client'
        ${s}
        ${n}
        ${o}
        ${u.map((h) => h.importString).join(`
`)}
        ${a == null ? void 0 : a.importString}
        ${w == null ? void 0 : w.importString}
        ${d == null ? void 0 : d.importString}

        ${u.map((h) => h.propImagesString).join(`
`)}
        
        @RpgModule<RpgClient>({ 
            spritesheets: [ ${u.map((h) => h.variablesString).join(`,
`)} ],
            sprite: ${s ? "sprite" : "{}"},
            ${o ? "engine," : ""}
            scenes: { ${n ? "map: sceneMap" : ""} },
            gui: [${a == null ? void 0 : a.variablesString}],
            sounds: [${w == null ? void 0 : w.variablesString}${b ? "," : ""}${d == null ? void 0 : d.variablesString}]
        })
        export default class RpgClientModuleEngine {}
    `;
}
function na(e, t, r, n, s) {
  const o = `virtual-${t}-client.ts`, a = `virtual-${t}-server.ts`;
  if (e.endsWith(a + "?server"))
    return ta(r, n, s);
  if (e.endsWith(o + "?client"))
    return ra(r, n, s);
  const u = me.join(or(), e), p = me.join(u, "package.json"), c = me.join(u, "index.ts");
  if (_e.existsSync(p)) {
    const { main: i } = JSON.parse(_e.readFileSync(p).toString());
    if (i) {
      const d = sr(me.join(e, i));
      return Se`
                import mod from '@/${d}'
                export default mod
            `;
    }
  } else if (_e.existsSync(c)) {
    const i = Qo(sr(c), e);
    return Se`
            import mod from '@/${i}'
            export default mod
        `;
  }
  return Se`
        import client from 'client!./${o}'
        import server from 'server!./${a}'
        
        export default {
            client,
            server
        } 
    `;
}
function sa(e, t, r) {
  return e.endsWith(Nr) ? `
            export default ${JSON.stringify(t)}
        ` : e.endsWith(Rr) ? `
            export default ${JSON.stringify(r)}
        ` : null;
}
function un(e) {
  return e.replace(/^.\//, "");
}
function sd(e = {}, t) {
  var p, c;
  let r = [], n = [];
  const s = (c = (p = t.vite) == null ? void 0 : p.build) == null ? void 0 : c.lib;
  if (t.modules && (r = t.modules), t.inputs && e.server)
    for (let i in t.inputs) {
      const d = t.inputs[i];
      (typeof d.bind == "string" ? [d.bind] : d.bind).find((w) => ["1", "2", "3", "4"].includes(w)) && Lr(`Input "${i}" : Note that 1, 2, 3 or 4 designates a direction. Use up, right, bottom or left instead. If you want the number key, use n1, n2, n<number>.`);
    }
  let o;
  try {
    o = xl(r, t, e);
  } catch {
    e.side == "server" && nd();
  }
  if (!o)
    return;
  const { configClient: a, configServer: u } = o;
  return {
    name: "vite-plugin-config-toml",
    transformIndexHtml: {
      enforce: "pre",
      transform(i) {
        const d = me.resolve(or(), "src", "client.ts"), w = _e.existsSync(d) ? "mmorpg!./src/client.ts" : "mmorpg!virtual-client.ts", b = me.resolve(or(), "src", "standalone.ts"), h = _e.existsSync(b) ? "rpg!./src/standalone.ts" : "rpg!virtual-standalone.ts";
        return i.replace("<head>", Se(Zs || (Zs = rd([`
                <head>
                <script type="module">
                    import '`, `'
                    import '`, `'
                <\/script>`])), w, h));
      }
    },
    handleHotUpdate() {
      n = [];
    },
    async resolveId(i, d) {
      if (i.endsWith(Wt) || i.endsWith(Rr) || i.endsWith(Nr))
        return i;
      for (let w of r)
        if (i === un(w))
          return i;
      if (i.includes("virtual") && !i.endsWith("virtual-server.ts") && e.serveMode || i.includes("virtual") && !e.serveMode)
        return i;
    },
    async load(i) {
      const { env: d } = process, w = d.VITE_SERVER_URL, b = d.VITE_GAME_URL, h = `{
                VITE_BUILT: ${d.VITE_BUILT},
                VITE_SERVER_URL: ${w ? "'" + w + "'" : "undefined"},
                VITE_GAME_URL: ${b ? "'" + b + "'" : "undefined"},
                VITE_RPG_TYPE: '${e.type ?? "mmorpg"}',
                VITE_ASSETS_PATH: '${d.VITE_ASSETS_PATH ?? ""}',
                VITE_REACT: ${d.VITE_REACT},
            }`;
      if (i.endsWith(Wt)) {
        const _ = r.reduce((m, E) => {
          const P = qr(E);
          return m[P] = E, m;
        }, {});
        return `
                ${Object.keys(_).map((m) => `import ${m} from '${un(_[m])}'`).join(`
`)}

                export default [
                   ${Object.keys(_).join(`,
`)}
                ]
                `;
      } else if (i.endsWith("virtual-client.ts?mmorpg")) {
        const _ = Se`
                    import { entryPoint } from '@rpgjs/client'
                    import io from 'socket.io-client'
                    import modules from './${Wt}'
                    import globalConfig from './${Rr}'
                `;
        return t.autostart ? Se`${_}
    
                    document.addEventListener('DOMContentLoaded', function(e) { 
                        entryPoint(modules, { 
                            io,
                            globalConfig,
                            envs: ${h}
                        }).start()
                    });
                    ` : Se`${_}
                        window.RpgStandalone = (extraModules = []) => {
                            return entryPoint([
                                ...modules,
                                ...extraModules
                            ], { 
                                io,
                                globalConfig,
                                envs: ${h}
                            }).start()
                        }
                    `;
      } else if (i.endsWith("virtual-standalone.ts?rpg")) {
        const _ = Se`
                    import { entryPoint } from '@rpgjs/standalone'
                    import globalConfigClient from './${Rr}'
                    import globalConfigServer from './${Nr}'
                    import modules from './${Wt}'
                `;
        return t.autostart ? Se`${_}

                    ${s ? `  window.global ||= window
                     
                        export default (extraModules = []) => {
                            return entryPoint([
                                ...modules,
                                ...extraModules
                            ], {
                                globalConfigClient,
                                globalConfigServer,
                                envs: ${h}
                            })
                        }
                     ` : `document.addEventListener('DOMContentLoaded', async function() { 
                            window.RpgStandalone = await entryPoint(modules, {
                                globalConfigClient,
                                globalConfigServer,
                                envs: ${h}
                            }).start()
                        })`}
    
                  ` : Se`${_}
                        window.RpgStandalone = (extraModules = []) => {
                            return entryPoint([
                                ...modules,
                                ...extraModules
                            ], {
                                globalConfigClient,
                                globalConfigServer,
                                envs: ${h}
                            }).start()
                        }
                    `;
      } else if (i.endsWith("virtual-server.ts"))
        return Se`
                import { expressServer } from '@rpgjs/server/express'
                import { RpgWorld } from '@rpgjs/server'
                import * as url from 'url'
                import modules from './${Wt}'
                import globalConfig from './${Nr}'

                const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

                expressServer(modules, {
                    globalConfig,
                    basePath: __dirname,
                    envs: ${h}
                }).then(({ server, game }) => {
                    if (import.meta['hot']) {
                        import.meta['hot'].on("vite:beforeFullReload", () => {
                            server.close();
                            RpgWorld.getPlayers().forEach(player => {
                                player.gameReload();
                            });
                            game.stop();
                        });
                    }
                })
              `;
      const y = sa(i, u, a);
      if (y)
        return y;
      for (let _ of r) {
        let m = un(_), E = qr(m);
        if (i.endsWith(m) || i.includes("virtual-" + E))
          return na(i, E, _, {
            ...e,
            modulesCreated: n
          }, t);
      }
    }
  };
}
const _f = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createConfigFiles: sa,
  createModuleLoad: na,
  default: sd,
  formatVariableName: qr,
  getAllFiles: Wr,
  importString: Tt,
  loadClientFiles: ra,
  loadServerFiles: ta,
  loadSpriteSheet: Tr,
  searchFolderAndTransformToImportString: He,
  transformPathIfModule: ea
}, Symbol.toStringTag, { value: "Module" }));
function wf(e = {}) {
  const { side: t = "client", mode: r = "development", type: n = "mmorpg" } = e;
  async function s(a, u, p) {
    const c = ["client!", "server!", "rpg!", "mmorpg!", "production!", "development!"];
    for (const i of c)
      if (a.startsWith(i)) {
        const d = a.replace(i, ""), w = await this.resolve(d, u, {
          skipSelf: !0,
          ...p
        });
        return {
          ...w,
          id: w.id + `?${i.replace("!", "")}`
        };
      }
  }
  async function o(a, u) {
    let p = a;
    return r === "test" ? {
      code: p,
      map: null
    } : ((u.endsWith(t === "client" ? "?server" : "?client") && n !== "rpg" || u.endsWith("?production") && r !== "production" || u.endsWith("?development") && r !== "development" || u.endsWith("?rpg") && n !== "rpg" || u.endsWith("?mmorpg") && n !== "mmorpg") && (p = "export default null;"), {
      code: p,
      map: null
    });
  }
  return {
    name: "transform-flag",
    resolveId: s,
    transform: o
  };
}
function oa(e, t) {
  return function() {
    return e.apply(t, arguments);
  };
}
const { toString: od } = Object.prototype, { getPrototypeOf: ds } = Object, xr = ((e) => (t) => {
  const r = od.call(t);
  return e[r] || (e[r] = r.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null)), Qe = (e) => (e = e.toLowerCase(), (t) => xr(t) === e), Xr = (e) => (t) => typeof t === e, { isArray: kt } = Array, ar = Xr("undefined");
function ad(e) {
  return e !== null && !ar(e) && e.constructor !== null && !ar(e.constructor) && Ye(e.constructor.isBuffer) && e.constructor.isBuffer(e);
}
const aa = Qe("ArrayBuffer");
function id(e) {
  let t;
  return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? t = ArrayBuffer.isView(e) : t = e && e.buffer && aa(e.buffer), t;
}
const cd = Xr("string"), Ye = Xr("function"), ia = Xr("number"), fs = (e) => e !== null && typeof e == "object", ud = (e) => e === !0 || e === !1, Cr = (e) => {
  if (xr(e) !== "object")
    return !1;
  const t = ds(e);
  return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Symbol.toStringTag in e) && !(Symbol.iterator in e);
}, ld = Qe("Date"), dd = Qe("File"), fd = Qe("Blob"), pd = Qe("FileList"), hd = (e) => fs(e) && Ye(e.pipe), md = (e) => {
  let t;
  return e && (typeof FormData == "function" && e instanceof FormData || Ye(e.append) && ((t = xr(e)) === "formdata" || // detect form-data instance
  t === "object" && Ye(e.toString) && e.toString() === "[object FormData]"));
}, yd = Qe("URLSearchParams"), gd = (e) => e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function fr(e, t, { allOwnKeys: r = !1 } = {}) {
  if (e === null || typeof e > "u")
    return;
  let n, s;
  if (typeof e != "object" && (e = [e]), kt(e))
    for (n = 0, s = e.length; n < s; n++)
      t.call(null, e[n], n, e);
  else {
    const o = r ? Object.getOwnPropertyNames(e) : Object.keys(e), a = o.length;
    let u;
    for (n = 0; n < a; n++)
      u = o[n], t.call(null, e[u], u, e);
  }
}
function ca(e, t) {
  t = t.toLowerCase();
  const r = Object.keys(e);
  let n = r.length, s;
  for (; n-- > 0; )
    if (s = r[n], t === s.toLowerCase())
      return s;
  return null;
}
const ua = (() => typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global)(), la = (e) => !ar(e) && e !== ua;
function wn() {
  const { caseless: e } = la(this) && this || {}, t = {}, r = (n, s) => {
    const o = e && ca(t, s) || s;
    Cr(t[o]) && Cr(n) ? t[o] = wn(t[o], n) : Cr(n) ? t[o] = wn({}, n) : kt(n) ? t[o] = n.slice() : t[o] = n;
  };
  for (let n = 0, s = arguments.length; n < s; n++)
    arguments[n] && fr(arguments[n], r);
  return t;
}
const vd = (e, t, r, { allOwnKeys: n } = {}) => (fr(t, (s, o) => {
  r && Ye(s) ? e[o] = oa(s, r) : e[o] = s;
}, { allOwnKeys: n }), e), $d = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e), _d = (e, t, r, n) => {
  e.prototype = Object.create(t.prototype, n), e.prototype.constructor = e, Object.defineProperty(e, "super", {
    value: t.prototype
  }), r && Object.assign(e.prototype, r);
}, wd = (e, t, r, n) => {
  let s, o, a;
  const u = {};
  if (t = t || {}, e == null)
    return t;
  do {
    for (s = Object.getOwnPropertyNames(e), o = s.length; o-- > 0; )
      a = s[o], (!n || n(a, e, t)) && !u[a] && (t[a] = e[a], u[a] = !0);
    e = r !== !1 && ds(e);
  } while (e && (!r || r(e, t)) && e !== Object.prototype);
  return t;
}, bd = (e, t, r) => {
  e = String(e), (r === void 0 || r > e.length) && (r = e.length), r -= t.length;
  const n = e.indexOf(t, r);
  return n !== -1 && n === r;
}, Ed = (e) => {
  if (!e)
    return null;
  if (kt(e))
    return e;
  let t = e.length;
  if (!ia(t))
    return null;
  const r = new Array(t);
  for (; t-- > 0; )
    r[t] = e[t];
  return r;
}, Sd = ((e) => (t) => e && t instanceof e)(typeof Uint8Array < "u" && ds(Uint8Array)), Pd = (e, t) => {
  const n = (e && e[Symbol.iterator]).call(e);
  let s;
  for (; (s = n.next()) && !s.done; ) {
    const o = s.value;
    t.call(e, o[0], o[1]);
  }
}, Od = (e, t) => {
  let r;
  const n = [];
  for (; (r = e.exec(t)) !== null; )
    n.push(r);
  return n;
}, Rd = Qe("HTMLFormElement"), Nd = (e) => e.toLowerCase().replace(
  /[-_\s]([a-z\d])(\w*)/g,
  function(r, n, s) {
    return n.toUpperCase() + s;
  }
), eo = (({ hasOwnProperty: e }) => (t, r) => e.call(t, r))(Object.prototype), Td = Qe("RegExp"), da = (e, t) => {
  const r = Object.getOwnPropertyDescriptors(e), n = {};
  fr(r, (s, o) => {
    t(s, o, e) !== !1 && (n[o] = s);
  }), Object.defineProperties(e, n);
}, Cd = (e) => {
  da(e, (t, r) => {
    if (Ye(e) && ["arguments", "caller", "callee"].indexOf(r) !== -1)
      return !1;
    const n = e[r];
    if (Ye(n)) {
      if (t.enumerable = !1, "writable" in t) {
        t.writable = !1;
        return;
      }
      t.set || (t.set = () => {
        throw Error("Can not rewrite read-only method '" + r + "'");
      });
    }
  });
}, Ad = (e, t) => {
  const r = {}, n = (s) => {
    s.forEach((o) => {
      r[o] = !0;
    });
  };
  return kt(e) ? n(e) : n(String(e).split(t)), r;
}, jd = () => {
}, Id = (e, t) => (e = +e, Number.isFinite(e) ? e : t), ln = "abcdefghijklmnopqrstuvwxyz", to = "0123456789", fa = {
  DIGIT: to,
  ALPHA: ln,
  ALPHA_DIGIT: ln + ln.toUpperCase() + to
}, Dd = (e = 16, t = fa.ALPHA_DIGIT) => {
  let r = "";
  const { length: n } = t;
  for (; e--; )
    r += t[Math.random() * n | 0];
  return r;
};
function kd(e) {
  return !!(e && Ye(e.append) && e[Symbol.toStringTag] === "FormData" && e[Symbol.iterator]);
}
const Md = (e) => {
  const t = new Array(10), r = (n, s) => {
    if (fs(n)) {
      if (t.indexOf(n) >= 0)
        return;
      if (!("toJSON" in n)) {
        t[s] = n;
        const o = kt(n) ? [] : {};
        return fr(n, (a, u) => {
          const p = r(a, s + 1);
          !ar(p) && (o[u] = p);
        }), t[s] = void 0, o;
      }
    }
    return n;
  };
  return r(e, 0);
}, I = {
  isArray: kt,
  isArrayBuffer: aa,
  isBuffer: ad,
  isFormData: md,
  isArrayBufferView: id,
  isString: cd,
  isNumber: ia,
  isBoolean: ud,
  isObject: fs,
  isPlainObject: Cr,
  isUndefined: ar,
  isDate: ld,
  isFile: dd,
  isBlob: fd,
  isRegExp: Td,
  isFunction: Ye,
  isStream: hd,
  isURLSearchParams: yd,
  isTypedArray: Sd,
  isFileList: pd,
  forEach: fr,
  merge: wn,
  extend: vd,
  trim: gd,
  stripBOM: $d,
  inherits: _d,
  toFlatObject: wd,
  kindOf: xr,
  kindOfTest: Qe,
  endsWith: bd,
  toArray: Ed,
  forEachEntry: Pd,
  matchAll: Od,
  isHTMLForm: Rd,
  hasOwnProperty: eo,
  hasOwnProp: eo,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors: da,
  freezeMethods: Cd,
  toObjectSet: Ad,
  toCamelCase: Nd,
  noop: jd,
  toFiniteNumber: Id,
  findKey: ca,
  global: ua,
  isContextDefined: la,
  ALPHABET: fa,
  generateString: Dd,
  isSpecCompliantForm: kd,
  toJSONObject: Md
};
function te(e, t, r, n, s) {
  Error.call(this), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack, this.message = e, this.name = "AxiosError", t && (this.code = t), r && (this.config = r), n && (this.request = n), s && (this.response = s);
}
I.inherits(te, Error, {
  toJSON: function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: I.toJSONObject(this.config),
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});
const pa = te.prototype, ha = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL"
  // eslint-disable-next-line func-names
].forEach((e) => {
  ha[e] = { value: e };
});
Object.defineProperties(te, ha);
Object.defineProperty(pa, "isAxiosError", { value: !0 });
te.from = (e, t, r, n, s, o) => {
  const a = Object.create(pa);
  return I.toFlatObject(e, a, function(p) {
    return p !== Error.prototype;
  }, (u) => u !== "isAxiosError"), te.call(a, e.message, t, r, n, s), a.cause = e, a.name = e.name, o && Object.assign(a, o), a;
};
const Fd = null;
function bn(e) {
  return I.isPlainObject(e) || I.isArray(e);
}
function ma(e) {
  return I.endsWith(e, "[]") ? e.slice(0, -2) : e;
}
function ro(e, t, r) {
  return e ? e.concat(t).map(function(s, o) {
    return s = ma(s), !r && o ? "[" + s + "]" : s;
  }).join(r ? "." : "") : t;
}
function Ud(e) {
  return I.isArray(e) && !e.some(bn);
}
const zd = I.toFlatObject(I, {}, null, function(t) {
  return /^is[A-Z]/.test(t);
});
function Yr(e, t, r) {
  if (!I.isObject(e))
    throw new TypeError("target must be an object");
  t = t || new FormData(), r = I.toFlatObject(r, {
    metaTokens: !0,
    dots: !1,
    indexes: !1
  }, !1, function(y, _) {
    return !I.isUndefined(_[y]);
  });
  const n = r.metaTokens, s = r.visitor || i, o = r.dots, a = r.indexes, p = (r.Blob || typeof Blob < "u" && Blob) && I.isSpecCompliantForm(t);
  if (!I.isFunction(s))
    throw new TypeError("visitor must be a function");
  function c(h) {
    if (h === null)
      return "";
    if (I.isDate(h))
      return h.toISOString();
    if (!p && I.isBlob(h))
      throw new te("Blob is not supported. Use a Buffer instead.");
    return I.isArrayBuffer(h) || I.isTypedArray(h) ? p && typeof Blob == "function" ? new Blob([h]) : Buffer.from(h) : h;
  }
  function i(h, y, _) {
    let m = h;
    if (h && !_ && typeof h == "object") {
      if (I.endsWith(y, "{}"))
        y = n ? y : y.slice(0, -2), h = JSON.stringify(h);
      else if (I.isArray(h) && Ud(h) || (I.isFileList(h) || I.endsWith(y, "[]")) && (m = I.toArray(h)))
        return y = ma(y), m.forEach(function(P, A) {
          !(I.isUndefined(P) || P === null) && t.append(
            // eslint-disable-next-line no-nested-ternary
            a === !0 ? ro([y], A, o) : a === null ? y : y + "[]",
            c(P)
          );
        }), !1;
    }
    return bn(h) ? !0 : (t.append(ro(_, y, o), c(h)), !1);
  }
  const d = [], w = Object.assign(zd, {
    defaultVisitor: i,
    convertValue: c,
    isVisitable: bn
  });
  function b(h, y) {
    if (!I.isUndefined(h)) {
      if (d.indexOf(h) !== -1)
        throw Error("Circular reference detected in " + y.join("."));
      d.push(h), I.forEach(h, function(m, E) {
        (!(I.isUndefined(m) || m === null) && s.call(
          t,
          m,
          I.isString(E) ? E.trim() : E,
          y,
          w
        )) === !0 && b(m, y ? y.concat(E) : [E]);
      }), d.pop();
    }
  }
  if (!I.isObject(e))
    throw new TypeError("data must be an object");
  return b(e), t;
}
function no(e) {
  const t = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function(n) {
    return t[n];
  });
}
function ps(e, t) {
  this._pairs = [], e && Yr(e, this, t);
}
const ya = ps.prototype;
ya.append = function(t, r) {
  this._pairs.push([t, r]);
};
ya.toString = function(t) {
  const r = t ? function(n) {
    return t.call(this, n, no);
  } : no;
  return this._pairs.map(function(s) {
    return r(s[0]) + "=" + r(s[1]);
  }, "").join("&");
};
function Vd(e) {
  return encodeURIComponent(e).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function ga(e, t, r) {
  if (!t)
    return e;
  const n = r && r.encode || Vd, s = r && r.serialize;
  let o;
  if (s ? o = s(t, r) : o = I.isURLSearchParams(t) ? t.toString() : new ps(t, r).toString(n), o) {
    const a = e.indexOf("#");
    a !== -1 && (e = e.slice(0, a)), e += (e.indexOf("?") === -1 ? "?" : "&") + o;
  }
  return e;
}
class Ld {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(t, r, n) {
    return this.handlers.push({
      fulfilled: t,
      rejected: r,
      synchronous: n ? n.synchronous : !1,
      runWhen: n ? n.runWhen : null
    }), this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(t) {
    this.handlers[t] && (this.handlers[t] = null);
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    this.handlers && (this.handlers = []);
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(t) {
    I.forEach(this.handlers, function(n) {
      n !== null && t(n);
    });
  }
}
const so = Ld, va = {
  silentJSONParsing: !0,
  forcedJSONParsing: !0,
  clarifyTimeoutError: !1
}, qd = typeof URLSearchParams < "u" ? URLSearchParams : ps, Hd = typeof FormData < "u" ? FormData : null, Kd = typeof Blob < "u" ? Blob : null, Bd = (() => {
  let e;
  return typeof navigator < "u" && ((e = navigator.product) === "ReactNative" || e === "NativeScript" || e === "NS") ? !1 : typeof window < "u" && typeof document < "u";
})(), Gd = (() => typeof WorkerGlobalScope < "u" && // eslint-disable-next-line no-undef
self instanceof WorkerGlobalScope && typeof self.importScripts == "function")(), Be = {
  isBrowser: !0,
  classes: {
    URLSearchParams: qd,
    FormData: Hd,
    Blob: Kd
  },
  isStandardBrowserEnv: Bd,
  isStandardBrowserWebWorkerEnv: Gd,
  protocols: ["http", "https", "file", "blob", "url", "data"]
};
function Jd(e, t) {
  return Yr(e, new Be.classes.URLSearchParams(), Object.assign({
    visitor: function(r, n, s, o) {
      return Be.isNode && I.isBuffer(r) ? (this.append(n, r.toString("base64")), !1) : o.defaultVisitor.apply(this, arguments);
    }
  }, t));
}
function Wd(e) {
  return I.matchAll(/\w+|\[(\w*)]/g, e).map((t) => t[0] === "[]" ? "" : t[1] || t[0]);
}
function xd(e) {
  const t = {}, r = Object.keys(e);
  let n;
  const s = r.length;
  let o;
  for (n = 0; n < s; n++)
    o = r[n], t[o] = e[o];
  return t;
}
function $a(e) {
  function t(r, n, s, o) {
    let a = r[o++];
    const u = Number.isFinite(+a), p = o >= r.length;
    return a = !a && I.isArray(s) ? s.length : a, p ? (I.hasOwnProp(s, a) ? s[a] = [s[a], n] : s[a] = n, !u) : ((!s[a] || !I.isObject(s[a])) && (s[a] = []), t(r, n, s[a], o) && I.isArray(s[a]) && (s[a] = xd(s[a])), !u);
  }
  if (I.isFormData(e) && I.isFunction(e.entries)) {
    const r = {};
    return I.forEachEntry(e, (n, s) => {
      t(Wd(n), s, r, 0);
    }), r;
  }
  return null;
}
const Xd = {
  "Content-Type": void 0
};
function Yd(e, t, r) {
  if (I.isString(e))
    try {
      return (t || JSON.parse)(e), I.trim(e);
    } catch (n) {
      if (n.name !== "SyntaxError")
        throw n;
    }
  return (r || JSON.stringify)(e);
}
const Qr = {
  transitional: va,
  adapter: ["xhr", "http"],
  transformRequest: [function(t, r) {
    const n = r.getContentType() || "", s = n.indexOf("application/json") > -1, o = I.isObject(t);
    if (o && I.isHTMLForm(t) && (t = new FormData(t)), I.isFormData(t))
      return s && s ? JSON.stringify($a(t)) : t;
    if (I.isArrayBuffer(t) || I.isBuffer(t) || I.isStream(t) || I.isFile(t) || I.isBlob(t))
      return t;
    if (I.isArrayBufferView(t))
      return t.buffer;
    if (I.isURLSearchParams(t))
      return r.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), t.toString();
    let u;
    if (o) {
      if (n.indexOf("application/x-www-form-urlencoded") > -1)
        return Jd(t, this.formSerializer).toString();
      if ((u = I.isFileList(t)) || n.indexOf("multipart/form-data") > -1) {
        const p = this.env && this.env.FormData;
        return Yr(
          u ? { "files[]": t } : t,
          p && new p(),
          this.formSerializer
        );
      }
    }
    return o || s ? (r.setContentType("application/json", !1), Yd(t)) : t;
  }],
  transformResponse: [function(t) {
    const r = this.transitional || Qr.transitional, n = r && r.forcedJSONParsing, s = this.responseType === "json";
    if (t && I.isString(t) && (n && !this.responseType || s)) {
      const a = !(r && r.silentJSONParsing) && s;
      try {
        return JSON.parse(t);
      } catch (u) {
        if (a)
          throw u.name === "SyntaxError" ? te.from(u, te.ERR_BAD_RESPONSE, this, null, this.response) : u;
      }
    }
    return t;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: Be.classes.FormData,
    Blob: Be.classes.Blob
  },
  validateStatus: function(t) {
    return t >= 200 && t < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*"
    }
  }
};
I.forEach(["delete", "get", "head"], function(t) {
  Qr.headers[t] = {};
});
I.forEach(["post", "put", "patch"], function(t) {
  Qr.headers[t] = I.merge(Xd);
});
const hs = Qr, Qd = I.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]), Zd = (e) => {
  const t = {};
  let r, n, s;
  return e && e.split(`
`).forEach(function(a) {
    s = a.indexOf(":"), r = a.substring(0, s).trim().toLowerCase(), n = a.substring(s + 1).trim(), !(!r || t[r] && Qd[r]) && (r === "set-cookie" ? t[r] ? t[r].push(n) : t[r] = [n] : t[r] = t[r] ? t[r] + ", " + n : n);
  }), t;
}, oo = Symbol("internals");
function xt(e) {
  return e && String(e).trim().toLowerCase();
}
function Ar(e) {
  return e === !1 || e == null ? e : I.isArray(e) ? e.map(Ar) : String(e);
}
function ef(e) {
  const t = /* @__PURE__ */ Object.create(null), r = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let n;
  for (; n = r.exec(e); )
    t[n[1]] = n[2];
  return t;
}
const tf = (e) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());
function dn(e, t, r, n, s) {
  if (I.isFunction(n))
    return n.call(this, t, r);
  if (s && (t = r), !!I.isString(t)) {
    if (I.isString(n))
      return t.indexOf(n) !== -1;
    if (I.isRegExp(n))
      return n.test(t);
  }
}
function rf(e) {
  return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (t, r, n) => r.toUpperCase() + n);
}
function nf(e, t) {
  const r = I.toCamelCase(" " + t);
  ["get", "set", "has"].forEach((n) => {
    Object.defineProperty(e, n + r, {
      value: function(s, o, a) {
        return this[n].call(this, t, s, o, a);
      },
      configurable: !0
    });
  });
}
class Zr {
  constructor(t) {
    t && this.set(t);
  }
  set(t, r, n) {
    const s = this;
    function o(u, p, c) {
      const i = xt(p);
      if (!i)
        throw new Error("header name must be a non-empty string");
      const d = I.findKey(s, i);
      (!d || s[d] === void 0 || c === !0 || c === void 0 && s[d] !== !1) && (s[d || p] = Ar(u));
    }
    const a = (u, p) => I.forEach(u, (c, i) => o(c, i, p));
    return I.isPlainObject(t) || t instanceof this.constructor ? a(t, r) : I.isString(t) && (t = t.trim()) && !tf(t) ? a(Zd(t), r) : t != null && o(r, t, n), this;
  }
  get(t, r) {
    if (t = xt(t), t) {
      const n = I.findKey(this, t);
      if (n) {
        const s = this[n];
        if (!r)
          return s;
        if (r === !0)
          return ef(s);
        if (I.isFunction(r))
          return r.call(this, s, n);
        if (I.isRegExp(r))
          return r.exec(s);
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(t, r) {
    if (t = xt(t), t) {
      const n = I.findKey(this, t);
      return !!(n && this[n] !== void 0 && (!r || dn(this, this[n], n, r)));
    }
    return !1;
  }
  delete(t, r) {
    const n = this;
    let s = !1;
    function o(a) {
      if (a = xt(a), a) {
        const u = I.findKey(n, a);
        u && (!r || dn(n, n[u], u, r)) && (delete n[u], s = !0);
      }
    }
    return I.isArray(t) ? t.forEach(o) : o(t), s;
  }
  clear(t) {
    const r = Object.keys(this);
    let n = r.length, s = !1;
    for (; n--; ) {
      const o = r[n];
      (!t || dn(this, this[o], o, t, !0)) && (delete this[o], s = !0);
    }
    return s;
  }
  normalize(t) {
    const r = this, n = {};
    return I.forEach(this, (s, o) => {
      const a = I.findKey(n, o);
      if (a) {
        r[a] = Ar(s), delete r[o];
        return;
      }
      const u = t ? rf(o) : String(o).trim();
      u !== o && delete r[o], r[u] = Ar(s), n[u] = !0;
    }), this;
  }
  concat(...t) {
    return this.constructor.concat(this, ...t);
  }
  toJSON(t) {
    const r = /* @__PURE__ */ Object.create(null);
    return I.forEach(this, (n, s) => {
      n != null && n !== !1 && (r[s] = t && I.isArray(n) ? n.join(", ") : n);
    }), r;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([t, r]) => t + ": " + r).join(`
`);
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(t) {
    return t instanceof this ? t : new this(t);
  }
  static concat(t, ...r) {
    const n = new this(t);
    return r.forEach((s) => n.set(s)), n;
  }
  static accessor(t) {
    const n = (this[oo] = this[oo] = {
      accessors: {}
    }).accessors, s = this.prototype;
    function o(a) {
      const u = xt(a);
      n[u] || (nf(s, a), n[u] = !0);
    }
    return I.isArray(t) ? t.forEach(o) : o(t), this;
  }
}
Zr.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
I.freezeMethods(Zr.prototype);
I.freezeMethods(Zr);
const Xe = Zr;
function fn(e, t) {
  const r = this || hs, n = t || r, s = Xe.from(n.headers);
  let o = n.data;
  return I.forEach(e, function(u) {
    o = u.call(r, o, s.normalize(), t ? t.status : void 0);
  }), s.normalize(), o;
}
function _a(e) {
  return !!(e && e.__CANCEL__);
}
function pr(e, t, r) {
  te.call(this, e ?? "canceled", te.ERR_CANCELED, t, r), this.name = "CanceledError";
}
I.inherits(pr, te, {
  __CANCEL__: !0
});
function sf(e, t, r) {
  const n = r.config.validateStatus;
  !r.status || !n || n(r.status) ? e(r) : t(new te(
    "Request failed with status code " + r.status,
    [te.ERR_BAD_REQUEST, te.ERR_BAD_RESPONSE][Math.floor(r.status / 100) - 4],
    r.config,
    r.request,
    r
  ));
}
const of = Be.isStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  function() {
    return {
      write: function(r, n, s, o, a, u) {
        const p = [];
        p.push(r + "=" + encodeURIComponent(n)), I.isNumber(s) && p.push("expires=" + new Date(s).toGMTString()), I.isString(o) && p.push("path=" + o), I.isString(a) && p.push("domain=" + a), u === !0 && p.push("secure"), document.cookie = p.join("; ");
      },
      read: function(r) {
        const n = document.cookie.match(new RegExp("(^|;\\s*)(" + r + ")=([^;]*)"));
        return n ? decodeURIComponent(n[3]) : null;
      },
      remove: function(r) {
        this.write(r, "", Date.now() - 864e5);
      }
    };
  }()
) : (
  // Non standard browser env (web workers, react-native) lack needed support.
  function() {
    return {
      write: function() {
      },
      read: function() {
        return null;
      },
      remove: function() {
      }
    };
  }()
);
function af(e) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
}
function cf(e, t) {
  return t ? e.replace(/\/+$/, "") + "/" + t.replace(/^\/+/, "") : e;
}
function wa(e, t) {
  return e && !af(t) ? cf(e, t) : t;
}
const uf = Be.isStandardBrowserEnv ? (
  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  function() {
    const t = /(msie|trident)/i.test(navigator.userAgent), r = document.createElement("a");
    let n;
    function s(o) {
      let a = o;
      return t && (r.setAttribute("href", a), a = r.href), r.setAttribute("href", a), {
        href: r.href,
        protocol: r.protocol ? r.protocol.replace(/:$/, "") : "",
        host: r.host,
        search: r.search ? r.search.replace(/^\?/, "") : "",
        hash: r.hash ? r.hash.replace(/^#/, "") : "",
        hostname: r.hostname,
        port: r.port,
        pathname: r.pathname.charAt(0) === "/" ? r.pathname : "/" + r.pathname
      };
    }
    return n = s(window.location.href), function(a) {
      const u = I.isString(a) ? s(a) : a;
      return u.protocol === n.protocol && u.host === n.host;
    };
  }()
) : (
  // Non standard browser envs (web workers, react-native) lack needed support.
  function() {
    return function() {
      return !0;
    };
  }()
);
function lf(e) {
  const t = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e);
  return t && t[1] || "";
}
function df(e, t) {
  e = e || 10;
  const r = new Array(e), n = new Array(e);
  let s = 0, o = 0, a;
  return t = t !== void 0 ? t : 1e3, function(p) {
    const c = Date.now(), i = n[o];
    a || (a = c), r[s] = p, n[s] = c;
    let d = o, w = 0;
    for (; d !== s; )
      w += r[d++], d = d % e;
    if (s = (s + 1) % e, s === o && (o = (o + 1) % e), c - a < t)
      return;
    const b = i && c - i;
    return b ? Math.round(w * 1e3 / b) : void 0;
  };
}
function ao(e, t) {
  let r = 0;
  const n = df(50, 250);
  return (s) => {
    const o = s.loaded, a = s.lengthComputable ? s.total : void 0, u = o - r, p = n(u), c = o <= a;
    r = o;
    const i = {
      loaded: o,
      total: a,
      progress: a ? o / a : void 0,
      bytes: u,
      rate: p || void 0,
      estimated: p && a && c ? (a - o) / p : void 0,
      event: s
    };
    i[t ? "download" : "upload"] = !0, e(i);
  };
}
const ff = typeof XMLHttpRequest < "u", pf = ff && function(e) {
  return new Promise(function(r, n) {
    let s = e.data;
    const o = Xe.from(e.headers).normalize(), a = e.responseType;
    let u;
    function p() {
      e.cancelToken && e.cancelToken.unsubscribe(u), e.signal && e.signal.removeEventListener("abort", u);
    }
    I.isFormData(s) && (Be.isStandardBrowserEnv || Be.isStandardBrowserWebWorkerEnv) && o.setContentType(!1);
    let c = new XMLHttpRequest();
    if (e.auth) {
      const b = e.auth.username || "", h = e.auth.password ? unescape(encodeURIComponent(e.auth.password)) : "";
      o.set("Authorization", "Basic " + btoa(b + ":" + h));
    }
    const i = wa(e.baseURL, e.url);
    c.open(e.method.toUpperCase(), ga(i, e.params, e.paramsSerializer), !0), c.timeout = e.timeout;
    function d() {
      if (!c)
        return;
      const b = Xe.from(
        "getAllResponseHeaders" in c && c.getAllResponseHeaders()
      ), y = {
        data: !a || a === "text" || a === "json" ? c.responseText : c.response,
        status: c.status,
        statusText: c.statusText,
        headers: b,
        config: e,
        request: c
      };
      sf(function(m) {
        r(m), p();
      }, function(m) {
        n(m), p();
      }, y), c = null;
    }
    if ("onloadend" in c ? c.onloadend = d : c.onreadystatechange = function() {
      !c || c.readyState !== 4 || c.status === 0 && !(c.responseURL && c.responseURL.indexOf("file:") === 0) || setTimeout(d);
    }, c.onabort = function() {
      c && (n(new te("Request aborted", te.ECONNABORTED, e, c)), c = null);
    }, c.onerror = function() {
      n(new te("Network Error", te.ERR_NETWORK, e, c)), c = null;
    }, c.ontimeout = function() {
      let h = e.timeout ? "timeout of " + e.timeout + "ms exceeded" : "timeout exceeded";
      const y = e.transitional || va;
      e.timeoutErrorMessage && (h = e.timeoutErrorMessage), n(new te(
        h,
        y.clarifyTimeoutError ? te.ETIMEDOUT : te.ECONNABORTED,
        e,
        c
      )), c = null;
    }, Be.isStandardBrowserEnv) {
      const b = (e.withCredentials || uf(i)) && e.xsrfCookieName && of.read(e.xsrfCookieName);
      b && o.set(e.xsrfHeaderName, b);
    }
    s === void 0 && o.setContentType(null), "setRequestHeader" in c && I.forEach(o.toJSON(), function(h, y) {
      c.setRequestHeader(y, h);
    }), I.isUndefined(e.withCredentials) || (c.withCredentials = !!e.withCredentials), a && a !== "json" && (c.responseType = e.responseType), typeof e.onDownloadProgress == "function" && c.addEventListener("progress", ao(e.onDownloadProgress, !0)), typeof e.onUploadProgress == "function" && c.upload && c.upload.addEventListener("progress", ao(e.onUploadProgress)), (e.cancelToken || e.signal) && (u = (b) => {
      c && (n(!b || b.type ? new pr(null, e, c) : b), c.abort(), c = null);
    }, e.cancelToken && e.cancelToken.subscribe(u), e.signal && (e.signal.aborted ? u() : e.signal.addEventListener("abort", u)));
    const w = lf(i);
    if (w && Be.protocols.indexOf(w) === -1) {
      n(new te("Unsupported protocol " + w + ":", te.ERR_BAD_REQUEST, e));
      return;
    }
    c.send(s || null);
  });
}, jr = {
  http: Fd,
  xhr: pf
};
I.forEach(jr, (e, t) => {
  if (e) {
    try {
      Object.defineProperty(e, "name", { value: t });
    } catch {
    }
    Object.defineProperty(e, "adapterName", { value: t });
  }
});
const hf = {
  getAdapter: (e) => {
    e = I.isArray(e) ? e : [e];
    const { length: t } = e;
    let r, n;
    for (let s = 0; s < t && (r = e[s], !(n = I.isString(r) ? jr[r.toLowerCase()] : r)); s++)
      ;
    if (!n)
      throw n === !1 ? new te(
        `Adapter ${r} is not supported by the environment`,
        "ERR_NOT_SUPPORT"
      ) : new Error(
        I.hasOwnProp(jr, r) ? `Adapter '${r}' is not available in the build` : `Unknown adapter '${r}'`
      );
    if (!I.isFunction(n))
      throw new TypeError("adapter is not a function");
    return n;
  },
  adapters: jr
};
function pn(e) {
  if (e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted)
    throw new pr(null, e);
}
function io(e) {
  return pn(e), e.headers = Xe.from(e.headers), e.data = fn.call(
    e,
    e.transformRequest
  ), ["post", "put", "patch"].indexOf(e.method) !== -1 && e.headers.setContentType("application/x-www-form-urlencoded", !1), hf.getAdapter(e.adapter || hs.adapter)(e).then(function(n) {
    return pn(e), n.data = fn.call(
      e,
      e.transformResponse,
      n
    ), n.headers = Xe.from(n.headers), n;
  }, function(n) {
    return _a(n) || (pn(e), n && n.response && (n.response.data = fn.call(
      e,
      e.transformResponse,
      n.response
    ), n.response.headers = Xe.from(n.response.headers))), Promise.reject(n);
  });
}
const co = (e) => e instanceof Xe ? e.toJSON() : e;
function jt(e, t) {
  t = t || {};
  const r = {};
  function n(c, i, d) {
    return I.isPlainObject(c) && I.isPlainObject(i) ? I.merge.call({ caseless: d }, c, i) : I.isPlainObject(i) ? I.merge({}, i) : I.isArray(i) ? i.slice() : i;
  }
  function s(c, i, d) {
    if (I.isUndefined(i)) {
      if (!I.isUndefined(c))
        return n(void 0, c, d);
    } else
      return n(c, i, d);
  }
  function o(c, i) {
    if (!I.isUndefined(i))
      return n(void 0, i);
  }
  function a(c, i) {
    if (I.isUndefined(i)) {
      if (!I.isUndefined(c))
        return n(void 0, c);
    } else
      return n(void 0, i);
  }
  function u(c, i, d) {
    if (d in t)
      return n(c, i);
    if (d in e)
      return n(void 0, c);
  }
  const p = {
    url: o,
    method: o,
    data: o,
    baseURL: a,
    transformRequest: a,
    transformResponse: a,
    paramsSerializer: a,
    timeout: a,
    timeoutMessage: a,
    withCredentials: a,
    adapter: a,
    responseType: a,
    xsrfCookieName: a,
    xsrfHeaderName: a,
    onUploadProgress: a,
    onDownloadProgress: a,
    decompress: a,
    maxContentLength: a,
    maxBodyLength: a,
    beforeRedirect: a,
    transport: a,
    httpAgent: a,
    httpsAgent: a,
    cancelToken: a,
    socketPath: a,
    responseEncoding: a,
    validateStatus: u,
    headers: (c, i) => s(co(c), co(i), !0)
  };
  return I.forEach(Object.keys(e).concat(Object.keys(t)), function(i) {
    const d = p[i] || s, w = d(e[i], t[i], i);
    I.isUndefined(w) && d !== u || (r[i] = w);
  }), r;
}
const ba = "1.3.6", ms = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((e, t) => {
  ms[e] = function(n) {
    return typeof n === e || "a" + (t < 1 ? "n " : " ") + e;
  };
});
const uo = {};
ms.transitional = function(t, r, n) {
  function s(o, a) {
    return "[Axios v" + ba + "] Transitional option '" + o + "'" + a + (n ? ". " + n : "");
  }
  return (o, a, u) => {
    if (t === !1)
      throw new te(
        s(a, " has been removed" + (r ? " in " + r : "")),
        te.ERR_DEPRECATED
      );
    return r && !uo[a] && (uo[a] = !0, console.warn(
      s(
        a,
        " has been deprecated since v" + r + " and will be removed in the near future"
      )
    )), t ? t(o, a, u) : !0;
  };
};
function mf(e, t, r) {
  if (typeof e != "object")
    throw new te("options must be an object", te.ERR_BAD_OPTION_VALUE);
  const n = Object.keys(e);
  let s = n.length;
  for (; s-- > 0; ) {
    const o = n[s], a = t[o];
    if (a) {
      const u = e[o], p = u === void 0 || a(u, o, e);
      if (p !== !0)
        throw new te("option " + o + " must be " + p, te.ERR_BAD_OPTION_VALUE);
      continue;
    }
    if (r !== !0)
      throw new te("Unknown option " + o, te.ERR_BAD_OPTION);
  }
}
const En = {
  assertOptions: mf,
  validators: ms
}, rt = En.validators;
class Hr {
  constructor(t) {
    this.defaults = t, this.interceptors = {
      request: new so(),
      response: new so()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  request(t, r) {
    typeof t == "string" ? (r = r || {}, r.url = t) : r = t || {}, r = jt(this.defaults, r);
    const { transitional: n, paramsSerializer: s, headers: o } = r;
    n !== void 0 && En.assertOptions(n, {
      silentJSONParsing: rt.transitional(rt.boolean),
      forcedJSONParsing: rt.transitional(rt.boolean),
      clarifyTimeoutError: rt.transitional(rt.boolean)
    }, !1), s != null && (I.isFunction(s) ? r.paramsSerializer = {
      serialize: s
    } : En.assertOptions(s, {
      encode: rt.function,
      serialize: rt.function
    }, !0)), r.method = (r.method || this.defaults.method || "get").toLowerCase();
    let a;
    a = o && I.merge(
      o.common,
      o[r.method]
    ), a && I.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (h) => {
        delete o[h];
      }
    ), r.headers = Xe.concat(a, o);
    const u = [];
    let p = !0;
    this.interceptors.request.forEach(function(y) {
      typeof y.runWhen == "function" && y.runWhen(r) === !1 || (p = p && y.synchronous, u.unshift(y.fulfilled, y.rejected));
    });
    const c = [];
    this.interceptors.response.forEach(function(y) {
      c.push(y.fulfilled, y.rejected);
    });
    let i, d = 0, w;
    if (!p) {
      const h = [io.bind(this), void 0];
      for (h.unshift.apply(h, u), h.push.apply(h, c), w = h.length, i = Promise.resolve(r); d < w; )
        i = i.then(h[d++], h[d++]);
      return i;
    }
    w = u.length;
    let b = r;
    for (d = 0; d < w; ) {
      const h = u[d++], y = u[d++];
      try {
        b = h(b);
      } catch (_) {
        y.call(this, _);
        break;
      }
    }
    try {
      i = io.call(this, b);
    } catch (h) {
      return Promise.reject(h);
    }
    for (d = 0, w = c.length; d < w; )
      i = i.then(c[d++], c[d++]);
    return i;
  }
  getUri(t) {
    t = jt(this.defaults, t);
    const r = wa(t.baseURL, t.url);
    return ga(r, t.params, t.paramsSerializer);
  }
}
I.forEach(["delete", "get", "head", "options"], function(t) {
  Hr.prototype[t] = function(r, n) {
    return this.request(jt(n || {}, {
      method: t,
      url: r,
      data: (n || {}).data
    }));
  };
});
I.forEach(["post", "put", "patch"], function(t) {
  function r(n) {
    return function(o, a, u) {
      return this.request(jt(u || {}, {
        method: t,
        headers: n ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url: o,
        data: a
      }));
    };
  }
  Hr.prototype[t] = r(), Hr.prototype[t + "Form"] = r(!0);
});
const Ir = Hr;
class ys {
  constructor(t) {
    if (typeof t != "function")
      throw new TypeError("executor must be a function.");
    let r;
    this.promise = new Promise(function(o) {
      r = o;
    });
    const n = this;
    this.promise.then((s) => {
      if (!n._listeners)
        return;
      let o = n._listeners.length;
      for (; o-- > 0; )
        n._listeners[o](s);
      n._listeners = null;
    }), this.promise.then = (s) => {
      let o;
      const a = new Promise((u) => {
        n.subscribe(u), o = u;
      }).then(s);
      return a.cancel = function() {
        n.unsubscribe(o);
      }, a;
    }, t(function(o, a, u) {
      n.reason || (n.reason = new pr(o, a, u), r(n.reason));
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason)
      throw this.reason;
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(t) {
    if (this.reason) {
      t(this.reason);
      return;
    }
    this._listeners ? this._listeners.push(t) : this._listeners = [t];
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(t) {
    if (!this._listeners)
      return;
    const r = this._listeners.indexOf(t);
    r !== -1 && this._listeners.splice(r, 1);
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let t;
    return {
      token: new ys(function(s) {
        t = s;
      }),
      cancel: t
    };
  }
}
const yf = ys;
function gf(e) {
  return function(r) {
    return e.apply(null, r);
  };
}
function vf(e) {
  return I.isObject(e) && e.isAxiosError === !0;
}
const Sn = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511
};
Object.entries(Sn).forEach(([e, t]) => {
  Sn[t] = e;
});
const $f = Sn;
function Ea(e) {
  const t = new Ir(e), r = oa(Ir.prototype.request, t);
  return I.extend(r, Ir.prototype, t, { allOwnKeys: !0 }), I.extend(r, t, null, { allOwnKeys: !0 }), r.create = function(s) {
    return Ea(jt(e, s));
  }, r;
}
const ye = Ea(hs);
ye.Axios = Ir;
ye.CanceledError = pr;
ye.CancelToken = yf;
ye.isCancel = _a;
ye.VERSION = ba;
ye.toFormData = Yr;
ye.AxiosError = te;
ye.Cancel = ye.CanceledError;
ye.all = function(t) {
  return Promise.all(t);
};
ye.spread = gf;
ye.isAxiosError = vf;
ye.mergeConfig = jt;
ye.AxiosHeaders = Xe;
ye.formToJSON = (e) => $a(I.isHTMLForm(e) ? new FormData(e) : e);
ye.HttpStatusCode = $f;
ye.default = ye;
const Sa = ye;
Sa.interceptors.request.use(function(e) {
  return e.url += "?dev=1", e;
}, function(e) {
  return Promise.reject(e);
});
function bf(e) {
  function t(r, n) {
    const s = Yo(n), o = me.dirname(s);
    return r.basePath = o, r.id = s, r;
  }
  return {
    name: "transform-world",
    transform(r, n) {
      if (n.endsWith(".world")) {
        const s = t(JSON.parse(r), n);
        return {
          code: `export default ${JSON.stringify(s)}`,
          map: null
        };
      }
    },
    configureServer(r) {
      r.watcher.add(Xl()), r.watcher.on("change", async (n) => {
        if (n.endsWith("world")) {
          Gl(`File ${n} changed, updating world...`);
          const s = _e.readFileSync(n, "utf-8"), o = t(JSON.parse(s), n);
          Sa.put(e + "/api/worlds", {
            worldId: o.id,
            data: o
          }).catch(Wl);
        }
      });
    }
  };
}
export {
  _f as autoLoad,
  wf as flagTransform,
  bf as worldTransformPlugin
};
