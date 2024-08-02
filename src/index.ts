import express from 'express';

const app = express();

app.get('/', (_req, res) => {
  // Renamed req to _req
  res.send('Hello World!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
