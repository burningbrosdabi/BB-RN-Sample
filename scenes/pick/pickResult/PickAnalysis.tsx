import { BlurView } from '@react-native-community/blur';
import { useRoute } from '@react-navigation/native';
import { toast } from 'components/alert/toast';
import Button, { ButtonState, ButtonType } from 'components/button/Button';
import { ImageElementFlex } from 'components/images/ImageElement';
import { HandledError } from 'error';
import { get, isNil, toNumber } from 'lodash';
import { PickResult } from 'model/pick/pick';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import AnimatedProgress from 'react-native-reanimated-progress-bar';
import ViewShot from 'react-native-view-shot';
import { PickIn6RouteSetting } from 'routes/pick/pick.route';
import { combiImageMap, styleImageMap, styleMiniImageMap } from 'scenes/pick/type';
import { useNavigator } from 'services/navigation/navigation.service';
import { Completer } from 'services/remote.config';
import { applyOpacity, Colors, Spacing, Typography } from 'styles';
import { StyleKey, styleNameMap } from 'utils/data';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import { defaultShare, shareFacebook, shareInstagram } from 'utils/hooks/useShare';
import { getPickResult, PickType, postPickShareStatus } from '_api';
import LoadingIndicator from 'components/loading/LoadingIndicator';

interface Props {
  data: PickResult;
}

interface StyleProp {
  name?: any | null;
  image?: string | null;
}

export const PickAnalysis = ({ navigateRecommend }: { navigateRecommend: () => void }) => {
  const { params } = useRoute();
  const data: PickResult = get(params, 'data');
  const type: PickType = get(params, 'type', PickType.IN6);
  // const [capture, setCapture] = useState('')
  const captureCompleter = useRef(new Completer<undefined>()).current;
  const viewRef = useRef<ViewShot>();
  const is_shared = data.is_shared;
  const [imageReady, setImageReady] = useState(false);

  const navigator = useNavigator();
  if (!data) {
    navigator.goBack();
  }

  const retry = () => {
    navigator.navigate(new PickIn6RouteSetting());
  };

  const onImageReady = async () => {
    try {
      if (isNil(viewRef?.current?.capture)) return;
      const uri = await viewRef.current!.capture();

      captureCompleter.complete(null);
      setImageReady(true);
    } catch (e) {
      captureCompleter.reject(e as Error);
    }
  };

  const capture = () => {
    return viewRef?.current?.capture!();
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <View style={{ height: 12 }} />
          <ViewShot ref={viewRef}>
            <View style={{ backgroundColor: 'white', paddingBottom: 36 }}>
              <Image
                onLoad={onImageReady}
                source={styleImageMap[data.name]}
                width={Spacing.screen.width}
                style={{
                  width: Spacing.screen.width,
                  height: (Spacing.screen.width * 4) / 3,
                  backgroundColor: data.color,
                }}
              />
              <Image
                source={combiImageMap[data.name]}
                style={{
                  width: Spacing.screen.width,
                  height: (Spacing.screen.width * 4) / 9,
                  // backgroundColor: data.color,
                }}
              />
            </View>
          </ViewShot>

          <View style={{ marginBottom: 36 }}>
            <StyleStatistic style={data.name} pct={data.pct_of_same_style} />
          </View>
          <View style={{ marginBottom: 36 }}>
            <StyleChart data={data} type={type} />
          </View>
          {!is_shared ? (
            <View
              style={{
                position: 'absolute',
                top: (Spacing.screen.width * 4) / 3 + 12,
                bottom: 0,
                left: 0,
                right: 0,
              }}>
              <ForceShare is_shared={is_shared} capture={capture} completer={captureCompleter} />
            </View>
          ) : (
            <View style={{ marginBottom: 36 }}>
              <Share capture={capture} completer={captureCompleter} />
            </View>
          )}
        </View>

        <View style={{ marginBottom: 12 }}>
          <CheckProduct navigateRecommend={navigateRecommend} />
        </View>
        <View style={{ paddingHorizontal: 16, marginBottom: 36 }}>
          <Text style={{ ...Typography.name_button, textAlign: 'center' }}>
            Đây không phải kết quả bạn mong muốn?{'\n'}Thử lại ngay!
          </Text>
          <View style={{ height: 12 }} />
          <Button
            type={ButtonType.outlined}
            text={'Thử lại'}
            onPress={retry}
          // textStyle={{ color: Colors.black }}
          />
        </View>
        <ImageElementFlex
          transparent
          containerStyle={{ width: '100%', height: 240 }}
          image={require('assets/images/pick/background/result_background_05.png')}
        />
      </ScrollView>
      {/*</View>*/}
      {!imageReady && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'white',
          }}>
          <LoadingIndicator />
        </View>
      )}
    </View>
  );
};

const CheckProduct = ({ navigateRecommend }: { navigateRecommend: () => void }) => {
  return (
    <ImageBackground
      style={{ width: '100%', aspectRatio: 3 / 2, justifyContent: 'center' }}
      source={require('assets/images/pick/background/result_background_04.png')}>
      <View style={{ paddingHorizontal: 16 }}>
        <Text style={{ ...Typography.name_button, textAlign: 'center' }}>
          Cùng tìm kiếm trang phục hợp với bạn nào!
        </Text>
        <View style={{ height: 24 }} />
        <View style={{ height: 48 }}>
          <Button
            text={'Đi tìm trang phục'}
            color={Colors.purple}
            onPress={navigateRecommend}
          // textStyle={{ color: Colors.black }}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const StyleStatistic = ({ style, pct }: { style: StyleKey; pct: number }) => {
  return (
    <View
      style={{
        marginHorizontal: 16,
        paddingVertical: 36,
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: applyOpacity(Colors.blue, 0.3),
      }}>
      <View
        style={{
          width: 120,
          height: 120,
          backgroundColor: applyOpacity(Colors.white, 0.3),
          padding: 20,
          borderRadius: 60,
        }}>
        <ImageElementFlex transparent image={styleMiniImageMap[style]} />
      </View>
      <View style={{ height: 24 }} />
      <Text style={{ ...Typography.body, lineHeight: 28 }}>
        Có <Text style={{ ...Typography.h1, color: Colors.blue }}>{pct}%</Text> người dùng có cùng
      </Text>
      <Text style={{ ...Typography.body, lineHeight: 22 }}>
        phong cách <Text style={Typography.title}>{styleNameMap[style]}</Text> với bạn!
      </Text>
    </View>
  );
};

const StyleChart = ({ data, type }: Props & { type: PickType }) => {
  const { data: pickData, excecute } = useAsync(() => getPickResult(type));
  useEffect(() => {
    excecute();
  }, []);

  const {
    street = 0,
    lovely = 0,
    feminine = 0,
    office = 0,
    simple = 0,
    sexy = 0,
  } = pickData?.stylePoint ?? {};

  // const {street, lovely, feminine, office, simple, sexy} = props.stylePoint

  if (!pickData) return <></>;
  const maxPoint = pickData?.stylePoint[pickData.name] + 1;
  return (
    <View>
      <LinearGradient
        colors={[Colors.purple, Colors.white]}
        style={{
          borderTopRightRadius: 24,
          borderTopLeftRadius: 24,
          paddingTop: 24,
          paddingHorizontal: 16,
        }}>
        <Text style={{ ...Typography.title, color: Colors.white, textAlign: 'center' }}>
          Số điểm chi tiết
        </Text>
        <View style={{ height: 24 }} />
        <View
          style={{
            padding: 24,
            backgroundColor: Colors.white,
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
          }}>
          <StyleLine style={StyleKey.street} point={street} maxPoint={maxPoint} />
          <StyleLine style={StyleKey.simple} point={simple} maxPoint={maxPoint} />
          <StyleLine style={StyleKey.feminine} point={feminine} maxPoint={maxPoint} />
          <StyleLine style={StyleKey.lovely} point={lovely} maxPoint={maxPoint} />
          <StyleLine style={StyleKey.sexy} point={sexy} maxPoint={maxPoint} />
          <StyleLine style={StyleKey.office} point={office} maxPoint={maxPoint} />
        </View>
      </LinearGradient>
    </View>
  );
};

const StyleLine = ({
  style,
  point,
  maxPoint,
}: {
  style: StyleKey;
  point: number;
  maxPoint: number;
}) => {
  const [activeColor, inActiveColor] = useMemo(() => {
    switch (style) {
      case 'simple':
        return ['#FFA572', '#F8DFDE'];
      case 'feminine':
        return [Colors.yellow, '#FBF1E1'];
      case 'lovely':
        return [Colors.green, '#DBF3ED'];
      case 'sexy':
        return [Colors.blue, '#DFEAFA'];
      case 'office':
        return [Colors.purple, '#EFE3FA'];
      case 'street':
      default:
        return [Colors.primary, '#FEDEE5'];
    }
  }, [style]);

  const percentage = useMemo(() => {
    let value = '0';
    if (maxPoint % point === 0 || point === 0) {
      value = `${((point / maxPoint) * 100).toFixed(1)}`;
    } else {
      value = ((point / maxPoint) * 100).toFixed(1);
    }
    return `${value}%`;
  }, []);

  return (
    <View style={{ marginBottom: 24, flexDirection: 'row' }}>
      <Text style={{ ...Typography.description, width: 75 }}>{styleNameMap[style]}</Text>
      <AnimatedProgress
        fill={activeColor}
        current={point}
        total={maxPoint}
        progressStyle={{ borderRadius: 6 }}
        style={{ height: 12, borderRadius: 6, backgroundColor: inActiveColor }}
      />
      <View style={{ width: 12 }} />
      <Text style={{ ...Typography.description, width: 45 }}>{percentage}</Text>
    </View>
  );
};

const ForceShare = ({
  completer,
  capture,
  is_shared,
}: {
  completer: Completer<undefined>;
  capture: () => Promise<string>;
  is_shared: boolean;
}) => {
  // console.log(capture)
  // TODO : Need helper? for each sharing, so we can use those in future with feed more magazine..!
  // const [image, setImg] = useState<string | undefined>();
  const [ready, setReady] = useState(false);
  const [isShared, setIsShared] = useState(is_shared);

  useEffect(() => {
    completer.promise.then(_ => {
      setReady(true);
    });
  }, []);

  const onShare = async (type: 'fb' | 'insta') => {
    try {
      const image = await capture();

      if (type === 'insta') {
        await shareInstagram({ title: 'deeplink', uri: image! });
      } else {
        await shareFacebook({ title: 'deeplink', uri: image! });
      }
    } catch (e) {
      const exception = new HandledError({
        error: e as Error,
        stack: 'PickAnalysis.onShare',
      });
    } finally {
      setIsShared(true);
      await postPickShareStatus();
    }
  };

  if (!ready) return <></>;
  if (isShared) return <></>;

  return (
    <View
      style={{
        flex: 1,
        ...(Platform.OS === 'android' ? { justifyContent: 'center' } : { paddingTop: 30 }),
      }}>
      {Platform.select({
        android: (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              backgroundColor: 'white',
              opacity: 0.94,
            }}
          />
        ),
        ios: (
          <BlurView
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }}
            blurType="light"
            blurAmount={3}
            blurRadius={20}
            reducedTransparencyFallbackColor="white"
          />
        ),
      })}
      <View
        style={{
          marginHorizontal: 16,
          borderWidth: 1,
          paddingHorizontal: 12,
          paddingVertical: 24,
          borderRadius: 8,
          borderColor: Colors.line,
          backgroundColor: applyOpacity(Colors.white, 0.85),
          // shadowColor: "#000",
          // shadowOffset: {
          //     width: 0,
          //     height: 2,
          // },
          // shadowOpacity: 0.25,
          // shadowRadius: 3.84,
          // elevation: 5,
        }}>
        <View style={{ width: 80, height: 80, alignSelf: 'center' }}>
          <ImageElementFlex
            transparent
            image={require('assets/images/pick/dabi_avatar/dabi_ava_04.png')}
          />
        </View>
        <View style={{ height: 24 }} />

        <View style={{ paddingHorizontal: 12 }}>
          <Text style={{ ...Typography.h1 }}>Phần quan trọng nhất đang chờ bạn ở phía sau.</Text>
          <View style={{ height: 12 }} />
          <Text style={{ ...Typography.name_button }}>
            Hãy nhanh tay chia sẻ với bạn bè! Khám phá đáp án bí ẩn cuối cùng bằng cách chia sẻ bài
            kiểm tra này nhé!
          </Text>
        </View>
        <View style={{ height: 24 }} />
        <View style={{ height: 48, marginBottom: 12 }}>
          <Button
            prefixIcon={
              <Image
                style={{ width: 24, height: 24, marginRight: 12 }}
                source={require('assets/images/icon/insta.png')}
              />
            }
            onPress={() => onShare('insta')}
            text={'Chia sẻ qua Instagram'}
            color={Colors.primary}
          />
        </View>
        <View style={{ height: 48, marginBottom: 12 }}>
          <Button
            prefixIcon={
              <Image
                style={{ width: 24, height: 24, marginRight: 12 }}
                source={require('assets/images/fontable/fb_icon.png')}
              />
            }
            onPress={() => onShare('fb')}
            text={'Chia sẻ qua Facebook'}
            color={'#1877F2'}
          />
        </View>
      </View>
    </View>
  );
};

const Share = ({
  completer,
  capture,
}: {
  completer: Completer<undefined>;
  capture: () => Promise<string>;
}) => {
  // console.log(capture)
  // TODO : Need helper? for each sharing, so we can use those in future with feed more magazine..!
  // const [image, setImg] = useState<string | undefined>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    completer.promise.then(_ => {
      setReady(true);
    });
  }, []);

  const onShare = async (type: 'fb' | 'insta') => {
    try {
      const image = await capture();
      if (type === 'insta') {
        shareInstagram({ title: 'deeplink', uri: image! });
      } else {
        shareFacebook({ title: 'deeplink', uri: image! });
      }
    } catch (e) {
      const exception = new HandledError({
        error: e as Error,
        stack: 'PickAnalysis.onShare',
      });
      exception.log(true);
      toast('Đã xảy ra lỗi khi chia sẻ');
    }
  };

  const onDefaultShare = async () => {
    const image = await capture();
    defaultShare({ title: 'deeplink', uri: image! });
  };

  if (!ready) return <></>;

  return (
    <ImageBackground
      style={{ width: '100%', aspectRatio: 3 / 4, justifyContent: 'center' }}
      source={require('assets/images/pick/background/result_background_03.png')}>
      <View style={{ paddingHorizontal: 28 }}>
        <Text style={{ ...Typography.name_button, textAlign: 'center' }}>
          Hãy chia sẻ phong cách của bạn để tìm thêm nhiều bạn có cùng sở thích nhé!
        </Text>
        <View style={{ height: 24 }} />
        <View style={{ paddingHorizontal: 32 }}>
          <View style={{ height: 48, marginBottom: 12 }}>
            <Button
              prefixIcon={
                <Image
                  style={{ width: 24, height: 24, marginRight: 12 }}
                  source={require('assets/images/icon/instagram.png')}
                />
              }
              onPress={() => onShare('insta')}
              text={'Chia sẻ qua Instagram'}
              color={Colors.white}
              textStyle={{ color: Colors.black }}
            />
          </View>
          <View style={{ height: 48, marginBottom: 12 }}>
            <Button
              prefixIcon={
                <Image
                  style={{ width: 24, height: 24, marginRight: 12 }}
                  source={require('assets/images/fontable/fb_icon.png')}
                />
              }
              onPress={() => onShare('fb')}
              text={'Chia sẻ qua Facebook'}
              color={Colors.white}
              textStyle={{ color: Colors.black }}
            />
          </View>
          <View style={{ height: 48 }}>
            <Button onPress={onDefaultShare} text={'Chia sẻ'} />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  boxStyle: {
    flex: 1,
    backgroundColor: applyOpacity(Colors.white, 0.9),
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 24,
    paddingBottom: 13,
  },
});
