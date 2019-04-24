import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, TouchableHighlight, Animated, View, Alert, Text, Dimensions, Image, Platform } from 'react-native';
// import { RectButton } from 'react-native-gesture-handler';
import SafeAreaView from "react-native-safe-area-view";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Weather from './Weather'
// const width = Dimensions.get('window').width;
// const height = Dimensions.get('window').height;

const API_KEY = "056222ceae9bf6dc96aa6c52a14985c6";
const API_KEY_GEO = "AIzaSyBRZawBb4awd9BNC4EmlSYRRGY5bACLt5E";

const menuTitles = ['사송', '셔틀', '게시판', '기사님 정보', '기타']
const height = Dimensions.get('window').height;
const safearewHeaderHeight = Platform.OS === "android" ? 0 : 44;

export default class ShuttleMain extends Component {

    state = {
        navigation: null,
        animatedStartValue: new Animated.Value(0),
        isLoadingNow: true,
        error: null,
        temp: null,
        myweather: null,
        addr: '',
        icon: null,
        modalVisible: true,
        
    };

    static navigationOptions = {
        header: null,
        title: "메인",
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

        navigator.geolocation.getCurrentPosition(
            position => {
                this._getWeather(position.coords.latitude, position.coords.longitude);
                this._getAddressByLatLng(position.coords.latitude, position.coords.longitude);

            },
            error => {
                this.setState({
                    error: error
                });
            });
    }

    // 사송
    _goSmallShuttle = () => {
        this.props.navigation.navigate('ShuttleTab')
    }
    // 셔틀 
    _goBigShuttle = () => {
        this.props.navigation.navigate('BigShuttleMain')
    }
    // 게시판
    _goCommonNotice = () => {
        Alert.alert(menuTitles[2]);
    }

    // 기사님정보
    _goDriverInfo = () => {
        this.props.navigation.navigate('DriverInfo')
    }

    // 기타
    _goEtc = () => {
        Alert.alert(menuTitles[4]);
    }


    // 날씨 정보 가져오는 API 기본 1분에 60회 가능... 고도화 필요
    _getWeather = (lat, lon) => {
        var url = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&APPID=' + API_KEY;
        console.log(url);

        // Alert.alert(url);

        fetch(url).then(response => response.json())
            .then(json => {
                console.log(json);

                this.setState({
                    temp: json.main.temp,
                    myweather: json.weather[0].main,
                    icon: "http://openweathermap.org/img/w/" + json.weather[0].icon + ".png",
                    isLoadingNow: false,
                })
            });
    };

    _getAddressByLatLng = (lat, lon) => {
        // 과금 정책 향후 1년여간 무료, 네이버는 한달 1000건 이상 유료
        // https://maps.googleapis.com/maps/api/geocode/json?latlng=37.566535,126.977969&language=ko&key=AIzaSyBRZawBb4awd9BNC4EmlSYRRGY5bACLt5E
        var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon + '&language=ko&key=' + API_KEY_GEO;
        console.log(url);

        // Alert.alert(url);

        fetch(url).then(response => response.json())
            .then(json => {

                let jbSplit = json.plus_code.compound_code.split(' ');
                let retVal = '';
                for (let i in jbSplit) {
                    if (i == 0 || i == 1) {
                        continue;
                    }
                    else {
                        retVal += ' ' + jbSplit[i];
                    }
                }

                this.setState({
                    addr: retVal,
                })
            });
    };

    render() {
        const { temp, myweather, isLoadingNow, addr, icon } = this.state;

        return (
            <SafeAreaView forceInset={{ bottom: 'always', top: 'always' }} style={styles.container}>
                {isLoadingNow ?
                    <View
                        style={[
                            styles.image,
                            , { backgroundColor: '#4baec5' }
                        ]} />
                    :
                    <Weather temp={Math.floor(temp - 273.15)} nowWeather={myweather}></Weather>
                }
                <View style={{ alignItems: 'center', alignSelf: 'center', flexDirection: 'row', marginTop: height / 8 }}>

                    <Image style={{ justifyContent: 'center', width: 30, height: 30, }}
                        source={{ uri: icon }}>
                    </Image>

                    <Text style={{ justifyContent: 'center', fontSize: 10 }}>{myweather}</Text>
                </View>


                {isLoadingNow ?
                    <Text style={styles.mainText}>{'-'}℃</Text>
                    :
                    <Text style={styles.mainText}>{Math.floor(temp - 273.15)}℃</Text>}

                <Text style={styles.addr}>{addr ? addr : '-'}</Text>

                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableHighlight
                        style={styles.button}
                        onPress={() => this._goSmallShuttle()}
                        underlayColor='#ffffff55'>
                        <Text style={[styles.buttonText]}>{menuTitles[0]}</Text>
                    </TouchableHighlight>

                    <TouchableHighlight
                        style={styles.button}
                        onPress={() => this._goBigShuttle()}
                        underlayColor='#ffffff55'>
                        <Text style={[styles.buttonText]}>{menuTitles[1]}</Text>
                    </TouchableHighlight>
                </View>

                <View style={{ justifyContent: 'center' }}>
                    <TouchableHighlight
                        style={[styles.commonButton, { borderBottomWidth: 1, borderTopWidth: 2 }]}
                        onPress={() => this._goCommonNotice()}
                        underlayColor='#ffffff55'>
                        <Text style={[styles.buttonText]}>{menuTitles[2]}</Text>
                    </TouchableHighlight>

                    <TouchableHighlight
                        style={[styles.commonButton, { borderBottomWidth: 1, borderTopWidth: 1 }]}
                        onPress={() => this._goDriverInfo()}
                        underlayColor='#ffffff55'>
                        <Text style={[styles.buttonText]}>{menuTitles[3]}</Text>
                    </TouchableHighlight>

                    <TouchableHighlight
                        style={[styles.commonButton, { borderBottomWidth: 2, borderTopWidth: 1 }]}
                        onPress={() => this._goEtc()}
                        underlayColor='#ffffff55'>
                        <Text style={[styles.buttonText]}>{menuTitles[4]}</Text>
                    </TouchableHighlight>

                </View>

                <TouchableOpacity
                    style={styles.settingBtn}
                    onPress={() => this.props.navigation.navigate('SettingMain')}
                    activeOpacity={0.7}>
                    <Icon style={{ justifyContent: 'center', alignItems: 'center' }} name="settings" size={30} color="#fff" />
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

}

const styles = StyleSheet.create({

    buttonStyle: {
        flex: 1,
        height: 50,
        marginTop: 10
    },

    settingBtn: {
        height: 45,
        position: 'absolute',
        width: 45,
        alignItems: 'flex-start',
        alignSelf: 'flex-end',
        marginTop: 15 + safearewHeaderHeight
    },

    container: {
        flex: 1,
    },
    mainText: {
        alignSelf: 'center',
        height: 50,
        alignItems: 'center',
        fontSize: 30,
        marginTop: 10,
        color: '#fff',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 3
    },
    addr: {
        alignSelf: 'flex-end',
        alignItems: 'center',
        fontSize: 15,
        marginBottom: 10,
        marginRight: 20,
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 1
    },
    image: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
        width: null,
        height: null,
        resizeMode: 'cover',
    },

    button: {
        marginRight: 20,
        marginLeft: 20,
        flex: 1,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: 'transparent',
        borderRadius: 0,
        borderWidth: 2,
        height: 70,
        borderColor: '#fff'
    },

    commonButton: {
        marginTop: 0,
        paddingTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
        backgroundColor: 'transparent',
        borderRadius: 0,
        height: 70,
        // borderWidth: 1,
        borderColor: '#fff',
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    }

});