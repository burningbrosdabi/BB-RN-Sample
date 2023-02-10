import { DabiFont } from 'assets/icons'
import { toast } from 'components/alert/toast'
import { isNil } from 'lodash'
import { RelatedProduct } from 'model/product/related.product'
import React from 'react'
import { View, Text, Linking } from 'react-native'
import Ripple from 'react-native-material-ripple'
import { ProductDetailRouteSetting } from 'routes'
import { createAffiliateLog } from 'services/api'
import { NavigationService } from 'services/navigation'
import { applyOpacity, Colors, Typography } from 'styles'
import { postMessageToChannel } from 'utils/helper'

const FeedProductTag = ({ data }: { data: RelatedProduct }) => {

    const { out_link, affiliate_link, name, store, size, pk, product_pk, pinned_direction = 1, extra_option, color } = data
    let pinStyle = {}
    let boxPosition = {}
    switch (pinned_direction) {
        case 1: //TopLeft
            pinStyle = {
                position: 'absolute',
                width: 0,
                height: 0,
                left: -8,
                top: -8,
                borderLeftWidth: 8,
                borderBottomWidth: 8,
                borderTopWidth: 8,
                borderBottomColor: "transparent",
                borderTopColor: "transparent",
                borderLeftColor: applyOpacity(Colors.white, 0.93),
            }
            boxPosition = { right: 126 + 8, bottom: 36 }
            break
        case 2:
            pinStyle = {
                position: 'absolute',
                bottom: 63 + 8,
                left: -8,
                width: 0,
                height: 0,
                borderLeftWidth: 8,
                borderRightWidth: 8,
                borderTopWidth: 8,
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderTopColor: applyOpacity(Colors.white, 0.93),
            }
            boxPosition = { right: 63, bottom: 71 + 8 }
            break

        case 3:
            pinStyle = {
                position: 'absolute',
                top: -8,
                left: 0,
                width: 0,
                height: 0,
                borderRightWidth: 8,
                borderBottomWidth: 8,
                borderTopWidth: 8,
                borderBottomColor: "transparent",
                borderTopColor: "transparent",
                borderRightColor: applyOpacity(Colors.white, 0.93),
            }
            boxPosition = { left: 8, bottom: 36 }
            break
        case 4:
            pinStyle = {
                position: 'absolute',
                top: 0,
                left: -8,
                width: 0,
                height: 0,
                borderLeftWidth: 8,
                borderRightWidth: 8,
                borderBottomWidth: 8,
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderBottomColor: applyOpacity(Colors.white, 0.93),
            }
            boxPosition = { right: 63, top: 8 }

            break
        default:
            pinStyle = {
                position: 'absolute',
                width: 0,
                height: 0,
                left: -8,
                top: -8,
                borderLeftWidth: 8,
                borderBottomWidth: 8,
                borderTopWidth: 8,
                borderBottomColor: "transparent",
                borderTopColor: "transparent",
                borderLeftColor: applyOpacity(Colors.white, 0.93),
            }
            boxPosition = { right: 126 + 8, bottom: 36 }
    }

    const onPress = () => {
        // if (product_pk) {
        //     const routeSetting = new ProductDetailRouteSetting({ productPk: product_pk });
        //     NavigationService.instance.navigate(routeSetting);

        // } else {
        if (isNil(affiliate_link) && isNil(out_link)) {
            toast('Đường dẫn đến sản phẩm không tồn tại!\nXin lỗi bạn vì sự cố này, chúng tôi sẽ khắc phục lỗi này một cách nhanh nhất.')
            postMessageToChannel({
                message: `Error with affiliate link. product_pk:${pk}`,
                channel: 'product_sentry_log'
            })
            return
        }
        Linking.openURL(affiliate_link ?? out_link).then(
            async () =>
                await createAffiliateLog({ pk: pk })
        ).catch(() => {
            toast('Đường dẫn đến sản phẩm không tồn tại!\nXin lỗi bạn vì sự cố này, chúng tôi sẽ khắc phục lỗi này một cách nhanh nhất.')
            postMessageToChannel({
                message: `Error with affiliate link. product_pk:${pk}`,
                channel: 'product_sentry_log'
            })
        }
        )
        // }
    }

    return <View>
        <View style={pinStyle}></View>
        <View style={{ backgroundColor: applyOpacity(Colors.white, 0.93), borderRadius: 8, width: 126, ...boxPosition, }}>
            <Ripple onPress={onPress} style={{ padding: 12, }} rippleContainerBorderRadius={8}>
                <Text style={Typography.mark} numberOfLines={1}>{store}</Text>
                <Text style={Typography.description} numberOfLines={1}>{name}</Text>
                <Text style={{ ...Typography.description, color: Colors.red, paddingRight: 12 }} numberOfLines={1}>{size ? 'Size ' + size : (extra_option ?? color)}</Text>
                <View style={{ position: 'absolute', right: 12, bottom: 12 }}>
                    <DabiFont
                        size={12}
                        color={Colors.component}
                        name={
                            'small_arrow_right'
                        } />
                </View>
            </Ripple>
        </View>
    </View>
}

export default FeedProductTag