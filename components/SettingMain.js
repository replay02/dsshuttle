import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Dimensions, Text, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import CardView from 'react-native-cardview';
import DefaultPreference from 'react-native-default-preference';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


import CommonConf from '../datas/CommonConf'


export default class SettingMain extends React.Component {

  constructor(props) {
    super(props);
  }

  state = {
    isLoadingNow: false,
    // animating: false,
    // align: 'center',
    // alignsecond: false,   // 앱 시작 인트로 애니메이션 끝났는지 여부
    // isLogined: false  // 로그인 토큰을 가지고 있는지 여부
  };

  static navigationOptions = {
    title: "설정",
    headerStyle: {
      backgroundColor: '#4baec5',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      color: '#fff'
    },
  };

  componentDidMount() {
    // Animated.transform(this.animatedValue, {
    //   toValue: 1,
    //   friction: 4,
    //   delay: 2500,
    //   useNativeDriver: true,
    // }).start();
  }

  // 회원 탈퇴
  _doWithraw = () => {
    const _this = this;

    DefaultPreference.get(CommonConf.PREF_KEY_LOGIN_TOKEN).then(function (value) {
      if (value === "") {
        Alert.alert('토큰값이 유효하지 않습니다.');
      }
      else {
        _this.setState({
          isLoadingNow: true
        })
        var url = 'http://' + CommonConf.urlHost + ':8080/ss/api/withraw';
        fetch(url, {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "login_token": value
          }),
        }).then(response => response.json()).catch(error => {
          Alert.alert(error);
          _this.setState({
            isLoadingNow: false
          })
        }).then(json => {
          console.log(json);
          if (json.resCode != 200) {
            Alert.alert(json.resMsg);
            _this.setState({
              isLoadingNow: false
            });
          }
          else {
            _this.setState({
              isLoadingNow: false
            });

            // 회원탈퇴 성공
            DefaultPreference.set(CommonConf.PREF_KEY_AUTO_LOGIN, "0")
              .then(function () {
                console.log('auto login off saved.')
                Alert.alert(
                  '회원 탈퇴 완료',
                  '탈퇴가 완료 되었습니다.',
                  [
                    {
                      text: '확인',
                      onPress: () => _this.props.navigation.navigate('Auth')
                    },
                  ],
                  { cancelable: false }
                )
              })
          }
        });
      }
    })
  }

  // 로그아웃
  _doLogout = () => {
    const _this = this;

    DefaultPreference.get(CommonConf.PREF_KEY_LOGIN_TOKEN).then(function (value) {
      if (value === "") {
        Alert.alert('토큰값이 유효하지 않습니다.');
      }
      else {
        _this.setState({
          isLoadingNow: true
        })
        var url = 'http://' + CommonConf.urlHost + ':8080/ss/api/logout';
        fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "login_token": value
          }),
        }).then(response => response.json()).catch(error => {
          Alert.alert(error);
          _this.setState({
            isLoadingNow: false
          })
        }).then(json => {
          console.log(json);

          if (json.resCode != 200) {
            Alert.alert(json.resMsg);
            _this.setState({
              isLoadingNow: false
            });
          }
          else {
            _this.setState({
              isLoadingNow: false
            });
            // 로그아웃 성공
            DefaultPreference.set(CommonConf.PREF_KEY_AUTO_LOGIN, "0")
              .then(function () {
                console.log('auto login off saved.')
                _this.props.navigation.navigate('Auth');
              })
          }
        });
      }
    })
  }

  _selectMenu(menu) {

    switch (menu) {
      case 1:  // logout

        Alert.alert(
          '로그아웃',
          '정말 로그아웃 하시겠습니까?',
          [
            {
              text: '취소',
              style: 'cancel',
            },
            {
              text: '확인',
              onPress: () => this._doLogout()
            },
          ],
          { cancelable: true }
        )
        break;
      case 2:  // 회원 탈퇴

        Alert.alert(
          '회원 탈퇴',
          '정말 탈퇴하시겠습니까? 탈퇴하시면 정보는 복구할 수 없습니다.',
          [
            {
              text: '취소',
              style: 'cancel',
            },
            {
              text: '확인',
              onPress: () => this._doWithraw()
            },
          ],
          { cancelable: true }
        )
        break;
      default:
        Alert.alert(menu + ",");
        break;
    }
  }

  render() {

    return (
      <View style={{ backgroundColor: '#efefef', flex: 1 }}>
        <View>
          <Text style={[styles.titleText, { marginTop: 15 }]}>계정</Text>
          <CardView
            cardElevation={1}
            cardMaxElevation={1}
            style={styles.card}
            cornerRadius={0}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => this._selectMenu(1)}
              activeOpacity={0.7}>
              <Icon style={{ marginLeft: 15 }} name="lock-outline" size={30} color="#000" />
              <Text style={styles.mainText}>로그아웃</Text>
            </TouchableOpacity>
            <View style={{ height: 1, alignSelf: 'stretch', backgroundColor: '#e5e5e5' }}></View>

            <TouchableOpacity
              style={styles.row}
              onPress={() => this._selectMenu(2)}
              activeOpacity={0.7}>
              <Icon style={{ marginLeft: 15 }} name="account-outline" size={30} color="#000" />
              <Text style={styles.mainText}>회원탈퇴</Text>
            </TouchableOpacity>
            <View style={{ height: 1, alignSelf: 'stretch', backgroundColor: '#e5e5e5' }}></View>

          </CardView>

          <Text style={[styles.titleText, { marginTop: 15 }]}>일반</Text>
          <CardView
            cardElevation={1}
            cardMaxElevation={1}
            style={styles.card}
            cornerRadius={0}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => this._selectMenu(3)}
              activeOpacity={0.7}>
              <Icon style={{ marginLeft: 15 }} name="account-outline" size={30} color="#000" />
              <Text style={styles.mainText}>오픈소스라이선스</Text>
            </TouchableOpacity>
            <View style={{ height: 1, alignSelf: 'stretch', backgroundColor: '#e5e5e5' }}></View>
            <TouchableOpacity
              style={styles.row}
              onPress={() => this._selectMenu(4)}
              activeOpacity={0.7}>
              <Icon style={{ marginLeft: 15 }} name="account-outline" size={30} color="#000" />
              <Text style={styles.mainText}>앱버전</Text>
            </TouchableOpacity>
          </CardView>
        </View>
      </View>
    );
  }
};


const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center'
  },

  card: {
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 8,
    backgroundColor: '#fff'
  },

  mainText: {
    color: '#000',
    fontSize: 20,
    marginLeft: 10,
  },

  titleText: {
    color: '#000',
    fontSize: 16,
    marginLeft: 15,
  }
});