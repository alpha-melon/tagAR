import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ViroARSceneNavigator } from 'react-viro';

const InitialARScene = require('./PointOfInterest');
export default class AR extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Attractions: true,
      Restaurants: false,
      Bars: false
    };
  }
  render() {
    return (
      <View style={styles.outer}>
        <ViroARSceneNavigator
          apiKey="C63BC372-68BB-4F10-B21A-7EC8E1ABFFC0"
          worldAlignment="GravityAndHeading"
          initialScene={{ scene: InitialARScene }}
        />
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 1,
            alignItems: 'center',
            flexDirection: 'row-reverse'
          }}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.props.goToLogin();
            }}
          >
            <Image
              source={require('../res/times-circle.png')}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.props.goToLogin();
            }}
          >
            <Image
              style={styles.image}
              source={require('../res/icons/restaurant.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.props.goToLogin();
            }}
          >
            <Image
              style={styles.image}
              source={require('../res/icons/champagne-glass.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.props.goToLogin();
            }}
          >
            <Image
              style={styles.image}
              source={require('../res/icons/statue-of-liberty.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  outer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black'
  },
  inner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black'
  },
  titleText: {
    paddingTop: 30,
    paddingBottom: 20,
    color: '#fff',
    textAlign: 'center',
    fontSize: 25
  },
  exitButton: {
    alignItems: 'center',
    padding: 10
  },
  exitButtonText: {
    color: '#ffffff'
  },
  button: {
    alignItems: 'center',
    padding: 20,
    marginEnd: 10,
    justifyContent: 'space-between'
  },
  image: {
    width: 30,
    height: 30,
    tintColor: 'white'
  }
});
