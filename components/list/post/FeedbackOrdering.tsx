import OrderList from 'components/list/order/OrderList';
import { FeedbackContext } from "components/list/post/context";
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { feedbackOrderingList } from "utils/data";



export type FeedbackOrderingModalRef = {
    open: () => void
}

const FeedbackOrdering = forwardRef((_, ref) => {
    const modalizeRef = useRef<Modalize>(null);

    const { setOrder, orderingType } = useContext(FeedbackContext)


    const _applyOrdering = (orderingType: any) => {
        setOrder(orderingType)
        modalizeRef.current?.close();
    };

    useImperativeHandle<unknown, FeedbackOrderingModalRef>(ref, () => ({
        open: () => {
            modalizeRef.current?.open()
        },
    }));

    return (
        <Portal>
            <Modalize
                ref={modalizeRef}
                panGestureEnabled
                rootStyle={{ zIndex: 10, elevation: 10 }}
                scrollViewProps={{ showsVerticalScrollIndicator: false }}
                HeaderComponent={() => {
                    return <View style={{ height: 22 }} />;
                }}
                adjustToContentHeight
                withHandle={false}>
                <OrderList
                    orderList={feedbackOrderingList}
                    orderingType={orderingType}
                    onPress={_applyOrdering}
                />
            </Modalize>
        </Portal>
    );
});
export default FeedbackOrdering;
