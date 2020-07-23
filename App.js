import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class App extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      input = '',
      searchStatus = 0,
      info = '',
      item = {}
    }
  }
  
}

render () {
  return (
    <View><Text>Hello!</Text></View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
