import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export default class Ball extends React.Component {
  componentWillMount() {
    this.position = new Animated.ValueXY(0, 0);
    Animated.spring(this.position, {
      toValue: { x: 200, y: 500 }
    }).start();

  }
  render() {
    return (
      <Animated.View style={this.position.getLayout()}>
        <View style={styles.ballStyle}>

        </View>
      </Animated.View>

    )
  }
}

const styles = StyleSheet.create({
  ballStyle: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 30,
    borderColor: 'black',
  }
})
