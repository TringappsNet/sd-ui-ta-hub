import React, { useState, useRef } from 'react';
import { Button, TextField, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Ellipsis} from 'lucide-react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useKanbanStore } from '../../lib/store';

export function ColumnActions({ title, id }) {
  const [name, setName] = useState(title);
  const [editDisable, setIsEditDisable] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const updateCol = useKanbanStore((state) => state.updateCol);
  const removeCol = useKanbanStore((state) => state.removeCol);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditDisable(!editDisable);
    updateCol(id, name);
    setToastMessage(`${title} updated to ${name}`);
    setShowToast(true);
  };

  const handleDelete = () => {
    setShowDeleteDialog(false);
    removeCol(id);
    setToastMessage('This column has been deleted.');
    setShowToast(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="d-flex align-items-center">
        <TextField
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={editDisable}
          inputRef={inputRef}
          defaultValue="Small"
          variant="standard"
          size="small"
        />
        {/* <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={handleClick}
        > */}
          <Ellipsis onClick={handleClick} className=''  style={{cursor: 'pointer'}}/>
        {/* </Button> */}
      </form>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => {
          setIsEditDisable(!editDisable);
          handleClose();
          setTimeout(() => inputRef.current?.focus(), 100);
        }}>
          Rename
        </MenuItem>
        <MenuItem onClick={() => {
          setShowDeleteDialog(true);
          handleClose();
        }} style={{ color: 'red' }}>
          Delete Section
        </MenuItem>
      </Menu>

      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      >
        <DialogTitle>
          Are you sure you want to delete column?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            NOTE: All tasks related to this category will also be deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      <ToastContainer position="top-end">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}