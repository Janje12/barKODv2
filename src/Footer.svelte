<script>
    import SocialContainer from "./SocialContainer.svelte";
</script>

<div class="bg-footer h-full py-20">
    <div class="grid grid-cols-3">
        <div class="my-3">
            <SocialContainer/>
        </div>
        <div class="flex justify-center mx-10 my-auto text-gray-500">
            © Sva autorska prava, zaštitni znakovi i znakovi usluga pripadaju odgovarajućim vlasnicima.
        </div>
        <div class="flex justify-end my-4 mr-10 my-auto">
            Made by &nbsp;<a target="_blank" href="https://github.com/Janje12"> @janje12</a>
        </div>
    </div>
</div>

<style>
    .bg-footer {
        background-color: #212529;
    }

    .grid-cols-3 {
        grid-template-columns: auto;
    }
</style>