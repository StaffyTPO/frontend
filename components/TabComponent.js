import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {Actions} from 'react-native-router-flux';

import {
  Layout,
  Text,
  BottomNavigation,
  BottomNavigationTab,
  Icon,
} from 'react-native-ui-kitten';

const home = style => <Icon {...style} name="home-outline" />;
const workouts = style => <Icon {...style} name="list-outline" />;
const statistics = style => <Icon {...style} name="trending-up-outline" />;

export default class TabComponents extends React.Component {
  state = {
    icons: [home, workouts, statistics],
  };
  render() {
    const {state} = this.props.navigation;
    const activeTabIndex = state.index;

    return (
      <React.Fragment>
        <BottomNavigation
          appearance="noIndicator"
          selectedIndex={activeTabIndex}
          onSelect={e => Actions[state.routes[e].key]()}>
          {state.routes.map((element, index) => (
            <BottomNavigationTab
              icon={this.state.icons[index]}
              title={element.key.toUpperCase()}
              key={element.key}
            />
          ))}
        </BottomNavigation>
        <SafeAreaView style={styles.white} />
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  white: {
    backgroundColor: '#ffffff',
  },
});
