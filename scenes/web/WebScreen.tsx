import React from 'react';
import RNWebView from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { useFavoriteButton } from 'utils/hooks/useFavoriteButton';
import { Influencer } from 'model/influencer/influencer';
import { userFollowController } from 'services/user';

export const WebScreen = ({ uri, params }: { uri: string; params?: any }) => {
  const token = useTypedSelector(state => state.auth.token);
  const navigation = useNavigation();

  const inject = `
    window.state = {
      token: "5cf9ebae420e5648181f4832f92b6a03a225b4c5",
      isNativeApp: true,
    };
    true;
  `;

  const parsedMessage = (message?: string) => {
    try {
      if (!message) return;
      const action = JSON.parse(message);
      if (!action?.type) return;
      actionHandler(action);
    } catch (e) { }
  };

  const { onPress } = useFavoriteButton<Influencer>({
    pk: params?.pk ?? -1,
    controller: userFollowController,
    // toastMessage: {
    //     marked: `Đã theo dõi ${name}`,
    //     unmarked: `Bỏ theo dõi ${name}`
    // },
    prepare: value =>
    ({
      pk: params.pk,
      is_following: value,
    } as Influencer),
  });

  const actionHandler = ({ type, payload }: { type: string; payload?: { [key: string]: any } }) => {
    switch (type) {
      case 'arrow_left':
        navigation.goBack();
        break;
      case 'followKOL':
        onPress();
        break;
      default:
        return;
    }
  };

  return (
    <RNWebView
      injectedJavaScriptBeforeContentLoaded={inject}
      onMessage={event => {
        parsedMessage(event.nativeEvent.data);
      }}
      source={{ uri }}
    />
  );
};
