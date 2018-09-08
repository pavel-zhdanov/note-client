<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <h1>{{user.nickname}}</h1>
        <v-img
        :src="user.avatarSrc"></v-img>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data() {
      return {};
    },
    computed: {
      user() {
        return this.$store.getters.user;
      },
    },
  };

</script>

<style scoped>

</style>
