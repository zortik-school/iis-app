import {createContext, useContext} from "react";

export interface Question {
    title: string;
    message: string;
    /**
     * Callback invoked when the user confirms the action.
     */
    onConfirm: () => void;
}

export interface ConfirmModalContextData {
    /**
     * The current question.
     */
    question?: Question;
    /**
     * Sets a new question to be displayed in the confirmation modal.
     *
     * @param question The question to set.
     */
    setQuestion: (question: Question) => void;
    /**
     * Clears the current question.
     */
    clearQuestion: () => void;
}

const createDefaultContextData = (): ConfirmModalContextData => {
    return {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        setQuestion: (_question: Question) => {
            throw new Error("Not implemented");
        },
        clearQuestion: () => {
            throw new Error("Not implemented");
        }
    }
}

export const ConfirmModalContext = createContext<ConfirmModalContextData>(createDefaultContextData());

export const useConfirmModal = () => {
    return useContext(ConfirmModalContext);
}