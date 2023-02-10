import { useRoute } from '@react-navigation/native';
import { UpIcon } from 'assets/icons';
import { toast } from 'components/alert/toast';
import { Button, ButtonState, ButtonType, LayoutConstraint } from 'components/button/Button';
import { EmptyView } from 'components/empty/EmptyView';
import { ConnectionDetection } from 'components/empty/OfflineView';
import BackButton from 'components/header/BackButton';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Ripple from 'react-native-material-ripple';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { RoutePath } from 'routes';
import { RecipientScreenParams } from 'routes/recipient/recipient.route';
import { deleteRecipientApi, getRecipientList } from 'services/api';
import { Colors, Outlines, Spacing, Typography } from 'styles';
import theme from 'styles/legacy/theme.style';
import { getUniqueListBy } from 'utils/helper';
import { useActions } from 'utils/hooks/useActions';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import RecipientItem from './RecipientItem';

const RecipientListScreen = ({ navigation, count = 20 }: { navigation: any; count: number }) => {
  const { recipients } = useTypedSelector((state) => state.user);
  const { showDialog, setRecipients, delRecipient } = useActions();
  const route = useRoute();
  const { onSelectItem } = (route.params ?? {}) as RecipientScreenParams;

  const recipientListRef = useRef(null);

  const [inProgressNetworkReq, setInProgressNetworkReq] = useState(false);
  const [offset, setOffset] = useState(count);
  const [isDataEnd, setIsDataEnd] = useState(recipients.length == 0);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const _fetchMoreData = async (recreate = false) => {
    if (!inProgressNetworkReq) {
      setInProgressNetworkReq(true);
      const { data: newData, totalCount } = await getRecipientList({
        offset: recreate ? 0 : offset,
      });
      setInProgressNetworkReq(false);
      if (totalCount <= count || offset >= totalCount) {
        setIsDataEnd(true);
      }
      // Recreate Data
      if (recreate) {
        setRecipients(newData);
        setOffset(count);
      } else {
        // Add Data
        const newList = getUniqueListBy(recipients.concat(newData), 'id');
        setRecipients(newList);
        setOffset(offset + count);
      }
    }
  };

  const onSelectedItem = (item: any) => {
    if (item && item.id == selectedItem?.id) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
    }
  };

  const onEditRecipient = (item: any) => {
    navigation.push(RoutePath.createEditRecipientScreen, { data: item, isEditing: true });
  };

  const _rowRenderer = (type: any, data: any, index: number) => {
    return (
      <RecipientItem
        onCheckoutSelected={onSelectItem}
        canDelete={recipients.length > 1}
        isEditing={isEditing}
        onSelectedItem={onSelectedItem}
        onEditRecipient={onEditRecipient}
        selectedItem={selectedItem}
        data={data}
        style={{ marginBottom: recipients.length - 1 === index ? 50 : 12 }}
      />
    );
  };

  const onCreateEditRecipient = () => {
    navigation.push(RoutePath.createEditRecipientScreen, { data: {} });
  };

  const _renderHeader = () => {
    if (recipients?.length == 0) return null;
    return (
      <View>
        <Text style={styles.titleText}>{'Địa chỉ của bạn'}</Text>
        <Ripple
          disabled={isEditing}
          onPress={onCreateEditRecipient}
          style={styles.newAddressButton}>
          <Text style={{ ...Typography.option, color: Colors.text, textTransform: 'none' }}>
            {'THÊM ĐỊA CHỈ MỚI +'}
          </Text>
        </Ripple>
      </View>
    );
  };

  const onDeleteReceipt = () => {
    _renderDeleteAlert();
  };

  const _renderDeleteAlert = () => {
    showDialog({
      title: 'Bạn có chắc chắn muốn xóa địa chỉ đã chọn?',
      actions: [
        {
          type: ButtonType.primary,
          text: 'Xóa',
          onPress: () => deleteReceipt(),
        },
        {
          text: 'Giữ lại',
          type: ButtonType.flat,
          onPress: () => { },
          textStyle: { color: Colors.primary },
        },
      ],
    });
  };

  const deleteReceipt = async () => {
    try {
      await deleteRecipientApi(selectedItem.id);
      delRecipient(selectedItem);
      setIsEditing(false);
      setSelectedItem(null);
      toast('Xóa địa chỉ thành công');
    } catch (error) {
      showDialog({
        title: error.friendlyMessage,
        actions: [
          {
            type: ButtonType.primary,
            text: 'Ok',
            onPress: () => { },
          },
        ],
      });
    }
  };

  const _renderFooter = () => {
    return isDataEnd ? (
      <View style={{ height: isEditing ? 37 * Spacing.AUTH_RATIO_H + 48 : 0 }} />
    ) : (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 40,
        }}>
        <ActivityIndicator />
      </View>
    );
  };

  const _renderEmpty = () => {
    return (
      <View style={styles.emptyView}>
        <EmptyView
          title={'Bạn chưa có địa chỉ nào!'}
          titleStyle={{ marginTop: 24 }}
          description={'Vui lòng thêm địa chỉ để có thể mua sắm cùng Dabi nhé'}
          descriptionStyle={{ marginTop: 6 }}
          file={require('_assets/images/icon/info_address.png')}
          style={{ flex: undefined }}
        />
        <Ripple
          onPress={onCreateEditRecipient}
          style={[styles.newAddressButton, { marginTop: -24 }]}>
          <Text style={{ ...Typography.option, color: Colors.text, textTransform: 'none' }}>
            {'THÊM ĐỊA CHỈ MỚI +'}
          </Text>
        </Ripple>
      </View>
    );
  };

  const handleListEnd = async () => {
    console.log(isDataEnd);

    if (!isDataEnd) {
      await _fetchMoreData();
    }
  };

  const onEditing = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setSelectedItem(null);
    }
  };

  const onGotoTop = () => {
    recipientListRef?.current?.scrollToOffset({
      animated: true,
      offset: 0,
    });
  };

  const onRefresh = async () => {
    setIsDataEnd(false);
    await _fetchMoreData(true);
  };

  return (
    <ConnectionDetection.View>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <BackButton mode={'cancel'} />
          {recipients.length ? (
            <Ripple onPress={onEditing} style={styles.iconDelete}>
              <Image style={styles.icon} source={require('_assets/images/fontable/bin.png')} />
            </Ripple>
          ) : undefined}
        </View>
        <View style={styles.container}>
          <FlatList
            ref={recipientListRef}
            showsVerticalScrollIndicator={false}
            data={recipients}
            renderItem={({ item, index }) => _rowRenderer(null, item, index)}
            ListFooterComponent={_renderFooter}
            ListHeaderComponent={_renderHeader}
            ListEmptyComponent={_renderEmpty}
            onEndReached={handleListEnd}
            onEndReachedThreshold={0.05}
            refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
            keyExtractor={(item: any, index) => `${item.id}${index}`}
          />
        </View>
        {isEditing && (
          <View style={styles.nextButton}>
            <Button
              type={ButtonType.primary}
              constraint={LayoutConstraint.matchParent}
              state={!selectedItem ? ButtonState.disabled : ButtonState.idle}
              onPress={onDeleteReceipt}
              disabled={!selectedItem}
              text={'Xóa'}
            />
          </View>
        )}
        {recipients.length > 0 ? (
          <View style={styles.upIconContainer}>
            <TouchableOpacity onPress={onGotoTop} style={{ alignItems: 'center' }}>
              <View style={[styles.buttonContainer]}>
                <UpIcon />
              </View>
            </TouchableOpacity>
          </View>
        ) : undefined}
      </SafeAreaView>
    </ConnectionDetection.View>
  );
};

export default React.memo(RecipientListScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  titleText: {
    ...Typography.h1,
    textAlign: 'center',
    marginVertical: 12,
  },
  newAddressButton: {
    height: 48,
    width: Spacing.screen.width - 32,
    borderRadius: 4,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.boxLine,
    marginBottom: 12,
  },
  header: {
    height: 48,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconDelete: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  nextButton: {
    width: Spacing.screen.width - 32,
    marginLeft: 16,
    position: 'absolute',
    bottom: 0,
    paddingBottom: 37 * Spacing.AUTH_RATIO_H,
    backgroundColor: 'white',
    paddingTop: 12,
  },
  buttonContainer: {
    padding: 8,
    zIndex: 500,
    backgroundColor: theme.WHITE,
    borderWidth: Outlines.borderWidth.base,
    borderColor: theme.LIGHT_GRAY,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    borderRadius: 50,
  },
  upIconContainer: {
    zIndex: 1000,
    position: 'absolute',
    bottom: theme.MARGIN_20,
    right: theme.MARGIN_20,
    alignItems: 'center',
  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: Spacing.screen.height - 170 - getStatusBarHeight(),
  },
});
