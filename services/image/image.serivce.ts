import { Asset, launchImageLibrary, PhotoQuality } from "react-native-image-picker";
import { openPermissionsDialog } from "_helper";
import { Completer } from "services/remote.config";

export const selectImage = ({ size = 960, quality = 0.9, selectionLimit = 10 }: { size?: number; quality?: PhotoQuality; selectionLimit?: number }): Promise<Asset[] | undefined> => {
    const completer = new Completer<Asset[] | undefined>();
    launchImageLibrary({
        quality,
        mediaType: 'photo',
        selectionLimit,
        includeBase64: true,
        maxHeight: size,
        maxWidth: size,

    }, res => {
        if (res.didCancel) {
            return
        }
        if (res.errorCode) {
            // camera_unavailable	camera not available on device || permission	Permission not satisfied || others	other errors (check errorMessage for description)
            openPermissionsDialog("Yêu cầu truy cập vào thư viện ảnh bị từ chối.");
            completer.reject(new Error(res.errorMessage));
        } else {
            completer.complete(res.assets);
        }
    })
    return completer.promise;
}