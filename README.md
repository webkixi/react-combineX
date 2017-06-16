# react-combinex
a lite lib for react jsx and react class

### aotoo.CombineClass

```
class Test extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      test: '1234',
      stack: []
    }
  }
  render(){
    return (
      <div className='container'>
        {this.state.test}
        <div>
          {this.state.stack}
        </div>
        <button className="btn">试试看</button>
      </div>
    )
  }
}

const Actions = {
  CONTENT: function(ostate, props){
    ostate.test = props.content
    ostate.stack.push('www.agzgz.com')    // Test.state.stack that its length is always 1
    return ostate
  },

  STACKS: function(ostate, props){
    let curState = this.curState
    curState.test = props.content
    curState.stack.push('www.agzgz.com')    // Test.state.stack that its length is incremental
    return curState
  }
}

// make a class
class abc extends Aotoo.CombineClass {
  constructor(config){
    super(config)
    this.combinex(Test, Actions)
  }

  content(message){
    this.dispatch('CONTENT', {content: message})
  }
}

const Abc = new abc({
  props: {}
})

Abc.rendered = function(dom){
  $(dom).find('button').click( e=>{
    Abc.content('你好呀，世界')
  })
}

Abc.render('test')
```
