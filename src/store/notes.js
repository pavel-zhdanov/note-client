/* eslint-disable no-param-reassign,no-underscore-dangle,no-unused-vars */
import axios from 'axios';
import coder from '../util/coder';

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
      note.text = payload.text;
      note.isPrivate = payload.isPrivate;
    },
    deleteNote(state, payload) {
      const note = state.notes.find(item => item.id === payload.id);
      const indexNote = state.notes.indexOf(note);
      state.notes.splice(indexNote, 1);
    },
  },
  actions: {
    async createNote({ commit, getters, dispatch }, payload) {
      commit('clearError');
      commit('setLoading', true);
      const image = payload.image;
      let imageSrc;
      try {
        if (image) {
          imageSrc = await dispatch('loadImage', { image });
        }

        const newNote = new Note(
          payload.title,
          payload.description,
          payload.text,
          getters.user.id,
          payload.isPrivate,
          payload.id,
          imageSrc);
        if (payload.key.length > 0) {
          newNote.text = coder.encode(newNote.text, payload.key);
        }
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
          ...payload,
        });
        commit('updateNote', {
          title: payload.title,
          description: payload.description,
          id: payload.id,
          isPrivate: payload.isPrivate,
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

    async deleteNote({ commit, getters }, payload) {
      commit('clearError');
      commit('setLoading', true);
      try {
        await axios.delete(`/api/note/${payload.id}`);
        commit('deleteNote', { id: payload.id });
        commit('setLoading', false);
      } catch (error) {
        commit('setError', error.message);
        commit('setLoading', false);
        throw error;
      }
    },

    async loadImage({ commit }, payload) {
      commit('clearError');
      commit('setLoading', true);
      const image = payload.image;
      let imageSrc;
      try {
        const formData = new FormData();
        formData.append('file', image);
        const { data } = await axios.post('/api/note/image', formData);
        window.console.log(data);
        imageSrc = `${axios.defaults.baseURL}api/note/image/${data.id}`;
        commit('setLoading', false);
        return imageSrc;
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

    publicNotes(state) {
      return state.notes.filter(note => !note.isPrivate);
    },
    myNotes(state, getters) {
      return state.notes.filter(note => note.authorId === getters.user.id);
    },
    notesWithPreview(state) {
      return state.notes.filter(note => !!note.imageSrc && !note.isPrivate);
    },
    noteById(state) {
      return noteId => state.notes.find(note => note.id === noteId);
    },
  },
};
