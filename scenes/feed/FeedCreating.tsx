import IconButton from "components/button/IconButton";
import { Link } from "components/button/Link";
import { Header } from "components/header/Header";
import ImageElement from "components/images/ImageElement";
import React, { useCallback, useRef, useState } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Asset } from 'react-native-image-picker';
import Ripple from "react-native-material-ripple";
import { FeedWritingRouteSetting } from "routes/feed/feed.route";
import { selectImage } from "services/image/image.serivce";
import { useNavigator } from "services/navigation/navigation.service";
import { applyOpacity, Colors, Spacing, Typography } from 'styles';


const { screen } = Spacing;


const size = screen.width - 28 * 2;
const MAX_NUMBER_OF_ASSETS = 10;

export const FeedCreating = () => {
    const [data, setData] = useState<Asset[]>([])
    const listRef = useRef<FlatList<Asset>>();

    const pickImage = async () => {
        const images = await selectImage({});
        if (!images) return;
        const _data = data.concat(images.slice(0, Math.min(MAX_NUMBER_OF_ASSETS, MAX_NUMBER_OF_ASSETS - data.length)));
        setData(_data)

        setTimeout(() => {
            listRef.current?.scrollToEnd({ animated: true })
        }, 120); // await  after setData
    }


    const onRemoveItem = useCallback((index: number) => {
        data.splice(index, 1);
        setData([...data]);
    }, [data])


    const renderItem = ({ item, index }: { item: Asset, index: number }) => {
        return <ImageItem index={index} onRemove={() => onRemoveItem(index)} uri={item.uri} />
    }

    const keyExtractor = (_, index: number) => `${index}`

    const navigation = useNavigator();

    // @ts-ignore
    return <SafeAreaView>
        <Header title={'Thêm Ảnh'}
            trailing={<Link
                disabled={data.length <= 0}
                blurColor={Colors.primary} style={{ textDecorationLine: 'none' }} text={'Tiếp tục'}
                onPress={() => {
                    navigation.navigate(new FeedWritingRouteSetting({ 'assets': data }))
                }} />} />
        <View style={{ height: 12 }} />
        <FlatList<Asset>
            horizontal
            ref={listRef}
            keyExtractor={keyExtractor}
            contentContainerStyle={{ paddingLeft: 28 }}
            // horizontal
            ListFooterComponent={data.length >= MAX_NUMBER_OF_ASSETS ? <></> : <UploadSpace onPress={pickImage} />}
            data={data}
            renderItem={renderItem}
        />
    </SafeAreaView>
}

const ImageItem = ({ uri, index, onRemove }: { index: number, uri: string, onRemove: () => void }) => {
    return <View style={[style.container, { marginRight: 12, overflow: 'hidden' }]}>
        <ImageElement width={size} height={size} sourceURL={uri} />
        <View style={{ position: 'absolute', top: 12, right: 12 }}>
            <IconButton onPress={onRemove} size={24} backgroundColor={'black'} iconSize={12} color={'white'}
                icon={'small_delete'} />
        </View>
        <View style={{ position: 'absolute', bottom: 12, left: 0, right: 0, alignItems: 'center' }}>
            <View style={{
                backgroundColor: applyOpacity('#000000', 0.8),
                height: 24,
                paddingHorizontal: 12,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 12
            }}>
                <Text style={[Typography.description, { color: 'white' }]}>{`${index + 1}/${MAX_NUMBER_OF_ASSETS}`}</Text>
            </View>
        </View>
    </View>
}

const UploadSpace = ({ onPress }: { onPress: () => void }) => {

    return <Ripple onPress={onPress}
        style={[style.container, { marginRight: 28, alignItems: 'center', justifyContent: 'center' }]}>
        <Image source={require('assets/images/fontable/add_outline.png')} />
        <View style={{ height: 12 }} />
        <Text style={[Typography.name_button, {
            color: Colors.text,
            width: 100,
            textAlign: 'center'
        }]}>{`Upload tối đa ${MAX_NUMBER_OF_ASSETS} ảnh`}</Text>
    </Ripple>
}

const style = StyleSheet.create({
    container: {
        width: size, height: size, borderRadius: 8, backgroundColor: Colors.background
    }
})