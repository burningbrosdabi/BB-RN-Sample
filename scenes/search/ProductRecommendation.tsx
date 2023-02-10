import React, {useContext} from "react";
import {SearchContext} from "scenes/search/context";
import {useFetchOnKeystroke} from "scenes/search/hook";
import {ProductInfo} from "model";
import {getProductList} from "_api";
import {View} from "react-native";
import {GenericStyles} from "scenes/search/style";
import FeedProduct from "components/list/post/FeedProduct";
import Highlighter from "react-native-highlight-words";
import {Colors, Typography} from "styles";
import {fontExtraBold} from "styles/typography";
import {RelatedProductImpl} from "model/product/related.product";
import {useActions} from "utils/hooks/useActions";

export const ProductRecommendation = () => {
    const {textStream: stream} = useContext(SearchContext);
    const {setSearchProductKeyword} = useActions();
    const {data} = useFetchOnKeystroke<ProductInfo>(
        {
            fetch: (query) => getProductList({limit: 3, query})
                .then((value) => value.data)
        }
    )

    if (data.length <= 0) return <></>
    return <View style={GenericStyles.sectionsContainer}>
        {
            data.map((product, index) => {
                const relatedProduct = RelatedProductImpl.fromProductInfo(product);
                const onPress = () => {
                    setSearchProductKeyword(relatedProduct)
                }
                return <FeedProduct
                    onPress={onPress}
                    key={`${product.pk}`}
                    ProductText={<Highlighter
                        highlightStyle={[Typography.description, {fontFamily: fontExtraBold, color: Colors.black}]}
                        style={[Typography.description, {color: Colors.black}]}
                        searchWords={stream.value?.split(' ') ?? []}
                        textToHighlight={product.name}
                    />}
                    containerStyle={{
                        borderWidth: 0,
                        marginHorizontal: 0,
                        paddingHorizontal: 16,
                        paddingVertical: 12
                    }}
                    data={relatedProduct}/>
            })
        }
    </View>
}
