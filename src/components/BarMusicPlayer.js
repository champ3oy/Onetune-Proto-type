import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  DeviceEventEmitter
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors, device, gStyle } from '../constants';

import { Audio } from 'expo-av';
import firebase from 'firebase'; 

class BarMusicPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favorited: false,
      paused: true,
      data: {},
      playingStatus: 'nosound',
      timeLeft: '0%',
      duration: 0
    };
  }

  componentDidMount() {
    this.eventListener = DeviceEventEmitter.addListener('eventKey', arg => {
      if (arg.name != this.props.song.title) {
        this.setState({
          paused: true,
          timeLeft: '0%'
        });
        if (this.state.playingStatus == 'playing') {
          this.sound.getStatusAsync().then(arg => {
            this.setState({
              duration: arg.durationMillis
            })
          })
          this.sound.unloadAsync();
          this.setState({
            playingStatus: 'nosound'
          });
        }
      }
    });
  }

  streamAdd() {
    try {
      firebase
        .database()
        .ref('/users/' + this.props.song.uid + '/songs')
        .once('value', snapshot => {
          snapshot.forEach(child => {
            [child.toJSON()].map(item => {
              if (item.title === this.props.song.title) {
                firebase
                  .database()
                  .ref('users/' + this.props.song.uid + '/songs/' + child.key)
                  .update({
                    streams: item.streams + 1
                  });
              }
            });
          });
        });
    } catch (e) {
      alert(e);
    }
  }

  async _playRecording() {
    // alert('playing it');
    const { sound } = await Audio.Sound.createAsync(
      { uri: this.props.song.songLink },
      {
        shouldPlay: true,
        isLooping: false
      },
      this._updateScreenForSoundStatus
    );
    this.sound = sound;
    this.setState({
      playingStatus: 'playing'
    });
    this.streamAdd();
  }

  _updateScreenForSoundStatus = status => {
    if (status.isPlaying && this.state.playingStatus !== 'playing') {
      this.setState({ playingStatus: 'playing' });
    } else if (!status.isPlaying && this.state.playingStatus === 'playing') {
      this.setState({ playingStatus: 'donepause' });
    }
  };

  async _pauseAndPlayRecording() {
    if (this.sound != null) {
      if (this.state.playingStatus == 'playing') {
        console.log('pausing...');
        await this.sound.pauseAsync();
        console.log('paused!');
        this.setState({
          playingStatus: 'donepause'
        });
      } else {
        console.log('playing...');
        await this.sound.playAsync();
        console.log('playing!');
        this.setState({
          playingStatus: 'playing'
        });
      }
    }
  }

  _syncPauseAndPlayRecording() {
    if (this.sound != null) {
      if (this.state.playingStatus == 'playing') {
        this.sound.pauseAsync();
      } else {
        this.sound.playAsync();
      }
    }
  }

  _playAndPause = () => {
    switch (this.state.playingStatus) {
      case 'nosound':
        this._playRecording();
        break;
      case 'donepause':
      case 'playing':
        this._pauseAndPlayRecording();
        break;
    }
  };

  render() {
    const { navigation, song } = this.props;
    const { paused } = this.state;
    const iconPlay = paused ? 'play-circle' : 'pause-circle';

    let togglePlay = async () => {
      this.setState(prev => ({
        paused: !prev.paused
      }));
      this._playAndPause();
    };

    if (this.state.playingStatus == 'playing') {
      
        try {
          this.sound.getStatusAsync().then(result => {
            // alert(JSON.stringify(result));
            // let whole = Math.floor(
            //   (result.positionMillis / result.durationMillis) * 100
            // );
            // console.log(whole);
            // this.setState({
            //   timeLeft: whole + '%'
            // });
            // console.log('timeleft>>> ', this.state.timeLeft);
            setTimeout(() => {
              this.sound.unloadAsync().then(arg => {
                this.setState({
                  paused: true
                })
              })
            }, result.durationMillis);
          });
        } catch (error) {
          // alert(error);
        }
      
      // try {
      //   this.sound.getStatusAsync().then(function(result) {
      //     alert(JSON.stringify(result))
      //   });
      // } catch (error) {
      //   alert(error);
      // }
    }

    return (
      <View>
        <View
          style={{
            width: '100%',
            backgroundColor: colors.brandPrimary,
            height: 3
          }}
        >
          <View
            style={{
              width: this.state.timeLeft,
              height: 3,
              backgroundColor: 'white',
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10
            }}
          />
        </View>

        <TouchableOpacity activeOpacity={1} style={styles.container}>
          <TouchableOpacity
            activeOpacity={gStyle.activeOpacity}
            hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
            style={styles.containerIcon}
          >
            <Image
              style={{
                height: 40,
                width: 40,
                borderRadius: 3,
                backgroundColor: 'gray'
              }}
              source={{ uri: song.image }}
            />
          </TouchableOpacity>
          {song && (
            <View>
              <View style={styles.containerSong}>
                <Text style={styles.title}>{`${song.title} · `}</Text>
                <Text style={styles.artist}>{song.artist}</Text>
              </View>
              <View style={[gStyle.flexRowCenter, gStyle.mTHalf]}>
                <FontAwesome
                  color={colors.brandPrimary}
                  name="play"
                  size={14}
                />
                <Text style={styles.device}>NOW PLAYING</Text>
              </View>
            </View>
          )}
          <TouchableOpacity
            activeOpacity={gStyle.activeOpacity}
            hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
            onPress={() => togglePlay()}
            style={styles.containerIcon}
          >
            <FontAwesome color={colors.white} name={iconPlay} size={28} />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  }
}

BarMusicPlayer.defaultProps = {
  song: null
};

BarMusicPlayer.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,

  // optional
  song: PropTypes.shape({
    artist: PropTypes.string,
    title: PropTypes.string
  })
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    backgroundColor: colors.grey,
    borderBottomColor: colors.blackBg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    width: '100%'
  },
  containerIcon: {
    ...gStyle.flexCenter,
    width: 50
  },
  containerSong: {
    ...gStyle.flexRowCenter,
    overflow: 'hidden',
    width: device.width - 100
  },
  title: {
    ...gStyle.textSpotify12,
    color: colors.white
  },
  artist: {
    ...gStyle.textSpotify12,
    color: colors.greyLight
  },
  device: {
    ...gStyle.textSpotify10,
    color: colors.brandPrimary,
    marginLeft: 4,
    textTransform: 'uppercase'
  }
});

export default BarMusicPlayer;
