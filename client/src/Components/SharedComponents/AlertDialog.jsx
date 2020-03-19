import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function AlertDialog(props){
  


  return(
      <Dialog
        open={props.open}
        keepMounted
        onClose={props.open}
        
      >
      <DialogTitle>Cannot register!</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {props.alerMessage}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.close} color="primary">
          Try again!
        </Button>
      </DialogActions>


      </Dialog>
  );
}


export default AlertDialog