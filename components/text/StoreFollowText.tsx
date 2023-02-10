import React, {useEffect, useState} from "react";
import {storeLikeController} from "services/user";
import {Text} from "react-native";
import {Colors, Typography} from "styles";

export const FollowCount = ({pk, initialCount}: { pk: number; initialCount: number }) => {
    const [count, setCount] = useState(initialCount);

    useEffect(() => {
        const subscription = storeLikeController.stream
            .subscribe((value) => {
                if (value.pk !== pk) return;
                const is_following = value.is_following;
                setCount(Math.max(count + (is_following ? 1 : -1), 0));
            })

        return () => {
            subscription.unsubscribe();
        }
    }, [count]);

    return <Text style={[Typography.body, {color: Colors.text}]}>{`${count} người theo dõi`}</Text>;
};