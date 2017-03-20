import React from 'react'
import ReactDom from 'react-dom'

import directx from '../build'

class Abc extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      show: false
    }
  }
  render(){
    const bbb = <div>456</div>
    return (
      <div className="myContainer">
        { this.state.show ? bbb : 'ni mei a' }
      </div>
    )
  }
}

const Yyy = directx(Abc, {
  will: function(){
    return { show: true }
  },
  hide: function(){
    return {show: false}
  }
})


ReactDom.render(<Yyy.element />, document.querySelector('#test'))

setTimeout(function(){
  Yyy.dispatch('will')
}, 2000)