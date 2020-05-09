import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Image
} from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { colors, device, gStyle } from '../constants';
import { LinearGradient } from 'expo-linear-gradient';
import Fire from '../Fire/Firebase';
import firebase from 'firebase';

// components
import AlbumsHorizontal from '../components/AlbumsHorizontal';
import TouchText from '../components/TouchText';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scrollY: new Animated.Value(0),
      settings: false,
      trending: [],
      discoviries: [],
      showEditProfile: false
    };
  }

  componentWillMount() {
    firebase
      .database()
      .ref('trending/')
      .on('value', snapshot => {
        let arr = [];

        snapshot.forEach(child => {
          arr.push(child.toJSON());
        });
        // console.log(arr);
        this.setState({
          trending: arr
        });
      });
    firebase
      .database()
      .ref('discovires/')
      .on('value', snapshot => {
        let arr = [];

        snapshot.forEach(child => {
          arr.push(child.toJSON());
        });
        // console.log(arr);
        this.setState({
          discoviries: arr
        });
      });
  }

  render() {
    const { navigation } = this.props;
    const { scrollY } = this.state;
    const opacityIn = scrollY.interpolate({
      inputRange: [0, 128],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    });
    const opacityOut = scrollY.interpolate({
      inputRange: [0, 88],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    });
    let waves = [
      {
        name: 'Afro Beat',
        logo: 'speaker',
        color: 'maroon',
        color2: 'maroon',
        data: {
          dataType: 'playlist',
          artist: 'DJ Avlon',
          image: require('./albums/good-morning.png'),
          released: 2010,
          title: 'Afro Beat',
          tracks: JSON.stringify([
            { title: 'Blue Blood Blues', songLink: 'aaaaaa', seconds: 161 },
            { title: 'Hustle and Cuss', songLink: 'aaaaaa', seconds: 245 },
            {
              title: 'The Difference Between Us',
              songLink: 'aaaaaa',
              seconds: 288
            },
            { title: "I'm Mad", songLink: 'aaaaaa', seconds: 215 },
            { title: 'Die by the Drop', songLink: 'aaaaaa', seconds: 345 },
            { title: "I Can't Hear You", songLink: 'aaaaaa', seconds: 250 },
            { title: 'Gasoline', songLink: 'aaaaaa', seconds: 287 },
            { title: 'No Horse', songLink: 'aaaaaa', seconds: 271 },
            {
              title: 'Looking at the Invisible Man',
              songLink: 'aaaaaa',
              seconds: 210
            },
            { title: 'Jawbreaker', songLink: 'aaaaaa', seconds: 237 },
            { title: 'Old Mary', songLink: 'aaaaaa', seconds: 345 }
          ])
        }
      },
      {
        name: 'Bars on Bars',
        logo: 'headphones',
        color: 'indigo',
        color2: 'indigo',
        data: {
          dataType: 'playlist',
          artist: 'DJ Fiona Apple',
          backgroundColor: '#636e35',
          image: require('./albums/cools.png'),
          released: 2005,
          title: 'Bars on Bars',
          tracks: [
            {
              title: 'Extraordinary Machine',
              songLink: 'aaaaaa',
              seconds: 224
            },
            { title: 'Get Him Back', songLink: 'aaaaaa', seconds: 326 },
            { title: "O' Sailor", songLink: 'aaaaaa', seconds: 337 },
            { title: 'Better Version of Me', songLink: 'aaaaaa', seconds: 181 },
            {
              title: 'Tymps (the Sick in the Head Song)',
              songLink: 'aaaaaa',
              seconds: 245
            },
            { title: 'Parting Gift', songLink: 'aaaaaa', seconds: 216 },
            { title: 'Window', songLink: 'aaaaaa', seconds: 333 },
            { title: 'Oh Well', songLink: 'aaaaaa', seconds: 222 },
            { title: 'Please Please Please', songLink: 'aaaaaa', seconds: 215 },
            { title: 'Red Red Red', songLink: 'aaaaaa', seconds: 248 },
            { title: 'Not About Love', songLink: 'aaaaaa', seconds: 261 },
            {
              title: 'Waltz (Better Than Fine)',
              songLink: 'aaaaaa',
              seconds: 226
            }
          ]
        }
      },
      {
        name: 'Lovers Rock ',
        logo: 'disc',
        color: 'orange',
        color2: 'orange',
        data: {
          dataType: 'playlist',
          artist: 'DJ Pink Floyd',
          backgroundColor: '#a7b9db',
          image: require('./albums/drive-jam.png'),
          released: 1975,
          title: 'Lovers Rock',
          tracks: [
            {
              title: 'Shine On You Crazy Diamond (Parts I–V)',
              songLink: 'aaaaaa',
              seconds: 161
            },
            {
              title: 'Welcome to the Machine',
              songLink: 'aaaaaa',
              seconds: 245
            },
            { title: 'Have a Cigar', songLink: 'aaaaaa', seconds: 288 },
            { title: 'Wish You Were Here', songLink: 'aaaaaa', seconds: 215 },
            {
              title: 'Shine On You Crazy Diamond (Parts VI–IX)',
              songLink: 'aaaaaa',
              seconds: 345
            }
          ]
        }
      },
      {
        name: 'Lovers Rock ',
        logo: 'disc',
        color: 'orange',
        color2: 'orange',
        data: {
          dataType: 'playlist',
          artist: 'DJ Pink Floyd',
          backgroundColor: '#a7b9db',
          image: require('./albums/dancehall.png'),
          released: 1975,
          title: 'Lovers Rock',
          tracks: [
            {
              title: 'Shine On You Crazy Diamond (Parts I–V)',
              songLink: 'aaaaaa',
              seconds: 161
            },
            {
              title: 'Welcome to the Machine',
              songLink: 'aaaaaa',
              seconds: 245
            },
            { title: 'Have a Cigar', songLink: 'aaaaaa', seconds: 288 },
            { title: 'Wish You Were Here', songLink: 'aaaaaa', seconds: 215 },
            {
              title: 'Shine On You Crazy Diamond (Parts VI–IX)',
              songLink: 'aaaaaa',
              seconds: 345
            }
          ]
        }
      },
      {
        name: 'Lovers Rock ',
        logo: 'disc',
        color: 'orange',
        color2: 'orange',
        data: {
          dataType: 'playlist',
          artist: 'DJ Pink Floyd',
          backgroundColor: '#a7b9db',
          image: require('./albums/movingon.png'),
          released: 1975,
          title: 'Lovers Rock',
          tracks: [
            {
              title: 'Shine On You Crazy Diamond (Parts I–V)',
              songLink: 'aaaaaa',
              seconds: 161
            },
            {
              title: 'Welcome to the Machine',
              songLink: 'aaaaaa',
              seconds: 245
            },
            { title: 'Have a Cigar', songLink: 'aaaaaa', seconds: 288 },
            { title: 'Wish You Were Here', songLink: 'aaaaaa', seconds: 215 },
            {
              title: 'Shine On You Crazy Diamond (Parts VI–IX)',
              songLink: 'aaaaaa',
              seconds: 345
            }
          ]
        }
      },
      {
        name: 'Lovers Rock ',
        logo: 'disc',
        color: 'orange',
        color2: 'orange',
        data: {
          dataType: 'playlist',
          artist: 'DJ Pink Floyd',
          backgroundColor: '#a7b9db',
          image: require('./albums/moonlight.png'),
          released: 1975,
          title: 'Lovers Rock',
          tracks: [
            {
              title: 'Shine On You Crazy Diamond (Parts I–V)',
              songLink: 'aaaaaa',
              seconds: 161
            },
            {
              title: 'Welcome to the Machine',
              songLink: 'aaaaaa',
              seconds: 245
            },
            { title: 'Have a Cigar', songLink: 'aaaaaa', seconds: 288 },
            { title: 'Wish You Were Here', songLink: 'aaaaaa', seconds: 215 },
            {
              title: 'Shine On You Crazy Diamond (Parts VI–IX)',
              songLink: 'aaaaaa',
              seconds: 345
            }
          ]
        }
      },
      {
        name: 'Lovers Rock ',
        logo: 'disc',
        color: 'orange',
        color2: 'orange',
        data: {
          dataType: 'playlist',
          artist: 'DJ Pink Floyd',
          backgroundColor: '#a7b9db',
          image: require('./albums/rap.png'),
          released: 1975,
          title: 'Lovers Rock',
          tracks: [
            {
              title: 'Shine On You Crazy Diamond (Parts I–V)',
              songLink: 'aaaaaa',
              seconds: 161
            },
            {
              title: 'Welcome to the Machine',
              songLink: 'aaaaaa',
              seconds: 245
            },
            { title: 'Have a Cigar', songLink: 'aaaaaa', seconds: 288 },
            { title: 'Wish You Were Here', songLink: 'aaaaaa', seconds: 215 },
            {
              title: 'Shine On You Crazy Diamond (Parts VI–IX)',
              songLink: 'aaaaaa',
              seconds: 345
            }
          ]
        }
      },
      {
        name: 'Lovers Rock ',
        logo: 'disc',
        color: 'orange',
        color2: 'orange',
        data: {
          dataType: 'playlist',
          artist: 'DJ Pink Floyd',
          backgroundColor: '#a7b9db',
          image: require('./albums/faith.png'),
          released: 1975,
          title: 'Lovers Rock',
          tracks: [
            {
              title: 'Shine On You Crazy Diamond (Parts I–V)',
              songLink: 'aaaaaa',
              seconds: 161
            },
            {
              title: 'Welcome to the Machine',
              songLink: 'aaaaaa',
              seconds: 245
            },
            { title: 'Have a Cigar', songLink: 'aaaaaa', seconds: 288 },
            { title: 'Wish You Were Here', songLink: 'aaaaaa', seconds: 215 },
            {
              title: 'Shine On You Crazy Diamond (Parts VI–IX)',
              songLink: 'aaaaaa',
              seconds: 345
            }
          ]
        }
      }
    ];
    function shuffle(a) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    return (
      <React.Fragment>
        {device.iPhoneX && (
          <Animated.View style={[styles.iPhoneNotch, { opacity: opacityIn }]} />
        )}

        <Animated.View
          style={[styles.containerHeader, { opacity: opacityOut }]}
        >
          <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 25 }}>
            Onetune+
          </Text>
        </Animated.View>

        <Animated.ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          style={gStyle.container}
        >
          <View style={gStyle.spacer11} />

          {/* <AlbumsHorizontal
            data={artists}
            heading="Artists"
            navigation={navigation}
          /> */}

          <View style={styles.container}>
            <Text style={styles.heading}>Playlists</Text>
            <Text style={styles.tagline}>
              Curated playlists from world class DJs.
            </Text>

            <FlatList
              contentContainerStyle={styles.containerContent}
              data={waves}
              horizontal
              keyExtractor={itemObj => itemObj.name.toString()}
              style={{ marginLeft: -10 }}
              renderItem={itemObj => {
                const { item } = itemObj;

                return (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('Album', {'Album': item.data} )
                    }
                    style={{ marginLeft: 10 }}
                  >
                    <Image
                      source={item.data.image}
                      style={{
                        width: 200,
                        height: 200,
                        borderRadius: 5,
                        alignItems: 'flex-end',
                        padding: 10,
                        flexDirection: 'row',
                        borderRadius: 7
                      }}
                    />
                  </TouchableOpacity>
                );
              }}
              showsHorizontalScrollIndicator={false}
            />
          </View>

          <AlbumsHorizontal
            data={shuffle(this.state.trending)}
            heading="Trending"
            navigation={navigation}
            tagline="Most download musics at the moment."
          />

          <AlbumsHorizontal
            data={shuffle(this.state.discoviries)}
            heading="Discoveries"
            navigation={navigation}
            tagline="Browse all collections."
          />
        </Animated.ScrollView>
      </React.Fragment>
    );
  }
}

Home.propTypes = {
  // required
  navigation: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  tagline: {
    ...gStyle.textSpotify12,
    color: colors.greyInactive,
    paddingBottom: 6,
    textAlign: 'left',
    marginLeft: 15
  },
  container: {
    marginBottom: 15,
    width: '100%'
  },
  containerContent: {
    paddingLeft: 16
  },
  heading: {
    ...gStyle.textSpotifyBold18,
    color: colors.white,
    paddingBottom: 6,
    textAlign: 'left',
    marginLeft: 10,
    marginLeft: 15
  },
  iPhoneNotch: {
    backgroundColor: colors.black70,
    height: 44,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 20
  },
  containerHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: device.iPhoneX ? 60 : 36,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 10
  },
  btnUp: {
    backgroundColor: colors.brandPrimary,
    borderRadius: 25,
    height: 47,
    width: 200
  },
  btnTextUp: {
    ...gStyle.textSpotifyBold16,
    color: colors.white,
    letterSpacing: 1,
    textTransform: 'uppercase'
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
  }
});

export default Home;
