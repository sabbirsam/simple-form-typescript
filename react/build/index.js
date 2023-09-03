/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@remix-run/router/dist/router.js":
/*!*******************************************************!*\
  !*** ./node_modules/@remix-run/router/dist/router.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbortedDeferredError: function() { return /* binding */ AbortedDeferredError; },
/* harmony export */   Action: function() { return /* binding */ Action; },
/* harmony export */   ErrorResponse: function() { return /* binding */ ErrorResponse; },
/* harmony export */   IDLE_BLOCKER: function() { return /* binding */ IDLE_BLOCKER; },
/* harmony export */   IDLE_FETCHER: function() { return /* binding */ IDLE_FETCHER; },
/* harmony export */   IDLE_NAVIGATION: function() { return /* binding */ IDLE_NAVIGATION; },
/* harmony export */   UNSAFE_DEFERRED_SYMBOL: function() { return /* binding */ UNSAFE_DEFERRED_SYMBOL; },
/* harmony export */   UNSAFE_DeferredData: function() { return /* binding */ DeferredData; },
/* harmony export */   UNSAFE_convertRoutesToDataRoutes: function() { return /* binding */ convertRoutesToDataRoutes; },
/* harmony export */   UNSAFE_getPathContributingMatches: function() { return /* binding */ getPathContributingMatches; },
/* harmony export */   UNSAFE_invariant: function() { return /* binding */ invariant; },
/* harmony export */   UNSAFE_warning: function() { return /* binding */ warning; },
/* harmony export */   createBrowserHistory: function() { return /* binding */ createBrowserHistory; },
/* harmony export */   createHashHistory: function() { return /* binding */ createHashHistory; },
/* harmony export */   createMemoryHistory: function() { return /* binding */ createMemoryHistory; },
/* harmony export */   createPath: function() { return /* binding */ createPath; },
/* harmony export */   createRouter: function() { return /* binding */ createRouter; },
/* harmony export */   createStaticHandler: function() { return /* binding */ createStaticHandler; },
/* harmony export */   defer: function() { return /* binding */ defer; },
/* harmony export */   generatePath: function() { return /* binding */ generatePath; },
/* harmony export */   getStaticContextFromError: function() { return /* binding */ getStaticContextFromError; },
/* harmony export */   getToPathname: function() { return /* binding */ getToPathname; },
/* harmony export */   isDeferredData: function() { return /* binding */ isDeferredData; },
/* harmony export */   isRouteErrorResponse: function() { return /* binding */ isRouteErrorResponse; },
/* harmony export */   joinPaths: function() { return /* binding */ joinPaths; },
/* harmony export */   json: function() { return /* binding */ json; },
/* harmony export */   matchPath: function() { return /* binding */ matchPath; },
/* harmony export */   matchRoutes: function() { return /* binding */ matchRoutes; },
/* harmony export */   normalizePathname: function() { return /* binding */ normalizePathname; },
/* harmony export */   parsePath: function() { return /* binding */ parsePath; },
/* harmony export */   redirect: function() { return /* binding */ redirect; },
/* harmony export */   redirectDocument: function() { return /* binding */ redirectDocument; },
/* harmony export */   resolvePath: function() { return /* binding */ resolvePath; },
/* harmony export */   resolveTo: function() { return /* binding */ resolveTo; },
/* harmony export */   stripBasename: function() { return /* binding */ stripBasename; }
/* harmony export */ });
/**
 * @remix-run/router v1.8.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

////////////////////////////////////////////////////////////////////////////////
//#region Types and Constants
////////////////////////////////////////////////////////////////////////////////
/**
 * Actions represent the type of change to a location value.
 */
var Action;
(function (Action) {
  /**
   * A POP indicates a change to an arbitrary index in the history stack, such
   * as a back or forward navigation. It does not describe the direction of the
   * navigation, only that the current index changed.
   *
   * Note: This is the default action for newly created history objects.
   */
  Action["Pop"] = "POP";
  /**
   * A PUSH indicates a new entry being added to the history stack, such as when
   * a link is clicked and a new page loads. When this happens, all subsequent
   * entries in the stack are lost.
   */
  Action["Push"] = "PUSH";
  /**
   * A REPLACE indicates the entry at the current index in the history stack
   * being replaced by a new one.
   */
  Action["Replace"] = "REPLACE";
})(Action || (Action = {}));
const PopStateEventType = "popstate";
/**
 * Memory history stores the current location in memory. It is designed for use
 * in stateful non-browser environments like tests and React Native.
 */
function createMemoryHistory(options) {
  if (options === void 0) {
    options = {};
  }
  let {
    initialEntries = ["/"],
    initialIndex,
    v5Compat = false
  } = options;
  let entries; // Declare so we can access from createMemoryLocation
  entries = initialEntries.map((entry, index) => createMemoryLocation(entry, typeof entry === "string" ? null : entry.state, index === 0 ? "default" : undefined));
  let index = clampIndex(initialIndex == null ? entries.length - 1 : initialIndex);
  let action = Action.Pop;
  let listener = null;
  function clampIndex(n) {
    return Math.min(Math.max(n, 0), entries.length - 1);
  }
  function getCurrentLocation() {
    return entries[index];
  }
  function createMemoryLocation(to, state, key) {
    if (state === void 0) {
      state = null;
    }
    let location = createLocation(entries ? getCurrentLocation().pathname : "/", to, state, key);
    warning(location.pathname.charAt(0) === "/", "relative pathnames are not supported in memory history: " + JSON.stringify(to));
    return location;
  }
  function createHref(to) {
    return typeof to === "string" ? to : createPath(to);
  }
  let history = {
    get index() {
      return index;
    },
    get action() {
      return action;
    },
    get location() {
      return getCurrentLocation();
    },
    createHref,
    createURL(to) {
      return new URL(createHref(to), "http://localhost");
    },
    encodeLocation(to) {
      let path = typeof to === "string" ? parsePath(to) : to;
      return {
        pathname: path.pathname || "",
        search: path.search || "",
        hash: path.hash || ""
      };
    },
    push(to, state) {
      action = Action.Push;
      let nextLocation = createMemoryLocation(to, state);
      index += 1;
      entries.splice(index, entries.length, nextLocation);
      if (v5Compat && listener) {
        listener({
          action,
          location: nextLocation,
          delta: 1
        });
      }
    },
    replace(to, state) {
      action = Action.Replace;
      let nextLocation = createMemoryLocation(to, state);
      entries[index] = nextLocation;
      if (v5Compat && listener) {
        listener({
          action,
          location: nextLocation,
          delta: 0
        });
      }
    },
    go(delta) {
      action = Action.Pop;
      let nextIndex = clampIndex(index + delta);
      let nextLocation = entries[nextIndex];
      index = nextIndex;
      if (listener) {
        listener({
          action,
          location: nextLocation,
          delta
        });
      }
    },
    listen(fn) {
      listener = fn;
      return () => {
        listener = null;
      };
    }
  };
  return history;
}
/**
 * Browser history stores the location in regular URLs. This is the standard for
 * most web apps, but it requires some configuration on the server to ensure you
 * serve the same app at multiple URLs.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#createbrowserhistory
 */
function createBrowserHistory(options) {
  if (options === void 0) {
    options = {};
  }
  function createBrowserLocation(window, globalHistory) {
    let {
      pathname,
      search,
      hash
    } = window.location;
    return createLocation("", {
      pathname,
      search,
      hash
    },
    // state defaults to `null` because `window.history.state` does
    globalHistory.state && globalHistory.state.usr || null, globalHistory.state && globalHistory.state.key || "default");
  }
  function createBrowserHref(window, to) {
    return typeof to === "string" ? to : createPath(to);
  }
  return getUrlBasedHistory(createBrowserLocation, createBrowserHref, null, options);
}
/**
 * Hash history stores the location in window.location.hash. This makes it ideal
 * for situations where you don't want to send the location to the server for
 * some reason, either because you do cannot configure it or the URL space is
 * reserved for something else.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#createhashhistory
 */
function createHashHistory(options) {
  if (options === void 0) {
    options = {};
  }
  function createHashLocation(window, globalHistory) {
    let {
      pathname = "/",
      search = "",
      hash = ""
    } = parsePath(window.location.hash.substr(1));
    // Hash URL should always have a leading / just like window.location.pathname
    // does, so if an app ends up at a route like /#something then we add a
    // leading slash so all of our path-matching behaves the same as if it would
    // in a browser router.  This is particularly important when there exists a
    // root splat route (<Route path="*">) since that matches internally against
    // "/*" and we'd expect /#something to 404 in a hash router app.
    if (!pathname.startsWith("/") && !pathname.startsWith(".")) {
      pathname = "/" + pathname;
    }
    return createLocation("", {
      pathname,
      search,
      hash
    },
    // state defaults to `null` because `window.history.state` does
    globalHistory.state && globalHistory.state.usr || null, globalHistory.state && globalHistory.state.key || "default");
  }
  function createHashHref(window, to) {
    let base = window.document.querySelector("base");
    let href = "";
    if (base && base.getAttribute("href")) {
      let url = window.location.href;
      let hashIndex = url.indexOf("#");
      href = hashIndex === -1 ? url : url.slice(0, hashIndex);
    }
    return href + "#" + (typeof to === "string" ? to : createPath(to));
  }
  function validateHashLocation(location, to) {
    warning(location.pathname.charAt(0) === "/", "relative pathnames are not supported in hash history.push(" + JSON.stringify(to) + ")");
  }
  return getUrlBasedHistory(createHashLocation, createHashHref, validateHashLocation, options);
}
function invariant(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}
function warning(cond, message) {
  if (!cond) {
    // eslint-disable-next-line no-console
    if (typeof console !== "undefined") console.warn(message);
    try {
      // Welcome to debugging history!
      //
      // This error is thrown as a convenience so you can more easily
      // find the source for a warning that appears in the console by
      // enabling "pause on exceptions" in your JavaScript debugger.
      throw new Error(message);
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}
function createKey() {
  return Math.random().toString(36).substr(2, 8);
}
/**
 * For browser-based histories, we combine the state and key into an object
 */
function getHistoryState(location, index) {
  return {
    usr: location.state,
    key: location.key,
    idx: index
  };
}
/**
 * Creates a Location object with a unique key from the given Path
 */
function createLocation(current, to, state, key) {
  if (state === void 0) {
    state = null;
  }
  let location = _extends({
    pathname: typeof current === "string" ? current : current.pathname,
    search: "",
    hash: ""
  }, typeof to === "string" ? parsePath(to) : to, {
    state,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: to && to.key || key || createKey()
  });
  return location;
}
/**
 * Creates a string URL path from the given pathname, search, and hash components.
 */
function createPath(_ref) {
  let {
    pathname = "/",
    search = "",
    hash = ""
  } = _ref;
  if (search && search !== "?") pathname += search.charAt(0) === "?" ? search : "?" + search;
  if (hash && hash !== "#") pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}
/**
 * Parses a string URL path into its separate pathname, search, and hash components.
 */
function parsePath(path) {
  let parsedPath = {};
  if (path) {
    let hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path.substr(hashIndex);
      path = path.substr(0, hashIndex);
    }
    let searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path.substr(searchIndex);
      path = path.substr(0, searchIndex);
    }
    if (path) {
      parsedPath.pathname = path;
    }
  }
  return parsedPath;
}
function getUrlBasedHistory(getLocation, createHref, validateLocation, options) {
  if (options === void 0) {
    options = {};
  }
  let {
    window = document.defaultView,
    v5Compat = false
  } = options;
  let globalHistory = window.history;
  let action = Action.Pop;
  let listener = null;
  let index = getIndex();
  // Index should only be null when we initialize. If not, it's because the
  // user called history.pushState or history.replaceState directly, in which
  // case we should log a warning as it will result in bugs.
  if (index == null) {
    index = 0;
    globalHistory.replaceState(_extends({}, globalHistory.state, {
      idx: index
    }), "");
  }
  function getIndex() {
    let state = globalHistory.state || {
      idx: null
    };
    return state.idx;
  }
  function handlePop() {
    action = Action.Pop;
    let nextIndex = getIndex();
    let delta = nextIndex == null ? null : nextIndex - index;
    index = nextIndex;
    if (listener) {
      listener({
        action,
        location: history.location,
        delta
      });
    }
  }
  function push(to, state) {
    action = Action.Push;
    let location = createLocation(history.location, to, state);
    if (validateLocation) validateLocation(location, to);
    index = getIndex() + 1;
    let historyState = getHistoryState(location, index);
    let url = history.createHref(location);
    // try...catch because iOS limits us to 100 pushState calls :/
    try {
      globalHistory.pushState(historyState, "", url);
    } catch (error) {
      // If the exception is because `state` can't be serialized, let that throw
      // outwards just like a replace call would so the dev knows the cause
      // https://html.spec.whatwg.org/multipage/nav-history-apis.html#shared-history-push/replace-state-steps
      // https://html.spec.whatwg.org/multipage/structured-data.html#structuredserializeinternal
      if (error instanceof DOMException && error.name === "DataCloneError") {
        throw error;
      }
      // They are going to lose state here, but there is no real
      // way to warn them about it since the page will refresh...
      window.location.assign(url);
    }
    if (v5Compat && listener) {
      listener({
        action,
        location: history.location,
        delta: 1
      });
    }
  }
  function replace(to, state) {
    action = Action.Replace;
    let location = createLocation(history.location, to, state);
    if (validateLocation) validateLocation(location, to);
    index = getIndex();
    let historyState = getHistoryState(location, index);
    let url = history.createHref(location);
    globalHistory.replaceState(historyState, "", url);
    if (v5Compat && listener) {
      listener({
        action,
        location: history.location,
        delta: 0
      });
    }
  }
  function createURL(to) {
    // window.location.origin is "null" (the literal string value) in Firefox
    // under certain conditions, notably when serving from a local HTML file
    // See https://bugzilla.mozilla.org/show_bug.cgi?id=878297
    let base = window.location.origin !== "null" ? window.location.origin : window.location.href;
    let href = typeof to === "string" ? to : createPath(to);
    invariant(base, "No window.location.(origin|href) available to create URL for href: " + href);
    return new URL(href, base);
  }
  let history = {
    get action() {
      return action;
    },
    get location() {
      return getLocation(window, globalHistory);
    },
    listen(fn) {
      if (listener) {
        throw new Error("A history only accepts one active listener");
      }
      window.addEventListener(PopStateEventType, handlePop);
      listener = fn;
      return () => {
        window.removeEventListener(PopStateEventType, handlePop);
        listener = null;
      };
    },
    createHref(to) {
      return createHref(window, to);
    },
    createURL,
    encodeLocation(to) {
      // Encode a Location the same way window.location would
      let url = createURL(to);
      return {
        pathname: url.pathname,
        search: url.search,
        hash: url.hash
      };
    },
    push,
    replace,
    go(n) {
      return globalHistory.go(n);
    }
  };
  return history;
}
//#endregion

var ResultType;
(function (ResultType) {
  ResultType["data"] = "data";
  ResultType["deferred"] = "deferred";
  ResultType["redirect"] = "redirect";
  ResultType["error"] = "error";
})(ResultType || (ResultType = {}));
const immutableRouteKeys = new Set(["lazy", "caseSensitive", "path", "id", "index", "children"]);
function isIndexRoute(route) {
  return route.index === true;
}
// Walk the route tree generating unique IDs where necessary so we are working
// solely with AgnosticDataRouteObject's within the Router
function convertRoutesToDataRoutes(routes, mapRouteProperties, parentPath, manifest) {
  if (parentPath === void 0) {
    parentPath = [];
  }
  if (manifest === void 0) {
    manifest = {};
  }
  return routes.map((route, index) => {
    let treePath = [...parentPath, index];
    let id = typeof route.id === "string" ? route.id : treePath.join("-");
    invariant(route.index !== true || !route.children, "Cannot specify children on an index route");
    invariant(!manifest[id], "Found a route id collision on id \"" + id + "\".  Route " + "id's must be globally unique within Data Router usages");
    if (isIndexRoute(route)) {
      let indexRoute = _extends({}, route, mapRouteProperties(route), {
        id
      });
      manifest[id] = indexRoute;
      return indexRoute;
    } else {
      let pathOrLayoutRoute = _extends({}, route, mapRouteProperties(route), {
        id,
        children: undefined
      });
      manifest[id] = pathOrLayoutRoute;
      if (route.children) {
        pathOrLayoutRoute.children = convertRoutesToDataRoutes(route.children, mapRouteProperties, treePath, manifest);
      }
      return pathOrLayoutRoute;
    }
  });
}
/**
 * Matches the given routes to a location and returns the match data.
 *
 * @see https://reactrouter.com/utils/match-routes
 */
function matchRoutes(routes, locationArg, basename) {
  if (basename === void 0) {
    basename = "/";
  }
  let location = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
  let pathname = stripBasename(location.pathname || "/", basename);
  if (pathname == null) {
    return null;
  }
  let branches = flattenRoutes(routes);
  rankRouteBranches(branches);
  let matches = null;
  for (let i = 0; matches == null && i < branches.length; ++i) {
    matches = matchRouteBranch(branches[i],
    // Incoming pathnames are generally encoded from either window.location
    // or from router.navigate, but we want to match against the unencoded
    // paths in the route definitions.  Memory router locations won't be
    // encoded here but there also shouldn't be anything to decode so this
    // should be a safe operation.  This avoids needing matchRoutes to be
    // history-aware.
    safelyDecodeURI(pathname));
  }
  return matches;
}
function flattenRoutes(routes, branches, parentsMeta, parentPath) {
  if (branches === void 0) {
    branches = [];
  }
  if (parentsMeta === void 0) {
    parentsMeta = [];
  }
  if (parentPath === void 0) {
    parentPath = "";
  }
  let flattenRoute = (route, index, relativePath) => {
    let meta = {
      relativePath: relativePath === undefined ? route.path || "" : relativePath,
      caseSensitive: route.caseSensitive === true,
      childrenIndex: index,
      route
    };
    if (meta.relativePath.startsWith("/")) {
      invariant(meta.relativePath.startsWith(parentPath), "Absolute route path \"" + meta.relativePath + "\" nested under path " + ("\"" + parentPath + "\" is not valid. An absolute child route path ") + "must start with the combined path of all its parent routes.");
      meta.relativePath = meta.relativePath.slice(parentPath.length);
    }
    let path = joinPaths([parentPath, meta.relativePath]);
    let routesMeta = parentsMeta.concat(meta);
    // Add the children before adding this route to the array so we traverse the
    // route tree depth-first and child routes appear before their parents in
    // the "flattened" version.
    if (route.children && route.children.length > 0) {
      invariant(
      // Our types know better, but runtime JS may not!
      // @ts-expect-error
      route.index !== true, "Index routes must not have child routes. Please remove " + ("all child routes from route path \"" + path + "\"."));
      flattenRoutes(route.children, branches, routesMeta, path);
    }
    // Routes without a path shouldn't ever match by themselves unless they are
    // index routes, so don't add them to the list of possible branches.
    if (route.path == null && !route.index) {
      return;
    }
    branches.push({
      path,
      score: computeScore(path, route.index),
      routesMeta
    });
  };
  routes.forEach((route, index) => {
    var _route$path;
    // coarse-grain check for optional params
    if (route.path === "" || !((_route$path = route.path) != null && _route$path.includes("?"))) {
      flattenRoute(route, index);
    } else {
      for (let exploded of explodeOptionalSegments(route.path)) {
        flattenRoute(route, index, exploded);
      }
    }
  });
  return branches;
}
/**
 * Computes all combinations of optional path segments for a given path,
 * excluding combinations that are ambiguous and of lower priority.
 *
 * For example, `/one/:two?/three/:four?/:five?` explodes to:
 * - `/one/three`
 * - `/one/:two/three`
 * - `/one/three/:four`
 * - `/one/three/:five`
 * - `/one/:two/three/:four`
 * - `/one/:two/three/:five`
 * - `/one/three/:four/:five`
 * - `/one/:two/three/:four/:five`
 */
function explodeOptionalSegments(path) {
  let segments = path.split("/");
  if (segments.length === 0) return [];
  let [first, ...rest] = segments;
  // Optional path segments are denoted by a trailing `?`
  let isOptional = first.endsWith("?");
  // Compute the corresponding required segment: `foo?` -> `foo`
  let required = first.replace(/\?$/, "");
  if (rest.length === 0) {
    // Intepret empty string as omitting an optional segment
    // `["one", "", "three"]` corresponds to omitting `:two` from `/one/:two?/three` -> `/one/three`
    return isOptional ? [required, ""] : [required];
  }
  let restExploded = explodeOptionalSegments(rest.join("/"));
  let result = [];
  // All child paths with the prefix.  Do this for all children before the
  // optional version for all children so we get consistent ordering where the
  // parent optional aspect is preferred as required.  Otherwise, we can get
  // child sections interspersed where deeper optional segments are higher than
  // parent optional segments, where for example, /:two would explodes _earlier_
  // then /:one.  By always including the parent as required _for all children_
  // first, we avoid this issue
  result.push(...restExploded.map(subpath => subpath === "" ? required : [required, subpath].join("/")));
  // Then if this is an optional value, add all child versions without
  if (isOptional) {
    result.push(...restExploded);
  }
  // for absolute paths, ensure `/` instead of empty segment
  return result.map(exploded => path.startsWith("/") && exploded === "" ? "/" : exploded);
}
function rankRouteBranches(branches) {
  branches.sort((a, b) => a.score !== b.score ? b.score - a.score // Higher score first
  : compareIndexes(a.routesMeta.map(meta => meta.childrenIndex), b.routesMeta.map(meta => meta.childrenIndex)));
}
const paramRe = /^:\w+$/;
const dynamicSegmentValue = 3;
const indexRouteValue = 2;
const emptySegmentValue = 1;
const staticSegmentValue = 10;
const splatPenalty = -2;
const isSplat = s => s === "*";
function computeScore(path, index) {
  let segments = path.split("/");
  let initialScore = segments.length;
  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }
  if (index) {
    initialScore += indexRouteValue;
  }
  return segments.filter(s => !isSplat(s)).reduce((score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue), initialScore);
}
function compareIndexes(a, b) {
  let siblings = a.length === b.length && a.slice(0, -1).every((n, i) => n === b[i]);
  return siblings ?
  // If two routes are siblings, we should try to match the earlier sibling
  // first. This allows people to have fine-grained control over the matching
  // behavior by simply putting routes with identical paths in the order they
  // want them tried.
  a[a.length - 1] - b[b.length - 1] :
  // Otherwise, it doesn't really make sense to rank non-siblings by index,
  // so they sort equally.
  0;
}
function matchRouteBranch(branch, pathname) {
  let {
    routesMeta
  } = branch;
  let matchedParams = {};
  let matchedPathname = "/";
  let matches = [];
  for (let i = 0; i < routesMeta.length; ++i) {
    let meta = routesMeta[i];
    let end = i === routesMeta.length - 1;
    let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
    let match = matchPath({
      path: meta.relativePath,
      caseSensitive: meta.caseSensitive,
      end
    }, remainingPathname);
    if (!match) return null;
    Object.assign(matchedParams, match.params);
    let route = meta.route;
    matches.push({
      // TODO: Can this as be avoided?
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: normalizePathname(joinPaths([matchedPathname, match.pathnameBase])),
      route
    });
    if (match.pathnameBase !== "/") {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }
  }
  return matches;
}
/**
 * Returns a path with params interpolated.
 *
 * @see https://reactrouter.com/utils/generate-path
 */
function generatePath(originalPath, params) {
  if (params === void 0) {
    params = {};
  }
  let path = originalPath;
  if (path.endsWith("*") && path !== "*" && !path.endsWith("/*")) {
    warning(false, "Route path \"" + path + "\" will be treated as if it were " + ("\"" + path.replace(/\*$/, "/*") + "\" because the `*` character must ") + "always follow a `/` in the pattern. To get rid of this warning, " + ("please change the route path to \"" + path.replace(/\*$/, "/*") + "\"."));
    path = path.replace(/\*$/, "/*");
  }
  // ensure `/` is added at the beginning if the path is absolute
  const prefix = path.startsWith("/") ? "/" : "";
  const stringify = p => p == null ? "" : typeof p === "string" ? p : String(p);
  const segments = path.split(/\/+/).map((segment, index, array) => {
    const isLastSegment = index === array.length - 1;
    // only apply the splat if it's the last segment
    if (isLastSegment && segment === "*") {
      const star = "*";
      // Apply the splat
      return stringify(params[star]);
    }
    const keyMatch = segment.match(/^:(\w+)(\??)$/);
    if (keyMatch) {
      const [, key, optional] = keyMatch;
      let param = params[key];
      invariant(optional === "?" || param != null, "Missing \":" + key + "\" param");
      return stringify(param);
    }
    // Remove any optional markers from optional static segments
    return segment.replace(/\?$/g, "");
  })
  // Remove empty segments
  .filter(segment => !!segment);
  return prefix + segments.join("/");
}
/**
 * Performs pattern matching on a URL pathname and returns information about
 * the match.
 *
 * @see https://reactrouter.com/utils/match-path
 */
function matchPath(pattern, pathname) {
  if (typeof pattern === "string") {
    pattern = {
      path: pattern,
      caseSensitive: false,
      end: true
    };
  }
  let [matcher, paramNames] = compilePath(pattern.path, pattern.caseSensitive, pattern.end);
  let match = pathname.match(matcher);
  if (!match) return null;
  let matchedPathname = match[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  let captureGroups = match.slice(1);
  let params = paramNames.reduce((memo, paramName, index) => {
    // We need to compute the pathnameBase here using the raw splat value
    // instead of using params["*"] later because it will be decoded then
    if (paramName === "*") {
      let splatValue = captureGroups[index] || "";
      pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
    }
    memo[paramName] = safelyDecodeURIComponent(captureGroups[index] || "", paramName);
    return memo;
  }, {});
  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern
  };
}
function compilePath(path, caseSensitive, end) {
  if (caseSensitive === void 0) {
    caseSensitive = false;
  }
  if (end === void 0) {
    end = true;
  }
  warning(path === "*" || !path.endsWith("*") || path.endsWith("/*"), "Route path \"" + path + "\" will be treated as if it were " + ("\"" + path.replace(/\*$/, "/*") + "\" because the `*` character must ") + "always follow a `/` in the pattern. To get rid of this warning, " + ("please change the route path to \"" + path.replace(/\*$/, "/*") + "\"."));
  let paramNames = [];
  let regexpSource = "^" + path.replace(/\/*\*?$/, "") // Ignore trailing / and /*, we'll handle it below
  .replace(/^\/*/, "/") // Make sure it has a leading /
  .replace(/[\\.*+^$?{}|()[\]]/g, "\\$&") // Escape special regex chars
  .replace(/\/:(\w+)/g, (_, paramName) => {
    paramNames.push(paramName);
    return "/([^\\/]+)";
  });
  if (path.endsWith("*")) {
    paramNames.push("*");
    regexpSource += path === "*" || path === "/*" ? "(.*)$" // Already matched the initial /, just match the rest
    : "(?:\\/(.+)|\\/*)$"; // Don't include the / in params["*"]
  } else if (end) {
    // When matching to the end, ignore trailing slashes
    regexpSource += "\\/*$";
  } else if (path !== "" && path !== "/") {
    // If our path is non-empty and contains anything beyond an initial slash,
    // then we have _some_ form of path in our regex so we should expect to
    // match only if we find the end of this path segment.  Look for an optional
    // non-captured trailing slash (to match a portion of the URL) or the end
    // of the path (if we've matched to the end).  We used to do this with a
    // word boundary but that gives false positives on routes like
    // /user-preferences since `-` counts as a word boundary.
    regexpSource += "(?:(?=\\/|$))";
  } else ;
  let matcher = new RegExp(regexpSource, caseSensitive ? undefined : "i");
  return [matcher, paramNames];
}
function safelyDecodeURI(value) {
  try {
    return decodeURI(value);
  } catch (error) {
    warning(false, "The URL path \"" + value + "\" could not be decoded because it is is a " + "malformed URL segment. This is probably due to a bad percent " + ("encoding (" + error + ")."));
    return value;
  }
}
function safelyDecodeURIComponent(value, paramName) {
  try {
    return decodeURIComponent(value);
  } catch (error) {
    warning(false, "The value for the URL param \"" + paramName + "\" will not be decoded because" + (" the string \"" + value + "\" is a malformed URL segment. This is probably") + (" due to a bad percent encoding (" + error + ")."));
    return value;
  }
}
/**
 * @private
 */
function stripBasename(pathname, basename) {
  if (basename === "/") return pathname;
  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }
  // We want to leave trailing slash behavior in the user's control, so if they
  // specify a basename with a trailing slash, we should support it
  let startIndex = basename.endsWith("/") ? basename.length - 1 : basename.length;
  let nextChar = pathname.charAt(startIndex);
  if (nextChar && nextChar !== "/") {
    // pathname does not start with basename/
    return null;
  }
  return pathname.slice(startIndex) || "/";
}
/**
 * Returns a resolved path object relative to the given pathname.
 *
 * @see https://reactrouter.com/utils/resolve-path
 */
function resolvePath(to, fromPathname) {
  if (fromPathname === void 0) {
    fromPathname = "/";
  }
  let {
    pathname: toPathname,
    search = "",
    hash = ""
  } = typeof to === "string" ? parsePath(to) : to;
  let pathname = toPathname ? toPathname.startsWith("/") ? toPathname : resolvePathname(toPathname, fromPathname) : fromPathname;
  return {
    pathname,
    search: normalizeSearch(search),
    hash: normalizeHash(hash)
  };
}
function resolvePathname(relativePath, fromPathname) {
  let segments = fromPathname.replace(/\/+$/, "").split("/");
  let relativeSegments = relativePath.split("/");
  relativeSegments.forEach(segment => {
    if (segment === "..") {
      // Keep the root "" segment so the pathname starts at /
      if (segments.length > 1) segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });
  return segments.length > 1 ? segments.join("/") : "/";
}
function getInvalidPathError(char, field, dest, path) {
  return "Cannot include a '" + char + "' character in a manually specified " + ("`to." + field + "` field [" + JSON.stringify(path) + "].  Please separate it out to the ") + ("`to." + dest + "` field. Alternatively you may provide the full path as ") + "a string in <Link to=\"...\"> and the router will parse it for you.";
}
/**
 * @private
 *
 * When processing relative navigation we want to ignore ancestor routes that
 * do not contribute to the path, such that index/pathless layout routes don't
 * interfere.
 *
 * For example, when moving a route element into an index route and/or a
 * pathless layout route, relative link behavior contained within should stay
 * the same.  Both of the following examples should link back to the root:
 *
 *   <Route path="/">
 *     <Route path="accounts" element={<Link to=".."}>
 *   </Route>
 *
 *   <Route path="/">
 *     <Route path="accounts">
 *       <Route element={<AccountsLayout />}>       // <-- Does not contribute
 *         <Route index element={<Link to=".."} />  // <-- Does not contribute
 *       </Route
 *     </Route>
 *   </Route>
 */
function getPathContributingMatches(matches) {
  return matches.filter((match, index) => index === 0 || match.route.path && match.route.path.length > 0);
}
/**
 * @private
 */
function resolveTo(toArg, routePathnames, locationPathname, isPathRelative) {
  if (isPathRelative === void 0) {
    isPathRelative = false;
  }
  let to;
  if (typeof toArg === "string") {
    to = parsePath(toArg);
  } else {
    to = _extends({}, toArg);
    invariant(!to.pathname || !to.pathname.includes("?"), getInvalidPathError("?", "pathname", "search", to));
    invariant(!to.pathname || !to.pathname.includes("#"), getInvalidPathError("#", "pathname", "hash", to));
    invariant(!to.search || !to.search.includes("#"), getInvalidPathError("#", "search", "hash", to));
  }
  let isEmptyPath = toArg === "" || to.pathname === "";
  let toPathname = isEmptyPath ? "/" : to.pathname;
  let from;
  // Routing is relative to the current pathname if explicitly requested.
  //
  // If a pathname is explicitly provided in `to`, it should be relative to the
  // route context. This is explained in `Note on `<Link to>` values` in our
  // migration guide from v5 as a means of disambiguation between `to` values
  // that begin with `/` and those that do not. However, this is problematic for
  // `to` values that do not provide a pathname. `to` can simply be a search or
  // hash string, in which case we should assume that the navigation is relative
  // to the current location's pathname and *not* the route pathname.
  if (isPathRelative || toPathname == null) {
    from = locationPathname;
  } else {
    let routePathnameIndex = routePathnames.length - 1;
    if (toPathname.startsWith("..")) {
      let toSegments = toPathname.split("/");
      // Each leading .. segment means "go up one route" instead of "go up one
      // URL segment".  This is a key difference from how <a href> works and a
      // major reason we call this a "to" value instead of a "href".
      while (toSegments[0] === "..") {
        toSegments.shift();
        routePathnameIndex -= 1;
      }
      to.pathname = toSegments.join("/");
    }
    // If there are more ".." segments than parent routes, resolve relative to
    // the root / URL.
    from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
  }
  let path = resolvePath(to, from);
  // Ensure the pathname has a trailing slash if the original "to" had one
  let hasExplicitTrailingSlash = toPathname && toPathname !== "/" && toPathname.endsWith("/");
  // Or if this was a link to the current path which has a trailing slash
  let hasCurrentTrailingSlash = (isEmptyPath || toPathname === ".") && locationPathname.endsWith("/");
  if (!path.pathname.endsWith("/") && (hasExplicitTrailingSlash || hasCurrentTrailingSlash)) {
    path.pathname += "/";
  }
  return path;
}
/**
 * @private
 */
function getToPathname(to) {
  // Empty strings should be treated the same as / paths
  return to === "" || to.pathname === "" ? "/" : typeof to === "string" ? parsePath(to).pathname : to.pathname;
}
/**
 * @private
 */
const joinPaths = paths => paths.join("/").replace(/\/\/+/g, "/");
/**
 * @private
 */
const normalizePathname = pathname => pathname.replace(/\/+$/, "").replace(/^\/*/, "/");
/**
 * @private
 */
const normalizeSearch = search => !search || search === "?" ? "" : search.startsWith("?") ? search : "?" + search;
/**
 * @private
 */
const normalizeHash = hash => !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash;
/**
 * This is a shortcut for creating `application/json` responses. Converts `data`
 * to JSON and sets the `Content-Type` header.
 */
const json = function json(data, init) {
  if (init === void 0) {
    init = {};
  }
  let responseInit = typeof init === "number" ? {
    status: init
  } : init;
  let headers = new Headers(responseInit.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  }
  return new Response(JSON.stringify(data), _extends({}, responseInit, {
    headers
  }));
};
class AbortedDeferredError extends Error {}
class DeferredData {
  constructor(data, responseInit) {
    this.pendingKeysSet = new Set();
    this.subscribers = new Set();
    this.deferredKeys = [];
    invariant(data && typeof data === "object" && !Array.isArray(data), "defer() only accepts plain objects");
    // Set up an AbortController + Promise we can race against to exit early
    // cancellation
    let reject;
    this.abortPromise = new Promise((_, r) => reject = r);
    this.controller = new AbortController();
    let onAbort = () => reject(new AbortedDeferredError("Deferred data aborted"));
    this.unlistenAbortSignal = () => this.controller.signal.removeEventListener("abort", onAbort);
    this.controller.signal.addEventListener("abort", onAbort);
    this.data = Object.entries(data).reduce((acc, _ref) => {
      let [key, value] = _ref;
      return Object.assign(acc, {
        [key]: this.trackPromise(key, value)
      });
    }, {});
    if (this.done) {
      // All incoming values were resolved
      this.unlistenAbortSignal();
    }
    this.init = responseInit;
  }
  trackPromise(key, value) {
    if (!(value instanceof Promise)) {
      return value;
    }
    this.deferredKeys.push(key);
    this.pendingKeysSet.add(key);
    // We store a little wrapper promise that will be extended with
    // _data/_error props upon resolve/reject
    let promise = Promise.race([value, this.abortPromise]).then(data => this.onSettle(promise, key, undefined, data), error => this.onSettle(promise, key, error));
    // Register rejection listeners to avoid uncaught promise rejections on
    // errors or aborted deferred values
    promise.catch(() => {});
    Object.defineProperty(promise, "_tracked", {
      get: () => true
    });
    return promise;
  }
  onSettle(promise, key, error, data) {
    if (this.controller.signal.aborted && error instanceof AbortedDeferredError) {
      this.unlistenAbortSignal();
      Object.defineProperty(promise, "_error", {
        get: () => error
      });
      return Promise.reject(error);
    }
    this.pendingKeysSet.delete(key);
    if (this.done) {
      // Nothing left to abort!
      this.unlistenAbortSignal();
    }
    // If the promise was resolved/rejected with undefined, we'll throw an error as you
    // should always resolve with a value or null
    if (error === undefined && data === undefined) {
      let undefinedError = new Error("Deferred data for key \"" + key + "\" resolved/rejected with `undefined`, " + "you must resolve/reject with a value or `null`.");
      Object.defineProperty(promise, "_error", {
        get: () => undefinedError
      });
      this.emit(false, key);
      return Promise.reject(undefinedError);
    }
    if (data === undefined) {
      Object.defineProperty(promise, "_error", {
        get: () => error
      });
      this.emit(false, key);
      return Promise.reject(error);
    }
    Object.defineProperty(promise, "_data", {
      get: () => data
    });
    this.emit(false, key);
    return data;
  }
  emit(aborted, settledKey) {
    this.subscribers.forEach(subscriber => subscriber(aborted, settledKey));
  }
  subscribe(fn) {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }
  cancel() {
    this.controller.abort();
    this.pendingKeysSet.forEach((v, k) => this.pendingKeysSet.delete(k));
    this.emit(true);
  }
  async resolveData(signal) {
    let aborted = false;
    if (!this.done) {
      let onAbort = () => this.cancel();
      signal.addEventListener("abort", onAbort);
      aborted = await new Promise(resolve => {
        this.subscribe(aborted => {
          signal.removeEventListener("abort", onAbort);
          if (aborted || this.done) {
            resolve(aborted);
          }
        });
      });
    }
    return aborted;
  }
  get done() {
    return this.pendingKeysSet.size === 0;
  }
  get unwrappedData() {
    invariant(this.data !== null && this.done, "Can only unwrap data on initialized and settled deferreds");
    return Object.entries(this.data).reduce((acc, _ref2) => {
      let [key, value] = _ref2;
      return Object.assign(acc, {
        [key]: unwrapTrackedPromise(value)
      });
    }, {});
  }
  get pendingKeys() {
    return Array.from(this.pendingKeysSet);
  }
}
function isTrackedPromise(value) {
  return value instanceof Promise && value._tracked === true;
}
function unwrapTrackedPromise(value) {
  if (!isTrackedPromise(value)) {
    return value;
  }
  if (value._error) {
    throw value._error;
  }
  return value._data;
}
const defer = function defer(data, init) {
  if (init === void 0) {
    init = {};
  }
  let responseInit = typeof init === "number" ? {
    status: init
  } : init;
  return new DeferredData(data, responseInit);
};
/**
 * A redirect response. Sets the status code and the `Location` header.
 * Defaults to "302 Found".
 */
const redirect = function redirect(url, init) {
  if (init === void 0) {
    init = 302;
  }
  let responseInit = init;
  if (typeof responseInit === "number") {
    responseInit = {
      status: responseInit
    };
  } else if (typeof responseInit.status === "undefined") {
    responseInit.status = 302;
  }
  let headers = new Headers(responseInit.headers);
  headers.set("Location", url);
  return new Response(null, _extends({}, responseInit, {
    headers
  }));
};
/**
 * A redirect response that will force a document reload to the new location.
 * Sets the status code and the `Location` header.
 * Defaults to "302 Found".
 */
const redirectDocument = (url, init) => {
  let response = redirect(url, init);
  response.headers.set("X-Remix-Reload-Document", "true");
  return response;
};
/**
 * @private
 * Utility class we use to hold auto-unwrapped 4xx/5xx Response bodies
 */
class ErrorResponse {
  constructor(status, statusText, data, internal) {
    if (internal === void 0) {
      internal = false;
    }
    this.status = status;
    this.statusText = statusText || "";
    this.internal = internal;
    if (data instanceof Error) {
      this.data = data.toString();
      this.error = data;
    } else {
      this.data = data;
    }
  }
}
/**
 * Check if the given error is an ErrorResponse generated from a 4xx/5xx
 * Response thrown from an action/loader
 */
function isRouteErrorResponse(error) {
  return error != null && typeof error.status === "number" && typeof error.statusText === "string" && typeof error.internal === "boolean" && "data" in error;
}

const validMutationMethodsArr = ["post", "put", "patch", "delete"];
const validMutationMethods = new Set(validMutationMethodsArr);
const validRequestMethodsArr = ["get", ...validMutationMethodsArr];
const validRequestMethods = new Set(validRequestMethodsArr);
const redirectStatusCodes = new Set([301, 302, 303, 307, 308]);
const redirectPreserveMethodStatusCodes = new Set([307, 308]);
const IDLE_NAVIGATION = {
  state: "idle",
  location: undefined,
  formMethod: undefined,
  formAction: undefined,
  formEncType: undefined,
  formData: undefined,
  json: undefined,
  text: undefined
};
const IDLE_FETCHER = {
  state: "idle",
  data: undefined,
  formMethod: undefined,
  formAction: undefined,
  formEncType: undefined,
  formData: undefined,
  json: undefined,
  text: undefined
};
const IDLE_BLOCKER = {
  state: "unblocked",
  proceed: undefined,
  reset: undefined,
  location: undefined
};
const ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
const defaultMapRouteProperties = route => ({
  hasErrorBoundary: Boolean(route.hasErrorBoundary)
});
//#endregion
////////////////////////////////////////////////////////////////////////////////
//#region createRouter
////////////////////////////////////////////////////////////////////////////////
/**
 * Create a router and listen to history POP navigations
 */
function createRouter(init) {
  const routerWindow = init.window ? init.window : typeof window !== "undefined" ? window : undefined;
  const isBrowser = typeof routerWindow !== "undefined" && typeof routerWindow.document !== "undefined" && typeof routerWindow.document.createElement !== "undefined";
  const isServer = !isBrowser;
  invariant(init.routes.length > 0, "You must provide a non-empty routes array to createRouter");
  let mapRouteProperties;
  if (init.mapRouteProperties) {
    mapRouteProperties = init.mapRouteProperties;
  } else if (init.detectErrorBoundary) {
    // If they are still using the deprecated version, wrap it with the new API
    let detectErrorBoundary = init.detectErrorBoundary;
    mapRouteProperties = route => ({
      hasErrorBoundary: detectErrorBoundary(route)
    });
  } else {
    mapRouteProperties = defaultMapRouteProperties;
  }
  // Routes keyed by ID
  let manifest = {};
  // Routes in tree format for matching
  let dataRoutes = convertRoutesToDataRoutes(init.routes, mapRouteProperties, undefined, manifest);
  let inFlightDataRoutes;
  let basename = init.basename || "/";
  // Config driven behavior flags
  let future = _extends({
    v7_normalizeFormMethod: false,
    v7_prependBasename: false
  }, init.future);
  // Cleanup function for history
  let unlistenHistory = null;
  // Externally-provided functions to call on all state changes
  let subscribers = new Set();
  // Externally-provided object to hold scroll restoration locations during routing
  let savedScrollPositions = null;
  // Externally-provided function to get scroll restoration keys
  let getScrollRestorationKey = null;
  // Externally-provided function to get current scroll position
  let getScrollPosition = null;
  // One-time flag to control the initial hydration scroll restoration.  Because
  // we don't get the saved positions from <ScrollRestoration /> until _after_
  // the initial render, we need to manually trigger a separate updateState to
  // send along the restoreScrollPosition
  // Set to true if we have `hydrationData` since we assume we were SSR'd and that
  // SSR did the initial scroll restoration.
  let initialScrollRestored = init.hydrationData != null;
  let initialMatches = matchRoutes(dataRoutes, init.history.location, basename);
  let initialErrors = null;
  if (initialMatches == null) {
    // If we do not match a user-provided-route, fall back to the root
    // to allow the error boundary to take over
    let error = getInternalRouterError(404, {
      pathname: init.history.location.pathname
    });
    let {
      matches,
      route
    } = getShortCircuitMatches(dataRoutes);
    initialMatches = matches;
    initialErrors = {
      [route.id]: error
    };
  }
  let initialized =
  // All initialMatches need to be loaded before we're ready.  If we have lazy
  // functions around still then we'll need to run them in initialize()
  !initialMatches.some(m => m.route.lazy) && (
  // And we have to either have no loaders or have been provided hydrationData
  !initialMatches.some(m => m.route.loader) || init.hydrationData != null);
  let router;
  let state = {
    historyAction: init.history.action,
    location: init.history.location,
    matches: initialMatches,
    initialized,
    navigation: IDLE_NAVIGATION,
    // Don't restore on initial updateState() if we were SSR'd
    restoreScrollPosition: init.hydrationData != null ? false : null,
    preventScrollReset: false,
    revalidation: "idle",
    loaderData: init.hydrationData && init.hydrationData.loaderData || {},
    actionData: init.hydrationData && init.hydrationData.actionData || null,
    errors: init.hydrationData && init.hydrationData.errors || initialErrors,
    fetchers: new Map(),
    blockers: new Map()
  };
  // -- Stateful internal variables to manage navigations --
  // Current navigation in progress (to be committed in completeNavigation)
  let pendingAction = Action.Pop;
  // Should the current navigation prevent the scroll reset if scroll cannot
  // be restored?
  let pendingPreventScrollReset = false;
  // AbortController for the active navigation
  let pendingNavigationController;
  // We use this to avoid touching history in completeNavigation if a
  // revalidation is entirely uninterrupted
  let isUninterruptedRevalidation = false;
  // Use this internal flag to force revalidation of all loaders:
  //  - submissions (completed or interrupted)
  //  - useRevalidator()
  //  - X-Remix-Revalidate (from redirect)
  let isRevalidationRequired = false;
  // Use this internal array to capture routes that require revalidation due
  // to a cancelled deferred on action submission
  let cancelledDeferredRoutes = [];
  // Use this internal array to capture fetcher loads that were cancelled by an
  // action navigation and require revalidation
  let cancelledFetcherLoads = [];
  // AbortControllers for any in-flight fetchers
  let fetchControllers = new Map();
  // Track loads based on the order in which they started
  let incrementingLoadId = 0;
  // Track the outstanding pending navigation data load to be compared against
  // the globally incrementing load when a fetcher load lands after a completed
  // navigation
  let pendingNavigationLoadId = -1;
  // Fetchers that triggered data reloads as a result of their actions
  let fetchReloadIds = new Map();
  // Fetchers that triggered redirect navigations
  let fetchRedirectIds = new Set();
  // Most recent href/match for fetcher.load calls for fetchers
  let fetchLoadMatches = new Map();
  // Store DeferredData instances for active route matches.  When a
  // route loader returns defer() we stick one in here.  Then, when a nested
  // promise resolves we update loaderData.  If a new navigation starts we
  // cancel active deferreds for eliminated routes.
  let activeDeferreds = new Map();
  // Store blocker functions in a separate Map outside of router state since
  // we don't need to update UI state if they change
  let blockerFunctions = new Map();
  // Flag to ignore the next history update, so we can revert the URL change on
  // a POP navigation that was blocked by the user without touching router state
  let ignoreNextHistoryUpdate = false;
  // Initialize the router, all side effects should be kicked off from here.
  // Implemented as a Fluent API for ease of:
  //   let router = createRouter(init).initialize();
  function initialize() {
    // If history informs us of a POP navigation, start the navigation but do not update
    // state.  We'll update our own state once the navigation completes
    unlistenHistory = init.history.listen(_ref => {
      let {
        action: historyAction,
        location,
        delta
      } = _ref;
      // Ignore this event if it was just us resetting the URL from a
      // blocked POP navigation
      if (ignoreNextHistoryUpdate) {
        ignoreNextHistoryUpdate = false;
        return;
      }
      warning(blockerFunctions.size === 0 || delta != null, "You are trying to use a blocker on a POP navigation to a location " + "that was not created by @remix-run/router. This will fail silently in " + "production. This can happen if you are navigating outside the router " + "via `window.history.pushState`/`window.location.hash` instead of using " + "router navigation APIs.  This can also happen if you are using " + "createHashRouter and the user manually changes the URL.");
      let blockerKey = shouldBlockNavigation({
        currentLocation: state.location,
        nextLocation: location,
        historyAction
      });
      if (blockerKey && delta != null) {
        // Restore the URL to match the current UI, but don't update router state
        ignoreNextHistoryUpdate = true;
        init.history.go(delta * -1);
        // Put the blocker into a blocked state
        updateBlocker(blockerKey, {
          state: "blocked",
          location,
          proceed() {
            updateBlocker(blockerKey, {
              state: "proceeding",
              proceed: undefined,
              reset: undefined,
              location
            });
            // Re-do the same POP navigation we just blocked
            init.history.go(delta);
          },
          reset() {
            let blockers = new Map(state.blockers);
            blockers.set(blockerKey, IDLE_BLOCKER);
            updateState({
              blockers
            });
          }
        });
        return;
      }
      return startNavigation(historyAction, location);
    });
    // Kick off initial data load if needed.  Use Pop to avoid modifying history
    // Note we don't do any handling of lazy here.  For SPA's it'll get handled
    // in the normal navigation flow.  For SSR it's expected that lazy modules are
    // resolved prior to router creation since we can't go into a fallbackElement
    // UI for SSR'd apps
    if (!state.initialized) {
      startNavigation(Action.Pop, state.location);
    }
    return router;
  }
  // Clean up a router and it's side effects
  function dispose() {
    if (unlistenHistory) {
      unlistenHistory();
    }
    subscribers.clear();
    pendingNavigationController && pendingNavigationController.abort();
    state.fetchers.forEach((_, key) => deleteFetcher(key));
    state.blockers.forEach((_, key) => deleteBlocker(key));
  }
  // Subscribe to state updates for the router
  function subscribe(fn) {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  }
  // Update our state and notify the calling context of the change
  function updateState(newState) {
    state = _extends({}, state, newState);
    subscribers.forEach(subscriber => subscriber(state));
  }
  // Complete a navigation returning the state.navigation back to the IDLE_NAVIGATION
  // and setting state.[historyAction/location/matches] to the new route.
  // - Location is a required param
  // - Navigation will always be set to IDLE_NAVIGATION
  // - Can pass any other state in newState
  function completeNavigation(location, newState) {
    var _location$state, _location$state2;
    // Deduce if we're in a loading/actionReload state:
    // - We have committed actionData in the store
    // - The current navigation was a mutation submission
    // - We're past the submitting state and into the loading state
    // - The location being loaded is not the result of a redirect
    let isActionReload = state.actionData != null && state.navigation.formMethod != null && isMutationMethod(state.navigation.formMethod) && state.navigation.state === "loading" && ((_location$state = location.state) == null ? void 0 : _location$state._isRedirect) !== true;
    let actionData;
    if (newState.actionData) {
      if (Object.keys(newState.actionData).length > 0) {
        actionData = newState.actionData;
      } else {
        // Empty actionData -> clear prior actionData due to an action error
        actionData = null;
      }
    } else if (isActionReload) {
      // Keep the current data if we're wrapping up the action reload
      actionData = state.actionData;
    } else {
      // Clear actionData on any other completed navigations
      actionData = null;
    }
    // Always preserve any existing loaderData from re-used routes
    let loaderData = newState.loaderData ? mergeLoaderData(state.loaderData, newState.loaderData, newState.matches || [], newState.errors) : state.loaderData;
    // On a successful navigation we can assume we got through all blockers
    // so we can start fresh
    let blockers = state.blockers;
    if (blockers.size > 0) {
      blockers = new Map(blockers);
      blockers.forEach((_, k) => blockers.set(k, IDLE_BLOCKER));
    }
    // Always respect the user flag.  Otherwise don't reset on mutation
    // submission navigations unless they redirect
    let preventScrollReset = pendingPreventScrollReset === true || state.navigation.formMethod != null && isMutationMethod(state.navigation.formMethod) && ((_location$state2 = location.state) == null ? void 0 : _location$state2._isRedirect) !== true;
    if (inFlightDataRoutes) {
      dataRoutes = inFlightDataRoutes;
      inFlightDataRoutes = undefined;
    }
    if (isUninterruptedRevalidation) ; else if (pendingAction === Action.Pop) ; else if (pendingAction === Action.Push) {
      init.history.push(location, location.state);
    } else if (pendingAction === Action.Replace) {
      init.history.replace(location, location.state);
    }
    updateState(_extends({}, newState, {
      actionData,
      loaderData,
      historyAction: pendingAction,
      location,
      initialized: true,
      navigation: IDLE_NAVIGATION,
      revalidation: "idle",
      restoreScrollPosition: getSavedScrollPosition(location, newState.matches || state.matches),
      preventScrollReset,
      blockers
    }));
    // Reset stateful navigation vars
    pendingAction = Action.Pop;
    pendingPreventScrollReset = false;
    isUninterruptedRevalidation = false;
    isRevalidationRequired = false;
    cancelledDeferredRoutes = [];
    cancelledFetcherLoads = [];
  }
  // Trigger a navigation event, which can either be a numerical POP or a PUSH
  // replace with an optional submission
  async function navigate(to, opts) {
    if (typeof to === "number") {
      init.history.go(to);
      return;
    }
    let normalizedPath = normalizeTo(state.location, state.matches, basename, future.v7_prependBasename, to, opts == null ? void 0 : opts.fromRouteId, opts == null ? void 0 : opts.relative);
    let {
      path,
      submission,
      error
    } = normalizeNavigateOptions(future.v7_normalizeFormMethod, false, normalizedPath, opts);
    let currentLocation = state.location;
    let nextLocation = createLocation(state.location, path, opts && opts.state);
    // When using navigate as a PUSH/REPLACE we aren't reading an already-encoded
    // URL from window.location, so we need to encode it here so the behavior
    // remains the same as POP and non-data-router usages.  new URL() does all
    // the same encoding we'd get from a history.pushState/window.location read
    // without having to touch history
    nextLocation = _extends({}, nextLocation, init.history.encodeLocation(nextLocation));
    let userReplace = opts && opts.replace != null ? opts.replace : undefined;
    let historyAction = Action.Push;
    if (userReplace === true) {
      historyAction = Action.Replace;
    } else if (userReplace === false) ; else if (submission != null && isMutationMethod(submission.formMethod) && submission.formAction === state.location.pathname + state.location.search) {
      // By default on submissions to the current location we REPLACE so that
      // users don't have to double-click the back button to get to the prior
      // location.  If the user redirects to a different location from the
      // action/loader this will be ignored and the redirect will be a PUSH
      historyAction = Action.Replace;
    }
    let preventScrollReset = opts && "preventScrollReset" in opts ? opts.preventScrollReset === true : undefined;
    let blockerKey = shouldBlockNavigation({
      currentLocation,
      nextLocation,
      historyAction
    });
    if (blockerKey) {
      // Put the blocker into a blocked state
      updateBlocker(blockerKey, {
        state: "blocked",
        location: nextLocation,
        proceed() {
          updateBlocker(blockerKey, {
            state: "proceeding",
            proceed: undefined,
            reset: undefined,
            location: nextLocation
          });
          // Send the same navigation through
          navigate(to, opts);
        },
        reset() {
          let blockers = new Map(state.blockers);
          blockers.set(blockerKey, IDLE_BLOCKER);
          updateState({
            blockers
          });
        }
      });
      return;
    }
    return await startNavigation(historyAction, nextLocation, {
      submission,
      // Send through the formData serialization error if we have one so we can
      // render at the right error boundary after we match routes
      pendingError: error,
      preventScrollReset,
      replace: opts && opts.replace
    });
  }
  // Revalidate all current loaders.  If a navigation is in progress or if this
  // is interrupted by a navigation, allow this to "succeed" by calling all
  // loaders during the next loader round
  function revalidate() {
    interruptActiveLoads();
    updateState({
      revalidation: "loading"
    });
    // If we're currently submitting an action, we don't need to start a new
    // navigation, we'll just let the follow up loader execution call all loaders
    if (state.navigation.state === "submitting") {
      return;
    }
    // If we're currently in an idle state, start a new navigation for the current
    // action/location and mark it as uninterrupted, which will skip the history
    // update in completeNavigation
    if (state.navigation.state === "idle") {
      startNavigation(state.historyAction, state.location, {
        startUninterruptedRevalidation: true
      });
      return;
    }
    // Otherwise, if we're currently in a loading state, just start a new
    // navigation to the navigation.location but do not trigger an uninterrupted
    // revalidation so that history correctly updates once the navigation completes
    startNavigation(pendingAction || state.historyAction, state.navigation.location, {
      overrideNavigation: state.navigation
    });
  }
  // Start a navigation to the given action/location.  Can optionally provide a
  // overrideNavigation which will override the normalLoad in the case of a redirect
  // navigation
  async function startNavigation(historyAction, location, opts) {
    // Abort any in-progress navigations and start a new one. Unset any ongoing
    // uninterrupted revalidations unless told otherwise, since we want this
    // new navigation to update history normally
    pendingNavigationController && pendingNavigationController.abort();
    pendingNavigationController = null;
    pendingAction = historyAction;
    isUninterruptedRevalidation = (opts && opts.startUninterruptedRevalidation) === true;
    // Save the current scroll position every time we start a new navigation,
    // and track whether we should reset scroll on completion
    saveScrollPosition(state.location, state.matches);
    pendingPreventScrollReset = (opts && opts.preventScrollReset) === true;
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let loadingNavigation = opts && opts.overrideNavigation;
    let matches = matchRoutes(routesToUse, location, basename);
    // Short circuit with a 404 on the root error boundary if we match nothing
    if (!matches) {
      let error = getInternalRouterError(404, {
        pathname: location.pathname
      });
      let {
        matches: notFoundMatches,
        route
      } = getShortCircuitMatches(routesToUse);
      // Cancel all pending deferred on 404s since we don't keep any routes
      cancelActiveDeferreds();
      completeNavigation(location, {
        matches: notFoundMatches,
        loaderData: {},
        errors: {
          [route.id]: error
        }
      });
      return;
    }
    // Short circuit if it's only a hash change and not a revalidation or
    // mutation submission.
    //
    // Ignore on initial page loads because since the initial load will always
    // be "same hash".  For example, on /page#hash and submit a <Form method="post">
    // which will default to a navigation to /page
    if (state.initialized && !isRevalidationRequired && isHashChangeOnly(state.location, location) && !(opts && opts.submission && isMutationMethod(opts.submission.formMethod))) {
      completeNavigation(location, {
        matches
      });
      return;
    }
    // Create a controller/Request for this navigation
    pendingNavigationController = new AbortController();
    let request = createClientSideRequest(init.history, location, pendingNavigationController.signal, opts && opts.submission);
    let pendingActionData;
    let pendingError;
    if (opts && opts.pendingError) {
      // If we have a pendingError, it means the user attempted a GET submission
      // with binary FormData so assign here and skip to handleLoaders.  That
      // way we handle calling loaders above the boundary etc.  It's not really
      // different from an actionError in that sense.
      pendingError = {
        [findNearestBoundary(matches).route.id]: opts.pendingError
      };
    } else if (opts && opts.submission && isMutationMethod(opts.submission.formMethod)) {
      // Call action if we received an action submission
      let actionOutput = await handleAction(request, location, opts.submission, matches, {
        replace: opts.replace
      });
      if (actionOutput.shortCircuited) {
        return;
      }
      pendingActionData = actionOutput.pendingActionData;
      pendingError = actionOutput.pendingActionError;
      loadingNavigation = getLoadingNavigation(location, opts.submission);
      // Create a GET request for the loaders
      request = new Request(request.url, {
        signal: request.signal
      });
    }
    // Call loaders
    let {
      shortCircuited,
      loaderData,
      errors
    } = await handleLoaders(request, location, matches, loadingNavigation, opts && opts.submission, opts && opts.fetcherSubmission, opts && opts.replace, pendingActionData, pendingError);
    if (shortCircuited) {
      return;
    }
    // Clean up now that the action/loaders have completed.  Don't clean up if
    // we short circuited because pendingNavigationController will have already
    // been assigned to a new controller for the next navigation
    pendingNavigationController = null;
    completeNavigation(location, _extends({
      matches
    }, pendingActionData ? {
      actionData: pendingActionData
    } : {}, {
      loaderData,
      errors
    }));
  }
  // Call the action matched by the leaf route for this navigation and handle
  // redirects/errors
  async function handleAction(request, location, submission, matches, opts) {
    if (opts === void 0) {
      opts = {};
    }
    interruptActiveLoads();
    // Put us in a submitting state
    let navigation = getSubmittingNavigation(location, submission);
    updateState({
      navigation
    });
    // Call our action and get the result
    let result;
    let actionMatch = getTargetMatch(matches, location);
    if (!actionMatch.route.action && !actionMatch.route.lazy) {
      result = {
        type: ResultType.error,
        error: getInternalRouterError(405, {
          method: request.method,
          pathname: location.pathname,
          routeId: actionMatch.route.id
        })
      };
    } else {
      result = await callLoaderOrAction("action", request, actionMatch, matches, manifest, mapRouteProperties, basename);
      if (request.signal.aborted) {
        return {
          shortCircuited: true
        };
      }
    }
    if (isRedirectResult(result)) {
      let replace;
      if (opts && opts.replace != null) {
        replace = opts.replace;
      } else {
        // If the user didn't explicity indicate replace behavior, replace if
        // we redirected to the exact same location we're currently at to avoid
        // double back-buttons
        replace = result.location === state.location.pathname + state.location.search;
      }
      await startRedirectNavigation(state, result, {
        submission,
        replace
      });
      return {
        shortCircuited: true
      };
    }
    if (isErrorResult(result)) {
      // Store off the pending error - we use it to determine which loaders
      // to call and will commit it when we complete the navigation
      let boundaryMatch = findNearestBoundary(matches, actionMatch.route.id);
      // By default, all submissions are REPLACE navigations, but if the
      // action threw an error that'll be rendered in an errorElement, we fall
      // back to PUSH so that the user can use the back button to get back to
      // the pre-submission form location to try again
      if ((opts && opts.replace) !== true) {
        pendingAction = Action.Push;
      }
      return {
        // Send back an empty object we can use to clear out any prior actionData
        pendingActionData: {},
        pendingActionError: {
          [boundaryMatch.route.id]: result.error
        }
      };
    }
    if (isDeferredResult(result)) {
      throw getInternalRouterError(400, {
        type: "defer-action"
      });
    }
    return {
      pendingActionData: {
        [actionMatch.route.id]: result.data
      }
    };
  }
  // Call all applicable loaders for the given matches, handling redirects,
  // errors, etc.
  async function handleLoaders(request, location, matches, overrideNavigation, submission, fetcherSubmission, replace, pendingActionData, pendingError) {
    // Figure out the right navigation we want to use for data loading
    let loadingNavigation = overrideNavigation || getLoadingNavigation(location, submission);
    // If this was a redirect from an action we don't have a "submission" but
    // we have it on the loading navigation so use that if available
    let activeSubmission = submission || fetcherSubmission || getSubmissionFromNavigation(loadingNavigation);
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let [matchesToLoad, revalidatingFetchers] = getMatchesToLoad(init.history, state, matches, activeSubmission, location, isRevalidationRequired, cancelledDeferredRoutes, cancelledFetcherLoads, fetchLoadMatches, fetchRedirectIds, routesToUse, basename, pendingActionData, pendingError);
    // Cancel pending deferreds for no-longer-matched routes or routes we're
    // about to reload.  Note that if this is an action reload we would have
    // already cancelled all pending deferreds so this would be a no-op
    cancelActiveDeferreds(routeId => !(matches && matches.some(m => m.route.id === routeId)) || matchesToLoad && matchesToLoad.some(m => m.route.id === routeId));
    pendingNavigationLoadId = ++incrementingLoadId;
    // Short circuit if we have no loaders to run
    if (matchesToLoad.length === 0 && revalidatingFetchers.length === 0) {
      let updatedFetchers = markFetchRedirectsDone();
      completeNavigation(location, _extends({
        matches,
        loaderData: {},
        // Commit pending error if we're short circuiting
        errors: pendingError || null
      }, pendingActionData ? {
        actionData: pendingActionData
      } : {}, updatedFetchers ? {
        fetchers: new Map(state.fetchers)
      } : {}));
      return {
        shortCircuited: true
      };
    }
    // If this is an uninterrupted revalidation, we remain in our current idle
    // state.  If not, we need to switch to our loading state and load data,
    // preserving any new action data or existing action data (in the case of
    // a revalidation interrupting an actionReload)
    if (!isUninterruptedRevalidation) {
      revalidatingFetchers.forEach(rf => {
        let fetcher = state.fetchers.get(rf.key);
        let revalidatingFetcher = getLoadingFetcher(undefined, fetcher ? fetcher.data : undefined);
        state.fetchers.set(rf.key, revalidatingFetcher);
      });
      let actionData = pendingActionData || state.actionData;
      updateState(_extends({
        navigation: loadingNavigation
      }, actionData ? Object.keys(actionData).length === 0 ? {
        actionData: null
      } : {
        actionData
      } : {}, revalidatingFetchers.length > 0 ? {
        fetchers: new Map(state.fetchers)
      } : {}));
    }
    revalidatingFetchers.forEach(rf => {
      if (fetchControllers.has(rf.key)) {
        abortFetcher(rf.key);
      }
      if (rf.controller) {
        // Fetchers use an independent AbortController so that aborting a fetcher
        // (via deleteFetcher) does not abort the triggering navigation that
        // triggered the revalidation
        fetchControllers.set(rf.key, rf.controller);
      }
    });
    // Proxy navigation abort through to revalidation fetchers
    let abortPendingFetchRevalidations = () => revalidatingFetchers.forEach(f => abortFetcher(f.key));
    if (pendingNavigationController) {
      pendingNavigationController.signal.addEventListener("abort", abortPendingFetchRevalidations);
    }
    let {
      results,
      loaderResults,
      fetcherResults
    } = await callLoadersAndMaybeResolveData(state.matches, matches, matchesToLoad, revalidatingFetchers, request);
    if (request.signal.aborted) {
      return {
        shortCircuited: true
      };
    }
    // Clean up _after_ loaders have completed.  Don't clean up if we short
    // circuited because fetchControllers would have been aborted and
    // reassigned to new controllers for the next navigation
    if (pendingNavigationController) {
      pendingNavigationController.signal.removeEventListener("abort", abortPendingFetchRevalidations);
    }
    revalidatingFetchers.forEach(rf => fetchControllers.delete(rf.key));
    // If any loaders returned a redirect Response, start a new REPLACE navigation
    let redirect = findRedirect(results);
    if (redirect) {
      if (redirect.idx >= matchesToLoad.length) {
        // If this redirect came from a fetcher make sure we mark it in
        // fetchRedirectIds so it doesn't get revalidated on the next set of
        // loader executions
        let fetcherKey = revalidatingFetchers[redirect.idx - matchesToLoad.length].key;
        fetchRedirectIds.add(fetcherKey);
      }
      await startRedirectNavigation(state, redirect.result, {
        replace
      });
      return {
        shortCircuited: true
      };
    }
    // Process and commit output from loaders
    let {
      loaderData,
      errors
    } = processLoaderData(state, matches, matchesToLoad, loaderResults, pendingError, revalidatingFetchers, fetcherResults, activeDeferreds);
    // Wire up subscribers to update loaderData as promises settle
    activeDeferreds.forEach((deferredData, routeId) => {
      deferredData.subscribe(aborted => {
        // Note: No need to updateState here since the TrackedPromise on
        // loaderData is stable across resolve/reject
        // Remove this instance if we were aborted or if promises have settled
        if (aborted || deferredData.done) {
          activeDeferreds.delete(routeId);
        }
      });
    });
    let updatedFetchers = markFetchRedirectsDone();
    let didAbortFetchLoads = abortStaleFetchLoads(pendingNavigationLoadId);
    let shouldUpdateFetchers = updatedFetchers || didAbortFetchLoads || revalidatingFetchers.length > 0;
    return _extends({
      loaderData,
      errors
    }, shouldUpdateFetchers ? {
      fetchers: new Map(state.fetchers)
    } : {});
  }
  function getFetcher(key) {
    return state.fetchers.get(key) || IDLE_FETCHER;
  }
  // Trigger a fetcher load/submit for the given fetcher key
  function fetch(key, routeId, href, opts) {
    if (isServer) {
      throw new Error("router.fetch() was called during the server render, but it shouldn't be. " + "You are likely calling a useFetcher() method in the body of your component. " + "Try moving it to a useEffect or a callback.");
    }
    if (fetchControllers.has(key)) abortFetcher(key);
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let normalizedPath = normalizeTo(state.location, state.matches, basename, future.v7_prependBasename, href, routeId, opts == null ? void 0 : opts.relative);
    let matches = matchRoutes(routesToUse, normalizedPath, basename);
    if (!matches) {
      setFetcherError(key, routeId, getInternalRouterError(404, {
        pathname: normalizedPath
      }));
      return;
    }
    let {
      path,
      submission,
      error
    } = normalizeNavigateOptions(future.v7_normalizeFormMethod, true, normalizedPath, opts);
    if (error) {
      setFetcherError(key, routeId, error);
      return;
    }
    let match = getTargetMatch(matches, path);
    pendingPreventScrollReset = (opts && opts.preventScrollReset) === true;
    if (submission && isMutationMethod(submission.formMethod)) {
      handleFetcherAction(key, routeId, path, match, matches, submission);
      return;
    }
    // Store off the match so we can call it's shouldRevalidate on subsequent
    // revalidations
    fetchLoadMatches.set(key, {
      routeId,
      path
    });
    handleFetcherLoader(key, routeId, path, match, matches, submission);
  }
  // Call the action for the matched fetcher.submit(), and then handle redirects,
  // errors, and revalidation
  async function handleFetcherAction(key, routeId, path, match, requestMatches, submission) {
    interruptActiveLoads();
    fetchLoadMatches.delete(key);
    if (!match.route.action && !match.route.lazy) {
      let error = getInternalRouterError(405, {
        method: submission.formMethod,
        pathname: path,
        routeId: routeId
      });
      setFetcherError(key, routeId, error);
      return;
    }
    // Put this fetcher into it's submitting state
    let existingFetcher = state.fetchers.get(key);
    let fetcher = getSubmittingFetcher(submission, existingFetcher);
    state.fetchers.set(key, fetcher);
    updateState({
      fetchers: new Map(state.fetchers)
    });
    // Call the action for the fetcher
    let abortController = new AbortController();
    let fetchRequest = createClientSideRequest(init.history, path, abortController.signal, submission);
    fetchControllers.set(key, abortController);
    let originatingLoadId = incrementingLoadId;
    let actionResult = await callLoaderOrAction("action", fetchRequest, match, requestMatches, manifest, mapRouteProperties, basename);
    if (fetchRequest.signal.aborted) {
      // We can delete this so long as we weren't aborted by ou our own fetcher
      // re-submit which would have put _new_ controller is in fetchControllers
      if (fetchControllers.get(key) === abortController) {
        fetchControllers.delete(key);
      }
      return;
    }
    if (isRedirectResult(actionResult)) {
      fetchControllers.delete(key);
      if (pendingNavigationLoadId > originatingLoadId) {
        // A new navigation was kicked off after our action started, so that
        // should take precedence over this redirect navigation.  We already
        // set isRevalidationRequired so all loaders for the new route should
        // fire unless opted out via shouldRevalidate
        let doneFetcher = getDoneFetcher(undefined);
        state.fetchers.set(key, doneFetcher);
        updateState({
          fetchers: new Map(state.fetchers)
        });
        return;
      } else {
        fetchRedirectIds.add(key);
        let loadingFetcher = getLoadingFetcher(submission);
        state.fetchers.set(key, loadingFetcher);
        updateState({
          fetchers: new Map(state.fetchers)
        });
        return startRedirectNavigation(state, actionResult, {
          submission,
          isFetchActionRedirect: true
        });
      }
    }
    // Process any non-redirect errors thrown
    if (isErrorResult(actionResult)) {
      setFetcherError(key, routeId, actionResult.error);
      return;
    }
    if (isDeferredResult(actionResult)) {
      throw getInternalRouterError(400, {
        type: "defer-action"
      });
    }
    // Start the data load for current matches, or the next location if we're
    // in the middle of a navigation
    let nextLocation = state.navigation.location || state.location;
    let revalidationRequest = createClientSideRequest(init.history, nextLocation, abortController.signal);
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let matches = state.navigation.state !== "idle" ? matchRoutes(routesToUse, state.navigation.location, basename) : state.matches;
    invariant(matches, "Didn't find any matches after fetcher action");
    let loadId = ++incrementingLoadId;
    fetchReloadIds.set(key, loadId);
    let loadFetcher = getLoadingFetcher(submission, actionResult.data);
    state.fetchers.set(key, loadFetcher);
    let [matchesToLoad, revalidatingFetchers] = getMatchesToLoad(init.history, state, matches, submission, nextLocation, isRevalidationRequired, cancelledDeferredRoutes, cancelledFetcherLoads, fetchLoadMatches, fetchRedirectIds, routesToUse, basename, {
      [match.route.id]: actionResult.data
    }, undefined // No need to send through errors since we short circuit above
    );
    // Put all revalidating fetchers into the loading state, except for the
    // current fetcher which we want to keep in it's current loading state which
    // contains it's action submission info + action data
    revalidatingFetchers.filter(rf => rf.key !== key).forEach(rf => {
      let staleKey = rf.key;
      let existingFetcher = state.fetchers.get(staleKey);
      let revalidatingFetcher = getLoadingFetcher(undefined, existingFetcher ? existingFetcher.data : undefined);
      state.fetchers.set(staleKey, revalidatingFetcher);
      if (fetchControllers.has(staleKey)) {
        abortFetcher(staleKey);
      }
      if (rf.controller) {
        fetchControllers.set(staleKey, rf.controller);
      }
    });
    updateState({
      fetchers: new Map(state.fetchers)
    });
    let abortPendingFetchRevalidations = () => revalidatingFetchers.forEach(rf => abortFetcher(rf.key));
    abortController.signal.addEventListener("abort", abortPendingFetchRevalidations);
    let {
      results,
      loaderResults,
      fetcherResults
    } = await callLoadersAndMaybeResolveData(state.matches, matches, matchesToLoad, revalidatingFetchers, revalidationRequest);
    if (abortController.signal.aborted) {
      return;
    }
    abortController.signal.removeEventListener("abort", abortPendingFetchRevalidations);
    fetchReloadIds.delete(key);
    fetchControllers.delete(key);
    revalidatingFetchers.forEach(r => fetchControllers.delete(r.key));
    let redirect = findRedirect(results);
    if (redirect) {
      if (redirect.idx >= matchesToLoad.length) {
        // If this redirect came from a fetcher make sure we mark it in
        // fetchRedirectIds so it doesn't get revalidated on the next set of
        // loader executions
        let fetcherKey = revalidatingFetchers[redirect.idx - matchesToLoad.length].key;
        fetchRedirectIds.add(fetcherKey);
      }
      return startRedirectNavigation(state, redirect.result);
    }
    // Process and commit output from loaders
    let {
      loaderData,
      errors
    } = processLoaderData(state, state.matches, matchesToLoad, loaderResults, undefined, revalidatingFetchers, fetcherResults, activeDeferreds);
    // Since we let revalidations complete even if the submitting fetcher was
    // deleted, only put it back to idle if it hasn't been deleted
    if (state.fetchers.has(key)) {
      let doneFetcher = getDoneFetcher(actionResult.data);
      state.fetchers.set(key, doneFetcher);
    }
    let didAbortFetchLoads = abortStaleFetchLoads(loadId);
    // If we are currently in a navigation loading state and this fetcher is
    // more recent than the navigation, we want the newer data so abort the
    // navigation and complete it with the fetcher data
    if (state.navigation.state === "loading" && loadId > pendingNavigationLoadId) {
      invariant(pendingAction, "Expected pending action");
      pendingNavigationController && pendingNavigationController.abort();
      completeNavigation(state.navigation.location, {
        matches,
        loaderData,
        errors,
        fetchers: new Map(state.fetchers)
      });
    } else {
      // otherwise just update with the fetcher data, preserving any existing
      // loaderData for loaders that did not need to reload.  We have to
      // manually merge here since we aren't going through completeNavigation
      updateState(_extends({
        errors,
        loaderData: mergeLoaderData(state.loaderData, loaderData, matches, errors)
      }, didAbortFetchLoads || revalidatingFetchers.length > 0 ? {
        fetchers: new Map(state.fetchers)
      } : {}));
      isRevalidationRequired = false;
    }
  }
  // Call the matched loader for fetcher.load(), handling redirects, errors, etc.
  async function handleFetcherLoader(key, routeId, path, match, matches, submission) {
    let existingFetcher = state.fetchers.get(key);
    // Put this fetcher into it's loading state
    let loadingFetcher = getLoadingFetcher(submission, existingFetcher ? existingFetcher.data : undefined);
    state.fetchers.set(key, loadingFetcher);
    updateState({
      fetchers: new Map(state.fetchers)
    });
    // Call the loader for this fetcher route match
    let abortController = new AbortController();
    let fetchRequest = createClientSideRequest(init.history, path, abortController.signal);
    fetchControllers.set(key, abortController);
    let originatingLoadId = incrementingLoadId;
    let result = await callLoaderOrAction("loader", fetchRequest, match, matches, manifest, mapRouteProperties, basename);
    // Deferred isn't supported for fetcher loads, await everything and treat it
    // as a normal load.  resolveDeferredData will return undefined if this
    // fetcher gets aborted, so we just leave result untouched and short circuit
    // below if that happens
    if (isDeferredResult(result)) {
      result = (await resolveDeferredData(result, fetchRequest.signal, true)) || result;
    }
    // We can delete this so long as we weren't aborted by our our own fetcher
    // re-load which would have put _new_ controller is in fetchControllers
    if (fetchControllers.get(key) === abortController) {
      fetchControllers.delete(key);
    }
    if (fetchRequest.signal.aborted) {
      return;
    }
    // If the loader threw a redirect Response, start a new REPLACE navigation
    if (isRedirectResult(result)) {
      if (pendingNavigationLoadId > originatingLoadId) {
        // A new navigation was kicked off after our loader started, so that
        // should take precedence over this redirect navigation
        let doneFetcher = getDoneFetcher(undefined);
        state.fetchers.set(key, doneFetcher);
        updateState({
          fetchers: new Map(state.fetchers)
        });
        return;
      } else {
        fetchRedirectIds.add(key);
        await startRedirectNavigation(state, result);
        return;
      }
    }
    // Process any non-redirect errors thrown
    if (isErrorResult(result)) {
      let boundaryMatch = findNearestBoundary(state.matches, routeId);
      state.fetchers.delete(key);
      // TODO: In remix, this would reset to IDLE_NAVIGATION if it was a catch -
      // do we need to behave any differently with our non-redirect errors?
      // What if it was a non-redirect Response?
      updateState({
        fetchers: new Map(state.fetchers),
        errors: {
          [boundaryMatch.route.id]: result.error
        }
      });
      return;
    }
    invariant(!isDeferredResult(result), "Unhandled fetcher deferred data");
    // Put the fetcher back into an idle state
    let doneFetcher = getDoneFetcher(result.data);
    state.fetchers.set(key, doneFetcher);
    updateState({
      fetchers: new Map(state.fetchers)
    });
  }
  /**
   * Utility function to handle redirects returned from an action or loader.
   * Normally, a redirect "replaces" the navigation that triggered it.  So, for
   * example:
   *
   *  - user is on /a
   *  - user clicks a link to /b
   *  - loader for /b redirects to /c
   *
   * In a non-JS app the browser would track the in-flight navigation to /b and
   * then replace it with /c when it encountered the redirect response.  In
   * the end it would only ever update the URL bar with /c.
   *
   * In client-side routing using pushState/replaceState, we aim to emulate
   * this behavior and we also do not update history until the end of the
   * navigation (including processed redirects).  This means that we never
   * actually touch history until we've processed redirects, so we just use
   * the history action from the original navigation (PUSH or REPLACE).
   */
  async function startRedirectNavigation(state, redirect, _temp) {
    let {
      submission,
      replace,
      isFetchActionRedirect
    } = _temp === void 0 ? {} : _temp;
    if (redirect.revalidate) {
      isRevalidationRequired = true;
    }
    let redirectLocation = createLocation(state.location, redirect.location, // TODO: This can be removed once we get rid of useTransition in Remix v2
    _extends({
      _isRedirect: true
    }, isFetchActionRedirect ? {
      _isFetchActionRedirect: true
    } : {}));
    invariant(redirectLocation, "Expected a location on the redirect navigation");
    if (isBrowser) {
      let isDocumentReload = false;
      if (redirect.reloadDocument) {
        // Hard reload if the response contained X-Remix-Reload-Document
        isDocumentReload = true;
      } else if (ABSOLUTE_URL_REGEX.test(redirect.location)) {
        const url = init.history.createURL(redirect.location);
        isDocumentReload =
        // Hard reload if it's an absolute URL to a new origin
        url.origin !== routerWindow.location.origin ||
        // Hard reload if it's an absolute URL that does not match our basename
        stripBasename(url.pathname, basename) == null;
      }
      if (isDocumentReload) {
        if (replace) {
          routerWindow.location.replace(redirect.location);
        } else {
          routerWindow.location.assign(redirect.location);
        }
        return;
      }
    }
    // There's no need to abort on redirects, since we don't detect the
    // redirect until the action/loaders have settled
    pendingNavigationController = null;
    let redirectHistoryAction = replace === true ? Action.Replace : Action.Push;
    // Use the incoming submission if provided, fallback on the active one in
    // state.navigation
    let activeSubmission = submission || getSubmissionFromNavigation(state.navigation);
    // If this was a 307/308 submission we want to preserve the HTTP method and
    // re-submit the GET/POST/PUT/PATCH/DELETE as a submission navigation to the
    // redirected location
    if (redirectPreserveMethodStatusCodes.has(redirect.status) && activeSubmission && isMutationMethod(activeSubmission.formMethod)) {
      await startNavigation(redirectHistoryAction, redirectLocation, {
        submission: _extends({}, activeSubmission, {
          formAction: redirect.location
        }),
        // Preserve this flag across redirects
        preventScrollReset: pendingPreventScrollReset
      });
    } else if (isFetchActionRedirect) {
      // For a fetch action redirect, we kick off a new loading navigation
      // without the fetcher submission, but we send it along for shouldRevalidate
      await startNavigation(redirectHistoryAction, redirectLocation, {
        overrideNavigation: getLoadingNavigation(redirectLocation),
        fetcherSubmission: activeSubmission,
        // Preserve this flag across redirects
        preventScrollReset: pendingPreventScrollReset
      });
    } else {
      // If we have a submission, we will preserve it through the redirect navigation
      let overrideNavigation = getLoadingNavigation(redirectLocation, activeSubmission);
      await startNavigation(redirectHistoryAction, redirectLocation, {
        overrideNavigation,
        // Preserve this flag across redirects
        preventScrollReset: pendingPreventScrollReset
      });
    }
  }
  async function callLoadersAndMaybeResolveData(currentMatches, matches, matchesToLoad, fetchersToLoad, request) {
    // Call all navigation loaders and revalidating fetcher loaders in parallel,
    // then slice off the results into separate arrays so we can handle them
    // accordingly
    let results = await Promise.all([...matchesToLoad.map(match => callLoaderOrAction("loader", request, match, matches, manifest, mapRouteProperties, basename)), ...fetchersToLoad.map(f => {
      if (f.matches && f.match && f.controller) {
        return callLoaderOrAction("loader", createClientSideRequest(init.history, f.path, f.controller.signal), f.match, f.matches, manifest, mapRouteProperties, basename);
      } else {
        let error = {
          type: ResultType.error,
          error: getInternalRouterError(404, {
            pathname: f.path
          })
        };
        return error;
      }
    })]);
    let loaderResults = results.slice(0, matchesToLoad.length);
    let fetcherResults = results.slice(matchesToLoad.length);
    await Promise.all([resolveDeferredResults(currentMatches, matchesToLoad, loaderResults, loaderResults.map(() => request.signal), false, state.loaderData), resolveDeferredResults(currentMatches, fetchersToLoad.map(f => f.match), fetcherResults, fetchersToLoad.map(f => f.controller ? f.controller.signal : null), true)]);
    return {
      results,
      loaderResults,
      fetcherResults
    };
  }
  function interruptActiveLoads() {
    // Every interruption triggers a revalidation
    isRevalidationRequired = true;
    // Cancel pending route-level deferreds and mark cancelled routes for
    // revalidation
    cancelledDeferredRoutes.push(...cancelActiveDeferreds());
    // Abort in-flight fetcher loads
    fetchLoadMatches.forEach((_, key) => {
      if (fetchControllers.has(key)) {
        cancelledFetcherLoads.push(key);
        abortFetcher(key);
      }
    });
  }
  function setFetcherError(key, routeId, error) {
    let boundaryMatch = findNearestBoundary(state.matches, routeId);
    deleteFetcher(key);
    updateState({
      errors: {
        [boundaryMatch.route.id]: error
      },
      fetchers: new Map(state.fetchers)
    });
  }
  function deleteFetcher(key) {
    let fetcher = state.fetchers.get(key);
    // Don't abort the controller if this is a deletion of a fetcher.submit()
    // in it's loading phase since - we don't want to abort the corresponding
    // revalidation and want them to complete and land
    if (fetchControllers.has(key) && !(fetcher && fetcher.state === "loading" && fetchReloadIds.has(key))) {
      abortFetcher(key);
    }
    fetchLoadMatches.delete(key);
    fetchReloadIds.delete(key);
    fetchRedirectIds.delete(key);
    state.fetchers.delete(key);
  }
  function abortFetcher(key) {
    let controller = fetchControllers.get(key);
    invariant(controller, "Expected fetch controller: " + key);
    controller.abort();
    fetchControllers.delete(key);
  }
  function markFetchersDone(keys) {
    for (let key of keys) {
      let fetcher = getFetcher(key);
      let doneFetcher = getDoneFetcher(fetcher.data);
      state.fetchers.set(key, doneFetcher);
    }
  }
  function markFetchRedirectsDone() {
    let doneKeys = [];
    let updatedFetchers = false;
    for (let key of fetchRedirectIds) {
      let fetcher = state.fetchers.get(key);
      invariant(fetcher, "Expected fetcher: " + key);
      if (fetcher.state === "loading") {
        fetchRedirectIds.delete(key);
        doneKeys.push(key);
        updatedFetchers = true;
      }
    }
    markFetchersDone(doneKeys);
    return updatedFetchers;
  }
  function abortStaleFetchLoads(landedId) {
    let yeetedKeys = [];
    for (let [key, id] of fetchReloadIds) {
      if (id < landedId) {
        let fetcher = state.fetchers.get(key);
        invariant(fetcher, "Expected fetcher: " + key);
        if (fetcher.state === "loading") {
          abortFetcher(key);
          fetchReloadIds.delete(key);
          yeetedKeys.push(key);
        }
      }
    }
    markFetchersDone(yeetedKeys);
    return yeetedKeys.length > 0;
  }
  function getBlocker(key, fn) {
    let blocker = state.blockers.get(key) || IDLE_BLOCKER;
    if (blockerFunctions.get(key) !== fn) {
      blockerFunctions.set(key, fn);
    }
    return blocker;
  }
  function deleteBlocker(key) {
    state.blockers.delete(key);
    blockerFunctions.delete(key);
  }
  // Utility function to update blockers, ensuring valid state transitions
  function updateBlocker(key, newBlocker) {
    let blocker = state.blockers.get(key) || IDLE_BLOCKER;
    // Poor mans state machine :)
    // https://mermaid.live/edit#pako:eNqVkc9OwzAMxl8l8nnjAYrEtDIOHEBIgwvKJTReGy3_lDpIqO27k6awMG0XcrLlnz87nwdonESogKXXBuE79rq75XZO3-yHds0RJVuv70YrPlUrCEe2HfrORS3rubqZfuhtpg5C9wk5tZ4VKcRUq88q9Z8RS0-48cE1iHJkL0ugbHuFLus9L6spZy8nX9MP2CNdomVaposqu3fGayT8T8-jJQwhepo_UtpgBQaDEUom04dZhAN1aJBDlUKJBxE1ceB2Smj0Mln-IBW5AFU2dwUiktt_2Qaq2dBfaKdEup85UV7Yd-dKjlnkabl2Pvr0DTkTreM
    invariant(blocker.state === "unblocked" && newBlocker.state === "blocked" || blocker.state === "blocked" && newBlocker.state === "blocked" || blocker.state === "blocked" && newBlocker.state === "proceeding" || blocker.state === "blocked" && newBlocker.state === "unblocked" || blocker.state === "proceeding" && newBlocker.state === "unblocked", "Invalid blocker state transition: " + blocker.state + " -> " + newBlocker.state);
    let blockers = new Map(state.blockers);
    blockers.set(key, newBlocker);
    updateState({
      blockers
    });
  }
  function shouldBlockNavigation(_ref2) {
    let {
      currentLocation,
      nextLocation,
      historyAction
    } = _ref2;
    if (blockerFunctions.size === 0) {
      return;
    }
    // We ony support a single active blocker at the moment since we don't have
    // any compelling use cases for multi-blocker yet
    if (blockerFunctions.size > 1) {
      warning(false, "A router only supports one blocker at a time");
    }
    let entries = Array.from(blockerFunctions.entries());
    let [blockerKey, blockerFunction] = entries[entries.length - 1];
    let blocker = state.blockers.get(blockerKey);
    if (blocker && blocker.state === "proceeding") {
      // If the blocker is currently proceeding, we don't need to re-check
      // it and can let this navigation continue
      return;
    }
    // At this point, we know we're unblocked/blocked so we need to check the
    // user-provided blocker function
    if (blockerFunction({
      currentLocation,
      nextLocation,
      historyAction
    })) {
      return blockerKey;
    }
  }
  function cancelActiveDeferreds(predicate) {
    let cancelledRouteIds = [];
    activeDeferreds.forEach((dfd, routeId) => {
      if (!predicate || predicate(routeId)) {
        // Cancel the deferred - but do not remove from activeDeferreds here -
        // we rely on the subscribers to do that so our tests can assert proper
        // cleanup via _internalActiveDeferreds
        dfd.cancel();
        cancelledRouteIds.push(routeId);
        activeDeferreds.delete(routeId);
      }
    });
    return cancelledRouteIds;
  }
  // Opt in to capturing and reporting scroll positions during navigations,
  // used by the <ScrollRestoration> component
  function enableScrollRestoration(positions, getPosition, getKey) {
    savedScrollPositions = positions;
    getScrollPosition = getPosition;
    getScrollRestorationKey = getKey || null;
    // Perform initial hydration scroll restoration, since we miss the boat on
    // the initial updateState() because we've not yet rendered <ScrollRestoration/>
    // and therefore have no savedScrollPositions available
    if (!initialScrollRestored && state.navigation === IDLE_NAVIGATION) {
      initialScrollRestored = true;
      let y = getSavedScrollPosition(state.location, state.matches);
      if (y != null) {
        updateState({
          restoreScrollPosition: y
        });
      }
    }
    return () => {
      savedScrollPositions = null;
      getScrollPosition = null;
      getScrollRestorationKey = null;
    };
  }
  function getScrollKey(location, matches) {
    if (getScrollRestorationKey) {
      let key = getScrollRestorationKey(location, matches.map(m => createUseMatchesMatch(m, state.loaderData)));
      return key || location.key;
    }
    return location.key;
  }
  function saveScrollPosition(location, matches) {
    if (savedScrollPositions && getScrollPosition) {
      let key = getScrollKey(location, matches);
      savedScrollPositions[key] = getScrollPosition();
    }
  }
  function getSavedScrollPosition(location, matches) {
    if (savedScrollPositions) {
      let key = getScrollKey(location, matches);
      let y = savedScrollPositions[key];
      if (typeof y === "number") {
        return y;
      }
    }
    return null;
  }
  function _internalSetRoutes(newRoutes) {
    manifest = {};
    inFlightDataRoutes = convertRoutesToDataRoutes(newRoutes, mapRouteProperties, undefined, manifest);
  }
  router = {
    get basename() {
      return basename;
    },
    get state() {
      return state;
    },
    get routes() {
      return dataRoutes;
    },
    initialize,
    subscribe,
    enableScrollRestoration,
    navigate,
    fetch,
    revalidate,
    // Passthrough to history-aware createHref used by useHref so we get proper
    // hash-aware URLs in DOM paths
    createHref: to => init.history.createHref(to),
    encodeLocation: to => init.history.encodeLocation(to),
    getFetcher,
    deleteFetcher,
    dispose,
    getBlocker,
    deleteBlocker,
    _internalFetchControllers: fetchControllers,
    _internalActiveDeferreds: activeDeferreds,
    // TODO: Remove setRoutes, it's temporary to avoid dealing with
    // updating the tree while validating the update algorithm.
    _internalSetRoutes
  };
  return router;
}
//#endregion
////////////////////////////////////////////////////////////////////////////////
//#region createStaticHandler
////////////////////////////////////////////////////////////////////////////////
const UNSAFE_DEFERRED_SYMBOL = Symbol("deferred");
function createStaticHandler(routes, opts) {
  invariant(routes.length > 0, "You must provide a non-empty routes array to createStaticHandler");
  let manifest = {};
  let basename = (opts ? opts.basename : null) || "/";
  let mapRouteProperties;
  if (opts != null && opts.mapRouteProperties) {
    mapRouteProperties = opts.mapRouteProperties;
  } else if (opts != null && opts.detectErrorBoundary) {
    // If they are still using the deprecated version, wrap it with the new API
    let detectErrorBoundary = opts.detectErrorBoundary;
    mapRouteProperties = route => ({
      hasErrorBoundary: detectErrorBoundary(route)
    });
  } else {
    mapRouteProperties = defaultMapRouteProperties;
  }
  let dataRoutes = convertRoutesToDataRoutes(routes, mapRouteProperties, undefined, manifest);
  /**
   * The query() method is intended for document requests, in which we want to
   * call an optional action and potentially multiple loaders for all nested
   * routes.  It returns a StaticHandlerContext object, which is very similar
   * to the router state (location, loaderData, actionData, errors, etc.) and
   * also adds SSR-specific information such as the statusCode and headers
   * from action/loaders Responses.
   *
   * It _should_ never throw and should report all errors through the
   * returned context.errors object, properly associating errors to their error
   * boundary.  Additionally, it tracks _deepestRenderedBoundaryId which can be
   * used to emulate React error boundaries during SSr by performing a second
   * pass only down to the boundaryId.
   *
   * The one exception where we do not return a StaticHandlerContext is when a
   * redirect response is returned or thrown from any action/loader.  We
   * propagate that out and return the raw Response so the HTTP server can
   * return it directly.
   */
  async function query(request, _temp2) {
    let {
      requestContext
    } = _temp2 === void 0 ? {} : _temp2;
    let url = new URL(request.url);
    let method = request.method;
    let location = createLocation("", createPath(url), null, "default");
    let matches = matchRoutes(dataRoutes, location, basename);
    // SSR supports HEAD requests while SPA doesn't
    if (!isValidMethod(method) && method !== "HEAD") {
      let error = getInternalRouterError(405, {
        method
      });
      let {
        matches: methodNotAllowedMatches,
        route
      } = getShortCircuitMatches(dataRoutes);
      return {
        basename,
        location,
        matches: methodNotAllowedMatches,
        loaderData: {},
        actionData: null,
        errors: {
          [route.id]: error
        },
        statusCode: error.status,
        loaderHeaders: {},
        actionHeaders: {},
        activeDeferreds: null
      };
    } else if (!matches) {
      let error = getInternalRouterError(404, {
        pathname: location.pathname
      });
      let {
        matches: notFoundMatches,
        route
      } = getShortCircuitMatches(dataRoutes);
      return {
        basename,
        location,
        matches: notFoundMatches,
        loaderData: {},
        actionData: null,
        errors: {
          [route.id]: error
        },
        statusCode: error.status,
        loaderHeaders: {},
        actionHeaders: {},
        activeDeferreds: null
      };
    }
    let result = await queryImpl(request, location, matches, requestContext);
    if (isResponse(result)) {
      return result;
    }
    // When returning StaticHandlerContext, we patch back in the location here
    // since we need it for React Context.  But this helps keep our submit and
    // loadRouteData operating on a Request instead of a Location
    return _extends({
      location,
      basename
    }, result);
  }
  /**
   * The queryRoute() method is intended for targeted route requests, either
   * for fetch ?_data requests or resource route requests.  In this case, we
   * are only ever calling a single action or loader, and we are returning the
   * returned value directly.  In most cases, this will be a Response returned
   * from the action/loader, but it may be a primitive or other value as well -
   * and in such cases the calling context should handle that accordingly.
   *
   * We do respect the throw/return differentiation, so if an action/loader
   * throws, then this method will throw the value.  This is important so we
   * can do proper boundary identification in Remix where a thrown Response
   * must go to the Catch Boundary but a returned Response is happy-path.
   *
   * One thing to note is that any Router-initiated Errors that make sense
   * to associate with a status code will be thrown as an ErrorResponse
   * instance which include the raw Error, such that the calling context can
   * serialize the error as they see fit while including the proper response
   * code.  Examples here are 404 and 405 errors that occur prior to reaching
   * any user-defined loaders.
   */
  async function queryRoute(request, _temp3) {
    let {
      routeId,
      requestContext
    } = _temp3 === void 0 ? {} : _temp3;
    let url = new URL(request.url);
    let method = request.method;
    let location = createLocation("", createPath(url), null, "default");
    let matches = matchRoutes(dataRoutes, location, basename);
    // SSR supports HEAD requests while SPA doesn't
    if (!isValidMethod(method) && method !== "HEAD" && method !== "OPTIONS") {
      throw getInternalRouterError(405, {
        method
      });
    } else if (!matches) {
      throw getInternalRouterError(404, {
        pathname: location.pathname
      });
    }
    let match = routeId ? matches.find(m => m.route.id === routeId) : getTargetMatch(matches, location);
    if (routeId && !match) {
      throw getInternalRouterError(403, {
        pathname: location.pathname,
        routeId
      });
    } else if (!match) {
      // This should never hit I don't think?
      throw getInternalRouterError(404, {
        pathname: location.pathname
      });
    }
    let result = await queryImpl(request, location, matches, requestContext, match);
    if (isResponse(result)) {
      return result;
    }
    let error = result.errors ? Object.values(result.errors)[0] : undefined;
    if (error !== undefined) {
      // If we got back result.errors, that means the loader/action threw
      // _something_ that wasn't a Response, but it's not guaranteed/required
      // to be an `instanceof Error` either, so we have to use throw here to
      // preserve the "error" state outside of queryImpl.
      throw error;
    }
    // Pick off the right state value to return
    if (result.actionData) {
      return Object.values(result.actionData)[0];
    }
    if (result.loaderData) {
      var _result$activeDeferre;
      let data = Object.values(result.loaderData)[0];
      if ((_result$activeDeferre = result.activeDeferreds) != null && _result$activeDeferre[match.route.id]) {
        data[UNSAFE_DEFERRED_SYMBOL] = result.activeDeferreds[match.route.id];
      }
      return data;
    }
    return undefined;
  }
  async function queryImpl(request, location, matches, requestContext, routeMatch) {
    invariant(request.signal, "query()/queryRoute() requests must contain an AbortController signal");
    try {
      if (isMutationMethod(request.method.toLowerCase())) {
        let result = await submit(request, matches, routeMatch || getTargetMatch(matches, location), requestContext, routeMatch != null);
        return result;
      }
      let result = await loadRouteData(request, matches, requestContext, routeMatch);
      return isResponse(result) ? result : _extends({}, result, {
        actionData: null,
        actionHeaders: {}
      });
    } catch (e) {
      // If the user threw/returned a Response in callLoaderOrAction, we throw
      // it to bail out and then return or throw here based on whether the user
      // returned or threw
      if (isQueryRouteResponse(e)) {
        if (e.type === ResultType.error) {
          throw e.response;
        }
        return e.response;
      }
      // Redirects are always returned since they don't propagate to catch
      // boundaries
      if (isRedirectResponse(e)) {
        return e;
      }
      throw e;
    }
  }
  async function submit(request, matches, actionMatch, requestContext, isRouteRequest) {
    let result;
    if (!actionMatch.route.action && !actionMatch.route.lazy) {
      let error = getInternalRouterError(405, {
        method: request.method,
        pathname: new URL(request.url).pathname,
        routeId: actionMatch.route.id
      });
      if (isRouteRequest) {
        throw error;
      }
      result = {
        type: ResultType.error,
        error
      };
    } else {
      result = await callLoaderOrAction("action", request, actionMatch, matches, manifest, mapRouteProperties, basename, {
        isStaticRequest: true,
        isRouteRequest,
        requestContext
      });
      if (request.signal.aborted) {
        let method = isRouteRequest ? "queryRoute" : "query";
        throw new Error(method + "() call aborted");
      }
    }
    if (isRedirectResult(result)) {
      // Uhhhh - this should never happen, we should always throw these from
      // callLoaderOrAction, but the type narrowing here keeps TS happy and we
      // can get back on the "throw all redirect responses" train here should
      // this ever happen :/
      throw new Response(null, {
        status: result.status,
        headers: {
          Location: result.location
        }
      });
    }
    if (isDeferredResult(result)) {
      let error = getInternalRouterError(400, {
        type: "defer-action"
      });
      if (isRouteRequest) {
        throw error;
      }
      result = {
        type: ResultType.error,
        error
      };
    }
    if (isRouteRequest) {
      // Note: This should only be non-Response values if we get here, since
      // isRouteRequest should throw any Response received in callLoaderOrAction
      if (isErrorResult(result)) {
        throw result.error;
      }
      return {
        matches: [actionMatch],
        loaderData: {},
        actionData: {
          [actionMatch.route.id]: result.data
        },
        errors: null,
        // Note: statusCode + headers are unused here since queryRoute will
        // return the raw Response or value
        statusCode: 200,
        loaderHeaders: {},
        actionHeaders: {},
        activeDeferreds: null
      };
    }
    if (isErrorResult(result)) {
      // Store off the pending error - we use it to determine which loaders
      // to call and will commit it when we complete the navigation
      let boundaryMatch = findNearestBoundary(matches, actionMatch.route.id);
      let context = await loadRouteData(request, matches, requestContext, undefined, {
        [boundaryMatch.route.id]: result.error
      });
      // action status codes take precedence over loader status codes
      return _extends({}, context, {
        statusCode: isRouteErrorResponse(result.error) ? result.error.status : 500,
        actionData: null,
        actionHeaders: _extends({}, result.headers ? {
          [actionMatch.route.id]: result.headers
        } : {})
      });
    }
    // Create a GET request for the loaders
    let loaderRequest = new Request(request.url, {
      headers: request.headers,
      redirect: request.redirect,
      signal: request.signal
    });
    let context = await loadRouteData(loaderRequest, matches, requestContext);
    return _extends({}, context, result.statusCode ? {
      statusCode: result.statusCode
    } : {}, {
      actionData: {
        [actionMatch.route.id]: result.data
      },
      actionHeaders: _extends({}, result.headers ? {
        [actionMatch.route.id]: result.headers
      } : {})
    });
  }
  async function loadRouteData(request, matches, requestContext, routeMatch, pendingActionError) {
    let isRouteRequest = routeMatch != null;
    // Short circuit if we have no loaders to run (queryRoute())
    if (isRouteRequest && !(routeMatch != null && routeMatch.route.loader) && !(routeMatch != null && routeMatch.route.lazy)) {
      throw getInternalRouterError(400, {
        method: request.method,
        pathname: new URL(request.url).pathname,
        routeId: routeMatch == null ? void 0 : routeMatch.route.id
      });
    }
    let requestMatches = routeMatch ? [routeMatch] : getLoaderMatchesUntilBoundary(matches, Object.keys(pendingActionError || {})[0]);
    let matchesToLoad = requestMatches.filter(m => m.route.loader || m.route.lazy);
    // Short circuit if we have no loaders to run (query())
    if (matchesToLoad.length === 0) {
      return {
        matches,
        // Add a null for all matched routes for proper revalidation on the client
        loaderData: matches.reduce((acc, m) => Object.assign(acc, {
          [m.route.id]: null
        }), {}),
        errors: pendingActionError || null,
        statusCode: 200,
        loaderHeaders: {},
        activeDeferreds: null
      };
    }
    let results = await Promise.all([...matchesToLoad.map(match => callLoaderOrAction("loader", request, match, matches, manifest, mapRouteProperties, basename, {
      isStaticRequest: true,
      isRouteRequest,
      requestContext
    }))]);
    if (request.signal.aborted) {
      let method = isRouteRequest ? "queryRoute" : "query";
      throw new Error(method + "() call aborted");
    }
    // Process and commit output from loaders
    let activeDeferreds = new Map();
    let context = processRouteLoaderData(matches, matchesToLoad, results, pendingActionError, activeDeferreds);
    // Add a null for any non-loader matches for proper revalidation on the client
    let executedLoaders = new Set(matchesToLoad.map(match => match.route.id));
    matches.forEach(match => {
      if (!executedLoaders.has(match.route.id)) {
        context.loaderData[match.route.id] = null;
      }
    });
    return _extends({}, context, {
      matches,
      activeDeferreds: activeDeferreds.size > 0 ? Object.fromEntries(activeDeferreds.entries()) : null
    });
  }
  return {
    dataRoutes,
    query,
    queryRoute
  };
}
//#endregion
////////////////////////////////////////////////////////////////////////////////
//#region Helpers
////////////////////////////////////////////////////////////////////////////////
/**
 * Given an existing StaticHandlerContext and an error thrown at render time,
 * provide an updated StaticHandlerContext suitable for a second SSR render
 */
function getStaticContextFromError(routes, context, error) {
  let newContext = _extends({}, context, {
    statusCode: 500,
    errors: {
      [context._deepestRenderedBoundaryId || routes[0].id]: error
    }
  });
  return newContext;
}
function isSubmissionNavigation(opts) {
  return opts != null && ("formData" in opts && opts.formData != null || "body" in opts && opts.body !== undefined);
}
function normalizeTo(location, matches, basename, prependBasename, to, fromRouteId, relative) {
  let contextualMatches;
  let activeRouteMatch;
  if (fromRouteId != null && relative !== "path") {
    // Grab matches up to the calling route so our route-relative logic is
    // relative to the correct source route.  When using relative:path,
    // fromRouteId is ignored since that is always relative to the current
    // location path
    contextualMatches = [];
    for (let match of matches) {
      contextualMatches.push(match);
      if (match.route.id === fromRouteId) {
        activeRouteMatch = match;
        break;
      }
    }
  } else {
    contextualMatches = matches;
    activeRouteMatch = matches[matches.length - 1];
  }
  // Resolve the relative path
  let path = resolveTo(to ? to : ".", getPathContributingMatches(contextualMatches).map(m => m.pathnameBase), stripBasename(location.pathname, basename) || location.pathname, relative === "path");
  // When `to` is not specified we inherit search/hash from the current
  // location, unlike when to="." and we just inherit the path.
  // See https://github.com/remix-run/remix/issues/927
  if (to == null) {
    path.search = location.search;
    path.hash = location.hash;
  }
  // Add an ?index param for matched index routes if we don't already have one
  if ((to == null || to === "" || to === ".") && activeRouteMatch && activeRouteMatch.route.index && !hasNakedIndexQuery(path.search)) {
    path.search = path.search ? path.search.replace(/^\?/, "?index&") : "?index";
  }
  // If we're operating within a basename, prepend it to the pathname.  If
  // this is a root navigation, then just use the raw basename which allows
  // the basename to have full control over the presence of a trailing slash
  // on root actions
  if (prependBasename && basename !== "/") {
    path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
  }
  return createPath(path);
}
// Normalize navigation options by converting formMethod=GET formData objects to
// URLSearchParams so they behave identically to links with query params
function normalizeNavigateOptions(normalizeFormMethod, isFetcher, path, opts) {
  // Return location verbatim on non-submission navigations
  if (!opts || !isSubmissionNavigation(opts)) {
    return {
      path
    };
  }
  if (opts.formMethod && !isValidMethod(opts.formMethod)) {
    return {
      path,
      error: getInternalRouterError(405, {
        method: opts.formMethod
      })
    };
  }
  let getInvalidBodyError = () => ({
    path,
    error: getInternalRouterError(400, {
      type: "invalid-body"
    })
  });
  // Create a Submission on non-GET navigations
  let rawFormMethod = opts.formMethod || "get";
  let formMethod = normalizeFormMethod ? rawFormMethod.toUpperCase() : rawFormMethod.toLowerCase();
  let formAction = stripHashFromPath(path);
  if (opts.body !== undefined) {
    if (opts.formEncType === "text/plain") {
      // text only support POST/PUT/PATCH/DELETE submissions
      if (!isMutationMethod(formMethod)) {
        return getInvalidBodyError();
      }
      let text = typeof opts.body === "string" ? opts.body : opts.body instanceof FormData || opts.body instanceof URLSearchParams ?
      // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#plain-text-form-data
      Array.from(opts.body.entries()).reduce((acc, _ref3) => {
        let [name, value] = _ref3;
        return "" + acc + name + "=" + value + "\n";
      }, "") : String(opts.body);
      return {
        path,
        submission: {
          formMethod,
          formAction,
          formEncType: opts.formEncType,
          formData: undefined,
          json: undefined,
          text
        }
      };
    } else if (opts.formEncType === "application/json") {
      // json only supports POST/PUT/PATCH/DELETE submissions
      if (!isMutationMethod(formMethod)) {
        return getInvalidBodyError();
      }
      try {
        let json = typeof opts.body === "string" ? JSON.parse(opts.body) : opts.body;
        return {
          path,
          submission: {
            formMethod,
            formAction,
            formEncType: opts.formEncType,
            formData: undefined,
            json,
            text: undefined
          }
        };
      } catch (e) {
        return getInvalidBodyError();
      }
    }
  }
  invariant(typeof FormData === "function", "FormData is not available in this environment");
  let searchParams;
  let formData;
  if (opts.formData) {
    searchParams = convertFormDataToSearchParams(opts.formData);
    formData = opts.formData;
  } else if (opts.body instanceof FormData) {
    searchParams = convertFormDataToSearchParams(opts.body);
    formData = opts.body;
  } else if (opts.body instanceof URLSearchParams) {
    searchParams = opts.body;
    formData = convertSearchParamsToFormData(searchParams);
  } else if (opts.body == null) {
    searchParams = new URLSearchParams();
    formData = new FormData();
  } else {
    try {
      searchParams = new URLSearchParams(opts.body);
      formData = convertSearchParamsToFormData(searchParams);
    } catch (e) {
      return getInvalidBodyError();
    }
  }
  let submission = {
    formMethod,
    formAction,
    formEncType: opts && opts.formEncType || "application/x-www-form-urlencoded",
    formData,
    json: undefined,
    text: undefined
  };
  if (isMutationMethod(submission.formMethod)) {
    return {
      path,
      submission
    };
  }
  // Flatten submission onto URLSearchParams for GET submissions
  let parsedPath = parsePath(path);
  // On GET navigation submissions we can drop the ?index param from the
  // resulting location since all loaders will run.  But fetcher GET submissions
  // only run a single loader so we need to preserve any incoming ?index params
  if (isFetcher && parsedPath.search && hasNakedIndexQuery(parsedPath.search)) {
    searchParams.append("index", "");
  }
  parsedPath.search = "?" + searchParams;
  return {
    path: createPath(parsedPath),
    submission
  };
}
// Filter out all routes below any caught error as they aren't going to
// render so we don't need to load them
function getLoaderMatchesUntilBoundary(matches, boundaryId) {
  let boundaryMatches = matches;
  if (boundaryId) {
    let index = matches.findIndex(m => m.route.id === boundaryId);
    if (index >= 0) {
      boundaryMatches = matches.slice(0, index);
    }
  }
  return boundaryMatches;
}
function getMatchesToLoad(history, state, matches, submission, location, isRevalidationRequired, cancelledDeferredRoutes, cancelledFetcherLoads, fetchLoadMatches, fetchRedirectIds, routesToUse, basename, pendingActionData, pendingError) {
  let actionResult = pendingError ? Object.values(pendingError)[0] : pendingActionData ? Object.values(pendingActionData)[0] : undefined;
  let currentUrl = history.createURL(state.location);
  let nextUrl = history.createURL(location);
  // Pick navigation matches that are net-new or qualify for revalidation
  let boundaryId = pendingError ? Object.keys(pendingError)[0] : undefined;
  let boundaryMatches = getLoaderMatchesUntilBoundary(matches, boundaryId);
  let navigationMatches = boundaryMatches.filter((match, index) => {
    if (match.route.lazy) {
      // We haven't loaded this route yet so we don't know if it's got a loader!
      return true;
    }
    if (match.route.loader == null) {
      return false;
    }
    // Always call the loader on new route instances and pending defer cancellations
    if (isNewLoader(state.loaderData, state.matches[index], match) || cancelledDeferredRoutes.some(id => id === match.route.id)) {
      return true;
    }
    // This is the default implementation for when we revalidate.  If the route
    // provides it's own implementation, then we give them full control but
    // provide this value so they can leverage it if needed after they check
    // their own specific use cases
    let currentRouteMatch = state.matches[index];
    let nextRouteMatch = match;
    return shouldRevalidateLoader(match, _extends({
      currentUrl,
      currentParams: currentRouteMatch.params,
      nextUrl,
      nextParams: nextRouteMatch.params
    }, submission, {
      actionResult,
      defaultShouldRevalidate:
      // Forced revalidation due to submission, useRevalidator, or X-Remix-Revalidate
      isRevalidationRequired ||
      // Clicked the same link, resubmitted a GET form
      currentUrl.pathname + currentUrl.search === nextUrl.pathname + nextUrl.search ||
      // Search params affect all loaders
      currentUrl.search !== nextUrl.search || isNewRouteInstance(currentRouteMatch, nextRouteMatch)
    }));
  });
  // Pick fetcher.loads that need to be revalidated
  let revalidatingFetchers = [];
  fetchLoadMatches.forEach((f, key) => {
    // Don't revalidate if fetcher won't be present in the subsequent render
    if (!matches.some(m => m.route.id === f.routeId)) {
      return;
    }
    let fetcherMatches = matchRoutes(routesToUse, f.path, basename);
    // If the fetcher path no longer matches, push it in with null matches so
    // we can trigger a 404 in callLoadersAndMaybeResolveData.  Note this is
    // currently only a use-case for Remix HMR where the route tree can change
    // at runtime and remove a route previously loaded via a fetcher
    if (!fetcherMatches) {
      revalidatingFetchers.push({
        key,
        routeId: f.routeId,
        path: f.path,
        matches: null,
        match: null,
        controller: null
      });
      return;
    }
    // Revalidating fetchers are decoupled from the route matches since they
    // load from a static href.  They revalidate based on explicit revalidation
    // (submission, useRevalidator, or X-Remix-Revalidate)
    let fetcher = state.fetchers.get(key);
    let fetcherMatch = getTargetMatch(fetcherMatches, f.path);
    let shouldRevalidate = false;
    if (fetchRedirectIds.has(key)) {
      // Never trigger a revalidation of an actively redirecting fetcher
      shouldRevalidate = false;
    } else if (cancelledFetcherLoads.includes(key)) {
      // Always revalidate if the fetcher was cancelled
      shouldRevalidate = true;
    } else if (fetcher && fetcher.state !== "idle" && fetcher.data === undefined) {
      // If the fetcher hasn't ever completed loading yet, then this isn't a
      // revalidation, it would just be a brand new load if an explicit
      // revalidation is required
      shouldRevalidate = isRevalidationRequired;
    } else {
      // Otherwise fall back on any user-defined shouldRevalidate, defaulting
      // to explicit revalidations only
      shouldRevalidate = shouldRevalidateLoader(fetcherMatch, _extends({
        currentUrl,
        currentParams: state.matches[state.matches.length - 1].params,
        nextUrl,
        nextParams: matches[matches.length - 1].params
      }, submission, {
        actionResult,
        defaultShouldRevalidate: isRevalidationRequired
      }));
    }
    if (shouldRevalidate) {
      revalidatingFetchers.push({
        key,
        routeId: f.routeId,
        path: f.path,
        matches: fetcherMatches,
        match: fetcherMatch,
        controller: new AbortController()
      });
    }
  });
  return [navigationMatches, revalidatingFetchers];
}
function isNewLoader(currentLoaderData, currentMatch, match) {
  let isNew =
  // [a] -> [a, b]
  !currentMatch ||
  // [a, b] -> [a, c]
  match.route.id !== currentMatch.route.id;
  // Handle the case that we don't have data for a re-used route, potentially
  // from a prior error or from a cancelled pending deferred
  let isMissingData = currentLoaderData[match.route.id] === undefined;
  // Always load if this is a net-new route or we don't yet have data
  return isNew || isMissingData;
}
function isNewRouteInstance(currentMatch, match) {
  let currentPath = currentMatch.route.path;
  return (
    // param change for this match, /users/123 -> /users/456
    currentMatch.pathname !== match.pathname ||
    // splat param changed, which is not present in match.path
    // e.g. /files/images/avatar.jpg -> files/finances.xls
    currentPath != null && currentPath.endsWith("*") && currentMatch.params["*"] !== match.params["*"]
  );
}
function shouldRevalidateLoader(loaderMatch, arg) {
  if (loaderMatch.route.shouldRevalidate) {
    let routeChoice = loaderMatch.route.shouldRevalidate(arg);
    if (typeof routeChoice === "boolean") {
      return routeChoice;
    }
  }
  return arg.defaultShouldRevalidate;
}
/**
 * Execute route.lazy() methods to lazily load route modules (loader, action,
 * shouldRevalidate) and update the routeManifest in place which shares objects
 * with dataRoutes so those get updated as well.
 */
async function loadLazyRouteModule(route, mapRouteProperties, manifest) {
  if (!route.lazy) {
    return;
  }
  let lazyRoute = await route.lazy();
  // If the lazy route function was executed and removed by another parallel
  // call then we can return - first lazy() to finish wins because the return
  // value of lazy is expected to be static
  if (!route.lazy) {
    return;
  }
  let routeToUpdate = manifest[route.id];
  invariant(routeToUpdate, "No route found in manifest");
  // Update the route in place.  This should be safe because there's no way
  // we could yet be sitting on this route as we can't get there without
  // resolving lazy() first.
  //
  // This is different than the HMR "update" use-case where we may actively be
  // on the route being updated.  The main concern boils down to "does this
  // mutation affect any ongoing navigations or any current state.matches
  // values?".  If not, it should be safe to update in place.
  let routeUpdates = {};
  for (let lazyRouteProperty in lazyRoute) {
    let staticRouteValue = routeToUpdate[lazyRouteProperty];
    let isPropertyStaticallyDefined = staticRouteValue !== undefined &&
    // This property isn't static since it should always be updated based
    // on the route updates
    lazyRouteProperty !== "hasErrorBoundary";
    warning(!isPropertyStaticallyDefined, "Route \"" + routeToUpdate.id + "\" has a static property \"" + lazyRouteProperty + "\" " + "defined but its lazy function is also returning a value for this property. " + ("The lazy route property \"" + lazyRouteProperty + "\" will be ignored."));
    if (!isPropertyStaticallyDefined && !immutableRouteKeys.has(lazyRouteProperty)) {
      routeUpdates[lazyRouteProperty] = lazyRoute[lazyRouteProperty];
    }
  }
  // Mutate the route with the provided updates.  Do this first so we pass
  // the updated version to mapRouteProperties
  Object.assign(routeToUpdate, routeUpdates);
  // Mutate the `hasErrorBoundary` property on the route based on the route
  // updates and remove the `lazy` function so we don't resolve the lazy
  // route again.
  Object.assign(routeToUpdate, _extends({}, mapRouteProperties(routeToUpdate), {
    lazy: undefined
  }));
}
async function callLoaderOrAction(type, request, match, matches, manifest, mapRouteProperties, basename, opts) {
  if (opts === void 0) {
    opts = {};
  }
  let resultType;
  let result;
  let onReject;
  let runHandler = handler => {
    // Setup a promise we can race against so that abort signals short circuit
    let reject;
    let abortPromise = new Promise((_, r) => reject = r);
    onReject = () => reject();
    request.signal.addEventListener("abort", onReject);
    return Promise.race([handler({
      request,
      params: match.params,
      context: opts.requestContext
    }), abortPromise]);
  };
  try {
    let handler = match.route[type];
    if (match.route.lazy) {
      if (handler) {
        // Run statically defined handler in parallel with lazy()
        let values = await Promise.all([runHandler(handler), loadLazyRouteModule(match.route, mapRouteProperties, manifest)]);
        result = values[0];
      } else {
        // Load lazy route module, then run any returned handler
        await loadLazyRouteModule(match.route, mapRouteProperties, manifest);
        handler = match.route[type];
        if (handler) {
          // Handler still run even if we got interrupted to maintain consistency
          // with un-abortable behavior of handler execution on non-lazy or
          // previously-lazy-loaded routes
          result = await runHandler(handler);
        } else if (type === "action") {
          let url = new URL(request.url);
          let pathname = url.pathname + url.search;
          throw getInternalRouterError(405, {
            method: request.method,
            pathname,
            routeId: match.route.id
          });
        } else {
          // lazy() route has no loader to run.  Short circuit here so we don't
          // hit the invariant below that errors on returning undefined.
          return {
            type: ResultType.data,
            data: undefined
          };
        }
      }
    } else if (!handler) {
      let url = new URL(request.url);
      let pathname = url.pathname + url.search;
      throw getInternalRouterError(404, {
        pathname
      });
    } else {
      result = await runHandler(handler);
    }
    invariant(result !== undefined, "You defined " + (type === "action" ? "an action" : "a loader") + " for route " + ("\"" + match.route.id + "\" but didn't return anything from your `" + type + "` ") + "function. Please return a value or `null`.");
  } catch (e) {
    resultType = ResultType.error;
    result = e;
  } finally {
    if (onReject) {
      request.signal.removeEventListener("abort", onReject);
    }
  }
  if (isResponse(result)) {
    let status = result.status;
    // Process redirects
    if (redirectStatusCodes.has(status)) {
      let location = result.headers.get("Location");
      invariant(location, "Redirects returned/thrown from loaders/actions must have a Location header");
      // Support relative routing in internal redirects
      if (!ABSOLUTE_URL_REGEX.test(location)) {
        location = normalizeTo(new URL(request.url), matches.slice(0, matches.indexOf(match) + 1), basename, true, location);
      } else if (!opts.isStaticRequest) {
        // Strip off the protocol+origin for same-origin + same-basename absolute
        // redirects. If this is a static request, we can let it go back to the
        // browser as-is
        let currentUrl = new URL(request.url);
        let url = location.startsWith("//") ? new URL(currentUrl.protocol + location) : new URL(location);
        let isSameBasename = stripBasename(url.pathname, basename) != null;
        if (url.origin === currentUrl.origin && isSameBasename) {
          location = url.pathname + url.search + url.hash;
        }
      }
      // Don't process redirects in the router during static requests requests.
      // Instead, throw the Response and let the server handle it with an HTTP
      // redirect.  We also update the Location header in place in this flow so
      // basename and relative routing is taken into account
      if (opts.isStaticRequest) {
        result.headers.set("Location", location);
        throw result;
      }
      return {
        type: ResultType.redirect,
        status,
        location,
        revalidate: result.headers.get("X-Remix-Revalidate") !== null,
        reloadDocument: result.headers.get("X-Remix-Reload-Document") !== null
      };
    }
    // For SSR single-route requests, we want to hand Responses back directly
    // without unwrapping.  We do this with the QueryRouteResponse wrapper
    // interface so we can know whether it was returned or thrown
    if (opts.isRouteRequest) {
      let queryRouteResponse = {
        type: resultType === ResultType.error ? ResultType.error : ResultType.data,
        response: result
      };
      throw queryRouteResponse;
    }
    let data;
    let contentType = result.headers.get("Content-Type");
    // Check between word boundaries instead of startsWith() due to the last
    // paragraph of https://httpwg.org/specs/rfc9110.html#field.content-type
    if (contentType && /\bapplication\/json\b/.test(contentType)) {
      data = await result.json();
    } else {
      data = await result.text();
    }
    if (resultType === ResultType.error) {
      return {
        type: resultType,
        error: new ErrorResponse(status, result.statusText, data),
        headers: result.headers
      };
    }
    return {
      type: ResultType.data,
      data,
      statusCode: result.status,
      headers: result.headers
    };
  }
  if (resultType === ResultType.error) {
    return {
      type: resultType,
      error: result
    };
  }
  if (isDeferredData(result)) {
    var _result$init, _result$init2;
    return {
      type: ResultType.deferred,
      deferredData: result,
      statusCode: (_result$init = result.init) == null ? void 0 : _result$init.status,
      headers: ((_result$init2 = result.init) == null ? void 0 : _result$init2.headers) && new Headers(result.init.headers)
    };
  }
  return {
    type: ResultType.data,
    data: result
  };
}
// Utility method for creating the Request instances for loaders/actions during
// client-side navigations and fetches.  During SSR we will always have a
// Request instance from the static handler (query/queryRoute)
function createClientSideRequest(history, location, signal, submission) {
  let url = history.createURL(stripHashFromPath(location)).toString();
  let init = {
    signal
  };
  if (submission && isMutationMethod(submission.formMethod)) {
    let {
      formMethod,
      formEncType
    } = submission;
    // Didn't think we needed this but it turns out unlike other methods, patch
    // won't be properly normalized to uppercase and results in a 405 error.
    // See: https://fetch.spec.whatwg.org/#concept-method
    init.method = formMethod.toUpperCase();
    if (formEncType === "application/json") {
      init.headers = new Headers({
        "Content-Type": formEncType
      });
      init.body = JSON.stringify(submission.json);
    } else if (formEncType === "text/plain") {
      // Content-Type is inferred (https://fetch.spec.whatwg.org/#dom-request)
      init.body = submission.text;
    } else if (formEncType === "application/x-www-form-urlencoded" && submission.formData) {
      // Content-Type is inferred (https://fetch.spec.whatwg.org/#dom-request)
      init.body = convertFormDataToSearchParams(submission.formData);
    } else {
      // Content-Type is inferred (https://fetch.spec.whatwg.org/#dom-request)
      init.body = submission.formData;
    }
  }
  return new Request(url, init);
}
function convertFormDataToSearchParams(formData) {
  let searchParams = new URLSearchParams();
  for (let [key, value] of formData.entries()) {
    // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#converting-an-entry-list-to-a-list-of-name-value-pairs
    searchParams.append(key, typeof value === "string" ? value : value.name);
  }
  return searchParams;
}
function convertSearchParamsToFormData(searchParams) {
  let formData = new FormData();
  for (let [key, value] of searchParams.entries()) {
    formData.append(key, value);
  }
  return formData;
}
function processRouteLoaderData(matches, matchesToLoad, results, pendingError, activeDeferreds) {
  // Fill in loaderData/errors from our loaders
  let loaderData = {};
  let errors = null;
  let statusCode;
  let foundError = false;
  let loaderHeaders = {};
  // Process loader results into state.loaderData/state.errors
  results.forEach((result, index) => {
    let id = matchesToLoad[index].route.id;
    invariant(!isRedirectResult(result), "Cannot handle redirect results in processLoaderData");
    if (isErrorResult(result)) {
      // Look upwards from the matched route for the closest ancestor
      // error boundary, defaulting to the root match
      let boundaryMatch = findNearestBoundary(matches, id);
      let error = result.error;
      // If we have a pending action error, we report it at the highest-route
      // that throws a loader error, and then clear it out to indicate that
      // it was consumed
      if (pendingError) {
        error = Object.values(pendingError)[0];
        pendingError = undefined;
      }
      errors = errors || {};
      // Prefer higher error values if lower errors bubble to the same boundary
      if (errors[boundaryMatch.route.id] == null) {
        errors[boundaryMatch.route.id] = error;
      }
      // Clear our any prior loaderData for the throwing route
      loaderData[id] = undefined;
      // Once we find our first (highest) error, we set the status code and
      // prevent deeper status codes from overriding
      if (!foundError) {
        foundError = true;
        statusCode = isRouteErrorResponse(result.error) ? result.error.status : 500;
      }
      if (result.headers) {
        loaderHeaders[id] = result.headers;
      }
    } else {
      if (isDeferredResult(result)) {
        activeDeferreds.set(id, result.deferredData);
        loaderData[id] = result.deferredData.data;
      } else {
        loaderData[id] = result.data;
      }
      // Error status codes always override success status codes, but if all
      // loaders are successful we take the deepest status code.
      if (result.statusCode != null && result.statusCode !== 200 && !foundError) {
        statusCode = result.statusCode;
      }
      if (result.headers) {
        loaderHeaders[id] = result.headers;
      }
    }
  });
  // If we didn't consume the pending action error (i.e., all loaders
  // resolved), then consume it here.  Also clear out any loaderData for the
  // throwing route
  if (pendingError) {
    errors = pendingError;
    loaderData[Object.keys(pendingError)[0]] = undefined;
  }
  return {
    loaderData,
    errors,
    statusCode: statusCode || 200,
    loaderHeaders
  };
}
function processLoaderData(state, matches, matchesToLoad, results, pendingError, revalidatingFetchers, fetcherResults, activeDeferreds) {
  let {
    loaderData,
    errors
  } = processRouteLoaderData(matches, matchesToLoad, results, pendingError, activeDeferreds);
  // Process results from our revalidating fetchers
  for (let index = 0; index < revalidatingFetchers.length; index++) {
    let {
      key,
      match,
      controller
    } = revalidatingFetchers[index];
    invariant(fetcherResults !== undefined && fetcherResults[index] !== undefined, "Did not find corresponding fetcher result");
    let result = fetcherResults[index];
    // Process fetcher non-redirect errors
    if (controller && controller.signal.aborted) {
      // Nothing to do for aborted fetchers
      continue;
    } else if (isErrorResult(result)) {
      let boundaryMatch = findNearestBoundary(state.matches, match == null ? void 0 : match.route.id);
      if (!(errors && errors[boundaryMatch.route.id])) {
        errors = _extends({}, errors, {
          [boundaryMatch.route.id]: result.error
        });
      }
      state.fetchers.delete(key);
    } else if (isRedirectResult(result)) {
      // Should never get here, redirects should get processed above, but we
      // keep this to type narrow to a success result in the else
      invariant(false, "Unhandled fetcher revalidation redirect");
    } else if (isDeferredResult(result)) {
      // Should never get here, deferred data should be awaited for fetchers
      // in resolveDeferredResults
      invariant(false, "Unhandled fetcher deferred data");
    } else {
      let doneFetcher = getDoneFetcher(result.data);
      state.fetchers.set(key, doneFetcher);
    }
  }
  return {
    loaderData,
    errors
  };
}
function mergeLoaderData(loaderData, newLoaderData, matches, errors) {
  let mergedLoaderData = _extends({}, newLoaderData);
  for (let match of matches) {
    let id = match.route.id;
    if (newLoaderData.hasOwnProperty(id)) {
      if (newLoaderData[id] !== undefined) {
        mergedLoaderData[id] = newLoaderData[id];
      }
    } else if (loaderData[id] !== undefined && match.route.loader) {
      // Preserve existing keys not included in newLoaderData and where a loader
      // wasn't removed by HMR
      mergedLoaderData[id] = loaderData[id];
    }
    if (errors && errors.hasOwnProperty(id)) {
      // Don't keep any loader data below the boundary
      break;
    }
  }
  return mergedLoaderData;
}
// Find the nearest error boundary, looking upwards from the leaf route (or the
// route specified by routeId) for the closest ancestor error boundary,
// defaulting to the root match
function findNearestBoundary(matches, routeId) {
  let eligibleMatches = routeId ? matches.slice(0, matches.findIndex(m => m.route.id === routeId) + 1) : [...matches];
  return eligibleMatches.reverse().find(m => m.route.hasErrorBoundary === true) || matches[0];
}
function getShortCircuitMatches(routes) {
  // Prefer a root layout route if present, otherwise shim in a route object
  let route = routes.find(r => r.index || !r.path || r.path === "/") || {
    id: "__shim-error-route__"
  };
  return {
    matches: [{
      params: {},
      pathname: "",
      pathnameBase: "",
      route
    }],
    route
  };
}
function getInternalRouterError(status, _temp4) {
  let {
    pathname,
    routeId,
    method,
    type
  } = _temp4 === void 0 ? {} : _temp4;
  let statusText = "Unknown Server Error";
  let errorMessage = "Unknown @remix-run/router error";
  if (status === 400) {
    statusText = "Bad Request";
    if (method && pathname && routeId) {
      errorMessage = "You made a " + method + " request to \"" + pathname + "\" but " + ("did not provide a `loader` for route \"" + routeId + "\", ") + "so there is no way to handle the request.";
    } else if (type === "defer-action") {
      errorMessage = "defer() is not supported in actions";
    } else if (type === "invalid-body") {
      errorMessage = "Unable to encode submission body";
    }
  } else if (status === 403) {
    statusText = "Forbidden";
    errorMessage = "Route \"" + routeId + "\" does not match URL \"" + pathname + "\"";
  } else if (status === 404) {
    statusText = "Not Found";
    errorMessage = "No route matches URL \"" + pathname + "\"";
  } else if (status === 405) {
    statusText = "Method Not Allowed";
    if (method && pathname && routeId) {
      errorMessage = "You made a " + method.toUpperCase() + " request to \"" + pathname + "\" but " + ("did not provide an `action` for route \"" + routeId + "\", ") + "so there is no way to handle the request.";
    } else if (method) {
      errorMessage = "Invalid request method \"" + method.toUpperCase() + "\"";
    }
  }
  return new ErrorResponse(status || 500, statusText, new Error(errorMessage), true);
}
// Find any returned redirect errors, starting from the lowest match
function findRedirect(results) {
  for (let i = results.length - 1; i >= 0; i--) {
    let result = results[i];
    if (isRedirectResult(result)) {
      return {
        result,
        idx: i
      };
    }
  }
}
function stripHashFromPath(path) {
  let parsedPath = typeof path === "string" ? parsePath(path) : path;
  return createPath(_extends({}, parsedPath, {
    hash: ""
  }));
}
function isHashChangeOnly(a, b) {
  if (a.pathname !== b.pathname || a.search !== b.search) {
    return false;
  }
  if (a.hash === "") {
    // /page -> /page#hash
    return b.hash !== "";
  } else if (a.hash === b.hash) {
    // /page#hash -> /page#hash
    return true;
  } else if (b.hash !== "") {
    // /page#hash -> /page#other
    return true;
  }
  // If the hash is removed the browser will re-perform a request to the server
  // /page#hash -> /page
  return false;
}
function isDeferredResult(result) {
  return result.type === ResultType.deferred;
}
function isErrorResult(result) {
  return result.type === ResultType.error;
}
function isRedirectResult(result) {
  return (result && result.type) === ResultType.redirect;
}
function isDeferredData(value) {
  let deferred = value;
  return deferred && typeof deferred === "object" && typeof deferred.data === "object" && typeof deferred.subscribe === "function" && typeof deferred.cancel === "function" && typeof deferred.resolveData === "function";
}
function isResponse(value) {
  return value != null && typeof value.status === "number" && typeof value.statusText === "string" && typeof value.headers === "object" && typeof value.body !== "undefined";
}
function isRedirectResponse(result) {
  if (!isResponse(result)) {
    return false;
  }
  let status = result.status;
  let location = result.headers.get("Location");
  return status >= 300 && status <= 399 && location != null;
}
function isQueryRouteResponse(obj) {
  return obj && isResponse(obj.response) && (obj.type === ResultType.data || obj.type === ResultType.error);
}
function isValidMethod(method) {
  return validRequestMethods.has(method.toLowerCase());
}
function isMutationMethod(method) {
  return validMutationMethods.has(method.toLowerCase());
}
async function resolveDeferredResults(currentMatches, matchesToLoad, results, signals, isFetcher, currentLoaderData) {
  for (let index = 0; index < results.length; index++) {
    let result = results[index];
    let match = matchesToLoad[index];
    // If we don't have a match, then we can have a deferred result to do
    // anything with.  This is for revalidating fetchers where the route was
    // removed during HMR
    if (!match) {
      continue;
    }
    let currentMatch = currentMatches.find(m => m.route.id === match.route.id);
    let isRevalidatingLoader = currentMatch != null && !isNewRouteInstance(currentMatch, match) && (currentLoaderData && currentLoaderData[match.route.id]) !== undefined;
    if (isDeferredResult(result) && (isFetcher || isRevalidatingLoader)) {
      // Note: we do not have to touch activeDeferreds here since we race them
      // against the signal in resolveDeferredData and they'll get aborted
      // there if needed
      let signal = signals[index];
      invariant(signal, "Expected an AbortSignal for revalidating fetcher deferred result");
      await resolveDeferredData(result, signal, isFetcher).then(result => {
        if (result) {
          results[index] = result || results[index];
        }
      });
    }
  }
}
async function resolveDeferredData(result, signal, unwrap) {
  if (unwrap === void 0) {
    unwrap = false;
  }
  let aborted = await result.deferredData.resolveData(signal);
  if (aborted) {
    return;
  }
  if (unwrap) {
    try {
      return {
        type: ResultType.data,
        data: result.deferredData.unwrappedData
      };
    } catch (e) {
      // Handle any TrackedPromise._error values encountered while unwrapping
      return {
        type: ResultType.error,
        error: e
      };
    }
  }
  return {
    type: ResultType.data,
    data: result.deferredData.data
  };
}
function hasNakedIndexQuery(search) {
  return new URLSearchParams(search).getAll("index").some(v => v === "");
}
// Note: This should match the format exported by useMatches, so if you change
// this please also change that :)  Eventually we'll DRY this up
function createUseMatchesMatch(match, loaderData) {
  let {
    route,
    pathname,
    params
  } = match;
  return {
    id: route.id,
    pathname,
    params,
    data: loaderData[route.id],
    handle: route.handle
  };
}
function getTargetMatch(matches, location) {
  let search = typeof location === "string" ? parsePath(location).search : location.search;
  if (matches[matches.length - 1].route.index && hasNakedIndexQuery(search || "")) {
    // Return the leaf index route when index is present
    return matches[matches.length - 1];
  }
  // Otherwise grab the deepest "path contributing" match (ignoring index and
  // pathless layout routes)
  let pathMatches = getPathContributingMatches(matches);
  return pathMatches[pathMatches.length - 1];
}
function getSubmissionFromNavigation(navigation) {
  let {
    formMethod,
    formAction,
    formEncType,
    text,
    formData,
    json
  } = navigation;
  if (!formMethod || !formAction || !formEncType) {
    return;
  }
  if (text != null) {
    return {
      formMethod,
      formAction,
      formEncType,
      formData: undefined,
      json: undefined,
      text
    };
  } else if (formData != null) {
    return {
      formMethod,
      formAction,
      formEncType,
      formData,
      json: undefined,
      text: undefined
    };
  } else if (json !== undefined) {
    return {
      formMethod,
      formAction,
      formEncType,
      formData: undefined,
      json,
      text: undefined
    };
  }
}
function getLoadingNavigation(location, submission) {
  if (submission) {
    let navigation = {
      state: "loading",
      location,
      formMethod: submission.formMethod,
      formAction: submission.formAction,
      formEncType: submission.formEncType,
      formData: submission.formData,
      json: submission.json,
      text: submission.text
    };
    return navigation;
  } else {
    let navigation = {
      state: "loading",
      location,
      formMethod: undefined,
      formAction: undefined,
      formEncType: undefined,
      formData: undefined,
      json: undefined,
      text: undefined
    };
    return navigation;
  }
}
function getSubmittingNavigation(location, submission) {
  let navigation = {
    state: "submitting",
    location,
    formMethod: submission.formMethod,
    formAction: submission.formAction,
    formEncType: submission.formEncType,
    formData: submission.formData,
    json: submission.json,
    text: submission.text
  };
  return navigation;
}
function getLoadingFetcher(submission, data) {
  if (submission) {
    let fetcher = {
      state: "loading",
      formMethod: submission.formMethod,
      formAction: submission.formAction,
      formEncType: submission.formEncType,
      formData: submission.formData,
      json: submission.json,
      text: submission.text,
      data,
      " _hasFetcherDoneAnything ": true
    };
    return fetcher;
  } else {
    let fetcher = {
      state: "loading",
      formMethod: undefined,
      formAction: undefined,
      formEncType: undefined,
      formData: undefined,
      json: undefined,
      text: undefined,
      data,
      " _hasFetcherDoneAnything ": true
    };
    return fetcher;
  }
}
function getSubmittingFetcher(submission, existingFetcher) {
  let fetcher = {
    state: "submitting",
    formMethod: submission.formMethod,
    formAction: submission.formAction,
    formEncType: submission.formEncType,
    formData: submission.formData,
    json: submission.json,
    text: submission.text,
    data: existingFetcher ? existingFetcher.data : undefined,
    " _hasFetcherDoneAnything ": true
  };
  return fetcher;
}
function getDoneFetcher(data) {
  let fetcher = {
    state: "idle",
    formMethod: undefined,
    formAction: undefined,
    formEncType: undefined,
    formData: undefined,
    json: undefined,
    text: undefined,
    data,
    " _hasFetcherDoneAnything ": true
  };
  return fetcher;
}
//#endregion


//# sourceMappingURL=router.js.map


/***/ }),

/***/ "./src/Helpers.js":
/*!************************!*\
  !*** ./src/Helpers.js ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getDefaultSettings: function() { return /* binding */ getDefaultSettings; },
/* harmony export */   getLicenseUrl: function() { return /* binding */ getLicenseUrl; },
/* harmony export */   getNonce: function() { return /* binding */ getNonce; },
/* harmony export */   getTables: function() { return /* binding */ getTables; },
/* harmony export */   isProActive: function() { return /* binding */ isProActive; },
/* harmony export */   isProInstalled: function() { return /* binding */ isProInstalled; },
/* harmony export */   isProLicenseActive: function() { return /* binding */ isProLicenseActive; },
/* harmony export */   screenSize: function() { return /* binding */ screenSize; }
/* harmony export */ });
const config = Object.assign({}, window.SIMPLEFORM_APP);
function getNonce() {
  return config.nonce;
}
function getTables() {
  return config.tables;
}

// Default setting once table create.
function getDefaultSettings() {
  return {
    table_title: false,
    default_rows_per_page: 10,
    show_info_block: true,
    responsive_table: false,
    show_x_entries: true,
    swap_filter_inputs: false,
    swap_bottom_options: false,
    allow_sorting: false,
    search_bar: true,
    table_export: [],
    vertical_scroll: null,
    cell_format: "expand",
    responsive_style: "default_style",
    redirection_type: "_blank",
    table_cache: false,
    table_style: 'default-style',
    hide_column: [],
    hide_on_desktop: true,
    hide_on_mobile: false,
    hide_rows: [],
    hide_cell: [],
    table_styles: false,
    table_cache: false
  };
}
function getLicenseUrl() {
  return config.pro.license_url;
}
function isProInstalled() {
  return config.pro.installed;
}
function isProActive() {
  return config.pro.active;
}
function isProLicenseActive() {
  return config.pro.license;
}
const screenSize = () => {
  // Desktop screen size
  if (screen.width > 740) {
    return "desktop";
  } else {
    return "mobile";
  }
};

/***/ }),

/***/ "./src/components/AddNewTable.tsx":
/*!****************************************!*\
  !*** ./src/components/AddNewTable.tsx ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/dist/index.js");
/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../icons */ "./src/icons.js");




function AddNewTable() {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_3__.Link, {
    to: "/create-form",
    className: "add-new-table btn add-new-table-btn"
  }, _icons__WEBPACK_IMPORTED_MODULE_2__.GrayPlusIcon, "Add new form");
}
/* harmony default export */ __webpack_exports__["default"] = (AddNewTable);

/***/ }),

/***/ "./src/components/App.tsx":
/*!********************************!*\
  !*** ./src/components/App.tsx ***!
  \********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var react_toastify__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-toastify */ "./node_modules/react-toastify/dist/react-toastify.esm.mjs");
/* harmony import */ var react_toastify_dist_ReactToastify_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-toastify/dist/ReactToastify.css */ "./node_modules/react-toastify/dist/ReactToastify.css");
/* harmony import */ var _core_Column__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/Column */ "./src/core/Column.tsx");
/* harmony import */ var _core_Container__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../core/Container */ "./src/core/Container.tsx");
/* harmony import */ var _core_Row__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../core/Row */ "./src/core/Row.tsx");
/* harmony import */ var _Dashboard__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Dashboard */ "./src/components/Dashboard.tsx");
/* harmony import */ var _CreateForm__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./CreateForm */ "./src/components/CreateForm.tsx");
/* harmony import */ var _EditTable__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./EditTable */ "./src/components/EditTable.tsx");
/* harmony import */ var _Leads__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Leads */ "./src/components/Leads.tsx");
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./Settings */ "./src/components/Settings.tsx");
/* harmony import */ var _Documentation__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./Documentation */ "./src/components/Documentation.tsx");
/* harmony import */ var _styles_main_scss__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../styles/main.scss */ "./src/styles/main.scss");















// Default Styles

function App() {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_core_Container__WEBPACK_IMPORTED_MODULE_5__["default"], null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_core_Row__WEBPACK_IMPORTED_MODULE_6__["default"], null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_core_Column__WEBPACK_IMPORTED_MODULE_4__["default"], {
    xs: "12"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_14__.Routes, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_14__.Route, {
    path: "/",
    element: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Dashboard__WEBPACK_IMPORTED_MODULE_7__["default"], null)
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_14__.Route, {
    path: "/create-form",
    element: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_CreateForm__WEBPACK_IMPORTED_MODULE_8__["default"], null)
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_14__.Route, {
    path: "/edit/:id",
    element: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_EditTable__WEBPACK_IMPORTED_MODULE_9__["default"], null)
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_14__.Route, {
    path: "/Leads",
    element: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Leads__WEBPACK_IMPORTED_MODULE_10__["default"], null)
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_14__.Route, {
    path: "/settings",
    element: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Settings__WEBPACK_IMPORTED_MODULE_11__["default"], null)
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_14__.Route, {
    path: "/doc",
    element: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Documentation__WEBPACK_IMPORTED_MODULE_12__["default"], null)
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_toastify__WEBPACK_IMPORTED_MODULE_2__.ToastContainer, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: true,
    newestOnTop: false,
    closeOnClick: false,
    rtl: false,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    theme: "colored"
  })))));
}
/* harmony default export */ __webpack_exports__["default"] = (App);

/***/ }),

/***/ "./src/components/CreateForm.tsx":
/*!***************************************!*\
  !*** ./src/components/CreateForm.tsx ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../Helpers */ "./src/Helpers.js");
/* harmony import */ var _styles_createForm_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../styles/_createForm.scss */ "./src/styles/_createForm.scss");






const CreateForm = () => {
  const navigate = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_5__.useNavigate)();
  const formBuilderRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
  var options = {
    disableFields: ['autocomplete', 'button']
  };
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    const saveDataBtn = document.getElementById('saveData');
    saveDataBtn.addEventListener('click', handleSaveDataClick);
    const fbEditor = document.getElementById('build-wrap');
    formBuilderRef.current = jquery__WEBPACK_IMPORTED_MODULE_2___default()(fbEditor).formBuilder(options);
    return () => {
      // Cleanup event listener
      saveDataBtn.removeEventListener('click', handleSaveDataClick);
    };
  }, []);
  const handleSaveDataClick = () => {
    Swal.fire({
      text: 'Are you done!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Save!'
    }).then(result => {
      if (result.isConfirmed) {
        // Access the formBuilder instance
        const formBuilder = formBuilderRef.current;
        if (formBuilder) {
          // Check if there are any li elements inside ul
          const ulElement = document.querySelector('.frmb');
          const liElements = ulElement.querySelectorAll('li');
          if (liElements.length === 0) {
            // Show an alert and do not submit the form
            Swal.fire({
              text: 'Add fields to the form before saving!',
              icon: 'warning'
            });
          } else {
            const allData = formBuilder.actions.getData();
            /* const buttonData = {
              type: "button",
              subtype: "submit",
              label: "Send",
              className: "btn-primary btn",
              name: "simple-form-submit",
              access: false,
              style: "primary",
            }; */

            // Add the button data to the existing form data
            // allData.push(buttonData);

            // Update the form with the new data
            formBuilder.actions.setData(allData);
            const formNameInput = document.getElementById('formName');
            const formName = formNameInput.value;
            wp.ajax.send('simpleform_create_form', {
              data: {
                nonce: (0,_Helpers__WEBPACK_IMPORTED_MODULE_3__.getNonce)(),
                name: formName,
                formdata: allData
              },
              success({
                id
              }) {
                console.log(allData);
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Your Form has been saved',
                  showConfirmButton: false,
                  timer: 1500
                });
                navigate(`/`);
              },
              error({
                message
              }) {}
            });
          }
        } else {
          console.error("Form Builder instance not found.");
        }
      }
    });
  };
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "form-data-container"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, "Form Create"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    className: "checkbox-wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "formname"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "text",
    placeholder: "Add form name",
    name: "simpleformname",
    className: "js-open-modal",
    id: "formName"
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "formsavebtn"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "js-open-modal saveData",
    id: "saveData",
    type: "button"
  }, "Save"))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    id: "build-wrap"
  }));
};
/* harmony default export */ __webpack_exports__["default"] = (CreateForm);

/***/ }),

/***/ "./src/components/Dashboard.tsx":
/*!**************************************!*\
  !*** ./src/components/Dashboard.tsx ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/dist/index.js");
/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../icons */ "./src/icons.js");
/* harmony import */ var _styles_table_item_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../styles/_table_item.scss */ "./src/styles/_table_item.scss");
/* harmony import */ var _core_Title__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/Title */ "./src/core/Title.tsx");
/* harmony import */ var _TablesList__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./TablesList */ "./src/components/TablesList.jsx");
/* harmony import */ var _Helpers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./../Helpers */ "./src/Helpers.js");
/* harmony import */ var _styles_dashboard_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../styles/_dashboard.scss */ "./src/styles/_dashboard.scss");
/* harmony import */ var _core_Card__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../core/Card */ "./src/core/Card.tsx");










function Dashboard() {
  const [loader, setLoader] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [tables, setTables] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)((0,_Helpers__WEBPACK_IMPORTED_MODULE_6__.getTables)());
  const [copiedTables, setCopiedTables] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)((0,_Helpers__WEBPACK_IMPORTED_MODULE_6__.getTables)());
  const [searchKey, setSearchKey] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const [tableCount, setTableCount] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0);

  /**
   * Receving all table data
   */
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    setLoader(true);
    wp.ajax.send('simpleform_get_tables', {
      data: {
        nonce: (0,_Helpers__WEBPACK_IMPORTED_MODULE_6__.getNonce)()
      },
      success(response) {
        // console.log(response.tables) 
        setTables(response.tables);
        setCopiedTables(response.tables);
        setTableCount(response.tables_count);
        setLoader(false);
      },
      error(error) {
        console.error(error);
      }
    });
  }, []);

  /**
   * Search functionality
   */
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (searchKey !== '') {
      const filtered = tables.filter(({
        form_name
      }) => form_name.toLowerCase().includes(searchKey.toString().toLowerCase()));
      setCopiedTables(filtered);
    } else {
      setCopiedTables(tables);
    }
  }, [searchKey]);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, tables.length < 1 ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "no-tables-created-intro text-center"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "no-tables-intro-img"
  }, _icons__WEBPACK_IMPORTED_MODULE_2__.Cloud), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, "No form have been created yet"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Form will be appeared here once you create them"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_9__.Link, {
    className: "btn btn-lg",
    to: "/create-form"
  }, "Create new table"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "help"
  }, "Need help? ", (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: "https://youtu.be/hKYqE4e_ipY?list=PLd6WEu38CQSyY-1rzShSfsHn4ZVmiGNLP",
    target: "_blank"
  }, "Watch Now")))) : (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "create-table-intro"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_core_Title__WEBPACK_IMPORTED_MODULE_4__["default"], {
    tagName: "h2"
  }, "Create form"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_9__.Link, {
    className: "create-table btn btn-md",
    to: "/create-form"
  }, "Create new form ", _icons__WEBPACK_IMPORTED_MODULE_2__.WhitePlusIcon)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "table-header"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_core_Title__WEBPACK_IMPORTED_MODULE_4__["default"], {
    tagName: "h4"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("strong", null, tableCount), "\xA0Form created"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "table-search-box"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "text",
    placeholder: "Search tables",
    onChange: e => setSearchKey(e.target.value.trim())
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "icon"
  }, _icons__WEBPACK_IMPORTED_MODULE_2__.searchIcon))), loader ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_core_Card__WEBPACK_IMPORTED_MODULE_8__["default"], null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", null, "Loading...")) : (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_TablesList__WEBPACK_IMPORTED_MODULE_5__["default"], {
    tables: copiedTables,
    copiedTables: copiedTables,
    setCopiedTables: setCopiedTables,
    setTables: setTables,
    setTableCount: setTableCount,
    setLoader: setLoader
  })));
}
/* harmony default export */ __webpack_exports__["default"] = (Dashboard);

/***/ }),

/***/ "./src/components/Documentation.tsx":
/*!******************************************!*\
  !*** ./src/components/Documentation.tsx ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_Container__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/Container */ "./src/core/Container.tsx");
/* harmony import */ var _core_Row__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/Row */ "./src/core/Row.tsx");
/* harmony import */ var _core_Column__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/Column */ "./src/core/Column.tsx");






// import { book, videoPlay, support, AdsProducts, promoThumbnail } from './../icons';

// import { isProActive, getNonce } from '../Helpers';

function Documentation() {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_core_Container__WEBPACK_IMPORTED_MODULE_2__["default"], null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_core_Row__WEBPACK_IMPORTED_MODULE_3__["default"], {
    customClass: "documentation-flex-row"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_core_Column__WEBPACK_IMPORTED_MODULE_4__["default"], {
    lg: "3",
    sm: "4"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "test"
  }, "Doc"))));
}
/* harmony default export */ __webpack_exports__["default"] = (Documentation);

/***/ }),

/***/ "./src/components/EditTable.tsx":
/*!**************************************!*\
  !*** ./src/components/EditTable.tsx ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../Helpers */ "./src/Helpers.js");






function EditTable() {
  const [loader, setLoader] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const {
    id
  } = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_4__.useParams)();
  const navigate = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_4__.useNavigate)();
  const [tableSettings, setTableSettings] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({});
  const [formName, setFormName] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');

  /**
   * Get the data from DB to edit
   */
  const getTableData = () => {
    setLoader(true);
    wp.ajax.send('simpleform_edit_table', {
      data: {
        nonce: (0,_Helpers__WEBPACK_IMPORTED_MODULE_3__.getNonce)(),
        id: id
      },
      success(response) {
        setTableSettings({
          ...response,
          id: id
        });
        setFormName(response.form_name);
        const fbEditor = document.getElementById('build-wrap');
        const formData = response.table_settings;
        const options = {
          disableFields: ['autocomplete', 'button']
        };
        // const formBuilders = $(fbEditor).formBuilder({ formData })

        // Check if buttonData already exists in formData
        // const buttonDataIndex = formData.findIndex((item) => item.type === 'button');

        // If buttonData exists, remove it from formData
        /* if (buttonDataIndex !== -1) {
        	formData.splice(buttonDataIndex, 1);
        } */

        // Show all data 
        const formBuilders = jquery__WEBPACK_IMPORTED_MODULE_2___default()(fbEditor).formBuilder({
          ...options,
          formData
        });
        const handleSaveDataClick = () => {
          Swal.fire({
            text: 'Are you done!',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Save!'
          }).then(result => {
            if (result.isConfirmed) {
              const formBuilder = formBuilders;
              if (formBuilder) {
                // Check if there are any li elements inside ul
                const ulElement = document.querySelector('.frmb');
                const liElements = ulElement.querySelectorAll('li');
                if (liElements.length === 0) {
                  // Show an alert and do not submit the form
                  Swal.fire({
                    text: 'Add fields to the form before saving!',
                    icon: 'warning'
                  });
                } else {
                  const allData = formBuilder.actions.getData();

                  // Add button on save
                  /* const buttonData = {
                    type: "button",
                    subtype: "submit",
                    label: "Send",
                    className: "btn-primary btn",
                    name: "simple-form-submit",
                    access: false,
                    style: "primary",
                  }; */

                  // Add the button data to the existing form data
                  // allData.push(buttonData);

                  // Update the form with the new data
                  formBuilder.actions.setData(allData);
                  const formidinput = document.getElementById('formid');
                  const formid = formidinput.value;
                  const formNameInput = document.getElementById('formName');
                  const formName = formNameInput.value;
                  wp.ajax.send('simpleform_save_table', {
                    data: {
                      nonce: (0,_Helpers__WEBPACK_IMPORTED_MODULE_3__.getNonce)(),
                      id: formid,
                      name: formName,
                      formdata: allData
                    },
                    success({
                      id
                    }) {
                      Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Your Form has been saved',
                        showConfirmButton: false,
                        timer: 1500
                      });
                      navigate(`/`);
                    },
                    error({
                      message
                    }) {
                      console.log(message);
                    }
                  });
                }
              } else {
                console.error("Form Builder instance not found.");
              }
            }
          });
        };
        const saveDataBtn = document.getElementById('saveData');
        saveDataBtn.addEventListener('click', handleSaveDataClick);
        setLoader(false);
      },
      error(error) {
        console.error('Error:', error); // Log any errors
      }
    });
  };

  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    getTableData();
  }, []);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "form-data-container"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, "Form Create"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    className: "checkbox-wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "formsavebtn"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "js-open-modal saveData",
    id: "saveData",
    type: "button"
  }, "Update")), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "formname"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "text",
    value: formName,
    placeholder: "Add form name",
    name: "simpleformname",
    className: "js-open-modal",
    id: "formName",
    onChange: e => setFormName(e.target.value)
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "hidden",
    name: "formid",
    id: "formid",
    value: tableSettings.id || ''
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    id: "build-wrap"
  }));
}
/* harmony default export */ __webpack_exports__["default"] = (EditTable);

/***/ }),

/***/ "./src/components/Leads.tsx":
/*!**********************************!*\
  !*** ./src/components/Leads.tsx ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const Leads = () => {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, "Leads page");
};
/* harmony default export */ __webpack_exports__["default"] = (Leads);

/***/ }),

/***/ "./src/components/Settings.tsx":
/*!*************************************!*\
  !*** ./src/components/Settings.tsx ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_Container__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/Container */ "./src/core/Container.tsx");
/* harmony import */ var _core_Row__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/Row */ "./src/core/Row.tsx");
/* harmony import */ var _core_Column__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/Column */ "./src/core/Column.tsx");






// import { getNonce, isProActive, isProInstalled } from './../Helpers';

// import CodeEditor from '@uiw/react-textarea-code-editor';

function Settings() {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_core_Container__WEBPACK_IMPORTED_MODULE_2__["default"], null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_core_Row__WEBPACK_IMPORTED_MODULE_3__["default"], null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_core_Column__WEBPACK_IMPORTED_MODULE_4__["default"], {
    sm: "12"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "swptls-settings-wrap"
  }, "Settings"))));
}
/* harmony default export */ __webpack_exports__["default"] = (Settings);

/***/ }),

/***/ "./src/components/TableItem.tsx":
/*!**************************************!*\
  !*** ./src/components/TableItem.tsx ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/dist/index.js");
/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../icons */ "./src/icons.js");
/* harmony import */ var _styles_table_item_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../styles/_table_item.scss */ "./src/styles/_table_item.scss");
/* harmony import */ var _core_Title__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/Title */ "./src/core/Title.tsx");
/* harmony import */ var _Helpers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Helpers */ "./src/Helpers.js");
/* harmony import */ var _core_Modal__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./../core/Modal */ "./src/core/Modal.tsx");





//styles




function TableItem({
  table,
  setCopiedTables,
  setTableCount,
  setTables,
  setLoader
}) {
  const confirmDeleteRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)();
  const [copySuccess, setCopySuccess] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [deleteModal, setDeleteModal] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);

  /**
   * 
   * @param id Copy Shortcode
   */
  const handleCopyShortcode = async id => {
    const shortcode = `[simple_form id="${id}"]`;
    try {
      await navigator.clipboard.writeText(shortcode);
      setCopySuccess(true);

      // Reset copySuccess state after 1 second
      setTimeout(() => {
        setCopySuccess(false);
      }, 1000); // 1000 milliseconds = 1 second
    } catch (err) {
      setCopySuccess(false);
    }
  };

  /**
   * Delete Modal close
  */
  const handleClosePopup = () => {
    setDeleteModal(false);
  };

  /**
   * Delete Modal
  */
  const handleDeleteTable = () => {
    setDeleteModal(true);
  };

  /**
   * Delete Modal close get confitmation and delete from DB
  */
  const ConfirmDeleteTable = id => {
    wp.ajax.send('simpleform_delete_table', {
      data: {
        nonce: (0,_Helpers__WEBPACK_IMPORTED_MODULE_5__.getNonce)(),
        id
      },
      success() {
        setDeleteModal(false);
        setLoader(true);
        wp.ajax.send('simpleform_get_tables', {
          data: {
            nonce: (0,_Helpers__WEBPACK_IMPORTED_MODULE_5__.getNonce)()
          },
          success({
            tables,
            tables_count
          }) {
            setTables(tables);
            setCopiedTables(tables);
            setTableCount(tables_count);
            setLoader(false);
          },
          error(error) {
            console.error(error);
          }
        });
      },
      error(error) {
        console.error(error);
      }
    });
  };

  /**
   * Alert close if clicked on outside of element
   *
   * @param  event
   */
  function handleCancelOutside(event) {
    if (confirmDeleteRef.current && !confirmDeleteRef.current.contains(event.target)) {
      handleClosePopup();
    }
  }
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    document.addEventListener('mousedown', handleCancelOutside);
    return () => {
      document.removeEventListener('mousedown', handleCancelOutside);
    };
  }, [handleCancelOutside]);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "table_info-action_box_wrapper"
  }, deleteModal && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_core_Modal__WEBPACK_IMPORTED_MODULE_6__["default"], null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "delete-table-modal-wrap modal-content",
    ref: confirmDeleteRef
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "cross_sign",
    onClick: () => handleClosePopup()
  }, _icons__WEBPACK_IMPORTED_MODULE_2__.Cross), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "delete-table-modal"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "modal-media"
  }, _icons__WEBPACK_IMPORTED_MODULE_2__.TrashCan), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, "Are you sure to delete the table? "), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "You are about to delete the table. This will permanently delete the table(s)"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "action-buttons"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "swptls-button cancel-button",
    onClick: handleClosePopup
  }, "Cancel"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "swptls-button confirm-button",
    onClick: () => ConfirmDeleteTable(table.id)
  }, "Delete"))))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "table_info-action_box"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "table-info-box"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "table-info"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_7__.Link, {
    to: `/edit/${table.id}`,
    className: "table-edit"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_core_Title__WEBPACK_IMPORTED_MODULE_4__["default"], {
    tagName: "h4"
  }, table.form_name)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_core_Title__WEBPACK_IMPORTED_MODULE_4__["default"], {
    tagName: "p"
  }, "ID: TB_", table.id))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "table-action-box"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: `copy-shortcode btn-shortcode ${!copySuccess ? '' : 'btn-success'}`,
    onClick: () => handleCopyShortcode(table.id)
  }, !copySuccess ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M12.6 0H5.6C4.8279 0 4.2 0.6279 4.2 1.4V4.2H1.4C0.6279 4.2 0 4.8279 0 5.6V12.6C0 13.3721 0.6279 14 1.4 14H8.4C9.1721 14 9.8 13.3721 9.8 12.6V9.8H12.6C13.3721 9.8 14 9.1721 14 8.4V1.4C14 0.6279 13.3721 0 12.6 0ZM1.4 12.6V5.6H8.4L8.4014 12.6H1.4ZM12.6 8.4H9.8V5.6C9.8 4.8279 9.1721 4.2 8.4 4.2H5.6V1.4H12.6V8.4Z",
    fill: "#1E1E1E"
  })) : (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M12.6 0H5.6C4.8279 0 4.2 0.6279 4.2 1.4V4.2H1.4C0.6279 4.2 0 4.8279 0 5.6V12.6C0 13.3721 0.6279 14 1.4 14H8.4C9.1721 14 9.8 13.3721 9.8 12.6V9.8H12.6C13.3721 9.8 14 9.1721 14 8.4V1.4C14 0.6279 13.3721 0 12.6 0ZM1.4 12.6V5.6H8.4L8.4014 12.6H1.4ZM12.6 8.4H9.8V5.6C9.8 4.8279 9.1721 4.2 8.4 4.2H5.6V1.4H12.6V8.4Z",
    fill: "#FF7E47"
  })), "Copy Shortcode"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_7__.Link, {
    to: `/edit/${table.id}`,
    className: "table-edit"
  }, _icons__WEBPACK_IMPORTED_MODULE_2__.EditIcon), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "table-delete",
    onClick: handleDeleteTable
  }, _icons__WEBPACK_IMPORTED_MODULE_2__.DeleteIcon))));
}
/* harmony default export */ __webpack_exports__["default"] = (TableItem);

/***/ }),

/***/ "./src/components/TablesList.jsx":
/*!***************************************!*\
  !*** ./src/components/TablesList.jsx ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_Card__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/Card */ "./src/core/Card.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Helpers */ "./src/Helpers.js");
/* harmony import */ var _AddNewTable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./AddNewTable */ "./src/components/AddNewTable.tsx");
/* harmony import */ var _TableItem__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./TableItem */ "./src/components/TableItem.tsx");






function TablesList({
  copiedTables,
  tables,
  setCopiedTables,
  setTableCount,
  setTables,
  setLoader
}) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_core_Card__WEBPACK_IMPORTED_MODULE_1__["default"], {
    customClass: "table-item-card"
  }, tables && tables.map(table => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_TableItem__WEBPACK_IMPORTED_MODULE_5__["default"], {
    key: table.id,
    table: table,
    setCopiedTables: setCopiedTables,
    setTableCount: setTableCount,
    setTables: setTables,
    setLoader: setLoader
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "add-new-wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_AddNewTable__WEBPACK_IMPORTED_MODULE_4__["default"], null)));
}
/* harmony default export */ __webpack_exports__["default"] = (TablesList);

/***/ }),

/***/ "./src/core/Card.tsx":
/*!***************************!*\
  !*** ./src/core/Card.tsx ***!
  \***************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _card_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_card.scss */ "./src/core/_card.scss");


const Card = ({
  colored,
  children,
  customClass
}) => {
  let classes = `swptls-card`;
  if (colored) {
    classes += ' colored-bg';
  }
  if (customClass) {
    classes += ' ' + customClass;
  }
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: classes
  }, children);
};
/* harmony default export */ __webpack_exports__["default"] = (Card);

/***/ }),

/***/ "./src/core/Column.tsx":
/*!*****************************!*\
  !*** ./src/core/Column.tsx ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _column_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_column.scss */ "./src/core/_column.scss");


const Column = ({
  firstXs,
  lastXs,
  firstSm,
  lastSm,
  firstMd,
  lastMd,
  firstLg,
  lastLg,
  firstXl,
  lastXl,
  xsOffset,
  smOffset,
  mdOffset,
  lgOffset,
  xlOffset,
  xs,
  sm,
  md,
  lg,
  xl,
  textXs,
  textSm,
  textMd,
  textLg,
  textXl,
  alignSelf,
  customClass,
  children
}) => {
  const classes = () => {
    let c = 'swptls-col';
    c += firstXs ? ' first-xs' : lastXs ? ' last-xs' : '';
    c += firstSm ? ' first-sm' : lastSm ? ' last-sm' : '';
    c += firstMd ? ' first-md' : lastMd ? ' last-md' : '';
    c += firstLg ? ' first-lg' : lastLg ? ' last-lg' : '';
    c += firstXl ? ' first-xl' : lastXl ? ' last-xl' : '';
    c += xsOffset ? ' col-xs-offset-' + xsOffset : '';
    c += smOffset ? ' col-sm-offset-' + smOffset : '';
    c += mdOffset ? ' col-md-offset-' + mdOffset : '';
    c += lgOffset ? ' col-lg-offset-' + lgOffset : '';
    c += xlOffset ? ' col-xl-offset-' + xlOffset : '';
    c += xs ? ' col-xs-' + xs : '';
    c += sm ? ' col-sm-' + sm : '';
    c += md ? ' col-md-' + md : '';
    c += lg ? ' col-lg-' + lg : '';
    c += xl ? ' col-xl-' + xl : '';
    c += textXs ? ' text-xs-' + textXs : '';
    c += textSm ? ' text-sm-' + textSm : '';
    c += textMd ? ' text-md-' + textMd : '';
    c += textLg ? ' text-lg-' + textLg : '';
    c += textXl ? ' text-xl-' + textXl : '';
    c += alignSelf ? ' align-self-' + alignSelf : '';
    return c;
  };
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `${classes()} ${customClass ? customClass : ''}`
  }, children);
};
/* harmony default export */ __webpack_exports__["default"] = (Column);

/***/ }),

/***/ "./src/core/Container.tsx":
/*!********************************!*\
  !*** ./src/core/Container.tsx ***!
  \********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _container_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_container.scss */ "./src/core/_container.scss");


const Container = ({
  fluid,
  hero,
  fullWidth,
  small,
  children
}) => {
  const classes = () => {
    let c = fluid ? 'swptls-container-fluid ' : 'swptls-container ';
    c += hero ? 'swptls-hero ' : '';
    c += fullWidth ? 'full-width ' : '';
    c += small ? 'small ' : '';
    return c;
  };
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: classes()
  }, children);
};
/* harmony default export */ __webpack_exports__["default"] = (Container);

/***/ }),

/***/ "./src/core/Modal.tsx":
/*!****************************!*\
  !*** ./src/core/Modal.tsx ***!
  \****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _modal_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_modal.scss */ "./src/core/_modal.scss");



const Modal = ({
  children,
  customClass
}) => {
  return (0,react_dom__WEBPACK_IMPORTED_MODULE_1__.createPortal)((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "modal-overlay"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "modal-content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `modal-content-inner ${customClass ? customClass : ''}`
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "modal-body"
  }, children)))), document.getElementById('simpleform-app-portal'));
};
/* harmony default export */ __webpack_exports__["default"] = (Modal);

/***/ }),

/***/ "./src/core/Row.tsx":
/*!**************************!*\
  !*** ./src/core/Row.tsx ***!
  \**************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _row_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_row.scss */ "./src/core/_row.scss");



const Row = ({
  reverse,
  startXs,
  centerXs,
  endXs,
  topXs,
  middleXs,
  bottomXs,
  aroundXs,
  betweenXs,
  startSm,
  centerSm,
  endSm,
  topSm,
  middleSm,
  bottomSm,
  aroundSm,
  betweenSm,
  startMd,
  centerMd,
  endMd,
  topMd,
  middleMd,
  bottomMd,
  aroundMd,
  betweenMd,
  startLg,
  centerLg,
  endLg,
  topLg,
  middleLg,
  bottomLg,
  aroundLg,
  betweenLg,
  customClass,
  children
}) => {
  const classes = () => {
    let c = reverse ? 'swptls-row reverse' : 'swptls-row ';
    c += startXs ? ' start-xs' : centerXs ? ' center-xs' : endXs ? ' end-xs' : '';
    c += startSm ? ' start-sm' : centerSm ? ' center-sm' : endSm ? ' end-sm' : '';
    c += startMd ? ' start-md' : centerMd ? ' center-md' : endMd ? ' end-md' : '';
    c += startLg ? ' start-lg' : centerLg ? ' center-lg' : endLg ? ' end-lg' : '';
    c += topXs ? ' top-xs' : middleXs ? ' middle-xs' : bottomXs ? ' bottom-xs' : '';
    c += topSm ? ' top-sm' : middleSm ? ' middle-sm' : bottomSm ? ' bottom-sm' : '';
    c += topMd ? ' top-md' : middleMd ? ' middle-md' : bottomMd ? ' bottom-md' : '';
    c += topLg ? ' top-lg' : middleLg ? ' middle-lg' : bottomLg ? ' bottom-lg' : '';
    c += aroundXs ? ' around-xs' : betweenXs ? ' between-xs' : '';
    c += aroundSm ? ' around-sm' : betweenSm ? ' between-sm' : '';
    c += aroundMd ? ' around-md' : betweenMd ? ' between-md' : '';
    c += aroundLg ? ' around-lg' : betweenLg ? ' between-lg' : '';
    return c;
  };
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `${classes()} ${customClass ? customClass : ''}`
  }, children);
};
/* harmony default export */ __webpack_exports__["default"] = (Row);

/***/ }),

/***/ "./src/core/Title.tsx":
/*!****************************!*\
  !*** ./src/core/Title.tsx ***!
  \****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _title_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_title.scss */ "./src/core/_title.scss");



const Title = ({
  tagName,
  children
}) => {
  const classes = () => {
    let c = `swptls-title ${tagName ? tagName : ""}`;
    return c;
  };
  if (tagName) {
    if (tagName === "h1") {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", {
        className: `${classes()}`
      }, children);
    }
    if (tagName === "h2") {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
        className: `${classes()}`
      }, children);
    }
    if (tagName === "h3") {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", {
        className: `${classes()}`
      }, children);
    }
    if (tagName === "h4") {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h4", {
        className: `${classes()}`
      }, children);
    }
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      className: `${classes()}`
    }, children);
  } else {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", {
      className: `${classes()}`
    }, children);
  }
};
/* harmony default export */ __webpack_exports__["default"] = (Title);

/***/ }),

/***/ "./src/icons.js":
/*!**********************!*\
  !*** ./src/icons.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdsProducts: function() { return /* binding */ AdsProducts; },
/* harmony export */   BluePlusIcon: function() { return /* binding */ BluePlusIcon; },
/* harmony export */   Cloud: function() { return /* binding */ Cloud; },
/* harmony export */   CopyIcon: function() { return /* binding */ CopyIcon; },
/* harmony export */   Cross: function() { return /* binding */ Cross; },
/* harmony export */   DashboardIcon: function() { return /* binding */ DashboardIcon; },
/* harmony export */   DeleteIcon: function() { return /* binding */ DeleteIcon; },
/* harmony export */   Desktop: function() { return /* binding */ Desktop; },
/* harmony export */   DesktopComputers: function() { return /* binding */ DesktopComputers; },
/* harmony export */   EditIcon: function() { return /* binding */ EditIcon; },
/* harmony export */   GrayPlusIcon: function() { return /* binding */ GrayPlusIcon; },
/* harmony export */   OrangeCopyIcon: function() { return /* binding */ OrangeCopyIcon; },
/* harmony export */   RedHeart: function() { return /* binding */ RedHeart; },
/* harmony export */   TrashCan: function() { return /* binding */ TrashCan; },
/* harmony export */   Unlock: function() { return /* binding */ Unlock; },
/* harmony export */   WhitePlusIcon: function() { return /* binding */ WhitePlusIcon; },
/* harmony export */   arrowRightIcon: function() { return /* binding */ arrowRightIcon; },
/* harmony export */   book: function() { return /* binding */ book; },
/* harmony export */   createTable: function() { return /* binding */ createTable; },
/* harmony export */   ctaAddImg: function() { return /* binding */ ctaAddImg; },
/* harmony export */   hintIcon: function() { return /* binding */ hintIcon; },
/* harmony export */   infoIcon: function() { return /* binding */ infoIcon; },
/* harmony export */   infoIconWithQuestionMark: function() { return /* binding */ infoIconWithQuestionMark; },
/* harmony export */   lockWhite: function() { return /* binding */ lockWhite; },
/* harmony export */   promoThumbnail: function() { return /* binding */ promoThumbnail; },
/* harmony export */   searchIcon: function() { return /* binding */ searchIcon; },
/* harmony export */   ssgslogo: function() { return /* binding */ ssgslogo; },
/* harmony export */   success: function() { return /* binding */ success; },
/* harmony export */   support: function() { return /* binding */ support; },
/* harmony export */   swapIcon: function() { return /* binding */ swapIcon; },
/* harmony export */   videoPlay: function() { return /* binding */ videoPlay; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);

const DashboardIcon = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "18",
  height: "18",
  viewBox: "0 0 18 18",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M1 10H7C7.26522 10 7.51957 9.89464 7.70711 9.70711C7.89464 9.51957 8 9.26522 8 9V1C8 0.734784 7.89464 0.48043 7.70711 0.292893C7.51957 0.105357 7.26522 0 7 0H1C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1V9C0 9.26522 0.105357 9.51957 0.292893 9.70711C0.48043 9.89464 0.734784 10 1 10ZM0 17C0 17.2652 0.105357 17.5196 0.292893 17.7071C0.48043 17.8946 0.734784 18 1 18H7C7.26522 18 7.51957 17.8946 7.70711 17.7071C7.89464 17.5196 8 17.2652 8 17V13C8 12.7348 7.89464 12.4804 7.70711 12.2929C7.51957 12.1054 7.26522 12 7 12H1C0.734784 12 0.48043 12.1054 0.292893 12.2929C0.105357 12.4804 0 12.7348 0 13V17ZM10 17C10 17.2652 10.1054 17.5196 10.2929 17.7071C10.4804 17.8946 10.7348 18 11 18H17C17.2652 18 17.5196 17.8946 17.7071 17.7071C17.8946 17.5196 18 17.2652 18 17V10C18 9.73478 17.8946 9.48043 17.7071 9.29289C17.5196 9.10536 17.2652 9 17 9H11C10.7348 9 10.4804 9.10536 10.2929 9.29289C10.1054 9.48043 10 9.73478 10 10V17ZM11 7H17C17.2652 7 17.5196 6.89464 17.7071 6.70711C17.8946 6.51957 18 6.26522 18 6V1C18 0.734784 17.8946 0.48043 17.7071 0.292893C17.5196 0.105357 17.2652 0 17 0H11C10.7348 0 10.4804 0.105357 10.2929 0.292893C10.1054 0.48043 10 0.734784 10 1V6C10 6.26522 10.1054 6.51957 10.2929 6.70711C10.4804 6.89464 10.7348 7 11 7Z",
  fill: "url(#paint0_linear_1465_730)"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("defs", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "paint0_linear_1465_730",
  x1: "9",
  y1: "0",
  x2: "9",
  y2: "18",
  gradientUnits: "userSpaceOnUse"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  "stop-color": "#0EBC57"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  "stop-color": "#03933F"
}))));
const Unlock = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "15",
  height: "17",
  viewBox: "0 0 15 17",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M4.82143 6.375H12.8571C14.0391 6.375 15 7.32793 15 8.5V14.875C15 16.0471 14.0391 17 12.8571 17H2.14286C0.959263 17 0 16.0471 0 14.875V8.5C0 7.32793 0.959263 6.375 2.14286 6.375H2.67857V4.78125C2.67857 2.14061 4.83817 0 7.5 0C9.42522 0 11.0826 1.11861 11.856 2.73162C12.1105 3.26154 11.8828 3.89473 11.3203 4.14707C10.7846 4.39941 10.1752 4.17363 9.92076 3.64238C9.48884 2.74357 8.56808 2.125 7.5 2.125C6.02009 2.125 4.82143 3.31434 4.82143 4.78125V6.375Z",
  fill: "url(#paint0_linear_1398_730)"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("defs", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "paint0_linear_1398_730",
  x1: "-9.83593e-07",
  y1: "-13.5",
  x2: "15",
  y2: "26",
  gradientUnits: "userSpaceOnUse"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  "stop-color": "#005AE0"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  "stop-color": "#E000A1"
}))));
const RedHeart = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "18",
  height: "16",
  viewBox: "0 0 18 16",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M17.5645 3.27888C17.2852 2.63724 16.8825 2.0558 16.379 1.56709C15.875 1.07693 15.2808 0.6874 14.6288 0.419693C13.9526 0.140996 13.2274 -0.0016576 12.4952 1.45314e-05C11.468 1.45314e-05 10.4658 0.279111 9.59485 0.806293C9.38649 0.932404 9.18855 1.07092 9.00103 1.22184C8.81351 1.07092 8.61557 0.932404 8.40721 0.806293C7.53628 0.279111 6.53408 1.45314e-05 5.50688 1.45314e-05C4.76721 1.45314e-05 4.05046 0.140597 3.3733 0.419693C2.71906 0.688453 2.12941 1.07505 1.6231 1.56709C1.11887 2.05524 0.716078 2.63683 0.43755 3.27888C0.147934 3.94665 0 4.65576 0 5.38554C0 6.07398 0.141683 6.79136 0.422965 7.52115C0.658409 8.13103 0.995947 8.76365 1.42725 9.40247C2.11066 10.4134 3.05035 11.4678 4.21715 12.5366C6.1507 14.3084 8.06551 15.5323 8.14677 15.5819L8.64057 15.8961C8.85935 16.0346 9.14063 16.0346 9.35941 15.8961L9.85321 15.5819C9.93447 15.5302 11.8472 14.3084 13.7828 12.5366C14.9496 11.4678 15.8893 10.4134 16.5727 9.40247C17.004 8.76365 17.3437 8.13103 17.577 7.52115C17.8583 6.79136 18 6.07398 18 5.38554C18.0021 4.65576 17.8541 3.94665 17.5645 3.27888Z",
  fill: "url(#paint0_linear_1465_710)"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("defs", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "paint0_linear_1465_710",
  x1: "9",
  y1: "0",
  x2: "9",
  y2: "16",
  gradientUnits: "userSpaceOnUse"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  "stop-color": "#FF3939"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  "stop-color": "#D819DC"
}))));
const DesktopComputers = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "336",
  height: "235",
  viewBox: "0 0 336 235",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.6",
  d: "M300.668 206.428C285.276 229.523 251.658 197.268 227.053 209.429C220.007 212.907 214.358 202.071 207.164 205.174C202.162 207.332 197.136 209.409 192.081 211.429L29.4462 213.55C27.5986 211.511 23.667 207.301 21.9383 205.174C5.89889 185.432 -4.42575 162.036 1.87121 135.044C8.3048 107.476 31.5026 84.9686 58.5617 78.9821C76.8823 74.9285 96.5098 78.0313 113.945 70.85C134.333 62.4551 147.177 42.0685 163.584 27.0428C180.604 11.4604 202.596 1.25772 225.217 0.106714C247.839 -1.05055 270.87 7.23171 286.428 23.6336C297.359 35.1499 304.363 50.2256 307.63 66.002C313.137 92.6065 315.876 183.602 300.668 206.428Z",
  fill: "url(#paint0_linear_1403_2569)"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M147.1 30.0213C143.737 30.0096 141.008 32.7373 141.018 36.0997L141.224 106.37C141.233 109.715 143.951 112.419 147.296 112.413L319.193 112.092C322.536 112.086 325.242 109.374 325.242 106.031V36.6841C325.242 33.3451 322.542 30.6352 319.203 30.6235L147.1 30.0213Z",
  fill: "url(#paint1_linear_1403_2569)"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M152.873 36.6445V47.2754L175.27 46.825V36.6445H152.873Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.3",
  d: "M152.873 52.5908V61.8929L175.27 61.4987V52.5908H152.873Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M152.873 67.2081V76.5102L175.27 76.1161V67.2081H152.873Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.3",
  d: "M152.873 81.8259V91.128L175.27 90.7338V81.8259H152.873Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M152.873 96.4435V105.746L175.27 105.351V96.4435H152.873Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M180.602 36.6445V47.2754L223.263 46.825V36.6445H180.602Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.3",
  d: "M180.602 52.5908V61.8929L223.262 61.4987V52.5908H180.602Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M180.602 67.2081V76.5102L223.262 76.1161V67.2081H180.602Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.3",
  d: "M180.602 81.8259V91.128L223.262 90.7338V81.8259H180.602Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M180.602 96.4435V105.746L223.262 105.351V96.4435H180.602Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M227.528 36.6445V47.2754L262.723 46.825V36.6445H227.528Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.3",
  d: "M227.528 52.5908V61.8929L262.723 61.4987V52.5908H227.528Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M227.528 67.2081V76.5102L262.723 76.1161V67.2081H227.528Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.3",
  d: "M227.528 81.8259V91.128L262.723 90.7338V81.8259H227.528Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M227.528 96.4435V105.746L262.723 105.351V96.4435H227.528Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M284.053 60.5641C286.409 60.5641 288.319 58.1843 288.319 55.2486C288.319 52.313 286.409 49.9332 284.053 49.9332C281.697 49.9332 279.787 52.313 279.787 55.2486C279.787 58.1843 281.697 60.5641 284.053 60.5641Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M295.785 60.5641C298.141 60.5641 300.051 58.1843 300.051 55.2486C300.051 52.313 298.141 49.9332 295.785 49.9332C293.429 49.9332 291.519 52.313 291.519 55.2486C291.519 58.1843 293.429 60.5641 295.785 60.5641Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M307.516 60.5641C309.872 60.5641 311.782 58.1843 311.782 55.2486C311.782 52.313 309.872 49.9332 307.516 49.9332C305.16 49.9332 303.25 52.313 303.25 55.2486C303.25 58.1843 305.16 60.5641 307.516 60.5641Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M321.381 67.2082H270.189V105.745H321.381V67.2082Z",
  fill: "#E9EDFA"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M272.321 96.7148C272.321 96.7148 275.805 87.2176 279.116 88.249C282.427 89.2803 283.254 93.6207 285.738 91.7728C288.221 89.9249 289.842 82.4475 292.256 81.2442C295.705 79.5682 296.843 81.4161 301.499 84.7251C306.155 88.0341 308.121 87.3035 310.018 84.854C311.777 82.6194 315.019 76.56 318.606 73.8527",
  stroke: "#BAC6F2",
  "stroke-width": "1.17596",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M163.5 223C237.23 223 297 218.747 297 213.5C297 208.253 237.23 204 163.5 204C89.77 204 30 208.253 30 213.5C30 218.747 89.77 223 163.5 223Z",
  fill: "url(#paint2_linear_1403_2569)"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M64.0675 186.604H218.078C218.078 186.604 223.842 186.324 223.842 180.161V167.928H58.0002V182.775C58.8091 185.11 61.2361 186.697 64.0675 186.604Z",
  fill: "url(#paint3_linear_1403_2569)"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M58.1011 75.404L58 172.517L223.943 171.116V72.6027C223.943 72.6027 224.954 67 218.482 67H64.3708C64.3708 67 57.3933 67 58.1011 75.404Z",
  fill: "url(#paint4_linear_1403_2569)"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M127.877 212.575V185.589L152.146 186.523V210.241L127.877 212.575Z",
  fill: "url(#paint5_linear_1403_2569)"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M89.3484 209.868H190.168L190.269 214.537H89.3484V209.868Z",
  fill: "url(#paint6_linear_1403_2569)"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M139.505 174.478C142.235 174.478 144.359 176.438 144.359 178.96C144.359 181.481 142.235 183.442 139.505 183.442C136.774 183.442 134.651 181.481 134.651 178.96C134.651 176.438 136.876 174.478 139.505 174.478Z",
  fill: "white"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M218.886 71.6683H63.157V165.98H218.886V71.6683Z",
  fill: "#F8F8FF"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M70.9441 76.5247C72.2587 76.5247 73.371 77.5518 73.371 78.7657C73.371 79.9797 72.2587 81.0068 70.9441 81.0068C69.6295 81.0068 68.5171 79.9797 68.5171 78.7657C68.5171 77.5518 69.6295 76.5247 70.9441 76.5247Z",
  fill: "#FA5F5D"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M79.2363 76.5247C80.5509 76.5247 81.6632 77.5518 81.6632 78.7657C81.6632 79.9797 80.5509 81.0068 79.2363 81.0068C77.9217 81.0068 76.8093 79.9797 76.8093 78.7657C76.8093 77.5518 77.9217 76.5247 79.2363 76.5247Z",
  fill: "#FDBC4E"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M87.9325 76.5247C89.2471 76.5247 90.3594 77.5518 90.3594 78.7657C90.3594 79.9797 89.2471 81.0068 87.9325 81.0068C86.6179 81.0068 85.5056 79.9797 85.5056 78.7657C85.5056 77.5518 86.6179 76.5247 87.9325 76.5247Z",
  fill: "#37CD58"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M121.808 92.9585C121.707 94.1724 120.595 95.1062 119.28 95.0129H89.4491C87.9323 95.0129 86.4154 94.0791 86.4154 92.9585V88.7565C86.4154 87.636 87.8312 86.6089 89.4491 86.6089H119.179C120.494 86.5155 121.707 87.4492 121.808 88.6632V88.7565V92.9585Z",
  fill: "url(#paint7_linear_1403_2569)"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M156.473 120.778C156.406 122.093 155.602 123.127 154.664 123.033H87.4899C86.4853 123.033 85.4807 121.999 85.4807 120.778V99.9232C85.4807 98.7019 86.4853 97.6686 87.4899 97.6686H154.664C155.602 97.5747 156.406 98.608 156.473 99.9232V120.778Z",
  fill: "#DFE4F7"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M119.786 138.527C119.786 139.741 118.674 140.768 117.359 140.768H89.4491C87.8312 140.768 86.4154 139.741 86.4154 138.527V127.135C86.4154 125.921 87.9323 124.894 89.4491 124.894H117.157C118.471 124.801 119.685 125.734 119.786 127.042V127.135V138.527Z",
  fill: "#DFE4F7"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M156.191 138.527C156.191 139.741 155.078 140.768 153.764 140.768H125.854C124.236 140.768 122.82 139.741 122.82 138.527V127.135C122.82 125.921 124.337 124.894 125.854 124.894H153.562C154.876 124.801 156.09 125.734 156.191 127.042V127.135V138.527Z",
  fill: "#DFE4F7"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M193.606 138.527C193.505 139.834 192.291 140.862 190.875 140.768H163.168C161.794 140.853 160.67 140.019 160.319 138.89C160.246 138.653 160.235 138.402 160.235 138.154V127.135C160.336 125.734 161.651 124.801 163.168 124.894H190.875C192.291 124.801 193.606 125.828 193.707 127.135L193.606 138.527Z",
  fill: "#DFE4F7"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M156.191 144.97C155.989 145.437 155.584 145.717 155.078 145.811C154.977 145.811 154.977 145.811 154.876 145.437H124.337C123.73 145.811 122.82 145.437 122.82 144.97V144.597C122.82 144.13 123.73 143.663 124.337 143.57H154.876C155.382 143.663 155.685 144.037 155.786 144.41C155.786 144.503 155.786 144.503 156.09 144.597L156.191 144.97Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M156.191 148.612C155.989 149.079 155.584 149.453 155.078 149.546C155.078 149.546 154.977 149.546 154.977 149.172H124.337C123.73 149.546 122.82 149.172 122.82 148.612V148.239C122.82 147.772 123.73 147.398 124.337 147.305H154.876C155.382 147.398 155.887 147.772 156.09 148.239L156.191 148.612Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M156.191 152.347C155.989 152.907 155.483 153.281 154.977 153.374C154.977 153.187 154.977 153.094 154.977 152.907H124.337C123.831 153.187 123.225 153.094 122.921 152.627C122.82 152.534 122.82 152.44 122.82 152.347V151.974C122.82 151.507 123.73 151.226 124.337 151.04H154.876C155.382 151.133 155.887 151.507 156.09 151.974L156.191 152.347Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M156.191 155.988C155.887 156.549 155.483 157.109 154.977 157.576H124.337C123.73 157.109 122.82 156.549 122.82 155.988V155.615C122.82 155.148 123.73 154.588 124.337 154.775H154.876C155.281 154.681 155.685 154.961 155.786 155.335C155.786 155.428 155.786 155.522 155.786 155.615C155.786 155.615 155.786 155.615 156.09 155.708L156.191 155.988Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M139.202 159.724C139.202 160.191 138.899 160.378 138.292 160.378H124.236C123.629 160.378 122.82 160.191 122.82 159.724V159.35C122.82 158.884 123.629 158.51 124.236 158.51H138.292C138.798 158.51 139.202 158.884 139.202 159.35V159.724Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M193.606 144.97C193 145.437 193.101 145.811 192.494 145.437H161.955C161.449 145.811 160.944 145.531 160.944 145.064C160.944 145.064 160.944 145.064 161.247 144.97V144.597C160.944 144.13 161.348 143.663 161.955 143.57H192.494C193.101 143.756 193 144.13 193.606 144.597V144.97Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M193.607 148.612C193 149.079 193.101 149.546 192.494 149.172H161.955C161.348 149.546 160.944 149.172 161.247 148.612V148.239C160.944 147.772 161.348 147.398 161.955 147.305H192.494C193.101 147.492 193 147.772 193.607 148.239V148.612Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M193.607 152.347C193 152.814 193.101 153.374 192.494 152.907H161.955C161.348 153.281 160.944 152.907 161.247 152.347V151.974C160.944 151.507 161.348 151.226 161.955 151.04H192.494C193.101 151.226 193 151.507 193.607 151.974V152.347Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M193.606 155.989C192.999 156.456 193.1 157.11 192.494 157.576H161.954C161.348 157.016 160.943 156.549 161.247 155.989V155.616C161.044 155.429 161.044 155.055 161.247 154.869C161.449 154.775 161.651 154.682 161.853 154.775H192.494C193.1 154.588 192.999 155.149 193.606 155.616V155.989Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M176.82 159.724C176.82 160.191 176.82 160.378 176.315 160.378H162.157C161.551 160.378 161.247 160.191 161.247 159.724V159.35C161.247 158.884 161.652 158.51 162.157 158.51H176.213C176.82 158.51 176.719 158.884 176.719 159.35L176.82 159.724Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M118.775 144.97C119.179 145.437 118.977 145.811 118.37 145.437H87.73C87.3255 145.717 86.8199 145.624 86.6177 145.344C86.5166 145.25 86.5166 145.157 86.4154 144.97V144.597C86.6177 144.037 87.1233 143.663 87.73 143.57H118.269C118.876 143.756 119.078 144.13 118.674 144.597L118.775 144.97Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M118.775 148.612C119.179 149.079 118.977 149.546 118.37 149.172H87.73C87.1233 149.639 86.6177 149.172 86.4154 148.612V148.239C86.5166 147.772 87.1233 147.398 87.73 147.305H118.269C118.876 147.492 119.078 147.772 118.674 148.239L118.775 148.612Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M118.775 152.347C119.179 152.814 118.977 153.374 118.37 152.907H87.73C87.1233 153.374 86.6177 152.907 86.4154 152.347V151.974C86.5166 151.507 87.1233 151.226 87.73 151.04H118.269C118.876 151.226 119.078 151.507 118.674 151.974L118.775 152.347Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M109.674 154.775H118.37C118.977 154.588 119.179 155.148 118.775 155.615V155.988C119.179 156.455 118.977 157.109 118.37 157.576H87.73C87.1233 157.202 86.7188 156.642 86.4154 155.988V155.615C86.5166 155.055 87.1233 154.681 87.73 154.775H109.674Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M103.606 159.724C103.606 160.191 103.303 160.378 102.696 160.378H87.5278C86.9211 160.378 86.4154 160.191 86.4154 159.724V159.35C86.5166 158.884 87.0222 158.51 87.5278 158.51H102.696C103.202 158.51 103.606 158.884 103.606 159.257C103.606 159.257 103.606 159.257 103.606 159.35V159.724Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M186.727 118.812H164.558C163.145 118.812 162 117.667 162 116.254V85.5582C162 84.1454 163.145 83.0002 164.558 83.0002H180.759L189.285 91.5269V116.254C189.285 117.667 188.14 118.812 186.727 118.812Z",
  fill: "#43A047"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M189.285 91.5266H180.759V83L189.285 91.5266Z",
  fill: "#C8E6C9"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M180.759 91.528L189.285 100.055V91.528H180.759Z",
  fill: "#2E7D32"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M181.611 100.052H169.674H167.968V101.757V103.463V105.168V106.873V108.579V110.284V111.989H183.316V110.284V108.579V106.873V105.168V103.463V101.757V100.052H181.611ZM169.674 101.757H173.084V103.463H169.674V101.757ZM169.674 105.168H173.084V106.873H169.674V105.168ZM169.674 108.579H173.084V110.284H169.674V108.579ZM181.611 110.284H174.79V108.579H181.611V110.284ZM181.611 106.873H174.79V105.168H181.611V106.873ZM181.611 103.463H174.79V101.757H181.611V103.463Z",
  fill: "#E8F5E9"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M278.576 196.671C278.576 196.671 281.468 180.962 266.219 172.549C251.003 164.136 250.28 164.235 247.257 163.282C245.515 162.69 243.74 163.939 245.745 166.437C247.75 168.967 246.599 169.592 250.609 170.709C254.618 171.826 255.21 176.69 257.214 177.906C259.219 179.122 260.961 179.451 267.073 182.08C272.627 184.479 277.36 191.249 277.36 193.615C277.36 195.981 282.782 196.803 282.782 196.803L278.576 196.671Z",
  fill: "url(#paint8_linear_1403_2569)"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
  filter: "url(#filter0_d_1403_2569)"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M278.381 194.469C278.214 194.469 278.089 194.316 278.124 194.153C278.596 191.995 280.763 179.326 268.585 172.188C255.242 164.366 250.609 164.465 247.947 163.512C246.435 162.953 250.576 164.859 252.318 167.16C254.059 169.493 253.632 168.967 256.754 170.676C260.369 172.681 261.881 174.62 264.017 175.014C267.106 175.606 266.186 178.826 271.543 181.225C276.374 183.427 276.998 189.31 276.998 191.511C276.998 192.368 277.693 193.002 278.551 193.459C278.828 193.607 278.696 194.469 278.381 194.469Z",
  fill: "url(#paint9_linear_1403_2569)"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
  filter: "url(#filter1_d_1403_2569)"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M291.458 192.333L292.97 190.887C293.693 190.23 294.58 189.737 295.533 189.474C300.232 188.225 315.054 183.591 321.199 172.385C321.258 172.297 321.212 172.182 321.131 172.135C321.112 172.125 321.09 172.122 321.068 172.122C321.019 172.122 320.981 172.087 320.933 172.084C318.735 171.923 308.263 171.891 294.317 183.788C294.054 183.986 293.824 184.249 293.627 184.479C293.265 184.972 292.674 185.826 292.411 186.253C292.049 186.911 292.772 187.995 291.787 188.948C291.185 189.529 290.156 190.649 289.444 191.433C289.024 191.897 289.1 192.621 289.604 192.992C290.056 193.324 290.687 193.249 291.048 192.82L291.458 192.333Z",
  fill: "url(#paint10_linear_1403_2569)"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M283.439 191.413C283.439 191.413 287.482 155.23 276.439 143.86C266.285 133.409 266.12 143.005 266.153 144.648C266.153 144.813 266.219 144.911 266.252 145.043C268.651 149.512 269.472 154.672 268.618 159.667C267.566 164.892 275.059 164.202 275.716 169.362C276.374 174.521 278.97 182.474 278.707 186.122C278.444 189.77 278.411 193.319 278.411 193.319L282.486 193.45L283.439 191.413Z",
  fill: "url(#paint11_linear_1403_2569)"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
  filter: "url(#filter2_d_1403_2569)"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M283.406 191.512C283.439 191.446 283.472 191.347 283.472 191.249C283.735 188.882 287.12 154.803 276.472 143.827C266.383 133.409 266.219 142.841 266.285 144.55C266.318 144.747 266.416 144.944 266.515 145.108C267.271 146.193 270.59 150.925 273.547 150.399C281.73 148.953 274.501 158.78 278.937 164.038C282.486 168.179 281.303 182.507 281.04 186.188C280.876 188.258 280.515 190.296 279.989 192.3C279.894 192.803 280.221 193.276 280.681 193.402C280.723 193.414 280.81 193.418 280.81 193.418C280.876 193.418 280.942 193.451 281.007 193.451H281.763C282.223 193.483 282.618 193.253 282.815 192.859L283.406 191.512Z",
  fill: "url(#paint12_linear_1403_2569)"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
  filter: "url(#filter3_d_1403_2569)"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M285.476 192.979C286.443 193.301 287.475 192.63 287.64 191.624C288.17 188.389 289.717 181.908 293.956 177.479C295.599 175.803 297.669 174.653 299.937 174.127C301.645 173.74 304.429 172.373 306.892 167.886C306.988 167.71 307.09 167.541 307.209 167.38C308.098 166.171 312.27 160.722 316.467 158.944C320.094 157.371 318.123 156.875 317.034 156.731C316.658 156.681 316.283 156.711 315.913 156.793C313.292 157.371 301.952 160.189 294.35 167.127C293.791 167.62 293.233 168.08 292.608 168.474C290.423 169.984 284.438 175.515 284.417 191.515C284.416 192.178 284.846 192.769 285.476 192.979Z",
  fill: "url(#paint13_linear_1403_2569)"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
  filter: "url(#filter4_d_1403_2569)"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M298.93 193.529C299.041 193.058 299.193 192.53 298.924 192.127C298.748 191.863 298.389 191.628 297.669 191.643C296.269 191.708 272.894 191.515 272.469 191.512C272.456 191.511 272.457 191.511 272.444 191.512C272.296 191.517 271.351 191.578 271.411 192.366C271.477 193.22 275.092 213.037 275.421 213.431C275.585 213.694 275.815 213.891 276.111 213.957C276.53 214.077 290.406 214.006 292.888 213.992C293.142 213.991 293.407 213.993 293.62 213.853C293.706 213.797 293.781 213.725 293.84 213.643C294.01 213.405 294.022 213.101 294.094 212.817C294.742 210.267 298.163 196.78 298.93 193.529Z",
  fill: "url(#paint14_linear_1403_2569)"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("defs", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("filter", {
  id: "filter0_d_1403_2569",
  x: "233.237",
  y: "155.023",
  width: "59.8491",
  height: "59.8238",
  filterUnits: "userSpaceOnUse",
  "color-interpolation-filters": "sRGB"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feFlood", {
  "flood-opacity": "0",
  result: "BackgroundImageFix"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feColorMatrix", {
  in: "SourceAlpha",
  type: "matrix",
  values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
  result: "hardAlpha"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feOffset", {
  dy: "5.99338"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feGaussianBlur", {
  stdDeviation: "7.19205"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feComposite", {
  in2: "hardAlpha",
  operator: "out"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feColorMatrix", {
  type: "matrix",
  values: "0 0 0 0 0.191667 0 0 0 0 0.575 0 0 0 0 0.35307 0 0 0 0.2 0"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feBlend", {
  mode: "normal",
  in2: "BackgroundImageFix",
  result: "effect1_dropShadow_1403_2569"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feBlend", {
  mode: "normal",
  in: "SourceGraphic",
  in2: "effect1_dropShadow_1403_2569",
  result: "shape"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("filter", {
  id: "filter1_d_1403_2569",
  x: "274.788",
  y: "163.66",
  width: "60.822",
  height: "49.9158",
  filterUnits: "userSpaceOnUse",
  "color-interpolation-filters": "sRGB"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feFlood", {
  "flood-opacity": "0",
  result: "BackgroundImageFix"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feColorMatrix", {
  in: "SourceAlpha",
  type: "matrix",
  values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
  result: "hardAlpha"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feOffset", {
  dy: "5.99338"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feGaussianBlur", {
  stdDeviation: "7.19205"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feComposite", {
  in2: "hardAlpha",
  operator: "out"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feColorMatrix", {
  type: "matrix",
  values: "0 0 0 0 0.191667 0 0 0 0 0.575 0 0 0 0 0.35307 0 0 0 0.2 0"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feBlend", {
  mode: "normal",
  in2: "BackgroundImageFix",
  result: "effect1_dropShadow_1403_2569"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feBlend", {
  mode: "normal",
  in: "SourceGraphic",
  in2: "effect1_dropShadow_1403_2569",
  result: "shape"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("filter", {
  id: "filter2_d_1403_2569",
  x: "251.893",
  y: "130.609",
  width: "46.6792",
  height: "83.2218",
  filterUnits: "userSpaceOnUse",
  "color-interpolation-filters": "sRGB"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feFlood", {
  "flood-opacity": "0",
  result: "BackgroundImageFix"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feColorMatrix", {
  in: "SourceAlpha",
  type: "matrix",
  values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
  result: "hardAlpha"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feOffset", {
  dy: "5.99338"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feGaussianBlur", {
  stdDeviation: "7.19205"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feComposite", {
  in2: "hardAlpha",
  operator: "out"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feColorMatrix", {
  type: "matrix",
  values: "0 0 0 0 0.191667 0 0 0 0 0.575 0 0 0 0 0.35307 0 0 0 0.2 0"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feBlend", {
  mode: "normal",
  in2: "BackgroundImageFix",
  result: "effect1_dropShadow_1403_2569"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feBlend", {
  mode: "normal",
  in: "SourceGraphic",
  in2: "effect1_dropShadow_1403_2569",
  result: "shape"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("filter", {
  id: "filter3_d_1403_2569",
  x: "270.033",
  y: "148.316",
  width: "62.9067",
  height: "65.122",
  filterUnits: "userSpaceOnUse",
  "color-interpolation-filters": "sRGB"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feFlood", {
  "flood-opacity": "0",
  result: "BackgroundImageFix"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feColorMatrix", {
  in: "SourceAlpha",
  type: "matrix",
  values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
  result: "hardAlpha"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feOffset", {
  dy: "5.99338"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feGaussianBlur", {
  stdDeviation: "7.19205"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feComposite", {
  in2: "hardAlpha",
  operator: "out"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feColorMatrix", {
  type: "matrix",
  values: "0 0 0 0 0.191667 0 0 0 0 0.575 0 0 0 0 0.35307 0 0 0 0.2 0"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feBlend", {
  mode: "normal",
  in2: "BackgroundImageFix",
  result: "effect1_dropShadow_1403_2569"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feBlend", {
  mode: "normal",
  in: "SourceGraphic",
  in2: "effect1_dropShadow_1403_2569",
  result: "shape"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("filter", {
  id: "filter4_d_1403_2569",
  x: "257.024",
  y: "183.121",
  width: "56.4343",
  height: "51.2822",
  filterUnits: "userSpaceOnUse",
  "color-interpolation-filters": "sRGB"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feFlood", {
  "flood-opacity": "0",
  result: "BackgroundImageFix"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feColorMatrix", {
  in: "SourceAlpha",
  type: "matrix",
  values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
  result: "hardAlpha"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feOffset", {
  dy: "5.99338"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feGaussianBlur", {
  stdDeviation: "7.19205"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feComposite", {
  in2: "hardAlpha",
  operator: "out"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feColorMatrix", {
  type: "matrix",
  values: "0 0 0 0 0.191667 0 0 0 0 0.575 0 0 0 0 0.35307 0 0 0 0.2 0"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feBlend", {
  mode: "normal",
  in2: "BackgroundImageFix",
  result: "effect1_dropShadow_1403_2569"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feBlend", {
  mode: "normal",
  in: "SourceGraphic",
  in2: "effect1_dropShadow_1403_2569",
  result: "shape"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "paint0_linear_1403_2569",
  x1: "191.411",
  y1: "218.772",
  x2: "181.434",
  y2: "-19.4039",
  gradientUnits: "userSpaceOnUse"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  "stop-color": "#0BB352",
  "stop-opacity": "0.28"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  "stop-color": "#24B670",
  "stop-opacity": "0"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "paint1_linear_1403_2569",
  x1: "141.007",
  y1: "71.1962",
  x2: "325.408",
  y2: "71.1962",
  gradientUnits: "userSpaceOnUse"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  "stop-color": "#4B45BD"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  "stop-color": "#58CAEA"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "paint2_linear_1403_2569",
  x1: "163.5",
  y1: "204",
  x2: "165.026",
  y2: "236.151",
  gradientUnits: "userSpaceOnUse"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  "stop-color": "#9CE8C6"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  "stop-color": "#ABEBCE",
  "stop-opacity": "0"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "paint3_linear_1403_2569",
  x1: "58.0068",
  y1: "177.264",
  x2: "223.991",
  y2: "177.264",
  gradientUnits: "userSpaceOnUse"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  "stop-color": "#4B45BD"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  "stop-color": "#58CAEA"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "paint4_linear_1403_2569",
  x1: "58.0067",
  y1: "119.738",
  x2: "224.15",
  y2: "119.738",
  gradientUnits: "userSpaceOnUse"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  "stop-color": "#4B45BD"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  "stop-color": "#58CAEA"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "paint5_linear_1403_2569",
  x1: "127.878",
  y1: "199.077",
  x2: "152.168",
  y2: "199.077",
  gradientUnits: "userSpaceOnUse"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  "stop-color": "#4B45BD"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  "stop-color": "#58CAEA"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "paint6_linear_1403_2569",
  x1: "89.3525",
  y1: "212.202",
  x2: "190.36",
  y2: "212.202",
  gradientUnits: "userSpaceOnUse"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  "stop-color": "#4B45BD"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  "stop-color": "#58CAEA"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "paint7_linear_1403_2569",
  x1: "86.3907",
  y1: "90.7944",
  x2: "121.784",
  y2: "90.7944",
  gradientUnits: "userSpaceOnUse"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  "stop-color": "#96BAE4"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  "stop-color": "#96CDFF"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "paint8_linear_1403_2569",
  x1: "244.901",
  y1: "179.94",
  x2: "282.857",
  y2: "179.94",
  gradientUnits: "userSpaceOnUse"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  "stop-color": "#93FD93"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "0.51",
  "stop-color": "#21C2C1"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  "stop-color": "#84F599"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "paint9_linear_1403_2569",
  x1: "264.676",
  y1: "163.414",
  x2: "264.676",
  y2: "194.469",
  gradientUnits: "userSpaceOnUse"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  "stop-color": "#0EBC57"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  "stop-color": "#03933F"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "paint10_linear_1403_2569",
  x1: "304.945",
  y1: "172.051",
  x2: "304.945",
  y2: "193.582",
  gradientUnits: "userSpaceOnUse"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  "stop-color": "#0EBC57"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  "stop-color": "#03933F"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "paint11_linear_1403_2569",
  x1: "291.41",
  y1: "186.201",
  x2: "265.944",
  y2: "153.962",
  gradientUnits: "userSpaceOnUse"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  "stop-color": "#93FD93"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "0.51",
  "stop-color": "#21C2C1"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  "stop-color": "#84F599"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "paint12_linear_1403_2569",
  x1: "275.233",
  y1: "139",
  x2: "275.233",
  y2: "193.454",
  gradientUnits: "userSpaceOnUse"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  "stop-color": "#0EBC57"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  "stop-color": "#03933F"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "paint13_linear_1403_2569",
  x1: "301.486",
  y1: "156.676",
  x2: "301.486",
  y2: "193.615",
  gradientUnits: "userSpaceOnUse"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  "stop-color": "#0EBC57"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  "stop-color": "#03933F"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "paint14_linear_1403_2569",
  x1: "285.249",
  y1: "191.511",
  x2: "285.249",
  y2: "214.026",
  gradientUnits: "userSpaceOnUse"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  "stop-color": "#0EBC57"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  "stop-color": "#03933F"
}))));
const CopyIcon = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "14",
  height: "14",
  viewBox: "0 0 14 14",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M12.6 0H5.6C4.8279 0 4.2 0.6279 4.2 1.4V4.2H1.4C0.6279 4.2 0 4.8279 0 5.6V12.6C0 13.3721 0.6279 14 1.4 14H8.4C9.1721 14 9.8 13.3721 9.8 12.6V9.8H12.6C13.3721 9.8 14 9.1721 14 8.4V1.4C14 0.6279 13.3721 0 12.6 0ZM1.4 12.6V5.6H8.4L8.4014 12.6H1.4ZM12.6 8.4H9.8V5.6C9.8 4.8279 9.1721 4.2 8.4 4.2H5.6V1.4H12.6V8.4Z",
  fill: "#666873"
}));
const EditIcon = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "16",
  height: "15",
  viewBox: "0 0 16 15",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M14.5011 3.08825L11.923 0.510192C11.5865 0.194141 11.1456 0.0127958 10.6842 0.000651813C10.2227 -0.0114921 9.77286 0.146413 9.42023 0.444329L0.952174 8.91239C0.648045 9.21909 0.458679 9.62108 0.415864 10.0509L0.0112788 13.9744C-0.00139608 14.1122 0.016486 14.2511 0.0636501 14.3812C0.110814 14.5113 0.186099 14.6294 0.284138 14.7271C0.372056 14.8143 0.476322 14.8833 0.590959 14.9301C0.705595 14.977 0.828346 15.0007 0.952174 15H1.03686L4.96039 14.6424C5.39019 14.5996 5.79217 14.4103 6.09887 14.1061L14.5669 5.63807C14.8956 5.29085 15.0732 4.8275 15.0609 4.34955C15.0485 3.8716 14.8472 3.41804 14.5011 3.08825ZM4.79103 12.7607L1.96834 13.0241L2.22238 10.2014L7.53844 4.95122L10.0789 7.49164L4.79103 12.7607ZM11.302 6.23084L8.78043 3.70924L10.6152 1.82745L13.1838 4.39609L11.302 6.23084Z",
  fill: "#7E8AA2"
}));
const DeleteIcon = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "14",
  height: "15",
  viewBox: "0 0 14 15",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M12.75 2.25C12.9489 2.25 13.1397 2.32902 13.2803 2.46967C13.421 2.61032 13.5 2.80109 13.5 3C13.5 3.19891 13.421 3.38968 13.2803 3.53033C13.1397 3.67098 12.9489 3.75 12.75 3.75H12L11.9977 3.80325L11.298 13.6065C11.2711 13.9849 11.1017 14.3391 10.8241 14.5977C10.5465 14.8563 10.1811 15 9.80175 15H3.6975C3.3181 15 2.9528 14.8563 2.67516 14.5977C2.39753 14.3391 2.22819 13.9849 2.20125 13.6065L1.5015 3.804C1.50036 3.78602 1.49986 3.76801 1.5 3.75H0.75C0.551088 3.75 0.360322 3.67098 0.21967 3.53033C0.0790176 3.38968 0 3.19891 0 3C0 2.80109 0.0790176 2.61032 0.21967 2.46967C0.360322 2.32902 0.551088 2.25 0.75 2.25H12.75ZM10.4977 3.75H3.00225L3.69825 13.5H9.80175L10.4977 3.75ZM8.25 0C8.44891 0 8.63968 0.0790176 8.78033 0.21967C8.92098 0.360322 9 0.551088 9 0.75C9 0.948912 8.92098 1.13968 8.78033 1.28033C8.63968 1.42098 8.44891 1.5 8.25 1.5H5.25C5.05109 1.5 4.86032 1.42098 4.71967 1.28033C4.57902 1.13968 4.5 0.948912 4.5 0.75C4.5 0.551088 4.57902 0.360322 4.71967 0.21967C4.86032 0.0790176 5.05109 0 5.25 0H8.25Z",
  fill: "#7E8AA2"
}));
const WhitePlusIcon = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "19",
  height: "19",
  viewBox: "0 0 19 19",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M17.2689 7.71154H11.2876V1.73023C11.2876 -0.576213 7.7107 -0.576213 7.7107 1.73023V7.71154H1.72939C-0.576462 7.71154 -0.576462 11.2884 1.72939 11.2884H7.7107V17.2698C7.7107 19.5762 11.2876 19.5762 11.2876 17.2698V11.2884H17.2689C19.5751 11.2884 19.5751 7.71154 17.2689 7.71154Z",
  fill: "white"
}));
const BluePlusIcon = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "10",
  height: "10",
  viewBox: "0 0 10 10",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M4.09103 9.5V5.64286H0.233887V4.35714H4.09103V0.5H5.37674V4.35714H9.23389V5.64286H5.37674V9.5H4.09103Z",
  fill: "#3858E9"
}));
const GrayPlusIcon = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "17",
  height: "19",
  viewBox: "0 0 17 19",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M7.75874 0.604637H9.2413C9.37308 0.604637 9.43898 0.670529 9.43898 0.802312V18.1977C9.43898 18.3295 9.37308 18.3954 9.2413 18.3954H7.75874C7.62696 18.3954 7.56107 18.3295 7.56107 18.1977V0.802312C7.56107 0.670529 7.62696 0.604637 7.75874 0.604637Z",
  fill: "#939393"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M0.197675 8.56104H16.8024C16.9341 8.56104 17 8.62693 17 8.75872V10.2413C17 10.3731 16.9341 10.439 16.8024 10.439H0.197675C0.0658916 10.439 0 10.3731 0 10.2413V8.75872C0 8.62693 0.0658916 8.56104 0.197675 8.56104Z",
  fill: "#939393"
}));
const OrangeCopyIcon = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "19",
  height: "19",
  viewBox: "0 0 19 19",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M17.1 0H7.6C6.55215 0 5.7 0.85215 5.7 1.9V5.7H1.9C0.85215 5.7 0 6.55215 0 7.6V17.1C0 18.1479 0.85215 19 1.9 19H11.4C12.4479 19 13.3 18.1479 13.3 17.1V13.3H17.1C18.1479 13.3 19 12.4479 19 11.4V1.9C19 0.85215 18.1479 0 17.1 0ZM1.9 17.1V7.6H11.4L11.4019 17.1H1.9ZM17.1 11.4H13.3V7.6C13.3 6.55215 12.4479 5.7 11.4 5.7H7.6V1.9H17.1V11.4Z",
  fill: "#FF7E47"
}));
const searchIcon = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "17",
  height: "17",
  viewBox: "0 0 17 17",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M16 16L12.4584 12.4521L16 16ZM14.4211 7.71053C14.4211 9.49027 13.7141 11.1971 12.4556 12.4556C11.1971 13.7141 9.49027 14.4211 7.71053 14.4211C5.93078 14.4211 4.22394 13.7141 2.96547 12.4556C1.707 11.1971 1 9.49027 1 7.71053C1 5.93078 1.707 4.22394 2.96547 2.96547C4.22394 1.707 5.93078 1 7.71053 1C9.49027 1 11.1971 1.707 12.4556 2.96547C13.7141 4.22394 14.4211 5.93078 14.4211 7.71053V7.71053Z",
  stroke: "#AFB0B8",
  "stroke-width": "2",
  "stroke-linecap": "round"
}));
const infoIcon = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "18",
  height: "19",
  viewBox: "0 0 18 19",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  "fill-rule": "evenodd",
  "clip-rule": "evenodd",
  d: "M9.88217 0.543305C11.9587 0.747916 13.8957 1.66711 15.3526 3.13937C16.9398 4.72812 17.8783 6.83682 17.989 9.06351C18.0997 11.2902 17.3749 13.4792 15.9529 15.2132C14.645 16.8151 12.8096 17.9157 10.7646 18.3243C8.71973 18.7329 6.59418 18.4238 4.75625 17.4505C2.91439 16.4562 1.47652 14.8668 0.684753 12.9501C-0.110552 11.0236 -0.216408 8.88767 0.38461 6.89395C0.984337 4.908 2.26109 3.18674 3.99937 2.02071C5.72304 0.862073 7.80594 0.338973 9.88217 0.543305ZM10.4981 17.0648C12.2505 16.7146 13.8241 15.7733 14.9481 14.4031C16.1651 12.9128 16.7843 11.034 16.688 9.12343C16.5918 7.21291 15.7869 5.40372 14.4261 4.03944C13.1797 2.78578 11.5257 2.00363 9.75338 1.8297C7.98104 1.65578 6.20303 2.10114 4.73015 3.08794C3.6215 3.84065 2.72624 4.85979 2.12919 6.04882C1.53214 7.23785 1.25306 8.55739 1.31841 9.88243C1.38375 11.2075 1.79135 12.4941 2.50258 13.6205C3.21382 14.7469 4.20514 15.6757 5.38264 16.319C6.94642 17.1506 8.75695 17.4145 10.4981 17.0648ZM8.32534 6.93253H9.95655V5.64671H8.32534V6.93253ZM9.95655 8.21834V13.3616H8.32534V8.21834H9.95655Z",
  fill: "#555555"
}));
const hintIcon = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "23",
  height: "22",
  viewBox: "0 0 23 22",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M5.5 20H9.5C9.5 21.1 8.6 22 7.5 22C6.4 22 5.5 21.1 5.5 20ZM3.5 19H11.5V17H3.5V19ZM15 9.5C15 13.32 12.34 15.36 11.23 16H3.77C2.66 15.36 0 13.32 0 9.5C0 5.36 3.36 2 7.5 2C11.64 2 15 5.36 15 9.5ZM19.87 7.37L18.5 8L19.87 8.63L20.5 10L21.13 8.63L22.5 8L21.13 7.37L20.5 6L19.87 7.37ZM17.5 6L18.44 3.94L20.5 3L18.44 2.06L17.5 0L16.56 2.06L14.5 3L16.56 3.94L17.5 6Z",
  fill: "#FF9C54"
}));
const swapIcon = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "13",
  height: "15",
  viewBox: "0 0 13 15",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M4 7.5L1 10.5L4 13.5M11.5 10.5H1M8.5 1L11.5 4L8.5 7M1 4H11.5",
  stroke: "#34A0FA",
  "stroke-width": "1.5",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}));
const infoIconWithQuestionMark = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "13",
  height: "13",
  viewBox: "0 0 13 13",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  "fill-rule": "evenodd",
  "clip-rule": "evenodd",
  d: "M6.5 1.18182C3.56285 1.18182 1.18182 3.56285 1.18182 6.5C1.18182 9.43715 3.56285 11.8182 6.5 11.8182C9.43715 11.8182 11.8182 9.43715 11.8182 6.5C11.8182 3.56285 9.43715 1.18182 6.5 1.18182ZM0 6.5C0 2.91015 2.91015 0 6.5 0C10.0899 0 13 2.91015 13 6.5C13 10.0899 10.0899 13 6.5 13C2.91015 13 0 10.0899 0 6.5Z",
  fill: "#666873"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  "fill-rule": "evenodd",
  "clip-rule": "evenodd",
  d: "M6.16534 4.22792C6.08221 4.2937 5.98139 4.42072 5.84603 4.68874C5.69891 4.98004 5.34349 5.09693 5.05218 4.9498C4.76088 4.80268 4.644 4.44726 4.79112 4.15596C4.95121 3.83897 5.14586 3.52754 5.43204 3.30111C5.73884 3.05838 6.09643 2.95453 6.50039 2.95453C7.6037 2.95453 8.27312 3.84572 8.27312 4.71426C8.27312 5.13439 8.15711 5.49132 7.87557 5.82545C7.68041 6.05707 7.41156 6.26882 7.0913 6.49006V7.09089C7.0913 7.41724 6.82674 7.6818 6.50039 7.6818C6.17404 7.6818 5.90948 7.41724 5.90948 7.09089V5.85757L6.1749 5.6824C6.62347 5.38634 6.84945 5.20915 6.97181 5.06394C7.05959 4.95976 7.0913 4.87853 7.0913 4.71426C7.0913 4.41397 6.86963 4.13635 6.50039 4.13635C6.31345 4.13635 6.22786 4.17845 6.16534 4.22792ZM6.50039 8.56817C6.82674 8.56817 7.0913 8.83272 7.0913 9.15907V9.45453C7.0913 9.78088 6.82674 10.0454 6.50039 10.0454C6.17404 10.0454 5.90948 9.78088 5.90948 9.45453V9.15907C5.90948 8.83272 6.17404 8.56817 6.50039 8.56817Z",
  fill: "#666873"
}));
const arrowRightIcon = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "17",
  height: "17",
  viewBox: "0 0 18 19",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M6.87141 16.3713L12.4446 10.7982H6.29425e-05V8.2018H12.4446L6.87141 2.62865L8.70706 0.792999L17.4141 9.5L8.70706 18.207L6.87141 16.3713Z",
  fill: "white"
}));
const ssgslogo = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "99",
  height: "94",
  viewBox: "0 0 99 94",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  "fill-rule": "evenodd",
  "clip-rule": "evenodd",
  d: "M94.2673 47C94.2673 72.9574 73.2247 94 47.2673 94C21.31 94 0.267334 72.9574 0.267334 47C0.267334 21.0426 21.31 0 47.2673 0C73.2247 0 94.2673 21.0426 94.2673 47Z",
  fill: "url(#paint0_linear_2907_852)"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M38.9768 18.3627C39.3662 16.9092 40.8602 16.0466 42.3138 16.4361L66.4279 22.8974C67.8814 23.2869 68.744 24.7809 68.3545 26.2344L61.7913 50.7285C61.4019 52.182 59.9078 53.0446 58.4543 52.6551L34.3402 46.1938C32.8867 45.8043 32.0241 44.3103 32.4136 42.8568L38.9768 18.3627Z",
  fill: "#F8F3FF"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M41.4148 22.0536C41.7432 20.828 43.003 20.1007 44.2285 20.4291L62.9371 25.442C64.1627 25.7704 64.8901 27.0302 64.5617 28.2558L59.0922 48.6682C58.7638 49.8938 57.504 50.6211 56.2784 50.2927L37.5698 45.2798C36.3442 44.9514 35.6169 43.6916 35.9453 42.466L41.4148 22.0536Z",
  fill: "#34A853"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  "fill-rule": "evenodd",
  "clip-rule": "evenodd",
  d: "M49.1748 38.919C49.2118 38.9333 49.2499 38.9457 49.2891 38.9562C49.3283 38.9667 49.3675 38.975 49.4067 38.9812L55.685 40.6635C56.2462 40.8138 56.823 40.4808 56.9733 39.9196C57.0027 39.8101 57.0136 39.6999 57.008 39.5924L58.1638 35.2791C58.1771 35.2445 58.1887 35.2088 58.1985 35.1723C58.2083 35.1357 58.2161 35.099 58.2218 35.0624L59.389 30.7066C59.4023 30.6721 59.4139 30.6364 59.4237 30.5999C59.4378 30.5471 59.4477 30.4942 59.4535 30.4415C59.5341 29.918 59.2092 29.4068 58.6858 29.2665C58.5832 29.2391 58.4802 29.2277 58.3793 29.231L45.9788 25.9083C45.4177 25.7579 44.8409 26.091 44.6905 26.6521L44.6882 26.6608L43.4675 31.2164L43.4653 31.2245L43.4632 31.2326L42.1948 35.9664C42.0444 36.5276 42.3775 37.1044 42.9386 37.2547C42.9768 37.2649 43.015 37.2729 43.0532 37.2788L49.1748 38.919ZM57.1136 31.0699L56.4329 33.6101L52.2049 32.4772L52.8856 29.937L57.1136 31.0699ZM48.7345 36.623L44.5009 35.4886L45.2253 32.7851L49.4589 33.9195L48.7345 36.623ZM55.164 38.3458L55.8884 35.6423L51.6604 34.5094L50.936 37.2129L55.164 38.3458ZM50.6841 29.3471L46.4504 28.2127L45.7698 30.753L50.0034 31.8874L50.6841 29.3471Z",
  fill: "white"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
  filter: "url(#filter0_i_2907_852)"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M39.5636 74.9534C39.5636 76.8375 37.9939 78.3647 36.0576 78.3647C34.1212 78.3647 32.5515 76.8375 32.5515 74.9534C32.5515 73.0694 34.1212 71.5422 36.0576 71.5422C37.9939 71.5422 39.5636 73.0694 39.5636 74.9534Z",
  fill: "#FBFBFB"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
  filter: "url(#filter1_i_2907_852)"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M60.0314 74.9534C60.0314 76.8375 58.4617 78.3647 56.5253 78.3647C54.589 78.3647 53.0193 76.8375 53.0193 74.9534C53.0193 73.0694 54.589 71.5422 56.5253 71.5422C58.4617 71.5422 60.0314 73.0694 60.0314 74.9534Z",
  fill: "#FBFBFB"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M67.521 48.4816L65.4626 60.2314C65.2087 61.5293 64.1694 62.3186 62.9708 62.3334H32.9614L32.3656 65.675H60.9666C62.4726 65.7889 63.4942 66.8504 63.5126 68.2082C63.403 69.7036 62.3363 70.7228 60.9666 70.7414H29.3321C27.6212 70.5883 26.601 69.2313 26.7861 67.7231L28.1404 60.393L26.0819 39.804L20.2317 37.9716C18.8021 37.4068 18.2186 36.1199 18.5525 34.7916C19.1077 33.4072 20.438 32.7747 21.7485 33.1208L29.2237 35.4923C30.2308 35.8679 30.8101 36.6881 30.9571 37.6482L31.3905 41.7444L65.3 45.5173C66.8581 45.8531 67.7039 47.081 67.521 48.4816Z",
  fill: "white"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M69.7117 71.0683C69.7117 63.7416 75.6511 57.8022 82.9778 57.8022H86.9576C94.2843 57.8022 100.224 63.7416 100.224 71.0683V75.8062C100.224 83.1329 94.2843 89.0723 86.9576 89.0723H82.9778C75.6511 89.0723 69.7117 83.1329 69.7117 75.8062V71.0683Z",
  fill: "url(#paint1_linear_2907_852)"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  "fill-rule": "evenodd",
  "clip-rule": "evenodd",
  d: "M86.9576 59.6973H82.9778C76.6978 59.6973 71.6068 64.7883 71.6068 71.0683V75.8062C71.6068 82.0862 76.6978 87.1772 82.9778 87.1772H86.9576C93.2376 87.1772 98.3286 82.0862 98.3286 75.8062V71.0683C98.3286 64.7883 93.2376 59.6973 86.9576 59.6973ZM82.9778 57.8022C75.6511 57.8022 69.7117 63.7416 69.7117 71.0683V75.8062C69.7117 83.1329 75.6511 89.0723 82.9778 89.0723H86.9576C94.2843 89.0723 100.224 83.1329 100.224 75.8062V71.0683C100.224 63.7416 94.2843 57.8022 86.9576 57.8022H82.9778Z",
  fill: "white"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M88.4306 69.7323C87.487 68.8487 86.2624 68.3644 84.9632 68.3655C82.6252 68.3676 80.6067 69.9707 80.0494 72.1945C80.0088 72.3564 79.8646 72.4707 79.6977 72.4707H77.968C77.7417 72.4707 77.5697 72.2652 77.6116 72.0428C78.2647 68.5745 81.3098 65.9507 84.9678 65.9507C86.9736 65.9507 88.795 66.7396 90.139 68.024L91.217 66.9459C91.6734 66.4895 92.4537 66.8128 92.4537 67.4582V71.5048C92.4537 71.9049 92.1294 72.2292 91.7293 72.2292H87.6827C87.0373 72.2292 86.7141 71.4489 87.1704 70.9925L88.4306 69.7323ZM78.2064 74.644H82.2529C82.8984 74.644 83.2216 75.4243 82.7652 75.8807L81.505 77.1409C82.4486 78.0245 83.6733 78.5089 84.9725 78.5077C87.3094 78.5056 89.3287 76.9036 89.8863 74.6788C89.9268 74.5169 90.0711 74.4026 90.2379 74.4026H91.9677C92.194 74.4026 92.3659 74.6081 92.3241 74.8305C91.6709 78.2987 88.6259 80.9225 84.9678 80.9225C82.9621 80.9225 81.1406 80.1336 79.7967 78.8492L78.7186 79.9273C78.2622 80.3837 77.4819 80.0604 77.4819 79.415V75.3684C77.4819 74.9683 77.8063 74.644 78.2064 74.644Z",
  fill: "white"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("defs", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("filter", {
  id: "filter0_i_2907_852",
  x: "32.5515",
  y: "71.5422",
  width: "7.01221",
  height: "6.82259",
  filterUnits: "userSpaceOnUse",
  "color-interpolation-filters": "sRGB"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feFlood", {
  "flood-opacity": "0",
  result: "BackgroundImageFix"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feBlend", {
  mode: "normal",
  in: "SourceGraphic",
  in2: "BackgroundImageFix",
  result: "shape"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feColorMatrix", {
  in: "SourceAlpha",
  type: "matrix",
  values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
  result: "hardAlpha"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feOffset", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feGaussianBlur", {
  stdDeviation: "4.74217"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feComposite", {
  in2: "hardAlpha",
  operator: "arithmetic",
  k2: "-1",
  k3: "1"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feColorMatrix", {
  type: "matrix",
  values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.13 0"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feBlend", {
  mode: "normal",
  in2: "shape",
  result: "effect1_innerShadow_2907_852"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("filter", {
  id: "filter1_i_2907_852",
  x: "53.0193",
  y: "71.5422",
  width: "7.01221",
  height: "6.82259",
  filterUnits: "userSpaceOnUse",
  "color-interpolation-filters": "sRGB"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feFlood", {
  "flood-opacity": "0",
  result: "BackgroundImageFix"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feBlend", {
  mode: "normal",
  in: "SourceGraphic",
  in2: "BackgroundImageFix",
  result: "shape"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feColorMatrix", {
  in: "SourceAlpha",
  type: "matrix",
  values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
  result: "hardAlpha"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feOffset", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feGaussianBlur", {
  stdDeviation: "4.74217"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feComposite", {
  in2: "hardAlpha",
  operator: "arithmetic",
  k2: "-1",
  k3: "1"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feColorMatrix", {
  type: "matrix",
  values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.13 0"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feBlend", {
  mode: "normal",
  in2: "shape",
  result: "effect1_innerShadow_2907_852"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "paint0_linear_2907_852",
  x1: "47.2673",
  y1: "-25.2688",
  x2: "48.7834",
  y2: "138.264",
  gradientUnits: "userSpaceOnUse"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  "stop-color": "#B38BE2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  "stop-color": "#5C1BAB"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "paint1_linear_2907_852",
  x1: "84.9677",
  y1: "57.8022",
  x2: "84.9677",
  y2: "89.0723",
  gradientUnits: "userSpaceOnUse"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  "stop-color": "#25CD52"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  "stop-color": "#34A853"
}))));
const ctaAddImg = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "164",
  height: "136",
  viewBox: "0 0 164 136",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  x: "0.579102",
  width: "104.437",
  height: "115.744",
  rx: "0.69228",
  fill: "white"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M0.579102 26.509H19.6536L19.6536 115.744H2.10212C1.26098 115.744 0.579102 115.062 0.579102 114.221L0.579102 26.509Z",
  fill: "#EFEFEF"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M0.579102 26.4969L22.9968 26.4969C23.3792 26.4969 23.6891 26.8069 23.6891 27.1892L23.6891 115.057C23.6891 115.439 23.3792 115.749 22.9968 115.749H1.27138C0.889046 115.749 0.579102 115.439 0.579102 115.057L0.579102 26.4969Z",
  fill: "#EFEFEF"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M29.3589 29.6793L91.6225 29.6793C92.0049 29.6793 92.3148 29.9893 92.3148 30.3716V36.182C92.3148 36.5643 92.0049 36.8743 91.6225 36.8743L30.0512 36.8743C29.6688 36.8743 29.3589 36.5643 29.3589 36.182V29.6793Z",
  fill: "#EFEFEF"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M29.3589 43.1699L75.4339 43.1699C75.8162 43.1699 76.1261 43.4799 76.1261 43.8622V49.6726C76.1261 50.0549 75.8162 50.3649 75.4339 50.3649H30.0512C29.6688 50.3649 29.3589 50.0549 29.3589 49.6726V43.1699Z",
  fill: "#EFEFEF"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M29.3589 54.8616H53.849C54.2313 54.8616 54.5413 55.1716 54.5413 55.5539V61.3643C54.5413 61.7467 54.2313 62.0566 53.849 62.0566H30.0512C29.6688 62.0566 29.3589 61.7467 29.3589 61.3643V54.8616Z",
  fill: "#EFEFEF"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M29.3589 66.5535H69.1383C69.5206 66.5535 69.8305 66.8634 69.8305 67.2457V73.0561C69.8305 73.4385 69.5206 73.7484 69.1383 73.7484H30.0512C29.6688 73.7484 29.3589 73.4385 29.3589 73.0561V66.5535Z",
  fill: "#EFEFEF"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M29.3589 78.2452H87.1257C87.508 78.2452 87.8179 78.5552 87.8179 78.9375V84.7479C87.8179 85.1303 87.508 85.4402 87.1257 85.4402H30.0512C29.6688 85.4402 29.3589 85.1303 29.3589 84.7479V78.2452Z",
  fill: "#EFEFEF"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M29.3589 93.5346H75.4339C75.8162 93.5346 76.1261 93.8446 76.1261 94.2269V100.037C76.1261 100.42 75.8162 100.73 75.4339 100.73H30.0512C29.6688 100.73 29.3589 100.42 29.3589 100.037V93.5346Z",
  fill: "#EFEFEF"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M29.3589 106.126H83.5282C83.9105 106.126 84.2205 106.436 84.2205 106.818V112.628C84.2205 113.011 83.9105 113.321 83.5282 113.321H30.0512C29.6688 113.321 29.3589 113.011 29.3589 112.628V106.126Z",
  fill: "#EFEFEF"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
  x1: "0.579102",
  y1: "26.4744",
  x2: "105.016",
  y2: "26.4744",
  stroke: "#ABABAB",
  "stroke-width": "0.069228"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
  x1: "0.579102",
  y1: "39.7292",
  x2: "105.016",
  y2: "39.7292",
  stroke: "#ABABAB",
  "stroke-width": "0.069228"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
  x1: "0.579102",
  y1: "52.2367",
  x2: "105.016",
  y2: "52.2367",
  stroke: "#ABABAB",
  "stroke-width": "0.069228"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
  x1: "0.579102",
  y1: "64.7448",
  x2: "105.016",
  y2: "64.7448",
  stroke: "#ABABAB",
  "stroke-width": "0.069228"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
  x1: "0.579102",
  y1: "77.9993",
  x2: "105.016",
  y2: "77.9993",
  stroke: "#ABABAB",
  "stroke-width": "0.069228"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
  x1: "0.579102",
  y1: "90.6937",
  x2: "105.016",
  y2: "90.6937",
  stroke: "#ABABAB",
  "stroke-width": "0.069228"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
  x1: "0.579102",
  y1: "103.201",
  x2: "105.016",
  y2: "103.201",
  stroke: "#ABABAB",
  "stroke-width": "0.069228"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
  x1: "23.6726",
  y1: "26.509",
  x2: "23.6726",
  y2: "115.744",
  stroke: "#ABABAB",
  "stroke-width": "0.069228"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M0.579102 0.69228C0.579102 0.309944 0.889046 0 1.27138 0L104.973 0V26.4968L0.579102 26.4968L0.579102 0.69228Z",
  fill: "#F5F5F5"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M18.4811 21.7569H8.04543C7.38035 21.7569 6.84131 21.2179 6.84131 20.5528L6.84131 6.10341C6.84131 5.43834 7.38035 4.89929 8.04543 4.89929L15.6715 4.89929L19.6852 8.91302V20.5528C19.6852 21.2179 19.1462 21.7569 18.4811 21.7569Z",
  fill: "#43A047"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M19.6854 8.91314H15.6716V4.89941L19.6854 8.91314Z",
  fill: "#C8E6C9"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M15.6716 8.91302L19.6854 12.9268V8.91302H15.6716Z",
  fill: "#2E7D32"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M16.0728 12.926H10.4536H9.65088V13.7288V14.5315V15.3343V16.137V16.9398V17.7425V18.5452H16.8756V17.7425V16.9398V16.137V15.3343V14.5315V13.7288V12.926H16.0728ZM10.4536 13.7288H12.0591V14.5315H10.4536V13.7288ZM10.4536 15.3343H12.0591V16.137H10.4536V15.3343ZM10.4536 16.9398H12.0591V17.7425H10.4536V16.9398ZM16.0728 17.7425H12.8619V16.9398H16.0728V17.7425ZM16.0728 16.137H12.8619V15.3343H16.0728V16.137ZM16.0728 14.5315H12.8619V13.7288H16.0728V14.5315Z",
  fill: "#E8F5E9"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M25.4461 17.692H26.4298V15.527H27.8043C29.0471 15.527 29.9078 14.6794 29.9078 13.441V13.4322C29.9078 12.1895 29.0471 11.3551 27.8043 11.3551H25.4461V17.692ZM27.5584 12.1851C28.4147 12.1851 28.9066 12.6462 28.9066 13.4366V13.4454C28.9066 14.2403 28.4147 14.7014 27.5584 14.7014H26.4298V12.1851H27.5584ZM30.6544 17.692H31.6029V14.9385C31.6029 14.2491 31.9806 13.8494 32.591 13.8494C32.7755 13.8494 32.9423 13.8714 33.017 13.9021V13.0194C32.9423 13.0063 32.8238 12.9843 32.6876 12.9843C32.1607 12.9843 31.7742 13.3225 31.6249 13.8626H31.6029V13.0721H30.6544V17.692ZM35.3884 17.7842C36.7102 17.7842 37.5797 16.8708 37.5797 15.382V15.3733C37.5797 13.8933 36.7014 12.9843 35.384 12.9843C34.0709 12.9843 33.197 13.8977 33.197 15.3733V15.382C33.197 16.8664 34.0622 17.7842 35.3884 17.7842ZM35.3928 16.9893C34.6506 16.9893 34.1676 16.4053 34.1676 15.382V15.3733C34.1676 14.3632 34.655 13.7792 35.384 13.7792C36.1261 13.7792 36.6092 14.3632 36.6092 15.3733V15.382C36.6092 16.4009 36.1349 16.9893 35.3928 16.9893ZM40.0389 17.7842C40.702 17.7842 41.2115 17.4504 41.4881 16.9103H41.5057V17.692H42.4586V11.3551H41.5057V13.8582H41.4881C41.2115 13.3137 40.6845 12.9843 40.0301 12.9843C38.8708 12.9843 38.1067 13.9065 38.1067 15.3777V15.382C38.1067 16.8532 38.862 17.7842 40.0389 17.7842ZM40.2892 16.9674C39.5383 16.9674 39.0772 16.3657 39.0772 15.382V15.3777C39.0772 14.4028 39.5427 13.7967 40.2892 13.7967C41.0007 13.7967 41.5101 14.4203 41.5101 15.3777V15.382C41.5101 16.3438 41.0051 16.9674 40.2892 16.9674ZM45.0057 17.7842C45.7083 17.7842 46.1782 17.4636 46.4197 16.9981H46.4417V17.692H47.3946V13.0721H46.4417V15.7685C46.4417 16.4887 46.0113 16.9674 45.3438 16.9674C44.6851 16.9674 44.3601 16.5809 44.3601 15.8827V13.0721H43.4116V16.0671C43.4116 17.1298 43.9912 17.7842 45.0057 17.7842ZM50.3193 17.7842C51.4304 17.7842 52.2033 17.0728 52.3043 16.1462L52.3087 16.1154H51.3952L51.3908 16.1506C51.2767 16.6512 50.9034 16.9893 50.3193 16.9893C49.586 16.9893 49.0985 16.3965 49.0985 15.3864V15.382C49.0985 14.394 49.5772 13.7792 50.3149 13.7792C50.9341 13.7792 51.2855 14.1612 51.3865 14.6135L51.3952 14.6487H52.2999L52.2955 14.6179C52.2164 13.7484 51.4962 12.9843 50.3062 12.9843C48.9887 12.9843 48.128 13.9109 48.128 15.3733V15.3777C48.128 16.8576 48.9712 17.7842 50.3193 17.7842ZM54.601 17.7842C54.7942 17.7842 54.9743 17.7622 55.0841 17.7447V17.0113C55.0138 17.0201 54.9304 17.0288 54.8294 17.0288C54.4297 17.0288 54.2189 16.8883 54.2189 16.4184V13.8275H55.0841V13.0721H54.2189V11.8689H53.2484V13.0721H52.5853V13.8275H53.2484V16.4755C53.2484 17.3977 53.6876 17.7842 54.601 17.7842ZM57.6004 17.7842C58.6894 17.7842 59.4799 17.2045 59.4799 16.3613V16.357C59.4799 15.6938 59.1198 15.3206 58.1756 15.101L57.4247 14.9297C56.9285 14.8112 56.7396 14.6179 56.7396 14.3325V14.3281C56.7396 13.9592 57.0602 13.7177 57.5696 13.7177C58.1054 13.7177 58.4216 13.9987 58.4787 14.4028L58.483 14.4335H59.3745L59.3701 14.3808C59.3218 13.5947 58.6631 12.9843 57.5696 12.9843C56.5069 12.9843 55.7867 13.5508 55.7867 14.3764V14.3808C55.7867 15.0527 56.2214 15.4743 57.0997 15.6763L57.8551 15.8475C58.3513 15.9661 58.5182 16.1374 58.5182 16.436V16.4404C58.5182 16.8137 58.1756 17.0508 57.6048 17.0508C57.0207 17.0508 56.7045 16.8005 56.6167 16.3745L56.6079 16.3306H55.6681L55.6725 16.3701C55.7691 17.2133 56.4454 17.7842 57.6004 17.7842Z",
  fill: "#216124"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  opacity: "0.1",
  x: "61.1611",
  y: "38.2885",
  width: "102.34",
  height: "97.0648",
  fill: "#1B815C"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  x: "62.8809",
  y: "38.2885",
  width: "101.119",
  height: "96.8163",
  rx: "5.68346",
  fill: "#FBFFFD"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M96.2078 50.5121C96.2078 46.2767 99.6412 42.8433 103.877 42.8433H120.91C125.146 42.8433 128.579 46.2767 128.579 50.5121V54.6217C128.579 57.0822 126.572 59.0701 124.111 59.0461L118.788 58.994C118.083 58.9871 117.606 59.7083 117.887 60.3542C118.252 61.1938 117.36 62.0269 116.547 61.6051L112.296 59.399C111.916 59.202 111.495 59.099 111.067 59.0988L103.872 59.0944C99.6384 59.0918 96.2078 55.6592 96.2078 51.4256V50.5121Z",
  fill: "white"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  "fill-rule": "evenodd",
  "clip-rule": "evenodd",
  d: "M124.764 43.549H100.185C98.6298 43.549 97.3706 44.795 97.3829 46.3073V55.5016C97.3829 57.0259 98.6421 58.2599 100.198 58.2599H111.839L117.16 61.1634L115.95 58.2599H124.764C126.32 58.2599 127.579 57.0259 127.579 55.5016V46.3073C127.579 44.7829 126.32 43.549 124.764 43.549ZM99.6668 45.6782C99.3211 45.7024 99.0619 45.8233 98.8891 46.0532C98.7162 46.271 98.6545 46.5492 98.6915 46.8638C99.4199 51.4005 100.099 54.4612 100.728 56.046C100.975 56.6267 101.259 56.905 101.593 56.8808C102.111 56.8445 102.728 56.1428 103.457 54.7758C103.839 54.0015 104.432 52.8401 105.234 51.2916C105.901 53.578 106.815 55.296 107.963 56.4453C108.284 56.7719 108.617 56.9171 108.938 56.8929C109.222 56.8687 109.444 56.7235 109.592 56.4573C109.716 56.2275 109.765 55.9613 109.74 55.6589C109.666 54.558 109.777 53.0216 110.086 51.0496C110.407 49.0172 110.802 47.5533 111.284 46.6823C111.382 46.5008 111.419 46.3194 111.407 46.1016C111.382 45.8233 111.259 45.5935 111.024 45.412C110.79 45.2306 110.53 45.1459 110.247 45.1701C109.889 45.1943 109.617 45.3636 109.432 45.7024C108.666 47.0694 108.123 49.2833 107.802 52.3562C107.333 51.1948 106.938 49.8277 106.629 48.2187C106.494 47.505 106.16 47.1662 105.617 47.2025C105.247 47.2267 104.938 47.4687 104.691 47.9284L101.988 52.9732C101.543 51.219 101.124 49.0777 100.741 46.5492C100.654 45.9201 100.296 45.6298 99.6668 45.6782ZM123.456 46.5493C124.332 46.7307 124.987 47.1904 125.431 47.9526C125.826 48.6059 126.024 49.3923 126.024 50.3359C126.024 51.5819 125.703 52.7191 125.061 53.7596C124.32 54.9694 123.357 55.5742 122.16 55.5742C121.95 55.5742 121.728 55.55 121.493 55.5016C120.616 55.3202 119.962 54.8605 119.518 54.0983C119.123 53.4329 118.925 52.6345 118.925 51.7029C118.925 50.4569 119.246 49.3197 119.888 48.2913C120.641 47.0816 121.604 46.4767 122.789 46.4767C122.999 46.4767 123.221 46.5009 123.456 46.5493ZM122.937 53.0942C123.394 52.695 123.703 52.1021 123.876 51.3037C123.925 51.0255 123.962 50.723 123.962 50.4085C123.962 50.0576 123.888 49.6826 123.74 49.3076C123.555 48.8357 123.308 48.5817 123.011 48.5212C122.567 48.4365 122.135 48.6785 121.728 49.2713C121.394 49.731 121.184 50.2149 121.073 50.7109C121.011 50.9892 120.987 51.2916 120.987 51.5941C120.987 51.9449 121.061 52.3199 121.209 52.695C121.394 53.1668 121.641 53.4208 121.937 53.4813C122.246 53.5418 122.579 53.4087 122.937 53.0942ZM117.691 47.9526C117.246 47.1904 116.58 46.7307 115.715 46.5493C115.481 46.5009 115.259 46.4767 115.049 46.4767C113.864 46.4767 112.901 47.0816 112.148 48.2913C111.506 49.3197 111.185 50.4569 111.185 51.7029C111.185 52.6345 111.382 53.4329 111.777 54.0983C112.222 54.8605 112.876 55.3202 113.753 55.5016C113.987 55.55 114.209 55.5742 114.419 55.5742C115.617 55.5742 116.58 54.9694 117.32 53.7596C117.962 52.7191 118.283 51.5819 118.283 50.3359C118.283 49.3923 118.086 48.6059 117.691 47.9526ZM116.135 51.3037C115.962 52.1021 115.654 52.695 115.197 53.0942C114.839 53.4087 114.506 53.5418 114.197 53.4813C113.901 53.4208 113.654 53.1668 113.469 52.695C113.32 52.3199 113.246 51.9449 113.246 51.5941C113.246 51.2916 113.271 50.9892 113.333 50.7109C113.444 50.2149 113.654 49.731 113.987 49.2713C114.395 48.6785 114.827 48.4365 115.271 48.5212C115.567 48.5817 115.814 48.8357 115.999 49.3076C116.148 49.6826 116.222 50.0576 116.222 50.4085C116.222 50.723 116.197 51.0255 116.135 51.3037Z",
  fill: "#7F54B3"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  opacity: "0.3",
  x: "82.6426",
  y: "64.7105",
  width: "27.7361",
  height: "27.3894",
  fill: "#C4C4C4"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  opacity: "0.3",
  x: "118.7",
  y: "98.3411",
  width: "27.7361",
  height: "27.3894",
  fill: "#C4C4C4"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  x: "82.7921",
  y: "98.4907",
  width: "27.4369",
  height: "27.0902",
  rx: "1.34608",
  fill: "#FFF2F3",
  stroke: "#FF919F",
  "stroke-width": "0.299129"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  x: "118.849",
  y: "64.8604",
  width: "27.4369",
  height: "27.0902",
  rx: "1.34608",
  fill: "#EAFAFF",
  stroke: "#71DCFF",
  "stroke-width": "0.299129"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M137.583 82.8183C135.448 86.7337 135.48 87.0573 134.477 86.4749C133.474 85.8924 133.086 85.3747 135.254 81.4916C137.422 77.6086 138.036 77.6409 139.04 78.2234C140.01 78.7735 139.719 78.9353 137.583 82.8183Z",
  fill: "#454749"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M139.59 83.983C138.231 86.4746 136.548 87.6719 135.739 87.2189C134.736 86.6364 135.254 86.6364 137.389 82.721C139.525 78.8056 139.266 78.3526 140.269 78.935C141.078 79.388 140.949 81.4914 139.59 83.983Z",
  fill: "#258399"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M127.552 82.8183C129.688 86.7337 129.655 87.0573 130.658 86.4749C131.662 85.8924 132.05 85.3747 129.882 81.4916C127.714 77.6086 127.099 77.6409 126.096 78.2234C125.125 78.7735 125.416 78.9353 127.552 82.8183Z",
  fill: "#454749"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M125.546 83.983C126.905 86.4746 128.588 87.6719 129.397 87.2189C130.4 86.6364 129.882 86.6364 127.746 82.721C125.611 78.8056 125.869 78.3526 124.866 78.935C124.057 79.388 124.187 81.4914 125.546 83.983Z",
  fill: "#258399"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M125.87 86.8955C125.87 86.8955 127.617 87.3485 127.747 86.8955C128.555 84.2744 124.058 82.7212 124.058 79.7442C124.058 74.9551 127.876 71.072 132.568 71.072C137.26 71.072 141.078 74.9551 141.078 79.7442C141.078 82.7212 136.58 84.2744 137.389 86.8955C137.519 87.3485 139.266 86.8955 139.266 86.8955C141.111 85.0834 142.276 82.5594 142.276 79.7442C142.276 74.2756 137.94 69.8424 132.568 69.8424C127.196 69.8424 122.86 74.2756 122.86 79.7442C122.86 82.5594 124.025 85.0834 125.87 86.8955Z",
  fill: "#3BAACF"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M127.035 73.9192C128.167 73.6927 129.623 72.0748 132.568 72.0748C135.513 72.0748 137.001 73.7251 138.101 73.9192C138.554 74.0163 139.331 73.3044 139.331 73.3044C137.551 71.2658 135.448 70.2303 132.568 70.2303C129.688 70.2303 127.585 71.2658 125.805 73.3044C125.805 73.3368 126.582 74.0163 127.035 73.9192Z",
  fill: "#454749"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M97.0759 109.045C97.0759 108.892 97.015 108.745 96.9066 108.636C96.7982 108.528 96.6511 108.467 96.4977 108.467C96.3444 108.467 96.1973 108.528 96.0889 108.636C95.9804 108.745 95.9195 108.892 95.9195 109.045V111.936H94.1849C94.0315 111.936 93.8845 111.997 93.776 112.106C93.6676 112.214 93.6067 112.361 93.6067 112.515C93.6067 112.668 93.6676 112.815 93.776 112.923C93.8845 113.032 94.0315 113.093 94.1849 113.093H96.4977C96.6511 113.093 96.7982 113.032 96.9066 112.923C97.015 112.815 97.0759 112.668 97.0759 112.515V109.045Z",
  fill: "#DD2E44"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M93.7997 121.766C92.7358 121.766 91.8719 120.903 91.8719 119.838V117.687C91.1433 117.037 90.5605 116.24 90.1619 115.348C89.7633 114.457 89.5579 113.491 89.5591 112.514C89.5591 110.459 90.4518 108.613 91.8719 107.343V105.191C91.8719 104.127 92.7346 103.263 93.7997 103.263H99.1955C100.259 103.263 101.123 104.126 101.123 105.191V107.342C102.299 108.392 103.081 109.811 103.341 111.366C103.424 111.353 103.509 111.357 103.589 111.38C103.67 111.402 103.745 111.442 103.809 111.496C103.873 111.55 103.924 111.618 103.96 111.694C103.995 111.77 104.014 111.852 104.014 111.936V113.093C104.014 113.177 103.996 113.259 103.961 113.336C103.925 113.412 103.874 113.479 103.81 113.534C103.746 113.588 103.671 113.627 103.59 113.65C103.509 113.672 103.424 113.676 103.341 113.663C103.081 115.217 102.299 116.637 101.123 117.687V119.838C101.123 120.902 100.261 121.766 99.1955 121.766H93.7997ZM102.28 112.514C102.28 110.981 101.67 109.51 100.586 108.426C99.5018 107.341 98.0311 106.732 96.4976 106.732C94.9641 106.732 93.4934 107.341 92.409 108.426C91.3247 109.51 90.7155 110.981 90.7155 112.514C90.7155 114.048 91.3247 115.519 92.409 116.603C93.4934 117.687 94.9641 118.296 96.4976 118.296C98.0311 118.296 99.5018 117.687 100.586 116.603C101.67 115.519 102.28 114.048 102.28 112.514Z",
  fill: "#DD2E44"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M48.5005 55.5531C48.5005 49.5143 53.3998 44.6188 59.4435 44.6188H62.7264C68.77 44.6188 73.6693 49.5143 73.6693 55.5531V59.4583C73.6693 65.4972 68.77 70.3926 62.7264 70.3926H59.4435C53.3998 70.3926 48.5005 65.4972 48.5005 59.4583V55.5531Z",
  fill: "url(#paint0_linear_132_140)"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M63.9397 54.4519C63.1618 53.7235 62.1522 53.3242 61.0812 53.3251C59.1538 53.3268 57.4898 54.6484 57.0304 56.4816C56.9969 56.6151 56.878 56.7093 56.7404 56.7093H55.3145C55.1279 56.7093 54.9862 56.54 55.0207 56.3566C55.5591 53.4974 58.0694 51.3344 61.085 51.3344C62.7385 51.3344 64.2401 51.9848 65.348 53.0436L66.2367 52.1548C66.613 51.7786 67.2562 52.0451 67.2562 52.5771V55.9131C67.2562 56.2429 66.9889 56.5103 66.659 56.5103H63.3231C62.791 56.5103 62.5246 55.867 62.9008 55.4907L63.9397 54.4519ZM55.511 58.501H58.8469C59.379 58.501 59.6455 59.1443 59.2692 59.5205L58.2303 60.5594C59.0083 61.2878 60.0179 61.6871 61.0889 61.6861C63.0154 61.6844 64.68 60.3637 65.1397 58.5296C65.1731 58.3962 65.292 58.302 65.4296 58.302H66.8556C67.0421 58.302 67.1839 58.4713 67.1494 58.6547C66.6109 61.5138 64.1006 63.6768 61.085 63.6768C59.4315 63.6768 57.93 63.0265 56.822 61.9677L55.9333 62.8564C55.5571 63.2326 54.9138 62.9662 54.9138 62.4341V59.0982C54.9138 58.7684 55.1812 58.501 55.511 58.501Z",
  fill: "white"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("defs", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "paint0_linear_132_140",
  x1: "61.0849",
  y1: "44.6188",
  x2: "61.0849",
  y2: "70.3926",
  gradientUnits: "userSpaceOnUse"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  "stop-color": "#25CD52"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  "stop-color": "#34A853"
}))));
const book = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "59",
  height: "46",
  viewBox: "0 0 59 46",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M44.2701 0.486084C39.0382 0.486084 33.4038 1.5593 29.5134 4.51064C25.623 1.5593 19.9886 0.486084 14.7567 0.486084C10.8663 0.486084 6.73442 1.07635 3.27331 2.60568C1.31469 3.49109 0 5.39604 0 7.5693V37.834C0 41.3219 3.27331 43.8976 6.65393 43.0391C9.28331 42.3683 12.0737 42.0732 14.7567 42.0732C18.9422 42.0732 23.3961 42.7708 26.9914 44.5416C28.6012 45.3465 30.4256 45.3465 32.0086 44.5416C35.6039 42.7439 40.0578 42.0732 44.2433 42.0732C46.9263 42.0732 49.7167 42.3683 52.3461 43.0391C55.7267 43.9245 59 41.3487 59 37.834V7.5693C59 5.39604 57.6853 3.49109 55.7267 2.60568C52.2924 1.07635 48.1605 0.486084 44.2701 0.486084ZM53.6608 34.6412C53.6608 36.3315 52.1046 37.5657 50.4411 37.2705C48.4288 36.8949 46.3361 36.7339 44.2701 36.7339C39.709 36.7339 33.1355 38.4779 29.5134 40.7585V9.87672C33.1355 7.59613 39.709 5.85216 44.2701 5.85216C46.7385 5.85216 49.1801 6.09363 51.5143 6.60341C52.7485 6.87171 53.6608 7.97176 53.6608 9.23279V34.6412Z",
  fill: "url(#paint0_linear_2854_839)"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M34.8258 17.9527C33.9673 17.9527 33.1892 17.4161 32.9209 16.5575C32.5721 15.5111 33.1624 14.3574 34.2087 14.0354C38.3406 12.6939 43.6799 12.2646 48.5898 12.8281C49.6899 12.9622 50.4948 13.955 50.3606 15.055C50.2265 16.155 49.2338 16.96 48.1337 16.8258C43.7872 16.316 39.0382 16.7185 35.4429 17.8722C35.2283 17.899 35.0137 17.9527 34.8258 17.9527ZM34.8258 25.0896C33.9673 25.0896 33.1892 24.553 32.9209 23.6944C32.5721 22.648 33.1624 21.4943 34.2087 21.1723C38.3138 19.8308 43.6799 19.4015 48.5898 19.965C49.6899 20.0991 50.4948 21.0918 50.3606 22.1919C50.2265 23.2919 49.2338 24.0968 48.1337 23.9627C43.7872 23.4529 39.0382 23.8554 35.4429 25.0091C35.2412 25.0605 35.034 25.0875 34.8258 25.0896ZM34.8258 32.2264C33.9673 32.2264 33.1892 31.6898 32.9209 30.8313C32.5721 29.7849 33.1624 28.6312 34.2087 28.3092C38.3138 26.9677 43.6799 26.5384 48.5898 27.1018C49.6899 27.236 50.4948 28.2287 50.3606 29.3288C50.2265 30.4288 49.2338 31.2069 48.1337 31.0996C43.7872 30.5898 39.0382 30.9922 35.4429 32.146C35.2412 32.1974 35.034 32.2244 34.8258 32.2264Z",
  fill: "url(#paint1_linear_2854_839)"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("defs", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "paint0_linear_2854_839",
  x1: "-52.4316",
  y1: "-20.099",
  x2: "2.48406",
  y2: "80.5656",
  gradientUnits: "userSpaceOnUse"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "0.00359712",
  "stop-color": "#514EFF"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  "stop-color": "#9571F6"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "paint1_linear_2854_839",
  x1: "17.2199",
  y1: "3.53352",
  x2: "45.2894",
  y2: "38.3454",
  gradientUnits: "userSpaceOnUse"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "0.00359712",
  "stop-color": "#514EFF"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  "stop-color": "#9571F6"
}))));
const videoPlay = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "55",
  height: "45",
  viewBox: "0 0 55 45",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M50.6334 3.16432C50.3251 1.95336 48.8279 0.965332 47.3032 0.965332H7.69951C6.17206 0.965332 4.67487 1.95336 4.36938 3.16432L3.8162 6.46967H51.1838L50.6334 3.16432ZM53.4048 9.22184H1.5952C1.3729 9.22199 1.15308 9.26857 0.949829 9.35859C0.746575 9.44861 0.564365 9.5801 0.414871 9.74462C0.265376 9.90914 0.151893 10.1031 0.08169 10.314C0.0114874 10.5249 -0.0138866 10.7482 0.00719339 10.9695L2.54745 43.0845C2.59805 43.6087 2.84198 44.0952 3.23171 44.4493C3.62143 44.8034 4.12903 44.9998 4.65561 45.0001H50.3444C50.871 44.9998 51.3786 44.8034 51.7683 44.4493C52.158 44.0952 52.4019 43.6087 52.4525 43.0845L54.9928 10.9695C55.0139 10.7482 54.9885 10.5249 54.9183 10.314C54.8481 10.1031 54.7346 9.90914 54.5851 9.74462C54.4356 9.5801 54.2534 9.44861 54.0502 9.35859C53.8469 9.26857 53.6271 9.22199 53.4048 9.22184ZM21.997 33.9914V20.2305L34.0598 27.111L21.997 33.9914Z",
  fill: "url(#paint0_linear_2854_832)"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("defs", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "paint0_linear_2854_832",
  x1: "-33.6368",
  y1: "-9.06092",
  x2: "-16.1758",
  y2: "39.2147",
  gradientUnits: "userSpaceOnUse"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  "stop-color": "#A737D5"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  "stop-color": "#EF497A"
}))));
const support = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "78",
  height: "78",
  viewBox: "0 0 78 78",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
  cx: "39",
  cy: "39",
  r: "39",
  fill: "white"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M37.8821 19C35.3236 19 32.8699 20.0164 31.0607 21.8255C29.2516 23.6346 28.2352 26.0884 28.2352 28.6469C28.2352 31.2054 29.2516 33.6591 31.0607 35.4683C32.8699 37.2774 35.3236 38.2938 37.8821 38.2938C40.4407 38.2938 42.8944 37.2774 44.7036 35.4683C46.5127 33.6591 47.5291 31.2054 47.5291 28.6469C47.5291 26.0884 46.5127 23.6346 44.7036 21.8255C42.8944 20.0164 40.4407 19 37.8821 19ZM25.8452 40.7055C25.21 40.7029 24.5806 40.8258 23.993 41.067C23.4054 41.3083 22.8713 41.6631 22.4211 42.1113C21.971 42.5594 21.6137 43.0919 21.3699 43.6784C21.126 44.2649 21.0003 44.8938 21 45.5289C21 49.6071 23.009 52.6821 26.1491 54.6862C29.2409 56.6566 33.4084 57.5875 37.8821 57.5875C40.0045 57.5875 42.0569 57.3777 43.9597 56.9484C43.815 55.9041 43.9983 54.8189 44.5096 53.8687L44.5385 53.8156L44.7387 53.4852L46.1544 51.4087C46.6747 50.6309 47.4155 50.0262 48.2818 49.6721C49.148 49.3181 50.1003 49.2308 51.0164 49.4214L51.084 49.4359L51.4554 49.5372L52.7432 49.9665C53.134 49.5437 53.4761 49.0786 53.7634 48.5798C54.0649 48.0588 54.2843 47.5572 54.4387 47.0676L53.2811 45.9703C52.6422 45.357 52.1778 44.5849 51.9354 43.7331C51.693 42.8814 51.6813 41.9805 51.9016 41.1227C51.2846 40.8474 50.6165 40.7052 49.9408 40.7055H25.8452ZM54.3639 41.3446L55.3286 39.0752C55.7796 38.0092 56.8601 37.4304 57.9212 37.6522L58.1479 37.7101L59.3538 38.096C60.55 38.4795 61.4641 39.502 61.7607 40.7875C62.4625 43.8431 61.6208 47.5644 59.2308 51.9489C56.8456 56.3286 54.2337 58.9598 51.3903 59.8473C50.2857 60.1922 49.0991 59.9438 48.2068 59.1937L47.9728 58.9767L47.0564 58.0578C46.6714 57.6614 46.4227 57.1527 46.3463 56.6054C46.27 56.0582 46.37 55.5008 46.6319 55.0142L46.767 54.7923L48.1465 52.7665C48.3973 52.3841 48.7571 52.0857 49.1793 51.9098C49.6014 51.734 50.0667 51.6888 50.5148 51.7801L50.756 51.8452L53.3052 52.6966C54.3205 51.9248 55.1695 50.9601 55.8472 49.7904C56.4284 48.7896 56.8118 47.7766 56.9879 46.7493L57.0603 46.2331L54.9403 44.2194C54.5982 43.8859 54.3549 43.4643 54.2374 43.0013C54.12 42.5382 54.1329 42.0516 54.2747 41.5954L54.3639 41.3446Z",
  fill: "#3FA3FF"
}));
const AdsProducts = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "214",
  height: "187",
  viewBox: "0 0 214 187",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
  opacity: "0.1",
  filter: "url(#filter0_f_2907_877)"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  x: "26.0232",
  y: "26.3068",
  width: "104.45",
  height: "115.001",
  fill: "#1B815C"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  x: "25.5792",
  y: "26.0001",
  width: "104.437",
  height: "115.744",
  rx: "0.69228",
  fill: "white"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M25.5792 52.5092H44.6537L44.6537 141.744H27.1022C26.2611 141.744 25.5792 141.062 25.5792 140.221L25.5792 52.5092Z",
  fill: "#EFEFEF"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M25.5792 52.4971H47.9969C48.3793 52.4971 48.6892 52.807 48.6892 53.1894L48.6892 141.057C48.6892 141.44 48.3793 141.749 47.9969 141.749H26.2715C25.8892 141.749 25.5792 141.44 25.5792 141.057L25.5792 52.4971Z",
  fill: "#EFEFEF"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M54.359 55.6794L116.623 55.6794C117.005 55.6794 117.315 55.9894 117.315 56.3717V62.1821C117.315 62.5645 117.005 62.8744 116.623 62.8744L55.0513 62.8744C54.669 62.8744 54.359 62.5645 54.359 62.1821V55.6794Z",
  fill: "#EFEFEF"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M54.359 69.17H100.434C100.816 69.17 101.126 69.48 101.126 69.8623V75.6727C101.126 76.0551 100.816 76.365 100.434 76.365H55.0513C54.669 76.365 54.359 76.0551 54.359 75.6727V69.17Z",
  fill: "#EFEFEF"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M54.359 80.8617H78.8491C79.2314 80.8617 79.5414 81.1716 79.5414 81.554V87.3644C79.5414 87.7467 79.2314 88.0567 78.8491 88.0567H55.0513C54.669 88.0567 54.359 87.7467 54.359 87.3644V80.8617Z",
  fill: "#EFEFEF"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M54.359 92.5536H94.1384C94.5207 92.5536 94.8307 92.8635 94.8307 93.2459V99.0563C94.8307 99.4386 94.5207 99.7485 94.1384 99.7485H55.0513C54.669 99.7485 54.359 99.4386 54.359 99.0563V92.5536Z",
  fill: "#EFEFEF"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M54.359 104.245H112.126C112.508 104.245 112.818 104.555 112.818 104.938V110.748C112.818 111.13 112.508 111.44 112.126 111.44H55.0513C54.669 111.44 54.359 111.13 54.359 110.748V104.245Z",
  fill: "#EFEFEF"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M54.359 119.535H100.434C100.816 119.535 101.126 119.845 101.126 120.227V126.037C101.126 126.42 100.816 126.73 100.434 126.73H55.0513C54.669 126.73 54.359 126.42 54.359 126.037V119.535Z",
  fill: "#EFEFEF"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M54.359 132.126H108.528C108.911 132.126 109.221 132.436 109.221 132.818V138.629C109.221 139.011 108.911 139.321 108.528 139.321H55.0513C54.669 139.321 54.359 139.011 54.359 138.629V132.126Z",
  fill: "#EFEFEF"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
  x1: "25.5792",
  y1: "52.4745",
  x2: "130.017",
  y2: "52.4745",
  stroke: "#ABABAB",
  "stroke-width": "0.069228"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
  x1: "25.5792",
  y1: "65.7293",
  x2: "130.017",
  y2: "65.7293",
  stroke: "#ABABAB",
  "stroke-width": "0.069228"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
  x1: "25.5792",
  y1: "78.2369",
  x2: "130.017",
  y2: "78.2369",
  stroke: "#ABABAB",
  "stroke-width": "0.069228"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
  x1: "25.5792",
  y1: "90.7449",
  x2: "130.017",
  y2: "90.7449",
  stroke: "#ABABAB",
  "stroke-width": "0.069228"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
  x1: "25.5792",
  y1: "103.999",
  x2: "130.017",
  y2: "103.999",
  stroke: "#ABABAB",
  "stroke-width": "0.069228"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
  x1: "25.5792",
  y1: "116.694",
  x2: "130.017",
  y2: "116.694",
  stroke: "#ABABAB",
  "stroke-width": "0.069228"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
  x1: "25.5792",
  y1: "129.201",
  x2: "130.017",
  y2: "129.201",
  stroke: "#ABABAB",
  "stroke-width": "0.069228"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
  x1: "48.6728",
  y1: "52.5092",
  x2: "48.6727",
  y2: "141.744",
  stroke: "#ABABAB",
  "stroke-width": "0.069228"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M25.5792 26.6924C25.5792 26.3101 25.8892 26.0001 26.2715 26.0001L129.973 26.0001V52.4969H25.5792V26.6924Z",
  fill: "#F5F5F5"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M43.4813 47.7571H33.0457C32.3806 47.7571 31.8415 47.218 31.8415 46.5529V32.1035C31.8415 31.4385 32.3806 30.8994 33.0457 30.8994H40.6717L44.6855 34.9131V46.5529C44.6855 47.218 44.1464 47.7571 43.4813 47.7571Z",
  fill: "#43A047"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M44.6856 34.9133H40.6719V30.8995L44.6856 34.9133Z",
  fill: "#C8E6C9"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M40.6719 34.9132L44.6856 38.9269V34.9132H40.6719Z",
  fill: "#2E7D32"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M41.0732 38.9261H35.454H34.6512V39.7289V40.5316V41.3344V42.1371V42.9399V43.7426V44.5454H41.8759V43.7426V42.9399V42.1371V41.3344V40.5316V39.7289V38.9261H41.0732ZM35.454 39.7289H37.0594V40.5316H35.454V39.7289ZM35.454 41.3344H37.0594V42.1371H35.454V41.3344ZM35.454 42.9399H37.0594V43.7426H35.454V42.9399ZM41.0732 43.7426H37.8622V42.9399H41.0732V43.7426ZM41.0732 42.1371H37.8622V41.3344H41.0732V42.1371ZM41.0732 40.5316H37.8622V39.7289H41.0732V40.5316Z",
  fill: "#E8F5E9"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M50.4462 43.692H51.4299V41.527H52.8044C54.0472 41.527 54.9079 40.6795 54.9079 39.4411V39.4323C54.9079 38.1895 54.0472 37.3551 52.8044 37.3551H50.4462V43.692ZM52.5585 38.1851C53.4149 38.1851 53.9067 38.6462 53.9067 39.4367V39.4455C53.9067 40.2403 53.4149 40.7014 52.5585 40.7014H51.4299V38.1851H52.5585ZM55.6545 43.692H56.6031V40.9386C56.6031 40.2491 56.9807 39.8495 57.5911 39.8495C57.7756 39.8495 57.9424 39.8714 58.0171 39.9022V39.0195C57.9424 39.0063 57.8239 38.9844 57.6877 38.9844C57.1608 38.9844 56.7743 39.3225 56.625 39.8627H56.6031V39.0722H55.6545V43.692ZM60.3885 43.7842C61.7103 43.7842 62.5798 42.8708 62.5798 41.3821V41.3733C62.5798 39.8934 61.7015 38.9844 60.3841 38.9844C59.071 38.9844 58.1971 39.8978 58.1971 41.3733V41.3821C58.1971 42.8664 59.0623 43.7842 60.3885 43.7842ZM60.3929 42.9894C59.6507 42.9894 59.1677 42.4053 59.1677 41.3821V41.3733C59.1677 40.3633 59.6551 39.7792 60.3841 39.7792C61.1263 39.7792 61.6093 40.3633 61.6093 41.3733V41.3821C61.6093 42.4009 61.135 42.9894 60.3929 42.9894ZM65.039 43.7842C65.7021 43.7842 66.2116 43.4505 66.4882 42.9103H66.5058V43.692H67.4587V37.3551H66.5058V39.8583H66.4882C66.2116 39.3137 65.6846 38.9844 65.0303 38.9844C63.8709 38.9844 63.1068 39.9066 63.1068 41.3777V41.3821C63.1068 42.8532 63.8621 43.7842 65.039 43.7842ZM65.2894 42.9674C64.5384 42.9674 64.0773 42.3658 64.0773 41.3821V41.3777C64.0773 40.4028 64.5428 39.7968 65.2894 39.7968C66.0008 39.7968 66.5102 40.4204 66.5102 41.3777V41.3821C66.5102 42.3438 66.0052 42.9674 65.2894 42.9674ZM70.0058 43.7842C70.7084 43.7842 71.1783 43.4637 71.4198 42.9982H71.4418V43.692H72.3947V39.0722H71.4418V41.7686C71.4418 42.4888 71.0114 42.9674 70.3439 42.9674C69.6852 42.9674 69.3602 42.581 69.3602 41.8827V39.0722H68.4117V42.0672C68.4117 43.1299 68.9913 43.7842 70.0058 43.7842ZM75.3194 43.7842C76.4305 43.7842 77.2034 43.0728 77.3044 42.1462L77.3088 42.1155H76.3953L76.391 42.1506C76.2768 42.6512 75.9035 42.9894 75.3194 42.9894C74.5861 42.9894 74.0986 42.3965 74.0986 41.3865V41.3821C74.0986 40.394 74.5773 39.7792 75.315 39.7792C75.9342 39.7792 76.2856 40.1613 76.3866 40.6136L76.3953 40.6487H77.3L77.2956 40.618C77.2165 39.7485 76.4963 38.9844 75.3063 38.9844C73.9888 38.9844 73.1281 39.911 73.1281 41.3733V41.3777C73.1281 42.8576 73.9713 43.7842 75.3194 43.7842ZM79.6011 43.7842C79.7943 43.7842 79.9744 43.7623 80.0842 43.7447V43.0113C80.0139 43.0201 79.9305 43.0289 79.8295 43.0289C79.4298 43.0289 79.219 42.8884 79.219 42.4185V39.8275H80.0842V39.0722H79.219V37.8689H78.2485V39.0722H77.5854V39.8275H78.2485V42.4756C78.2485 43.3978 78.6877 43.7842 79.6011 43.7842ZM82.6005 43.7842C83.6896 43.7842 84.48 43.2046 84.48 42.3614V42.357C84.48 41.6939 84.1199 41.3206 83.1758 41.1011L82.4248 40.9298C81.9286 40.8112 81.7397 40.618 81.7397 40.3326V40.3282C81.7397 39.9593 82.0603 39.7177 82.5697 39.7177C83.1055 39.7177 83.4217 39.9988 83.4788 40.4028L83.4832 40.4336H84.3746L84.3702 40.3809C84.3219 39.5948 83.6632 38.9844 82.5697 38.9844C81.507 38.9844 80.7868 39.5509 80.7868 40.3765V40.3809C80.7868 41.0528 81.2216 41.4743 82.0998 41.6763L82.8552 41.8476C83.3514 41.9662 83.5183 42.1374 83.5183 42.4361V42.4405C83.5183 42.8137 83.1758 43.0509 82.6049 43.0509C82.0208 43.0509 81.7046 42.8006 81.6168 42.3746L81.608 42.3307H80.6682L80.6726 42.3702C80.7692 43.2133 81.4455 43.7842 82.6005 43.7842Z",
  fill: "#216124"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
  opacity: "0.1",
  filter: "url(#filter1_f_2907_877)"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  x: "86.1611",
  y: "64.2886",
  width: "102.34",
  height: "97.0648",
  fill: "#1B815C"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  x: "87.8808",
  y: "64.2886",
  width: "101.119",
  height: "96.8163",
  rx: "5.68346",
  fill: "#FBFFFD"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M121.208 76.5122C121.208 72.2768 124.641 68.8434 128.876 68.8434H145.91C150.146 68.8434 153.579 72.2768 153.579 76.5122V80.6218C153.579 83.0824 151.572 85.0703 149.111 85.0462L143.788 84.9941C143.083 84.9872 142.605 85.7084 142.887 86.3543C143.252 87.194 142.36 88.027 141.547 87.6053L137.296 85.3991C136.916 85.2021 136.495 85.0992 136.067 85.0989L128.872 85.0945C124.638 85.092 121.208 81.6593 121.208 77.4257V76.5122Z",
  fill: "white"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  "fill-rule": "evenodd",
  "clip-rule": "evenodd",
  d: "M149.764 69.5491H125.185C123.63 69.5491 122.37 70.7951 122.383 72.3074V81.5018C122.383 83.0261 123.642 84.2601 125.197 84.2601H136.839L142.16 87.1635L140.95 84.2601H149.764C151.32 84.2601 152.579 83.0261 152.579 81.5018V72.3074C152.579 70.783 151.32 69.5491 149.764 69.5491ZM124.667 71.6783C124.321 71.7025 124.062 71.8235 123.889 72.0533C123.716 72.2711 123.654 72.5493 123.691 72.8639C124.42 77.4006 125.099 80.4613 125.728 82.0462C125.975 82.6268 126.259 82.9051 126.592 82.881C127.111 82.8446 127.728 82.143 128.457 80.7759C128.839 80.0016 129.432 78.8403 130.234 77.2917C130.901 79.5782 131.814 81.2961 132.962 82.4454C133.283 82.772 133.617 82.9172 133.938 82.893C134.222 82.8688 134.444 82.7236 134.592 82.4575C134.715 82.2276 134.765 81.9614 134.74 81.659C134.666 80.5581 134.777 79.0217 135.086 77.0497C135.407 75.0173 135.802 73.5535 136.283 72.6824C136.382 72.5009 136.419 72.3195 136.407 72.1017C136.382 71.8235 136.259 71.5936 136.024 71.4121C135.79 71.2307 135.53 71.146 135.246 71.1702C134.888 71.1944 134.617 71.3637 134.432 71.7025C133.666 73.0695 133.123 75.2835 132.802 78.3563C132.333 77.1949 131.938 75.8279 131.629 74.2188C131.493 73.5051 131.16 73.1663 130.617 73.2026C130.247 73.2268 129.938 73.4688 129.691 73.9285L126.987 78.9733C126.543 77.2191 126.123 75.0778 125.741 72.5493C125.654 71.9203 125.296 71.6299 124.667 71.6783ZM148.456 72.5494C149.332 72.7308 149.986 73.1906 150.431 73.9527C150.826 74.606 151.023 75.3924 151.023 76.336C151.023 77.5821 150.702 78.7193 150.06 79.7597C149.32 80.9695 148.357 81.5744 147.159 81.5744C146.95 81.5744 146.727 81.5502 146.493 81.5018C145.616 81.3203 144.962 80.8606 144.517 80.0985C144.122 79.4331 143.925 78.6346 143.925 77.703C143.925 76.457 144.246 75.3198 144.888 74.2915C145.641 73.0817 146.604 72.4768 147.789 72.4768C147.999 72.4768 148.221 72.501 148.456 72.5494ZM147.937 79.0943C148.394 78.6951 148.703 78.1023 148.875 77.3038C148.925 77.0256 148.962 76.7231 148.962 76.4086C148.962 76.0578 148.888 75.6827 148.74 75.3077C148.554 74.8359 148.307 74.5818 148.011 74.5213C147.567 74.4366 147.135 74.6786 146.727 75.2714C146.394 75.7311 146.184 76.215 146.073 76.711C146.011 76.9893 145.987 77.2918 145.987 77.5942C145.987 77.945 146.061 78.32 146.209 78.6951C146.394 79.1669 146.641 79.4209 146.937 79.4815C147.246 79.5419 147.579 79.4089 147.937 79.0943ZM142.69 73.9527C142.246 73.1906 141.579 72.7308 140.715 72.5494C140.481 72.501 140.258 72.4768 140.049 72.4768C138.863 72.4768 137.901 73.0817 137.147 74.2915C136.505 75.3198 136.185 76.457 136.185 77.703C136.185 78.6346 136.382 79.4331 136.777 80.0985C137.222 80.8606 137.876 81.3203 138.752 81.5018C138.987 81.5502 139.209 81.5744 139.419 81.5744C140.616 81.5744 141.579 80.9695 142.32 79.7597C142.962 78.7193 143.283 77.5821 143.283 76.336C143.283 75.3924 143.085 74.606 142.69 73.9527ZM141.135 77.3038C140.962 78.1023 140.653 78.6951 140.197 79.0943C139.839 79.4089 139.505 79.5419 139.197 79.4815C138.9 79.4209 138.654 79.1669 138.468 78.6951C138.32 78.32 138.246 77.945 138.246 77.5942C138.246 77.2918 138.271 76.9893 138.333 76.711C138.444 76.215 138.654 75.7311 138.987 75.2714C139.394 74.6786 139.826 74.4366 140.271 74.5213C140.567 74.5818 140.814 74.8359 140.999 75.3077C141.147 75.6827 141.221 76.0578 141.221 76.4086C141.221 76.7231 141.197 77.0256 141.135 77.3038Z",
  fill: "#7F54B3"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  opacity: "0.3",
  x: "107.643",
  y: "90.7106",
  width: "27.7361",
  height: "27.3894",
  fill: "#C4C4C4"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  opacity: "0.3",
  x: "143.7",
  y: "124.341",
  width: "27.7361",
  height: "27.3894",
  fill: "#C4C4C4"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  x: "107.792",
  y: "124.491",
  width: "27.4369",
  height: "27.0902",
  rx: "1.34608",
  fill: "#FFF2F3",
  stroke: "#FF919F",
  "stroke-width": "0.299129"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  x: "143.849",
  y: "90.8605",
  width: "27.4369",
  height: "27.0902",
  rx: "1.34608",
  fill: "#EAFAFF",
  stroke: "#71DCFF",
  "stroke-width": "0.299129"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M162.583 108.818C160.448 112.734 160.48 113.057 159.477 112.475C158.474 111.892 158.085 111.375 160.253 107.492C162.421 103.609 163.036 103.641 164.039 104.223C165.01 104.774 164.719 104.935 162.583 108.818Z",
  fill: "#454749"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M164.589 109.983C163.23 112.475 161.548 113.672 160.739 113.219C159.736 112.637 160.253 112.637 162.389 108.721C164.525 104.806 164.266 104.353 165.269 104.935C166.078 105.388 165.948 107.492 164.589 109.983Z",
  fill: "#258399"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M152.552 108.818C154.688 112.734 154.655 113.057 155.658 112.475C156.661 111.892 157.05 111.375 154.882 107.492C152.714 103.609 152.099 103.641 151.096 104.223C150.125 104.774 150.416 104.935 152.552 108.818Z",
  fill: "#454749"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M150.546 109.983C151.905 112.475 153.587 113.672 154.396 113.219C155.399 112.637 154.882 112.637 152.746 108.721C150.61 104.806 150.869 104.353 149.866 104.935C149.057 105.388 149.187 107.492 150.546 109.983Z",
  fill: "#258399"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M150.869 112.896C150.869 112.896 152.617 113.349 152.746 112.896C153.555 110.275 149.057 108.721 149.057 105.744C149.057 100.955 152.876 97.0722 157.568 97.0722C162.26 97.0722 166.078 100.955 166.078 105.744C166.078 108.721 161.58 110.275 162.389 112.896C162.519 113.349 164.266 112.896 164.266 112.896C166.11 111.084 167.275 108.56 167.275 105.744C167.275 100.276 162.939 95.8425 157.568 95.8425C152.196 95.8425 147.86 100.276 147.86 105.744C147.86 108.56 149.025 111.084 150.869 112.896Z",
  fill: "#3BAACF"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M152.034 99.9194C153.167 99.6929 154.623 98.0749 157.568 98.0749C160.512 98.0749 162.001 99.7252 163.101 99.9194C163.554 100.016 164.331 99.3045 164.331 99.3045C162.551 97.2659 160.448 96.2305 157.568 96.2305C154.688 96.2305 152.584 97.2659 150.805 99.3045C150.805 99.3369 151.581 100.016 152.034 99.9194Z",
  fill: "#454749"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M122.076 135.045C122.076 134.892 122.015 134.745 121.906 134.637C121.798 134.528 121.651 134.467 121.498 134.467C121.344 134.467 121.197 134.528 121.089 134.637C120.98 134.745 120.919 134.892 120.919 135.045V137.936H119.185C119.031 137.936 118.884 137.997 118.776 138.106C118.667 138.214 118.607 138.361 118.607 138.515C118.607 138.668 118.667 138.815 118.776 138.923C118.884 139.032 119.031 139.093 119.185 139.093H121.498C121.651 139.093 121.798 139.032 121.906 138.923C122.015 138.815 122.076 138.668 122.076 138.515V135.045Z",
  fill: "#DD2E44"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M118.8 147.766C117.736 147.766 116.872 146.903 116.872 145.838V143.687C116.143 143.037 115.56 142.24 115.162 141.348C114.763 140.457 114.558 139.491 114.559 138.515C114.559 136.46 115.452 134.613 116.872 133.343V131.191C116.872 130.127 117.734 129.263 118.8 129.263H124.195C125.259 129.263 126.123 130.126 126.123 131.191V133.342C127.299 134.392 128.081 135.811 128.341 137.366C128.424 137.353 128.509 137.358 128.589 137.38C128.67 137.402 128.745 137.442 128.809 137.496C128.873 137.551 128.924 137.618 128.96 137.694C128.995 137.77 129.014 137.853 129.014 137.936V139.093C129.014 139.177 128.996 139.26 128.961 139.336C128.925 139.412 128.874 139.479 128.81 139.534C128.746 139.588 128.671 139.628 128.59 139.65C128.509 139.672 128.424 139.677 128.341 139.663C128.081 141.218 127.299 142.637 126.123 143.687V145.838C126.123 146.902 125.26 147.766 124.195 147.766H118.8ZM127.28 138.515C127.28 136.981 126.67 135.51 125.586 134.426C124.502 133.342 123.031 132.732 121.497 132.732C119.964 132.732 118.493 133.342 117.409 134.426C116.325 135.51 115.715 136.981 115.715 138.515C115.715 140.048 116.325 141.519 117.409 142.603C118.493 143.687 119.964 144.297 121.497 144.297C123.031 144.297 124.502 143.687 125.586 142.603C126.67 141.519 127.28 140.048 127.28 138.515Z",
  fill: "#DD2E44"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M73.5005 81.5533C73.5005 75.5144 78.3999 70.6189 84.4435 70.6189H87.7264C93.77 70.6189 98.6694 75.5144 98.6694 81.5533V85.4584C98.6694 91.4973 93.77 96.3928 87.7264 96.3928H84.4435C78.3999 96.3928 73.5005 91.4973 73.5005 85.4584V81.5533Z",
  fill: "url(#paint0_linear_2907_877)"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M88.9397 80.4521C88.1618 79.7236 87.1522 79.3244 86.0812 79.3253C84.1538 79.327 82.4898 80.6486 82.0303 82.4818C81.9969 82.6153 81.878 82.7095 81.7404 82.7095H80.3145C80.1279 82.7095 79.9862 82.5401 80.0207 82.3568C80.5591 79.4976 83.0694 77.3346 86.085 77.3346C87.7385 77.3346 89.2401 77.985 90.348 79.0437L91.2367 78.155C91.6129 77.7788 92.2562 78.0453 92.2562 78.5773V81.9132C92.2562 82.2431 91.9888 82.5104 91.659 82.5104H88.3231C87.791 82.5104 87.5246 81.8672 87.9008 81.4909L88.9397 80.4521ZM80.511 84.5012H83.8469C84.379 84.5012 84.6454 85.1444 84.2692 85.5207L83.2303 86.5596C84.0082 87.288 85.0179 87.6873 86.0889 87.6863C88.0153 87.6846 89.68 86.3639 90.1397 84.5298C90.1731 84.3964 90.292 84.3021 90.4296 84.3021H91.8555C92.0421 84.3021 92.1838 84.4715 92.1493 84.6549C91.6109 87.514 89.1006 89.677 86.085 89.677C84.4315 89.677 82.9299 89.0266 81.822 87.9679L80.9333 88.8566C80.5571 89.2328 79.9138 88.9664 79.9138 88.4343V85.0984C79.9138 84.7685 80.1812 84.5012 80.511 84.5012Z",
  fill: "white"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("defs", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("filter", {
  id: "filter0_f_2907_877",
  x: "0.701912",
  y: "0.985512",
  width: "155.093",
  height: "165.643",
  filterUnits: "userSpaceOnUse",
  "color-interpolation-filters": "sRGB"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feFlood", {
  "flood-opacity": "0",
  result: "BackgroundImageFix"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feBlend", {
  mode: "normal",
  in: "SourceGraphic",
  in2: "BackgroundImageFix",
  result: "shape"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feGaussianBlur", {
  stdDeviation: "12.6606",
  result: "effect1_foregroundBlur_2907_877"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("filter", {
  id: "filter1_f_2907_877",
  x: "60.8399",
  y: "38.9673",
  width: "152.983",
  height: "147.707",
  filterUnits: "userSpaceOnUse",
  "color-interpolation-filters": "sRGB"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feFlood", {
  "flood-opacity": "0",
  result: "BackgroundImageFix"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feBlend", {
  mode: "normal",
  in: "SourceGraphic",
  in2: "BackgroundImageFix",
  result: "shape"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("feGaussianBlur", {
  stdDeviation: "12.6606",
  result: "effect1_foregroundBlur_2907_877"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "paint0_linear_2907_877",
  x1: "86.0849",
  y1: "70.6189",
  x2: "86.0849",
  y2: "96.3928",
  gradientUnits: "userSpaceOnUse"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  "stop-color": "#25CD52"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  "stop-color": "#34A853"
}))));
const TrashCan = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "133",
  height: "131",
  viewBox: "0 0 133 131",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  "fill-rule": "evenodd",
  "clip-rule": "evenodd",
  d: "M61.2003 0.0460557C90.3852 -0.886378 120.219 12.3367 129.638 39.9755C139.418 68.6725 125.74 99.465 101.106 117.137C76.9495 134.466 44.0949 136.321 20.444 118.309C-1.81872 101.354 -4.10116 70.414 5.01657 43.9571C13.5787 19.1124 34.9351 0.885209 61.2003 0.0460557Z",
  fill: "#FAFAFA"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M34.6494 50.915L39.8253 102.482C40.1121 104.662 50.5768 111.828 65.7285 111.838C80.8896 111.828 91.3543 104.662 91.6364 102.482L96.817 50.915C88.9003 55.3683 77.0676 57.472 65.7285 57.472C54.3988 57.472 42.5614 55.3683 34.6494 50.915ZM80.6216 24.427L76.5834 19.9312C75.0226 17.6951 73.3302 17.2886 70.0347 17.2886H61.427C58.1362 17.2886 56.4391 17.6951 54.883 19.9312L50.8448 24.427C38.7629 26.5497 30 32.1801 30 36.3355V37.1392C30 44.4526 45.9979 50.3808 65.7285 50.3808C85.4638 50.3808 101.462 44.4526 101.462 37.1392V36.3355C101.462 32.1801 92.7035 26.5497 80.6216 24.427ZM75.4598 37.8058L70.4296 31.471H61.0274L56.0066 37.8058H48.0147C48.0147 37.8058 56.7682 27.3061 57.9387 25.8831C58.832 24.7958 59.744 24.3798 60.9287 24.3798H70.533C71.7224 24.3798 72.6344 24.7958 73.5276 25.8831C74.6935 27.3061 83.4517 37.8058 83.4517 37.8058H75.4598Z",
  fill: "#EBECEE"
}));
const Cross = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "17",
  height: "17",
  viewBox: "0 0 17 17",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M8.5 8.5L16 16M1 16L8.5 8.5L1 16ZM16 1L8.49857 8.5L16 1ZM8.49857 8.5L1 1L8.49857 8.5Z",
  stroke: "#575757",
  "stroke-width": "1.5",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}));
const Cloud = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "123",
  height: "116",
  viewBox: "0 0 123 116",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M9.1579 97.6842C11.5867 97.6842 13.9161 98.6491 15.6335 100.367C17.351 102.084 18.3158 104.413 18.3158 106.842C18.3158 109.271 17.351 111.6 15.6335 113.318C13.9161 115.035 11.5867 116 9.1579 116C6.72907 116 4.39973 115.035 2.68229 113.318C0.964848 111.6 0 109.271 0 106.842C0 104.413 0.964848 102.084 2.68229 100.367C4.39973 98.6491 6.72907 97.6842 9.1579 97.6842ZM39.6842 79.3685C43.7323 79.3685 47.6145 80.9765 50.4769 83.8389C53.3393 86.7013 54.9474 90.5836 54.9474 94.6316C54.9474 98.6797 53.3393 102.562 50.4769 105.424C47.6145 108.287 43.7323 109.895 39.6842 109.895C35.6362 109.895 31.7539 108.287 28.8915 105.424C26.0291 102.562 24.4211 98.6797 24.4211 94.6316C24.4211 90.5836 26.0291 86.7013 28.8915 83.8389C31.7539 80.9765 35.6362 79.3685 39.6842 79.3685ZM76.3158 73.2632C69.0506 73.2632 62.4569 70.2106 58 65.0211C53.5432 70.2106 46.9495 73.2632 39.6842 73.2632C27.7179 73.2632 17.7663 64.6548 15.6905 53.36C11.0798 51.5769 7.11504 48.4431 4.31535 44.3688C1.51565 40.2945 0.0115481 35.4698 0 30.5263C0 24.0495 2.57293 17.8379 7.15276 13.258C11.7326 8.67819 17.9442 6.10527 24.4211 6.10527C26.0084 6.10527 27.4737 6.28842 29.1221 6.53264C33.579 2.50316 39.379 0 45.7895 0C53.0548 0 59.6484 3.05263 64.1053 8.24211C68.5621 3.05263 75.1558 0 82.4211 0C94.3874 0 104.339 8.60843 106.415 19.9032C111.025 21.6862 114.99 24.8201 117.79 28.8944C120.59 32.9686 122.094 37.7934 122.105 42.7369C122.105 49.2137 119.532 55.4253 114.953 60.0052C110.373 64.585 104.161 67.1579 97.6842 67.1579L92.9832 66.7306C88.5264 70.76 82.7263 73.2632 76.3158 73.2632Z",
  fill: "#DDE4E8"
}));
const createTable = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "175",
  height: "116",
  viewBox: "0 0 175 116",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  x: "49.5375",
  width: "41.7838",
  height: "17.8277",
  rx: "2.46577",
  fill: "#D0DAE0"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M49.5375 1.67135C49.5375 0.748287 50.2858 0 51.2089 0H89.65C90.573 0 91.3213 0.748289 91.3213 1.67135V17.8277H49.5375V1.67135Z",
  fill: "#C3D1DA"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  x: "25.5907",
  width: "41.7838",
  height: "17.8277",
  rx: "2.46577",
  fill: "#C4D2DA"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M25.5907 1.67135C25.5907 0.748287 26.339 0 27.262 0H65.7031C66.6261 0 67.3744 0.748289 67.3744 1.67135V17.8277H25.5907V1.67135Z",
  fill: "#D0DAE0"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M0 1.67135C0 0.748287 0.748289 0 1.67135 0H40.1124C41.0355 0 41.7838 0.748289 41.7838 1.67135V17.8277H0V1.67135Z",
  fill: "#DDE4E8"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  "fill-rule": "evenodd",
  "clip-rule": "evenodd",
  d: "M164.385 16.4385H0V113.425C0 114.333 0.735975 115.069 1.64385 115.069H164.385C165.293 115.069 166.029 114.333 166.029 113.425V18.0823C166.029 17.1745 165.293 16.4385 164.385 16.4385ZM159.453 23.0139H5.75348V107.672C5.75348 108.58 6.48945 109.316 7.39732 109.316H159.453C160.361 109.316 161.097 108.58 161.097 107.672V24.6577C161.097 23.7499 160.361 23.0139 159.453 23.0139Z",
  fill: "#DDE4E8"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  opacity: "0.2",
  x: "11.6526",
  y: "29.8599",
  width: "54.6215",
  height: "13.8374",
  rx: "1.45657",
  fill: "#D0DAE0"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  opacity: "0.2",
  x: "72.8287",
  y: "29.8599",
  width: "82.2964",
  height: "13.8374",
  rx: "1.45657",
  fill: "#D0DAE0"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  opacity: "0.2",
  x: "11.6526",
  y: "49.5234",
  width: "54.6215",
  height: "13.8374",
  rx: "1.45657",
  fill: "#D0DAE0"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  opacity: "0.2",
  x: "72.8287",
  y: "49.5234",
  width: "82.2964",
  height: "13.8374",
  rx: "1.45657",
  fill: "#D0DAE0"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  opacity: "0.2",
  x: "11.6526",
  y: "69.1875",
  width: "54.6215",
  height: "13.8374",
  rx: "1.45657",
  fill: "#D0DAE0"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  opacity: "0.2",
  x: "72.8287",
  y: "69.1875",
  width: "82.2964",
  height: "13.8374",
  rx: "1.45657",
  fill: "#D0DAE0"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  opacity: "0.2",
  x: "11.6526",
  y: "88.8511",
  width: "54.6215",
  height: "13.8374",
  rx: "1.45657",
  fill: "#D0DAE0"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  opacity: "0.2",
  x: "72.8287",
  y: "88.8511",
  width: "82.2964",
  height: "13.8374",
  rx: "1.45657",
  fill: "#D0DAE0"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
  cx: "151",
  cy: "32",
  r: "24",
  fill: "white"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M162.025 30.2815H154.05V22.3064C154.05 19.2312 149.281 19.2312 149.281 22.3064V30.2815H141.306C138.231 30.2815 138.231 35.0507 141.306 35.0507H149.281V43.0258C149.281 46.1011 154.05 46.1011 154.05 43.0258V35.0507H162.025C165.1 35.0507 165.1 30.2815 162.025 30.2815Z",
  fill: "#DDE4E8"
}));
const Desktop = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "353",
  height: "192",
  viewBox: "0 0 353 192",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("mask", {
  id: "mask0_2828_1824",
  maskUnits: "userSpaceOnUse",
  x: "0",
  y: "0",
  width: "353",
  height: "192"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  width: "353",
  height: "192",
  fill: "#D9D9D9"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
  mask: "url(#mask0_2828_1824)"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.2",
  d: "M51 170.904L51.5033 182.536L307.698 183.562L308 170.562L51 170.904Z",
  fill: "#3EA9CE"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M17 164.562L342 165.229V171.562L17.5682 171.229L17 164.562Z",
  fill: "#6CC9E9"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M110.417 149.903H184.379C184.379 149.903 187.147 149.758 187.147 146.552V140.191H107.503V147.912C107.892 149.126 109.057 149.952 110.417 149.903Z",
  fill: "#56B0E2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M107.503 92.1131L107.455 142.619L187.147 141.89V90.6562C187.147 90.6562 187.632 87.7424 184.524 87.7424H110.514C110.514 87.7424 107.163 87.7424 107.503 92.1131Z",
  fill: "#4F75CD"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M141.012 163.452V149.417L152.667 149.903V162.238L141.012 163.452Z",
  fill: "#517CD0"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M122.509 162.044H170.927L170.975 164.472H122.509V162.044Z",
  fill: "#4F75CD"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M146.597 143.639C147.908 143.639 148.928 144.658 148.928 145.97C148.928 147.281 147.908 148.301 146.597 148.301C145.285 148.301 144.266 147.281 144.266 145.97C144.266 144.658 145.334 143.639 146.597 143.639Z",
  fill: "white"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M184.719 90.17H109.931V139.219H184.719V90.17Z",
  fill: "#F8F8FF"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M113.671 92.6957C114.302 92.6957 114.836 93.2299 114.836 93.8612C114.836 94.4925 114.302 95.0267 113.671 95.0267C113.039 95.0267 112.505 94.4925 112.505 93.8612C112.505 93.2299 113.039 92.6957 113.671 92.6957Z",
  fill: "#FA5F5D"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M117.653 92.6957C118.284 92.6957 118.819 93.2299 118.819 93.8612C118.819 94.4925 118.284 95.0267 117.653 95.0267C117.022 95.0267 116.488 94.4925 116.488 93.8612C116.488 93.2299 117.022 92.6957 117.653 92.6957Z",
  fill: "#FDBC4E"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M121.829 92.6957C122.461 92.6957 122.995 93.2299 122.995 93.8612C122.995 94.4925 122.461 95.0267 121.829 95.0267C121.198 95.0267 120.664 94.4925 120.664 93.8612C120.664 93.2299 121.198 92.6957 121.829 92.6957Z",
  fill: "#37CD58"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M138.098 101.243C138.049 101.874 137.515 102.36 136.884 102.311H122.557C121.829 102.311 121.101 101.825 121.101 101.243V99.0573C121.101 98.4745 121.78 97.9404 122.557 97.9404H136.835C137.466 97.8918 138.049 98.3774 138.098 99.0087V99.0573V101.243Z",
  fill: "url(#paint0_linear_2828_1824)"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M172.236 115.906C172.187 116.585 171.604 117.12 170.925 117.071H122.216C121.487 117.071 120.759 116.537 120.759 115.906V105.125C120.759 104.493 121.487 103.959 122.216 103.959H170.925C171.604 103.91 172.187 104.445 172.236 105.125V115.906Z",
  fill: "#DFE4F7"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M137.126 124.942C137.126 125.573 136.592 126.107 135.961 126.107H122.557C121.78 126.107 121.101 125.573 121.101 124.942V119.017C121.101 118.386 121.829 117.851 122.557 117.851H135.864C136.495 117.803 137.078 118.289 137.126 118.968V119.017V124.942Z",
  fill: "#DFE4F7"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M154.609 124.942C154.609 125.573 154.075 126.107 153.444 126.107H140.04C139.263 126.107 138.583 125.573 138.583 124.942V119.017C138.583 118.386 139.312 117.851 140.04 117.851H153.347C153.978 117.803 154.561 118.289 154.609 118.968V119.017V124.942Z",
  fill: "#DFE4F7"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M172.578 124.942C172.529 125.622 171.946 126.156 171.266 126.107H157.96C157.341 126.149 156.827 125.769 156.627 125.236C156.556 125.046 156.552 124.84 156.552 124.637V119.017C156.6 118.289 157.232 117.803 157.96 117.851H171.266C171.946 117.803 172.578 118.337 172.626 119.017L172.578 124.942Z",
  fill: "#DFE4F7"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M154.609 128.293C154.512 128.535 154.318 128.681 154.075 128.73C154.027 128.73 154.027 128.73 153.978 128.535H139.312C139.021 128.73 138.583 128.535 138.583 128.293V128.098C138.583 127.855 139.021 127.613 139.312 127.564H153.978C154.221 127.613 154.367 127.807 154.415 128.001C154.415 128.05 154.415 128.05 154.561 128.098L154.609 128.293Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M154.609 130.186C154.512 130.429 154.318 130.623 154.075 130.672C154.075 130.672 154.027 130.672 154.027 130.478H139.312C139.021 130.672 138.583 130.478 138.583 130.186V129.992C138.583 129.749 139.021 129.555 139.312 129.506H153.978C154.221 129.555 154.464 129.749 154.561 129.992L154.609 130.186Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M154.609 132.129C154.512 132.42 154.269 132.615 154.027 132.663C154.027 132.566 154.027 132.517 154.027 132.42H139.312C139.069 132.566 138.778 132.517 138.632 132.275C138.583 132.226 138.583 132.178 138.583 132.129V131.935C138.583 131.692 139.021 131.546 139.312 131.449H153.978C154.221 131.498 154.464 131.692 154.561 131.935L154.609 132.129Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M154.609 134.022C154.464 134.314 154.269 134.605 154.027 134.848H139.312C139.021 134.605 138.583 134.314 138.583 134.022V133.828C138.583 133.585 139.021 133.294 139.312 133.391H153.978C154.172 133.343 154.367 133.488 154.415 133.683C154.415 133.731 154.415 133.78 154.415 133.828C154.415 133.828 154.415 133.828 154.561 133.877L154.609 134.022Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M146.451 135.965C146.451 136.208 146.305 136.305 146.014 136.305H139.263C138.972 136.305 138.583 136.208 138.583 135.965V135.771C138.583 135.528 138.972 135.334 139.263 135.334H146.014C146.256 135.334 146.451 135.528 146.451 135.771V135.965Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M172.578 128.293C172.286 128.535 172.335 128.73 172.044 128.535H157.377C157.135 128.73 156.892 128.584 156.892 128.341C156.892 128.341 156.892 128.341 157.038 128.293V128.098C156.892 127.855 157.086 127.613 157.377 127.564H172.044C172.335 127.661 172.286 127.855 172.578 128.098V128.293Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M172.578 130.186C172.286 130.429 172.335 130.672 172.044 130.478H157.378C157.086 130.672 156.892 130.478 157.038 130.186V129.992C156.892 129.749 157.086 129.555 157.378 129.506H172.044C172.335 129.604 172.286 129.749 172.578 129.992V130.186Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M172.578 132.129C172.286 132.372 172.335 132.663 172.044 132.42H157.378C157.086 132.615 156.892 132.42 157.038 132.129V131.935C156.892 131.692 157.086 131.546 157.378 131.449H172.044C172.335 131.546 172.286 131.692 172.578 131.935V132.129Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M172.578 134.023C172.287 134.266 172.335 134.606 172.044 134.848H157.378C157.086 134.557 156.892 134.314 157.038 134.023V133.829C156.941 133.732 156.941 133.537 157.038 133.44C157.135 133.392 157.232 133.343 157.329 133.392H172.044C172.335 133.294 172.287 133.586 172.578 133.829V134.023Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M164.516 135.965C164.516 136.208 164.516 136.305 164.273 136.305H157.474C157.183 136.305 157.037 136.208 157.037 135.965V135.771C157.037 135.528 157.232 135.334 157.474 135.334H164.225C164.516 135.334 164.468 135.528 164.468 135.771L164.516 135.965Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M136.641 128.293C136.835 128.535 136.738 128.73 136.447 128.535H121.732C121.538 128.681 121.295 128.632 121.198 128.487C121.149 128.438 121.149 128.39 121.101 128.293V128.098C121.198 127.807 121.441 127.613 121.732 127.564H136.398C136.689 127.661 136.786 127.855 136.592 128.098L136.641 128.293Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M136.641 130.186C136.835 130.429 136.738 130.672 136.447 130.478H121.732C121.441 130.721 121.198 130.478 121.101 130.186V129.992C121.149 129.749 121.441 129.555 121.732 129.506H136.398C136.689 129.604 136.786 129.749 136.592 129.992L136.641 130.186Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M136.641 132.129C136.835 132.372 136.738 132.663 136.447 132.42H121.732C121.441 132.663 121.198 132.42 121.101 132.129V131.935C121.149 131.692 121.441 131.546 121.732 131.449H136.398C136.689 131.546 136.786 131.692 136.592 131.935L136.641 132.129Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M132.27 133.391H136.447C136.738 133.294 136.835 133.585 136.641 133.828V134.022C136.835 134.265 136.738 134.605 136.447 134.848H121.732C121.441 134.654 121.246 134.362 121.101 134.022V133.828C121.149 133.537 121.441 133.343 121.732 133.391H132.27Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M129.356 135.965C129.356 136.208 129.211 136.305 128.919 136.305H121.635C121.343 136.305 121.101 136.208 121.101 135.965V135.771C121.149 135.528 121.392 135.334 121.635 135.334H128.919C129.162 135.334 129.356 135.528 129.356 135.723C129.356 135.723 129.356 135.723 129.356 135.771V135.965Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M209.734 44.7208C209.729 42.0234 211.924 39.8394 214.622 39.8572L334.377 40.6462C337.046 40.6638 339.201 42.8328 339.201 45.5022V143.447C339.201 146.123 337.037 148.294 334.362 148.303L214.761 148.724C212.075 148.734 209.892 146.561 209.888 143.876L209.734 44.7208Z",
  fill: "white",
  stroke: "#E2E5F1"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M221.494 87.899V96.4688L243.99 96.1057V87.899H221.494Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M249.346 87.899V96.4688L292.195 96.1057V87.899H249.346Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M296.479 87.8992V96.4689L331.83 96.1058V87.8992H296.479Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
  opacity: "0.6"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.3",
  d: "M221.494 100.754V108.253L243.989 107.935V100.754H221.494Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M221.494 112.538V120.036L243.989 119.719V112.538H221.494Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.3",
  d: "M221.494 124.321V131.819L243.989 131.501V124.321H221.494Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M221.494 136.104V143.603L243.989 143.285V136.104H221.494Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.3",
  d: "M249.345 100.754V108.253L292.194 107.935V100.754H249.345Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M249.345 112.538V120.036L292.194 119.719V112.538H249.345Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.3",
  d: "M249.345 124.321V131.819L292.194 131.501V124.321H249.345Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M249.345 136.104V143.603L292.194 143.285V136.104H249.345Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.3",
  d: "M296.479 100.754V108.253L331.829 107.935V100.754H296.479Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M296.479 112.538V120.036L331.829 119.719V112.538H296.479Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.3",
  d: "M296.479 124.321V131.819L331.829 131.501V124.321H296.479Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M296.479 136.104V143.603L331.829 143.285V136.104H296.479Z",
  fill: "#BAC6F2"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M296.621 67.5521C298.988 67.5521 300.906 65.6337 300.906 63.2672C300.906 60.9007 298.988 58.9823 296.621 58.9823C294.255 58.9823 292.336 60.9007 292.336 63.2672C292.336 65.6337 294.255 67.5521 296.621 67.5521Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M308.405 67.5521C310.771 67.5521 312.69 65.6337 312.69 63.2672C312.69 60.9007 310.771 58.9823 308.405 58.9823C306.038 58.9823 304.12 60.9007 304.12 63.2672C304.12 65.6337 306.038 67.5521 308.405 67.5521Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M320.188 67.5521C322.555 67.5521 324.473 65.6337 324.473 63.2672C324.473 60.9007 322.555 58.9823 320.188 58.9823C317.822 58.9823 315.903 60.9007 315.903 63.2672C315.903 65.6337 317.822 67.5521 320.188 67.5521Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M273.155 47.3646H221.736V78.43H273.155V47.3646Z",
  fill: "#E9EDFA"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M223.879 71.1501C223.879 71.1501 227.377 63.4943 230.703 64.3257C234.029 65.1571 234.86 68.6559 237.354 67.1663C239.849 65.6767 241.477 59.649 243.902 58.679C247.366 57.328 248.509 58.8176 253.186 61.485C257.862 64.1524 259.837 63.5635 261.742 61.5889C263.509 59.7876 266.765 54.903 270.368 52.7206",
  stroke: "#BAC6F2",
  "stroke-width": "1.03926",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M84.0225 43.967H25.7331C23.3667 43.967 21.4482 45.8854 21.4482 48.2519V103.25C21.4482 105.617 23.3667 107.535 25.7331 107.535H84.0225C86.3889 107.535 88.3074 105.617 88.3074 103.25V48.2519C88.3074 45.8854 86.3889 43.967 84.0225 43.967Z",
  fill: "#0CB352"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M54.0117 99.7412C63.5587 99.7412 71.2981 92.0018 71.2981 82.4548C71.2981 72.9078 63.5587 65.1685 54.0117 65.1685C44.4647 65.1685 36.7253 72.9078 36.7253 82.4548C36.7253 92.0018 44.4647 99.7412 54.0117 99.7412Z",
  fill: "white"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M60.68 91.6412H47.8996C47.0851 91.6412 46.4249 90.981 46.4249 90.1665V72.4705C46.4249 71.656 47.0851 70.9958 47.8996 70.9958H57.2392L62.1547 75.9114V90.1665C62.1547 90.981 61.4946 91.6412 60.68 91.6412Z",
  fill: "#43A047"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M62.1544 75.9109H57.2389V70.9954L62.1544 75.9109Z",
  fill: "#C8E6C9"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M57.2389 75.9115L62.1544 80.8271V75.9115H57.2389Z",
  fill: "#2E7D32"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M57.7302 80.8258H50.8485H49.8654V81.8089V82.792V83.7751V84.7582V85.7414V86.7245V87.7076H58.7134V86.7245V85.7414V84.7582V83.7751V82.792V81.8089V80.8258H57.7302ZM50.8485 81.8089H52.8147V82.792H50.8485V81.8089ZM50.8485 83.7751H52.8147V84.7582H50.8485V83.7751ZM50.8485 85.7414H52.8147V86.7245H50.8485V85.7414ZM57.7302 86.7245H53.7978V85.7414H57.7302V86.7245ZM57.7302 84.7582H53.7978V83.7751H57.7302V84.7582ZM57.7302 82.792H53.7978V81.8089H57.7302V82.792Z",
  fill: "#E8F5E9"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M42.857 49.475H25.8478V53.4934H42.857V49.475Z",
  fill: "white"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M42.857 55.7802H25.8478V59.7986H42.857V55.7802Z",
  fill: "white"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M201.413 65.3921L199.669 59.4583L195.402 63.9353L201.413 65.3921ZM100.721 51.1921C100.996 51.0818 101.129 50.7699 101.019 50.4954C100.908 50.2209 100.596 50.0878 100.322 50.198L100.721 51.1921ZM104.29 48.7157C104.011 48.8128 103.863 49.118 103.96 49.3974C104.057 49.6769 104.363 49.8246 104.642 49.7275L104.29 48.7157ZM108.635 48.4325C108.918 48.3469 109.079 48.048 108.993 47.7649C108.907 47.4817 108.608 47.3215 108.325 47.4071L108.635 48.4325ZM112.417 46.2551C112.131 46.33 111.959 46.6226 112.034 46.9088C112.109 47.195 112.402 47.3663 112.688 47.2915L112.417 46.2551ZM116.766 46.3026C117.055 46.238 117.237 45.9517 117.172 45.663C117.108 45.3743 116.821 45.1927 116.533 45.2572L116.766 46.3026ZM120.688 44.4038C120.397 44.4582 120.205 44.7381 120.26 45.0288C120.314 45.3196 120.594 45.5111 120.885 45.4567L120.688 44.4038ZM125.036 44.7539C125.328 44.7096 125.53 44.4366 125.485 44.1442C125.441 43.8517 125.168 43.6505 124.875 43.6948L125.036 44.7539ZM129.073 43.1342C128.779 43.1682 128.568 43.4339 128.602 43.7278C128.636 44.0216 128.902 44.2323 129.196 44.1983L129.073 43.1342ZM133.378 43.7897C133.673 43.7663 133.893 43.5082 133.87 43.2133C133.846 42.9184 133.588 42.6984 133.293 42.7219L133.378 43.7897ZM137.53 42.4627C137.234 42.4753 137.005 42.7251 137.018 43.0206C137.03 43.3162 137.28 43.5456 137.575 43.5329L137.53 42.4627ZM141.779 43.4332C142.075 43.4319 142.313 43.191 142.312 42.8952C142.311 42.5994 142.07 42.3607 141.774 42.362L141.779 43.4332ZM146.013 42.4255C145.718 42.4152 145.47 42.6465 145.459 42.9422C145.449 43.2378 145.68 43.4858 145.976 43.4961L146.013 42.4255ZM150.168 43.7275C150.463 43.7499 150.72 43.5289 150.743 43.2339C150.765 42.939 150.544 42.6817 150.249 42.6593L150.168 43.7275ZM154.474 43.0704C154.18 43.0354 153.914 43.2452 153.879 43.5389C153.844 43.8327 154.053 44.0991 154.347 44.1341L154.474 43.0704ZM158.504 44.7227C158.796 44.7707 159.071 44.573 159.119 44.2812C159.167 43.9893 158.97 43.7137 158.678 43.6657L158.504 44.7227ZM162.852 44.452C162.563 44.3904 162.278 44.5751 162.217 44.8644C162.155 45.1538 162.34 45.4382 162.629 45.4998L162.852 44.452ZM166.712 46.4714C166.998 46.5469 167.291 46.3762 167.367 46.0902C167.442 45.8042 167.272 45.5111 166.986 45.4357L166.712 46.4714ZM171.064 46.6216C170.783 46.5318 170.481 46.6876 170.392 46.9695C170.302 47.2513 170.458 47.5526 170.739 47.6423L171.064 46.6216ZM174.7 49.0166C174.977 49.1209 175.286 48.981 175.39 48.7041C175.494 48.4273 175.354 48.1184 175.077 48.0141L174.7 49.0166ZM179.012 49.6166C178.741 49.4977 178.425 49.6209 178.306 49.8918C178.188 50.1627 178.311 50.4786 178.582 50.5975L179.012 49.6166ZM182.372 52.3858C182.636 52.5193 182.958 52.4135 183.091 52.1496C183.225 51.8856 183.119 51.5634 182.855 51.4299L182.372 52.3858ZM186.593 53.4528C186.337 53.3048 186.009 53.3924 185.861 53.6486C185.713 53.9047 185.801 54.2323 186.057 54.3803L186.593 53.4528ZM189.625 56.5777C189.872 56.7399 190.204 56.6707 190.366 56.4233C190.528 56.1759 190.459 55.8439 190.212 55.6818L189.625 56.5777ZM193.7 58.1109C193.462 57.935 193.127 57.9854 192.951 58.2233C192.775 58.4611 192.825 58.7965 193.063 58.9723L193.7 58.1109ZM196.362 61.5563C196.589 61.7452 196.927 61.7137 197.116 61.486C197.305 61.2583 197.273 60.9207 197.046 60.7318L196.362 61.5563ZM200.24 63.5344C200.023 63.3333 199.684 63.3461 199.483 63.563C199.282 63.7799 199.295 64.1188 199.512 64.3199L200.24 63.5344ZM98.7893 51.9992C99.4069 51.7306 100.051 51.4612 100.721 51.1921L100.322 50.198C99.643 50.4708 98.9893 50.7441 98.3621 51.0168L98.7893 51.9992ZM104.642 49.7275C105.911 49.2866 107.244 48.8531 108.635 48.4325L108.325 47.4071C106.92 47.8318 105.573 48.2699 104.29 48.7157L104.642 49.7275ZM112.688 47.2915C114.008 46.9463 115.368 46.6154 116.766 46.3026L116.533 45.2572C115.122 45.5728 113.749 45.9067 112.417 46.2551L112.688 47.2915ZM120.885 45.4567C122.241 45.2027 123.626 44.9674 125.036 44.7539L124.875 43.6948C123.453 43.9102 122.056 44.1475 120.688 44.4038L120.885 45.4567ZM129.196 44.1983C130.571 44.0391 131.966 43.9021 133.378 43.7897L133.293 42.7219C131.868 42.8353 130.461 42.9736 129.073 43.1342L129.196 44.1983ZM137.575 43.5329C138.964 43.4737 140.366 43.4397 141.779 43.4332L141.774 42.362C140.347 42.3686 138.932 42.4029 137.53 42.4627L137.575 43.5329ZM145.976 43.4961C147.366 43.5444 148.764 43.6209 150.168 43.7275L150.249 42.6593C148.83 42.5516 147.418 42.4744 146.013 42.4255L145.976 43.4961ZM154.347 44.1341C155.73 44.2988 157.116 44.4943 158.504 44.7227L158.678 43.6657C157.274 43.4347 155.872 43.2369 154.474 43.0704L154.347 44.1341ZM162.629 45.4998C163.992 45.7896 165.353 46.1128 166.712 46.4714L166.986 45.4357C165.609 45.0725 164.231 44.7453 162.852 44.452L162.629 45.4998ZM170.739 47.6423C172.065 48.0641 173.385 48.5217 174.7 49.0166L175.077 48.0141C173.745 47.5125 172.407 47.0489 171.064 46.6216L170.739 47.6423ZM178.582 50.5975C179.853 51.1556 181.117 51.7511 182.372 52.3858L182.855 51.4299C181.583 50.7863 180.301 50.1824 179.012 49.6166L178.582 50.5975ZM186.057 54.3803C187.257 55.0738 188.447 55.8057 189.625 56.5777L190.212 55.6818C189.017 54.8987 187.81 54.1562 186.593 53.4528L186.057 54.3803ZM193.063 58.9723C194.176 59.7945 195.276 60.6554 196.362 61.5563L197.046 60.7318C195.944 59.8181 194.828 58.9449 193.7 58.1109L193.063 58.9723Z",
  fill: "#21846C"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("defs", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "paint0_linear_2828_1824",
  x1: "121.089",
  y1: "100.117",
  x2: "138.086",
  y2: "100.117",
  gradientUnits: "userSpaceOnUse"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  "stop-color": "#96BAE4"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  "stop-color": "#96CDFF"
}))));
const success = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "298",
  height: "225",
  viewBox: "0 0 298 225",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M118.078 14.8548C121.012 12.2541 124.218 7.9182 127.489 3.14382C125.356 2.84037 123.541 2.345 122.558 1.33692C120.28 6.33348 117.85 9.46138 114.216 13.4714C115.709 12.9691 116.674 14.3935 118.078 14.8548Z",
  fill: "#C6EAE9"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M239.854 137.892C242.498 135.548 245.381 131.643 248.329 127.347C246.408 127.073 244.774 126.626 243.888 125.719C241.835 130.217 239.649 133.036 236.375 136.649C237.722 136.191 238.59 137.473 239.854 137.892Z",
  fill: "#FBD682"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M242.198 86.0684C241.015 83.4095 238.82 80.3018 236.373 77.0873C235.913 78.7277 235.374 80.0923 234.64 80.7347C237.352 83.1986 238.92 85.5315 240.862 88.9332C240.753 87.6823 241.737 87.1125 242.198 86.0684Z",
  fill: "#FBD682"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M145.969 161.132C144.654 158.179 142.221 154.731 139.5 151.159C138.989 152.98 138.392 154.497 137.578 155.208C140.59 157.943 142.331 160.532 144.484 164.311C144.365 162.927 145.456 162.294 145.969 161.132Z",
  fill: "#EE6F57"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M72.8088 13.2362C71.4939 10.2832 69.057 6.83567 66.3396 3.26298C65.8287 5.08395 65.2317 6.6012 64.4172 7.31256C67.4294 10.0475 69.1701 12.6369 71.3238 16.4158C71.2044 15.0314 72.296 14.3987 72.8088 13.2362Z",
  fill: "#1DA857"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M212.227 173.45C213.368 170.773 215.515 167.632 217.912 164.38C218.397 166.013 218.957 167.369 219.701 168C217.028 170.505 215.496 172.862 213.606 176.294C213.696 175.044 212.704 174.49 212.227 173.45Z",
  fill: "#1DA857"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M197.462 53.3004C198.732 50.3274 201.112 46.8427 203.777 43.2285C204.316 45.0413 204.936 46.5492 205.762 47.2479C202.792 50.029 201.091 52.6449 198.996 56.4567C199.094 55.0706 197.993 54.4517 197.462 53.3004Z",
  fill: "#78847D"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M71.6057 53.3717C75.3116 54.2314 80.4828 54.5828 86.0226 54.8103C84.9768 53.3275 84.2675 51.9725 84.4366 50.9493C79.3217 51.4454 75.5205 51.1175 70.3369 50.3624C71.6101 51.1198 71.1128 52.2915 71.6057 53.3717Z",
  fill: "#F5C7BE"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M233.861 13.8549C230.541 15.1044 225.89 15.6807 220.905 16.0919C221.821 14.0318 222.434 12.151 222.264 10.7422C226.878 11.3371 230.294 10.8168 234.95 9.68445C233.819 10.7492 234.285 12.3577 233.861 13.8549Z",
  fill: "#C6EAE9"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M166.721 9.16442C170.484 11.3562 175.936 13.0255 181.812 14.5673C181.046 11.9176 180.608 9.54484 181.034 7.90467C175.441 7.64037 171.451 6.2952 166.082 3.96055C167.261 5.47029 166.452 7.29046 166.721 9.16442Z",
  fill: "#EE6F57"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M103.801 134.048C101.017 135.945 97.8379 139.315 94.5589 143.055C96.3799 143.575 97.9069 144.225 98.6662 145.216C101.104 141.163 103.499 138.746 107.023 135.712C105.68 135.968 104.977 134.616 103.801 134.048Z",
  fill: "#C6EAE9"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M193.89 140.735C191.106 142.633 187.926 146.003 184.647 149.743C186.468 150.263 187.995 150.913 188.755 151.904C191.193 147.85 193.587 145.434 197.111 142.4C195.768 142.656 195.065 141.307 193.89 140.735Z",
  fill: "#FBD682"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M259.203 26.6623C256.07 28.7986 252.49 32.5907 248.798 36.7999C250.847 37.3867 252.567 38.1189 253.42 39.2335C256.165 34.6713 258.862 31.9514 262.827 28.5352C261.319 28.8264 260.528 27.3043 259.203 26.6623Z",
  fill: "#F5C7BE"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M77.0257 104.663C74.6796 102.529 72.2466 98.7738 69.7917 94.612C71.6854 94.0787 73.3201 93.3983 74.2685 92.3287C75.8344 96.8141 77.6909 99.5114 80.5281 102.906C79.2647 102.599 78.2976 104.063 77.0257 104.663Z",
  fill: "#F5C7BE"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M294.971 70.2391C293.789 67.5801 291.594 64.4724 289.146 61.2579C288.687 62.8984 288.147 64.263 287.413 64.9054C290.125 67.3693 291.693 69.7022 293.636 73.1038C293.527 71.8561 294.51 71.2863 294.971 70.2391Z",
  fill: "#EE6F57"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M0.412196 55.6634C1.41091 59.5009 3.64634 64.2079 6.19404 69.1331C7.15051 67.0974 8.15032 65.4466 9.25421 64.8045C6.19804 60.8027 4.62409 57.2895 2.78067 52.2626C2.66313 53.9346 1.24426 54.4114 0.412196 55.6634Z",
  fill: "#78847D"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M295.83 18.6921C295.144 21.5146 293.558 24.9869 291.748 28.6194C291.025 27.1403 290.273 25.941 289.456 25.4845C291.648 22.52 292.761 19.9271 294.053 16.2272C294.159 17.4502 295.205 17.7869 295.83 18.6921Z",
  fill: "#78847D"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M25.998 20.2943C29.1636 22.382 32.8017 26.1184 36.5579 30.2701C34.5189 30.8884 32.8102 31.6471 31.971 32.7748C29.1562 28.2555 26.4177 25.5775 22.4006 22.223C23.9153 22.4877 24.6831 20.9567 25.998 20.2943Z",
  fill: "#FBD682"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M145.56 32.9961C148.725 35.0838 152.363 38.8202 156.119 42.9719C154.08 43.5902 152.372 44.3488 151.532 45.4766C148.718 40.9573 145.979 38.2793 141.962 34.9248C143.477 35.1895 144.245 33.6585 145.56 32.9961Z",
  fill: "#FBD682"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M278.859 120.269H191.615C188.073 120.269 185.202 123.141 185.202 126.682V209C185.202 212.542 188.073 215.413 191.615 215.413H278.859C282.401 215.413 285.272 212.542 285.272 209V126.682C285.272 123.141 282.401 120.269 278.859 120.269Z",
  fill: "#EDF0F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M233.941 193.865C248.23 193.865 259.814 182.282 259.814 167.992C259.814 153.703 248.23 142.119 233.941 142.119C219.652 142.119 208.068 153.703 208.068 167.992C208.068 182.282 219.652 193.865 233.941 193.865Z",
  fill: "white"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M243.921 181.742H224.792C223.573 181.742 222.585 180.754 222.585 179.535V153.049C222.585 151.83 223.573 150.842 224.792 150.842H238.771L246.128 158.199V179.535C246.128 180.754 245.14 181.742 243.921 181.742Z",
  fill: "#43A047"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M246.128 158.198H238.771V150.841L246.128 158.198Z",
  fill: "#C8E6C9"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M238.771 158.2L246.128 165.557V158.2H238.771Z",
  fill: "#2E7D32"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M239.506 165.555H229.206H227.734V167.026V168.498V169.969V171.44V172.912V174.383V175.855H240.977V174.383V172.912V171.44V169.969V168.498V167.026V165.555H239.506ZM229.206 167.026H232.149V168.498H229.206V167.026ZM229.206 169.969H232.149V171.44H229.206V169.969ZM229.206 172.912H232.149V174.383H229.206V172.912ZM239.506 174.383H233.62V172.912H239.506V174.383ZM239.506 171.44H233.62V169.969H239.506V171.44ZM239.506 168.498H233.62V167.026H239.506V168.498Z",
  fill: "#E8F5E9"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M217.245 129.007H191.787V135.022H217.245V129.007Z",
  fill: "white"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M217.245 138.445H191.787V144.459H217.245V138.445Z",
  fill: "white"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M5.14692 68.0372C5.14064 63.9999 8.42587 60.7312 12.4631 60.7578L191.704 61.9387C195.7 61.9651 198.925 65.2114 198.925 69.2069V215.804C198.925 219.808 195.686 223.058 191.682 223.072L12.6716 223.702C8.65189 223.716 5.38401 220.465 5.37776 216.445L5.14692 68.0372Z",
  fill: "white",
  stroke: "#E2E5F1",
  "stroke-width": "1.49673"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M22.75 132.663V145.49L56.4199 144.946V132.663H22.75Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M64.436 132.663V145.49L128.569 144.946V132.663H64.436Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M134.982 132.664V145.491L187.892 144.947V132.664H134.982Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
  opacity: "0.6"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.3",
  d: "M22.7483 151.904V163.127L56.4182 162.652V151.904H22.7483Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M22.748 169.541V180.765L56.418 180.289V169.541H22.748Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.3",
  d: "M22.748 187.177V198.4L56.418 197.925V187.177H22.748Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M22.748 204.814V216.038L56.418 215.562V204.814H22.748Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.3",
  d: "M64.4348 151.904V163.127L128.568 162.652V151.904H64.4348Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M64.4348 169.541V180.765L128.568 180.289V169.541H64.4348Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.3",
  d: "M64.4348 187.177V198.4L128.568 197.925V187.177H64.4348Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M64.4348 204.814V216.038L128.568 215.562V204.814H64.4348Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.3",
  d: "M134.982 151.904V163.127L187.892 162.652V151.904H134.982Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M134.982 169.541V180.765L187.892 180.289V169.541H134.982Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.3",
  d: "M134.982 187.177V198.4L187.892 197.925V187.177H134.982Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M134.982 204.814V216.038L187.892 215.562V204.814H134.982Z",
  fill: "#BAC6F2"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M135.195 102.21C138.737 102.21 141.608 99.3382 141.608 95.7963C141.608 92.2543 138.737 89.3829 135.195 89.3829C131.653 89.3829 128.781 92.2543 128.781 95.7963C128.781 99.3382 131.653 102.21 135.195 102.21Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M152.831 102.21C156.373 102.21 159.244 99.3382 159.244 95.7963C159.244 92.2543 156.373 89.3829 152.831 89.3829C149.289 89.3829 146.418 92.2543 146.418 95.7963C146.418 99.3382 149.289 102.21 152.831 102.21Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M170.468 102.21C174.01 102.21 176.881 99.3382 176.881 95.7963C176.881 92.2543 174.01 89.3829 170.468 89.3829C166.926 89.3829 164.054 92.2543 164.054 95.7963C164.054 99.3382 166.926 102.21 170.468 102.21Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M100.072 71.9945H23.1118V118.491H100.072V71.9945Z",
  fill: "#E9EDFA"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M26.3181 107.595C26.3181 107.595 31.5549 96.1363 36.5325 97.3807C41.5101 98.625 42.7545 103.862 46.4877 101.632C50.2208 99.4028 52.6578 90.3809 56.2873 88.9291C61.4722 86.907 63.1833 89.1365 70.183 93.129C77.1827 97.1214 80.1382 96.24 82.9899 93.2845C85.6342 90.5883 90.5081 83.2775 95.9005 80.011",
  stroke: "#BAC6F2",
  "stroke-width": "1.55549",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
  cx: "243.761",
  cy: "79.7709",
  r: "28.0133",
  fill: "#74D27D"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M254.064 71.0045C254.212 70.8531 254.389 70.7327 254.585 70.6506C254.78 70.5684 254.99 70.5261 255.202 70.5261C255.414 70.5261 255.624 70.5684 255.82 70.6506C256.016 70.7327 256.193 70.8531 256.341 71.0045C256.963 71.6332 256.972 72.6491 256.363 73.2886L243.5 88.4938C243.354 88.6541 243.177 88.783 242.98 88.8725C242.782 88.9621 242.568 89.0103 242.352 89.0144C242.135 89.0185 241.919 88.9783 241.718 88.8962C241.518 88.8142 241.336 88.692 241.184 88.5373L233.357 80.6062C233.055 80.2984 232.886 79.8845 232.886 79.4533C232.886 79.0222 233.055 78.6083 233.357 78.3004C233.506 78.1489 233.683 78.0286 233.878 77.9465C234.074 77.8643 234.284 77.822 234.496 77.822C234.708 77.822 234.918 77.8643 235.114 77.9465C235.309 78.0286 235.486 78.1489 235.635 78.3004L242.274 85.0286L254.02 71.0524C254.034 71.0356 254.048 71.0196 254.064 71.0045Z",
  fill: "white"
}));
const lockWhite = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "19",
  height: "25",
  viewBox: "0 0 19 25",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M17.3714 9.5H14.9286V6.24286C14.9286 2.31121 13.1168 0 9.5 0C5.88186 0 4.07143 2.31121 4.07143 6.24286V6.78571H6.78571V5.69864C6.78571 3.73757 7.86736 2.71429 9.5 2.71429C11.1326 2.71429 12.2143 3.73757 12.2143 5.69864V9.5H1.35714C0.606643 9.5 0 10.3767 0 11.1272V21.7143C0 22.4594 0.580857 23.2601 1.29064 23.4881L2.91514 24.0133C3.77679 24.2645 4.66711 24.404 5.56429 24.4286H13.4357C14.3326 24.4042 15.2225 24.2642 16.0835 24.0119L17.7066 23.4867C18.4178 23.2601 19 22.4594 19 21.7143V11.1272C19 10.3767 18.1206 9.5 17.3714 9.5Z",
  fill: "white"
}));
const promoThumbnail = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "359",
  height: "224",
  viewBox: "0 0 359 224",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("mask", {
  id: "mask0_2907_1029",
  maskUnits: "userSpaceOnUse",
  x: "0",
  y: "0",
  width: "359",
  height: "224"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  width: "359",
  height: "224",
  fill: "#D9D9D9"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
  mask: "url(#mask0_2907_1029)"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M38.0904 121.877C33.74 112.461 32.4901 101.461 34.6293 91.0556C40.7102 61.563 52.1174 24.0452 103.467 17.1121C159.138 3.21572 191.687 9.1742 207.373 6.50449C220.829 3.69282 273.176 11.9001 292.789 49.808C301.297 62.9001 317.911 62.9634 314.737 124.535C317.911 157.244 326.114 173.689 326.955 195.066C328.319 238.333 298.365 234.187 265.388 234.838C232.412 235.488 37.1595 233.972 37.1595 233.972C37.1595 233.972 17.0114 174.754 36.48 156.968C48.5217 145.941 43.1138 132.764 38.0904 121.877Z",
  fill: "#F4F7FA"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.2",
  d: "M48 194.905L48.5033 206.536L304.698 207.563L305 194.562L48 194.905Z",
  fill: "#3EA9CE"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M14 188.562L339 189.229V195.562L14.5682 195.229L14 188.562Z",
  fill: "#6CC9E9"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M107.418 173.903H181.379C181.379 173.903 184.147 173.757 184.147 170.552V164.19H104.504V171.912C104.892 173.126 106.058 173.952 107.418 173.903Z",
  fill: "#56B0E2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M104.504 116.113L104.455 166.619L184.147 165.89V114.656C184.147 114.656 184.633 111.742 181.525 111.742H107.515C107.515 111.742 104.164 111.742 104.504 116.113Z",
  fill: "#4F75CD"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M138.013 187.452V173.417L149.668 173.903V186.238L138.013 187.452Z",
  fill: "#517CD0"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M119.51 186.043H167.927L167.976 188.471H119.51V186.043Z",
  fill: "#4F75CD"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M143.597 167.639C144.908 167.639 145.928 168.658 145.928 169.97C145.928 171.281 144.908 172.301 143.597 172.301C142.285 172.301 141.266 171.281 141.266 169.97C141.266 168.658 142.334 167.639 143.597 167.639Z",
  fill: "white"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M181.719 114.17H106.932V163.219H181.719V114.17Z",
  fill: "#F8F8FF"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M110.671 116.695C111.303 116.695 111.837 117.23 111.837 117.861C111.837 118.492 111.303 119.026 110.671 119.026C110.04 119.026 109.506 118.492 109.506 117.861C109.506 117.23 110.04 116.695 110.671 116.695Z",
  fill: "#FA5F5D"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M114.654 116.695C115.285 116.695 115.819 117.23 115.819 117.861C115.819 118.492 115.285 119.026 114.654 119.026C114.022 119.026 113.488 118.492 113.488 117.861C113.488 117.23 114.022 116.695 114.654 116.695Z",
  fill: "#FDBC4E"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M118.83 116.695C119.461 116.695 119.995 117.23 119.995 117.861C119.995 118.492 119.461 119.026 118.83 119.026C118.198 119.026 117.664 118.492 117.664 117.861C117.664 117.23 118.198 116.695 118.83 116.695Z",
  fill: "#37CD58"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M135.099 125.242C135.05 125.873 134.516 126.359 133.885 126.311H119.558C118.83 126.311 118.102 125.825 118.102 125.242V123.057C118.102 122.474 118.781 121.94 119.558 121.94H133.836C134.467 121.891 135.05 122.377 135.099 123.008V123.057V125.242Z",
  fill: "url(#paint0_linear_2907_1029)"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M169.236 139.906C169.187 140.586 168.604 141.12 167.925 141.071H119.216C118.487 141.071 117.759 140.537 117.759 139.906V129.125C117.759 128.493 118.487 127.959 119.216 127.959H167.925C168.604 127.911 169.187 128.445 169.236 129.125V139.906Z",
  fill: "#DFE4F7"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M134.127 148.941C134.127 149.573 133.593 150.107 132.962 150.107H119.558C118.781 150.107 118.102 149.573 118.102 148.941V143.017C118.102 142.385 118.83 141.851 119.558 141.851H132.865C133.496 141.802 134.079 142.288 134.127 142.968V143.017V148.941Z",
  fill: "#DFE4F7"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M151.61 148.941C151.61 149.573 151.076 150.107 150.444 150.107H137.041C136.264 150.107 135.584 149.573 135.584 148.941V143.017C135.584 142.385 136.312 141.851 137.041 141.851H150.347C150.979 141.802 151.561 142.288 151.61 142.968V143.017V148.941Z",
  fill: "#DFE4F7"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M169.579 148.941C169.53 149.621 168.947 150.155 168.267 150.107H154.961C154.342 150.148 153.828 149.768 153.628 149.236C153.557 149.046 153.553 148.839 153.553 148.637V143.017C153.601 142.288 154.233 141.802 154.961 141.851H168.267C168.947 141.802 169.579 142.337 169.627 143.017L169.579 148.941Z",
  fill: "#DFE4F7"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M151.61 152.292C151.513 152.535 151.318 152.68 151.076 152.729C151.027 152.729 151.027 152.729 150.979 152.535H136.312C136.021 152.729 135.584 152.535 135.584 152.292V152.098C135.584 151.855 136.021 151.612 136.312 151.563H150.979C151.221 151.612 151.367 151.806 151.416 152.001C151.416 152.049 151.416 152.049 151.561 152.098L151.61 152.292Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M151.61 154.186C151.513 154.429 151.318 154.623 151.076 154.671C151.076 154.671 151.027 154.671 151.027 154.477H136.312C136.021 154.671 135.584 154.477 135.584 154.186V153.991C135.584 153.749 136.021 153.554 136.312 153.506H150.979C151.221 153.554 151.464 153.749 151.561 153.991L151.61 154.186Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M151.61 156.129C151.513 156.42 151.27 156.615 151.027 156.663C151.027 156.566 151.027 156.518 151.027 156.42H136.312C136.07 156.566 135.778 156.518 135.633 156.275C135.584 156.226 135.584 156.178 135.584 156.129V155.935C135.584 155.692 136.021 155.546 136.312 155.449H150.979C151.221 155.498 151.464 155.692 151.561 155.935L151.61 156.129Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M151.61 158.023C151.464 158.314 151.27 158.605 151.027 158.848H136.312C136.021 158.605 135.584 158.314 135.584 158.023V157.828C135.584 157.585 136.021 157.294 136.312 157.391H150.979C151.173 157.343 151.367 157.488 151.416 157.683C151.416 157.731 151.416 157.78 151.416 157.828C151.416 157.828 151.416 157.828 151.561 157.877L151.61 158.023Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M143.451 159.965C143.451 160.208 143.306 160.305 143.014 160.305H136.264C135.972 160.305 135.584 160.208 135.584 159.965V159.771C135.584 159.528 135.972 159.334 136.264 159.334H143.014C143.257 159.334 143.451 159.528 143.451 159.771V159.965Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M169.578 152.292C169.287 152.535 169.336 152.729 169.044 152.535H154.378C154.135 152.729 153.893 152.583 153.893 152.34C153.893 152.34 153.893 152.34 154.038 152.292V152.098C153.893 151.855 154.087 151.612 154.378 151.563H169.044C169.336 151.661 169.287 151.855 169.578 152.098V152.292Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M169.578 154.186C169.287 154.429 169.335 154.671 169.044 154.477H154.378C154.086 154.671 153.892 154.477 154.038 154.186V153.991C153.892 153.749 154.086 153.554 154.378 153.506H169.044C169.335 153.603 169.287 153.749 169.578 153.991V154.186Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M169.578 156.129C169.287 156.372 169.335 156.663 169.044 156.42H154.378C154.086 156.615 153.892 156.42 154.038 156.129V155.935C153.892 155.692 154.086 155.546 154.378 155.449H169.044C169.335 155.546 169.287 155.692 169.578 155.935V156.129Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M169.578 158.023C169.287 158.265 169.335 158.605 169.044 158.848H154.378C154.086 158.557 153.892 158.314 154.038 158.023V157.828C153.941 157.731 153.941 157.537 154.038 157.44C154.135 157.391 154.232 157.343 154.329 157.391H169.044C169.335 157.294 169.287 157.585 169.578 157.828V158.023Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M161.517 159.965C161.517 160.208 161.517 160.305 161.274 160.305H154.475C154.184 160.305 154.038 160.208 154.038 159.965V159.771C154.038 159.528 154.232 159.334 154.475 159.334H161.225C161.517 159.334 161.468 159.528 161.468 159.771L161.517 159.965Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M133.642 152.292C133.836 152.535 133.739 152.729 133.448 152.535H118.733C118.539 152.68 118.296 152.632 118.199 152.486C118.15 152.438 118.15 152.389 118.102 152.292V152.098C118.199 151.806 118.441 151.612 118.733 151.563H133.399C133.69 151.661 133.787 151.855 133.593 152.098L133.642 152.292Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M133.642 154.186C133.836 154.429 133.739 154.671 133.448 154.477H118.733C118.441 154.72 118.199 154.477 118.102 154.186V153.991C118.15 153.749 118.441 153.554 118.733 153.506H133.399C133.69 153.603 133.787 153.749 133.593 153.991L133.642 154.186Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M133.642 156.129C133.836 156.372 133.739 156.663 133.448 156.42H118.733C118.441 156.663 118.199 156.42 118.102 156.129V155.935C118.15 155.692 118.441 155.546 118.733 155.449H133.399C133.69 155.546 133.787 155.692 133.593 155.935L133.642 156.129Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M129.271 157.391H133.448C133.739 157.294 133.836 157.585 133.642 157.828V158.023C133.836 158.265 133.739 158.605 133.448 158.848H118.733C118.441 158.654 118.247 158.362 118.102 158.023V157.828C118.15 157.537 118.441 157.343 118.733 157.391H129.271Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M126.357 159.965C126.357 160.208 126.212 160.305 125.92 160.305H118.636C118.344 160.305 118.102 160.208 118.102 159.965V159.771C118.15 159.528 118.393 159.334 118.636 159.334H125.92C126.163 159.334 126.357 159.528 126.357 159.722C126.357 159.722 126.357 159.722 126.357 159.771V159.965Z",
  fill: "#E9EDFB"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M206.734 68.7204C206.73 66.023 208.925 63.8391 211.622 63.8569L331.377 64.6459C334.047 64.6635 336.202 66.8324 336.202 69.5019V167.447C336.202 170.122 334.038 172.294 331.362 172.303L211.761 172.724C209.076 172.733 206.892 170.561 206.888 167.875L206.734 68.7204Z",
  fill: "white",
  stroke: "#E2E5F1"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M218.494 111.898V120.468L240.99 120.105V111.898H218.494Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M246.347 111.898V120.468L289.196 120.105V111.898H246.347Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M293.48 111.898V120.468L328.831 120.105V111.898H293.48Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
  opacity: "0.6"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.3",
  d: "M218.494 124.753V132.251L240.99 131.934V124.753H218.494Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M218.494 136.536V144.035L240.99 143.717V136.536H218.494Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.3",
  d: "M218.494 148.319V155.818L240.99 155.5V148.319H218.494Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M218.494 160.104V167.602L240.99 167.284V160.104H218.494Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.3",
  d: "M246.346 124.753V132.251L289.195 131.934V124.753H246.346Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M246.346 136.536V144.035L289.195 143.717V136.536H246.346Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.3",
  d: "M246.346 148.319V155.818L289.195 155.5V148.319H246.346Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M246.346 160.104V167.602L289.195 167.284V160.104H246.346Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.3",
  d: "M293.479 124.753V132.251L328.83 131.934V124.753H293.479Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M293.479 136.536V144.035L328.83 143.717V136.536H293.479Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.3",
  d: "M293.479 148.319V155.818L328.83 155.5V148.319H293.479Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  opacity: "0.8",
  d: "M293.479 160.104V167.602L328.83 167.284V160.104H293.479Z",
  fill: "#BAC6F2"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M293.622 91.5512C295.988 91.5512 297.907 89.6328 297.907 87.2663C297.907 84.8999 295.988 82.9814 293.622 82.9814C291.255 82.9814 289.337 84.8999 289.337 87.2663C289.337 89.6328 291.255 91.5512 293.622 91.5512Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M305.405 91.5512C307.771 91.5512 309.69 89.6328 309.69 87.2663C309.69 84.8999 307.771 82.9814 305.405 82.9814C303.039 82.9814 301.12 84.8999 301.12 87.2663C301.12 89.6328 303.039 91.5512 305.405 91.5512Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M317.188 91.5512C319.555 91.5512 321.473 89.6328 321.473 87.2663C321.473 84.8999 319.555 82.9814 317.188 82.9814C314.822 82.9814 312.903 84.8999 312.903 87.2663C312.903 89.6328 314.822 91.5512 317.188 91.5512Z",
  fill: "#BAC6F2"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M270.155 71.3643H218.736V102.43H270.155V71.3643Z",
  fill: "#E9EDFA"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M220.879 95.1493C220.879 95.1493 224.378 87.4934 227.703 88.3248C231.029 89.1562 231.86 92.6551 234.355 91.1654C236.849 89.6758 238.477 83.6481 240.902 82.6781C244.366 81.3271 245.509 82.8167 250.186 85.4842C254.863 88.1516 256.837 87.5627 258.743 85.5881C260.509 83.7867 263.766 78.9022 267.368 76.7197",
  stroke: "#BAC6F2",
  "stroke-width": "1.03926",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M81.0225 67.9668H22.7331C20.3667 67.9668 18.4482 69.8852 18.4482 72.2517V127.25C18.4482 129.617 20.3667 131.535 22.7331 131.535H81.0225C83.3889 131.535 85.3074 129.617 85.3074 127.25V72.2517C85.3074 69.8852 83.3889 67.9668 81.0225 67.9668Z",
  fill: "#0CB352"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M51.012 123.741C60.559 123.741 68.2983 116.001 68.2983 106.454C68.2983 96.9073 60.559 89.168 51.012 89.168C41.465 89.168 33.7256 96.9073 33.7256 106.454C33.7256 116.001 41.465 123.741 51.012 123.741Z",
  fill: "white"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M57.6799 115.64H44.8995C44.085 115.64 43.4248 114.98 43.4248 114.166V96.4698C43.4248 95.6553 44.085 94.9951 44.8995 94.9951H54.239L59.1546 99.9107V114.166C59.1546 114.98 58.4944 115.64 57.6799 115.64Z",
  fill: "#43A047"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M59.1548 99.9107H54.2393V94.9951L59.1548 99.9107Z",
  fill: "#C8E6C9"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M54.2393 99.9111L59.1548 104.827V99.9111H54.2393Z",
  fill: "#2E7D32"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M54.7301 104.825H47.8483H46.8652V105.808V106.791V107.775V108.758V109.741V110.724V111.707H55.7132V110.724V109.741V108.758V107.775V106.791V105.808V104.825H54.7301ZM47.8483 105.808H49.8146V106.791H47.8483V105.808ZM47.8483 107.775H49.8146V108.758H47.8483V107.775ZM47.8483 109.741H49.8146V110.724H47.8483V109.741ZM54.7301 110.724H50.7977V109.741H54.7301V110.724ZM54.7301 108.758H50.7977V107.775H54.7301V108.758ZM54.7301 106.791H50.7977V105.808H54.7301V106.791Z",
  fill: "#E8F5E9"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M39.8569 73.4746H22.8477V77.4931H39.8569V73.4746Z",
  fill: "white"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M39.8569 79.7803H22.8477V83.7987H39.8569V79.7803Z",
  fill: "white"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M198.413 89.3921L196.67 83.4583L192.403 87.9353L198.413 89.3921ZM97.7216 75.1921C97.9961 75.0818 98.1293 74.7699 98.019 74.4954C97.9087 74.2209 97.5968 74.0878 97.3223 74.198L97.7216 75.1921ZM101.291 72.7157C101.011 72.8128 100.864 73.118 100.961 73.3974C101.058 73.6769 101.363 73.8246 101.642 73.7275L101.291 72.7157ZM105.636 72.4325C105.919 72.3469 106.079 72.048 105.993 71.7649C105.908 71.4817 105.609 71.3215 105.326 71.4071L105.636 72.4325ZM109.417 70.2551C109.131 70.33 108.96 70.6226 109.035 70.9088C109.11 71.195 109.402 71.3663 109.688 71.2915L109.417 70.2551ZM113.767 70.3026C114.056 70.238 114.237 69.9517 114.173 69.663C114.108 69.3743 113.822 69.1927 113.533 69.2572L113.767 70.3026ZM117.688 68.4038C117.397 68.4582 117.206 68.7381 117.26 69.0288C117.315 69.3196 117.595 69.5111 117.885 69.4567L117.688 68.4038ZM122.036 68.7539C122.329 68.7096 122.53 68.4366 122.486 68.1442C122.441 67.8517 122.168 67.6505 121.876 67.6948L122.036 68.7539ZM126.073 67.1342C125.779 67.1682 125.569 67.4339 125.603 67.7278C125.637 68.0216 125.903 68.2323 126.196 68.1983L126.073 67.1342ZM130.379 67.7897C130.674 67.7663 130.894 67.5082 130.87 67.2133C130.847 66.9184 130.589 66.6984 130.294 66.7219L130.379 67.7897ZM134.53 66.4627C134.235 66.4753 134.005 66.7251 134.018 67.0206C134.031 67.3162 134.28 67.5456 134.576 67.5329L134.53 66.4627ZM138.779 67.4332C139.075 67.4319 139.314 67.191 139.312 66.8952C139.311 66.5994 139.07 66.3607 138.774 66.362L138.779 67.4332ZM143.014 66.4255C142.718 66.4152 142.47 66.6465 142.46 66.9422C142.449 67.2378 142.681 67.4858 142.976 67.4961L143.014 66.4255ZM147.169 67.7275C147.464 67.7499 147.721 67.5289 147.743 67.2339C147.766 66.939 147.545 66.6817 147.25 66.6593L147.169 67.7275ZM151.474 67.0704C151.181 67.0354 150.914 67.2452 150.879 67.5389C150.844 67.8327 151.054 68.0991 151.348 68.1341L151.474 67.0704ZM155.504 68.7227C155.796 68.7707 156.072 68.573 156.12 68.2812C156.168 67.9893 155.97 67.7137 155.678 67.6657L155.504 68.7227ZM159.853 68.452C159.563 68.3904 159.279 68.5751 159.217 68.8644C159.156 69.1538 159.34 69.4382 159.63 69.4998L159.853 68.452ZM163.713 70.4714C163.999 70.5469 164.292 70.3762 164.367 70.0902C164.443 69.8042 164.272 69.5111 163.986 69.4357L163.713 70.4714ZM168.065 70.6216C167.783 70.5318 167.482 70.6876 167.392 70.9695C167.302 71.2513 167.458 71.5526 167.74 71.6423L168.065 70.6216ZM171.7 73.0166C171.977 73.1209 172.286 72.981 172.39 72.7041C172.495 72.4273 172.355 72.1184 172.078 72.0141L171.7 73.0166ZM176.013 73.6166C175.742 73.4977 175.426 73.6209 175.307 73.8918C175.188 74.1627 175.311 74.4786 175.582 74.5975L176.013 73.6166ZM179.372 76.3858C179.636 76.5193 179.958 76.4135 180.092 76.1496C180.225 75.8856 180.12 75.5634 179.856 75.4299L179.372 76.3858ZM183.593 77.4528C183.337 77.3048 183.01 77.3924 182.862 77.6486C182.714 77.9047 182.801 78.2323 183.057 78.3803L183.593 77.4528ZM186.625 80.5777C186.873 80.7399 187.205 80.6707 187.367 80.4233C187.529 80.1759 187.46 79.8439 187.212 79.6818L186.625 80.5777ZM190.7 82.1109C190.462 81.935 190.127 81.9854 189.951 82.2233C189.775 82.4611 189.826 82.7965 190.064 82.9723L190.7 82.1109ZM193.362 85.5563C193.59 85.7452 193.928 85.7137 194.116 85.486C194.305 85.2583 194.274 84.9207 194.046 84.7318L193.362 85.5563ZM197.241 87.5344C197.024 87.3333 196.685 87.3461 196.484 87.563C196.282 87.7799 196.295 88.1188 196.512 88.3199L197.241 87.5344ZM95.7898 75.9992C96.4074 75.7306 97.0518 75.4612 97.7216 75.1921L97.3223 74.198C96.6435 74.4708 95.9898 74.7441 95.3626 75.0168L95.7898 75.9992ZM101.642 73.7275C102.911 73.2866 104.244 72.8531 105.636 72.4325L105.326 71.4071C103.92 71.8318 102.573 72.2699 101.291 72.7157L101.642 73.7275ZM109.688 71.2915C111.008 70.9463 112.369 70.6154 113.767 70.3026L113.533 69.2572C112.123 69.5728 110.749 69.9067 109.417 70.2551L109.688 71.2915ZM117.885 69.4567C119.242 69.2027 120.626 68.9674 122.036 68.7539L121.876 67.6948C120.454 67.9102 119.057 68.1475 117.688 68.4038L117.885 69.4567ZM126.196 68.1983C127.572 68.0391 128.967 67.9021 130.379 67.7897L130.294 66.7219C128.869 66.8353 127.461 66.9736 126.073 67.1342L126.196 68.1983ZM134.576 67.5329C135.965 67.4737 137.367 67.4397 138.779 67.4332L138.774 66.362C137.348 66.3686 135.932 66.4029 134.53 66.4627L134.576 67.5329ZM142.976 67.4961C144.367 67.5444 145.765 67.6209 147.169 67.7275L147.25 66.6593C145.831 66.5516 144.418 66.4744 143.014 66.4255L142.976 67.4961ZM151.348 68.1341C152.731 68.2988 154.117 68.4943 155.504 68.7227L155.678 67.6657C154.275 67.4347 152.873 67.2369 151.474 67.0704L151.348 68.1341ZM159.63 69.4998C160.992 69.7896 162.354 70.1128 163.713 70.4714L163.986 69.4357C162.61 69.0725 161.231 68.7453 159.853 68.452L159.63 69.4998ZM167.74 71.6423C169.065 72.0641 170.386 72.5217 171.7 73.0166L172.078 72.0141C170.746 71.5125 169.407 71.0489 168.065 70.6216L167.74 71.6423ZM175.582 74.5975C176.854 75.1556 178.118 75.7511 179.372 76.3858L179.856 75.4299C178.583 74.7863 177.302 74.1824 176.013 73.6166L175.582 74.5975ZM183.057 78.3803C184.258 79.0738 185.447 79.8057 186.625 80.5777L187.212 79.6818C186.018 78.8987 184.811 78.1562 183.593 77.4528L183.057 78.3803ZM190.064 82.9723C191.176 83.7945 192.276 84.6554 193.362 85.5563L194.046 84.7318C192.945 83.8181 191.829 82.9449 190.7 82.1109L190.064 82.9723Z",
  fill: "#21846C"
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("defs", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "paint0_linear_2907_1029",
  x1: "118.09",
  y1: "124.117",
  x2: "135.087",
  y2: "124.117",
  gradientUnits: "userSpaceOnUse"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  "stop-color": "#96BAE4"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  "stop-color": "#96CDFF"
}))));

/***/ }),

/***/ "./node_modules/clsx/dist/clsx.m.js":
/*!******************************************!*\
  !*** ./node_modules/clsx/dist/clsx.m.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clsx: function() { return /* binding */ clsx; }
/* harmony export */ });
function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(Array.isArray(e))for(t=0;t<e.length;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f);else for(t in e)e[t]&&(n&&(n+=" "),n+=t);return n}function clsx(){for(var e,t,f=0,n="";f<arguments.length;)(e=arguments[f++])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}/* harmony default export */ __webpack_exports__["default"] = (clsx);

/***/ }),

/***/ "./node_modules/react-toastify/dist/ReactToastify.css":
/*!************************************************************!*\
  !*** ./node_modules/react-toastify/dist/ReactToastify.css ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/core/_card.scss":
/*!*****************************!*\
  !*** ./src/core/_card.scss ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/core/_column.scss":
/*!*******************************!*\
  !*** ./src/core/_column.scss ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/core/_container.scss":
/*!**********************************!*\
  !*** ./src/core/_container.scss ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/core/_modal.scss":
/*!******************************!*\
  !*** ./src/core/_modal.scss ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/core/_row.scss":
/*!****************************!*\
  !*** ./src/core/_row.scss ***!
  \****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/core/_title.scss":
/*!******************************!*\
  !*** ./src/core/_title.scss ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/styles/_createForm.scss":
/*!*************************************!*\
  !*** ./src/styles/_createForm.scss ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/styles/_dashboard.scss":
/*!************************************!*\
  !*** ./src/styles/_dashboard.scss ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/styles/_table_item.scss":
/*!*************************************!*\
  !*** ./src/styles/_table_item.scss ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/styles/main.scss":
/*!******************************!*\
  !*** ./src/styles/main.scss ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/react-router-dom/dist/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/react-router-dom/dist/index.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbortedDeferredError: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.AbortedDeferredError; },
/* harmony export */   Await: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.Await; },
/* harmony export */   BrowserRouter: function() { return /* binding */ BrowserRouter; },
/* harmony export */   Form: function() { return /* binding */ Form; },
/* harmony export */   HashRouter: function() { return /* binding */ HashRouter; },
/* harmony export */   Link: function() { return /* binding */ Link; },
/* harmony export */   MemoryRouter: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.MemoryRouter; },
/* harmony export */   NavLink: function() { return /* binding */ NavLink; },
/* harmony export */   Navigate: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.Navigate; },
/* harmony export */   NavigationType: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.Action; },
/* harmony export */   Outlet: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.Outlet; },
/* harmony export */   Route: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.Route; },
/* harmony export */   Router: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.Router; },
/* harmony export */   RouterProvider: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.RouterProvider; },
/* harmony export */   Routes: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.Routes; },
/* harmony export */   ScrollRestoration: function() { return /* binding */ ScrollRestoration; },
/* harmony export */   UNSAFE_DataRouterContext: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_DataRouterContext; },
/* harmony export */   UNSAFE_DataRouterStateContext: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_DataRouterStateContext; },
/* harmony export */   UNSAFE_LocationContext: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_LocationContext; },
/* harmony export */   UNSAFE_NavigationContext: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_NavigationContext; },
/* harmony export */   UNSAFE_RouteContext: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_RouteContext; },
/* harmony export */   UNSAFE_useRouteId: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_useRouteId; },
/* harmony export */   UNSAFE_useScrollRestoration: function() { return /* binding */ useScrollRestoration; },
/* harmony export */   createBrowserRouter: function() { return /* binding */ createBrowserRouter; },
/* harmony export */   createHashRouter: function() { return /* binding */ createHashRouter; },
/* harmony export */   createMemoryRouter: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.createMemoryRouter; },
/* harmony export */   createPath: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.createPath; },
/* harmony export */   createRoutesFromChildren: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.createRoutesFromChildren; },
/* harmony export */   createRoutesFromElements: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.createRoutesFromElements; },
/* harmony export */   createSearchParams: function() { return /* binding */ createSearchParams; },
/* harmony export */   defer: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.defer; },
/* harmony export */   generatePath: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.generatePath; },
/* harmony export */   isRouteErrorResponse: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.isRouteErrorResponse; },
/* harmony export */   json: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.json; },
/* harmony export */   matchPath: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.matchPath; },
/* harmony export */   matchRoutes: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.matchRoutes; },
/* harmony export */   parsePath: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.parsePath; },
/* harmony export */   redirect: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.redirect; },
/* harmony export */   redirectDocument: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.redirectDocument; },
/* harmony export */   renderMatches: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.renderMatches; },
/* harmony export */   resolvePath: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_1__.resolvePath; },
/* harmony export */   unstable_HistoryRouter: function() { return /* binding */ HistoryRouter; },
/* harmony export */   unstable_useBlocker: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.unstable_useBlocker; },
/* harmony export */   unstable_usePrompt: function() { return /* binding */ usePrompt; },
/* harmony export */   useActionData: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.useActionData; },
/* harmony export */   useAsyncError: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.useAsyncError; },
/* harmony export */   useAsyncValue: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.useAsyncValue; },
/* harmony export */   useBeforeUnload: function() { return /* binding */ useBeforeUnload; },
/* harmony export */   useFetcher: function() { return /* binding */ useFetcher; },
/* harmony export */   useFetchers: function() { return /* binding */ useFetchers; },
/* harmony export */   useFormAction: function() { return /* binding */ useFormAction; },
/* harmony export */   useHref: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.useHref; },
/* harmony export */   useInRouterContext: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.useInRouterContext; },
/* harmony export */   useLinkClickHandler: function() { return /* binding */ useLinkClickHandler; },
/* harmony export */   useLoaderData: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.useLoaderData; },
/* harmony export */   useLocation: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.useLocation; },
/* harmony export */   useMatch: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.useMatch; },
/* harmony export */   useMatches: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.useMatches; },
/* harmony export */   useNavigate: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.useNavigate; },
/* harmony export */   useNavigation: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.useNavigation; },
/* harmony export */   useNavigationType: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.useNavigationType; },
/* harmony export */   useOutlet: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.useOutlet; },
/* harmony export */   useOutletContext: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.useOutletContext; },
/* harmony export */   useParams: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.useParams; },
/* harmony export */   useResolvedPath: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.useResolvedPath; },
/* harmony export */   useRevalidator: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.useRevalidator; },
/* harmony export */   useRouteError: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.useRouteError; },
/* harmony export */   useRouteLoaderData: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.useRouteLoaderData; },
/* harmony export */   useRoutes: function() { return /* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.useRoutes; },
/* harmony export */   useSearchParams: function() { return /* binding */ useSearchParams; },
/* harmony export */   useSubmit: function() { return /* binding */ useSubmit; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var react_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @remix-run/router */ "./node_modules/@remix-run/router/dist/router.js");
/**
 * React Router DOM v6.15.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */





function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}

const defaultMethod = "get";
const defaultEncType = "application/x-www-form-urlencoded";
function isHtmlElement(object) {
  return object != null && typeof object.tagName === "string";
}
function isButtonElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "button";
}
function isFormElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "form";
}
function isInputElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "input";
}
function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
function shouldProcessLinkClick(event, target) {
  return event.button === 0 && (
  // Ignore everything but left clicks
  !target || target === "_self") &&
  // Let browser handle "target=_blank" etc.
  !isModifiedEvent(event) // Ignore clicks with modifier keys
  ;
}
/**
 * Creates a URLSearchParams object using the given initializer.
 *
 * This is identical to `new URLSearchParams(init)` except it also
 * supports arrays as values in the object form of the initializer
 * instead of just strings. This is convenient when you need multiple
 * values for a given key, but don't want to use an array initializer.
 *
 * For example, instead of:
 *
 *   let searchParams = new URLSearchParams([
 *     ['sort', 'name'],
 *     ['sort', 'price']
 *   ]);
 *
 * you can do:
 *
 *   let searchParams = createSearchParams({
 *     sort: ['name', 'price']
 *   });
 */
function createSearchParams(init) {
  if (init === void 0) {
    init = "";
  }
  return new URLSearchParams(typeof init === "string" || Array.isArray(init) || init instanceof URLSearchParams ? init : Object.keys(init).reduce((memo, key) => {
    let value = init[key];
    return memo.concat(Array.isArray(value) ? value.map(v => [key, v]) : [[key, value]]);
  }, []));
}
function getSearchParamsForLocation(locationSearch, defaultSearchParams) {
  let searchParams = createSearchParams(locationSearch);
  if (defaultSearchParams) {
    // Use `defaultSearchParams.forEach(...)` here instead of iterating of
    // `defaultSearchParams.keys()` to work-around a bug in Firefox related to
    // web extensions. Relevant Bugzilla tickets:
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1414602
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1023984
    defaultSearchParams.forEach((_, key) => {
      if (!searchParams.has(key)) {
        defaultSearchParams.getAll(key).forEach(value => {
          searchParams.append(key, value);
        });
      }
    });
  }
  return searchParams;
}
// One-time check for submitter support
let _formDataSupportsSubmitter = null;
function isFormDataSubmitterSupported() {
  if (_formDataSupportsSubmitter === null) {
    try {
      new FormData(document.createElement("form"),
      // @ts-expect-error if FormData supports the submitter parameter, this will throw
      0);
      _formDataSupportsSubmitter = false;
    } catch (e) {
      _formDataSupportsSubmitter = true;
    }
  }
  return _formDataSupportsSubmitter;
}
const supportedFormEncTypes = new Set(["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"]);
function getFormEncType(encType) {
  if (encType != null && !supportedFormEncTypes.has(encType)) {
     true ? (0,react_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_warning)(false, "\"" + encType + "\" is not a valid `encType` for `<Form>`/`<fetcher.Form>` " + ("and will default to \"" + defaultEncType + "\"")) : 0;
    return null;
  }
  return encType;
}
function getFormSubmissionInfo(target, basename) {
  let method;
  let action;
  let encType;
  let formData;
  let body;
  if (isFormElement(target)) {
    // When grabbing the action from the element, it will have had the basename
    // prefixed to ensure non-JS scenarios work, so strip it since we'll
    // re-prefix in the router
    let attr = target.getAttribute("action");
    action = attr ? (0,react_router__WEBPACK_IMPORTED_MODULE_1__.stripBasename)(attr, basename) : null;
    method = target.getAttribute("method") || defaultMethod;
    encType = getFormEncType(target.getAttribute("enctype")) || defaultEncType;
    formData = new FormData(target);
  } else if (isButtonElement(target) || isInputElement(target) && (target.type === "submit" || target.type === "image")) {
    let form = target.form;
    if (form == null) {
      throw new Error("Cannot submit a <button> or <input type=\"submit\"> without a <form>");
    }
    // <button>/<input type="submit"> may override attributes of <form>
    // When grabbing the action from the element, it will have had the basename
    // prefixed to ensure non-JS scenarios work, so strip it since we'll
    // re-prefix in the router
    let attr = target.getAttribute("formaction") || form.getAttribute("action");
    action = attr ? (0,react_router__WEBPACK_IMPORTED_MODULE_1__.stripBasename)(attr, basename) : null;
    method = target.getAttribute("formmethod") || form.getAttribute("method") || defaultMethod;
    encType = getFormEncType(target.getAttribute("formenctype")) || getFormEncType(form.getAttribute("enctype")) || defaultEncType;
    // Build a FormData object populated from a form and submitter
    formData = new FormData(form, target);
    // If this browser doesn't support the `FormData(el, submitter)` format,
    // then tack on the submitter value at the end.  This is a lightweight
    // solution that is not 100% spec compliant.  For complete support in older
    // browsers, consider using the `formdata-submitter-polyfill` package
    if (!isFormDataSubmitterSupported()) {
      let {
        name,
        type,
        value
      } = target;
      if (type === "image") {
        let prefix = name ? name + "." : "";
        formData.append(prefix + "x", "0");
        formData.append(prefix + "y", "0");
      } else if (name) {
        formData.append(name, value);
      }
    }
  } else if (isHtmlElement(target)) {
    throw new Error("Cannot submit element that is not <form>, <button>, or " + "<input type=\"submit|image\">");
  } else {
    method = defaultMethod;
    action = null;
    encType = defaultEncType;
    body = target;
  }
  // Send body for <Form encType="text/plain" so we encode it into text
  if (formData && encType === "text/plain") {
    body = formData;
    formData = undefined;
  }
  return {
    action,
    method: method.toLowerCase(),
    encType,
    formData,
    body
  };
}

const _excluded = ["onClick", "relative", "reloadDocument", "replace", "state", "target", "to", "preventScrollReset"],
  _excluded2 = ["aria-current", "caseSensitive", "className", "end", "style", "to", "children"],
  _excluded3 = ["reloadDocument", "replace", "state", "method", "action", "onSubmit", "submit", "relative", "preventScrollReset"];
function createBrowserRouter(routes, opts) {
  return (0,react_router__WEBPACK_IMPORTED_MODULE_1__.createRouter)({
    basename: opts == null ? void 0 : opts.basename,
    future: _extends({}, opts == null ? void 0 : opts.future, {
      v7_prependBasename: true
    }),
    history: (0,react_router__WEBPACK_IMPORTED_MODULE_1__.createBrowserHistory)({
      window: opts == null ? void 0 : opts.window
    }),
    hydrationData: (opts == null ? void 0 : opts.hydrationData) || parseHydrationData(),
    routes,
    mapRouteProperties: react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_mapRouteProperties
  }).initialize();
}
function createHashRouter(routes, opts) {
  return (0,react_router__WEBPACK_IMPORTED_MODULE_1__.createRouter)({
    basename: opts == null ? void 0 : opts.basename,
    future: _extends({}, opts == null ? void 0 : opts.future, {
      v7_prependBasename: true
    }),
    history: (0,react_router__WEBPACK_IMPORTED_MODULE_1__.createHashHistory)({
      window: opts == null ? void 0 : opts.window
    }),
    hydrationData: (opts == null ? void 0 : opts.hydrationData) || parseHydrationData(),
    routes,
    mapRouteProperties: react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_mapRouteProperties
  }).initialize();
}
function parseHydrationData() {
  var _window;
  let state = (_window = window) == null ? void 0 : _window.__staticRouterHydrationData;
  if (state && state.errors) {
    state = _extends({}, state, {
      errors: deserializeErrors(state.errors)
    });
  }
  return state;
}
function deserializeErrors(errors) {
  if (!errors) return null;
  let entries = Object.entries(errors);
  let serialized = {};
  for (let [key, val] of entries) {
    // Hey you!  If you change this, please change the corresponding logic in
    // serializeErrors in react-router-dom/server.tsx :)
    if (val && val.__type === "RouteErrorResponse") {
      serialized[key] = new react_router__WEBPACK_IMPORTED_MODULE_1__.ErrorResponse(val.status, val.statusText, val.data, val.internal === true);
    } else if (val && val.__type === "Error") {
      // Attempt to reconstruct the right type of Error (i.e., ReferenceError)
      if (val.__subType) {
        let ErrorConstructor = window[val.__subType];
        if (typeof ErrorConstructor === "function") {
          try {
            // @ts-expect-error
            let error = new ErrorConstructor(val.message);
            // Wipe away the client-side stack trace.  Nothing to fill it in with
            // because we don't serialize SSR stack traces for security reasons
            error.stack = "";
            serialized[key] = error;
          } catch (e) {
            // no-op - fall through and create a normal Error
          }
        }
      }
      if (serialized[key] == null) {
        let error = new Error(val.message);
        // Wipe away the client-side stack trace.  Nothing to fill it in with
        // because we don't serialize SSR stack traces for security reasons
        error.stack = "";
        serialized[key] = error;
      }
    } else {
      serialized[key] = val;
    }
  }
  return serialized;
}
//#endregion
////////////////////////////////////////////////////////////////////////////////
//#region Components
////////////////////////////////////////////////////////////////////////////////
/**
  Webpack + React 17 fails to compile on any of the following because webpack
  complains that `startTransition` doesn't exist in `React`:
  * import { startTransition } from "react"
  * import * as React from from "react";
    "startTransition" in React ? React.startTransition(() => setState()) : setState()
  * import * as React from from "react";
    "startTransition" in React ? React["startTransition"](() => setState()) : setState()

  Moving it to a constant such as the following solves the Webpack/React 17 issue:
  * import * as React from from "react";
    const START_TRANSITION = "startTransition";
    START_TRANSITION in React ? React[START_TRANSITION](() => setState()) : setState()

  However, that introduces webpack/terser minification issues in production builds
  in React 18 where minification/obfuscation ends up removing the call of
  React.startTransition entirely from the first half of the ternary.  Grabbing
  this exported reference once up front resolves that issue.

  See https://github.com/remix-run/react-router/issues/10579
*/
const START_TRANSITION = "startTransition";
const startTransitionImpl = react__WEBPACK_IMPORTED_MODULE_0__[START_TRANSITION];
/**
 * A `<Router>` for use in web browsers. Provides the cleanest URLs.
 */
function BrowserRouter(_ref) {
  let {
    basename,
    children,
    future,
    window
  } = _ref;
  let historyRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef();
  if (historyRef.current == null) {
    historyRef.current = (0,react_router__WEBPACK_IMPORTED_MODULE_1__.createBrowserHistory)({
      window,
      v5Compat: true
    });
  }
  let history = historyRef.current;
  let [state, setStateImpl] = react__WEBPACK_IMPORTED_MODULE_0__.useState({
    action: history.action,
    location: history.location
  });
  let {
    v7_startTransition
  } = future || {};
  let setState = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(newState => {
    v7_startTransition && startTransitionImpl ? startTransitionImpl(() => setStateImpl(newState)) : setStateImpl(newState);
  }, [setStateImpl, v7_startTransition]);
  react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect(() => history.listen(setState), [history, setState]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router__WEBPACK_IMPORTED_MODULE_2__.Router, {
    basename: basename,
    children: children,
    location: state.location,
    navigationType: state.action,
    navigator: history
  });
}
/**
 * A `<Router>` for use in web browsers. Stores the location in the hash
 * portion of the URL so it is not sent to the server.
 */
function HashRouter(_ref2) {
  let {
    basename,
    children,
    future,
    window
  } = _ref2;
  let historyRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef();
  if (historyRef.current == null) {
    historyRef.current = (0,react_router__WEBPACK_IMPORTED_MODULE_1__.createHashHistory)({
      window,
      v5Compat: true
    });
  }
  let history = historyRef.current;
  let [state, setStateImpl] = react__WEBPACK_IMPORTED_MODULE_0__.useState({
    action: history.action,
    location: history.location
  });
  let {
    v7_startTransition
  } = future || {};
  let setState = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(newState => {
    v7_startTransition && startTransitionImpl ? startTransitionImpl(() => setStateImpl(newState)) : setStateImpl(newState);
  }, [setStateImpl, v7_startTransition]);
  react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect(() => history.listen(setState), [history, setState]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router__WEBPACK_IMPORTED_MODULE_2__.Router, {
    basename: basename,
    children: children,
    location: state.location,
    navigationType: state.action,
    navigator: history
  });
}
/**
 * A `<Router>` that accepts a pre-instantiated history object. It's important
 * to note that using your own history object is highly discouraged and may add
 * two versions of the history library to your bundles unless you use the same
 * version of the history library that React Router uses internally.
 */
function HistoryRouter(_ref3) {
  let {
    basename,
    children,
    future,
    history
  } = _ref3;
  let [state, setStateImpl] = react__WEBPACK_IMPORTED_MODULE_0__.useState({
    action: history.action,
    location: history.location
  });
  let {
    v7_startTransition
  } = future || {};
  let setState = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(newState => {
    v7_startTransition && startTransitionImpl ? startTransitionImpl(() => setStateImpl(newState)) : setStateImpl(newState);
  }, [setStateImpl, v7_startTransition]);
  react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect(() => history.listen(setState), [history, setState]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router__WEBPACK_IMPORTED_MODULE_2__.Router, {
    basename: basename,
    children: children,
    location: state.location,
    navigationType: state.action,
    navigator: history
  });
}
if (true) {
  HistoryRouter.displayName = "unstable_HistoryRouter";
}
const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
const ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
/**
 * The public API for rendering a history-aware <a>.
 */
const Link = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(function LinkWithRef(_ref4, ref) {
  let {
      onClick,
      relative,
      reloadDocument,
      replace,
      state,
      target,
      to,
      preventScrollReset
    } = _ref4,
    rest = _objectWithoutPropertiesLoose(_ref4, _excluded);
  let {
    basename
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_NavigationContext);
  // Rendered into <a href> for absolute URLs
  let absoluteHref;
  let isExternal = false;
  if (typeof to === "string" && ABSOLUTE_URL_REGEX.test(to)) {
    // Render the absolute href server- and client-side
    absoluteHref = to;
    // Only check for external origins client-side
    if (isBrowser) {
      try {
        let currentUrl = new URL(window.location.href);
        let targetUrl = to.startsWith("//") ? new URL(currentUrl.protocol + to) : new URL(to);
        let path = (0,react_router__WEBPACK_IMPORTED_MODULE_1__.stripBasename)(targetUrl.pathname, basename);
        if (targetUrl.origin === currentUrl.origin && path != null) {
          // Strip the protocol/origin/basename for same-origin absolute URLs
          to = path + targetUrl.search + targetUrl.hash;
        } else {
          isExternal = true;
        }
      } catch (e) {
        // We can't do external URL detection without a valid URL
         true ? (0,react_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_warning)(false, "<Link to=\"" + to + "\"> contains an invalid URL which will probably break " + "when clicked - please update to a valid URL path.") : 0;
      }
    }
  }
  // Rendered into <a href> for relative URLs
  let href = (0,react_router__WEBPACK_IMPORTED_MODULE_2__.useHref)(to, {
    relative
  });
  let internalOnClick = useLinkClickHandler(to, {
    replace,
    state,
    target,
    preventScrollReset,
    relative
  });
  function handleClick(event) {
    if (onClick) onClick(event);
    if (!event.defaultPrevented) {
      internalOnClick(event);
    }
  }
  return (
    /*#__PURE__*/
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", _extends({}, rest, {
      href: absoluteHref || href,
      onClick: isExternal || reloadDocument ? onClick : handleClick,
      ref: ref,
      target: target
    }))
  );
});
if (true) {
  Link.displayName = "Link";
}
/**
 * A <Link> wrapper that knows if it's "active" or not.
 */
const NavLink = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(function NavLinkWithRef(_ref5, ref) {
  let {
      "aria-current": ariaCurrentProp = "page",
      caseSensitive = false,
      className: classNameProp = "",
      end = false,
      style: styleProp,
      to,
      children
    } = _ref5,
    rest = _objectWithoutPropertiesLoose(_ref5, _excluded2);
  let path = (0,react_router__WEBPACK_IMPORTED_MODULE_2__.useResolvedPath)(to, {
    relative: rest.relative
  });
  let location = (0,react_router__WEBPACK_IMPORTED_MODULE_2__.useLocation)();
  let routerState = react__WEBPACK_IMPORTED_MODULE_0__.useContext(react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_DataRouterStateContext);
  let {
    navigator
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_NavigationContext);
  let toPathname = navigator.encodeLocation ? navigator.encodeLocation(path).pathname : path.pathname;
  let locationPathname = location.pathname;
  let nextLocationPathname = routerState && routerState.navigation && routerState.navigation.location ? routerState.navigation.location.pathname : null;
  if (!caseSensitive) {
    locationPathname = locationPathname.toLowerCase();
    nextLocationPathname = nextLocationPathname ? nextLocationPathname.toLowerCase() : null;
    toPathname = toPathname.toLowerCase();
  }
  let isActive = locationPathname === toPathname || !end && locationPathname.startsWith(toPathname) && locationPathname.charAt(toPathname.length) === "/";
  let isPending = nextLocationPathname != null && (nextLocationPathname === toPathname || !end && nextLocationPathname.startsWith(toPathname) && nextLocationPathname.charAt(toPathname.length) === "/");
  let ariaCurrent = isActive ? ariaCurrentProp : undefined;
  let className;
  if (typeof classNameProp === "function") {
    className = classNameProp({
      isActive,
      isPending
    });
  } else {
    // If the className prop is not a function, we use a default `active`
    // class for <NavLink />s that are active. In v5 `active` was the default
    // value for `activeClassName`, but we are removing that API and can still
    // use the old default behavior for a cleaner upgrade path and keep the
    // simple styling rules working as they currently do.
    className = [classNameProp, isActive ? "active" : null, isPending ? "pending" : null].filter(Boolean).join(" ");
  }
  let style = typeof styleProp === "function" ? styleProp({
    isActive,
    isPending
  }) : styleProp;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Link, _extends({}, rest, {
    "aria-current": ariaCurrent,
    className: className,
    ref: ref,
    style: style,
    to: to
  }), typeof children === "function" ? children({
    isActive,
    isPending
  }) : children);
});
if (true) {
  NavLink.displayName = "NavLink";
}
/**
 * A `@remix-run/router`-aware `<form>`. It behaves like a normal form except
 * that the interaction with the server is with `fetch` instead of new document
 * requests, allowing components to add nicer UX to the page as the form is
 * submitted and returns with data.
 */
const Form = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, ref) => {
  let submit = useSubmit();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(FormImpl, _extends({}, props, {
    submit: submit,
    ref: ref
  }));
});
if (true) {
  Form.displayName = "Form";
}
const FormImpl = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((_ref6, forwardedRef) => {
  let {
      reloadDocument,
      replace,
      state,
      method = defaultMethod,
      action,
      onSubmit,
      submit,
      relative,
      preventScrollReset
    } = _ref6,
    props = _objectWithoutPropertiesLoose(_ref6, _excluded3);
  let formMethod = method.toLowerCase() === "get" ? "get" : "post";
  let formAction = useFormAction(action, {
    relative
  });
  let submitHandler = event => {
    onSubmit && onSubmit(event);
    if (event.defaultPrevented) return;
    event.preventDefault();
    let submitter = event.nativeEvent.submitter;
    let submitMethod = (submitter == null ? void 0 : submitter.getAttribute("formmethod")) || method;
    submit(submitter || event.currentTarget, {
      method: submitMethod,
      replace,
      state,
      relative,
      preventScrollReset
    });
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("form", _extends({
    ref: forwardedRef,
    method: formMethod,
    action: formAction,
    onSubmit: reloadDocument ? onSubmit : submitHandler
  }, props));
});
if (true) {
  FormImpl.displayName = "FormImpl";
}
/**
 * This component will emulate the browser's scroll restoration on location
 * changes.
 */
function ScrollRestoration(_ref7) {
  let {
    getKey,
    storageKey
  } = _ref7;
  useScrollRestoration({
    getKey,
    storageKey
  });
  return null;
}
if (true) {
  ScrollRestoration.displayName = "ScrollRestoration";
}
//#endregion
////////////////////////////////////////////////////////////////////////////////
//#region Hooks
////////////////////////////////////////////////////////////////////////////////
var DataRouterHook;
(function (DataRouterHook) {
  DataRouterHook["UseScrollRestoration"] = "useScrollRestoration";
  DataRouterHook["UseSubmit"] = "useSubmit";
  DataRouterHook["UseSubmitFetcher"] = "useSubmitFetcher";
  DataRouterHook["UseFetcher"] = "useFetcher";
})(DataRouterHook || (DataRouterHook = {}));
var DataRouterStateHook;
(function (DataRouterStateHook) {
  DataRouterStateHook["UseFetchers"] = "useFetchers";
  DataRouterStateHook["UseScrollRestoration"] = "useScrollRestoration";
})(DataRouterStateHook || (DataRouterStateHook = {}));
function getDataRouterConsoleError(hookName) {
  return hookName + " must be used within a data router.  See https://reactrouter.com/routers/picking-a-router.";
}
function useDataRouterContext(hookName) {
  let ctx = react__WEBPACK_IMPORTED_MODULE_0__.useContext(react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_DataRouterContext);
  !ctx ?  true ? (0,react_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, getDataRouterConsoleError(hookName)) : 0 : void 0;
  return ctx;
}
function useDataRouterState(hookName) {
  let state = react__WEBPACK_IMPORTED_MODULE_0__.useContext(react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_DataRouterStateContext);
  !state ?  true ? (0,react_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, getDataRouterConsoleError(hookName)) : 0 : void 0;
  return state;
}
/**
 * Handles the click behavior for router `<Link>` components. This is useful if
 * you need to create custom `<Link>` components with the same click behavior we
 * use in our exported `<Link>`.
 */
function useLinkClickHandler(to, _temp) {
  let {
    target,
    replace: replaceProp,
    state,
    preventScrollReset,
    relative
  } = _temp === void 0 ? {} : _temp;
  let navigate = (0,react_router__WEBPACK_IMPORTED_MODULE_2__.useNavigate)();
  let location = (0,react_router__WEBPACK_IMPORTED_MODULE_2__.useLocation)();
  let path = (0,react_router__WEBPACK_IMPORTED_MODULE_2__.useResolvedPath)(to, {
    relative
  });
  return react__WEBPACK_IMPORTED_MODULE_0__.useCallback(event => {
    if (shouldProcessLinkClick(event, target)) {
      event.preventDefault();
      // If the URL hasn't changed, a regular <a> will do a replace instead of
      // a push, so do the same here unless the replace prop is explicitly set
      let replace = replaceProp !== undefined ? replaceProp : (0,react_router__WEBPACK_IMPORTED_MODULE_1__.createPath)(location) === (0,react_router__WEBPACK_IMPORTED_MODULE_1__.createPath)(path);
      navigate(to, {
        replace,
        state,
        preventScrollReset,
        relative
      });
    }
  }, [location, navigate, path, replaceProp, state, target, to, preventScrollReset, relative]);
}
/**
 * A convenient wrapper for reading and writing search parameters via the
 * URLSearchParams interface.
 */
function useSearchParams(defaultInit) {
   true ? (0,react_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_warning)(typeof URLSearchParams !== "undefined", "You cannot use the `useSearchParams` hook in a browser that does not " + "support the URLSearchParams API. If you need to support Internet " + "Explorer 11, we recommend you load a polyfill such as " + "https://github.com/ungap/url-search-params\n\n" + "If you're unsure how to load polyfills, we recommend you check out " + "https://polyfill.io/v3/ which provides some recommendations about how " + "to load polyfills only for users that need them, instead of for every " + "user.") : 0;
  let defaultSearchParamsRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(createSearchParams(defaultInit));
  let hasSetSearchParamsRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  let location = (0,react_router__WEBPACK_IMPORTED_MODULE_2__.useLocation)();
  let searchParams = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() =>
  // Only merge in the defaults if we haven't yet called setSearchParams.
  // Once we call that we want those to take precedence, otherwise you can't
  // remove a param with setSearchParams({}) if it has an initial value
  getSearchParamsForLocation(location.search, hasSetSearchParamsRef.current ? null : defaultSearchParamsRef.current), [location.search]);
  let navigate = (0,react_router__WEBPACK_IMPORTED_MODULE_2__.useNavigate)();
  let setSearchParams = react__WEBPACK_IMPORTED_MODULE_0__.useCallback((nextInit, navigateOptions) => {
    const newSearchParams = createSearchParams(typeof nextInit === "function" ? nextInit(searchParams) : nextInit);
    hasSetSearchParamsRef.current = true;
    navigate("?" + newSearchParams, navigateOptions);
  }, [navigate, searchParams]);
  return [searchParams, setSearchParams];
}
function validateClientSideSubmission() {
  if (typeof document === "undefined") {
    throw new Error("You are calling submit during the server render. " + "Try calling submit within a `useEffect` or callback instead.");
  }
}
/**
 * Returns a function that may be used to programmatically submit a form (or
 * some arbitrary data) to the server.
 */
function useSubmit() {
  let {
    router
  } = useDataRouterContext(DataRouterHook.UseSubmit);
  let {
    basename
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_NavigationContext);
  let currentRouteId = (0,react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_useRouteId)();
  return react__WEBPACK_IMPORTED_MODULE_0__.useCallback(function (target, options) {
    if (options === void 0) {
      options = {};
    }
    validateClientSideSubmission();
    let {
      action,
      method,
      encType,
      formData,
      body
    } = getFormSubmissionInfo(target, basename);
    router.navigate(options.action || action, {
      preventScrollReset: options.preventScrollReset,
      formData,
      body,
      formMethod: options.method || method,
      formEncType: options.encType || encType,
      replace: options.replace,
      state: options.state,
      fromRouteId: currentRouteId
    });
  }, [router, basename, currentRouteId]);
}
/**
 * Returns the implementation for fetcher.submit
 */
function useSubmitFetcher(fetcherKey, fetcherRouteId) {
  let {
    router
  } = useDataRouterContext(DataRouterHook.UseSubmitFetcher);
  let {
    basename
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_NavigationContext);
  return react__WEBPACK_IMPORTED_MODULE_0__.useCallback(function (target, options) {
    if (options === void 0) {
      options = {};
    }
    validateClientSideSubmission();
    let {
      action,
      method,
      encType,
      formData,
      body
    } = getFormSubmissionInfo(target, basename);
    !(fetcherRouteId != null) ?  true ? (0,react_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, "No routeId available for useFetcher()") : 0 : void 0;
    router.fetch(fetcherKey, fetcherRouteId, options.action || action, {
      preventScrollReset: options.preventScrollReset,
      formData,
      body,
      formMethod: options.method || method,
      formEncType: options.encType || encType
    });
  }, [router, basename, fetcherKey, fetcherRouteId]);
}
// v7: Eventually we should deprecate this entirely in favor of using the
// router method directly?
function useFormAction(action, _temp2) {
  let {
    relative
  } = _temp2 === void 0 ? {} : _temp2;
  let {
    basename
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_NavigationContext);
  let routeContext = react__WEBPACK_IMPORTED_MODULE_0__.useContext(react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_RouteContext);
  !routeContext ?  true ? (0,react_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, "useFormAction must be used inside a RouteContext") : 0 : void 0;
  let [match] = routeContext.matches.slice(-1);
  // Shallow clone path so we can modify it below, otherwise we modify the
  // object referenced by useMemo inside useResolvedPath
  let path = _extends({}, (0,react_router__WEBPACK_IMPORTED_MODULE_2__.useResolvedPath)(action ? action : ".", {
    relative
  }));
  // Previously we set the default action to ".". The problem with this is that
  // `useResolvedPath(".")` excludes search params of the resolved URL. This is
  // the intended behavior of when "." is specifically provided as
  // the form action, but inconsistent w/ browsers when the action is omitted.
  // https://github.com/remix-run/remix/issues/927
  let location = (0,react_router__WEBPACK_IMPORTED_MODULE_2__.useLocation)();
  if (action == null) {
    // Safe to write to this directly here since if action was undefined, we
    // would have called useResolvedPath(".") which will never include a search
    path.search = location.search;
    // When grabbing search params from the URL, remove the automatically
    // inserted ?index param so we match the useResolvedPath search behavior
    // which would not include ?index
    if (match.route.index) {
      let params = new URLSearchParams(path.search);
      params.delete("index");
      path.search = params.toString() ? "?" + params.toString() : "";
    }
  }
  if ((!action || action === ".") && match.route.index) {
    path.search = path.search ? path.search.replace(/^\?/, "?index&") : "?index";
  }
  // If we're operating within a basename, prepend it to the pathname prior
  // to creating the form action.  If this is a root navigation, then just use
  // the raw basename which allows the basename to have full control over the
  // presence of a trailing slash on root actions
  if (basename !== "/") {
    path.pathname = path.pathname === "/" ? basename : (0,react_router__WEBPACK_IMPORTED_MODULE_1__.joinPaths)([basename, path.pathname]);
  }
  return (0,react_router__WEBPACK_IMPORTED_MODULE_1__.createPath)(path);
}
function createFetcherForm(fetcherKey, routeId) {
  let FetcherForm = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, ref) => {
    let submit = useSubmitFetcher(fetcherKey, routeId);
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(FormImpl, _extends({}, props, {
      ref: ref,
      submit: submit
    }));
  });
  if (true) {
    FetcherForm.displayName = "fetcher.Form";
  }
  return FetcherForm;
}
let fetcherId = 0;
/**
 * Interacts with route loaders and actions without causing a navigation. Great
 * for any interaction that stays on the same page.
 */
function useFetcher() {
  var _route$matches;
  let {
    router
  } = useDataRouterContext(DataRouterHook.UseFetcher);
  let route = react__WEBPACK_IMPORTED_MODULE_0__.useContext(react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_RouteContext);
  !route ?  true ? (0,react_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, "useFetcher must be used inside a RouteContext") : 0 : void 0;
  let routeId = (_route$matches = route.matches[route.matches.length - 1]) == null ? void 0 : _route$matches.route.id;
  !(routeId != null) ?  true ? (0,react_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, "useFetcher can only be used on routes that contain a unique \"id\"") : 0 : void 0;
  let [fetcherKey] = react__WEBPACK_IMPORTED_MODULE_0__.useState(() => String(++fetcherId));
  let [Form] = react__WEBPACK_IMPORTED_MODULE_0__.useState(() => {
    !routeId ?  true ? (0,react_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, "No routeId available for fetcher.Form()") : 0 : void 0;
    return createFetcherForm(fetcherKey, routeId);
  });
  let [load] = react__WEBPACK_IMPORTED_MODULE_0__.useState(() => href => {
    !router ?  true ? (0,react_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, "No router available for fetcher.load()") : 0 : void 0;
    !routeId ?  true ? (0,react_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, "No routeId available for fetcher.load()") : 0 : void 0;
    router.fetch(fetcherKey, routeId, href);
  });
  let submit = useSubmitFetcher(fetcherKey, routeId);
  let fetcher = router.getFetcher(fetcherKey);
  let fetcherWithComponents = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => _extends({
    Form,
    submit,
    load
  }, fetcher), [fetcher, Form, submit, load]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    // Is this busted when the React team gets real weird and calls effects
    // twice on mount?  We really just need to garbage collect here when this
    // fetcher is no longer around.
    return () => {
      if (!router) {
        console.warn("No router available to clean up from useFetcher()");
        return;
      }
      router.deleteFetcher(fetcherKey);
    };
  }, [router, fetcherKey]);
  return fetcherWithComponents;
}
/**
 * Provides all fetchers currently on the page. Useful for layouts and parent
 * routes that need to provide pending/optimistic UI regarding the fetch.
 */
function useFetchers() {
  let state = useDataRouterState(DataRouterStateHook.UseFetchers);
  return [...state.fetchers.values()];
}
const SCROLL_RESTORATION_STORAGE_KEY = "react-router-scroll-positions";
let savedScrollPositions = {};
/**
 * When rendered inside a RouterProvider, will restore scroll positions on navigations
 */
function useScrollRestoration(_temp3) {
  let {
    getKey,
    storageKey
  } = _temp3 === void 0 ? {} : _temp3;
  let {
    router
  } = useDataRouterContext(DataRouterHook.UseScrollRestoration);
  let {
    restoreScrollPosition,
    preventScrollReset
  } = useDataRouterState(DataRouterStateHook.UseScrollRestoration);
  let {
    basename
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_NavigationContext);
  let location = (0,react_router__WEBPACK_IMPORTED_MODULE_2__.useLocation)();
  let matches = (0,react_router__WEBPACK_IMPORTED_MODULE_2__.useMatches)();
  let navigation = (0,react_router__WEBPACK_IMPORTED_MODULE_2__.useNavigation)();
  // Trigger manual scroll restoration while we're active
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = "auto";
    };
  }, []);
  // Save positions on pagehide
  usePageHide(react__WEBPACK_IMPORTED_MODULE_0__.useCallback(() => {
    if (navigation.state === "idle") {
      let key = (getKey ? getKey(location, matches) : null) || location.key;
      savedScrollPositions[key] = window.scrollY;
    }
    sessionStorage.setItem(storageKey || SCROLL_RESTORATION_STORAGE_KEY, JSON.stringify(savedScrollPositions));
    window.history.scrollRestoration = "auto";
  }, [storageKey, getKey, navigation.state, location, matches]));
  // Read in any saved scroll locations
  if (typeof document !== "undefined") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect(() => {
      try {
        let sessionPositions = sessionStorage.getItem(storageKey || SCROLL_RESTORATION_STORAGE_KEY);
        if (sessionPositions) {
          savedScrollPositions = JSON.parse(sessionPositions);
        }
      } catch (e) {
        // no-op, use default empty object
      }
    }, [storageKey]);
    // Enable scroll restoration in the router
    // eslint-disable-next-line react-hooks/rules-of-hooks
    react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect(() => {
      let getKeyWithoutBasename = getKey && basename !== "/" ? (location, matches) => getKey( // Strip the basename to match useLocation()
      _extends({}, location, {
        pathname: (0,react_router__WEBPACK_IMPORTED_MODULE_1__.stripBasename)(location.pathname, basename) || location.pathname
      }), matches) : getKey;
      let disableScrollRestoration = router == null ? void 0 : router.enableScrollRestoration(savedScrollPositions, () => window.scrollY, getKeyWithoutBasename);
      return () => disableScrollRestoration && disableScrollRestoration();
    }, [router, basename, getKey]);
    // Restore scrolling when state.restoreScrollPosition changes
    // eslint-disable-next-line react-hooks/rules-of-hooks
    react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect(() => {
      // Explicit false means don't do anything (used for submissions)
      if (restoreScrollPosition === false) {
        return;
      }
      // been here before, scroll to it
      if (typeof restoreScrollPosition === "number") {
        window.scrollTo(0, restoreScrollPosition);
        return;
      }
      // try to scroll to the hash
      if (location.hash) {
        let el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (el) {
          el.scrollIntoView();
          return;
        }
      }
      // Don't reset if this navigation opted out
      if (preventScrollReset === true) {
        return;
      }
      // otherwise go to the top on new locations
      window.scrollTo(0, 0);
    }, [location, restoreScrollPosition, preventScrollReset]);
  }
}
/**
 * Setup a callback to be fired on the window's `beforeunload` event. This is
 * useful for saving some data to `window.localStorage` just before the page
 * refreshes.
 *
 * Note: The `callback` argument should be a function created with
 * `React.useCallback()`.
 */
function useBeforeUnload(callback, options) {
  let {
    capture
  } = options || {};
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    let opts = capture != null ? {
      capture
    } : undefined;
    window.addEventListener("beforeunload", callback, opts);
    return () => {
      window.removeEventListener("beforeunload", callback, opts);
    };
  }, [callback, capture]);
}
/**
 * Setup a callback to be fired on the window's `pagehide` event. This is
 * useful for saving some data to `window.localStorage` just before the page
 * refreshes.  This event is better supported than beforeunload across browsers.
 *
 * Note: The `callback` argument should be a function created with
 * `React.useCallback()`.
 */
function usePageHide(callback, options) {
  let {
    capture
  } = options || {};
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    let opts = capture != null ? {
      capture
    } : undefined;
    window.addEventListener("pagehide", callback, opts);
    return () => {
      window.removeEventListener("pagehide", callback, opts);
    };
  }, [callback, capture]);
}
/**
 * Wrapper around useBlocker to show a window.confirm prompt to users instead
 * of building a custom UI with useBlocker.
 *
 * Warning: This has *a lot of rough edges* and behaves very differently (and
 * very incorrectly in some cases) across browsers if user click addition
 * back/forward navigations while the confirm is open.  Use at your own risk.
 */
function usePrompt(_ref8) {
  let {
    when,
    message
  } = _ref8;
  let blocker = (0,react_router__WEBPACK_IMPORTED_MODULE_2__.unstable_useBlocker)(when);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (blocker.state === "blocked") {
      let proceed = window.confirm(message);
      if (proceed) {
        // This timeout is needed to avoid a weird "race" on POP navigations
        // between the `window.history` revert navigation and the result of
        // `window.confirm`
        setTimeout(blocker.proceed, 0);
      } else {
        blocker.reset();
      }
    }
  }, [blocker, message]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (blocker.state === "blocked" && !when) {
      blocker.reset();
    }
  }, [blocker, when]);
}
//#endregion


//# sourceMappingURL=index.js.map


/***/ }),

/***/ "./node_modules/react-router/dist/index.js":
/*!*************************************************!*\
  !*** ./node_modules/react-router/dist/index.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbortedDeferredError: function() { return /* reexport safe */ _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.AbortedDeferredError; },
/* harmony export */   Await: function() { return /* binding */ Await; },
/* harmony export */   MemoryRouter: function() { return /* binding */ MemoryRouter; },
/* harmony export */   Navigate: function() { return /* binding */ Navigate; },
/* harmony export */   NavigationType: function() { return /* reexport safe */ _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.Action; },
/* harmony export */   Outlet: function() { return /* binding */ Outlet; },
/* harmony export */   Route: function() { return /* binding */ Route; },
/* harmony export */   Router: function() { return /* binding */ Router; },
/* harmony export */   RouterProvider: function() { return /* binding */ RouterProvider; },
/* harmony export */   Routes: function() { return /* binding */ Routes; },
/* harmony export */   UNSAFE_DataRouterContext: function() { return /* binding */ DataRouterContext; },
/* harmony export */   UNSAFE_DataRouterStateContext: function() { return /* binding */ DataRouterStateContext; },
/* harmony export */   UNSAFE_LocationContext: function() { return /* binding */ LocationContext; },
/* harmony export */   UNSAFE_NavigationContext: function() { return /* binding */ NavigationContext; },
/* harmony export */   UNSAFE_RouteContext: function() { return /* binding */ RouteContext; },
/* harmony export */   UNSAFE_mapRouteProperties: function() { return /* binding */ mapRouteProperties; },
/* harmony export */   UNSAFE_useRouteId: function() { return /* binding */ useRouteId; },
/* harmony export */   UNSAFE_useRoutesImpl: function() { return /* binding */ useRoutesImpl; },
/* harmony export */   createMemoryRouter: function() { return /* binding */ createMemoryRouter; },
/* harmony export */   createPath: function() { return /* reexport safe */ _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.createPath; },
/* harmony export */   createRoutesFromChildren: function() { return /* binding */ createRoutesFromChildren; },
/* harmony export */   createRoutesFromElements: function() { return /* binding */ createRoutesFromChildren; },
/* harmony export */   defer: function() { return /* reexport safe */ _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.defer; },
/* harmony export */   generatePath: function() { return /* reexport safe */ _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.generatePath; },
/* harmony export */   isRouteErrorResponse: function() { return /* reexport safe */ _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.isRouteErrorResponse; },
/* harmony export */   json: function() { return /* reexport safe */ _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.json; },
/* harmony export */   matchPath: function() { return /* reexport safe */ _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.matchPath; },
/* harmony export */   matchRoutes: function() { return /* reexport safe */ _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.matchRoutes; },
/* harmony export */   parsePath: function() { return /* reexport safe */ _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.parsePath; },
/* harmony export */   redirect: function() { return /* reexport safe */ _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.redirect; },
/* harmony export */   redirectDocument: function() { return /* reexport safe */ _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.redirectDocument; },
/* harmony export */   renderMatches: function() { return /* binding */ renderMatches; },
/* harmony export */   resolvePath: function() { return /* reexport safe */ _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.resolvePath; },
/* harmony export */   unstable_useBlocker: function() { return /* binding */ useBlocker; },
/* harmony export */   useActionData: function() { return /* binding */ useActionData; },
/* harmony export */   useAsyncError: function() { return /* binding */ useAsyncError; },
/* harmony export */   useAsyncValue: function() { return /* binding */ useAsyncValue; },
/* harmony export */   useHref: function() { return /* binding */ useHref; },
/* harmony export */   useInRouterContext: function() { return /* binding */ useInRouterContext; },
/* harmony export */   useLoaderData: function() { return /* binding */ useLoaderData; },
/* harmony export */   useLocation: function() { return /* binding */ useLocation; },
/* harmony export */   useMatch: function() { return /* binding */ useMatch; },
/* harmony export */   useMatches: function() { return /* binding */ useMatches; },
/* harmony export */   useNavigate: function() { return /* binding */ useNavigate; },
/* harmony export */   useNavigation: function() { return /* binding */ useNavigation; },
/* harmony export */   useNavigationType: function() { return /* binding */ useNavigationType; },
/* harmony export */   useOutlet: function() { return /* binding */ useOutlet; },
/* harmony export */   useOutletContext: function() { return /* binding */ useOutletContext; },
/* harmony export */   useParams: function() { return /* binding */ useParams; },
/* harmony export */   useResolvedPath: function() { return /* binding */ useResolvedPath; },
/* harmony export */   useRevalidator: function() { return /* binding */ useRevalidator; },
/* harmony export */   useRouteError: function() { return /* binding */ useRouteError; },
/* harmony export */   useRouteLoaderData: function() { return /* binding */ useRouteLoaderData; },
/* harmony export */   useRoutes: function() { return /* binding */ useRoutes; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _remix_run_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @remix-run/router */ "./node_modules/@remix-run/router/dist/router.js");
/**
 * React Router v6.15.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */




function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

// Create react-specific types from the agnostic types in @remix-run/router to
// export from react-router
const DataRouterContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);
if (true) {
  DataRouterContext.displayName = "DataRouter";
}
const DataRouterStateContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);
if (true) {
  DataRouterStateContext.displayName = "DataRouterState";
}
const AwaitContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);
if (true) {
  AwaitContext.displayName = "Await";
}

/**
 * A Navigator is a "location changer"; it's how you get to different locations.
 *
 * Every history instance conforms to the Navigator interface, but the
 * distinction is useful primarily when it comes to the low-level <Router> API
 * where both the location and a navigator must be provided separately in order
 * to avoid "tearing" that may occur in a suspense-enabled app if the action
 * and/or location were to be read directly from the history instance.
 */

const NavigationContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);
if (true) {
  NavigationContext.displayName = "Navigation";
}
const LocationContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);
if (true) {
  LocationContext.displayName = "Location";
}
const RouteContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext({
  outlet: null,
  matches: [],
  isDataRoute: false
});
if (true) {
  RouteContext.displayName = "Route";
}
const RouteErrorContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);
if (true) {
  RouteErrorContext.displayName = "RouteError";
}

/**
 * Returns the full href for the given "to" value. This is useful for building
 * custom links that are also accessible and preserve right-click behavior.
 *
 * @see https://reactrouter.com/hooks/use-href
 */
function useHref(to, _temp) {
  let {
    relative
  } = _temp === void 0 ? {} : _temp;
  !useInRouterContext() ?  true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, // TODO: This error is probably because they somehow have 2 versions of the
  // router loaded. We can help them understand how to avoid that.
  "useHref() may be used only in the context of a <Router> component.") : 0 : void 0;
  let {
    basename,
    navigator
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(NavigationContext);
  let {
    hash,
    pathname,
    search
  } = useResolvedPath(to, {
    relative
  });
  let joinedPathname = pathname;

  // If we're operating within a basename, prepend it to the pathname prior
  // to creating the href.  If this is a root navigation, then just use the raw
  // basename which allows the basename to have full control over the presence
  // of a trailing slash on root links
  if (basename !== "/") {
    joinedPathname = pathname === "/" ? basename : (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.joinPaths)([basename, pathname]);
  }
  return navigator.createHref({
    pathname: joinedPathname,
    search,
    hash
  });
}

/**
 * Returns true if this component is a descendant of a <Router>.
 *
 * @see https://reactrouter.com/hooks/use-in-router-context
 */
function useInRouterContext() {
  return react__WEBPACK_IMPORTED_MODULE_0__.useContext(LocationContext) != null;
}

/**
 * Returns the current location object, which represents the current URL in web
 * browsers.
 *
 * Note: If you're using this it may mean you're doing some of your own
 * "routing" in your app, and we'd like to know what your use case is. We may
 * be able to provide something higher-level to better suit your needs.
 *
 * @see https://reactrouter.com/hooks/use-location
 */
function useLocation() {
  !useInRouterContext() ?  true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, // TODO: This error is probably because they somehow have 2 versions of the
  // router loaded. We can help them understand how to avoid that.
  "useLocation() may be used only in the context of a <Router> component.") : 0 : void 0;
  return react__WEBPACK_IMPORTED_MODULE_0__.useContext(LocationContext).location;
}

/**
 * Returns the current navigation action which describes how the router came to
 * the current location, either by a pop, push, or replace on the history stack.
 *
 * @see https://reactrouter.com/hooks/use-navigation-type
 */
function useNavigationType() {
  return react__WEBPACK_IMPORTED_MODULE_0__.useContext(LocationContext).navigationType;
}

/**
 * Returns a PathMatch object if the given pattern matches the current URL.
 * This is useful for components that need to know "active" state, e.g.
 * <NavLink>.
 *
 * @see https://reactrouter.com/hooks/use-match
 */
function useMatch(pattern) {
  !useInRouterContext() ?  true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, // TODO: This error is probably because they somehow have 2 versions of the
  // router loaded. We can help them understand how to avoid that.
  "useMatch() may be used only in the context of a <Router> component.") : 0 : void 0;
  let {
    pathname
  } = useLocation();
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.matchPath)(pattern, pathname), [pathname, pattern]);
}

/**
 * The interface for the navigate() function returned from useNavigate().
 */

const navigateEffectWarning = "You should call navigate() in a React.useEffect(), not when " + "your component is first rendered.";

// Mute warnings for calls to useNavigate in SSR environments
function useIsomorphicLayoutEffect(cb) {
  let isStatic = react__WEBPACK_IMPORTED_MODULE_0__.useContext(NavigationContext).static;
  if (!isStatic) {
    // We should be able to get rid of this once react 18.3 is released
    // See: https://github.com/facebook/react/pull/26395
    // eslint-disable-next-line react-hooks/rules-of-hooks
    react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect(cb);
  }
}

/**
 * Returns an imperative method for changing the location. Used by <Link>s, but
 * may also be used by other elements to change the location.
 *
 * @see https://reactrouter.com/hooks/use-navigate
 */
function useNavigate() {
  let {
    isDataRoute
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext);
  // Conditional usage is OK here because the usage of a data router is static
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return isDataRoute ? useNavigateStable() : useNavigateUnstable();
}
function useNavigateUnstable() {
  !useInRouterContext() ?  true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, // TODO: This error is probably because they somehow have 2 versions of the
  // router loaded. We can help them understand how to avoid that.
  "useNavigate() may be used only in the context of a <Router> component.") : 0 : void 0;
  let dataRouterContext = react__WEBPACK_IMPORTED_MODULE_0__.useContext(DataRouterContext);
  let {
    basename,
    navigator
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(NavigationContext);
  let {
    matches
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let routePathnamesJson = JSON.stringify((0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_getPathContributingMatches)(matches).map(match => match.pathnameBase));
  let activeRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(function (to, options) {
    if (options === void 0) {
      options = {};
    }
     true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_warning)(activeRef.current, navigateEffectWarning) : 0;

    // Short circuit here since if this happens on first render the navigate
    // is useless because we haven't wired up our history listener yet
    if (!activeRef.current) return;
    if (typeof to === "number") {
      navigator.go(to);
      return;
    }
    let path = (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.resolveTo)(to, JSON.parse(routePathnamesJson), locationPathname, options.relative === "path");

    // If we're operating within a basename, prepend it to the pathname prior
    // to handing off to history (but only if we're not in a data router,
    // otherwise it'll prepend the basename inside of the router).
    // If this is a root navigation, then we navigate to the raw basename
    // which allows the basename to have full control over the presence of a
    // trailing slash on root links
    if (dataRouterContext == null && basename !== "/") {
      path.pathname = path.pathname === "/" ? basename : (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.joinPaths)([basename, path.pathname]);
    }
    (!!options.replace ? navigator.replace : navigator.push)(path, options.state, options);
  }, [basename, navigator, routePathnamesJson, locationPathname, dataRouterContext]);
  return navigate;
}
const OutletContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);

/**
 * Returns the context (if provided) for the child route at this level of the route
 * hierarchy.
 * @see https://reactrouter.com/hooks/use-outlet-context
 */
function useOutletContext() {
  return react__WEBPACK_IMPORTED_MODULE_0__.useContext(OutletContext);
}

/**
 * Returns the element for the child route at this level of the route
 * hierarchy. Used internally by <Outlet> to render child routes.
 *
 * @see https://reactrouter.com/hooks/use-outlet
 */
function useOutlet(context) {
  let outlet = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext).outlet;
  if (outlet) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(OutletContext.Provider, {
      value: context
    }, outlet);
  }
  return outlet;
}

/**
 * Returns an object of key/value pairs of the dynamic params from the current
 * URL that were matched by the route path.
 *
 * @see https://reactrouter.com/hooks/use-params
 */
function useParams() {
  let {
    matches
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext);
  let routeMatch = matches[matches.length - 1];
  return routeMatch ? routeMatch.params : {};
}

/**
 * Resolves the pathname of the given `to` value against the current location.
 *
 * @see https://reactrouter.com/hooks/use-resolved-path
 */
function useResolvedPath(to, _temp2) {
  let {
    relative
  } = _temp2 === void 0 ? {} : _temp2;
  let {
    matches
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let routePathnamesJson = JSON.stringify((0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_getPathContributingMatches)(matches).map(match => match.pathnameBase));
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.resolveTo)(to, JSON.parse(routePathnamesJson), locationPathname, relative === "path"), [to, routePathnamesJson, locationPathname, relative]);
}

/**
 * Returns the element of the route that matched the current location, prepared
 * with the correct context to render the remainder of the route tree. Route
 * elements in the tree must render an <Outlet> to render their child route's
 * element.
 *
 * @see https://reactrouter.com/hooks/use-routes
 */
function useRoutes(routes, locationArg) {
  return useRoutesImpl(routes, locationArg);
}

// Internal implementation with accept optional param for RouterProvider usage
function useRoutesImpl(routes, locationArg, dataRouterState) {
  !useInRouterContext() ?  true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, // TODO: This error is probably because they somehow have 2 versions of the
  // router loaded. We can help them understand how to avoid that.
  "useRoutes() may be used only in the context of a <Router> component.") : 0 : void 0;
  let {
    navigator
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(NavigationContext);
  let {
    matches: parentMatches
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext);
  let routeMatch = parentMatches[parentMatches.length - 1];
  let parentParams = routeMatch ? routeMatch.params : {};
  let parentPathname = routeMatch ? routeMatch.pathname : "/";
  let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
  let parentRoute = routeMatch && routeMatch.route;
  if (true) {
    // You won't get a warning about 2 different <Routes> under a <Route>
    // without a trailing *, but this is a best-effort warning anyway since we
    // cannot even give the warning unless they land at the parent route.
    //
    // Example:
    //
    // <Routes>
    //   {/* This route path MUST end with /* because otherwise
    //       it will never match /blog/post/123 */}
    //   <Route path="blog" element={<Blog />} />
    //   <Route path="blog/feed" element={<BlogFeed />} />
    // </Routes>
    //
    // function Blog() {
    //   return (
    //     <Routes>
    //       <Route path="post/:id" element={<Post />} />
    //     </Routes>
    //   );
    // }
    let parentPath = parentRoute && parentRoute.path || "";
    warningOnce(parentPathname, !parentRoute || parentPath.endsWith("*"), "You rendered descendant <Routes> (or called `useRoutes()`) at " + ("\"" + parentPathname + "\" (under <Route path=\"" + parentPath + "\">) but the ") + "parent route path has no trailing \"*\". This means if you navigate " + "deeper, the parent won't match anymore and therefore the child " + "routes will never render.\n\n" + ("Please change the parent <Route path=\"" + parentPath + "\"> to <Route ") + ("path=\"" + (parentPath === "/" ? "*" : parentPath + "/*") + "\">."));
  }
  let locationFromContext = useLocation();
  let location;
  if (locationArg) {
    var _parsedLocationArg$pa;
    let parsedLocationArg = typeof locationArg === "string" ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.parsePath)(locationArg) : locationArg;
    !(parentPathnameBase === "/" || ((_parsedLocationArg$pa = parsedLocationArg.pathname) == null ? void 0 : _parsedLocationArg$pa.startsWith(parentPathnameBase))) ?  true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, "When overriding the location using `<Routes location>` or `useRoutes(routes, location)`, " + "the location pathname must begin with the portion of the URL pathname that was " + ("matched by all parent routes. The current pathname base is \"" + parentPathnameBase + "\" ") + ("but pathname \"" + parsedLocationArg.pathname + "\" was given in the `location` prop.")) : 0 : void 0;
    location = parsedLocationArg;
  } else {
    location = locationFromContext;
  }
  let pathname = location.pathname || "/";
  let remainingPathname = parentPathnameBase === "/" ? pathname : pathname.slice(parentPathnameBase.length) || "/";
  let matches = (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.matchRoutes)(routes, {
    pathname: remainingPathname
  });
  if (true) {
     true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_warning)(parentRoute || matches != null, "No routes matched location \"" + location.pathname + location.search + location.hash + "\" ") : 0;
     true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_warning)(matches == null || matches[matches.length - 1].route.element !== undefined || matches[matches.length - 1].route.Component !== undefined, "Matched leaf route at location \"" + location.pathname + location.search + location.hash + "\" " + "does not have an element or Component. This means it will render an <Outlet /> with a " + "null value by default resulting in an \"empty\" page.") : 0;
  }
  let renderedMatches = _renderMatches(matches && matches.map(match => Object.assign({}, match, {
    params: Object.assign({}, parentParams, match.params),
    pathname: (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.joinPaths)([parentPathnameBase,
    // Re-encode pathnames that were decoded inside matchRoutes
    navigator.encodeLocation ? navigator.encodeLocation(match.pathname).pathname : match.pathname]),
    pathnameBase: match.pathnameBase === "/" ? parentPathnameBase : (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.joinPaths)([parentPathnameBase,
    // Re-encode pathnames that were decoded inside matchRoutes
    navigator.encodeLocation ? navigator.encodeLocation(match.pathnameBase).pathname : match.pathnameBase])
  })), parentMatches, dataRouterState);

  // When a user passes in a `locationArg`, the associated routes need to
  // be wrapped in a new `LocationContext.Provider` in order for `useLocation`
  // to use the scoped location instead of the global location.
  if (locationArg && renderedMatches) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(LocationContext.Provider, {
      value: {
        location: _extends({
          pathname: "/",
          search: "",
          hash: "",
          state: null,
          key: "default"
        }, location),
        navigationType: _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.Action.Pop
      }
    }, renderedMatches);
  }
  return renderedMatches;
}
function DefaultErrorComponent() {
  let error = useRouteError();
  let message = (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.isRouteErrorResponse)(error) ? error.status + " " + error.statusText : error instanceof Error ? error.message : JSON.stringify(error);
  let stack = error instanceof Error ? error.stack : null;
  let lightgrey = "rgba(200,200,200, 0.5)";
  let preStyles = {
    padding: "0.5rem",
    backgroundColor: lightgrey
  };
  let codeStyles = {
    padding: "2px 4px",
    backgroundColor: lightgrey
  };
  let devInfo = null;
  if (true) {
    console.error("Error handled by React Router default ErrorBoundary:", error);
    devInfo = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null, "\uD83D\uDCBF Hey developer \uD83D\uDC4B"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("code", {
      style: codeStyles
    }, "ErrorBoundary"), " or", " ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("code", {
      style: codeStyles
    }, "errorElement"), " prop on your route."));
  }
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("h2", null, "Unexpected Application Error!"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", {
    style: {
      fontStyle: "italic"
    }
  }, message), stack ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("pre", {
    style: preStyles
  }, stack) : null, devInfo);
}
const defaultErrorElement = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultErrorComponent, null);
class RenderErrorBoundary extends react__WEBPACK_IMPORTED_MODULE_0__.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: props.location,
      revalidation: props.revalidation,
      error: props.error
    };
  }
  static getDerivedStateFromError(error) {
    return {
      error: error
    };
  }
  static getDerivedStateFromProps(props, state) {
    // When we get into an error state, the user will likely click "back" to the
    // previous page that didn't have an error. Because this wraps the entire
    // application, that will have no effect--the error page continues to display.
    // This gives us a mechanism to recover from the error when the location changes.
    //
    // Whether we're in an error state or not, we update the location in state
    // so that when we are in an error state, it gets reset when a new location
    // comes in and the user recovers from the error.
    if (state.location !== props.location || state.revalidation !== "idle" && props.revalidation === "idle") {
      return {
        error: props.error,
        location: props.location,
        revalidation: props.revalidation
      };
    }

    // If we're not changing locations, preserve the location but still surface
    // any new errors that may come through. We retain the existing error, we do
    // this because the error provided from the app state may be cleared without
    // the location changing.
    return {
      error: props.error || state.error,
      location: state.location,
      revalidation: props.revalidation || state.revalidation
    };
  }
  componentDidCatch(error, errorInfo) {
    console.error("React Router caught the following error during render", error, errorInfo);
  }
  render() {
    return this.state.error ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(RouteContext.Provider, {
      value: this.props.routeContext
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(RouteErrorContext.Provider, {
      value: this.state.error,
      children: this.props.component
    })) : this.props.children;
  }
}
function RenderedRoute(_ref) {
  let {
    routeContext,
    match,
    children
  } = _ref;
  let dataRouterContext = react__WEBPACK_IMPORTED_MODULE_0__.useContext(DataRouterContext);

  // Track how deep we got in our render pass to emulate SSR componentDidCatch
  // in a DataStaticRouter
  if (dataRouterContext && dataRouterContext.static && dataRouterContext.staticContext && (match.route.errorElement || match.route.ErrorBoundary)) {
    dataRouterContext.staticContext._deepestRenderedBoundaryId = match.route.id;
  }
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(RouteContext.Provider, {
    value: routeContext
  }, children);
}
function _renderMatches(matches, parentMatches, dataRouterState) {
  var _dataRouterState2;
  if (parentMatches === void 0) {
    parentMatches = [];
  }
  if (dataRouterState === void 0) {
    dataRouterState = null;
  }
  if (matches == null) {
    var _dataRouterState;
    if ((_dataRouterState = dataRouterState) != null && _dataRouterState.errors) {
      // Don't bail if we have data router errors so we can render them in the
      // boundary.  Use the pre-matched (or shimmed) matches
      matches = dataRouterState.matches;
    } else {
      return null;
    }
  }
  let renderedMatches = matches;

  // If we have data errors, trim matches to the highest error boundary
  let errors = (_dataRouterState2 = dataRouterState) == null ? void 0 : _dataRouterState2.errors;
  if (errors != null) {
    let errorIndex = renderedMatches.findIndex(m => m.route.id && (errors == null ? void 0 : errors[m.route.id]));
    !(errorIndex >= 0) ?  true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, "Could not find a matching route for errors on route IDs: " + Object.keys(errors).join(",")) : 0 : void 0;
    renderedMatches = renderedMatches.slice(0, Math.min(renderedMatches.length, errorIndex + 1));
  }
  return renderedMatches.reduceRight((outlet, match, index) => {
    let error = match.route.id ? errors == null ? void 0 : errors[match.route.id] : null;
    // Only data routers handle errors
    let errorElement = null;
    if (dataRouterState) {
      errorElement = match.route.errorElement || defaultErrorElement;
    }
    let matches = parentMatches.concat(renderedMatches.slice(0, index + 1));
    let getChildren = () => {
      let children;
      if (error) {
        children = errorElement;
      } else if (match.route.Component) {
        // Note: This is a de-optimized path since React won't re-use the
        // ReactElement since it's identity changes with each new
        // React.createElement call.  We keep this so folks can use
        // `<Route Component={...}>` in `<Routes>` but generally `Component`
        // usage is only advised in `RouterProvider` when we can convert it to
        // `element` ahead of time.
        children = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(match.route.Component, null);
      } else if (match.route.element) {
        children = match.route.element;
      } else {
        children = outlet;
      }
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(RenderedRoute, {
        match: match,
        routeContext: {
          outlet,
          matches,
          isDataRoute: dataRouterState != null
        },
        children: children
      });
    };
    // Only wrap in an error boundary within data router usages when we have an
    // ErrorBoundary/errorElement on this route.  Otherwise let it bubble up to
    // an ancestor ErrorBoundary/errorElement
    return dataRouterState && (match.route.ErrorBoundary || match.route.errorElement || index === 0) ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(RenderErrorBoundary, {
      location: dataRouterState.location,
      revalidation: dataRouterState.revalidation,
      component: errorElement,
      error: error,
      children: getChildren(),
      routeContext: {
        outlet: null,
        matches,
        isDataRoute: true
      }
    }) : getChildren();
  }, null);
}
var DataRouterHook = /*#__PURE__*/function (DataRouterHook) {
  DataRouterHook["UseBlocker"] = "useBlocker";
  DataRouterHook["UseRevalidator"] = "useRevalidator";
  DataRouterHook["UseNavigateStable"] = "useNavigate";
  return DataRouterHook;
}(DataRouterHook || {});
var DataRouterStateHook = /*#__PURE__*/function (DataRouterStateHook) {
  DataRouterStateHook["UseBlocker"] = "useBlocker";
  DataRouterStateHook["UseLoaderData"] = "useLoaderData";
  DataRouterStateHook["UseActionData"] = "useActionData";
  DataRouterStateHook["UseRouteError"] = "useRouteError";
  DataRouterStateHook["UseNavigation"] = "useNavigation";
  DataRouterStateHook["UseRouteLoaderData"] = "useRouteLoaderData";
  DataRouterStateHook["UseMatches"] = "useMatches";
  DataRouterStateHook["UseRevalidator"] = "useRevalidator";
  DataRouterStateHook["UseNavigateStable"] = "useNavigate";
  DataRouterStateHook["UseRouteId"] = "useRouteId";
  return DataRouterStateHook;
}(DataRouterStateHook || {});
function getDataRouterConsoleError(hookName) {
  return hookName + " must be used within a data router.  See https://reactrouter.com/routers/picking-a-router.";
}
function useDataRouterContext(hookName) {
  let ctx = react__WEBPACK_IMPORTED_MODULE_0__.useContext(DataRouterContext);
  !ctx ?  true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, getDataRouterConsoleError(hookName)) : 0 : void 0;
  return ctx;
}
function useDataRouterState(hookName) {
  let state = react__WEBPACK_IMPORTED_MODULE_0__.useContext(DataRouterStateContext);
  !state ?  true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, getDataRouterConsoleError(hookName)) : 0 : void 0;
  return state;
}
function useRouteContext(hookName) {
  let route = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext);
  !route ?  true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, getDataRouterConsoleError(hookName)) : 0 : void 0;
  return route;
}

// Internal version with hookName-aware debugging
function useCurrentRouteId(hookName) {
  let route = useRouteContext(hookName);
  let thisRoute = route.matches[route.matches.length - 1];
  !thisRoute.route.id ?  true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, hookName + " can only be used on routes that contain a unique \"id\"") : 0 : void 0;
  return thisRoute.route.id;
}

/**
 * Returns the ID for the nearest contextual route
 */
function useRouteId() {
  return useCurrentRouteId(DataRouterStateHook.UseRouteId);
}

/**
 * Returns the current navigation, defaulting to an "idle" navigation when
 * no navigation is in progress
 */
function useNavigation() {
  let state = useDataRouterState(DataRouterStateHook.UseNavigation);
  return state.navigation;
}

/**
 * Returns a revalidate function for manually triggering revalidation, as well
 * as the current state of any manual revalidations
 */
function useRevalidator() {
  let dataRouterContext = useDataRouterContext(DataRouterHook.UseRevalidator);
  let state = useDataRouterState(DataRouterStateHook.UseRevalidator);
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({
    revalidate: dataRouterContext.router.revalidate,
    state: state.revalidation
  }), [dataRouterContext.router.revalidate, state.revalidation]);
}

/**
 * Returns the active route matches, useful for accessing loaderData for
 * parent/child routes or the route "handle" property
 */
function useMatches() {
  let {
    matches,
    loaderData
  } = useDataRouterState(DataRouterStateHook.UseMatches);
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => matches.map(match => {
    let {
      pathname,
      params
    } = match;
    // Note: This structure matches that created by createUseMatchesMatch
    // in the @remix-run/router , so if you change this please also change
    // that :)  Eventually we'll DRY this up
    return {
      id: match.route.id,
      pathname,
      params,
      data: loaderData[match.route.id],
      handle: match.route.handle
    };
  }), [matches, loaderData]);
}

/**
 * Returns the loader data for the nearest ancestor Route loader
 */
function useLoaderData() {
  let state = useDataRouterState(DataRouterStateHook.UseLoaderData);
  let routeId = useCurrentRouteId(DataRouterStateHook.UseLoaderData);
  if (state.errors && state.errors[routeId] != null) {
    console.error("You cannot `useLoaderData` in an errorElement (routeId: " + routeId + ")");
    return undefined;
  }
  return state.loaderData[routeId];
}

/**
 * Returns the loaderData for the given routeId
 */
function useRouteLoaderData(routeId) {
  let state = useDataRouterState(DataRouterStateHook.UseRouteLoaderData);
  return state.loaderData[routeId];
}

/**
 * Returns the action data for the nearest ancestor Route action
 */
function useActionData() {
  let state = useDataRouterState(DataRouterStateHook.UseActionData);
  let route = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext);
  !route ?  true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, "useActionData must be used inside a RouteContext") : 0 : void 0;
  return Object.values((state == null ? void 0 : state.actionData) || {})[0];
}

/**
 * Returns the nearest ancestor Route error, which could be a loader/action
 * error or a render error.  This is intended to be called from your
 * ErrorBoundary/errorElement to display a proper error message.
 */
function useRouteError() {
  var _state$errors;
  let error = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteErrorContext);
  let state = useDataRouterState(DataRouterStateHook.UseRouteError);
  let routeId = useCurrentRouteId(DataRouterStateHook.UseRouteError);

  // If this was a render error, we put it in a RouteError context inside
  // of RenderErrorBoundary
  if (error) {
    return error;
  }

  // Otherwise look for errors from our data router state
  return (_state$errors = state.errors) == null ? void 0 : _state$errors[routeId];
}

/**
 * Returns the happy-path data from the nearest ancestor <Await /> value
 */
function useAsyncValue() {
  let value = react__WEBPACK_IMPORTED_MODULE_0__.useContext(AwaitContext);
  return value == null ? void 0 : value._data;
}

/**
 * Returns the error from the nearest ancestor <Await /> value
 */
function useAsyncError() {
  let value = react__WEBPACK_IMPORTED_MODULE_0__.useContext(AwaitContext);
  return value == null ? void 0 : value._error;
}
let blockerId = 0;

/**
 * Allow the application to block navigations within the SPA and present the
 * user a confirmation dialog to confirm the navigation.  Mostly used to avoid
 * using half-filled form data.  This does not handle hard-reloads or
 * cross-origin navigations.
 */
function useBlocker(shouldBlock) {
  let {
    router,
    basename
  } = useDataRouterContext(DataRouterHook.UseBlocker);
  let state = useDataRouterState(DataRouterStateHook.UseBlocker);
  let [blockerKey, setBlockerKey] = react__WEBPACK_IMPORTED_MODULE_0__.useState("");
  let blockerFunction = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(arg => {
    if (typeof shouldBlock !== "function") {
      return !!shouldBlock;
    }
    if (basename === "/") {
      return shouldBlock(arg);
    }

    // If they provided us a function and we've got an active basename, strip
    // it from the locations we expose to the user to match the behavior of
    // useLocation
    let {
      currentLocation,
      nextLocation,
      historyAction
    } = arg;
    return shouldBlock({
      currentLocation: _extends({}, currentLocation, {
        pathname: (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.stripBasename)(currentLocation.pathname, basename) || currentLocation.pathname
      }),
      nextLocation: _extends({}, nextLocation, {
        pathname: (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.stripBasename)(nextLocation.pathname, basename) || nextLocation.pathname
      }),
      historyAction
    });
  }, [basename, shouldBlock]);

  // This effect is in charge of blocker key assignment and deletion (which is
  // tightly coupled to the key)
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    let key = String(++blockerId);
    setBlockerKey(key);
    return () => router.deleteBlocker(key);
  }, [router]);

  // This effect handles assigning the blockerFunction.  This is to handle
  // unstable blocker function identities, and happens only after the prior
  // effect so we don't get an orphaned blockerFunction in the router with a
  // key of "".  Until then we just have the IDLE_BLOCKER.
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (blockerKey !== "") {
      router.getBlocker(blockerKey, blockerFunction);
    }
  }, [router, blockerKey, blockerFunction]);

  // Prefer the blocker from `state` not `router.state` since DataRouterContext
  // is memoized so this ensures we update on blocker state updates
  return blockerKey && state.blockers.has(blockerKey) ? state.blockers.get(blockerKey) : _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.IDLE_BLOCKER;
}

/**
 * Stable version of useNavigate that is used when we are in the context of
 * a RouterProvider.
 */
function useNavigateStable() {
  let {
    router
  } = useDataRouterContext(DataRouterHook.UseNavigateStable);
  let id = useCurrentRouteId(DataRouterStateHook.UseNavigateStable);
  let activeRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(function (to, options) {
    if (options === void 0) {
      options = {};
    }
     true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_warning)(activeRef.current, navigateEffectWarning) : 0;

    // Short circuit here since if this happens on first render the navigate
    // is useless because we haven't wired up our router subscriber yet
    if (!activeRef.current) return;
    if (typeof to === "number") {
      router.navigate(to);
    } else {
      router.navigate(to, _extends({
        fromRouteId: id
      }, options));
    }
  }, [router, id]);
  return navigate;
}
const alreadyWarned = {};
function warningOnce(key, cond, message) {
  if (!cond && !alreadyWarned[key]) {
    alreadyWarned[key] = true;
     true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_warning)(false, message) : 0;
  }
}

/**
  Webpack + React 17 fails to compile on any of the following because webpack
  complains that `startTransition` doesn't exist in `React`:
  * import { startTransition } from "react"
  * import * as React from from "react";
    "startTransition" in React ? React.startTransition(() => setState()) : setState()
  * import * as React from from "react";
    "startTransition" in React ? React["startTransition"](() => setState()) : setState()

  Moving it to a constant such as the following solves the Webpack/React 17 issue:
  * import * as React from from "react";
    const START_TRANSITION = "startTransition";
    START_TRANSITION in React ? React[START_TRANSITION](() => setState()) : setState()

  However, that introduces webpack/terser minification issues in production builds
  in React 18 where minification/obfuscation ends up removing the call of
  React.startTransition entirely from the first half of the ternary.  Grabbing
  this exported reference once up front resolves that issue.

  See https://github.com/remix-run/react-router/issues/10579
*/
const START_TRANSITION = "startTransition";
const startTransitionImpl = react__WEBPACK_IMPORTED_MODULE_0__[START_TRANSITION];

/**
 * Given a Remix Router instance, render the appropriate UI
 */
function RouterProvider(_ref) {
  let {
    fallbackElement,
    router,
    future
  } = _ref;
  // Need to use a layout effect here so we are subscribed early enough to
  // pick up on any render-driven redirects/navigations (useEffect/<Navigate>)
  let [state, setStateImpl] = react__WEBPACK_IMPORTED_MODULE_0__.useState(router.state);
  let {
    v7_startTransition
  } = future || {};
  let setState = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(newState => {
    v7_startTransition && startTransitionImpl ? startTransitionImpl(() => setStateImpl(newState)) : setStateImpl(newState);
  }, [setStateImpl, v7_startTransition]);
  react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect(() => router.subscribe(setState), [router, setState]);
  let navigator = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    return {
      createHref: router.createHref,
      encodeLocation: router.encodeLocation,
      go: n => router.navigate(n),
      push: (to, state, opts) => router.navigate(to, {
        state,
        preventScrollReset: opts == null ? void 0 : opts.preventScrollReset
      }),
      replace: (to, state, opts) => router.navigate(to, {
        replace: true,
        state,
        preventScrollReset: opts == null ? void 0 : opts.preventScrollReset
      })
    };
  }, [router]);
  let basename = router.basename || "/";
  let dataRouterContext = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({
    router,
    navigator,
    static: false,
    basename
  }), [router, navigator, basename]);

  // The fragment and {null} here are important!  We need them to keep React 18's
  // useId happy when we are server-rendering since we may have a <script> here
  // containing the hydrated server-side staticContext (from StaticRouterProvider).
  // useId relies on the component tree structure to generate deterministic id's
  // so we need to ensure it remains the same on the client even though
  // we don't need the <script> tag
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(DataRouterContext.Provider, {
    value: dataRouterContext
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(DataRouterStateContext.Provider, {
    value: state
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Router, {
    basename: basename,
    location: state.location,
    navigationType: state.historyAction,
    navigator: navigator
  }, state.initialized ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(DataRoutes, {
    routes: router.routes,
    state: state
  }) : fallbackElement))), null);
}
function DataRoutes(_ref2) {
  let {
    routes,
    state
  } = _ref2;
  return useRoutesImpl(routes, undefined, state);
}
/**
 * A <Router> that stores all entries in memory.
 *
 * @see https://reactrouter.com/router-components/memory-router
 */
function MemoryRouter(_ref3) {
  let {
    basename,
    children,
    initialEntries,
    initialIndex,
    future
  } = _ref3;
  let historyRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef();
  if (historyRef.current == null) {
    historyRef.current = (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.createMemoryHistory)({
      initialEntries,
      initialIndex,
      v5Compat: true
    });
  }
  let history = historyRef.current;
  let [state, setStateImpl] = react__WEBPACK_IMPORTED_MODULE_0__.useState({
    action: history.action,
    location: history.location
  });
  let {
    v7_startTransition
  } = future || {};
  let setState = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(newState => {
    v7_startTransition && startTransitionImpl ? startTransitionImpl(() => setStateImpl(newState)) : setStateImpl(newState);
  }, [setStateImpl, v7_startTransition]);
  react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect(() => history.listen(setState), [history, setState]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Router, {
    basename: basename,
    children: children,
    location: state.location,
    navigationType: state.action,
    navigator: history
  });
}
/**
 * Changes the current location.
 *
 * Note: This API is mostly useful in React.Component subclasses that are not
 * able to use hooks. In functional components, we recommend you use the
 * `useNavigate` hook instead.
 *
 * @see https://reactrouter.com/components/navigate
 */
function Navigate(_ref4) {
  let {
    to,
    replace,
    state,
    relative
  } = _ref4;
  !useInRouterContext() ?  true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, // TODO: This error is probably because they somehow have 2 versions of
  // the router loaded. We can help them understand how to avoid that.
  "<Navigate> may be used only in the context of a <Router> component.") : 0 : void 0;
   true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_warning)(!react__WEBPACK_IMPORTED_MODULE_0__.useContext(NavigationContext).static, "<Navigate> must not be used on the initial render in a <StaticRouter>. " + "This is a no-op, but you should modify your code so the <Navigate> is " + "only ever rendered in response to some user interaction or state change.") : 0;
  let {
    matches
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let navigate = useNavigate();

  // Resolve the path outside of the effect so that when effects run twice in
  // StrictMode they navigate to the same place
  let path = (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.resolveTo)(to, (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_getPathContributingMatches)(matches).map(match => match.pathnameBase), locationPathname, relative === "path");
  let jsonPath = JSON.stringify(path);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => navigate(JSON.parse(jsonPath), {
    replace,
    state,
    relative
  }), [navigate, jsonPath, relative, replace, state]);
  return null;
}
/**
 * Renders the child route's element, if there is one.
 *
 * @see https://reactrouter.com/components/outlet
 */
function Outlet(props) {
  return useOutlet(props.context);
}
/**
 * Declares an element that should be rendered at a certain URL path.
 *
 * @see https://reactrouter.com/components/route
 */
function Route(_props) {
   true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, "A <Route> is only ever to be used as the child of <Routes> element, " + "never rendered directly. Please wrap your <Route> in a <Routes>.") : 0 ;
}
/**
 * Provides location context for the rest of the app.
 *
 * Note: You usually won't render a <Router> directly. Instead, you'll render a
 * router that is more specific to your environment such as a <BrowserRouter>
 * in web browsers or a <StaticRouter> for server rendering.
 *
 * @see https://reactrouter.com/router-components/router
 */
function Router(_ref5) {
  let {
    basename: basenameProp = "/",
    children = null,
    location: locationProp,
    navigationType = _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.Action.Pop,
    navigator,
    static: staticProp = false
  } = _ref5;
  !!useInRouterContext() ?  true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, "You cannot render a <Router> inside another <Router>." + " You should never have more than one in your app.") : 0 : void 0;

  // Preserve trailing slashes on basename, so we can let the user control
  // the enforcement of trailing slashes throughout the app
  let basename = basenameProp.replace(/^\/*/, "/");
  let navigationContext = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({
    basename,
    navigator,
    static: staticProp
  }), [basename, navigator, staticProp]);
  if (typeof locationProp === "string") {
    locationProp = (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.parsePath)(locationProp);
  }
  let {
    pathname = "/",
    search = "",
    hash = "",
    state = null,
    key = "default"
  } = locationProp;
  let locationContext = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    let trailingPathname = (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.stripBasename)(pathname, basename);
    if (trailingPathname == null) {
      return null;
    }
    return {
      location: {
        pathname: trailingPathname,
        search,
        hash,
        state,
        key
      },
      navigationType
    };
  }, [basename, pathname, search, hash, state, key, navigationType]);
   true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_warning)(locationContext != null, "<Router basename=\"" + basename + "\"> is not able to match the URL " + ("\"" + pathname + search + hash + "\" because it does not start with the ") + "basename, so the <Router> won't render anything.") : 0;
  if (locationContext == null) {
    return null;
  }
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(NavigationContext.Provider, {
    value: navigationContext
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(LocationContext.Provider, {
    children: children,
    value: locationContext
  }));
}
/**
 * A container for a nested tree of <Route> elements that renders the branch
 * that best matches the current location.
 *
 * @see https://reactrouter.com/components/routes
 */
function Routes(_ref6) {
  let {
    children,
    location
  } = _ref6;
  return useRoutes(createRoutesFromChildren(children), location);
}
/**
 * Component to use for rendering lazily loaded data from returning defer()
 * in a loader function
 */
function Await(_ref7) {
  let {
    children,
    errorElement,
    resolve
  } = _ref7;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(AwaitErrorBoundary, {
    resolve: resolve,
    errorElement: errorElement
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(ResolveAwait, null, children));
}
var AwaitRenderStatus = /*#__PURE__*/function (AwaitRenderStatus) {
  AwaitRenderStatus[AwaitRenderStatus["pending"] = 0] = "pending";
  AwaitRenderStatus[AwaitRenderStatus["success"] = 1] = "success";
  AwaitRenderStatus[AwaitRenderStatus["error"] = 2] = "error";
  return AwaitRenderStatus;
}(AwaitRenderStatus || {});
const neverSettledPromise = new Promise(() => {});
class AwaitErrorBoundary extends react__WEBPACK_IMPORTED_MODULE_0__.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
  }
  static getDerivedStateFromError(error) {
    return {
      error
    };
  }
  componentDidCatch(error, errorInfo) {
    console.error("<Await> caught the following error during render", error, errorInfo);
  }
  render() {
    let {
      children,
      errorElement,
      resolve
    } = this.props;
    let promise = null;
    let status = AwaitRenderStatus.pending;
    if (!(resolve instanceof Promise)) {
      // Didn't get a promise - provide as a resolved promise
      status = AwaitRenderStatus.success;
      promise = Promise.resolve();
      Object.defineProperty(promise, "_tracked", {
        get: () => true
      });
      Object.defineProperty(promise, "_data", {
        get: () => resolve
      });
    } else if (this.state.error) {
      // Caught a render error, provide it as a rejected promise
      status = AwaitRenderStatus.error;
      let renderError = this.state.error;
      promise = Promise.reject().catch(() => {}); // Avoid unhandled rejection warnings
      Object.defineProperty(promise, "_tracked", {
        get: () => true
      });
      Object.defineProperty(promise, "_error", {
        get: () => renderError
      });
    } else if (resolve._tracked) {
      // Already tracked promise - check contents
      promise = resolve;
      status = promise._error !== undefined ? AwaitRenderStatus.error : promise._data !== undefined ? AwaitRenderStatus.success : AwaitRenderStatus.pending;
    } else {
      // Raw (untracked) promise - track it
      status = AwaitRenderStatus.pending;
      Object.defineProperty(resolve, "_tracked", {
        get: () => true
      });
      promise = resolve.then(data => Object.defineProperty(resolve, "_data", {
        get: () => data
      }), error => Object.defineProperty(resolve, "_error", {
        get: () => error
      }));
    }
    if (status === AwaitRenderStatus.error && promise._error instanceof _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.AbortedDeferredError) {
      // Freeze the UI by throwing a never resolved promise
      throw neverSettledPromise;
    }
    if (status === AwaitRenderStatus.error && !errorElement) {
      // No errorElement, throw to the nearest route-level error boundary
      throw promise._error;
    }
    if (status === AwaitRenderStatus.error) {
      // Render via our errorElement
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(AwaitContext.Provider, {
        value: promise,
        children: errorElement
      });
    }
    if (status === AwaitRenderStatus.success) {
      // Render children with resolved value
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(AwaitContext.Provider, {
        value: promise,
        children: children
      });
    }

    // Throw to the suspense boundary
    throw promise;
  }
}

/**
 * @private
 * Indirection to leverage useAsyncValue for a render-prop API on <Await>
 */
function ResolveAwait(_ref8) {
  let {
    children
  } = _ref8;
  let data = useAsyncValue();
  let toRender = typeof children === "function" ? children(data) : children;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, toRender);
}

///////////////////////////////////////////////////////////////////////////////
// UTILS
///////////////////////////////////////////////////////////////////////////////

/**
 * Creates a route config from a React "children" object, which is usually
 * either a `<Route>` element or an array of them. Used internally by
 * `<Routes>` to create a route config from its children.
 *
 * @see https://reactrouter.com/utils/create-routes-from-children
 */
function createRoutesFromChildren(children, parentPath) {
  if (parentPath === void 0) {
    parentPath = [];
  }
  let routes = [];
  react__WEBPACK_IMPORTED_MODULE_0__.Children.forEach(children, (element, index) => {
    if (! /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.isValidElement(element)) {
      // Ignore non-elements. This allows people to more easily inline
      // conditionals in their route config.
      return;
    }
    let treePath = [...parentPath, index];
    if (element.type === react__WEBPACK_IMPORTED_MODULE_0__.Fragment) {
      // Transparently support React.Fragment and its children.
      routes.push.apply(routes, createRoutesFromChildren(element.props.children, treePath));
      return;
    }
    !(element.type === Route) ?  true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, "[" + (typeof element.type === "string" ? element.type : element.type.name) + "] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>") : 0 : void 0;
    !(!element.props.index || !element.props.children) ?  true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, "An index route cannot have child routes.") : 0 : void 0;
    let route = {
      id: element.props.id || treePath.join("-"),
      caseSensitive: element.props.caseSensitive,
      element: element.props.element,
      Component: element.props.Component,
      index: element.props.index,
      path: element.props.path,
      loader: element.props.loader,
      action: element.props.action,
      errorElement: element.props.errorElement,
      ErrorBoundary: element.props.ErrorBoundary,
      hasErrorBoundary: element.props.ErrorBoundary != null || element.props.errorElement != null,
      shouldRevalidate: element.props.shouldRevalidate,
      handle: element.props.handle,
      lazy: element.props.lazy
    };
    if (element.props.children) {
      route.children = createRoutesFromChildren(element.props.children, treePath);
    }
    routes.push(route);
  });
  return routes;
}

/**
 * Renders the result of `matchRoutes()` into a React element.
 */
function renderMatches(matches) {
  return _renderMatches(matches);
}

function mapRouteProperties(route) {
  let updates = {
    // Note: this check also occurs in createRoutesFromChildren so update
    // there if you change this -- please and thank you!
    hasErrorBoundary: route.ErrorBoundary != null || route.errorElement != null
  };
  if (route.Component) {
    if (true) {
      if (route.element) {
         true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_warning)(false, "You should not include both `Component` and `element` on your route - " + "`Component` will be used.") : 0;
      }
    }
    Object.assign(updates, {
      element: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(route.Component),
      Component: undefined
    });
  }
  if (route.ErrorBoundary) {
    if (true) {
      if (route.errorElement) {
         true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_warning)(false, "You should not include both `ErrorBoundary` and `errorElement` on your route - " + "`ErrorBoundary` will be used.") : 0;
      }
    }
    Object.assign(updates, {
      errorElement: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(route.ErrorBoundary),
      ErrorBoundary: undefined
    });
  }
  return updates;
}
function createMemoryRouter(routes, opts) {
  return (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.createRouter)({
    basename: opts == null ? void 0 : opts.basename,
    future: _extends({}, opts == null ? void 0 : opts.future, {
      v7_prependBasename: true
    }),
    history: (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.createMemoryHistory)({
      initialEntries: opts == null ? void 0 : opts.initialEntries,
      initialIndex: opts == null ? void 0 : opts.initialIndex
    }),
    hydrationData: opts == null ? void 0 : opts.hydrationData,
    routes,
    mapRouteProperties
  }).initialize();
}


//# sourceMappingURL=index.js.map


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ (function(module) {

module.exports = window["React"];

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ (function(module) {

module.exports = window["ReactDOM"];

/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/***/ (function(module) {

module.exports = window["jQuery"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ (function(module) {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "./node_modules/react-toastify/dist/react-toastify.esm.mjs":
/*!*****************************************************************!*\
  !*** ./node_modules/react-toastify/dist/react-toastify.esm.mjs ***!
  \*****************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Bounce: function() { return /* binding */ R; },
/* harmony export */   Flip: function() { return /* binding */ $; },
/* harmony export */   Icons: function() { return /* binding */ E; },
/* harmony export */   Slide: function() { return /* binding */ w; },
/* harmony export */   ToastContainer: function() { return /* binding */ k; },
/* harmony export */   Zoom: function() { return /* binding */ x; },
/* harmony export */   collapseToast: function() { return /* binding */ g; },
/* harmony export */   cssTransition: function() { return /* binding */ h; },
/* harmony export */   toast: function() { return /* binding */ Q; },
/* harmony export */   useToast: function() { return /* binding */ _; },
/* harmony export */   useToastContainer: function() { return /* binding */ C; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! clsx */ "./node_modules/clsx/dist/clsx.m.js");
'use client';
const u=t=>"number"==typeof t&&!isNaN(t),d=t=>"string"==typeof t,p=t=>"function"==typeof t,m=t=>d(t)||p(t)?t:null,f=t=>(0,react__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(t)||d(t)||p(t)||u(t);function g(t,e,n){void 0===n&&(n=300);const{scrollHeight:o,style:s}=t;requestAnimationFrame(()=>{s.minHeight="initial",s.height=o+"px",s.transition=`all ${n}ms`,requestAnimationFrame(()=>{s.height="0",s.padding="0",s.margin="0",setTimeout(e,n)})})}function h(e){let{enter:a,exit:r,appendPosition:i=!1,collapse:l=!0,collapseDuration:c=300}=e;return function(e){let{children:u,position:d,preventExitTransition:p,done:m,nodeRef:f,isIn:h}=e;const y=i?`${a}--${d}`:a,v=i?`${r}--${d}`:r,T=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(0);return (0,react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(()=>{const t=f.current,e=y.split(" "),n=o=>{o.target===f.current&&(t.dispatchEvent(new Event("d")),t.removeEventListener("animationend",n),t.removeEventListener("animationcancel",n),0===T.current&&"animationcancel"!==o.type&&t.classList.remove(...e))};t.classList.add(...e),t.addEventListener("animationend",n),t.addEventListener("animationcancel",n)},[]),(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{const t=f.current,e=()=>{t.removeEventListener("animationend",e),l?g(t,m,c):m()};h||(p?e():(T.current=1,t.className+=` ${v}`,t.addEventListener("animationend",e)))},[h]),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,u)}}function y(t,e){return null!=t?{content:t.content,containerId:t.props.containerId,id:t.props.toastId,theme:t.props.theme,type:t.props.type,data:t.props.data||{},isLoading:t.props.isLoading,icon:t.props.icon,status:e}:{}}const v={list:new Map,emitQueue:new Map,on(t,e){return this.list.has(t)||this.list.set(t,[]),this.list.get(t).push(e),this},off(t,e){if(e){const n=this.list.get(t).filter(t=>t!==e);return this.list.set(t,n),this}return this.list.delete(t),this},cancelEmit(t){const e=this.emitQueue.get(t);return e&&(e.forEach(clearTimeout),this.emitQueue.delete(t)),this},emit(t){this.list.has(t)&&this.list.get(t).forEach(e=>{const n=setTimeout(()=>{e(...[].slice.call(arguments,1))},0);this.emitQueue.has(t)||this.emitQueue.set(t,[]),this.emitQueue.get(t).push(n)})}},T=e=>{let{theme:n,type:o,...s}=e;return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",{viewBox:"0 0 24 24",width:"100%",height:"100%",fill:"colored"===n?"currentColor":`var(--toastify-icon-color-${o})`,...s})},E={info:function(e){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(T,{...e},react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{d:"M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z"}))},warning:function(e){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(T,{...e},react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{d:"M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z"}))},success:function(e){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(T,{...e},react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{d:"M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"}))},error:function(e){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(T,{...e},react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{d:"M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"}))},spinner:function(){return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"Toastify__spinner"})}};function C(t){const[,o]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useReducer)(t=>t+1,0),[l,c]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),g=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null),h=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(new Map).current,T=t=>-1!==l.indexOf(t),C=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)({toastKey:1,displayedToast:0,count:0,queue:[],props:t,containerId:null,isToastActive:T,getToast:t=>h.get(t)}).current;function b(t){let{containerId:e}=t;const{limit:n}=C.props;!n||e&&C.containerId!==e||(C.count-=C.queue.length,C.queue=[])}function I(t){c(e=>null==t?[]:e.filter(e=>e!==t))}function _(){const{toastContent:t,toastProps:e,staleId:n}=C.queue.shift();O(t,e,n)}function L(t,n){let{delay:s,staleId:r,...i}=n;if(!f(t)||function(t){return!g.current||C.props.enableMultiContainer&&t.containerId!==C.props.containerId||h.has(t.toastId)&&null==t.updateId}(i))return;const{toastId:l,updateId:c,data:T}=i,{props:b}=C,L=()=>I(l),N=null==c;N&&C.count++;const M={...b,style:b.toastStyle,key:C.toastKey++,...Object.fromEntries(Object.entries(i).filter(t=>{let[e,n]=t;return null!=n})),toastId:l,updateId:c,data:T,closeToast:L,isIn:!1,className:m(i.className||b.toastClassName),bodyClassName:m(i.bodyClassName||b.bodyClassName),progressClassName:m(i.progressClassName||b.progressClassName),autoClose:!i.isLoading&&(R=i.autoClose,w=b.autoClose,!1===R||u(R)&&R>0?R:w),deleteToast(){const t=y(h.get(l),"removed");h.delete(l),v.emit(4,t);const e=C.queue.length;if(C.count=null==l?C.count-C.displayedToast:C.count-1,C.count<0&&(C.count=0),e>0){const t=null==l?C.props.limit:1;if(1===e||1===t)C.displayedToast++,_();else{const n=t>e?e:t;C.displayedToast=n;for(let t=0;t<n;t++)_()}}else o()}};var R,w;M.iconOut=function(t){let{theme:n,type:o,isLoading:s,icon:r}=t,i=null;const l={theme:n,type:o};return!1===r||(p(r)?i=r(l):(0,react__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(r)?i=(0,react__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(r,l):d(r)||u(r)?i=r:s?i=E.spinner():(t=>t in E)(o)&&(i=E[o](l))),i}(M),p(i.onOpen)&&(M.onOpen=i.onOpen),p(i.onClose)&&(M.onClose=i.onClose),M.closeButton=b.closeButton,!1===i.closeButton||f(i.closeButton)?M.closeButton=i.closeButton:!0===i.closeButton&&(M.closeButton=!f(b.closeButton)||b.closeButton);let x=t;(0,react__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(t)&&!d(t.type)?x=(0,react__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(t,{closeToast:L,toastProps:M,data:T}):p(t)&&(x=t({closeToast:L,toastProps:M,data:T})),b.limit&&b.limit>0&&C.count>b.limit&&N?C.queue.push({toastContent:x,toastProps:M,staleId:r}):u(s)?setTimeout(()=>{O(x,M,r)},s):O(x,M,r)}function O(t,e,n){const{toastId:o}=e;n&&h.delete(n);const s={content:t,props:e};h.set(o,s),c(t=>[...t,o].filter(t=>t!==n)),v.emit(4,y(s,null==s.props.updateId?"added":"updated"))}return (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>(C.containerId=t.containerId,v.cancelEmit(3).on(0,L).on(1,t=>g.current&&I(t)).on(5,b).emit(2,C),()=>{h.clear(),v.emit(3,C)}),[]),(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{C.props=t,C.isToastActive=T,C.displayedToast=l.length}),{getToastToRender:function(e){const n=new Map,o=Array.from(h.values());return t.newestOnTop&&o.reverse(),o.forEach(t=>{const{position:e}=t.props;n.has(e)||n.set(e,[]),n.get(e).push(t)}),Array.from(n,t=>e(t[0],t[1]))},containerRef:g,isToastActive:T}}function b(t){return t.targetTouches&&t.targetTouches.length>=1?t.targetTouches[0].clientX:t.clientX}function I(t){return t.targetTouches&&t.targetTouches.length>=1?t.targetTouches[0].clientY:t.clientY}function _(t){const[o,a]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(!1),[r,l]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(!1),c=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null),u=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)({start:0,x:0,y:0,delta:0,removalDistance:0,canCloseOnClick:!0,canDrag:!1,boundingRect:null,didMove:!1}).current,d=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(t),{autoClose:m,pauseOnHover:f,closeToast:g,onClick:h,closeOnClick:y}=t;function v(e){if(t.draggable){"touchstart"===e.nativeEvent.type&&e.nativeEvent.preventDefault(),u.didMove=!1,document.addEventListener("mousemove",_),document.addEventListener("mouseup",L),document.addEventListener("touchmove",_),document.addEventListener("touchend",L);const n=c.current;u.canCloseOnClick=!0,u.canDrag=!0,u.boundingRect=n.getBoundingClientRect(),n.style.transition="",u.x=b(e.nativeEvent),u.y=I(e.nativeEvent),"x"===t.draggableDirection?(u.start=u.x,u.removalDistance=n.offsetWidth*(t.draggablePercent/100)):(u.start=u.y,u.removalDistance=n.offsetHeight*(80===t.draggablePercent?1.5*t.draggablePercent:t.draggablePercent/100))}}function T(e){if(u.boundingRect){const{top:n,bottom:o,left:s,right:a}=u.boundingRect;"touchend"!==e.nativeEvent.type&&t.pauseOnHover&&u.x>=s&&u.x<=a&&u.y>=n&&u.y<=o?C():E()}}function E(){a(!0)}function C(){a(!1)}function _(e){const n=c.current;u.canDrag&&n&&(u.didMove=!0,o&&C(),u.x=b(e),u.y=I(e),u.delta="x"===t.draggableDirection?u.x-u.start:u.y-u.start,u.start!==u.x&&(u.canCloseOnClick=!1),n.style.transform=`translate${t.draggableDirection}(${u.delta}px)`,n.style.opacity=""+(1-Math.abs(u.delta/u.removalDistance)))}function L(){document.removeEventListener("mousemove",_),document.removeEventListener("mouseup",L),document.removeEventListener("touchmove",_),document.removeEventListener("touchend",L);const e=c.current;if(u.canDrag&&u.didMove&&e){if(u.canDrag=!1,Math.abs(u.delta)>u.removalDistance)return l(!0),void t.closeToast();e.style.transition="transform 0.2s, opacity 0.2s",e.style.transform=`translate${t.draggableDirection}(0)`,e.style.opacity="1"}}(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{d.current=t}),(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>(c.current&&c.current.addEventListener("d",E,{once:!0}),p(t.onOpen)&&t.onOpen((0,react__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(t.children)&&t.children.props),()=>{const t=d.current;p(t.onClose)&&t.onClose((0,react__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(t.children)&&t.children.props)}),[]),(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>(t.pauseOnFocusLoss&&(document.hasFocus()||C(),window.addEventListener("focus",E),window.addEventListener("blur",C)),()=>{t.pauseOnFocusLoss&&(window.removeEventListener("focus",E),window.removeEventListener("blur",C))}),[t.pauseOnFocusLoss]);const O={onMouseDown:v,onTouchStart:v,onMouseUp:T,onTouchEnd:T};return m&&f&&(O.onMouseEnter=C,O.onMouseLeave=E),y&&(O.onClick=t=>{h&&h(t),u.canCloseOnClick&&g()}),{playToast:E,pauseToast:C,isRunning:o,preventExitTransition:r,toastRef:c,eventHandlers:O}}function L(e){let{closeToast:n,theme:o,ariaLabel:s="close"}=e;return react__WEBPACK_IMPORTED_MODULE_0__.createElement("button",{className:`Toastify__close-button Toastify__close-button--${o}`,type:"button",onClick:t=>{t.stopPropagation(),n(t)},"aria-label":s},react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",{"aria-hidden":"true",viewBox:"0 0 14 16"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fillRule:"evenodd",d:"M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"})))}function O(e){let{delay:n,isRunning:o,closeToast:s,type:a="default",hide:r,className:i,style:l,controlledProgress:u,progress:d,rtl:m,isIn:f,theme:g}=e;const h=r||u&&0===d,y={...l,animationDuration:`${n}ms`,animationPlayState:o?"running":"paused",opacity:h?0:1};u&&(y.transform=`scaleX(${d})`);const v=(0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])("Toastify__progress-bar",u?"Toastify__progress-bar--controlled":"Toastify__progress-bar--animated",`Toastify__progress-bar-theme--${g}`,`Toastify__progress-bar--${a}`,{"Toastify__progress-bar--rtl":m}),T=p(i)?i({rtl:m,type:a,defaultClassName:v}):(0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])(v,i);return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{role:"progressbar","aria-hidden":h?"true":"false","aria-label":"notification timer",className:T,style:y,[u&&d>=1?"onTransitionEnd":"onAnimationEnd"]:u&&d<1?null:()=>{f&&s()}})}const N=n=>{const{isRunning:o,preventExitTransition:s,toastRef:r,eventHandlers:i}=_(n),{closeButton:l,children:u,autoClose:d,onClick:m,type:f,hideProgressBar:g,closeToast:h,transition:y,position:v,className:T,style:E,bodyClassName:C,bodyStyle:b,progressClassName:I,progressStyle:N,updateId:M,role:R,progress:w,rtl:x,toastId:$,deleteToast:k,isIn:P,isLoading:B,iconOut:D,closeOnClick:A,theme:z}=n,F=(0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])("Toastify__toast",`Toastify__toast-theme--${z}`,`Toastify__toast--${f}`,{"Toastify__toast--rtl":x},{"Toastify__toast--close-on-click":A}),H=p(T)?T({rtl:x,position:v,type:f,defaultClassName:F}):(0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])(F,T),S=!!w||!d,q={closeToast:h,type:f,theme:z};let Q=null;return!1===l||(Q=p(l)?l(q):(0,react__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(l)?(0,react__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(l,q):L(q)),react__WEBPACK_IMPORTED_MODULE_0__.createElement(y,{isIn:P,done:k,position:v,preventExitTransition:s,nodeRef:r},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{id:$,onClick:m,className:H,...i,style:E,ref:r},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{...P&&{role:R},className:p(C)?C({type:f}):(0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])("Toastify__toast-body",C),style:b},null!=D&&react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:(0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])("Toastify__toast-icon",{"Toastify--animate-icon Toastify__zoom-enter":!B})},D),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,u)),Q,react__WEBPACK_IMPORTED_MODULE_0__.createElement(O,{...M&&!S?{key:`pb-${M}`}:{},rtl:x,theme:z,delay:d,isRunning:o,isIn:P,closeToast:h,hide:g,type:f,style:N,className:I,controlledProgress:S,progress:w||0})))},M=function(t,e){return void 0===e&&(e=!1),{enter:`Toastify--animate Toastify__${t}-enter`,exit:`Toastify--animate Toastify__${t}-exit`,appendPosition:e}},R=h(M("bounce",!0)),w=h(M("slide",!0)),x=h(M("zoom")),$=h(M("flip")),k=(0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)((e,n)=>{const{getToastToRender:o,containerRef:a,isToastActive:r}=C(e),{className:i,style:l,rtl:u,containerId:d}=e;function f(t){const e=(0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])("Toastify__toast-container",`Toastify__toast-container--${t}`,{"Toastify__toast-container--rtl":u});return p(i)?i({position:t,rtl:u,defaultClassName:e}):(0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])(e,m(i))}return (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{n&&(n.current=a.current)},[]),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{ref:a,className:"Toastify",id:d},o((e,n)=>{const o=n.length?{...l}:{...l,pointerEvents:"none"};return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:f(e),style:o,key:`container-${e}`},n.map((e,o)=>{let{content:s,props:a}=e;return react__WEBPACK_IMPORTED_MODULE_0__.createElement(N,{...a,isIn:r(a.toastId),style:{...a.style,"--nth":o+1,"--len":n.length},key:`toast-${a.key}`},s)}))}))});k.displayName="ToastContainer",k.defaultProps={position:"top-right",transition:R,autoClose:5e3,closeButton:L,pauseOnHover:!0,pauseOnFocusLoss:!0,closeOnClick:!0,draggable:!0,draggablePercent:80,draggableDirection:"x",role:"alert",theme:"light"};let P,B=new Map,D=[],A=1;function z(){return""+A++}function F(t){return t&&(d(t.toastId)||u(t.toastId))?t.toastId:z()}function H(t,e){return B.size>0?v.emit(0,t,e):D.push({content:t,options:e}),e.toastId}function S(t,e){return{...e,type:e&&e.type||t,toastId:F(e)}}function q(t){return(e,n)=>H(e,S(t,n))}function Q(t,e){return H(t,S("default",e))}Q.loading=(t,e)=>H(t,S("default",{isLoading:!0,autoClose:!1,closeOnClick:!1,closeButton:!1,draggable:!1,...e})),Q.promise=function(t,e,n){let o,{pending:s,error:a,success:r}=e;s&&(o=d(s)?Q.loading(s,n):Q.loading(s.render,{...n,...s}));const i={isLoading:null,autoClose:null,closeOnClick:null,closeButton:null,draggable:null},l=(t,e,s)=>{if(null==e)return void Q.dismiss(o);const a={type:t,...i,...n,data:s},r=d(e)?{render:e}:e;return o?Q.update(o,{...a,...r}):Q(r.render,{...a,...r}),s},c=p(t)?t():t;return c.then(t=>l("success",r,t)).catch(t=>l("error",a,t)),c},Q.success=q("success"),Q.info=q("info"),Q.error=q("error"),Q.warning=q("warning"),Q.warn=Q.warning,Q.dark=(t,e)=>H(t,S("default",{theme:"dark",...e})),Q.dismiss=t=>{B.size>0?v.emit(1,t):D=D.filter(e=>null!=t&&e.options.toastId!==t)},Q.clearWaitingQueue=function(t){return void 0===t&&(t={}),v.emit(5,t)},Q.isActive=t=>{let e=!1;return B.forEach(n=>{n.isToastActive&&n.isToastActive(t)&&(e=!0)}),e},Q.update=function(t,e){void 0===e&&(e={}),setTimeout(()=>{const n=function(t,e){let{containerId:n}=e;const o=B.get(n||P);return o&&o.getToast(t)}(t,e);if(n){const{props:o,content:s}=n,a={delay:100,...o,...e,toastId:e.toastId||t,updateId:z()};a.toastId!==t&&(a.staleId=t);const r=a.render||s;delete a.render,H(r,a)}},0)},Q.done=t=>{Q.update(t,{progress:1})},Q.onChange=t=>(v.on(4,t),()=>{v.off(4,t)}),Q.POSITION={TOP_LEFT:"top-left",TOP_RIGHT:"top-right",TOP_CENTER:"top-center",BOTTOM_LEFT:"bottom-left",BOTTOM_RIGHT:"bottom-right",BOTTOM_CENTER:"bottom-center"},Q.TYPE={INFO:"info",SUCCESS:"success",WARNING:"warning",ERROR:"error",DEFAULT:"default"},v.on(2,t=>{P=t.containerId||t,B.set(P,t),D.forEach(t=>{v.emit(0,t.content,t.options)}),D=[]}).on(3,t=>{B.delete(t.containerId||t),0===B.size&&v.off(0).off(1).off(5)});
//# sourceMappingURL=react-toastify.esm.mjs.map


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_App__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/App */ "./src/components/App.tsx");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/dist/index.js");



wp.element.render((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_2__.HashRouter, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_App__WEBPACK_IMPORTED_MODULE_1__["default"], null)), document.getElementById('simpleform-app-root'));
}();
/******/ })()
;
//# sourceMappingURL=index.js.map