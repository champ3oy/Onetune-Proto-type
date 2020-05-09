import React from 'react';
import {
  Text,
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
  Platform,
  ImageBackground,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  CameraRoll
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, gStyle, device, images } from '../constants';
import Fire from '../Fire/Firebase';
import firebase from 'firebase';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';

// components
import ScreenHeader from '../components/ScreenHeader';
import TouchText from '../components/TouchText';
import TouchIcon from '../components/TouchIcon';

console.disableYellowBox = true;

let StatusBar = Platform.OS === 'ios' ? 20 : 20;

export default class Library extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // MODALS
      showModal: false,
      showModal2: false,
      uploadModal: false,

      // ACCOUNT
      user: {},
      isUserLogin: null,
      artist: 'Teephlow',

      // SIGN IN
      loginEmail: '',
      loginPasswaord: '',
      showLoginPassword: true,
      emailErrorMessage: false,
      startLoadingSignIn: false,

      // SIGN UP
      profilePhotoFile: '',
      fullName: '',
      stageName: '',
      phoneNumber: '',
      signUpEmail: '',
      singUpPassword: '',
      singUpPasswordConfirm: '',
      startLoadingSignUp: false,
      comparePasswords: false,
      profilePhotoURL: '',

      // UTIL
      settings: false,
      selectedTrack: {},
      uploadInfo: false,
      uploadProgress: '',
      uploadProgress2: '',
      imageFileName: '',
      arrayOfSongs: [],
      showMusicModal: false,
      cameraRollMusics: [],
      musicProgress: '',

      // UPLOAD DETAILS
      coverArt: '',
      releaseTitle: 'Release Title',
      featuredArtist: '',
      producer: '',
      genre: '',
      labelName: '',
      releaseYear: '',
      uploadTrack: '',
      uploadTrackName: '',

      // CAMERAL INFO
      cameraRollPictures: [],
      showCameraRollPictures: false,
      showCameraRollPictures2: false,
      uploadingProfilePhoto: false,
      uploadingProfilePhoto2: false
    };
  }

  componentWillMount() {
    Fire.auth().onAuthStateChanged(user => {
      // console.log(user);
      if (user) {
        firebase
          .database()
          .ref('/users/' + user.uid + '/songs')
          .on('value', snapshot => {
            let arr = [];

            snapshot.forEach(child => {
              arr.push(child.toJSON());
            });

            this.setState({ arrayOfSongs: arr });
            // console.log(this.state.arrayOfSongs)
          });
      }
      user
        ? firebase
            .database()
            .ref('/users/' + firebase.auth().currentUser.uid)
            .on('value', snapshot => {
              // console.log(snapshot.val());
              // console.log('state<<<<<>>>>>', this.state.user);
              this.setState({
                isUserLogin: true,
                user: snapshot.val()
              });
            })
        : this.setState({
            isUserLogin: false
          });
    });
  }

  render() {
    let validateEmail = email => {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    };

    let data = [
      {
        id: 1,
        image: require('./albums/ex-re.jpg'),
        released: 2012,
        title: 'Preach',
        downloads: 161,
        streams: 96
      },
      {
        id: 2,
        image: require('./albums/born-to-die.jpg'),
        released: 2012,
        title: 'State of the art',
        downloads: 161,
        streams: 96
      },
      {
        id: 3,
        image: require('./albums/blank-face-lp.jpg'),
        released: 2012,
        title: 'Phlowducation',
        downloads: 161,
        streams: 96
      }
    ];

    if (this.state.isUserLogin === true) {
      return (
        <React.Fragment>
          <Modal
            animationType={'slide'}
            visible={this.state.settings}
            onRequestClose={() => {
              this.setState({ settings: false });
            }}
            transparent={true}
            style={{
              flex: 1
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  settings: false
                });
              }}
            >
              <View style={{ height: '70%' }} />
            </TouchableOpacity>

            <View
              style={{
                flex: 2
              }}
            >
              <View
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 5
                }}
              >
                <View
                  style={{
                    width: 80,
                    height: 10,
                    borderRadius: 50,
                    backgroundColor: colors.brandPrimary
                  }}
                />
              </View>
              <View
                style={{
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  backgroundColor: '#eee',
                  height: '100%',
                  padding: 20
                  // justifyContent: 'center'
                  // alignItems: 'center'
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center'
                      // justifyContent: 'space-between'
                    }}
                  >
                    <Image
                      source={{ uri: this.state.selectedTrack.image }}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 40,
                        marginRight: 10
                      }}
                    />
                    <View>
                      <Text
                        style={{
                          color: 'black',
                          fontWeight: 'bold',
                          fontSize: 20
                        }}
                      >
                        {this.state.selectedTrack.title}
                      </Text>
                      <Text
                        style={{
                          color: 'gray',
                          fontSize: 13,
                          fontWeight: 'bold'
                        }}
                      >
                        {this.state.selectedTrack.artist}{' '}
                        <Text
                          style={{
                            color: 'gray',
                            fontSize: 13,
                            fontWeight: 'normal'
                          }}
                        >
                          {this.state.selectedTrack.featuredArtist
                            ? 'feat ' + this.state.selectedTrack.featuredArtist
                            : ''}
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>
                <View>
                  <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                    <Feather
                      color="black"
                      style={{ marginRight: 10 }}
                      size={20}
                      name="bar-chart-2"
                    />

                    <Text
                      style={{
                        color: 'black',
                        fontSize: 18,
                        marginRight: 15
                      }}
                    >
                      Downloads: {this.state.selectedTrack.downloads}
                    </Text>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 18
                      }}
                    >
                      Streams: {this.state.selectedTrack.streams}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 16 }}>
                    Released:{' '}
                    <Text style={{ fontWeight: 'bold' }}>
                      {this.state.selectedTrack.released}
                    </Text>
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      // firebase
                      //   .database()
                      //   .ref(
                      //     '/users/' +
                      //       firebase.auth().currentUser.uid +
                      //       '/songs/' +
                      //       this.state.selectedTrack.title
                      //   )
                      //   .remove();
                      alert(
                        'Action can not be taken at this time, try agian later'
                      );
                    }}
                    style={{
                      flexDirection: 'row',
                      marginVertical: 10,
                      backgroundColor: 'rgba(0, 0, 0, 0.1)',
                      borderRadius: 50,
                      width: 130,
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 2
                    }}
                  >
                    <Feather name="trash-2" color="red" size={16} />
                    <Text style={{ color: 'red', marginLeft: 8, fontSize: 16 }}>
                      Delete Track
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <View
            style={[
              gStyle.container,
              {
                paddingTop: 20 + StatusBar,
                height: '100%',
                width: '100%',
                paddingHorizontal: 15
              }
            ]}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                  // justifyContent: 'space-between'
                }}
              >
                <Image
                  source={{ uri: this.state.user.profilePhotoURL }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 40,
                    marginRight: 10
                  }}
                />
                <Text
                  style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}
                >
                  {this.state.user.stageName}
                </Text>
              </View>
              <TouchText
                onPress={() => {
                  this.setState({
                    uploadModal: true
                  });
                }}
                style={styles.btnUp}
                styleText={styles.btnTextUp}
                text="Upload song"
              />
            </View>

            <ScrollView style={{ marginTop: 20 }}>
              <Text
                style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}
              >
                Songs & Stats
              </Text>
              <View style={{ marginTop: 20 }}>
                <FlatList
                  contentContainerStyle={styles.containerContent}
                  data={this.state.arrayOfSongs.reverse()}
                  vertical
                  // keyExtractor={itemObj => itemObj.releaseTitle.toString()}
                  renderItem={itemObj => {
                    const { item } = itemObj;

                    console.log(item.image);

                    if (item) {
                      return (
                        <TouchableOpacity
                          activeOpacity={gStyle.activeOpacity}
                          hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                          onPress={() =>
                            this.setState({
                              settings: true,
                              selectedTrack: item
                            })
                          }
                          style={{
                            borderBottomWidth: 0.5,
                            borderBottomColor: 'darkgray'
                          }}
                        >
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginVertical: 14
                            }}
                          >
                            {item.image && (
                              <Image
                                source={{ uri: item.image }}
                                style={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: 25,
                                  marginRight: 15
                                }}
                              />
                            )}
                            <View>
                              <Text
                                style={{
                                  color: 'white',
                                  fontSize: 17,
                                  fontWeight: 'bold'
                                }}
                              >
                                {item.title}
                              </Text>
                              <View style={{ flexDirection: 'row' }}>
                                <Feather
                                  color="lightgray"
                                  style={{ marginRight: 10 }}
                                  size={13}
                                  name="bar-chart-2"
                                />
                                <Text
                                  style={{
                                    color: 'lightgray',
                                    fontSize: 12,
                                    marginRight: 15
                                  }}
                                >
                                  Downloads: {item.downloads}
                                </Text>
                                <Text
                                  style={{
                                    color: 'lightgray',
                                    fontSize: 12
                                  }}
                                >
                                  Streams: {item.streams}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    } else {
                      return (
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          <Feather
                            color="darkgray"
                            style={{
                              marginBottom: 10,
                              marginTop: 20,
                              fontWeight: 100
                            }}
                            size={100}
                            name="info"
                          />
                          <Text style={{ color: 'darkgray', fontSize: 20 }}>
                            No songs uploaded yet
                          </Text>
                        </View>
                      );
                    }
                  }}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            </ScrollView>
          </View>
          {/* UPLOAD MODAL */}
          <Modal
            animationType={'slide'}
            visible={this.state.uploadModal}
            onRequestClose={() => {
              this.setState({
                uploadModal: false,
                uploadTrackName: '',
                profilePhotoFile: '',
                musicProgress: '',
                uploadingProfilePhoto2: '',
                uploadProgress2: ''
              });
            }}
            transparent={false}
            style={{
              padding: 10
            }}
          >
            <View style={styles.containerHeader}>
              <View style={styles.header}>
                <TouchIcon
                  icon={
                    <Feather color={colors.brandPrimary} name="chevron-down" />
                  }
                  onPress={() =>
                    this.setState({
                      uploadModal: false,
                      uploadTrackName: false,
                      profilePhotoFile: '',
                      musicProgress: '',
                      uploadingProfilePhoto2: '',
                      uploadProgress2: ''
                    })
                  }
                />
                <TouchIcon
                  icon={<Feather color={colors.brandPrimary} name="info" />}
                  onPress={() => {
                    this.setState({ uploadInfo: true });
                  }}
                />
              </View>
            </View>
            <ScrollView
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              style={{
                width: '100%',
                flex: 1
              }}
            >
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  paddingHorizontal: 25,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <ImageBackground
                  source={
                    this.state.profilePhotoFile
                      ? { uri: this.state.profilePhotoFile }
                      : null
                  }
                  style={{
                    width: 280,
                    height: 280,
                    backgroundColor: '#eee',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 3
                  }}
                >
                  {this.state.uploadingProfilePhoto2 ? (
                    <View
                      style={{
                        width: 280,
                        height: 280,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      {this.state.uploadProgress2 == 100 ? (
                        <>
                          <Text
                            style={{
                              marginTop: 10,
                              fontSize: 25,
                              fontWeight: 'bold',
                              color: 'green'
                            }}
                          >
                            Uploaded Image
                          </Text>
                        </>
                      ) : (
                        <>
                          <ActivityIndicator
                            size={85}
                            color={colors.brandPrimary}
                          />
                          <Text
                            style={{
                              marginTop: 10,
                              fontSize: 25,
                              fontWeight: 'bold',
                              color: colors.brandPrimary
                            }}
                          >
                            {this.state.uploadProgress2}%
                          </Text>
                        </>
                      )}
                    </View>
                  ) : (
                    <>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: 'bold',
                          color: 'black',
                          marginBottom: 10
                        }}
                      >
                        Cover Art
                      </Text>
                      <TouchText
                        onPress={async () => {
                          const { status } = await Permissions.askAsync(
                            Permissions.CAMERA_ROLL
                          );

                          if (status === 'granted') {
                            try {
                              const photos = await CameraRoll.getPhotos({
                                first: 1000000,
                                assetType: 'Photos'
                              });
                              this.setState({
                                cameraRollPictures: photos.edges,
                                showCameraRollPictures2: true
                              });
                              // console.log(photos.edges[0]);
                            } catch (e) {
                              alert(e);
                            }
                          } else {
                            alert('Error');
                          }
                        }}
                        style={styles.btn}
                        styleText={styles.btnText}
                        text="Upload"
                      />
                      <Text
                        style={{
                          fontSize: 13,
                          color: 'gray',
                          // fontWeight: 'bold',
                          marginTop: 20
                          // textTransform: 'uppercase'
                        }}
                      >
                        3000px by 3000px
                      </Text>
                    </>
                  )}
                </ImageBackground>
                <Text
                  style={{
                    fontSize: 22,
                    color: colors.brandPrimary,
                    fontWeight: 'bold',
                    marginBottom: 0,
                    marginTop: 10
                  }}
                >
                  {this.state.releaseTitle}
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    color: 'gray',
                    // fontWeight: 'bold',
                    marginBottom: 20,
                    marginTop: 1,
                    textTransform: 'uppercase'
                  }}
                >
                  RELEASED BY {this.state.user.stageName}
                </Text>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => null}
                  style={styles.searchPlaceholder}
                >
                  <TextInput
                    style={styles.searchPlaceholderText}
                    placeholder="Release Title"
                    value={this.state.releaseTitle}
                    onChangeText={val => {
                      this.setState({ releaseTitle: val });
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => null}
                  style={styles.searchPlaceholder}
                >
                  <TextInput
                    style={styles.searchPlaceholderText}
                    placeholder="Featured Artist"
                    value={this.state.featuredArtist}
                    onChangeText={val => {
                      this.setState({ featuredArtist: val });
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => null}
                  style={styles.searchPlaceholder}
                >
                  <TextInput
                    style={styles.searchPlaceholderText}
                    placeholder="Producer"
                    value={this.state.producer}
                    onChangeText={val => {
                      this.setState({ producer: val });
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => null}
                  style={styles.searchPlaceholder}
                >
                  <TextInput
                    style={styles.searchPlaceholderText}
                    placeholder="Genre"
                    value={this.state.genre}
                    onChangeText={val => {
                      this.setState({ genre: val });
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => null}
                  style={styles.searchPlaceholder}
                >
                  <TextInput
                    style={styles.searchPlaceholderText}
                    placeholder="Label Name"
                    value={this.state.labelName}
                    onChangeText={val => {
                      this.setState({ labelName: val });
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => null}
                  style={styles.searchPlaceholder}
                >
                  <TextInput
                    style={styles.searchPlaceholderText}
                    placeholder="Release Year"
                    keyboardType="number-pad"
                    maxLength={4}
                    value={this.state.releaseYear}
                    onChangeText={val => {
                      this.setState({ releaseYear: val });
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={async () => {
                    const { status } = await Permissions.askAsync(
                      Permissions.CAMERA_ROLL
                    );

                    if (status === 'granted') {
                      try {
                        const musics = await MediaLibrary.getAssetsAsync({
                          first: 100000,
                          mediaType: 'audio'
                        });
                        this.setState({
                          cameraRollMusics: musics.assets,
                          showMusicModal: true
                        });
                        // console.log(musics);
                      } catch (e) {
                        alert(e);
                      }
                    } else {
                      alert('Error');
                    }
                  }}
                  style={styles.searchPlaceholder}
                >
                  <View style={gStyle.mR1}>
                    <Feather color={colors.brandPrimary} name="plus" />
                  </View>
                  <Text style={styles.searchPlaceholderText2}>
                    {this.state.uploadTrackName
                      ? this.state.uploadTrackName
                      : 'Select Track'}
                  </Text>
                </TouchableOpacity>
                {this.state.musicProgress ? (
                  this.state.musicProgress == 100 ? (
                    <Text style={{ color: 'green', marginBottom: 10 }}>
                      Successfull Uploaded
                    </Text>
                  ) : (
                    <Text style={{ marginBottom: 10 }}>
                      Uploading {this.state.musicProgress}%{' '}
                    </Text>
                  )
                ) : null}
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 50
                }}
              >
                {this.state.releaseTitle &&
                // this.state.featuredArtist &&
                this.state.producer &&
                this.state.genre &&
                this.state.releaseYear &&
                this.state.coverArt &&
                this.state.uploadTrack ? (
                  <TouchText
                    onPress={() => {
                      this.setState({
                        startLoadingSignUp: true
                      });

                      // UploadTo_ARTIST => {
                      var messageListRef = firebase
                        .database()
                        .ref(
                          'users/' + firebase.auth().currentUser.uid + '/songs'
                        );

                      var newMessageRef = messageListRef.push();

                      newMessageRef.set(
                        {
                          artist: this.state.user.stageName,
                          image: this.state.coverArt,
                          title: this.state.releaseTitle,
                          featuredArtist: this.state.featuredArtist,
                          producer: this.state.producer,
                          genre: this.state.genre,
                          labelName: this.state.labelName,
                          released: this.state.releaseYear,
                          songLink: this.state.uploadTrack,
                          downloads: 0,
                          streams: 0,
                          uid: firebase.auth().currentUser.uid,
                          tracks: [
                            {
                              title: this.state.releaseTitle,
                              seconds: '',
                              genre: this.state.genre,
                              songLink: this.state.uploadTrack,
                            }
                          ]
                        },
                        error => {
                          if (error) {
                            console.log(error.message);
                          } else {
                            // uploadto_DISCOVIRIES =>
                            {
                              var discoveryRef = firebase
                                .database()
                                .ref('discovires/');

                              var newDiscoveryRef = discoveryRef.push();

                              newDiscoveryRef.set(
                                {
                                  artist: this.state.user.stageName,
                                  image: this.state.coverArt,
                                  title: this.state.releaseTitle,
                                  featuredArtist: this.state.featuredArtist,
                                  producer: this.state.producer,
                                  genre: this.state.genre,
                                  labelName: this.state.labelName,
                                  released: this.state.releaseYear,
                                  songLink: this.state.uploadTrack,
                                  downloads: 0,
                                  streams: 0,
                                  uid: firebase.auth().currentUser.uid,
                                  tracks: JSON.stringify([
                                    {
                                      title: this.state.releaseTitle,
                                      seconds: '',
                                      genre: this.state.genre,
                                      songLink: this.state.uploadTrack,
                                    }
                                  ])
                                },
                                error => {
                                  if (error) {
                                    console.log(error.message);
                                  } else {
                                    // uploadto_TRENDING =>
                                    {
                                      var trendingRef = firebase
                                        .database()
                                        .ref('trending/');

                                      var newtrendingRef = trendingRef.push();

                                      newtrendingRef.set(
                                        {
                                          artist: this.state.user.stageName,
                                          image: this.state.coverArt,
                                          title: this.state.releaseTitle,
                                          featuredArtist: this.state
                                            .featuredArtist,
                                          producer: this.state.producer,
                                          genre: this.state.genre,
                                          labelName: this.state.labelName,
                                          released: this.state.releaseYear,
                                          songLink: this.state.uploadTrack,
                                          downloads: 0,
                                          streams: 0,
                                          uid: firebase.auth().currentUser.uid,
                                          tracks: JSON.stringify([
                                            {
                                              title: this.state.releaseTitle,
                                              seconds: '',
                                              genre: this.state.genre,
                                              songLink: this.state.uploadTrack,
                                            }
                                          ])
                                        },
                                        error => {
                                          if (error) {
                                            console.log(error.message);
                                          } else {
                                            alert('Upload Successful');
                                            this.setState({
                                              startLoadingSignUp: false,
                                              uploadModal: false,
                                              coverArt: '',
                                              releaseTitle: 'Release Title',
                                              featuredArtist: '',
                                              producer: '',
                                              genre: '',
                                              labelName: '',
                                              releaseYear: '',
                                              uploadTrack: '',
                                              uploadProgress2: '',
                                              uploadingProfilePhoto2: false,
                                              profilePhotoFile: ''
                                            });
                                          }
                                        }
                                      );
                                    }
                                  }
                                }
                              );
                            }
                          }
                        }
                      );
                    }}
                    style={styles.btn}
                    styleText={styles.btnText}
                    tag={
                      this.state.startLoadingSignUp ? (
                        <ActivityIndicator size={25} color="white" />
                      ) : (
                        <Text style={styles.btnText}>Release</Text>
                      )
                    }
                  />
                ) : (
                  <TouchText
                    onPress={() => {
                      alert('Please fill all fields');
                    }}
                    style={{
                      backgroundColor: '#eee',
                      borderRadius: 25,
                      height: 50,
                      width: 220
                    }}
                    styleText={styles.btnText}
                    text="Release"
                  />
                )}
              </View>
            </ScrollView>
          </Modal>

          {/* UPLOAD INFO modal */}
          <Modal
            animationType={'slide'}
            visible={this.state.uploadInfo}
            onRequestClose={() => {
              this.setState({ uploadInfo: false });
            }}
            transparent={true}
            style={{
              flex: 1
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  uploadInfo: false
                });
              }}
            >
              <View style={{ height: '70%' }} />
            </TouchableOpacity>

            <View
              style={{
                flex: 2
              }}
            >
              <View
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 5
                }}
              >
                <View
                  style={{
                    width: 80,
                    height: 10,
                    borderRadius: 50,
                    backgroundColor: colors.brandPrimary
                  }}
                />
              </View>
              <View
                style={{
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  backgroundColor: colors.blackBlur,
                  height: '100%',
                  padding: 20,
                  // justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Text
                  style={{ fontSize: 20, fontWeight: 'bold', color: 'gray' }}
                >
                  Warning
                </Text>
                <Text style={{ color: 'white', fontSize: 16 }}>
                  Please note that inapporpraite materials will be taken off if
                  noticed or reported.
                </Text>
                <View style={{ height: 10 }} />
                <Text style={{ color: 'white', fontSize: 16 }}>
                  If possible avoid contents containing raw pornographic,
                  extremely abusive and contents made purposely to abuse or
                  offend a person or an entity.
                </Text>
              </View>
            </View>
          </Modal>

          {/* CAMERA ROLL PICTURES 2222 */}
          <Modal
            animationType={'slide'}
            visible={this.state.showCameraRollPictures2}
            onRequestClose={() => {
              this.setState({ showCameraRollPictures2: false });
            }}
            transparent={true}
            style={{
              flex: 1
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  showCameraRollPictures2: false
                });
              }}
            >
              <View style={{ height: '30%' }} />
            </TouchableOpacity>

            <View
              style={{
                flex: 2
              }}
            >
              <View
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 5
                }}
              >
                <View
                  style={{
                    width: 80,
                    height: 10,
                    borderRadius: 50,
                    backgroundColor: colors.brandPrimary
                  }}
                />
              </View>
              <View
                style={{
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  backgroundColor: colors.blackBlur,
                  height: '100%',
                  padding: 20,
                  // justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <FlatList
                  contentContainerStyle={styles.containerContent}
                  data={this.state.cameraRollPictures}
                  vertical
                  numColumns={3}
                  keyExtractor={itemObj => itemObj.node.timestamp}
                  style={{ marginLeft: -10 }}
                  renderItem={itemObj => {
                    const { item } = itemObj;

                    return (
                      <TouchableOpacity
                        onPress={async () => {
                          this.setState({
                            uploadingProfilePhoto2: true,
                            profilePhotoFile: item.node.image.uri,
                            showCameraRollPictures2: false
                          });

                          var storageRef = Fire.storage().ref(
                            'artistsSongs/' + firebase.auth().currentUser.uid
                          );

                          const response = await fetch(item.node.image.uri);
                          const blob = await response.blob();

                          console.log(blob._data);
                          this.setState({ imageFileName2: blob._data.name });

                          var uploadTask = storageRef
                            .child(blob._data.name)
                            .put(blob);
                          uploadTask.on(
                            'state_changed',
                            snapshot => {
                              var progress = Math.floor(
                                (snapshot.bytesTransferred /
                                  snapshot.totalBytes) *
                                  100
                              );
                              this.setState({
                                uploadProgress2: progress
                              });
                            },
                            error => {
                              alert(error.message);
                              console.log(error);
                            },
                            () => {
                              uploadTask.snapshot.ref
                                .getDownloadURL()
                                .then(downloadURL => {
                                  console.log('File available at', downloadURL);
                                  this.setState({
                                    coverArt: downloadURL
                                  });
                                });
                            }
                          );
                        }}
                        style={{ marginLeft: 10 }}
                      >
                        <Image
                          source={{ uri: item.node.image.uri }}
                          style={{
                            width: 105,
                            height: 105,
                            marginBottom: 1
                          }}
                        />
                      </TouchableOpacity>
                    );
                  }}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </View>
          </Modal>

          {/* MUSIC UPLOAD MODAL */}
          <Modal
            animationType={'slide'}
            visible={this.state.showMusicModal}
            onRequestClose={() => {
              this.setState({ showMusicModal: false });
            }}
            transparent={true}
            style={{
              flex: 1
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  showMusicModal: false
                });
              }}
            >
              <View style={{ height: '30%' }} />
            </TouchableOpacity>

            <View
              style={{
                flex: 2
              }}
            >
              <View
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 5
                }}
              >
                <View
                  style={{
                    width: 80,
                    height: 10,
                    borderRadius: 50,
                    backgroundColor: colors.brandPrimary
                  }}
                />
              </View>
              <View
                style={{
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  backgroundColor: colors.blackBlur,
                  height: '100%',
                  padding: 20,
                  // justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <FlatList
                  contentContainerStyle={styles.containerContent}
                  data={this.state.cameraRollMusics}
                  vertical
                  // numColumns={3}
                  keyExtractor={itemObj => itemObj.albumId.timestamp}
                  style={{ marginLeft: -10 }}
                  renderItem={itemObj => {
                    const { item } = itemObj;

                    return (
                      <TouchableOpacity
                        onPress={async () => {
                          this.setState({
                            uploadingMusic: true,
                            // up: item.node.image.uri,
                            showMusicModal: false
                          });

                          var storageRef = Fire.storage().ref(
                            'artistsSongs/' +
                              firebase.auth().currentUser.uid +
                              '/song'
                          );

                          const response = await fetch(item.uri);
                          const blob = await response.blob();

                          console.log(blob._data);
                          this.setState({ uploadTrackName: blob._data.name });

                          var uploadTask = storageRef
                            .child(blob._data.name)
                            .put(blob);
                          uploadTask.on(
                            'state_changed',
                            snapshot => {
                              var progress = Math.floor(
                                (snapshot.bytesTransferred /
                                  snapshot.totalBytes) *
                                  100
                              );
                              this.setState({
                                musicProgress: progress
                              });
                            },
                            error => {
                              alert(error.message);
                              console.log(error);
                            },
                            () => {
                              uploadTask.snapshot.ref
                                .getDownloadURL()
                                .then(downloadURL => {
                                  console.log('File available at', downloadURL);
                                  this.setState({
                                    uploadTrack: downloadURL
                                  });
                                });
                            }
                          );
                        }}
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginBottom: 12,
                          paddingBottom: 12,
                          borderBottomWidth: 0.5,
                          borderBottomColor: 'gray'
                        }}
                      >
                        <Image
                          source={require('./albums/teephlow.jpg')}
                          style={{
                            width: 45,
                            height: 45,
                            marginRight: 10,
                            borderRadius: 50
                          }}
                        />
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: 'bold',
                            color: 'white'
                          }}
                        >
                          {item.filename}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </View>
          </Modal>
        </React.Fragment>
      );
    } else if (this.state.isUserLogin === null) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.blackBlur
          }}
        >
          <ActivityIndicator color={colors.brandPrimary} size={40} />
        </View>
      );
    } else {
      return (
        <React.Fragment>
          {/* SingIn MODAL */}
          <Modal
            animationType={'slide'}
            visible={this.state.showModal2}
            onRequestClose={() => {
              this.setState({
                showModal2: false,
                loginEmail: '',
                loginPasswaord: '',
                emailErrorMessage: ''
              });
            }}
            transparent={false}
            onDismiss={() => {
              this.setState({
                loginEmail: '',
                loginPasswaord: '',
                emailErrorMessage: ''
              });
            }}
            style={{
              padding: 10
            }}
          >
            <View style={styles.containerHeader}>
              <View style={styles.header}>
                <TouchIcon
                  icon={
                    <Feather color={colors.brandPrimary} name="chevron-left" />
                  }
                  onPress={() =>
                    this.setState({
                      showModal2: false,
                      loginEmail: '',
                      loginPasswaord: '',
                      emailErrorMessage: ''
                    })
                  }
                />
              </View>
            </View>
            <ScrollView
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              style={{
                width: '100%',
                flex: 1
              }}
            >
              <View style={{ flex: 1, width: '100%', paddingHorizontal: 25 }}>
                <Text
                  style={{
                    fontSize: 25,
                    color: colors.brandPrimary,
                    fontWeight: 'bold',
                    marginBottom: 10
                  }}
                >
                  Login
                </Text>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => null}
                  style={styles.searchPlaceholder}
                >
                  <View style={gStyle.mR1}>
                    <Feather color={colors.brandPrimary} name="user" />
                  </View>
                  <TextInput
                    style={styles.searchPlaceholderText}
                    placeholder="Email"
                    value={this.state.loginEmail}
                    textContentType="emailAddress"
                    onBlur={() => {
                      if (!validateEmail(this.state.loginEmail)) {
                        this.setState({
                          emailErrorMessage: true
                        });
                      } else {
                        this.setState({
                          emailErrorMessage: false
                        });
                      }
                    }}
                    onChangeText={val => {
                      this.setState({ loginEmail: val });
                    }}
                  />
                </TouchableOpacity>

                {this.state.emailErrorMessage ? (
                  <Text
                    style={{ marginTop: -5, marginBottom: 10, color: 'red' }}
                  >
                    Invalid Email
                  </Text>
                ) : null}

                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => null}
                  style={styles.searchPlaceholder}
                >
                  <View style={gStyle.mR1}>
                    <Feather color={colors.brandPrimary} name="lock" />
                  </View>
                  <TextInput
                    style={styles.searchPlaceholderText}
                    placeholder="Password"
                    secureTextEntry={this.state.showLoginPassword}
                    textContentType="password"
                    value={this.state.loginPasswaord}
                    onChangeText={val => {
                      this.setState({ loginPasswaord: val });
                    }}
                  />
                  <TouchableOpacity
                    style={{ marginLeft: -35, padding: 10 }}
                    onPress={() => {
                      this.setState({ showLoginPassword: false });
                      setTimeout(() => {
                        this.setState({
                          showLoginPassword: true
                        });
                      }, 2000);
                    }}
                  >
                    <Feather
                      style={{ marginLeft: -15 }}
                      size={20}
                      color={colors.brandPrimary}
                      name={this.state.showLoginPassword ? 'eye' : 'eye-off'}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                {validateEmail(this.state.loginEmail) &&
                this.state.loginPasswaord ? (
                  <TouchText
                    onPress={() => {
                      this.setState({
                        startLoadingSignIn: true
                      });
                      Fire.auth()
                        .signInWithEmailAndPassword(
                          this.state.loginEmail,
                          this.state.loginPasswaord
                        )
                        .then(user => {
                          // success
                          this.setState({
                            startLoadingSignIn: false,
                            isUserLogin: true,
                            user: user
                          });
                        })
                        .catch(error => {
                          alert(error.message);
                          this.setState({
                            startLoadingSignIn: false,
                          });
                        });
                    }}
                    style={styles.btn}
                    styleText={styles.btnText}
                    tag={
                      this.state.startLoadingSignIn ? (
                        <ActivityIndicator size={25} color="white" />
                      ) : (
                        <Text style={styles.btnText}>Sign In</Text>
                      )
                    }
                  />
                ) : (
                  <TouchText
                    onPress={() => {
                      null;
                    }}
                    style={{
                      backgroundColor: '#eee',
                      borderRadius: 25,
                      height: 50,
                      width: 220
                    }}
                    styleText={styles.btnText}
                    text="Sign In"
                  />
                )}
              </View>
            </ScrollView>
          </Modal>

          {/* SIGN UP MODAL */}
          <Modal
            animationType={'slide'}
            visible={this.state.showModal}
            onRequestClose={() => {
              this.setState({
                // showModal: false,
                showModal: false,
                startLoadingSignUp: false,
                comparePasswords: false,
                uploadingProfilePhoto: false
              });
            }}
            transparent={false}
            style={{
              padding: 10
            }}
          >
            <View style={styles.containerHeader}>
              <View style={styles.header}>
                <TouchIcon
                  icon={
                    <Feather color={colors.brandPrimary} name="chevron-left" />
                  }
                  onPress={() =>
                    this.setState({
                      showModal: false,
                      startLoadingSignUp: false,
                      comparePasswords: false,
                      uploadingProfilePhoto: false
                    })
                  }
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  {this.state.uploadingProfilePhoto ? (
                    this.state.uploadProgress == 100 ? (
                      <>
                        <Feather name="check" size={20} color="green" />

                        <Text
                          style={{
                            color: 'green',
                            fontWeight: 'bold',
                            marginHorizontal: 6
                          }}
                        >
                          Uploaded Image
                        </Text>
                        <Image
                          source={{ uri: this.state.profilePhotoFile }}
                          style={{ width: 25, height: 25, borderRadius: 50 }}
                        />
                      </>
                    ) : (
                      <>
                        <ActivityIndicator
                          size={20}
                          color={colors.brandPrimary}
                        />

                        <Text
                          style={{
                            color: colors.brandPrimary,
                            fontWeight: 'bold',
                            marginHorizontal: 6
                          }}
                        >
                          Uploading: {this.state.uploadProgress} %
                        </Text>
                        <Image
                          source={{ uri: this.state.profilePhotoFile }}
                          style={{ width: 25, height: 25, borderRadius: 50 }}
                        />
                      </>
                    )
                  ) : null}
                </View>
              </View>
            </View>
            <ScrollView
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              style={{
                width: '100%',
                flex: 1
              }}
            >
              <View style={{ flex: 1, width: '100%', paddingHorizontal: 25 }}>
                <Text
                  style={{
                    fontSize: 25,
                    color: colors.brandPrimary,
                    fontWeight: 'bold',
                    marginBottom: 10
                  }}
                >
                  Create Account
                </Text>
                <Text style={{ fontSize: 12, color: 'gray', marginBottom: 5 }}>
                  Profile picture must be professional and of square px {'\n'}
                  Blur pictures or pictures contain text or offensive images
                  will not be accepted.
                </Text>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={async () => {
                    const { status } = await Permissions.askAsync(
                      Permissions.CAMERA_ROLL
                    );

                    if (status === 'granted') {
                      try {
                        const photos = await CameraRoll.getPhotos({
                          first: 1000000,
                          assetType: 'Photos'
                        });
                        this.setState({
                          cameraRollPictures: photos.edges,
                          showCameraRollPictures: true
                        });
                        console.log(photos.edges[0]);
                      } catch (e) {
                        alert(e);
                      }
                    } else {
                      alert('Error');
                    }
                  }}
                  style={styles.searchPlaceholder}
                >
                  <View style={gStyle.mR1}>
                    <Feather color={colors.brandPrimary} name="plus" />
                  </View>
                  <Text style={styles.searchPlaceholderText}>
                    {this.state.imageFileName
                      ? this.state.imageFileName
                      : 'Add Profile Photo'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.searchPlaceholder}
                >
                  <View style={gStyle.mR1}>
                    <Feather color={colors.brandPrimary} name="user" />
                  </View>
                  <TextInput
                    style={styles.searchPlaceholderText}
                    placeholder="Full Name"
                    textContentType="name"
                    onChangeText={val => {
                      this.setState({
                        fullName: val
                      });
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => null}
                  style={styles.searchPlaceholder}
                >
                  <View style={gStyle.mR1}>
                    <Feather color={colors.brandPrimary} name="disc" />
                  </View>
                  <TextInput
                    style={styles.searchPlaceholderText}
                    placeholder="Stage Name"
                    textContentType="nickname"
                    onChangeText={val => {
                      this.setState({
                        stageName: val
                      });
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => null}
                  style={styles.searchPlaceholder}
                >
                  <View style={gStyle.mR1}>
                    <Feather color={colors.brandPrimary} name="phone" />
                  </View>
                  <TextInput
                    style={styles.searchPlaceholderText}
                    placeholder="Phone Number"
                    textContentType="telephoneNumber"
                    keyboardType="number-pad"
                    onChangeText={val => {
                      this.setState({
                        phoneNumber: val
                      });
                    }}
                  />
                </TouchableOpacity>
                <View style={gStyle.spacer6} />
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => null}
                  style={styles.searchPlaceholder}
                >
                  <View style={gStyle.mR1}>
                    <Feather color={colors.brandPrimary} name="mail" />
                  </View>
                  <TextInput
                    style={styles.searchPlaceholderText}
                    placeholder="Email"
                    textContentType="emailAddress"
                    onChangeText={val => {
                      this.setState({
                        signUpEmail: val
                      });
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => null}
                  style={styles.searchPlaceholder}
                >
                  <View style={gStyle.mR1}>
                    <Feather color={colors.brandPrimary} name="lock" />
                  </View>
                  <TextInput
                    style={styles.searchPlaceholderText}
                    placeholder="Password"
                    textContentType="password"
                    onChangeText={val => {
                      this.setState({
                        singUpPassword: val
                      });
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => null}
                  style={styles.searchPlaceholder}
                >
                  <View style={gStyle.mR1}>
                    <Feather color={colors.brandPrimary} name="lock" />
                  </View>
                  <TextInput
                    style={styles.searchPlaceholderText}
                    placeholder="Confirm Password"
                    textContentType="password"
                    onBlur={() => {
                      if (
                        this.state.singUpPassword !==
                        this.state.singUpPasswordConfirm
                      ) {
                        this.setState({
                          comparePasswords: true
                        });
                      } else {
                        this.setState({
                          comparePasswords: false
                        });
                      }
                    }}
                    onChangeText={val => {
                      this.setState({
                        singUpPasswordConfirm: val
                      });
                    }}
                  />
                </TouchableOpacity>
                {this.state.comparePasswords ? (
                  <Text
                    style={{ marginTop: -5, marginBottom: 10, color: 'red' }}
                  >
                    Passwords do not match
                  </Text>
                ) : null}
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 15
                }}
              >
                {validateEmail(this.state.signUpEmail) &&
                this.state.singUpPassword ===
                  this.state.singUpPasswordConfirm &&
                this.state.fullName &&
                this.state.stageName &&
                this.state.phoneNumber &&
                this.state.profilePhotoURL ? (
                  <TouchText
                    onPress={() => {
                      this.setState({
                        startLoadingSignUp: true
                      });
                      Fire.auth()
                        .createUserWithEmailAndPassword(
                          this.state.signUpEmail,
                          this.state.singUpPassword
                        )
                        .then(user => {
                          firebase
                            .database()
                            .ref('users/' + firebase.auth().currentUser.uid)
                            .update(
                              {
                                profilePhotoFile: this.state.profilePhotoFile,
                                fullName: this.state.fullName,
                                stageName: this.state.stageName,
                                phoneNumber: this.state.phoneNumber,
                                signUpEmail: this.state.signUpEmail,
                                singUpPassword: this.state.singUpPassword,
                                singUpPasswordConfirm: this.state
                                  .singUpPasswordConfirm,
                                profilePhotoURL: this.state.profilePhotoURL
                              },
                              error => {
                                if (error) {
                                  alert('Error Uploading');
                                } else {
                                  // success
                                  Fire.auth()
                                    .signInWithEmailAndPassword(
                                      this.state.loginEmail,
                                      this.state.loginPasswaord
                                    )
                                    .then(user => {
                                      // Login success
                                      this.setState({
                                        user: { user: 'selorm' },
                                        startLoadingSignIn: false,
                                        isUserLogin: true
                                      });
                                    })
                                    .catch(error => {
                                      // console.log(error.message);
                                      alert(error.message);
                                      this.setState({
                                        user: { user: 'selorm' },
                                        startLoadingSignIn: false,
                                        isUserLogin: true
                                      });
                                    });
                                }
                              }
                            );
                          // Create Login success
                        })
                        .catch(error => {
                          // console.log(error.message);
                          alert(error.message);
                        });
                    }}
                    style={styles.btn}
                    styleText={styles.btnText}
                    tag={
                      this.state.startLoadingSignUp ? (
                        <ActivityIndicator size={25} color="white" />
                      ) : (
                        <Text style={styles.btnText}>Sign Up</Text>
                      )
                    }
                  />
                ) : (
                  <TouchText
                    onPress={() => {
                      alert('Please fill all fields');
                    }}
                    style={{
                      backgroundColor: '#eee',
                      borderRadius: 25,
                      height: 50,
                      width: 220
                    }}
                    styleText={styles.btnText}
                    text="Sign Up"
                  />
                )}
              </View>
            </ScrollView>
          </Modal>

          {/* CAMERA ROLL PICTURES */}
          <Modal
            animationType={'slide'}
            visible={this.state.showCameraRollPictures}
            onRequestClose={() => {
              this.setState({ showCameraRollPictures: false });
            }}
            transparent={true}
            style={{
              flex: 1
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  showCameraRollPictures: false
                });
              }}
            >
              <View style={{ height: '30%' }} />
            </TouchableOpacity>

            <View
              style={{
                flex: 2
              }}
            >
              <View
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 5
                }}
              >
                <View
                  style={{
                    width: 80,
                    height: 10,
                    borderRadius: 50,
                    backgroundColor: colors.brandPrimary
                  }}
                />
              </View>
              <View
                style={{
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  backgroundColor: colors.blackBlur,
                  height: '100%',
                  padding: 20,
                  // justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <FlatList
                  contentContainerStyle={styles.containerContent}
                  data={this.state.cameraRollPictures}
                  vertical
                  numColumns={3}
                  keyExtractor={itemObj => itemObj.node.timestamp}
                  style={{ marginLeft: -10 }}
                  renderItem={itemObj => {
                    const { item } = itemObj;

                    return (
                      <TouchableOpacity
                        onPress={async () => {
                          this.setState({
                            uploadingProfilePhoto: true,
                            profilePhotoFile: item.node.image.uri,
                            showCameraRollPictures: false
                          });

                          var storageRef = Fire.storage().ref(
                            'userProfilePics/'
                          );

                          const response = await fetch(item.node.image.uri);
                          const blob = await response.blob();

                          console.log(blob._data);
                          this.setState({ imageFileName: blob._data.name });

                          var uploadTask = storageRef
                            .child(blob._data.name)
                            .put(blob);
                          uploadTask.on(
                            'state_changed',
                            snapshot => {
                              var progress = Math.floor(
                                (snapshot.bytesTransferred /
                                  snapshot.totalBytes) *
                                  100
                              );
                              this.setState({
                                uploadProgress: progress
                              });
                            },
                            error => {
                              alert(error.message);
                              console.log(error);
                            },
                            () => {
                              uploadTask.snapshot.ref
                                .getDownloadURL()
                                .then(downloadURL => {
                                  console.log('File available at', downloadURL);
                                  this.setState({
                                    profilePhotoURL: downloadURL
                                  });
                                });
                            }
                          );
                        }}
                        style={{ marginLeft: 10 }}
                      >
                        <Image
                          source={{ uri: item.node.image.uri }}
                          style={{
                            width: 105,
                            height: 105,
                            marginBottom: 1
                          }}
                        />
                      </TouchableOpacity>
                    );
                  }}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </View>
          </Modal>

          <View
            style={{
              position: 'absolute',
              top: 0,
              width: '100%',
              zIndex: 10,
              paddingVertical: 20
            }}
          >
            <ScreenHeader navigation={this.props.navigation} title="Account" />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={[
              gStyle.container,
              {
                paddingTop: 100,
                height: '100%',
                width: '100%'
              }
            ]}
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%'
              }}
            >
              <View
                style={{
                  marginTop: 50,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontWeight: '100',
                    fontSize: 14,
                    marginBottom: 15
                  }}
                >
                  Artist? Create an account to upload your songs
                </Text>
                <TouchText
                  onPress={() => {
                    this.setState({ showModal: true });
                  }}
                  style={styles.btn}
                  styleText={styles.btnText}
                  text="Create Account"
                />
                <Text
                  style={{
                    color: 'white',
                    fontWeight: '100',
                    fontSize: 14,
                    marginTop: 20,
                    marginBottom: 10
                  }}
                >
                  or Login if you already have an account
                </Text>

                <TouchText
                  onPress={() => {
                    this.setState({ showModal2: true });
                  }}
                  style={styles.btn2}
                  styleText={styles.btnText2}
                  text="Login"
                />
              </View>
            </View>
          </ScrollView>
        </React.Fragment>
      );
    }
  }
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.brandPrimary,
    borderRadius: 25,
    height: 50,
    width: 220
  },
  btnText: {
    ...gStyle.textSpotifyBold16,
    color: colors.white,
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  btnUp: {
    backgroundColor: colors.brandPrimary,
    borderRadius: 25,
    height: 40,
    width: 120
  },
  btnTextUp: {
    ...gStyle.textSpotifyBold12,
    color: colors.white,
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  btn2: {
    backgroundColor: 'white',
    borderRadius: 25,
    height: 50,
    width: 220,
    marginTop: 5
  },
  btnText2: {
    ...gStyle.textSpotifyBold16,
    color: colors.brandPrimary,
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  containerHeader: {
    height: 89,
    // position: 'absolute',
    // top: 0,
    width: '100%',
    zIndex: 100,
    paddingTop: 10
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: device.iPhoneX ? 48 : 10 + StatusBar,
    position: 'absolute',
    top: 0,
    width: '100%'
  },
  searchPlaceholder: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 6,
    flexDirection: 'row',
    paddingLeft: 16,
    paddingVertical: 16,
    backgroundColor: '#eee',
    marginBottom: 10
  },
  searchPlaceholderText: {
    ...gStyle.textSpotify16,
    color: colors.blackBg,
    width: '95%'
  },
  searchPlaceholderText2: {
    ...gStyle.textSpotify16,
    color: colors.blackBg,
    width: '91%'
    // height: 50
  }
});
