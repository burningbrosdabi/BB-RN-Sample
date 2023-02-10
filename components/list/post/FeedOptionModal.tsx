import { Modal, ModalRef } from "components/modal/modal";
import React, { createContext, ForwardedRef, forwardRef } from 'react';

export const ModalContext = createContext<ModalRef>(
    {
        open: () => {/**/
        },
        close: () => {/**/
        }
    }
)

type Props = {
    children: JSX.Element | JSX.Element[]
}

export const FeedOptionModal = forwardRef(({ children }: Props, ref: ForwardedRef<ModalRef>) => {
    {
        return <Modal ref={ref}>
            {children}
        </Modal>
    }
})