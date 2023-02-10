import { useNetInfo } from '@react-native-community/netinfo';
import { ButtonType } from 'components/button/Button';
import React, { useState } from 'react';
import { ImageRequireSource, RefreshControl } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { EmptyView } from './EmptyView';


const _View = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const netInfo = useNetInfo();
    const [refreshing, useRefreshing] = useState(false);

    const onRefreshing = async () => {
        if (refreshing) return;
        useRefreshing(true);

        const promise = new Promise((res) => {
            setTimeout(() => res(null), 1200);
        });
        await promise;
        useRefreshing(false);
    };

    return (
        <>
            {
                netInfo.isConnected !== false ? (
                    children
                ) : (
                    <ScrollView
                        contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center', top: -30 }}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefreshing} />}>
                        <EmptyView
                            file={require('assets/images/empty/info_network.png') as ImageRequireSource}
                            title={'Không có kết nối mạng'}
                            description={'Hãy kiểm tra đường truyền và thử lại nhé.'}
                            action={{
                                text: 'Thử Lại',
                                onPress: onRefreshing,
                                type: ButtonType.primary,
                            }}
                        />
                    </ScrollView>
                )
            }
        </>
    );
};

const HOC = (Component: React.FC<any>) => ({ ...props }) => (
    <_View>
        <Component {...props} />
    </_View>
);

export const ConnectionDetection = {
    View: _View,
    HOC,
};
