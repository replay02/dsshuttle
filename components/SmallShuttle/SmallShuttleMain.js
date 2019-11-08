import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, FlatList, Alert, Platform, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types'
import SafeAreaView from "react-native-safe-area-view";
import CardView from 'react-native-cardview';
import SlidingUpPanel from 'rn-sliding-up-panel'
import moment from 'moment-timezone';
import 'moment/locale/ko';
import RNCalendarEvents from 'react-native-calendar-events';
import AndroidOpenSettings from 'react-native-android-open-settings'

const Tab1 = 'bundangToBangbae'
const Tab2 = 'bangbaeToBundang'

const shuttleTimes = {
    bundang: [
        {
            title: '정보가져오는중',
            isAvailable: false
        }
        // {
        //     title: '10:00',
        //     isAvailable: false
        // },
        // {
        //     title: '11:00',
        //     isAvailable: false
        // },
        // {
        //     title: '13:00',
        //     isAvailable: false
        // },
        // {
        //     title: '14:00',
        //     isAvailable: false
        // },
        // {
        //     title: '15:00',
        //     isAvailable: false
        // },
        // {
        //     title: '16:00',
        //     isAvailable: false
        // },
        // {
        //     title: '17:00',
        //     isAvailable: false
        // },
    ],
    bangbae: [
        {
            title: '정보가져오는중',
            isAvailable: false
        }
        // {
        //     title: '10:00',
        //     isAvailable: false
        // },
        // {
        //     title: '11:00',
        //     isAvailable: false
        // },
        // {
        //     title: '13:00',
        //     isAvailable: false
        // },
        // {
        //     title: '14:00',
        //     isAvailable: false
        // },
        // {
        //     title: '15:00',
        //     isAvailable: false
        // },
        // {
        //     title: '16:00',
        //     isAvailable: false
        // },
        // {
        //     title: '17:00',
        //     isAvailable: false
        // },
    ]
}

export default class SmallShuttleMain extends Component {
    _panel;
    static defaultProps = {
        draggableRange: {
            top: 270,  // + tab height : 50
            bottom: 0
        },
        type: Tab1
    }

    static navigationOptions = {
        title: "사송 메인",
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

    state = {
        _clickedIndex: 0,
        refreshing: false,
        shuttleTimes: shuttleTimes
    }


    _getShuttleTimes = (isRefresh) => {
        var url = 'http://' + CommonConf.urlHost + ':8088/ss/api/getSasongList';
        fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => response.json()).then(json => {
            console.log(json);

            if (json.resCode == 200) {  // 정상
                this.setState({
                    shuttleTimes: json.resData
                })
            }
            else {
                Alert.alert(json.resMsg);
            }
            
            if(isRefresh) {
                this.setState({
                    refreshing: false
                })
            }

        }).catch(error => {
            Alert.alert(error.toString());

            if(isRefresh) {
                this.setState({
                    refreshing: false
                })
            }
        });
    }

    componentWillReceiveProps(nextProps) {
    }

    componentDidMount() {
        this._getShuttleTimes(false);
    }


    
   

    //운반물품 등록 dy
    _goItemReg = (data,location) => {

        this._panel.hide();
        this.props.navigation.navigate('ItemReg', {data:data,location:location}) 
    }

    //운반물품 조회 dy
     _goItemList = (timeData,location) => {

        this._panel.hide();
        this.props.navigation.navigate('ItemList',{timeData:timeData,location:location})
    }

    _onMenuClicked = (index) => {
        this._panel.hide();
        Alert.alert('_onMenuClicked' + index);
    }

    _onLeftButtonclicked = (index) => {

        this.setState({
            _clickedIndex: index
        })
        this._panel.show();
    }

    _linkAppSettings = () => {
        Linking.canOpenURL('app-settings:').then(supported => {
            if (!supported) {
                console.log('Can\'t handle settings url');
            } else {
                return Linking.openURL('app-settings:');
            }
        }).catch(err => console.error('An error occurred', err));
    }


    _requestPermission = (index) => {

        RNCalendarEvents.authorizeEventStore().then(response => {
            // authorized =>  승인 됨
            // denied => 거부 됨
            // restricted => ios : 앱을 사용하는 동안, android : 다시 보지 않음 누르고 거부
            // undetermined => 아직 선택하지 않음
            if (Platform.OS === 'android') {
                if (response == 'restricted') {
                    DefaultPreference.get('isSetCalendarDisAgree').then(function (value) {
                        if (value == 'true') {
                            // 다시 보지 않기까지 선택하여 거부한 상태
                        }
                        else {
                            Alert.alert(
                                '캘린더 사용 동의',
                                '캘린더 권한에 동의 하지 않으시면 10분전 알람 기능을 사용하실 수 없습니다.\n\n다시 동의 하시려면 \'설정하러 가기\'를 누르신 후 \'권한\'메뉴에서 위치 권한에 동의해주세요.',
                                [
                                    {
                                        text: '다시 보지 않기',
                                        onPress: () => DefaultPreference.set('isSetCalendarDisAgree', 'true').then(function () { console.log('done') }),
                                        style: 'cancel',
                                    },
                                    {
                                        text: '설정하러 가기',
                                        onPress: () => AndroidOpenSettings.appDetailsSettings(),
                                    },
                                ],
                            )
                        }
                    })
                }
                else if (response == 'authorized') {  // 승인한 경우
                    this._onRightButtonclicked(index)
                }
                else if (response == 'denied') {  // 거부한 경우
                    Alert.alert(
                        '캘린더 사용 동의',
                        '캘린더 권한에 동의 하지 않으시면 10분전 알람 기능을 사용하실 수 없습니다.',
                        [
                            {
                                text: '확인',
                            },
                        ],
                    )
                }
                else { // undetermined

                }
            }
            else {
                if (response == 'restricted') {
                    this._onRightButtonclicked(index)
                }
                else if (response == 'authorized') {
                    this._onRightButtonclicked(index)
                }
                else if (response == 'denied') {
                    Alert.alert(
                        '캘린더 사용 동의',
                        '캘린더 권한에 동의 하지 않으시면 10분전 알람 기능을 사용하실 수 없습니다.',
                        [
                            {
                                text: '확인',
                            },

                            {
                                text: '설정하러 가기',
                                onPress: () => this._linkAppSettings()
                            },
                        ],
                    )
                }
                else { // undetermined

                }

            }

            this.setState({ calendarPermission: response })
        })
    }


    // 알람 버튼 선택 시 권한 체크 후 권한에 따라 캘린더에 알람 등록
    _onRightButtonclicked = (index) => {

        RNCalendarEvents.authorizationStatus().then(response => {
            if (response != 'authorized') {
                this._requestPermission(index);
            }
            else {
                // 현재 시간의 한국 시간 보정
                var timezoneOffset = new Date().getTimezoneOffset() * 60000;
                var timestamp = new Date(Date.now() + timezoneOffset);

                var start = moment(timestamp).tz('Asia/Seoul');
                var end = moment(timestamp).tz('Asia/Seoul');
                var alarm = moment(timestamp).tz('Asia/Seoul');

                switch (index) {
                    case 0:  // 09:00
                        start.set('hour', 8)
                        end.set('hour', 9)
                        alarm.set('hour', 8)

                        break;
                    case 1:  // 10:00
                        start.set('hour', 9)
                        end.set('hour', 10)
                        alarm.set('hour', 9)
                        break;
                    case 2:  // 11:00
                        start.set('hour', 10)
                        end.set('hour', 11)
                        alarm.set('hour', 10)
                        break;
                    case 3:  // 13:00
                        start.set('hour', 12)
                        end.set('hour', 13)
                        alarm.set('hour', 12)
                        break;
                    case 4:  // 14:00
                        start.set('hour', 13)
                        end.set('hour', 14)
                        alarm.set('hour', 13)
                        break;
                    case 5:  // 15:00
                        start.set('hour', 14)
                        end.set('hour', 15)
                        alarm.set('hour', 14)
                        break;
                    case 6:  // 16:00
                        start.set('hour', 15)
                        end.set('hour', 16)
                        alarm.set('hour', 15)
                        break;
                    case 7:  // 17:00
                        start.set('hour', 16)
                        end.set('hour', 17)
                        alarm.set('hour', 16)
                        break;
                    default:
                        break;
                }
                start.set('minute', 55)
                start.set('second', 0)
                start.set('millisecond', 0)

                end.set('minute', 0)
                end.set('second', 0)
                end.set('millisecond', 0)

                alarm.set('minute', 50)
                alarm.set('second', 0)
                alarm.set('millisecond', 0)

                let alarmMin;

                if (Platform.OS === 'android') {
                    alarmMin = 5;
                }
                else {  // ios
                    alarmMin = alarm.toISOString();
                }

                RNCalendarEvents.saveEvent('KT DS 사송 10분 전 예약', {
                    startDate: start.toISOString(), // '2019-04-08T16:32:00.000Z'의 형태
                    endDate: end.toISOString(),
                    alarms:
                        [{
                            date: alarmMin
                        }]
                })

                Alert.alert(
                    '알림',
                    '캘린더에 저장되었습니다.'
                )
            }
        }).catch(function (err) {
            Alert.alert('err : ' + err);
        })
    }

    // 현재 시간 대비 지나간 시간대는 사용하지 못하도록 하기 위함
    _isPassedTime(index) {
        let retVal = false;

        let t1;
        let t2 = moment();

        switch (index) {
            case 0:  // 09:00
                t1 = moment('09:00', 'HH:mm')
                break;
            case 1:  // 10:00
                t1 = moment('10:00', 'HH:mm')
                break;
            case 2:  // 11:00
                t1 = moment('11:00', 'HH:mm')
                break;
            case 3:  // 13:00
                t1 = moment('13:00', 'HH:mm')
                break;
            case 4:  // 14:00
                t1 = moment('14:00', 'HH:mm')
                break;
            case 5:  // 15:00
                t1 = moment('15:00', 'HH:mm')
                break;
            case 6:  // 16:00
                t1 = moment('16:00', 'HH:mm')
                break;
            case 7:  // 17:00
                t1 = moment('17:00', 'HH:mm')
                break;
            default:
                break;
        }
        if (t2.format('HH:mm') > t1.format('HH:mm'))
            retVal = true;

        // return retVal;
        return false;
    }

    _renderItem = (item, index, isTab2) => {

        const isPassed = this._isPassedTime(index);
        let color = '#fff';  
        if (isPassed) {
            color = '#bbb'
        }

        return (
            <CardView
                cardElevation={2}
                cardMaxElevation={2}
                style={[styles.row, { backgroundColor: color }]}
                cornerRadius={3}>
                {(!item.isAvailable || isPassed)?
                    <TouchableOpacity
                        style={styles.leftButtonStyle}
                        activeOpacity={0.7}>
                        <Icon style={{ justifyContent: 'center', alignItems: 'center' }} name="lead-pencil" size={28} color="#5e5e5e" />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                        style={styles.leftButtonStyle}
                        activeOpacity={0.7}
                        onPress={() => this._onLeftButtonclicked(index)}>
                        <Icon style={{ justifyContent: 'center', alignItems: 'center' }} name="lead-pencil" size={28} color="#4baec5" />
                    </TouchableOpacity>
                }

                {!item.isAvailable?
                    <Text style={[styles.centerSubTextStyle, { color: '#5e5e5e' }]}>
                        {item.title==="정보가져오는중"?item.title:item.title + ' 운행안함'}
                    </Text>
                    :
                    <Text style={styles.centerTextStyle}>
                        {item.title + ' 출발'}
                    </Text>
                }

                {(!item.isAvailable || isPassed) ?
                    <TouchableOpacity
                        style={styles.rightButtonStyle}
                        activeOpacity={0.7}>
                        <Icon style={{ justifyContent: 'center', alignItems: 'center' }} name="alarm" size={28} color="#5e5e5e" />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                        style={styles.rightButtonStyle}
                        activeOpacity={0.7}
                        onPress={() => this._onRightButtonclicked(index)}>
                        <Icon style={{ justifyContent: 'center', alignItems: 'center' }} name="alarm" size={28} color="#4baec5" />
                    </TouchableOpacity>
                }
            </CardView>
        )
    }


    _onRefresh = () => {

        let _this = this;
        this.setState({
            shuttleTimes : shuttleTimes
        });

        setTimeout(function () {
            _this._getShuttleTimes(true);
        }, 1000);
    }

    render() {
        const { _clickedIndex, refreshing, shuttleTimes } = this.state;
        const { type } = this.props;

        let isTab2 = false;
        if (type == Tab2) {
            isTab2 = true;
        }

        return (
            <View style={styles.container}>
                <FlatList
                    refreshing={refreshing}
                    onRefresh={this._onRefresh}
                    style={{ flex: 1 }}
                    keyExtractor={(item, index) => 'key' + index}
                    data={isTab2 ? shuttleTimes.bangbae : shuttleTimes.bundang}
                    renderItem={({ item, index }) =>
                        this._renderItem(item, index, isTab2)
                    }
                />
                {/* 운반물품 보내기, 조회, 탑승자 정보 작성 등 노출되는 하단 메뉴 */}
                <SlidingUpPanel
                    allowDragging={false}
                    showBackdrop={true}
                    allowMomentum={true}
                    // minimumDistanceThreshold={0.5}
                    minimumVelocityThreshold={0.01}
                    friction={0.5}
                    ref={c => (this._panel = c)}
                    // onDragEnd={(value) => this._setVisible(value)}   
                    // style={{ position: 'relative' }}
                    draggableRange={this.props.draggableRange}
                >
                    <SafeAreaView forceInset={{ bottom: 'always' }} style={[styles.container]}>
                        <View style={{ backgroundColor: '#fff', justifyContent: 'flex-start' }}>
                            <Text style={{
                                marginLeft: 20,
                                color: '#333',
                                marginTop: 10,
                                textAlignVertical: 'top',
                                fontSize: 12,
                                height: 15,
                                textAlign: 'left'
                            }}>
                                {isTab2 ? shuttleTimes.bangbae[_clickedIndex].title : shuttleTimes.bundang[_clickedIndex].title}
                            </Text>

                            <TouchableOpacity style={{ alignItems: 'center', marginLeft: 30, flexDirection: 'row', height: 40, marginTop: 10 }}
                                activeOpacity={0.3}
                                onPress={() => this._goItemReg(isTab2 ? shuttleTimes.bangbae[_clickedIndex].title : shuttleTimes.bundang[_clickedIndex].title , isTab2? "방배->분당" : "분당->방배")}>
                                <Icon style={{
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                    name="cube-send"
                                    size={24}
                                    color="#333" />
                                <Text style={{
                                    marginLeft: 5,
                                    color: 'black',
                                    textAlignVertical: "center",
                                    fontSize: 14,
                                    textAlign: 'left'
                                }}>운반물품 보내기</Text>
                            </TouchableOpacity>


                            <TouchableOpacity style={{ alignItems: 'center', marginLeft: 30, flexDirection: 'row', height: 40, marginTop: 10 }}
                                activeOpacity={0.3}
                                onPress={() => this._goItemList(isTab2 ? shuttleTimes.bangbae[_clickedIndex].title : shuttleTimes.bundang[_clickedIndex].title , isTab2? "방배->분당" : "분당->방배")}>
                                <Icon style={{
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                    name="feature-search"
                                    size={24}
                                    color="#333" />
                                <Text style={{
                                    marginLeft: 5,
                                    color: 'black',
                                    textAlignVertical: "center",
                                    fontSize: 14,
                                    textAlign: 'left'
                                }}>운반물품 조회</Text>
                            </TouchableOpacity>

                            {/* <TouchableOpacity style={{ alignItems: 'center', marginLeft: 30, flexDirection: 'row', height: 40, marginTop: 10 }}
                                activeOpacity={0.3}
                                onPress={() => this._onMenuClicked(2)}>
                                <Icon style={{
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                    name="lead-pencil"
                                    size={24}
                                    color="#333" />
                                <Text style={{
                                    marginLeft: 5,
                                    color: 'black',
                                    textAlignVertical: "center",
                                    fontSize: 14,
                                    textAlign: 'left'
                                }}>탑승자정보 작성</Text>
                            </TouchableOpacity> */}
                        </View>
                    </SafeAreaView>
                </SlidingUpPanel>
            </View>
        );
    }
}

// prop의 타입 정의
SmallShuttleMain.propTypes = {
    draggableRange: PropTypes.object,
    type: PropTypes.oneOf([Tab1, Tab2])
}


const styles = StyleSheet.create({
    rightButtonStyle: {
        height: 50,
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },

    leftButtonStyle: {
        height: 50,
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },

    centerTextStyle: {
        color: 'black',
        flex: 1,
        textAlign: 'center',
        textAlignVertical: "center",
        fontWeight: 'bold',
        fontSize: 20,
    },

    centerSubTextStyle: {
        color: '#5e5e5e',
        flex: 1,
        textAlign: 'center',
        textAlignVertical: "center",
        fontWeight: 'bold',
        fontSize: 20,
    },
    row: {
        flex: 1,
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 3,
        marginBottom: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',

    },

    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'flex-start'

    },

});