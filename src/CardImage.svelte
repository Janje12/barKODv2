<script>
    export let url = 0;
    let show = true;
</script>
<img loading="lazy" on:error={() => show = false} class="my-2 {show ? 'show' : 'hide'}"
     src={'/images/' + url + '.jpg'}>
<style>
    .show {
        object-fit: cover;
        width: 450px;
        height: 480px;
        box-shadow: #8a2357 5px 4px 5px;
        border-radius: 5px;
    }

    .hide {
        display: none;
    }
</style>