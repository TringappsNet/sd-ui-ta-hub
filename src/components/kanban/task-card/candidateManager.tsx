import React, { useState } from 'react';
import { Box, Grid, List, ListItem, ListItemAvatar, ListItemText, Avatar, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ConversationHistory from './history';

const CandidateManager = ({ candidates, conversations }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const handleCandidateClick = (candidate) => {
    setSelectedCandidate(candidate);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <List>
          {candidates.map((candidate) => (
            <ListItem
              key={candidate.id}
              button
              onClick={() => handleCandidateClick(candidate)}
              secondaryAction={
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: candidate.color }}>{candidate.name[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={candidate.name}
                secondary={`Role: ${candidate.role}`}
              />
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid item xs={8}>
        {selectedCandidate && (
          <ConversationHistory
            candidate={selectedCandidate}
            conversations={conversations[selectedCandidate.id]}
            onBack={() => setSelectedCandidate(null)}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default CandidateManager;