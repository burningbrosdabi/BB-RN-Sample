import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { RoutePath } from 'routes';
import EmailLoginScreen from 'scenes/auth/EmailLoginScreen';
import EmailSignUpScreen from 'scenes/auth/EmailSignUpScreen';
import ResetPasswordScreen from 'scenes/auth/ResetPasswordScreen';
import SocialAuthScreen from 'scenes/auth/SocialAuthScreen';
import FollowSuggestionScreen from 'scenes/onboarding/FollowSuggestionScreen';
import HeightAndWeightScreen from 'scenes/onboarding/HeightAndWeightScreen';
import PickSelectionScreen from 'scenes/onboarding/PickSelectionScreen';
import StyleSelectionScreen from 'scenes/onboarding/StyleSelectionScreen';


const Stack = createNativeStackNavigator();
function AuthNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={RoutePath.socialAuth}
        component={SocialAuthScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={RoutePath.emailLogin}
        component={EmailLoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={RoutePath.emailSignUp}
        component={EmailSignUpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={RoutePath.heightAndWeight}
        component={HeightAndWeightScreen}
        options={{ headerShown: false }} />
      <Stack.Screen
        name={RoutePath.styleSelection}
        component={StyleSelectionScreen}
        options={{ headerShown: false }} />
      <Stack.Screen
        name={RoutePath.pickSelection}
        component={PickSelectionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={RoutePath.followSuggestion}
        component={FollowSuggestionScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default AuthNavigation;
