import React, { Component } from 'react';
import { StyleSheet, View, YellowBox, Alert, Platform, TouchableOpacity, Linking, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import Permissions from 'react-native-permissions'
import AndroidOpenSettings from 'react-native-android-open-settings'
import DefaultPreference from 'react-native-default-preference';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';

import CardView from 'react-native-cardview';


import routeIncheon from '../datas/RouteDatasIncheon'
import routeJamsil from '../datas/RouteDatasJamsil'
import routeMokdong from '../datas/RouteDatasMokdong'
import routeSindorim from '../datas/RouteDatasSindorim'
import routeSadang from '../datas/RouteDatasSadang'

/* delta값은 zoom 레벨과 관련 있음.. 아래 설명은 stackoverflow 발췌
1. The map is sized according to the width and height specified in the styles and/or calculated by react-native.
2. The map computes two values, longitudeDelta/width and latitudeDelta/height, compares those 2 computed values, and takes the larger of the two.
3. The map is zoomed according to the value chosen in step 2 and the other value is ignored.
- If the chosen value is longitudeDelta, then the left edge is longitude - longitudeDelta and the right edge is longitude + longitudeDelta. The top and bottom are whatever values are needed to fill the height without stretching the map.
- If the chosen value is latitudeDelta, then the bottom edge is latitude - latitudeDelta and the top edge is latitude + latitudeDelta. The left and right are whatever values are needed to fill the width without stretching the map. 
*/
const LATITUDE_DELTA = 1.1;
const LONGITUDE_DELTA = 0.0421;

let WATCH_ID = 0;

export default class BigShuttleMap extends Component {
    _mapView;
    _callOut;

    constructor(props) {
        super(props);
        this._markers = [];

        this.state = {
            isGetMyLocation: false,
            data: {},
            station: [],
            routeData: [],
            region: {
                latitude: 37.335887,
                longitude: 127.094063,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            },
            clickMethod: null,
            selectedRegion: {},
            clearId : null
        };
    }

    componentWillReceiveProps(nextProps) {
        var tmp = [];
        for (d of nextProps.station) {
            tmp.push({
                title: d.name,
                coordinates: {
                    latitude: d.lat * 1,
                    longitude: d.lng * 1
                }
            })
        }
        this.state.station = tmp;
        this.state.data = nextProps.data;
        this.state.selectedRegion = {
            latitude: nextProps.data.lat * 1,
            longitude: nextProps.data.lng * 1,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        };

        this.state.clickMethod = nextProps.clickMethod;
        // this.state.region = (region => ({
        //     ...region,
        //     latitude: nextProps.data.lat * 1,
        //     longitude: nextProps.data.lng * 1,
        // }));

        if (nextProps.selectedKey == 'incheon') {
            this.state.routeData = routeIncheon;
        }
        else if (nextProps.selectedKey == 'jamsil') {
            this.state.routeData = routeJamsil;
        }
        else if (nextProps.selectedKey == 'mokdong') {
            this.state.routeData = routeMokdong;
        }
        else if (nextProps.selectedKey == 'sindorim') {
            this.state.routeData = routeSindorim;
        }
        else if (nextProps.selectedKey == 'sadang') {  // sadang
            this.state.routeData = routeSadang;
        }
        else {
            this.state.routeData = [];
        }
    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    // }

    componentDidMount() {
        // this._alertForPhotosPermission();
        Permissions.check('location').then(response => {
            // Returns once the user has chosen to 'allow' or to 'not allow' access      
            // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'      
            if (response != 'authorized') {
                // this._alertForPhotosPermission();
                this._requestPermission();
            }
            else {
                // this.setState({ locationPermission: response })

                // 현재 위치 가져오기
                WATCH_ID = navigator.geolocation.watchPosition((position) => {
                    let region = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA
                    }
                    this.state.region = region;
                    this.setState({
                        isGetMyLocation: true,
                        locationPermission: response
                    });
                }, (error) => console.log(error));
            }
        })


    }

    // yhkim 확인 필요
    componentWillUnmount() {

        clearTimeout(this.state.clearId) ;

        // if(WATCH_ID != 0) {
        //     navigator.geolocation.clearWatch(WATCH_ID);
        // }
    }


    _requestPermission = () => {
        Permissions.request('location').then(response => {
            // authorized =>  승인 됨
            // denied => 거부 됨
            // restricted => ios : 앱을 사용하는 동안, android : 다시 보지 않음 누르고 거부
            // undetermined => 아직 선택하지 않음

            if (Platform.OS === 'android') {
                if (response == 'restricted') {

                    DefaultPreference.get('isSetLocationDisAgree').then(function (value) {
                        if (value == 'true') {

                        }
                        else {
                            Alert.alert(
                                '위치 권한 동의',
                                '위치 권한에 동의 하지 않으시면 현재 위치 관련된 기능을 사용하실 수 없습니다.\n\n다시 동의 하시려면 \'설정하러 가기\'를 누르신 후 \'권한\'메뉴에서 위치 권한에 동의해주세요.',
                                [
                                    {
                                        text: '다시 보지 않기',
                                        onPress: () => DefaultPreference.set('isSetLocationDisAgree', 'true').then(function () { console.log('done') }),
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
                else if (response == 'authorized') {

                }
                else if (response == 'denied') {

                }
                else { // undetermined

                }
            }
            else {
                if (response == 'restricted') {

                }
                else if (response == 'authorized') {

                }
                else if (response == 'denied') {
                    Alert.alert(
                        '위치 권한 동의',
                        '위치 권한에 동의 하지 않으시면 현재 위치 관련된 기능을 사용하실 수 없습니다.',
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
        })
    }

    // _alertForPhotosPermission() {
    //     Alert.alert(
    //         '위치 권한에 동의',
    //         '현재 위치에 접근에 동의 하십니까?',
    //         [
    //             {
    //                 text: '취소',
    //                 onPress: () => console.log('Permission denied'),
    //                 style: 'cancel',
    //             },
    //             this.state.locationPermission == 'undetermined'
    //                 ? { text: '확인', onPress: this._requestPermission }
    //                 : { text: '설정하러 가기', onPress: Permissions.openSettings },
    //         ],
    //     )
    // }

    _linkAppSettings = () => {
        Linking.canOpenURL('app-settings:').then(supported => {
            if (!supported) {
                console.log('Can\'t handle settings url');
            } else {
                return Linking.openURL('app-settings:');
            }
        }).catch(err => console.error('An error occurred', err));
    }

    _moveSelectedLocation = () => {

        const { data, station } = this.state;
        const _this = this;
        this._mapView.animateToRegion(this.state.selectedRegion, 1000);

        this._markers.map(function (item, index, array) {
            if (station[index].title == data.name) {
                var clearId = setTimeout(function () {
                    item.showCallout();
                }, 1000);
                _this.setState({ clearId: clearId});
            }
        });
    }

    _calloutClick = (title) => {
        
    }


    _moveToMyLocation = () => {
        // Alert.alert('내위치 선택')
        this._mapView.animateToRegion(this.state.region, 1000)
        // this._setLocationList();
    }

    render() {
        // map에 warning 뜨는 버그 있음 업데이트 될때까지 유지
        YellowBox.ignoreWarnings(['UIManager.getViewManagerConfig']);

        const { station, routeData, isGetMyLocation, clickMethod } = this.state;
        return (
            <View style={styles.container}>
                <MapView
                    provider={PROVIDER_DEFAULT}
                    style={styles.map}
                    showsMyLocationButton={true}
                    zoomControlEnabled={true}
                    showsScale={true}
                    showsUserLocation={true}

                    ref={(mapView) => {
                        this._mapView = mapView;
                    }}
                    onMapReady={() =>
                        this._moveSelectedLocation()
                    }
                >

                    {station.map((marker, i) => (
                        <MapView.Marker
                            ref={(marker) => { this._markers[i] = marker }}
                            key={i}
                            coordinate={marker.coordinates}
                            title={marker.title}>

                            {/* <FontAwesomeIcon style={{ justifyContent: 'center',alignSelf:'center', alignItems: 'center' }} name="map-marker" size={35} color="#888">
                                <Text style={{ justifyContent:'center',alignSelf:'center', alignItems: 'center',  fontWeight:'bold', fontSize:10, color:'white' }}>{i}</Text>
                            </FontAwesomeIcon> */}

                            <MapView.Callout
                                tooltip={true}
                                style={styles.calloutBack}
                                onPress={() => clickMethod(marker.title)}
                            >
                                <Text style={styles.calloutText} >
                                    {marker.title}
                                </Text>
                                
                            </MapView.Callout>
                        </MapView.Marker>
                    ))}
                    <MapView.Polyline
                        coordinates={routeData}
                        strokeWidth={5}
                        strokeColor="#4baec5" />
                </MapView>

                {/* 내위치 버튼 */}
                <CardView
                    cardElevation={5}
                    cardMaxElevation={5}
                    style={styles.locatinBtn}
                    cornerRadius={5}>
                    {isGetMyLocation ?
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={this._moveToMyLocation}>
                            <Icon style={{ justifyContent: 'center', alignItems: 'center' }} name="my-location" size={24} color="#418cff" />
                        </TouchableOpacity>
                        :
                        <Icon style={{ justifyContent: 'center', alignItems: 'center' }} name="my-location" size={24} color="#888" />
                    }
                </CardView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'row-reverse'
    },
    buttonStyle: {
        height: 50,
        marginTop: 10
    },

    map: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
    },

    spinnerText: {
        fontSize: 15,
        flexWrap: 'wrap',
        color: '#000'
    },

    loadingView: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: '#fff',
    },

    calloutBack: {
        flex: 0.8,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#eee'
    },
    calloutText: {
        color: '#888',
        textAlign: 'center',
    },
    locatinBtn: {
        width: 34,
        height: 34,
        padding: 5,
        margin: 10,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        position: 'absolute',
    },
});