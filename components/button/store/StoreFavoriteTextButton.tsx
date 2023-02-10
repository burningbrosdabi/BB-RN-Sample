import Button, { ButtonType, LayoutConstraint } from 'components/button/Button';
import { StoreInfo } from 'model';
import React from 'react';
import { ViewStyle } from 'react-native';
import { Colors } from 'styles';
// utils
import { useFavoriteButton } from "utils/hooks/useFavoriteButton";
import {StoreFollowData, storeLikeController} from "services/user";
import { StoreCollectionItem } from "model/collection";


export interface Props {
    data: StoreInfo | StoreCollectionItem;
    style?: ViewStyle;
    onPressFollow?: (isAdded: boolean, store: StoreInfo) => void;
}

const StoreFavoriteButton: React.FC<Props> = ({ data, style }: Props) => {

    const { onPress, marked } = useFavoriteButton<StoreFollowData>({
        pk: data.pk,
        controller: storeLikeController,
        prepare: (value: boolean) => {
            return ({
                pk:data.pk,
                is_following: value,
            })
        }
    })

    return (
        <Button
            style={[{ width: 90 }, style]}
            constraint={LayoutConstraint.wrapChild}
            onPress={onPress}
            text={marked ? 'Đã thích' : 'Thích +'}
            type={marked ? ButtonType.outlined : ButtonType.primary}
            color={Colors.primary}
        />
    );
};

export default React.memo(StoreFavoriteButton);
