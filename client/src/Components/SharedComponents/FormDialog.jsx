import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


const FormDialog = (props) => {

    const [fields, setFields] = useState(props.fields);

    const handleChange = (e, i) => {
        // setFields(prevValues => ([
        //     ...prevValues,
        //     {prevValues[i].value}: e.target.value
        // ]));
        setFields(...fields.slice(i - 1), {...fields[i], value: e.target.value, ...fields.slice(i + 1, fields.length - 1)});
    
    
    }

    useEffect(() => {
        setFields(props.fields)
    }, [props.fields])




    return(
        <Dialog open={true} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
            <DialogContent>
            <DialogContentText>
                {props.message}
            </DialogContentText>

            {props.fields.map((field, i) => {
                console.log("values ", fields)
                return(
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label={field.label}
                        value={field.value}
                        onChange={(e) => handleChange(e, i)}
                        fullWidth
                        required
                    />
                );
            })}
            
            </DialogContent>
            <DialogActions>
            <Button color="primary">
                Cancel
            </Button>
            <Button color="primary" onClick={() => {
                props.action(fields)
            }}>
                Apply
            </Button>
            </DialogActions>
        </Dialog>
    );
}

export default FormDialog;