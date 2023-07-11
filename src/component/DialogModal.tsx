import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks/hooks';
import { config } from '../features/setup/setupSlice';
import { blue } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

type Props = {
  open: boolean;
  handleClose: () => void;
};
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogModal = ({ open, handleClose }: Props) => {
  const navigate = useNavigate();
  const questions = useAppSelector((state) => state.questions.questions);
  const dispatch = useAppDispatch();

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle
        sx={{
          fontSize: '1.5rem',
          fontWeight: 550,
        }}
      >
        {'Your Exam Finished!!'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {`You Answer ${
            questions.filter((q) => q.isCorrect === true).length
          } of ${questions.length} questions correctly. `}
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          backgroundColor: '#5AB9C1',
          margin: 2,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Button
          sx={{
            textAlign: 'center',
            width: '100%',
            color: '#fff',
            fontWeight: 550,
          }}
          onClick={() => {
            dispatch(config(false));
            handleClose();
            navigate('/setup');
          }}
        >
          Reset
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogModal;
