import React from 'react';
import {StyleSheet} from 'react-native';
import {Layout, Text, Avatar} from 'react-native-ui-kitten';

export default function Comment(props) {
  const styles = StyleSheet.create({
    container: {
      marginBottom: 10,
      paddingVertical: 5,
      paddingHorizontal: 7,
      borderRadius: 10,
    },
    text: {},
    row: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      marginBottom: 3,
    },
    rowFlex: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    marginRight: {
      marginRight: 10,
    },
    avatar: {
      marginRight: 10,
      marginTop: 7,
    },
    desnaStran: {
      width: '90%',
    },
  });

  return (
    <Layout style={styles.container}>
      <Layout style={styles.row}>
        <Avatar
          size="small"
          style={styles.avatar}
          source={{uri: props.uporabnik.slika}}
        />
        <Layout style={styles.desnaStran}>
          <Layout style={styles.rowFlex}>
            <Text category="s1" style={styles.marginRight}>
              {props.uporabnik.ime} {props.uporabnik.priimek}
            </Text>
            <Text category="c1">{props.datum}</Text>
          </Layout>
          <Text style={styles.text}>{props.sporocilo}</Text>
        </Layout>
      </Layout>
    </Layout>
  );
}
