import { PickType, postPickResult } from "_api";
import { StyleSummaryPopUp } from "scenes/pick/pickResult/MyStyleSummary";
import React from "react";
import { useActions } from "utils/hooks/useActions";
import { useNavigation } from "@react-navigation/native";
import { HandledError } from "error";
import { ButtonType } from "components/button/Button";
import {sleep} from "_helper";
import {PickAnalysisRouteSetting} from "routes/pick/pick.route";
import {useNavigator} from "services/navigation/navigation.service";

export const useAnalyzePick = ({
    picks,
    retry,
    type
}: { retry: () => void, picks: { pick_id: number }[], type: PickType }) => {
    const { showDialog } = useActions();
    const navigation = useNavigation();
    const navigator = useNavigator();
    const submit = async () => {
        try {
            const result = await postPickResult({ type, picks });
            // set delay as request from Yeri
            await sleep(1200);
            navigator.navigate(new PickAnalysisRouteSetting({data:result, type}), true);
        } catch (e) {
            const error = new HandledError({
                error: e as Error,
                stack: 'useAnalyzePick.submit',
            });
            showDialog({
                title: 'Đã xảy ra lỗi',
                description: error.friendlyMessage,
                actions: [
                    {
                        text: 'Thử lại', onPress: () => {
                            retry();
                        }
                    },
                    {
                        type: ButtonType.flat,
                        text: 'Thoát', onPress: () => {
                            navigation.goBack();
                        }
                    }
                ]
            })
        }
    }

    return submit;
}