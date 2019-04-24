import React, { Component } from 'react';
import ReactNative from 'react-native';
import { StyleSheet, TouchableHighlight, Animated, View, Alert, Text, Dimensions, TextInput } from 'react-native';
// import { RectButton } from 'react-native-gesture-handler';
import SafeAreaView from "react-native-safe-area-view";

import * as Progress from 'react-native-progress';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CommonConf from '../datas/CommonConf'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;



export default class UserResetPwd extends Component {

    state = {
        navigation: null,
        id: '',
        email: '',
        isLoadingNow: false,
    };

    static navigationOptions = {
        // header: null,
        title: "비밀번호 재설정",
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

    _showInputTextErrorMsg = (type) => {
        let msg = '';
        switch (type) {
            case 'id':
                msg = '사번을 확인해 주세요'
                break;
            case 'email':
                msg = '이메일을 확인해 주세요'
                break;
            case 'invalidEmail':
                msg = '이메일 주소가 유효하지 않습니다. 다시 입력해주세요'
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

    _checkValidInputValues = (id, email) => {
        let regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
        if (id && email) {

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
            if (!email) {
                this._showInputTextErrorMsg('email');
                return false;
            }
        }
        return true;
    }

    // 비밀번호 재설정 진행
    _doResetPwd = () => {

        const { id, email } = this.state;

        let isValid = this._checkValidInputValues(id, email);

        if (isValid) {
            var url = 'http://' + CommonConf.urlHost + ':8080/ss/api/resetPwd';

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
                        '비밀번호 재설정',
                        '비밀번호 재설정이 완료되었습니다. 이메일 주소로 전달 된 임시 비밀번호로 로그인 해 주세요',
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
                        placeholder="8자리 사번"
                        placeholderTextColor={'#c5c5c5'}
                        autoCapitalize='none'
                        secureTextEntry={false}
                        ref={(input) => { this.secondTextInput = input; }}
                        onSubmitEditing={() => { this.thirdTextInput.focus(); }}
                        numberOfLines={1}
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
                        placeholder="가입된 이메일주소 입력"
                        placeholderTextColor={'#c5c5c5'}
                        autoCapitalize='none'
                        ref={(input) => { this.fourthTextInput = input; }}
                        secureTextEntry={false}
                        numberOfLines={1}
                        onChangeText={(email) => this.setState({ email: email })}
                    />

                    <TouchableHighlight
                        style={styles.button}
                        onPress={() => this._doResetPwd()}
                        underlayColor='#ffffff55'>
                        <Text style={styles.buttonText}>비밀번호 재설정</Text>
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