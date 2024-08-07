import React, { useEffect } from "react";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
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
  import { useCandidateStore, Candidate } from "../../lib/candidateStore";


export default function Positions(){
    const { candidates, isLoading, isInitialized, getCandidates, updateCandidate, deleteCandidate } = useCandidateStore();
    const [rows, setRows] = React.useState(candidates);
    useEffect(() => {
        if (!isInitialized) {
            getCandidates();
            setRows(candidates);
        }
        else{
            setRows(candidates)
        }
    }, [isInitialized, getCandidates]);
//   const candidates = useCandidateStore((state)=> state.candidates)
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

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

  const handleDeleteClick = (id: GridRowId) => () => {
    try{
        deleteCandidate(id as number);
        console.log("deleted", id);
        setRows(rows.filter((row) => row.candidateId !== id));
    }
    catch(error){
        console.log(error);
    }
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
        console.log("Row updated:", updatedCandidate);
        return updatedCandidate;
    }
    catch(error){
        console.error("Error updating row:", error);
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
    { field: 'candidateName', headerName: 'Candidate Name', width: 180, editable: true, headerClassName: 'column-header' },
    { field: 'candidateEmail', headerName: 'Email', width: 200, editable: true, headerClassName: 'column-header' },
    { field: 'candidateContact', headerName: 'Contact', width: 120, editable: true, headerClassName: 'column-header' },
    { field: 'technology', headerName: 'Technology', width: 150, editable: true, headerClassName: 'column-header' },
    { field: 'totalExperience', headerName: 'Experience', width: 120, editable: true, headerClassName: 'column-header' },
    { field: 'clientName', headerName: 'Client Name', width: 150, editable: true, headerClassName: 'column-header' },
    { field: 'currentCtc', headerName: 'Current CTC', width: 120, editable: true, headerClassName: 'column-header' },
    { field: 'expectedCtc', headerName: 'Expected CTC', width: 120, editable: true, headerClassName: 'column-header' },
    { field: 'noticePeriod', headerName: 'Notice Period', width: 120, editable: true, headerClassName: 'column-header' },
    { field: 'modeOfWork', headerName: 'Mode of Work', width: 150, editable: true, headerClassName: 'column-header' },
    { field: 'currentLocation', headerName: 'Location', width: 150, editable: true, headerClassName: 'column-header' },
    { field: 'candidateStatus', headerName: 'Status', width: 120, editable: true, headerClassName: 'column-header' },
    { field: 'taskCandidateStatus', headerName: 'Task Status', width: 120, editable: true, headerClassName: 'column-header' },
    { field: 'recruiter', headerName: 'Recruiter', width: 120, editable: true, headerClassName: 'column-header' },
    { field: 'recruitedSource', headerName: 'Recruited Source', width: 150, editable: true, headerClassName: 'column-header' },
    { field: 'comments', headerName: 'Comments', width: 120, editable: true, headerClassName: 'column-header' },
    
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      headerClassName: 'column-header',
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
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
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
            color="inherit"
          />,
        ];
      },
    },
  ];
    return (
        <>
            <Box
            sx={{
                height: 600,
                width: '100%',
                '& .actions': {
                color: 'text.secondary',
                },
                '& .textPrimary': {
                color: 'text.primary',
                },
            }}
            >
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
            </Box>
        </>
    )
}
