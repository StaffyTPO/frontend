import React, {Component} from 'react';
import {StyleSheet, ScrollView} from 'react-native';

import {Layout, Text} from 'react-native-ui-kitten';

import ActivityListItem from './ActivityListItem';

export default class ActivityList extends Component {
  state = {};

  componentDidMount() {
    this.handleSubmit();
  }

  handleSubmit = event => {
    const requestBody = {
      query: `
        query {
          aktivnosti (podjetjeId: 1) {
            naslov
            opis
            prostor {
              naziv
            }
            vrsta_sluzbe {
              naziv
            }
          }
        }
      `,
    };

    console.log(requestBody);

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
        this.setState({activities: resData.data.aktivnosti});
        console.log(resData.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <Layout style={styles.container} level="1">
        {this.state.activities && //tole se uporabi da obstaja nek activities array
          this.state.activities.map((activity, index) => {
            //z mapom si pomagamo da array iteriramo na posamezne komponente
            return (
              <ActivityListItem
                key={index} //uporabimo komponento ter dolocimo propse,
                title={activity.naslov} //title se bo uporabil v otroku
                komentar={activity.opis}></ActivityListItem>
            );
          })}
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
});
