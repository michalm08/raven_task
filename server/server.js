const express = require('express');
const { DocumentStore } = require('ravendb');
const { calculateFee } = require('./utils');

const app = express();
const port = 4000;
//cors
var cors = require('cors');
app.use(cors());

// middleware
app.use(express.json());

// Start server
app.listen(port, () => {
  console.log(`Serwer is working at: http://localhost:${port}`);
});

const store = new DocumentStore('http://live-test.ravendb.net', 'parkingTask');
store.conventions.findCollectionNameForObjectLiteral = (entity) =>
  entity['collection'];
store.initialize();

app.post('/area', async (req, res) => {
  const { name, rate1, rate2, discount } = req.body;

  if (
    !name ||
    typeof rate1 !== 'number' ||
    typeof rate2 !== 'number' ||
    typeof discount !== 'number'
  ) {
    return res.status(400).send();
  }

  let area = {
    collection: 'Areas',
    name,
    rate1,
    rate2,
    discount,
  };

  try {
    const session = store.openSession();
    await session.store(area);
    await session.saveChanges();
    res.status(200).send();
  } catch (error) {
    res.status(500).send();
  }
});

app.get('/areas', async (req, res) => {
  try {
    const session = store.openSession();
    let areas = await session.query({ collection: 'Areas' }).all();
    areas = areas.map((area) => ({
      name: area.name,
      rate1: area.rate1,
      rate2: area.rate2,
      discount: area.discount,
      id: area['@metadata']['@id'],
    }));
    res.status(200).json(areas);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.patch('/area', async (req, res) => {
  try {
    const session = store.openSession();
    const { id, name, rate1, rate2, discount } = req.body;
    const document = await session.load(id);
    if (document) {
      document.name = name;
      document.rate1 = rate1;
      document.rate2 = rate2;
      document.discount = discount;

      await session.saveChanges();
      res.status(200).send();
    } else {
      res.status(404).send();
    }
  } catch (error) {
    res.status(500).send();
  }
});

app.delete('/area', async (req, res) => {
  const session = store.openSession();
  try {
    const document = await session.load(req.body.id);
    if (document) {
      await session.delete(req.body.id);
      await session.saveChanges();
      res.status(200).send();
    } else {
      res.status(500).send();
    }
  } catch (error) {
    res.status(500).send();
  }
});

app.post('/calculate', async (req, res) => {
  try {
    const calculatedFee = calculateFee(req.body);
    res.status(200).send(calculatedFee);
  } catch (error) {
    res.status(500).send();
  }
});
