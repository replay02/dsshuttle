import React, { Component } from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import SafeAreaView from "react-native-safe-area-view";
import BigShuttleMain from './BigShuttleMain';

export default class ShuttleTab extends Component {

    // componentDidMount() {

    // }
    static navigationOptions = {
        headerStyle: { display: "none" },

    };

    state = {
        index: 0,
        routes: [
            { key: 'first', title: '셔틀버스' },
            { key: 'second', title: '사송' },
        ],
    };


    // 화면 구성
    _renderScene = ({ route }) => {
        switch (route.key) {
            case 'first':
                return <BigShuttleMain navigation={this.props.navigation} />
            case 'second':
                return <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />
            default:
                return null;
        }
    };

    render() {
        return (
            <SafeAreaView
                forceInset={{ top: 'always', bottom: 'never' }}
                style={{ flex: 1, backgroundColor: '#ffffff' }}>
                <View style={{ flex: 1 }}>
                    <TabView
                        swipeEnabled={true}
                        style={{ flex: 1 }}
                        renderTabBar={props =>
                            <TabBar
                                {...props}
                                labelStyle={{ color: '#4baec5', fontWeight: 'bold' }}
                                indicatorStyle={{ backgroundColor: '#4baec5' }}
                                style={{ backgroundColor: '#ffffff' }}
                            />
                        }
                        navigationState={this.state}

                        renderScene={(route) =>
                            this._renderScene(route)
                        }
                        onIndexChange={index => this.setState({ index })}
                        initialLayout={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
                    />
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: '#fff',
    },

    containerHorizon: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
    },

    containerChart: {
        flex: 1,
        backgroundColor: '#fff',
        // flexDirection : 'column'
        justifyContent: 'flex-end'
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

    lineChartXAxis: {
        height: 30,
        marginHorizontal: -10,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff',

    },

    lineChartYAxis: {
        flex: 1,
        marginTop: 10,
        marginBottom: 40,
        backgroundColor: '#fff',
    },


    lineChartBack: {
        flex: 1,
        padding: 10,
        backgroundColor: 'transparent',
    },

    lineChartBack2: {
        paddingBottom: 40,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        backgroundColor: 'transparent',
        ...StyleSheet.absoluteFillObject,
    },
});
