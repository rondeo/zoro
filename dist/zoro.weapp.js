if (typeof Promise !== 'function') {
  throw new TypeError('A global Promise is required');
}

if (typeof Promise.prototype["finally"] !== 'function') {
  var speciesConstructor = function speciesConstructor(O, defaultConstructor) {
    if (!O || typeof O !== 'object' && typeof O !== 'function') {
      throw new TypeError('Assertion failed: Type(O) is not Object');
    }

    var C = O.constructor;

    if (typeof C === 'undefined') {
      return defaultConstructor;
    }

    if (!C || typeof C !== 'object' && typeof C !== 'function') {
      throw new TypeError('O.constructor is not an Object');
    }

    var S = typeof Symbol === 'function' && typeof Symbol.species === 'symbol' ? C[Symbol.species] : undefined;

    if (S == null) {
      return defaultConstructor;
    }

    if (typeof S === 'function' && S.prototype) {
      return S;
    }

    throw new TypeError('no constructor found');
  };

  var shim = {
    "finally": function _finally(onFinally) {
      var promise = this;

      if (typeof promise !== 'object' || promise === null) {
        throw new TypeError('"this" value is not an Object');
      }

      var C = speciesConstructor(promise, Promise); // throws if SpeciesConstructor throws

      if (typeof onFinally !== 'function') {
        return Promise.prototype.then.call(promise, onFinally, onFinally);
      }

      return Promise.prototype.then.call(promise, function (x) {
        return new C(function (resolve) {
          return resolve(onFinally());
        }).then(function () {
          return x;
        });
      }, function (e) {
        return new C(function (resolve) {
          return resolve(onFinally());
        }).then(function () {
          throw e;
        });
      });
    }
  };
  Object.defineProperty(Promise.prototype, 'finally', {
    configurable: true,
    writable: true,
    value: shim["finally"]
  });
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
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

function symbolObservablePonyfill(root) {
	var result;
	var Symbol = root.Symbol;

	if (typeof Symbol === 'function') {
		if (Symbol.observable) {
			result = Symbol.observable;
		} else {
			result = Symbol('observable');
			Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
}

/* global window */

var root;

if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (typeof module !== 'undefined') {
  root = module;
} else {
  root = Function('return this')();
}

var result = symbolObservablePonyfill(root);

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var randomString = function randomString() {
  return Math.random().toString(36).substring(7).split('').join('.');
};

var ActionTypes = {
  INIT: "@@redux/INIT" + randomString(),
  REPLACE: "@@redux/REPLACE" + randomString(),
  PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
    return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
  }
};

/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */
function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false;
  var proto = obj;

  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}

/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [preloadedState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} [enhancer] The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */

function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
    throw new Error('It looks like you are passing several store enhancers to ' + 'createStore(). This is not supported. Instead, compose them ' + 'together to a single function');
  }

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }
  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */


  function getState() {
    if (isDispatching) {
      throw new Error('You may not call store.getState() while the reducer is executing. ' + 'The reducer has already received the state as an argument. ' + 'Pass it down from the top reducer instead of reading it from the store.');
    }

    return currentState;
  }
  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */


  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected the listener to be a function.');
    }

    if (isDispatching) {
      throw new Error('You may not call store.subscribe() while the reducer is executing. ' + 'If you would like to be notified after the store has been updated, subscribe from a ' + 'component and invoke store.getState() in the callback to access the latest state. ' + 'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.');
    }

    var isSubscribed = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      if (isDispatching) {
        throw new Error('You may not unsubscribe from a store listener while the reducer is executing. ' + 'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.');
      }

      isSubscribed = false;
      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }
  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */


  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;

    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }
  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */


  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({
      type: ActionTypes.REPLACE
    });
  }
  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */


  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object' || observer === null) {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return {
          unsubscribe: unsubscribe
        };
      }
    }, _ref[result] = function () {
      return this;
    }, _ref;
  } // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.


  dispatch({
    type: ActionTypes.INIT
  });
  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[result] = observable, _ref2;
}

function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionDescription = actionType && "action \"" + String(actionType) + "\"" || 'an action';
  return "Given " + actionDescription + ", reducer \"" + key + "\" returned undefined. " + "To ignore an action, you must explicitly return the previous state. " + "If you want this reducer to hold no value, you can return null instead of undefined.";
}

function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, {
      type: ActionTypes.INIT
    });

    if (typeof initialState === 'undefined') {
      throw new Error("Reducer \"" + key + "\" returned undefined during initialization. " + "If the state passed to the reducer is undefined, you must " + "explicitly return the initial state. The initial state may " + "not be undefined. If you don't want to set a value for this reducer, " + "you can use null instead of undefined.");
    }

    if (typeof reducer(undefined, {
      type: ActionTypes.PROBE_UNKNOWN_ACTION()
    }) === 'undefined') {
      throw new Error("Reducer \"" + key + "\" returned undefined when probed with a random type. " + ("Don't try to handle " + ActionTypes.INIT + " or other actions in \"redux/*\" ") + "namespace. They are considered private. Instead, you must return the " + "current state for any unknown actions, unless it is undefined, " + "in which case you must return the initial state, regardless of the " + "action type. The initial state may not be undefined, but can be null.");
    }
  });
}
/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */


function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};

  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }

  var finalReducerKeys = Object.keys(finalReducers);

  var shapeAssertionError;

  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }

  return function combination(state, action) {
    if (state === void 0) {
      state = {};
    }

    if (shapeAssertionError) {
      throw shapeAssertionError;
    }

    var hasChanged = false;
    var nextState = {};

    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer = finalReducers[_key];
      var previousStateForKey = state[_key];
      var nextStateForKey = reducer(previousStateForKey, action);

      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(_key, action);
        throw new Error(errorMessage);
      }

      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }

    return hasChanged ? nextState : state;
  };
}

function _defineProperty$1(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread$1(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty$1(target, key, source[key]);
    });
  }

  return target;
}

/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */
function compose() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(void 0, arguments));
    };
  });
}

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */

function applyMiddleware() {
  for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function () {
      var store = createStore.apply(void 0, arguments);

      var _dispatch = function dispatch() {
        throw new Error("Dispatching while constructing your middleware is not allowed. " + "Other middleware would not be applied to this dispatch.");
      };

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch() {
          return _dispatch.apply(void 0, arguments);
        }
      };
      var chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = compose.apply(void 0, chain)(store.dispatch);
      return _objectSpread$1({}, store, {
        dispatch: _dispatch
      });
    };
  };
}

var NAMESPACE_DIVIDER = '/';
var PLUGIN_EVENT = {
  INJECT_INITIAL_STATE: 'injectInitialState',
  BEFORE_INJECT_MODEL: 'beforeInjectModel',
  INJECT_MODELS: 'injectModels',
  AFTER_INJECT_MODEL: 'afterInjectModel',
  INJECT_MIDDLEWARES: 'injectMiddlewares',
  INJECT_ENHANCERS: 'injectEnhancers',
  ON_REDUCER: 'onReducer',
  ON_CREATE_MODEL: 'onCreateModel',
  ON_SETUP_MODEL: 'onSetupModel',
  ON_WILL_EFFECT: 'onWillEffect',
  ON_DID_EFFECT: 'onDidEffect',
  ON_WILL_ACTION: 'onWillAction',
  ON_DID_ACTION: 'onDidAction',
  ON_SETUP: 'onSetup',
  ON_SUBSCRIBE: 'onSubscribe',
  ON_ERROR: 'onError',
  ON_WILL_CONNECT: 'onWillConnect',
  ON_DID_CONNECT: 'onDidConnect'
};
var INTERCEPT_ACTION = 'INTERCEPT_ACTION';
var INTERCEPT_EFFECT = 'INTERCEPT_EFFECT';
var INTERCEPT_TYPE = [INTERCEPT_ACTION, INTERCEPT_EFFECT];

var isArray = function isArray(arr) {
  return arr instanceof Array;
};
var isObject = function isObject(obj) {
  return obj !== null && typeof obj === 'object' && !isArray(obj);
};
var isBoolean = function isBoolean(bool) {
  return typeof bool === 'boolean';
};
var isFunction = function isFunction(func) {
  return typeof func === 'function';
};
var isUndefined = function isUndefined(undef) {
  return typeof undef === 'undefined';
};
var isString = function isString(str) {
  return typeof str === 'string';
};
var isAction = function isAction(action) {
  return isObject(action) && isString(action.type);
};
var assert = function assert(validate, message) {
  if (isBoolean(validate) && !validate || isFunction(validate) && !validate()) {
    throw new Error(message);
  }
};
var warn = function warn(validate, message) {
  if (isBoolean(validate) && !validate || isFunction(validate) && !validate()) {
    console.warn(message);
  }
};
var splitType = function splitType(type, divider) {
  if (divider === void 0) {
    divider = NAMESPACE_DIVIDER;
  }

  var types = type.split(divider);
  assert(types.length > 1, "the model action type is not include the namespace, the type is " + type);
  return {
    namespace: types.slice(0, types.length - 1).join(divider),
    type: types.slice(-1)
  };
};
var noop = function noop() {};
function putCreator(store, namespace) {
  if (!namespace) {
    return store.dispatch;
  }

  return function (_ref) {
    var type = _ref.type,
        rest = _objectWithoutPropertiesLoose(_ref, ["type"]);

    assert(!!type, 'the action you dispatch is not a correct format, we need a type property');
    var types = type.split(NAMESPACE_DIVIDER);

    if (types.length >= 2) {
      var _namespace = types.slice(0, types.length - 1).join(NAMESPACE_DIVIDER);

      if (_namespace === namespace) {
        warn(false, "we don't need the dispatch with namespace, if you call in the model, [" + type + "]");
      }

      return store.dispatch(_objectSpread({
        type: type
      }, rest));
    }

    return store.dispatch(_objectSpread({
      type: "" + namespace + NAMESPACE_DIVIDER + type
    }, rest));
  };
}
function selectCreator(store, namespace) {
  return function (handler) {
    var state = store.getState();

    if (namespace && state[namespace]) {
      state = state[namespace];
    }

    if (!isFunction(handler)) {
      return state;
    }

    return handler(state);
  };
}
function isSupportProxy() {
  return typeof Proxy === 'function';
}
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (placeholder) {
    var random = Math.floor(Math.random() * 16);
    var value = placeholder === 'x' ? random : random & 0x3 | 0x8;
    return value.toString(16);
  });
}

/*
 * createReducer
 * @param initialState{Any} default state
 * @param handlers{Object}
 *
 * example
 * prop: createReducer(initialState, { [ACTION_TYPE]: (action, state) => to do })
 */

var _createReducer = (function (initialState, handlers) {
  if (handlers === void 0) {
    handlers = {};
  }

  assert(isObject(handlers), 'the second argument of createReducer should be an object');
  return function (state, action) {
    if (state === void 0) {
      state = initialState;
    }

    if ({}.hasOwnProperty.call(handlers, action.type)) {
      var handler = handlers[action.type];
      assert(isFunction(handler), "the reducer handler should be a function, but we get " + typeof handler);
      return handler(action, state);
    }

    return state;
  };
});

var assertOpts = function assertOpts(_ref) {
  var namespace = _ref.namespace,
      reducers = _ref.reducers,
      effects = _ref.effects,
      setup = _ref.setup;
  assert(!!namespace, "the model's namespace is necessary, but we get " + namespace);
  assert(isObject(reducers), "the " + namespace + " model reducers must an Object, but we get " + typeof reducers);
  assert(isObject(effects), "the " + namespace + " model effects must an Object, but we get " + typeof effects);
  assert(isFunction(setup), "the " + namespace + " setup must be a Function, but we get " + typeof setup);
};

var Model =
/*#__PURE__*/
function () {
  function Model(opts) {
    var namespace = opts.namespace,
        state = opts.state,
        _opts$reducers = opts.reducers,
        reducers = _opts$reducers === void 0 ? {} : _opts$reducers,
        _opts$effects = opts.effects,
        effects = _opts$effects === void 0 ? {} : _opts$effects,
        _opts$setup = opts.setup,
        setup = _opts$setup === void 0 ? noop : _opts$setup;
    assertOpts({
      namespace: namespace,
      reducers: reducers,
      effects: effects,
      setup: setup
    });
    this.namespace = namespace;
    this.defaultState = state;
    this.reducers = this.createReducer(reducers);
    this.effects = this.createEffects(effects);
    this.actions = this.createActions(_objectSpread({}, reducers, effects));
    this.handleSetup = setup;
  }

  var _proto = Model.prototype;

  _proto.getNamespace = function getNamespace() {
    return this.namespace;
  };

  _proto.getEffects = function getEffects() {
    return this.effects;
  };

  _proto.getReducers = function getReducers() {
    return this.reducers;
  };

  _proto.getDefaultState = function getDefaultState() {
    return this.defaultState;
  };

  _proto.getActions = function getActions() {
    return this.actions;
  };

  _proto.createActionType = function createActionType(type) {
    return "" + this.namespace + NAMESPACE_DIVIDER + type;
  };

  _proto.createReducer = function createReducer(reducers) {
    var _this = this;

    var _reducers = Object.keys(reducers).reduce(function (combine, key) {
      var _objectSpread2;

      var reducer = reducers[key];

      var type = _this.createActionType(key);

      assert(isFunction(reducer), "the reducer must be an function, but we get " + typeof reducer + " with type " + type);
      return _objectSpread({}, combine, (_objectSpread2 = {}, _objectSpread2[type] = reducer, _objectSpread2));
    }, {});

    return _createReducer(this.defaultState || null, _reducers);
  };

  _proto.createActions = function createActions(actions) {
    var _that = this;

    return Object.keys(actions).reduce(function (combine, name) {
      var _objectSpread3;

      return _objectSpread({}, combine, (_objectSpread3 = {}, _objectSpread3[name] = function (payload, meta, error) {
        return {
          type: _that.createActionType(name),
          payload: payload,
          meta: meta,
          error: error
        };
      }, _objectSpread3));
    }, {});
  };

  _proto.createEffects = function createEffects(effects) {
    var _this2 = this;

    return Object.keys(effects).reduce(function (combine, key) {
      var _objectSpread4;

      var effect = effects[key];

      var type = _this2.createActionType(key);

      assert(isFunction(effect), "the effect must be an function, but we get " + typeof effect + " with type " + type);
      return _objectSpread({}, combine, (_objectSpread4 = {}, _objectSpread4[type] = effect, _objectSpread4));
    }, {});
  };

  return Model;
}();

var PluginEvent =
/*#__PURE__*/
function () {
  function PluginEvent() {
    this.handlers = {};
  }

  var _proto = PluginEvent.prototype;

  _proto.emit = function emit(name) {
    for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }

    assert(typeof name === 'string', "the plugin event's name is necessary, but we get " + name);
    var handlers = this.handlers[name];

    if (!(handlers instanceof Array)) {
      return undefined;
    }

    handlers.forEach(function (handler) {
      handler.apply(undefined, rest);
    });
  };

  _proto.emitCombine = function emitCombine(name) {
    for (var _len2 = arguments.length, rest = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      rest[_key2 - 1] = arguments[_key2];
    }

    assert(typeof name === 'string', "the plugin event's name is necessary, but we get " + name);
    var handlers = this.handlers[name];

    if (!(handlers instanceof Array)) {
      return undefined;
    }

    return handlers.reduce(function (result, handler) {
      var data = handler.apply(undefined, rest);

      if (isArray(data)) {
        return result.concat(data);
      }

      return result;
    }, []);
  };

  _proto.emitLoop = function emitLoop(name) {
    for (var _len3 = arguments.length, rest = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      rest[_key3 - 1] = arguments[_key3];
    }

    assert(typeof name === 'string', "the plugin event's name is necessary, but we get " + name);
    var handlers = this.handlers[name];

    if (!(handlers instanceof Array)) {
      return undefined;
    }

    var preData;
    return handlers.reduce(function (result, handler) {
      if (!isUndefined(preData)) {
        rest[0] = preData;
      }

      var data = handler.apply(undefined, rest);

      if (!isUndefined(data)) {
        preData = data;
      }

      return data;
    }, undefined);
  };

  _proto.on = function on(name, handler) {
    assert(typeof name === 'string', "the plugin event's name is necessary, but we get " + name);

    if (!(this.handlers[name] instanceof Array)) {
      this.handlers[name] = [];
    }

    this.handlers[name].push(handler);
  };

  return PluginEvent;
}();

var window$1 = function () {
  return this;
}() || Function("return this")();

var _createStore = (function (_ref) {
  var rootReducer = _ref.rootReducer,
      middlewares = _ref.middlewares,
      initialState = _ref.initialState,
      enhancers = _ref.enhancers;
  // eslint-disable-next-line
  var composeEnhancers = window$1 && window$1.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window$1.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;
  var store = createStore(rootReducer, initialState, composeEnhancers.apply(void 0, [applyMiddleware.apply(void 0, middlewares)].concat(enhancers)));
  return store;
});

function doneEffectIntercepts(_x, _x2, _x3) {
  return _doneEffectIntercepts.apply(this, arguments);
}

function _doneEffectIntercepts() {
  _doneEffectIntercepts = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(intercepts, action, options) {
    var asyncIntercepts, resolveAction, doneEffectIntercept, _doneEffectIntercept;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _doneEffectIntercept = function _ref3() {
              _doneEffectIntercept = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee() {
                var asyncIntercept;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        asyncIntercept = asyncIntercepts.shift();
                        _context.next = 3;
                        return asyncIntercept(resolveAction || action, options);

                      case 3:
                        resolveAction = _context.sent;
                        assert(isUndefined(resolveAction) || isAction(resolveAction), 'the effect intercept return must be an action or none');

                        if (!(asyncIntercepts.length > 0)) {
                          _context.next = 8;
                          break;
                        }

                        _context.next = 8;
                        return doneEffectIntercept();

                      case 8:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));
              return _doneEffectIntercept.apply(this, arguments);
            };

            doneEffectIntercept = function _ref2() {
              return _doneEffectIntercept.apply(this, arguments);
            };

            if (!(intercepts.length <= 0)) {
              _context2.next = 4;
              break;
            }

            return _context2.abrupt("return");

          case 4:
            asyncIntercepts = intercepts.slice(0);
            _context2.next = 7;
            return doneEffectIntercept();

          case 7:
            return _context2.abrupt("return", resolveAction);

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _doneEffectIntercepts.apply(this, arguments);
}

function doneEffect(_x4, _x5, _x6) {
  return _doneEffect.apply(this, arguments);
}

function _doneEffect() {
  _doneEffect = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(zoro, action, effect) {
    var store, handleEffect, handleIntercepts, handleError, key, effectIntercepts, resolveAction, targetAction, _splitType, namespace, result;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            store = zoro.store, handleEffect = zoro.handleEffect, handleIntercepts = zoro.handleIntercepts, handleError = zoro.handleError;
            key = uuid();
            zoro.plugin.emit(PLUGIN_EVENT.ON_WILL_EFFECT, action, store, {
              key: key
            });
            handleEffect(action);
            effectIntercepts = handleIntercepts[INTERCEPT_EFFECT] || [];
            _context3.next = 7;
            return doneEffectIntercepts(effectIntercepts, action, {
              store: store,
              NAMESPACE_DIVIDER: NAMESPACE_DIVIDER
            });

          case 7:
            resolveAction = _context3.sent;
            targetAction = _objectSpread({}, action, resolveAction, {
              type: action.type
            });
            _splitType = splitType(action.type), namespace = _splitType.namespace;
            _context3.prev = 10;
            _context3.next = 13;
            return effect(targetAction, {
              selectAll: selectCreator(store),
              select: selectCreator(store, namespace),
              put: putCreator(store, namespace)
            });

          case 13:
            result = _context3.sent;
            return _context3.abrupt("return", Promise.resolve(result));

          case 17:
            _context3.prev = 17;
            _context3.t0 = _context3["catch"](10);
            handleError(_context3.t0);
            zoro.plugin.emit(PLUGIN_EVENT.ON_ERROR, _context3.t0, action, store);
            return _context3.abrupt("return", Promise.reject(_context3.t0));

          case 22:
            _context3.prev = 22;
            zoro.plugin.emit(PLUGIN_EVENT.ON_DID_EFFECT, action, store, {
              key: key
            });
            return _context3.finish(22);

          case 25:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[10, 17, 22, 25]]);
  }));
  return _doneEffect.apply(this, arguments);
}

function doneActionIntercepts(intercepts, action, options) {
  return intercepts.reduce(function (resolveAction, actionIntercept) {
    var newResolveAction = actionIntercept(resolveAction, options);
    assert(isUndefined(newResolveAction) || isAction(newResolveAction), 'the action intercept return must be an action or none');
    return newResolveAction || resolveAction;
  }, action);
}

function effectMiddlewareCreator (zoro) {
  return function (_ref) {
    var dispatch = _ref.dispatch;
    return function (next) {
      return function (action) {
        var store = zoro.store,
            handleAction = zoro.handleAction,
            handleIntercepts = zoro.handleIntercepts,
            effects = zoro.effects;
        var type = action.type;
        var handler = effects[type];

        if (isFunction(handler)) {
          return doneEffect(zoro, action, handler);
        }

        var key = uuid();
        zoro.plugin.emit(PLUGIN_EVENT.ON_WILL_ACTION, action, store, {
          key: key
        });
        handleAction(action);
        var actionIntercepts = handleIntercepts[INTERCEPT_ACTION] || [];
        var resolveAction = doneActionIntercepts(actionIntercepts, action, {
          store: store,
          NAMESPACE_DIVIDER: NAMESPACE_DIVIDER
        });

        var targetAction = _objectSpread({}, action, resolveAction, {
          type: type
        });

        zoro.plugin.emit(PLUGIN_EVENT.ON_DID_ACTION, targetAction, store, {
          key: key
        });
        return next(targetAction);
      };
    };
  };
}

var assertOpts$1 = function assertOpts(_ref) {
  var initialState = _ref.initialState,
      extraEnhancers = _ref.extraEnhancers,
      extraMiddlewares = _ref.extraMiddlewares,
      onEffect = _ref.onEffect,
      onAction = _ref.onAction,
      onReducer = _ref.onReducer,
      onSetup = _ref.onSetup,
      onError = _ref.onError;
  assert(isObject(initialState), "initialState must be an Object, but we get " + typeof initialState);
  assert(isArray(extraMiddlewares), "extraMiddlewares must be an Array, but we get " + typeof extraMiddlewares);
  assert(isArray(extraEnhancers), "extraEnhancers must be an Array, but we get " + typeof extraEnhancers);
  assert(isFunction(onEffect), "the onEffect must be an function handler, but we get " + typeof onEffect);
  assert(isFunction(onAction), "the onAction must be an function handler, but we get " + typeof onAction);
  assert(isFunction(onReducer), "the onReducer must be an function handler, but we get " + typeof onReducer);
  assert(isFunction(onSetup), "the onSetup must be an function handler, but we get " + typeof onSetup);
  assert(isFunction(onError), "the onError must be an function handler, but we get " + typeof onError);
};

var assertModelUnique = function assertModelUnique(_ref2, model) {
  var models = _ref2.models;
  var namespace = model.getNamespace();
  assert(!models[namespace], "the model namespace must be unique, we get duplicate namespace " + namespace);
};

var Zoro =
/*#__PURE__*/
function () {
  function Zoro(opts) {
    var _opts$initialState = opts.initialState,
        initialState = _opts$initialState === void 0 ? {} : _opts$initialState,
        _opts$extraMiddleware = opts.extraMiddlewares,
        extraMiddlewares = _opts$extraMiddleware === void 0 ? [] : _opts$extraMiddleware,
        _opts$extraEnhancers = opts.extraEnhancers,
        extraEnhancers = _opts$extraEnhancers === void 0 ? [] : _opts$extraEnhancers,
        _opts$onEffect = opts.onEffect,
        onEffect = _opts$onEffect === void 0 ? noop : _opts$onEffect,
        _opts$onAction = opts.onAction,
        onAction = _opts$onAction === void 0 ? noop : _opts$onAction,
        _opts$onReducer = opts.onReducer,
        onReducer = _opts$onReducer === void 0 ? noop : _opts$onReducer,
        _opts$onSetup = opts.onSetup,
        onSetup = _opts$onSetup === void 0 ? noop : _opts$onSetup,
        _opts$onError = opts.onError,
        onError = _opts$onError === void 0 ? noop : _opts$onError;
    assertOpts$1({
      initialState: initialState,
      extraEnhancers: extraEnhancers,
      extraMiddlewares: extraMiddlewares,
      onEffect: onEffect,
      onAction: onAction,
      onReducer: onReducer,
      onSetup: onSetup,
      onError: onError
    });
    this.models = {};
    this.modelOpts = [];
    this.effects = {};
    this.middlewares = [effectMiddlewareCreator(this)].concat(extraMiddlewares);
    this.enhancers = extraEnhancers;
    this.handleError = onError;
    this.handleEffect = onEffect;
    this.handleAction = onAction;
    this.handleReducer = onReducer;
    this.handleSetup = onSetup;
    this.handleIntercepts = {};
    this.initialState = initialState;
    this.plugin = new PluginEvent();
    this._isSetup = false;
  }

  var _proto = Zoro.prototype;

  _proto.getRootReducer = function getRootReducer() {
    var _this = this;

    var rootReducer = Object.keys(this.models).reduce(function (combine, namespace) {
      var _objectSpread2;

      var model = _this.models[namespace];
      var reducers = model.getReducers();

      var resolveReducers = _this.plugin.emitLoop(PLUGIN_EVENT.ON_REDUCER, namespace, reducers);

      if (!isFunction(resolveReducers)) {
        resolveReducers = reducers;
      }

      var targetResolveReducers = _this.handleReducer.apply(undefined, [namespace, resolveReducers]);

      if (!isFunction(targetResolveReducers)) {
        targetResolveReducers = resolveReducers;
      }

      return _objectSpread({}, combine, (_objectSpread2 = {}, _objectSpread2[namespace] = targetResolveReducers, _objectSpread2));
    }, {});
    return combineReducers(rootReducer);
  };

  _proto.getDefaultState = function getDefaultState() {
    var _this2 = this;

    return Object.keys(this.models).reduce(function (defaultState, namespace) {
      var model = _this2.models[namespace];
      var modelState = model.getDefaultState();

      if (modelState !== undefined) {
        var _objectSpread3;

        return _objectSpread({}, defaultState, (_objectSpread3 = {}, _objectSpread3[namespace] = model.getDefaultState(), _objectSpread3));
      }

      return defaultState;
    }, {});
  };

  _proto.setIntercept = function setIntercept(type, handler) {
    assert(INTERCEPT_TYPE.indexOf(type) !== -1, "we get an unkown intercept type, it's " + type);
    assert(isFunction(handler), "the intercept must be a Function, but we get " + typeof handler);
    if (!isArray(this.handleIntercepts[type])) this.handleIntercepts[type] = [];
    this.handleIntercepts[type].push(handler);
  };

  _proto.injectModels = function injectModels(models) {
    assert(isArray(models), "the models must be an Array, but we get " + typeof models);
    this.modelOpts = this.modelOpts.concat(models);

    if (this.store) {
      var newModels = this.createModels(models);
      this.replaceReducer();

      if (this._isSetup) {
        this.setupModel(newModels);
      }
    }
  };

  _proto.injectMiddlewares = function injectMiddlewares(middlewares) {
    assert(isArray(middlewares), "the middlewares must be an Array, but we get " + typeof middlewares);
    this.middlewares = this.middlewares.concat(middlewares);
  };

  _proto.injectEnhancers = function injectEnhancers(enhancers) {
    assert(isArray(enhancers), "the enhancers must be an Array, but we get " + typeof enhancers);
    this.enhancers = this.enhancers.concat(enhancers);
  };

  _proto.createModels = function createModels(modelOpts) {
    var _this3 = this;

    var models = {};
    modelOpts.forEach(function (option) {
      var modelOption = _this3.plugin.emitLoop(PLUGIN_EVENT.BEFORE_INJECT_MODEL, option) || option;
      var model = new Model(modelOption);
      var namespace = model.getNamespace();
      assertModelUnique(_this3, model);
      _this3.models[namespace] = model;
      models[namespace] = model;
      _this3.effects = _objectSpread({}, _this3.effects, model.getEffects());

      _this3.plugin.emit(PLUGIN_EVENT.AFTER_INJECT_MODEL, modelOpts);

      _this3.plugin.emit(PLUGIN_EVENT.ON_CREATE_MODEL, model);
    });
    return models;
  };

  _proto.createStore = function createStore() {
    var rootReducer = this.getRootReducer();
    var pluginMiddlewares = this.plugin.emitCombine(PLUGIN_EVENT.INJECT_MIDDLEWARES);

    if (isArray(pluginMiddlewares)) {
      this.injectMiddlewares(pluginMiddlewares);
    }

    var pluginEnhancers = this.plugin.emitCombine(PLUGIN_EVENT.INJECT_ENHANCERS);

    if (isArray(pluginEnhancers)) {
      this.injectEnhancers(pluginEnhancers);
    }

    var pluginInitialState = this.plugin.emitLoop(PLUGIN_EVENT.INJECT_INITIAL_STATE, this.initialState);
    return _createStore({
      rootReducer: rootReducer,
      middlewares: this.middlewares,
      enhancers: this.enhancers,
      initialState: _objectSpread({}, this.initialState, pluginInitialState || {}, this.getDefaultState())
    });
  };

  _proto.replaceReducer = function replaceReducer() {
    var rootReducer = this.getRootReducer();
    this.store.replaceReducer(rootReducer);
  };

  _proto.setupModel = function setupModel(models) {
    var _this4 = this;

    if (models === void 0) {
      models = {};
    }

    Object.keys(models).forEach(function (namespace) {
      var model = models[namespace];

      _this4.plugin.emit(PLUGIN_EVENT.ON_SETUP_MODEL, model);

      model.handleSetup.apply(undefined, [{
        put: putCreator(_this4.store, namespace),
        select: selectCreator(_this4.store, namespace),
        selectAll: selectCreator(_this4.store)
      }]);
    });
  };

  _proto.use = function use(creator) {
    assert(isFunction(creator), "the use plugin must be a function, but we get " + typeof creator);
    creator(this.plugin, {
      DIVIDER: NAMESPACE_DIVIDER,
      PLUGIN_EVENT: PLUGIN_EVENT
    });
  };

  _proto.start = function start(setup) {
    var _this5 = this;

    var pluginModels = this.plugin.emitCombine(PLUGIN_EVENT.INJECT_MODELS);

    if (pluginModels instanceof Array) {
      this.injectModels(pluginModels);
    }

    this.createModels(this.modelOpts);
    var store = this.store = this.createStore();

    if (setup) {
      this.setup();
    }

    store.subscribe(function () {
      _this5.plugin.emit(PLUGIN_EVENT.ON_SUBSCRIBE, store);
    });
    return store;
  };

  _proto.setup = function setup() {
    assert(!!this.store, 'the setup function must be call after start(false)');

    if (!this._isSetup) {
      this.setupModel(this.models);
      this.handleSetup.apply(undefined, [{
        put: putCreator(this.store),
        select: selectCreator(this.store)
      }]);
      this.plugin.emit(PLUGIN_EVENT.ON_SETUP, this.store);
    }

    this._isSetup = true;
  };

  return Zoro;
}();

var actionCache = {};
function dispatcherCreator (namespace, model, zoro) {
  if (actionCache[namespace]) return actionCache[namespace];

  if (!actionCache[namespace]) {
    var actions = model.getActions();
    actionCache[namespace] = Object.keys(actions).reduce(function (dispatcher, name) {
      var _objectSpread2;

      return _objectSpread({}, dispatcher, (_objectSpread2 = {}, _objectSpread2[name] = function () {
        assert(!!zoro.store, "dispatch action must be call after app.start()");
        return zoro.store.dispatch(actions[name].apply(actions, arguments));
      }, _objectSpread2));
    }, {});
  }

  return actionCache[namespace];
}

var _zoro;

var _store;

var dispatcher = {};

function defineDispatcher(zoro, model) {
  var namespace = model.getNamespace();
  Object.defineProperty(dispatcher, namespace, {
    get: function get() {
      return dispatcherCreator(namespace, model, zoro);
    },
    set: function set() {
      assert(false, 'Cannot set the dispatcher');
    }
  });
}

if (isSupportProxy()) {
  dispatcher = new Proxy({}, {
    get: function get(target, key) {
      var model = _zoro.models[key];
      return dispatcherCreator(key, model, _zoro);
    },
    set: function set() {
      assert(false, 'Cannot set the dispatcher');
    }
  });
}

function App(zoro) {
  this.zoro = zoro;
  _zoro = zoro;

  if (!isSupportProxy()) {
    _zoro.plugin.on(PLUGIN_EVENT.ON_CREATE_MODEL, function (model) {
      defineDispatcher(zoro, model);
    });
  }
}

App.prototype.model = function (models) {
  if (models instanceof Array) {
    _zoro.injectModels(models);

    return this;
  }

  _zoro.injectModels([models]);

  return this;
};

App.prototype.use = function (plugins) {
  if (typeof plugins === 'function') {
    _zoro.use(plugins);

    return this;
  }

  assert(plugins instanceof Array, "the use param must be a function or a plugin Array, but we get " + typeof plugins);
  plugins.forEach(function (plugin) {
    return _zoro.use(plugin);
  });
  return this;
};

App.prototype.intercept = {
  action: function action(handler) {
    _zoro.setIntercept(INTERCEPT_ACTION, handler);
  },
  effect: function effect(handler) {
    _zoro.setIntercept(INTERCEPT_EFFECT, handler);
  }
};

App.prototype.start = function (setup) {
  if (setup === void 0) {
    setup = true;
  }

  _store = _zoro.start(setup);
  return _store;
};

App.prototype.setup = function () {
  _zoro.setup();
}; // 该接口将于v3.0.0废弃，请使用dispatcher


var actions = function actions(namespace) {
  var models = _zoro.models;
  assert(!!models[namespace], "the " + namespace + " model not define");
  return models[namespace].getActions();
};
function app (options) {
  if (options === void 0) {
    options = {};
  }

  return new App(new Zoro(options));
}

export default app;
export { actions, dispatcher };
