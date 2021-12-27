
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.wholeText !== data)
            text.data = data;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var page = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
    	module.exports = factory() ;
    }(commonjsGlobal, (function () {
    var isarray = Array.isArray || function (arr) {
      return Object.prototype.toString.call(arr) == '[object Array]';
    };

    /**
     * Expose `pathToRegexp`.
     */
    var pathToRegexp_1 = pathToRegexp;
    var parse_1 = parse;
    var compile_1 = compile;
    var tokensToFunction_1 = tokensToFunction;
    var tokensToRegExp_1 = tokensToRegExp;

    /**
     * The main path matching regexp utility.
     *
     * @type {RegExp}
     */
    var PATH_REGEXP = new RegExp([
      // Match escaped characters that would otherwise appear in future matches.
      // This allows the user to escape special characters that won't transform.
      '(\\\\.)',
      // Match Express-style parameters and un-named parameters with a prefix
      // and optional suffixes. Matches appear as:
      //
      // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
      // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
      // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
      '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'
    ].join('|'), 'g');

    /**
     * Parse a string for the raw tokens.
     *
     * @param  {String} str
     * @return {Array}
     */
    function parse (str) {
      var tokens = [];
      var key = 0;
      var index = 0;
      var path = '';
      var res;

      while ((res = PATH_REGEXP.exec(str)) != null) {
        var m = res[0];
        var escaped = res[1];
        var offset = res.index;
        path += str.slice(index, offset);
        index = offset + m.length;

        // Ignore already escaped sequences.
        if (escaped) {
          path += escaped[1];
          continue
        }

        // Push the current path onto the tokens.
        if (path) {
          tokens.push(path);
          path = '';
        }

        var prefix = res[2];
        var name = res[3];
        var capture = res[4];
        var group = res[5];
        var suffix = res[6];
        var asterisk = res[7];

        var repeat = suffix === '+' || suffix === '*';
        var optional = suffix === '?' || suffix === '*';
        var delimiter = prefix || '/';
        var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?');

        tokens.push({
          name: name || key++,
          prefix: prefix || '',
          delimiter: delimiter,
          optional: optional,
          repeat: repeat,
          pattern: escapeGroup(pattern)
        });
      }

      // Match any characters still remaining.
      if (index < str.length) {
        path += str.substr(index);
      }

      // If the path exists, push it onto the end.
      if (path) {
        tokens.push(path);
      }

      return tokens
    }

    /**
     * Compile a string to a template function for the path.
     *
     * @param  {String}   str
     * @return {Function}
     */
    function compile (str) {
      return tokensToFunction(parse(str))
    }

    /**
     * Expose a method for transforming tokens into the path function.
     */
    function tokensToFunction (tokens) {
      // Compile all the tokens into regexps.
      var matches = new Array(tokens.length);

      // Compile all the patterns before compilation.
      for (var i = 0; i < tokens.length; i++) {
        if (typeof tokens[i] === 'object') {
          matches[i] = new RegExp('^' + tokens[i].pattern + '$');
        }
      }

      return function (obj) {
        var path = '';
        var data = obj || {};

        for (var i = 0; i < tokens.length; i++) {
          var token = tokens[i];

          if (typeof token === 'string') {
            path += token;

            continue
          }

          var value = data[token.name];
          var segment;

          if (value == null) {
            if (token.optional) {
              continue
            } else {
              throw new TypeError('Expected "' + token.name + '" to be defined')
            }
          }

          if (isarray(value)) {
            if (!token.repeat) {
              throw new TypeError('Expected "' + token.name + '" to not repeat, but received "' + value + '"')
            }

            if (value.length === 0) {
              if (token.optional) {
                continue
              } else {
                throw new TypeError('Expected "' + token.name + '" to not be empty')
              }
            }

            for (var j = 0; j < value.length; j++) {
              segment = encodeURIComponent(value[j]);

              if (!matches[i].test(segment)) {
                throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
              }

              path += (j === 0 ? token.prefix : token.delimiter) + segment;
            }

            continue
          }

          segment = encodeURIComponent(value);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
          }

          path += token.prefix + segment;
        }

        return path
      }
    }

    /**
     * Escape a regular expression string.
     *
     * @param  {String} str
     * @return {String}
     */
    function escapeString (str) {
      return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1')
    }

    /**
     * Escape the capturing group by escaping special characters and meaning.
     *
     * @param  {String} group
     * @return {String}
     */
    function escapeGroup (group) {
      return group.replace(/([=!:$\/()])/g, '\\$1')
    }

    /**
     * Attach the keys as a property of the regexp.
     *
     * @param  {RegExp} re
     * @param  {Array}  keys
     * @return {RegExp}
     */
    function attachKeys (re, keys) {
      re.keys = keys;
      return re
    }

    /**
     * Get the flags for a regexp from the options.
     *
     * @param  {Object} options
     * @return {String}
     */
    function flags (options) {
      return options.sensitive ? '' : 'i'
    }

    /**
     * Pull out keys from a regexp.
     *
     * @param  {RegExp} path
     * @param  {Array}  keys
     * @return {RegExp}
     */
    function regexpToRegexp (path, keys) {
      // Use a negative lookahead to match only capturing groups.
      var groups = path.source.match(/\((?!\?)/g);

      if (groups) {
        for (var i = 0; i < groups.length; i++) {
          keys.push({
            name: i,
            prefix: null,
            delimiter: null,
            optional: false,
            repeat: false,
            pattern: null
          });
        }
      }

      return attachKeys(path, keys)
    }

    /**
     * Transform an array into a regexp.
     *
     * @param  {Array}  path
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function arrayToRegexp (path, keys, options) {
      var parts = [];

      for (var i = 0; i < path.length; i++) {
        parts.push(pathToRegexp(path[i], keys, options).source);
      }

      var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

      return attachKeys(regexp, keys)
    }

    /**
     * Create a path regexp from string input.
     *
     * @param  {String} path
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function stringToRegexp (path, keys, options) {
      var tokens = parse(path);
      var re = tokensToRegExp(tokens, options);

      // Attach keys back to the regexp.
      for (var i = 0; i < tokens.length; i++) {
        if (typeof tokens[i] !== 'string') {
          keys.push(tokens[i]);
        }
      }

      return attachKeys(re, keys)
    }

    /**
     * Expose a function for taking tokens and returning a RegExp.
     *
     * @param  {Array}  tokens
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function tokensToRegExp (tokens, options) {
      options = options || {};

      var strict = options.strict;
      var end = options.end !== false;
      var route = '';
      var lastToken = tokens[tokens.length - 1];
      var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken);

      // Iterate over the tokens and create our regexp string.
      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        if (typeof token === 'string') {
          route += escapeString(token);
        } else {
          var prefix = escapeString(token.prefix);
          var capture = token.pattern;

          if (token.repeat) {
            capture += '(?:' + prefix + capture + ')*';
          }

          if (token.optional) {
            if (prefix) {
              capture = '(?:' + prefix + '(' + capture + '))?';
            } else {
              capture = '(' + capture + ')?';
            }
          } else {
            capture = prefix + '(' + capture + ')';
          }

          route += capture;
        }
      }

      // In non-strict mode we allow a slash at the end of match. If the path to
      // match already ends with a slash, we remove it for consistency. The slash
      // is valid at the end of a path match, not in the middle. This is important
      // in non-ending mode, where "/test/" shouldn't match "/test//route".
      if (!strict) {
        route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
      }

      if (end) {
        route += '$';
      } else {
        // In non-ending mode, we need the capturing groups to match as much as
        // possible by using a positive lookahead to the end or next path segment.
        route += strict && endsWithSlash ? '' : '(?=\\/|$)';
      }

      return new RegExp('^' + route, flags(options))
    }

    /**
     * Normalize the given path string, returning a regular expression.
     *
     * An empty array can be passed in for the keys, which will hold the
     * placeholder key descriptions. For example, using `/user/:id`, `keys` will
     * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
     *
     * @param  {(String|RegExp|Array)} path
     * @param  {Array}                 [keys]
     * @param  {Object}                [options]
     * @return {RegExp}
     */
    function pathToRegexp (path, keys, options) {
      keys = keys || [];

      if (!isarray(keys)) {
        options = keys;
        keys = [];
      } else if (!options) {
        options = {};
      }

      if (path instanceof RegExp) {
        return regexpToRegexp(path, keys)
      }

      if (isarray(path)) {
        return arrayToRegexp(path, keys, options)
      }

      return stringToRegexp(path, keys, options)
    }

    pathToRegexp_1.parse = parse_1;
    pathToRegexp_1.compile = compile_1;
    pathToRegexp_1.tokensToFunction = tokensToFunction_1;
    pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

    /**
       * Module dependencies.
       */

      

      /**
       * Short-cuts for global-object checks
       */

      var hasDocument = ('undefined' !== typeof document);
      var hasWindow = ('undefined' !== typeof window);
      var hasHistory = ('undefined' !== typeof history);
      var hasProcess = typeof process !== 'undefined';

      /**
       * Detect click event
       */
      var clickEvent = hasDocument && document.ontouchstart ? 'touchstart' : 'click';

      /**
       * To work properly with the URL
       * history.location generated polyfill in https://github.com/devote/HTML5-History-API
       */

      var isLocation = hasWindow && !!(window.history.location || window.location);

      /**
       * The page instance
       * @api private
       */
      function Page() {
        // public things
        this.callbacks = [];
        this.exits = [];
        this.current = '';
        this.len = 0;

        // private things
        this._decodeURLComponents = true;
        this._base = '';
        this._strict = false;
        this._running = false;
        this._hashbang = false;

        // bound functions
        this.clickHandler = this.clickHandler.bind(this);
        this._onpopstate = this._onpopstate.bind(this);
      }

      /**
       * Configure the instance of page. This can be called multiple times.
       *
       * @param {Object} options
       * @api public
       */

      Page.prototype.configure = function(options) {
        var opts = options || {};

        this._window = opts.window || (hasWindow && window);
        this._decodeURLComponents = opts.decodeURLComponents !== false;
        this._popstate = opts.popstate !== false && hasWindow;
        this._click = opts.click !== false && hasDocument;
        this._hashbang = !!opts.hashbang;

        var _window = this._window;
        if(this._popstate) {
          _window.addEventListener('popstate', this._onpopstate, false);
        } else if(hasWindow) {
          _window.removeEventListener('popstate', this._onpopstate, false);
        }

        if (this._click) {
          _window.document.addEventListener(clickEvent, this.clickHandler, false);
        } else if(hasDocument) {
          _window.document.removeEventListener(clickEvent, this.clickHandler, false);
        }

        if(this._hashbang && hasWindow && !hasHistory) {
          _window.addEventListener('hashchange', this._onpopstate, false);
        } else if(hasWindow) {
          _window.removeEventListener('hashchange', this._onpopstate, false);
        }
      };

      /**
       * Get or set basepath to `path`.
       *
       * @param {string} path
       * @api public
       */

      Page.prototype.base = function(path) {
        if (0 === arguments.length) return this._base;
        this._base = path;
      };

      /**
       * Gets the `base`, which depends on whether we are using History or
       * hashbang routing.

       * @api private
       */
      Page.prototype._getBase = function() {
        var base = this._base;
        if(!!base) return base;
        var loc = hasWindow && this._window && this._window.location;

        if(hasWindow && this._hashbang && loc && loc.protocol === 'file:') {
          base = loc.pathname;
        }

        return base;
      };

      /**
       * Get or set strict path matching to `enable`
       *
       * @param {boolean} enable
       * @api public
       */

      Page.prototype.strict = function(enable) {
        if (0 === arguments.length) return this._strict;
        this._strict = enable;
      };


      /**
       * Bind with the given `options`.
       *
       * Options:
       *
       *    - `click` bind to click events [true]
       *    - `popstate` bind to popstate [true]
       *    - `dispatch` perform initial dispatch [true]
       *
       * @param {Object} options
       * @api public
       */

      Page.prototype.start = function(options) {
        var opts = options || {};
        this.configure(opts);

        if (false === opts.dispatch) return;
        this._running = true;

        var url;
        if(isLocation) {
          var window = this._window;
          var loc = window.location;

          if(this._hashbang && ~loc.hash.indexOf('#!')) {
            url = loc.hash.substr(2) + loc.search;
          } else if (this._hashbang) {
            url = loc.search + loc.hash;
          } else {
            url = loc.pathname + loc.search + loc.hash;
          }
        }

        this.replace(url, null, true, opts.dispatch);
      };

      /**
       * Unbind click and popstate event handlers.
       *
       * @api public
       */

      Page.prototype.stop = function() {
        if (!this._running) return;
        this.current = '';
        this.len = 0;
        this._running = false;

        var window = this._window;
        this._click && window.document.removeEventListener(clickEvent, this.clickHandler, false);
        hasWindow && window.removeEventListener('popstate', this._onpopstate, false);
        hasWindow && window.removeEventListener('hashchange', this._onpopstate, false);
      };

      /**
       * Show `path` with optional `state` object.
       *
       * @param {string} path
       * @param {Object=} state
       * @param {boolean=} dispatch
       * @param {boolean=} push
       * @return {!Context}
       * @api public
       */

      Page.prototype.show = function(path, state, dispatch, push) {
        var ctx = new Context(path, state, this),
          prev = this.prevContext;
        this.prevContext = ctx;
        this.current = ctx.path;
        if (false !== dispatch) this.dispatch(ctx, prev);
        if (false !== ctx.handled && false !== push) ctx.pushState();
        return ctx;
      };

      /**
       * Goes back in the history
       * Back should always let the current route push state and then go back.
       *
       * @param {string} path - fallback path to go back if no more history exists, if undefined defaults to page.base
       * @param {Object=} state
       * @api public
       */

      Page.prototype.back = function(path, state) {
        var page = this;
        if (this.len > 0) {
          var window = this._window;
          // this may need more testing to see if all browsers
          // wait for the next tick to go back in history
          hasHistory && window.history.back();
          this.len--;
        } else if (path) {
          setTimeout(function() {
            page.show(path, state);
          });
        } else {
          setTimeout(function() {
            page.show(page._getBase(), state);
          });
        }
      };

      /**
       * Register route to redirect from one path to other
       * or just redirect to another route
       *
       * @param {string} from - if param 'to' is undefined redirects to 'from'
       * @param {string=} to
       * @api public
       */
      Page.prototype.redirect = function(from, to) {
        var inst = this;

        // Define route from a path to another
        if ('string' === typeof from && 'string' === typeof to) {
          page.call(this, from, function(e) {
            setTimeout(function() {
              inst.replace(/** @type {!string} */ (to));
            }, 0);
          });
        }

        // Wait for the push state and replace it with another
        if ('string' === typeof from && 'undefined' === typeof to) {
          setTimeout(function() {
            inst.replace(from);
          }, 0);
        }
      };

      /**
       * Replace `path` with optional `state` object.
       *
       * @param {string} path
       * @param {Object=} state
       * @param {boolean=} init
       * @param {boolean=} dispatch
       * @return {!Context}
       * @api public
       */


      Page.prototype.replace = function(path, state, init, dispatch) {
        var ctx = new Context(path, state, this),
          prev = this.prevContext;
        this.prevContext = ctx;
        this.current = ctx.path;
        ctx.init = init;
        ctx.save(); // save before dispatching, which may redirect
        if (false !== dispatch) this.dispatch(ctx, prev);
        return ctx;
      };

      /**
       * Dispatch the given `ctx`.
       *
       * @param {Context} ctx
       * @api private
       */

      Page.prototype.dispatch = function(ctx, prev) {
        var i = 0, j = 0, page = this;

        function nextExit() {
          var fn = page.exits[j++];
          if (!fn) return nextEnter();
          fn(prev, nextExit);
        }

        function nextEnter() {
          var fn = page.callbacks[i++];

          if (ctx.path !== page.current) {
            ctx.handled = false;
            return;
          }
          if (!fn) return unhandled.call(page, ctx);
          fn(ctx, nextEnter);
        }

        if (prev) {
          nextExit();
        } else {
          nextEnter();
        }
      };

      /**
       * Register an exit route on `path` with
       * callback `fn()`, which will be called
       * on the previous context when a new
       * page is visited.
       */
      Page.prototype.exit = function(path, fn) {
        if (typeof path === 'function') {
          return this.exit('*', path);
        }

        var route = new Route(path, null, this);
        for (var i = 1; i < arguments.length; ++i) {
          this.exits.push(route.middleware(arguments[i]));
        }
      };

      /**
       * Handle "click" events.
       */

      /* jshint +W054 */
      Page.prototype.clickHandler = function(e) {
        if (1 !== this._which(e)) return;

        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        if (e.defaultPrevented) return;

        // ensure link
        // use shadow dom when available if not, fall back to composedPath()
        // for browsers that only have shady
        var el = e.target;
        var eventPath = e.path || (e.composedPath ? e.composedPath() : null);

        if(eventPath) {
          for (var i = 0; i < eventPath.length; i++) {
            if (!eventPath[i].nodeName) continue;
            if (eventPath[i].nodeName.toUpperCase() !== 'A') continue;
            if (!eventPath[i].href) continue;

            el = eventPath[i];
            break;
          }
        }

        // continue ensure link
        // el.nodeName for svg links are 'a' instead of 'A'
        while (el && 'A' !== el.nodeName.toUpperCase()) el = el.parentNode;
        if (!el || 'A' !== el.nodeName.toUpperCase()) return;

        // check if link is inside an svg
        // in this case, both href and target are always inside an object
        var svg = (typeof el.href === 'object') && el.href.constructor.name === 'SVGAnimatedString';

        // Ignore if tag has
        // 1. "download" attribute
        // 2. rel="external" attribute
        if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return;

        // ensure non-hash for the same path
        var link = el.getAttribute('href');
        if(!this._hashbang && this._samePath(el) && (el.hash || '#' === link)) return;

        // Check for mailto: in the href
        if (link && link.indexOf('mailto:') > -1) return;

        // check target
        // svg target is an object and its desired value is in .baseVal property
        if (svg ? el.target.baseVal : el.target) return;

        // x-origin
        // note: svg links that are not relative don't call click events (and skip page.js)
        // consequently, all svg links tested inside page.js are relative and in the same origin
        if (!svg && !this.sameOrigin(el.href)) return;

        // rebuild path
        // There aren't .pathname and .search properties in svg links, so we use href
        // Also, svg href is an object and its desired value is in .baseVal property
        var path = svg ? el.href.baseVal : (el.pathname + el.search + (el.hash || ''));

        path = path[0] !== '/' ? '/' + path : path;

        // strip leading "/[drive letter]:" on NW.js on Windows
        if (hasProcess && path.match(/^\/[a-zA-Z]:\//)) {
          path = path.replace(/^\/[a-zA-Z]:\//, '/');
        }

        // same page
        var orig = path;
        var pageBase = this._getBase();

        if (path.indexOf(pageBase) === 0) {
          path = path.substr(pageBase.length);
        }

        if (this._hashbang) path = path.replace('#!', '');

        if (pageBase && orig === path && (!isLocation || this._window.location.protocol !== 'file:')) {
          return;
        }

        e.preventDefault();
        this.show(orig);
      };

      /**
       * Handle "populate" events.
       * @api private
       */

      Page.prototype._onpopstate = (function () {
        var loaded = false;
        if ( ! hasWindow ) {
          return function () {};
        }
        if (hasDocument && document.readyState === 'complete') {
          loaded = true;
        } else {
          window.addEventListener('load', function() {
            setTimeout(function() {
              loaded = true;
            }, 0);
          });
        }
        return function onpopstate(e) {
          if (!loaded) return;
          var page = this;
          if (e.state) {
            var path = e.state.path;
            page.replace(path, e.state);
          } else if (isLocation) {
            var loc = page._window.location;
            page.show(loc.pathname + loc.search + loc.hash, undefined, undefined, false);
          }
        };
      })();

      /**
       * Event button.
       */
      Page.prototype._which = function(e) {
        e = e || (hasWindow && this._window.event);
        return null == e.which ? e.button : e.which;
      };

      /**
       * Convert to a URL object
       * @api private
       */
      Page.prototype._toURL = function(href) {
        var window = this._window;
        if(typeof URL === 'function' && isLocation) {
          return new URL(href, window.location.toString());
        } else if (hasDocument) {
          var anc = window.document.createElement('a');
          anc.href = href;
          return anc;
        }
      };

      /**
       * Check if `href` is the same origin.
       * @param {string} href
       * @api public
       */
      Page.prototype.sameOrigin = function(href) {
        if(!href || !isLocation) return false;

        var url = this._toURL(href);
        var window = this._window;

        var loc = window.location;

        /*
           When the port is the default http port 80 for http, or 443 for
           https, internet explorer 11 returns an empty string for loc.port,
           so we need to compare loc.port with an empty string if url.port
           is the default port 80 or 443.
           Also the comparition with `port` is changed from `===` to `==` because
           `port` can be a string sometimes. This only applies to ie11.
        */
        return loc.protocol === url.protocol &&
          loc.hostname === url.hostname &&
          (loc.port === url.port || loc.port === '' && (url.port == 80 || url.port == 443)); // jshint ignore:line
      };

      /**
       * @api private
       */
      Page.prototype._samePath = function(url) {
        if(!isLocation) return false;
        var window = this._window;
        var loc = window.location;
        return url.pathname === loc.pathname &&
          url.search === loc.search;
      };

      /**
       * Remove URL encoding from the given `str`.
       * Accommodates whitespace in both x-www-form-urlencoded
       * and regular percent-encoded form.
       *
       * @param {string} val - URL component to decode
       * @api private
       */
      Page.prototype._decodeURLEncodedURIComponent = function(val) {
        if (typeof val !== 'string') { return val; }
        return this._decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
      };

      /**
       * Create a new `page` instance and function
       */
      function createPage() {
        var pageInstance = new Page();

        function pageFn(/* args */) {
          return page.apply(pageInstance, arguments);
        }

        // Copy all of the things over. In 2.0 maybe we use setPrototypeOf
        pageFn.callbacks = pageInstance.callbacks;
        pageFn.exits = pageInstance.exits;
        pageFn.base = pageInstance.base.bind(pageInstance);
        pageFn.strict = pageInstance.strict.bind(pageInstance);
        pageFn.start = pageInstance.start.bind(pageInstance);
        pageFn.stop = pageInstance.stop.bind(pageInstance);
        pageFn.show = pageInstance.show.bind(pageInstance);
        pageFn.back = pageInstance.back.bind(pageInstance);
        pageFn.redirect = pageInstance.redirect.bind(pageInstance);
        pageFn.replace = pageInstance.replace.bind(pageInstance);
        pageFn.dispatch = pageInstance.dispatch.bind(pageInstance);
        pageFn.exit = pageInstance.exit.bind(pageInstance);
        pageFn.configure = pageInstance.configure.bind(pageInstance);
        pageFn.sameOrigin = pageInstance.sameOrigin.bind(pageInstance);
        pageFn.clickHandler = pageInstance.clickHandler.bind(pageInstance);

        pageFn.create = createPage;

        Object.defineProperty(pageFn, 'len', {
          get: function(){
            return pageInstance.len;
          },
          set: function(val) {
            pageInstance.len = val;
          }
        });

        Object.defineProperty(pageFn, 'current', {
          get: function(){
            return pageInstance.current;
          },
          set: function(val) {
            pageInstance.current = val;
          }
        });

        // In 2.0 these can be named exports
        pageFn.Context = Context;
        pageFn.Route = Route;

        return pageFn;
      }

      /**
       * Register `path` with callback `fn()`,
       * or route `path`, or redirection,
       * or `page.start()`.
       *
       *   page(fn);
       *   page('*', fn);
       *   page('/user/:id', load, user);
       *   page('/user/' + user.id, { some: 'thing' });
       *   page('/user/' + user.id);
       *   page('/from', '/to')
       *   page();
       *
       * @param {string|!Function|!Object} path
       * @param {Function=} fn
       * @api public
       */

      function page(path, fn) {
        // <callback>
        if ('function' === typeof path) {
          return page.call(this, '*', path);
        }

        // route <path> to <callback ...>
        if ('function' === typeof fn) {
          var route = new Route(/** @type {string} */ (path), null, this);
          for (var i = 1; i < arguments.length; ++i) {
            this.callbacks.push(route.middleware(arguments[i]));
          }
          // show <path> with [state]
        } else if ('string' === typeof path) {
          this['string' === typeof fn ? 'redirect' : 'show'](path, fn);
          // start [options]
        } else {
          this.start(path);
        }
      }

      /**
       * Unhandled `ctx`. When it's not the initial
       * popstate then redirect. If you wish to handle
       * 404s on your own use `page('*', callback)`.
       *
       * @param {Context} ctx
       * @api private
       */
      function unhandled(ctx) {
        if (ctx.handled) return;
        var current;
        var page = this;
        var window = page._window;

        if (page._hashbang) {
          current = isLocation && this._getBase() + window.location.hash.replace('#!', '');
        } else {
          current = isLocation && window.location.pathname + window.location.search;
        }

        if (current === ctx.canonicalPath) return;
        page.stop();
        ctx.handled = false;
        isLocation && (window.location.href = ctx.canonicalPath);
      }

      /**
       * Escapes RegExp characters in the given string.
       *
       * @param {string} s
       * @api private
       */
      function escapeRegExp(s) {
        return s.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
      }

      /**
       * Initialize a new "request" `Context`
       * with the given `path` and optional initial `state`.
       *
       * @constructor
       * @param {string} path
       * @param {Object=} state
       * @api public
       */

      function Context(path, state, pageInstance) {
        var _page = this.page = pageInstance || page;
        var window = _page._window;
        var hashbang = _page._hashbang;

        var pageBase = _page._getBase();
        if ('/' === path[0] && 0 !== path.indexOf(pageBase)) path = pageBase + (hashbang ? '#!' : '') + path;
        var i = path.indexOf('?');

        this.canonicalPath = path;
        var re = new RegExp('^' + escapeRegExp(pageBase));
        this.path = path.replace(re, '') || '/';
        if (hashbang) this.path = this.path.replace('#!', '') || '/';

        this.title = (hasDocument && window.document.title);
        this.state = state || {};
        this.state.path = path;
        this.querystring = ~i ? _page._decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
        this.pathname = _page._decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
        this.params = {};

        // fragment
        this.hash = '';
        if (!hashbang) {
          if (!~this.path.indexOf('#')) return;
          var parts = this.path.split('#');
          this.path = this.pathname = parts[0];
          this.hash = _page._decodeURLEncodedURIComponent(parts[1]) || '';
          this.querystring = this.querystring.split('#')[0];
        }
      }

      /**
       * Push state.
       *
       * @api private
       */

      Context.prototype.pushState = function() {
        var page = this.page;
        var window = page._window;
        var hashbang = page._hashbang;

        page.len++;
        if (hasHistory) {
            window.history.pushState(this.state, this.title,
              hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
        }
      };

      /**
       * Save the context state.
       *
       * @api public
       */

      Context.prototype.save = function() {
        var page = this.page;
        if (hasHistory) {
            page._window.history.replaceState(this.state, this.title,
              page._hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
        }
      };

      /**
       * Initialize `Route` with the given HTTP `path`,
       * and an array of `callbacks` and `options`.
       *
       * Options:
       *
       *   - `sensitive`    enable case-sensitive routes
       *   - `strict`       enable strict matching for trailing slashes
       *
       * @constructor
       * @param {string} path
       * @param {Object=} options
       * @api private
       */

      function Route(path, options, page) {
        var _page = this.page = page || globalPage;
        var opts = options || {};
        opts.strict = opts.strict || _page._strict;
        this.path = (path === '*') ? '(.*)' : path;
        this.method = 'GET';
        this.regexp = pathToRegexp_1(this.path, this.keys = [], opts);
      }

      /**
       * Return route middleware with
       * the given callback `fn()`.
       *
       * @param {Function} fn
       * @return {Function}
       * @api public
       */

      Route.prototype.middleware = function(fn) {
        var self = this;
        return function(ctx, next) {
          if (self.match(ctx.path, ctx.params)) {
            ctx.routePath = self.path;
            return fn(ctx, next);
          }
          next();
        };
      };

      /**
       * Check if this route matches `path`, if so
       * populate `params`.
       *
       * @param {string} path
       * @param {Object} params
       * @return {boolean}
       * @api private
       */

      Route.prototype.match = function(path, params) {
        var keys = this.keys,
          qsIndex = path.indexOf('?'),
          pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
          m = this.regexp.exec(decodeURIComponent(pathname));

        if (!m) return false;

        delete params[0];

        for (var i = 1, len = m.length; i < len; ++i) {
          var key = keys[i - 1];
          var val = this.page._decodeURLEncodedURIComponent(m[i]);
          if (val !== undefined || !(hasOwnProperty.call(params, key.name))) {
            params[key.name] = val;
          }
        }

        return true;
      };


      /**
       * Module exports.
       */

      var globalPage = createPage();
      var page_js = globalPage;
      var default_1 = globalPage;

    page_js.default = default_1;

    return page_js;

    })));
    });

    /* src/SocialIcon.svelte generated by Svelte v3.43.1 */

    function create_fragment$9(ctx) {
    	let div;
    	let a;
    	let i;
    	let i_class_value;

    	return {
    		c() {
    			div = element("div");
    			a = element("a");
    			i = element("i");
    			attr(i, "class", i_class_value = "fab md:text-5xl text-4xl fa-" + /*icon*/ ctx[0]);
    			attr(a, "href", /*link*/ ctx[1]);
    			attr(a, "target", "_blank");
    			attr(div, "class", "mx-2");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			append(div, a);
    			append(a, i);
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*icon*/ 1 && i_class_value !== (i_class_value = "fab md:text-5xl text-4xl fa-" + /*icon*/ ctx[0])) {
    				attr(i, "class", i_class_value);
    			}

    			if (dirty & /*link*/ 2) {
    				attr(a, "href", /*link*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { icon } = $$props;
    	let { link } = $$props;

    	$$self.$$set = $$props => {
    		if ('icon' in $$props) $$invalidate(0, icon = $$props.icon);
    		if ('link' in $$props) $$invalidate(1, link = $$props.link);
    	};

    	return [icon, link];
    }

    class SocialIcon extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$5, create_fragment$9, safe_not_equal, { icon: 0, link: 1 });
    	}
    }

    /* src/SocialContainer.svelte generated by Svelte v3.43.1 */

    function create_fragment$8(ctx) {
    	let div;
    	let socialicon0;
    	let t0;
    	let socialicon1;
    	let t1;
    	let socialicon2;
    	let t2;
    	let socialicon3;
    	let current;

    	socialicon0 = new SocialIcon({
    			props: {
    				link: "https://www.facebook.com/BarKod-Hakaton-101121252159164",
    				icon: "facebook"
    			}
    		});

    	socialicon1 = new SocialIcon({
    			props: {
    				link: "https://www.instagram.com/barkod.hakaton/",
    				icon: "instagram"
    			}
    		});

    	socialicon2 = new SocialIcon({
    			props: {
    				link: "https://discord.gg/V6CBrenQ3Z",
    				icon: "discord"
    			}
    		});

    	socialicon3 = new SocialIcon({
    			props: {
    				link: "https://www.linkedin.com/company/77826730",
    				icon: "linkedin"
    			}
    		});

    	return {
    		c() {
    			div = element("div");
    			create_component(socialicon0.$$.fragment);
    			t0 = space();
    			create_component(socialicon1.$$.fragment);
    			t1 = space();
    			create_component(socialicon2.$$.fragment);
    			t2 = space();
    			create_component(socialicon3.$$.fragment);
    			attr(div, "class", "flex mt-4 justify-center");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			mount_component(socialicon0, div, null);
    			append(div, t0);
    			mount_component(socialicon1, div, null);
    			append(div, t1);
    			mount_component(socialicon2, div, null);
    			append(div, t2);
    			mount_component(socialicon3, div, null);
    			current = true;
    		},
    		p: noop,
    		i(local) {
    			if (current) return;
    			transition_in(socialicon0.$$.fragment, local);
    			transition_in(socialicon1.$$.fragment, local);
    			transition_in(socialicon2.$$.fragment, local);
    			transition_in(socialicon3.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(socialicon0.$$.fragment, local);
    			transition_out(socialicon1.$$.fragment, local);
    			transition_out(socialicon2.$$.fragment, local);
    			transition_out(socialicon3.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			destroy_component(socialicon0);
    			destroy_component(socialicon1);
    			destroy_component(socialicon2);
    			destroy_component(socialicon3);
    		}
    	};
    }

    class SocialContainer extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$8, safe_not_equal, {});
    	}
    }

    /* src/Logo.svelte generated by Svelte v3.43.1 */

    function create_fragment$7(ctx) {
    	let svg;
    	let g;
    	let path0;
    	let path1;
    	let path2;
    	let path3;
    	let path4;
    	let path5;
    	let path6;
    	let path7;
    	let path8;
    	let path9;
    	let path10;
    	let path11;
    	let path12;
    	let path13;
    	let path14;
    	let path15;
    	let path16;
    	let path17;
    	let path18;
    	let path19;
    	let path20;
    	let path21;
    	let path22;
    	let path23;
    	let path24;
    	let path25;
    	let path26;
    	let path27;
    	let path28;
    	let path29;
    	let path30;
    	let path31;
    	let path32;
    	let path33;
    	let path34;
    	let path35;
    	let path36;
    	let path37;
    	let path38;
    	let path39;
    	let path40;
    	let path41;
    	let path42;
    	let path43;
    	let path44;
    	let path45;
    	let path46;
    	let path47;
    	let path48;
    	let path49;
    	let path50;

    	return {
    		c() {
    			svg = svg_element("svg");
    			g = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			path4 = svg_element("path");
    			path5 = svg_element("path");
    			path6 = svg_element("path");
    			path7 = svg_element("path");
    			path8 = svg_element("path");
    			path9 = svg_element("path");
    			path10 = svg_element("path");
    			path11 = svg_element("path");
    			path12 = svg_element("path");
    			path13 = svg_element("path");
    			path14 = svg_element("path");
    			path15 = svg_element("path");
    			path16 = svg_element("path");
    			path17 = svg_element("path");
    			path18 = svg_element("path");
    			path19 = svg_element("path");
    			path20 = svg_element("path");
    			path21 = svg_element("path");
    			path22 = svg_element("path");
    			path23 = svg_element("path");
    			path24 = svg_element("path");
    			path25 = svg_element("path");
    			path26 = svg_element("path");
    			path27 = svg_element("path");
    			path28 = svg_element("path");
    			path29 = svg_element("path");
    			path30 = svg_element("path");
    			path31 = svg_element("path");
    			path32 = svg_element("path");
    			path33 = svg_element("path");
    			path34 = svg_element("path");
    			path35 = svg_element("path");
    			path36 = svg_element("path");
    			path37 = svg_element("path");
    			path38 = svg_element("path");
    			path39 = svg_element("path");
    			path40 = svg_element("path");
    			path41 = svg_element("path");
    			path42 = svg_element("path");
    			path43 = svg_element("path");
    			path44 = svg_element("path");
    			path45 = svg_element("path");
    			path46 = svg_element("path");
    			path47 = svg_element("path");
    			path48 = svg_element("path");
    			path49 = svg_element("path");
    			path50 = svg_element("path");
    			attr(path0, "id", "XMLID_5075_");
    			attr(path0, "d", "M130.58,625.07H8.8c-4.8,0-8.72-3.92-8.72-8.72l0,0c0-4.8,3.93-8.72,8.72-8.72h121.78\n\t\tc4.8,0,8.72,3.93,8.72,8.72l0,0C139.3,621.14,135.38,625.07,130.58,625.07z");
    			attr(path1, "id", "XMLID_5074_");
    			attr(path1, "d", "M33.72,590.3H16.36c-4.8,0-8.72-3.92-8.72-8.72v0c0-4.8,3.93-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.92,8.72,8.72v0C42.44,586.38,38.52,590.3,33.72,590.3z");
    			attr(path2, "id", "XMLID_5073_");
    			attr(path2, "d", "M172.95,590.3h-17.36c-4.8,0-8.72-3.92-8.72-8.72v0c0-4.8,3.93-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.92,8.72,8.72v0C181.67,586.38,177.75,590.3,172.95,590.3z");
    			attr(path3, "id", "XMLID_5072_");
    			attr(path3, "d", "M41.28,555.5H23.91c-4.8,0-8.72-3.93-8.72-8.72v0c0-4.8,3.93-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.92,8.72,8.72v0C50,551.57,46.07,555.5,41.28,555.5z");
    			attr(path4, "id", "XMLID_5071_");
    			attr(path4, "d", "M48.84,520.69H31.47c-4.8,0-8.72-3.92-8.72-8.72v0c0-4.8,3.93-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.93,8.72,8.72v0C57.56,516.76,53.63,520.69,48.84,520.69z");
    			attr(path5, "id", "XMLID_5070_");
    			attr(path5, "d", "M180.51,555.5h-17.36c-4.8,0-8.72-3.92-8.72-8.72v0c0-4.8,3.93-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.92,8.72,8.72v0C189.23,551.57,185.3,555.5,180.51,555.5z");
    			attr(path6, "id", "XMLID_5069_");
    			attr(path6, "d", "M188.07,520.69H170.7c-4.8,0-8.72-3.92-8.72-8.72v0c0-4.8,3.93-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.93,8.72,8.72v0C196.79,516.76,192.86,520.69,188.07,520.69z");
    			attr(path7, "id", "XMLID_5068_");
    			attr(path7, "d", "M160.82,485.88H39.03c-4.8,0-8.72-3.93-8.72-8.72l0,0c0-4.8,3.93-8.72,8.72-8.72h121.78\n\t\tc4.8,0,8.72,3.93,8.72,8.72l0,0C169.54,481.96,165.61,485.88,160.82,485.88z");
    			attr(path8, "id", "XMLID_5067_");
    			attr(path8, "d", "M63.95,451.07H46.59c-4.8,0-8.72-3.93-8.72-8.72l0,0c0-4.8,3.93-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.93,8.72,8.72l0,0C72.67,447.15,68.75,451.07,63.95,451.07z");
    			attr(path9, "id", "XMLID_5066_");
    			attr(path9, "d", "M71.51,416.27H54.15c-4.8,0-8.72-3.92-8.72-8.72v0c0-4.8,3.93-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.93,8.72,8.72v0C80.23,412.34,76.31,416.27,71.51,416.27z");
    			attr(path10, "id", "XMLID_5065_");
    			attr(path10, "d", "M245.83,590.3h-17.36c-4.8,0-8.72-3.92-8.72-8.72v0c0-4.8,3.93-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.92,8.72,8.72v0C254.55,586.38,250.62,590.3,245.83,590.3z");
    			attr(path11, "id", "XMLID_5064_");
    			attr(path11, "d", "M377.5,625.07H255.71c-4.8,0-8.72-3.92-8.72-8.72l0,0c0-4.8,3.93-8.72,8.72-8.72H377.5\n\t\tc4.8,0,8.72,3.93,8.72,8.72l0,0C386.22,621.14,382.29,625.07,377.5,625.07z");
    			attr(path12, "id", "XMLID_5063_");
    			attr(path12, "d", "M392.61,555.5H270.83c-4.8,0-8.72-3.93-8.72-8.72v0c0-4.8,3.93-8.72,8.72-8.72h121.78\n\t\tc4.8,0,8.72,3.92,8.72,8.72v0C401.34,551.57,397.41,555.5,392.61,555.5z");
    			attr(path13, "id", "XMLID_5062_");
    			attr(path13, "d", "M400.17,520.69h-17.36c-4.8,0-8.72-3.92-8.72-8.72v0c0-4.8,3.93-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.93,8.72,8.72v0C408.89,516.76,404.97,520.69,400.17,520.69z");
    			attr(path14, "id", "XMLID_5061_");
    			attr(path14, "d", "M372.92,485.88h-86.98c-4.8,0-8.72-3.93-8.72-8.72v0c0-4.8,3.93-8.72,8.72-8.72h86.98\n\t\tc4.8,0,8.72,3.93,8.72,8.72v0C381.65,481.96,377.72,485.88,372.92,485.88z");
    			attr(path15, "id", "XMLID_5060_");
    			attr(path15, "d", "M385.06,590.3h-17.36c-4.8,0-8.72-3.92-8.72-8.72v0c0-4.8,3.92-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.92,8.72,8.72v0C393.78,586.38,389.85,590.3,385.06,590.3z");
    			attr(path16, "id", "XMLID_5059_");
    			attr(path16, "d", "M450.38,625.07h-17.36c-4.8,0-8.72-3.92-8.72-8.72l0,0c0-4.8,3.93-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.93,8.72,8.72l0,0C459.1,621.14,455.17,625.07,450.38,625.07z");
    			attr(path17, "id", "XMLID_5058_");
    			attr(path17, "d", "M457.93,590.36h-17.36c-4.8,0-8.72-3.93-8.72-8.72l0,0c0-4.8,3.93-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.93,8.72,8.72l0,0C466.66,586.44,462.73,590.36,457.93,590.36z");
    			attr(path18, "id", "XMLID_5057_");
    			attr(path18, "d", "M465.49,555.5h-17.36c-4.8,0-8.72-3.93-8.72-8.72v0c0-4.8,3.93-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.92,8.72,8.72v0C474.21,551.57,470.29,555.5,465.49,555.5z");
    			attr(path19, "id", "XMLID_5056_");
    			attr(path19, "d", "M473.05,520.69h-17.36c-4.8,0-8.72-3.92-8.72-8.72v0c0-4.8,3.93-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.92,8.72,8.72v0C481.77,516.76,477.85,520.69,473.05,520.69z");
    			attr(path20, "id", "XMLID_5055_");
    			attr(path20, "d", "M585.03,485.88H463.25c-4.8,0-8.72-3.93-8.72-8.72v0c0-4.8,3.93-8.72,8.72-8.72h121.79\n\t\tc4.8,0,8.72,3.93,8.72,8.72v0C593.75,481.96,589.83,485.88,585.03,485.88z");
    			attr(path21, "id", "XMLID_5054_");
    			attr(path21, "d", "M612.28,520.69h-17.36c-4.8,0-8.72-3.92-8.72-8.72v0c0-4.8,3.92-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.92,8.72,8.72v0C621,516.76,617.08,520.69,612.28,520.69z");
    			attr(path22, "id", "XMLID_5053_");
    			attr(path22, "d", "M662.48,625.11h-17.36c-4.8,0-8.72-3.93-8.72-8.72l0,0c0-4.8,3.92-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.93,8.72,8.72l0,0C671.21,621.19,667.28,625.11,662.48,625.11z");
    			attr(path23, "id", "XMLID_5052_");
    			attr(path23, "d", "M670.04,590.3h-17.36c-4.8,0-8.72-3.92-8.72-8.72v0c0-4.8,3.92-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.92,8.72,8.72v0C678.76,586.38,674.84,590.3,670.04,590.3z");
    			attr(path24, "id", "XMLID_5051_");
    			attr(path24, "d", "M747.21,555.5h-86.98c-4.8,0-8.72-3.93-8.72-8.72l0,0c0-4.8,3.93-8.72,8.72-8.72h86.98\n\t\tc4.8,0,8.72,3.93,8.72,8.72l0,0C755.94,551.57,752.01,555.5,747.21,555.5z");
    			attr(path25, "id", "XMLID_5050_");
    			attr(path25, "d", "M685.16,520.69H667.8c-4.8,0-8.72-3.92-8.72-8.72v0c0-4.8,3.92-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.92,8.72,8.72v0C693.88,516.76,689.96,520.69,685.16,520.69z");
    			attr(path26, "id", "XMLID_5049_");
    			attr(path26, "d", "M692.72,485.88h-17.36c-4.8,0-8.72-3.93-8.72-8.72v0c0-4.8,3.92-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.93,8.72,8.72v0C701.44,481.96,697.51,485.88,692.72,485.88z");
    			attr(path27, "id", "XMLID_5048_");
    			attr(path27, "d", "M700.28,451.07h-17.36c-4.8,0-8.72-3.93-8.72-8.72l0,0c0-4.8,3.92-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.93,8.72,8.72l0,0C709,447.15,705.07,451.07,700.28,451.07z");
    			attr(path28, "id", "XMLID_5047_");
    			attr(path28, "d", "M707.83,416.27h-17.36c-4.8,0-8.72-3.92-8.72-8.72v0c0-4.8,3.93-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.93,8.72,8.72v0C716.56,412.34,712.63,416.27,707.83,416.27z");
    			attr(path29, "id", "XMLID_5046_");
    			attr(path29, "d", "M789.58,520.69h-17.36c-4.8,0-8.72-3.92-8.72-8.72v0c0-4.8,3.93-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.92,8.72,8.72v0C798.3,516.76,794.38,520.69,789.58,520.69z");
    			attr(path30, "id", "XMLID_5045_");
    			attr(path30, "d", "M831.95,485.63h-17.36c-4.8,0-8.72-3.93-8.72-8.72v0c0-4.8,3.93-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.93,8.72,8.72v0C840.67,481.7,836.74,485.63,831.95,485.63z");
    			attr(path31, "id", "XMLID_5044_");
    			attr(path31, "d", "M774.46,590.3H757.1c-4.8,0-8.72-3.92-8.72-8.72v0c0-4.8,3.92-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.92,8.72,8.72v0C783.19,586.38,779.26,590.3,774.46,590.3z");
    			attr(path32, "id", "XMLID_5043_");
    			attr(path32, "d", "M801.71,625.07h-17.36c-4.8,0-8.72-3.92-8.72-8.72l0,0c0-4.8,3.93-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.93,8.72,8.72l0,0C810.43,621.14,806.51,625.07,801.71,625.07z");
    			attr(path33, "id", "XMLID_5042_");
    			attr(path33, "d", "M1009.25,485.63h-86.98c-4.8,0-8.72-3.93-8.72-8.72v0c0-4.8,3.92-8.72,8.72-8.72h86.98\n\t\tc4.8,0,8.72,3.93,8.72,8.72v0C1017.97,481.7,1014.04,485.63,1009.25,485.63z");
    			attr(path34, "id", "XMLID_5041_");
    			attr(path34, "d", "M979.01,625.11h-86.98c-4.8,0-8.72-3.93-8.72-8.72l0,0c0-4.8,3.93-8.72,8.72-8.72h86.98\n\t\tc4.8,0,8.72,3.93,8.72,8.72l0,0C987.74,621.19,983.81,625.11,979.01,625.11z");
    			attr(path35, "id", "XMLID_5040_");
    			attr(path35, "d", "M882.15,590.3h-17.36c-4.8,0-8.72-3.92-8.72-8.72v0c0-4.8,3.93-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.92,8.72,8.72v0C890.87,586.38,886.95,590.3,882.15,590.3z");
    			attr(path36, "id", "XMLID_5039_");
    			attr(path36, "d", "M889.71,555.5h-17.36c-4.8,0-8.72-3.93-8.72-8.72v0c0-4.8,3.93-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.92,8.72,8.72v0C898.43,551.57,894.5,555.5,889.71,555.5z");
    			attr(path37, "id", "XMLID_5038_");
    			attr(path37, "d", "M897.27,520.69H879.9c-4.8,0-8.72-3.92-8.72-8.72l0,0c0-4.8,3.92-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.93,8.72,8.72l0,0C905.99,516.76,902.06,520.69,897.27,520.69z");
    			attr(path38, "id", "XMLID_5037_");
    			attr(path38, "d", "M1036.5,520.69h-17.36c-4.8,0-8.72-3.92-8.72-8.72v0c0-4.8,3.92-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.92,8.72,8.72v0C1045.22,516.76,1041.29,520.69,1036.5,520.69z");
    			attr(path39, "id", "XMLID_5036_");
    			attr(path39, "d", "M1028.94,555.5h-17.36c-4.8,0-8.72-3.92-8.72-8.72l0,0c0-4.8,3.93-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.93,8.72,8.72l0,0C1037.66,551.57,1033.73,555.5,1028.94,555.5z");
    			attr(path40, "id", "XMLID_5035_");
    			attr(path40, "d", "M1021.38,590.3h-17.36c-4.8,0-8.72-3.92-8.72-8.72v0c0-4.8,3.93-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.92,8.72,8.72v0C1030.1,586.38,1026.18,590.3,1021.38,590.3z");
    			attr(path41, "id", "XMLID_5034_");
    			attr(path41, "d", "M1109.37,520.69h-17.36c-4.8,0-8.72-3.92-8.72-8.72v0c0-4.8,3.93-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.92,8.72,8.72v0C1118.1,516.76,1114.17,520.69,1109.37,520.69z");
    			attr(path42, "id", "XMLID_5033_");
    			attr(path42, "d", "M1101.81,555.5h-17.36c-4.8,0-8.72-3.93-8.72-8.72l0,0c0-4.8,3.93-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.93,8.72,8.72l0,0C1110.54,551.57,1106.61,555.5,1101.81,555.5z");
    			attr(path43, "id", "XMLID_5032_");
    			attr(path43, "d", "M1094.26,590.3h-17.36c-4.8,0-8.72-3.92-8.72-8.72v0c0-4.8,3.92-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.92,8.72,8.72v0C1102.98,586.38,1099.05,590.3,1094.26,590.3z");
    			attr(path44, "id", "XMLID_5031_");
    			attr(path44, "d", "M1225.93,625.07h-121.79c-4.8,0-8.72-3.93-8.72-8.72l0,0c0-4.8,3.92-8.72,8.72-8.72h121.79\n\t\tc4.8,0,8.72,3.93,8.72,8.72l0,0C1234.65,621.14,1230.72,625.07,1225.93,625.07z");
    			attr(path45, "id", "XMLID_5030_");
    			attr(path45, "d", "M1256.16,485.88h-121.78c-4.8,0-8.72-3.93-8.72-8.72v0c0-4.8,3.93-8.72,8.72-8.72h121.78\n\t\tc4.8,0,8.72,3.93,8.72,8.72v0C1264.88,481.96,1260.96,485.88,1256.16,485.88z");
    			attr(path46, "id", "XMLID_5029_");
    			attr(path46, "d", "M1248.6,520.69h-17.36c-4.8,0-8.72-3.92-8.72-8.72v0c0-4.8,3.93-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.92,8.72,8.72v0C1257.32,516.76,1253.4,520.69,1248.6,520.69z");
    			attr(path47, "id", "XMLID_5028_");
    			attr(path47, "d", "M1241.04,555.5h-17.36c-4.8,0-8.72-3.93-8.72-8.72l0,0c0-4.8,3.92-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.93,8.72,8.72l0,0C1249.77,551.57,1245.84,555.5,1241.04,555.5z");
    			attr(path48, "id", "XMLID_5027_");
    			attr(path48, "d", "M1233.49,590.3h-17.36c-4.8,0-8.72-3.92-8.72-8.72v0c0-4.8,3.93-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.92,8.72,8.72v0C1242.21,586.38,1238.28,590.3,1233.49,590.3z");
    			attr(path49, "id", "XMLID_5026_");
    			attr(path49, "d", "M1263.72,451.07h-17.36c-4.8,0-8.72-3.93-8.72-8.72l0,0c0-4.8,3.93-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.93,8.72,8.72l0,0C1272.44,447.15,1268.52,451.07,1263.72,451.07z");
    			attr(path50, "id", "XMLID_5025_");
    			attr(path50, "d", "M1271.28,416.27h-17.36c-4.8,0-8.72-3.92-8.72-8.72v0c0-4.8,3.93-8.72,8.72-8.72h17.36\n\t\tc4.8,0,8.72,3.93,8.72,8.72v0C1280,412.34,1276.07,416.27,1271.28,416.27z");
    			attr(g, "id", "XMLID_5024_");
    			attr(svg, "id", "Layer_1");
    			attr(svg, "x", "0px");
    			attr(svg, "y", "0px");
    			attr(svg, "viewBox", "0 100 1280 600");
    			set_style(svg, "enable-background", "new 0 100 1280 600");
    			attr(svg, "xml:space", "preserve");
    			attr(svg, "class", "svelte-1v4fazk");
    		},
    		m(target, anchor) {
    			insert(target, svg, anchor);
    			append(svg, g);
    			append(g, path0);
    			append(g, path1);
    			append(g, path2);
    			append(g, path3);
    			append(g, path4);
    			append(g, path5);
    			append(g, path6);
    			append(g, path7);
    			append(g, path8);
    			append(g, path9);
    			append(g, path10);
    			append(g, path11);
    			append(g, path12);
    			append(g, path13);
    			append(g, path14);
    			append(g, path15);
    			append(g, path16);
    			append(g, path17);
    			append(g, path18);
    			append(g, path19);
    			append(g, path20);
    			append(g, path21);
    			append(g, path22);
    			append(g, path23);
    			append(g, path24);
    			append(g, path25);
    			append(g, path26);
    			append(g, path27);
    			append(g, path28);
    			append(g, path29);
    			append(g, path30);
    			append(g, path31);
    			append(g, path32);
    			append(g, path33);
    			append(g, path34);
    			append(g, path35);
    			append(g, path36);
    			append(g, path37);
    			append(g, path38);
    			append(g, path39);
    			append(g, path40);
    			append(g, path41);
    			append(g, path42);
    			append(g, path43);
    			append(g, path44);
    			append(g, path45);
    			append(g, path46);
    			append(g, path47);
    			append(g, path48);
    			append(g, path49);
    			append(g, path50);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(svg);
    		}
    	};
    }

    class Logo extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$7, safe_not_equal, {});
    	}
    }

    /* src/Header.svelte generated by Svelte v3.43.1 */

    function create_fragment$6(ctx) {
    	let div5;
    	let div0;
    	let t2;
    	let div1;
    	let h3;
    	let logo;
    	let t3;
    	let h1;
    	let t5;
    	let socialcontainer;
    	let t6;
    	let div4;
    	let t12;
    	let div8;
    	let t19;
    	let p3;
    	let current;
    	logo = new Logo({});
    	socialcontainer = new SocialContainer({});

    	return {
    		c() {
    			div5 = element("div");
    			div0 = element("div");

    			div0.innerHTML = `<p class="text-center mb-2">Powered by:</p> 
        <a class="flex justify-center" href="https://www.synechron.com/" target="_blank"><img class="w-3/5 sponsor bg-white rounded-xl p-3 svelte-nzs6i8" src="synechron-vector-logo.png" alt="synechron"/></a>`;

    			t2 = space();
    			div1 = element("div");
    			h3 = element("h3");
    			create_component(logo.$$.fragment);
    			t3 = space();
    			h1 = element("h1");
    			h1.textContent = "HAKATON";
    			t5 = space();
    			create_component(socialcontainer.$$.fragment);
    			t6 = space();
    			div4 = element("div");

    			div4.innerHTML = `<div><p class="text-center">Partners:</p></div> 
        <div class="grid grid-cols-2 "><a class="flex justify-center" href="https://www.thecampster.com/rs/" target="_blank"><img class="w-4/5 h-3/4 mt-3 sponsor bg-gray-300 rounded-xl p-3 svelte-nzs6i8" src="kampster.png" alt="kampster"/></a> 
            <a class="flex justify-center" href="https://www.guarana.rs/" target="_blank"><img class="w-3/5 mt-3 sponsor bg-white rounded-xl p-3 svelte-nzs6i8" src="gua-logo.png" alt="guarana"/></a> 
            <a class="mx-auto" href="https://www.joberty.rs/" target="_blank"><img class="w-3/5 mt-3 mx-auto sponsor bg-white rounded-xl p-3 svelte-nzs6i8" src="joberty_logo_coral.png" alt="joberty"/></a> 
            <a class="mx-auto" href="https://www.zabac.rs/" target="_blank"><img class="w-3/5 mt-3 mx-auto sponsor bg-white rounded-xl p-3 svelte-nzs6i8" src="zabac.png" alt="zabac"/></a></div>`;

    			t12 = space();
    			div8 = element("div");

    			div8.innerHTML = `<p class="text-center mb-2 text-gray-500">Powered by:</p> 
    <div class="w-2/3 mx-auto grid"><a class="mx-1" href="https://www.synechron.com/" target="_blank"><img class="sponsor bg-white rounded-xl p-2 svelte-nzs6i8" src="synechron-vector-logo.png" alt="synechron"/></a></div> 
    <div class="grid-cols-2 grid"><a href="https://www.joberty.rs/" target="_blank"><img class="mt-3 w-2/3 ml-auto mr-1 sponsor bg-white rounded-xl p-3 svelte-nzs6i8" src="joberty_logo_coral.png" alt="joberty"/></a> 
        <a href="https://www.guarana.rs/" target="_blank"><img class="mt-3 w-2/3 mr-auto ml-1 sponsor bg-white rounded-xl p-3 svelte-nzs6i8" src="gua-logo.png" alt="guarana"/></a> 
        <a href="https://www.thecampster.com/rs/" target="_blank"><img class="mt-3 w-2/3 ml-auto mr-1 sponsor bg-gray-200 rounded-xl p-3 svelte-nzs6i8" src="kampster.png" alt="kampster"/></a> 
        <a href="https://www.zabac.rs/" target="_blank"><img class="mt-3 w-2/3 mr-auto ml-1 sponsor bg-white rounded-xl p-3 svelte-nzs6i8" src="zabac.png" alt="zabac"/></a></div>`;

    			t19 = space();
    			p3 = element("p");
    			p3.textContent = "Hvala svima koji su učestvovali i pomogli u realizaciji celog hakatona!\n    Pratite nas na društvenim mrežama za buduće događaje. Pozdrav od Budi Biće Bolje ekipe! =)";
    			attr(div0, "class", "p-8 invisible grid-cols-2 md:visible");
    			attr(h3, "class", "flex md:w-1/3 w-2/3 mx-auto text-white justify-center");
    			attr(h1, "id", "title");
    			attr(h1, "class", "flex font-bold md:text-7xl text-5xl justify-center svelte-nzs6i8");
    			attr(div4, "class", "invisible p-8 md:visible");
    			attr(div5, "class", "grid-cols-3 grid");
    			attr(div8, "class", "md:hidden grid-rows-3 visible");
    			attr(p3, "class", "text-xl text-center my-4 lg:mx-24 mx-2");
    		},
    		m(target, anchor) {
    			insert(target, div5, anchor);
    			append(div5, div0);
    			append(div5, t2);
    			append(div5, div1);
    			append(div1, h3);
    			mount_component(logo, h3, null);
    			append(div1, t3);
    			append(div1, h1);
    			append(div1, t5);
    			mount_component(socialcontainer, div1, null);
    			append(div5, t6);
    			append(div5, div4);
    			insert(target, t12, anchor);
    			insert(target, div8, anchor);
    			insert(target, t19, anchor);
    			insert(target, p3, anchor);
    			current = true;
    		},
    		p: noop,
    		i(local) {
    			if (current) return;
    			transition_in(logo.$$.fragment, local);
    			transition_in(socialcontainer.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(logo.$$.fragment, local);
    			transition_out(socialcontainer.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div5);
    			destroy_component(logo);
    			destroy_component(socialcontainer);
    			if (detaching) detach(t12);
    			if (detaching) detach(div8);
    			if (detaching) detach(t19);
    			if (detaching) detach(p3);
    		}
    	};
    }

    class Header extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$6, safe_not_equal, {});
    	}
    }

    /* src/Card.svelte generated by Svelte v3.43.1 */

    function create_if_block_1(ctx) {
    	let div;
    	let h5;
    	let t_value = /*card*/ ctx[0]?.subtitle + "";
    	let t;

    	return {
    		c() {
    			div = element("div");
    			h5 = element("h5");
    			t = text(t_value);
    			attr(div, "class", "pb-2 text-gray-500");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			append(div, h5);
    			append(h5, t);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*card*/ 1 && t_value !== (t_value = /*card*/ ctx[0]?.subtitle + "")) set_data(t, t_value);
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    // (15:4) {#if card.icon}
    function create_if_block(ctx) {
    	let div;
    	let a;
    	let i;
    	let i_class_value;
    	let t_value = /*card*/ ctx[0]?.link_text + "";
    	let t;
    	let a_href_value;

    	return {
    		c() {
    			div = element("div");
    			a = element("a");
    			i = element("i");
    			t = text(t_value);
    			attr(i, "class", i_class_value = "fa fa-" + /*card*/ ctx[0]?.icon + " svelte-ed2qk2");
    			attr(a, "target", /*targetType*/ ctx[1]);
    			attr(a, "href", a_href_value = /*card*/ ctx[0]?.link);
    			attr(div, "class", "flex justify-end mt-2");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			append(div, a);
    			append(a, i);
    			append(a, t);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*card*/ 1 && i_class_value !== (i_class_value = "fa fa-" + /*card*/ ctx[0]?.icon + " svelte-ed2qk2")) {
    				attr(i, "class", i_class_value);
    			}

    			if (dirty & /*card*/ 1 && t_value !== (t_value = /*card*/ ctx[0]?.link_text + "")) set_data(t, t_value);

    			if (dirty & /*card*/ 1 && a_href_value !== (a_href_value = /*card*/ ctx[0]?.link)) {
    				attr(a, "href", a_href_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    function create_fragment$5(ctx) {
    	let div2;
    	let div0;
    	let t0_value = /*card*/ ctx[0]?.title + "";
    	let t0;
    	let t1;
    	let hr;
    	let t2;
    	let t3;
    	let div1;
    	let raw_value = /*card*/ ctx[0]?.text + "";
    	let div1_class_value;
    	let t4;
    	let div2_id_value;
    	let div2_class_value;
    	let if_block0 = /*card*/ ctx[0].subtitle && create_if_block_1(ctx);
    	let if_block1 = /*card*/ ctx[0].icon && create_if_block(ctx);

    	return {
    		c() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			hr = element("hr");
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			div1 = element("div");
    			t4 = space();
    			if (if_block1) if_block1.c();
    			attr(div0, "class", "pt-2 text-xl");
    			attr(hr, "class", "my-1");
    			attr(div1, "class", div1_class_value = "" + ((/*card*/ ctx[0].subtitle ? '' : 'py-3') + " text-justify"));
    			attr(div2, "id", div2_id_value = /*card*/ ctx[0].id);
    			attr(div2, "class", div2_class_value = "bg-card px-4 py-2 rounded-md grid-rows-3 w-full shadow relative up-" + /*card*/ ctx[0].bottom + " svelte-ed2qk2");
    		},
    		m(target, anchor) {
    			insert(target, div2, anchor);
    			append(div2, div0);
    			append(div0, t0);
    			append(div2, t1);
    			append(div2, hr);
    			append(div2, t2);
    			if (if_block0) if_block0.m(div2, null);
    			append(div2, t3);
    			append(div2, div1);
    			div1.innerHTML = raw_value;
    			append(div2, t4);
    			if (if_block1) if_block1.m(div2, null);
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*card*/ 1 && t0_value !== (t0_value = /*card*/ ctx[0]?.title + "")) set_data(t0, t0_value);

    			if (/*card*/ ctx[0].subtitle) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					if_block0.m(div2, t3);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*card*/ 1 && raw_value !== (raw_value = /*card*/ ctx[0]?.text + "")) div1.innerHTML = raw_value;
    			if (dirty & /*card*/ 1 && div1_class_value !== (div1_class_value = "" + ((/*card*/ ctx[0].subtitle ? '' : 'py-3') + " text-justify"))) {
    				attr(div1, "class", div1_class_value);
    			}

    			if (/*card*/ ctx[0].icon) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(div2, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*card*/ 1 && div2_id_value !== (div2_id_value = /*card*/ ctx[0].id)) {
    				attr(div2, "id", div2_id_value);
    			}

    			if (dirty & /*card*/ 1 && div2_class_value !== (div2_class_value = "bg-card px-4 py-2 rounded-md grid-rows-3 w-full shadow relative up-" + /*card*/ ctx[0].bottom + " svelte-ed2qk2")) {
    				attr(div2, "class", div2_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(div2);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { card } = $$props;
    	const targetType = card.link === 'faq' ? '' : '_blank';

    	$$self.$$set = $$props => {
    		if ('card' in $$props) $$invalidate(0, card = $$props.card);
    	};

    	return [card, targetType];
    }

    class Card extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$4, create_fragment$5, safe_not_equal, { card: 0 });
    	}
    }

    /* src/Footer.svelte generated by Svelte v3.43.1 */

    function create_fragment$4(ctx) {
    	let div4;
    	let div3;
    	let div0;
    	let socialcontainer;
    	let t0;
    	let div1;
    	let t2;
    	let div2;
    	let current;
    	socialcontainer = new SocialContainer({});

    	return {
    		c() {
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			create_component(socialcontainer.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			div1.textContent = "© Sva autorska prava, zaštitni znakovi i znakovi usluga pripadaju odgovarajućim vlasnicima.";
    			t2 = space();
    			div2 = element("div");
    			div2.innerHTML = `Made by  <a target="_blank" href="https://github.com/Janje12">@janje12</a>`;
    			attr(div0, "class", "my-3");
    			attr(div1, "class", "flex justify-center mx-10 my-auto text-gray-500");
    			attr(div2, "class", "flex justify-end my-4 mr-10 my-auto");
    			attr(div3, "class", "grid grid-cols-3 svelte-fz088q");
    			attr(div4, "class", "bg-footer h-full py-20 svelte-fz088q");
    		},
    		m(target, anchor) {
    			insert(target, div4, anchor);
    			append(div4, div3);
    			append(div3, div0);
    			mount_component(socialcontainer, div0, null);
    			append(div3, t0);
    			append(div3, div1);
    			append(div3, t2);
    			append(div3, div2);
    			current = true;
    		},
    		p: noop,
    		i(local) {
    			if (current) return;
    			transition_in(socialcontainer.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(socialcontainer.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div4);
    			destroy_component(socialcontainer);
    		}
    	};
    }

    class Footer extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$4, safe_not_equal, {});
    	}
    }

    /* src/CardImage.svelte generated by Svelte v3.43.1 */

    function create_fragment$3(ctx) {
    	let div;
    	let img;
    	let img_class_value;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			div = element("div");
    			img = element("img");
    			attr(img, "loading", "lazy");
    			attr(img, "class", img_class_value = "" + (null_to_empty(/*show*/ ctx[1] ? 'show' : 'hide') + " svelte-8vb3s5"));
    			if (!src_url_equal(img.src, img_src_value = '/images/' + /*url*/ ctx[0] + '.jpg')) attr(img, "src", img_src_value);
    			set_style(div, "width", "450px");
    			set_style(div, "height", "480px");
    			attr(div, "class", "m-2 mx-auto bg-gray-900");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			append(div, img);

    			if (!mounted) {
    				dispose = listen(img, "error", /*error_handler*/ ctx[2]);
    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*show*/ 2 && img_class_value !== (img_class_value = "" + (null_to_empty(/*show*/ ctx[1] ? 'show' : 'hide') + " svelte-8vb3s5"))) {
    				attr(img, "class", img_class_value);
    			}

    			if (dirty & /*url*/ 1 && !src_url_equal(img.src, img_src_value = '/images/' + /*url*/ ctx[0] + '.jpg')) {
    				attr(img, "src", img_src_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(div);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { url = 0 } = $$props;
    	let show = true;
    	const error_handler = () => $$invalidate(1, show = false);

    	$$self.$$set = $$props => {
    		if ('url' in $$props) $$invalidate(0, url = $$props.url);
    	};

    	return [url, show, error_handler];
    }

    class CardImage extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { url: 0 });
    	}
    }

    /* src/Home.svelte generated by Svelte v3.43.1 */

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	child_ctx[8] = i;
    	return child_ctx;
    }

    // (89:8) {#each Array(78) as _, i}
    function create_each_block(ctx) {
    	let cardimage;
    	let current;
    	cardimage = new CardImage({ props: { url: /*i*/ ctx[8] + 1 } });

    	return {
    		c() {
    			create_component(cardimage.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(cardimage, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i(local) {
    			if (current) return;
    			transition_in(cardimage.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(cardimage.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(cardimage, detaching);
    		}
    	};
    }

    function create_fragment$2(ctx) {
    	let link;
    	let t0;
    	let body;
    	let main;
    	let header;
    	let t1;
    	let div;
    	let t2;
    	let footer;
    	let current;
    	header = new Header({});
    	let each_value = Array(78);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	footer = new Footer({});

    	return {
    		c() {
    			link = element("link");
    			t0 = space();
    			body = element("body");
    			main = element("main");
    			create_component(header.$$.fragment);
    			t1 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			create_component(footer.$$.fragment);
    			attr(link, "rel", "stylesheet");
    			attr(link, "href", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css");
    			attr(div, "class", "w-10/12 mx-auto h-full grid md:grid-cols-2 lg:grid-cols-3");
    		},
    		m(target, anchor) {
    			append(document.head, link);
    			insert(target, t0, anchor);
    			insert(target, body, anchor);
    			append(body, main);
    			mount_component(header, main, null);
    			append(main, t1);
    			append(main, div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append(body, t2);
    			mount_component(footer, body, null);
    			current = true;
    		},
    		p: noop,
    		i(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(header.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			detach(link);
    			if (detaching) detach(t0);
    			if (detaching) detach(body);
    			destroy_component(header);
    			destroy_each(each_blocks, detaching);
    			destroy_component(footer);
    		}
    	};
    }

    function instance$2($$self) {

    	return [];
    }

    class Home extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});
    	}
    }

    /* src/Faq.svelte generated by Svelte v3.43.1 */

    function create_fragment$1(ctx) {
    	let link;
    	let script;
    	let t1;
    	let div11;
    	let div0;
    	let header;
    	let t2;
    	let div10;
    	let div1;
    	let button;
    	let t3;
    	let div2;
    	let card0;
    	let t4;
    	let div3;
    	let card1_1;
    	let t5;
    	let div4;
    	let card2_1;
    	let t6;
    	let div5;
    	let card3_1;
    	let t7;
    	let div6;
    	let card4_1;
    	let t8;
    	let div7;
    	let card5_1;
    	let t9;
    	let div8;
    	let card6_1;
    	let t10;
    	let div9;
    	let card7_1;
    	let t11;
    	let footer;
    	let current;
    	let mounted;
    	let dispose;
    	header = new Header({});
    	card0 = new Card({ props: { card: /*card1*/ ctx[0] } });
    	card1_1 = new Card({ props: { card: /*card2*/ ctx[1] } });
    	card2_1 = new Card({ props: { card: /*card3*/ ctx[2] } });
    	card3_1 = new Card({ props: { card: /*card4*/ ctx[3] } });
    	card4_1 = new Card({ props: { card: /*card8*/ ctx[4] } });
    	card5_1 = new Card({ props: { card: /*card5*/ ctx[5] } });
    	card6_1 = new Card({ props: { card: /*card6*/ ctx[6] } });
    	card7_1 = new Card({ props: { card: /*card7*/ ctx[7] } });
    	footer = new Footer({});

    	return {
    		c() {
    			link = element("link");
    			script = element("script");
    			script.textContent = "!function(f,b,e,v,n,t,s)\n        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?\n            n.callMethod.apply(n,arguments):n.queue.push(arguments)};\n            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';\n            n.queue=[];t=b.createElement(e);t.async=!0;\n            t.src=v;s=b.getElementsByTagName(e)[0];\n            s.parentNode.insertBefore(t,s)}(window, document,'script',\n            'https://connect.facebook.net/en_US/fbevents.js%27);\n        fbq('init', '576441933660014');\n        fbq('track', 'PageView');\n    ";
    			t1 = space();
    			div11 = element("div");
    			div0 = element("div");
    			create_component(header.$$.fragment);
    			t2 = space();
    			div10 = element("div");
    			div1 = element("div");
    			button = element("button");
    			button.innerHTML = `<i class="fa fa-2x fa-arrow-left"></i>`;
    			t3 = space();
    			div2 = element("div");
    			create_component(card0.$$.fragment);
    			t4 = space();
    			div3 = element("div");
    			create_component(card1_1.$$.fragment);
    			t5 = space();
    			div4 = element("div");
    			create_component(card2_1.$$.fragment);
    			t6 = space();
    			div5 = element("div");
    			create_component(card3_1.$$.fragment);
    			t7 = space();
    			div6 = element("div");
    			create_component(card4_1.$$.fragment);
    			t8 = space();
    			div7 = element("div");
    			create_component(card5_1.$$.fragment);
    			t9 = space();
    			div8 = element("div");
    			create_component(card6_1.$$.fragment);
    			t10 = space();
    			div9 = element("div");
    			create_component(card7_1.$$.fragment);
    			t11 = space();
    			create_component(footer.$$.fragment);
    			attr(link, "rel", "stylesheet");
    			attr(link, "href", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css");
    			attr(link, "integrity", "sha512-YWzhKL2whUzgiheMoBFwW8CKV4qpHQAEuvilg9FAn5VJUDwKZZxkJNuGM4XkWuk94WCrrwslk8yWNGmY1EduTA==");
    			attr(link, "crossorigin", "anonymous");
    			attr(link, "referrerpolicy", "no-referrer");
    			attr(div0, "class", "row");
    			attr(button, "class", "p-3 rounded border hover:bg-purple-700");
    			attr(div1, "class", "my-3");
    			attr(div2, "class", "my-3");
    			attr(div3, "class", "my-3");
    			attr(div4, "class", "my-3");
    			attr(div5, "class", "my-3");
    			attr(div6, "class", "my-3");
    			attr(div7, "class", "my-3");
    			attr(div8, "class", "my-3");
    			attr(div9, "class", "my-3");
    			attr(div10, "class", "container mx-auto w-3/5 mt-3");
    			attr(div11, "class", "container-fluid mb-10 px-0 h-100");
    		},
    		m(target, anchor) {
    			append(document.head, link);
    			append(document.head, script);
    			insert(target, t1, anchor);
    			insert(target, div11, anchor);
    			append(div11, div0);
    			mount_component(header, div0, null);
    			append(div11, t2);
    			append(div11, div10);
    			append(div10, div1);
    			append(div1, button);
    			append(div10, t3);
    			append(div10, div2);
    			mount_component(card0, div2, null);
    			append(div10, t4);
    			append(div10, div3);
    			mount_component(card1_1, div3, null);
    			append(div10, t5);
    			append(div10, div4);
    			mount_component(card2_1, div4, null);
    			append(div10, t6);
    			append(div10, div5);
    			mount_component(card3_1, div5, null);
    			append(div10, t7);
    			append(div10, div6);
    			mount_component(card4_1, div6, null);
    			append(div10, t8);
    			append(div10, div7);
    			mount_component(card5_1, div7, null);
    			append(div10, t9);
    			append(div10, div8);
    			mount_component(card6_1, div8, null);
    			append(div10, t10);
    			append(div10, div9);
    			mount_component(card7_1, div9, null);
    			insert(target, t11, anchor);
    			mount_component(footer, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen(button, "click", /*click_handler*/ ctx[8]);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(card0.$$.fragment, local);
    			transition_in(card1_1.$$.fragment, local);
    			transition_in(card2_1.$$.fragment, local);
    			transition_in(card3_1.$$.fragment, local);
    			transition_in(card4_1.$$.fragment, local);
    			transition_in(card5_1.$$.fragment, local);
    			transition_in(card6_1.$$.fragment, local);
    			transition_in(card7_1.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(card0.$$.fragment, local);
    			transition_out(card1_1.$$.fragment, local);
    			transition_out(card2_1.$$.fragment, local);
    			transition_out(card3_1.$$.fragment, local);
    			transition_out(card4_1.$$.fragment, local);
    			transition_out(card5_1.$$.fragment, local);
    			transition_out(card6_1.$$.fragment, local);
    			transition_out(card7_1.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			detach(link);
    			detach(script);
    			if (detaching) detach(t1);
    			if (detaching) detach(div11);
    			destroy_component(header);
    			destroy_component(card0);
    			destroy_component(card1_1);
    			destroy_component(card2_1);
    			destroy_component(card3_1);
    			destroy_component(card4_1);
    			destroy_component(card5_1);
    			destroy_component(card6_1);
    			destroy_component(card7_1);
    			if (detaching) detach(t11);
    			destroy_component(footer, detaching);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    function goBack() {
    	window.location.href = 'index';
    }

    function instance$1($$self) {
    	let card1 = {
    		title: 'Šta je hakaton?',
    		text: 'Hakaton je takmičenje gde studenti i učenici učestvuju razvijanju rešenja za zadate probleme i učenju nečega novog usput. Svi su pozvani da dođu pošto će pored takmičenja biti i paneli kompanija koje se bave Informacionim tehnologijama!'
    	};

    	let card2 = {
    		title: 'Kada se održava?',
    		text: 'Hakaton će se održati 27. Novembra, a prijave su već otvorene. Šta čekaš <a class="text-pink-500" href="register">prijavi se!</a>'
    	};

    	let card3 = {
    		title: 'Gde će se održati?',
    		text: 'Hakaton će se održati na Departmanu matematike i informatike Prirodno-matematičkog fakulteta u Novom Sadu.'
    	};

    	let card4 = {
    		title: 'Da li moram biti na student da bi učestovao?',
    		text: 'Ne! Skoro svako ko je željan da nauči nešto novo u IT grani i mlađi je od 24 godine je dobrodošao!'
    	};

    	let card8 = {
    		title: 'Koliki su timovi?',
    		text: 'Timovi se sastoje od dva do tri člana.'
    	};

    	let card5 = {
    		title: 'Da li su prijave moguće samo u timu?',
    		text: 'Ne! Moguće je prijaviti se i kao pojedinac, i kao tim'
    	};

    	let card6 = {
    		title: 'Hocu da pomognem!',
    		text: 'Super =) uskoči na naš Discord i javi nam se, ili na bilo koje druge socijalne mreže!'
    	};

    	let card7 = {
    		title: 'Hoću da dođem da se upoznam sa kompanijama ili bodrim takmičare da li treba da se prijavim negde?',
    		text: 'Ne! Samo bani u toku dana, a za ostalo ćemo se mi pobrinuti!'
    	};

    	const click_handler = () => goBack();
    	return [card1, card2, card3, card4, card8, card5, card6, card7, click_handler];
    }

    class Faq extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});
    	}
    }

    /* src/App.svelte generated by Svelte v3.43.1 */

    function create_fragment(ctx) {
    	let switch_instance;
    	let t;
    	let link;
    	let current;
    	var switch_value = /*current*/ ctx[0];

    	function switch_props(ctx) {
    		return {};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	return {
    		c() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t = space();
    			link = element("link");
    			attr(link, "rel", "icon");
    			attr(link, "type", "image/png");
    			attr(link, "href", "favicon.ico");
    			document.title = "barKod";
    		},
    		m(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert(target, t, anchor);
    			append(document.head, link);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (switch_value !== (switch_value = /*current*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, t.parentNode, t);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (switch_instance) destroy_component(switch_instance, detaching);
    			if (detaching) detach(t);
    			detach(link);
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	let current = Home;
    	page('/', () => $$invalidate(0, current = Home));
    	page('/faq', () => $$invalidate(0, current = Faq));
    	page.start();
    	return [current];
    }

    class App extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance, create_fragment, safe_not_equal, {});
    	}
    }

    const app = new App({
        target: document.body,
        props: {
            name: 'world'
        }
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
