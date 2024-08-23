import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Estilos predeterminados para las notificaciones
import "./App.css";

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [networkName, setNetworkName] = useState("");
  const [latestBlockNumber, setLatestBlockNumber] = useState(null);
  const [latestBlockHash, setLatestBlockHash] = useState(null);
  const [latestTransactionHash, setLatestTransactionHash] = useState(null);
  const [hasClosedModal, setHasClosedModal] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      const providerInstance = new ethers.BrowserProvider(window.ethereum);
      setProvider(providerInstance);

      providerInstance.send("eth_accounts", [])
        .then(async (accounts) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            const balance = await providerInstance.getBalance(accounts[0]);
            setBalance(ethers.formatEther(balance));

            const network = await providerInstance.getNetwork();
            setNetworkName(network.name || "Unknown Network");

            const latestBlock = await providerInstance.getBlock("latest");
            setLatestBlockNumber(latestBlock.number);
            setLatestBlockHash(latestBlock.hash);

            // Get latest transaction (just an example, requires further implementation)
            if (latestBlock.transactions.length > 0) {
              const tx = await providerInstance.getTransaction(latestBlock.transactions[0]);
              setLatestTransactionHash(tx.hash);
            }
          }
        })
        .catch(error => {
          console.error('Error fetching accounts:', error);
        });
    } else {
      toast.error(
        <>
          <p><strong>¡Por favor, instala MetaMask!</strong></p>
          <ol>
            <li>Descarga e instala MetaMask desde el navegador.</li>
            <li>Configura tu cuenta.</li>
            <li>Vuelve a cargar la página.</li>
          </ol>
        </>,
        {
          autoClose: 4000, // Cierra automáticamente después de 4 segundos
          closeButton: true,
          progress: 100, // Habilita la barra de progreso
          className: 'toast-notification',
        }
      );
    }
  }, []);

  const connectWallet = async () => {
    if (provider) {
      try {
        const accounts = await provider.send("eth_requestAccounts", []);
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const balance = await provider.getBalance(accounts[0]);
          setBalance(ethers.formatEther(balance));

          const network = await provider.getNetwork();
          setNetworkName(network.name || "Unknown Network");

          const latestBlock = await provider.getBlock("latest");
          setLatestBlockNumber(latestBlock.number);
          setLatestBlockHash(latestBlock.hash);

          if (latestBlock.transactions.length > 0) {
            const tx = await provider.getTransaction(latestBlock.transactions[0]);
            setLatestTransactionHash(tx.hash);
          }
        }
      } catch (error) {
        if (error.code === -32002) {
          toast.info(
            <>
              <p><strong>Ya se está procesando una solicitud de cuentas.</strong></p>
              <p>Por favor, espere a que se complete la solicitud.</p>
            </>,
            {
              autoClose: 4000, // Cierra automáticamente después de 4 segundos
              closeButton: true,
              progress: 100, // Habilita la barra de progreso
              className: 'toast-notification',
            }
          );
        } else {
          toast.error(
            <>
              <p><strong>Acceso a la cuenta denegado por el usuario.</strong></p>
              <ol>
                <li>Asegúrate de a ver puesto la contraseña en la extensión.</li>
              </ol>
            </>,
            {
              autoClose: 4000, // Cierra automáticamente después de 4 segundos
              closeButton: true,
              progress: 100, // Habilita la barra de progreso
              className: 'toast-notification',
            }
          );
        }
      }
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setBalance(null);
    setNetworkName("");
    setLatestBlockNumber(null);
    setLatestBlockHash(null);
    setLatestTransactionHash(null);

    toast.info(
      <>
        <p><strong>Por favor, desconecta tu cuenta de MetaMask siguiendo estos pasos:</strong></p>
        <ol>
          <li>Abre MetaMask como una extensión en tu navegador.</li>
          <li>Haz clic en el ícono de MetaMask en la barra de herramientas.</li>
          <li>Selecciona el ícono de perfil (generalmente tres puntos verticales o un menú de configuración).</li>
          <li>Elige "Cerrar sesión" o "Desconectar cuenta" en el menú desplegable.</li>
        </ol>
      </>,
      {
        autoClose: 4000, // Cierra automáticamente después de 4 segundos
        closeButton: true,
        progress: 100, // Habilita la barra de progreso
        className: 'toast-notification',
      }
    );
    setHasClosedModal(true);
  };

  const showConnectButton = !account && hasClosedModal;

  return (
    <div className="app-container">
      <h1 className="app-title">Conectar MetaMask con React</h1>
      <div className="account-info">
        {account && (
          <div className="connected-info">
            <p><strong>Cuenta conectada:</strong> {account}</p>
            <p><strong>Balance:</strong> {balance} ETH</p>
            <p><strong>Red:</strong> {networkName}</p>
            <p><strong>Último Bloque Número:</strong> {latestBlockNumber}</p>
            <p><strong>Último Bloque Hash:</strong> {latestBlockHash}</p>
            <p><strong>Última Transacción Hash:</strong> {latestTransactionHash}</p>
            <button className="disconnect-button" onClick={disconnectWallet}>
              Desconectar MetaMask
            </button>
          </div>
        )}
        {!account && !hasClosedModal && (
          <p className="info-message">Por favor, conectate tu cuenta de MetaMask siguiendo los pasos en la extensión.</p>
        )}
        {showConnectButton && (
          <button className="connect-button" onClick={connectWallet}>
            Conectar MetaMask
          </button>
        )}
      </div>

      {/* Contenedor para las notificaciones */}
      <ToastContainer
        position="top-left" // Mostrar notificaciones en la parte superior izquierda
        autoClose={4000} // Cierra automáticamente después de 4 segundos
        hideProgressBar={false} // Muestra la barra de progreso
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
