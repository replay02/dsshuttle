import React, { Component } from "react";
import { Platform, StyleSheet, View } from "react-native";
import {
  createBottomTabNavigator,
  createAppContainer,
  createMaterialTopTabNavigator
} from "react-navigation";

import MainTab from "./MainTab";
import WriteTab from "./WriteTab";
import SafeAreaView from "react-native-safe-area-view";

//하단 네비게이션
const NbTabNavigator = createMaterialTopTabNavigator(
  {
    MainTab: { screen: MainTab },
    WriteTab: { screen: WriteTab }
  },
  {
    animationEnabled: false,
    swipeEnabled: false,
    tabBarPosition: "bottom",
    tabBarOptions: {
      iconStyle: { height: 30 },
      activeTintColor: "#FFFFFF",
      inactiveTintColor: "#333333",
      upperCaseLabel: false,
      showLabel: true,
      showIcon: true,

      tabStyle: {
        backgroundColor: "#4baec5"
      }
    }
  }
);

//tab component
const NbTabContainer = createAppContainer(NbTabNavigator);

export default class NoticeBoard extends Component {
  //상단 네비게이션
  static navigationOptions = {
    title: "게시판",
    headerStyle: {
      backgroundColor: "#4baec5"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold",
      color: "#fff"
    }
  };

  render() {
    return <NbTabContainer />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
