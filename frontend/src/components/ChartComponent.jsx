import { Box, Card, CardContent, Typography } from "@mui/material";
import React from "react";
import { Line } from "react-chartjs-2";


const ChartComponent = ({ darkMode, chartData, isMobile }) => {
  return (
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
                  mode: "index",
                  intersect: false,
                  backgroundColor: darkMode ? "#333" : "#fff",
                  titleColor: darkMode ? "#fff" : "#333",
                  bodyColor: darkMode ? "#eee" : "#666",
                  borderColor: darkMode ? "#444" : "#ddd",
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
                  ticks: { color: darkMode ? "#999" : "#666" },
                },
                y: {
                  grid: {
                    color: darkMode
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)",
                    drawBorder: false,
                  },
                  ticks: {
                    color: darkMode ? "#999" : "#666",
                    callback: (value) => `$${value}`,
                  },
                },
              },
              interaction: {
                mode: "nearest",
                axis: "x",
                intersect: false,
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ChartComponent;
