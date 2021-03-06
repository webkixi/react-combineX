/**
 * React-combinex
 * 增强react的用法，贴近jquery的使用方式
 */
let isReactNative = false
let empty = false
var noop = function(){}
var isClient = typeof window !== 'undefined'
var context = ( C => C ? window : global)(isClient) || {}
if (context.process) isClient = false
if (context.__BUNDLE_START_TIME__) isReactNative = true
// if (context.regeneratorRuntime && context.nativeCallSyncHook) isReactNative = true

// console.log(context.regeneratorRuntime);
// console.log(context.XMLHttpRequest);
// console.log(context.performance);
// console.log(context.alert);
// console.log(context.navigator);

import cloneDeep from 'lodash.clonedeep'
import merge from 'lodash.merge'
import uniqueId from 'lodash.uniqueid'
const SAX = ( ()=> typeof SAX != 'undefined' ? SAX : require('fkp-sax'))()
const React = (typeof React != 'undefined' ? React : require('react'))


if (!isReactNative) {
  // empty = <span />
  var reactDom = ( C => typeof ReactDOM != 'undefined' ? ReactDOM : typeof ReactDom != 'undefined' ? ReactDom : C ? require('react-dom') : require('react-dom/server'))(isClient)
  var findDOMNode = ( C => C ? reactDom.findDOMNode : function(){} )(isClient)
  var render      = ( C => C ? reactDom.render : reactDom.renderToString)(isClient)
} else {
  // var {Text} = ( () => typeof ReactNative != 'undefined' ? ReactNative : require2('react-native'))()
  // empty = <Text></Text>
  var reactDom = noop
  var findDOMNode = function(ctx){return ctx}
  var render = function(jsx){return jsx}
}

if (!context.SAX) {
  context.SAX = SAX
}

const componentMonuted = SAX('ReactComponentMonuted')
const store = ( sax => {
  try {
    if (!sax) throw 'storehlc depend on SAX, SAX is fkp-sax, is a Global fun'
    return (id, ComposedComponent, extension) => {
      if (!id) throw 'storehlc id must be set'
      return class extends ComposedComponent {
        constructor(props) {
          super(props)
          this.globalName = id

          // 初始化，组件没有渲染的状态
          const unmounted = {}
          unmounted[id] = false
          componentMonuted.append(unmounted)

          const queryer = sax(id)
          this.saxer = queryer
          this.on = queryer::queryer.on
          this.hasOn = queryer::queryer.hasOn
          this.one = queryer::queryer.one
          this.off = queryer::queryer.off
          this.emit = queryer::queryer.emit
          this.roll = queryer::queryer.roll
          this.append = queryer::queryer.append
          queryer.data.originalState
          ? queryer.data.originalState[id] = cloneDeep(this.state)
          : ( ()=>{
            let temp = {}; temp[id] = cloneDeep(this.state)
            queryer.data.originalState = temp
          })()
          sax.bind(id, this)

          if (typeof extension == 'object') {
            if (typeof extension.plugins == 'object' && !Array.isArray(extension.plugins)) {
              const plugins = extension.plugins
              Object.keys(extension.plugins).map( item => {
                if (typeof plugins[item] == 'function') {
                  // plugins[item] = this::plugins[item]
                  this[item] = plugins[item]
                }
              })
            }
          }
        }
      }
    }
  } catch (e) {
    return ComposedComponent
  }
})(SAX)

const isFunction = function(target){
  return typeof target == 'function'
}

const didMount = function(ctx, opts, cb, queryer){
  let that = findDOMNode(this)
  if( typeof this.props.itemDefaultMethod == 'function' ){
    this.props.itemDefaultMethod.call(ctx, that, this.intent)
  }

  if (
    typeof cb == 'function' ||
    typeof opts.rendered == 'function' ||
    typeof this.props.rendered == 'function' ||
    typeof this.props.itemMethod == 'function'
  ) {
    let imd = isFunction(cb) ? cb : isFunction(opts.rendered) ? opts.rendered : (this.props.rendered || this.props.itemMethod)
    if (!imd) imd = function(){}
    imd.call(ctx, that, this.intent)
  }
  queryer.roll('rendered', {
    dom : that,
    opts: opts,
    ctx : ctx
  })

  queryer.roll('__rendered', {
    dom : that,
    opts: opts,
    ctx : ctx
  })
}

const unMount = function(opts, queryer){
  let that = findDOMNode(this)
  if (
    typeof opts.leave == 'function' ||
    typeof this.props.leave == 'function'
  ) {
    let imd = isFunction(opts.leave) ? opts.leave : this.props.leave
    imd(that, this.intent)
  }
}


/**
 * [dealWithReactElement 处理传入为react element 的场景，一般用于wrap]
 * @param  {react element} CComponent [description]
 * @return {react class}            [description]
 */
function dealWithReactElement(CComponent, opts, cb, queryer){
  return class extends React.Component {
    constructor(props){
      super(props)
      this.intent = this.props.intent
      this.state = { show: true }

      this.show = this.show.bind(this)
      this.hide = this.hide.bind(this)
    }
    componentWillMount() {
      if (this.props.show == false) this.setState({ show: false })
    }
    show(){
      this.setState({
        show: true
      })
    }
    hide(){
      this.setState({
        show: false
      })
    }

    componentWillUnmount(){
      unMount.call(this, opts, queryer)
    }

    componentDidUpdate(){
      this.componentDidMount()
    }

    componentDidMount() {
      let self = this
      let that = findDOMNode(this);

      // const _ctx = {
      //   show: this.show,
      //   hide: this.hide
      // }

      const _ctx = {}
      super.componentDidMount ? super.componentDidMount() : ''
      didMount.call(this, _ctx, opts, cb, queryer)
    }
    render(){
      // return this.state.show ? CComponent : empty
      return CComponent
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

export default function combineX(ComposedComponent, opts, cb){
  if (!ComposedComponent) return

  if ( typeof ComposedComponent == 'string' || Array.isArray(ComposedComponent) ) return

  let extension = cb

  if (typeof opts == 'function') {
    cb = opts
    opts = undefined
  }

  const globalName = uniqueId('Combinex_')

  let queryer = SAX(globalName)
  if (opts) { queryer.append(opts) }

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
    return dealWithReactElement(ComposedComponent, opts, cb, queryer)
  }






  /**
   * type 2
   * ComposedComponent 为 React class
   * @type {[type]}
   */

  function dispatcher(key, props, QueryCtx){
    const ctx = queryer.store.ctx[globalName]

    const liveState = cloneDeep(ctx.state)
    const oState = queryer.data.originalState[globalName]
    // const oState = JSON.parse(queryer.data.originalState[globalName])

    const queryActions = queryer.data

    // const _state = {
    //   curState: liveState,
    // }

    queryActions.curState = liveState
    QueryCtx.data = liveState.data

    if (queryActions[key]) {
      const _tmp = queryActions[key].call(queryActions, oState, props, QueryCtx)
      if (_tmp) {
        // const target = merge({}, oState, _tmp)
        ctx.setState(_tmp)
      }
    }
  }

  let ReactComponentMonuted = false
  class Temp extends ComposedComponent {
    constructor(props) {
      super(props);
			this.intent = this.props.intent || this.props.idf || 0;
    }

    componentWillUnmount(){
      // const gname = this.globalName
      // componentMonuted.data[gname] = false
      super.componentWillUnmount ? super.componentWillUnmount() : ''
      componentMonuted.data[this.globalName] = false
      queryer.off('__rendered')
      unMount.call(this, opts, queryer)
    }

    componentDidUpdate(){
      this.didUpdate = true
      super.componentDidUpdate ? super.componentDidUpdate() : ''
      this.componentDidMount()
    }

    componentDidMount(){
			let self = this
			let that = findDOMNode(this);
      componentMonuted.data[this.globalName] = true

      if (this.didUpdate = true){
        this.didUpdate = false
      } else {
        queryer.off('__rendered')
      }
      const _ctx = {
        // state: queryer.data.originalState[globalName],
        dispatch: dispatcher,
        refs: this.refs,
        index: this.props.idf
      }
      super.componentDidMount ? super.componentDidMount() : ''
      didMount.call(this, _ctx, opts, cb, queryer)

		}
  }

  class Query {
    constructor(config){
      this.config = config
      this.element = store(globalName, Temp, extension)
      this.timer
      this.globalName = globalName
      this.saxer = queryer
      this.setActions = queryer::queryer.setActions
      this.on = queryer::queryer.on
      this.hasOn = queryer::queryer.hasOn
      this.one = queryer::queryer.one
      this.off = queryer::queryer.off
      this.roll = queryer::queryer.roll
      this.emit = queryer::queryer.emit
      this.data

      this.hasMounted = function(){
        const gname = this.globalName
        return componentMonuted.data[gname]
      }

      this.dispatch = function(key, props, ctx){
        const that = this
        const hasMounted = that.hasMounted()
        this.saxer.off('__rendered')
        if (hasMounted) {
          setTimeout(function() {
            dispatcher(key, props, that)
          }, 0);
        } else {
          clearTimeout(that.timer)
          this.saxer.on('__rendered', function(){
            that.timer = setTimeout(function() {
              clearTimeout(that.timer)
              dispatcher(key, props, that)
              that.saxer.off('__rendered')
            }, 0);
          })
        }
      }
    }
  }

  if (returnReactClass) {
    return store(globalName, Temp, extension)
  } else {
    return new Query()
  }
}

export function _wrap(ComposedComponent, opts, cb){
  if (!opts) opts = {type: 'reactClass'}

  if (typeof opts == 'function') {
    cb = opts
    opts = {
      type: 'reactClass'
    }
  }

  if (typeof opts == 'object') {
    opts.type = 'reactClass'
  }

  return combineX(ComposedComponent, opts, cb)
}


// CombineClass

function browserRender(id, X, config){
  const props = config.props
  if (typeof id == 'string') {
    if (document.getElementById(id)) {
      return render(<X {...props}/>, document.getElementById(id))
    }
  }

  else if (typeof id == 'object' && id.nodeType) {
    return render(<X {...props}/>, id)
  }
}

function _rendered(ctx, cb){
  return function(dom, intent){
    ctx.elements = this.refs
    // ctx.data = ctx.combx.data ? ctx.combx.data : ctx.config.props.data  // 用于实例中做数据查询，该data同步于react class的state.data，dispatcher中动态更新该值
    cb.call(this, dom, intent, ctx)
  }
}

export class CombineClass{
  constructor(config){
    this.config = config
    this.isClient = isClient
    this.extension = {}
    this.elements   // rendered方法中赋值，react class的componentDidMount之后将refs的内容赋值给该变量
    this.leave  //unmounted 触发的方法
    browserRender = this::browserRender

    this.inject()
  }

  combinex(GridsBase, Actions={}){
    const that = this
    const CombX = combineX(GridsBase, Actions, this.extension)
    this.combx = CombX
    this.saxer = CombX.saxer
    this.globalName = CombX.globalName
    this.x = CombX.element
    this.dispatch = CombX::CombX.dispatch
    this.hasMounted = CombX::CombX.hasMounted
    this.data = CombX.data

    this.getState = function(){
      const ctx = this.saxer.store.ctx[this.globalName]
      const liveState = {...ctx.state}
      return liveState
      // return this.saxer.data && this.saxer.data.originalState && this.saxer.data.originalState[this.globalName]
    }.bind(this)


    let keynames = Object.keys(Actions)
    const lowKeyNames = keynames.map( item => item.toLowerCase() )
    const upKeyNames = keynames

    for (let ii=0; ii<lowKeyNames.length; ii++) {
      const actName = upKeyNames[ii]
      this['$'+lowKeyNames[ii]] = function(param){
        this.dispatch(actName, param, this)
        return this
      }
    }

    // this.setActions = function(key, func){
    //   const _actions = {}
    //   _actions[key] = func
    //   CombX.saxer.setActions(_actions)
    //   return this
    // }

    this.on = (evt, opts, func)=>{
      CombX.saxer.on(evt, opts, func)
      return this
    }

    this.hasOn = (evt, opts, func) => {
      return CombX.saxer.hasOn(evt, opts, func)
    }

    this.one = (evt, opts, func)=>{
      CombX.saxer.one(evt, opts, func)
      return this
    }

    this.off = (evt, opts, func) => {
      CombX.saxer.off(evt, opts, func)
      return this
    }

    this.roll = function(type, data){
      return CombX.saxer.roll(type, data)
    }

    this.emit = this.roll


    this.appendActions = function(obj){
      CombX.saxer.append(obj)
      Object.keys(obj).map(function(item){
        const lowCaseName = '$'+item.toLowerCase()
        that[lowCaseName] = function(param){
          that.dispatch(item, param)
        }
      })
      return this
    }
  }

  extend(exts){
    if (typeof exts == 'object') {
      Object.keys(exts).map( _name => {
        this[_name] = exts[_name]
      })
    }
  }

  inject(src){
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
    return this
  }

  setConfig(config){
    this.config = config || {}
    return this
  }

  setProps(props){
    this.config.props = props
    return this
  }

  reRender(){
    this.render()
  }

  render(id, cb){
    id = id || this.config.container
    const X = this.x
    let _props = this.props || this.config.props || {}

    if (typeof id == 'function' || typeof cb == 'function') {
      this.config.rendered = typeof id == 'function' ? id : cb
    }
    if ( typeof this.config.rendered == 'function' || typeof this.rendered == 'function' ) {
      const rended = (this.config.rendered || this.rendered )
      if (_props) _props.rendered = _rendered(this, rended)
      else {
        _props = {
          rendered: _rendered(this, rended)
        }
      }
    }
    _props.leave = this.leave || this.config.leave || (this.config.props&&this.config.props.leave)
    this.config.props = _props || {}

    if (typeof id == 'string' || typeof id == 'object') {
      if (this.isClient && !isReactNative) {
        this.config.container = id
        return browserRender(id, X, this.config)
      }
    }

    _props = _props || {}
    return <X {..._props}/>
  }
}
