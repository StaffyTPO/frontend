import React, {Component} from 'react';
import {StyleSheet, TouchableWithoutFeedback} from 'react-native';

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
            Actions.activityOverview({
              id: this.props.id,
            })
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
            <Layout>
              <Text status="primary" category="h5" style={{fontWeight: 'bold'}}>
                {this.props.title}
              </Text>
              <Text numberOfLines={2}>{this.props.komentar}</Text>
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
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
});
