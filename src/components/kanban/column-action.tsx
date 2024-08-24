import React, { useState, useRef, useEffect } from 'react';
import { Button, TextField, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {  EllipsisVertical} from 'lucide-react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useTaskStore } from '../../lib/store';
import { primary_board } from '../../constants/app_constants';

export function ColumnActions({ title, id }) {
  const [name, setName] = useState(title);
  const [editDisable, setIsEditDisable] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const updateCol = useTaskStore((state) => state.updateCol);
  const removeCol = useTaskStore((state) => state.removeCol);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    const handleBlur = () => {
      setIsEditDisable(true);
    };
  
    document.addEventListener('blur', handleBlur);
  
    return () => {
      document.removeEventListener('blur', handleBlur);
    };
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditDisable(!editDisable);
    updateCol(id, name);
    setToastMessage(`${title} updated to ${name}`);
    setShowToast(true);
  };

  const handleDelete = async () => {
    setShowDeleteDialog(false);
    await removeCol(id);
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
          // defaultValue="Small"
          className='ralewayFont'
          variant="standard"
          size="small"
          sx={{ 
            '& .MuiInputBase-input':{
              color: 'black',
            },
            
            '& .Mui-disabled':{
              color: 'black !important',
              '-webkit-text-fill-color': 'black',
            },
            '& .MuiInput-input':{
              color: 'black !important',
            }
           }}
        />
        {/* <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={handleClick}
        > */}
          <EllipsisVertical onClick={handleClick} className=''  style={{cursor: 'pointer'}}/>
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
        { id != primary_board && <MenuItem onClick={() => {
          setShowDeleteDialog(true);
          handleClose();
        }} style={{ color: 'red' }}>
          Delete Section
        </MenuItem>}
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