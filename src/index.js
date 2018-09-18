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
  inputRange: [0, 1],
  outputRange: [height / 2, 5],
};

const fadeInInterpolation = {
  inputRange: [0, 1],
  outputRange: [0.0, 1],
};

const fadeOutInterpolation = {
  inputRange: [0, 1],
  outputRange: [1.0, 0.0],
};

const viewScaleInterpolation = {
  inputRange: [0, 1],
  outputRange: [0, (height * 2) / 5],
};

const viewScaleInterpolationR = {
  inputRange: [0, 1],
  outputRange: [(height * 2) / 5, 0],
};

const tabpanelInterpolation = {
  inputRange: [0, 1],
  outputRange: [0, -12],
};

const tabpanelInterpolationR = {
  inputRange: [0, 1],
  outputRange: [0, 12],
};

class PaperOnboardingContainer extends Component {
  static propTypes = {
    screens: PropTypes.array,
  }

  constructor(props) {
    super(props);
    const routes = this.props.screens.map(item => React.createElement(item));
    this.nextBackground = 0;
    this.state = {
      routes,
      direction: true,
      currentScreen: 0,
      animationFinish: true,
      nextPoint: { x: 0, y: 0 },
      rootBackground: this.props.screens[0].backgroundColor,
      backgroundAnimation: new Animated.Value(0),
      panResponder: PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetResponderCapture: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderRelease: (e, gestureState) => {
          const { x0, y0, dx, dy } = gestureState; // eslint-disable-line object-curly-newline

          const nextPoint = {
            x: x0 + dx,
            y: y0 + dy,
          };

          if (Math.abs(dx) >= RESPOND_THRESHHOLD) {
            if (dx > 0) {
              this.onSwipe('right', nextPoint);
            } else {
              this.onSwipe('left', nextPoint);
            }
          }
          return true;
        },
      }),
    };
  }

  onSwipe(direction, nextPoint) {
    const { currentScreen } = this.state;
    const nextIndex = this.getNextScreenIndex(direction);

    const boolDir = direction === 'left';

    this.nextBackground = boolDir
      ? this.props.screens[nextIndex].backgroundColor
      : this.props.screens[currentScreen].backgroundColor;

    this.startBackgroundAnimation(
      currentScreen,
      nextIndex,
      nextPoint,
      boolDir,
    );
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

  startBackgroundAnimation(currentScreen, nextIndex, nextPoint, direction) {
    const { backgroundAnimation } = this.state;
    this.setState(
      {
        nextIndex,
        nextPoint,
        direction,
        animationFinish: false,
        rootBackground: direction
          ? this.props.screens[currentScreen].backgroundColor
          : this.props.screens[nextIndex].backgroundColor,
      },
      () => Animated.timing(
        backgroundAnimation,
        { toValue: 1, duration: 900 },
      ).start(() => {
        backgroundAnimation.setValue(0);
        this.nextBackground = this.props.screens[currentScreen].backgroundColor;

        this.setState({
          nextIndex: null,
          animationFinish: true,
          currentScreen: nextIndex,
          rootBackground: this.props.screens[nextIndex].backgroundColor,
          nextPoint: { x: 0, y: 0 },
        });
      }),
    );
  }

  renderRippleBackground(screen, backgroundColor, direction = true) {
    const { backgroundAnimation, nextPoint, animationFinish } = this.state;
    const radius = direction ? viewRadiusInterpolationR : viewRadiusInterpolation;
    const scale = direction ? viewScaleInterpolation : viewScaleInterpolationR;
    if (!animationFinish) {
      return (
        <Animated.View
          style={[
            styles.rippleView,
            {
              top: nextPoint.y,
              left: nextPoint.x,
              backgroundColor,
              borderRadius: backgroundAnimation.interpolate(radius),
              transform: [{ scale: backgroundAnimation.interpolate(scale) }],
            },
          ]}
        />
      );
    }
    return null;
  }

  fadeInStyle = () => {
    const { backgroundAnimation } = this.state;
    return {
      opacity: backgroundAnimation.interpolate(fadeInInterpolation),
    };
  }

  fadeOutStyle = () => {
    const { backgroundAnimation } = this.state;
    return {
      opacity: backgroundAnimation.interpolate(fadeOutInterpolation),
    };
  }

  renderTabIndicators(direction) {
    const { screens } = this.props;
    const { currentScreen, backgroundAnimation } = this.state;
    const translate = direction ? tabpanelInterpolation : tabpanelInterpolationR;
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

    return (
      <Animated.View
        style={[
          styles.tabnabIndicatorContainer,
          { transform: [{ translateX: backgroundAnimation.interpolate(translate) }] },
        ]}
      >
        <View style={styles.tabIndicatorRight}>
          {rightSide}
        </View>
        <View style={styles.tabActiveContainer}>
          <View
            key={'active_tab'}
            style={[
              styles.indicator,
              styles.activeIndicator,
            ]}
          />
        </View>
        <View style={styles.tabIndicatorLeft}>
          {leftSide}
        </View>
      </Animated.View>
    );
  }

  render() {
    const {
      routes,
      nextIndex,
      direction,
      currentScreen,
      rootBackground,
    } = this.state;
    const screensArray = [
      <Animated.View
        key={'current_screen_container'}
        style={[styles.screenAnimatedContainer, this.fadeOutStyle()]}
      >
        {routes[currentScreen]}
      </Animated.View>,
      nextIndex !== undefined
        ? (
          <Animated.View
            key={'next_screen_container'}
            style={[styles.nextScreenContainer, this.fadeInStyle()]}
          >
            {routes[nextIndex]}
          </Animated.View>
        )
        : null,
    ];

    return (
      <View
        style={[
          styles.container,
          { backgroundColor: rootBackground },
        ]}
        {...this.state.panResponder.panHandlers}
      >
        {this.renderRippleBackground(routes[currentScreen], this.nextBackground, direction)}
        {direction ? screensArray : screensArray.reverse()}
        <View style={styles.indicatorContainer}>
          {this.renderTabIndicators(direction)}
        </View>
      </View>
    );
  }
}

export default PaperOnboardingContainer;
