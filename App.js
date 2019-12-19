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
import {mapping, light as lightTheme, dark as darkTheme} from '@eva-design/eva';

import {
  ApplicationProvider,
  IconRegistry,
  Layout,
  BottomNavigation,
  BottomNavigationTab,
  Text,
} from '@ui-kitten/components';
import {Router, Scene, Tabs} from 'react-native-router-flux';

import TabComponent from './components/TabComponent';

import ActivityOverview from './components/ActivityOverview';
import ActivityList from './components/ActivityList';
import AddNew from './components/AddNew';

const App = () => {
  return (
    <React.Fragment>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider mapping={mapping} theme={lightTheme}>
        <StatusBar backgroundColor='white' barStyle="dark-content" />
        <SafeAreaView style={styles.safe_area} />
        <Router>
          <Scene key="root" hideNavBar={true}>
            <Tabs key="tabbar" tabs={true} tabBarComponent={TabComponent}>
              <Scene key="home" title="DOMOV">
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
              <Scene key="add" title="DODAJ">
                <Scene
                  initial={true}
                  hideNavBar={true}
                  key="addNewPage"
                  component={AddNew}></Scene>
              </Scene>
            </Tabs>
          </Scene>
        </Router>
      </ApplicationProvider>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  main: {
    height: '100%',
    width: '100%',
  },
  safe_area: {
    backgroundColor: 'red',
    flex:0,
  },
});

export default App;
