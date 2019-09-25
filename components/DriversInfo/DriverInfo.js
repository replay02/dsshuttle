//기사님 정보 조회 화면
import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import call from 'react-native-phone-call';

export default class DriverInfo extends Component {

    state = {
        navigation: null,

        driver: [{
            name: '윤창현',
            phone: '010-5129-0979',
            number: '경기77자3520',
            type: '셔틀',
            info: '인천'
        },
        {
            name: '윤경수',
            phone: '010-5701-1477',
            number: '경기76자3535',
            type: '셔틀',
            info: '창동,잠실'
        },
        {
            name: '서민석',
            phone: '010-3794-6037',
            number: '경기76자8624',
            type: '셔틀',
            info: '목동'
        },
        {
            name: '조용수',
            phone: '010-3757-3861',
            number: '경기76자3534',
            type: '셔틀',
            info: '신도림'
        },
        {
            name: '관리팀(임시)',
            phone: '010-2898-6339',
            number: '경기76자7022',
            type: '셔틀',
            info: '사당'
        },
        {
            name: '남주팔',
            phone: '010-6869-9787',
            number: '경기71하8805',
            type: '사송',
            info: '1호차'
        },
        {
            name: '박문성',
            phone: '010-4235-0308',
            number: '경기72하2884',
            type: '사송',
            info: '2호차'
        }]
    };

    static navigationOptions = {

        title: "기사님 정보 조회",
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
        return (
            <View style={styles.header}>
                <Text style={styles.headerText}>셔틀/사송 기사님</Text>
            </View>
        )
    }

    _keyExtractor(item, index) {
        return 'key' + index;
    }
    //리스트 항목 세팅//
    renderItem(data) {
        let { item, index } = data;

        return (
            <View style={styles.itemBlock}>
                <View style={styles.itemMeta}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.row}>{item.phone}</Text>
                    <Text style={styles.row}>{item.type + ' 운행 (' + item.info + ') '}</Text>
                    <Text style={styles.row}>{item.number}</Text>
                </View>
                <View>
                    <Icon name="md-call" size={30} style={{ paddingRight: 30, color: '#4baec5' }} onPress={this.call.bind(this, item.phone)}></Icon>
                </View>
            </View>
        )
    }
    //전화 기능//
    call = (phoneNumber) => {

        const args = {
            number: String(phoneNumber),
            prompt: false
        };
        call(args).catch(console.error);
    };

    render() {

        return (
            <View style={styles.container}>
                <FlatList
                    keyExtractor={this._keyExtractor}
                    data={this.state.driver} //flatList에서 렌더링할 데이터
                    renderItem={this.renderItem.bind(this)}
                    ListHeaderComponent={this.renderHeader}
                >
                </FlatList>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        marginTop: 20,
    },
    itemBlock: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 15,
        backgroundColor: '#dcdcdc',
        borderRadius: 10
    },
    itemMeta: {
        justifyContent: 'center',
        marginLeft: 20
    },
    header: {
        padding: 10
    },
    headerText: {
        fontSize: 20,
        fontWeight: '500'
    },
    name: {
        paddingTop: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000'
    },
    row: {
        fontSize: 15,
        color: "#000000",
    }
});