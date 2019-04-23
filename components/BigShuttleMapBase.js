import React from 'react'
import { Text, View, Dimensions, Image, Animated, Alert, TouchableOpacity, PanResponder, Platform } from 'react-native'
import SafeAreaView from "react-native-safe-area-view";
import SlidingUpPanel from 'rn-sliding-up-panel'
import BigShuttleMap from './BigShuttleMap';
// import Carousel from 'react-native-snap-carousel';

const { height } = Dimensions.get('window')
const pannelBottom = height / 3;

export default class BigShuttleMapBase extends React.Component {

    _panel;
    _swipeUpDown;
    _list;
    _carousel;

    static navigationOptions = function (props) {
        return {
            title: "셔틀버스 지도",
            headerStyle: {
                // display: "none"
                backgroundColor: '#4baec5',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
                color: '#fff'
            }
        }
    };

    static defaultProps = {
        draggableRange: {
            top: height / 1.75,
            bottom: pannelBottom
        }
    }

    state = {
        data: this.props.navigation.state.params.data,
        station: this.props.navigation.state.params.station,
        selectedKey: this.props.navigation.state.params.selectedKey,
        title: this.props.navigation.state.params.data.name
    }

    _draggedValue = new Animated.Value(pannelBottom);


    componentDidMount() {
        console.log("height : " + height);
        this.setState({
            data: this.props.navigation.state.params.data,
            station: this.props.navigation.state.params.station
        });
    }

    // componentWillReceiveProps(nextProps) {
    // }

    _renderItem({ item, index }) {
        return (
            <View style={{ backgroundColor: '#418cff', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>{item.name}</Text>
            </View>
        );
    }

    _handleOnPress = () => {
        this._panel.show();
    }

    _setVisible = (value) => {
        const { top } = this.props.draggableRange
        if (value >= ((top) / 2) + pannelBottom / 2) {
            this._panel.show()
        }
        else {
            this._panel.hide()
        }
    }

    _clickMethod = (title) => {
        this.setState({
            title: title
        })
    }

    render() {
        const { top, bottom } = this.props.draggableRange

        var draggedValue = this._draggedValue.interpolate({
            inputRange: [bottom, top],
            outputRange: [0.9, 1],
            // extrapolate: 'clamp'
        })


        var headerValue = draggedValue.interpolate({
            inputRange: [0.9, 1],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        })


        var bodyValue = draggedValue.interpolate({
            inputRange: [0.9, 1],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        })

        const { station, data, selectedKey, title } = this.state;

        return (
            <SafeAreaView forceInset={{ bottom: 'never' }} style={{ flex: 1, backgroundColor: '#fff' }}
            >
                <BigShuttleMap selectedKey={selectedKey} station={station} data={data} clickMethod={this._clickMethod}></BigShuttleMap>

                <SlidingUpPanel
                    allowDragging={true}
                    showBackdrop={true}
                    allowMomentum={true}
                    // minimumDistanceThreshold={0.5}
                    minimumVelocityThreshold={0.01}
                    friction={0.998}
                    ref={c => (this._panel = c)}

                    onDragEnd={(value) => this._setVisible(value)}

                    draggableRange={this.props.draggableRange}
                    animatedValue={this._draggedValue}>

                    <Animated.View
                        style={[styles.panel, styles.elevationLow, { transform: [{ scale: draggedValue }] }]}
                    >
                        <Animated.View style={[styles.panelHeader, { opacity: headerValue }]}>
                            <Text style={{ color: 'black' }}>{title}</Text>
                        </Animated.View>

                        <Animated.View style={[styles.container, { opacity: bodyValue }]}>

                            <Text style={{ color: 'black' }}>큰 컨텐츠를 보여줘</Text>

                        </Animated.View>
                    </Animated.View>
                </SlidingUpPanel>
            </SafeAreaView >
        )
    }
}

const styles = {
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    row: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'flex-start',
        padding: 20
    },
    panel: {
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        flex: 1,
        backgroundColor: '#efefef',
        position: 'relative',

    },
    panelHeader: {
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        height: pannelBottom / 1.75,
        backgroundColor: '#efefef',
        alignItems: 'center',
        justifyContent: 'center',
    },
    favoriteIcon: {
        position: 'absolute',
        top: -24,
        right: 24,
        backgroundColor: '#e5e5e5',
        width: 48,
        height: 48,
        borderRadius: 24,
        zIndex: 1
    },
    elevationLow: {
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    viewPager: {
        flex: 1
    },
    pageStyle: {
        alignItems: 'center',
        padding: 20,
    }
}

