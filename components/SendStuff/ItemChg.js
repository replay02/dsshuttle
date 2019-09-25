//운반 물품 등록 화면
import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import CheckboxForm from 'react-native-checkbox-form';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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

export default class ItemChg extends Component {

    state = {
        navigation: null
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

    _onRegClicked = () => {
        Alert.alert("등록 시 수신자에게 Push 알림이 전송됩니다.");
    }


    render() {

        return (
            <View style={styles.container}>
                <View style={styles.headerView}>
                    <Icon style={{ justifyContent: 'center', alignItems: 'center' }}
                        name="cube-send"
                        size={24}
                        color="#333" />
                    <Text style={styles.headerText}>물품 종류</Text>
                </View>

                <View style={styles.checkBox}>
                    <CheckboxForm
                        style={{}}
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
                    <Icon style={{ justifyContent: 'center', alignItems: 'center' }}
                        name="cube-send"
                        size={24}
                        color="#333" />
                    <Text style={styles.headerText}>수신자 정보</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, paddingRight: 10 , marginLeft:10 , marginRight:10}}>
                    <Text style={{ fontSize: 15, color: '#282828', marginLeft: 10 }}>이름</Text>
                    <TextInput style={{ borderColor: '#aaa', width: '60%', height: 35, borderWidth: 1, borderRadius: 5, padding: 5 }} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, paddingRight: 10, marginLeft:10 , marginRight:10}}>
                    <Text style={{ fontSize: 15, color: '#282828', marginLeft: 10 }}>핸드폰 번호</Text>
                    <TextInput style={{ borderColor: '#aaa', width: '60%', height: 35, borderWidth: 1, borderRadius: 5, padding: 5 }} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, paddingRight: 10 , marginLeft:10, marginRight:10}}>
                    <Text style={{ fontSize: 15, color: '#282828', marginLeft: 10 }}>전달 메시지</Text>
                    <TextInput style={{ borderColor: '#aaa', width: '60%', height: 80, borderWidth: 1, borderRadius: 5, padding: 5 }} multiline numberOfLines={10} />
                </View>


                <View style={styles.headerView}>
                    <Icon style={{ justifyContent: 'center', alignItems: 'center' }}
                        name="cube-send"
                        size={24}
                        color="#333" />
                    <Text style={styles.headerText}>발송 예정 시각</Text>

                    <Text style={{ width: '30%', height: 35, borderRadius: 5, padding: 5, marginLeft: 35, backgroundColor: '#dcdcdc', textAlign: 'center' }}>11:00</Text>

                </View>

                <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginTop: 50 }}>
                    <TouchableOpacity style={styles.button}
                        activeOpacity={0.7}
                        onPress={() => this._onRegClicked()}>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>수정</Text>
                    </TouchableOpacity>

                    <Text style={{ color: 'red', fontWeight: 'bold', marginTop: 10 }}>* 수정 시 수신자에게 해당 정보에 대한 Push알림이 전송됩니다.</Text>
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
        marginTop: 30
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
    content: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10
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