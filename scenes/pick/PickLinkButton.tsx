import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { Button } from 'components/button/Button';
import { renderLoginAlert } from '_helper';


export interface Props {
  example?: string;
}

/** @deprecated   */
const PickLinkButton: React.FC<Props> = () => {
  const { isLoggedIn } = useTypedSelector((state) => state.auth);

  const navigation = useNavigation();
  return (
    <Button
      source={require('_assets/images/banner/pick_banner.png')}
      aspectRatio={4}
      text={'Cùng tìm hiểu phong cách\ncủa bạn là gì nhé!'}
      containerStyle={{ marginHorizontal: 16 }}
      handleOnPress={() => {
        !isLoggedIn ? renderLoginAlert() : navigation.navigate('PickResult');
      }}
    />
  );
};

export default PickLinkButton;
// atoms 이 앱에 한정되지 않고 공통적으로 사용될 수 있는 컴포넌트
// molecules 앱 내 여러곳에서 사용될 수 있는 앱 한정 재사용 가능한 컴포넌트 ex) 특정 기능이 구현된 버튼들 ( 뒤로 가기 등 )
// organisms atoms & molecules 들의 조합으로 앱의 특정 상황에서 사용됨
//
