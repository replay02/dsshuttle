import React, { Component } from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import SmallShuttleMain from './SmallShuttleMain';

export default class ShuttleTab extends Component {

    // componentDidMount() {

    // }
    static navigationOptions = {
        title: "사송",
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
        index: 0,
        routes: [
            { key: 'tab1', title: '분당->방배' },
            { key: 'tab2', title: '방배->분당' },
        ],
    };


    // 화면 구성
    _renderScene = ({ route }) => {
        switch (route.key) {
            case 'tab1':
                return <SmallShuttleMain navigation={this.props.navigation} />
            case 'tab2':
                return <SmallShuttleMain navigation={this.props.navigation} type={'bangbaeToBundang'} />
            default:
                return null;
        }
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <TabView
                    swipeEnabled={true}
                    style={{ flex: 1 }}
                    renderTabBar={props =>
                        <TabBar
                            {...props}
                            labelStyle={{fontWeight: 'bold' }}

                            activeColor={'#4baec5'}
                            inactiveColor={'#5e5e5e'}

                            indicatorStyle={{ backgroundColor: '#4baec5' }}
                            tabStyle={{ height: 50 }}
                            style={{ backgroundColor: '#fff' }}
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
