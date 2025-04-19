import {
  Box,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";

const StockInfo = ({ stockInfo }) => {
  const entries = Object.entries(stockInfo);
  const pairedRows = [];
  for (let i = 0; i < entries.length; i += 2) {
    const pair = [entries[i], entries[i + 1]];
    pairedRows.push(pair);
  }

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Stock Information
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Box sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableBody>
              {pairedRows.map((pair, idx) => (
                <TableRow key={idx}>
                  {pair.map(([key, value]) => (
                    <React.Fragment key={key}>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                          minWidth: 120,
                        }}
                      >
                        {key
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                      </TableCell>
                      <TableCell>
                        {typeof value === "string" || typeof value === "number"
                          ? value
                          : "N/A"}
                      </TableCell>
                    </React.Fragment>
                  ))}
                  {pair.length < 2 && (
                    <>
                      <TableCell />
                      <TableCell />
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StockInfo;
