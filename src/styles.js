import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('screen');
const tabIndicatorTopPosition = height / 15;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
  },
  indicator: {
    height: 14,
    width: 14,
    borderWidth: 1,
    borderRadius: 7,
    marginHorizontal: 2,
  },
  activeIndicator: {
    borderColor: 'white',
    backgroundColor: 'white',
  },
  inactiveIndicator: {
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: tabIndicatorTopPosition,
    width: '100%',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  }
});

export default styles;
