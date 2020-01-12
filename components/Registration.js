import React, {Component} from 'react';
import {StyleSheet, Image} from 'react-native';
import {Actions} from 'react-native-router-flux';

import {
  Layout,
  Text,
  Select,
  Spinner,
  Icon,
  Datepicker,
  Input,
  TopNavigation,
  TopNavigationAction,
  Button,
} from '@ui-kitten/components';
import {AsyncStorage} from 'react-native';

export default class Registration extends Component {
  state = {
    id: '',
    ime: '',
    priimek: '',
    email: '',
    geslo: '',
    telefonska: '',
    izbranoPodjetje: '',
    izbranaVrstaSluzbe: '',
    loading: true,
    uporabnik_JSON: '',
  };

  componentDidMount() {
    this.handleSubmit();
  }

  handleSubmit = event => {
    const requestBody = {
      query: `
            query {
                podjetja {
                    id
                    ime
                },
                vrsteSluzbe(podjetjeId: 1) {
                    id
                    naziv
                }
            }
            `,
    };

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
        let podjetja = resData.data.podjetja;
        let vrsteSluzbe = resData.data.vrsteSluzbe;
        podjetja = podjetja.map(s => ({id: s.id, text: s.ime}));
        vrsteSluzbe = vrsteSluzbe.map(s => ({id: s.id, text: s.naziv}));
        this.setState({
          podjetja: podjetja,
          vrsteSluzbe: vrsteSluzbe,
          loading: false,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  //Ko uporabnik izbere novo podjetje, se spremenijo vrste sluzbe, ki so na voljo
  izbranoNovoPodjetje = idPodjetja => {
    const requestBody = {
      query: `
                query {
                    vrsteSluzbe(podjetjeId: ${idPodjetja}) {
                        id
                        naziv
                    }
                }
                `,
    };
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
        let vrsteSluzbe = resData.data.vrsteSluzbe;
        vrsteSluzbe = vrsteSluzbe.map(s => ({id: s.id, text: s.naziv}));
        this.setState({
          vrsteSluzbe: vrsteSluzbe,
          loading: false,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  setSelectedPodjetje = e => {
    this.setState({izbranoPodjetje: e});
    //ko uporabnik izbere novo podjetje, lahko izbere vrste sluzbe, ki so na voljo znotraj tega podjetja
    this.izbranoNovoPodjetje(e.id);
  };

  setSelectedVrstaSluzbe = e => {
    this.setState({izbranaVrstaSluzbe: e});
  };

  //Shrani uporabnika v tabelo zaposlenih
  registrirajZaposlenega = e => {
    const body = {
      query: `
                mutation DodajanjeZaposlenega(
                    $uporabnik_id: Int,
                    $vrstaSluzbe_id: Int
                    ){
                    dodajZaposlenega(
                        uporabnik_id: $uporabnik_id,
                        vrstaSluzbe_id: $vrstaSluzbe_id
                    ){
                        uporabnik
                        vrsta_sluzbe
                    }
                }
                `,
      variables: {
        uporabnik_id: parseInt(this.state.id),
        vrstaSluzbe_id: parseInt(this.state.izbranaVrstaSluzbe.id),
      },
    };

    fetch('https://staffy-app.herokuapp.com/graphql', {
      method: 'POST',
      body: JSON.stringify(body),
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
        AsyncStorage.setItem('user', JSON.stringify(this.state.uporabnik_JSON));
        Actions.replace('mainPage');
      })
      .catch(err => {
        console.log(err);
      });
  };

  //Nastavi id pravkar registriranega uporabnika
  uporabnikov_id = e => {
    const requestBody = {
      query: `
            query {
              registriranUporabnik (email: "${this.state.email}", geslo: "${this.state.geslo}") {
                id
                ime
                priimek
                email
                password
                podjetje
                telefon
              }
            }
            `,
    };

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
        this.setState({
          id: resData.data.registriranUporabnik.id,
          uporabnik_JSON: resData.data.registriranUporabnik,
        });
        this.registrirajZaposlenega();
      })
      .catch(err => {
        console.log(err);
      });
  };

  //Registrira uporabnika v bazo
  registrirajUporabnika = e => {
    const requestBody = {
      query: `
            mutation DodajAktivnost(
                $ime: String,
                $priimek: String,
                $slika: String,
                $telefon: String,
                $email: String,
                $geslo: String,
                $podjetje: Int
                ){
                dodajUporabnika(
                    ime: $ime,
                    priimek: $priimek,
                    slika: $slika,
                    telefon: $telefon,
                    email: $email, 
                    password: $geslo,
                    podjetje: $podjetje
                ){
                    ime
                    priimek
                    password
                    telefon
                }
              }
                `,
      variables: {
        ime: this.state.ime,
        priimek: this.state.priimek,
        slika: '',
        telefon: this.state.telefonska,
        email: this.state.email,
        geslo: this.state.geslo,
        podjetje: Number(this.state.izbranoPodjetje.id),
      },
    };

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
        this.uporabnikov_id();
      })
      .catch(err => {
        console.log(err);
      });
  };

  preveriVpisanePodatke = e => {
    var ustrezno = false;
    if (
      this.state.ime.length >= 1 &&
      this.state.priimek.length >= 1 &&
      this.state.email.length >= 7 &&
      this.state.geslo.length >= 6 &&
      this.state.izbranoPodjetje != '' &&
      this.state.izbranaVrstaSluzbe != ''
    ) {
      ustrezno = true;
    }
    if (ustrezno) {
      this.registrirajUporabnika();
    }
  };

  setIme = e => {
    this.setState({ime: e});
  };

  setPriimek = e => {
    this.setState({priimek: e});
  };

  setEmail = e => {
    this.setState({email: e});
  };

  setPassword = e => {
    this.setState({geslo: e});
  };

  setTelephoneNumber = e => {
    this.setState({telefonska: e});
  };

  render() {
    const BackIcon = style => <Icon {...style} name="arrow-back" />;
    const BackAction = () => (
      <TopNavigationAction onPress={() => Actions.pop()} icon={BackIcon} />
    );
    return (
      <Layout style={styles.container} level="3">
        <TopNavigation leftControl={BackAction()} title="Back" />
        <Layout style={styles.formContainer}>
          {this.state.loading ? (
            <Layout style={styles.spinner}>
              <Spinner />
            </Layout>
          ) : (
            <Layout style={styles.form}>
              <Input
                style={styles.formItem}
                placeholder="Ime"
                onChangeText={this.setIme}></Input>
              <Input
                style={styles.formItem}
                placeholder="Priimek"
                onChangeText={this.setPriimek}></Input>
              <Input
                style={styles.formItem}
                placeholder="E-posta"
                onChangeText={this.setEmail}></Input>
              <Input
                style={styles.formItem}
                secureTextEntry={true}
                placeholder="Geslo"
                onChangeText={this.setPassword}></Input>
              <Select
                placeholder="Podjetje"
                style={styles.formItem}
                data={this.state.podjetja}
                selectedOption={this.state.izbranoPodjetje}
                onSelect={this.setSelectedPodjetje}></Select>
              <Select
                placeholder="Vaš položaj v podjetju"
                style={styles.formItem}
                data={this.state.vrsteSluzbe}
                selectedOption={this.state.izbranaVrstaSluzbe}
                onSelect={this.setSelectedVrstaSluzbe}></Select>
              <Input
                style={styles.formItem}
                keyboardType="number-pad"
                maxLength={9}
                placeholder="Telefonska številka"
                onChangeText={this.setTelephoneNumber}></Input>
              <Button onPress={this.preveriVpisanePodatke}>REGISTER</Button>
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
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
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
  form: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
