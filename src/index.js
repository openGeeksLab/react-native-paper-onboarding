import React, { Component } from 'react';
import {
  TouchableOpacity,
  PanResponder,
  Dimensions,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';

const { width, height } = Dimensions.get('screen');
const RESPOND_THRESHHOLD = width / 3;

class PaperOnboardingContainer extends Component {
  static propTypes = {
    screens: PropTypes.array;
  }
  constructor(props) {
    super(props);
    const routes = this.props.screens.map(item => {
      return React.createElement(item);
    });

    this.state = {
      currentScreen: 0,
      routes,
      _panResponder: PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        onPanResponderMove: () => {

          return true;
        },
        onPanResponderRelease: (e, gestureState) => {
          const { moveX, x0 } = gestureState;
          deltaDistance = moveX - x0;
          if (Math.abs(deltaDistance) >= RESPOND_THRESHHOLD) {
            if (deltaDistance > 0) {
              this.onSwipe('right');
            } else {
              this.onSwipe('left');
            }
          }
          return true;
        }
      }),
    };

  }

  onSwipe(direction) {
    if (direction === 'left') {

    } else if (direction === 'right') {

    }
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

  renderTabIndicators() {
    const { routes, currentScreen } = this.state;
    return routes.map((item, index) => {
      return (
        <View
          style={[
            styles.indicator,
            currentScreen === index
              ? styles.activeIndicator
              : styles.inactiveIndicator
          ]}
        />
      );
    });
  }

  render() {
    const { currentScreen, routes } = this.state;

    return (
      <View
        style={styles.container}
        {...this.state._panResponder.panHandlers}
      >
        {routes[currentScreen]}
        <View style={styles.indicatorContainer}>
          {this.renderTabIndicators()}
        </View>
      </View>
    );
  }
}

export default PaperOnboardingContainer;
