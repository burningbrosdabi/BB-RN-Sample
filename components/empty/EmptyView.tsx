import { Button, ButtonProps } from 'components/button/Button';
import React from 'react';
import {
  Image,
  ImageRequireSource,
  StyleSheet,
  Text,
  View,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Colors, Typography } from 'styles';
import { isNil } from 'lodash';

interface Props {
  file?: ImageRequireSource;
  svgImage?: React.ComponentType<any> | React.ReactElement | null;
  title: string;
  description: string;
  Description?: JSX.Element;
  action?: ButtonProps;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  style?: ViewStyle;
  overline?: string;
}

export const EmptyView = ({
  file,
  title,
  description,
  action,
  titleStyle,
  descriptionStyle,
  style,
  overline,
  Description,
}: Props) => {
  return (
    <View style={[styles.container, style]}>
      {file && <Image style={styles.imgBox} source={file} />}
      <View style={{ height: 12 }} />
      <Text style={[Typography.title, { textAlign: 'center' }, titleStyle]}>{title}</Text>

      {!isNil(Description) ? (
        Description
      ) : (
        <Text
          style={[Typography.body, { color: Colors.text, textAlign: 'center' }, descriptionStyle]}>
          {description}
        </Text>
      )}
      {overline && (
        <>
          <View style={{ height: 12 }} />
          <Text style={[Typography.body, styles.overlineTxt]}>{overline}</Text>
        </>
      )}
      {action && (
        <View style={styles.btnContainer}>
          <Button {...action} innerHorizontalPadding={24} />
        </View>
      )}
    </View>
  );
};

export const GenericErrorView = ({ action }: { action?: ButtonProps }) => {
  return (
    <EmptyView
      action={action}
      file={require('assets/images/empty/info_404.png') as ImageRequireSource}
      title={'Ối'}
      description={'Đã có lỗi xảy ra\nBạn hãy thử lại nhé'}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 36,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContainer: { flexDirection: 'column', height: 48, marginTop: 24 },
  overlineTxt: { color: Colors.primary },
  imgBox: { width: 150, height: 150, resizeMode: 'contain' },
});
