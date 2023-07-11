import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../app/hooks/hooks';
import { config, setup } from '../features/setup/setupSlice';
import { useEffect } from 'react';
import { getAsyncCategory } from '../features/getData/dataSlice';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

type Inputs = {
  NoQ: string;
  category: string;
  difficulty: string;
};

const schema = z.object({
  NoQ: z
    .string()
    .min(1, { message: 'this field is required' })
    .regex(new RegExp('.*[0-9].*'), {
      message: 'Number of Questions should be number',
    }),
  category: z.string().min(1, { message: 'this field is required' }),
  difficulty: z.string().min(1, { message: 'this field is required' }),
});

const SetupForm = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      NoQ: '',
      category: '',
      difficulty: '',
    },
    resolver: zodResolver(schema),
  });
  const categories = useAppSelector((state) => state.questions.categories);
  const dispatch = useAppDispatch();
  useEffect(() => {
    // axios('https://opentdb.com/api_category.php').then((response) =>
    //   setCategories(response.data.trivia_categories)
    // );
    dispatch(getAsyncCategory());
  }, []);
  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    dispatch(setup(data));
    dispatch(config(true));
    navigate('/exam');
  };

  return (
    <>
      <form
        className="flex flex-col gap-4 max-w-sm w-full border border-gray-300 p-6 rounded-md shadow-md "
        onSubmit={handleSubmit(onSubmit)}
      >
        <Box className="w-full">
          <FormControl
            sx={{
              border: '1px solid',
              borderRadius: '5px',
              paddingLeft: '5px',
              backgroundColor: '#fff',
              width: '100%',
            }}
            className="border-gray-400"
          >
            <InputLabel
              sx={{
                backgroundColor: '#FFFFFF',
                paddingLeft: '2px',
              }}
            >
              {'Number Of Questions'}
            </InputLabel>
            <Controller
              name="NoQ"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Input
                  type="text"
                  disableUnderline={true}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                />
              )}
            />
          </FormControl>
          {errors.NoQ && (
            <FormHelperText className="text-red-500 pl-5">
              {errors.NoQ.message}
            </FormHelperText>
          )}
        </Box>
        <Box>
          <FormControl className="bg-white" fullWidth>
            <InputLabel className="bg-white p-1">{'Category'}</InputLabel>
            <Controller
              name="category"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select value={field.value} onChange={field.onChange}>
                  {categories.map((category) => {
                    return (
                      <MenuItem
                        value={category.id.toString()}
                        key={category.id}
                      >
                        {category.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              )}
            />
          </FormControl>
          {errors.category && (
            <FormHelperText className="text-red-500 pl-5">
              {errors.category.message}
            </FormHelperText>
          )}
        </Box>
        <Box>
          <FormControl fullWidth>
            <InputLabel className="bg-white p-1">{'Difficulty'}</InputLabel>
            <Controller
              name="difficulty"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select value={field.value} onChange={field.onChange}>
                  <MenuItem value={'easy'}>{'Easy'}</MenuItem>
                  <MenuItem value={'medium'}>{'Medium'}</MenuItem>
                  <MenuItem value={'hard'}>{'Hard'}</MenuItem>
                </Select>
              )}
            />
          </FormControl>
          {errors.difficulty && (
            <FormHelperText className="text-red-500 pl-5">
              {errors.difficulty.message}
            </FormHelperText>
          )}
        </Box>
        <Box className="flex flex-col items-center gap-2">
          <Button
            type="submit"
            className="bg-blue-400 p-2 rounded-md w-full text-slate-50 font-medium"
          >
            Generate
          </Button>
          <Button
            type="button"
            className="bg-blue-400 p-2 rounded-md w-full text-slate-50 font-medium"
            onClick={() => {
              reset((formValues) => ({
                ...formValues,
                NoQ: '',
                category: '',
                difficulty: '',
              }));
            }}
          >
            Reset
          </Button>
        </Box>
      </form>
    </>
  );
};

export default SetupForm;
