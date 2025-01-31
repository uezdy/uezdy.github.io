'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TelegramIcon from "@mui/icons-material/Telegram";

export default function OriginalModal({children}: any) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <span onClick={handleOpen}><TelegramIcon /></span>
            <Modal
                open={open}
                className="original-message-modal"
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="original-message-modal-box">
                    {children}
                </Box>
            </Modal>
        </div>
    );
}
