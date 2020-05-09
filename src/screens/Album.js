import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  NativeModules,
  AsyncStorage,
  DeviceEventEmitter
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { colors, device, gStyle, images } from '../constants';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import firebase from 'firebase';

// components
import LinearGradient from '../components/LinearGradient';
import LineItemSong from '../components/LineItemSong';
import TouchIcon from '../components/TouchIcon';
import TouchText from '../components/TouchText';

const { width, height } = Dimensions.get('window');
const { StatusBarManager } = NativeModules;
let StatusBar = Platform.OS === 'ios' ? 20 : 20;

class Album extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      album: null,
      downloaded: false,
      scrollY: new Animated.Value(0),
      dl: false,
      playing: false,
      playingSong: {}
    };

    this.toggleDownloaded = this.toggleDownloaded.bind(this);
    this.changeSong = this.changeSong.bind(this);
    this.toggleBlur = this.toggleBlur.bind(this);
  }

  async componentDidMount() {
    const { navigation, screenProps } = this.props;
    const selectedTrack = navigation.getParam('selectedTrack');

    this.setState({
      album: selectedTrack || null
    });

    const value = await AsyncStorage.getItem(
      selectedTrack.artist + '-' + selectedTrack.title + '.mp3'
    );
    if (value !== null) {
      console.log(value.name);
      this.setState({
        downloaded: true
      });
    } else {
      console.log('551654651516551513error');
      console.log(selectedTrack.artist + '-' + selectedTrack.title);
    }
  }

  toggleDownloaded(val) {
    // if web
    if (device.web) {
      this.setState({
        downloaded: val
      });

      return;
    }

    // remove downloads alert
    if (val === false) {
      Alert.alert(
        'Remove from Downloads?',
        "You won't be able to play this offline.",
        [
          { text: 'Cancel' },
          {
            onPress: () => {
              this.setState({
                downloaded: false
              });
            },
            text: 'Remove'
          }
        ],
        { cancelable: false }
      );
    } else {
      this.setState({
        downloaded: val
      });
    }
  }

  changeSong(songData) {
    const {
      screenProps: { changeSong }
    } = this.props;

    changeSong(songData);
  }

  toggleBlur() {
    const {
      screenProps: { setToggleTabBar }
    } = this.props;

    setToggleTabBar();
  }

  render() {
    const {
      navigation,
      screenProps: { toggleTabBarState, setToggleTabBar }
    } = this.props;
    const { album, downloaded, scrollY, song, title } = this.state;

    // album data not set?
    if (album === null) {
      return (
        <View style={[gStyle.container, gStyle.flexCenter]}>
          <Text style={{ color: colors.white }}>{`Album: ${title}`}</Text>
        </View>
      );
    }

    const stickyArray = device.web ? [] : [0];
    const headingRange = device.web ? [140, 200] : [230, 280];
    const shuffleRange = device.web ? [40, 80] : [40, 80];

    const opacityHeading = scrollY.interpolate({
      inputRange: headingRange,
      outputRange: [0, 1],
      extrapolate: 'clamp'
    });

    const opacityShuffle = scrollY.interpolate({
      inputRange: shuffleRange,
      outputRange: [0, 1],
      extrapolate: 'clamp'
    });

    let bgc = [
      '#e69e41',
      '#5b8d7c',
      '#a3bdcb',
      '#e1789d',
      '#6297eb',
      '#ac9ac1',
      '#ea6c45',
      '#e3b966',
      '#8ecfc1',
      '#ae9ac2',
      '#da47a0',
      '#a3becb'
    ];

    let downloadAdd = () => {
      firebase
        .database()
        .ref('/users/' + album.uid + '/songs')
        .once('value', snapshot => {
          snapshot.forEach(child => {
            [child.toJSON()].map(item => {
              if (item.title === album.title) {
                firebase
                  .database()
                  .ref('users/' + album.uid + '/songs/' + child.key)
                  .update({
                    downloads: item.downloads + 1
                  });
              }
            });
          });
        });
    };

    return (
      <View style={gStyle.container}>
        {toggleTabBarState ? (
          <BlurView
            intensity={99}
            style={{ ...StyleSheet.absoluteFill, zIndex: 101 }}
            tint="dark"
          />
        ) : null}

        <View style={styles.containerHeader}>
          <Animated.View
            style={[styles.headerLinear, { opacity: opacityHeading }]}
          >
            <LinearGradient
              fill={bgc[Math.floor(Math.random() * 10)]}
              height={89}
            />
          </Animated.View>
          <View style={styles.header}>
            <TouchIcon
              icon={<Feather color={colors.white} name="chevron-left" />}
              onPress={() => navigation.navigate('Home')}
            />
            <Animated.View style={{ opacity: opacityShuffle }}>
              <Text style={styles.headerTitle}>{album.title}</Text>
            </Animated.View>
          </View>
        </View>

        <View style={styles.containerFixed}>
          <View style={styles.containerLinear}>
            <LinearGradient fill={bgc[Math.floor(Math.random() * 10)]} />
          </View>
          <View style={styles.containerImage}>
            <Image source={{ uri: album.image }} style={styles.image} />
          </View>
          <View style={styles.containerTitle}>
            <Text ellipsizeMode="tail" numberOfLines={1} style={styles.title}>
              {album.title}
            </Text>
          </View>
          <View style={styles.containerAlbum}>
            <Text style={styles.albumInfo}>
              {album.dataType == 'artist'
                ? `${album.tracks.length} songs`
                : `${album.dataType == 'playlist' ? 'Playlist' : 'Album'} by ${
                    album.artist
                  } · ${album.released}`}
            </Text>
          </View>
        </View>

        <Animated.ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={stickyArray}
          style={styles.containerScroll}
        >
          <View style={styles.containerSticky}>
            <Animated.View
              style={[
                styles.containerStickyLinear,
                { opacity: opacityShuffle }
              ]}
            >
              <LinearGradient fill={colors.black20} height={50} />
            </Animated.View>
            <View style={styles.containerShuffle}>
              <TouchText
                onPress={() => {
                  this.setState({
                    dl: true
                  });
                  setTimeout(() => {
                    this.setState({
                      dl: false
                    });
                    this.toggleDownloaded(true);
                  }, 3000);
                }}
                style={styles.btn}
                styleText={styles.btnText}
                text="Download"
              />
            </View>
          </View>
          <View style={styles.containerSongs}>
            {album.tracks &&
              JSON.parse(album.tracks).map((track, index) => (
                <LineItemSong
                  active={song === track.title}
                  playing={this.state.playing}
                  downloaded={downloaded}
                  dl={this.state.dl}
                  key={track.title + album.artist.toString()}
                  onPress={async () => {
                    DeviceEventEmitter.emit('eventKey', {name: track.title});
                    this.setState({ dl: true });
                    const dvalue = await AsyncStorage.getItem(
                      album.artist + '-' + track.title + '.mp3'
                    );
                    if (dvalue !== null) {
                      // alert('song is downloaded');
                      let value = JSON.parse(dvalue);
                      if (
                        value.name ==
                        album.artist + '-' + track.title + '.mp3'
                      ) {
                        this.props.screenProps.changeSong({
                          album: album.title,
                          artist: album.artist,
                          image: album.image,
                          length: track.seconds,
                          title: track.title,
                          songLink: value.songLink,
                          uid: album.uid
                        });
                        this.setState({ dl: false, downloaded: true });
                      } else {
                        this.setState({ dl: false, downloaded: true });
                        this.props.screenProps.changeSong({
                          album: album.title,
                          artist: album.artist,
                          image: album.image,
                          length: track.seconds,
                          title: track.title,
                          songLink: track.songLink,
                          uid: album.uid
                        });
                      }
                    } else {
                      // alert('song is not downloaded');
                      this.props.screenProps.changeSong({
                        album: album.title,
                        artist: album.artist,
                        image: album.image,
                        length: track.seconds,
                        title: track.title,
                        songLink: track.songLink,
                        uid: album.uid
                      });

                      const uri = album.songLink;
                      let fileUri =
                        FileSystem.documentDirectory +
                        album.artist +
                        '-' +
                        track.title +
                        '.mp3';

                      FileSystem.downloadAsync(uri, fileUri).then(
                        async ({ uri }) => {
                          // alert('URI: ' + uri);
                          const { status } = await Permissions.askAsync(
                            Permissions.CAMERA_ROLL
                          );
                          if (status === 'granted') {
                            try {
                              const asset = await MediaLibrary.createAssetAsync(
                                uri
                              ).then(async arg => {
                                alert(
                                  'Track is downloaded to your files at ' +
                                    arg.filename
                                );
                                downloadAdd();
                                await AsyncStorage.setItem(
                                  album.artist + '-' + track.title + '.mp3',
                                  JSON.stringify({
                                    name: arg.filename,
                                    songLink: arg.uri
                                  })
                                );
                                this.setState({
                                  dl: false,
                                  downloaded: true
                                });
                              });
                            } catch (e) {
                              alert(e);
                            }
                          }
                        }
                      );
                    }
                  }}
                  songData={{
                    album: album.title,
                    artist: album.artist,
                    image: album.image,
                    length: track.seconds,
                    title: track.title,
                    songLink: track.songLink
                  }}
                />
              ))}
          </View>
          <View style={gStyle.spacer16} />
        </Animated.ScrollView>
        {/* <BarMusicPlayer song={this.state.playingSong} /> */}
      </View>
    );
  }
}

Album.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  containerHeader: {
    height: 89,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 100
  },
  headerLinear: {
    height: 89,
    width: '100%'
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: device.iPhoneX ? 48 : 20 + StatusBar,
    position: 'absolute',
    top: 0,
    width: '100%'
  },
  headerTitle: {
    ...gStyle.textSpotifyBold16,
    color: colors.white,
    paddingHorizontal: 8,
    marginTop: 2,
    textAlign: 'center'
    // width: device.width - 100
  },
  containerFixed: {
    alignItems: 'center',
    paddingTop: device.iPhoneX ? 94 : 60,
    position: 'absolute',
    width: '100%'
  },
  containerLinear: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: device.web ? 5 : 0
  },
  containerImage: {
    shadowColor: colors.black,
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    zIndex: device.web ? 20 : 0
  },
  image: {
    height: 148,
    marginBottom: device.web ? 0 : 16,
    width: 148
  },
  containerTitle: {
    marginTop: device.web ? 8 : 0,
    zIndex: device.web ? 20 : 0
  },
  title: {
    ...gStyle.textSpotifyBold20,
    color: colors.white,
    paddingHorizontal: 24,
    marginBottom: 8,
    textAlign: 'center'
  },
  containerAlbum: {
    zIndex: device.web ? 20 : 0
  },
  albumInfo: {
    ...gStyle.textSpotify12,
    color: colors.greyInactive,
    marginBottom: 48
  },
  containerScroll: {
    paddingTop: 89
  },
  containerSticky: {
    marginTop: device.iPhoneX ? 238 : 194
  },
  containerShuffle: {
    alignItems: 'center',
    height: 50,
    shadowColor: colors.blackBg,
    shadowOffset: { height: -10, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20
  },
  containerStickyLinear: {
    top: 0,
    position: 'absolute',
    width: '100%'
  },
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
  containerSongs: {
    alignItems: 'center',
    backgroundColor: colors.blackBg,
    minHeight: 540
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    width: '100%'
  },
  downloadText: {
    ...gStyle.textSpotifyBold18,
    color: colors.white
  }
});

export default Album;
