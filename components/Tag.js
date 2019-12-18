import React from 'react';
import {StyleSheet} from 'react-native';
import {Layout, Text} from '@ui-kitten/components';

export default function Tag(props) {
  const styles = StyleSheet.create({
    tag: {
      backgroundColor: props.barva,
      paddingHorizontal: 14,
      paddingVertical: 4,
      borderRadius: 5,
      marginRight: 10,
    },
    text: {
      color: 'white',
      textTransform: 'uppercase',
    },
  });

  return (
    <Layout style={styles.tag}>
      <Text category="label" style={styles.text}>
        {props.tekst}
      </Text>
    </Layout>
  );
}
