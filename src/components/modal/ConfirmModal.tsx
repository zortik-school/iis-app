import {useConfirmModal} from "./ConfirmModalContext.tsx";
import {Modal, ModalClose, ModalDialog, Typography, Box, Button} from "@mui/joy";

export const ConfirmModal = () => {
    const {question, clearQuestion} = useConfirmModal();

    const handleConfirm = () => {
        if (question && question.onConfirm) {
            handleClose();

            question.onConfirm();
        }
    }

    const handleClose = () => {
        clearQuestion();
    }

    if (!question) {
        // No question to display at the moment
        return null;
    }

    return (
        <Modal
            open={true}
            aria-labelledby="confirm-modal-title"
            aria-describedby="confirm-modal-description"
            onClose={handleClose}
        >
            <ModalDialog
                layout="center"
            >
                <ModalClose />

                <Typography>{question.title}</Typography>
                <Typography>{question.message}</Typography>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 1,
                        mt: 2,
                    }}
                >
                    <Button variant="solid" onClick={handleConfirm}>Confirm</Button>
                    <Button variant="outlined" onClick={handleClose}>Cancel</Button>
                </Box>
            </ModalDialog>
        </Modal>
    )
}