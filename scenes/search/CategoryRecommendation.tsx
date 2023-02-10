import {useAsync} from "utils/hooks/useAsync";
import {loadCategory} from "utils/state/action-creators/product.action-creators";
import React, {useContext, useEffect, useRef, useState} from "react";
import ProductSubcategory from "../../model/product/product.subcategory";
import {SearchContext} from "scenes/search/context";
import {concat, isEmpty, slice} from "lodash";
import {View} from "react-native";
import Ripple from "react-native-material-ripple";
import Highlighter from "react-native-highlight-words";
import {Typography} from "styles";
import {GenericStyles} from "scenes/search/style";
import {useNavigator} from "services/navigation/navigation.service";
import {ProductCategoryFilterRouteSetting} from "routes/product/productCategoryFilter.route";
import {saveSearchKeyword} from "services/api/search/search.api";
import {useSelectKeyword} from "scenes/search/hook";
import {removeDiacritics} from "_helper";

export const CategoryRecommendation = () => {
    const [catgKeyword, setCatgKeyword] = useState<ProductSubcategory[]>([]);
    const {textStream: stream, subcatg, catgMap} = useContext(SearchContext);

    const navigator = useNavigator();

    useEffect(() => {
        const sub = stream.subscribe((searchStr) => {
            const filtered = subcatg.filter((catg) => {
                const chars = removeDiacritics(catg.display_name
                    .trim().toLocaleLowerCase().replace(' ', ''));
                const searchChars = searchStr
                    .trim()
                    .split(' ')
                    .filter((value) => !isEmpty(value))
                    .map(char => removeDiacritics(char.toLocaleLowerCase()));

                return searchChars.every((char) => chars.includes(char));
            });

            setCatgKeyword(slice(filtered,0,5));
        });

        return (() => {
            sub.unsubscribe();
        })
    }, [subcatg])

    const onSelectKeyword = useSelectKeyword();


    if (catgKeyword.length <= 0) return <></>
    return <View style={GenericStyles.sectionsContainer}>
        {
            catgKeyword.map((value, index) => {
                const onPress = () => onSelectKeyword(value.display_name)
                return <Ripple
                    onPress={onPress}
                    key={`${index}`}
                    style={{
                        height: 48,
                        paddingHorizontal: 16,
                        justifyContent: 'center'
                    }}>
                    <Highlighter
                        highlightStyle={Typography.option}
                        style={Typography.body}
                        searchWords={stream.value?.split(' ') ?? []}
                        textToHighlight={value.display_name}
                    />
                </Ripple>
            })
        }
    </View>
}
