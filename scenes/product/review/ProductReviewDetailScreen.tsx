import { ButtonType } from 'components/button/Button';
import { UserFollowButton } from 'components/button/user/UserFollowIcon';
import CommentInput from 'components/comment/CommentInput';
import { CommentList } from 'components/comment/CommentList';
import ImageElement from 'components/images/ImageElement';
import ImageModalSlider from 'components/images/ImageModalSlider';
import ProfileImage from 'components/images/ProfileImage';
//redux
import FeedProduct from 'components/list/post/FeedProduct';
import ProductListHorizontal from 'components/list/product/ProductListHorizontal';
import { CommentType } from "model";
import moment from 'moment';
import 'moment/locale/vi';
import React, { PureComponent, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ImagePickerResponse } from 'react-native-image-picker';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Ripple from 'react-native-material-ripple';
import { CommentListRouteSetting, RoutePath } from 'routes';
import { NavigationService } from 'services/navigation';
import { Colors, Outlines, Spacing, Typography } from 'styles';
import * as cs from 'styles/legacy/common.style';
import { useActions } from 'utils/hooks/useActions';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { createCommentApi, getFeedbackComments, getFeedDetail, getKolProfileFeedbackList, getProductList } from '_api';

moment.locale('vi');



class PostImage extends PureComponent {
    _renderImage = (data) => {
        const { influencerpostimage_set = [] } = data;
        const image_set = [...influencerpostimage_set];
        return <ImageModalSlider imageSet={image_set} />;
    };

    render() {
        const { data } = this.props;
        return <View>{this._renderImage(data)}</View>;
    }
}


const ProductFeedbackDetailScreen = ({ navigation, route }: { navigation: any; route: any }) => {
    const commentListRef = useRef(null);
    const { data: routeData, product } = route.params;
    const { token } = useTypedSelector((state) => state.auth);
    const { comments, totalComments } = useTypedSelector((state) => state.comment);

    const [data, setData] = useState(routeData);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [feedbackByInfluencer, setFeedbackByInfluencer] = useState([]);

    const {
        setLoading,
        setComments,
        addComment,
        showDialog,
        setTotalComments,
    } = useActions();
    const [message, setMessage] = useState('');
    const [media, setMedia] = useState<ImagePickerResponse[]>([]);
    const [extraHeight, setExtraHeight] = useState(84 + 21);

    useEffect(() => {
        const fetchRelatedProduct = async () => {
            if (product) {
                try {
                    var categoryName = product.category.name;
                    var subCategoryName = product.sub_category.name;
                    var colorList = [];
                    product.color.map(({ name }) => {
                        colorList = colorList.concat(name);
                    });
                } catch {
                    var categoryName = 'all';
                    var subCategoryName = 'all';
                    var colorList = [];
                }

                const relatedProductByCategory = await getProductList({
                    category: categoryName,
                    subCategory: subCategoryName,
                    colorFilter: colorList,
                    styleFilter: [product.style],
                });
                setRelatedProducts(relatedProductByCategory.data);
            }
            if (data.pk) {
                // feedback detail
                const feedbackData = await getFeedDetail(data.pk);
                setData(feedbackData);

                // get feedback list by influencer
                const feedbackByInfluencer = await getKolProfileFeedbackList({
                    token,
                    influencerPk: data.influencer.pk,
                });
                console.log(feedbackByInfluencer);
                setFeedbackByInfluencer(feedbackByInfluencer.data);
            }
        };
        fetchRelatedProduct();
        setLoading(false);
    }, []);

    const _fetchData = async () => {
        const results = await getFeedbackComments(data?.pk);
        setTotalComments(results.totalCount);

        return results;
    };

    const onSubmitComment = async () => {
        try {
            setLoading(true);
            const params = {
                message,
                images: media,
            };
            const newComment = await createCommentApi(data.pk, params, CommentType.feed);
            addComment(newComment);
            setMedia([]);
            setMessage('');
            setTotalComments(totalComments + 1);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            showDialog({
                title: error.friendlyMessage,
                actions: [
                    {
                        type: ButtonType.primary,
                        text: 'Ok',
                        onPress: () => {
                        },
                    },
                ],
            });
        }
    };

    const onShowAllComments = () => {
        NavigationService.instance.navigate(
            new CommentListRouteSetting({
                pk: data.pk,
                type: CommentType.feed
            }),
        );
    };

    const onGetLayout = (event: any) => {
        const textInputLines = event?.nativeEvent?.layout?.height / 21 || 1;
        setExtraHeight(84 + (media.length > 0 ? 90 : 0) + textInputLines * 21);
    };

    const _renderCommentHeader = () => {
        return totalComments > 0 ? (
            <View style={styles.header}>
                <Ripple onPress={onShowAllComments}>
                    <Text style={[Typography.description, {
                        marginLeft: 16,
                        paddingBottom: 12
                    }]}>{`Xem tất cả ${totalComments || 0
                        } bình luận`}</Text>
                </Ripple>
            </View>
        ) : (
            <View style={{ height: 12 }}></View>
        );
    };

    const renderComments = () => {
        return (
            <View style={{ flex: 1 }}>
                <CommentList
                    ref={commentListRef}
                    data={comments.slice(0, 2)}
                    setData={setComments}
                    fetchData={_fetchData}
                    emptyMessage={'Bạn cảm thấy Feedback này như thế nào?\nCùng bình luận với Dabi nhé.'}
                    renderHeader={_renderCommentHeader}
                    showBottomIcon={false}
                    extraHeight={isIphoneX() ? 0 : 33}
                />
                <CommentInput
                    showTooltip={false}
                    message={message}
                    setMessage={setMessage}
                    media={media}
                    setMedia={setMedia}
                    onSubmitComment={onSubmitComment}
                    onGetLayout={onGetLayout}
                />
            </View>
        );
    };

    const time =
        data?.post_taken_at_timestamp && moment(data?.post_taken_at_timestamp).isValid()
            ? moment(data?.post_taken_at_timestamp).fromNow()
            : '';
    return (
        data && (
            <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                enableOnAndroid={false}
                enableAutomaticScroll={true}
                extraScrollHeight={20}>
                <PostImage data={data} />
                <View
                    style={[
                        cs.container,
                        cs.row,
                        cs.align_c,
                        cs.justify_b,
                        { paddingTop: 12, justifyContent: 'space-between' },
                    ]}>
                    <TouchableOpacity
                        onPress={() => navigation.push(RoutePath.UserProfile, { pk: data?.influencer?.pk })}>
                        <View style={[cs.pl_16, cs.row, cs.align_c, { width: Spacing.screen.width - 26 - 16 }]}>
                            <ProfileImage source={data.influencer?.profile_image} />
                            <View style={{ width: Spacing.screen.width - 16 - 40 - 42 }}>
                                <View
                                    style={{
                                        width: '85%',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                    }}>
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            ...Typography.name_button,
                                            marginLeft: 12,
                                            backgroundColor: data.influencer?.insta_id
                                                ? 'transparent'
                                                : Colors.surface.lightGray,
                                        }}>
                                        {data.influencer.name}
                                    </Text>
                                    <UserFollowButton name={data.influencer.name} pk={data.influencer.pk} />
                                </View>
                                <Text
                                    style={{
                                        ...Typography.caption,
                                        marginHorizontal: 12,
                                        color: Colors.surface.darkGray,
                                    }}>
                                    {time}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                {product && <FeedProduct data={product} navigation={navigation} />}
                <Text style={{ ...Typography.body, paddingHorizontal: 12, marginBottom: 24 }}>
                    {data.post_description}
                </Text>
                {data && renderComments()}
                {feedbackByInfluencer && feedbackByInfluencer.length > 1 && (
                    <View style={{ paddingLeft: 12, marginVertical: 24 }}>
                        <Text style={{ ...Typography.name_button, marginBottom: 12 }}>
                            Feedback khác của {data.influencer.insta_id}
                        </Text>
                        <FlatList
                            data={feedbackByInfluencer}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            initialNumToRender={5}
                            keyExtractor={(item) => item.pk.toString()}
                            renderItem={({ item }) => {
                                return (
                                    <TouchableOpacity
                                        style={{ marginRight: 12 }}
                                        onPress={() =>
                                            navigation.push('ProductFeedbackDetail', {
                                                data: item,
                                                product: item.related_product,
                                            })
                                        }>
                                        <ImageElement
                                            sourceURL={item.post_thumb_image}
                                            width={72}
                                            height={72}
                                            rounded
                                        />
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                )}
                <ProductListHorizontal
                    data={relatedProducts}
                    title={'Sản phẩm tương tự'}
                    containerStyle={{ marginLeft: 12 }}
                />
            </KeyboardAwareScrollView>
        )
    );
};

export default ProductFeedbackDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        marginTop: 12,
        borderBottomWidth: Outlines.borderWidth.base,
        borderColor: Colors.background,
    },
});
