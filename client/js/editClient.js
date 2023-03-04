import { sendClientData } from "./cleantsApi.js";
import { createContactItem } from "./createContact.js";
import { deleteClientModal } from "./createDeleteModal.js";
import { createClientsForm } from "./createModalForm.js";

export const editClientModal = (data) => {
  const editModal = document.createElement('div');
  const editModalContent = document.createElement('div');
  const createForm = createClientsForm();
  const titleId = document.createElement('span')

  titleId.classList.add('modal__id')
  editModal.classList.add('modal-edit', 'site-modal', 'modal-active');
  editModalContent.classList.add('edit-modal__content', 'site-modal__content', 'modal-active');

  titleId.textContent = 'ID:' + data.id.substr(0, 6)
  createForm.modalTitle.textContent = 'Изменить данные';
  createForm.cancelBtn.textContent = 'Удалить клиента';

  createForm.cancelBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const deleteModal = deleteClientModal()
    document.body.append(deleteModal.deleteModal)

    import('./cleantsApi.js').then(({ deleteClientItem }) => {
      deleteModal.deleteModalDelete.addEventListener('click', () => {
        deleteClientItem(data.id)
        document.getElementById(data.id).remove()
      })
    })
  })

  createForm.modalClose.addEventListener('click', () => {
    editModal.remove()
  })

  createForm.inputName.value = data.name
  createForm.inputSurname.value = data.surname
  createForm.inputLastName.value = data.lastName

  for (const contact of data.contacts) {
    const createContact = createContactItem()
    createContact.contactName.textContent = contact.type
    createContact.contactInput.value = contact.value

    createForm.contactsBlock.append(createContact.contact)
    createForm.contactsBlock.style.backgroundColor = "#f4f3f6";
  }

  if (data.contacts.length == 10) {
    createForm.addContactBtn.classList.remove('modal__btn-contact--active')
  }

  createForm.form.addEventListener('submit', (e) => {
    e.preventDefault()

    const contactTypes = document.querySelectorAll('.contact__name')
    const contactValues = document.querySelectorAll('.contact__input')
    let contacts = []
    let client = {}

    for (let i = 0; i < contactTypes.length; i++) {
      contacts.push({
        type: contactTypes[i].innerHTML,
        value: contactValues[i].value
      })
    }
    client.name = createForm.inputName.value
    client.surname = createForm.inputSurname.value
    client.lastName = createForm.inputLastName.value
    client.contacts = contacts

    sendClientData(client, 'PATCH', data.id)
  })

  createForm.modalTitle.append(titleId)
  editModalContent.append(createForm.modalClose, createForm.modalTitle, createForm.form);
  editModal.append(editModalContent);

  document.addEventListener('click', (e) => {
    if (e.target == editModal) {
      editModal.remove()
    }
  })

  return {
    editModal,
    editModalContent
  }
} 