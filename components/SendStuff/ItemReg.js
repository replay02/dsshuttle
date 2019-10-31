//운반 물품 등록 화면
import React, { Component } from "react";
import {
  StyleSheet,
  Button,
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from "react-native";
// import CheckboxForm from "react-native-checkbox-form";
import Dropbox from "react-native-vector-icons/FontAwesome";
import User from "react-native-vector-icons/FontAwesome";
import Truck from "react-native-vector-icons/FontAwesome5";
import CheckBox from "react-native-check-box";
import DefaultPreference from "react-native-default-preference";
import CommonConf from "../Datas/CommonConf";

const itemType = [
  {
    label: "노트북",
    value: 0,
    RNchecked: false
  },
  {
    label: "모니터",
    value: 1,
    RNchecked: false
  },
  {
    label: "비품",
    value: 2,
    RNchecked: false
  },
  {
    label: "기타",
    value: 3,
    RNchecked: false
  }
];

export default class ItemReg extends Component {
  state = {
    navigation: null,
    data: this.props.navigation.state.params.data,
    location: this.props.navigation.state.params.location,
    toToken: "",
    isChecked: false,
    name: "",
    phone: "",
    stuffs: itemType,
    sendText: ""
  };

  static navigationOptions = {
    title: "운반 물품 등록",
    headerStyle: {
      backgroundColor: "#4baec5"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold",
      color: "#fff"
    }
  };

  componentDidMount() {
    
  }

  componentWillUnmount() {
    this.setState({
        stuffs: itemType
    });
}


  _onChangeText = text => {
    this.setState({
      sendText: text
    });
  };

  _checkUser = () => {
    const { name, phone } = this.state;

    if (name == "" || phone == "") {
      Alert.alert("이름과 전화번호를 확인해주세요");
      return;
    }

    var url = "http://" + CommonConf.urlHost + ":8088/ss/api/checkPushUser";
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        phone: phone
      })
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);

        if (json.resCode != 200) {
          Alert.alert(json.resMsg);
          // this.setState({
          //     isLoadingNow: false
          // });
        } else {
          this.setState({
            toToken: json.resData,
            isChecked: true
          });
          Alert.alert("정상 확인 되었습니다");
          // Alert.alert(json.login_token);
        }
      })
      .catch(error => {
        Alert.alert(
          "서버 통신 상태가 원활하지 않습니다. 잠시 후 다시 시도해 주세요."
        );
        // this.setState({
        //     isLoadingNow: false
        // })
      });
  };

  _onRegClicked = () => {
    const _this = this;

    if (!this.state.isChecked) {
      Alert.alert("수신자의 이름과 전화번호를 먼저 확인해주세요");
      return;
    }

    DefaultPreference.get(CommonConf.PREF_KEY_LOGIN_TOKEN)
      .then(function(login_token) {
        // Alert.alert(login_token);

        if (login_token) {
          var url = "http://" + CommonConf.urlHost + ":8088/ss/api/sendStuff";

          console.log(url);

          let checkedDataString = "";
          _this.state.stuffs.map((data, index) => {
            if (data.RNchecked) {
              if (index == 0) {
                checkedDataString += data.label;
              } else {
                if (checkedDataString.length > 0) {
                  checkedDataString += "," + data.label;
                } else {
                  checkedDataString += data.label;
                }
              }
            }
          });
          fetch(url, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              token: _this.state.toToken,
              stuffs: checkedDataString,
              sendText: _this.state.sendText,
              time: _this.state.data,
              location: _this.state.location,
              fromToken: login_token
            })
          })
            .then(response => response.json())
            .then(json => {
              console.log(json);

              if (json.resCode == 200) {
                Alert.alert(json.resMsg);
              }
            })
            .catch(err => Alert.alert(err));
        }
      })
      .catch(err => Alert.alert(err));
  };

  render() {
    const { data, location } = this.state;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerView}>
            <Dropbox
              style={{ justifyContent: "center", alignItems: "center" }}
              name="dropbox"
              size={24}
              color="#333"
            />
            <Text style={styles.headerText}>물품 종류</Text>
          </View>

          <View style={styles.checkBox}>
            {this.state.stuffs.map((value, index) => (
              <CheckBox
                key={index}
                onClick={() => {
                  let data = this.state.stuffs.slice();
                  data[index].RNchecked = !data[index].RNchecked;
                  this.setState({ stuff: data });
                }}
                style={{ justifyContent: "center", flex: 1, padding: 1 }}
                isChecked={value.RNchecked}
                rightText={value.label}
                rightTextStyle={{ marginLeft: 1 }}
              />
            ))}
          </View>

          <View style={styles.headerView2}>
            <View
              style={{ alignItems: "center", flexDirection: "row", height: 40 }}
            >
              <User
                style={{ justifyContent: "center", alignItems: "center" }}
                name="user"
                size={24}
                color="#333"
              />
              <Text style={styles.headerText}>수신자 정보</Text>
            </View>

            <TouchableOpacity
              style={styles.button2}
              activeOpacity={0.7}
              onPress={() => this._checkUser()}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 15,
                  padding: 5,
                  color: "white"
                }}
              >
                수신자 정보 체크(필수)
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              backgroundColor: "#dcdcdc",
              paddingTop: 10,
              paddingBottom: 0,
              marginLeft: 15,
              marginRight: 15,
              borderRadius: 5
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: 10,
                paddingRight: 10,
                marginLeft: 10,
                marginRight: 10
              }}
            >
              <Text style={{ fontSize: 15, color: "#282828", marginLeft: 10 }}>
                이름
              </Text>
              <TextInput
                style={{
                  borderColor: "#aaa",
                  borderWidth: 1,
                  width: "60%",
                  height: 35,
                  borderRadius: 5,
                  padding: 5,
                  backgroundColor: "white"
                }}
                onChangeText={name => this.setState({ name: name })}
                editable={!this.state.isChecked}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: 10,
                paddingRight: 10,
                marginLeft: 10,
                marginRight: 10
              }}
            >
              <Text style={{ fontSize: 15, color: "#282828", marginLeft: 10 }}>
                핸드폰 번호
              </Text>
              <TextInput
                style={{
                  borderColor: "#aaa",
                  borderWidth: 1,
                  width: "60%",
                  height: 35,
                  borderRadius: 5,
                  padding: 5,
                  backgroundColor: "white"
                }}
                onChangeText={phone => this.setState({ phone: phone })}
                editable={!this.state.isChecked}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingBottom: 10,
                paddingRight: 10,
                marginLeft: 10,
                marginRight: 10
              }}
            >
              <Text style={{ fontSize: 15, color: "#282828", marginLeft: 10 }}>
                전달 메시지
              </Text>

              <TextInput
                style={{
                  borderColor: "#aaa",
                  borderWidth: 1,
                  width: "60%",
                  height: 70,
                  borderRadius: 5,
                  padding: 5,
                  backgroundColor: "white"
                }}
                multiline
                numberOfLines={5}
                onChangeText={text => this._onChangeText(text)}
              />
            </View>
          </View>

          <View style={styles.headerView}>
            <Truck
              style={{ justifyContent: "center", alignItems: "center" }}
              name="truck"
              size={24}
              color="#333"
            />
            <Text style={styles.headerText}>발신 정보</Text>
          </View>

          <View
            style={{
              backgroundColor: "#dcdcdc",
              paddingTop: 10,
              paddingBottom: 0,
              marginLeft: 15,
              marginRight: 15,
              borderRadius: 5
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: 10,
                paddingRight: 10,
                marginLeft: 10,
                marginRight: 80
              }}
            >
              <Text style={{ fontSize: 15, color: "#282828", marginLeft: 10 }}>
                예정 시각
              </Text>
              <TextInput
                style={{
                  borderColor: "#aaa",
                  borderWidth: 1,
                  color: "black",
                  width: "50%",
                  height: 35,
                  borderRadius: 5,
                  padding: 5,
                  backgroundColor: "white"
                }}
                value={data}
                editable={false}
                textAlign="center"
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: 10,
                paddingRight: 10,
                marginLeft: 10,
                marginRight: 80
              }}
            >
              <Text style={{ fontSize: 15, color: "#282828", marginLeft: 10 }}>
                발송지
              </Text>
              <TextInput
                style={{
                  borderColor: "#aaa",
                  borderWidth: 1,
                  color: "black",
                  width: "50%",
                  height: 35,
                  borderRadius: 5,
                  padding: 5,
                  backgroundColor: "white"
                }}
                value={location}
                editable={false}
                textAlign="center"
              />
            </View>
          </View>

          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              marginTop: 20
            }}
          >
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.7}
              onPress={() => this._onRegClicked()}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 15,
                  padding: 5,
                  color: "white"
                }}
              >
                등록
              </Text>
            </TouchableOpacity>

            <Text style={{ marginLeft:20, marginRight:20, color: "red", fontWeight: "bold", marginTop: 20, marginBottom:20 }}>
              * 등록 시 수신자에게 해당 정보에 대한 Push알림이 발송됩니다.
            </Text>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerView: {
    alignItems: "center",
    marginLeft: 20,
    flexDirection: "row",
    height: 40,
    marginTop: 5,
    marginBottom:5
  },
  headerView2: {
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 20,
    marginRight: 20,
    flexDirection: "row",
    height: 40,
    marginTop: 5,
    marginBottom:5
  },
  headerText: {
    marginLeft: 5,
    color: "black",
    textAlignVertical: "center",
    fontSize: 15,
    textAlign: "left"
  },
  checkBox: {
    flexDirection: "row",
    backgroundColor: "#dcdcdc",
    justifyContent: "center",
    paddingTop: 15,
    paddingBottom: 15,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 5
  },
  button: {
    backgroundColor: "#4baec5",
    borderRadius: 5,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 50,
    paddingRight: 50
  },
  button2: {
    backgroundColor: "#4baec5",
    borderRadius: 5,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    alignItems: "flex-end"
  }
});
