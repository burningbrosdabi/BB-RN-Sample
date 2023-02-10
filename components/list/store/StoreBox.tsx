import CertifiedMarkIcon from 'assets/icons/store/CertifiedMarkIcon';
import PartnershipMarkIcon from 'assets/icons/store/PartnershipMarkIcon';
import StoreFavoriteTextButton from 'components/button/store/StoreFavoriteTextButton';
import { ImageElementFlex } from 'components/images/ImageElement';
import ProfileImage from 'components/images/ProfileImage';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Outlines, Typography } from 'styles';
import { getStoreTypeData, StoreListItem } from 'model';
import { StoreRouteSetting } from 'routes/store/store.route';
import { useNavigator } from 'services/navigation/navigation.service';
import KMarkIcon from 'assets/icons/store/KMarkIcon';

const StoreBox = ({ data }: { data: StoreListItem }) => {
  const { recent_post_1, recent_post_2, profile_image, pk } = data;
  const navigator = useNavigator();

  const onPress = () => {
    navigator.navigate(new StoreRouteSetting({ pk }));
  };

  const typeData = useMemo(() => {
    return getStoreTypeData(data.store_type);
  }, []);

  return (
    <TouchableOpacity onPress={onPress} style={styles.storeBoxContainer}>
      <View style={styles.imageContainer}>
        <ImageElementFlex image={recent_post_1} rounded />
      </View>
      <View style={styles.imageContainer}>
        <ImageElementFlex image={recent_post_2} rounded />
      </View>

      <View style={styles.storeInfoContainer}>
        <ProfileImage source={profile_image} />
        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 10 }}>
          <Text
            style={[
              styles.storeText,
              {
                marginRight: !!typeData ? 1 : 0,
              },
            ]}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {data.insta_id}
          </Text>
          {typeData?.mark}
        </View>
        <View>
          <StoreFavoriteTextButton data={data} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StoreBox;

const styles = StyleSheet.create({
  storeBoxContainer: {
    flexDirection: 'row',
    flex: 1,
    borderBottomWidth: Outlines.borderWidth.base,
    borderColor: Colors.surface.lightGray,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  imageContainer: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 12,
  },
  storeInfoContainer: {
    alignItems: 'center',
    flex: 1,
  },
  storeText: { ...Typography.description, textAlignVertical: 'center' },
});
