import React, {Component} from 'react';
import {StyleSheet, ScrollView, Image} from 'react-native';
import Moment from 'moment';

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
import Tag from './Tag';

export default class ActivityOverview extends Component {
  state = {aktivnost: ''};

  componentDidMount() {
    this.handleSubmit();
    //console.log(this.state.aktivnost);
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
                  barva
                }
                koncni_datum
                vrsta_sluzbe {
                  naziv
                }
                slika {
                  url
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
        this.setState({
          aktivnost: resData.data.aktivnostIDja,
          slika: resData.data.slike,
        });
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
                <Text status="primary" category="h5" style={styles.title}>
                  {this.state.aktivnost.naslov}
                </Text>
                <Layout style={styles.row}>
                  {this.state.aktivnost.prioriteta && (
                    <Tag
                      tekst={this.state.aktivnost.prioriteta.tip}
                      barva={this.state.aktivnost.prioriteta.barva}
                    />
                  )}
                  {this.state.aktivnost.prostor && (
                    <Text style={{fontWeight: 'bold'}}>
                      {this.state.aktivnost.prostor.naziv}
                    </Text>
                  )}
                </Layout>
                {this.state.aktivnost.koncni_datum != null && (
                  <Text style={{marginBottom: 20}}>
                    {Moment(this.state.aktivnost.koncni_datum).format(
                      'D MMMM YYYY',
                    )}
                  </Text>
                )}
                <Text style={{textAlign: 'justify', marginBottom: 20}}>
                  {this.state.aktivnost.opis}
                </Text>
                {this.state.aktivnost.vrsta_sluzbe && (
                  <Text>
                    Zadolžitev: {this.state.aktivnost.vrsta_sluzbe.naziv}
                  </Text>
                )}
                {this.state.aktivnost.slika && (
                  <Image
                    style={styles.slika}
                    source={{
                      uri: this.state.aktivnost.slika.url.replace(
                        'v1577046263',
                        'w_1000,f_auto',
                      ),
                    }}
                  />
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

  title: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  activity: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 5,
  },
  spinner: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slika: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
});
