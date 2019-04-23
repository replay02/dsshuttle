import React, { Component } from 'react';
import ReactNative from 'react-native';
import { StyleSheet, ScrollView, TouchableHighlight, Animated, View, Alert, Text, Dimensions, TextInput } from 'react-native';
// import { RectButton } from 'react-native-gesture-handler';
import SafeAreaView from "react-native-safe-area-view";

import * as Progress from 'react-native-progress';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { sha256 } from '../utils/sha256';  // 패스워드 해시

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const urlHost = '192.168.43.66';

export default class UserRegister extends Component {

    state = {
        navigation: null,
        id: '',
        pw: '',
        pw2: '',
        email: '',
        isLoadingNow: false,
        isNotDuplId: false
    };

    static navigationOptions = {
        // header: null,
        title: "사용자 등록",
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


    }

    _doCheckDupl = () => {
        const { id } = this.state;

        if (id) {
            var url = 'http://' + urlHost + ':8080/ss/api/checkUserDupl';
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
                    "id": id
                }),
            }).then(response => response.json()).catch(error => {
                Alert.alert(error);
                this.setState({
                    isLoadingNow: false
                })
            }).then(json => {
                console.log(json);

                this.setState({
                    isLoadingNow: false
                })

                if (json.resCode == 200) {  // 정상
                    this.setState({
                        isNotDuplId: true
                    })

                    Alert.alert(
                        '중복 확인',
                        '사용 할 수 있는 아이디 입니다.',
                        [
                            {
                                text: '확인'
                            },
                        ],
                    )
                }
                else {
                    Alert.alert(json.resMsg);
                }
            });
        }
        else {
            this._showInputTextErrorMsg('id');
        }
    }

    _showInputTextErrorMsg = (type) => {
        let msg = '';
        switch (type) {
            case 'id':
                msg = '사번을 확인해 주세요'
                break;
            case 'pw':
            case 'pw2':
                msg = '비밀번호를 확인해 주세요'
                break;
            case 'email':
                msg = '이메일을 확인해 주세요'
                break;
            case 'diffPw':
                msg = '비밀번호 입력값이 다릅니다'
                break;
            case 'invalidEmail':
                msg = '이메일 주소가 유효하지 않습니다. 다시 입력해주세요'
                break;
            case 'notCheckDupl':
                msg = '사번 중복체크를 해 주세요'
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

    _checkValidInputValues = (id, pw, pw2, email, isNotDuplId) => {
        let regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
        if (!isNotDuplId) {  // 
            this._showInputTextErrorMsg('notCheckDupl');
            return false;
        }
        else {
            if (id && pw && pw2 && email) {
                if (pw != pw2) {  // 패스워드 같은지 체크
                    this._showInputTextErrorMsg('diffPw');
                    return false;
                }

                if (email.match(regExp) == null) {  //이메일 정규식 체크 
                    this._showInputTextErrorMsg('invalidEmail');
                    return false;
                }

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
                if (!pw2) {
                    this._showInputTextErrorMsg('pw2');
                    return false;
                }
                if (!email) {
                    this._showInputTextErrorMsg('email');
                    return false;
                }
            }
        }
        return true;
    }

    // 회원가입 진행
    _doRegister = () => {

        const { id, pw, pw2, email, isNotDuplId } = this.state;

        let isValid = this._checkValidInputValues(id, pw, pw2, email, isNotDuplId);

        if (isValid) {
            var url = 'http://' + urlHost + ':8080/ss/api/regiUser';

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
                    "id": id,
                    "pw": sha256(pw),
                    "email": email
                }),
            }).then(response => response.json()).catch(error => {
                Alert.alert(error);
                this.setState({
                    isLoadingNow: false
                })
            }).then(json => {
                console.log(json);

                this.setState({
                    isLoadingNow: false
                })

                if (json.resCode == 200) {  // 정상

                    Alert.alert(
                        '회원 가입 신청 완료',
                        '회원 가입이 신청이 완료 되었습니다. 이메일 주소로 전달 된 메일의 링크를 클릭하여 이메일 인증을 완료해 주세요.',
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
            });
        }


    }

    scroll;

    _scrollToInput(reactNode) {
        // Add a 'scroll' ref to your ScrollView
        this.scroll.props.scrollToFocusedInput(reactNode)
    }

    secondTextInput;
    thirdTextInput;
    fourthTextInput;

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
                    <View style={{ alignSelf: 'center', flexDirection: 'row', width: width / 3 * 2, height: 50, }}>
                        <TextInput
                            style={{
                                width: width / 3 * 2 - 80, height: 50,
                                alignSelf: 'flex-start',
                                borderBottomColor: '#fff',
                                color: '#fff',
                                borderBottomWidth: 0.5
                            }}
                            placeholder="8자리 사번"
                            placeholderTextColor={'#c5c5c5'}
                            maxLength={8}
                            numberOfLines={1}
                            autoFocus={true}
                            keyboardType={'decimal-pad'}
                            onFocus={(event) => {
                                // `bind` the function if you're using ES6 classes
                                this._scrollToInput(ReactNative.findNodeHandle(event.target))
                            }}
                            onSubmitEditing={() => { this.secondTextInput.focus(); }}
                            onChangeText={(id) => this.setState({ id: id, isNotDuplId: false })}
                        />
                        <TouchableHighlight
                            style={{
                                width: 70,
                                marginLeft: 10,
                                height: 40,
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                backgroundColor: 'transparent',
                                borderRadius: 0,
                                borderWidth: 1,
                                borderColor: '#fff'
                            }}

                            onPress={() => this._doCheckDupl()}
                            underlayColor='#ffffff55'>
                            <Text style={styles.buttonText}>중복 확인</Text>
                        </TouchableHighlight>
                    </View>
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
                        placeholder="비밀번호"
                        placeholderTextColor={'#c5c5c5'}
                        autoCapitalize='none'
                        secureTextEntry={true}
                        ref={(input) => { this.secondTextInput = input; }}
                        onSubmitEditing={() => { this.thirdTextInput.focus(); }}
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
                        placeholder="비밀번호 재입력"
                        placeholderTextColor={'#c5c5c5'}
                        autoCapitalize='none'
                        secureTextEntry={true}
                        ref={(input) => { this.thirdTextInput = input; }}
                        onSubmitEditing={() => { this.fourthTextInput.focus(); }}
                        numberOfLines={1}
                        onChangeText={(pw2) => this.setState({ pw2: pw2 })}
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
                        placeholder="이메일주소 입력(사외망 주소)"
                        placeholderTextColor={'#c5c5c5'}
                        autoCapitalize='none'
                        ref={(input) => { this.fourthTextInput = input; }}
                        secureTextEntry={false}
                        numberOfLines={1}
                        onChangeText={(email) => this.setState({ email: email })}
                    />

                    <TouchableHighlight
                        style={styles.button}
                        onPress={() => this._doRegister()}
                        underlayColor='#ffffff55'>
                        <Text style={styles.buttonText}>회원가입</Text>
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
        width: 100,
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