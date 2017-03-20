/**
 * itemHlc  [react的高阶组件，给子组件绑定itemMethod方法，componentDidMount后]
 * ComposedComponent  {React-Element}   [被包围的子组件]
 */

import SAX from 'fkp-sax'
import React from 'react';
import { findDOMNode } from 'react-dom';
import uniqueId from 'lodash.uniqueid'
import merge from 'lodash.merge'

const globalName = uniqueId('ReQuery_')
const queryer = SAX(globalName)

function _store(sax){
  try {
    if (!sax) throw 'storehlc depend on SAX, SAX is fkp-sax, is a Global fun'
    return (id, ComposedComponent) => {
      if (!id) throw 'storehlc id must be set'
      return class extends ComposedComponent {
        constructor(props) {
          super(props)
          this.state.globalName = id
        }
        componentWillMount() {
          sax.bind(id, this)
          if (super.componentWillMount) super.componentWillMount()
        }
      }
    }   
  } 
  catch (e) {
    return ComposedComponent
  }
}
const store = _store(SAX)

export default (ComposedComponent, opts, cb) => {
  if (typeof opts == 'function') {
    cb = opts
    opts = undefined
  }
  if (!ComposedComponent) {
    console.log('请指定ComposedComponent');
    return
  }
  if ( typeof ComposedComponent == 'string' ||
    Array.isArray(ComposedComponent)
  ) { return }

  if (React.isValidElement(ComposedComponent)) {
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
      componentDidMount() {
        let self = this
  			let that = findDOMNode(this);
        const ctx = {
          show: this.show,
          hide: this.hide
        }

  			if( this.props.itemDefaultMethod ){
  				if (this.props.itemMethod) this.props.itemMethod.call(ctx, that, self.intent)
  				setTimeout(function(){
  					if( typeof self.props.itemDefaultMethod === 'function' ) self.props.itemDefaultMethod.call(ctx, that, self.intent)
  				}, 17)
  			} else if (typeof cb == 'function' || this.props.itemMethod){
          const imd = cb ||this.props.itemMethod
  				imd.call(ctx, that, self.intent)
  			}
        super.componentDidMount ? super.componentDidMount() : ''
      }
      render(){
        return this.state.show ? ComposedComponent : <var/>
      }
    }
  }

  const CC = store(globalName, ComposedComponent)
  queryer.append(opts||{})
  function dispatch(key){
    const ctx = queryer.store.ctx[globalName]
    const stateAsset = ctx.state
    const queryData = queryer.data
    if (queryData[key]) {
      const target = merge({}, stateAsset, queryData[key]())
      ctx.setState(target)
    }
  }

  let ReactComponentMonuted = false
  class Temp extends CC {
    constructor(props) {
      super(props);
			this.intent = this.props.intent || [];
    }

    componentDidMount(){
			let self = this
			let that = findDOMNode(this);

      const _ctx = {
        dispatch: dispatch,
        refs: this.refs
      }

			if( this.props.itemDefaultMethod ){
				if (this.props.itemMethod) this.props.itemMethod.call(that, _ctx, self.intent)
				setTimeout(function(){
					if( typeof self.props.itemDefaultMethod === 'function' ) self.props.itemDefaultMethod.call(that, _ctx, self.intent)
				}, 17)
			}
      else if (typeof cb == 'function' || this.props.itemMethod){
        const imd = cb ||this.props.itemMethod
        imd.call(that, _ctx, self.intent)
			}
      super.componentDidMount ? super.componentDidMount() : ''
      ReactComponentMonuted = true
		}
  }

  let timer;
  class Query {
    constructor(config){
      this.element = Temp
      this.setActions = queryer.setActions
      this.roll = queryer.roll
    }

    dispatch(key){
      clearTimeout(timer)
      timer = setTimeout(function() {
        if (ReactComponentMonuted) dispatch(key)
      }, 100);
    }
  }

  return new Query()
}
