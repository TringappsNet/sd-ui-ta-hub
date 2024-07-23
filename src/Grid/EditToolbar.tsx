import {  GridToolbarContainer } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { randomId } from '@mui/x-data-grid-generator';
import {backend_url} from '../constants/app_constants'
import React from 'react';

export default 
function EditToolbar(props) {
    const { setRows, setRowModesModel, dispatch, apiEndpoint } = props;

    const handleClick = async () => {
        const id = randomId();
        const newEmptyRow = { id, name: '', age: '', isNew: true };

        setRows((oldRows) => [...oldRows, newEmptyRow]);


        try {
            const response = await fetch(`${backend_url}/api/users/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEmptyRow),
            });

            if (!response.ok) {
                throw new Error('Failed to add new record on the server');
            }

            console.log('New record added successfully');
        } catch (error) {
            console.error('Error adding new record:', error);
        }
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add record
            </Button>
        </GridToolbarContainer>
    );
}
