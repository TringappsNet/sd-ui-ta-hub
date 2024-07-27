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
  import {
    randomCreatedDate,
    randomTraderName,
    randomId,
    randomArrayItem,
  } from '@mui/x-data-grid-generator';
  import { useClientStore, Client } from "../../lib/clientStore";
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

export default function Clients(){
    const { clients, isLoading, isInitialized, getClients, updateClient, deleteClient } = useClientStore();
    const [rows, setRows] = React.useState(clients);
    useEffect(() => {
        if (!isInitialized) {
            getClients();
            setRows(clients);
        }
        else{
            setRows(clients)
        }
    }, [isInitialized, getClients]);
//   const clients = useCandidateStore((state)=> state.clients)
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
        deleteClient(id as number);
        console.log("deleted", id);
        setRows(rows.filter((row) => row.clientId !== id));
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

    const originalRow = rows.find((row) => row.clientId === id);
    if (originalRow) {
        setRows(rows.map((row) => 
        row.clientId === id ? { ...originalRow } : row
        ));
    }
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    try{
        console.log("newRow", newRow);
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
    { field: 'clientId', headerName: 'CLIENTID', width: 140, editable: true,    

    },
        { field: 'clientName',headerName: 'CLIENT NAME', width: 140, editable: true ,    
    },
        { field: 'clientSpocName',headerName: 'CLIENT SPOC NAME', width: 140, editable: true,    
    },
        { field: 'clientSpocContact',headerName: 'CLIENT SPOC CONTACT', width: 200, editable: true ,    
    },
        { field: 'clientLocation',headerName: 'CLIENT LOCATION', width: 200, editable: true,    
    },
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
                // disableColumnSorting
                autoPageSize
                // slots={{
                // toolbar: EditToolbar as GridSlots['toolbar'],
                // }}
                // slotProps={{
                // toolbar: { setRows, setRowModesModel },
                // }}
                sx={{
                    boxShadow: 2,
                    // border: 2,
                    borderRadius: 5,
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
                    // borderColor: 'primary.light',
                    '& .MuiDataGrid-cell:hover': {
                      color: 'primary.secondary',
                    },
                  }}
            />
            </Box>
        </>
    )
}
