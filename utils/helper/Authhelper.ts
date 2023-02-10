import { ButtonType } from 'components/button/Button';
import { Alert } from 'react-native';
import { AuthRouteSetting } from 'routes';
import { NavigationService } from 'services/navigation';
import { Colors } from 'styles';
import { store } from 'utils/state';
import { showDialog } from 'utils/state/action-creators';

export function renderLoginAlert(onBack?: Function) {
  return store.dispatch(
    showDialog({
      title: 'Bạn cần đăng nhập\nđể sử dụng chức năng này.',
      actions: [
        {
          type: ButtonType.primary,
          text: 'Đăng nhập',
          onPress: () => {
            NavigationService.instance.navigate(new AuthRouteSetting());
          },
        },
        {
          text: 'Quay Lại',
          type: ButtonType.flat,
          onPress: () => onBack && onBack(),
          textStyle: { color: Colors.primary },
        },
      ],
    }),
  );
}
