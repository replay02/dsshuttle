import React, { Component } from "react";
import {
  StyleSheet,
  Animated,
  Dimensions,
  View,
  Text,
  Platform
} from "react-native";

const width = Dimensions.get("window").width;
// const height = Dimensions.get("window").height;

import { LineChart, XAxis } from "react-native-svg-charts";
import { Circle, G, Text as SVGText } from "react-native-svg";

// import CardView from "react-native-cardview";

// 날씨 정보 array
const weatherDatas = {
  Dust: {
    title: "Dust",
    subtitles: "It's Dust!",
    uri: require("../../assets/dust.jpg"),
    korean:"먼지 있음"
  },
  Sand: {
    title: "Sand",
    subtitles: "It's Sand!",
    uri: require("../../assets/dust.jpg"),
    korean:"먼지 많음"
  },

  Smoke: {
    title: "Smoke",
    subtitles: "It's Smoke!",
    uri: require("../../assets/smoke.jpg"),
    korean:"연기"
  },
  Tornado: {
    title: "Tornado",
    subtitles: "It's Tornado!",
    uri: require("../../assets/tornado.jpg"),
    korean:"태풍"
  },

  Squall: {
    title: "Squall",
    subtitles: "It's Squall!",
    uri: require("../../assets/rain.jpg"),
    korean:"소나기"
  },
  Rain: {
    title: "Rain",
    subtitles: "It's Rainning!",
    uri: require("../../assets/rain.jpg"),
    korean:"비"
  },
  Clear: {
    title: "Clear",
    subtitles: "It's Clear!",
    uri: require("../../assets/sunny.jpg"),
    korean:"맑음"
  },
  Thunderstorm: {
    title: "Thunderstorm",
    subtitles: "It's thunderstorm!",
    uri: require("../../assets/thunderstorm.jpg"),
    korean:"천둥번개"
  },
  Clouds: {
    title: "Clouds",
    subtitles: "It's Clouds!",
    uri: require("../../assets/cloudy.jpg"),
    korean:"구름 많음"
  },

  Snow: {
    title: "Snow",
    subtitles: "It's Snow!",
    uri: require("../../assets/snow.jpg"),
    korean:"눈"
  },

  Drizzle: {
    title: "Drizzle",
    subtitles: "It's Drizzle!",
    uri: require("../../assets/drizzle.jpg"),
    korean:"이슬비"
  },
  Haze: {
    title: "Haze",
    subtitles: "It's Haze!",
    uri: require("../../assets/fog.jpg"),
    korean:"안개 약간"
  },
  Fog: {
    title: "Fog",
    subtitles: "It's Fog!",
    uri: require("../../assets/fog.jpg"),
    korean:"안개 많음"
  },
  Mist: {
    title: "Mist",
    subtitles: "It's Mist!",
    uri: require("../../assets/mist.jpg"),
    korean:"습함"
  }
};

export default class Weather extends Component {
  state = {
    nowWeather: this.props.nowWeather,
    temp: this.props.temp,
    scale: new Animated.Value(1.2),
    date: this.props.date,
    weatherArray: this.props.weatherArray
  };

  cycleAnimation = () => {
    Animated.sequence([
      Animated.timing(this.state.scale, {
        toValue: 1.3,
        duration: 10000,
        useNativeDriver: true
      }),
      Animated.timing(this.state.scale, {
        toValue: 1.2,
        duration: 10000,
        useNativeDriver: true
      })
    ]).start(() => {
      this.cycleAnimation();
    });
  };

  render() {
    const { nowWeather, temp, date, weatherArray } = this.state;

    const Tooltip = ({ x, y, data }) => {
      return data.map((value, index) => (
        <G key={index} x={x(index)}>
          <G y={y(value.temp) - 15}>
            <SVGText
              //   style={{ color: "white" }}
              alignmentBaseline={"middle"}
              textAnchor={"middle"}
              stroke={"white"}
              strokeWidth={1}
            >
              {`${value.temp}ºC`}
            </SVGText>
          </G>
        </G>
      ));
    };

    const Decorator = ({ x, y, data }) => {
      return data.map((value, index) => (
        <Circle
          key={index}
          cx={x(index)}
          cy={y(value.temp)}
          r={4}
          stroke={"rgb(134, 65, 244)"}
          fill={"white"}
        />
      ));
    };

    const axesSvg = { fontSize: 10, fill: "white" };
    console.log("nowWeather : " + nowWeather);

    return (
      <View
        style={{
          backgroundColor: "transparent",
          flex: 1,
          justifyContent: "space-between",
          alignSelf: "stretch"
          //   position: "absolute",
          //   right: 0,
          //   top: 0,
          //   bottom: 0,
          //   left: 0
        }}
      >
        <Animated.Image
          source={weatherDatas[nowWeather].uri}
          onLoad={this.cycleAnimation}
          style={[
            styles.image,
            {
              ...Platform.select({
                ios: {
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "transparent"
                },
                android: {
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
                  ]
                }
              })
            }
          ]}
        />

        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text style={[styles.mainText, { fontSize: 14 }]}>{date}</Text>

          <Text style={[styles.mainText, { marginLeft:10, fontSize: 18 }]}>{weatherDatas[nowWeather].korean}</Text>
        </View>

        {/* 차트 그리기 */}
        <View
          style={{
            marginRight: 10,
            height: 200,
            flexDirection: "row",
            width: width - 70,
            marginLeft: 10
          }}
        >
          <View style={{ flex: 1 }}>
            <LineChart
              style={{ flex: 1 }}
              data={weatherArray}
              animate={false}
              yAccessor={({ item }) => item.temp}
              svg={{ stroke: "#fff", strokeWidth: 3 }}
              contentInset={{ left: 15, right: 15, top: 30, bottom: 20 }}
            >
              <Decorator />
              <Tooltip />
            </LineChart>

            <XAxis
              style={{ marginHorizontal: -10, height: 20 }}
              data={weatherArray}
              xAccessor={({ index }) => index}
              formatLabel={(value, index) => weatherArray[index].time}
              contentInset={{ left: 30, right: 30 }}
              svg={axesSvg}
            />
          </View>
        </View>
      </View>
    );
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
    resizeMode: "cover",
    backgroundColor: "transparent"
  },
  topIconView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  bottomTextView: {
    flex: 1,
    justifyContent: "flex-end"
  },

  bottomText: {
    fontSize: 38,
    flexWrap: "wrap",
    paddingBottom: 100,
    paddingRight: 20,
    marginLeft: 20,
    color: "#fff"
  },
  mainText: {
    alignSelf: "center",
    alignItems: "center",
    // justifyContent: "center",
    fontSize: 30,
    marginTop: 10,
    color: "#fff",
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 3
  }
});
