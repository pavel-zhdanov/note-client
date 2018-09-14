<template>
  <v-container>
    <v-layout justify-center row v-if="note">
      <v-flex xs12 sm10 md8 lg6 >
        <v-card v-if="!loading">
          <v-img
            v-if="note.imageSrc"
            :src="note.imageSrc"
            height="300"
          >
          </v-img>
          <v-card-text style="word-wrap: break-word">
            <h1 class="text--primary py-3">{{note.title}}</h1>
            <v-divider></v-divider>
            <h2>{{note.description}}</h2>
            <v-divider></v-divider>
            <p>{{text}}</p>
          </v-card-text>
          <v-card-actions pa-5>
            <v-spacer></v-spacer>
            <v-btn
              flat
              @click="onDecode">
              {{decode? $vuetify.t('$vuetify.btn.decode'): $vuetify.t('$vuetify.btn.decodeQ')}}
            </v-btn>
            <v-btn flat v-if="user && note.authorId === user.id" class="warning" @click="onDelete">
              {{$vuetify.t('$vuetify.btn.delete')}}
            </v-btn>
            <app-edit-note-modal v-if="user && note.authorId === user.id" :note="note"></app-edit-note-modal>
          </v-card-actions>
          <v-layout justify-end>
            <v-flex xs11 sm8 md8 lg8>
              <v-text-field
                clearable
                class="pa-0 ma-0"
                v-if="decode"
                name="key"
                :label="$vuetify.t('$vuetify.field.keyForDecode')"
                type="text"
                v-model="key"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-card>
        <v-flex v-else xs12 class="text-xs-center">
          <v-progress-circular
            :size="150"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </v-flex>
      </v-flex>
    </v-layout>

    <v-layout row v-else>
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular
          indeterminate
          color="primary"
          :size="200"
          :width="20"
        ></v-progress-circular>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import EditNoteModal from './EditNoteModal';
  import coder from '../../util/coder';

  export default {
    props: ['id'],
    data() {
      return {
        decode: false,
        key: '',
        decodedText: '',
      };
    },
    computed: {
      note() {
        const id = this.id;
        window.console.log(id);
        const note = this.$store.getters.noteById(id);
        if (note) {
          return note;
        }
        this.$store.dispatch('setError', 'a note was not found or insufficient access rights');
        return {};
      },
      defaultImageSrc() {
        return this.$store.getters.defaultImageSrc;
      },
      loading() {
        return this.$store.getters.loading;
      },
      user() {
        return this.$store.getters.user;
      },
      text() {
        if (!this.note.text) return '';
        if (this.decodedText.length > 0) return this.decodedText;
        return this.note.text;
      },
    },
    methods: {
      onDelete() {
        this.$store.dispatch('deleteNote', {
          id: this.note.id,
        })
          .then(() => {})
          .catch(() => {});
        this.$router.push('/list');
      },
      onDecode() {
        if (this.key.length === 0) {
          this.decode = !this.decode;
          this.decodedText = '';
        } else {
          this.decode = !this.decode;
          this.decodedText = coder.decode(this.note.text, this.key);
        }
      },
    },
    components: {
      appEditNoteModal: EditNoteModal,
    },
  };
</script>

<style scoped>

</style>

