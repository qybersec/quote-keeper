import { useState, useEffect, useMemo } from 'react';
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
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { getMyQuotes, addQuote, updateQuote, deleteQuote, toggleFavorite } from '../services/api';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

const QuotesManager = () => {
  const [quotes, setQuotes] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    text: '',
    author: ''
  });
  const [editingQuote, setEditingQuote] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const response = await getMyQuotes();
      setQuotes(response.data);
    } catch (err) {
      setError('Failed to fetch quotes');
    } finally {
      setLoading(false);
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
        setSuccess('Quote updated successfully');
      } else {
        const response = await addQuote(formData);
        setQuotes([...quotes, response.data]);
        setSuccess('Quote added successfully');
      }
      setFormData({ text: '', author: '' });
      setError('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save quote');
      setTimeout(() => setError(''), 3000);
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

  const handleToggleFavorite = async (id) => {
    try {
      const response = await toggleFavorite(id);
      setQuotes(quotes.map(quote => 
        quote._id === id ? response.data : quote
      ));
    } catch (err) {
      setError('Unable to update favorite status. Please try again.');
      setTimeout(() => setError(''), 3000); // Clear error after 3 seconds
    }
  };

  const filteredQuotes = useMemo(() => quotes.filter(quote => {
    const matchesSearch = quote.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && (!showFavorites || quote.favorite);
  }), [quotes, searchTerm, showFavorites]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + Enter to submit
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const form = document.querySelector('form');
        if (form) form.dispatchEvent(new Event('submit', { cancelable: true }));
      }
      
      // Esc to cancel edit
      if (e.key === 'Escape' && editingQuote) {
        e.preventDefault();
        cancelEdit();
      }
      
      // Ctrl/Cmd + F to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput) searchInput.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingQuote, cancelEdit]);

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        mt: -4,
        height: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        gap: 4,
        flex: 1,
        height: '100%'
      }}>
        {/* Left Column */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            flex: '0 0 30%',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'auto'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 2,
            mt: 1
          }}>
            <Typography variant="h5" component="h2" mt={2}>
              {editingQuote ? 'Edit Quote' : 'Add New Quote'}
            </Typography>
            {editingQuote && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={cancelEdit}
                sx={{ 
                  ml: 2, 
                  mt: 2,
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  '&:hover': { 
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    borderWidth: 1
                  }
                }}
              >
                Cancel Edit
              </Button>
            )}
          </Box>
          {success && (
            <Typography color="success.main" sx={{ mb: 2 }}>
              {success}
            </Typography>
          )}
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
              rows={8}
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

        {/* Right Column */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            flex: '1 1 70%',
            height: '100%',
            overflow: 'auto'
          }}
        >
          <Box sx={{ display:'flex', mt: 2, justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2">
              My Quotes
            </Typography>
            <Button
              variant="outlined"
              startIcon={showFavorites ? <StarIcon /> : <StarBorderIcon />}
              onClick={() => setShowFavorites(!showFavorites)}
              size="small"
              sx={{ 
                borderRadius: 2,
                px: 2,
                mt: 2,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.3)',
                '&:hover': { 
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  borderWidth: 1,
                  backgroundColor: 'rgba(25, 118, 210, 0.04)'
                },
                fontWeight: 'bold',
                fontSize: '1rem',
                textTransform: 'none',
                transition: 'transform 0.2s',
                '&:active': {
                  transform: 'scale(0.95)'
                }
              }}
            >
              {showFavorites ? 'All Quotes' : 'Favorites'}
            </Button>
          </Box>
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
          />
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {filteredQuotes.map((quote, index) => (
                <div key={quote._id}>
                  {index > 0 && <Divider />}
                  <ListItem
                    sx={{
                      pr: 15
                    }}
                  >
                    <ListItemText
                      primary={quote.text}
                      primaryTypographyProps={{
                        sx: { wordBreak: 'break-word' }
                      }}
                      secondary={
                        <Typography 
                          component="span" 
                          color="text.primary"
                          sx={{ display: 'block', mt: 1 }}
                        >
                          — {quote.author}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="favorite"
                        onClick={() => handleToggleFavorite(quote._id)}
                        sx={{ 
                          mr: 1.5,
                          transition: 'all 0.2s ease',
                          '&:hover': { 
                            backgroundColor: 'rgba(25, 118, 210, 0.04)',
                            transform: 'scale(1.1)'
                          },
                          '&:active': {
                            transform: 'scale(0.95)'
                          }
                        }}
                      >
                        {quote.favorite ? (
                          <StarIcon sx={{ 
                            color: 'primary.main',
                            transform: 'scale(1.1)',
                            transition: 'all 0.2s ease'
                          }} />
                        ) : (
                          <StarBorderIcon />
                        )}
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleEdit(quote)}
                        sx={{ 
                          mr: 2,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            color: 'primary.main'
                          }
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => setDeleteConfirm(quote)}
                        sx={{
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            color: 'error.main'
                          }
                        }}
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
          )}
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