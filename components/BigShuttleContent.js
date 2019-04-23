import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Text, FlatList, Dimensions } from 'react-native';
import CardView from 'react-native-cardview';

const _basePaddingTop = 20;
const _basePaddingBottom = 20;

const width = Dimensions.get('window').width;

export default class BigShuttleContent extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            title: nextProps.title,
            clickMethod: nextProps.clickMethod,
            selectedData: nextProps.selectedData,
            selectedKey: nextProps.selectedKey,
        });
    }

    componentDidMount() {
    }

    _keyExtractor = (item, index) => item.id;

    render() {
        const { selectedKey, title, clickMethod, selectedData } = this.state;
        return (
            <View
                style={{ marginTop: _basePaddingTop, marginBottom: _basePaddingBottom, height: 110 }}>
                <Text style={{marginLeft: 25, fontWeight: 'bold', fontSize: 20 }}>
                    {title}
                </Text>

                <CardView
                    cardElevation={2}
                    cardMaxElevation={2}
                    style={{ marginLeft: 20, marginRight: 20, marginTop: 3 }}
                    cornerRadius={7}>
                    <FlatList
                        horizontal={true}
                        style={{ flex: 1 }}
                        keyExtractor={(item, index) => 'key' + index}
                        data={selectedData}

                        renderItem={({ item, index }) =>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => clickMethod(item, selectedKey)}>
                                <View
                                    style={[
                                        styles.row,
                                        { minWidth: ((width - 40) / selectedData.length)>80?(width - 40) / selectedData.length:80 }
                                    ]} >
                                    <View style={{
                                        flexDirection: 'row',
                                        position: 'relative',
                                        alignItems: 'flex-start',
                                        justifyContent: 'center',
                                        flex: 1}}>
                                        <View
                                            style={{
                                                backgroundColor: '#4BAEC5',
                                                alignSelf: 'center',
                                                height: 3,
                                                flex: 1
                                            }}/>

                                        <Image
                                            style={{
                                                position: 'absolute',
                                                alignSelf: 'center',
                                                width: 30,
                                                height: 30
                                            }}
                                            source={require('../assets/station.png')}>
                                        </Image>
                                        <Text
                                            style={{
                                                position: 'absolute',
                                                alignSelf: 'center',
                                                justifyContent: 'center',
                                                paddingTop: 35
                                            }}>
                                            {item.arriveTime}
                                        </Text>
                                    </View>

                                    <Text
                                        style={{ alignItems: 'flex-start', paddingBottom: 10, paddingLeft: 10, paddingRight: 10, color: 'black' }}>
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
        alignItems: 'center',
        backgroundColor: '#ffffff',
        flexDirection: 'column',
    },
});