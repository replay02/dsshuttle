import React, { Component } from 'react';
import ReactNative from 'react-native';
import { StyleSheet, TouchableHighlight, View, Alert, Text, Dimensions, TextInput } from 'react-native';
// import { RectButton } from 'react-native-gesture-handler';
import SafeAreaView from "react-native-safe-area-view";
// import ProgressLoader from 'rn-progress-loader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as Progress from 'react-native-progress';
import { sha256 } from '../utils/sha256';  // 패스워드 해시
import DefaultPreference from 'react-native-default-preference';

import CheckBox from 'react-native-check-box'

import CommonConf from '../datas/CommonConf'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;



export default class UserMain extends Component {

    state = {
        navigation: null,
        isLoadingNow: false,
        id: '',
        pw: '',
        checked: false
    };

    static navigationOptions = {
        header: null,
        title: "로그인",
        headerStyle: {
            backgroundColor: '#4baec5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
            color: '#fff'
        },
    };




    // 회원가입 화면 이동
    _goRegister = () => {
        this.props.navigation.navigate('UserRegister')
    }

    // 비밀번호 재설정
    _goResetPwd = () => {
        this.props.navigation.navigate('UserResetPwd')
    }

    _showInputTextErrorMsg = (type) => {
        let msg = '';
        switch (type) {
            case 'id':
                msg = '사번을 확인해 주세요'
                break;
            case 'pw':
                msg = '비밀번호를 확인해 주세요'
                break;
            default:
                break;
        }
        Alert.alert(
            '알림',
            msg,
            [
                {
                    text: '확인'
                },
            ],
        )
    }

    _checkValidInputValues = (id, pw) => {
        if (id && pw) {
        }
        else {  // 비어 있는 입력값 체크
            if (!id) {
                this._showInputTextErrorMsg('id');
                return false;
            }
            if (!pw) {
                this._showInputTextErrorMsg('pw');
                return false;
            }

        }
        return true;
    }

    _doLoginWithToken = (token) => {
        this.setState({
            isLoadingNow: true
        })

        var url = 'http://' + CommonConf.urlHost + ':8080/ss/api/loginWithToken';

        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "login_token": token
            }),
        }).then(response => response.json()).then(json => {
            console.log(json);

            if (json.resCode != 200) {
                Alert.alert(json.resMsg);

                // 로그인 토큰 저장
                DefaultPreference.set(CommonConf.PREF_KEY_LOGIN_TOKEN, "")
                    .then(function () {
                        console.log('login token saved.')
                    })

                this.setState({
                    isLoadingNow: false
                });
            }
            else {
                this.setState({
                    isLoadingNow: false
                });

                if (json.login_token === "") {

                }
                else {
                    // 로그인 토큰 저장
                    DefaultPreference.set(CommonConf.PREF_KEY_LOGIN_TOKEN, json.login_token)
                        .then(function () {
                            console.log('login token saved.')
                        })
                }
                // Alert.alert(json.login_token);
                this.props.navigation.navigate('App')
            }
        }).catch(error => {
            Alert.alert("서버 통신 상태가 원활하지 않습니다. 잠시 후 다시 시도해 주세요.");
            this.setState({
                isLoadingNow: false
            })
        });
    }

    // 로그인 진행
    _doLogin = (id, pw, checked) => {

        let isValid = this._checkValidInputValues(id, pw);

        if (isValid) {
            this.setState({
                isLoadingNow: true
            })

            var url = 'http://' + CommonConf.urlHost + ':8080/ss/api/login';

            fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "id": id,
                    "pw": sha256(id+pw),
                    "auto_login": checked
                }),
            }).then(response => response.json()).then(json => {
                console.log(json);

                if (json.resCode != 200) {
                    Alert.alert(json.resMsg);
                    this.setState({
                        isLoadingNow: false
                    });
                }
                else {
                    this.setState({
                        isLoadingNow: false
                    });

                    if (json.login_token === "") {

                    }
                    else {

                        const _this = this;

                        // 로그인 토큰 저장
                        DefaultPreference.set(CommonConf.PREF_KEY_LOGIN_TOKEN, json.login_token)
                            .then(function () {
                                console.log('login token saved.')

                                // 로그인 유지 설정 값 저장
                                DefaultPreference.set(CommonConf.PREF_KEY_AUTO_LOGIN, checked ? "1" : "0")
                                    .then(function () {
                                        console.log('auto login token saved.')
                                        _this.props.navigation.navigate('App')
                                    })

                            })
                    }
                    // Alert.alert(json.login_token);

                    
                }
            }).catch(error => {
                Alert.alert("서버 통신 상태가 원활하지 않습니다. 잠시 후 다시 시도해 주세요.");
                this.setState({
                    isLoadingNow: false
                })
            });
        }
    }

    secondTextInput;
    scroll;
    _scrollToInput(reactNode) {
        // Add a 'scroll' ref to your ScrollView
        this.scroll.props.scrollToFocusedInput(reactNode)
    }


    _onCheckedAutoLogin(checked) {

        const _this = this;

        if (!checked) {
            Alert.alert('로그인 유지 시, 개인정보 유출에 유의하세요')
        }

        _this.setState({
            checked: !checked
        })
    }

    componentDidMount() {

        const _this = this;

        DefaultPreference.get(CommonConf.PREF_KEY_AUTO_LOGIN).then(function (isCheck) {

            if (isCheck == "1") { // true,false가 아닌 1,0으로 저장 됨

                _this.setState({
                    isCheck: true
                })

                DefaultPreference.get(CommonConf.PREF_KEY_LOGIN_TOKEN).then(function (value) {
                    if (value === "") {
                        // 토근은 없으나 자동로그인은 켜져 있는 경우 (로그아웃 한 경우)
                        DefaultPreference.set(CommonConf.PREF_KEY_AUTO_LOGIN, "0")
                        .then(function () {
                            console.log('auto login off saved.')
                        })
                    }
                    else {
                        // 로그인유지가 켜져 있고 토큰이 있을 때는 토큰을 통한 로그인 시도
                        _this._doLoginWithToken(value);
                    }
                })
            }
        })
    }

    render() {
        const { isLoadingNow, id, pw, checked } = this.state;

        return (
            <SafeAreaView forceInset={{ bottom: 'never', top: 'never' }} style={styles.container}>
                <KeyboardAwareScrollView
                    contentContainerStyle={{
                        // flexGrow: 1,
                        justifyContent: 'center',
                        marginTop: 100,
                        marginBottom: 50
                    }}
                    innerRef={ref => {
                        this.scroll = ref
                    }}
                    keyboardShouldPersistTaps='handled'
                    style={{ backgroundColor: '#4baec5' }}>

                    <TextInput
                        style={{
                            width: width / 3 * 2, height: 50,
                            alignSelf: 'center',
                            borderBottomColor: '#fff',
                            color: '#fff',
                            borderBottomWidth: 0.5
                        }}
                        onFocus={(event) => {
                            // `bind` the function if you're using ES6 classes
                            this._scrollToInput(ReactNative.findNodeHandle(event.target))
                        }}
                        placeholder="8자리 사번을 입력하세요"
                        placeholderTextColor={'#c5c5c5'}
                        maxLength={8}
                        numberOfLines={1}
                        autoFocus={false}
                        keyboardType={'decimal-pad'}
                        onSubmitEditing={() => { this.secondTextInput.focus(); }}
                        onChangeText={(id) => this.setState({ id: id })}
                    />

                    <TextInput
                        style={{
                            width: width / 3 * 2, height: 50,
                            alignSelf: 'center',
                            borderBottomColor: '#fff',
                            color: '#fff',
                            borderBottomWidth: 0.5
                        }}
                        onFocus={(event) => {
                            // `bind` the function if you're using ES6 classes
                            this._scrollToInput(ReactNative.findNodeHandle(event.target))
                        }}
                        placeholder="비밀번호를 입력하세요"
                        placeholderTextColor={'#c5c5c5'}
                        autoCapitalize='none'
                        secureTextEntry={true}
                        ref={(input) => { this.secondTextInput = input; }}
                        numberOfLines={1}
                        onChangeText={(pw) => this.setState({ pw: pw })}
                    />
                    <View style={{ marginRight: width / 6, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row', marginTop: 5 }}>
                        <CheckBox
                            isChecked={checked}
                            onClick={() => this._onCheckedAutoLogin(checked)}
                        />
                        <Text style={{ fontSize: 14, color: 'white' }}>로그인 유지</Text>
                    </View>

                    <View style={{ alignSelf: 'center', marginTop: 15, marginBottom: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{
                            alignSelf: 'center',
                            alignItems: 'center',
                            fontSize: 14,
                            color: '#fff',
                        }}>비밀번호를 잊으셨나요?</Text>


                        <TouchableHighlight
                            style={styles.buttonStyle}
                            onPress={() => this._goResetPwd()}
                            underlayColor='#ffffff55'>
                            <Text style={[styles.registerText]}>비밀번호 재설정</Text>
                        </TouchableHighlight>
                    </View>

                    <TouchableHighlight
                        style={styles.button}
                        onPress={() => this._doLogin(id, pw, checked)}
                        underlayColor='#ffffff55'>
                        <Text style={styles.buttonText}>로그인</Text>
                    </TouchableHighlight>

                    <View style={{ alignSelf: 'center', marginTop: 30, marginBottom: 50, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{
                            alignSelf: 'center',
                            alignItems: 'center',
                            fontSize: 14,
                            color: '#fff',
                        }}>아직 회원가입 전이세요?</Text>


                        <TouchableHighlight
                            style={styles.buttonStyle}
                            onPress={() => this._goRegister()}
                            underlayColor='#ffffff55'>
                            <Text style={[styles.registerText]}>회원가입</Text>
                        </TouchableHighlight>
                    </View>



                </KeyboardAwareScrollView>
                {isLoadingNow ?
                    <View style={{
                        backgroundColor: '#000000bb', width: 60, height: 60, borderRadius: 15,
                        borderWidth: 0, flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center',
                        borderColor: '#fff', position: 'absolute',
                    }}>
                        <Progress.Circle thickness={8} style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }} size={30} indeterminate={true} />
                    </View>
                    :
                    null}
            </SafeAreaView>
        );
    }

}

const styles = StyleSheet.create({

    buttonStyle: {
        marginLeft: 20,

    },

    container: {
        flex: 1,
        justifyContent: 'center',
    },
    registerText: {
        alignSelf: 'center',
        alignItems: 'center',
        fontSize: 14,

        color: '#fff',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 3
    },
    button: {
        marginRight: 20,
        marginLeft: 20,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'transparent',
        borderRadius: 0,
        borderWidth: 2,
        height: 50,
        width: 100,
        borderColor: '#fff'
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});