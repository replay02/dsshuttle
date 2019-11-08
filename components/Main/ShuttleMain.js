import React, { Component } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Animated,
  View,
  Alert,
  Text,
  Dimensions,
  Image,
  Platform
} from "react-native";

import * as Progress from "react-native-progress";
import moment from "moment-timezone";
import "moment/locale/ko";

// import { RectButton } from 'react-native-gesture-handler';
import SafeAreaView from "react-native-safe-area-view";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import CardView from "react-native-cardview";

import Weather from "./Weather";
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const API_KEY = "056222ceae9bf6dc96aa6c52a14985c6";
const API_KEY_GEO = "AIzaSyBRZawBb4awd9BNC4EmlSYRRGY5bACLt5E"; // 유료 문제 사용 안함

const menuTitles = ["사송", "셔틀", "게시판", "기사님 정보", "기타"];
const safearewHeaderHeight = Platform.OS === "android" ? 0 : 44;

import firebase from "../Push/Firebase";
import CommonConf from "../Datas/CommonConf";
import DefaultPreference from "react-native-default-preference";

import Carousel, { Pagination } from "react-native-snap-carousel";

export default class ShuttleMain extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    navigation: null,
    animatedStartValue: new Animated.Value(0),
    isLoadingNow: true,
    error: null,
    temp: null,
    myWeather: null,
    addr: "",
    icon: null,
    weatherMap: null,
    weatherArray: null,
    activeSlide: 0,
    notiDatas: []
  };

  static navigationOptions = {
    header: null,
    title: "메인",
    headerStyle: {
      backgroundColor: "#4baec5"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold",
      color: "#fff"
    }
  };

  _getNotification = () => {
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

            if (json.resCode == 200) {
              // 정상
              _this.setState({
                notiDatas: json.resData
              });
              // Alert.alert(json.resData[0].message);
            } else {
              Alert.alert(json.resMsg);
            }
          })
          .catch(error => {
            Alert.alert(error.toString());
          });
      }
    });
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this._getWeather(position.coords.latitude, position.coords.longitude);
        this._getAddressByLatLng(
          position.coords.latitude,
          position.coords.longitude
        );

        this._getFiveDayWeather(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      error => {
        this.setState({
          error: error
        });
      }
    );
    const _this = this;
    firebase
      .messaging()
      .getToken()
      .then(function(token) {
        _this._onChangeToken(token);
      })
      .catch(function(error) {
        Alert.alert("error : " + error.toString());
      });

    firebase.messaging().onTokenRefresh(token => {
      this._onChangeToken(token);
    });

    this._getNotification();
  }

  // push token 갱신
  _onChangeToken = token => {
    DefaultPreference.get(CommonConf.PREF_KEY_LOGIN_TOKEN).then(function(
      login_token
    ) {
      if (login_token) {
        var url = "http://" + CommonConf.urlHost + ":8088/ss/api/regiPushToken";
        fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            login_token: login_token,
            push_token: token
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
              // this.setState({
              //     isLoadingNow: false
              // });
              // Alert.alert(json.resMsg);
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
      }
    });
  };

  // 사송
  _goSmallShuttle = () => {
    this.props.navigation.navigate("ShuttleTab");
  };
  // 셔틀
  _goBigShuttle = () => {
    this.props.navigation.navigate("BigShuttleMain");
  };
  // 게시판
  _goCommonNotice = () => {
    this.props.navigation.navigate("NoticeBoard");
  };

  // 기사님정보
  _goDriverInfo = () => {
    this.props.navigation.navigate("DriverInfo");
  };

  // 기타
  _goEtc = () => {
    Alert.alert(menuTitles[4]);
  };

  // 날씨 정보 가져오는 API 기본 1분에 60회 가능... 고도화 필요
  _getWeather = (lat, lon) => {
    var url =
      "http://api.openweathermap.org/data/2.5/weather?lat=" +
      lat +
      "&lon=" +
      lon +
      "&APPID=" +
      API_KEY;
    console.log(url);

    // Alert.alert(url);

    fetch(url)
      .then(response => response.json())
      .then(json => {
        console.log(json);
        this.setState({
          temp: json.main.temp,
          myWeather: json.weather[0].main,
          icon:
            "http://openweathermap.org/img/w/" + json.weather[0].icon + ".png",
          isLoadingNow: false
        });
      });
  };

  _getFiveDayWeather = (lat, lon) => {
    var url =
      "http://api.openweathermap.org/data/2.5/forecast?lat=" +
      lat +
      "&lon=" +
      lon +
      "&APPID=" +
      API_KEY +
      "&lang=kr";
    console.log(url);

    fetch(url)
      .then(response => response.json())
      .then(json => {
        console.log(json);

        if (json.cod == "200") {
          let dayWeatherMap = new Map(); // 하루치 날씨 array 5일 또는 6일도 될 수 있어서 가변

          for (let data of json.list) {
            // let dateArry = data.dt_txt.split(" ");
            var korea = moment(data.dt * 1000).tz("Asia/Seoul");
            var tmp = korea.format("MM월 DD일(dd),HH시");
            console.log("korea : " + tmp);
            let dateArry = tmp.split(",");

            let date = dateArry[0]; // 2019년 04월 25일
            let time = dateArry[1]; // 06시

            let weatherJSon = JSON.stringify({
              time: time,
              temp: Math.floor(data.main.temp - 273.15),
              humidity: data.main.humidity,
              main: data.weather[0].main,
              icon: data.weather[0].icon
            });

            if (dayWeatherMap.has(date)) {
              let timeArry = dayWeatherMap.get(date);
              timeArry.push(weatherJSon);
              dayWeatherMap.set(date, timeArry);
            } else {
              let timeArry = [];
              timeArry.push(weatherJSon);
              dayWeatherMap.set(date, timeArry);
            }
          }
          dayWeatherMap.forEach((value, key, map) => {
            console.log("key : " + key);
            for (let data of value) {
              console.log("data : " + JSON.stringify(data));
            }
          });

          this.setState({
            weatherMap: dayWeatherMap,
            weatherArray: Array.from(dayWeatherMap.keys())
          });
        }
      });
  };

  _getAddressByLatLng = (lat, lon) => {
    // 과금 정책 향후 1년여간 무료, 네이버는 한달 1000건 이상 유료
    // https://maps.googleapis.com/maps/api/geocode/json?latlng=37.566535,126.977969&language=ko&key=AIzaSyBRZawBb4awd9BNC4EmlSYRRGY5bACLt5E
    var url =
      "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
      lat +
      "," +
      lon +
      "&language=ko&key=" +
      API_KEY_GEO;
    console.log("geo url  : " + url);

    // Alert.alert(url);

    fetch(url)
      .then(response => response.json())
      .then(json => {
        let jbSplit = json.plus_code.compound_code.split(" ");
        let retVal = "";
        for (let i in jbSplit) {
          if (i == 0 || i == 1) {
            continue;
          } else {
            retVal += " " + jbSplit[i];
          }
        }

        this.setState({
          addr: retVal
        });
      })
      .catch(error => {});
  };

  renderItem = item => {
    console.log("render item : " + item.index);

    const { isLoadingNow, weatherMap, temp, myWeather } = this.state;

    let data = weatherMap.get(item.item);

    var obj = JSON.parse(data[0]);
    let array = [];

    for (let d of data) {
      array.push(JSON.parse(d));
    }

    return (
      <CardView
        cardElevation={2}
        cardMaxElevation={2}
        style={{
          backgroundColor: "#fff",
          flex: 1
        }}
        cornerRadius={15}
      >
        <Weather
          temp={isLoadingNow ? "-" : temp}
          nowWeather={obj.main}
          date={item.item}
          weatherArray={array}
        />
      </CardView>
    );
  };

  // 페이지 dot
  pagination() {
    const { activeSlide, weatherMap } = this.state;

    return (
      <Pagination
        dotsLength={weatherMap.size}
        activeDotIndex={activeSlide}
        containerStyle={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
        dotStyle={{
          width: 5,
          height: 5,
          borderRadius: 5,
          marginHorizontal: 1,
          backgroundColor: "rgba(255, 255, 255, 0.92)"
        }}
        inactiveDotStyle={{}}
        style={{ marginTop: -15, marginBottom: -15 }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }

  render() {
    const {
      temp,
      myWeather,
      isLoadingNow,
      addr,
      activeSlide,
      weatherMap,
      weatherArray
    } = this.state;

    return (
      <SafeAreaView
        forceInset={{ bottom: "always", top: "always" }}
        style={styles.container}
      >
        <View style={[styles.image, { backgroundColor: "#4baec5" }]} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            height: 50
          }}
        >
          <Text style={styles.addr}>{addr ? addr : "-"}</Text>

          {isLoadingNow ? (
            <Text style={styles.mainText}>{"-"}℃</Text>
          ) : (
            <Text style={[styles.mainText, { marginTop: 20 }]}>
              {Math.floor(temp - 273.15)}℃
            </Text>
          )}
        </View>

        {weatherMap && weatherMap.size > 0 && !isLoadingNow ? (
          <View style={{ flex: 0.7 }}>
            <Carousel
              ref={c => {
                this._carousel = c;
              }}
              data={weatherArray}
              renderItem={this.renderItem}
              sliderWidth={width}
              itemWidth={width - 50}
              layout={"stack"}
              onSnapToItem={index => this.setState({ activeSlide: index })}
              // lockScrollWhileSnapping={true}
              // lockScrollTimeoutDuration={100}
              // loop={true}
              // layoutCardOffset={5}
              //   contentContainerCustomStyle={{
              //     //   ...StyleSheet.absoluteFillObject,
              //     //   width: width - 50,
              //     //   height: height / 3
              //     // overflow: visible,
              //   }}

              containerCustomStyle={{ flex: 1 }}
              slideStyle={{
                ...Platform.select({
                  ios: {
                    flex: 1,
                    backgroundColor: "transparent",
                    alignItems: "center"
                  },
                  android: {}
                })
              }}
            />

            <Pagination
              dotsLength={weatherMap.size}
              activeDotIndex={activeSlide}
              containerStyle={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
              dotStyle={{
                width: 5,
                height: 5,
                borderRadius: 5,
                marginHorizontal: 1,
                backgroundColor: "rgba(255, 255, 255, 0.92)"
              }}
              inactiveDotStyle={{}}
              style={{ marginTop: -15, marginBottom: -15 }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />
          </View>
        ) : (
          <View
            style={{
              flex: 0.7,
              justifyContent: "center"
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
        )}

        <View
          style={{ flex: 0.3, justifyContent: "flex-end", paddingBottom: 15 }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              flex: 0.33
            }}
          >
            <TouchableHighlight
              style={styles.button}
              onPress={() => this._goSmallShuttle()}
              underlayColor="#ffffff55"
            >
              <Text style={[styles.buttonText]}>{menuTitles[0]}</Text>
            </TouchableHighlight>

            <TouchableHighlight
              style={styles.button}
              onPress={() => this._goBigShuttle()}
              underlayColor="#ffffff55"
            >
              <Text style={[styles.buttonText]}>{menuTitles[1]}</Text>
            </TouchableHighlight>
          </View>

          <TouchableHighlight
            style={[styles.commonButton]}
            onPress={() => this._goCommonNotice()}
            underlayColor="#ffffff55"
          >
            <Text style={[styles.buttonText]}>{menuTitles[2]}</Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={[styles.commonButton]}
            onPress={() => this._goDriverInfo()}
            underlayColor="#ffffff55"
          >
            <Text style={[styles.buttonText]}>{menuTitles[3]}</Text>
          </TouchableHighlight>
        </View>

        <TouchableOpacity
          style={styles.settingBtn}
          onPress={() => this.props.navigation.navigate("SettingMain")}
          activeOpacity={0.7}
        >
          <Icon
            style={{ justifyContent: "center", alignItems: "center" }}
            name="settings"
            size={30}
            color="#fff"
          />
        </TouchableOpacity>

        {this.state.notiDatas ? (
          <TouchableOpacity
            style={styles.notiAlarmBtn}
            onPress={() =>
              this.props.navigation.navigate("ItemList", {
                data: this.state.notiDatas
              })
            }
            activeOpacity={0.7}
          >
            <Ionicons
              style={{ justifyContent: "center", alignItems: "center" }}
              name="md-notifications"
              size={30}
              color="#fff"
            />
          </TouchableOpacity>
        ) : null}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  buttonStyle: {
    flex: 1,
    height: 50,
    marginTop: 10
  },
  notiAlarmBtn: {
    height: 45,
    position: "absolute",
    width: 45,
    marginLeft: 20,
    alignItems: "flex-start",
    alignSelf: "flex-start",
    marginTop: 15 + safearewHeaderHeight
  },
  settingBtn: {
    height: 45,
    position: "absolute",
    width: 45,
    alignItems: "flex-start",
    alignSelf: "flex-end",
    marginTop: 15 + safearewHeaderHeight
  },

  container: {
    flex: 1
  },
  mainText: {
    alignSelf: "center",
    height: 50,
    alignItems: "center",
    // justifyContent: "center",
    fontSize: 30,
    marginTop: 10,
    color: "#fff",
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 3
  },
  addr: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 15,
    marginTop: 10,
    marginRight: 5,
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1
  },
  image: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    width: null,
    height: null,
    resizeMode: "cover"
  },

  button: {
    marginRight: 20,
    marginLeft: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#22222222",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#22222222"
  },

  commonButton: {
    // paddingTop: 20,
    marginTop: 10,
    marginRight: 20,
    marginLeft: 20,
    flex: 0.33,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#22222222",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#22222222"
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center"
  }
});
