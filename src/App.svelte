<script>
    import router from 'page';
    import Home from './Home.svelte';
    import Register from './register/Register.svelte';

    let current = Home;

    router('/', () => (current = Home));
    router('/register', () => (current = Register));

    router.start();
</script>
<svelte:component this={current}/>
<svelte:head>
    <link rel="icon" type="image/png" href="favicon.ico">
    <title>barKod</title>
</svelte:head>


<style global>
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    a:hover {
        color: #C9196D;
    }

    body {
        overflow-clip: hidden;
        margin: 0;
        color: white;
        font-family: "Roboto Mono", monospace !important;
        background-color: #1f1f1f;
        width: 100%;
        height: auto;
    }

    html {
        scroll-behavior: smooth;
    }

</style>