document.addEventListener('DOMContentLoaded', () => {
  const dataForm = document.getElementById('data-form');
  const itemNameInput = document.getElementById('item-name');
  const itemValueInput = document.getElementById('item-value');
  const tableBody = document.getElementById('table-body');
  const addItemBtn = document.getElementById('add-item-btn');
  const updateItemBtn = document.getElementById('update-item-btn');
  const statusMessage = document.getElementById('status-message');

  // Modal de confirmación
  const confirmationModal = document.getElementById('confirmation-modal');
  const confirmDeleteBtn = confirmationModal.querySelector('.confirm-btn');
  const cancelDeleteBtn = confirmationModal.querySelector('.cancel-btn');
  let itemToDeleteId = null;
    // Para almacenar el ID del elemento a eliminar

  let editingItemId = null;
    // Para almacenar el ID del elemento que se está editando

  const items = [] ;

  // Función para mostrar mensajes de estado (error/éxito)
  function showMessage(element, message, type = 'error') {
    element.textContent = message;
    element.classList.remove('hidden', 'error', 'success');
    element.classList.add(type); // Añadir la clase de tipo
    setTimeout(() => {
      element.classList.add('hidden');
    }, 5000); // Ocultar mensaje después de 5 segundos
  }

  function setEditingItem( id ) {
    itemToDeleteId = null;
    editingItemId = id;
    addItemBtn.style.display = 'none';
    updateItemBtn.style.display = 'inline-block';
  }

  function resetEditingItem() {
    editingItemId = null;
    addItemBtn.style.display = 'inline-block';
    updateItemBtn.style.display = 'none';
  }

  // Función para renderizar la tabla con los datos
  function renderTable(data) {
    tableBody.innerHTML = ''; // Limpiar tabla
    if (data.length === 0) {
      const row = document.createElement( 'tr' ) ;
      const empty = document.createElement( 'td' ) ;
      empty.setAttribute( 'colspan' , 4 ) ;
      empty.classList.add( 'empty' ) ;
      empty.textContent = 'No hay elementos para mostrar.' ;
      row.appendChild( empty ) ;
      tableBody.appendChild( row ) ;
      return;
    }
    data.forEach( ( item , index ) => {
      const row = document.createElement('tr') ;
      item.id = index + 1 ;
      [ 'id', 'name', 'value' ].forEach( attr => {
        const td = document.createElement('td') ;
        td.textContent=item[attr] ;
        row.appendChild( td ) ;
      } ) ;

      const actions = document.createElement('td') ;
      actions.classList.add( 'table-actions' ) ;
      const edit = document.createElement('button') ;
      edit.classList.add( 'edit-btn' ) ;
      edit.textContent = 'Editar' ;
      edit.addEventListener( 'click' , (e) => {
        setEditingItem( item.id ) ;
        itemNameInput.value = item.name;
        itemValueInput.value = item.value;
      } ) ;
      actions.appendChild( edit ) ;

      const del = document.createElement('button') ;
      del.classList.add( 'delete-btn' ) ;
      del.textContent = 'Eliminar' ;
      del.addEventListener( 'click' , (e) => {
        itemToDeleteId = item.id;
        resetEditingItem();
        dataForm.reset();
        confirmationModal.style.display = 'flex'; // Muestra el modal
      } ) ;
      actions.appendChild( del ) ;
      row.appendChild( actions ) ;
      tableBody.appendChild(row);
    });
  }

  // Función para cargar datos al DOM desde el arreglo de items.
  function loadData() {
    renderTable( items ) ;
  }

  // Manejar el envío del formulario (Agregar/Actualizar)
  dataForm.addEventListener( 'submit', (event) => {
    event.preventDefault() ;
    const name = itemNameInput.value.trim() ;
    const value = parseFloat( itemValueInput.value ) ;

    if( !name || isNaN( value ) ) {
      showMessage( statusMessage,
        'Por favor, introduce un nombre y un valor válidos.', 'error' ) ;
      return;
    }

    const itemData = { name, value } ;

    if( editingItemId ) {
      items[editingItemId-1] = itemData ;
      showMessage( statusMessage,
        'Elemento actualizado con éxito.', 'success' ) ;
    } else {
      items.push( itemData ) ;
      showMessage( statusMessage, 'Elemento agregado con éxito.', 'success' ) ;
    }
    resetEditingItem() ;
    dataForm.reset() ;
    loadData() ; // Recargar datos después de la operación
  } ) ;

  dataForm.addEventListener( 'reset' , resetEditingItem ) ;

  // Lógica del modal de confirmación
  confirmDeleteBtn.addEventListener('click', () => {
    confirmationModal.style.display = 'none'; // Oculta el modal

    if(itemToDeleteId) {
      items.splice( itemToDeleteId - 1 , 1 ) ; // Elimina el elemento de items
      showMessage( statusMessage,
        'Elemento eliminado con éxito.', 'success' ) ;
      loadData() ; // Recargar datos después de eliminar
      itemToDeleteId = null; // Limpiar el ID después de la operación
    }
  } ) ;

  cancelDeleteBtn.addEventListener('click', () => {
    confirmationModal.style.display = 'none'; // Oculta el modal
    itemToDeleteId = null; // Limpiar el ID
  } ) ;

  // Cargar los datos iniciales al cargar la página
  loadData() ;
} ) ;
