import React from 'react';
import {
  View,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';


const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

export default class Deck extends React.Component {
  // default props when reusable components are used, so we don't have to check each time
  static defaultProps = {
    onSwipeRight: () => {},
    onSwipeLeft: () => {},
  }
  constructor(props) {
    super(props)

    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true, //called anytime user taps the screen
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      }, //called anytime user starts to move fingers on the screen 
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          this.forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this.forceSwipe('left');
        } else {
          this.resetPosition();
        }
      } //called when user removes finger from the screen
    });
    this._panResponder = { panResponder, position }
    this.state = { index: 0 }
  }



  forceSwipe(direction) {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(this._panResponder.position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION
    }).start(() => this.onSwipeComplete(direction));
  }

  onSwipeComplete(direction) {
    const { onSwipeLeft, onSwipeRight, data } = this.props;
    const item = data[this.state.index]

    direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
    this._panResponder.position.setValue({ x: 0, y: 0 });
    this.setState({ index: this.state.index + 1});

  }

  resetPosition() {
    Animated.spring(this._panResponder.position, {
      toValue: { x: 0, y: 0 }
    }).start()
  }

  getCardStyle() {
    const { position } = this._panResponder
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-120deg', '0deg', '120deg']
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }]
    }

  }

  renderCards() {
    return this.props.data.map((item, i) => {
      if (i < this.state.index) { return null; }

      if (i === this.state.index) {
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