import { ApolloClient } from 'apollo-boost'
import { createApp } from 'vue'
import App from './App.vue'
import { InMemoryCache } from '@apollo/client/core';
import router from './router/router';
import { WebSocketLink } from 'apollo-link-ws';

const wsLink = new WebSocketLink({
    uri: 'wss://test-chat-app.hasura.app/v1/graphql',
    options:{
        reconnect:true,
        timeout:30000,
        connectionParams: () => {
            const token = localStorage.getItem('token');
            // Only include the Authorization header if the token exists
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            return {
                headers,
            };
        }
    }
})

const WsApolloClient = new ApolloClient({
    link: wsLink,
    cache: new InMemoryCache(),
});

export function tokenChange() {
    wsLink.subscriptionClient.close(false, false);
}

const app = createApp(App);
app.provide('apolloClient',WsApolloClient);
app.config.globalProperties.$apollo = WsApolloClient;
app.use(router)

app.mount('#app');
