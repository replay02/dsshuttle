import React, { Component } from 'react';
import { Easing, StyleSheet, TouchableHighlight, View, Dimensions, Text } from 'react-native';
import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import SettingMain from './SettingMain';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


export default class SettingSub extends React.Component {

  constructor(props) {
    super(props);
  }

  state = {
    // animating: false,
    // align: 'center',
    // alignsecond: false,   // 앱 시작 인트로 애니메이션 끝났는지 여부
    // isLogined: false  // 로그인 토큰을 가지고 있는지 여부
  };

  componentDidMount() {
    // Animated.transform(this.animatedValue, {
    //   toValue: 1,
    //   friction: 4,
    //   delay: 2500,
    //   useNativeDriver: true,
    // }).start();
  }

  render() {

    return (
      <SafeAreaView forceInset={{ bottom: 'always', top: 'always' }} style={styles.container}>
        <View style={{ marginTop: 20 }}>
          <View>
            <Text>Hello World!</Text>

            <TouchableHighlight
              onPress={() => {
                
              }}>
              <Text>다음</Text>
            </TouchableHighlight>
          </View>
        </View>
      </SafeAreaView>
    );
  }
};


const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
});
