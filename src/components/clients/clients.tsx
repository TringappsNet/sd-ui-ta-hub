import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import CustomSnackbar from "../../components/CustomSnackbar";
import {
    GridRowsProp,
    GridRowModesModel,
    GridRowModes,
    DataGrid,
    GridColDef,
    GridToolbarContainer,
    GridActionsCellItem,
    GridEventListener,
    GridRowId,
    GridRowModel,
    GridRowEditStopReasons,
    GridSlots,
  } from '@mui/x-data-grid';
  import Box from '@mui/material/Box';
  import {
    randomCreatedDate,
    randomTraderName,
    randomId,
    randomArrayItem,
  } from '@mui/x-data-grid-generator';
  import { useClientStore, Client } from "../../lib/clientStore";
import TextField from "@mui/material/TextField";
import { Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';
import ClientAddForm from "./clientAddForm";

export default function Clients(){
    const { clients, isLoading, isInitialized, getClients, updateClient, deleteClient, addClient } = useClientStore();
    const [searchText, setSearchText] = useState('');
    const [rows, setRows] = React.useState(clients);
    // type DeleteConfirmationState = {
    //   open: boolean;
    //   id: GridRowId | null;
    // };
    const [deleteConfirmation, setDeleteConfirmation] = useState<{open:boolean, id: number | null }>({ open: false, id: 0 });
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
    const [openAddForm, setOpenAddForm] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', variant: 'success' });
    const [newClient, setNewClient] = useState({
        clientName: '',
        clientSpocName: '',
        clientSpocContact: '',
        clientLocation: '',
    });
    useEffect(() => {
        if (!isInitialized) {
            getClients();
            setRows(clients);
        }
        else{
            setRows(clients)
        }
    }, [isInitialized, getClients, clients]);
    useEffect(() => {
      if (isInitialized) {
          const filteredRows = clients.filter(client =>
              Object.values(client).some(value =>
                  String(value).toLowerCase().includes(searchText.toLowerCase())
              )
          );
          setRows(filteredRows);
      }
  }, [searchText, isInitialized, clients]);
  
  const showSnackbar = (message, variant) => {
    setSnackbar({ open: true, message, variant });
  };
  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const handleAddClick = () => {
    setOpenAddForm(true);
  };
  const handleCloseAddForm = () => {
    setOpenAddForm(false);
    getClients();
    setNewClient({
        clientName: '',
        clientSpocName: '',
        clientSpocContact: '',
        clientLocation: '',
    });
};
  
const areAllFieldsFilled = () => {
  return Object.values(newClient).every(value => value !== '');
};

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    console.log("id",id);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };
  const handleDeleteClick = (id: GridRowId ) => () => {
    setDeleteConfirmation({ open: true, id: Number(id) });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmation.id) {
      try {
        deleteClient(deleteConfirmation.id as number);
        setRows(rows.filter((row) => row.clientId !== deleteConfirmation.id));
        showSnackbar('Client deleted successfully', 'success');
      } catch (error) {
        console.log(error);
        showSnackbar('Error deleting client', 'error');
      }
    }
    setDeleteConfirmation({ open: false, id: null });
  };
  
  const handleCancelDelete = () => {
    setDeleteConfirmation({ open: false, id: null });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const originalRow = rows.find((row) => row.clientId === id);
    if (originalRow) {
        setRows(rows.map((row) => 
        row.clientId === id ? { ...originalRow } : row
        ));
    }
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    try{
        // Find the original row
        const originalRow = rows.find((row) => row.clientId === newRow.clientId);
        const updatedRow = newRow as Client;
        console.log("updated Row", updatedRow);
        if (!originalRow) {
        console.error("Original row not found");
        return newRow; // Return newRow to avoid errors, but you might want to handle this case differently
        }
        // Check if there are any differences
        const hasChanges = Object.keys(newRow).some(key => newRow[key] !== originalRow[key]);
    
        if (!hasChanges) {
        console.log("No changes detected");
        return originalRow; // Return the original row if no changes
        }
    
        // If there are changes, proceed with the update
        const updatedCandidate = await updateClient(updatedRow)
        console.log("updatedCandidate",updatedCandidate)
    
        setRows(rows.map((row) => row.clientId === updatedCandidate.clientId ? updatedCandidate : row));
        showSnackbar('Client updated successfully', 'success');
        console.log("Row updated:", updatedCandidate);
        return updatedCandidate;
    }
    catch(error){
        console.error("Error updating row:", error);
        showSnackbar('Error updating client', 'error');
    }
    
  };
  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
};

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  const handleProcessRowUpdateError = (error: any) => {
    console.error("Error updating row:", error);
    // You can add more error handling logic here, like showing a snackbar or alert
  };

  const columns: GridColDef[] = [
    { field: 'clientId', headerName: 'Client Id', width: 240, editable: true, headerClassName: 'column-header'},
    { field: 'clientName',headerName: 'Client Name', width: 240, editable: true , headerClassName: 'column-header'},
    { field: 'clientSpocName',headerName: 'Client Spoc Name', width: 240, editable: true, headerClassName: 'column-header'},
    { field: 'clientSpocContact',headerName: 'client Spoc Contact', width: 240, editable: true , headerClassName: 'column-header'},
    { field: 'clientLocation',headerName: 'Client Location', width: 240, editable: true, headerClassName: 'column-header'},
    {
      field: 'actions',
      type: 'actions',
      headerClassName: 'column-header',
      headerName: 'Actions',
      width: 238,
      pinnable: true,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
            //   className="textPrimary"
              onClick={handleCancelClick(id)}
              sx={{
                color: 'error.dark',
              }}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id as GridRowId)}
            sx={{
                color: 'error.dark',
              }}
          />,
        ];
      },
    },
  ];
    return (
        <>
            <Box
            sx={{
                height: 500,
                width: '100%',
                '& .actions': {
                color: 'text.secondary',
                },
                '& .textPrimary': {
                color: 'text.primary',
                },
            }}
            >
               <div className="d-flex flex-row py-2">
                <TextField
                  label="Search"
                  value={searchText}
                  onChange={handleSearchChange}
                  variant="outlined"
                  size='small'
                  className="me-auto"
              />
                <Button startIcon={<AddIcon />} variant="contained"  sx={{  color: 'white' }} onClick={handleAddClick}>
                    Add record
                </Button>
                </div>
            <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                getRowId={(row) => row.clientId}
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={handleProcessRowUpdateError}
                sx={{
                  boxShadow: 2,
                  borderRadius: 1,
                  '& .MuiDataGrid-columnHeaders': {
                      borderBottom: '2px solid #e0e0e0',
                      fontSize: 14,
                      fontWeight: 700,
                  },
                  '& .MuiDataGrid-cell': {
                      borderBottom: '1px solid #e0e0e0',
                      fontSize: 13,
                      paddingLeft: 2,
                  },
                  '& .MuiDataGrid-cell:hover': {
                      color: 'primary.secondary',
                  },
              }}
            />
            {/* <Dialog open={openAddForm} onClose={handleCloseAddForm}>
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
            </Dialog> */}
            <ClientAddForm openAddForm={openAddForm} setOpenAddForm={setOpenAddForm}/>
            <Dialog
              open={deleteConfirmation.open}
              onClose={handleCancelDelete}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this client?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancelDelete}>Cancel</Button>
                <Button onClick={handleConfirmDelete} autoFocus>
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
            <CustomSnackbar
              open={snackbar.open}
              message={snackbar.message}
              variant={snackbar.variant}
              onClose={closeSnackbar}
            />
            </Box>
        </>
    )
}
