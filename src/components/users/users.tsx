import React, { useEffect, useState } from "react";
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
  import {
    randomCreatedDate,
    randomTraderName,
    randomId,
    randomArrayItem,
  } from '@mui/x-data-grid-generator';
  import { useUserStore, User } from "../../lib/usersStore";
import TextField from "@mui/material/TextField";
//   interface EditToolbarProps {
//     setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
//     setRowModesModel: (
//       newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
//     ) => void;
//   }
  
//   function EditToolbar(props: EditToolbarProps) {
//     const { setRows, setRowModesModel } = props;
  
//     const handleClick = () => {
//       const id = randomId();
//       setRows((oldRows) => [...oldRows, { id, name: '', age: '', isNew: true }]);
//       setRowModesModel((oldModel) => ({
//         ...oldModel,
//         [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
//       }));
//     };
  
//     return (
//       <GridToolbarContainer>
//         <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
//           Add record
//         </Button>
//       </GridToolbarContainer>
//     );
//   }

export default function Users(){
    const { users, isLoading, isInitialized, getUsers, updateUser, deleteUser } = useUserStore();
    const [rows, setRows] = React.useState(users);
    const [searchText, setSearchText] = useState('');
    useEffect(() => {
        if (!isInitialized) {
            getUsers();
            setRows(users);
        }
        else{
            setRows(users)
        }
    }, [isInitialized, getUsers]);
    useEffect(() => {
      if (isInitialized) {
          const filteredRows = users.filter(row =>
              Object.values(row).some(value =>
                  String(value).toLowerCase().includes(searchText.toLowerCase())
              )
          );
          setRows(filteredRows);
      }
  }, [searchText, isInitialized, users]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
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

  const handleDeleteClick = (id: GridRowId) => () => {
    try{
        deleteUser(id as number);
        console.log("deleted", id);
        setRows(rows.filter((row) => row.userId !== id));
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

    const originalRow = rows.find((row) => row.userId === id);
    if (originalRow) {
        setRows(rows.map((row) => 
        row.userId === id ? { ...originalRow } : row
        ));
    }
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    try{
        console.log("newRow", newRow);
        // Find the original row
        const originalRow = rows.find((row) => row.userId === newRow.userId);
        const updatedRow = newRow as User;
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
        const updatedCandidate = await updateUser(updatedRow)
        console.log("updatedCandidate",updatedCandidate)
    
        setRows(rows.map((row) => row.userId === updatedCandidate.userId ? updatedCandidate : row));
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
    { field: 'userId', headerName: 'User Id', width: 240, editable: true, headerClassName: 'column-header' },
    { field: 'firstName', headerName: 'First Name', width: 240, editable: true, headerClassName: 'column-header'},
    { field: 'lastName', headerName: 'Last Name', width: 240, editable: true, headerClassName: 'column-header' },
    { field: 'username', headerName: 'Username', width: 240, editable: true, headerClassName: 'column-header' },
    { field: 'email', headerName: 'Email', width: 240, editable: true, headerClassName: 'column-header' },
    { field: 'phone', headerName: 'Phone', width: 238, editable: true, headerClassName: 'column-header' },
 
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
               </div> 
            <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                getRowId={(row) => row.userId}
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
