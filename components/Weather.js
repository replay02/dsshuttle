import React, { Component } from 'react';
import { StyleSheet, Animated, Dimensions, Image } from 'react-native';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

// export default Weather;
// 날씨 정보 array 
const weatherDatas = {
    Dust: {
        title: "Dust",
        subtitles: "It's Dust!",
        uri: require('../assets/dust.jpg'),
    },
    Sand: {
        title: "Sand",
        subtitles: "It's Sand!",
        uri: require('../assets/dust.jpg'),
    },

    Smoke: {
        title: "Smoke",
        subtitles: "It's Smoke!",
        uri: require('../assets/smoke.jpg'),
    },
    Tornado: {
        title: "Tornado",
        subtitles: "It's Tornado!",
        uri: require('../assets/tornado.jpg'),
    },

    Squall: {
        title: "Squall",
        subtitles: "It's Squall!",
        uri: require('../assets/rain.jpg'),
    },
    Rain: {
        title: "Rain",
        subtitles: "It's Rainning!",
        uri: require('../assets/rain.jpg'),
    },
    Clear: {
        title: "Clear",
        subtitles: "It's Clear!",
        uri: require('../assets/sunny.jpg'),
    },
    Thunderstorm: {
        title: "Thunderstorm",
        subtitles: "It's thunderstorm!",
        uri: require('../assets/thunderstorm.jpg'),
    },
    Clouds: {
        title: "Clouds",
        subtitles: "It's Clouds!",
        uri: require('../assets/cloudy.jpg'),
    },

    Snow: {
        title: "Snow",
        subtitles: "It's Snow!",
        uri: require('../assets/snow.jpg'),
    },

    Drizzle: {
        title: "Drizzle",
        subtitles: "It's Drizzle!",
        uri: require('../assets/drizzle.jpg'),
    },
    Haze: {
        title: "Haze",
        subtitles: "It's Haze!",
        uri: require('../assets/fog.jpg'),
    },
    Fog: {
        title: "Fog",
        subtitles: "It's Fog!",
        uri: require('../assets/fog.jpg'),
    },
    Mist: {
        title: "Mist",
        subtitles: "It's Mist!",
        uri: require('../assets/mist.jpg'),
    },
}

export default class Weather extends Component {

    state = {
        nowWeather: this.props.nowWeather,
        scale: new Animated.Value(1.2),
    }

    // onLoad = () => {
    //     Animated.timing(this.state.scale, {
    //         toValue: 1.5,
    //         duration: 5000,
    //         useNativeDriver: true,
    //     }).start();
    // }


    cycleAnimation = () => {
        Animated.sequence([
            Animated.timing(this.state.scale, {
                toValue: 1.3,
                duration: 10000,
                useNativeDriver: true,
            }),
            Animated.timing(this.state.scale, {
                toValue: 1.2,
                duration: 10000,
                useNativeDriver: true,
            })
        ]).start(() => {
            this.cycleAnimation();
        });
    }

    render() {
        const { nowWeather } = this.state
        return (
            <Animated.Image
                source={weatherDatas[nowWeather].uri}
                onLoad={this.cycleAnimation}
                // blurRadius={2}
                style={[
                    styles.image,

                    {
                        // opacity: this.state.opacity,
                        // transform: [
                        //     {
                        //         scale: this.state.opacity.interpolate({
                        //             inputRange: [0.5, 1],
                        //             outputRange: [1.2, 1],
                        //         })
                        //     },
                        // ],

                        transform: [
                            {
                                scale: this.state.scale
                            },
                            {
                                translateX: this.state.scale.interpolate({
                                    inputRange: [1.2, 1.25, 1.3],
                                    outputRange: [-10, 10, -10]
                                })
                            }
                        ],

                    }
                ]} />


            // <LinearGradient
            //     colors={weatherDatas[nowWeather].colors}
            //     style={styles.container}>

            //     <StatusBar translucent={true} backgroundColor={'transparent'}></StatusBar>
            //     <View style={styles.topIconView}>
            //         {/* https://expo.github.io/vector-icons/ */}
            //         <MaterialCommunityIcons color="white" size={144} name={weatherDatas[nowWeather].icon}></MaterialCommunityIcons>
            //         <Text style={styles.temper}>{temp}도</Text>
            //     </View>
            //     <View style={styles.bottomTextView}>
            //         <Text style={styles.bottomText}>{weatherDatas[nowWeather].subtitles}</Text>
            //     </View>
            // </LinearGradient>
        )
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    image: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
        width: null,
        height: null,
        resizeMode: 'cover',
        backgroundColor: 'transparent'
    },
    temper: {
        fontSize: 38,
        flexWrap: 'wrap',
        color: '#eeeeee'
    },
    topIconView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    bottomTextView: {
        flex: 1,
        justifyContent: 'flex-end'
    },

    bottomText: {
        fontSize: 38,
        flexWrap: 'wrap',
        paddingBottom: 100,
        paddingRight: 20,
        marginLeft: 20,
        color: '#fff'
    }
});