import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Button,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { getQuotes } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '../components/SearchBar';
import PageTransition from '../components/PageTransition';
import ShuffleIcon from '@mui/icons-material/Shuffle';

const PublicQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [randomQuote, setRandomQuote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const response = await getQuotes();
      setQuotes(response.data);
      getRandomQuote(response.data);
    } catch (err) {
      setError('Failed to fetch quotes');
    } finally {
      setLoading(false);
    }
  };

  const getRandomQuote = useCallback((quoteList = quotes) => {
    if (quoteList.length > 0) {
      const randomIndex = Math.floor(Math.random() * quoteList.length);
      setRandomQuote(quoteList[randomIndex]);
    }
  }, [quotes]);

  const filteredQuotes = useMemo(() => quotes.filter(quote => 
    quote.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.author.toLowerCase().includes(searchTerm.toLowerCase())
  ), [quotes, searchTerm]);

  return (
    <PageTransition>
      <Container 
        maxWidth="xl" 
        sx={{ 
          mt: -4,
          height: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          gap: 4,
          flex: 1,
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: 2
        }}>
          {/* Left Column - Random Quote */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              flex: '0 0 30%',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              overflow: 'auto',
              position: 'relative'
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 4
            }}>
              <Typography 
                variant="h4" 
                component="h2"
                sx={{
                  fontSize: '1.8rem',
                  fontWeight: 500
                }}
              >
                Featured Quote
              </Typography>
              <Tooltip title="Get New Quote">
                <IconButton 
                  onClick={() => getRandomQuote()} 
                  color="primary"
                  sx={{
                   
                  }}
                >
                  <ShuffleIcon sx={{ fontSize: '1.8rem' }} />
                </IconButton>
              </Tooltip>
            </Box>

            <AnimatePresence mode="wait">
              {randomQuote && (
                <motion.div
                  key={randomQuote._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    paddingTop: '20%',
                    position: 'relative',
                    padding: '0 16px'
                  }}
                >
                  <FormatQuoteIcon 
                    sx={{ 
                      position: 'absolute',
                      top: -30,
                      left: -30,
                      fontSize: '5rem',
                      opacity: 0.1,
                      transform: 'rotate(180deg)',
                      color: 'primary.main'
                    }}
                  />
                  <Typography 
                    variant="h5" 
                    component="p" 
                    sx={{
                      mt: 5,
                      mb: 2,
                      fontStyle: 'italic',
                      textAlign: 'center',
                      fontSize: '1.4rem',
                      lineHeight: 1.4,
                      letterSpacing: '0.01em',
                      position: 'relative',
                      zIndex: 1
                    }}
                  >
                    {randomQuote.text}
                  </Typography>
                  <Typography 
                    variant="subtitle1" 
                    color="text.secondary"
                    sx={{ 
                      textAlign: 'right',
                      fontWeight: 'bold',
                      mt: 3,
                      fontSize: '1.1rem'
                    }}
                  >
                    — {randomQuote.author}
                  </Typography>
                </motion.div>
              )}
            </AnimatePresence>
          </Paper>

          {/* Right Column - Quote Collection */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              flex: '1 1 65%',
              height: '100%',
              overflow: 'auto'
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              Quote Collection
            </Typography>
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
                  <motion.div
                    key={quote._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ 
                      scale: 1.01,
                      transition: { duration: 0.2 }
                    }}
                  >
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
                  </motion.div>
                ))}
                {quotes.length === 0 && (
                  <Typography color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                    No quotes available yet.
                  </Typography>
                )}
              </List>
            )}
          </Paper>
        </Box>
      </Container>
    </PageTransition>
  );
};

export default PublicQuotes; 