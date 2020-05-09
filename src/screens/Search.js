import React from 'react';
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, device, gStyle } from '../constants';

// components
import PlaylistItem from '../components/PlaylistItem';

// icons
import SvgSearch from '../components/icons/Svg.Search';

// mock data
import browseAll from '../mockdata/searchBrowseAll';

class Search extends React.Component {
  constructor(props) {
    super(props);

    // search start (24 horizontal padding )
    const searchStart = device.width - 48;

    this.state = {
      scrollY: new Animated.Value(0),
      searchStart,
      searchEnd: searchStart
    };
  }

  render() {
    const { scrollY, searchStart, searchEnd } = this.state;
    const { navigation } = this.props;

    const opacity = scrollY.interpolate({
      inputRange: [0, 48],
      outputRange: [searchStart, searchEnd],
      extrapolate: 'clamp'
    });

    return (
      <React.Fragment>
        <View style={gStyle.spacer3} />
        <Animated.ScrollView
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: scrollY } } }
          ])}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[1]}
          style={gStyle.container}
        >
          <View style={gStyle.spacer3} />
          <View style={styles.containerSearchBar}>
            <Animated.View style={{ width: opacity }}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => null}
                style={styles.searchPlaceholder}
              >
                <View style={gStyle.mR1}>
                  <SvgSearch />
                </View>
                <TextInput
                  style={styles.searchPlaceholderText}
                  placeholder="Artists, songs or genres"
                />
              </TouchableOpacity>
            </Animated.View>
          </View>

          <Text style={styles.sectionHeading}>Browse all</Text>
          <FlatList
            contentContainerStyle={styles.containerFlatlist}
            data={browseAll}
            keyExtractor={itemObj => itemObj.id.toString()}
            numColumns={2}
            renderItem={itemObj => {
              const { item } = itemObj;

              return (
                <PlaylistItem
                  bgColor={item.color}
                  onPress={() => navigation.navigate('Result', {searchTerm: item.title})}
                  title={item.title}
                />
              );
            }}
          />
        </Animated.ScrollView>

        {/* <View style={styles.iconRight}>
          <TouchIcon
            icon={<FontAwesome color={colors.white} name="microphone" />}
            onPress={() => null}
          />
        </View> */}
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  containerSearchBar: {
    ...gStyle.pH3,
    backgroundColor: colors.blackBg,
    paddingBottom: 16,
    paddingTop: device.iPhoneX ? 64 : 24
  },
  searchPlaceholder: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 6,
    flexDirection: 'row',
    paddingLeft: 16,
    paddingVertical: 16
  },
  searchPlaceholderText: {
    ...gStyle.textSpotify16,
    color: colors.blackBg,
    width: '100%'
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
  }
});

export default Search;
