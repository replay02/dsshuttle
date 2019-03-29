import React, { Component } from 'react';
import { StyleSheet, View, YellowBox } from 'react-native';
import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';




export default class BigShuttleMap extends Component {
    _mapView;

    _callOut;

    constructor(props) {
        super(props);

        this._markers = [];

        console.log('BigShuttleMap constructor : ' + props.data.name);
    }

    state = {
        data: {},
        station: [],
        region: {
            latitude: 37.335887,
            longitude: 127.094063,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
        }
    };

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
        this.state.region = {
            latitude: nextProps.data.lat * 1,
            longitude: nextProps.data.lng * 1,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    componentDidMount() {
        // console.log('eeeeeeeeeeee')

        // this._markers.forEach(function (item, index, array) {
        //     console.log(item, index);
        //     if (this.state.data.name == item.title) {
        //         item.showCallout();
        //         return false;
        //     }
        // });
    }

    _onRegionChange = (region) => {
        // this.setState({ region });
    }
    _setLocationList = () => {
        this._mapView.animateToRegion(this.state.region, 1000)
    }


    render() {

        // map에 warning 뜨는 버그 있음 업데이트 될때까지 유지
        YellowBox.ignoreWarnings(['UIManager.getViewManagerConfig']);

        const { region, data, station } = this.state;
        return (
            <View style={styles.container}>
                {/* <StatusBar translucent={true} backgroundColor={'transparent'}></StatusBar> */}
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
                    // coordinate={{
                    //     latitude: 37.335887, 
                    //     longitude: 127.094063
                    // }}
                    onMapReady={() =>
                        this._setLocationList()
                    }>

                    {station.map((marker, i) => (
                        <MapView.Marker
                            ref={marker => (this._markers[i]= marker)}
                            key={i}
                            coordinate={marker.coordinates}
                            title={marker.title}
                            // onPress={(data) => {
                            //     var coord = data.nativeEvent.coordinate;
                            //     // coord.latitude += 0.006;
                            //     this._mapView.animateToRegion({ latitude: coord.latitude, longitude: coord.longitude, latitudeDelta: 0.015, longitudeDelta: 0.012 }, 1);
                            //  }}
                        />
                    ))}
                </MapView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // justifyContent: 'center',
        alignItems: 'center'
    },
    buttonStyle: {
        // justifyContent: 'center',
        // alignItems: 'center',
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
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#eee'
    },
    calloutText: {
        paddingBottom: 5,
        color: '#888',
        textAlign: 'center',
    },

    calloutText2: {
        paddingTop: 5,
        paddingBottom: 5,
        color: '#888',
        textAlign: 'center',
    },
    calloutTitle: {

        paddingBottom: 5,
        color: '#000',
        textAlign: 'center',
    },

    calloutText3: {
        color: '#888',
        textAlign: 'center',
    }
});