//기사님 정보 조회 화면
import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'


export default class ItemList extends Component {

    state = {
        navigation: null,
        timeData: this.props.navigation.state.params.timeData,
        location: this.props.navigation.state.params.location,
        member: [{
            sender: '김나영',
            receiver: '신다영',
            message: '10시 40분에 내려오세요!'
        },
        // {
        //     sender: '김나영',
        //     receiver: '신다영',
        //     message: '받아라!'
        // },
        // {
        //     sender: '김나영',
        //     receiver: '신다영',
        //     message: '받아라!'
        // },
        // {
        //     sender: '김나영',
        //     receiver: '신다영',
        //     message: '선물이야!'
        // },
        // {
        //     sender: '김나영',
        //     receiver: '신다영',
        //     message: '휴!'
        // },
        // {
        //     sender: '김나영',
        //     receiver: '신다영',
        //     message: '받아라!'
        // },
        // {
        //     sender: '김나영',
        //     receiver: '신다영',
        //     message: '받아라!'
        // },
        // {
        //     sender: '김나영',
        //     receiver: '신다영',
        //     message: null
        // }
    ]
    };

    static navigationOptions = {

        title: "운반 물품 조회",
        headerStyle: {

            backgroundColor: '#4baec5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
            color: '#fff'
        },
    };

    componentDidMount() {
        this.setState({
        });
    }
    //헤더 세팅//
    renderHeader() {
        const { location ,timeData} = this.state;
        console.log("location", location);
        return (

            <View style={styles.header}>
                {/* <Text style={styles.headerText}>{location}</Text> */}
                <Text style={styles.headerText}>{timeData}</Text>
                {/* <View style={{ borderBottomColor: '#4baec5', borderBottomWidth: 2, width: '100%', justifyContent: 'center', marginBottom:20 }}>
                </View> */}
            </View>
        )
    }

    _keyExtractor(item, index) {
        return 'key' + index;
    }

    _goItemDtlList = (timeData) => {
        this.props.navigation.navigate('ItemDtlList', { timeData: timeData })
    }
    //리스트 항목 세팅//
    renderItem(data) {
        let { item, index } = data;
        const { timeData } = this.state;

        return (
            <View style={styles.cardform}>
                {/* <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ textAlign: 'center', fontSize: 20, paddingBottom: 5 }}>{timeData}</Text>
                </View>

                <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, width: '70%', justifyContent: 'center' }}>
                </View> */}


                <TouchableOpacity style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                    activeOpacity={0.5}
                    onPress={() => this._goItemDtlList(timeData)}>

                    <View style={styles.itemMeta}>
                        <Text style={styles.paragraph}>{item.sender}</Text>
                        <Icon name="truck-delivery" size={30} style={{ color: 'black' }}></Icon>
                        <Text style={styles.paragraph}>{item.receiver}</Text>
                    </View>
                    <Text style={[styles.paragraph]}>{item.message}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    keyExtractor={this._keyExtractor}
                    data={this.state.member} //flatList에서 렌더링할 데이터
                    renderItem={this.renderItem.bind(this)}
                    ListHeaderComponent={this.renderHeader.bind(this)}
                >
                </FlatList>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1
    },
    itemMeta: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 15
    },
    header: {
        paddingTop: 20
    },
    headerText: {
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
        color: '#4baec5',
        paddingTop:5,
        //color:'#288CD2',
        marginBottom: 10
    },
    paragraph: {
        margin: 10,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#34495e'

    },
    cardform: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
        backgroundColor: '#dcdcdc',
        marginBottom: 20,
        marginLeft: 25,
        marginRight: 25,
        borderRadius: 10
    }
});