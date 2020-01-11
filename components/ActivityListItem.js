import React, {Component} from 'react';
import {StyleSheet, TouchableWithoutFeedback, Image} from 'react-native';

import {Layout, Text} from '@ui-kitten/components';
import Tag from './Tag';

import {Actions} from 'react-native-router-flux';

export default class ActivityListItem extends Component {
  _onLongPressButton() {
    alert('delete activity');
  }

  render() {
    return (
      <React.Fragment>
        <TouchableWithoutFeedback
          onPress={() =>
            //Actions.activityOverview({
            //id: this.props.id,
            //})
            Actions.replace('activityOverview', {id: this.props.id})
          }
          onLongPress={this._onLongPressButton}>
          <Layout style={styles.container} level="1">
            <Layout style={styles.row}>
              {this.props.prioriteta && (
                <Tag
                  tekst={this.props.prioriteta.tip}
                  barva={this.props.prioriteta.barva}
                />
              )}
              {this.props.prostor && (
                <Text category="label">{this.props.prostor.naziv}</Text>
              )}
            </Layout>
            <Layout style={styles.rowJustifyContent}>
              <Layout>
                <Text
                  status="primary"
                  category="h5"
                  style={{fontWeight: 'bold'}}>
                  {this.props.title}
                </Text>
                <Layout style={styles.okvir}>
                  <Text numberOfLines={2}>{this.props.komentar}</Text>
                </Layout>
              </Layout>
              {this.props.slika && (
                <Image
                  style={styles.malaSlikca}
                  source={{
                    uri: this.props.slika.url.replace(
                      'v1577046263',
                      'w_100,f_auto',
                    ),
                  }}
                />
              )}
            </Layout>
          </Layout>
        </TouchableWithoutFeedback>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  okvir: {
    width: '85%',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  rowJustifyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  malaSlikca: {
    width: 60,
    height: 60,
    borderRadius: 7,
  },
});
