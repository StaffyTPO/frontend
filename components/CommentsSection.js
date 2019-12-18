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
} from 'react-native-ui-kitten';

import Comment from './Comment';

export default class CommentsSection extends Component {
  state = {
    komentarji: [
      {
        sporocilo: 'to bi bilo najlazje tako narediti',
        datum: '28/11/2019',
        uporabnik: {
          ime: 'Nejc',
          priimek: 'Bezget',
          slika:
            'https://scontent-frt3-1.xx.fbcdn.net/v/t1.0-1/c0.0.320.320a/p320x320/536878_1078240882197378_3999870710133957095_n.jpg?_nc_cat=104&_nc_ohc=lshFHYen5TUAQlVTifzdIOyLKb061dhJ64aAGkgrRFRuyBopteB-Q6G5w&_nc_ht=scontent-frt3-1.xx&oh=a6f0288ce19c5488e32ba0c8d010b238&oe=5E8C11A5',
        },
      },
      {
        sporocilo:
          'to bi bilo najlazje tako narediti, to bi bilo najlazje tako narediti to bi bilo najlazje tako narediti',
        datum: '28/11/2019',
        uporabnik: {
          ime: 'Nejc',
          priimek: 'Bezget',
          slika:
            'https://scontent-frt3-1.xx.fbcdn.net/v/t1.0-1/c0.0.320.320a/p320x320/536878_1078240882197378_3999870710133957095_n.jpg?_nc_cat=104&_nc_ohc=lshFHYen5TUAQlVTifzdIOyLKb061dhJ64aAGkgrRFRuyBopteB-Q6G5w&_nc_ht=scontent-frt3-1.xx&oh=a6f0288ce19c5488e32ba0c8d010b238&oe=5E8C11A5',
        },
      },
    ],
  };

  componentDidMount() {}

  render() {
    return (
      <Layout>
        <Text category="h6" style={styles.spacious}>
          Komentarji:{' '}
        </Text>
        <Input style={styles.spacious}></Input>
        <Button style={styles.spacious}>Objavi komentar</Button>

        {/* prikazi vse komentarje za neko aktivnost, urejeni po nastanku, zadnje dodani je najvisje */}
        {this.state.komentarji ? (
          this.state.komentarji.map(komentar => {
            return (
              <Comment
                uporabnik={komentar.uporabnik}
                sporocilo={komentar.sporocilo}
                datum={komentar.datum}></Comment>
            );
          })
        ) : (
          <Layout style={styles.spinner}>
            <Spinner />
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
