# Integración de MetaMask con Ethers.js y React

## Descripción

Este proyecto demuestra cómo integrar MetaMask con una aplicación React utilizando la biblioteca `ethers.js`. Incluye funcionalidad para conectar a MetaMask, recuperar información de la cuenta, consultar el saldo y detalles de la red, y desconectar de MetaMask.

## Funcionalidades

- **Conectar a MetaMask:** Permite a los usuarios conectar su billetera MetaMask.
- **Recuperar Información de la Cuenta:** Muestra la dirección de la cuenta conectada.
- **Consultar Saldo:** Muestra el saldo de la cuenta conectada en ETH.
- **Detalles de la Red:** Proporciona el nombre de la red de Ethereum a la que el usuario está conectado.
- **Desconectar:** Permite a los usuarios desconectar su billetera MetaMask.

## Tecnologías Utilizadas

- **React:** Framework de frontend para construir la interfaz de usuario.
- **ethers.js:** Biblioteca para interactuar con la blockchain de Ethereum.
- **MetaMask:** Extensión del navegador para gestionar cuentas de Ethereum.
- **react-toastify:** Biblioteca para mostrar notificaciones en la interfaz de usuario.

## Instalación

Para configurar este proyecto localmente, sigue estos pasos:

1. **Clona el Repositorio:**

   ```bash
   git clone https://github.com/ToshiroInami/Toshiro_Metamask/tree/develop

2. **Navega al Directorio del Proyecto:**

bash
cd tu-nombre-de-repositorio

3. **Instala las Dependencias:**

Asegúrate de tener Node.js y npm instalados. Luego ejecuta:

bash
-npm install

4. **Inicia el Servidor de Desarrollo:**

bash
-npm start

La aplicación se ejecutará en http://localhost:3000.


## Uso
Abre la Aplicación: Navega a http://localhost:3000 en tu navegador.

**Conectar MetaMask:**
Haz clic en el botón "Conectar MetaMask" para solicitar acceso a MetaMask.
Si MetaMask no está instalado, aparecerá una notificación pidiendo que lo instales.

**Ver Información de la Cuenta:**
Una vez conectado, la aplicación mostrará la dirección de la cuenta conectada, el saldo y los detalles de la red.
El botón "Desconectar MetaMask" borrará la información mostrada y pedirá al usuario que se desconecte.

**Desconectar MetaMask:**
Haz clic en el botón "Desconectar MetaMask" para borrar la información de la cuenta y desconectar de MetaMask.

## Ejemplo de Código para integrar MetaMask con (ethers.js y React):
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [networkName, setNetworkName] = useState("");
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
            setNetworkName(network.name || "Red Desconocida");
          }
        })
        .catch(error => {
          console.error('Error al obtener cuentas:', error);
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
          setNetworkName(network.name || "Red Desconocida");
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
                <li>Asegúrate de estar en una red compatible.</li>
                <li>Acepta la solicitud en MetaMask.</li>
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
            <p><strong>Saldo:</strong> {balance} ETH</p>
            <p><strong>Red:</strong> {networkName}</p>
            <button className="disconnect-button" onClick={disconnectWallet}>
              Desconectar MetaMask
            </button>
          </div>
        )}
        {!account && !hasClosedModal && (
          <p className="info-message">Por favor, desconecta tu cuenta de MetaMask siguiendo los pasos en la notificación.</p>
        )}
        {showConnectButton && (
          <button className="connect-button" onClick={connectWallet}>
            Conectar MetaMask
          </button>
        )}
      </div>

      <ToastContainer
        position="top-left"
        autoClose={4000}
        hideProgressBar={false}
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

## Enlaces Útiles
MetaMask (https://metamask.io/)
ethers.js Documentation (https://docs.ethers.org/v5/)
React Documentation (https://react.dev/)

## Librerías y Dependencias
react: ^18.2.0
ethers: ^6.7.0
react-toastify: ^9.2.0

## Contacto
Si tienes alguna pregunta o sugerencia, no dudes en contactarme:
Correo Electrónico: toshiro.inami@vallegrande.edu.pe
GitHub: ToshiroInami