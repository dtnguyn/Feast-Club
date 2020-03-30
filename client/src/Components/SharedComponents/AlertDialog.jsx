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
        onClose={props.close}
      >
      <DialogTitle ><span style={{color: '#da2d2d', fontWeight: 'bold'}}>{props.alertTitle}</span></DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
        <span style={{fontWeight: 'bold'}}>{props.alertMessage}</span>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.close} color="primary">
        <span style={{color: '#da2d2d', fontWeight: 'bold'}}>Try again</span>
        </Button>
      </DialogActions>
      </Dialog>
  );
}


export default AlertDialog