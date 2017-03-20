//store
export default (SAX) => {
  try {
    if (!SAX) throw 'storehlc depend on SAX, SAX is fkp-sax, is a Global fun'
    return (id, ComposedComponent) => {
      if (!id) throw 'storehlc id must be set'
      return class extends ComposedComponent {
        constructor(props) {
          super(props)
          this.state.globalName = id
        }
        componentWillMount() {
          SAX.bind(id, this)
          if (super.componentWillMount) super.componentWillMount()
        }
      }
    }   
  } 
  catch (e) {
    return ComposedComponent
  }
}

