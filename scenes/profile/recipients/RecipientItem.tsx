import { RadioCircleButton } from 'components/button/RadioCircleButton';
import { GradientTextBox } from 'components/box/GradientTextBox';
import { IRecipient } from 'model/recipient/recipient';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { Colors, Spacing, Typography } from 'styles';

interface Props {
  data: {
    id: number;
    contact_number: string;
    recipient_name: string;
    country: string;
    additional_address: string;
    primary: boolean;
    ward: string;
    district: string;
    province: string;
  };
  isEditing?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  onSelectedItem?: (data: any) => void;
  onEditRecipient?: (data: any) => void;
  onCheckoutSelected?: (data: IRecipient) => void;
  selectedItem?: any;
  style?: ViewStyle;
}

const MAX_WIDTH = Spacing.screen.width - 32;
const PRIMARY_BTN_WIDTH = 85;
const RADIO_BTN_WIDTH = 24 + 12;
const PADDING_WIDTH = 12 * 2;
const EDIT_TEXT_WIDTH = 60;

const RecipientItem = ({
  data,
  isEditing,
  canEdit = true,
  canDelete = true,
  onSelectedItem,
  onEditRecipient,
  onCheckoutSelected,
  selectedItem,
  style,
}: Props) => {
  const { primary, recipient_name, contact_number, additional_address, ward, district, province } =
    data;
  const isSelected = selectedItem && selectedItem.id === data.id;

  const onPressItem = () => {
    onSelectedItem && onSelectedItem(data);
  };

  const onEditItem = () => {
    onEditRecipient && onEditRecipient(data);
  };

  const EXTRA_WIDTH = isEditing ? RADIO_BTN_WIDTH : 0;

  const _onCheckoutSelected = () => {
    !!onCheckoutSelected && onCheckoutSelected(data);
  };

  return (
    <View style={[styles.container, style]}>
      {isEditing ? (
        <RadioCircleButton
          disabled={!canDelete}
          key={data.id}
          radius={24}
          color={isSelected ? Colors.primary : Colors.white}
          onPress={onPressItem}
          selected={isSelected}
          colorCheck={true}
          border={false}
          buttonStyle={styles.radioButton}
          containerStyle={{ flexDirection: 'row', marginRight: 12 }}
        />
      ) : undefined}
      <Ripple
        disabled={!onCheckoutSelected || isEditing}
        onPress={_onCheckoutSelected}
        style={{ flex: 1 }}>
        <View
          style={[
            styles.innerContainer,
            { width: MAX_WIDTH - EXTRA_WIDTH, opacity: isEditing ? (canDelete ? 1 : 0.5) : 1 },
          ]}>
          <Text
            style={[
              styles.titleText,
              primary && {
                width: MAX_WIDTH - PADDING_WIDTH - PRIMARY_BTN_WIDTH - EXTRA_WIDTH,
              },
            ]}
            numberOfLines={2}>
            {recipient_name}
          </Text>
          <Text
            style={[styles.titleText, { width: MAX_WIDTH - PADDING_WIDTH - EXTRA_WIDTH }]}
            numberOfLines={1}>
            {contact_number}
          </Text>
          <Text
            style={[styles.bodyText, { width: MAX_WIDTH - PADDING_WIDTH - EXTRA_WIDTH }]}
            numberOfLines={2}>
            {additional_address}
          </Text>
          <View style={styles.addressContainer}>
            <Text
              style={[
                styles.bodyText,
                {
                  width: MAX_WIDTH - PADDING_WIDTH - (canEdit ? EDIT_TEXT_WIDTH : 0) - EXTRA_WIDTH,
                },
              ]}
              numberOfLines={2}>
              {`${ward}, ${district}, ${province}`}
            </Text>
          </View>
          {primary && <GradientTextBox text={'Mặc định'} containerStyle={styles.primaryBtn} />}
        </View>
      </Ripple>
      {canEdit && (
        <View
          style={{
            position: 'absolute',
            right: 0,
            bottom: 8,
            opacity: isEditing ? (canDelete ? 1 : 0.5) : 1,
          }}>
          <Ripple
            style={{ paddingHorizontal: 12, paddingVertical: 4 }}
            disabled={isEditing}
            onPress={onEditItem}>
            <Text style={styles.editText} numberOfLines={1}>
              {'Sửa'}
            </Text>
          </Ripple>
        </View>
      )}
    </View>
  );
};

export default React.memo(RecipientItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: MAX_WIDTH,
    alignItems: 'flex-start',
    marginBottom: 12,
    // borderWidth: 1, borderColor: 'green'
  },
  innerContainer: {
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.boxLine,
    width: MAX_WIDTH,
  },
  titleText: {
    ...Typography.title,
    width: MAX_WIDTH - PADDING_WIDTH,
  },
  bodyText: {
    ...Typography.body,
    width: MAX_WIDTH - PADDING_WIDTH - EDIT_TEXT_WIDTH,
  },
  primaryBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    borderRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  editText: {
    ...Typography.option,
    color: Colors.text,
  },
  radioButton: {
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
