import { useState, useEffect } from 'react';
import { RootState } from '../app/store/store';
import { useAppDispatch, useAppSelector } from '../app/hooks/hooks';
import {
  correctAnswer,
  generateExam,
  generateQuestions,
  getAsyncQuestions,
  getAsyncToken,
  nextQuestion,
  prevQuestion,
  wrongAnswer,
} from '../features/getData/dataSlice';
import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import DialogModal from './DialogModal';
import CircularStatic from './Loading';

const Exam = () => {
  const config = useAppSelector((state: RootState) => state.setup.config);
  const [openModal, setOpenModal] = useState(false);
  const [correct, setCorrect] = useState(0);
  const token = useAppSelector((state) => state.questions.token);
  const rawData = useAppSelector((state) => state.questions.rawData);
  const questions = useAppSelector((state) => state.questions.questions);
  const loading = useAppSelector((state) => state.questions.loading);
  const error = useAppSelector((state) => state.questions.error);
  const aciveQuestion = useAppSelector(
    (state) => state.questions.activeQuestion
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    !token && dispatch(getAsyncToken());
  }, []);
  useEffect(() => {
    token &&
      dispatch(
        getAsyncQuestions(
          `https://opentdb.com/api.php?amount=${config.NoQ}&category=${config.category}&difficulty=${config.difficulty}&type=multiple&token=${token}`
        )
      );
  }, [token]);

  useEffect(() => {
    rawData.length > 0 && dispatch(generateExam(generateQuestions(rawData)));
  }, [rawData]);
  if (loading) {
    return <CircularStatic />;
  }
  if (error) {
    return (
      <Box>
        <Typography>{error}</Typography>
      </Box>
    );
  }
  return (
    <div className="w-full flex flex-col items-center px-8 ">
      <Box className="text-sm text-green-500 w-full flex items-center justify-end pb-2 px-8 border-b mb-4">{`Correct Answers ${correct} of ${questions.length} `}</Box>
      {questions[aciveQuestion] && (
        <Box className="flex flex-col gap-4 max-w-2xl w-full border border-gray-300 p-6 rounded-md shadow-md ">
          <Typography>{questions[aciveQuestion].question}</Typography>
          <RadioGroup name={questions[aciveQuestion].question}>
            {questions[aciveQuestion].answers.map((ans: string) => {
              return (
                <FormControlLabel
                  className="w-full hover:bg-slate-200 rounded-md"
                  key={ans}
                  value={ans}
                  control={
                    <Radio
                      onChange={() => {
                        if (ans === rawData[aciveQuestion].correct_answer) {
                          dispatch(correctAnswer(aciveQuestion));
                        } else {
                          dispatch(wrongAnswer(aciveQuestion));
                        }
                        console.log(
                          ans === rawData[aciveQuestion].correct_answer
                        );
                      }}
                    />
                  }
                  label={ans}
                />
              );
            })}
          </RadioGroup>
          <Box className="flex flex-wrap gap-4 items-center justify-between">
            <Button
              type="button"
              className="bg-blue-400 p-2 rounded-md w-28 text-slate-50 font-medium"
              onClick={() => {
                if (aciveQuestion > 0) dispatch(prevQuestion());
              }}
            >
              {'prev'}
            </Button>
            <Button
              type="button"
              className="bg-blue-400 p-2 rounded-md w-28 text-slate-50 font-medium"
              onClick={() => {
                if (aciveQuestion < questions.length - 1) {
                  dispatch(nextQuestion());
                  setCorrect(
                    questions.filter((q) => q.isCorrect === true).length
                  );
                } else {
                  setOpenModal(true);
                }
              }}
            >
              {aciveQuestion === questions.length - 1 ? 'finish' : 'next'}
            </Button>
          </Box>
        </Box>
      )}
      {openModal && (
        <DialogModal open={openModal} handleClose={() => setOpenModal(false)} />
      )}
    </div>
  );
};

export default Exam;
