'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _fkpSax = require('fkp-sax');

var _fkpSax2 = _interopRequireDefault(_fkpSax);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _lodash = require('lodash.uniqueid');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.merge');

var _lodash4 = _interopRequireDefault(_lodash3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * itemHlc  [react的高阶组件，给子组件绑定itemMethod方法，componentDidMount后]
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ComposedComponent  {React-Element}   [被包围的子组件]
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var globalName = (0, _lodash2.default)('ReQuery_');
var queryer = (0, _fkpSax2.default)(globalName);

function _store(sax) {
  try {
    if (!sax) throw 'storehlc depend on SAX, SAX is fkp-sax, is a Global fun';
    return function (id, ComposedComponent) {
      if (!id) throw 'storehlc id must be set';
      return function (_ComposedComponent) {
        _inherits(_class, _ComposedComponent);

        function _class(props) {
          _classCallCheck(this, _class);

          var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

          _this.state.globalName = id;
          return _this;
        }

        _createClass(_class, [{
          key: 'componentWillMount',
          value: function componentWillMount() {
            sax.bind(id, this);
            if (_get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), 'componentWillMount', this)) _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), 'componentWillMount', this).call(this);
          }
        }]);

        return _class;
      }(ComposedComponent);
    };
  } catch (e) {
    return ComposedComponent;
  }
}
var store = _store(_fkpSax2.default);

exports.default = function (ComposedComponent, opts, cb) {
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
        key: 'componentDidMount',
        value: function componentDidMount() {
          var self = this;
          var that = (0, _reactDom.findDOMNode)(this);
          var ctx = {
            show: this.show,
            hide: this.hide
          };

          if (this.props.itemDefaultMethod) {
            if (this.props.itemMethod) this.props.itemMethod.call(ctx, that, self.intent);
            setTimeout(function () {
              if (typeof self.props.itemDefaultMethod === 'function') self.props.itemDefaultMethod.call(ctx, that, self.intent);
            }, 17);
          } else if (typeof cb == 'function' || this.props.itemMethod) {
            var imd = cb || this.props.itemMethod;
            imd.call(ctx, that, self.intent);
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

  var CC = store(globalName, ComposedComponent);
  queryer.append(opts || {});
  function _dispatch(key) {
    var ctx = queryer.store.ctx[globalName];
    var stateAsset = ctx.state;
    var queryData = queryer.data;
    if (queryData[key]) {
      var target = (0, _lodash4.default)({}, stateAsset, queryData[key]());
      ctx.setState(target);
    }
  }

  var ReactComponentMonuted = false;

  var Temp = function (_CC) {
    _inherits(Temp, _CC);

    function Temp(props) {
      _classCallCheck(this, Temp);

      var _this3 = _possibleConstructorReturn(this, (Temp.__proto__ || Object.getPrototypeOf(Temp)).call(this, props));

      _this3.intent = _this3.props.intent || [];
      return _this3;
    }

    _createClass(Temp, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var self = this;
        var that = (0, _reactDom.findDOMNode)(this);

        var _ctx = {
          dispatch: _dispatch,
          refs: this.refs
        };

        if (this.props.itemDefaultMethod) {
          if (this.props.itemMethod) this.props.itemMethod.call(that, _ctx, self.intent);
          setTimeout(function () {
            if (typeof self.props.itemDefaultMethod === 'function') self.props.itemDefaultMethod.call(that, _ctx, self.intent);
          }, 17);
        } else if (typeof cb == 'function' || this.props.itemMethod) {
          var imd = cb || this.props.itemMethod;
          imd.call(that, _ctx, self.intent);
        }
        _get(Temp.prototype.__proto__ || Object.getPrototypeOf(Temp.prototype), 'componentDidMount', this) ? _get(Temp.prototype.__proto__ || Object.getPrototypeOf(Temp.prototype), 'componentDidMount', this).call(this) : '';
        ReactComponentMonuted = true;
      }
    }]);

    return Temp;
  }(CC);

  var timer = void 0;

  var Query = function () {
    function Query(config) {
      _classCallCheck(this, Query);

      this.element = Temp;
      this.setActions = queryer.setActions;
      this.roll = queryer.roll;
    }

    _createClass(Query, [{
      key: 'dispatch',
      value: function dispatch(key) {
        clearTimeout(timer);
        timer = setTimeout(function () {
          if (ReactComponentMonuted) _dispatch(key);
        }, 100);
      }
    }]);

    return Query;
  }();

  return new Query();
};