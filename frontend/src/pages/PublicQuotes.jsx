import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { getQuotes } from '../services/api';

const PublicQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await getQuotes();
        setQuotes(response.data);
      } catch (err) {
        setError('Failed to fetch quotes');
      }
    };
    fetchQuotes();
  }, []);

  return (
    <Container sx={{ mt: -4 }}>
      <Paper elevation={3} sx={{ 
        p: 4,
        width: '100%',
        maxWidth: '800px',
        mx: 'auto',
      }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Quote Collection
        </Typography>
        <List>
          {quotes.map((quote, index) => (
            <div key={quote._id}>
              {index > 0 && <Divider />}
              <ListItem>
                <ListItemText
                  primary={quote.text}
                  secondary={
                    <Typography component="span" color="text.primary">
                      — {quote.author}
                    </Typography>
                  }
                />
              </ListItem>
            </div>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default PublicQuotes; 