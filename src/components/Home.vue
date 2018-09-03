<template>
  <div v-if="!loading">

    <v-container fluid>
      <v-layout row>
        <v-flex xs12>
          <v-carousel>
            <v-carousel-item
              v-for="note of notesWithPreview"
              :key="note.id"
              :src="note.imageSrc"
              @click="onClickCarausel(note.id)"
            ></v-carousel-item>
          </v-carousel>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container grid-list-lg>
      <v-layout row wrap>
        <v-flex
          xs12
          sm6
          md4
          lg3
          xl3
          v-for="note of notes"
          :key="note.id"
        >
          <v-card>
            <v-img
              :src="note.imageSrc || defaultImageSrc"
              height="200px"
            ></v-img>

            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">{{note.title}}</h3>
                <div>{{note.description}}</div>
              </div>
            </v-card-title>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat>Share</v-btn>
              <v-btn raised class="primary" :to="'/note/' + note.id">Open</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

  </div>

  <div v-else>
    <v-container>
      <v-layout row>
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular
            :size="150"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
      };
    },
    computed: {
      notesWithPreview() {
        return this.$store.getters.notesWithPreview;
      },
      notes() {
        return this.$store.getters.notes;
      },
      defaultImageSrc() {
        return this.$store.getters.defaultImageSrc;
      },
      loading() {
        return this.$store.getters.loading;
      },
    },
    methods: {
      onClickCarausel(id) {
        this.$router.push(`/note/${id}`);
      },
    },
  };
</script>

<style scoped>

</style>
