import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
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
  import { useCandidateStore, Candidate } from "../../lib/candidateStore";
import DialogContentText from "@mui/material/DialogContentText";

export default function Candidates(){
    const { candidates, isLoading, isInitialized, getCandidates, updateCandidate, deleteCandidate, addCandidate } = useCandidateStore();
    const [rows, setRows] = React.useState(candidates);
    const [open, setOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [newCandidate, setNewCandidate] = useState({
        candidateName: '',
        candidateEmail: '',
        candidateContact: '',
        technology: '',
        totalExperience: '',
        currentCtc: '',
        expectedCtc: '',
        noticePeriod: '',
        modeOfWork: '',
        currentLocation: '',
        candidateStatus: '',
        recruiter: '',
        recruitedSource: '',
        comments: '',
    });
    const [snackbar, setSnackbar] = useState({
      open: false,
      message: '',
      variant: 'success'
  });
    useEffect(() => {
      if (!isInitialized) {
          getCandidates();
      } else {
          const filteredRows = candidates.filter(row =>
              Object.values(row).some(value =>
                  String(value).toLowerCase().includes(searchText.toLowerCase())
              )
          );
          setRows(filteredRows);
      }
  }, [searchText, isInitialized, candidates]);
  
//   const candidates = useCandidateStore((state)=> state.candidates)
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(null); 
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const showSnackbar = (message, variant) => {
    setSnackbar({ open: true, message, variant });
};

  const handleDeleteClick = (id: GridRowId) => () => {
    setCandidateToDelete(id);
    setDeleteConfirmOpen(true);
};
  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
};

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewCandidate({ ...newCandidate, [name]: value });
    };

    const handleAddCandidate = async () => {
        try {
            const addedCandidate = await addCandidate(newCandidate);
            getCandidates();
            // setRows([...rows, addedCandidate]);
            handleClose();
            setNewCandidate({
              candidateName: '',
              candidateEmail: '',
              candidateContact: '',
              technology: '',
              totalExperience: '',   
              currentCtc: '',
              expectedCtc: '',
              noticePeriod: '',
              modeOfWork: '',
              currentLocation: '',
              candidateStatus: '',   
              recruiter: '',
              recruitedSource: '',
              comments: '',
            }); // Reset form
            showSnackbar('Candidate added successfully', 'success');
        } catch (error) {
            console.error("Error adding candidate:", error);
            showSnackbar('Error adding candidate', 'error');
        }
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

  const handleConfirmDelete = () => {
    if (candidateToDelete) {
        try {
            deleteCandidate(candidateToDelete as number);
            setRows(rows.filter((row) => row.candidateId !== candidateToDelete));
            showSnackbar('Candidate deleted successfully', 'success');
        } catch (error) {
            console.log(error);
            showSnackbar('Error deleting candidate', 'error');
        }
    }
    setDeleteConfirmOpen(false);
};
const handleCancelDelete = () => {
  setDeleteConfirmOpen(false);
  setCandidateToDelete(null);
};

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const originalRow = rows.find((row) => row.candidateId === id);
    if (originalRow) {
        setRows(rows.map((row) => 
        row.candidateId === id ? { ...originalRow } : row
        ));
    }
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    try{
        console.log("newRow", newRow);
        // Find the original row
        const originalRow = rows.find((row) => row.candidateId === newRow.candidateId);
        const updatedRow = newRow as Candidate;
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
        const updatedCandidate = await updateCandidate(updatedRow)
        console.log("updatedCandidate",updatedCandidate)
    
        setRows(rows.map((row) => row.candidateId === updatedCandidate.candidateId ? updatedCandidate : row));
        showSnackbar('Candidate updated successfully', 'success');
        console.log("Row updated:", updatedCandidate);
        return updatedCandidate;
    }
    catch(error){
        console.error("Error updating row:", error);
        showSnackbar('Error updating candidate', 'error');
    }
    
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  const handleProcessRowUpdateError = (error: any) => {
    console.error("Error updating row:", error);
    // You can add more error handling logic here, like showing a snackbar or alert
  };

  console.log("rows",rows);
  const columns: GridColDef[] = [
    { field: 'candidateName', headerName: 'Candidate Name', width: 180, editable: true },
    { field: 'candidateEmail', headerName: 'Email', width: 200, editable: true },
    { field: 'candidateContact', headerName: 'Contact', width: 120, editable: true },
    { field: 'technology', headerName: 'Technology', width: 150, editable: true },
    { field: 'totalExperience', headerName: 'Experience', width: 120, editable: true },
    { field: 'currentCtc', headerName: 'Current CTC', width: 120, editable: true },
    { field: 'expectedCtc', headerName: 'Expected CTC', width: 120, editable: true },
    { field: 'noticePeriod', headerName: 'Notice Period', width: 120, editable: true },
    { field: 'modeOfWork', headerName: 'Mode of Work', width: 150, editable: true },
    { field: 'currentLocation', headerName: 'Location', width: 150, editable: true },
    { field: 'candidateStatus', headerName: 'Status', width: 120, editable: true },
    { field: 'recruiter', headerName: 'Recruiter', width: 120, editable: true },
    { field: 'recruitedSource', headerName: 'Recruited Source', width: 150, editable: true },
    { field: 'comments', headerName: 'Comments', width: 120, editable: true },
    // {
    //   field: 'age',
    //   headerName: 'Age',
    //   type: 'number',
    //   width: 80,
    //   align: 'left',
    //   headerAlign: 'left',
    //   editable: true,
    // },
    // {
    //   field: 'joinDate',
    //   headerName: 'Join date',
    //   type: 'date',
    //   width: 180,
    //   editable: true,
    // },
    // {
    //   field: 'role',
    //   headerName: 'Department',
    //   width: 220,
    //   editable: true,
    //   type: 'singleSelect',
    //   valueOptions: ['Market', 'Finance', 'Development'],
    // },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
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
            onClick={handleDeleteClick(id)}
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
                <Button startIcon={<AddIcon />} variant="contained" onClick={handleOpen} sx={{  color: 'white' }} className="">
                    Add record
                </Button>
                </div>
            <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                getRowId={(row) => row.candidateId}
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={handleProcessRowUpdateError}
                sx={{
                    boxShadow: 2,
                    // borderRadius: 1,
                    padding: 1,
                    '& .MuiDataGrid-columnHeaders': {
                        borderBottom: '2px solid #e0e0e0',
                        fontSize: 12,
                        fontWeight: 700,
                    },
                    '& .MuiDataGrid-cell': {
                        borderBottom: '1px solid #e0e0e0',
                        fontSize: 14,
                    },
                    '& .MuiDataGrid-cell:hover': {
                        color: 'primary.secondary',
                    },
                }}
            />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Candidate</DialogTitle>
                <DialogContent>
                    {columns.filter(col => col.field !== 'actions').map((col) => (
                        <TextField
                            key={col.field}
                            margin="dense"
                            name={col.field}
                            label={col.headerName}
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={newCandidate[col.field] || ''}
                            onChange={handleInputChange}
                        />
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleAddCandidate}>Add</Button>
                </DialogActions>
            </Dialog>
            <Dialog
              open={deleteConfirmOpen}
              onClose={handleCancelDelete}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
          >
              <DialogTitle id="alert-dialog-title">
                  {"Confirm Deletion"}
              </DialogTitle>
              <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                      Are you sure you want to delete this candidate?
                  </DialogContentText>
              </DialogContent>
              <DialogActions>
                  <Button onClick={handleCancelDelete}>Cancel</Button>
                  <Button onClick={handleConfirmDelete} autoFocus>
                      Delete
                  </Button>
              </DialogActions>
          </Dialog>
        </Box>
        <CustomSnackbar
            open={snackbar.open}
            message={snackbar.message}
            variant={snackbar.variant}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
        </>
    )
}