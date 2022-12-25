<script lang="ts">
	import { onMount } from 'svelte';
	import Authbar from '../components/Auth.svelte';
	import { pb, user } from '../lib/pocketbase';

	let recents: any[] = [];
	let xrciseTypes: any[] = [];

	onMount(async () => {
		const reqXrciseLast20 = await pb.collection('xrciseEntries').getList(1, 20, {
			sort: 'created',
			expand: 'type'
		});
		recents = reqXrciseLast20.items;
		const reqXrciseTypes = await pb.collection('xrciseTypes').getList(1, 50);
		xrciseTypes = reqXrciseTypes.items;
		console.log(xrciseTypes);
	});
</script>

<Authbar />
<main>
	<article>
		Recent exercises:
		{#each recents as recent (recent.id)}
			<div class="recentXRCISE">
				{#if recent.expand?.type?.timeBased}
					{recent.time} seconds of {recent.expand?.type?.name}
					{recent.sets ? `(${recent.sets} sets)` : ''}
				{:else if recent.expand?.type?.repeatBased}
					{recent.repeats}
					{recent.expand?.type?.name}
					{recent.sets ? `(${recent.sets} sets)` : ''}
				{/if}
			</div>
		{/each}
	</article>
</main>

<style>
	main {
		text-align: center;
		font-family: 'Lexend', sans-serif;
		font-weight: 300;
	}
</style>
