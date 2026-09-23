import contactsService from "./contacts.js";

const form = document.querySelector("#main-contacts-form");
const nameInput = document.querySelector("#main-contact-name-input");
const phoneInput = document.querySelector("#main-contact-phone-input");
const formBtn = document.querySelector("#main-contacts-form-submit-btn");
const contactsList = document.querySelector("#contacts-list");
const contactsItemTemplate = document.querySelector(
  "#contacts-list-item-template",
);

const NAME_REGEX = /^[A-Z][a-z]*[ ][A-Z][a-z]{2,}$/;
const PHONE_REGEX = /^(0412|0414|0424|0416|0426)[0-9]{7}$/;

let nameInputIsValid = false;
let phoneInputIsValid = false;

const clearInputState = (input, errorTextElement) => {
  input.classList.remove("input-correct");
  input.classList.remove("input-incorrect");
  errorTextElement?.classList.remove("show-text");
};

const changeInputState = (input, errorTextElement, isValid) => {
  const value = input.value.trim();

  if (value.length === 0) {
    clearInputState(input, errorTextElement);
  } else if (isValid) {
    input.classList.add("input-correct");
    input.classList.remove("input-incorrect");
    errorTextElement?.classList.remove("show-text");
  } else {
    input.classList.add("input-incorrect");
    input.classList.remove("input-correct");
    errorTextElement?.classList.add("show-text");
  }
};

const changeInputItemAttributes = (input, isEditing) => {
  if (!isEditing) {
    input.removeAttribute("readonly");
  } else {
    input.setAttribute("readonly", "true");
    input.setAttribute("value", input.value);
  }
};

const changeFormBtnState = () => {
  if (nameInputIsValid && phoneInputIsValid) {
    formBtn.disabled = false;
  } else {
    formBtn.disabled = true;
  }
};

const createContactListItem = (contact) => {
  const clonedItem = document.importNode(contactsItemTemplate.content, true);
  const liItem = clonedItem.querySelector("li");
  const nameInputItem = liItem.querySelector(
    "[name='contacts-list-item-name-input']",
  );
  const phoneInputItem = liItem.querySelector(
    "[name='contacts-list-item-phone-input']",
  );
  const deleteBtnItem = liItem.querySelector(".contacts-list-item-btn-delete");
  const editBtnItem = liItem.querySelector(".contacts-list-item-btn-edit");
  const editBtnIcon = editBtnItem.querySelector(
    ".contacts-list-item-btn-edit-icon",
  );

  deleteBtnItem.addEventListener("click", async () => {
    deleteBtnItem.closest("li").remove();
    const deletedContact = await contactsService.deleteOne(contact.id);
    alert(`Contacto eliminado ${deletedContact.name}`);
  });

  editBtnItem.addEventListener("click", async () => {
    const isEditing = liItem.dataset.editing === "true";

    if (!isEditing) {
      changeInputItemAttributes(nameInputItem, false);
      changeInputItemAttributes(phoneInputItem, false);
      editBtnIcon.name = "pencil-outline";
    } else {
      if (
        !NAME_REGEX.test(nameInputItem.value) ||
        !PHONE_REGEX.test(phoneInputItem.value)
      ) {
        changeInputState(nameInputItem, NAME_REGEX.test(nameInputItem.value));
        changeInputState(
          phoneInputItem,
          PHONE_REGEX.test(phoneInputItem.value),
        );
        return;
      }

      const updatedContact = await contactsService.updateOne(contact.id, {
        name: nameInputItem.value,
        phone: phoneInputItem.value,
      });

      changeInputItemAttributes(nameInputItem, true);
      changeInputItemAttributes(phoneInputItem, true);
      clearInputState(nameInputItem);
      clearInputState(phoneInputItem);
      editBtnIcon.name = "create-outline";
      alert(`Contacto actualizado ${updatedContact.name}`);
    }

    liItem.dataset.editing = !isEditing;
  });

  nameInputItem.setAttribute("value", contact.name);
  phoneInputItem.setAttribute("value", contact.phone);
  liItem.id = contact.id;

  liItem.dataset.editing = false;

  return liItem;
};

const renderContacts = (contacts) => {
  contactsList.innerHTML = "";

  for (const contact of contacts) {
    const clonedItem = createContactListItem(contact);
    contactsList.appendChild(clonedItem);
  }
};

nameInput.addEventListener("input", (e) => {
  nameInputIsValid = NAME_REGEX.test(nameInput.value);
  changeInputState(nameInput, nameInput.nextElementSibling, nameInputIsValid);
  changeFormBtnState();
});

phoneInput.addEventListener("input", (e) => {
  phoneInputIsValid = PHONE_REGEX.test(phoneInput.value);
  changeInputState(
    phoneInput,
    phoneInput.nextElementSibling,
    phoneInputIsValid,
  );
  changeFormBtnState();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!nameInputIsValid || !phoneInputIsValid) return;
  const newContact = await contactsService.addOne({
    name: nameInput.value,
    phone: phoneInput.value,
  });
  const newContactItem = createContactListItem(newContact);
  contactsList.appendChild(newContactItem);
  clearInputState(nameInput, nameInput.nextElementSibling, nameInputIsValid);
  clearInputState(phoneInput, phoneInput.nextElementSibling, phoneInputIsValid);
  form.reset();
  alert(`Nuevo contacto creado ${newContact.name}`);
});

window.onload = async () => {
  const contacts = await contactsService.getAll();
  renderContacts(contacts);
};
