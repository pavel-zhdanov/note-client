<template>
  <div>

    <v-container fluid>
      <v-layout row>
        <v-flex xs12>
          <v-carousel>
            <v-carousel-item
              v-for="note of notes"
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
              :src="note.imageSrc"
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
</template>

<script>
  export default {
    data() {
      return {
        notes: [
          { title: 'squirrel', description: 'It is squirrel', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores, porro?', authorId: '1', private: false, id: '1', imageSrc: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg' },
          { title: 'sky', description: 'It is sky', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores, porro?', authorId: '1', private: true, id: '2', imageSrc: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg' },
          { title: 'bird', description: 'It is bird', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores, porro?', authorId: '2', private: false, id: '3', imageSrc: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg' },
          { title: 'planet', description: 'It is planet', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores, porro?', authorId: '2', private: true, id: '4', imageSrc: 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg' },
        ],
      };
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
