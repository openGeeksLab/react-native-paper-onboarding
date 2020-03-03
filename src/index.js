import React, { Component } from "react";
import PropTypes from "prop-types";
import { PanResponder, Dimensions, Animated, View } from "react-native";

import styles from "./styles";

const { width, height } = Dimensions.get("screen");
const RESPOND_THRESHHOLD = width / 3;

const viewRadiusInterpolation = {
  inputRange: [0, 1],
  outputRange: [5, height / 2]
};

const viewRadiusInterpolationR = {
  inputRange: [0, 1],
  outputRange: [height / 2, 5]
};

const fadeInInterpolation = {
  inputRange: [0, 1],
  outputRange: [0.0, 1]
};

const fadeOutInterpolation = {
  inputRange: [0, 1],
  outputRange: [1.0, 0.0]
};

const viewScaleInterpolation = {
  inputRange: [0, 1],
  outputRange: [0, (height * 2) / 5]
};

const viewScaleInterpolationR = {
  inputRange: [0, 1],
  outputRange: [(height * 2) / 5, 0]
};

const tabpanelInterpolation = {
  inputRange: [0, 1],
  outputRange: [0, -12]
};

const tabpanelInterpolationR = {
  inputRange: [0, 1],
  outputRange: [0, 12]
};

class PaperOnboardingContainer extends Component {
  static propTypes = {
    screens: PropTypes.array,
    disableGestures: PropTypes.bool,
    disableDots: PropTypes.bool
  };

  constructor(props) {
    super(props);
    const routes = this.props.screens.map(item =>
      React.createElement(item, { onboarding: this })
    );
    this.nextBackground = 0;
    this.state = {
      routes,
      currentScreen: 0,
      animationFinish: true,
      nextPoint: { x: 0, y: 0 },
      isSwipeDirectionLeft: true,
      rootBackground: this.props.screens[0].backgroundColor,
      backgroundAnimation: new Animated.Value(0),
      panResponder: !props.disableGestures
        ? PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onStartShouldSetPanResponderCapture: () => false,
            onMoveShouldSetPanResponder: (_, gestureState) => {
              const { dx, dy } = gestureState;
              return dx > 2 || dx < -2 || dy > 2 || dy < -2;
            },
            onMoveShouldSetPanResponderCapture: (_, gestureState) => {
              const { dx, dy } = gestureState;
              return dx > 2 || dx < -2 || dy > 2 || dy < -2;
            },
            onPanResponderRelease: (e, gestureState) => {
              const { x0, y0, dx, dy } = gestureState; // eslint-disable-line object-curly-newline

              const nextPoint = {
                x: x0 + dx,
                y: y0 + dy
              };

              if (Math.abs(dx) >= RESPOND_THRESHHOLD) {
                if (dx > 0) {
                  this.onSwipe("right", nextPoint);
                } else {
                  this.onSwipe("left", nextPoint);
                }
              }
              return true;
            }
          })
        : null
    };
  }

  onSwipe(swipeDirection, nextPoint) {
    const { currentScreen } = this.state;
    const nextIndex = this.getNextScreenIndex(swipeDirection);

    const isSwipeDirectionLeft = swipeDirection === "left";

    this.nextBackground = isSwipeDirectionLeft
      ? this.props.screens[nextIndex].backgroundColor
      : this.props.screens[currentScreen].backgroundColor;

    this.startBackgroundAnimation(
      currentScreen,
      nextIndex,
      nextPoint,
      isSwipeDirectionLeft
    );
  }

  next() {
    this.onSwipe("left", { x: 0, y: 0 });
  }

  previous() {
    this.onSwipe("right", { x: 0, y: 0 });
  }

  getNextScreenIndex(direction) {
    const { currentScreen, routes } = this.state;
    let directionModifier = 0;
    if (direction === "left") {
      directionModifier = 1;
    } else if (direction === "right") {
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

  callAnimations = (currentScreen, nextIndex) => {
    const { backgroundAnimation } = this.state;
    const { screens } = this.props;
    Animated.timing(backgroundAnimation, { toValue: 1, duration: 900 }).start(
      () => {
        backgroundAnimation.setValue(0);
        this.nextBackground = screens[currentScreen].backgroundColor;

        this.setState({
          nextIndex: null,
          animationFinish: true,
          currentScreen: nextIndex,
          rootBackground: screens[nextIndex].backgroundColor,
          nextPoint: { x: 0, y: 0 }
        });
      }
    );
  };

  startBackgroundAnimation = (
    currentScreen,
    nextIndex,
    nextPoint,
    isSwipeDirectionLeft
  ) => {
    this.setState(
      {
        nextIndex,
        nextPoint,
        isSwipeDirectionLeft,
        animationFinish: false,
        rootBackground: isSwipeDirectionLeft
          ? this.props.screens[currentScreen].backgroundColor
          : this.props.screens[nextIndex].backgroundColor
      },
      () => this.callAnimations(currentScreen, nextIndex)
    );
  };

  renderRippleBackground(screen, backgroundColor, isSwipeDirectionLeft = true) {
    const { backgroundAnimation, nextPoint, animationFinish } = this.state;
    const radius = isSwipeDirectionLeft
      ? viewRadiusInterpolationR
      : viewRadiusInterpolation;
    const scale = isSwipeDirectionLeft
      ? viewScaleInterpolation
      : viewScaleInterpolationR;
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
              transform: [{ scale: backgroundAnimation.interpolate(scale) }]
            }
          ]}
        />
      );
    }
    return null;
  }

  fadeInStyle = () => {
    const { backgroundAnimation } = this.state;
    return {
      opacity: backgroundAnimation.interpolate(fadeInInterpolation)
    };
  };

  fadeOutStyle = () => {
    const { backgroundAnimation } = this.state;
    return {
      opacity: backgroundAnimation.interpolate(fadeOutInterpolation)
    };
  };

  renderTabIndicators(isSwipeDirectionLeft) {
    if (this.props.disableDots) return null;
    const { screens } = this.props;
    const { currentScreen, backgroundAnimation } = this.state;
    const translate = isSwipeDirectionLeft
      ? tabpanelInterpolation
      : tabpanelInterpolationR;
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
            style={[styles.indicator, styles.inactiveIndicator]}
          />
        );
      } else if (index !== currentScreen) {
        rightSide.push(
          <View
            key={index}
            style={[styles.indicator, styles.inactiveIndicator]}
          />
        );
      }
    });

    return (
      <Animated.View
        style={[
          styles.tabnabIndicatorContainer,
          {
            transform: [
              { translateX: backgroundAnimation.interpolate(translate) }
            ]
          }
        ]}
      >
        <View style={styles.tabIndicatorRight}>{rightSide}</View>
        <View style={styles.tabActiveContainer}>
          <View
            key={"active_tab"}
            style={[styles.indicator, styles.activeIndicator]}
          />
        </View>
        <View style={styles.tabIndicatorLeft}>{leftSide}</View>
      </Animated.View>
    );
  }

  getScreensArray = () => {
    const { routes, nextIndex, currentScreen } = this.state;
    return [
      <Animated.View
        key={"current_screen_container"}
        style={[
          styles.screenAnimatedContainer,
          this.fadeOutStyle(),
          { zIndex: 5 }
        ]}
      >
        {routes[currentScreen]}
      </Animated.View>,
      nextIndex !== undefined ? (
        <Animated.View
          key={"next_screen_container"}
          style={[styles.nextScreenContainer, this.fadeInStyle()]}
        >
          {routes[nextIndex]}
        </Animated.View>
      ) : null
    ];
  };

  render() {
    const {
      routes,
      isSwipeDirectionLeft,
      currentScreen,
      rootBackground
    } = this.state;
    const screensArray = this.getScreensArray();

    return (
      <View
        style={[styles.container, { backgroundColor: rootBackground }]}
        {...this.state.panResponder.panHandlers}
      >
        {this.renderRippleBackground(
          routes[currentScreen],
          this.nextBackground,
          isSwipeDirectionLeft
        )}
        {isSwipeDirectionLeft ? screensArray : screensArray.reverse()}
        <View style={styles.indicatorContainer}>
          {this.renderTabIndicators(isSwipeDirectionLeft)}
        </View>
      </View>
    );
  }
}

export default PaperOnboardingContainer;
