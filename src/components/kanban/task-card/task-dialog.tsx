import React, { Dispatch, useRef, useState } from "react";
import { Task } from "../../../constants/types";
import './index.css';
import Button from '@mui/material/Button';
import {X, Paperclip, ChevronDown} from 'lucide-react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Box, DialogContent, Link, TextField } from "@mui/material";
import CandidatesList from "./candidates-list";
import { useTaskStore } from "../../../lib/store";
import {useCandidateStore} from '../../../lib/candidateStore';


interface TaskDialogProps {
    task: Task;
    open: boolean;
    setOpen: Dispatch<boolean>;
}

export default function TaskDialog({open, setOpen, task}: TaskDialogProps){
  const {getCandidates} = useCandidateStore();
  const [description, setDescription] = useState(task.description);
  const inputRef = useRef<HTMLInputElement>(null);
  const [editDisable, setIsEditDisable] = useState(true);
  const updateTask = useTaskStore((state) => state.updateTask);
  const [candidateAnchorEl, setCandidateAnchorEl] = React.useState<null | HTMLElement>(null);
  const openCandidates = Boolean(candidateAnchorEl);
  const handleClickCandidates = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    getCandidates();
    setCandidateAnchorEl(event.currentTarget);
  }
  const handleDoubleClick = () => {
    setIsEditDisable(false);
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };
    const handleSubmit = (e) => {
      if (e) e.preventDefault();
      setIsEditDisable(!editDisable);
      task.description = description
      updateTask(task.taskId, task);
    };
    const handleClose = () => {
        setOpen(false);
      };
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    };
  
    const handleBlur = (e) => {
      handleSubmit(e);
    };
    
    
    return (
      <>
        <Dialog open={open} onClose={handleClose}
          fullWidth= {true}
          maxWidth= 'xl'
          PaperProps={{
            sx: {
              height: '100%',
              maxHeight: '90%',
            }
          }}
        >
          <DialogContent
            sx={{
              // maxHeight: '800px',
              height: '100%',
            }}
          >

            <Box className="d-flex flex-row w-full h-full"
              sx={{
                height: '100%',
              }}
            >
              <Box className="me-auto pt-5 "
                sx={{
                  width: '100%',
                  maxHeight: '900px',
                  height: '100%',
                }}
              >
                <div className="ralewayFont60020 pb-2">Let work flow with kanban</div>
                <Button className="" variant="contained"
                 disableRipple
                sx={{
                  color: 'black',
                  backgroundColor: '#cce0ff',
                  textTransform: 'none',
                  '&:hover':{
                    backgroundColor: '#bfd8ff',
                  },
                }}>
                  <span>
                    <Paperclip size={16} style = {{transform: 'rotate(45deg)' }}/>
                  </span>
                  <span className="ps-2 ralewayFont">Attach</span>
                </Button>
                <div className="py-3 w-full">
                <Accordion className="w-full"
                  sx={{
                    '&.MuiAccordion-root': {
                      borderRadius: '4px',
                      overflow: 'hidden',
                      boxShadow: 'none',
                    },
                    '&::before': {
                      display: 'none',
                    },
                  }}
                >
                  <AccordionSummary
                    className="w-full"
                    expandIcon={<ChevronDown size={16}/>}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    sx={{
                      color: 'black',
                      backgroundColor: '#cce0ff',
                      '&:hover':{
                        backgroundColor: '#bfd8ff',
                      },
                      '& .MuiAccordionSummary-content': {
                        margin: '12px 0', // Add vertical padding to the summary content
                      },
                    }}
                  >
                    <div className="ralewayFontRegular" style={{fontWeight:'400', fontSize: 14}}>Description</div>
                  </AccordionSummary>
                  <Box sx={{ height: '8px', backgroundColor: 'white' }} /> {/* Gap */}
                  <AccordionDetails className="w-full" 
                    sx={{
                      padding: 0, // Remove default padding
                      backgroundColor: '#f1f2f4', // Light gray background for content
                      overflow: 'auto',
                      maxHeight: '160px',

                    }}
                  >
                    <div className="poppins-light overflow-auto">
                      <Box sx={{ padding: '16px', marginTop: '8px' }} className="poppins-light " onDoubleClick={handleDoubleClick}>
                      <form onSubmit={handleSubmit} className="d-flex align-items-center">
                        <TextField
                          // onDoubleClick={handleDoubleClick}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          disabled={editDisable}
                          inputRef={inputRef}
                          onKeyDown={handleKeyDown}
                          onBlur={handleBlur}
                          // defaultValue="Small"
                          className='poppins-light w-full'
                          id="outlined-multiline-static"
                          variant="standard"
                          InputProps={{
                            disableUnderline: true,
                          }}
                          multiline
                          sx={{ 
                            width: '100%',
                            border: '0px',
                            cursor: 'pointer',
                            '& .MuiInputBase-input':{
                              color: 'black !important',
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
                        
                      </form>
                        {/* {task.description} */}
                      </Box>
                    </div>
                  </AccordionDetails>
                </Accordion>
                <div className="px-3 py-2">
                  <div className="ralewayFontRegular " style={{ fontSize: 14}}>Activity</div>
                  <div className="d-flex flex-row py-1 poppins-light">
                    <div className="poppins-light pe-2">Show: </div>
                    <Link className="poppins-light px-2 text-dark"  underline="hover" 
                    sx={{
                      cursor: 'pointer',
                    }}
                    onClick={handleClickCandidates}
                    >
                      Candidates
                    </Link>
                    <CandidatesList open={openCandidates} anchorEl={candidateAnchorEl} setAnchorEl={setCandidateAnchorEl}/>
                    <Link className="poppins-light px-2 text-dark" underline="hover"
                    sx={{
                      cursor: 'pointer',
                    }}>
                      Task History
                    </Link>


                  </div>
                </div>
                </div>
              </Box>
              <div className="" >
                <div className="p-1">
                  <X onClick={handleClose} className="close "/>
                </div>

              </div> 

            </Box>
            </DialogContent>
        </Dialog>
      </>
    //     <div onClick={handleClickOutside}>
    //     <BootstrapDialog
    //     onClose={handleClose}
    //     aria-labelledby="customized-dialog-title"
    //     open={dialogOpen}
    //     >
    //     <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
    //       Modal title
    //     </DialogTitle>
    //     <IconButton
    //       aria-label="close"
    //       onClick={()=> setDialogOpen(false)}
    //       sx={{
    //         position: 'absolute',
    //         right: 8,
    //         top: 8,
    //         color: (theme) => theme.palette.grey[500],
    //       }}
    //     >
    //       <CloseIcon />
    //     </IconButton>
    //     <DialogContent dividers>
    //       <Typography gutterBottom>
    //         Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
    //         dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
    //         consectetur ac, vestibulum at eros.
    //       </Typography>
    //       <Typography gutterBottom>
    //         Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
    //         Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
    //       </Typography>
    //       <Typography gutterBottom>
    //         Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus
    //         magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec
    //         ullamcorper nulla non metus auctor fringilla.
    //       </Typography>
    //     </DialogContent>
    //     <DialogActions>
    //       <Button autoFocus onClick={handleClose}>
    //         Save changes
    //       </Button>
    //     </DialogActions>
    //   </BootstrapDialog>
    //   </div>
    )
}