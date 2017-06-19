"use strict";function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function dealWithReactElement(t,e,n,o){return function(i){function r(t){_classCallCheck(this,r);var e=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,t));return e.intent=e.props.intent,e.state={show:!0},e.show=e.show.bind(e),e.hide=e.hide.bind(e),e}return _inherits(r,i),_createClass(r,[{key:"componentWillMount",value:function(){0==this.props.show&&this.setState({show:!1})}},{key:"show",value:function(){this.setState({show:!0})}},{key:"hide",value:function(){this.setState({show:!1})}},{key:"componentDidUpdate",value:function(){this.componentDidMount()}},{key:"componentDidMount",value:function(){findDOMNode(this);var t={show:this.show,hide:this.hide};_get(r.prototype.__proto__||Object.getPrototypeOf(r.prototype),"componentDidMount",this)&&_get(r.prototype.__proto__||Object.getPrototypeOf(r.prototype),"componentDidMount",this).call(this),didMount.call(this,t,e,n,o)}},{key:"render",value:function(){return this.state.show?t:React.createElement("span",null)}}]),r}(React.Component)}function combineX(t,e,n){function o(t,e,n){var o=s.store.ctx[r],i=(0,_lodash2.default)(o.state),a=s.data.originalState[r],c=s.data;if(c.curState=i,n.data=i.data,c[t]){var u=c[t].call(c,a,e);u&&o.setState(u)}}if(t&&"string"!=typeof t&&!Array.isArray(t)){var i=n;"function"==typeof e&&(n=e,e=void 0);var r=(0,_lodash6.default)("Combinex_"),s=SAX(r);e&&s.append(e);var a=!1;if("object"==(void 0===e?"undefined":_typeof(e))&&"reactClass"==e.type&&(a=!0,delete e.type),React.isValidElement(t))return dealWithReactElement(t,e,n,s);var c=function(t){function i(t){_classCallCheck(this,i);var e=_possibleConstructorReturn(this,(i.__proto__||Object.getPrototypeOf(i)).call(this,t));return e.intent=e.props.intent||[],e}return _inherits(i,t),_createClass(i,[{key:"componentWillUnmount",value:function(){var t=this.globalName;componentMonuted.data[t]=!1}},{key:"componentDidUpdate",value:function(){this.componentDidMount()}},{key:"componentDidMount",value:function(){findDOMNode(this);var t={dispatch:o,refs:this.refs};_get(i.prototype.__proto__||Object.getPrototypeOf(i.prototype),"componentDidMount",this)&&_get(i.prototype.__proto__||Object.getPrototypeOf(i.prototype),"componentDidMount",this).call(this),didMount.call(this,t,e,n,s),componentMonuted.data[this.globalName]=!0}}]),i}(t),u=function t(e){_classCallCheck(this,t),this.config=e,this.element=store(r,c,i),this.timer,this.globalName=r,this.saxer=s,this.setActions=s.setActions,this.on=s.on,this.roll=s.roll,this.data,this.hasMounted=function(){var t=this.globalName;return componentMonuted.data[t]},this.dispatch=function(t,e){var n=this;clearTimeout(this.timer),this.timer=setTimeout(function(){n.hasMounted()&&o(t,e,n)},0)}};return a?store(r,c,i):new u}}function wrap(t,e,n){return e||(e={type:"reactClass"}),"function"==typeof e&&(n=e,e={type:"reactClass"}),"object"==(void 0===e?"undefined":_typeof(e))&&(e.type="reactClass"),combineX(t,e,n)}function browserRender(t,e,n){var o=n.props;return"string"==typeof t?render(React.createElement(e,o),document.getElementById(t)):"object"==(void 0===t?"undefined":_typeof(t))&&t.nodeType?render(React.createElement(e,o),t):void 0}function _rendered(t,e){return function(n,o){t.elements=this.refs,t.data=t.combx.data?t.combx.data:t.config.props.data,e.call(this,n,o,t)}}Object.defineProperty(exports,"__esModule",{value:!0}),exports.CombineClass=void 0;var _createClass=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),_get=function t(e,n,o){null===e&&(e=Function.prototype);var i=Object.getOwnPropertyDescriptor(e,n);if(void 0===i){var r=Object.getPrototypeOf(e);return null===r?void 0:t(r,n,o)}if("value"in i)return i.value;var s=i.get;if(void 0!==s)return s.call(o)},_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};exports.default=combineX,exports.wrap=wrap;var _lodash=require("lodash.clonedeep"),_lodash2=_interopRequireDefault(_lodash),_lodash3=require("lodash.merge"),_lodash4=_interopRequireDefault(_lodash3),_lodash5=require("lodash.uniqueid"),_lodash6=_interopRequireDefault(_lodash5),isClient="undefined"!=typeof window,context=function(t){return t?window:global}(isClient)||{},SAX=function(){return void 0!==SAX?SAX:require("fkp-sax")}(),React=void 0!==React?React:require("react"),reactDom=function(t){return"undefined"!=typeof ReactDOM?ReactDOM:"undefined"!=typeof ReactDom?ReactDom:t?require("react-dom"):require("react-dom/server")}(isClient),findDOMNode=function(t){return t?reactDom.findDOMNode:function(){}}(isClient),render=function(t){return t?reactDom.render:reactDom.renderToString}(isClient);context.SAX||(context.SAX=SAX);var componentMonuted=SAX("ReactComponentMonuted"),store=function(t){try{if(!t)throw"storehlc depend on SAX, SAX is fkp-sax, is a Global fun";return function(e,n,o){if(!e)throw"storehlc id must be set";return function(n){function i(n){_classCallCheck(this,i);var r=_possibleConstructorReturn(this,(i.__proto__||Object.getPrototypeOf(i)).call(this,n));r.globalName=e;var s={};s[e]=!1,componentMonuted.append(s);var a=t(e);if(a.data.originalState?a.data.originalState[e]=(0,_lodash2.default)(r.state):function(){var t={};t[e]=(0,_lodash2.default)(r.state),a.data.originalState=t}(),t.bind(e,r),"object"==(void 0===o?"undefined":_typeof(o))&&"object"==_typeof(o.plugins)&&!Array.isArray(o.plugins)){var c=o.plugins;Object.keys(o.plugins).map(function(t){"function"==typeof c[t]&&(r[t]=c[t])})}return r}return _inherits(i,n),i}(n)}}catch(t){return ComposedComponent}}(SAX),isFunction=function(t){return"function"==typeof t},didMount=function(t,e,n,o){var i=findDOMNode(this);"function"==typeof this.props.itemDefaultMethod&&this.props.itemDefaultMethod.call(t,i,this.intent),"function"!=typeof n&&"function"!=typeof this.props.rendered&&"function"!=typeof this.props.itemMethod||(isFunction(n)?n:this.props.rendered||this.props.itemMethod).call(t,i,this.intent),o.roll("rendered")},CombineClass=exports.CombineClass=function(){function t(e){_classCallCheck(this,t),this.config=e,this.isClient=isClient,this.extension={},this.elements,browserRender=browserRender.bind(this),this.inject()}return _createClass(t,[{key:"combinex",value:function(t){var e=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},o=this,i=combineX(t,n,this.extension);this.combx=i,this.globalName=i.globalName,this.x=i.element,this.dispatch=i.dispatch.bind(i),this.hasMounted=i.hasMounted.bind(i);for(var r=Object.keys(n),s=r.map(function(t){return t.toLowerCase()}),a=r,c=0;c<s.length;c++)!function(t){var n=a[t];e["$"+s[t]]=function(t){return this.dispatch(n,t),this}}(c);this.on=function(t,n){return i.saxer.on(t,n),e},this.off=function(t){return i.saxer.off(t),e},this.roll=function(t,e){return i.saxer.roll(t,e),this},this.emit=this.roll,this.appendActions=function(t){return i.saxer.append(t),Object.keys(t).map(function(t){var e="$"+t.toLowerCase();o[e]=function(e){o.dispatch(t,e)}}),this}}},{key:"extend",value:function(t){var e=this;"object"==(void 0===t?"undefined":_typeof(t))&&Object.keys(t).map(function(n){e[n]=t[n]})}},{key:"inject",value:function(t){return this.isClient,this}},{key:"setConfig",value:function(t){return this.config=t||{},this}},{key:"setProps",value:function(t){return this.config.props=t,this}},{key:"reRender",value:function(){this.render()}},{key:"render",value:function(t,e){t=t||this.config.container;var n=this.x,o=this.props||this.config.props;if("function"!=typeof t&&"function"!=typeof e||(this.config.rendered="function"==typeof t?t:e),"function"==typeof this.config.rendered||"function"==typeof this.rendered){var i=this.config.rendered||this.rendered;o?o.rendered=_rendered(this,i):o={rendered:_rendered(this,i)}}return this.config.props=o||{},"string"!=typeof t&&"object"!=(void 0===t?"undefined":_typeof(t))||!this.isClient?(o=o||{},React.createElement(n,o)):(this.config.container=t,browserRender(t,n,this.config))}}]),t}();
//# sourceMappingURL=maps/index.js.map
