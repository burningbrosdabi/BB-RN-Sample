import { createContext } from "react";
import { feedbackOrderingList, OrderingInterface } from "utils/data";

type IFeedbackContext = {
    orderingType: OrderingInterface,
    setOrder: (value: OrderingInterface) => void,
    openModal: () => void
}


export const FeedbackContext = createContext<IFeedbackContext>({
    orderingType: feedbackOrderingList[0],
    openModal: () => {/**/
    },
    setOrder: (value) => {/**/
    },
})