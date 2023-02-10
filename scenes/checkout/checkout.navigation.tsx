import { useRoute } from '@react-navigation/native';
import { TransitionPresets } from '@react-navigation/stack';
import { IconButton } from 'components/button/IconButton';
import { ConnectionDetection } from 'components/empty/OfflineView';
import { first, isNil } from 'lodash';
import { CheckoutSubcart, PaymentMethod } from 'model/checkout/checkout';
import { ICartSummary, ShippingOptionMap } from 'model/checkout/type';
import { ICoupon } from 'model/coupon/coupon';
import { IRecipient } from 'model/recipient/recipient';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StepIndicator from 'react-native-step-indicator';
import { RoutePath } from 'routes';
import { StepIndicatorStyle } from 'scenes/onboarding/StepIndicatorStyle';
import { useNavigator } from 'services/navigation/navigation.service';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { ShippingModal, ShippingModalRef } from './component/shipping.modal';
import { SummaryView } from './component/summary.view';
import {
    CheckoutContext,
    defaultCartSummary,
    ICheckoutContext,
    IShippingOptionsContext,
    ShippingOptionContext,
    SubcartOptionMap
} from './context';
import { DigestScreen } from './digest.screen';
import { resetAppliedCoupon } from './helper.hook';
import { OverviewScreen } from './overview.screen';
import { PaymentScreen } from './payment.screen';

const Stack = createNativeStackNavigator();

export const CheckoutNavigation = () => {
    const [subcartOption, setSubcartOption] = useState<SubcartOptionMap>({});
    const [summary, setSummary] = useState<ICartSummary>(defaultCartSummary);
    const [_digest_key, setDigestKey] = useState<string | null>(null);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [checkoutSubcart, setCheckoutSubcart] = useState<CheckoutSubcart[]>([]);
    const [selectedPayment, setSelectedPayment] = useState<number | null>(null);
    const [coupon, setCoupon] = useState<ICoupon | null>(null);
    const recipients = useTypedSelector((state) => state.user.recipients);

    const [recipient, setRecipient] = useState<IRecipient | null>(null);

    useEffect(() => {
        setRecipient(first(recipients) ?? null);
    }, [recipients]);

    const route = useRoute();
    useNavigationChangeHandler(subcartOption, setSubcartOption, () => setCoupon(null));

    const [shippingOption, setShippingOption] = useState<ShippingOptionMap>({});

    const setShipping = useCallback(
        (storePk: number, shippingPk: number) => {
            const _subcartOption = subcartOption[storePk];
            if (isNil(storePk) || isNil(shippingPk) || isNil(_subcartOption)) {
                return;
            }

            _subcartOption.shipping_option_id = shippingPk;
            setSubcartOption({ ...subcartOption });

            return;
        },
        [subcartOption, shippingOption],
    );

    const setMessage = useCallback(
        (storePk: number, message: string) => {
            const _subcartOption = subcartOption[storePk];

            if (isNil(storePk) || isNil(_subcartOption)) {
                return;
            }

            _subcartOption.message_from_customer = message;
            setSubcartOption({ ...subcartOption });

            return;
        },
        [subcartOption],
    );

    const subcartOptionContext: ICheckoutContext = useMemo(
        () => ({
            optionMap: subcartOption,
            summary,
            _digest_key,
            paymentMethods,
            checkoutSubcart,
            selectedPayment,
            coupon,
            recipient,
            setShipping,
            setMessage,
            setSubCart: setSubcartOption,
            setSummary,
            setDigestKey,
            setPaymentMethods,
            setCheckoutSubcart,
            setSelectedPayment,
            setCoupon,
            setRecipient,
        }),
        [subcartOption, summary, _digest_key, paymentMethods, checkoutSubcart, selectedPayment, coupon],
    );

    const modalRef = useRef<ShippingModalRef>();

    const showModal = (pk: number) => {
        modalRef.current?.open(pk);
    };

    const shippingOptionsContext: IShippingOptionsContext = useMemo(
        () => ({
            optionMap: shippingOption,
            setOptionMap: setShippingOption,
            showModal,
        }),
        [shippingOption],
    );

    return (
        <ShippingOptionContext.Provider value={shippingOptionsContext}>
            <CheckoutContext.Provider value={subcartOptionContext}>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <_Header />
                        <ConnectionDetection.View>
                            <>
                                <Stack.Navigator
                                    initialRouteName={RoutePath.checkoutDigest}
                                    screenOptions={{
                                        headerShown: false,
                                        ...TransitionPresets.SlideFromRightIOS,
                                    }}>
                                    <Stack.Screen
                                        name={RoutePath.checkoutDigest}
                                        component={DigestScreen}
                                        initialParams={route.params}
                                    />
                                    <Stack.Screen name={RoutePath.checkoutPayment} component={PaymentScreen} />
                                    <Stack.Screen name={RoutePath.checkoutOverview} component={OverviewScreen} />
                                </Stack.Navigator>
                                <View style={{ position: 'absolute', left: 0, bottom: 0, right: 0 }}>
                                    <SummaryView />
                                </View>
                            </>
                        </ConnectionDetection.View>
                    </View>
                    <ShippingModal setShipping={setShipping} ref={modalRef} />
                </SafeAreaView>
            </CheckoutContext.Provider>
        </ShippingOptionContext.Provider>
    );
};

const useNavigationChangeHandler = (
    subcartOption: SubcartOptionMap,
    setSubcartOption: (value: SubcartOptionMap) => void,
    resetCoupon: () => void,
) => {
    const navigator = useNavigator();
    const [routeName, setRouteName] = useState(RoutePath.checkoutDigest);
    const prevRoute = useRef(RoutePath.checkoutDigest);
    useEffect(() => {
        const unsubscribe = navigator.addOnRouteListener((route) => {
            setRouteName(route as RoutePath);
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        if (prevRoute?.current === routeName) return;
        if (prevRoute) {
            prevRoute.current = routeName;
        }

        if (routeName === RoutePath.checkoutDigest) {
            const newOptionMap = resetAppliedCoupon(subcartOption);
            setSubcartOption(newOptionMap);
            resetCoupon();
        }
    }, [routeName, subcartOption]);
};

const _Header = () => {
    const navigator = useNavigator();
    const [index, setIndex] = useState(0);
    const mounted = useRef(true);

    useEffect(() => {
        const unsubscribe = navigator.addOnRouteListener((route) => {
            if (!mounted.current) return;
            const routes: string[] = [
                RoutePath.checkoutDigest,
                RoutePath.checkoutPayment,
                RoutePath.checkoutOverview,
            ];
            const index = routes.indexOf(route);
            if (index >= 0) setIndex(index);
        });

        return () => {
            mounted.current = false;
            unsubscribe();
        };
    }, []);

    return (
        <View
            style={{
                width: '100%',
            }}>
            <View style={{ height: 48, paddingHorizontal: 12, justifyContent: 'center' }}>
                <IconButton
                    size={32}
                    icon={index === 0 ? 'exit' : 'arrow_left'}
                    onPress={() => {
                        navigator.goBack();
                    }}
                />
            </View>
            <View style={{ width: '100%', alignItems: 'center', paddingBottom: 12 }}>
                <View style={{ width: 96 }}>
                    <StepIndicator
                        customStyles={StepIndicatorStyle}
                        stepCount={3}
                        direction="horizontal"
                        currentPosition={index}
                    />
                </View>
            </View>
        </View>
    );
};
