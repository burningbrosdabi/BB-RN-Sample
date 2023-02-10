import { ProductColors, StyleKey } from "utils/data";
import { ImageRequireSource } from "react-native";

export const combiMap: { [key in StyleKey]: { goodCombi: StyleKey, badCombi: StyleKey } } = {
    [StyleKey.street]: {
        goodCombi: StyleKey.sexy,
        badCombi: StyleKey.feminine,
    },
    [StyleKey.simple]: {
        goodCombi: StyleKey.street,
        badCombi: StyleKey.sexy
    },
    [StyleKey.sexy]: {
        goodCombi: StyleKey.street,
        badCombi: StyleKey.simple
    },
    [StyleKey.lovely]: {
        goodCombi: StyleKey.sexy,
        badCombi: StyleKey.office
    },
    [StyleKey.feminine]: {
        goodCombi: StyleKey.office,
        badCombi: StyleKey.street,
    },
    [StyleKey.office]: {
        goodCombi: StyleKey.simple,
        badCombi: StyleKey.lovely,
    },
}

export const styleMiniImageMap: { [key in StyleKey]: ImageRequireSource } = {
    street: require('assets/images/pick/mini_style/small_street.png'),
    simple: require('assets/images/pick/mini_style/small_simple.png'),
    sexy: require('assets/images/pick/mini_style/small_sexy.png'),
    lovely: require('assets/images/pick/mini_style/small_lovely.png'),
    feminine: require('assets/images/pick/mini_style/small_feminine.png'),
    office: require('assets/images/pick/mini_style/small_office.png'),
}


export const combiImageMap: { [key in StyleKey]: ImageRequireSource } = {
    street: require('assets/images/pick/summary/result_street_combi.png'),
    simple: require('assets/images/pick/summary/result_simple_combi.png'),
    sexy: require('assets/images/pick/summary/result_sexy_combi.png'),
    lovely: require('assets/images/pick/summary/result_lovely_combi.png'),
    feminine: require('assets/images/pick/summary/result_feminine_combi.png'),
    office: require('assets/images/pick/summary/result_office_combi.png'),
}

export const styleImageMap: { [key in StyleKey]: ImageRequireSource } = {
    street: require('assets/images/pick/summary/result_street.png'),
    simple: require('assets/images/pick/summary/result_simple.png'),
    sexy: require('assets/images/pick/summary/result_sexy.png'),
    lovely: require('assets/images/pick/summary/result_lovely.png'),
    feminine: require('assets/images/pick/summary/result_feminine.png'),
    office: require('assets/images/pick/summary/result_office.png'),
}

export const styleContentMap: { [key in StyleKey]: { title: string, description: string } } = {
    street: {
        title: 'Phong cách của bạn là Đường phố đó!',
        description: '“Bởi mọi người sẽ nhìn chằm chằm, hãy làm họ thoả mãn.” Tự tin khoe cá tính và phong cách thời trang chất lừ, đừng sợ hãi nhé nàng ơi!'
    },
    simple: {
        title: 'Đơn giản chính là phong cách của bạn!',
        description: '“Đừng chạy theo xu hướng. Đừng khiến bản thân lệ thuộc vào thời trang. Hãy để chính mình là người quyết định bản thân sẽ mặc gì cũng như sẽ sống ra sao.” Đơn giản chính là điểm nhấn cho cả một cá tính.'
    },
    sexy: {
        title: 'Gợi cảm chính là phong cách của bạn!',
        description: 'Khi hoài nghi, hãy mặc màu đỏ.” Hãy cho họ thấy bạn có gì và bạn sẽ sống cuộc đời mình muốn ra sao với phong cách rất riêng của chính bản thân!',
    },
    lovely: {
        title: 'Phong cách Đáng yêu dành cho bạn nè!',
        description: '“Phong cách là một phương thức để nói lên bạn là ai mà không khiến bạn tốn một lời.” Đáng yêu bên ngoài, ngọt ngào bên trong, hãy sống như một đóa hoa xinh đẹp nè cô gái ơi!'
    },
    feminine: {
        title: 'Phong cách của bạn là Nữ tính nha!',
        description: 'Coco Chanel đã từng nói: “Để không ai có thể thay thế, bạn phải luôn luôn khác biệt.” Thế nên, đừng bao giờ nghĩ rằng vừa nữ tính vừa độc đáo là không thể nha!'
    },
    office: {
        title: 'Phong cách của bạn là Công sở đó!',
        description: '“Tao nhã chính là sự tinh giản.” Đừng ngần ngại hay lo lắng, cứ là chính bạn với phong cách mà mình yêu thích, vì chúng ta chỉ sống một lần thôi!'
    },

}


type AnalysisData = {
    name: StyleKey,
    display_name: string,
    color: ProductColors,
    point: number,
    image: ImageRequireSource,

    description: string,
    goodCombi: 'street', // Need to make it dynamic with iamge
    badCombi: 'feminine', // Need to make it dynamic with iamge
    stylePoint: {
        street: 50,
        lovely: 24,
        simple: 50,
        feminine: 80,
        sexy: 99,
        office: 10
    }
}