<script lang="ts">
	import Authbar from '../components/Auth.svelte';
	import { pb, user } from '../lib/pocketbase';
</script>

<Authbar />
<main>
	{#if $user}
		{$user.xrcisePriviledge
			? "You're allowed to add XRCISE records."
			: "Well, you're not allowed to add records, and I have to hold my ground... We can still have fun looking at charts, though!"}
	{:else}
		Please verify your identity by logging in above.
	{/if}
</main>

<style>
	main {
		text-align: center;
		font-family: 'Lexend', sans-serif;
		font-weight: 300;
	}
</style>
