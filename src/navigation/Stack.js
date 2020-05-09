import { createAppContainer, createStackNavigator } from 'react-navigation';

// modal routes (dynamic transitions)
import ModalRoutes from './ModalRoutes';

// navigation
import TabNavigation from './TabNavigation';

// screens
import ModalMusicPlayer from '../screens/ModalMusicPlayer';
import Album from '../screens/Album';
import Result from '../screens/Results';
import Search from '../screens/Search';

const StackNavigator = createStackNavigator(
  {
    // Main Tab Navigation
    // /////////////////////////////////////////////////////////////////////////
    TabNavigation,

    // Modals
    // /////////////////////////////////////////////////////////////////////////
    ModalMusicPlayer: {
      screen: ModalMusicPlayer,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    Search: {
      screen: Search,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    Album: {
      screen: Album,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    Result: {
      screen: Result,
      navigationOptions: {
        gesturesEnabled: false
      }
    }
  },
  {
    headerMode: 'none',
    initialRouteName: 'TabNavigation',
    mode: 'modal',
    transitionConfig: ModalRoutes,
    transparentCard: true
  }
);

const App = createAppContainer(StackNavigator);

export default App;
