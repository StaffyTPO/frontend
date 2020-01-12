import React, {Component} from 'react';
import {StyleSheet, Image, TouchableWithoutFeedback} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {AsyncStorage} from 'react-native';

import {Layout, Text, Button, Spinner, Avatar} from '@ui-kitten/components';

export default class AddNew extends Component {
  state = {
    name: '',
    surname: '',
    image: '',
  };

  componentDidMount() {
    AsyncStorage.getItem('user', (err, result) => {
      let rezultat = JSON.parse(result);
      this.setState({
        name: rezultat.ime,
        surname: rezultat.priimek,
        image: rezultat.slika,
      });
    });
  }

  logOut = () => {
    AsyncStorage.getItem('user', (err, result) => {
      if (result) {
        var user = JSON.parse(result);
        user.password = '';
        AsyncStorage.setItem(
          //najprej pobrisemo prijavljenega uporabnika iz pomnilnika
          'user',
          JSON.stringify(user),
        );
        Actions.replace('loginPage'); //skocimo na login page
      }
    });
  };

  render() {
    return (
      <Layout style={styles.container} level="3">
        <Layout style={styles.activityList}>
          <Layout style={styles.form}>
            {this.state.name ? (
              <Layout style={styles.podatki}>
                <Text category="h5" style={{marginBottom: 15}}>
                  Profile
                </Text>
                <Text>Name: {this.state.name}</Text>
                <Text>Surname: {this.state.surname}</Text>
                <Avatar
                  style={styles.avatar}
                  size="giant"
                  source={{uri: this.state.image}}
                />
              </Layout>
            ) : (
              <Layout style={styles.spinner}>
                <Spinner />
              </Layout>
            )}

            <Button onPress={this.logOut}>LOG OUT</Button>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flex: 1,
  },
  activityList: {
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  form: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  spinner: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  podatki: {
    alignItems: 'center',
    marginBottom: 20,
  },
});
