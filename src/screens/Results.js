import React from 'react';
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Dimensions,
  Platform,
  Image
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, device, gStyle } from '../constants';

// components
import LineItemSong from '../components/LineItemSong';
import TouchIcon from '../components/TouchIcon';
import Search from './Search';

let StatusBar = Platform.OS === 'ios' ? 20 : 20;

class Result extends React.Component {
  constructor(props) {
    super(props);

    // search start (24 horizontal padding )
    const searchStart = device.width - 48;

    this.state = {
      scrollY: new Animated.Value(0),
      searchStart,
      searchEnd: searchStart - 40,
      search: '' || 'Search Term',
      album: [],
    };
  }

  componentDidMount() {
    let latestSongs = [
      {
        id: 1,
        artist: 'Cirlorm',
        image: require('./albums/born-to-die.jpg'),
        released: 2012,
        title: 'Born to Die',
        tracks: [
          { title: 'Born to Die', seconds: 161, genre: 'afro beat' },
          { title: 'We the best', seconds: 161, genre: 'hip pop' }
        ],
        songLink: './'
      },
      {
        id: 2,
        artist: 'JahThrone',
        image: require('./albums/illuminate.jpg'),
        released: 2020,
        title: 'Raindow',
        tracks: [
          { title: 'Raindow', seconds: 161, genre: 'rnb' },
          { title: 'Jahville', seconds: 161, genre: 'dancehall' }
        ],
        songLink: './'
      }
    ];
    const { navigation, screenProps } = this.props;
    // const albumTitle = navigation.getParam('title', 'ALBUM NOT FOUND?!');
    const searchTerm = navigation.getParam('searchTerm');

    this.setState({
      search: searchTerm || null,
      album: latestSongs
    });
  }

  render() {
    const { album } = this.state;

    const { scrollY, searchStart, searchEnd } = this.state;
    const shuffleRange = device.web ? [40, 80] : [40, 80];

    const opacityShuffle = scrollY.interpolate({
      inputRange: shuffleRange,
      outputRange: [0, 1],
      extrapolate: 'clamp'
    });

    const opacity = scrollY.interpolate({
      inputRange: [0, 48],
      outputRange: [searchStart, searchEnd],
      extrapolate: 'clamp'
    });

    return (
      <React.Fragment>
        {/* <View style={gStyle.spacer3} /> */}
        <View style={styles.containerHeader}>
          <View style={styles.header}>
            <TouchIcon
              icon={<Feather color={colors.white} name="chevron-left" />}
              onPress={() => this.props.navigation.goBack(null)}
            />
          </View>
        </View>
        <View style={{ paddingTop: 10, backgroundColor: colors.blackBg }} />
        <Animated.ScrollView
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: scrollY } } }
          ])}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[1]}
          style={gStyle.container}
        >
          <View style={gStyle.spacer8} />
          <View style={styles.containerSearchBar}>
            <Animated.View style={{ width: opacity }}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => null}
                style={styles.searchPlaceholder}
              >
                {/* <View style={gStyle.mR1}>
                  <SvgSearch />
                </View> */}
                <Text style={styles.searchPlaceholderText}>
                  {this.state.search}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>


        </Animated.ScrollView>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  containerSongs: {
    alignItems: 'center',
    backgroundColor: colors.blackBg,
    minHeight: 540
  },
  containerSearchBar: {
    ...gStyle.pH3,
    backgroundColor: colors.blackBg,
    paddingBottom: 5,
    paddingTop: device.iPhoneX ? 64 : 20,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: 5,
    borderBottomWidth: 5,
    borderBottomColor: colors.brandPrimary
  },
  searchPlaceholder: {
    alignItems: 'center',
    backgroundColor: colors.blackBg,
    borderRadius: 6,
    flexDirection: 'row',
    paddingLeft: 16,
    paddingVertical: 16
  },
  searchPlaceholderText: {
    ...gStyle.textSpotifyBold24,
    color: colors.white,
    width: '100%',
    paddingLeft: 0
  },
  sectionHeading: {
    ...gStyle.textSpotifyBold18,
    color: colors.white,
    marginBottom: 24,
    marginLeft: 24,
    marginTop: 16
  },
  containerFlatlist: {
    marginLeft: 24
  },
  iconRight: {
    alignItems: 'center',
    height: 28,
    justifyContent: 'center',
    position: 'absolute',
    right: 24,
    top: device.web ? 40 : 78,
    width: 28
  },
  containerHeader: {
    height: 89,
    position: 'absolute',
    top: 10,
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
  }
});

export default Result;
