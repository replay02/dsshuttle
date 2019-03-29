import React, { Component } from 'react';
import { StyleSheet, Easing, TouchableHighlight, Animated, View, Alert, Text, Dimensions } from 'react-native';
// import { RectButton } from 'react-native-gesture-handler';
import SafeAreaView from "react-native-safe-area-view";


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


const menuTitles = ['사송', '셔틀', '게시판', '기사님 정보', '기타']

export default class ShuttleMain extends Component {

    state = {
        navigation: null,
        animatedStartValue: new Animated.Value(0)
    };

    // scale = {
    //     transform: [
    //         {
    //             scale: animatedStartValue.interpolate({
    //                 inputRange: [0, 1],
    //                 outputRange: [initialScale, 1]
    //             })
    //         }
    //     ]
    // };

    // position = {
    //     transform: [
    //         {
    //             translateX: animatedStartValue.interpolate({
    //                 inputRange: [0, 1],
    //                 outputRange: [startX - (width / 2) - (width * initialScale / 2), endX]
    //             })
    //         },
    //         {
    //             translateY: animatedStartValue.interpolate({
    //                 inputRange: [0, 1],
    //                 outputRange: [startY - (height / 2) - (height * initialScale / 2), endY]
    //             })
    //         }
    //     ]
    // };


    componentDidMount() {
        this.bootAnimation();
    }

    bootAnimation = () => {
        // Animated.sequence([
        //     Animated.timing(this.state.animatedStartValue, {
        //         toValue: new Animated.Value(30),
        //         duration: 2000,
        //         easing: Easing.ease
        //     }),
        //     Animated.timing(this.state.animatedStartValue, {
        //         toValue: new Animated.Value(-30),
        //         duration: 2000,
        //         // delay: 2000,
        //         easing: Easing.ease
        //     })
        // ]).start(event => {
        //     if (event.finished) {
        //         this.bootAnimation();
        //     }
        // });


        Animated.timing(this.state.animatedStartValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.ease
        }).start();
    }

    // 사송
    _goSmallShuttle = () => {
        Alert.alert(menuTitles[0]);
    }
    // 셔틀 
    _goBigShuttle = () => {
        this.props.navigation.navigate('BigShuttleMain')
        // , navigation={this.props.navigation}
    }
    // 게시판
    _goCommonNotice = () => {
        Alert.alert(menuTitles[2]);
    }

    // 기사님정보
    _goDriverInfo = () => {
        Alert.alert(menuTitles[3]);
    }

    // 기타
    _goEtc = () => {
        Alert.alert(menuTitles[4]);
    }

    render() {
        return (
            <SafeAreaView forceInset={{ bottom: 'always', top: 'always' }} style={styles.container}>
                {/* <Animated.View style={this.position}> */}
                <Animated.Image source={require('../assets/rainy.jpg')}
                    blurRadius={2}
                    style={[styles.image, { opacity: this.state.animatedStartValue }]} />
                {/* </Animated.View> */}

                <Text style={styles.mainText}>우리들의 버스 제발 잘 돌아가라~</Text>

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
            </SafeAreaView>
        );
    }

}

const styles = StyleSheet.create({

    buttonStyle: {
        // justifyContent: 'center',
        // alignItems: 'center',
        flex: 1,
        height: 50,
        marginTop: 10
    },

    container: {
        flex: 1,
        // backgroundColor: 'white',


    },
    mainText: {
        alignSelf: 'center',
        height: 100,
        alignItems: 'center',
        fontSize: 20,
        marginTop: 100,
        color: '#fff',
        fontWeight: 'bold',

        // backgroundColor: '#ccc'
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