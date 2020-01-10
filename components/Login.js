import React, { Component } from 'react';
import { StyleSheet, ToastAndroid } from 'react-native';
import Moment from 'moment';

import {
  Layout,
  Text,
  Icon,
  TopNavigation,
  TopNavigationAction,
  Spinner,
  Button,
  Input,
} from '@ui-kitten/components';

import { Actions } from 'react-native-router-flux';
import CommentsSection from './CommentsSection';
import Tag from './Tag';
import moment from 'moment';
import { AsyncStorage } from 'react-native';

export default class Login extends Component {
  state = {
    trenutniEmail: '',
    trenutniPassword: '',
    auth: false,
  };

  componentDidMount() {
    console.log("hey");
    AsyncStorage.getItem('user', (err, result) => {
      if (result) {
        result = JSON.parse(result);
        if (result.password != "") {
          console.log(result);
          this.setState({ prijavljenUporabnik: result });
          this.setState({
            trenutniEmail: this.state.prijavljenUporabnik.email,
            trenutniPassword: this.state.prijavljenUporabnik.password
          });
          console.log(this.state);
          Actions.replace('mainPage');
        } else {
          this.setState({ trenutniEmail: result.email });
          this.setState({ auth: true });
        }
      } else {
        this.setState({ auth: true });
      }
    });
  }

  login = event => {
    const requestBody = {
      query: `
      query {
        registriranUporabnik (email: "${this.state.trenutniEmail}", geslo: "${this.state.trenutniPassword}") {
          id
          ime
          priimek
          slika
          telefon
          email
          password
          podjetje
        }
      }
      `,
    };

    // console.log(requestBody);

    fetch('https://staffy-app.herokuapp.com/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        if (resData.data.registriranUporabnik) {
          //v skupen pomnilnik shrani prijavljenega uporabnika
          AsyncStorage.setItem(
            'user',
            JSON.stringify(resData.data.registriranUporabnik),
          );
          Actions.replace('mainPage');
        } else {
          ToastAndroid.show('Invalid e-mail or password.', ToastAndroid.SHORT);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  changeText = e => {
    this.setState({ trenutniEmail: e });
  };

  changeTextPassword = e => {
    this.setState({ trenutniPassword: e });
  };

  registration = e => {
    Actions.registrationPage();
  }

  render() {
    return (
      <React.Fragment>
        <Layout style={styles.container} level="3">
          {this.state.auth ? (
            <Layout style={styles.loginContainer} level="1">
              <Layout style={styles.login}>
                <Text style={styles.formLabel} category="label">
                  Uporabniško ime
                </Text>
                <Input
                  value={this.state.trenutniEmail}
                  style={styles.formItem}
                  onChangeText={this.changeText}
                  placeholder="Uporabnisko ime"></Input>
                <Text style={styles.formLabel} category="label">
                  Geslo
                </Text>
                {/* Zaenkrat tut ce ne vness gesla se ne preverja, treba se spremenit da preveri */}
                <Input
                  value={this.state.trenutniPassword}
                  style={styles.formItem}
                  onChangeText={this.changeTextPassword}
                  secureTextEntry={true}
                  placeholder="Geslo"></Input>
                <Button style={styles.loginButton} onPress={this.login}>
                  LOGIN
                </Button>
                <Button style={styles.loginButton} onPress={this.registration}>
                  REGISTRACIJA
                </Button>
              </Layout>
            </Layout>
          ) : (
              <></>
            )}
        </Layout>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flex: 1,
  },
  loginContainer: {
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  login: {
    marginVertical: 15,
    marginHorizontal: 15,
  },
  formLabel: { marginBottom: 5 },
  formItem: {
    marginBottom: 15,
  },
  loginText: { marginTop: 20, marginBottom: 30 },
  center: {
    alignItems: 'center',
  },
  loginButton: {
    marginTop: 10,
  },
});
