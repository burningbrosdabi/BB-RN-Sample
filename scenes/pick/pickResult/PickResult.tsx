import AsyncStorage from '@react-native-community/async-storage';
import React, { useRef } from 'react';
import { Text, View } from 'react-native';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import ViewShot from 'react-native-view-shot';
import { Spacing, Typography } from 'styles';
import { storeKey } from 'utils/constant';
import {
  FeminineIcon,
  Lovely2Icon,
  LovelyIcon,
  SexyIcon,
  SimpleIcon,
  Street2Icon,
  StreetIcon
} from 'assets/content-svg';
import {
  getRandomInt, shareFacebook
} from '_helper';
import { LogoIcon } from '_icons';
import * as cs from 'styles/legacy/common.style';
import theme from 'styles/legacy/theme.style';
import { toast } from 'components/alert/toast';

/** @deprecated   **/
const PickResult = ({ data }) => {
  const viewShotRef = useRef();

  const hasPhotoLibraryPermission = async (isIOS: boolean) => {
    let granted = false;
    let isOpenDialog = false;
    const hasOpen = await AsyncStorage.getItem(storeKey.alreadyAskPermission);

    const status = await check(
      isIOS ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    );
    if (status == RESULTS.GRANTED) {
      granted = true;
    } else if (status == RESULTS.BLOCKED || status === RESULTS.LIMITED) {
      isOpenDialog = true;
    }

    if (status === RESULTS.DENIED) {
      const permissionAndroid = await request(
        isIOS ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      );
      if (permissionAndroid == RESULTS.GRANTED) {
        granted = true;
      } else if (permissionAndroid == RESULTS.BLOCKED) {
        if (hasOpen !== 'true') {
          AsyncStorage.setItem(storeKey.alreadyAskPermission, 'true');
        } else {
          isOpenDialog = true;
        }
      }
    }

    console.log(granted, isOpenDialog);
    return { granted: granted, isOpenDialog: isOpenDialog };
  };

  const onSuccess = (message: string) => {
    toast(message);
  };

  const onShareFB = async () => {
    try {
      await shareFacebook(viewShotRef);
      toast('Chia sẻ thành công');
    } catch (_) {
      onSuccess('Đã xảy ra lỗi');
    }
  };

  const _renderImage = ({
    primary_style: style,
    primary_style: primaryStyle,
    user_first_color: primaryColor,
  }) => {
    let subColor = theme.BLACK;
    let textList = [];
    let text = '';
    let image = <StreetIcon size={Spacing.screen.width} color={primaryColor} />;

    // Need to make this as a DB in Server
    switch (style) {
      case 'street':
        textList = [
          'Thời trang có thể mua,\nphong cách phải sở hữu!',
          'Phong cách là thứ sẽ nói lên\nbạn là ai mà không cần cất lời 🤟',
        ];
        var images = [
          {
            image: <StreetIcon size={Spacing.screen.width} color={primaryColor} />,
            subColor: theme.BLACK,
          },
          {
            image: <Street2Icon size={Spacing.screen.width} color={primaryColor} />,
            subColor: theme.BLACK,
          },
        ];
        var ramdomInteger = Math.floor(Math.random() * images.length);
        subColor = images[ramdomInteger].subColor;
        image = images[ramdomInteger].image;
        text = textList[getRandomInt(textList.length)];
        break;
      case 'simple':
        textList = [
          'Em đừng xem mấy cuộc thi hoa hậu nữa, lấy gương ra mà soi cho đỡ mất thời gian!',
          'Hi Anh!',
          'Em đây chẳng thích nhiều lời, Nhìn Anh là biết bạn đời của Em...❤️',
        ];
        subColor = '#974a47';
        image = <SimpleIcon size={Spacing.screen.width} color={primaryColor} />;
        text = textList[getRandomInt(textList.length)];
        break;
      case 'lovely':
        var images = [
          {
            image: <LovelyIcon size={Spacing.screen.width} color={primaryColor} />,
            subColor: '#ff746d',
          },
          {
            image: <Lovely2Icon size={Spacing.screen.width} color={primaryColor} />,
            subColor: '#8b5b45',
          },
        ];
        var ramdomInteger = Math.floor(Math.random() * images.length);
        subColor = images[ramdomInteger].subColor;
        textList = [
          'Hi Anh!',
          'Như thế này liệu đã đủ tiêu chuẩn để làm bạn gái anh chưa?',
          'Bạn chưa tìm được hoàng tử không có nghĩa bạn không phải là một công chúa',
        ];

        image = images[ramdomInteger].image;
        text = textList[getRandomInt(textList.length)];
        break;
      case 'feminine':
        subColor = '#636db3';
        textList = [
          'Phụ nữ hiện đại chẳng ngại độc thân!',
          'Người phụ nữ mạnh mẽ là người sở hữu tiếng nói của riêng mình!',
        ];
        image = <FeminineIcon size={Spacing.screen.width} color={primaryColor} />;
        text = textList[getRandomInt(textList.length)];
        break;
      case 'sexy':
        subColor = '#59249c';
        textList = [
          'Phụ nữ hãy đẹp mỗi ngày, đừng chỉ đẹp khi cần!',
          'Học ăn học nói học trói anh bằng cà vạt!',
          'Hình như là em chiều các anh quá rồi nên các anh hư đúng không',
          'Hi Anh!',
        ];
        image = <SexyIcon size={Spacing.screen.width} color={primaryColor} />;
        text = textList[getRandomInt(textList.length)];
        break;
      default:
        subColor = theme.BLACK;
        textList = [];
        image = null;
        text = '';
    }
    return (
      <View>
        <View
          style={{
            position: 'absolute',
            zIndex: 10,
            width: Spacing.screen.width,
            height: (Spacing.screen.width / 36) * 5,
            top: Spacing.screen.width / 12,
            paddingHorizontal: Spacing.screen.width / 9,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              ...Typography.boxTitle,
              color: subColor,
              textAlign: 'center',
            }}>
            {text}
          </Text>
        </View>
        {image ?? (
          <View
            style={{
              width: Spacing.screen.width,
              aspectRatio: 36 / 45,
              backgroundColor: theme.LIGHT_GRAY,
            }}
          />
        )}
        <View
          style={{
            position: 'absolute',
            zIndex: 10,
            width: Spacing.screen.width,
            bottom: Spacing.screen.width / 18,
            paddingHorizontal: Spacing.screen.width / 6,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              ...Typography.option,
              color: subColor,
              textAlign: 'center',
              top: 2,
            }}>
            {primaryStyle && 'Phong cách của bạn là\n' + primaryStyle}
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            zIndex: 10,
            bottom: Spacing.screen.width / 18,
            left: Spacing.screen.width / 18,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <LogoIcon color={theme.WHITE} />
        </View>
        <View
          style={{
            position: 'absolute',
            zIndex: 10,
            height: 30,
            bottom: Spacing.screen.width / 18,
            right: Spacing.screen.width / 18,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              ...Typography.smallCaption,
              color: theme.WHITE,
            }}>
            Tủ đồ đặc biệt của nữ
          </Text>
        </View>
      </View>
    );
  };

  const _renderShareIcons = () => {
    return (
      <View style={[{ alignItems: 'center', paddingVertical: 20 }]}>
        <Text style={[Typography.boxTitle, cs.c_pc]}>Chia sẻ style của bạn với bạn bè</Text>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          {/* <IconCircleButton
            icon={<FacebookIcon />}
            rounded
            background={theme.FACEBOOK_BLUE}
            border={theme.FACEBOOK_BLUE}
            buttonStyle={{ marginRight: theme.MARGIN_20 }}
            handleOnPress={onShareFB}
          /> */}
          {/* <IconCircleButton
            icon={<InstaIcon color={theme.PRIMARY_COLOR} />}
            background={theme.WHITE}
            border={theme.LIGHT_GRAY}
            rounded
            buttonStyle={{ marginRight: theme.MARGIN_20 }}
            handleOnPress={async () => {
              if (Platform.OS == 'android') {
                shareInstagram(viewShotRef);
              } else {
                const { granted, isOpenDialog } = await hasPhotoLibraryPermission(true);
                if (isOpenDialog) {
                  openPermissionsDialog('Yêu cầu truy cập vào thư viện ảnh bị từ chối.');
                } else if (granted) {
                  shareInstagram(viewShotRef);
                }
              }
            }}
          />
          <IconCircleButton
            icon={<DabiFont name={'download'} color={theme.WHITE} />}
            background={theme.PRIMARY_COLOR}
            rounded
            handleOnPress={async () => {
              const { granted, isOpenDialog } = await hasPhotoLibraryPermission(
                Platform.OS == 'ios',
              );
              if (isOpenDialog) {
                openPermissionsDialog('Yêu cầu truy cập vào thư viện ảnh bị từ chối.');
              } else if (granted) {
                saveToPhotoAlbum(viewShotRef, onSuccess, openPermissionsDialog);
              }
            }}
          /> */}
        </View>
      </View>
    );
  };
  return (
    <View>
      <ViewShot ref={viewShotRef}>{data && _renderImage(data)}</ViewShot>
      {_renderShareIcons()}
    </View>
  );
};

export default PickResult;
