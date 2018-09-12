<template>
  <v-container grid-list-lg>

    <v-layout row wrap v-if="myNotes.length !== 0">
      <v-flex xs12 sm6 md5 lg4 xl4
              mb-3
              v-for="item in myNotes"
              :key="item.id">
        <v-card>
          <v-layout row>
            <v-flex xs4>
              <v-img
                :src="item.imageSrc || defaultImageSrc"
                height="150px"
              ></v-img>
            </v-flex>
            <v-flex xs8>
              <v-card-text style="word-wrap: break-word">
                <h2> {{item.title || `Empty title`}}</h2>
                <p>{{item.description || `Empty description`}}</p>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="white--text" color="primary" :to="'/note/' + item.id">{{$vuetify.t('$vuetify.btn.open')}}</v-btn>
              </v-card-actions>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout v-else-if="myNotes.length === 0">
      <v-flex xs12 class="text-xs-center">
        <h1 class="text--primary">{{$vuetify.t('$vuetify.msg.noNotes')}}</h1>
      </v-flex>
    </v-layout>

    <v-layout v-else>
      <<v-progress-circular
      indeterminate
      color="primary"
      :size="200"
      :width="20"
    ></v-progress-circular>
    </v-layout>

  </v-container>
</template>

<script>
  export default {
    data() {
      return {
      };
    },
    computed: {
      myNotes() {
        return this.$store.getters.myNotes;
      },
      defaultImageSrc() {
        return this.$store.getters.defaultImageSrc;
      },
    },
  };
</script>

<style scoped>

</style>

