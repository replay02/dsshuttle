import React, { Component } from 'react';
import { Animated, Alert, View, Dimensions,Platform } from 'react-native';
import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';

import BigShuttleMapBase from './components/BigShuttle/BigShuttleMapBase';
import ShuttleTab from './components/SmallShuttle/ShuttleTab';
import ShuttleMain from './components/Main/ShuttleMain';
import BigShuttleMain from './components/BigShuttle/BigShuttleMain';
import UserMain from './components/Users/UserMain';
import UserRegister from './components/Users/UserRegister';
import UserResetPwd from './components/Users/UserResetPwd';

import DriverInfo from './components/DriversInfo/DriverInfo';//dy
import ItemReg from './components/SendStuff/ItemReg';//dy
import ItemList from './components/SendStuff/ItemList';//dy
import ItemDtlList from './components/SendStuff/ItemDtlList';//dy
import NoticeBoard from './components/NoticeBoard/NoticeBoard'; // ny: 게시판

import SmallShuttleMain from './components/SmallShuttle/SmallShuttleMain';
import SettingMain from './components/Setting/SettingMain';
import SettingSub from './components/Setting/SettingSub';
import UserChangePwd from './components/Users/UserChangePwd';
import firebase  from './components/Push/Firebase';
// import { platform } from 'os';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


const mainStack = createStackNavigator(
  {
    Main: ShuttleMain,
    BigShuttleMain: BigShuttleMain,
    BigShuttleMapBase: BigShuttleMapBase,
    DriverInfo: DriverInfo, //dy
    ItemReg: ItemReg,//dy
    SmallShuttleMain: SmallShuttleMain,
    ShuttleTab: ShuttleTab,
    SettingMain: SettingMain,
    SettingSub: SettingSub,
    UserChangePwd:UserChangePwd,
    NoticeBoard : NoticeBoard, // ny:게시판
    ItemList: ItemList,//dy
    ItemDtlList : ItemDtlList//dy
  }, {
    initialRouteName: 'Main',

    // 화면전환 애니메이션 
    transitionConfig: () => ({
      screenInterpolator: sceneProps => {
        const { layout, position, scene } = sceneProps;
        const { index } = scene;

        const translateX = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [layout.initWidth, 0, 0]
        });
        
        const opacity = position.interpolate({
          inputRange: [
            index - 1,
            index - 0.99,
            index,
            index + 0.99,
            index + 1
          ],
          outputRange: [0, 1, 1, 0.3, 0]
        });

        return { opacity, transform: [{ translateX }] };
      }
    }),

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

const userStack = createStackNavigator(
  {
    UserMain: UserMain,
    UserRegister: UserRegister,
    UserResetPwd: UserResetPwd
  }, {
    initialRouteName: 'UserMain',
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

const RootStack = createSwitchNavigator(
  {
    Auth: userStack,
    App: mainStack
  },
  {
    initialRouteName: 'Auth',
    // defaultNavigationOptions: {
    //   headerStyle: {
    //     display: "none",
    //     backgroundColor: '#4baec5',
    //   },
    //   // headerTintColor: '#fff',
    //   headerTitleStyle: {
    //     fontWeight: 'bold',
    //     color: '#fff'
    //   },
    // },
  }
);

// const store = createStore(reducers);
// const AppContainer = createAppContainer(mainStack)
// const UserContainer = createAppContainer(userStack)
const Root = createAppContainer(RootStack)


const value = width - 50;

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0);

    this.translateX = this.animatedValue.interpolate({
      inputRange: [0, 0.3, 0.9, 0.95, 1],
      outputRange: [value, 0, 0, -10, 0],

    });

    this.translateX2 = this.animatedValue.interpolate({
      inputRange: [0, 0.3, 1],
      outputRange: [-value, 0, 0],
    });
  }

  state = {
    animating: false,
    align: 'center',
    alignsecond: false,   // 앱 시작 인트로 애니메이션 끝났는지 여부
    isLogined: false  // 로그인 토큰을 가지고 있는지 여부
  };


  _listenForNotifications() {
    // onNotificationDisplayed - ios only

    this.notificationListener = firebase.notifications().onNotification((notification) => {

      // if (Platform.OS === 'android') {
      //   notification.android.setChannelId("SS").android.setPriority(firebase.notifications.Android.Priority.High).android.setVibrate(500)
      // }
      
      console.log('onNotification', notification);
      Alert.alert(notification.title, notification.body);
    });
    
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
        console.log('onNotificationOpened', notificationOpen);
       
        if (Platform.OS === 'android') {
          Alert.alert(notificationOpen.notification.data.title, notificationOpen.notification.data.body);
        }
        else {
          Alert.alert(notificationOpen.notification.title, notificationOpen.notification.body);
        }
        
    });




    // background message listener
    // this.messageListener = firebase.messaging().onMessage((message) => {
    //   // Process your message as required
    //   // This listener is called with the app activated
    //   console.log(message);
    //   Alert.alert("44444");
    // });

    // const notificationOpen = await firebase.notifications().getInitialNotification();
    // if (notificationOpen) {
    //     console.log('getInitialNotification', notificationOpen);
    //     Alert.alert("1" + notificationOpen.notification.body);
    // }

    // firebase.notifications().getInitialNotification()
    //   .then((notificationOpen) => {
    //     if (notificationOpen) {
    //       // App was opened by a notification
    //       // Get the action triggered by the notification being opened
    //       const action = notificationOpen.action;
    //       // Get information about the notification that was opened
    //       const notification = notificationOpen.notification;  
    //     }
    //   })
    //   .catch(error => {
    //     // User has rejected permissions  
    //   });

  }
  
  componentWillUnmount(){
    this.notificationListener();
    this.notificationOpenedListener();
    // this.notificationDisplayListener();
    // this.messageListener();
  }
  
  componentDidMount() {
    Animated.timing(this.animatedValue, {
      toValue: 1,
      // delay: 200,
      duration: 2000,
      useNativeDriver: true,

    }).start();

    setTimeout(
      () =>
        this.setState({ align: 'flex-start' }, function () {
          this.setState({
            alignsecond: true,
          });
        }),
      2000
    );

    this._checkPermission();
    this._listenForNotifications();
    
  }

  async _checkPermission(){

    try {
      const enabled = await firebase.messaging().hasPermission();
      if (enabled) {
          // user has permissions
          console.log(enabled);
          // this._updateTokenToServer();
      } else {
          // user doesn't have permission
          this._requestPermission();
      }
    }
    catch (error) {

    }
  }

  async _requestPermission(){
    try {
      // User has authorised
      await firebase.messaging().requestPermission();
      // await this._updateTokenToServer();
    } catch (error) {
        // User has rejected permissions
        alert("you can't handle push notification");
    }
  }


  _loginCompleteCallback = () => {
    this.setState({
      isLogined: true
    })
  }

  render() {
    let scaleText = {
      transform: [{ scale: this.animatedValue }]
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

        {/* 인트로 애니메이션 재생 */}
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
          <Root />
        }
      </View>
    );
  }
};
