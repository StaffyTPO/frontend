import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
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

import {Actions} from 'react-native-router-flux';
import CommentsSection from './CommentsSection';
import Tag from './Tag';
import moment from 'moment';
import {AsyncStorage} from 'react-native';

export default class Login extends Component {
  state = {
    uporabniki: [
      {
        id: '0',
        ime: 'John',
        geslo: 'Doe',
        vrstaSluzbeId: 0,
        podjetjeId: 0,
      },
      {
        id: '1',
        ime: 'Bojan',
        geslo: '1234',
        vrstaSluzbeId: 2,
        podjetjeId: 1,
      },
      {
        id: '2',
        ime: 'Cistilka',
        geslo: 'rada_pucam123',
        vrstaSluzbeId: 1,
        podjetjeId: 2,
      },
    ],
    trenutniUporabnikId: '',
  };

  componentDidMount() {
    AsyncStorage.getItem('userId', (err, result) => {
      this.setState({trenutniUporabnikId: result});
      this.preveriUporabnika;
    });
  }

  //preveri, ce obstaja uporabnik s tem imenom in geslom in vrne njegov index ali -1, ce ne obstaja
  preveriUporabnika = () => {
    for (var i = 0; i < this.state.uporabniki.length; i++) {
      if (this.state.trenutniUporabnikId === this.state.uporabniki[i].id)
        return true;
    }
    return false;
  };

  //v skupen pomnilnik shrani prijavljenega uporabnika
  setLoggedUser = () => {
    if (this.preveriUporabnika) {
      AsyncStorage.setItem('userId', this.state.trenutniUporabnikId);
      Actions.loginSuccess();
    } else {
      console.log('Failed login.');
    }
  };

  changeText = e => {
    this.setState({trenutniUporabnikId: e});
  };

  render() {
    return (
      <Layout style={styles.container} level="3">
        <Layout style={styles.loginContainer} level="1">
          <Layout style={styles.login}>
            <Text style={styles.formLabel} category="label">
              Uporabniško ime
            </Text>
            <Input
              style={styles.formItem}
              onChangeText={this.changeText}
              placeholder="Uporabnisko ime"></Input>
            <Text style={styles.formLabel} category="label">
              Geslo
            </Text>
            {/* Zaenkrat tut ce ne vness gesla se ne preverja, treba se spremenit da preveri */}
            <Input
              style={styles.formItem}
              onChangeText={this.changeText}
              placeholder="Geslo"></Input>
            <Button style={styles.loginButton} onPress={this.setLoggedUser}>
              LOGIN
            </Button>
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
  loginContainer: {
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  login: {
    marginVertical: 15,
    marginHorizontal: 15,
  },
  formLabel: {marginBottom: 5},
  formItem: {
    marginBottom: 15,
  },
  loginText: {marginTop: 20, marginBottom: 30},
  center: {
    alignItems: 'center',
  },
  loginButton: {
    marginTop: 10,
  },
});
