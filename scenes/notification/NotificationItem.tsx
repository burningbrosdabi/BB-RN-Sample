import { Notification } from 'model';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import { linkService } from 'services/link/link.service';
import { NotificationService } from 'services/notification';
import { Colors, Typography } from 'styles';
import { dateToString } from 'utils/helper/function.helper';
import { isNil } from 'lodash';
import ProfileImage from 'components/images/ProfileImage';
import { NotificationScreenContext } from 'scenes/notification/context';

interface Props {
  item: Notification;
}

export const NotificationItem = ({ item }: Props) => {
  const [is_read, setRead] = useState(item.is_read);
  const { setUnread, unread, readAllSubscription: subscription } = useContext(NotificationScreenContext);

  useEffect(() => {
    const sub = subscription(() => {
      setRead(true);
    })
    return () => {
      sub();
    }
  }, []);

  const onPress = () => {
    if (!is_read) {
      setRead(true);
      NotificationService.instance.markAsRead(item.pk);
      setUnread(unread - 1);
    }

    if (!item.route) return;
    linkService().queue(`apps://dabi${item.route}`);
  };

  const { sender } = item;
  return (
    <Ripple onPress={onPress} style={[styles.container, { opacity: is_read ? 0.3 : 1 }]}>
      <ProfileImage pk={sender?.pk} source={sender?.profile_image} size={48} />
      <View style={styles.contentContainer}>
        <View style={{ height: 12 }} />
        <Text style={Typography.name_button}>{`${item.title}`}</Text>
        {item.body ? (
          <Text numberOfLines={4} style={{ ...Typography.body }} textBreakStrategy={'simple'}>
            {item.body}
          </Text>
        ) : undefined}
        <View style={{ height: 4 }} />
        <Text style={Typography.description}>{`${dateToString(item.publish_date)}`}</Text>
      </View>
    </Ripple>
  );
};

export const NotificationPlaceholderItem = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <PlaceholderMedia color={Colors.background} size={48} style={styles.img} />
      </View>
      <View style={styles.contentContainer}>
        <View style={{ width: '100%', height: 48, justifyContent: 'center' }}>
          <PlaceholderLine noMargin color={Colors.background} height={16} width={30} />
        </View>
        <PlaceholderLine color={Colors.background} noMargin height={16} width={60} />
        <View style={{ height: 8 }} />
        <PlaceholderLine color={Colors.background} noMargin height={16} width={70} />
      </View>
    </View>
  );
};

// export const itemHeight = 108;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    // height: itemHeight,
    flexDirection: 'row',
    borderBottomColor: Colors.background,
  },
  contentContainer: {
    paddingLeft: 12,
    flex: 1,
  },
  img: { width: 48, height: 48, borderRadius: 24 },
  iconContainer: {
    overflow: 'hidden',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface.lightGray,
  },
});
