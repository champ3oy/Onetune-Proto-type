import React from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { colors, gStyle, images } from '../constants';

const AlbumsVertical = ({ data, heading, navigation, tagline }) => (
  <View style={styles.container}>
    {heading && <Text style={styles.heading}>{heading}</Text>}
    {tagline && <Text style={styles.tagline}>{tagline}</Text>}

    <View
      style={{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <FlatList
        contentContainerStyle={styles.containerContent}
        data={data}
        vertical
        horizontal={false}
        numColumns={2}
        keyExtractor={itemObj => itemObj.id.toString()}
        renderItem={itemObj => {
          const { item } = itemObj;

          return (
            <TouchableOpacity
              activeOpacity={gStyle.activeOpacity}
              hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
              onPress={() =>
                navigation.navigate('Album', { title: item.title })
              }
              style={styles.item}
            >
              <View style={styles.image}>
                {item.image && (
                  <Image source={images[item.image]} style={styles.image} />
                )}
              </View>
              <Text style={styles.title}>{item.title}</Text>
            </TouchableOpacity>
          );
        }}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  </View>
);

AlbumsVertical.defaultProps = {
  heading: null,
  tagline: null
};

AlbumsVertical.propTypes = {
  // required
  data: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,

  // optional
  heading: PropTypes.string,
  tagline: PropTypes.string
};

const styles = StyleSheet.create({
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
  tagline: {
    ...gStyle.textSpotify12,
    color: colors.greyInactive,
    paddingBottom: 6,
    textAlign: 'left',
    marginLeft: 15
  },
  item: {
    marginRight: 16,
    width: 148,
    marginTop: 15
  },
  image: {
    backgroundColor: colors.greyLight,
    height: 148,
    width: 148
  },
  title: {
    ...gStyle.textSpotifyBold12,
    color: colors.white,
    marginTop: 4,
    textAlign: 'center'
  }
});

export default AlbumsVertical;
