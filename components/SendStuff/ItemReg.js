//운반 물품 등록 화면
import React, { Component } from 'react';
import { StyleSheet, Button,View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import CheckboxForm from 'react-native-checkbox-form';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import User from 'react-native-vector-icons/FontAwesome';
import Truck from 'react-native-vector-icons/Feather'

import CommonConf  from '../Datas/CommonConf';

const itemType = [
    {
        label: '노트북',
        value: 'one',
        RNchecked: false
    },
    {
        label: 'PC',
        value: 'two',
        RNchecked: false
    },
    {
        label: '모니터',
        value: 'three',
        RNchecked: false
    },
    {
        label: '비품',
        value: 'four',
        RNchecked: false
    },
    {
        label: '기타',
        value: 'five',
        RNchecked: false
    }
];

export default class ItemReg extends Component {
    state = {
        navigation: null
        , data: this.props.navigation.state.params.data
        , location: this.props.navigation.state.params.location,
        toToken : '',
        isChecked: false,
        name:'',
        phone:''
    };

    static navigationOptions = {

        title: "운반 물품 등록",
        headerStyle: {

            backgroundColor: '#4baec5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
            color: '#fff'
        },
    }

    componentDidMount() {
        this.setState({
        });
    }

    _onSelect = (item) => {
        console.log(item);
    };

    _checkUser = () => {
        const {name,phone} = this.state;
        
        if(name == '' || phone == '') {
            Alert.alert("이름과 전화번호를 확인해주세요");
            return;
        }

        var url = 'http://' + CommonConf.urlHost + ':8080/ss/api/checkPushUser/';
        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "name": name,
                "phone": phone
            }),
        }).then(response => response.json()).then(json => {
            console.log(json);
    
            if (json.resCode != 200) {
                Alert.alert(json.resMsg);
                // this.setState({
                //     isLoadingNow: false
                // });
            }
            else {
                this.setState({
                    toToken: json.resData,
                    isChecked : true
                });
                Alert.alert("정상 확인 되었습니다");
                // Alert.alert(json.login_token);
            }
        }).catch(error => {
            Alert.alert("서버 통신 상태가 원활하지 않습니다. 잠시 후 다시 시도해 주세요.");
            // this.setState({
            //     isLoadingNow: false
            // })
        });
    }

    _onRegClicked = () => {

        if(!this.state.isChecked) {
            Alert.alert("수신자의 이름과 전화번호를 먼저 확인해주세요");
            return;
        }
        var url = 'http://' + CommonConf.urlHost + ':8080/ss/api/register/';
        // let token = 'epHnI1L2T18:APA91bGGA7xuyCBgsi0ORjnVRKgH8Sl4nYOB0jmTHaS0NgEYGl_1rThL9Ie9RwGP4GIWabQxACCYSffB9Nu8iVAjekqNWGgEATLhwL_q5kHWYuAIGIck_EI2LVJSryWml4Ig_xL_4sht';

        url = url + this.state.toToken;

        console.log(url);

        fetch(url).then(response => response.json())
            .then(json => {
                console.log(json);

                if (json.resCode == 200) {
                    Alert.alert(json.resMsg)
                }
            }).catch(err => Alert.alert(err));
    }

    render() {
        const { data, location } = this.state;

        return (
            <View style={styles.container}>
                <View style={styles.headerView}>
                    <Icon style={{ justifyContent: 'center', alignItems: 'center' }}
                        name="package-variant-closed"
                        size={24}
                        color="#333" />
                    <Text style={styles.headerText}>물품 종류</Text>
                </View>

                <View style={styles.checkBox}>
                    <CheckboxForm
                        dataSource={itemType}
                        itemShowKey="label"
                        itemCheckedKey="RNchecked"
                        iconSize={20}
                        formHorizontal={true}
                        lableHorizontal={true}
                        onChecked={(item) => this._onSelect(item)}
                        textStyle={{ fontSize: 15, color: '#282828', justifyContent: 'center', alignItems: 'center' }}
                    />
                </View>

                <View style={styles.headerView}>
                    <View style={styles.headerView}>
                        <User style={{ justifyContent: 'center', alignItems: 'center' }}
                            name="user"
                            size={24}
                            color="#333" />
                        <Text style={styles.headerText}>수신자 정보</Text>
                    </View>

                    <Button
                        style={{marginLeft: 15}}
                        onPress={this._checkUser}
                        title="수신자 정보 체크(필수)"
                        color="#418cff"
                        accessibilityLabel="이름 확인"
                        />
                </View>
                

                <View style={{ backgroundColor: '#dcdcdc', paddingTop: 10, paddingBottom: 0, marginLeft: 15, marginRight: 15, borderRadius: 5 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, paddingRight: 10, marginLeft: 10, marginRight: 10 }}>
                        <Text style={{ fontSize: 15, color: '#282828', marginLeft: 10 }}>이름</Text>
                        <TextInput 
                        style={{ borderColor: '#aaa', borderWidth: 1, width: '60%', height: 35, borderRadius: 5, padding: 5, backgroundColor: 'white' }} 
                        onChangeText={(name) => this.setState({ name: name })}
                        editable={!this.state.isChecked}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, paddingRight: 10, marginLeft: 10, marginRight: 10 }}>
                        <Text style={{ fontSize: 15, color: '#282828', marginLeft: 10 }}>핸드폰 번호</Text>
                        <TextInput 
                        style={{ borderColor: '#aaa', borderWidth: 1, width: '60%', height: 35, borderRadius: 5, padding: 5, backgroundColor: 'white' }} 
                        onChangeText={(phone) => this.setState({ phone: phone })}
                        editable={!this.state.isChecked}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10, paddingRight: 10, marginLeft: 10, marginRight: 10 }}>
                        <Text style={{ fontSize: 15, color: '#282828', marginLeft: 10 }}>전달 메시지</Text>
                        <TextInput style={{ borderColor: '#aaa', borderWidth: 1, width: '60%', height: 70, borderRadius: 5, padding: 5, backgroundColor: 'white' }} multiline numberOfLines={5} />
                    </View>
                </View>

                <View style={styles.headerView}>
                    <Truck style={{ justifyContent: 'center', alignItems: 'center' }}
                        name="truck"
                        size={24}
                        color="#333" />
                    <Text style={styles.headerText}>발신 정보</Text>
                </View>

                <View style={{ backgroundColor: '#dcdcdc', paddingTop: 10, paddingBottom: 0, marginLeft: 15, marginRight: 15, borderRadius: 5 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, paddingRight: 10, marginLeft: 10, marginRight: 80 }}>
                        <Text style={{ fontSize: 15, color: '#282828', marginLeft: 10 }}>예정 시각</Text>
                        <TextInput style={{ borderColor: '#aaa', borderWidth: 1, color: 'black', width: '50%', height: 35, borderRadius: 5, padding: 5, backgroundColor: 'white' }} value={data}
                            editable={false} textAlign='center' />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, paddingRight: 10, marginLeft: 10, marginRight: 80 }}>
                        <Text style={{ fontSize: 15, color: '#282828', marginLeft: 10 }}>발송지</Text>
                        <TextInput style={{ borderColor: '#aaa', borderWidth: 1, color: 'black', width: '50%', height: 35, borderRadius: 5, padding: 5, backgroundColor: 'white' }} value={location}
                            editable={false} textAlign='center' />
                    </View>
                </View>

                <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginTop: 20 }}>
                    <TouchableOpacity style={styles.button}
                        activeOpacity={0.7}
                        onPress={() => this._onRegClicked()}>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 15, padding: 5, color: 'white' }}>등록</Text>
                    </TouchableOpacity>

                    <Text style={{ color: 'red', fontWeight: 'bold', marginTop: 20 }}>* 등록 시 수신자에게 해당 정보에 대한 Push알림이 발송됩니다.</Text>
                </View>
            </View> //마지막 view
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1
    },
    headerView: {
        alignItems: 'center',
        marginLeft: 10,
        flexDirection: 'row',
        height: 40,
        marginTop: 10
    },
    headerText: {
        marginLeft: 5,
        color: 'black',
        textAlignVertical: "center",
        fontSize: 15,
        textAlign: 'left'
    },
    checkBox: {
        flexDirection: 'row',
        backgroundColor: '#dcdcdc',
        justifyContent: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 5
    },
    button: {
        backgroundColor: '#4baec5',
        borderRadius: 5,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 50,
        paddingRight: 50
    }
});