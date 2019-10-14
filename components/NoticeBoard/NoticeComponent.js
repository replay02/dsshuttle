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



  _goDelBtn = () => {

    Alert.alert(
      "삭제",
      "삭제된 글은 복구되지 않습니다. \n정말 삭제하시겠습니까?",

      // <TextInput
      //   secureTextEntry
      //   numberOfLines={1}
      //   maxLength={20}
      //   placeholder="비밀번호를 입력하세요."
      // />,
      [
        {
          text: "취소"
        },
        {
          text: "확인",
          onPress: () => this._removeText()
          // if() {
          //   onPress: () => this._removeText()
          // }
        }
      ],
      { cancelable: false }
    );
  };

  _insertPw = () => {
    Alert.alert(
      <TextInput
        secureTextEntry
        numberOfLines={1}
        maxLength={20}
        placeholder="비밀번호를 입력하세요."
      />,
      [
        {
          text: "취소"
        },
        {
          text: "확인",
          onPress: () => this._removeText()
        }
      ]
    );
  };

  _removeText = () => {
    //const _this = this;
    var url = 'http://' + CommonConf.urlHost + ':8088/ss/api/boardcontents/';
    // var url = 'http://' + CommonConf.urlHost + ':8088/ss/api/deleteAllboardcontents/';

    fetch(url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
      // body: JSON.stringify({
      //   //패스워드?
      // }),
    })
      .then(response => response.json())
      .catch(err => {
        Alert.alert(err);
      })
      .then(json => {
        console.log("kny_insert_json:", json);

        if (json.resCode == 200) {
          //정상

          Alert.alert(
            "삭제 완료",
            "선택한 글이 정상적으로 삭제되었습니다.",
            [
              {
                text: "확인",
                onPress: () => this.props.navigation.goBack()
              }
            ],
            { cancelable: false }
          );
        } else {
          Alert.alert(json.resMsg);
        }
      });
  };

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
