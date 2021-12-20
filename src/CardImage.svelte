<script>
    export let url = 0;
    let show = true;
</script>
<img loading="lazy" on:error={() => show = false} class="{show ? 'show' : 'hide'}" src={'/images/IMG_' + (2049 + url) + '.jpg'}>

<style>
    .show {
        object-fit: fill;
    }
    .hide {
        display: none;
    }
</style>