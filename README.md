<p align="left">
  <a href="https://www.opengeekslab.com" target="_blank">
  <img src="https://raw.githubusercontent.com/openGeeksLab/react-native-tab-navigator/develop/header_github-open.png" width="100%" title="openGeeksLab"/>
    </a>
 </p>

<a href="http://developer.apple.com" rel="nofollow"><img  alt="iOS" src="https://img.shields.io/badge/platform-iOS-brightgreen.svg" style="max-width:100%;"></a> <a href="https://www.android.com" rel="nofollow"><img src="https://img.shields.io/badge/platform-Android-brightgreen.svg" alt="iOS" data-canonical-src=" https://img.shields.io/badge/platform-Android-brightgreen.svg" style="max-width:100%;"></a>
<a href="https://github.com/openGeeksLab/react-native-tab-navigator">
  <img src="https://img.shields.io/badge/npm-compatible-green.svg" alt="npm compatible" data-canonical-src="https://img.shields.io/badge/npm-compatible-green.svg" style="max-width:100%;"></a>
<a href="http://twitter.com/openGeeksLab" rel="nofollow"><img src="https://img.shields.io/badge/Twitter-@openGeeksLab-blue.svg" alt="Twitter" data-canonical-src="https://img.shields.io/badge/Twitter-@openGeeksLab-blue.svg?style=flat" style="max-width:100%;"></a>
  <a href="http://facebook.com/openGeeksLab/"><img src="https://img.shields.io/badge/facebook-us-blue.svg" alt="Facebook" data-canonical-src="https://img.shields.io/badge/facebook-us-blue.svg" style="max-width:100%;"></a>
  <a href="https://medium.com/@openGeeksLab"><img src="https://img.shields.io/badge/Medium-story-brightgreen.svg" alt="Medium" data-canonical-src="https://img.shields.io/badge/Medium-story-brightgreen.svg" style="max-width:100%;"></a>

  </p>
  <img src="https://raw.githubusercontent.com/openGeeksLab/docs/master/animated_Slider_Onboarding_1.gif" alt="Medium" data-canonical-src="https://raw.githubusercontent.com/openGeeksLab/docs/master/animated_Slider_Onboarding_1.gif" width="70%" height="70%"style="max-width:100%;">

# About
Our company provides custom UI design and development solutions for mobile applications and websites.

Need a team to create a project?

This project is developed and maintained by <a href="https://www.openGeeksLab.com">openGeeksLab LLC.</a>

<a href="mailto:info@opengeekslab.com?subject=Project%20inquiry%20from%20Github">
<img src="https://raw.githubusercontent.com/openGeeksLab/docs/master/contact_our_team.png" width="25%" height="25%" style="max-width:100%;"></a>

# react-native-paper-onboarding

## Requirements
- React Native 0.50+
- iOS 9.0+
- Android 4.2+

## Installation
Just run:
- npm i @opengeekslab/react-native-paper-onboarding

## Basic usage
The library depends on that each screen should contain a static backgroundColor field which contains the desired background color for this screen. The screen itself should have a transparent background
```javascript
import React, { Component } from 'react';

import PaperOnboarding from 'react-native-paper-onboarding';

import Screen1 from './screens/screen1';
import Screen2 from './screens/screen2';
import Screen3 from './screens/screen3';

const screens = [Screen1, Screen2, Screen3];

export default class App extends Component {
  render() {
    return (
      <PaperOnboarding
        screens={screens}
      />
    );
  }
}
```
## Screen example
```javascript
import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
  Text,
} from 'react-native';

import bgImage from './img.png';

export default class Screen1 extends Component {
  static backgroundColor = '#ff3631';

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            blurRadius={0}
            source={bgImage}
            style={styles.image}
            resizeMode={'contain'}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textTitle}>
            INVITE FRIENDS
          </Text>
          <Text style={styles.lilText}>
            Listen Your Favorite Music Together
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  imageContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    height: '27%',
    paddingLeft: 25,
    backgroundColor: 'transparent',
  },
  textTitle: {
    fontSize: 56,
    fontFamily: 'Bebas Neue',
    color: 'rgb(255, 255, 255)',
    backgroundColor: 'transparent',
  },
  lilText: {
    fontSize: 13,
    fontFamily: 'Montserrat',
    color: 'rgb(255, 255, 255)',
    backgroundColor: 'transparent',
  },
});
```

# Contact us if interested.
<a href="https://opengeekslab.com/contact-us/">
<img src="https://raw.githubusercontent.com/openGeeksLab/docs/master/contact_our_team.png" width="25%" height="25%" style="max-width:100%;"></a>

# Licence
Expanding is released under the MIT license.
