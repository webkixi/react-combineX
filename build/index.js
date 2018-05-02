'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.default = combineX;
exports._wrap = _wrap;
exports.createCombinClass = createCombinClass;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * React-combinex
 * 增强react的用法，贴近jquery的使用方式
 */
var _ = require('lodash');
var cloneDeep = _.cloneDeep;
var merge = _.merge;
var uuid = -1;

function uniqueId(prefix) {
  if (!prefix) prefix = 'random_';
  uuid++;
  return prefix + uuid;
}

var isReactNative = false;
var empty = false;
var noop = function noop() {};
var isClient = typeof window !== 'undefined';
var context = function (C) {
  return C ? window : global;
}(isClient) || {};
if (context.process) isClient = false;
if (context.__BUNDLE_START_TIME__) isReactNative = true;

var SAX = function () {
  return typeof SAX != 'undefined' ? SAX : require('fkp-sax');
}();
var React = typeof React != 'undefined' ? React : require('react');

if (!isReactNative) {
  var reactDom = function (C) {
    return typeof ReactDOM != 'undefined' ? ReactDOM : typeof ReactDom != 'undefined' ? ReactDom : C ? require('react-dom') : require('react-dom/server');
  }(isClient);
  var findDOMNode = function (C) {
    return C ? reactDom.findDOMNode : function () {};
  }(isClient);
  var render = function (C) {
    return C ? reactDom.render : reactDom.renderToString;
  }(isClient);
} else {
  var reactDom = noop;
  var findDOMNode = function findDOMNode(ctx) {
    return ctx;
  };
  var render = function render(jsx) {
    return jsx;
  };
}

if (!context.SAX) {
  context.SAX = SAX;
}

var isFunction = function isFunction(target) {
  return typeof target == 'function';
};
var componentMonuted = {};
var instanceCollection = {};

function didMount(ctx, opts, cb, queryer) {
  var that = findDOMNode(this);
  if (typeof this.props.itemDefaultMethod == 'function') {
    this.props.itemDefaultMethod.call(ctx, that, this.intent);
  }

  if (typeof cb == 'function' || typeof opts.rendered == 'function' || typeof this.props.rendered == 'function' || typeof this.props.itemMethod == 'function') {
    var imd = isFunction(cb) ? cb : isFunction(opts.rendered) ? opts.rendered : this.props.rendered || this.props.itemMethod;
    if (!imd) imd = function imd() {};
    imd.call(ctx, that, this.intent);
  }

  if (queryer) {
    queryer.roll('rendered', {
      dom: that,
      opts: opts,
      ctx: ctx
    });

    queryer.roll('__rendered', {
      dom: that,
      opts: opts,
      ctx: ctx
    });
  }
}

function unMount() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var queryer = arguments[2];

  if (queryer) {
    var name = queryer.name;
    if (props.unMountDestory) {
      // queryer.off('__rendered')
      // queryer.unbind()
      // queryer.destory()
      // // queryer = null
      // SAX.destory(name)
      instanceCollection[name].destory();
      // delete instanceCollection[name]
    }
  }

  if (typeof opts.leave == 'function') {
    var _ctx = {};

    if (name) _ctx.destory = function () {
      instanceCollection[name].destory();
    };

    if (typeof opts.leave == 'function') {
      opts.leave.call(_ctx);
    }
  }
}

var store = function (sax) {
  try {
    if (!sax) throw 'storehlc depend on SAX, SAX is fkp-sax, is a Global fun';
    return function (id, ComposedComponent, extension, opts, cb) {
      if (!id) throw 'storehlc id must be set';

      var Store = function (_ComposedComponent) {
        _inherits(Store, _ComposedComponent);

        function Store(props) {
          _classCallCheck(this, Store);

          var _this = _possibleConstructorReturn(this, (Store.__proto__ || Object.getPrototypeOf(Store)).call(this, props));

          _this.globalName = id;
          _this.intent = _this.props.intent || _this.props.idf || 0;

          // 初始化，组件没有渲染的状态
          componentMonuted[_this.globalName] = false;

          var queryer = sax(_this.globalName);
          _this.saxer = queryer;
          _this.on = queryer.on.bind(queryer);
          _this.hasOn = queryer.hasOn.bind(queryer);
          _this.one = queryer.one.bind(queryer);
          _this.off = queryer.off.bind(queryer);
          _this.emit = queryer.emit.bind(queryer);
          _this.roll = queryer.roll.bind(queryer);
          _this.append = queryer.append.bind(queryer);
          queryer.data.originalState ? queryer.data.originalState[_this.globalName] = cloneDeep(_this.state) // queryer.data.originalState[this.globalName] = cloneDeep(this.state)
          : function () {
            var temp = {};
            temp[_this.globalName] = cloneDeep(_this.state); // temp[this.globalName] = cloneDeep(this.state)
            queryer.data.originalState = temp;
          }();
          sax.bind(_this.globalName, _this);

          if ((typeof extension === 'undefined' ? 'undefined' : _typeof(extension)) == 'object') {
            if (_typeof(extension.plugins) == 'object' && !Array.isArray(extension.plugins)) {
              var plugins = extension.plugins;
              Object.keys(extension.plugins).map(function (item) {
                if (typeof plugins[item] == 'function') {
                  _this[item] = plugins[item];
                }
              });
            }
          }
          return _this;
        }

        _createClass(Store, [{
          key: 'componentWillUnmount',
          value: function componentWillUnmount() {
            var queryer = sax(this.globalName);
            componentMonuted[this.globalName] = false;
            _get(Store.prototype.__proto__ || Object.getPrototypeOf(Store.prototype), 'componentWillUnmount', this) ? _get(Store.prototype.__proto__ || Object.getPrototypeOf(Store.prototype), 'componentWillUnmount', this).call(this) : '';
            opts.leave = opts.leave || this.props.leave;
            unMount(opts, this.props, queryer);
          }
        }, {
          key: 'componentDidUpdate',
          value: function componentDidUpdate() {
            this.didUpdate = true;
            _get(Store.prototype.__proto__ || Object.getPrototypeOf(Store.prototype), 'componentDidUpdate', this) ? _get(Store.prototype.__proto__ || Object.getPrototypeOf(Store.prototype), 'componentDidUpdate', this).call(this) : '';
            this.componentDidMount();
          }
        }, {
          key: 'componentDidMount',
          value: function componentDidMount() {
            componentMonuted[this.globalName] = true;

            if (this.didUpdate = true) {
              this.didUpdate = false;
            } else {
              this.saxer.off('__rendered');
            }
            var _ctx = {
              // state: this.saxer.data.originalState[globalName],
              // dispatch: dispatcher,
              refs: this.refs,
              index: this.props.idf
            };
            _get(Store.prototype.__proto__ || Object.getPrototypeOf(Store.prototype), 'componentDidMount', this) ? _get(Store.prototype.__proto__ || Object.getPrototypeOf(Store.prototype), 'componentDidMount', this).call(this) : '';
            didMount.call(this, _ctx, opts, cb, this.saxer);
          }
        }]);

        return Store;
      }(ComposedComponent);

      Store.defaultProps = {
        unMountDestory: false
      };

      return Store;
    };
  } catch (e) {
    return ComposedComponent;
  }
}(SAX);

function dealWithReactClass(CComponent) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var cb = arguments[2];
  var queryer = arguments[3];

  return function (_CComponent) {
    _inherits(_class, _CComponent);

    function _class(props) {
      _classCallCheck(this, _class);

      var _this2 = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

      _this2.intent = _this2.props.intent;
      return _this2;
    }

    _createClass(_class, [{
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        // opts.leave = opts.leave || this.props.leave
        // unMount.call(this, opts, queryer)

        opts.leave = opts.leave || this.props.leave;
        _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), 'componentWillUnmount', this) ? _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), 'componentWillUnmount', this).call(this) : '';
        unMount(opts, this.props, queryer);
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _ctx = {
          refs: this.refs,
          index: this.props.idf
        };
        _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), 'componentDidMount', this) ? _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), 'componentDidMount', this).call(this) : '';
        didMount.call(this, _ctx, opts, cb, queryer);
      }
    }]);

    return _class;
  }(CComponent);
}

/**
 * [dealWithReactElement 处理传入为react element 的场景，一般用于wrap]
 * @param  {react element} CComponent [description]
 * @return {react class}            [description]
 */
function dealWithReactElement(CComponent) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var cb = arguments[2];
  var queryer = arguments[3];

  return function (_React$Component) {
    _inherits(_class2, _React$Component);

    function _class2(props) {
      _classCallCheck(this, _class2);

      var _this3 = _possibleConstructorReturn(this, (_class2.__proto__ || Object.getPrototypeOf(_class2)).call(this, props));

      _this3.intent = _this3.props.intent;
      return _this3;
    }

    _createClass(_class2, [{
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        // opts.leave = opts.leave || this.props.leave
        // unMount.call(this, opts, queryer)

        opts.leave = opts.leave || this.props.leave;
        unMount(opts, this.props, queryer);
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _ctx = {};
        _get(_class2.prototype.__proto__ || Object.getPrototypeOf(_class2.prototype), 'componentDidMount', this) ? _get(_class2.prototype.__proto__ || Object.getPrototypeOf(_class2.prototype), 'componentDidMount', this).call(this) : '';
        didMount.call(this, _ctx, opts, cb, queryer);
      }
    }, {
      key: 'render',
      value: function render() {
        return CComponent;
      }
    }]);

    return _class2;
  }(React.Component);
}

/**
 * type 2
 * ComposedComponent 为 React class
 * @type {[type]}
 */
function dispatcher(key, props, QueryCtx, queryer, globalName) {
  var ctx = queryer.store.ctx[globalName];
  if (ctx) {
    var liveState = cloneDeep(ctx.state);
    // const liveState = ctx.state
    var oState = queryer.data.originalState[globalName];
    var queryActions = queryer.data;
    queryActions.curState = liveState;
    if (queryActions[key]) {
      var _tmp = queryActions[key].call(queryActions, oState, props, QueryCtx);
      if (_tmp) {
        ctx.setState(_tmp);
      }
    }
  }
}

/**
 * [combineX description]
 * @param  {react class | react element}   ComposedComponent [description]
 * @param  {object}   opts              [description]
 * @param  {Function} cb                [description]
 * @return {react class | object}       [description]
 */
function combineX(ComposedComponent, opts, cb) {
  if (!ComposedComponent) return;
  if (typeof ComposedComponent == 'string' || Array.isArray(ComposedComponent)) return;
  var extension = cb;
  if (typeof opts == 'function') {
    cb = opts;
    opts = undefined;
  }

  // will return React class for type 2
  var returnReactClass = false;
  if ((typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) == 'object' && opts.type == 'reactClass') {
    returnReactClass = true;
    delete opts.type;
  }

  /**
   * type 1
   * ComposedComponent 为 React element
   * @param  {[type]} React [description]
   * @return [type]         [description]
   */
  if (React.isValidElement(ComposedComponent)) {
    return dealWithReactElement(ComposedComponent, opts, cb);
  }

  if (returnReactClass) {
    // const globalName = uniqueId('returnReactClass_')
    return dealWithReactClass(ComposedComponent, opts, cb);
  }
  // else {
  //   const globalName = uniqueId('Combinex_')
  //   const queryer = SAX(globalName)
  //   if (opts) { queryer.append(opts) }

  //   return {
  //     globalName,
  //     queryer,
  //     ComposedComponent,
  //     extension,
  //     opts,
  //     cb
  //   }
  // }
}

function _wrap(ComposedComponent, opts, cb) {
  opts = opts || { type: 'reactClass' };
  if (isFunction(opts)) {
    cb = opts;
    opts = { type: 'reactClass' };
  }

  if ((typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) == 'object') {
    opts.type = 'reactClass';
  }

  return combineX(ComposedComponent, opts, cb);
}

// CombineClass
function browserRender(id, X, config) {
  var props = config.props;
  if (typeof id == 'string') {
    if (document.getElementById(id)) {
      return render(React.createElement(X, props), document.getElementById(id));
    }
  } else if ((typeof id === 'undefined' ? 'undefined' : _typeof(id)) == 'object' && id.nodeType) {
    return render(React.createElement(X, props), id);
  }
}

function _rendered(ctx, cb) {
  return function (dom, intent) {
    ctx.elements = this.refs;
    cb(dom, intent);
  };
}

var CombineClass = exports.CombineClass = function () {
  // constructor(config) {
  function CombineClass() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var rctCls = arguments[1];
    var acts = arguments[2];
    var exts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var gname = arguments[4];

    _classCallCheck(this, CombineClass);

    this.config = config;
    this.isClient = isClient;
    this.elements; // rendered方法中赋值，react class的componentDidMount之后将refs的内容赋值给该变量
    this.leave; //unmounted 触发的方法

    var ext = {};
    var plugins = exts.plugins;
    if (plugins) {
      Object.keys(plugins).map(function (item) {
        if (typeof plugins[item] == 'function') {
          ext[item] = plugins[item];
        }
      });
    }
    this.extension = { plugins: ext };

    this.globalName = function () {
      return gname || uniqueId('Combinex_');
    }();

    // aotoo中下项是被释放的
    // 下列做法主要为兼容PC端老版系统
    // this.combinex(rctCls, acts) 
  }

  _createClass(CombineClass, [{
    key: 'destory',
    value: function destory() {
      var queryer = this.saxer;
      var name = queryer.name;
      queryer.off('__rendered');
      queryer.unbind();
      queryer.destory();
      SAX.destory(name);

      for (var prop in this) {
        if (prop != 'destory') {
          delete this[prop];
        }
      }

      delete instanceCollection[name];
    }
  }, {
    key: 'combinex',
    value: function combinex(GridsBase) {
      var _this4 = this;

      var Actions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var that = this;
      var globalName = this.globalName;
      var queryer = SAX(globalName);
      queryer.append(Actions);
      this.x = store(globalName, GridsBase, this.extension, Actions);
      this.globalName = globalName;
      this.saxer = queryer;

      this.on = function (evt, opts, func) {
        queryer.on(evt, opts, func);
        return _this4;
      };

      this.hasOn = function (evt, opts, func) {
        return queryer.hasOn(evt, opts, func);
      };

      this.one = function (evt, opts, func) {
        queryer.one(evt, opts, func);
        return _this4;
      };

      this.off = function (evt, opts, func) {
        queryer.off(evt, opts, func);
        return _this4;
      };

      this.roll = function (type, data) {
        return queryer.roll(type, data);
      };

      this.emit = this.roll;

      this.hasMounted = function () {
        var gname = globalName;
        return componentMonuted[gname];
      };

      this.dispatch = function (key, props, ctx) {
        var that = this;
        var hasMounted = that.hasMounted();
        this.saxer.off('__rendered');
        if (hasMounted) {
          setTimeout(function () {
            dispatcher(key, props, that, that.saxer, that.globalName);
          }, 0);
        } else {
          clearTimeout(that.timer);
          this.saxer.on('__rendered', function () {
            that.timer = setTimeout(function () {
              clearTimeout(that.timer);
              dispatcher(key, props, that, that.saxer, that.globalName);
              that.saxer.off('__rendered');
            }, 0);
          });
        }
      };

      this.getState = function () {
        var ctx = this.saxer.store.ctx[this.globalName];
        return ctx.state;
      };

      var keynames = Object.keys(Actions);
      var lowKeyNames = keynames.map(function (item) {
        return item.toLowerCase();
      });
      var upKeyNames = keynames;

      var _loop = function _loop(ii) {
        var actName = upKeyNames[ii];
        _this4['$' + lowKeyNames[ii]] = function (param) {
          this.dispatch(actName, param, this);
          return this;
        };
      };

      for (var ii = 0; ii < lowKeyNames.length; ii++) {
        _loop(ii);
      }

      this.appendActions = function (obj) {
        this.saxer.append(obj);
        Object.keys(obj).map(function (item) {
          var lowCaseName = '$' + item.toLowerCase();
          that[lowCaseName] = function (param) {
            that.dispatch(item, param);
          };
        });
        return this;
      };
    }
  }, {
    key: 'extend',
    value: function extend(exts) {
      var _this5 = this;

      if ((typeof exts === 'undefined' ? 'undefined' : _typeof(exts)) == 'object') {
        Object.keys(exts).map(function (_name) {
          var _ext = exts[_name];
          _this5[_name] = exts[_name];
        });
      }
    }
  }, {
    key: 'setConfig',
    value: function setConfig(config) {
      this.config = config || {};
      return this;
    }
  }, {
    key: 'setProps',
    value: function setProps(props) {
      this.config.props = props;
      return this;
    }
  }, {
    key: 'reRender',
    value: function reRender() {
      this.render();
    }
  }, {
    key: 'render',
    value: function render(id, cb) {
      id = id || this.config.container;
      var X = this.x;
      var _props = this.props || this.config.props || {
        unMountDestory: false,
        leave: false
      };

      if (typeof id == 'function' || typeof cb == 'function') {
        this.config.rendered = typeof id == 'function' ? id : cb;
      }
      if (typeof this.config.rendered == 'function' || typeof this.rendered == 'function') {
        var rended = this.config.rendered || this.rendered;
        if (_props) _props.rendered = _rendered(this, rended);else {
          _props = {
            rendered: _rendered(this, rended)
          };
        }
      }
      _props.leave = this.leave || this.config.leave || this.config.props && this.config.props.leave;
      this.config.props = _props || {};

      if (typeof id == 'string' || (typeof id === 'undefined' ? 'undefined' : _typeof(id)) == 'object') {
        if (this.isClient && !isReactNative) {
          this.config.container = id;
          return browserRender(id, X, this.config);
        }
      }

      _props = _props || {};
      return React.createElement(X, _props);
    }
  }]);

  return CombineClass;
}();

function createCombinClass(rctCls, acts, config, exts) {
  var globalName = uniqueId('Combinex_');
  instanceCollection[globalName] = new CombineClass(config, rctCls, acts, exts, globalName);
  return instanceCollection[globalName];
}
//# sourceMappingURL=maps/index.js.map
