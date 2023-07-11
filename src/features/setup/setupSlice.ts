import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type SetupType = {
  NoQ: string;
  category: string;
  difficulty: string;
};
interface ExamState {
  config: SetupType;
  isConfiged: boolean;
}

const initSetup: ExamState = {
  config: {
    NoQ: '',
    category: '',
    difficulty: '',
  },
  isConfiged: false,
};

export const setupSlice = createSlice({
  name: 'exam',
  initialState: initSetup,
  reducers: {
    setup: (state, action: PayloadAction<SetupType>) => {
      state.config = action.payload;
      console.log(state);
    },
    config: (state, action: PayloadAction<boolean>) => {
      state.isConfiged = action.payload;
    },
  },
});

export const { setup, config } = setupSlice.actions;
export default setupSlice.reducer;
