import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableHighlight,
  Modal
} from "react-native";
import { Container, Content } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import NoticeComponent from "./NoticeComponent";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SafeAreaView from "react-native-safe-area-view";
import CommonConf from "../Datas/CommonConf";
import DialogInput from "react-native-dialog-input";

export default class MainTab extends Component {
  //하단 네비게이션
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <MaterialCommunityIcons
        style={{ color: tintColor }}
        name="home"
        size={25}
      />
    )
  };

  state = {
    feeds: [],
    isDialogVisible: false,
    selectedId: null
  };

  //component구분용
  _keyExtractor(item, index) {
    return "key" + index;
  }

  //data db select
  _boardList() {
    var url = "http://" + CommonConf.urlHost + ":8088/ss/api/boardcontents";
    console.log("kny_geturl", url);

    //data select
    fetch(url)
      .then(response => response.json())
      .then(json => {
        console.log("kny_json", json);

        this.setState({
          feeds: json
        });
      })
      .catch(error => {
        console.log("kny_getError", error);
      });
  }

  //초기로드시
  componentDidMount() {
    this._boardList();
  }

  //변경사항 발생시
  componentWillUpdate() {
    this._boardList();
  }

  _deleteClicked = selectedKey => {
    this.setState({
      selectedId: selectedKey,
      isDialogVisible: true
    });

    // Alert.alert(
    //   "111111",
    //   selectedKey,

    //   // <TextInput
    //   //   secureTextEntry
    //   //   numberOfLines={1}
    //   //   maxLength={20}
    //   //   placeholder="비밀번호를 입력하세요."
    //   // />,
    //   [
    //     {
    //       text: "취소"
    //     },
    //     {
    //       text: "확인"
    //       // onPress: () => this._removeText()
    //       // if() {
    //       //   onPress: () => this._removeText()
    //       // }
    //     }
    //   ],
    //   { cancelable: false }
    // );
  };

  _remove = inputText => {
    //const _this = this;
    var url = "http://" + CommonConf.urlHost + ":8088/ss/api/boardcontents/";
    // var url = 'http://' + CommonConf.urlHost + ':8088/ss/api/deleteAllboardcontents/';

    fetch(url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pwd: inputText,
        _id: this.state.selectedId
      })
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);
        if (json.resCode != 200) {
          Alert.alert(json.resMsg);
        } else {
          Alert.alert(
            "삭제 완료",
            "선택한 글이 정상적으로 삭제되었습니다.",
            [
              {
                text: "확인",
                onPress: () => this._boardList()
              }
            ],
            { cancelable: false }
          );
        }
      })
      .catch(error => {
        Alert.alert(error);
      });

    // fetch(url, {
    //   method: "delete",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({
    //     "pwd" : this.state.pwd,
    //     "_id" : this.state.selectedId
    //   })
    // })
    //   .then(response => response.json())
    //   .catch(err => {
    //     Alert.alert(err);
    //   })
    //   .then(json => {
    //     console.log("kny_insert_json:", json);

    //     if (json.resCode == 200) {
    //       //정상

    //       Alert.alert(
    //         "삭제 완료",
    //         "선택한 글이 정상적으로 삭제되었습니다.",
    //         [
    //           {
    //             text: "확인",
    //             onPress: () => this.props.navigation.goBack()
    //           }
    //         ],
    //         { cancelable: false }
    //       );
    //     } else {
    //       Alert.alert(json.error);
    //     }
    //   });
  };

  showDialog = bool => {
    this.setState({
      isDialogVisible: bool
    });
  };

  setInputPwd = inputText => {
    this.setState({
      // pwd : inputText,
      isDialogVisible: false
    });
    this._remove(inputText);
  };

  render() {
    return (
      <SafeAreaView forceInset={{ bottom: "never", top: "never" }}>
        <DialogInput
          isDialogVisible={this.state.isDialogVisible}
          title={"삭제"}
          message={"삭제된 글은 복구되지 않습니다. \n정말 삭제하시겠습니까?"}
          hintInput={"비밀번호 입력"}
          submitInput={inputText => {
            this.setInputPwd(inputText);
          }}
          closeDialog={() => {
            this.showDialog(false);
          }}
          // onPress={ ()=>this._removeText()}
        ></DialogInput>

        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <Container style={styles.container}>
            <Content>
              {//state.feeds배열 map함수로 루프돌며 NoticeComponent의 data에 각 피드 항목 데이터 전달
              this.state.feeds.map(feed => (
                <NoticeComponent
                  key={this._keyExtractor}
                  data={feed}
                  deleteClicked={this._deleteClicked}
                />
              ))}
            </Content>
          </Container>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  }
});
