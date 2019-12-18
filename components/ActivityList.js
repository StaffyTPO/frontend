import React, {Component} from 'react';
import {StyleSheet, ScrollView, RefreshControl} from 'react-native';

import {Layout, Text, Spinner} from '@ui-kitten/components';

import ActivityListItem from './ActivityListItem';

export default class ActivityList extends Component {
  state = {refreshing: false};

  componentDidMount() {
    this.handleSubmit();
  }

  handleSubmit = event => {
    const requestBody = {
      query: `
      query {
        aktivnosti (podjetjeId:1){
          id
          naslov
          opis
          prostor {
            naziv
          }
          prioriteta {
            tip
            barva
          }
          vrsta_sluzbe {
            naziv
            barva
          }
          status {
            name
          }
          koncni_datum
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
        this.setState({activities: resData.data.aktivnosti, refreshing: false});
        console.log(resData.data.aktivnosti[0]);
      })
      .catch(err => {
        console.log(err);
      });
  };

  onRefresh = () => {
    this.setState({refreshing: true});
    this.handleSubmit();
  };

  render() {
    return (
      <Layout style={styles.container} level="3">
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }>
          <Layout style={styles.activityList}>
            {this.state.activities ? ( //tole se uporabi da obstaja nek activities array
              this.state.activities.map((activity, index) => {
                //z mapom si pomagamo da array iteriramo na posamezne komponente
                return (
                  <ActivityListItem
                    key={index} //uporabimo komponento ter dolocimo propse,
                    title={activity.naslov} //title se bo uporabil v otroku
                    prioriteta={activity.prioriteta}
                    komentar={activity.opis}
                    prostor={activity.prostor}
                    id={activity.id}></ActivityListItem>
                );
              })
            ) : (
              <Layout style={styles.spinner}>
                <Spinner />
              </Layout>
            )}
          </Layout>
        </ScrollView>
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
});
