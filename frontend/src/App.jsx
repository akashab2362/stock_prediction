import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Autocomplete,
  CssBaseline,
  IconButton,
  Paper,
  Box,
  Container,
  Divider,
  Chip,
  Avatar,
  useMediaQuery
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Brightness4, Brightness7, TrendingUp, TrendingDown, ShowChart } from "@mui/icons-material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const stockOptions = [
  { label: "RELIANCE.NS", name: "Reliance Industries" },
  { label: "TCS.NS", name: "Tata Consultancy Services" },
  { label: "INFY.NS", name: "Infosys" },
  { label: "AAPL", name: "Apple Inc." },
  { label: "GOOGL", name: "Alphabet Inc." },
  { label: "MSFT", name: "Microsoft" },
  { label: "AMZN", name: "Amazon" },
  { label: "TSLA", name: "Tesla" },
];

const App = () => {
  const [stock, setStock] = useState("");
  const [stockName, setStockName] = useState("");
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [stockInfo, setStockInfo] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#90caf9" : "#1976d2",
      },
      background: {
        default: darkMode ? "#121212" : "#f5f5f5",
        paper: darkMode ? "#1e1e1e" : "#ffffff",
      },
    },
    typography: {
      fontFamily: [
        '"Inter"',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      h4: {
        fontWeight: 700,
        letterSpacing: '-0.5px',
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            padding: '8px 20px',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: darkMode 
                ? '0px 5px 15px rgba(0, 0, 0, 0.3)' 
                : '0px 5px 15px rgba(0, 0, 0, 0.1)',
            },
          },
        },
      },
    },
  });

  const fetchData = async () => {
    if (!stock) return;
    
    setLoading(true);
    try {
      const [predictRes, infoRes, histRes] = await Promise.all([
        fetch("http://localhost:5000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stock }),
        }),
        fetch("http://localhost:5000/stock-info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stock }),
        }),
        fetch(`http://localhost:5000/chart-data`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stock }),
        })
      ]);

      const [predictData, infoData, histData] = await Promise.all([
        predictRes.json(),
        infoRes.json(),
        histRes.json()
      ]);

      // Find the stock name from our options
      const selectedStock = stockOptions.find(option => option.label === stock);
      if (selectedStock) {
        setStockName(selectedStock.name);
      }

      const chartData = {
        labels: histData.labels,
        datasets: [
          {
            label: "Close Price",
            data: histData.prices,
            borderColor: darkMode ? "#90caf9" : "#1976d2",
            backgroundColor: darkMode 
              ? "rgba(144, 202, 249, 0.1)" 
              : "rgba(25, 118, 210, 0.1)",
            borderWidth: 2,
            pointRadius: 0,
            fill: true,
            tension: 0.4,
          },
        ],
      };

      setPrediction(predictData);
      setStockInfo(infoData);
      setChartData(chartData);
    } catch (err) {
      console.error(err);
      setPrediction(null);
      setStockInfo(null);
      setChartData(null);
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchData();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{ 
          minHeight: '100vh',
          width:"100vw",
          background: darkMode 
            ? 'linear-gradient(to bottom, #0a0a0a, #121212)' 
            : 'linear-gradient(to bottom, #f5f5f5, #e0e0e0)',
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
            <Box display="flex" alignItems="center">
              <ShowChart sx={{ fontSize: 32, mr: 1.5, color: theme.palette.primary.main }} />
              <Typography variant="h4" fontWeight={600}>
                StockSense
              </Typography>
            </Box>
            <IconButton 
              onClick={() => setDarkMode(!darkMode)} 
              color="inherit"
              sx={{
                border: `1px solid ${darkMode ? '#444' : '#ddd'}`,
                borderRadius: 2,
                p: 1,
              }}
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Grid>

          <Paper 
            elevation={3} 
            sx={{ 
              p: isMobile ? 2 : 3, 
              mb: 4,
              background: darkMode 
                ? 'linear-gradient(145deg, #1e1e1e, #252525)' 
                : 'linear-gradient(145deg, #ffffff, #fafafa)',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
              Search for a stock symbol
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={9}>
                <Autocomplete
                  options={stockOptions}
                  getOptionLabel={(option) => `${option.label} (${option.name})`}
                  onInputChange={(event, newInputValue, reason) => {
                    if (reason === 'input') {
                      setStock(newInputValue.split(' (')[0]);
                    }
                  }}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setStock(newValue.label);
                      setStockName(newValue.name);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      label="Search stocks (e.g. AAPL, TCS.NS)" 
                      fullWidth 
                      onKeyPress={handleKeyPress}
                      InputProps={{
                        ...params.InputProps,
                        style: { borderRadius: 12 },
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ 
                          width: 24, height: 24, mr: 2,
                          bgcolor: darkMode ? '#333' : '#eee',
                          color: darkMode ? '#fff' : '#333',
                          fontSize: 12,
                        }}>
                          {option.label[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body1">{option.label}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.name}
                          </Typography>
                        </Box>
                      </Box>
                    </li>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={fetchData}
                  disabled={loading || !stock}
                  size="large"
                  sx={{
                    height: '56px',
                    borderRadius: 12,
                    boxShadow: 'none',
                    mt: isMobile ? 1 : 0,
                    '&:hover': {
                      boxShadow: 'none',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Analyze"
                  )}
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {stockName && (
            <Typography variant="h5" sx={{ mb: 3 }}>
              {stockName} ({stock})
            </Typography>
          )}

          {prediction && (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                {
                  label: "SVM Model",
                  data: prediction.svm,
                  icon: <TrendingUp sx={{ fontSize: 40 }} />,
                  color: "#4caf50"
                },
                {
                  label: "Random Forest Model",
                  data: prediction.rfc,
                  icon: <TrendingDown sx={{ fontSize: 40 }} />,
                  color: "#f44336"
                }
              ].map((model, idx) => (
                <Grid item xs={12} md={6} key={idx}>
                  <Card sx={{
                    bgcolor: darkMode 
                      ? model.data.prediction 
                        ? 'rgba(76, 175, 80, 0.1)' 
                        : 'rgba(244, 67, 54, 0.1)'
                      : model.data.prediction 
                        ? 'rgba(76, 175, 80, 0.05)' 
                        : 'rgba(244, 67, 54, 0.05)',
                    borderLeft: `4px solid ${model.color}`,
                    height: '100%',
                  }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Box sx={{
                          bgcolor: darkMode 
                            ? `${model.color}30` 
                            : `${model.color}20`,
                          p: 1.5,
                          borderRadius: 3,
                          mr: 2,
                          display: 'flex',
                        }}>
                          {model.icon}
                        </Box>
                        <Typography variant="h6" fontWeight={600}>
                          {model.label}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" alignItems="center" mb={1}>
                        <Typography variant="body1" sx={{ mr: 1 }}>
                          Prediction:
                        </Typography>
                        <Chip
                          label={model.data.prediction === 1 ? "Market Up" : "Market Down"}
                          size="small"
                          sx={{
                            bgcolor: model.data.prediction 
                              ? darkMode ? '#2e7d32' : '#4caf50' 
                              : darkMode ? '#c62828' : '#f44336',
                            color: '#fff',
                            fontWeight: 500,
                          }}
                        />
                      </Box>
                      
                      <Box display="flex" alignItems="center">
                        <Typography variant="body1" sx={{ mr: 1 }}>
                          Confidence:
                        </Typography>
                        <Chip
                          label={`${(model.data.precision_score * 100).toFixed(1)}%`}
                          size="small"
                          sx={{
                            bgcolor: darkMode ? '#333' : '#eee',
                            fontWeight: 500,
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {stockInfo && (
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Stock Information
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  {Object.entries(stockInfo).map(([key, value]) => (
                    <Grid item xs={6} sm={4} md={3} key={key}>
                      <Box sx={{ p: 1.5 }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {key.replace(/_/g, ' ')}
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {typeof value === 'string' || typeof value === 'number' 
                            ? value 
                            : 'N/A'}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )}

          {chartData && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Price History
                </Typography>
                <Box sx={{ height: isMobile ? 300 : 400 }}>
                  <Line 
                    data={chartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          mode: 'index',
                          intersect: false,
                          backgroundColor: darkMode ? '#333' : '#fff',
                          titleColor: darkMode ? '#fff' : '#333',
                          bodyColor: darkMode ? '#eee' : '#666',
                          borderColor: darkMode ? '#444' : '#ddd',
                          borderWidth: 1,
                          padding: 12,
                          cornerRadius: 12,
                          displayColors: false,
                          callbacks: {
                            label: (context) => {
                              return `Price: $${context.parsed.y.toFixed(2)}`;
                            },
                          },
                        },
                      },
                      scales: {
                        x: {
                          grid: { display: false, drawBorder: false },
                          ticks: { color: darkMode ? '#999' : '#666' },
                        },
                        y: {
                          grid: {
                            color: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                            drawBorder: false,
                          },
                          ticks: {
                            color: darkMode ? '#999' : '#666',
                            callback: (value) => `$${value}`,
                          },
                        },
                      },
                      interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false,
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;