import { useNavigation } from '@react-navigation/native';
import { Button, ButtonType, LayoutConstraint } from 'components/button/Button';
import ProductFeedbackList, {
  ProductFeedbackListPlaceholder
} from 'components/list/feedbacks/ProductFeedbackList';
import { isEmpty } from 'lodash';
import React, { useEffect } from 'react';
import { LogBox, StyleSheet, Text, View } from 'react-native';
import { Rating } from 'react-native-ratings';
import { PlaceholderLine } from 'rn-placeholder';
import { RoutePath } from 'routes';
import { getProductUserFeedbacksApi } from 'services/api';
import { Colors, Outlines, Spacing, Typography } from 'styles';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';


const ProductUserFeedbackBox = ({ pk }: { pk: number }) => {
  const navigation = useNavigation();

  const { data: userFeedback, state, excecute } = useAsync(
    () => getProductUserFeedbacksApi({ pk, limit: 3 }),
    {
      emptyDataLogical: ({ data }) => isEmpty(data),
    },
  );
  const feedbackList = userFeedback?.data;

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    excecute();
  }, []);

  const gotoUserFeedbackList = () => {
    navigation.push(RoutePath.productFeedbackListScreen, {
      pk,
      feedbackData: userFeedback,
    });
  };

  const _fetchData = (props?: any) => {
    return getProductUserFeedbacksApi({ ...props });
  };

  if (state === ConnectionState.waiting) {
    return <_Placeholder />;
  }
  if (state === ConnectionState.hasError /*|| state === ConnectionState.hasEmptyData*/) {
    return <></>;
  }
  return (
    <View style={styles.container}>
      <View style={styles.rowSpaceContainer}>
        <Text style={{ ...Typography.name_button }}>{'Đánh giá sản phẩm'}</Text>
        {feedbackList?.length ? (
          <Button
            constraint={LayoutConstraint.wrapChild}
            text={'Xem tất cả'}
            onPress={gotoUserFeedbackList}
            textStyle={{ ...Typography.description }}
            type={ButtonType.flat}
            innerHorizontalPadding={0}
          />
        ) : undefined}
      </View>
      {feedbackList?.length ? (
        <View style={styles.ratingContainer}>
          <Rating
            type="custom"
            ratingImage={require('_assets/images/icon/star.png')}
            ratingColor="transparent"
            ratingBackgroundColor="transparent"
            tintColor="#DBDDDE"
            tintColorSelected="#FDE9A6"
            startingValue={Math.round(userFeedback?.average_score || 0)}
            ratingCount={5}
            imageSize={24}
            imagePadding={12}
            readonly={true}
          />
          <Text
            style={[Typography.name_button, { marginTop: 12, color: Colors.surface.darkGray }]}>{`${userFeedback?.average_score?.toFixed(1) || 0
              } / 5`}</Text>
          <Text style={[Typography.description, {}]}>{`Có ${userFeedback?.totalCount || 0
            } đánh giá`}</Text>
        </View>
      ) : undefined}
      {feedbackList ? (
        <ProductFeedbackList fetchData={_fetchData} initData={feedbackList} />
      ) : undefined}
    </View>
  );
};

export default ProductUserFeedbackBox;

export const _Placeholder = () => {
  return (
    <View style={styles.container}>
      <View style={styles.rowSpaceContainer}>
        <PlaceholderLine style={{ width: 80, height: 16 }} />
      </View>
      <View style={styles.ratingContainer}>
        {/* <View style={{height:24}}/> */}
        <Rating
          type="custom"
          ratingImage={require('_assets/images/icon/star.png')}
          ratingColor="transparent"
          ratingBackgroundColor="transparent"
          tintColor="#DBDDDE"
          tintColorSelected="#FDE9A6"
          startingValue={0}
          ratingCount={5}
          imageSize={24}
          imagePadding={12}
          readonly={true}
        />
        <View style={{ height: 12 }} />
        <PlaceholderLine noMargin style={{ width: 60, height: 16 }} />
        <View style={{ height: 4 }} />
        <PlaceholderLine noMargin style={{ width: 100, height: 16 }} />
      </View>
      <ProductFeedbackListPlaceholder />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Spacing.screen.width,
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 24,
    borderColor: Colors.background,
    borderTopWidth: Outlines.borderWidth.medium,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSpaceContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  ratingContainer: {
    width: '100%',
    paddingVertical: 24,
    alignItems: 'center',
    borderBottomWidth: Outlines.borderWidth.base,
    borderColor: Colors.background,
  },
});
