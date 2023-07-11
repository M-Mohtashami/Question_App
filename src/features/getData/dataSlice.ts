import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export type QuestionType = {
  question: string;
  answers: string[];
  isCorrect: boolean;
  [key: string]: string | string[] | boolean;
};
type RawDataType = {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};
type CategoryType = {
  id: string;
  name: string;
};

interface DataState {
  questions: QuestionType[];
  rawData: RawDataType[];
  categories: CategoryType[];
  token: string;
  activeQuestion: number;
  loading: boolean;
  error: string | undefined;
}

const initSetup: DataState = {
  questions: [],
  rawData: [],
  categories: [],
  token: '',
  activeQuestion: 0,
  loading: false,
  error: undefined,
};

export const getAsyncCategory = createAsyncThunk(
  'data/getAsyncCategory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://opentdb.com/api_category.php');

      return response.data.trivia_categories;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getAsyncToken = createAsyncThunk(
  'data/getAsyncToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        'https://opentdb.com/api_token.php?command=request'
      );

      return response.data.token;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getAsyncQuestions = createAsyncThunk(
  'data/getAsyncQuestions',
  async (url: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(url);

      return response.data.results;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const generateQuestions = (data: RawDataType[]): QuestionType[] => {
  return data.map((q) => {
    const newQuestion: QuestionType = {
      question: q.question,
      answers: [...q.incorrect_answers, q.correct_answer].sort(
        () => Math.random() - 0.5
      ),
      isCorrect: false,
    };
    return newQuestion;
  });
};

export const questionsSlice = createSlice({
  name: 'data',
  initialState: initSetup,
  reducers: {
    generateExam: (state: DataState, action) => {
      state.questions = action.payload;
      console.log(state.questions);
    },
    nextQuestion: (state) => {
      state.activeQuestion = state.activeQuestion + 1;
    },
    prevQuestion: (state) => {
      state.activeQuestion = state.activeQuestion - 1;
    },
    correctAnswer: (state, action) => {
      state.questions[action.payload].isCorrect = true;
    },
    wrongAnswer: (state, action) => {
      state.questions[action.payload].isCorrect = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAsyncCategory.fulfilled, (state, action) => {
      //   console.log(action.payload);
      state.categories = action.payload;
    });
    builder.addCase(getAsyncToken.fulfilled, (state, action) => {
      //   console.log(action.payload);
      state.token = action.payload;
    });
    builder.addCase(getAsyncQuestions.fulfilled, (state, action) => {
      state.rawData = action.payload;
      state.loading = false;
      state.error = undefined;
    });
    builder.addCase(getAsyncQuestions.pending, (state: DataState, action) => {
      state.loading = true;
      state.rawData = [];
      state.error = undefined;
    });
    builder.addCase(getAsyncQuestions.rejected, (state: DataState, action) => {
      state.loading = false;
      state.rawData = [];
      state.error = action.error.message;
    });
  },
});

export const {
  generateExam,
  nextQuestion,
  prevQuestion,
  correctAnswer,
  wrongAnswer,
} = questionsSlice.actions;
export default questionsSlice.reducer;
