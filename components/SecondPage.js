import React, { Component } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import Moment from 'moment';

import {
    Layout,
    Text,
    Icon,
    TopNavigation,
    TopNavigationAction,
    Spinner,
    Button,
} from '@ui-kitten/components';

import { Actions } from 'react-native-router-flux';
import CommentsSection from './CommentsSection';
import Tag from './Tag';
import moment from 'moment';

import { AsyncStorage } from 'react-native';

function get_item() {
    AsyncStorage.getItem('userId', (err, result) => {
        console.log(result);
    });
}

export default class Login extends Component {

    render() {
        return (
            <Layout>
                <Button
                    onPress={() => {
                        get_item();
                    }}>TEST</Button>
            </Layout>
        );
    }

}