import React, {Component} from 'react';
import {StyleSheet, ScrollView} from 'react-native';

import {
  Layout,
  Text,
  Select,
  Spinner,
  Icon,
  Datepicker,
  Input,
  Button,
} from 'react-native-ui-kitten';

const CalendarIcon = style => <Icon {...style} name="calendar" />;
const AddIcon = style => <Icon {...style} name="plus-outline" />;

export default class AddNew extends Component {
  state = {
    prostori: '',
    oznacenProstor: '',
    loading: true,
    canSubmit: false,
  };

  componentDidMount() {
    this.handleSubmit();
  }

  handleSubmit = event => {
    const requestBody = {
      query: `
      query {
        prostori(podjetjeId: 1) {
          id
          naziv
        }
      }
      `,
    };

    console.log(requestBody);

    fetch('https://staffy-app.herokuapp.com/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData.data.prostori);
        let prostori = resData.data.prostori;
        let output = prostori.map(s => ({text: s.naziv, id: s.id}));
        this.setState({
          prostori: output,
          loading: false,
        });
        console.log(output);
      })
      .catch(err => {
        console.log(err);
      });
  };

  setSelectedOption = e => {
    console.log(e);

    this.setState({oznacenProstor: e});
  };

  render() {
    return (
      <Layout style={styles.container} level="3">
        {/* <ScrollView> */}
        <Layout style={styles.formContainer}>
          {this.state.loading ? (
            <Layout style={styles.spinner}>
              <Spinner />
            </Layout>
          ) : (
            <Layout style={styles.flex}>
              <Layout style={styles.form}>
                <Text style={styles.formLabel} category="label">
                  Naslov
                </Text>
                <Input
                  style={styles.formItem}
                  placeholder="Place your Text"
                  // value={value}
                  // onChangeText={setValue}
                />
                <Text style={styles.formLabel} category="label">
                  Opis
                </Text>
                <Input
                  style={styles.formItem}
                  placeholder="Place your Text"
                  // value={value}
                  // onChangeText={setValue}
                />
                <Text style={styles.formLabel} category="label">
                  Prioriteta
                </Text>
                <Select
                  style={styles.formItem}
                  data={this.state.prostori}
                  selectedOption={this.state.oznacenProstor}
                  onSelect={this.setSelectedOption}></Select>
                <Text style={styles.formLabel} category="label">
                  Prostor
                </Text>
                <Select
                  style={styles.formItem}
                  data={this.state.prostori}
                  selectedOption={this.state.oznacenProstor}
                  onSelect={this.setSelectedOption}></Select>
                <Text style={styles.formLabel} category="label">
                  Vrsta službe
                </Text>
                <Select
                  style={styles.formItem}
                  data={this.state.prostori}
                  selectedOption={this.state.oznacenProstor}
                  onSelect={this.setSelectedOption}></Select>
                <Text style={styles.formLabel} category="label">
                  Končni rok
                </Text>
                <Datepicker
                  style={styles.formItem}
                  placeholder="Pick Date"
                  // date={date}
                  // onSelect={setDate}
                  icon={CalendarIcon}
                />
              </Layout>
              <Layout style={styles.form}>
                <Button
                  icon={AddIcon}
                  style={styles.dodajButton}
                  disabled={this.state.canSubmit}>
                  DODAJ NOVO AKTIVNOST
                </Button>
              </Layout>
            </Layout>
          )}
        </Layout>
        {/* </ScrollView> */}
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flex: 1,
  },
  formContainer: {
    height: '97%',
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  form: {
    marginVertical: 15,
    marginHorizontal: 15,
  },
  formItem: {
    marginBottom: 15,
  },
  formLabel: {marginBottom: 5},
  spinner: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dodajButton: {
    width: '100%',
  },
  flex: {
    height: '100%',
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
});
