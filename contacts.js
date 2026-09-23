import fetchService from "./fetchService.js";

/**
 * @typedef {Object} Contact
 * @property {string} id - El identificador del contacto
 * @property {string} name - El nombre del contacto
 * @property {string} phone - El numero telefonico del contacto
 */

/** @type {Contact[]} */
let contacts = [];

const PORT = 3000;
const API_RESOURCE = "/contacts";
const API_URL = `http://localhost:${PORT}${API_RESOURCE}`;

/**
 * Crea un nuevo contacto y lo agrega a la lista de contactos.
 * @param {Object} payload - La data que va a ser utilizada para crear el contacto.
 * @param {Contact['name']} payload.name - El nombre del contacto
 * @param {Contact['phone']} payload.phone - El telefono del contacto
 */
const addOne = async ({ name, phone }) => {
  try {
    const newContact = { name, phone };
    const { data } = await fetchService.post(API_URL, newContact);
    contacts = contacts.concat(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Retorna todos los contactos.
 * @returns {Contact[]}
 */
const getAll = async () => {
  try {
    const { data } = await fetchService.get(API_URL);
    contacts = data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Elimina un contacto por su id.
 * @param {Contact['id']} id - El id del contacto a eliminar.
 */
const deleteOne = async (id) => {
  try {
    const { data } = await fetchService.del(`${API_URL}/${id}`);
    contacts = contacts.filter((contact) => contact.id !== id);
    return data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Actualiza un contacto por su id.
 * @param {Contact['id']} id - El id del contacto a actualizar.
 * @param {Object} payload - La data que va a ser utilizada para actualizar el contacto.
 * @param {Contact['name']} payload.name - El nombre del contacto
 * @param {Contact['phone']} payload.phone - El telefono del contacto
 */
const updateOne = async (id, { name, phone }) => {
  try {
    const updatedContact = { name, phone };
    const { data } = await fetchService.put(`${API_URL}/${id}`, updatedContact);
    contacts = contacts.map((contact) => (contact.id === id ? data : contact));
    return data;
  } catch (error) {
    console.log(error);
  }
};

const contactsService = {
  addOne,
  getAll,
  updateOne,
  deleteOne,
};

export default contactsService;
