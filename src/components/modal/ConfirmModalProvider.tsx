import {ConfirmModalContext, type ConfirmModalContextData, type Question} from "./ConfirmModalContext.tsx";
import {type PropsWithChildren, useState} from "react";

export type ConfirmModalProviderProps = PropsWithChildren;

export const ConfirmModalProvider = (
    {children}: ConfirmModalProviderProps
) => {
    const [question, setQuestion] = useState<Question|undefined>(undefined);

    const data: ConfirmModalContextData = {
        question,
        setQuestion: (newQuestion) => setQuestion(newQuestion),
        clearQuestion: () => setQuestion(undefined),
    };
    return (
        <ConfirmModalContext.Provider value={data}>
            {children}
        </ConfirmModalContext.Provider>
    )
}