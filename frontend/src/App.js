import React, { useState } from 'react';
import './App.css'; // Import the CSS file for styling

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [positions, setPositions] = useState([]);

  const fetchDeFiPositions = async () => {
    const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
    const url = `https://deep-index.moralis.io/api/v2.2/wallets/${walletAddress}/defi/positions?chain=eth`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'X-API-Key': process.env.REACT_APP_MORALIS_API_KEY
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPositions(data);
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleInputChange = (event) => {
    setWalletAddress(event.target.value);
  };

  const calculateTotalUSDValue = () => {
    return positions.reduce((total, position) => {
      const positionTotalUSD = position.position.tokens.reduce((acc, token) => acc + (token.usd_value || 0), 0);
      return total + positionTotalUSD;
    }, 0);
  };

  return (
    <div className="container">
      <img src="https://admin.moralis.io/assets/moralisLogo-DnjUHa6D.svg" alt="Moralis Logo" className="moralis-logo" />
      <h1>Get Wallet DeFi Positions</h1>
      <p>
        <a href="https://docs.moralis.io/web3-data-api/evm/reference/get-defi-positions-summary?address=0xcB1C1FdE09f811B294172696404e88E658659905&chain=eth" target="_blank" rel="noopener noreferrer">
          Get DeFi positions by wallet API
        </a>
      </p>
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter wallet address"
          value={walletAddress}
          onChange={handleInputChange}
        />
        <button onClick={fetchDeFiPositions}>Fetch Positions</button>
      </div>

      <div className="positions-table">
        {positions.length > 0 ? (
          positions.map((position, index) => {
            // Calculate total USD value for each position
            const totalUSDValue = position.position.tokens.reduce((acc, token) => acc + (token.usd_value || 0), 0);

            return (
              <div key={index} className="position-section">
                <h2>{position.protocol_name}</h2>
                <div className="position-label">
                  <p>{position.position.label}</p>
                  <span>Total USD Value: ${totalUSDValue.toFixed(2)}</span>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Token Type</th>
                      <th>Name</th>
                      <th>Symbol</th>
                      <th>Balance</th>
                      <th>USD Value</th>
                      <th>Logo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {position.position.tokens.map((token, idx) => (
                      <tr key={idx}>
                        <td>{token.token_type}</td>
                        <td>{token.name}</td>
                        <td>{token.symbol}</td>
                        <td>{token.balance_formatted}</td>
                        <td>{token.usd_value ? `$${token.usd_value.toFixed(2)}` : 'N/A'}</td>
                        <td>
                          {token.logo && (
                            <img src={token.logo} alt={`${token.name} logo`} width={30} />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })
        ) : (
          <></>
        )}
      </div>
      {positions.length > 0 && (
        <div className="total-usd">
          <h3>Total USD Value Across All Positions: ${calculateTotalUSDValue().toFixed(2)}</h3>
        </div>
      )}
    </div>
  );
}

export default App;
