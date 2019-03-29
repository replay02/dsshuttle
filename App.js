import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import BigShuttleMapBase from './components/BigShuttleMapBase';

import ShuttleTab from './components/ShuttleTab';
import ShuttleMain from './components/ShuttleMain';
import BigShuttleMain from './components/BigShuttleMain';

// 셔틀 스택
const BigShuttleStack = createStackNavigator(
  {
    // BigShuttleMain: BigShuttleMain,

    BigShuttleMain : BigShuttleMain,
    BigShuttleMapBase: BigShuttleMapBase,
    // Map: MapScene,
    // Chart: WeatherChart,
  }, {
    initialRouteName: 'BigShuttleMain',

    /* 네비게이션 헤더 옵션 */
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#fff',
        // shadowColor: '#5bc4ff',
        shadowRadius: 0,
        shadowOpacity: 0,
        shadowOffset: {
          height: 0,
        },
        elevation: 0,  // for android
        borderBottomWidth: 0  // for ios
      },
      headerTintColor: '#000',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      // headerTransparent : true
    },
  });

// const TabStack = createStackNavigator(
//   {
//     ShuttleTab: ShuttleTab,
//   }, {
//     initialRouteName: 'ShuttleTab',

//     /* 네비게이션 헤더 옵션 */
//     defaultNavigationOptions: {
//       headerStyle: {
//         display: "none",
//         // backgroundColor: '#418cff',
//       },
//       // headerTintColor: '#fff',
//       // headerTitleStyle: {
//       //   fontWeight: 'bold',
//       // },
//     },
//   });

const mainStack = createStackNavigator(
  {
    Main :ShuttleMain,
    // TabStack: TabStack,
    // BigShuttleStack: BigShuttleStack,

    BigShuttleMain : BigShuttleMain,
    BigShuttleMapBase: BigShuttleMapBase,
  }, {
    initialRouteName: 'Main',

    /* 네비게이션 헤더 옵션 */
    defaultNavigationOptions: {
      headerStyle: {
        display: "none",
        backgroundColor: '#4baec5',
      },
      // headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        color:'#fff'
      },
    },
  });

// const store = createStore(reducers);


const AppContainer = createAppContainer(mainStack)

export default class App extends React.Component {
  render() {
    return (
      // <Provider store={store}>
        <AppContainer />
      // </Provider>
    );
  }
};
