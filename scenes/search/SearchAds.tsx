import { SafeAreaView, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors, Outlines, Spacing, Typography } from "styles";
import { Button, ButtonType, LayoutConstraint } from "components/button/Button";
import DabiFont from "assets/icons/dabi.fonts";
import { getAdvertiseKeyword } from "services/api/search/search.api";
import { Header } from "components/header/Header";
import { useNavigator } from "services/navigation/navigation.service";
import { SearchResultRouteSetting, SearchRouteSetting } from "routes/search/search.route";

export const SearchAdsScreen = () => {
    const [adsKeyword, setAdsKeyword] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAdvertiseKeyword();
            setAdsKeyword(data);
        };
        fetchData();
    }, []);


    return <View style={{ flex: 1 }}>
        <SafeAreaView >
            <Header mode={'cancel'} />
        </SafeAreaView>
        <View style={styles.searchScreenContainer}>
            <View style={{ width: '100%', alignItems: 'center' }}>
                <Text style={styles.titleText}>Bạn đang muốn tìm{'\n'}sản phẩm nào?</Text>
            </View>
            <View style={styles.searchBarContainer}>{<SearchBar />}</View>
            <View
                style={{
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 40 * 2,
                }}>
                {adsKeyword.map((item, index) => <KeywordItem key={item} keyword={item} index={index} />)}
            </View>
        </View>
    </View>
}

const SearchBar = () => {
    const navigator = useNavigator();
    return (
        <TouchableWithoutFeedback onPress={() => {
            navigator.navigate(new SearchRouteSetting());
        }}>
            <View style={styles.searchBoxContainer}>
                <Text style={styles.searchBoxInputField}>Bạn muốn tìm gì?</Text>
                <DabiFont name={'search'} size={24} color={Colors.icon} />
            </View>
        </TouchableWithoutFeedback>
    );
}

const KeywordItem = ({ index, keyword }: { index: number, keyword: string }) => {
    const colorList: { [id: number]: string[] } = {
        0: Colors.gradient.pink,
        1: Colors.gradient.yellow,
        2: Colors.gradient.green,
        3: Colors.gradient.blue,
        4: Colors.gradient.purple,
    };

    const navigator = useNavigator();

    const onPress = () => {
        navigator.navigate(new SearchResultRouteSetting({ query: keyword }))
    }

    return (
        <View
            style={{
                width: (Spacing.screen.width - 16 * 2 - 12) / 2,
                marginBottom: 12,
            }}>
            <Button
                key={keyword}
                alignItems={'flex-start'}
                type={ButtonType.primary}
                text={keyword}
                color={colorList[index % 4]}
                constraint={LayoutConstraint.matchParent}
                textStyle={{ textTransform: 'none' }}
                onPress={onPress}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    searchScreenContainer: { paddingHorizontal: 16 },
    searchBarContainer: { marginVertical: 12 * 2 },
    titleText: {
        ...Typography.h1,
        marginBottom: 12 * 2,
        marginTop: 12 * 3,
        paddingHorizontal: 12,
        textAlign: 'center',
    },
    orderingTab: { flexDirection: 'row', paddingHorizontal: 16, justifyContent: 'space-between', alignItems: 'center' },
    searchBoxContainer: {
        flexDirection: 'row',
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 4,
        alignItems: 'center',
        height: 40,
        backgroundColor: Colors.background,
        justifyContent: 'space-between',
    },
    searchBoxInputField: {
        ...Typography.body,
        color: Colors.surface.darkGray,
        paddingTop: 0,
        paddingBottom: 0,
        textAlignVertical: 'center',
    },
});