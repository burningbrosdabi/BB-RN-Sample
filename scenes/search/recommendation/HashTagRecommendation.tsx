import { HashTag, UserKeyword } from "model/search/keyword";
import React, { useContext } from "react";
import { Text, View } from "react-native";
import Highlighter from "react-native-highlight-words";
import Ripple from "react-native-material-ripple";
import { SearchContext } from "scenes/search/context";
import { useFetchOnKeystroke, useSelectKeyword } from "scenes/search/hook";
import { GenericStyles } from "scenes/search/style";
import { searchHashtag, searchUser } from "services/api/search/search.api";
import { useNavigator } from "services/navigation/navigation.service";
import { Colors, Typography } from "styles";
import { useActions } from "utils/hooks/useActions";

export const HashTagRecommendation = () => {
    const { textStream: stream } = useContext(SearchContext);
    const { setSearchUserKeyword } = useActions();
    const { data } = useFetchOnKeystroke<HashTag>(
        {
            fetch: (query) => searchHashtag({ query })
        }
    )
    const navigator = useNavigator();
    const selectKeyword = useSelectKeyword();

    if (data.length <= 0) return <></>
    return <View style={GenericStyles.sectionsContainer}>
        {
            data.map((value, index) => {
                const onPress = () => {
                    // navigator.navigate(new UserProfileRouteSetting({ pk: user.id }));
                    selectKeyword(value.text);
                }
                return <Ripple
                    onPress={onPress}
                    key={`${index}`
                    }
                    style={{
                        height: 48,
                        paddingHorizontal: 16,
                        alignItems: 'center',
                        flexDirection: 'row'
                    }} >
                    <View style={{ height: 24, width: 24, borderRadius: 12, backgroundColor: Colors.background, marginRight: 8, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={Typography.name_button}># </Text>
                    </View>
                    <Highlighter
                        highlightStyle={Typography.option}
                        style={Typography.body}
                        searchWords={stream.value?.split(' ') ?? []}
                        textToHighlight={value.text}
                    />
                </Ripple>
            })
        }
    </View>
}
