<template>
	<div class="register-form">
		<h2>Register</h2>
		<form @submit.prevent="register">
			<div class="form-group">
				<label for="email">Email:</label>
				<input type="email" v-model="email" required />
			</div>
            <div class="form-group">
				<label for="full_name">Full Name:</label>
				<input type="full_name" v-model="full_name" required />
			</div>
			<div class="form-group">
				<label for="password">Password:</label>
				<input type="password" v-model="password" required />
			</div>
			<button @click="register" type="submit">sign up</button>
		</form>
	</div>
</template>


<script>
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import gql from 'graphql-tag';
import { tokenChange } from '@/main';


const REGISTER = gql`
    mutation ($email: bpchar!, $full_name:name! , $password: String!) {
        signup(email:$email,full_name:$full_name, password:$password){
            token
        }
    }
`;

export default {
	setup() {
		const apolloClient = inject('apolloClient',null);
		const email = ref('');
        const full_name = ref('');
		const password = ref('');
		const token = ref(null);
		const router = useRouter();

		const register = async () => {
			try {
				const response = await apolloClient.mutate({
				mutation: REGISTER,
				variables: {
					email: email.value,
                    full_name: full_name.value,
					password: password.value
				}
				});
				token.value = response.data.signup.token;
                localStorage.setItem('token', token.value);
				tokenChange()
				router.push('/users')
			} catch (error) {
				console.error('Mutation failed:', error.message);
			}
		};
		return {
			register,
			email,
            full_name,
			password,
            token
		};
	},
};
</script>
 

<style scoped>
.register-form {
	max-width: 300px;
	margin: 0 auto;
	border: 1px solid #ccc;
	border-radius: 5px;
	padding: 5vh 6vw;
}

.form-group {
	margin-bottom: 15px;
}

label {
	display: block;
	margin-bottom: 5px;
}

input[type="email"],
input[type="full_name"],
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



