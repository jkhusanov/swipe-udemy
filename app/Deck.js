import React from 'react';
import {
  View,
  Animated,
  PanResponder
} from 'react-native';

export default class Deck extends React.Component {
  constructor(props) {
    super(props)

    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true, //called anytime user taps the screen
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      }, //called anytime user starts to move fingers on the screen 
      onPanResponderRelease: () => { } //called when user removes finger from the screen
    });
    this._panResponder = { panResponder, position }
  }

  getCardStyle() {
    return {
      ...this._panResponder.position.getLayout(),
      transform: [{ rotate: '45deg'}]
    }
    
  }

  renderCards() {
    return this.props.data.map((item, index) => {
      if (index === 0) {
        return (
          <Animated.View
            key={item.id}
            style={this.getCardStyle()}
            {...this._panResponder.panResponder.panHandlers}
          >
            {this.props.renderCard(item)}
          </Animated.View>
        );
      }
      return this.props.renderCard(item);
    });
  }
  render() {
    return (
      <View
      >
        {this.renderCards()}
      </View>
    )
  }
}