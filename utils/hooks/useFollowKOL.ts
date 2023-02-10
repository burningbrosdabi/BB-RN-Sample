import { ButtonType } from 'components/button/Button';
import { AuthRouteSetting } from 'routes/auth/auth';
import { useNavigator } from 'services/navigation/navigation.service';
import { Colors } from 'styles';
import { useActions } from 'utils/hooks/useActions';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { useFavoriteButton } from "utils/hooks/useFavoriteButton";
import { userFollowController } from "services/user";
import { Influencer } from "model/influencer/influencer";

export const useFollowKOL = ({
    pk,
    name
}: {
    name: string,
    pk: number;
}): { marked: boolean; excecute: () => void } => {
    const isLoggedIn = useTypedSelector((state) => state.auth.isLoggedIn);

    const { showDialog } = useActions();

    const navigator = useNavigator();

    const { onPress, marked } = useFavoriteButton<Influencer>({
        pk,
        controller: userFollowController,
        // toastMessage: {
        //     marked: `Đã theo dõi ${name}`,
        //     unmarked: `Bỏ theo dõi ${name}`
        // },
        prepare: (value) => ({
            pk, is_following: value
        } as Influencer)
    })

    const _onPress = () => {
        if (!isLoggedIn) {
            showDialog({
                title: 'Bạn cần đăng nhập\nđể sử dụng chức năng này.',
                actions: [
                    {
                        type: ButtonType.primary,
                        text: 'Đăng nhập',
                        onPress: () => {
                            navigator.navigate(new AuthRouteSetting());
                        },
                    },
                    {
                        text: 'Quay lại',
                        type: ButtonType.flat,
                        onPress: () => {
                        },
                        textStyle: { color: Colors.primary },
                    },
                ],
            });

            return;
        }
        if (marked) {
            showDialog({
                title: `Bạn chắc chắn muốn Bỏ theo dõi ${name}?`,
                actions: [
                    {
                        type: ButtonType.primary,
                        text: 'BỎ THEO DÕI',
                        onPress: () => {
                            onPress();
                        },
                    },
                    {
                        text: 'Hủy',
                        type: ButtonType.flat,
                        onPress: () => {
                        },
                        textStyle: { color: Colors.primary },
                    },
                ],
            });
            return;
        }

        onPress();
    };

    return {
        excecute: _onPress,
        marked,
    };
};
