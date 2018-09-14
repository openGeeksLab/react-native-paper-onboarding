import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  PanResponder,
  Dimensions,
  Animated,
  View,
} from 'react-native';

import styles from './styles';

const { width, height } = Dimensions.get('screen');
const RESPOND_THRESHHOLD = width / 3;
const viewSizeInterpolation = {
  inputRange: [0, 1],
  outputRange: [0, height * 2],
};
const viewPositionInterpolation = {
  inputRange: [0, 1],
  outputRange: [width / 2, 0],
};
const viewRadiusInterpolation = {
  inputRange: [0, 1],
  outputRange: [5, height / 2],
};
const viewScaleInterpolation = {
  inputRange: [0, 1],
  outputRange: [0, (height * 2) / 5],
};

class PaperOnboardingContainer extends Component {
  static propTypes = {
    screens: PropTypes.array,
  }

  constructor(props) {
    super(props);
    const routes = this.props.screens.map(item => React.createElement(item));

    this.state = {
      routes,
      currentScreen: 0,
      backgroundAnimation: new Animated.Value(0),
      panResponder: PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        onPanResponderMove: () => {

          return true;
        },
        onPanResponderRelease: (e, gestureState) => {
          const { moveX, x0 } = gestureState;
          const deltaDistance = moveX - x0;
          if (Math.abs(deltaDistance) >= RESPOND_THRESHHOLD) {
            if (deltaDistance > 0) {
              this.onSwipe('right');
            } else {
              this.onSwipe('left');
            }
          }
          return true;
        },
      }),
    };
  }

  onSwipe(direction) {
    if (direction === 'left') {

    } else if (direction === 'right') {

    }
    this.startBackgroundAnimation();
    this.navigate(direction);
  }

  navigate(direction) {
    const { currentScreen, routes } = this.state;
    let directionModifier = 0;
    if (direction === 'left') {
      directionModifier = 1;
    } else if (direction === 'right') {
      directionModifier = -1;
    }

    let nextIndex = currentScreen + directionModifier;
    if (nextIndex < 0) {
      nextIndex = routes.length - 1;
    } else if (nextIndex >= routes.length) {
      nextIndex = 0;
    }

    this.setState({ currentScreen: nextIndex });
  }

  startBackgroundAnimation() {
    const { backgroundAnimation } = this.state;
    Animated.timing(
      backgroundAnimation,
      {
        toValue: 1,
        duration: 1000,
      },
    ).start(() => backgroundAnimation.setValue(0));
  }

  renderRippleBackground(backgroundColor) {
    const { backgroundAnimation } = this.state;
    return (
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 20,
          right: width / 2,
          // right: backgroundAnimation.interpolate(viewPositionInterpolation),
          width: 10,
          height: 10,
          // width: backgroundAnimation.interpolate(viewSizeInterpolation),
          // height: backgroundAnimation.interpolate(viewSizeInterpolation),
          backgroundColor: 'black',
          borderRadius: backgroundAnimation.interpolate(viewRadiusInterpolation),
          transform: [{ scale: backgroundAnimation.interpolate(viewScaleInterpolation) }],
        }}
      />
    );
  }

  renderTabIndicators() {
    const { screens } = this.props;
    const { routes, currentScreen } = this.state;
    return screens.map((item, index) => {
      return (
        <View
          key={index}
          style={[
            styles.indicator,
            currentScreen === index
              ? styles.activeIndicator
              : styles.inactiveIndicator,
          ]}
        />
      );
    });
  }

  render() {
    const { screens } = this.props;
    const { currentScreen, routes } = this.state;

    return (
      <View
        style={styles.container}
        {...this.state.panResponder.panHandlers}
      >
        {routes[currentScreen]}
        {this.renderRippleBackground(screens[currentScreen].backgroundColor)}
        <View style={styles.indicatorContainer}>
          {this.renderTabIndicators()}
        </View>
      </View>
    );
  }
}

export default PaperOnboardingContainer;
