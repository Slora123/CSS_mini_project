'use strict';

function strToBytes(str) {
  return new TextEncoder().encode(str);
}

function bytesToHex(bytes) {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function computeHMAC(keyStr, messageStr) {
  const keyBytes = strToBytes(keyStr);
  const msgBytes = strToBytes(messageStr);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgBytes);
  return bytesToHex(new Uint8Array(signature));
}

let simState = {
  senderMessage: '',
  senderKey: '',
  senderMAC: '',
  attackerEnabled: false,
  transmitted: false
};

document.addEventListener('DOMContentLoaded', () => {
  const btnSenderGenerate = document.getElementById('btnSenderGenerate');
  const btnAttackerTamper = document.getElementById('btnAttackerTamper');
  const btnAttackerForward = document.getElementById('btnAttackerForward');
  const btnReceiverVerify = document.getElementById('btnReceiverVerify');
  const btnResetSim = document.getElementById('btnResetSim');
  const attackerToggle = document.getElementById('attackerToggle');

  btnSenderGenerate.addEventListener('click', async () => {
    const message = document.getElementById('sender-message').value;
    const key = document.getElementById('sender-key').value.trim();
    const senderError = document.getElementById('sender-error');

    if (!key || !message) {
      senderError.textContent = 'Please enter both message and key.';
      senderError.style.display = 'block';
      return;
    }
    senderError.style.display = 'none';
    btnSenderGenerate.disabled = true;

    try {
      const mac = await computeHMAC(key, message);
      simState.senderMessage = message;
      simState.senderKey = key;
      simState.senderMAC = mac;
      simState.transmitted = true;

      document.getElementById('sender-tag-display').textContent = mac;
      document.getElementById('sender-transmitted').textContent = message + ' || ' + mac;
      document.getElementById('sender-result').style.display = 'block';

      if (attackerToggle.checked) {
        populateAttacker(message, mac);
      } else {
        showReceiverDirect(message, mac);
      }
    } catch (err) {
      senderError.textContent = 'Error computing MAC: ' + err.message;
      senderError.style.display = 'block';
    } finally {
      btnSenderGenerate.disabled = false;
    }
  });

  attackerToggle.addEventListener('change', () => {
    simState.attackerEnabled = attackerToggle.checked;
    if (attackerToggle.checked) {
      document.getElementById('sim-attacker-wrapper').style.display = 'block';
      if (simState.transmitted) {
        populateAttacker(simState.senderMessage, simState.senderMAC);
      }
    } else {
      document.getElementById('sim-attacker-wrapper').style.display = 'none';
      if (simState.transmitted) {
        showReceiverDirect(simState.senderMessage, simState.senderMAC);
      }
    }
  });

  btnAttackerTamper.addEventListener('click', () => {
    const modifiedMsgEl = document.getElementById('attacker-modified-msg');
    let current = modifiedMsgEl.value;
    if (current.includes('$5,000')) {
      modifiedMsgEl.value = current.replace('$5,000', '$95,000');
    } else if (current.includes('$95,000')) {
      modifiedMsgEl.value = current.replace('$95,000', '$5,000');
    } else {
      modifiedMsgEl.value = current + ' [TAMPERED]';
    }
    document.getElementById('attacker-forged-result').style.display = 'none';
  });

  btnAttackerForward.addEventListener('click', async () => {
    const attackerMsg = document.getElementById('attacker-modified-msg').value;
    btnAttackerForward.disabled = true;

    try {
      const randBytes = new Uint8Array(16);
      crypto.getRandomValues(randBytes);
      const randomKey = bytesToHex(randBytes);
      const forgedMAC = await computeHMAC(randomKey, attackerMsg);

      document.getElementById('attacker-random-key').textContent = randomKey;
      document.getElementById('attacker-forged-mac').textContent = forgedMAC;
      document.getElementById('attacker-forged-result').style.display = 'block';

      showReceiverDirect(attackerMsg, forgedMAC);
    } catch (err) {
      console.error(err);
    } finally {
      btnAttackerForward.disabled = false;
    }
  });

  btnReceiverVerify.addEventListener('click', async () => {
    const receivedMsg = document.getElementById('receiver-got-msg').textContent;
    const receivedMac = document.getElementById('receiver-got-mac').textContent;
    const verdictEl = document.getElementById('receiver-verdict');
    btnReceiverVerify.disabled = true;

    try {
      const computedMac = await computeHMAC(simState.senderKey, receivedMsg);
      document.getElementById('receiver-computed-mac').textContent = computedMac;

      if (computedMac === receivedMac) {
        verdictEl.style.backgroundColor = '#d1fae5';
        verdictEl.style.color = '#065f46';
        verdictEl.innerHTML = `<strong>Verification PASSED - Message is Authentic!</strong><br>Computed MAC matches the received MAC.`;
      } else {
        verdictEl.style.backgroundColor = '#fee2e2';
        verdictEl.style.color = '#991b1b';
        verdictEl.innerHTML = `<strong>Verification FAILED - TAMPERING DETECTED!</strong><br>Computed MAC: ${escapeHTML(computedMac)}<br>Received MAC: ${escapeHTML(receivedMac)}<br>MAC mismatch indicates message was modified in transit.`;
      }
      document.getElementById('receiver-result').style.display = 'block';
    } catch (err) {
      console.error(err);
    } finally {
      btnReceiverVerify.disabled = false;
    }
  });

  btnResetSim.addEventListener('click', () => {
    simState = {
      senderMessage: '',
      senderKey: '',
      senderMAC: '',
      attackerEnabled: attackerToggle.checked,
      transmitted: false
    };
    document.getElementById('sender-message').value = 'Transfer $5,000 to Account #98412';
    document.getElementById('sender-key').value = 'mysecretkey123';
    document.getElementById('sender-result').style.display = 'none';
    document.getElementById('attacker-forged-result').style.display = 'none';
    document.getElementById('receiver-result').style.display = 'none';
    document.getElementById('sim-reset-area').style.display = 'none';
    document.getElementById('receiver-got-msg').textContent = '[Awaiting Transmission]';
    document.getElementById('receiver-got-mac').textContent = '[Awaiting Transmission]';
    if (attackerToggle.checked) {
      document.getElementById('attacker-original-msg').textContent = '';
      document.getElementById('attacker-original-mac').textContent = '';
      document.getElementById('attacker-modified-msg').value = '';
    }
  });

  function populateAttacker(message, mac) {
    document.getElementById('attacker-original-msg').textContent = message;
    document.getElementById('attacker-original-mac').textContent = mac;
    document.getElementById('attacker-modified-msg').value = message;
    document.getElementById('attacker-forged-result').style.display = 'none';
  }

  function showReceiverDirect(message, mac) {
    document.getElementById('receiver-got-msg').textContent = message;
    document.getElementById('receiver-got-mac').textContent = mac;
    document.getElementById('receiver-result').style.display = 'none';
    document.getElementById('sim-reset-area').style.display = 'block';
  }
});
