import { useNavigation } from '@react-navigation/native';
import { toast } from 'components/alert/toast';
import { ButtonType } from 'components/button/Button';
import { Link } from 'components/button/Link';
import { Switch } from 'components/button/Switch';
import { ConnectionDetection } from 'components/empty/OfflineView';
import BackButton from 'components/header/BackButton';
import { HandledError } from 'error';
import { isEmpty, range } from 'lodash';
import { Notification } from 'model';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Fade, Placeholder } from 'rn-placeholder';
import { AuthRouteSetting } from 'routes';
import { Subject } from 'rxjs';
import { NotificationScreenContext } from 'scenes/notification/context';
import { NavigationService } from 'services/navigation';
import { NotificationResponse, NotificationService } from 'services/notification';
import { applyOpacity, Colors, Typography } from 'styles';
import { screen } from 'styles/spacing';
import { HEADER_HEIGHT, unAwaited } from 'utils/helper/function.helper';
import { useActions } from 'utils/hooks/useActions';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { NotificationItem, NotificationPlaceholderItem } from './NotificationItem';
import { useSwitchNotification } from './UseNotiPermission';

export const NotificationScreen = () => {
  const initialized = useRef<boolean | undefined>();
  const { switchValue, onSwitchValueChange, checkNotiPerm } = useSwitchNotification();
  const { showDialog, setLoading } = useActions();
  const [unread, _setUnread] = useState(0);
  const { isLoggedIn, } = useTypedSelector((state) => state.auth);
  const navigation = useNavigation()

  useEffect(() => {
    if (!isLoggedIn) {
      showDialog({
        title: 'Bạn cần đăng nhập\nđể sử dụng chức năng này.',
        actions: [
          {
            type: ButtonType.primary,
            text: 'Đăng nhập',
            onPress: () => {
              NavigationService.instance.navigate(new AuthRouteSetting());
            },
          },
          {
            text: 'Quay Lại',
            type: ButtonType.flat,
            onPress: () => {
              navigation.goBack()
            },
          },
        ],
      })

    }
    setLoading(false);
  }, [isLoggedIn])
  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      if (!isLoggedIn) {
        showDialog({
          title: 'Bạn cần đăng nhập\nđể sử dụng chức năng này.',
          actions: [
            {
              type: ButtonType.primary,
              text: 'Đăng nhập',
              onPress: () => {
                NavigationService.instance.navigate(new AuthRouteSetting());
              },
            },
            {
              text: 'Quay Lại',
              type: ButtonType.flat,
              onPress: () => {
                navigation.goBack()
              },
            },
          ],
        })
      }
    });

    return () => {
      unsub();
    };
  }, [isLoggedIn]);

  const setUnread = (value: number) => {
    _setUnread(Math.max(value, 0));
  };

  useEffect(() => {
    if (initialized.current) {
      toast(switchValue ? 'Thông báo của nàng đã được bật :)' : 'Xin đừng tắt thông báo mà T_T');
    }
  }, [switchValue]);

  const { state, data, error, excecute } = useAsync<NotificationResponse>(
    NotificationService.getNotifications,
    {
      emptyDataLogical: data => isEmpty(data.results),
    },
  );

  useEffect(() => {
    excecute();
    NotificationService.instance.hasNotificationObserver.next(false);
    unAwaited(checkNotiPerm().then(_ => (initialized.current = true)));
  }, []);

  useEffect(() => {
    if (error instanceof HandledError) {
      showDialog({
        title: error.friendlyMessage,
        actions: [
          {
            type: ButtonType.primary,
            text: 'Ok',
            onPress: () => {
              /** */
            },
          },
        ],
      });
      error.log(true);
    }
  }, [error]);

  useEffect(() => {
    if (!data) return;
    setUnread(data.unread_count);
  }, [data]);

  const readAllStream = useRef(new Subject()).current;

  useEffect(() => {
    const sub = readAllStream.subscribe(async _ => {
      setLoading(true);
      try {
        // call api
        await NotificationService.instance.markAsRead()
        setUnread(0);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      sub.unsubscribe();
    };
  });

  const subscribe = (cb: () => void) => {
    const subscription = readAllStream.subscribe(cb);
    return subscription.unsubscribe;
  };

  const markAsReadAll = () => {
    readAllStream.next();
  };

  return (
    <NotificationScreenContext.Provider
      value={{ unread, setUnread, readAllSubscription: subscribe }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
          }}>
          <Header
            markAsReadAll={markAsReadAll}
            initialValue={switchValue}
            onSwitchValueChange={onSwitchValueChange}
          />
          <ConnectionDetection.View>
            <>
              {(state === ConnectionState.waiting || state === ConnectionState.hasError) && (
                <WaitingView />
              )}
              {(state === ConnectionState.hasEmptyData || isLoggedIn === false) && <EmptyDataView />}
              {state === ConnectionState.hasData && isLoggedIn === true && <HasDataView data={data!} />}
            </>
          </ConnectionDetection.View>
        </View>
      </SafeAreaView>
    </NotificationScreenContext.Provider>
  );
};

const HasDataView = ({ data }: { data: NotificationResponse }) => {
  const renderItem = ({ item }: { item: Notification }) => <NotificationItem item={item} />;
  const nextUrl = useRef<string | null>(data.next);
  const [notiList, setNotiList] = useState(data.results);

  const {
    data: additionalData,
    state,
    excecute,
  } = useAsync<NotificationResponse>(() => NotificationService.getNotifications(nextUrl.current!));

  useEffect(() => {
    switch (state) {
      case ConnectionState.hasData:
        nextUrl.current = additionalData?.next ?? null;
        setNotiList(notiList.concat(additionalData!.results));
        break;
      case ConnectionState.none:
      case ConnectionState.hasError:
      case ConnectionState.waiting:
      case ConnectionState.hasEmptyData:
      default:
    }
  }, [state]);

  const onEndReached = (info: { distanceFromEnd: number }) => {
    if ((state !== ConnectionState.none && state !== ConnectionState.hasData) || !nextUrl.current) {
      return;
    }
    excecute();
  };

  const keyExtractor = (item: Notification, index: number) => `${index}`;

  return (
    <FlatList
      testID="noti-list-data"
      onEndReachedThreshold={0.2}
      onEndReached={onEndReached}
      data={notiList}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      removeClippedSubviews
      ListFooterComponent={
        state === ConnectionState.waiting ? <WaitingView numberOfItem={1} /> : null
      }
    />
  );
};

const WaitingView = ({ numberOfItem = 5 }: { numberOfItem?: number }) => {
  return (
    <Placeholder testID={'waiting-view'} Animation={Fade}>
      {range(numberOfItem).map((_, index) => (
        <NotificationPlaceholderItem key={index} />
      ))}
    </Placeholder>
  );
};

const EmptyDataView = () => {
  return (
    <View testID={'noti-empty-data-view'} style={styles.emptyDataViewContainer}>
      <View style={{ flex: 1 }} />
      <Image style={{ width: 150, height: 150 }} source={require('assets/images/empty/info_noti.png')} />
      <Text style={styles.emptyDataViewTitle}>{'Ôi bạn chưa có thông báo gì cả'}</Text>
      <View style={{ height: 6 }} />
      <Text
        style={{
          ...Typography.body,
          color: Colors.text,
          textAlign: 'center',
        }}>
        {'Đón chờ những thông báo xịn xò từ DABI bạn nhé'}
      </Text>
      <View style={{ flex: 1 }} />
      <View style={{ height: 48 }} />
    </View>
  );
};

const Header = ({
  initialValue,
  onSwitchValueChange,
  markAsReadAll,
}: {
  initialValue: boolean;
  onSwitchValueChange: (value: boolean) => void;
  markAsReadAll: () => void;
}) => {
  const { unread } = useContext(NotificationScreenContext);

  return (
    <View>
      <View
        style={{
          paddingLeft: 0,
          height: HEADER_HEIGHT,
          paddingRight: 2,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottomWidth: 1,
          borderBottomColor: Colors.background,
        }}>
        <BackButton />
        <View style={{ flex: 1 }} />
        <View style={{ paddingRight: 12 }}>
          <Switch initialValue={initialValue} onChange={onSwitchValueChange} />
        </View>
        <View
          style={{
            position: 'absolute',
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={[Typography.title]}>{`Thông báo`}</Text>
          {unread > 0 && (
            <View style={styles.readCountContainer}>
              <Text style={styles.unreadText}>{`${unread > 99 ? '99+' : unread}`}</Text>
            </View>
          )}
        </View>
      </View>
      <View
        style={{
          alignItems: 'flex-end',
          paddingRight: 4,
          paddingVertical: 12,
          borderBottomColor: Colors.background,
          borderBottomWidth: 4,
        }}>
        <Link
          disabled={unread <= 0}
          style={[Typography.description, { textDecorationLine: 'none', }]}
          text={'Đánh dấu đã đọc'}
          onPress={markAsReadAll}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyDataViewContainer: { flex: 1, alignItems: 'center', paddingHorizontal: 16 },
  emptyDataViewTitle: { ...Typography.title, color: Colors.black, textAlign: 'center' },
  // header
  headerTitleContainer: { position: 'absolute', alignItems: 'center' },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
  },
  actionContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingRight: 16,
    flexDirection: 'row',
    width: screen.width,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readCountContainer: {
    marginLeft: 4,
    backgroundColor: applyOpacity(Colors.primary, 0.3),
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  unreadText: {
    ...Typography.description,
    color: Colors.primary,
  },
});
