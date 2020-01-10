import React, { Component } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';

import { Layout, Text, Spinner, Button } from '@ui-kitten/components';

import ActivityListItem from './ActivityListItem';
import { unix } from 'moment';
import { AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class ActivityList extends Component {
  state = {
    refreshing: false,
    prijavljenUporabnik: null,
    vrstaSluzbe: null,
    trenutnaStran: "aktivnosti_sluzbe"
  };

  nastaviPrijavljenegaUporabnika = e => {
    AsyncStorage.getItem('user', (err, result) => {
      if (result) {
        this.setState({ prijavljenUporabnik: JSON.parse(result) });
        this.vrstaSluzbePrijavljenegaUporabnika();
      }
    });
  }

  componentDidMount() {
    this.nastaviPrijavljenegaUporabnika();
  }

  aktivnostiSluzbe = event => {
    const requestBody = {
      query: `
      query {
        aktivnostiPodaneSluzbe (idSluzbe: ${this.state.vrstaSluzbe}){
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
          slika {
            url
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
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        this.setState({
          activities: resData.data.aktivnostiPodaneSluzbe,
          refreshing: false,
          trenutnaStran: "aktivnosti_sluzbe"
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  aktivnostiUporabnika = e => {
    const requestBody = {
      query: `
      query {
        aktivnostiUporabnika (idUporabnika: ${this.state.prijavljenUporabnik.id}){
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
          slika {
            url
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
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        this.setState({
          activities: resData.data.aktivnostiUporabnika,
          refreshing: false,
          trenutnaStran: "aktivnosti_uporabnika"
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  vseAktivnostiVPodjetju = e => {
    const requestBody = {
      query: `
      query {
        aktivnosti (podjetjeId: ${this.state.prijavljenUporabnik.podjetje}){
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
          slika {
            url
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
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        this.setState({
          activities: resData.data.aktivnosti,
          refreshing: false,
          trenutnaStran: "aktivnosti_podjetja"
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  vrstaSluzbePrijavljenegaUporabnika = e => {
    const requestBody = {
      query: `
      query {
        vrstaSluzbeZaposlenegaUporabnika(id_uporabnika:${this.state.prijavljenUporabnik.id}) {
          vrsta_sluzbe
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
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        this.setState({ vrstaSluzbe: resData.data.vrstaSluzbeZaposlenegaUporabnika.vrsta_sluzbe });
        this.aktivnostiSluzbe();
      })
      .catch(err => {
        console.log(err);
      });
  };

  onRefresh = () => {
    this.setState({ refreshing: true });
    if (this.state.trenutnaStran == "aktivnosti_uporabnika")
      this.aktivnostiUporabnika();
    else if (this.state.trenutnaStran == "aktivnosti_sluzbe")
      this.aktivnostiSluzbe();
    else
      this.vseAktivnostiVPodjetju();
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
            <Layout style={styles.inlineButtons}>
              <Button onPress={this.aktivnostiSluzbe}>Tagged</Button>
              <Button onPress={this.aktivnostiUporabnika}>Your posts</Button>
              <Button onPress={this.vseAktivnostiVPodjetju}>All posts</Button>
            </Layout>
            {this.state.activities ? ( //tole se uporabi da obstaja nek activities array
              this.state.activities.map((activity, index) => {
                //z mapom si pomagamo da array iteriramo na posamezne komponente
                try {
                  //ce je status null, vrne error
                  if (activity.status.name == 'Neopravljeno')
                    return (
                      <ActivityListItem
                        key={index} //uporabimo komponento ter dolocimo propse,
                        title={activity.naslov} //title se bo uporabil v otroku
                        prioriteta={activity.prioriteta}
                        komentar={activity.opis}
                        prostor={activity.prostor}
                        slika={activity.slika}
                        id={activity.id}></ActivityListItem>
                    );
                } catch (error) {
                  // handle Error
                }
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
  inlineButtons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center"
  }
});
