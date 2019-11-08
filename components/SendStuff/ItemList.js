//기사님 정보 조회 화면
import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ListView,
  TouchableHighlight,
  Separator,
  Alert
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Swipeout from "react-native-swipeout";
import CardView from "react-native-cardview";
import * as Progress from "react-native-progress";
import DefaultPreference from "react-native-default-preference";

export default class ItemList extends Component {
  state = {
    isLoadingNow: false,
    navigation: null,
    _id: "",
    index: -1,
    data: []
    // data: this.props.navigation.state.params.data
  };

  static navigationOptions = {
    title: "운반 물품 조회",
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
    this._getNotification();
  }

  _keyExtractor(item, index) {
    return "key" + index;
  }

  _goItemDtlList = timeData => {
    this.props.navigation.navigate("ItemDtlList", { timeData: timeData });
  };

  onDelete = item => {
    Alert.alert(
      "안내",
      "메시지를 삭제 하시겠습니까?",
      [
        {
          text: "취소"
        },
        {
          text: "확인",
          onPress: () => this.deleteNoti(item)
        }
      ],
      { cancelable: true }
    );
  };

  onReply = item => {
    Alert.alert(
      "안내",
      "보낸사람에게 수신 알림을 보내시겠습니까?",
      [
        {
          text: "취소"
        },
        {
          text: "확인",
          onPress: () => this.replyNoti(item)
        }
      ],
      { cancelable: true }
    );
  };

  _getNotification = () => {
    this.setState({
      isLoadingNow: true
    });

    var url = "http://" + CommonConf.urlHost + ":8088/ss/api/getPushNoti";
    const _this = this;
    DefaultPreference.get(CommonConf.PREF_KEY_LOGIN_TOKEN).then(function(
      login_token
    ) {
      if (login_token) {
        fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            login_token: login_token
          })
        })
          .then(response => response.json())
          .then(json => {
            console.log(json);

            _this.setState({
              isLoadingNow: false
            });

            if (json.resCode == 200) {
              // 정상
              _this.setState({
                data: json.resData
              });
            } else {
              Alert.alert(json.resMsg);
            }
          })
          .catch(error => {
            _this.setState({
              isLoadingNow: false
            });
            Alert.alert(error.toString());
          });
      } else {
        _this.setState({
          isLoadingNow: false
        });
      }
    });
  };

  deleteNoti(item) {
    const onDeleteComplete = () => {
      this._getNotification();
    };

    this.setState({
      isLoadingNow: true
    });

    var url = "http://" + CommonConf.urlHost + ":8088/ss/api/deletePushNoti";
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        _id: item._id
      })
    })
      .then(response => response.json())
      .then(json => {
        console.log("deletePushNoti response : ", json);

        this.setState({
          isLoadingNow: false
        });

        if (json.resCode == 200) {
          Alert.alert(
            "안내",
            "삭제 완료되었습니다.",
            [
              {
                text: "확인",
                onPress: onDeleteComplete
              }
            ],
            { cancelable: false }
          );
        }
      })
      .catch(error => {
        console.log("kny_getError", error);
        this.setState({
          isLoadingNow: false
        });
      });
  }


  replyNoti(item) {
    const onReplyComplete = () => {
      this._getNotification();
    };

    this.setState({
      isLoadingNow: true
    });

    var url = "http://" + CommonConf.urlHost + ":8088/ss/api/replyStuff";
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: item.to,
        to: item.from,
        _id:item._id
      })
    })
      .then(response => response.json())
      .then(json => {
        console.log("replyStuff response : ", json);

        this.setState({
          isLoadingNow: false
        });

        if (json.resCode == 200) {
          Alert.alert(
            "안내",
            "송신자에게 Push 발송 완료되었습니다.",
            [
              {
                text: "확인",
                onPress: onReplyComplete
              }
            ],
            { cancelable: false }
          );
        }
      })
      .catch(error => {
        console.log("kny_getError", error);
        this.setState({
          isLoadingNow: false
        });
      });
  }

  //리스트 항목 세팅//
  renderItem(data) {
    const onDeleteHandler = item => {
      this.onDelete(item);
    };

    const onReplyHandler = item => {
      this.onReply(item);
    };

    let { item, index } = data;

    var swipeBtns = [
      {
        text: "삭제",
        backgroundColor: "red",
        underlayColor: "rgba(0, 0, 0, 1, 0.6)",
        onPress: onDeleteHandler.bind(this, item)
      },
      {
        text: "수신 완료",
        backgroundColor: "#4baec5",
        underlayColor: "rgba(0, 0, 0, 1, 0.6)",
        onPress: onReplyHandler.bind(this, item)

      }
    ];

    return (
      <Swipeout
        rowID={index}
        style={styles.cardform}
        right={swipeBtns}
        autoClose={true}
      >
        <Text style={styles.paragraph}> {item.message} </Text>
      </Swipeout>
    );
  }

  render() {
    const { data, isLoadingNow } = this.state;

    return (
      <View style={styles.container}>
        {data && data.length > 0 ? (
          <FlatList
            keyExtractor={this._keyExtractor}
            data={data}
            renderItem={this.renderItem.bind(this)}
          />
        ) : (
          !isLoadingNow?(
          <CardView
            cardElevation={2}
            cardMaxElevation={2}
            style={{
              flex: 1,
              flexDirection:"column",
              backgroundColor: "#f1f1f1",
              marginLeft: 20,
              marginRight: 20,
              marginTop: 20,
              alignItems:"center",
              justifyContent:"center",
              marginBottom: 20
            }}
            cornerRadius={7}
          >
            <Text
              style={{
                alignItems: "center",
                alignSelf: "center",
                color: "black"
              }}
            >
              사송 알림 내역이 없습니다.
            </Text>
          </CardView> ): null)
        }
        {isLoadingNow ? (
          <View
            style={{
              backgroundColor: "#000000bb",
              width: 60,
              height: 60,
              borderRadius: 15,
              borderWidth: 0,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              borderColor: "#fff",
              position: "absolute"
            }}
          >
            <Progress.Circle
              thickness={8}
              style={{
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center"
              }}
              size={30}
              indeterminate={true}
            />
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center"
  },
  itemMeta: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 15
  },
  header: {
    paddingTop: 20
  },
  headerText: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    color: "#4baec5",
    paddingTop: 5,
    //color:'#288CD2',
    marginBottom: 10
  },
  paragraph: {
    margin: 10,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#34495e"
  },
  cardform: {
    // padding: 5,
    // alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f3f3"
  }
});
