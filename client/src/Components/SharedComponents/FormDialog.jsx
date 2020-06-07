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
        console.log("fields ", fields)
        let updatedFields;
        if(i === 0){
            updatedFields = [{...fields[i], value: e.target.value}, ...fields.slice(i + 1)];
        } else if(i === fields.length - 1){
            updatedFields = [...fields.slice(0, -1), {...fields[i], value: e.target.value}];
        } else {
            updatedFields = [...fields.slice(0, i), {...fields[i], value: e.target.value}, ...fields.slice(i + 1)];
        }
        setFields(updatedFields);
        
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
                return(
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label={field.label}
                        value={fields[i].value}
                        onChange={(e) => handleChange(e, i)}
                        fullWidth
                        required
                        type={field.type}
                    />
                );
            })}
            
            </DialogContent>
            <DialogActions>
            <Button color="primary" onClick={props.close}>
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