// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const ethers = require('ethers');

// defining the Express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// defining an starting endpoint
app.get('/', (req, res) => {
  res.send([{title: 'Starting'}]);
});

app.get('/wallet/new', (req, res) => {
    const wallet = ethers.Wallet.createRandom();

    const response = {
        privateKey: wallet.privateKey,
        address: wallet.address,
        mnemonic: wallet._mnemonic().phrase
    };

    res.send({ data: response });
});

app.get('/wallet/recovery', (req, res) => {
    const {mnemonic} = req.query;
    const wallet = ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/0`);

    const response = {
        privateKey: wallet.privateKey,
        address: wallet.address,
        mnemonic: wallet._mnemonic().phrase
    };

    res.send({ data: response });
});

app.get('/wallet/balance', async (req, res) => {
    const {address} = req.query;
    const provider = ethers.getDefaultProvider();
    const balance = await provider.getBalance(address);
    const balanceFormat = ethers.utils.formatEther(balance);

    res.send({balance: balanceFormat});
});

// starting the server
app.listen(3001, () => {
  console.log('listening on port 3001');
});