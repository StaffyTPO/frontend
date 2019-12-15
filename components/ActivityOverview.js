import React, {Component} from 'react';
import {StyleSheet, ScrollView} from 'react-native';

import {Layout, Text} from 'react-native-ui-kitten';

export default class ActivityOverview extends Component {
  state = {aktivnost: ''};

  componentDidMount() {
    this.handleSubmit();
    console.log(this.state.aktivnost);
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
                prioriteta{
                  tip
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
        this.setState({aktivnost: resData.data.aktivnosti[0]});
        //console.log(resData.data.aktivnosti[0]);
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <Layout>
        {this.state.aktivnost ? (
          <Layout style={styles.container}>
            <Text category="h5">{this.state.aktivnost.naslov}</Text>
            <Text>Opis: {this.state.aktivnost.opis}</Text>
            <Text>Prostor: {this.state.aktivnost.prostor.naziv}</Text>
            <Text>Vrsta Službe: {this.state.aktivnost.vrsta_sluzbe.naziv}</Text>
            <Text>Prioriteta: {this.state.aktivnost.prioriteta.tip}</Text>
          </Layout>
        ) : (
          <Text>Loading...</Text>
        )}
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    marginHorizontal: 15,
    marginVertical: 15,
  },
});
