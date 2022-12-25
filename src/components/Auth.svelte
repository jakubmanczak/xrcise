<script lang="ts">
	import { pb, user } from '../lib/pocketbase';

	let username: string;
	let password: string;

	async function login() {
		await pb.collection('users').authWithPassword(username, password);
	}

	async function signup() {
		try {
			const data = {
				username,
				password,
				passwordConfirm: password
			};
			const newuser = await pb.collection('users').create(data);
			await login();
		} catch (error) {
			console.log(error);
		}
	}

	function signout() {
		pb.authStore.clear();
	}

	pb.authStore.onChange(() => {
		user.set(pb.authStore.model);
	});
</script>

{#if $user}
	<main>
		{#if $user.avatar}
			<img src={$user.avatar} alt={`${$user.username}'s avatar`} />
		{/if}
		<p>
			Logged in as
			{$user.username}.
		</p>
		<button on:click={signout}>log out</button>
	</main>
{:else}
	<main id="prompts">
		<input type="text" placeholder="login" bind:value={username} />
		<input type="text" placeholder="password" bind:value={password} />
		<!-- <input type="password" placeholder="password" bind:value={password} /> -->
		<button on:click={login}>log in</button>
		<button on:click={signup}>sign up</button>
	</main>
{/if}
<hr />
<br />

<style>
	main {
		margin: 16px;
		font-size: 24px;
		/* height: 40px; */
		border: 2px solid black;
		border-radius: 8px;
		font-family: 'Lexend', sans-serif;
		display: flex;
		flex-direction: row;
		gap: 4px;
	}
	p {
		display: inline-block;
		padding: 4px;
	}
	img {
		display: inline;
		border-radius: 50%;
		height: 28px;
		margin: 4px;
	}
	input {
		margin: 0;
		padding: 4px;
		border: 0;
		outline: none;
		font-size: 1em;
		font-family: 'Lexend', sans-serif;
		/* color: #666; */
		background: #eee;
	}
	input:first-of-type {
		border-top-left-radius: 6px;
		border-bottom-left-radius: 6px;
	}
	button {
		margin: 0;
		padding: 4px 12px;
		border: 0;
		background: #ddd;
		font-family: 'Lexend', sans-serif;
		font-size: 1em;
		outline: none;
		cursor: pointer;
	}
	button:hover,
	button:focus {
		text-decoration: 2px underline;
	}
	button:first-of-type {
		margin-left: auto;
	}
	button:last-of-type {
		border-top-right-radius: 6px;
		border-bottom-right-radius: 6px;
	}
	@media screen and (max-width: 500px) {
		main {
			font-size: 16px;
		}
		main img {
			height: 20px;
		}
	}
	@media screen and (max-width: 900px) {
		#prompts {
			font-size: 16px;
			display: flex;
			flex-direction: column;
		}
		#prompts > input,
		#prompts > button {
			width: 100%;
			border-radius: 0;
		}
		#prompts > input:first-of-type {
			border-radius: 6px 6px 0 0;
		}
		#prompts > button:last-of-type {
			border-radius: 0 0 6px 6px;
		}
	}
</style>
