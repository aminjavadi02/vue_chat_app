<template>
  <div>
    <button @click="testConnection">Test Connection</button>
    <div v-if="loading">Testing connection...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else-if="data">Connection successful! Server responded: {{ data }}</div>
  </div>
  
</template>


<script>
import { ref, inject } from 'vue';
// import gql from 'graphql-tag';


export default {
  
  setup() {
    const apolloClient = inject('apolloClient',null);
    const loading = ref(false);
    const error = ref(null);
    const data = ref(null);

    const testConnection = async () => {
      loading.value = true;
      try {
        const response = await apolloClient.query({
          query: TEST_QUERY,
        });
        data.value = response.data;
      } catch (err) {
        error.value = err;
      } finally {
        loading.value = false;
      }
    };

    return {
      loading,
      error,
      data,
      testConnection,
    };
  },
};
</script>
 