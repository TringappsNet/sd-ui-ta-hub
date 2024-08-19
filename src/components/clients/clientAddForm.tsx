import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import { useClientStore } from "../../lib/clientStore";


export default function ClientAddForm({openAddForm,setOpenAddForm}){
    const { getClients, addClient } = useClientStore();
    const [snackbar, setSnackbar] = useState({ open: false, message: '', variant: 'success' });
    // const [rows, setRows] = React.useState(clients);

    const [newClient, setNewClient] = useState({
        clientId: 0,
        clientName: '',
        clientSpocName: '',
        clientSpocContact: '',
        clientLocation: '',
        createdAt: new Date(Date.now()),
        lastUpdated: new Date(Date.now()),
        jobTitle: 'fkdnf',
    });
    const handleCloseAddForm = () => {
        setOpenAddForm(false);
        getClients();
        setNewClient({
            clientId: 0,
            clientName: '',
            clientSpocName: '',
            clientSpocContact: '',
            clientLocation: '',
            createdAt: new Date(Date.now()),
            lastUpdated: new Date(Date.now()),
            jobTitle: '',
        });
    };
    const areAllFieldsFilled = () => {
        return Object.values(newClient).every(value => value !== '');
    };
    const showSnackbar = (message, variant) => {
        setSnackbar({ open: true, message, variant });
    };
    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewClient((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async () => {
        if (!areAllFieldsFilled()) {
          showSnackbar('Please fill all the fields', 'error');
          
          return;
        } 
        
        try {
            const addedClient = await addClient(newClient);
            getClients();
            // setRows((prevRows) => [...prevRows, addedClient]);
            handleCloseAddForm();
            showSnackbar('Client added successfully', 'success');
        } catch (error) {
            console.error("Error adding client:", error);
            showSnackbar('Error adding client', 'error');
        }
      };
    return (
        <>
            <Dialog open={openAddForm} onClose={handleCloseAddForm}>
                <DialogTitle>Add New Client</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="clientName"
                        label="Client Name"
                        style={{ width: '250px' }}
                        type="text"
                        variant="outlined"
                        value={newClient.clientName}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Client SPOC Name"
                        name="clientSpocName"
                        type="text"
                        variant="outlined"
                        InputLabelProps={{
                          style: { paddingLeft: '25px' }, 
                      }}
                        style={{ paddingLeft: '20px', width: '300px' }}
                        value={newClient.clientSpocName}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Client SPOC Contact"
                        name="clientSpocContact"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={newClient.clientSpocContact}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="clientLocation"
                        label="Client Location"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newClient.clientLocation}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddForm}>Cancel</Button>
                    <Button onClick={handleSubmit}>Add</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}