import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DabiFont } from 'assets/icons';
import React, { useMemo } from 'react';
import { RoutePath } from 'routes';
import HomeScreen from 'scenes/home/HomeScreen';
import MagazineListTab from 'scenes/home/magazine/MagazineListTab';
import { MagazinesScreen } from 'scenes/home/magazine/MagazineScreen';
import { NotificationScreen } from 'scenes/notification/NotificationScreen';
import ProductCategoryScreen from 'scenes/product/ProductCategoryScreen';
import FavoriteScreen from 'scenes/profile/favorite/FavoriteScreen';
import UserProfileScreen from 'scenes/user/UserProfileScreen';
import { remoteConfigService } from 'services/remote.config';
import { Colors } from 'styles';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import AuthNavigation from './AuthNavigation';

const Tab = createBottomTabNavigator();

function TabNavigation() {
  const { isLoggedIn } = useTypedSelector(state => state.auth);
  const listType = useMemo(() => {
    return remoteConfigService().getHomeLayout();
  }, []);

  // https://reactnavigation.org/docs/screen-options-resolution#setting-parent-screen-options-based-on-child-navigators-state
  return (
    <Tab.Navigator
      initialRouteName={RoutePath.home}
      backBehavior='history'
      screenOptions={{
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name={RoutePath.home}
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <DabiFont name={focused ? 'home_filled' : 'home_line'} size={24} color={focused ? Colors.primary : Colors.icon} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={RoutePath.category}
        component={ProductCategoryScreen}
        options={{
          tabBarIcon: ({ focused }) => <DabiFont name={focused ? 'search_filled' : 'search_line'} size={24} color={focused ? Colors.primary : Colors.icon} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={RoutePath.magazineList}
        component={MagazinesScreen}
        options={{
          tabBarIcon: ({ focused }) => <DabiFont name={focused ? 'magazine_filled' : 'magazine_line'} size={24} color={focused ? Colors.primary : Colors.icon} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={RoutePath.favoriteTab}
        component={FavoriteScreen}
        options={{
          tabBarIcon: ({ focused }) => <DabiFont name={focused ? 'bookmark_filled' : 'bookmark_line'} size={24} color={focused ? Colors.primary : Colors.icon} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={RoutePath.profile}
        // component={isLoggedIn ? UserProfileScreen : AuthNavigation}
        component={UserProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <DabiFont name={focused ? 'my_filled' : 'my_line'} size={24} color={focused ? Colors.primary : Colors.icon} />,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default TabNavigation;
