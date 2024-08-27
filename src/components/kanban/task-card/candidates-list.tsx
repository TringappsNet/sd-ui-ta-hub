import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { useEffect, useState } from "react";
import {useCandidateStore} from '../../../lib/candidateStore';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {Trash2} from 'lucide-react'
import ConversationHistory from "./history";

export default function CandidatesList({open, anchorEl, setAnchorEl}){
    const {candidates} = useCandidateStore();
    const boxColors = ['#10a37f', '#00ff0a', '#0066ff'];
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const handleClose = (event) =>{
        event.preventDefault();
        event.stopPropagation();
        setAnchorEl(null);

    }
    const handleClick = (e, candidate)=>{
        e.preventDefault();
        e.stopPropagation();
        console.log("clicked")
        setSelectedCandidate(candidate);

    }
    const handleDeleteClick = (e)=>{
        e.preventDefault();
        e.stopPropagation();    
        console.log("delete clicked")
    }
    const conversationsData = {
        3: [
          {
            sender: "Vijay",
            role: "Senior HR",
            avatar: "/path/to/vijay-avatar.jpg",
            message: "Hello! Thank you for your interest in the Business Analyst position. I'm pleased to inform you that you've successfully passed the initial interview stage.",
            time: "7 hours ago"
          },
          {
            sender: "Vijay",
            role: "Senior HR",
            avatar: "/path/to/vijay-avatar.jpg",
            message: "The next step is the technical assessment. This assessment will evaluate your skills in data analysis, problem-solving, and business acumen.",
            time: "2 hours ago"
          },
        ],
      };
    return (
        <>
        <div>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={(e)=> handleClose(e)}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          sx={{
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            minWidth: '30%',
            maxWidth: '60%',
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
            {candidates && candidates.map((candidate, index)=>{
                const itemColor = boxColors[index % boxColors.length];
                return <MenuItem key={candidate.candidateId} onClick={(e) => handleClick(e, 3)} 
                sx={{
                    padding: '5px 5px',
                    position: 'relative',
                    '&:hover': {
                        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                        '&::before, &::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        width: '4px',
                        backgroundColor: itemColor,
                    },
                    '&::before': {
                        left: 0,
                    },
                    '&::after': {
                        right: 0,
                    }
                    }
                }}
                >
                    <Box className="d-flex flex-row justify-content-center align-items-center py-0 px-2 w-full" sx={{width: '100%'}}>
                        
                        <div className="me-auto">
                            <div className="d-flex ">
                                <div className="d-flex justify-content-center align-items-center">
                                    <Box className="rounded-circle border text-center " style={{width: '30px', height: '30px', marginRight: '10px', backgroundColor: itemColor, }}> 
                                        <div className="pt-1">{candidate.candidateName.substring(0,1).toUpperCase()}</div>
                                    </Box>
                                </div>
                                
                                <div className="d-flex flex-column ">
                                    <div className="p-0 ralewayFontRegular " style={{fontSize: 15}}>{candidate.candidateName}</div>
                                    <div className="poppins-thin p-0 text-wrap">{candidate.technology}</div>
                                </div>

                                
                            </div>
                        </div>
                        
                        <div className="">
                            <div className="d-flex justify-content-center align-items-center px-3">
                                <Trash2 size={18} onClick={handleDeleteClick}/>
                            </div>
                        </div>

                        
                    </Box>    
                </MenuItem>
            })}
            {
                candidates.length == 0 && <MenuItem onClick={(e) => handleClick(e, '')}>No Candidates</MenuItem>
            }
        </Menu>
        {selectedCandidate && (
        <ConversationHistory
          candidate={selectedCandidate}
          conversations={conversationsData[selectedCandidate] || []}
        />
        )}
        </div>
        </>
    )
}