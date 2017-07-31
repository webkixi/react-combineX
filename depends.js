function getDepends(){
  return require('react-native')
}

module.exports = function(isReactNative){
  return isReactNative ? getDepends() : ''
}