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


const viewRadiusInterpolation = {
  inputRange: [0, 1],
  outputRange: [5, height / 2],
};

const viewRadiusInterpolationR = {
  inputRange: [0, 0.01, 1],
  outputRange: [0, height / 2, 1],
};

const viewScaleInterpolation = {
  inputRange: [0, 1],
  outputRange: [0, (height * 2) / 5],
};

const viewScaleInterpolationR = {
  inputRange: [0, 0.01, 1],
  outputRange: [0, (height * 2) / 5, 0],
};

class PaperOnboardingContainer extends Component {
  static propTypes = {
    screens: PropTypes.array,
  }

  constructor(props) {
    super(props);
    const routes = this.props.screens.map(item => React.createElement(item));
    this.nextBackground = 0;
    this.direction = true;
    this.state = {
      routes,
      currentScreen: 0,
      backgroundAnimation: new Animated.Value(0),
      panResponder: PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetResponderCapture: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderRelease: (e, gestureState) => {
          const { moveX, x0 } = gestureState;
          console.log(moveX, x0);

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
    this.nextBackground = this.props.screens[this.getNextScreenIndex(direction)].backgroundColor;
    if (direction === 'left') {
      this.direction = true;
    } else {
      this.direction = false;
    }

    this.startBackgroundAnimation(() => this.navigate(direction));
  }

  getNextScreenIndex(direction) {
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
    return nextIndex;
  }

  navigate(direction) {
    this.setState({ currentScreen: this.getNextScreenIndex(direction) });
  }

  startBackgroundAnimation(callback) {
    const { backgroundAnimation } = this.state;
    Animated.timing(
      backgroundAnimation,
      {
        toValue: 1,
        duration: 800,
      },
    ).start(() => {
      backgroundAnimation.setValue(0);
      if (callback) callback();
    });
  }

  renderRippleBackground(screen, backgroundColor, direction = true) {
    const { backgroundAnimation } = this.state;
    const radius = direction ? viewRadiusInterpolation : viewRadiusInterpolationR;
    const scale = direction ? viewScaleInterpolation : viewScaleInterpolationR;
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
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          borderRadius: backgroundAnimation.interpolate(radius),
          transform: [{ scale: backgroundAnimation.interpolate(scale) }],
        }}
      />
      // >
      //   {screen}
      // </Animated.View>
    );
  }

  renderTabIndicators() {
    const { screens } = this.props;
    const { routes, currentScreen } = this.state;
    const leftSide = [];
    const rightSide = [];
    let passActiveScreenFlag = false;
    screens.forEach((item, index) => {
      if (currentScreen === index) {
        passActiveScreenFlag = true;
      }
      if (passActiveScreenFlag && index !== currentScreen) {
        leftSide.push(
          <View
            key={index}
            style={[
              styles.indicator,
              styles.inactiveIndicator,
            ]}
          />,
        );
      } else if (index !== currentScreen) {
        rightSide.push(
          <View
            key={index}
            style={[
              styles.indicator,
              styles.inactiveIndicator,
            ]}
          />,
        );
      }
    });

    const ret = (
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
          {rightSide}
        </View>
        <View>
          <View
            key={'active_tab'}
            style={[
              styles.indicator,
              styles.activeIndicator,
            ]}
          />
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {leftSide}
        </View>
      </View>
    );

    return ret;
  }

  render() {
    const { screens } = this.props;
    const { currentScreen, routes } = this.state;
    return (
      <View
        style={styles.container}
        {...this.state.panResponder.panHandlers}
      >
        <Animated.View style={{ flex: 1 }}>
          {routes[currentScreen]}
        </Animated.View>
        {this.renderRippleBackground(routes[currentScreen], this.nextBackground, this.direction)}
        <View style={styles.indicatorContainer}>
          {this.renderTabIndicators()}
        </View>
      </View>
    );
  }
}

export default PaperOnboardingContainer;
