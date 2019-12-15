import React, {Component} from 'react';
import {StyleSheet, TouchableWithoutFeedback} from 'react-native';

import {Layout, Text} from 'react-native-ui-kitten';

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
            <Text category="h5">{this.props.title}</Text>
            <Text>{this.props.komentar}</Text>
            {this.props.drek && <Text>{this.props.drek}</Text>}
          </Layout>
        </TouchableWithoutFeedback>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
});
