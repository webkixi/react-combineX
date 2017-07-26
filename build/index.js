'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CombineClass = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = combineX;
exports._wrap = _wrap;

var _lodash = require('lodash.clonedeep');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.merge');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.uniqueid');

var _lodash6 = _interopRequireDefault(_lodash5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * React-combinex
 * 增强react的用法，贴近jquery的使用方式
 */
var isReactNative = false;
var empty = false;
var noop = function noop() {};
var isClient = typeof window !== 'undefined';
var context = function (C) {
  return C ? window : global;
}(isClient) || {};
isReactNative = context.regeneratorRuntime ? true : false;

var SAX = function () {
  return typeof SAX != 'undefined' ? SAX : require('fkp-sax');
}();
var React = typeof React != 'undefined' ? React : require('react');

if (!isReactNative) {
  empty = React.createElement('span', null);
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
  var _ref = function () {
    return typeof ReactNative != 'undefined' ? ReactNative : require('react-native');
  }(),
      View = _ref.View,
      Text = _ref.Text;

  empty = React.createElement(Text, null);
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

var componentMonuted = SAX('ReactComponentMonuted');
var store = function (sax) {
  try {
    if (!sax) throw 'storehlc depend on SAX, SAX is fkp-sax, is a Global fun';
    return function (id, ComposedComponent, extension) {
      if (!id) throw 'storehlc id must be set';
      return function (_ComposedComponent) {
        _inherits(_class, _ComposedComponent);

        function _class(props) {
          _classCallCheck(this, _class);

          var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

          _this.globalName = id;

          // 初始化，组件没有渲染的状态
          var unmounted = {};
          unmounted[id] = false;
          componentMonuted.append(unmounted);

          var queryer = sax(id);
          _this.saxer = queryer;
          _this.on = queryer.on.bind(queryer);
          _this.off = queryer.off.bind(queryer);
          _this.emit = queryer.emit.bind(queryer);
          _this.roll = queryer.roll.bind(queryer);
          _this.append = queryer.append.bind(queryer);
          queryer.data.originalState ? queryer.data.originalState[id] = (0, _lodash2.default)(_this.state) : function () {
            var temp = {};temp[id] = (0, _lodash2.default)(_this.state);
            queryer.data.originalState = temp;
          }();
          sax.bind(id, _this);

          if ((typeof extension === 'undefined' ? 'undefined' : _typeof(extension)) == 'object') {
            if (_typeof(extension.plugins) == 'object' && !Array.isArray(extension.plugins)) {
              var plugins = extension.plugins;
              Object.keys(extension.plugins).map(function (item) {
                if (typeof plugins[item] == 'function') {
                  // plugins[item] = this::plugins[item]
                  _this[item] = plugins[item];
                }
              });
            }
          }
          return _this;
        }

        return _class;
      }(ComposedComponent);
    };
  } catch (e) {
    return ComposedComponent;
  }
}(SAX);

var isFunction = function isFunction(target) {
  return typeof target == 'function';
};

var didMount = function didMount(ctx, opts, cb, queryer) {
  var that = findDOMNode(this);
  if (typeof this.props.itemDefaultMethod == 'function') {
    this.props.itemDefaultMethod.call(ctx, that, this.intent);
  }

  if (typeof cb == 'function' || typeof opts.rendered == 'function' || typeof this.props.rendered == 'function' || typeof this.props.itemMethod == 'function') {
    var imd = isFunction(cb) ? cb : isFunction(opts.rendered) ? opts.rendered : this.props.rendered || this.props.itemMethod;
    if (!imd) imd = function imd() {};
    imd.call(ctx, that, this.intent);
  }
  queryer.roll('rendered', {
    dom: that,
    opts: opts,
    ctx: ctx
  });
};

var unMount = function unMount(opts, queryer) {
  var that = findDOMNode(this);
  if (typeof opts.leave == 'function' || typeof this.props.leave == 'function') {
    var imd = isFunction(opts.leave) ? opts.leave : this.props.leave;
    if (!imd) imd = function imd() {};
    imd(that, this.intent);
  }
};

/**
 * [dealWithReactElement 处理传入为react element 的场景，一般用于wrap]
 * @param  {react element} CComponent [description]
 * @return {react class}            [description]
 */
function dealWithReactElement(CComponent, opts, cb, queryer) {
  return function (_React$Component) {
    _inherits(_class2, _React$Component);

    function _class2(props) {
      _classCallCheck(this, _class2);

      var _this2 = _possibleConstructorReturn(this, (_class2.__proto__ || Object.getPrototypeOf(_class2)).call(this, props));

      _this2.intent = _this2.props.intent;
      _this2.state = { show: true };

      _this2.show = _this2.show.bind(_this2);
      _this2.hide = _this2.hide.bind(_this2);
      return _this2;
    }

    _createClass(_class2, [{
      key: 'componentWillMount',
      value: function componentWillMount() {
        if (this.props.show == false) this.setState({ show: false });
      }
    }, {
      key: 'show',
      value: function show() {
        this.setState({
          show: true
        });
      }
    }, {
      key: 'hide',
      value: function hide() {
        this.setState({
          show: false
        });
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        unMount.call(this, opts, queryer);
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate() {
        this.componentDidMount();
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        var self = this;
        var that = findDOMNode(this);
        var _ctx = {
          show: this.show,
          hide: this.hide
        };

        _get(_class2.prototype.__proto__ || Object.getPrototypeOf(_class2.prototype), 'componentDidMount', this) ? _get(_class2.prototype.__proto__ || Object.getPrototypeOf(_class2.prototype), 'componentDidMount', this).call(this) : '';
        didMount.call(this, _ctx, opts, cb, queryer);
      }
    }, {
      key: 'render',
      value: function render() {
        return this.state.show ? CComponent : empty;
      }
    }]);

    return _class2;
  }(React.Component);
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

  var globalName = (0, _lodash6.default)('Combinex_');

  var queryer = SAX(globalName);
  if (opts) {
    queryer.append(opts);
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
    return dealWithReactElement(ComposedComponent, opts, cb, queryer);
  }

  /**
   * type 2
   * ComposedComponent 为 React class
   * @type {[type]}
   */

  function dispatcher(key, props, QueryCtx) {
    var ctx = queryer.store.ctx[globalName];

    var liveState = (0, _lodash2.default)(ctx.state);
    var oState = queryer.data.originalState[globalName];
    // const oState = JSON.parse(queryer.data.originalState[globalName])

    var queryActions = queryer.data;

    // const _state = {
    //   curState: liveState,
    // }

    queryActions.curState = liveState;
    QueryCtx.data = liveState.data;

    if (queryActions[key]) {
      var _tmp = queryActions[key].call(queryActions, oState, props, QueryCtx);
      if (_tmp) {
        // const target = merge({}, oState, _tmp)
        ctx.setState(_tmp);
      }
    }
  }

  var ReactComponentMonuted = false;

  var Temp = function (_ComposedComponent2) {
    _inherits(Temp, _ComposedComponent2);

    function Temp(props) {
      _classCallCheck(this, Temp);

      var _this3 = _possibleConstructorReturn(this, (Temp.__proto__ || Object.getPrototypeOf(Temp)).call(this, props));

      _this3.intent = _this3.props.intent || [];
      return _this3;
    }

    _createClass(Temp, [{
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        // const gname = this.globalName
        // componentMonuted.data[gname] = false
        _get(Temp.prototype.__proto__ || Object.getPrototypeOf(Temp.prototype), 'componentWillUnmount', this) ? _get(Temp.prototype.__proto__ || Object.getPrototypeOf(Temp.prototype), 'componentWillUnmount', this).call(this) : '';
        unMount.call(this, opts, queryer);
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate() {
        _get(Temp.prototype.__proto__ || Object.getPrototypeOf(Temp.prototype), 'componentDidUpdate', this) ? _get(Temp.prototype.__proto__ || Object.getPrototypeOf(Temp.prototype), 'componentDidUpdate', this).call(this) : '';
        this.componentDidMount();
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        var self = this;
        var that = findDOMNode(this);

        var _ctx = {
          // state: queryer.data.originalState[globalName],
          dispatch: dispatcher,
          refs: this.refs
        };
        _get(Temp.prototype.__proto__ || Object.getPrototypeOf(Temp.prototype), 'componentDidMount', this) ? _get(Temp.prototype.__proto__ || Object.getPrototypeOf(Temp.prototype), 'componentDidMount', this).call(this) : '';
        didMount.call(this, _ctx, opts, cb, queryer);

        componentMonuted.data[this.globalName] = true;
      }
    }]);

    return Temp;
  }(ComposedComponent);

  var Query = function Query(config) {
    _classCallCheck(this, Query);

    this.config = config;
    this.element = store(globalName, Temp, extension);
    this.timer;
    this.globalName = globalName;
    this.saxer = queryer;
    this.setActions = queryer.setActions.bind(queryer);
    this.on = queryer.on.bind(queryer);
    this.off = queryer.off.bind(queryer);
    this.roll = queryer.roll.bind(queryer);
    this.emit = queryer.emit.bind(queryer);
    this.data;

    this.hasMounted = function () {
      var gname = this.globalName;
      return componentMonuted.data[gname];
    };

    this.dispatch = function (key, props, ctx) {
      var that = this;
      setTimeout(function () {
        var hasMounted = that.hasMounted();
        if (hasMounted) dispatcher(key, props, that);
      }, 0);
    };
  };

  if (returnReactClass) {
    return store(globalName, Temp, extension);
  } else {
    return new Query();
  }
}

function _wrap(ComposedComponent, opts, cb) {
  if (!opts) opts = { type: 'reactClass' };

  if (typeof opts == 'function') {
    cb = opts;
    opts = {
      type: 'reactClass'
    };
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
    return render(React.createElement(X, props), document.getElementById(id));
  } else if ((typeof id === 'undefined' ? 'undefined' : _typeof(id)) == 'object' && id.nodeType) {
    return render(React.createElement(X, props), id);
  }
}

function _rendered(ctx, cb) {
  return function (dom, intent) {
    ctx.elements = this.refs;
    // ctx.data = ctx.combx.data ? ctx.combx.data : ctx.config.props.data  // 用于实例中做数据查询，该data同步于react class的state.data，dispatcher中动态更新该值
    cb.call(this, dom, intent, ctx);
  };
}

var CombineClass = exports.CombineClass = function () {
  function CombineClass(config) {
    _classCallCheck(this, CombineClass);

    this.config = config;
    this.isClient = isClient;
    this.extension = {};
    this.elements; // rendered方法中赋值，react class的componentDidMount之后将refs的内容赋值给该变量
    this.leave; //unmounted 触发的方法
    browserRender = browserRender.bind(this);

    this.inject();
  }

  _createClass(CombineClass, [{
    key: 'combinex',
    value: function combinex(GridsBase) {
      var _this4 = this;

      var Actions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var that = this;
      var CombX = combineX(GridsBase, Actions, this.extension);
      this.combx = CombX;
      this.saxer = CombX.saxer;
      this.globalName = CombX.globalName;
      this.x = CombX.element;
      this.dispatch = CombX.dispatch.bind(CombX);
      this.hasMounted = CombX.hasMounted.bind(CombX);
      this.data = CombX.data;

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

      // this.setActions = function(key, func){
      //   const _actions = {}
      //   _actions[key] = func
      //   CombX.saxer.setActions(_actions)
      //   return this
      // }

      this.on = function (key, fun) {
        CombX.saxer.on(key, fun);
        return _this4;
      };

      this.off = function (key) {
        CombX.saxer.off(key);
        return _this4;
      };

      this.roll = function (key, data) {
        return CombX.saxer.roll(key, data);
      };

      this.emit = this.roll;

      this.appendActions = function (obj) {
        CombX.saxer.append(obj);
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
          _this5[_name] = exts[_name];
        });
      }
    }
  }, {
    key: 'inject',
    value: function inject(src) {
      if (this.isClient) {
        // const ij = inject()
        // if (this.config.theme && this.config.autoinject) {
        //   ij.css(['/css/m/'+this.config.theme])  //注入样式
        // }
        // if (typeof src == 'function') {
        //   src(ij)
        // }
        // return ij
      }
      return this;
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
      var _props = this.props || this.config.props || {};

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
//# sourceMappingURL=maps/index.js.map
