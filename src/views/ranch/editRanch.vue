<template>
  <article-detail :is-edit="true" />
</template>

<script>
import ArticleDetail from './components/detail'

export default {
  name: 'CreateArticle',
  components: { ArticleDetail }
}
</script>

