import React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const ConversationHistory = ({ candidate, conversations }) => {
  if (!candidate) return null;

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <Avatar sx={{ bgcolor: candidate.color, marginRight: 1 }}>
          {candidate.name.charAt(0)}
        </Avatar>
        <Typography variant="h6">{candidate.name}</Typography>
        <Typography variant="body2" sx={{ marginLeft: 'auto' }}>
          On Hold
        </Typography>
      </Box>
      {conversations.map((conversation, index) => (
        <Box key={index} sx={{ marginBottom: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
            <Avatar src={conversation.avatar} sx={{ marginRight: 1 }} />
            <Typography variant="subtitle1">{conversation.sender}</Typography>
            <Typography variant="body2" sx={{ marginLeft: 1 }}>
              {conversation.role}
            </Typography>
            <Typography variant="caption" sx={{ marginLeft: 'auto' }}>
              {conversation.time}
            </Typography>
          </Box>
          <Typography variant="body1">{conversation.message}</Typography>
        </Box>
      ))}
      <Box sx={{ marginTop: 2 }}>
        <Typography variant="body2">Add Comment</Typography>
      </Box>
    </Box>
  );
};

export default ConversationHistory;