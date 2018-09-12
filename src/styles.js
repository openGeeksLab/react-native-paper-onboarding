import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('screen');
const tabIndicatorTopPosition = 30;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
  },
  indicator: {
    height: 8,
    width: 8,
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  activeIndicator: {
    borderColor: 'white',
    backgroundColor: 'white',
    borderRadius: 6,
    height: 11,
    width: 11,
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
