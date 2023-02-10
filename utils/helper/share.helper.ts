// import CameraRoll from '@react-native-community/cameraroll';
// import {ShareDialog} from 'react-native-fbsdk-next';
// import Share from 'react-native-share';
// import ViewShot, {captureRef} from 'react-native-view-shot';
// import {Linking, Platform} from 'react-native';
// import {ReactInstance, RefObject} from "react";
// import {ShareContent} from "react-native-fbsdk-next/types/models/FBShareContent";

// // TODO: refacoring native share module
// // "@react-native-social-share/instagram": "file:node_modules_custom/@react-native-social-share/instagram",
// // "@react-native-social-share/utils": "file:node_modules_custom/@react-native-social-share/utils",

// export const shareFacebook = async (viewShotRef: RefObject<any>) => {
//     try {
//         const photoUri = await captureRef(viewShotRef, {
//             format: 'jpg',
//             quality: 0.8,
//         })

//         const sharePhotoContent: ShareContent = {
//             contentType: 'photo',
//             photos: [{imageUrl: photoUri}],
//         };
//         const hasFBApp = await Linking.canOpenURL("fb://profile");

//         if(!hasFBApp) {
//             Linking.openURL(Platform.OS === 'ios' ?
//                 'itms-apps://itunes.apple.com/us/app/apple-store/id284882215?mt=8' :
//                 'market://details?id=com.facebook.katana')

//             throw new Error('Facebook App not installed');
//         }
//         await ShareDialog.show(sharePhotoContent)
//     } catch (e) {
//         throw e;
//     }
// };

// export const shareInstagram = async (viewShotRef) => {
//     ViewShot.captureRef(viewShotRef, {
//         format: 'jpg',
//         quality: 0.8,
//         result: 'base64'
//     }).then(
//         async (uri: string) => {
//             let urlString = 'data:image/jpeg;base64,' + uri;
//             try {
//                 // check app is installed or not
//                 let appUrl = "instagram://user";
//                 Linking.canOpenURL(appUrl).then(res => {
//                     if (!res) {
//                         Linking.openURL(Platform.OS == 'ios' ?
//                             'itms-apps://itunes.apple.com/us/app/apple-store/id389801252?mt=8' :
//                             'market://details?id=com.instagram.android')
//                     } else {
//                         const shareOptions = {
//                             title: "Share",
//                             message: "Share to",
//                             backgroundImage: urlString,
//                             url: urlString,
//                             stickerImage: urlString,
//                             backgroundBottomColor: '#fefefe',
//                             backgroundTopColor: '#906df4',
//                             social: Share.Social.INSTAGRAM,
//                             saveToFiles: false,
//                         };
//                         Share.shareSingle(shareOptions)
//                             .then(res => console.log(res))
//                             .catch(error => console.log(error))
//                     }
//                 })
//                     .catch(error => console.log(error))
//             } catch (error) {
//                 console.log(error);
//             }
//         },
//         (error) => console.log(error)
//     );
// };

// export const saveToPhotoAlbum = async (viewShotRef, onSuccess, onError) => {
//     ViewShot.captureRef(viewShotRef, {
//         format: 'jpg',
//         quality: 0.8,
//     }).then(
//         async (uri) => {
//             try {
//                 console.log(uri);
//                 await CameraRoll.save(uri);
//                 console.log(uri);
//                 onSuccess && onSuccess("Ảnh đã được lưu vào thư viện.")
//             } catch (error) {
//                 console.log(error);
//                 onError && onError("Yêu cầu truy cập vào thư viện ảnh bị từ chối.")
//             }
//         },
//         (error) => {
//             console.log(error);
//             onError && onError(error.message)
//         },
//     );
// };
