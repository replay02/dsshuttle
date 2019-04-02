import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Text, FlatList, Dimensions } from 'react-native';
import CardView from 'react-native-cardview';

const _basePaddingTop = 20;
const _basePaddingBottom = 20;

export default class BigShuttleContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // clickMethod = null,
            // selectedData =[]
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            title: nextProps.title,
            clickMethod: nextProps.clickMethod,
            selectedData: nextProps.selectedData,
            selectedTitle : nextProps.selectedTitle,
        });
    }
    
    componentDidMount() {
    }

    _keyExtractor = (item, index) => item.id;

    _renderRow = (data) => {
        return (
            <View style={styles.row}>
                <Text
                    style={{ color: 'black' }}>
                    {data.shortname}
                </Text>
            </View>
        )
    }
    render() {
        const { selectedTitle,title, clickMethod, selectedData } = this.state;
        return (
            <View 
                style={{ marginTop: _basePaddingTop, marginBottom: _basePaddingBottom, height: 150 }}>
                <Text style={{ marginLeft: 25, fontWeight: 'bold', fontSize: 20 }}>{title}</Text>

                <CardView
                    cardElevation={2}
                    cardMaxElevation={2}
                    style={{  marginLeft: 20, marginRight: 20, marginTop: 10 }}
                    cornerRadius={7}>
                    <FlatList
                        horizontal={true}
                        style={{ flex: 1 }}
                        keyExtractor={(item, index) => 'key' + index}
                        data={selectedData}
                        
                        renderItem={({ item, index }) =>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => clickMethod(item, selectedTitle)}
                            >
                                <View style={styles.row} >
                                    <View style={{
                                        flexDirection: 'row',
                                        position: 'relative',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flex: 1
                                    }}>
                                        <View
                                            style={{
                                                backgroundColor: '#4BAEC5',
                                                alignSelf: 'center',
                                                height: 3,
                                                flex: 1
                                            }}
                                        />
                                        <Image
                                            style={{
                                                position: 'absolute',
                                                alignSelf: 'center',
                                                width: 40,
                                                height: 40,

                                            }}
                                            color={'#ffffff'}
                                            source={require('../assets/station.png')}>
                                        </Image>

                                    </View>
                                    <Text
                                        style={{ padding: 15, color: 'black' }}>
                                        {item.shortname}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        }
                    />
                </CardView>

            </View>
        );
    }
}


const styles = StyleSheet.create({

    row: {
        flex: 1,
        backgroundColor: '#fff',
        // justifyContent: 'center',
        // alignItems: 'flex-start',
        backgroundColor: '#ffffff',
        flexDirection: 'column',

    },
});