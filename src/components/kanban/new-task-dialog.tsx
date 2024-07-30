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

export default function NewTaskDialog() {
  const [open, setOpen] = useState(false);
  const addTask = useTaskStore((state) => state.addTask);

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
    const { title, description } = Object.fromEntries(formData);
    if (typeof title !== 'string' || typeof description !== 'string') return;
    addTask(title, description);
    handleClose();
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        size="small"
        className="mx-2"
      >
        ＋ Add New Todo
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Todo</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <DialogContentText>
              What do you want to get done today?
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="title"
              name="title"
              label="Todo title"
              type="text"
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              id="description"
              name="description"
              label="Description"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add Todo</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}