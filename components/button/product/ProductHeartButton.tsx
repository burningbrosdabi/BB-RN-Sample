import { useNavigation } from '@react-navigation/native';
import { HeartFilledIcon, HeartFilledWhiteIcon } from 'assets/icons';
import { toast } from 'components/alert/toast';
import { FeedbackInfo, ProductDetail, ProductInfo } from 'model';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { AuthRouteSetting } from 'routes';
import { Logger } from 'services/log';
import { NavigationService } from 'services/navigation';
import { Colors, Typography } from 'styles';
import { useActions } from 'utils/hooks/useActions';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { ButtonType } from 'components/button/Button';
import IconButton from "components/button/IconButton";
import { favoriteProduct } from "_api";
import { useFavoriteButton } from "utils/hooks/useFavoriteButton";
import { productLikeController } from "services/user";


export interface Props {
    example?: string;
    count?: number;
    data: ProductInfo | ProductDetail;
    bottom?: boolean;
    showCount?: boolean;
    containerStyle?: any;
}

export const ProductHeartButton = ({ data }: { data: ProductInfo | ProductDetail }) => {

    const { onPress, marked } = useFavoriteButton<ProductInfo>({
        pk: data.pk,
        controller: productLikeController,
        // toastMessage: {
        //     marked: 'Đã lưu sản phẩm',
        //     unmarked: 'Bỏ lưu sản phẩm'
        // },
        prepare: (value: boolean) => {
            return ({
                ...data, is_liked: value,
            } as ProductInfo)
        }
    })


    return <IconButton
        onPress={onPress}
        icon={marked ? 'heart_filled' : 'heart_line'}
        color={marked ? Colors.red : Colors.black}
    />
}

const styles = StyleSheet.create({
    numberBottomText: {
        ...Typography.description,
        paddingTop: 2,
    },
    numberSideText: {
        ...Typography.description,
        paddingRight: 8,
    },
});

export default ProductHeartButton;
// atoms 이 앱에 한정되지 않고 공통적으로 사용될 수 있는 컴포넌트
// molecules 앱 내 여러곳에서 사용될 수 있는 앱 한정 재사용 가능한 컴포넌트 ex) 특정 기능이 구현된 버튼들 ( 뒤로 가기 등 )
// organisms atoms & molecules 들의 조합으로 앱의 특정 상황에서 사용됨
