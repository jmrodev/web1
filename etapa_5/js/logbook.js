document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  const contactDateInput = document.getElementById('contact-date');
  const contactTimeInput = document.getElementById('contact-time');
  const contactCallsignInput = document.getElementById('contact-callsign');
  const contactFrequencyInput = document.getElementById('contact-frequency');
  const contactModeInput = document.getElementById('contact-mode');
  const contactRstSentInput = document.getElementById('contact-rst-sent');
  const contactRstReceivedInput = document.getElementById('contact-rst-received');
  const contactQthInput = document.getElementById('contact-qth');
  const contactNotesInput = document.getElementById('contact-notes');

  const tableBody = document.getElementById('table-body');
  const addContactBtn = document.getElementById('add-contact-btn');
  const updateContactBtn = document.getElementById('update-contact-btn');
  const statusMessage = document.getElementById('status-message');

  // Modal de confirmación
  const confirmationModal = document.getElementById('confirmation-modal');
  const confirmDeleteBtn = confirmationModal.querySelector('.confirm-btn');
  const cancelDeleteBtn = confirmationModal.querySelector('.cancel-btn');
  let contactToDeleteId = null;

  let editingContactId = null;

  const contacts = [];

  const LAST_CONTACT_STORAGE_KEY = 'lastRadioContact';
  const PERSISTENT_FIELDS = [
    'frequency',
    'mode',
    'rstSent',
    'rstReceived',
    'notes',
  ];

  // Función para mostrar mensajes de estado (error/éxito)
  function showMessage(element, message, type = 'error') {
    element.textContent = message;
    element.classList.remove('hidden', 'error', 'success');
    element.classList.add(type);
    setTimeout(() => {
      element.classList.add('hidden');
    }, 5000);
  }

  function setEditingContact(id) {
    contactToDeleteId = null;
    editingContactId = id;
    addContactBtn.style.display = 'none';
    updateContactBtn.style.display = 'inline-block';
  }

  function resetEditingContact() {
    editingContactId = null;
    addContactBtn.style.display = 'inline-block';
    updateContactBtn.style.display = 'none';
    contactForm.reset(); // Reset the form first
    loadLastContactData(); // Then load persistent data
    setCurrentDateTime(); // Then set current date/time
  }

  // Función para renderizar la tabla con los datos
  function renderTable(data) {
    tableBody.innerHTML = '';
    if (data.length === 0) {
      const row = document.createElement('tr');
      const empty = document.createElement('td');
      empty.setAttribute('colspan', 11); // Updated colspan for new columns
      empty.classList.add('empty');
      empty.textContent = 'No hay contactos para mostrar.';
      row.appendChild(empty);
      tableBody.appendChild(row);
      return;
    }
    data.forEach((contact, index) => {
      const row = document.createElement('tr');
      contact.id = index + 1;
      [
        'id',
        'date',
        'time',
        'callsign',
        'frequency',
        'mode',
        'rstSent',
        'rstReceived',
        'qth',
        'notes',
      ].forEach((attr) => {
        const td = document.createElement('td');
        td.textContent = contact[attr];
        row.appendChild(td);
      });

      const actions = document.createElement('td');
      actions.classList.add('table-actions');
      const edit = document.createElement('button');
      edit.classList.add('edit-btn');
      edit.textContent = 'Editar';
      edit.addEventListener('click', () => {
        setEditingContact(contact.id);
        contactDateInput.value = contact.date;
        contactTimeInput.value = contact.time;
        contactCallsignInput.value = contact.callsign.toUpperCase();
        contactFrequencyInput.value = contact.frequency;
        contactModeInput.value = contact.mode;
        contactRstSentInput.value = contact.rstSent;
        contactRstReceivedInput.value = contact.rstReceived;
        contactQthInput.value = contact.qth;
        contactNotesInput.value = contact.notes;
      });
      actions.appendChild(edit);

      const del = document.createElement('button');
      del.classList.add('delete-btn');
      del.textContent = 'Eliminar';
      del.addEventListener('click', () => {
        contactToDeleteId = contact.id;
        resetEditingContact();
        contactForm.reset();
        confirmationModal.style.display = 'flex';
      });
      actions.appendChild(del);
      row.appendChild(actions);
      tableBody.appendChild(row);
    });
  }

  // Función para cargar datos al DOM desde el arreglo de contactos.
  function loadData() {
    renderTable(contacts);
  }

  // Guarda los datos del último contacto (excepto fecha, hora, QTH) en localStorage
  function saveLastContactData(contact) {
    const lastContactData = {};
    PERSISTENT_FIELDS.forEach(field => {
      if (contact[field] !== undefined) {
        lastContactData[field] = contact[field];
      }
    });
    localStorage.setItem(LAST_CONTACT_STORAGE_KEY, JSON.stringify(lastContactData));
  }

  // Carga los datos del último contacto desde localStorage y pre-rellena el formulario
  function loadLastContactData() {
    const storedData = localStorage.getItem(LAST_CONTACT_STORAGE_KEY);
    if (storedData) {
      const lastContact = JSON.parse(storedData);
      contactCallsignInput.value = (lastContact.callsign || '').toUpperCase();
      contactFrequencyInput.value = lastContact.frequency || '';
      contactModeInput.value = lastContact.mode || '';
      contactRstSentInput.value = lastContact.rstSent || '';
      contactRstReceivedInput.value = lastContact.rstReceived || '';
      contactNotesInput.value = lastContact.notes || '';
    }
  }

  // Establece la fecha y hora actual en UTC
  function setCurrentDateTime() {
    const now = new Date();

    const year = now.getUTCFullYear();
    const month = (now.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = now.getUTCDate().toString().padStart(2, '0');
    const hours = now.getUTCHours().toString().padStart(2, '0');
    const minutes = now.getUTCMinutes().toString().padStart(2, '0');
    const seconds = now.getUTCSeconds().toString().padStart(2, '0');

    const date = `${year}-${month}-${day}`;
    const time = `${hours}:${minutes}:${seconds}`;

    contactDateInput.value = date;
    contactTimeInput.value = time.substring(0, 5); // HH:MM
  }

  // Manejar el envío del formulario (Agregar/Actualizar)
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const date = contactDateInput.value;
    const time = contactTimeInput.value;
    const callsign = contactCallsignInput.value.trim().toUpperCase();
    const frequency = parseFloat(contactFrequencyInput.value);
    const mode = contactModeInput.value.trim();
    const rstSent = contactRstSentInput.value.trim();
    const rstReceived = contactRstReceivedInput.value.trim();
    const qth = contactQthInput.value.trim();
    const notes = contactNotesInput.value.trim();

    if (!date || !time || !callsign || isNaN(frequency) || !mode || !rstSent || !rstReceived || !qth) {
      showMessage(statusMessage, 'Por favor, completa todos los campos obligatorios.', 'error');
      return;
    }

    const contactData = {
      date,
      time,
      callsign,
      frequency,
      mode,
      rstSent,
      rstReceived,
      qth,
      notes,
    };

    if (editingContactId) {
      contacts[editingContactId - 1] = contactData;
      showMessage(statusMessage, 'Contacto actualizado con éxito.', 'success');
    } else {
      contacts.push(contactData);
      showMessage(statusMessage, 'Contacto agregado con éxito.', 'success');
    }
    saveLastContactData(contactData); // Save persistent data after add/update
    resetEditingContact();
    loadData();
  });

  contactForm.addEventListener('reset', resetEditingContact);

  // Lógica del modal de confirmación
  confirmDeleteBtn.addEventListener('click', () => {
    confirmationModal.style.display = 'none';

    if (contactToDeleteId) {
      contacts.splice(contactToDeleteId - 1, 1);
      showMessage(statusMessage, 'Contacto eliminado con éxito.', 'success');
      loadData();
      contactToDeleteId = null;
    }
  });

  cancelDeleteBtn.addEventListener('click', () => {
    confirmationModal.style.display = 'none';
    contactToDeleteId = null;
  });

  // Cargar los datos iniciales al cargar la página
  loadData();
  loadLastContactData(); // Load persistent data on initial load
  setCurrentDateTime(); // Set current date/time on initial load
});