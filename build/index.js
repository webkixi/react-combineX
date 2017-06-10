'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CombineClass = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = combineX;

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
var isClient = typeof window !== 'undefined';
var context = function (C) {
  return C ? window : global;
}(isClient) || {};

var SAX = function () {
  return typeof SAX != 'undefined' ? SAX : require('fkp-sax');
}();
var React = typeof React != 'undefined' ? React : require('react');
var reactDom = function (C) {
  return typeof ReactDOM != 'undefined' ? ReactDOM : typeof ReactDom != 'undefined' ? ReactDom : C ? require('react-dom') : require('react-dom/server');
}(isClient);
var findDOMNode = function (C) {
  return C ? reactDom.findDOMNode : function () {};
}(isClient);
var render = function (C) {
  return C ? reactDom.render : reactDom.renderToString;
}(isClient);

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

/**
 * [dealWithReactElement 处理传入为react element 的场景，一般用于wrap]
 * @param  {react element} CComponent [description]
 * @return {react class}            [description]
 */
function dealWithReactElement(CComponent, opts, cb) {
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

        if (typeof this.props.itemDefaultMethod == 'function') {
          self.props.itemDefaultMethod.call(_ctx, that, self.intent);
        }

        if (typeof cb == 'function' || typeof this.props.rendered == 'function' || typeof this.props.itemMethod == 'function') {
          var imd = isFunction(cb) ? cb : this.props.rendered || this.props.itemMethod;
          imd.call(_ctx, that, self.intent);
        }
      }
    }, {
      key: 'render',
      value: function render() {
        return this.state.show ? CComponent : React.createElement('span', null);
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
    return dealWithReactElement(ComposedComponent, opts, cb);
  }

  /**
   * type 2
   * ComposedComponent 为 React class
   * @type {[type]}
   */

  function dispatcher(key, props, cbx) {
    var ctx = queryer.store.ctx[globalName];

    var liveState = (0, _lodash4.default)({}, ctx.state);
    var oState = queryer.data.originalState[globalName];
    // const oState = JSON.parse(queryer.data.originalState[globalName])

    var queryActions = queryer.data;
    cbx.data = liveState;

    // const _state = {
    //   curState: liveState,
    // }

    queryActions.curState = liveState;

    if (queryActions[key]) {
      var _tmp = queryActions[key].call(queryActions, oState, props);
      if (_tmp) {
        var target = (0, _lodash4.default)({}, oState, _tmp);
        ctx.setState(target);
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
        var gname = this.globalName;
        componentMonuted.data[gname] = false;
        // ReactComponentMonuted = false
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

        _get(Temp.prototype.__proto__ || Object.getPrototypeOf(Temp.prototype), 'componentDidMount', this) ? _get(Temp.prototype.__proto__ || Object.getPrototypeOf(Temp.prototype), 'componentDidMount', this).call(this) : '';

        var _ctx = {
          state: queryer.data.originalState[globalName],
          dispatch: dispatcher,
          refs: this.refs
        };

        if (typeof this.props.itemDefaultMethod == 'function') {
          self.props.itemDefaultMethod.call(_ctx, that, self.intent);
        }

        if (typeof cb == 'function' || typeof this.props.rendered == 'function' || typeof this.props.itemMethod == 'function') {
          var imd = isFunction(cb) ? cb : this.props.rendered || this.props.itemMethod;
          imd.call(_ctx, that, self.intent);
        }

        var gname = this.globalName;
        componentMonuted.data[gname] = true;

        queryer.roll('rendered');
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
    this.setActions = queryer.setActions;
    this.on = queryer.on;
    this.roll = queryer.roll;

    this.hasMounted = function () {
      var gname = this.globalName;
      return componentMonuted.data[gname];
    };

    this.dispatch = function (key, props) {
      var that = this;
      clearTimeout(this.timer);
      this.timer = setTimeout(function () {
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

combineX.wrap = function (ComposedComponent, opts, cb) {
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
};

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
    this.data = this.config.props.data; // 用于实例中做数据查询，该data同步于react class的state.data
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
      this.globalName = CombX.globalName;
      this.x = CombX.element;
      this.dispatch = CombX.dispatch.bind(CombX);
      this.hasMounted = CombX.hasMounted.bind(CombX);

      this.setActions = function (key, func) {
        var _actions = {};
        _actions[key] = func;
        CombX.saxer.setActions(_actions);
        return this;
      };

      this.on = function (key, fun) {
        CombX.saxer.on(key, fun);
        return _this4;
      };

      this.emit = function (key, data) {
        return CombX.saxer.roll(key, data);
      };

      this.roll = function (key, data) {
        CombX.saxer.roll(key, data);
        return this;
      };
      this.emit = this.roll;

      this.append = function (obj) {
        CombX.saxer.append(obj);
        Object.keys(obj).map(function (item) {
          var lowCaseName = item.toLowerCase();
          that[lowCaseName] = function (param) {
            that.dispatch(item, param);
          };
        });
        return this;
      };
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
      var _props = this.props || this.config.props;

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

      this.config.props = _props || {};

      if (typeof id == 'string' || (typeof id === 'undefined' ? 'undefined' : _typeof(id)) == 'object') {
        if (this.isClient) {
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