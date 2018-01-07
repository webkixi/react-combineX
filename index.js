/**
 * React-combinex
 * 增强react的用法，贴近jquery的使用方式
 */
const _ = require('lodash')
const cloneDeep = _.cloneDeep
const merge = _.merge
var uuid = -1;

function uniqueId(prefix) {
  if (!prefix) prefix = 'random_'
  uuid++
  return prefix + uuid
}

let isReactNative = false
let empty = false
var noop = function(){}
var isClient = typeof window !== 'undefined'
var context = ( C => C ? window : global)(isClient) || {}
if (context.process) isClient = false
if (context.__BUNDLE_START_TIME__) isReactNative = true

const SAX = ( ()=> typeof SAX != 'undefined' ? SAX : require('fkp-sax'))()
const React = (typeof React != 'undefined' ? React : require('react'))

if (!isReactNative) {
  var reactDom = ( C => typeof ReactDOM != 'undefined' ? ReactDOM : typeof ReactDom != 'undefined' ? ReactDom : C ? require('react-dom') : require('react-dom/server'))(isClient)
  var findDOMNode = ( C => C ? reactDom.findDOMNode : function(){} )(isClient)
  var render      = ( C => C ? reactDom.render : reactDom.renderToString)(isClient)
} else {
  var reactDom = noop
  var findDOMNode = function(ctx){return ctx}
  var render = function(jsx){return jsx}
}

if (!context.SAX) {
  context.SAX = SAX
}

var isFunction = function (target) { return typeof target == 'function' }
let componentMonuted = {}
let instanceCollection = {}

function didMount(ctx, opts, cb, queryer) {
  let that = findDOMNode(this)
  if (typeof this.props.itemDefaultMethod == 'function') {
    this.props.itemDefaultMethod.call(ctx, that, this.intent)
  }

  if (
    typeof cb == 'function' ||
    typeof opts.rendered == 'function' ||
    typeof this.props.rendered == 'function' ||
    typeof this.props.itemMethod == 'function'
  ) {
    let imd = isFunction(cb) ? cb : isFunction(opts.rendered) ? opts.rendered : (this.props.rendered || this.props.itemMethod)
    if (!imd) imd = function () { }
    imd.call(ctx, that, this.intent)
  }

  if (queryer) {
    queryer.roll('rendered', {
      dom: that,
      opts: opts,
      ctx: ctx
    })

    queryer.roll('__rendered', {
      dom: that,
      opts: opts,
      ctx: ctx
    })
  }
}

function unMount(opts = {}, props = {}, queryer) {
  if (queryer) {
    var name = queryer.name
    if (props.unMountDestory) {
      // queryer.off('__rendered')
      // queryer.unbind()
      // queryer.destory()
      // // queryer = null
      // SAX.destory(name)
      instanceCollection[name].destory()
      // delete instanceCollection[name]
    }
  }

  if (typeof opts.leave == 'function') {
    var _ctx = {}

    if (name) _ctx.destory = function () {
      instanceCollection[name].destory()
    }

    if (typeof opts.leave == 'function') {
      opts.leave.call(_ctx)
    }
  }
}

const store = (sax => {
  try {
    if (!sax) throw 'storehlc depend on SAX, SAX is fkp-sax, is a Global fun'
    return (id, ComposedComponent, extension, opts, cb) => {
      if (!id) throw 'storehlc id must be set'
      class Store extends ComposedComponent {
        constructor(props) {
          super(props)
          this.globalName = id
          this.intent = this.props.intent || this.props.idf || 0;

          // 初始化，组件没有渲染的状态
          componentMonuted[this.globalName] = false

          const queryer = sax(this.globalName)
          this.saxer = queryer
          this.on = queryer:: queryer.on
          this.hasOn = queryer:: queryer.hasOn
          this.one = queryer:: queryer.one
          this.off = queryer:: queryer.off
          this.emit = queryer:: queryer.emit
          this.roll = queryer:: queryer.roll
          this.append = queryer:: queryer.append
          queryer.data.originalState
            ? queryer.data.originalState[this.globalName] = cloneDeep(this.state)  // queryer.data.originalState[this.globalName] = cloneDeep(this.state)
            : (() => {
              let temp = {};
              temp[this.globalName] = cloneDeep(this.state)  // temp[this.globalName] = cloneDeep(this.state)
              queryer.data.originalState = temp
            })()
          sax.bind(this.globalName, this)

          if (typeof extension == 'object') {
            if (typeof extension.plugins == 'object' && !Array.isArray(extension.plugins)) {
              const plugins = extension.plugins
              Object.keys(extension.plugins).map(item => {
                if (typeof plugins[item] == 'function') {
                  this[item] = plugins[item]
                }
              })
            }
          }
        }

        componentWillUnmount() {
          const queryer = sax(this.globalName)
          componentMonuted[this.globalName] = false
          super.componentWillUnmount ? super.componentWillUnmount() : ''
          opts.leave = opts.leave || this.props.leave
          unMount(opts, this.props, queryer)
        }

        componentDidUpdate() {
          this.didUpdate = true
          super.componentDidUpdate ? super.componentDidUpdate() : ''
          this.componentDidMount()
        }

        componentDidMount() {
          componentMonuted[this.globalName] = true

          if (this.didUpdate = true) {
            this.didUpdate = false
          } else {
            this.saxer.off('__rendered')
          }
          const _ctx = {
            // state: this.saxer.data.originalState[globalName],
            // dispatch: dispatcher,
            refs: this.refs,
            index: this.props.idf
          }
          super.componentDidMount ? super.componentDidMount() : ''
          didMount.call(this, _ctx, opts, cb, this.saxer)
        }
      }

      Store.defaultProps = {
        unMountDestory: false
      }

      return Store
    }
  } catch (e) {
    return ComposedComponent
  }
})(SAX)

function dealWithReactClass(CComponent, opts = {}, cb, queryer) {
  return class extends CComponent {
    constructor(props) {
      super(props)
      this.intent = this.props.intent
    }

    componentWillUnmount() {
      // opts.leave = opts.leave || this.props.leave
      // unMount.call(this, opts, queryer)

      opts.leave = opts.leave || this.props.leave
      super.componentWillUnmount ? super.componentWillUnmount() : ''
      unMount(opts, this.props, queryer)
    }

    componentDidMount() {
      const _ctx = {
        refs: this.refs,
        index: this.props.idf
      }
      super.componentDidMount ? super.componentDidMount() : ''
      didMount.call(this, _ctx, opts, cb, queryer)
    }
  }
}

/**
 * [dealWithReactElement 处理传入为react element 的场景，一般用于wrap]
 * @param  {react element} CComponent [description]
 * @return {react class}            [description]
 */
function dealWithReactElement(CComponent, opts = {}, cb, queryer) {
  return class extends React.Component {
    constructor(props) {
      super(props)
      this.intent = this.props.intent
    }

    componentWillUnmount() {
      // opts.leave = opts.leave || this.props.leave
      // unMount.call(this, opts, queryer)

      opts.leave = opts.leave || this.props.leave
      unMount(opts, this.props, queryer)
    }

    componentDidMount() {
      const _ctx = {}
      super.componentDidMount ? super.componentDidMount() : ''
      didMount.call(this, _ctx, opts, cb, queryer)
    }

    render() {
      return CComponent
    }
  }
}


/**
 * type 2
 * ComposedComponent 为 React class
 * @type {[type]}
 */
function dispatcher(key, props, QueryCtx, queryer, globalName) {
  const ctx = queryer.store.ctx[globalName]
  if (ctx) {
    // const liveState = cloneDeep(ctx.state)
    const liveState = ctx.state
    const oState = queryer.data.originalState[globalName]
    const queryActions = queryer.data
    queryActions.curState = liveState
    if (queryActions[key]) {
      const _tmp = queryActions[key].call(queryActions, oState, props, QueryCtx)
      if (_tmp) {
        ctx.setState(_tmp)
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
export default function combineX(ComposedComponent, opts, cb) {
  if (!ComposedComponent) return
  if (typeof ComposedComponent == 'string' || Array.isArray(ComposedComponent)) return
  let extension = cb
  if (typeof opts == 'function') {
    cb = opts
    opts = undefined
  }

  // will return React class for type 2
  let returnReactClass = false
  if (typeof opts == 'object' && opts.type == 'reactClass') {
    returnReactClass = true
    delete opts.type
  }

  /**
   * type 1
   * ComposedComponent 为 React element
   * @param  {[type]} React [description]
   * @return [type]         [description]
   */
  if (React.isValidElement(ComposedComponent)) {
    return dealWithReactElement(ComposedComponent, opts, cb)
  }

  if (returnReactClass) {
    // const globalName = uniqueId('returnReactClass_')
    return dealWithReactClass(
      ComposedComponent,
      opts,
      cb
    )
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

export function _wrap(ComposedComponent, opts, cb) {
  opts = opts || { type: 'reactClass' }
  if (isFunction(opts)) {
    cb = opts
    opts = { type: 'reactClass' }
  }

  if (typeof opts == 'object') {
    opts.type = 'reactClass'
  }

  return combineX(ComposedComponent, opts, cb)
}


// CombineClass
function browserRender(id, X, config) {
  const props = config.props
  if (typeof id == 'string') {
    if (document.getElementById(id)) {
      return render(<X {...props} />, document.getElementById(id))
    }
  }

  else if (typeof id == 'object' && id.nodeType) {
    return render(<X {...props} />, id)
  }
}

function _rendered(ctx, cb) {
  return function (dom, intent) {
    ctx.elements = this.refs
    cb(dom, intent)
  }
}

export class CombineClass {
  // constructor(config) {
  constructor(config={}, rctCls, acts, exts={}, gname) {
    this.config = config
    this.isClient = isClient
    this.elements   // rendered方法中赋值，react class的componentDidMount之后将refs的内容赋值给该变量
    this.leave  //unmounted 触发的方法

    let ext = {}
    const plugins = exts.plugins
    if (plugins) {
      Object.keys(plugins).map(item => {
        if (typeof plugins[item] == 'function') {
          ext[item] = plugins[item]
        }
      })
    }
    this.extension = { plugins: ext }

    this.globalName = (function(){
      return gname || uniqueId('Combinex_')
    })()

    // aotoo中下项是被释放的
    // 下列做法主要为兼容PC端老版系统
    // this.combinex(rctCls, acts) 
  }

  destory() {
    var queryer = this.saxer
    var name = queryer.name
    queryer.off('__rendered')
    queryer.unbind()
    queryer.destory()
    SAX.destory(name)

    for (let prop in this) {
      if (prop != 'destory') {
        delete this[prop]
      }
    }

    delete instanceCollection[name]
  }

  combinex(GridsBase, Actions = {}) {
    const that = this
    const globalName = this.globalName
    const queryer = SAX(globalName)
    queryer.append(Actions)
    this.x = store(globalName, GridsBase, this.extension, Actions)
    this.globalName = globalName
    this.saxer = queryer

    this.on = (evt, opts, func) => {
      queryer.on(evt, opts, func)
      return this
    }

    this.hasOn = (evt, opts, func) => {
      return queryer.hasOn(evt, opts, func)
    }

    this.one = (evt, opts, func) => {
      queryer.one(evt, opts, func)
      return this
    }

    this.off = (evt, opts, func) => {
      queryer.off(evt, opts, func)
      return this
    }

    this.roll = function (type, data) {
      return queryer.roll(type, data)
    }

    this.emit = this.roll

    this.hasMounted = function () {
      const gname = globalName
      return componentMonuted[gname]
    }

    this.dispatch = function (key, props, ctx) {
      const that = this
      const hasMounted = that.hasMounted()
      this.saxer.off('__rendered')
      if (hasMounted) {
        setTimeout(function () {
          dispatcher(key, props, that, that.saxer, that.globalName)
        }, 0);
      } else {
        clearTimeout(that.timer)
        this.saxer.on('__rendered', function () {
          that.timer = setTimeout(function () {
            clearTimeout(that.timer)
            dispatcher(key, props, that, that.saxer, that.globalName)
            that.saxer.off('__rendered')
          }, 0);
        })
      }
    }

    this.getState = function () {
      const ctx = this.saxer.store.ctx[this.globalName]
      return ctx.state
    }

    let keynames = Object.keys(Actions)
    const lowKeyNames = keynames.map(item => item.toLowerCase())
    const upKeyNames = keynames

    for (let ii = 0; ii < lowKeyNames.length; ii++) {
      const actName = upKeyNames[ii]
      this['$' + lowKeyNames[ii]] = function (param) {
        this.dispatch(actName, param, this)
        return this
      }
    }

    this.appendActions = function (obj) {
      this.saxer.append(obj)
      Object.keys(obj).map(function (item) {
        const lowCaseName = '$' + item.toLowerCase()
        that[lowCaseName] = function (param) {
          that.dispatch(item, param)
        }
      })
      return this
    }
  }

  extend(exts) {
    if (typeof exts == 'object') {
      Object.keys(exts).map(_name => {
        const _ext = exts[_name]
        this[_name] = exts[_name]
      })
    }
  }

  setConfig(config) {
    this.config = config || {}
    return this
  }

  setProps(props) {
    this.config.props = props
    return this
  }

  reRender() {
    this.render()
  }

  render(id, cb) {
    id = id || this.config.container
    const X = this.x
    let _props = this.props || this.config.props || {
      unMountDestory: false,
      leave: false
    }

    if (typeof id == 'function' || typeof cb == 'function') {
      this.config.rendered = typeof id == 'function' ? id : cb
    }
    if (typeof this.config.rendered == 'function' || typeof this.rendered == 'function') {
      const rended = (this.config.rendered || this.rendered)
      if (_props) _props.rendered = _rendered(this, rended)
      else {
        _props = {
          rendered: _rendered(this, rended)
        }
      }
    }
    _props.leave = this.leave || this.config.leave || (this.config.props && this.config.props.leave)
    this.config.props = _props || {}

    if (typeof id == 'string' || typeof id == 'object') {
      if (this.isClient && !isReactNative) {
        this.config.container = id
        return browserRender(id, X, this.config)
      }
    }

    _props = _props || {}
    return <X {..._props} />
  }
}

export function createCombinClass(rctCls, acts, config, exts) {
  const globalName = uniqueId('Combinex_')
  instanceCollection[globalName] = new CombineClass(config, rctCls, acts, exts, globalName)
  return instanceCollection[globalName]
}