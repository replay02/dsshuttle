import React, { Component } from 'react';
import ReactNative from 'react-native';
import { StyleSheet, TouchableHighlight, Animated, View, Alert, Text, Dimensions, TextInput } from 'react-native';
// import { RectButton } from 'react-native-gesture-handler';
import SafeAreaView from "react-native-safe-area-view";

import * as Progress from 'react-native-progress';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CommonConf from '../Datas/CommonConf'
import DefaultPreference from 'react-native-default-preference';
import { sha256 } from '../Utils/sha256';  // 패스워드 해시

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


export default class UserChangePwd extends Component {

    state = {
        navigation: null,
        id: '',
        originPw: '',
        pw: '',
        pw2: '',
        isLoadingNow: false,
        loginToken: ''
    };

    static navigationOptions = {
        // header: null,
        title: "비밀번호 변경",
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
        const _this = this;
        DefaultPreference.get(CommonConf.PREF_KEY_LOGIN_TOKEN).then(function (value) {
            if (value === "") {

            }
            else {
                _this.setState({
                    loginToken: value
                })

                _this._getMyInfo();
            }
        })
    }

    // 토큰만 가지고 있기 때문에 id(사번) 정보를 받아오기 위함
    _getMyInfo = () => {

        const { loginToken } = this.state;

        var url = 'http://' + CommonConf.urlHost + ':8088/ss/api/myInfo';

        this.setState({
            isLoadingNow: true
        })

        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "login_token": loginToken
            }),
        }).then(response => response.json()).catch(error => {
            this.setState({
                isLoadingNow: false
            })

            Alert.alert(
                '통신 오류',
                err,
                [
                    {
                        text: '확인',
                        onPress: () => this.props.navigation.goBack(),
                    },
                ],
                { cancelable: false }
            )

        }).then(json => {
            console.log(json);

            // Alert.alert(JSON.stringify());

            if (json.resCode == 200) {  // 정상

                this.setState({
                    isLoadingNow: false,
                    id: json.resData.id
                })
            }
            else {
                this.setState({
                    isLoadingNow: false
                })
                Alert.alert(
                    '통신 오류',
                    json.resMsg,
                    [
                        {
                            text: '확인',
                            onPress: () => this.props.navigation.goBack(),
                        },
                    ],
                    { cancelable: false }
                )
            }
        });
    }

    _showInputTextErrorMsg = (type) => {
        let msg = '';
        switch (type) {
            case 'originPw':
                msg = '기존 비밀번호를 확인해 주세요'
                break;
            case 'pw':
            case 'pw2':
                msg = '새 비밀번호를 확인해 주세요'
                break;
            case 'diffPw':
                msg = '새 비밀번호 입력값이 다릅니다'
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

    _checkValidInputValues = (originPw, pw, pw2) => {
        if (originPw && pw && pw2) {
            if (pw != pw2) {  // 패스워드 같은지 체크
                this._showInputTextErrorMsg('diffPw');
                return false;
            }
        }
        else {  // 비어 있는 입력값 체크
            if (!originPw) {
                this._showInputTextErrorMsg('originPw');
                return false;
            }
            if (!pw) {
                this._showInputTextErrorMsg('pw');
                return false;
            }
            if (!pw2) {
                this._showInputTextErrorMsg('pw2');
                return false;
            }
        }
        return true;
    }

    // 비밀번호 변경 진행
    _doChangePwd = () => {

        const { loginToken, originPw, pw, pw2 } = this.state;

        let isValid = this._checkValidInputValues(originPw, pw, pw2);

        if(isValid) {
            var url = 'http://' + CommonConf.urlHost + ':8088/ss/api/changePwd';

            this.setState({
                isLoadingNow: true
            })
    
            fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "login_token": loginToken,
                    "originPw": sha256(this.state.id + originPw),
                    "pw": sha256(this.state.id + pw)
                }),
            }).then(response => response.json()).then(json => {
                console.log(json);
    
                this.setState({
                    isLoadingNow: false
                })
    
                if (json.resCode == 200) {  // 정상
    
                    Alert.alert(
                        '비밀번호 변경',
                        '비밀번호 변경이 완료되었습니다.',
                        [
                            {
                                text: '확인',
                                onPress: () => this.props.navigation.goBack(),
                            },
                        ],
                        { cancelable: false }
                    )
                }
                else {
                    Alert.alert(json.resMsg);
                }
            }).catch(error => {
                Alert.alert("서버 통신 상태가 원활하지 않습니다. 잠시 후 다시 시도해 주세요.");
                this.setState({
                    isLoadingNow: false
                })
            });
        }
    }

    scroll;

    _scrollToInput(reactNode) {
        // Add a 'scroll' ref to your ScrollView
        this.scroll.props.scrollToFocusedInput(reactNode)
    }

    secondTextInput;

    render() {
        const { isLoadingNow } = this.state;

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
                            this._scrollToInput(ReactNative.findNodeHandle(event.target))
                        }}
                        placeholder="기존 비밀번호를 입력하세요"
                        placeholderTextColor={'#c5c5c5'}
                        autoCapitalize='none'
                        secureTextEntry={true}
                        ref={(input) => { this.secondTextInput = input; }}
                        numberOfLines={1}
                        onChangeText={(originPw) => this.setState({ originPw: originPw })}
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
                            this._scrollToInput(ReactNative.findNodeHandle(event.target))
                        }}
                        placeholder="새 비밀번호를 입력하세요"
                        placeholderTextColor={'#c5c5c5'}
                        autoCapitalize='none'
                        secureTextEntry={true}
                        ref={(input) => { this.secondTextInput = input; }}
                        numberOfLines={1}
                        onChangeText={(pw) => this.setState({ pw: pw })}
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
                            this._scrollToInput(ReactNative.findNodeHandle(event.target))
                        }}
                        placeholder="새 비밀번호를 한번 더 입력하세요"
                        placeholderTextColor={'#c5c5c5'}
                        autoCapitalize='none'
                        secureTextEntry={true}
                        ref={(input) => { this.secondTextInput = input; }}
                        numberOfLines={1}
                        onChangeText={(pw2) => this.setState({ pw2: pw2 })}
                    />

                    <TouchableHighlight
                        style={styles.button}
                        onPress={() => this._doChangePwd()}
                        underlayColor='#ffffff55'>
                        <Text style={styles.buttonText}>비밀번호 변경</Text>
                    </TouchableHighlight>

                </KeyboardAwareScrollView>
                {isLoadingNow ?
                    <View style={{
                        backgroundColor: '#000000bb', width: 60, height: 60, borderRadius: 15,
                        borderWidth: 0,
                        borderColor: '#fff', position: 'absolute', justifyContent: 'center', alignItems: 'center', alignSelf: 'center'
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
        width: 130,
        borderColor: '#fff'
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    loadingView: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: '#fff',
        ...StyleSheet.absoluteFillObject,
    },
});