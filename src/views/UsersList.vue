<template>
    <div class="user-list">
        <h1>Users</h1>
        <ul>
            <router-link v-for="user in users" :key="user.id" :to="{ name: 'user', params: { id: user.id }}">
                <li>{{ user.full_name }}</li>
            </router-link>
        </ul>
    </div>
</template>

<script>

import { ref, onMounted } from 'vue';

import gql from 'graphql-tag';
import { useGraphQL } from '@/apollo-client';

export const TEST_QUERY = gql`
    query MyQuery {
        users {
            id
            full_name
        }
    }
`;

export default {
    setup() {
    const users = ref([]);
    
    const { graphqlRequest } = useGraphQL();

    onMounted(async () => {
        try {
        const response = await graphqlRequest(TEST_QUERY);
        users.value = response.data.users;
        console.log(users.value);
        } catch (error) {
            console.error('Query failed:', error);
        }
    });

    return {
        users
    };
    },
};
</script>

<style scoped>
.user-list {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
  color: #333333;
}
</style>