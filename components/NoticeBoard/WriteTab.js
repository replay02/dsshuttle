import React, { Component } from 'react';
import ReactNative from 'react-native';
import { View, Text, StyleSheet, TouchableHighlight, Alert } from 'react-native';
import MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
import { TextInput } from 'react-native-gesture-handler';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SafeAreaView from "react-native-safe-area-view";
import CommonConf from '../Datas/CommonConf'

export default class WriteTab extends Component {

    state = {
        writer: '',
        password: '',
        content: '',
        //date: ''
    };

    static navigationOptions = {
        tabBarIcon: ({ tintColor }) => (
            <MaterialCommunityIcons style={{ color: tintColor }} name= 'lead-pencil' size={30}/>
        )
    }


    //글등록
    _goAddBtn = () => {

        const { writer, password, content } = this.state;

        var url = 'http://' + CommonConf.urlHost + ':8080/ss/api/boardcontents';
        console.log("kny_posturl", url);

        
        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "writer": writer,
                "password": password,
                "content": content,
            }),
        }).then(res => res.json()).catch(err => {
            Alert.alert(err);
        }).then(json => {
            console.log("kny_insert_json:", json);

            if(json.resCode == 200) { //정상

                Alert.alert(
                    '등록 완료',
                    '새글이 정상적으로 등록되었습니다.',
                    [
                        {
                            text: '확인',
                            onPress: () => this.props.navigation.goBack(),
                        },
                    ],
                    { cancelable : false }
                )
            }
            else {
                Alert.alert(json.resMsg);
            }
        });
    }

    scroll;

    _scrollToInput(reactNode) {
        // Add a 'scroll' ref to your ScrollView
        this.scroll.props.scrollToFocusedInput(reactNode)
    }

    secondTextInput;
    thirdTextInput;

    render() {

        return (
            <SafeAreaView forceInset={{ bottom: 'never', top: 'never' }}>
                <KeyboardAwareScrollView keyboardShouldPersistTaps='handled'
                                         innerRef={ref => {
                                            this.scroll = ref
                                         }}>
                    <View style = {styles.container}>
                    
                        <View style={styles.input}>
                            <Text style={styles.font}>이름</Text>
                            <TextInput style={styles.inputText}
                                    numberOfLines={1}
                                    autoFocus={true}
                                    onFocus={(event) => {
                                        // `bind` the function if you're using ES6 classes
                                        this._scrollToInput(ReactNative.findNodeHandle(event.target))
                                    }}
                                    onSubmitEditing={() => { this.secondTextInput.focus(); }}
                                    //onChangeText={(writer) => this.setState({ writer: writer, date: new Date })}
                                    onChangeText={(writer) => this.setState({ writer: writer })}
                            />
                        </View>
                        <View style={styles.input}>
                            <Text style={styles.font}>비밀번호</Text>
                            <TextInput style={styles.inputText} 
                                    secureTextEntry
                                    numberOfLines={1}
                                    maxLength={10}
                                    onFocus={(event) => {
                                        this._scrollToInput(ReactNative.findNodeHandle(event.target))
                                    }}
                                    ref={(input) => { this.secondTextInput = input; }}
                                    onSubmitEditing={() => { this.thirdTextInput.focus(); }}
                                    onChangeText={(password) => this.setState({ password: password})}/>
                        </View>

                        <View style={styles.body}>
                            <View style={styles.input}>
                                <Text style={styles.font}>내용</Text>
                                
                                <View style={styles.saveView}>
                                    <TouchableHighlight onPress={() => this._goAddBtn()} >
                                        <MaterialCommunityIcons style={styles.addBtn} name= 'content-save-edit' size={25}/>
                                    </TouchableHighlight>
                                    <TouchableHighlight onPress={() => this._goAddBtn()} >
                                        <Text style = {{color:'#0652DD'}}>저장</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>

                            <TextInput style = {styles.bodyText} 
                                    placeholder='내용을 입력하세요.' 
                                    autoCorrect={false} 
                                    multiline numberOfLines={10}
                                    onFocus={(event) => {
                                        // `bind` the function if you're using ES6 classes
                                        this._scrollToInput(ReactNative.findNodeHandle(event.target))
                                    }}
                                    ref={(input) => { this.thirdTextInput = input; }}
                                    onChangeText={(content) => this.setState({ content: content})}/>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40,
        marginLeft: 20,
        marginRight: 20,
    },

    input: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 10,
    },

    inputText: {
        borderColor: '#aaa', 
        width: '70%', 
        height: 30, 
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
    },

    body: {
        paddingTop: 20,
    },

    bodyText: {
        borderColor: '#aaa',
        width: '100%',
        height: '70%',
        borderWidth: 1,
        borderRadius: 5,
        paddingBottom: 10,

    },

    addBtn: {
        color: '#0652DD'
    },

    font: {
        fontSize: 15,
        fontWeight:'900',
    },

    saveView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 5,
    },


});