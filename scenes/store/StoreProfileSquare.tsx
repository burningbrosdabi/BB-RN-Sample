import CertifiedMarkIcon from 'assets/icons/store/CertifiedMarkIcon';
import PartnershipMarkIcon from 'assets/icons/store/PartnershipMarkIcon';
import { Button, ButtonType, LayoutConstraint } from 'components/button/Button';
import StoreFavoriteTextButton from 'components/button/store/StoreFavoriteTextButton';
import ProfileImage from 'components/images/ProfileImage';
import { getStoreTypeData, StoreAddress, StoreInfo } from 'model';
import React, { useMemo, useState } from 'react';
import { Image, Linking, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import { Fade } from 'rn-placeholder/lib/animations/Fade';
import { Placeholder } from 'rn-placeholder/lib/Placeholder';
import { ageTranslation } from 'styles/legacy/translations';
import { Colors, Spacing, Typography } from '_styles';
import ImageWithLinking from './ImageWithLinking';
import { FollowCount } from 'components/text/StoreFollowText';
import { fontPlaceHolder } from 'styles/typography';
import KMarkIcon from 'assets/icons/store/KMarkIcon';

// export const HEADER_HEIGHT = Spacing.screen.width / 2 + 100 + 4; // IMAGE + AVATAR + TAG

interface Props {
  data: StoreInfo;
  address: StoreAddress[] | null;
}

/** @deprecated   **/
const StoreProfileSquare = ({ data, address }: Props) => {
  const { insta_id, profile_image, primary_style, store_type, favorite_users_count, pk } = data;
  const [isOpen, setIsOpen] = useState(false);

  let { province_ids } = data;
  if (province_ids.length == 0) {
    province_ids = ['Tất cả'];
  }

  let { age } = data;
  if (age.length == 3 || age.length == 0) {
    age = ['all'];
  }

  const renderAddress = () => {
    return (
      <View style={styles.addressContainer}>
        <Button
          style={{ minHeight: 40 }}
          type={ButtonType.flat}
          alignItems={'flex-start'}
          constraint={LayoutConstraint.matchParent}
          postfixIcon={isOpen ? 'small_arrow_up' : 'small_arrow_down'}
          text={'Địa chỉ cửa hàng'}
          onPress={() => setIsOpen(!isOpen)}
          textStyle={{
            ...Typography.name_button,
            marginLeft: -6,
            paddingLeft: 0,
            textTransform: 'none',
          }}
          innerHorizontalPadding={24}
        />
        {isOpen &&
          address?.map((item, index) => {
            const { address, ward, district, province, google_map_url } = item;
            return (
              <TouchableWithoutFeedback
                onPress={() => google_map_url && Linking.openURL(google_map_url)}
                key={index}>
                <View style={styles.addressItemContainer}>
                  <Image
                    source={require('_assets/images/icon/small_map.png')}
                    style={{ tintColor: '#A6A7A8', marginTop: 4, width: 7, height: 7 }}
                  />
                  <Text style={styles.addressText} numberOfLines={2}>
                    {`${address}, ${ward}, ${district}, ${province}`}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            );
          })}
      </View>
    );
  };

  const typeData = useMemo(() => {
    return getStoreTypeData(store_type);
  }, [store_type])

  return (
    <View
      style={{
        borderBottomWidth: 4,
        borderBottomColor: Colors.background,
      }}>
      <ImageWithLinking data={data}>
        <View style={{ position: 'absolute', bottom: -48 / 2, left: 16 }}>
          <ProfileImage source={profile_image} />
        </View>
      </ImageWithLinking>
      <View style={styles.innerContainer}>
        <View style={styles.lineContainer}>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {
                  !!typeData &&
                  <>
                    {typeData.mark}
                    <Text
                      style={[
                        Typography.description,
                        {
                          color: Colors.primary,
                          textTransform: 'capitalize',
                        },
                      ]}>
                      {` ${typeData.name}`}
                    </Text>
                  </>
                }
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  maxWidth: Spacing.screen.width - 32 - 40 - 12 * 2 - 89,
                  alignItems: 'center',
                }}>
                <Text style={[Typography.name_button, { lineHeight: undefined }]}>{insta_id}</Text>
              </View>
              <FollowCount pk={pk} initialCount={favorite_users_count} />
            </View>
          </View>
          <View>
            <StoreFavoriteTextButton data={data} />
          </View>
        </View>
        <View style={styles.tagListContainerStyle}>
          {age.map((ageItem, index) => {
            return (
              <View style={styles.tagConatiner}>
                <Text
                  style={styles.tagTextStyle}
                  numberOfLines={1}>{`${ageTranslation[ageItem]}`}</Text>
              </View>
            );
          })}
          {province_ids.map((province, index) => {
            return (
              <View style={styles.tagConatiner}>
                <Text style={styles.tagTextStyle} numberOfLines={1}>{`#${province}`}</Text>
              </View>
            );
          })}
          <View style={styles.tagConatiner}>
            <Text style={styles.tagTextStyle} numberOfLines={1}>
              {primary_style ? `#${primary_style}` : '#Tất cả'}
            </Text>
          </View>
        </View>
        {address && address.length > 0 && renderAddress()}
      </View>
    </View>
  );
};

export const StoreProfilePlaceholder = () => {
  return (
    <Placeholder
      style={{
        borderBottomWidth: 4,
        borderBottomColor: Colors.background,
      }}
      Animation={Fade}>
      <PlaceholderMedia
        style={{
          width: Spacing.screen.width,
          height: Spacing.screen.width / 2,
          backgroundColor: Colors.surface.white,
        }}
      />
      <PlaceholderMedia
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          top: -24,
          left: 16,
          backgroundColor: Colors.surface.white,
        }}
      />
      <View style={[styles.innerContainer, { marginTop: 0 }]}>
        <View style={styles.lineContainer}>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <PlaceholderLine
                style={{
                  backgroundColor: Colors.surface.white,
                  width: 80,
                  ...fontPlaceHolder.subTitle,
                }}
              />
              <PlaceholderLine
                style={{
                  backgroundColor: Colors.surface.white,
                  width: 100,
                  ...fontPlaceHolder.body,
                }}
              />
            </View>
          </View>
          <View>
            <PlaceholderMedia
              // style={{ backgroundColor: Colors.surface.white, height: 28, width: 64 }}
              style={{ backgroundColor: 'pink', height: 28, width: 90, borderRadius: 8 }}
            />
          </View>
        </View>
        <View style={styles.tagListContainerStyle}>
          {[80, 70, 80, 60, 90].map((width, index) => {
            return (
              <PlaceholderMedia
                key={`${index}`}
                style={{
                  borderRadius: 4,
                  height: 20,
                  backgroundColor: Colors.surface.white,
                  width,
                  marginRight: 4,
                  marginBottom: 4,
                }}
              />
            );
          })}
        </View>
        <View
          style={[
            styles.addressContainer,
            { height: 40, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
          ]}>
          <PlaceholderMedia
            style={{
              height: 18,
              backgroundColor: Colors.surface.white,
              width: 120,
            }}
          />
        </View>
      </View>
    </Placeholder>
  );
};

export default React.memo(StoreProfileSquare);

const styles = StyleSheet.create({
  innerContainer: {
    justifyContent: 'center',
    marginTop: 48 / 2 + 12,
  },
  lineContainer: {
    flexDirection: 'row',
    minHeight: 40 + 12,
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingHorizontal: 16,
  },
  tagListContainerStyle: {
    paddingTop: 12,
    flexDirection: 'row',
    marginBottom: 10,
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  tagConatiner: {
    marginRight: 4,
    marginBottom: 4,
    backgroundColor: Colors.background,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  tagTextStyle: {
    ...Typography.description,
  },
  addressContainer: {
    paddingHorizontal: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.background,
  },
  addressItemContainer: {
    flexDirection: 'row',
    marginLeft: 18,
    marginRight: 18 + 7 + 12 * 2,
    marginBottom: 10,
  },
  addressText: {
    ...Typography.description,
    color: Colors.blue,
    marginLeft: 4,
    width: Spacing.screen.width - 16 * 3 - 7 - 12 * 2,
  },
});
