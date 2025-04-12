<script lang="ts">
	import '../app.css';

	let {data, children } = $props();
  $effect(() => {
    console.log(data);
  })
</script>

<header>
	<nav>
		<div>
			<a href="/">Belajaro</a>
		</div>
		<div>
			<a href="/signup">Sign Up</a>
		</div>
		<div>
			{#if data.auth.user?.email}
				<p>{data.auth.user.name}</p>
			{/if}
		</div>
	</nav>
</header>

{@render children()}
