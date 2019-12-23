import React, { Component } from 'react';
import { StyleSheet, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';

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

export default class Registration extends Component {

    state = {
        ime: '',
        priimek: '',
        email: '',
        geslo: '',
        telefonska: '',
        izbranoPodjetje: '',
        izbranaVrstaSluzbe: '',
        loading: true
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
                podjetja = podjetja.map(s => ({ id: s.id, text: s.ime }));
                vrsteSluzbe = vrsteSluzbe.map(s => ({ id: s.id, text: s.naziv }));
                this.setState({
                    podjetja: podjetja,
                    vrsteSluzbe: vrsteSluzbe,
                    loading: false
                });
            })
            .catch(err => {
                console.log(err);
            });
    };

    izbranoNovoPodjetje = (idPodjetja) => {
        const requestBody = {
            query: `
                query {
                    vrsteSluzbe(podjetjeId: ${idPodjetja}) {
                        id
                        naziv
                    }
                }
                `
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
                vrsteSluzbe = vrsteSluzbe.map(s => ({ id: s.id, text: s.naziv }));
                this.setState({
                    vrsteSluzbe: vrsteSluzbe,
                    loading: false
                });
            })
            .catch(err => {
                console.log(err);
            });
    };

    setSelectedPodjetje = e => {
        this.setState({ izbranoPodjetje: e })
        //ko uporabnik izbere novo podjetje, lahko izbere vrste sluzbe, ki so na voljo znotraj tega podjetja
        this.izbranoNovoPodjetje(e.id);
    }

    setSelectedVrstaSluzbe = e => {
        this.setState({ izbranaVrstaSluzbe: e })
    }

    registrirajUporabnika = e => {

        //console.log(this.state.izbranoPodjetje.id);

        //addUporabnik(args.ime, args.priimek, args.slika, args.telefon, args.email, args.password, args.podjetje)

        /*
        const requestBody = {
            query: `
            mutation {
                dodajUporabnika (
                    ime: "${this.state.ime}",
                    priimek: "${this.state.priimek}",
                    slika: "",
                    telefon: "${this.state.telefonska}",
                    email: "${this.state.email}", 
                    geslo: "${this.state.geslo}",
                    podjetje: "${this.state.izbranoPodjetje.id}"
                ) {
                    id
                    ime
                    priimek
                    slika
                    telefon
                    email
                    password
              }
            }
            `,
        };
        */

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
                slika: "",
                telefon: this.state.telefonska,
                email: this.state.email,
                geslo: this.state.geslo,
                podjetje: Number(this.state.izbranoPodjetje.id)
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
                console.log(resData.data);
            })
            .catch(err => {
                console.log(err);
            });
    }

    setIme = e => {
        this.setState({ ime: e })
    }

    setPriimek = e => {
        this.setState({ priimek: e })
    }

    setEmail = e => {
        this.setState({ email: e })
    }

    setPassword = e => {
        this.setState({ geslo: e })
    }

    setTelephoneNumber = e => {
        this.setState({ telefonska: e })
    }

    render() {
        const BackIcon = style => <Icon {...style} name="arrow-back" />;
        const BackAction = () => (
            <TopNavigationAction onPress={() => Actions.pop()} icon={BackIcon} />
        );
        return (
            <Layout style={styles.container} level="3">
                <Layout style={styles.formContainer}>
                    {this.state.loading ? (
                        <Layout style={styles.spinner}>
                            <Spinner />
                        </Layout>
                    ) : (
                            <Layout>
                                <TopNavigation leftControl={BackAction()} title="Back" />
                                <Input
                                    style={styles.formItem}
                                    placeholder="Ime"
                                    onChangeText={this.setIme}>
                                </Input>
                                <Input
                                    style={styles.formItem}
                                    placeholder="Priimek"
                                    onChangeText={this.setPriimek}>
                                </Input>
                                <Input
                                    style={styles.formItem}
                                    placeholder="E-posta"
                                    onChangeText={this.setEmail}>
                                </Input>
                                <Input
                                    style={styles.formItem}
                                    secureTextEntry={true}
                                    placeholder="Geslo"
                                    onChangeText={this.setPassword}>
                                </Input>
                                <Select
                                    placeholder="Podjetje"
                                    style={styles.formItem}
                                    data={this.state.podjetja}
                                    selectedOption={this.state.izbranoPodjetje}
                                    onSelect={this.setSelectedPodjetje}
                                ></Select>
                                <Select
                                    placeholder="Vaš položaj v podjetju"
                                    style={styles.formItem}
                                    data={this.state.vrsteSluzbe}
                                    selectedOption={this.state.izbranaVrstaSluzbe}
                                    onSelect={this.setSelectedVrstaSluzbe}
                                ></Select>
                                <Input
                                    style={styles.formItem}
                                    keyboardType="number-pad"
                                    maxLength={9}
                                    placeholder="Telefonska številka"
                                    onChangeText={this.setTelephoneNumber}>
                                </Input>
                                <Button
                                    onPress={this.registrirajUporabnika}>
                                    REGISTER
                                </Button>
                            </Layout>
                        )}
                </Layout>
            </Layout>
        );
    };
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
    formLabel: { marginBottom: 5 },
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
    }
});