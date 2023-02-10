import { useNavigation } from '@react-navigation/native';
import { CheckoutErrorCode, HandledError } from 'error';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  createRecipientApi,
  getDistrictsData,
  getWardsData,
  updateRecipientApi,
} from 'services/api';
import { Completer } from 'services/remote.config';
import { Colors, Spacing, Typography } from 'styles';
import theme from 'styles/legacy/theme.style';
import { sortData } from 'utils/helper';
import { useActions } from 'utils/hooks/useActions';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { phoneNumberReformat } from 'utils/helper/FormatHelper';
import {
  Button,
  ButtonState,
  ButtonType,
  LayoutConstraint,
} from 'components/button/Button';
import { HEADER_HEIGHT } from "_helper";
import { toast } from 'components/alert/toast';
import SafeAreaWithHeader from 'components/view/SafeAreaWithHeader';
import DEPRECATED_InputField from 'components/inputs/InputField.v2';
import { RadioCircleButton } from 'components/button/RadioCircleButton';

const CreateEditRecipientScreen = ({ route }: { navigation: any; route: any }) => {
  const { token } = useTypedSelector((state) => state.auth);
  const { provinces, recipients } = useTypedSelector((state) => state.user);
  const navigation = useNavigation();
  const { setLoading, showDialog, addRecipient, updateRecipient } = useActions();
  // for edit recipient
  const { data: routeData, isEditing } = route?.params ?? {};
  const completer: Completer<void> | undefined = route?.params?.completer;

  const {
    primary,
    recipient_name,
    contact_number,
    additional_address,
    ward_id,
    district_id,
    province_id,
  } = routeData || {};

  // address data
  const [districtsData, setDistrictsData] = useState<any>([]);
  const [wardsData, setWardsData] = useState<any>([]);

  const [validName, setValidName] = useState(!!recipient_name);
  const [name, setName] = useState(recipient_name || '');
  const [errorName, setErrorName] = useState('');

  const [validDetailAddress, setValidDetailAddress] = useState(!!additional_address?.trim());
  const [detailAddress, setDetailAddress] = useState(additional_address || '');
  const [errorDetailAddress, setErrorDetailAddress] = useState('');

  const [validPhone, setValidPhone] = useState(!!contact_number);
  const [phone, setPhone] = useState(contact_number || '');
  const [disPlayPhone, setDisPlayPhone] = useState(contact_number?.substring(3) || '');
  const [errorPhone, setErrorPhone] = useState('');

  const [city, setCity] = useState<any>(null);
  const [district, setDistrict] = useState<any>(null);
  const [ward, setWard] = useState<any>(null);

  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [category, setCategory] = useState('');

  const [isPrimary, setIsPrimary] = useState(primary !== undefined ? primary : true);

  // fetch Data
  useEffect(() => {
    onLoadData();
    console.log('---completer', completer);
    const subscription = navigation.addListener('beforeRemove', () => {
      completer?.reject(
        new HandledError({
          error: new Error('User canceld create address'),
          stack: 'CreateEditRecipientScreen.beforeRemove',
          code: CheckoutErrorCode.CANCEL_CREATE_RECIPIENT,
        }),
      );
    });

    return subscription;
  }, []);

  // load edit data
  const onLoadData = async () => {
    if (provinces.length > 0 && province_id) {
      const indexOf = provinces.findIndex((res: any) => res.id == province_id);
      if (indexOf != -1) {
        setCity({
          value: provinces[indexOf],
          index: indexOf,
        });
        onGetDistrictsData(provinces[indexOf].id);
      }
    }
  };

  // get districts list
  const onGetDistrictsData = async (provinceId: number) => {
    setLoading(true);
    const result = await getDistrictsData({ token, provinceId });
    setLoading(false);
    if (result.data?.length > 0 && district_id) {
      const indexOf = result.data.findIndex((res: any) => res.id == district_id);
      if (indexOf != -1) {
        setDistrict({
          value: result.data[indexOf],
          index: indexOf,
        });
        onGetWardsData(result.data[indexOf].id);
      }
    }
    setDistrictsData(sortData(result.data));
  };

  // get wards list
  const onGetWardsData = async (districtId: number) => {
    const result = await getWardsData({ token, districtId });
    if (result.data?.length > 0 && ward_id) {
      const indexOf = result.data.findIndex((res: any) => res.id == ward_id);
      if (indexOf != -1) {
        setWard({
          value: result.data[indexOf],
          index: indexOf,
        });
      }
    }
    setWardsData(sortData(result.data));
  };

  const handleNameChange = (name: string) => {
    setName(name);
    const trimName = name.trim();
    if (trimName.length >= 4) {
      setValidName(true);
      setErrorName('');
    } else if (name && trimName.length < 4) {
      setValidName(false);
      setErrorName('Tên phải dài hơn 3 kí tự');
    } else {
      setErrorName('');
    }
  };

  const handlePhoneChange = (phone: string) => {
    const { errorMsg, displayedValue, value } = phoneNumberReformat(phone);
    setPhone(value);
    setDisPlayPhone(displayedValue);
    setValidPhone(!errorMsg)
    setErrorPhone(errorMsg || '');
  };

  const handleDetailAddressChange = (address: string) => {
    setDetailAddress(address);
    const trimAddress = address.trim();
    if (trimAddress) {
      setValidDetailAddress(true);
      setErrorDetailAddress('');
    } else if (trimAddress && trimAddress.length < 100) {
      setValidDetailAddress(false);
      setErrorDetailAddress('Địa chỉ không hợp lệ');
    } else {
      setErrorDetailAddress('');
    }
  };

  const toggleShowCategoryDrawer = (newCategory: string) => {
    if ((newCategory == 'ward' || newCategory == 'district') && !city?.value?.name) {
      toast('Vui lòng chọn Thành Phố');
      return;
    } else if (newCategory == 'ward' && !district?.value?.name) {
      toast('Vui lòng chọn Quận/Huyện');
      return;
    }
    setCategory(newCategory);
    if (newCategory == '') {
      setIsOpenDrawer(false);
    } else {
      setIsOpenDrawer(true);
    }
  };

  const onCityCategoryPress = (item: any, index: number) => {
    toggleShowCategoryDrawer('');
    setCity({
      value: item,
      index: index,
    });
    setDistrictsData([]);
    setWardsData([]);
    setDistrict(null);
    setWard(null);
    onGetDistrictsData(item?.id);
  };

  const _renderCityCategory = ({ item, index }: { item: any; index: number }) => {
    const isSelected = item.name == city?.value?.name;
    return (
      <View key={index}>
        <Button
          state={isSelected ? ButtonState.focused : ButtonState.idle}
          text={item.name}
          type={ButtonType.option}
          constraint={LayoutConstraint.matchParent}
          onPress={() => onCityCategoryPress(item, index)}
          textStyle={{ textTransform: 'capitalize', width: '100%', textAlign: 'center' }}
          style={styles.categoryItem}
        />
      </View>
    );
  };

  const onDistrictsCategoryPress = (item: any, index: number) => {
    toggleShowCategoryDrawer('');
    setDistrict({
      value: item,
      index: index,
    });
    setWardsData([]);
    setWard(null);
    onGetWardsData(item?.id);
  };

  const _renderDistrictsCategory = ({ item, index }: { item: any; index: number }) => {
    const isSelected = item.name == district?.value?.name;
    return (
      <View key={index}>
        <Button
          state={isSelected ? ButtonState.focused : ButtonState.idle}
          text={item.name}
          type={ButtonType.option}
          constraint={LayoutConstraint.matchParent}
          onPress={() => onDistrictsCategoryPress(item, index)}
          textStyle={{ textTransform: 'capitalize', width: '100%', textAlign: 'center' }}
          style={styles.categoryItem}
        />
      </View>
    );
  };

  const onWardsCategoryPress = (item: any, index: number) => {
    toggleShowCategoryDrawer('');
    setWard({
      value: item,
      index: index,
    });
  };

  const _renderWardsCategory = ({ item, index }: { item: any; index: number }) => {
    const isSelected = item.name == ward?.value?.name;
    return (
      <View key={index}>
        <Button
          state={isSelected ? ButtonState.focused : ButtonState.idle}
          text={item.name}
          type={ButtonType.option}
          constraint={LayoutConstraint.matchParent}
          onPress={() => onWardsCategoryPress(item, index)}
          textStyle={{ textTransform: 'capitalize', width: '100%', textAlign: 'center' }}
          style={styles.categoryItem}
        />
      </View>
    );
  };

  const isValid = () => {
    return (
      validName && validPhone && validDetailAddress && city?.value && district?.value && ward?.value
    );
  };

  const onSubmit = async () => {
    try {
      const params = {
        contact_number: phone,
        recipient_name: name,
        additional_address: detailAddress,
        primary: isPrimary,
        ward: ward.value.id,
      };
      if (isEditing) {
        const result = await updateRecipientApi(routeData?.id, params);
        updateRecipient(result);
        toast('Cập nhật địa chỉ thành công');
      } else {
        const result = await createRecipientApi(params);
        addRecipient(result);
        toast('Thêm địa chỉ thành công');
      }
      completer?.complete();
      navigation.goBack();
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

  const onBack = () => {
    _renderExitAlert();
  };

  const _renderExitAlert = () => {
    showDialog({
      title: 'Thông tin địa chỉ chưa được lưu\nbạn có chắc muốn rời khỏi không?',
      actions: [
        {
          type: ButtonType.primary,
          text: 'Tiếp tục ở lại',
          onPress: () => { },
        },
        {
          text: 'Rời khỏi',
          type: ButtonType.flat,
          onPress: () => navigation.goBack(),
          textStyle: { color: Colors.primary },
        },
      ],
    });
  };

  return (
    <SafeAreaWithHeader
      onBack={onBack}
      style={{ backgroundColor: 'white' }}
      title={isEditing ? 'Chỉnh sửa địa chỉ' : 'Tạo địa chỉ mới'}
      titleStyle={{ marginRight: 24 }}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={100}>
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.contentContainer}>
              <Text style={styles.titleText}>{'Thông tin người nhận'}</Text>
              {/* ==== Phone ==== */}
              <DEPRECATED_InputField
                labelText="Số điện thoại"
                labelTextSize={theme.FONT_SIZE_12}
                labelColor={theme.BLACK}
                textColor={Colors.text}
                borderBottomColor={theme.PRIMARY_COLOR}
                inputType="text"
                keyboardType="phone-pad"
                customStyle={styles.inputField}
                autoCapitalize={'none'}
                showCheckmark={validPhone}
                onChangeText={handlePhoneChange}
                // maxLength={10}
                value={disPlayPhone}
                comment=" Nhập số điện thoại"
                errorMsg={errorPhone}
                labelStyle={styles.inputLabelText}
                textInputStyle={styles.inputText}
                errorStyle={{ flex: 0.5 }}
              />
              {/* ==== Name ==== */}
              <DEPRECATED_InputField
                labelText="Họ và tên"
                labelTextSize={theme.FONT_SIZE_12}
                labelColor={theme.BLACK}
                textColor={Colors.text}
                borderBottomColor={theme.PRIMARY_COLOR}
                inputType="text"
                customStyle={styles.inputField}
                onChangeText={handleNameChange}
                autoCapitalize={'none'}
                comment="Nhập họ và tên người nhận"
                errorMsg={errorName}
                value={name}
                maxLength={20}
                labelStyle={styles.inputLabelText}
                textInputStyle={styles.inputText}
              />
              <Text style={styles.titleText}>{'Thông tin địa chỉ'}</Text>
              {/* ==== City ==== */}
              <View>
                <Button
                  type={ButtonType.flat}
                  alignItems={'flex-start'}
                  constraint={LayoutConstraint.matchParent}
                  postfixIcon={
                    isOpenDrawer && category == 'city' ? 'small_arrow_up' : 'small_arrow_down'
                  }
                  text={city?.value?.name || 'Tỉnh/Thành phố'}
                  onPress={() =>
                    toggleShowCategoryDrawer(isOpenDrawer && category == 'city' ? '' : 'city')
                  }
                  textStyle={{
                    ...styles.buttonText,
                    color: city?.value?.name ? Colors.black : Colors.text,
                  }}
                  innerHorizontalPadding={0}
                  style={{ maxHeight: 48 }}
                />
                {isOpenDrawer && category == 'city' && (
                  <View>
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={provinces}
                      renderItem={({ item, index }) => _renderCityCategory({ item, index })}
                      keyExtractor={(item: any, index) => `${item.name}${index}`}
                    />
                  </View>
                )}
              </View>
              {/* ==== District ==== */}
              <View>
                <Button
                  type={ButtonType.flat}
                  alignItems={'flex-start'}
                  constraint={LayoutConstraint.matchParent}
                  postfixIcon={
                    isOpenDrawer && category == 'district' ? 'small_arrow_up' : 'small_arrow_down'
                  }
                  text={district?.value?.name || 'Quận/Huyện'}
                  onPress={() =>
                    toggleShowCategoryDrawer(
                      isOpenDrawer && category == 'district' ? '' : 'district',
                    )
                  }
                  textStyle={{
                    ...styles.buttonText,
                    color: district?.value?.name ? Colors.black : Colors.text,
                  }}
                  innerHorizontalPadding={0}
                  style={{ maxHeight: 48 }}
                />
                {isOpenDrawer && category == 'district' && (
                  <View style={{ flex: 1, minWidth: 1, minHeight: 1 }}>
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={districtsData}
                      renderItem={({ item, index }) => _renderDistrictsCategory({ item, index })}
                      keyExtractor={(item: any, index) => `${item.name}${index}`}
                    />
                  </View>
                )}
              </View>
              {/* ==== Ward ==== */}
              <View>
                <Button
                  type={ButtonType.flat}
                  alignItems={'flex-start'}
                  constraint={LayoutConstraint.matchParent}
                  postfixIcon={
                    isOpenDrawer && category == 'ward' ? 'small_arrow_up' : 'small_arrow_down'
                  }
                  text={ward?.value?.name || 'Phường/Xã'}
                  onPress={() =>
                    toggleShowCategoryDrawer(isOpenDrawer && category == 'ward' ? '' : 'ward')
                  }
                  textStyle={{
                    ...styles.buttonText,
                    color: ward?.value?.name ? Colors.black : Colors.text,
                  }}
                  innerHorizontalPadding={0}
                  style={{ maxHeight: 48 }}
                />
                {isOpenDrawer && category == 'ward' && (
                  <View style={{ flex: 1, minWidth: 1, minHeight: 1 }}>
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={wardsData}
                      renderItem={({ item, index }) => _renderWardsCategory({ item, index })}
                      keyExtractor={(item: any, index) => `${item.name}${index}`}
                    />
                  </View>
                )}
              </View>
              {/* ==== Detail address ==== */}
              <Text style={[styles.titleText, { marginTop: 24 }]}>{'Địa chỉ cụ thể'}</Text>
              <DEPRECATED_InputField
                multiline={true}
                labelText="Nhập địa chỉ cụ thể"
                labelTextSize={theme.FONT_SIZE_12}
                labelColor={theme.BLACK}
                textColor={Colors.text}
                borderBottomColor={theme.PRIMARY_COLOR}
                inputType="text"
                returnKeyType={'done'}
                blurOnSubmit={true}
                customStyle={styles.inputField}
                onChangeText={handleDetailAddressChange}
                autoCapitalize={'none'}
                comment="Tên đường, số nhà, tòa nhà"
                errorMsg={errorDetailAddress}
                value={detailAddress}
                maxLength={75}
                labelStyle={styles.inputLabelText}
                textInputStyle={styles.inputText}
              />
              <View style={{ flexDirection: 'row', marginBottom: 24 }}>
                <RadioCircleButton
                  disabled={primary || recipients.length == 0}
                  key={'default'}
                  radius={24}
                  color={isPrimary ? Colors.primary : Colors.white}
                  onPress={() => setIsPrimary(!isPrimary)}
                  selected={isPrimary}
                  // colorCheck={true}
                  label={'Mặc định'}
                  border={false}
                  buttonStyle={styles.radioButton}
                  labelStyle={{ ...Typography.name_button, marginTop: -4 }}
                  containerStyle={{ flexDirection: 'row', marginRight: 12 }}
                />
                <RadioCircleButton
                  disabled={primary || recipients.length == 0}
                  key={'none'}
                  radius={24}
                  color={!isPrimary ? Colors.primary : Colors.white}
                  onPress={() => setIsPrimary(!isPrimary)}
                  selected={!isPrimary}
                  colorCheck={true}
                  label={'Không'}
                  buttonStyle={styles.radioButton}
                  labelStyle={{ ...Typography.name_button, marginTop: -4 }}
                  containerStyle={{ flexDirection: 'row' }}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.nextButton}>
            <Button
              type={ButtonType.primary}
              state={!isValid() ? ButtonState.disabled : ButtonState.idle}
              onPress={onSubmit}
              disabled={!isValid()}
              text={isEditing ? 'Cập nhật' : 'Tạo mới'}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaWithHeader>
  );
};

export default React.memo(CreateEditRecipientScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: HEADER_HEIGHT
  },
  contentContainer: {
    minHeight:
      Spacing.screen.height - (200 - (Platform.OS == 'ios' ? 0 : 30)) * Spacing.AUTH_RATIO_H,
  },
  inputField: {
    marginBottom: theme.MARGIN_20,
  },
  inputLabelText: {
    paddingTop: 12,
    flex: 0.5
  },
  inputText: {
    ...Typography.body,
    fontSize: 16,
    lineHeight: 22,
    maxHeight: 124,
    paddingBottom: 0,
  },
  titleText: {
    ...Typography.name_button,
    color: theme.BLACK,
    textAlign: 'left',
    marginVertical: 12,
  },
  buttonText: {
    ...Typography.title,
    textTransform: 'none',
  },
  nextButton: {
    paddingBottom: (40 - (14 - 8) / 2) * Spacing.AUTH_RATIO_H,
    backgroundColor: 'white',
    paddingTop: 12,
  },
  categoryItem: {
    marginBottom: 12,
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  radioButton: {
    marginRight: 4,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
