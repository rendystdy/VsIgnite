import {createAppContainer} from 'react-navigation';
import MainScreen from '../Containers/MainScreen';
import {createStackNavigator} from 'react-navigation-stack';

import styles from './Styles/NavigationStyles';

// Manifest of possible screens
const PrimaryNav = createStackNavigator(
  {
    MainScreen: {screen: MainScreen},
  },
  {
    // Default config for all screens
    headerMode: 'none',
    initialRouteName: 'MainScreen',
    navigationOptions: {
      headerStyle: styles.header,
    },
  },
);

export default createAppContainer(PrimaryNav);
