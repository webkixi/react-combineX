'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CombineClass = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.default = combineX;

var _fkpSax = require('fkp-sax');

var _fkpSax2 = _interopRequireDefault(_fkpSax);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

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
 * itemHlc  [react的高阶组件，给子组件绑定itemMethod方法，componentDidMount后]
 * ComposedComponent  {React-Element}   [被包围的子组件]
 */

var isClient = function () {
  return typeof window !== 'undefined';
}();

var findDOMNode = isClient ? require('react-dom').findDOMNode : function () {};


var store = function (sax) {
  try {
    if (!sax) throw 'storehlc depend on SAX, SAX is fkp-sax, is a Global fun';
    return function (id, ComposedComponent) {
      if (!id) throw 'storehlc id must be set';
      return function (_ComposedComponent) {
        _inherits(_class, _ComposedComponent);

        function _class(props) {
          _classCallCheck(this, _class);

          var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

          _this.globalName = id;
          var queryer = sax(id);
          queryer.data.originalState ? queryer.data.originalState[id] = (0, _lodash2.default)(_this.state) : function () {
            var temp = {};temp[id] = (0, _lodash2.default)(_this.state);
            queryer.data.originalState = temp;
          }();
          sax.bind(id, _this);
          return _this;
        }

        return _class;
      }(ComposedComponent);
    };
  } catch (e) {
    return ComposedComponent;
  }
}(_fkpSax2.default);

function combineX(ComposedComponent, opts, cb) {
  if (typeof opts == 'function') {
    cb = opts;
    opts = undefined;
  }
  if (!ComposedComponent) {
    console.log('请指定ComposedComponent');
    return;
  }
  if (typeof ComposedComponent == 'string' || Array.isArray(ComposedComponent)) {
    return;
  }

  var globalName = (0, _lodash6.default)('Combinex_');
  var queryer = (0, _fkpSax2.default)(globalName, opts || {});
  // let queryer = SAX(globalName)

  /**
   * ComposedComponent 为 React element
   * @param  {[type]} React [description]
   * @return [type]         [description]
   */
  if (_react2.default.isValidElement(ComposedComponent)) {
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

          if (typeof this.props.itemDefaultMethod == 'function') {
            self.props.itemDefaultMethod.call(_ctx, that, self.intent);
          }

          if (typeof cb == 'function' || typeof this.props.rendered == 'function' || typeof this.props.itemMethod == 'function') {
            var imd = cb || this.props.rendered || this.props.itemMethod;
            imd.call(_ctx, that, self.intent);
          }

          _get(_class2.prototype.__proto__ || Object.getPrototypeOf(_class2.prototype), 'componentDidMount', this) ? _get(_class2.prototype.__proto__ || Object.getPrototypeOf(_class2.prototype), 'componentDidMount', this).call(this) : '';
        }
      }, {
        key: 'render',
        value: function render() {
          return this.state.show ? ComposedComponent : _react2.default.createElement('var', null);
        }
      }]);

      return _class2;
    }(_react2.default.Component);
  }

  /**
   * ComposedComponent 为 React class
   * @type {[type]}
   */

  function dispatcher(key, props) {
    var ctx = queryer.store.ctx[globalName];

    var liveState = (0, _lodash4.default)({}, ctx.state);
    var oState = queryer.data.originalState[globalName];
    // const oState = JSON.parse(queryer.data.originalState[globalName])

    var queryActions = queryer.data;

    var _state = {
      curState: liveState
    };

    if (queryActions[key]) {
      var _tmp = queryActions[key].call(_state, oState, props);
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
          dispatch: dispatcher,
          refs: this.refs
        };

        if (typeof this.props.itemDefaultMethod == 'function') {
          self.props.itemDefaultMethod.call(_ctx, that, self.intent);
        }

        if (typeof cb == 'function' || typeof this.props.rendered == 'function' || typeof this.props.itemMethod == 'function') {
          var imd = cb || this.props.rendered || this.props.itemMethod;
          imd.call(_ctx, that, self.intent);
        }

        _get(Temp.prototype.__proto__ || Object.getPrototypeOf(Temp.prototype), 'componentDidMount', this) ? _get(Temp.prototype.__proto__ || Object.getPrototypeOf(Temp.prototype), 'componentDidMount', this).call(this) : '';
        ReactComponentMonuted = true;
      }
    }]);

    return Temp;
  }(ComposedComponent);

  var Query = function () {
    function Query(config) {
      _classCallCheck(this, Query);

      this.element = store(globalName, Temp);
      this.timer;
      this.globalName = globalName;
      this.saxer = queryer;
      this.setActions = queryer.setActions;
      this.on = queryer.on;
      this.roll = queryer.roll;
    }

    _createClass(Query, [{
      key: 'dispatch',
      value: function dispatch(key, props) {
        clearTimeout(this.timer);
        this.timer = setTimeout(function () {
          if (ReactComponentMonuted) dispatcher(key, props);
        }, 0);
      }
    }]);

    return Query;
  }();

  if (opts.type == 'reactClass') {
    return Temp;
  } else {
    return new Query();
  }
}

// BaseCombine

var CombineClass = exports.CombineClass = function () {
  function CombineClass(config) {
    _classCallCheck(this, CombineClass);

    this.config = config;
    this.isClient = function () {
      return typeof window !== 'undefined';
    }();
    this.element;
    this.inject = this.inject.bind(this);
    this.combinex = this.combinex.bind(this);

    this.inject();
  }

  _createClass(CombineClass, [{
    key: 'combinex',
    value: function combinex(GridsBase) {
      var Actions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var that = this;
      var CombX = combineX(GridsBase, Actions);
      this.x = CombX.element;
      this.dispatch = CombX.dispatch;

      this.setActions = function (key, func) {
        var _actions = {};
        _actions[key] = func;
        CombX.saxer.setActions(_actions);
      };
      this.on = this.setActions;

      this.roll = function (key, data) {
        CombX.saxer.roll(key, data);
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
    }
  }, {
    key: 'browserRender',
    value: function browserRender(id, X) {
      if (typeof id == 'string') {
        return _react2.default.render(_react2.default.createElement(X, this.config.props), document.getElementById(id));
      } else if ((typeof id === 'undefined' ? 'undefined' : _typeof(id)) == 'object' && id.nodeType) {
        return _react2.default.render(_react2.default.createElement(X, this.config.props), id);
      }
    }
  }, {
    key: 'render',
    value: function render(id, cb) {
      id = id || this.config.container;
      var X = this.x;

      if (typeof id == 'function' || typeof cb == 'function') {
        this.config.rendered = typeof id == 'function' ? id : cb;
      }
      if (typeof this.config.rendered == 'function' || typeof this.rendered == 'function') {
        if (this.config.props) this.config.props.rendered = this.config.rendered || this.rendered;else {
          this.config.props = {
            rendered: this.config.rendered || this.rendered
          };
        }
      }

      if (typeof id == 'string' || (typeof id === 'undefined' ? 'undefined' : _typeof(id)) == 'object') {
        if (this.isClient) return this.browserRender(id, X);
      }

      return _react2.default.createElement(X, this.config.props);
    }
  }]);

  return CombineClass;
}();