import React, {Component} from 'react';
import {StyleSheet, ScrollView} from 'react-native';

import {
  Layout,
  Text,
  Icon,
  TopNavigation,
  TopNavigationAction,
  Spinner,
} from '@ui-kitten/components';

import {Actions} from 'react-native-router-flux';
import CommentsSection from './CommentsSection';

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
      <Layout style={styles.container} level="3">
        <TopNavigation leftControl={BackAction()} title="Back" />
        {this.state.aktivnost ? (
          <ScrollView>
            <Layout style={styles.activityContainer} level="1">
              <Layout style={styles.activity}>
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
            </Layout>
            <Layout style={styles.activityContainer} level="1">
              <Layout style={styles.activity}>
                <CommentsSection idAktivnosti={this.props.id} />
              </Layout>
            </Layout>
          </ScrollView>
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
    height: '100%',
    flex: 1,
  },
  activityContainer: {
    // backgroundColor: 'transparent',
    // marginHorizontal: 15,
    // height: '100%',
    // height: '97%',
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  activity: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
  spinner: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
