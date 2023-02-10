import { Subject } from "rxjs";
import { useActions } from "utils/hooks/useActions";
import { useTypedSelector } from "utils/hooks/useTypedSelector";
import { useCallback, useEffect, useRef, useState } from "react";
import { debounceTime, distinctUntilChanged, filter } from "rxjs/operators";
import { AuthDialog } from "components/alert/dialog";
import { toast } from "components/alert/toast";
import { FavoriteController } from "services/user";

export const useFavoriteButton = <T extends { pk: number }>(
    {
        pk,
        controller,
        // toastMessage = { marked: '', unmarked: '' },
        prepare
    }: {
        pk: number,
        controller: FavoriteController<T>,
        // toastMessage?: { marked: string, unmarked: string },
        prepare: (value: boolean) => T
    }) => {

    const { showDialog } = useActions();
    const isLogined = useTypedSelector(state => state.auth.isLoggedIn);
    const [marked, setMarked] = useState((controller.repo[pk] ?? false) && isLogined);
    const btnPressStream = useRef(new Subject<boolean>()).current;

    useEffect(() => {
        const btnSubscription = btnPressStream.subscribe((value) => {
            controller.stream.next(prepare(value))
        })


        return () => {
            btnSubscription.unsubscribe();

        }
    }, [])

    useEffect(() => {
        if (!isLogined) {
            setMarked(false);
        }
    }, [isLogined])

    useEffect(() => {
        const subscription = controller.stream.pipe(
            filter((data: T): boolean => {
                return data.pk === pk && controller.valueExtractor(data) !== marked
            }
            ))
            .subscribe((value) => {
                setMarked(controller.valueExtractor(value));
            })

        return () => {
            subscription.unsubscribe();
        }
    }, [marked])

    const onPress = useCallback(() => {
        if (!isLogined) {
            showDialog(AuthDialog)
            return;
        }
        const next = !marked;
        // toast(next ? toastMessage.marked : toastMessage.unmarked)
        btnPressStream.next(next)
        setMarked(next)
        controller.repo[pk] = next;
    }, [isLogined, marked])

    return {
        marked,
        onPress
    }
}