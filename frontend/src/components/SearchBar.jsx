import { Paper, InputBase, IconButton, Tooltip, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { motion } from 'framer-motion';

const SearchBar = ({ value, onChange, onClear }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          mb: 3,
          border: '1px solid',
          borderColor: 'divider',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'primary.main',
          },
          transform: 'translateZ(0)',
        }}
      >
        <IconButton sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search quotes..."
          value={value}
          onChange={onChange}
          type="search"
          inputProps={{
            'aria-label': 'search quotes',
          }}
        />
        {value && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <Tooltip title="Clear search">
              <IconButton onClick={onClear}>
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </motion.div>
        )}
      </Paper>
    </motion.div>
  );
};

export default SearchBar; 