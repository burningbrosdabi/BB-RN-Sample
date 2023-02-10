import React, { useContext } from "react";
import { SearchContext } from "scenes/search/context";
import { useFetchOnKeystroke } from "scenes/search/hook";
import { ProductInfo } from "model";
import { getProductList } from "_api";
import { View } from "react-native";
import { GenericStyles } from "scenes/search/style";
import FeedProduct from "components/list/post/FeedProduct";
import Highlighter from "react-native-highlight-words";
import { Colors, Typography } from "styles";
import { fontExtraBold } from "styles/typography";
import { RelatedProductImpl } from "model/product/related.product";
import { searchUser } from "services/api/search/search.api";
import { UserKeyword } from "model/search/keyword";
import { KeywordTile } from "scenes/search/KeywordTile";
import { useNavigator } from "services/navigation/navigation.service";
import { useActions } from "utils/hooks/useActions";
import { UserProfileRouteSetting } from "routes";

export const UserRecommendation = () => {
    const { textStream: stream } = useContext(SearchContext);
    const { setSearchUserKeyword } = useActions();
    const { data } = useFetchOnKeystroke<UserKeyword>(
        {
            fetch: (query) => searchUser({ query })
        }
    )
    const navigator = useNavigator();

    if (data.length <= 0) return <></>
    return <View style={GenericStyles.sectionsContainer}>
        {
            data.map((user, index) => {
                const onPress = () => {
                    navigator.navigate(new UserProfileRouteSetting({ pk: user.id }));
                    // setSearchUserKeyword(user);
                }
                return <KeywordTile key={`${index}`}
                    title={user.name}
                    description={`@${user.user_id}`}
                    onPress={onPress}
                    image={user.profile_image} />
            })
        }
    </View>
}
