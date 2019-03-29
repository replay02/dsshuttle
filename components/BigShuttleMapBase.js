import React from 'react'
import { Text, View, Dimensions, Image, Animated, Alert, TouchableOpacity, PanResponder, Platform } from 'react-native'
import SafeAreaView from "react-native-safe-area-view";
import SlidingUpPanel from 'rn-sliding-up-panel'
import BigShuttleMap from './BigShuttleMap';
// import Carousel from 'react-native-snap-carousel';

const { height, width } = Dimensions.get('window')
const pannelBottom = height / 3;


export default class BigShuttleMapBase extends React.Component {

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
            },
            // headerLeft: (
            //     <TouchableOpacity
            //         onPress={() => props.navigation.navigate('TabStack')}
            //         style={{
            //             left: Dimensions.get("window").height < 667 ? '8%' : '3%',
            //             backgroundColor: 'transparent', width: '100%'
            //         }}>
            //         <Image style={{ width: 40, height: 40 }} color={'#ffffff'} source={require('../assets/back_icon.png')} />
            //     </TouchableOpacity>
            // ),
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
    }

    _draggedValue = new Animated.Value(pannelBottom)
    // _headerAlphaValue = new Animated.Value(pannelBottom)
    // _bodyAlphaValue = new Animated.Value(pannelBottom)

    _panel;
    _swipeUpDown;
    _list;
    _carousel;

    // componentWillMount() {
    //     this._animatedValue = new Animated.ValueXY();
    //     this._value = { x: 0, y: 0 };

    //     this._animatedValue.addListener((value) => this._value = value);

    //     this._panResponder = PanResponder.create({
    //         onMoveShouldSetResponderCapture: () => true,
    //         //movement 캡쳐를 허락한다.

    //         onMoveShouldSetPanResponderCapture: () => true,
    //         //dragging 를 허락한다.
    //         // 위의 두가지 ShouldSet ~~를 해줘야 PanResponder.panhandler가 드래그와 무브를 캡쳐할 수 있다.

    //         onPanResponderGrant: (e, gestureState) => {
    //             this._animatedValue.setOffset({ x: this._value.x, y: this._value.y });
    //             this._animatedValue.setValue({ x: 0, y: 0 });
    //             console.log('Grant!!!!! ');

    //         },
    //         // PanResponderGrant 는 제스쳐가 생겨날때(panhandler에 제스쳐가 생겨날때) 한번 불린다.

    //         onPanResponderMove: Animated.event([
    //             null, { dx: this._animatedValue.x, dy: this._animatedValue.y }
    //         ]),
    //         //movig 제스쳐가 발생할때(Panhandler가 움직일때) 불린다. 드래그시 계속적으로 move 를 트래킹한다.
    //         onPanResponderRelease: () => {
    //             console.log('Release!!!!! ');
    //             this._animatedValue.flattenOffset();
    //         }
    //         // 제스쳐가 사라질때 발생한다.(Panhandler 에서 제스쳐가 사라질때)
    //     });
    // }


    componentDidMount() {
        console.log("height : " + height);
        this.setState({
            data: this.props.navigation.state.params.data,
            station: this.props.navigation.state.params.station
        });
    }


    componentWillReceiveProps(nextProps) {

    }

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

        const { station, data } = this.state;

        return (
            <SafeAreaView forceInset={{ bottom: 'never' }} style={{ flex: 1, backgroundColor: '#fff' }}
            >
                <BigShuttleMap station={station} data={data}></BigShuttleMap>

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
                    // {...this._panResponder.panhandlers}
                    >

                        {/* <Animated.View style={[styles.favoriteIcon, { transform }]}>
                            <TouchableOpacity
                                style={{ alignItems: 'center', width: 48, height: 48, justifyContent: 'center' }}
                                delayPressIn={0}
                                // delayPressOut={100}
                                onPressIn={this._handleOnPress}>
                                <Image
                                    source={require('../assets/drag-handle.png')}
                                    style={{ width: 50, height: 50, alignSelf: 'center' }}
                                />
                            </TouchableOpacity>
                        </Animated.View> */}

                        <Animated.View style={[styles.panelHeader, { opacity: headerValue }]}>


                            <Text style={{ color: 'black' }}>작은 컨텐츠를 보여줘</Text>


                        </Animated.View>

                        <Animated.View style={[styles.container, { opacity: bodyValue }]}>

                            <Text style={{ color: 'black' }}>큰 컨텐츠를 보여줘</Text>
                            {/* <Carousel
                                ref={(c) => { this._carousel = c; }}
                                data={station}
                                renderItem={this._renderItem}
                                sliderWidth={width}
                                // lockScrollWhileSnapping={true}
                                itemWidth={width - 100}
                            /> */}
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

