import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { OpenAI } from 'openai'; // Correct import statement

const Key = "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";
const openai = new OpenAI({
  apiKey: Key,
  dangerouslyAllowBrowser: true,

});

const Temp = () => {
  const [userInput, setUserInput] = useState('');
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    // const prompt = `Based on the given word or sentence that starts after & , generate a list of questions and send them in JSON format so we can handle here is the word or sentence - & ${userInput}`;
    const prompt = `Based on the following entry, generate a list of questions and send them in JSON format so we can handle here is the entry - ${userInput}`;

    openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          "role": "user",
          "content": prompt,
        },
      ],
      temperature: 1,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    }).then(response => {
        console.log(response);
        console.log(response.choices[0]["message"]["content"]);
      const generatedQuestions = extractQuestionsFromJson(response.choices[0]["message"]["content"]);

      setQuestions(generatedQuestions);
    }).catch(error => {
      console.error('Error:', error);
      setQuestions([]);
      // Consider displaying an error message to the user here
    }).finally(() => {
      setIsLoading(false);
    });
  };

  const extractQuestionsFromJson = (jsonText) => {
    try {
      const data = JSON.parse(jsonText);
      return data.questions || [];
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return [];
    }
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ width: '30%', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'rgb(13, 15, 124)', color: 'white', padding: '20px' }}>
        <TextField
          multiline
          rows={5}
          variant="filled"
          InputProps={{
            sx: {
              border: '1px solid lightgray',
              borderRadius: 4,
              padding: '15px',
              outline: 'none',
              color: 'white'
            }
          }}
          fullWidth
          sx={{ mb: 2 }}
          onChange={handleInputChange}
          value={userInput}
        />
       <Button
  variant="contained"
  disabled={isLoading || userInput.trim() === ''}
  sx={{ mb: 2, backgroundColor: 'rgb(205, 151, 2)', color: 'white' }} // Add color: 'white'
  onClick={handleSubmit}
>
  {isLoading ? "Generating..." : "Submit"}
</Button>
      </Box>

      <Box sx={{ width: '70%', padding: '30px', display: 'flex', justifyContent: 'center', overflowY: 'auto'}}>
        <Grid container spacing={2}>
          {questions.map((question, index) => (
            <Grid item key={index} xs={12} sm={12} md={12}>
              <Card>
                <CardContent>
                  <Typography variant="body1">
                    {question}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default Temp;
