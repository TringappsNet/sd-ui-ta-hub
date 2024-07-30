import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@mui/material';
import { useTaskStore } from '../../lib/store';

export default function NewSectionDialog() {
  const [open, setOpen] = useState(false);
  const addCol = useTaskStore((state) => state.addCol);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const { title } = Object.fromEntries(formData);
    if (typeof title !== 'string') return;
    addCol(title);
    handleClose();
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        className="w-100"
        size="large"
      >
        ＋ Add New Section
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Section</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <DialogContentText>
              What section do you want to add today?
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="title"
              name="title"
              label="Section title"
              type="text"
              fullWidth
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add Section</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}