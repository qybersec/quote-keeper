import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { getMyQuotes, addQuote, updateQuote, deleteQuote } from '../services/api';
import { useNavigate } from 'react-router-dom';

const QuotesManager = () => {
  const [quotes, setQuotes] = useState([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    text: '',
    author: ''
  });
  const [editingQuote, setEditingQuote] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const response = await getMyQuotes();
      setQuotes(response.data);
    } catch (err) {
      setError('Failed to fetch quotes');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingQuote) {
        const response = await updateQuote(editingQuote._id, formData);
        setQuotes(quotes.map(quote => 
          quote._id === editingQuote._id ? response.data : quote
        ));
        setEditingQuote(null);
      } else {
        const response = await addQuote(formData);
        setQuotes([...quotes, response.data]);
      }
      setFormData({ text: '', author: '' });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save quote');
    }
  };

  const handleEdit = (quote) => {
    setEditingQuote(quote);
    setFormData({
      text: quote.text,
      author: quote.author
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await deleteQuote(id);
      setQuotes(quotes.filter(quote => quote._id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError('Failed to delete quote');
    }
  };

  const cancelEdit = () => {
    setEditingQuote(null);
    setFormData({ text: '', author: '' });
  };

  return (
    <Container maxWidth="xl" sx={{ mt: -4 }}>
      <Box sx={{ display: 'flex', gap: 4 }}>
        {/* Left Column - Add/Edit Form */}
        <Paper elevation={3} sx={{ 
          p: 4, 
          flex: '0 0 40%',
          bgcolor: 'background.paper'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2">
              {editingQuote ? 'Edit Quote' : 'Add New Quote'}
            </Typography>
            {editingQuote && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={cancelEdit}
              >
                Cancel Edit
              </Button>
            )}
          </Box>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Quote Text"
              name="text"
              value={formData.text}
              onChange={handleChange}
              margin="normal"
              required
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
            >
              {editingQuote ? 'Update Quote' : 'Add Quote'}
            </Button>
          </Box>
        </Paper>

        {/* Right Column - Quotes List */}
        <Paper elevation={3} sx={{ 
          p: 4, 
          flex: '1 1 60%',
          bgcolor: 'background.paper'
        }}>
          <Typography variant="h5" component="h2" gutterBottom>
            My Quotes
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
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleEdit(quote)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => setDeleteConfirm(quote)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </div>
            ))}
            {quotes.length === 0 && (
              <Typography color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                No quotes yet. Add your first quote above!
              </Typography>
            )}
          </List>
        </Paper>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this quote?
          {deleteConfirm && (
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              "{deleteConfirm.text}" — {deleteConfirm.author}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button 
            onClick={() => handleDelete(deleteConfirm._id)} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default QuotesManager; 