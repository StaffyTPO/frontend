import React, {Component} from 'react';
import {StyleSheet, TouchableWithoutFeedback} from 'react-native';

import {Layout, Text} from 'react-native-ui-kitten';
import Tag from './Tag';

import {Actions} from 'react-native-router-flux';

export default class ActivityListItem extends Component {
  render() {
    return (
      <React.Fragment>
        <TouchableWithoutFeedback
          onPress={() =>
            Actions.activityOverview({
              id: this.props.id,
            })
          }>
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
              <Text status="primary" category="h5">
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
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
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
