<template>
    <div class="chat-container">
        <div class="chat-messages">
        <div v-for="message in messages" :key="message.id" class="message">
            <span v-if="message.sender_id == sender_id" class="sender">You:</span>
            <span v-else class="sender">User {{ message.sender_id }}:</span>
            {{ message.content }}
        </div>
        </div>
        <div class="chat-input">
        <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type your message..." />
        <button @click="sendMessage">Send</button>
        </div>
    </div>
</template>

<script>

import { onMounted, ref, inject } from 'vue';
import gql from 'graphql-tag';
import { useRoute } from 'vue-router';


const MY_SUBSCRIPTION = gql`
	subscription GetMessagesBetweenUsers ($userId1: Int!, $userId2: Int!) {
	messages (
		where: {
			_and: [
				{
				_or: [
					{ sender_id: { _eq: $userId1 } },
					{ receiver_id: { _eq: $userId1 } }
				]
				},
				{
				_or: [
					{ sender_id: { _eq: $userId2 } },
					{ receiver_id: { _eq: $userId2 } }
				]
				},
			]
		}
	)
	{
		content
		created_at
		id
		is_deleted
		receiver_id
		sender_id
		status
		updated_at
	}
	}
`;

const NEW_MESSAGE = gql`
	mutation MyMutation($content: String, $receiver_id: Int, $sender_id: Int) {
	insert_messages_one(object: {content: $content, receiver_id: $receiver_id, sender_id: $sender_id}) {
		id
		content
		created_at
		is_deleted
		receiver_id
		sender_id
		status
		updated_at
	}
	}
`;
export default {
	mounted(){
		
	},
    setup() {
		/* eslint-disable no-unused-vars */
		const messages = ref([]);
		const newMessage = ref('');
		const apolloClient = inject('apolloClient',null);
		const token = localStorage.getItem('token');
		const [header, payload, signature] = token.split('.');
		const decodedPayload = JSON.parse(atob(payload));
		const sender_id = decodedPayload['https://hasura.io/jwt/claims']['x-hasura-user-id']
		const route = useRoute();
		const receiver_id = ref('');
		
		onMounted(()=>{
			receiver_id.value = route.params.id;
			const getMessages = async () => {
				try {
					const observable = await apolloClient.subscribe({
						query: MY_SUBSCRIPTION,
						variables:{
							userId1: sender_id,
							userId2: receiver_id.value
						}
					});
					observable.subscribe({
						next(response) {
							messages.value = [...response.data.messages];
							console.log('Subscription response:', messages.value);
						},
						error(error) {
						console.error('Subscription error:', error);
						},
					});
				} catch (error) {
					console.error('Subscription error:', error);
				}
			}
			getMessages()
		});

		const sendMessage = async () => {
			try {
				apolloClient.mutate({
					mutation:NEW_MESSAGE,
					variables: {
						content: newMessage.value,
						receiver_id: receiver_id.value,
						sender_id: sender_id
					}
				})
				// console.log('New message sent:', newMessage.value);
				newMessage.value = ''
			} catch (error) {
				console.error('Mutation error:', error);
			}
		};

		return {
			sendMessage,
			messages,
			newMessage,
			sender_id
		}
	}
};

</script>

<style scoped>
.chat-container {
  max-width: 400px;
  margin: 0 auto;
}

.chat-messages {
  border: 1px solid #ccc;
  padding: 10px;
  height: 300px;
  overflow-y: auto;
}

.message {
  margin-bottom: 10px;
}

.chat-input {
  margin-top: 10px;
}

.chat-input input {
  width: 70%;
  padding: 5px;
  margin-right: 10px;
}

.chat-input button {
  padding: 5px 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}
</style>