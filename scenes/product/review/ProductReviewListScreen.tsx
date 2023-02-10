import { ConnectionDetection } from 'components/empty/OfflineView';
import ProductFeedbackList from 'components/list/feedbacks/ProductFeedbackList';
import SafeAreaWithHeader from 'components/view/SafeAreaWithHeader';
import React, { useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { Rating } from 'react-native-ratings';
import { getProductUserFeedbacksApi } from 'services/api';
import { ProductUserFeedbacksDTO } from 'services/api/product/product.feedbacks.dtos';
import { Colors, Outlines, Typography } from 'styles';
import { AUTH_RATIO_H } from 'styles/spacing';

const ProductFeedbackListScreen = ({ route }: { route: { params: { pk: number } } }) => {
  const feedbackListRef = useRef(null);
  const { pk } = route.params;
  const [feedbackData, setFeedbackData] = useState<ProductUserFeedbacksDTO | null>(null);
  const [filter, setFilter] = useState<any>(null);

  const _fetchData = async (props?: any) => {
    const data = await getProductUserFeedbacksApi({ pk, ...props });
    setFeedbackData(data);
    return data;
  };

  const onFilterPress = (score: number) => {
    if (filter == score) {
      setFilter(null);
      feedbackListRef?.current?.refresh();
    } else {
      setFilter(score);
      feedbackListRef?.current?.refresh({ score });
    }
  };

  const _renderStarItem = (value: number) => {
    const isSelected = filter === value;
    return (
      <Ripple
        onPress={() => onFilterPress(value)}
        key={value}
        style={[
          styles.starContainer,
          {
            backgroundColor: isSelected ? 'rgba(253, 118, 148, 0.3)' : undefined,
          },
        ]}>
        <View style={styles.rowContainer}>
          <Text
            style={[
              Typography.description,
              {
                marginRight: 4,
                color: isSelected ? Colors.primary : Colors.surface.darkGray,
              },
            ]}>
            {value}
          </Text>
          <Image
            style={[
              styles.icon,
              { tintColor: isSelected ? Colors.primary : Colors.surface.lightGray },
            ]}
            source={require('_assets/images/icon/star.png')}
          />
        </View>
        <Text
          style={[
            Typography.description,
            {
              color: isSelected ? Colors.primary : Colors.surface.darkGray,
            },
          ]}>{`(${feedbackData?.feedback_summary ? feedbackData?.feedback_summary[value] : 0
            })`}</Text>
      </Ripple>
    );
  };

  const _renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.ratingContainer}>
          <Rating
            type="custom"
            ratingImage={require('_assets/images/icon/star.png')}
            ratingColor="transparent"
            ratingBackgroundColor="transparent"
            tintColor="#DBDDDE"
            tintColorSelected="#FDE9A6"
            startingValue={Math.round(feedbackData?.average_score || 0)}
            ratingCount={5}
            imageSize={24}
            imagePadding={12}
            readonly={true}
          />
          <Text
            style={[Typography.name_button, { marginTop: 12, color: Colors.surface.darkGray }]}>{`${feedbackData?.average_score?.toFixed(1) || 0
              } / 5`}</Text>
          <Text style={[Typography.description, {}]}>{`Có ${feedbackData?.totalCount || 0
            } đánh giá`}</Text>
          <View style={styles.rowContainer}>
            {[5, 4, 3, 2, 1].map((value) => _renderStarItem(value))}
          </View>
        </View>
        <Text style={[Typography.description, { marginLeft: 16 }]}>{`Có ${feedbackData?.totalCount || 0
          } đánh giá`}</Text>
      </View>
    );
  };

  return (
    <ConnectionDetection.View>
      <SafeAreaWithHeader
        style={{ position: 'relative' }}

        title={'Đánh giá sản phẩm'}
        titleStyle={{ marginRight: 24 }}>
        <View style={styles.container}>
          {_renderHeader()}
          <ProductFeedbackList
            ref={feedbackListRef}
            fetchData={_fetchData}
            emptyViewStyle={{ height: 500 * AUTH_RATIO_H }}
            fullDescription
          // renderHeader={_renderHeader}
          />
        </View>
      </SafeAreaWithHeader>
    </ConnectionDetection.View>
  );
};

export default ProductFeedbackListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: 12,
    borderBottomWidth: Outlines.borderWidth.base,
    borderColor: Colors.background,
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
    paddingBottom: 12,
    marginVertical: 12,
    alignItems: 'center',
    borderBottomWidth: Outlines.borderWidth.medium,
    borderColor: Colors.background,
  },
  starContainer: {
    marginTop: 24,
    width: 49,
    height: 44,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.surface.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  icon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },
});
