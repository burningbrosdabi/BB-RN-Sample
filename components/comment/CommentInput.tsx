import Button, { ButtonState, ButtonType, LayoutConstraint } from 'components/button/Button';
import ImageElement from 'components/images/ImageElement';
import { ToolTip } from 'components/tooltip';

import { CommentItemModel, CommentType } from "model";
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
    Image,
    Keyboard,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity, TouchableWithoutFeedback,
    View,
    ViewStyle
} from 'react-native';
import { Asset } from 'react-native-image-picker';
import Ripple from 'react-native-material-ripple';
import Animated, { EasingNode } from 'react-native-reanimated';
import { Subject } from "rxjs";
import { selectImage } from "services/image/image.serivce";
import { Colors, Outlines, Spacing, Typography } from 'styles';
import { storeKey } from 'utils/constant';
import { useActions } from "utils/hooks/useActions";
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { createCommentApi } from "_api";
import { asyncGuard, renderLoginAlert } from '_helper';
import { hasNotch } from "react-native-device-info";
import { CommentContext, CommentReplyContext } from "components/comment/context";
import { isNil } from "lodash";
import IconButton from "components/button/IconButton";
import { DabiFont } from 'assets/icons';

const MAX_LENGTH_COMMENT = 1000;
const MAX_LENGTH_PHOTOS = 5;
const BTM_OVERFLOW_HEIGHT = 200;
export const COMMENT_INPUT_DEFAULT_HEIGHT = 72;

interface Props {
    style?: ViewStyle;
    showTooltip?: boolean;
    type: CommentType;
    pk: number;
    onFocus?: () => void;
    onBlur?: () => void;
    onChangeText?: (text: string) => void;
}

const CommentInput = ({
    showTooltip = true, pk, type,
    onFocus,
    onBlur,
    onChangeText: _onChangeText
}: Props) => {

    const { isLoggedIn } = useTypedSelector((state) => state.auth);
    const [message, setMessage] = useState('');
    const [media, setMedia] = useState<Asset[]>([]);
    const { showDialog } = useActions()
    const anim = useKeyboardListener();
    const user = useTypedSelector(state => state.user.userInfo);
    const { sourceCommentStream, replyStream } = useContext(CommentReplyContext);
    const [onSubmiting, setOnSubmiting] = useState(false);
    const inputRef = useRef<TextInput | undefined>();

    const { commentStream } = useContext(CommentContext);

    useEffect(() => {
        const sub = sourceCommentStream.subscribe((value) => {
            if (!value) return;
            inputRef.current?.focus();
        })
        return (() => {
            sourceCommentStream.next(undefined);
            sub.unsubscribe();
        });
    }, [])

    const onSubmitComment = async () => {
        const srcComment = sourceCommentStream.value;
        Keyboard.dismiss();
        try {
            const params = {
                message,
                images: media,
                sourceComment: !isNil(srcComment) ? srcComment.pk : undefined,
                reply: !isNil(srcComment) ? srcComment.reply : undefined,
            };
            setOnSubmiting(true);
            createCommentApi(pk, params, type)
                .then((value) => {
                    if (!isNil(srcComment)) {
                        replyStream?.next(value);
                        sourceCommentStream.next(undefined);
                    } else {
                        commentStream.next(value)
                    }
                }).finally(() => {
                    setOnSubmiting(false);
                });
            setMedia([]);
            setMessage('');
        } catch (error) {
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

    const onAddPicture = async () => {
        const assets = await asyncGuard(() => selectImage({ selectionLimit: 5 }));
        _onUploadImage(assets)
    }

    const _onUploadImage = (item: any) => {
        setMedia(media.concat(item));
    };

    const onRemoveImage = (item: Asset) => {
        setMedia(media.filter((res: Asset) => res.uri !== item.uri));
    };

    const _onInputPress = () => {
        if (!isLoggedIn) {
            renderLoginAlert();
        }
    };

    const renderTooltip = (children: JSX.Element) => {
        if (!showTooltip) return children;
        return (
            <ToolTip
                cacheKey={storeKey.commentTooltip}
                tooltipStyle={{ transform: [{ translateX: -96 }] }}
                arrowStyle={{ transform: [{ translateX: -62 }] }}
                text={'Để lại bình luận để\ngiao lưu cùng cộng đồng'}
                placement={'top'}>
                {children}
            </ToolTip>
        );
    };

    const onChangeText = (text: string) => {
        setMessage(text);
    }

    useEffect(() => {
        _onChangeText && _onChangeText(message);
    }, [message]);

    const btnState = useMemo(() => {
        if (onSubmiting) return ButtonState.loading;
        if (message.length <= 0) return ButtonState.disabled;
        return ButtonState.idle;
    }, [onSubmiting, message])


    return (
        <Animated.View style={[styles.container,
        {
            position: 'absolute', left: 0, right: 0,
            bottom: anim,
            paddingBottom: BTM_OVERFLOW_HEIGHT
        }]
        }>
            <ReplyPannel />
            <View>
                <View style={{ height: 6 }} />
                <MediaView media={media} onRemove={onRemoveImage} />
            </View>
            <View style={{ height: 6 }} />
            <View style={{ paddingHorizontal: 16 }}>
                {renderTooltip(
                    <TouchableWithoutFeedback onPress={_onInputPress}>
                        <View style={{
                            justifyContent: 'center'
                        }}>
                            <TextInput
                                ref={inputRef}
                                value={message}
                                onBlur={onBlur}
                                onFocus={onFocus}
                                pointerEvents={isLoggedIn ? undefined : 'none'}
                                editable={isLoggedIn}
                                maxLength={MAX_LENGTH_COMMENT}
                                placeholder="Thêm bình luận..."
                                placeholderTextColor={Colors.black}
                                multiline
                                onChangeText={onChangeText}
                                style={[Typography.body, styles.input,]}
                                textAlignVertical='center'
                            />

                            <Ripple
                                disabled={media.length === MAX_LENGTH_PHOTOS || !isLoggedIn}
                                style={{
                                    position: 'absolute',
                                    left: 12,
                                }}
                                onPress={onAddPicture}>
                                <DabiFont name={'camera'} />
                            </Ripple>

                            <View style={[styles.sendText, { top: 0, bottom: 0, justifyContent: 'center' }]}>
                                <Ripple
                                    disabled={btnState === ButtonState.disabled}
                                    onPress={onSubmitComment}>
                                    <DabiFont name={'send'} />
                                </Ripple>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                )}
                <View style={{ height: 12 + (hasNotch() ? 12 : 0) }} />
            </View>
        </Animated.View>
    );
};

const ReplyPannel = () => {
    const { sourceCommentStream, replyStream } = useContext(CommentReplyContext);
    const [srcComment, setSrcComment] = useState(sourceCommentStream?.value);

    useEffect(() => {
        const sub = sourceCommentStream?.subscribe((value) => {
            setSrcComment(value);
        });
        return (() => {
            sub?.unsubscribe();
        })
    }, [])

    const onCancel = () => {
        sourceCommentStream.next(undefined);
    }

    if (isNil(srcComment)) return <></>
    return <View style={{
        paddingHorizontal: 16, paddingVertical: 8,
        backgroundColor: Colors.background,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }}>
        <Text style={[Typography.body, { color: Colors.text }]}>{`Trả lời ${srcComment.user.name}`}</Text>
        <IconButton onPress={onCancel} iconSize={12} icon={'small_delete'} />
    </View>
}

const MediaView = ({ media, onRemove }: { media: Asset[], onRemove: (asset: Asset) => void }) => {
    return media.length > 0 ? (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingHorizontal: 10, marginRight: 16 }}>
            {media?.map((item: Asset, index: number) => {
                return (
                    <View
                        key={item.uri}
                        style={[styles.imageContainer, index === media.length - 1 && { marginRight: 16 }]}>
                        <ImageElement
                            containerStyle={styles.image}
                            width={78}
                            height={78}
                            sourceURL={item.uri} />
                        <Ripple style={styles.deleteIconContainer} onPress={() => onRemove(item)}>
                            <Image
                                style={styles.deleteIcon}
                                source={require('_assets/images/icon/delete_white.png')}
                            />
                        </Ripple>
                    </View>
                );
            })}
        </ScrollView>
    ) : <></>
}


export const useKeyboardListener = () => {
    const [position, setPosition] = useState(0);
    const anim = useRef(new Animated.Value(-BTM_OVERFLOW_HEIGHT)).current;
    const init = useRef(false)

    useEffect(() => {
        const keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', _keyboardWillShow);
        const keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', _keyboardWillHide);

        return () => {
            keyboardWillShowListener.remove()
            keyboardWillHideListener.remove()

        }
    }, []);

    const _keyboardWillShow = (event) => {
        const height = event.endCoordinates.height;
        setPosition(height);
    };

    const _keyboardWillHide = () => {
        setPosition(0);
    };

    const animateButton = (value: number) => {
        Animated.timing(anim, {
            toValue: value - BTM_OVERFLOW_HEIGHT,
            duration: 160,
            easing: EasingNode.ease
        }).start();
    }

    useEffect(() => {
        if (!init.current) {
            init.current = true;
            return
        }
        animateButton(position)
    }, [position])

    return anim;
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderTopWidth: Outlines.borderWidth.base,
        borderColor: Colors.background,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputContainer: {
        // minHeight:48,
        width: '100%',
        borderRadius: 4,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    sendText: {
        position: 'absolute',
        right: 12,
    },
    imageContainer: {
        marginHorizontal: 6,
        width: 78,
        height: 78,
        borderRadius: 4,
        overflow: 'hidden',
        borderColor: Colors.boxLine,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteIcon: {
        width: 12,
        height: 12,
        resizeMode: 'contain',
    },
    deleteIconContainer: {
        padding: 8,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    image: {
        width: 78,
        height: 78,
        borderRadius: 4,
        resizeMode: 'cover',
    },
    input: {
        width: Spacing.screen.width - 32,
        minHeight: 48
        , maxHeight: 120,
        alignItems: 'center',
        textAlignVertical: 'center',
        paddingLeft: 48,
        paddingRight: 60,
        borderRadius: 28,
        color: Colors.black,
        backgroundColor: Colors.background,
        flex: 1,
        ...Platform.select({
            ios: {
                paddingTop: 14 // as same as height
            },
            android: {}
        })
    }
});

export default CommentInput;

// const genComment = useCallback(() => {
//     const comment = new CommentItemModel();
//     comment.text = message;
//     comment.user = new UserItemType().fromJSON({
//         pk: user.id,
//         profile_image: user.profile_image,
//         name: user.name,
//         user_type: user.user_type
//     })
//     media.map((media,index) => {
//         // @ts-ignore
//         comment[`image_${index}`] = media.uri;
//     })
//     comment.created_at = moment.now().toString();
//     return comment;
// },[user, message,media])