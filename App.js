import React, { Component } from 'react';
import { Easing, StyleSheet, Animated, View, Dimensions, Image } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import BigShuttleMapBase from './components/BigShuttleMapBase';

import ShuttleTab from './components/ShuttleTab';
import ShuttleMain from './components/ShuttleMain';
import BigShuttleMain from './components/BigShuttleMain';
import DriverInfo from './components/DriverInfo';//dy

import SmallShuttleMain from './components/SmallShuttleMain';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

// 셔틀 스택
const BigShuttleStack = createStackNavigator(
  {
    // BigShuttleMain: BigShuttleMain,

    BigShuttleMain: BigShuttleMain,
    BigShuttleMapBase: BigShuttleMapBase,
    DriverInfo: DriverInfo,//dy
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




// 셔틀 스택
// const BigShuttleStack = createStackNavigator(
//   {
//     // BigShuttleMain: BigShuttleMain,

//     BigShuttleMain : BigShuttleMain,
//     BigShuttleMapBase: BigShuttleMapBase,
//     // Map: MapScene,
//     // Chart: WeatherChart,
//   }, {
//     initialRouteName: 'BigShuttleMain',

//     /* 네비게이션 헤더 옵션 */
//     defaultNavigationOptions: {
//       headerStyle: {
//         backgroundColor: '#fff',
//         // shadowColor: '#5bc4ff',
//         shadowRadius: 0,
//         shadowOpacity: 0,
//         shadowOffset: {
//           height: 0,
//         },
//         elevation: 0,  // for android
//         borderBottomWidth: 0  // for ios
//       },
//       headerTintColor: '#000',
//       headerTitleStyle: {
//         fontWeight: 'bold',
//       },
//       // headerTransparent : true
//     },
//   });

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
    Main: ShuttleMain,
    // TabStack: TabStack,
    // BigShuttleStack: BigShuttleStack,

    BigShuttleMain: BigShuttleMain,
    BigShuttleMapBase: BigShuttleMapBase,
    DriverInfo: DriverInfo, //dy
    SmallShuttleMain: SmallShuttleMain,
    ShuttleTab: ShuttleTab
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
        color: '#fff'
      },
    },
  });

// const store = createStore(reducers);


const AppContainer = createAppContainer(mainStack)



const value = width - 50;
export default class App extends React.Component {



  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(100);
    this.animatedValue2 = new Animated.Value(0);

    this.translateX = this.animatedValue2.interpolate({
      inputRange: [0, 0.3, 0.9, 0.95, 1],
      outputRange: [value, 0, 0,-10, 0],

    });

    this.translateX2 = this.animatedValue2.interpolate({
      inputRange: [0, 0.3, 1],
      outputRange: [-value, 0, 0],
    });
  }

  state = {
    animating: false,
    align: 'center',
    alignsecond: false,
  };

  componentDidMount() {



    // Animated.transform(this.animatedValue, {
    //   toValue: 1,
    //   friction: 4,
    //   delay: 2500,
    //   useNativeDriver: true,
    // }).start();

    Animated.timing(this.animatedValue2, {
      toValue: 1,
      delay: 200,
      duration: 3000,
      useNativeDriver: true,

    }).start();

    setTimeout(
      () =>
        this.setState({ align: 'flex-start' }, function () {
          this.setState({
            alignsecond: true,
          });
        }),
      3000
    );
  }


  render() {
    let truckStyle = {
      transform: [{ scale: this.animatedValue }]
    };

    let scaleText = {
      transform: [{ scale: this.animatedValue2 }]
    };


    let trans = {
      transform: [{ translateX: this.translateX }]
    }

    let trans2 = {
      transform: [{ translateX: this.translateX2 }]
    }

    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: this.state.align,
          backgroundColor: '#4baec5'
        }}>

        {!this.state.alignsecond ?
          <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'column', alignItems: 'center' }}>

            <View style={
              {
                alignSelf: 'stretch',
                backgroundColor: '#333',
                marginTop: height / 2 - 100
              }}>
              <Animated.Image
                source={require('./assets/Untitled1.png')}
                style={[
                  {
                    justifyContent: 'center', alignItems: 'center', alignSelf: 'center', position: 'absolute',
                    resizeMode: "contain",
                    width: 100,
                    height: 100
                  },
                  trans
                ]}
              />

              <Animated.Image
                source={require('./assets/Untitled.png')}
                style={[
                  {
                    justifyContent: 'center', alignItems: 'center', alignSelf: 'center', position: 'absolute',
                    resizeMode: "contain",
                    width: 100,
                    height: 100
                  },
                  trans2
                ]}
              />
            </View>
            <Animated.View
              style={[
                {
                  justifyContent: 'flex-end',
                  position: "absolute",
                  bottom: 50,
                  width: width / 2,
                  height: 4,
                  backgroundColor: "#fff",
                  borderRadius: 2
                },
                scaleText
              ]}
            />
          </View>
          :
          (
            // <Provider store={store}>
            <AppContainer />
            // </Provider>
          )}
      </View>
    );
  }
};
