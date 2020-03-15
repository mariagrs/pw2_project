<template>
    <v-card
    color="grey lighten-4"
    flat
    height="100%"
    width="100%"
    tile
    >
    <v-toolbar dense>
    <v-toolbar-title>Réalisez la suite d'exercices</v-toolbar-title>
    </v-toolbar>

    <v-row>

    <v-col
    cols="6"
    md="3"
    >

        <v-card
        class="ma-2"
        height="5em"
        width="25em"
        color="#0a0a0a"
        shaped
        @click="doExercise(index)"
        :href="'/#/session/1/do/' + exercise.id"
        dark
        v-for="(exercise, index) in getExercisesBySessionId(this.sessionId)"
        :key="exercise.id"
        >
        <v-card-title class="subtitle-1">
           {{ exercise.title }}
        </v-card-title>
        <v-card-text>
        </v-card-text>
        </v-card>

    </v-col>

    <v-col
    cols="12"
    sm="6"
    md="9">

    <v-card
    class="ma-2"
    height="40em"
    width="69em"
    color="#0a0a0a"
    dark
    >
    <v-row>

        <v-col
        cols="6"
        md="6"
        sm="6"
        >
        <v-card-title>ee</v-card-title>
        <v-card-text>ee</v-card-text>

        <v-row>
            <v-card-title>Votre solution</v-card-title>
            <div class="my-3">
            <v-btn fab dark small color="primary">
                <v-icon dark>mdi-play</v-icon>
            </v-btn>
            </div>
        </v-row>

        <div id="editor" class="exercise-editor-ace-editor"></div>

        </v-col>

        <v-col
        cols="6"
        sm="6"
        md="6">

        <v-card-title>Tests</v-card-title>

        </v-col>
    </v-row>
    </v-card>
    </v-col>
    </v-row>
    </v-card>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'
import ace from 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/webpack-resolver'

export default {
  name: 'StudentView',
  data: () => ({
    editor: null
  }),
  computed: {
    ...mapGetters('exercises', ['getExercisesBySessionId']),
    sessionId () {
      return parseInt(this.$route.params.id)
    },
    exerciseId () {
      return parseInt(this.$route.params.exercise)
    }
  },
  methods: {
    async doExercise (index) {
      try {
        index = this.exerciseId
        if (index.isNaN()) {
          console.log('isNaN maria')
        }
        console.log(index)
      } catch (err) {
        console.log(err)
      }
    },
    ...mapActions('exercises', ['fetchExercisesForSession'])
  },
  async mounted () {
    this.editor = ace.edit('editor')
    this.editor.setTheme('ace/theme/monokai')
    this.editor.session.setMode('ace/mode/python')

    await this.fetchExercisesForSession({
      sessionId: this.sessionId
    })
  }
} // session par exo et fetch exo pour chaque session
</script>
<style>
.exercise-editor-ace-editor {
 position: relative;
 height: 20rem;
}
</style>
