import { useNavigation, useRoute } from "@react-navigation/native";
import { toast } from "components/alert/toast";
import IconButton from "components/button/IconButton";
import BackButton from 'components/header/BackButton';
import { get, isEmpty } from "lodash";
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    Keyboard, SafeAreaView, TextInput,
    TouchableWithoutFeedback,
    View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { CategoryRecommendation } from "scenes/search/CategoryRecommendation";
import { SearchContext } from "scenes/search/context";
import { useFetchCategory, useSelectKeyword } from "scenes/search/hook";
import { ProductRecommendation } from "scenes/search/ProductRecommendation";
import { SearchHistory } from "scenes/search/SearchHistory";
import { UserRecommendation } from "scenes/search/StoreRecommendation";
import { Colors, Typography } from "styles";
import { onPageTransitionDone } from "_helper";
import { HashTagRecommendation } from "./recommendation/HashTagRecommendation";

const SearchInput = () => {
    const { textStream: stream } = useContext(SearchContext);
    const [text, setText] = useState(stream.value);
    const inputRef = useRef<TextInput>();
    const navigation = useNavigation();

    useEffect(() => {
        const sub = navigation.addListener('focus', () => {
            onPageTransitionDone(() => inputRef?.current?.focus())
        });

        return (() => {
            sub();
        })
    }, [])

    useEffect(() => {
        const sub = stream.subscribe((text) => {
            setText(text);
        });
        return (() => {
            sub.unsubscribe()
        })
    }, [])

    const onChangeText = (text: string) => {
        stream.next(text)
    }

    const clearText = () => {
        stream.next('');
    }

    const selectKeyword = useSelectKeyword();

    const onSubmit = async () => {
        if (text.trim().length <= 0) {
            toast('Bạn chưa nhập từ khóa để tìm kiếm');
            return;
        }
        Keyboard.dismiss();
        selectKeyword(text);
    }


    // @ts-ignore
    return (
        <View style={{
            marginTop: 12, flexDirection: 'row', alignItems: 'center'
        }} >
            <BackButton leftPadding={0} />
            <View style={{
                height: 40,
                borderRadius: 20,
                flex: 1,
                backgroundColor: Colors.background,
                paddingHorizontal: 16,
                flexDirection: 'row',
                alignItems: 'center'
            }}>

                <TextInput
                    blurOnSubmit={false}
                    autoCapitalize='none'
                    autoCompleteType='off'
                    autoCorrect={false}
                    returnKeyType={'search'}
                    maxLength={40} onSubmitEditing={onSubmit} onChangeText={onChangeText} ref={inputRef} value={text}
                    style={[Typography.body, { flex: 1 }]} />
                {
                    !isEmpty(text.trim()) && <IconButton onPress={clearText} icon={'close'} />
                }
            </View>
        </View>)
}

export const SearchRecommendScreen = () => {
    const query = get(useRoute(), 'params.query', '');

    const textStream = useRef(new BehaviorSubject<string>(query)).current;
    const [onRecommend, setOnRecommend] = useState(!isEmpty(query));

    const { subcatg, catgMap, subCateNameMap } = useFetchCategory();

    useEffect(() => {
        const sub = textStream.subscribe((text) => {
            if (text.trim().length <= 0) {
                setOnRecommend(false);
            } else {
                setOnRecommend(true);
            }
        });

        return (() => {
            sub.unsubscribe();
        })
    }, [])


    return <SearchContext.Provider value={{ textStream, subcatg, catgMap, subCateNameMap }}>
        <TouchableWithoutFeedback onPress={() => {
            // Keyboard.dismiss()
        }}>
            <View style={{ flex: 1 }}>
                <SafeAreaView>
                    <View style={{ paddingHorizontal: 16 }}>
                        <SearchInput />
                    </View>
                </SafeAreaView>
                {
                    onRecommend ?
                        <SearchRecommend />
                        : <SearchHistory />
                }
            </View>
        </TouchableWithoutFeedback>
    </SearchContext.Provider>
}

const SearchRecommend = () => {
    return <KeyboardAwareScrollView keyboardShouldPersistTaps='handled'>
        {/* <ProductRecommendation />*/}
        <HashTagRecommendation />
        {/* <CategoryRecommendation /> */}
        <UserRecommendation />
    </KeyboardAwareScrollView>
}
