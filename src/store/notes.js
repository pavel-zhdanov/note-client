/* eslint-disable no-param-reassign,no-underscore-dangle,no-unused-vars */
import axios from 'axios';

class Note {
  constructor(title, description, text, authorId, isPrivate = false, id, imageSrc) {
    this.title = title;
    this.description = description;
    this.text = text;
    this.authorId = authorId;
    this.isPrivate = isPrivate;
    this.id = id;
    this.imageSrc = imageSrc;
  }
}

export default {
  state: {
    notes: [],
    defaultImageSrc: 'https://st2.depositphotos.com/1496410/5390/v/950/depositphotos_53905395-stock-illustration-small-memo-with-pin.jpg',
  },
  mutations: {
    createNote(state, payload) {
      state.notes.push(payload);
    },
    loadNotes(state, payload) {
      state.notes = payload;
    },
    updateNote(state, payload) {
      const note = state.notes.find(item => item.id === payload.id);
      note.title = payload.title;
      note.description = payload.description;
    },
  },
  actions: {
    async createNote({ commit, getters }, payload) {
      commit('clearError');
      commit('setLoading', true);
      const image = payload.image;
      try {
        const formData = new FormData();
        formData.append('file', image);
        const imageData = await axios.post('/api/note/image', formData);
        const imageSrc = `${axios.defaults.baseURL}api/note/image/${imageData.data.id}`;
        const newNote = new Note(
          payload.title,
          payload.description,
          payload.text,
          getters.user.id,
          payload.isPrivate,
          payload.id,
          imageSrc);
        window.console.log(newNote);
        const { data } = await axios.post('/api/note/new', newNote);
        commit('createNote', {
          ...newNote,
          id: data.note._id });
        commit('setLoading', false);
      } catch (error) {
        commit('setError', error.message);
        commit('setLoading', false);
        throw error;
      }
    },

    async updateNote({ commit, getters }, payload) {
      commit('clearError');
      commit('setLoading', true);
      try {
        await axios.put(`/api/note/${payload.id}`, {
          title: payload.title,
          description: payload.description,
          id: payload.id,
        });
        commit('updateNote', {
          title: payload.title,
          description: payload.description,
          id: payload.id,
        });
        commit('setLoading', false);
      } catch (error) {
        commit('setError', error.message);
        commit('setLoading', false);
        throw error;
      }
    },

    async fetchNotes({ commit }) {
      commit('clearError');
      commit('setLoading', true);
      try {
        const { data } = await axios.get('/api/note/list');
        const notes = [];
        data.forEach((item) => {
          notes.push(new Note(
            item.title,
            item.description,
            item.text,
            item.authorId,
            item.isPrivate,
            item._id,
            item.imageSrc));
        });
        commit('loadNotes', notes);
        commit('setLoading', false);
      } catch (error) {
        commit('setError', error.message);
        commit('setLoading', false);
        throw error;
      }
    },
  },
  getters: {
    defaultImageSrc(state) {
      return state.defaultImageSrc;
    },
    notes(state) {
      return state.notes;
    },
    privateNotes(state) {
      return state.notes.filter(note => note.private);
    },
    myNotes(state) {
      return state.notes;
    },
    notesWithPreview(state) {
      return state.notes.filter(note => !!note.imageSrc);
    },
    noteById(state) {
      return noteId => state.notes.find(note => note.id === noteId);
    },
  },
};
