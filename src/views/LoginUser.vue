<template>
	<div class="login-form">
		<h2>Login</h2>
		<form @submit.prevent="login">
			<div class="form-group">
				<label for="email">Email:</label>
				<input type="email" v-model="email" required />
			</div>
			<div class="form-group">
				<label for="password">Password:</label>
				<input type="password" v-model="password" required />
			</div>
			<button @click="login" type="submit">Login</button>
		</form>
	</div>
</template>


<script>
import { ref, inject } from 'vue';
import gql from 'graphql-tag';
import { useRouter } from 'vue-router';
import { tokenChange } from '@/main';

const LOGIN = gql`
	mutation ($email: bpchar!, $password: String!) {
		login(password: $password, email: $email) {
			token
		}
	}
`;

export default {
	setup() {
		const apolloClient = inject('apolloClient',null);
		const email = ref('');
		const password = ref('');
		const token = ref(null);
		const router = useRouter();
		const login = async () => {
			try {
				const response = await apolloClient.mutate({
				mutation: LOGIN,
				variables: {
					email: email.value,
					password: password.value
				}
				});
				token.value = response.data.login.token;
				localStorage.setItem('token', token.value);
				tokenChange()
				router.push('/users')
			} catch (error) {
				console.error('Mutation failed:', error);
			}
		};
		return {
			login,
			email,
			token,
			password
		};
	}
};
</script>
 

<style scoped>
.login-form {
	max-width: 300px;
	margin: 0 auto;
	padding: 20px;
	border: 1px solid #ccc;
	border-radius: 5px;
}

.form-group {
	margin-bottom: 15px;
}

label {
	display: block;
	margin-bottom: 5px;
}

input[type="email"],
input[type="password"] {
	width: 100%;
	padding: 8px;
	font-size: 16px;
	border: 1px solid #ccc;
	border-radius: 5px;
}

button {
	background-color: #007bff;
	color: #fff;
	border: none;
	padding: 10px 20px;
	font-size: 16px;
	border-radius: 5px;
	cursor: pointer;
	transition: background-color 0.3s ease;
}

button:hover {
	background-color: #0056b3;
}
</style>






<!-- 
 

 -->