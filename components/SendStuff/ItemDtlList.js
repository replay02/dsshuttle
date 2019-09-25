//운반 물품 등록 화면
import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import CheckboxForm from 'react-native-checkbox-form';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import User from 'react-native-vector-icons/FontAwesome';

const itemType = [
    {
        label: '노트북',
        value: 'one',
        RNchecked: true
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

export default class ItemDtlList extends Component {
    state = {
        navigation: null
        , timeData: this.props.navigation.state.params.timeData
    };

    static navigationOptions = {

        title: "운반 물품 상세 조회",
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

    _onReceiveClicked = () => {
      //  Alert.alert("발신자에게 수신완료 Push 알림이 발송되었습니다.");
        
        var url = 'http://172.20.10.6:3000/receive/';  //다영 wifi
        //var url = 'http://192.168.43.20:3000/';  //단말 wifi

        let token = 'cEi40TSrPnw:APA91bGJAL5HGcYFzRtOc_GI4RoPJNlPM5UFZoQW0XpxiEy0_YipVl8-4iNunYEEuv8g_B1zktUeXzjhJRo1qkKc5Q0Qqd7abPNR0bPq8nKlR5SCyz1WdK1nTYmYX3dUGEHyJPQkSqRr';

        url = url + token;

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
        const { timeData } = this.state;

        return (
            <View style={styles.container}>
                <View style={styles.headerView}>
                    <Icon style={{ justifyContent: 'center', alignItems: 'center' }}
                        name="package-variant-closed"
                        size={24}
                        color="#333" />
                    <Text style={styles.headerText}>물품 종류</Text>

                    {/* <Pencil style={{flex:1, justifyContent: 'flex-end', alignItems: 'flex-end' }}
                        name="pencil"
                        size={30}
                        color="#288CD2" /> */}
                </View>

                <View style={styles.checkBox}>
                    <CheckboxForm
                        dataSource={itemType}
                        itemShowKey="label"
                        itemCheckedKey="RNchecked"
                        iconSize={20}
                        formHorizontal={true}
                        lableHorizontal={true}
                        isAvailable={false}
                        //  onChecked={(item) => this._onSelect(item)}
                        textStyle={{ fontSize: 15, color: '#282828', justifyContent: 'center', alignItems: 'center' }}

                    />
                </View>

                <View style={styles.headerView}>
                    <User style={{ justifyContent: 'center', alignItems: 'center' }}
                        name="user"
                        size={24}
                        color="#333" />
                    <Text style={styles.headerText}>발신자 정보</Text>
                </View>

                <View style={{ backgroundColor: '#dcdcdc', paddingTop: 10, paddingBottom: 0, marginLeft: 15, marginRight: 15, borderRadius: 5 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, paddingRight: 10, marginLeft: 10, marginRight: 10 }}>
                        <Text style={{ fontSize: 15, color: '#282828', marginLeft: 10 }}>이름</Text>
                        <TextInput style={{ borderColor: '#aaa', borderWidth: 1, width: '60%', height: 35, borderRadius: 5, padding: 5, backgroundColor: 'white', color: 'black' }}
                            value='신다영' editable={false} textAlign='center' />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10, paddingRight: 10, marginLeft: 10, marginRight: 10 }}>
                        <Text style={{ fontSize: 15, color: '#282828', marginLeft: 10 }}>전달 메시지</Text>
                        <TextInput style={{ borderColor: '#aaa', borderWidth: 1, width: '60%', height: 70, borderRadius: 5, padding: 5, backgroundColor: 'white', color: 'black' }}
                            multiline numberOfLines={5} value='1층으로 내려오세요~~~' editable={false} textAlign='center' />
                    </View>
                </View>

                <View style={styles.headerView}>
                    <User style={{ justifyContent: 'center', alignItems: 'center' }}
                        name="user"
                        size={24}
                        color="#333" />
                    <Text style={styles.headerText}>수신자 정보</Text>
                </View>

                <View style={{ backgroundColor: '#dcdcdc', paddingTop: 10, paddingBottom: 0, marginLeft: 15, marginRight: 15, borderRadius: 5 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, paddingRight: 10, marginLeft: 10, marginRight: 10 }}>
                        <Text style={{ fontSize: 15, color: '#282828', marginLeft: 10 }}>이름</Text>
                        <TextInput style={{ borderColor: '#aaa', borderWidth: 1, width: '60%', height: 35, borderRadius: 5, padding: 5, backgroundColor: 'white' , color: 'black' }}
                            value='김나영' editable={false} textAlign='center' />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, paddingRight: 10, marginLeft: 10, marginRight: 10 }}>
                        <Text style={{ fontSize: 15, color: '#282828', marginLeft: 10 }}>핸드폰 번호</Text>
                        <TextInput style={{ borderColor: '#aaa', borderWidth: 1, width: '60%', height: 35, borderRadius: 5, padding: 5, backgroundColor: 'white' , color: 'black' }}
                            value='010-1234-5678' editable={false} textAlign='center' />
                    </View>
                </View>

                <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginTop: 20 }}>
                    <TouchableOpacity style={styles.button}
                        activeOpacity={0.7}
                        onPress={() => this._onReceiveClicked()}>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 15, padding: 5, color: 'white' }}>수신</Text>
                    </TouchableOpacity>

                    <Text style={{ color: 'red', fontWeight: 'bold', marginTop: 20 }}>* 수신 시 발신자에게 수신완료 Push알림이 발송됩니다.</Text>
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
        marginTop: 20,
        paddingBottom: 10
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