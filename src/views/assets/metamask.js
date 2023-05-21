(async () => {
  const connectBtn = document.getElementById('metamaskSnapIntegrateBtn');
  const alertContainer = document.getElementById('alertContainer');

  // button handlers
  if (connectBtn) {
    connectBtn.addEventListener('click', connectBtnHandler);
  }
  let isFlaskInstalled;
  let provider;

  try {
    // This resolves to the value of window.ethereum or null
    provider = await detectEthereumProvider();

    // web3_clientVersion returns the installed MetaMask version as a string
    const isFlask = (
      await provider?.request({ method: 'web3_clientVersion' })
    )?.includes('flask');
    isFlaskInstalled = provider && isFlask;
    if (!isFlaskInstalled) {
      let alertMsg = `<p>Metamask Flask extension was not detected on your browser. Metamask Flask must be installed and enabled to connect the CAML Snap.</p> 
       <p>Please follow the instructions <a href="https://metamask.io/flask/" rel="noopener noreferrer" target="_blank"> here</a> to install Metamask Flask on your browser.</p>`;
      showAlert(alertMsg);
      disableConnectBtn();
    }
  } catch (err) {
    console.log('unexpected error', err.message);
    showAlert(
      '<p>Unable to verify Metamask installation. Please try reloading the page.</p>'
    );
    disableConnectBtn();
  }

  function showAlert(innerText, type = 'warning') {
    if (type == 'info') {
      alertContainer.classList.remove('alert-warning');
      alertContainer.classList.add('alert-info');
    } else {
      alertContainer.classList.remove('alert-info');
      alertContainer.classList.add('alert-warning');
    }
    alertContainer.innerHTML = innerText;
    alertContainer.classList.remove('d-none');
  }

  function disableConnectBtn() {
    connectBtn.classList.add('disabled');
  }

  function setConnectBtnTxt(txt) {
    connectBtn.innerHTML = txt;
  }

  async function connectBtnHandler(event) {
    event.preventDefault();
    // verify CAML Snap is installed and enabled
    await verifyCAMLSnap();
  }

  async function verifyCAMLSnap() {
    if (!isFlaskInstalled) {
      return;
    }
    const camlSnapID = 'npm:@container23/caml-metamask-snap';
    const camlSnapVersion = ''; // for the moment use latest, until stable
    const result =
      (await provider.request({
        method: 'wallet_requestSnaps',
        params: {
          [camlSnapID]: { version: camlSnapVersion },
        },
      })) || {};

    if (!result[camlSnapID]) {
      showAlert(
        '<p>The CAML Snap is not installed on your Metamask extension. Please click Connect button below to install it.</p>'
      );
      return;
    }

    if (result[camlSnapID].enabled) {
      let msg = `<p>CAML MetaMask Snap is already installed. Open MetaMask to use CAML insights!</p>
      <p>The CAML insights will be displayed on MetaMask during transaction confirmation.<p>`;
      showAlert(msg, 'info');
      setConnectBtnTxt('CAML Already Connected!');
      disableConnectBtn();
    } else {
      showAlert(
        '<p>The CAML Snap is not enabled on your Metamask extension. Please verify your MetaMask settings to enable it.</p>'
      );
    }
  }
})();
