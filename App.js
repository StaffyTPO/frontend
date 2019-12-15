/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
} from 'react-native';

import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {mapping, light as lightTheme} from '@eva-design/eva';

import {
  ApplicationProvider,
  IconRegistry,
  Layout,
  BottomNavigation,
  BottomNavigationTab,
  Text,
} from 'react-native-ui-kitten';
import {Router, Scene, Tabs} from 'react-native-router-flux';

import TabComponent from './components/TabComponent';

import ActivityOverview from './components/ActivityOverview';
import ActivityList from './components/ActivityList';

const App = () => {
  return (
    <React.Fragment>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider mapping={mapping} theme={lightTheme}>
        <SafeAreaView />
        <Router>
          <Scene key="root" hideNavBar={true}>
            <Tabs key="tabbar" tabs={true} tabBarComponent={TabComponent}>
              <Scene key="home" title="HOME">
                <Scene
                  initial={true}
                  hideNavBar={true}
                  key="homePage"
                  component={ActivityList}></Scene>
                <Scene
                  hideNavBar={true}
                  key="activityOverview"
                  component={ActivityOverview}></Scene>
              </Scene>
            </Tabs>
          </Scene>
        </Router>
        {/* <Layout style={styles.main} level="4">
          <ActivityList></ActivityList>
          <ActivityOverview></ActivityOverview>
        </Layout> */}
      </ApplicationProvider>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  main: {
    height: '100%',
    width: '100%',
  },
});

export default App;
