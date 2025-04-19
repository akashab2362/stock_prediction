import { TrendingDown, TrendingUp } from "@mui/icons-material";
import { Box, Card, CardContent, Chip, Grid, Typography } from "@mui/material";
import React from "react";

const Prediction = ({ prediction, darkMode }) => {
  const models = [
    {
      label: "SVM Model",
      data: prediction?.svm,
    },
    {
      label: "Random Forest Model",
      data: prediction?.rfc,
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {models.map((model, idx) => {
        const isUp = model.data?.prediction === 1;
        const borderColor = isUp ? "#4caf50" : "#f44336";
        const icon = isUp ? (
          <TrendingUp sx={{ fontSize: 40 }} />
        ) : (
          <TrendingDown sx={{ fontSize: 40 }} />
        );

        return (
          <Grid item xs={12} md={6} key={idx}>
            <Card
              sx={{
                bgcolor: darkMode
                  ? isUp
                    ? "rgba(76, 175, 80, 0.1)"
                    : "rgba(244, 67, 54, 0.1)"
                  : isUp
                  ? "rgba(76, 175, 80, 0.05)"
                  : "rgba(244, 67, 54, 0.05)",
                borderLeft: `4px solid ${borderColor}`,
                height: "100%",
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Box
                    sx={{
                      bgcolor: darkMode
                        ? `${borderColor}30`
                        : `${borderColor}20`,
                      p: 1.5,
                      borderRadius: 3,
                      mr: 2,
                      display: "flex",
                    }}
                  >
                    {icon}
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
                    label={isUp ? "Market Up" : "Market Down"}
                    size="small"
                    sx={{
                      bgcolor: isUp
                        ? darkMode
                          ? "#2e7d32"
                          : "#4caf50"
                        : darkMode
                        ? "#c62828"
                        : "#f44336",
                      color: "#fff",
                      fontWeight: 500,
                    }}
                  />
                </Box>

                <Box display="flex" alignItems="center">
                  <Typography variant="body1" sx={{ mr: 1 }}>
                    Confidence:
                  </Typography>
                  <Chip
                    label={
                      isNaN(model.data?.precision_score)
                        ? "N/A"
                        : `${(model.data.precision_score * 100).toFixed(1)}%`
                    }
                    size="small"
                    sx={{
                      bgcolor: darkMode ? "#333" : "#eee",
                      fontWeight: 500,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Prediction;
