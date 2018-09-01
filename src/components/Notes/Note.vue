<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-img
            :src="note.imageSrc || defaultImageSrc"
            height="300px"
          >
          </v-img>
          <v-card-text>
            <h1 class="text--primary">{{note.title}}</h1>
            <h2>{{note.description}}</h2>
            <p>{{note.text}}</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="primary">Edit</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

  export default {
    props: ['id'],
    data() {
      return {};
    },
    computed: {
      note() {
        const id = this.id;
        return this.$store.getters.noteById(id);
      },
      defaultImageSrc() {
        return this.$store.getters.defaultImageSrc;
      },
    },
  };
</script>

<style scoped>

</style>

