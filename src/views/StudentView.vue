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
        dark
        v-for=" exercise in getExercisesBySessionId(this.sessionId)"
        :key="exercise.id"
        :href="'/#/session/'+ sessionId +'/do/' + exercise.id"
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
    height="wrap-content"
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
        <div v-if="!isNaN(this.exerciseId)">
        <v-card-title>{{ this.exercise.title }}</v-card-title>
        <v-card-text><div v-html="this.exercise.instructions"></div></v-card-text>

        <v-row>
            <v-card-title>Votre solution</v-card-title>
            <div class="my-3">
            <v-btn fab dark small color="primary" @click="play()">
                <v-icon dark>mdi-play</v-icon>
            </v-btn>
            </div>
        </v-row>
        <div id="editor_test" class="exercise-editor-ace-editor"></div>
        </div>
        <div v-else>
            <v-card-title>Please select an exercise</v-card-title>
        </div>

        </v-col>

        <v-col
        cols="6"
        sm="6"
        md="6">

        <v-card-title>Solution</v-card-title>

        <div id="editor_solution" class="exercise-editor-ace-editor"></div>

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
    editor_solution: null,
    editor_test: null,
    exercise: null,
    contentJustChanged: false
  }),
  computed: {
    ...mapGetters('exercises', ['getExercisesBySessionId', 'getExerciseById']),
    ...mapGetters('attempts', ['getLastAttemptForExercise', 'lastAttemptResults']),
    sessionId () {
      return parseInt(this.$route.params.id)
    },
    lastAttempt () {
      return this.getLastAttemptForExercise(this.exerciseId) || {}
    },
    exerciseId () {
      return parseInt(this.$route.params.exercise)
    }
  },
  methods: {
    ...mapActions('exercises', ['fetchExercisesForSession', 'fetchExerciseForSession']),
    async load () {
      await this.fetchExerciseForSession({ sessionId: this.sessionId, exerciseId: this.exerciseId })
      this.exercise = this.getExerciseById(this.exerciseId)
    },
    ...mapActions('attempts', ['fetchLastAttemptForExercise', 'createAttemptForSession']),
    async updateView () {
      await Promise.all([
        this.fetchExerciseForSession({
          sessionId: this.sessionId,
          exerciseId: this.exerciseId
        }),
        this.fetchLastAttemptForExercise({
          sessionId: this.sessionId,
          exerciseId: this.exerciseId
        })
      ])
      this.setDefaultSolution()
    },
    setDefaultSolution () {
      if (this.lastAttempt.solution) {
        this.solution = this.lastAttempt.solution
      } else {
        if (this.exercise.template_regions && this.exercise.template_regions.length) {
          this.solution = this.exercise.template_regions.join('\n')
        } else {
          this.solution = ''
        }
      }
    },
    changeLang (lang) {
      if (typeof lang === 'undefined') {
        lang = 'python'
      } else if (lang === 'c') {
        lang = 'c_cpp'
      }
      this.editor.session.setMode(`ace/mode/${lang}`)
    },
    onChange (event, force = false) {
      const text = this.editor.getValue()
      if (!force && text === this.content) return
      this.$emit('change', { text })
    },
    async play () {
      await this.createAttemptForSession({
        exerciseId: this.exerciseId,
        sessionId: this.sessionId,
        solution: this.solution
      })
    }
  },
  async mounted () {
    await this.updateView()
    this.sessionId = parseInt(this.$route.params.sessionId)
    this.exerciseId = parseInt(this.$route.params.exerciseId)
    if (!isNaN(this.sessionId) && this.sessionId !== 0 && this.exerciseId !== 0) {
      await this.fetchSession({ id: this.sessionId })
      await this.fetchExercisesForSession({ sessionId: this.sessionId })
    }
  },
  updated () {
    this.editor_solution = ace.edit('editor_solution')
    this.editor_solution.setTheme('ace/theme/monokai')
    this.editor_solution.changeLang(this.lang)

    this.editor_test = ace.edit('editor_test')
    this.editor_test.setTheme('ace/theme/monokai')
    this.editor_test.changeLang(this.lang)

    if (this.content) {
      this.editor.setValue(this.content)
      this.editor.clearSelection()
    }
  },
  watch: {
    '$route.params': {
      handler (newValue) {
        this.load()
      },
      immediate: true
    },
    content (newVal) {
      if (this.editor && newVal !== this.editor.getValue()) {
        this.contentJustChanged = true
        this.editor.setValue(newVal)
        this.editor.clearSelection()
      }
    },
    lang (newVal) {
      if (this.editor) {
        this.changeLang(newVal)
      }
    }
  }
}
</script>
<style>
.exercise-editor-ace-editor {
 position: relative;
 height: 20rem;
}
</style>
