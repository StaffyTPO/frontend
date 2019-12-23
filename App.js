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

import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { mapping, light as lightTheme, dark as darkTheme } from '@eva-design/eva';

import {
  ApplicationProvider,
  IconRegistry,
  Layout,
  BottomNavigation,
  BottomNavigationTab,
  Text,
} from '@ui-kitten/components';
import { Router, Scene, Tabs, Stack } from 'react-native-router-flux';

import TabComponent from './components/TabComponent';

import ActivityOverview from './components/ActivityOverview';
import ActivityList from './components/ActivityList';
import AddNew from './components/AddNew';
import Login from './components/Login';
import Profile from './components/Profile';
import Registration from './components/Registration';

const App = () => {
  return (
    <React.Fragment>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider mapping={mapping} theme={lightTheme}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <SafeAreaView />
        <Router>
          <Scene key="root" hideNavBar={true}>
            <Scene key="loginPage" hideNavBar={true}>
              <Scene component={Login}></Scene>
            </Scene>

            <Scene key="registrationPage" hideNavBar={true}>
              <Scene component={Registration}></Scene>
            </Scene>

            <Scene key="mainPage" hideNavBar={true}>
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

                <Scene key="profile" title="PROFIL">
                  <Scene
                    initial={true}
                    hideNavBar={true}
                    key="goToProfile"
                    component={Profile}></Scene>
                </Scene>
              </Tabs>
            </Scene>
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
});

export default App;
