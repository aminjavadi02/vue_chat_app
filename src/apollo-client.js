import { inject } from "vue"

export function useGraphQL() {
    const apolloClient = inject('apolloClient',null);
    const graphqlRequest = async (query, variables) => {
        const token = localStorage.getItem('token');
        if(token){
            try {
                return await apolloClient.query({ query, variables });   
            } catch (error) {
                console.error('GraphQL Request Error:', error);
                throw error;
            }
        } else {
            console.log('login first');
        }
    };
    return {
        graphqlRequest
    };
}