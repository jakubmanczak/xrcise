<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Authbar from '../components/Auth.svelte';
	import { pb, user } from '../lib/pocketbase';

	let recents: any[] = [];
	let xrciseTypes: any[] = [];

	let submitxrciseType: string;
	let submitxrciseTime: string;
	let submitxrciseRepeats: string;
	let submitxrciseSets: string;

	let unsubscribe: () => void;

	async function addxrciseentry() {
		try {
			const data = {
				type: submitxrciseType,
				time: xrciseTypes.filter((el) => {
					return el.id == submitxrciseType;
				})[0].timeBased
					? submitxrciseTime
					: null,
				repeats: xrciseTypes.filter((el) => {
					return el.id == submitxrciseType;
				})[0].repeatBased
					? submitxrciseRepeats
					: null,
				sets: submitxrciseSets
			};
			const newxrciseentry = await pb.collection('xrciseEntries').create(data);
		} catch (error) {
			console.log(error);
		}
	}

	onMount(async () => {
		const reqXrciseLast20 = await pb.collection('xrciseEntries').getList(1, 20, {
			sort: '-created',
			expand: 'type'
		});
		recents = reqXrciseLast20.items;

		unsubscribe = await pb
			.collection('xrciseEntries')
			.subscribe('*', async ({ action, record }) => {
				if (action === 'create') {
					const type = await pb.collection('xrciseTypes').getOne(record.type);
					record.expand = { type };
					recents = [record, ...recents];
				}
				if (action === 'delete') {
					recents = recents.filter((el) => {
						return el.id !== record.id;
					});
				}
			});

		const reqXrciseTypes = await pb.collection('xrciseTypes').getList(1, 50);
		xrciseTypes = reqXrciseTypes.items;
	});

	onDestroy(() => {
		unsubscribe?.();
	});
</script>

<Authbar />
<main>
	{#if $user?.xrcisePriviledge}
		<div class="addentry">
			<h4>add an XRCISE entry</h4>
			<label for="submitxrcisetype">type of xrcise</label>
			<select id="submitxrcisetype" bind:value={submitxrciseType}>
				<option value="" />
				{#each xrciseTypes as type (type.id)}
					<option value={type.id}>{type.name}</option>
				{/each}
			</select>

			{#if submitxrciseType}
				{#if xrciseTypes.filter((el) => {
					return el.id == submitxrciseType;
				})[0].timeBased}
					<p>
						<label for="submitxrcisetime">seconds</label>
						<input type="number" id="submitxrcisetime" bind:value={submitxrciseTime} />
					</p>
				{:else if xrciseTypes.filter((el) => {
					return el.id == submitxrciseType;
				})[0].repeatBased}
					<p>
						<label for="submitxrciserepeats">repetitions</label>
						<input type="number" id="submitxrciserepeats" bind:value={submitxrciseRepeats} />
					</p>
				{/if}
				<p>
					<label for="submitxrcisesets">sets:</label>
					<input type="number" id="submitxrcisesets" bind:value={submitxrciseSets} />
				</p>
				<button on:click={addxrciseentry}>add entry</button>
			{/if}
		</div>
	{/if}
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
	.addentry {
		background: #eee;
		padding: 8px;
	}
</style>
