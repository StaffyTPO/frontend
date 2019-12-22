import React, {Component} from 'react';
import {StyleSheet, Image, TouchableWithoutFeedback} from 'react-native';

import {
  Layout,
  Text,
  Select,
  Spinner,
  Icon,
  Datepicker,
  Input,
  Button,
} from '@ui-kitten/components';

import uploadImage from './Upload';

import {Actions} from 'react-native-router-flux';

import ImagePicker from 'react-native-image-picker';
import {ScrollView} from 'react-native-gesture-handler';

const CalendarIcon = style => <Icon {...style} name="calendar-outline" />;
const AddIcon = style => <Icon {...style} name="plus-outline" />;
const ImageIcon = style => <Icon {...style} name="image-outline" />;

export default class AddNew extends Component {
  state = {
    naslov: '',
    opis: '',
    oznacenProstor: '',
    oznacenaVrstaSluzbe: '',
    oznacenaPrioriteta: '',
    koncniRok: '',
    loading: true,
    imageSource: null,
    uploading: false,
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
        vrsteSluzbe(podjetjeId: 1) {
          id
          naziv
        }
        prioritete(podjetjeId: 1) {
          id
          tip
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
        let prostori = resData.data.prostori;
        let vrsteSluzbe = resData.data.vrsteSluzbe;
        let prioritete = resData.data.prioritete;
        prostori = prostori.map(s => ({text: s.naziv, id: s.id}));
        vrsteSluzbe = vrsteSluzbe.map(s => ({text: s.naziv, id: s.id}));
        prioritete = prioritete.map(s => ({text: s.tip, id: s.id}));
        this.setState({
          prostori: prostori,
          vrsteSluzbe: vrsteSluzbe,
          prioritete: prioritete,
          loading: false,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  setSelectedOptionProstor = e => {
    this.setState({oznacenProstor: e});
  };
  setSelectedOptionVrstaSluzbe = e => {
    this.setState({oznacenaVrstaSluzbe: e});
  };
  setSelectedOptionPrioriteta = e => {
    this.setState({oznacenaPrioriteta: e});
  };
  setDate = e => {
    this.setState({koncniRok: e});
  };
  setNaslov = e => {
    this.setState({naslov: e});
  };
  setOpis = e => {
    this.setState({opis: e});
  };
  resetImagePicker = e => {
    this.setState({
      imageSource: null,
    });
  };

  dodajAktivnost = () => {
    console.log(
      this.state.naslov,
      this.state.opis,
      this.state.oznacenProstor,
      this.state.oznacenaVrstaSluzbe,
      this.state.oznacenaPrioriteta,
      this.state.koncniRok,
    );

    const requestBody = {
      query: `
      mutation DodajAktivnost(
        $naslov: String,
        $opis: String,
        $prostor: Int,
        $prioriteta: Int,
        $vrsta_sluzbe: Int,
        $koncni_datum: String
        ){
        dodajAktivnost(
          naslov: $naslov,
          opis: $opis,
          prostor: $prostor,
          prioriteta: $prioriteta,
          vrsta_sluzbe: $vrsta_sluzbe,
          koncni_datum: $koncni_datum,
          podjetje: 1) {
            id
            naslov
            opis
        }
      }
      `,
      variables: {
        naslov: this.state.naslov,
        opis: this.state.opis,
        prostor: Number(this.state.oznacenProstor.id),
        prioriteta: Number(this.state.oznacenaPrioriteta.id),
        vrsta_sluzbe: Number(this.state.oznacenaVrstaSluzbe.id),
        koncni_datum: this.state.koncniRok.toString(),
      },
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
          throw new Error('Failed!', res.status);
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData.data);
        this.setState({
          naslov: '',
          opis: '',
          oznacenProstor: {},
          oznacenaVrstaSluzbe: {},
          oznacenaPrioriteta: {},
          koncniRok: '',
          novaAktivnost: resData.data.dodajAktivnost.id,
        });
        this.dodajSliko(resData.data.dodajAktivnost.id);
      })
      .catch(err => {
        console.log(err);
      });
  };

  dodajSliko = IDAktivnosti => {
    const requestBody = {
      query: `
      mutation {
        dodajSliko(url:"${this.state.slika}",
        aktivnost:${Number(IDAktivnosti)}){
          id
          url
          aktivnost
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
        console.log(resData.data);
        Actions.homePage();
      })
      .catch(err => {
        console.log(err);
      });
  };

  selectImage = async () => {
    this.setState({uploading: true});

    ImagePicker.showImagePicker(
      {noData: true, mediaType: 'photo'},
      response => {
        // console.log('Response = ', response);

        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          // You can also display the image using data:
          // const source = { uri: 'data:image/jpeg;base64,' + response.data };
          this.setState({
            imageSource: response.uri,
          });

          uploadImage(response.uri, result => {
            if (result) {
              console.log(result);
              this.setState({slika: result, uploading: false});
            }
          });
        }
      },
    );
  };

  render() {
    return (
      <Layout style={styles.container} level="3">
        <Layout style={styles.formContainer}>
          {this.state.loading ? (
            <Layout style={styles.spinner}>
              <Spinner />
            </Layout>
          ) : (
            <Layout style={styles.flex}>
              <ScrollView>
                <Layout style={styles.form}>
                  <Text style={styles.formLabel} category="label">
                    Naslov
                  </Text>
                  <Input
                    style={styles.formItem}
                    placeholder="Dodaj naslov aktivnosti"
                    value={this.state.naslov}
                    onChangeText={this.setNaslov}
                  />
                  <Text style={styles.formLabel} category="label">
                    Opis
                  </Text>
                  <Input
                    style={styles.formItem}
                    placeholder="Opiši zakaj je potrebna aktivnost"
                    value={this.state.opis}
                    onChangeText={this.setOpis}
                  />
                  <Text style={styles.formLabel} category="label">
                    Prioriteta
                  </Text>
                  <Select
                    style={styles.formItem}
                    data={this.state.prioritete}
                    selectedOption={this.state.oznacenaPrioriteta}
                    onSelect={this.setSelectedOptionPrioriteta}></Select>
                  <Text style={styles.formLabel} category="label">
                    Prostor
                  </Text>
                  <Select
                    style={styles.formItem}
                    data={this.state.prostori}
                    selectedOption={this.state.oznacenProstor}
                    onSelect={this.setSelectedOptionProstor}></Select>
                  <Text style={styles.formLabel} category="label">
                    Vrsta službe
                  </Text>
                  <Select
                    style={styles.formItem}
                    data={this.state.vrsteSluzbe}
                    selectedOption={this.state.oznacenaVrstaSluzbe}
                    onSelect={this.setSelectedOptionVrstaSluzbe}></Select>
                  <Text style={styles.formLabel} category="label">
                    Končni rok
                  </Text>
                  <Datepicker
                    style={styles.formItem}
                    placeholder="Pick Date"
                    date={this.state.koncniRok}
                    onSelect={this.setDate}
                    icon={CalendarIcon}
                  />
                  <Text style={styles.formLabel} category="label">
                    Slika
                  </Text>
                  <Layout style={styles.multipleImagesContainer}>
                    {this.state.imageSource && (
                      <Image
                        style={styles.imageContainer}
                        source={{uri: this.state.imageSource}}></Image>
                    )}
                    <TouchableWithoutFeedback onPress={this.selectImage}>
                      <Layout style={styles.addImageButton}>
                        <Text
                          style={styles.addImageButtonText}
                          appearance="hint">
                          Dodaj Sliko
                        </Text>
                        <Icon
                          name="image-outline"
                          width={25}
                          height={25}
                          fill="#8f9bb3"
                        />
                      </Layout>
                    </TouchableWithoutFeedback>
                  </Layout>
                </Layout>
              </ScrollView>
              <Layout style={styles.form}>
                <Button
                  onPress={this.dodajAktivnost /*&& this.resetImagePicker*/}
                  icon={AddIcon}
                  style={styles.dodajButton}
                  disabled={
                    !this.state.naslov ||
                    !this.state.opis ||
                    this.state.uploading
                  }>
                  DODAJ NOVO AKTIVNOST
                </Button>
              </Layout>
            </Layout>
          )}
        </Layout>
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
  dodajImageButton: {
    width: '50%',
  },
  imageContainer: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 4,
    marginRight: 15,
  },
  addImageButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f9fc',
    width: 150,
    height: 150,
    borderRadius: 4,
    borderColor: '#e4e9f2',
    borderWidth: 1,
  },
  addImageButtonText: {
    marginRight: 10,
  },
  multipleImagesContainer: {
    flexDirection: 'row',
  },
});
