import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types'

import SafeAreaView from "react-native-safe-area-view";
import CardView from 'react-native-cardview';

import SlidingUpPanel from 'rn-sliding-up-panel'


const shuttleTimes = {
    bundang: [
        {
            title: '09:00',
            isAvailable: true
        },
        {
            title: '10:00',
            isAvailable: true
        },
        {
            title: '11:00',
            isAvailable: true
        },
        {
            title: '13:00',
            isAvailable: false
        },
        {
            title: '14:00',
            isAvailable: true
        },
        {
            title: '15:00',
            isAvailable: true
        },
        {
            title: '16:00',
            isAvailable: true
        },
        {
            title: '17:00',
            isAvailable: true
        },
    ],
    bangbae: [
        {
            title: '09:00',
            isAvailable: true
        },
        {
            title: '10:00',
            isAvailable: true
        },
        {
            title: '11:00',
            isAvailable: true
        },
        {
            title: '13:00',
            isAvailable: true
        },
        {
            title: '14:00',
            isAvailable: true
        },
        {
            title: '15:00',
            isAvailable: true
        },
        {
            title: '16:00',
            isAvailable: true
        },
        {
            title: '17:00',
            isAvailable: false
        },
    ]
}


const Tab1 = 'bundangToBangbae'
const Tab2 = 'bangbaeToBundang'

export default class SmallShuttleMain extends Component {
    _panel;

    static defaultProps = {
        draggableRange: {
            top: 280 + 50,  // + tab height 
            bottom: 0
        },
        type: Tab1
    }

    static navigationOptions = {
        title: "사송 메인",
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
        _clickedIndex: 0
    }


    componentWillReceiveProps(nextProps) {
    }

    componentDidMount() {
        this.setState({

        });
    }

    _onMenuClicked = (index) => {
        Alert.alert('_onMenuClicked' + index);
    }

    _onLeftButtonclicked = (index) => {

        this.setState({
            _clickedIndex: index
        })
        this._panel.show();
    }



    _onRightButtonclicked = (index) => {
        Alert.alert('Right' + index)
    }

    _renderItem = (item, index, ) => {

        return (
            <CardView
                cardElevation={2}
                cardMaxElevation={2}
                style={styles.row}
                cornerRadius={3}>
                {!item.isAvailable ?
                    <TouchableOpacity
                        style={styles.leftButtonStyle}
                        activeOpacity={0.7}>
                        <Icon style={{ justifyContent: 'center', alignItems: 'center' }} name="lead-pencil" size={28} color="#5e5e5e" />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                        style={styles.leftButtonStyle}
                        activeOpacity={0.7}
                        onPress={() => this._onLeftButtonclicked(index)}>
                        <Icon style={{ justifyContent: 'center', alignItems: 'center' }} name="lead-pencil" size={28} color="#4baec5" />
                    </TouchableOpacity>
                }

                {!item.isAvailable ?
                    <Text style={[styles.centerSubTextStyle, { color: '#5e5e5e' }]}>
                        {item.title + ' 운행안함'}
                    </Text>
                    :
                    <Text style={styles.centerTextStyle}>
                        {item.title + ' 출발'}
                    </Text>
                }

                {!item.isAvailable ?
                    <TouchableOpacity
                        style={styles.rightButtonStyle}
                        activeOpacity={0.7}>
                        <Icon style={{ justifyContent: 'center', alignItems: 'center' }} name="alarm" size={28} color="#5e5e5e" />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                        style={styles.rightButtonStyle}
                        activeOpacity={0.7}
                        onPress={() => this._onRightButtonclicked(index)}>
                        <Icon style={{ justifyContent: 'center', alignItems: 'center' }} name="alarm" size={28} color="#4baec5" />
                    </TouchableOpacity>
                }
            </CardView>
        )
    }


    render() {

        const { _clickedIndex } = this.state;

        const { type } = this.props;

        let isTab2 = false;
        if (type == Tab2) {
            isTab2 = true;
        }

        return (
            <View style={styles.container}>
                <FlatList
                    style={{ flex: 1 }}
                    keyExtractor={(item, index) => 'key' + index}
                    data={isTab2 ? shuttleTimes.bangbae : shuttleTimes.bundang}
                    renderItem={({ item, index }) =>
                        this._renderItem(item, index, isTab2)
                    }
                />
                {/* 하단 메뉴 */}
                <SlidingUpPanel
                    allowDragging={false}
                    showBackdrop={true}
                    allowMomentum={true}
                    // minimumDistanceThreshold={0.5}
                    minimumVelocityThreshold={0.01}
                    friction={0.5}
                    ref={c => (this._panel = c)}
                    // onDragEnd={(value) => this._setVisible(value)}   
                    // style={{ position: 'relative' }}
                    draggableRange={this.props.draggableRange}
                >
                    <SafeAreaView forceInset={{ bottom: 'always' }} style={[styles.container]}>
                        <View style={{ backgroundColor: '#fff', justifyContent: 'flex-start' }}>
                            <Text style={{
                                marginLeft: 20,
                                color: '#333',
                                marginTop: 10,
                                textAlignVertical: 'top',
                                fontSize: 12,
                                height: 15,
                                textAlign: 'left'
                            }}>
                                {isTab2 ? shuttleTimes.bangbae[_clickedIndex].title : shuttleTimes.bundang[_clickedIndex].title}
                            </Text>

                            <TouchableOpacity style={{ alignItems: 'center', marginLeft: 30, flexDirection: 'row', height: 40, marginTop: 10 }}
                                activeOpacity={0.3}
                                onPress={() => this._onMenuClicked(0)}>
                                <Icon style={{
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                    name="cube-send"
                                    size={24}
                                    color="#333" />
                                <Text style={{
                                    marginLeft: 5,
                                    color: 'black',
                                    textAlignVertical: "center",
                                    fontSize: 14,
                                    textAlign: 'left'
                                }}>운반물품 보내기</Text>
                            </TouchableOpacity>


                            <TouchableOpacity style={{ alignItems: 'center', marginLeft: 30, flexDirection: 'row', height: 40, marginTop: 10 }}
                                activeOpacity={0.3}
                                onPress={() => this._onMenuClicked(1)}>
                                <Icon style={{
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                    name="feature-search"
                                    size={24}
                                    color="#333" />
                                <Text style={{
                                    marginLeft: 5,
                                    color: 'black',
                                    textAlignVertical: "center",
                                    fontSize: 14,
                                    textAlign: 'left'
                                }}>운반물품 조회</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ alignItems: 'center', marginLeft: 30, flexDirection: 'row', height: 40, marginTop: 10 }}
                                activeOpacity={0.3}
                                onPress={() => this._onMenuClicked(2)}>
                                <Icon style={{
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                    name="lead-pencil"
                                    size={24}
                                    color="#333" />
                                <Text style={{
                                    marginLeft: 5,
                                    color: 'black',
                                    textAlignVertical: "center",
                                    fontSize: 14,
                                    textAlign: 'left'
                                }}>탑승자정보 작성</Text>
                            </TouchableOpacity>
                        </View>
                        {/* <View style={[styles.container]}>
                        </View> */}
                    </SafeAreaView>
                </SlidingUpPanel>

            </View >
        );
    }
}

// prop의 타입 정의
SmallShuttleMain.propTypes = {
    draggableRange: PropTypes.object,
    type: PropTypes.oneOf([Tab1, Tab2])
}


const styles = StyleSheet.create({
    rightButtonStyle: {
        height: 50,
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },

    leftButtonStyle: {
        height: 50,
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },

    centerTextStyle: {
        color: 'black',
        flex: 1,
        textAlign: 'center',
        textAlignVertical: "center",
        fontWeight: 'bold',
        fontSize: 20,
    },

    centerSubTextStyle: {
        color: '#5e5e5e',
        flex: 1,
        textAlign: 'center',
        textAlignVertical: "center",
        fontWeight: 'bold',
        fontSize: 20,
    },


    row: {
        flex: 1,
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 3,
        marginBottom: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        // borderRadius: 0,
        // borderWidth: 1,
        // borderColor: '#000'
    },

    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'flex-start'

    },

});