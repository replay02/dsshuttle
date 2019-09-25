import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Container, Content } from 'native-base';
import MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';

import NoticeComponent from './NoticeComponent';


import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SafeAreaView from "react-native-safe-area-view";
import CommonConf from '../Datas/CommonConf'

export default class MainTab extends Component {

    //하단 네비게이션
    static navigationOptions = {
        tabBarIcon: ({ tintColor }) => (
            <MaterialCommunityIcons style={{ color: tintColor }} name= 'home' size={25} />
        )
    }

    state = {
        feeds: [],
    }

    //component구분용
    _keyExtractor(item, index) {
        return 'key' + index;
    }

    //data db select
    _boardList() {
        var url = 'http://' + CommonConf.urlHost + ':8080/ss/api/boardcontents';
        console.log('kny_geturl', url);

        //data select
        fetch(url)
            .then(response => response.json() )
            .then(json => {
                console.log('kny_json', json);

                this.setState({
                    feeds: json
                })
            })
            .catch((error => {
                console.log('kny_getError', error);
            }))
    }


    //초기로드시
    componentDidMount() {
        this._boardList()
    };

    //변경사항 발생시
    componentWillUpdate() {
        this._boardList()
    }


    render() {

        return (
            <SafeAreaView forceInset={{ bottom: 'never', top: 'never' }}>
                <KeyboardAwareScrollView keyboardShouldPersistTaps='handled'>
                    <Container style= {styles.container}>
                        <Content> 
                        {
                            //state.feeds배열 map함수로 루프돌며 NoticeComponent의 data에 각 피드 항목 데이터 전달
                            this.state.feeds.map(feed => <NoticeComponent key={this._keyExtractor} data = {feed} />)  
                        }
                        </Content>
                    </Container>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
});