import React, { Component } from 'react';
import { StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { AsyncStorage } from 'react-native';

import {
    Layout,
    Text,
    Select,
    Spinner,
    Icon,
    Datepicker,
    Input,
    Button,
} from '@ui-kitten/components';

export default class AddNew extends Component {

    logOut = () => {
        AsyncStorage.setItem( //najprej pobrisemo prijavljenega uporabnika iz pomnilnika
            'user', "",
        );
        Actions.replace('loginPage'); //skocimo na login page
    }

    render() {
        return (
            <Layout>
                <Button
                    onPress={this.logOut}>
                    LOG OUT
                </Button>
            </Layout>
        );
    };
}