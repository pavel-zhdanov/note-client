/* eslint-disable no-param-reassign */
export default {
  state: {
    notes: [
      { title: 'squirrel', description: 'It is squirrel', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores, porro?', authorId: '1', private: false, id: '1', imageSrc: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg' },
      { title: 'sky', description: 'It is sky', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores, porro?', authorId: '1', private: true, id: '2', imageSrc: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg' },
      { title: 'bird', description: 'It is bird', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores, porro?', authorId: '2', private: false, id: '3', imageSrc: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg' },
      { title: 'planet', description: 'It is planet', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores, porro?', authorId: '2', private: true, id: '4', imageSrc: '' },
    ],
    defaultImageSrc: 'https://st2.depositphotos.com/1496410/5390/v/950/depositphotos_53905395-stock-illustration-small-memo-with-pin.jpg',
  },
  mutations: {
    createNote(state, payload) {
      state.notes.push(payload);
    },
  },
  actions: {
    createNote({ commit }, payload) {
      payload.id = 'qwerty';
      commit('createNote', payload);
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
