import * as React from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableHighlight,
  FlatList,
  Button,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';



export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      warning: '',
      cityList: [
        'Miami',
        'San Francisco',
        'Phoenix',
        'Houston',
        'Philadelphia',
        'Chicago',
        'Dallas',
        'Los Angeles',
        'New York',
      ],
      list: [],
      item: {},
      alertStatus: 0,
      alertMessageName: '',
      alertMessage: ''
    };
  }

  componentDidMount () {
    this.fetchList()
  }

  fetchList = () => {
    var newList = [];
    this.setState({
      list: [],
    });
    var items = this.state.cityList;
    for (c of items) {
      this.fetchCity(c, newList);
    }
  };

  fetchCity = (city, newList) => {
    fetch(
      'http://api.openweathermap.org/data/2.5/weather?q=' +
        city +
        '&appid=7e77501a7329190a8bff9b99676349b1&units=imperial'
    )
      .then((response) => response.json())
      .then((responseJson) => {
        var main = responseJson.main;
        var wind = responseJson.wind;
        var direction = this.getWindDirection(parseInt(wind.deg));
        var obj = responseJson;
        if (obj.cod !== 200) {
          this.setState({
            searchStatus: 0,
            warning: 'City not found',
          });
        } else {
          var city = {
            name: obj.name,
            temp: Math.ceil(main.temp),
            type: obj.weather[0].main,
            desc1: obj.weather[0].main + ':' + Math.ceil(main.temp) + '°F',
            desc2: 'Feels Like: ' + Math.ceil(main.feels_like) + '°F',
            desc3: 'Wind: ' + direction + '; Speed: ' + wind.speed,
            desc4: 'Humidity: ' + main.humidity + '% ',
          };
          newList.unshift(city);
          this.setState({
            list: newList,
          });
        }
      });
  };

  deleteCity = (index) => {
    var newList = this.state.list;
    newList.splice(index, 1);
    this.setState({
      list: newList,
    });
  }

  addCity = () => {
    var newlist = this.state.list;
    Keyboard.dismiss();
    this.fetchCity(this.state.input, newlist);
    this.setState({
      input: '',
      warning: ''
    });
  }

    getIcon = (type) => {

    if( type == 'Clouds'){
      return '☁️';
    }
    if(type == 'Clear'){
      return '☀️';
    }
    if(type == 'Haze'){
      return '⛅️';
    }
    if(type == 'Thunderstorm'){
      return '⛈';
    }
    if(type == 'Rain'){
      return '🌧';
    }
    if(type == 'Snow'){
      return '❄️';
    }
    if(type == 'Mist'){
      return '☁️';
    }

  }

  getWindDirection = (value) => {
    if(value <= 23 || value > 338){
      return 'N';
    }
    if(value > 23 && value <= 68){
      return 'NE';
    }
    if(value > 68 && value <= 113){
      return 'E';
    }
    if(value > 113 && value <= 158){
      return 'SE';
    }
    if(value > 158 && value <= 203){
      return 'S';
    }
    if(value > 203 && value <= 248){
      return 'SW';
    }
    if(value > 248 && value <= 293){
      return 'W';
    }
    if(value > 293 && value <= 338){
      return 'NW';
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text
          style={{
            width: '100%',
            paddingTop: 50,
            backgroundColor: '#a6dcef',
            color: 'red',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 25,
          }}>
          Weather by City
        </Text>
        <View style={styles.searchbox}>
          <TextInput
            onChangeText={(text) => this.setState({ input: text })}
            value={this.state.input}
            style={{
              width: '80%',
              padding: 15,
              margin: 5,
              backgroundColor: '#bbe1fa',
              color: 'black',
            }}
          />
          <TouchableHighlight
            style={{
              backgroundColor: '#32b2b8',
              padding: 10,
              marginTop: 5,
              borderRadius: 8,
            }}
            onPress={() => this.addCity()}>
            <Text style={{ fontSize: 14, color: 'white', lineHeight: 15 }}>
              Add a City
            </Text>
          </TouchableHighlight>
        </View>
        <View style={{alignItems: 'center'}}>
        <Text style={{ color:'red', fontWeight: 'bold'}}>{this.state.warning}</Text>
        </View>
        <View>
          <FlatList
            data={this.state.list}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableHighlight
              underlayColor="white"
              onPress={ () => this.setState({alertStatus: 1, alertMessage: item.desc1 + '\n' + item.desc2 + '\n' + item.desc3 + '\n' + item.desc4, alertMessageName: item.name})}>
                <View style={index % 2 === 0 ? styles.rowodd : styles.roweven}>
                  <Text style={{fontSize: 25}}>{this.getIcon(item.type)}{item.temp}°F</Text>
                  <Text style={{fontSize: 25}}>{item.name}</Text>
                  <Button
                    style={{backgroundColor:'white', color: 'black', padding: 15}}
                    onPress={() => this.deleteCity(index)}
                    title="X"></Button>
                </View>
              </TouchableHighlight>
            )}
          />
        </View>
        {this.state.alertStatus == 1 ? (
            <View style={{flex:1, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 50, left: 0, height: '100%', width: '100%', backgroundColor: 'rgba(0,0,0,0.5)'}}>
              <View style={{width:'75%', height: 200}}>
                <LinearGradient style={{
                    padding:5,
                    shadowColor: 'black', shadowOffset: { width:0, height: 2}, shadowOpacity: 0.3, shadowRadius: 2,
                    justifyContent: 'space-between', flex: 1, borderRadius: 20}}
                    colors={['#136a8a', '#267871']}
                    start={[0, 0.65]}>
                  <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white', padding: 10, textAlign: 'center'}}>{this.state.alertMessageName}</Text>
                  <Text style={{fontSize: 16, color: 'white', padding: 10, textAlign: 'center'}}>{this.state.alertMessage}
                  </Text>
                   <TouchableHighlight underlayColor="white" onPress={ () => this.setState({alertMessage: '', alertStatus: 0, alertMessageName: ''})}>
                    <Text style={{fontWeight: 'bold', color: 'white', padding: 10, textAlign: 'center'}}>Close</Text>
                  </TouchableHighlight>
                </LinearGradient>  
              </View>
            </View>
                ) : <Text></Text>
              }
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  searchbox: {
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#a6dcef',
    padding: 5,
  },
  rowodd: {
    paddingVertical: 25,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    backgroundColor: '#BBE1FA',
  },
  roweven: {
    paddingVertical: 25,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    backgroundColor: '#DDF3F5',
  },
});
