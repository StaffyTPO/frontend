import React, {Component} from 'react';
import {StyleSheet, Image, TouchableWithoutFeedback} from 'react-native';

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

import Comment from './Comment';

export default class CommentsSection extends Component {
  state = {
    loading: true,
    novKomentar: '',
    komentarji: '',
    posilja: false,
  };
  componentDidMount() {
    this.vsiKomentarji();
    console.log(this.state.komentarji);
  }

  vsiKomentarji() {
    const requestBody = {
      query: `
      query {
        komentarji(aktivnostId: ${this.props.idAktivnosti}) {
          id
          sporocilo
          datum
          uporabnik {
            id
            ime
            priimek
            slika
          }
        }
      }
      `,
    };

    fetch('https://staffy-app.herokuapp.com/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!', res.status);
        }
        return res.json();
      })
      .then(resData => {
        if (resData.data.komentarji.length === 0) {
          this.setState({
            loading: false,
          });
        } else {
          this.setState({
            komentarji: resData.data.komentarji,
            loading: false,
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  dodajKomentar = () => {
    this.setState({posilja: true});
    const requestBody = {
      query: `
      mutation DodajKomentar(
        $aktivnost: Int,
        $uporabnik: Int,
        $sporocilo: String,
        $datum: String
      ){
        dodajKomentar(
        aktivnost: $aktivnost,
        uporabnik: $uporabnik,
        sporocilo: $sporocilo,
        datum: $datum) {
          id
          sporocilo
          datum
          uporabnik {
            id
            ime
            priimek
            slika
          }
        }
      }
      `,
      variables: {
        aktivnost: Number(this.props.idAktivnosti),
        uporabnik: Number(2),
        sporocilo: this.state.novKomentar,
        datum: new Date(),
      },
    };

    fetch('https://staffy-app.herokuapp.com/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!', res.status);
        }
        return res.json();
      })
      .then(resData => {
        let vsi = this.state.komentarji;
        if (vsi === '') {
          vsi = [];
        }
        vsi.push(resData.data.dodajKomentar);
        this.setState({
          komentarji: vsi,
          novKomentar: '',
          posilja: false,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  spremeniKomentar = e => {
    this.setState({novKomentar: e});
  };

  render() {
    return (
      <Layout>
        <Text category="h6" style={styles.spacious}>
          Komentarji:
        </Text>
        <Input
          value={this.state.novKomentar}
          onChangeText={this.spremeniKomentar}
          style={styles.spacious}></Input>
        <Button onPress={this.dodajKomentar} style={styles.spacious}>
          Objavi komentar
        </Button>

        {/* prikazi vse komentarje za neko aktivnost, urejeni po nastanku, zadnje dodani je najvisje */}
        {this.state.komentarji ? (
          this.state.komentarji
            .slice(0)
            .reverse()
            .map(komentar => {
              return (
                <Comment
                  uporabnik={komentar.uporabnik}
                  sporocilo={komentar.sporocilo}
                  datum={komentar.datum}></Comment>
              );
            })
        ) : this.state.loading ? (
          <Layout style={styles.spinner}>
            <Spinner />
          </Layout>
        ) : (
          <Layout style={styles.spinner}>
            <Text>Zaenkrat nobenega komentarja</Text>
          </Layout>
        )}
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  spinner: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  //   container: {
  //     borderRadius: 10,
  //   },
  spacious: {
    margin: 3,
  },
});
