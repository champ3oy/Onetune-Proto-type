import React from 'react';
import PropTypes from 'prop-types';
import { createStackNavigator } from 'react-navigation';
import { Feather } from '@expo/vector-icons';
import { View, Text } from 'react-native';

// screens
import LibraryScreen from '../screens/Library';

// icons
import SvgTabLibrary from '../components/icons/Svg.TabLibrary';

const Icon = ({ focused }) => (
  <Feather
    color={focused ? 'white' : '#b3b3b3'}
    style={{ fontWeight: 100 }}
    size={20}
    name="user"
  />
);

let Name = ({ focused }) => {
  return focused ? (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 3,
        marginTop: -5,
        width: '100%'
      }}
    >
      <Text
        style={{
          color: 'white',
          fontSize: 10
        }}
      >
        Artist
      </Text>
    </View>
  ) : null;
};

Icon.propTypes = {
  // required
  focused: PropTypes.bool.isRequired
};

export default createStackNavigator(
  {
    LibraryMain: {
      screen: LibraryScreen
    }
  },
  {
    headerMode: 'none',
    navigationOptions: {
      tabBarLabel: Name,
      tabBarIcon: Icon
    }
  }
);
