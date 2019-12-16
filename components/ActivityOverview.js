import React, {Component} from 'react';
import {StyleSheet, ScrollView} from 'react-native';

import {
  Layout,
  Text,
  Icon,
  TopNavigation,
  TopNavigationAction,
  Spinner,
} from 'react-native-ui-kitten';

import {Actions} from 'react-native-router-flux';

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
              aktivnostIDja(aktivnostId:${this.props.id}) {
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
        this.setState({aktivnost: resData.data.aktivnostIDja});
        //console.log(resData.data.aktivnosti[0]);
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const BackIcon = style => <Icon {...style} name="arrow-back" />;
    const BackAction = () => (
      <TopNavigationAction onPress={() => Actions.pop()} icon={BackIcon} />
    );
    return (
      <Layout>
        <TopNavigation leftControl={BackAction()} title="Back" />
        {this.state.aktivnost ? (
          <Layout style={styles.container}>
            <Text category="h5">{this.state.aktivnost.naslov}</Text>
            <Text>Opis: {this.state.aktivnost.opis}</Text>
            {this.state.aktivnost.prostor && (
              <Text>Prostor: {this.state.aktivnost.prostor.naziv}</Text>
            )}
            {this.state.aktivnost.vrsta_sluzbe && (
              <Text>
                Vrsta Službe: {this.state.aktivnost.vrsta_sluzbe.naziv}
              </Text>
            )}
            {this.state.aktivnost.prioriteta && (
              <Text>Prioriteta: {this.state.aktivnost.prioriteta.tip}</Text>
            )}
          </Layout>
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
  container: {
    backgroundColor: 'transparent',
    marginHorizontal: 15,
  },
  spinner: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
