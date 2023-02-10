import { toast } from 'components/alert/toast';
import { Button, ButtonState, ButtonType, LayoutConstraint } from 'components/button/Button';
import React, { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { deprecated_updateUserInfo } from 'services/api';
import { Colors, Typography } from 'styles';
import { ageList } from 'utils/data';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import {Header} from "components/header/Header";


interface Props {
  data: any[];
  selectedAgeIndex: number;
  onSelectedAge: (index: number) => void;
}

const StepOne = ({ data, selectedAgeIndex, onSelectedAge }: Props) => {
  const handleOnPress = (index: number) => {
    onSelectedAge && onSelectedAge(index);
  };

  const _renderItem = ({ item, index }: { item: { description: string }; index: number }) => {
    const onPress = () => handleOnPress(index);

    return (
      <Button
        type={ButtonType.option}
        state={selectedAgeIndex === index ? ButtonState.focused : ButtonState.idle}
        text={item.description}
        onPress={onPress}
        style={{ marginBottom: 24, }}
        constraint={LayoutConstraint.matchParent}
      />
    );
  };

  const keyExtractor = (item: any, index: number) => `${item.description}${index}`;

  return (
    <FlatList data={data} renderItem={_renderItem} keyExtractor={keyExtractor} />
  );
};

interface Props {
  navigation: any;
  route: any
}

const AgeSelectionScreen = ({ navigation, route }: Props) => {
  const { token } = useTypedSelector((state) => state.auth);
  const { ageIndex } = route?.params;
  const [selectedAge, setSelectedAge] = useState(ageIndex !== undefined ? ageIndex : -1);

  const onSelectedAge = (age: number) => {
    setSelectedAge(age);
  };

  const handleNextButton = async () => {
    const newAge = ageList[selectedAge].key;
    await deprecated_updateUserInfo({ token, age: newAge });
    toast("Cập nhật thông tin cá nhân thành công!")
    navigation.goBack();
  };

  const isValid = () => {
    return selectedAge !== -1;
  };

  const renderContent = () => {
    const contents = () => {
      return (
        <StepOne
          data={ageList}
          selectedAgeIndex={selectedAge}
          onSelectedAge={onSelectedAge}
        />
      );
    };

    const { titleText, contentText } = styles;
    return (
      <View style={{
        paddingHorizontal: 16, justifyContent: 'flex-start', paddingTop: 12
      }}>
        <Text style={titleText}>{'Bạn bao nhiêu tuổi?'}</Text>
        <Text style={contentText}>{'Dabi sẽ gợi ý phong cách \n phù hợp với bạn nhất'}</Text>
        {contents()}
      </View>
    );
  };

  return (
    <SafeAreaView style={{
      flex: 1,
      ...ifIphoneX({
        marginBottom: 34
      }, {
        marginBottom: 20
      })
    }}>
      <Header/>
      {renderContent()}
      <View style={styles.nextButton}>
        <Button
          type={ButtonType.primary}
          state={!isValid() ? ButtonState.disabled : ButtonState.idle}
          onPress={handleNextButton}
          disabled={!isValid()}
          text={'Áp dụng'}
          constraint={LayoutConstraint.matchParent}
        />
      </View>
    </SafeAreaView>
  );
};

export default React.memo(AgeSelectionScreen);

const styles = StyleSheet.create({
  titleText: {
    ...Typography.h1,
    textAlign: 'center',
    marginBottom: 12,
  },
  contentText: {
    ...Typography.body,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 12,
  },
  nextButton: {
    position: 'absolute',
    zIndex: 2,
    left: 0, right: 0, bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: 'white',
  },
});
