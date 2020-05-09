import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors, gStyle } from '../constants';

const LineItemSong = ({ active, downloaded, onPress, songData, dl, playing }) => (
  <View style={styles.container}>
    <TouchableOpacity
      activeOpacity={gStyle.activeOpacity}
      onPress={() => onPress(onPress)}
      style={gStyle.flex5}
    >
      <Text
        style={[
          styles.title,
          { color: active ? colors.brandPrimary : colors.white }
        ]}
      >
        {songData.title}
      </Text>
      <View style={gStyle.flexRow}>
        {downloaded && (
          <View style={styles.circleDownloaded}>
            <Ionicons
              color={colors.blackBg}
              name="ios-arrow-round-down"
              size={15}
            />
          </View>
        )}
        <Text style={styles.artist}>{songData.artist}</Text>
      </View>
    </TouchableOpacity>

    <View style={styles.containerRight}>
      {dl ? <ActivityIndicator size={20} color='#57b660' /> : <Text></Text>}
      {playing ? <Text style={{fontSize: 9, color: 'white'}}>Playing</Text> : null }
    </View>
  </View>
);

LineItemSong.defaultProps = {
  active: false,
  downloaded: false
};

LineItemSong.propTypes = {
  // required
  onPress: PropTypes.func,
  songData: PropTypes.shape({
    album: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    length: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired
  }).isRequired,

  // optional
  active: PropTypes.bool,
  downloaded: PropTypes.bool
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    width: '100%'
  },
  title: {
    ...gStyle.textSpotify16,
    color: colors.white,
    marginBottom: 4
  },
  circleDownloaded: {
    alignItems: 'center',
    backgroundColor: colors.brandPrimary,
    borderRadius: 7,
    height: 15,
    justifyContent: 'center',
    marginRight: 8,
    width: 15
  },
  artist: {
    ...gStyle.textSpotify12,
    color: colors.greyInactive
  },
  containerRight: {
    alignItems: 'flex-end',
    flex: 1
  }
});

export default LineItemSong;
