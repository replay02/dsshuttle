import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableHighlight,
  Alert
} from "react-native";

import { Card, CardItem, Body, Left, Right, Button } from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TextInput } from "react-native-gesture-handler";
import CommonConf from "../Datas/CommonConf";

export default class NoticeComponent extends Component {

  render() {
    const { data, deleteClicked } = this.props; //피드항목 데이터

    return (
      <Card>
        <CardItem>
          <Left>
            {/* 공통 프로필 이미지 */}
            <Ionicons name="md-person" size={40} />
            <Body>
              <Text>{data.writer}</Text>
              <Text style={styles.dateText}>{data.date}</Text>
            </Body>
          </Left>
          <Right>
            <TouchableHighlight onPress={() => deleteClicked(data._id)}>
              <MaterialCommunityIcons
                style={styles.delBtn}
                name="delete"
                size={30}
              />
            </TouchableHighlight>
          </Right>
        </CardItem>
        <CardItem>
          <Text style={{ fontWeight: "500" }}>{data.content}</Text>
        </CardItem>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  delBtn: {
    color: "#c0392b"
  },
  dateText: {
    fontSize: 10
  }
});
