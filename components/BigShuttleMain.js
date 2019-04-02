import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, View, Image, Text, FlatList, Alert } from 'react-native';
import BigShuttleContent from './BigShuttleContent';
// const _basePaddingTop = 45;

const shuttleStationDatas = {

    incheon: {
        driver: {
            name: '윤창현',
            phone: '01067557924'
        },
        bus: {
            number: '경기77자3520'
        },
        stations: [{
            name: '간석오거리역 1번출구 버스정류장 앞',
            shortname: '간석오거리역',
            lat: '37.468276',
            lng: '126.708138',
            arriveTime: '6:50'
        },
        {
            name: '부평역1번출구 맞은편 큰사거리 온누리사랑 한의원 앞',
            shortname: '부평역',
            lat: '37.487468',
            lng: '126.724777',
            arriveTime: '7:00'
        },
        {
            name: '송내역 1번출구 통근버스정류장 앞',
            shortname: '송내역',
            lat: '37.487003',
            lng: '126.753020',
            arriveTime: '7:15'
        },

        {
            name: '시흥영업소',
            shortname: '시흥영업소',
            lat: '37.450619',
            lng: '126.802867',
            arriveTime: '7:25'
        },

        {
            name: 'KT 분당 본사',
            shortname: '분당본사',
            lat: '37.358861',
            lng: '127.114978',
            arriveTime: '8:30'
        }]
    },

    jamsil: {
        driver: {
            name: '윤경수',
            phone: '01057011477'
        },
        bus: {
            number: '경기76자3535'
        },
        stations: [{
            name: '창동역1번출구 리젠트 호텔 앞',
            shortname: '창동역',
            lat: '37.468276',
            lng: '126.708138',
            arriveTime: '7:00'
        },
        {
            name: '태릉입구역 3번출구',
            shortname: '태릉입구역',
            lat: '37.487468',
            lng: '126.724777',
            arriveTime: '7:15'
        },
        {
            name: '잠실역6번출구 앞 버스정류장',
            shortname: '잠실역',
            lat: '37.487003',
            lng: '126.753020',
            arriveTime: '7:50'
        },
        {
            name: 'KT 분당 본사',
            shortname: '분당본사',
            lat: '37.358861',
            lng: '127.114978',
            arriveTime: '8:30'
        }]
    },

    mokdong: {
        driver: {
            name: '서민석',
            phone: '01037946037'
        },
        bus: {
            number: '경기76자8624'
        },
        stations: [{
            name: '목동사옥',
            shortname: '목동사옥',
            lat: '37.468276',
            lng: '126.708138',
            arriveTime: '7:10'
        },
        {
            name: '오목교역 2번출구',
            shortname: '오목교역',
            lat: '37.487468',
            lng: '126.724777',
            arriveTime: '7:13'
        },
        {
            name: 'KT 분당 본사',
            shortname: '분당본사',
            lat: '37.358861',
            lng: '127.114978',
            arriveTime: '8:30'
        }]
    },

    sindorim: {
        driver: {
            name: '조용수',
            phone: '01037573861'
        },
        bus: {
            number: '경기76자3534'
        },
        stations: [{
            name: '신도림역',
            shortname: '신도림역',
            lat: '37.468276',
            lng: '126.708138',
            arriveTime: '7:10'
        },
        {
            name: '마포역 3번출구',
            shortname: '마포역',
            lat: '37.487468',
            lng: '126.724777',
            arriveTime: '7:25'
        },
        {
            name: '서울역 14번출구',
            shortname: '서울역',
            lat: '37.487468',
            lng: '126.724777',
            arriveTime: '7:45'
        },
        {
            name: 'KT 분당 본사',
            shortname: '분당본사',
            lat: '37.358861',
            lng: '127.114978',
            arriveTime: '8:40'
        }]
    },

    sadang: {
        driver: {
            name: '관리팀(임시)',
            phone: '01028986339'
        },
        bus: {
            number: '경기76자7022'
        },
        stations: [{
            name: '사당역 6번출구 우리은행',
            shortname: '사당역',
            lat: '37.468276',
            lng: '126.708138',
            arriveTime: '7:40'
        },
        {
            name: 'KT 분당 본사',
            shortname: '분당본사',
            lat: '37.358861',
            lng: '127.114978',
            arriveTime: '8:40'
        }]
    },
}

export default class BigShuttleMain extends Component {

    state = {
        navigation: null,
    };

    static navigationOptions = {

        title: "셔틀버스 목록",
        headerStyle: {
            // display: "none",
            backgroundColor: '#4baec5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
            color: '#fff'
        },



    };

    // componentWillReceiveProps(nextProps) {
    // }

    componentDidMount() {
        this.setState({
        });
    }

    // _findData = (data) => {
    //     console.log('_findData : ' + data.name);
    //     var findData = null;
    //     for (key1 in Object.keys(shuttleStationDatas)) {
    //         // console.log('key2 : ' + shuttleStationDatas[key].stations[0].name);
    //         Object.keys(shuttleStationDatas[key1]).filter((key2) => findData = shuttleStationDatas[key1][key2])
    //         if (findData != null)
    //             break;
    //     }
    //     console.log('findData : ' + findData[0].name);
    //     return findData;
    // }

    _clickMethod = (d, selectedTitle) => {
        console.log('click data : ' + selectedTitle);

        // var d = this._findData(data)
        var station = shuttleStationDatas[selectedTitle].stations;

        Alert.alert(
            '상세 이름',
            d.name,
            [
                { text: '취소', onPress: () => console.log('Cancel Pressed!') },
                {
                    text: '지도로 가기', onPress: () => this.props.navigation.navigate('BigShuttleMapBase',
                        {
                            data: d,
                            station: station
                        })
                }
            ],
            { cancelable: false }
        )
    }


    render() {
        return (
            <ScrollView style={{
                flex: 1
            }}>
                <View style={styles.container}>

                    <BigShuttleContent title={'인천 노선'} selectedTitle={'incheon'} selectedData={shuttleStationDatas.incheon.stations} clickMethod={this._clickMethod}></BigShuttleContent>

                    <BigShuttleContent title={'잠실 노선'} selectedTitle={'jamsil'} selectedData={shuttleStationDatas.jamsil.stations} clickMethod={this._clickMethod}></BigShuttleContent>

                    <BigShuttleContent title={'목동 노선'} selectedTitle={'mokdong'} selectedData={shuttleStationDatas.mokdong.stations} clickMethod={this._clickMethod}></BigShuttleContent>

                    <BigShuttleContent title={'신도림 노선'} selectedTitle={'sindorim'} selectedData={shuttleStationDatas.sindorim.stations} clickMethod={this._clickMethod}></BigShuttleContent>

                    <BigShuttleContent title={'사당 노선'} selectedTitle={'sadang'} selectedData={shuttleStationDatas.sadang.stations} clickMethod={this._clickMethod}></BigShuttleContent>

                </View>
            </ScrollView>


        );
    }
}

const styles = StyleSheet.create({
    buttonStyle: {
        height: 50,
        marginTop: 10
    },

    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'flex-start',
    },
    dragHandler: {
        alignSelf: 'stretch',
        height: 64,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ccc'
    }

});