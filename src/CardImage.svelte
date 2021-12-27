<script>
    export let url = 0;
    let show = true;
</script>
<div style="width: 90%; height: 480px" class="my-5 mx-auto">
    <img loading="lazy" on:error={() => show = false} class="{show ? 'show' : 'hide'} mx-auto bg-gray-900 border-4"
         src={'/images/' + url + '.jpg'}>
</div>
<style>
    .show {
        object-fit: cover;
        height: 480px;
        border-radius: 10px;
        z-index: 10;
    }

    .show:hover {
        animation: test 0.7s ease-in-out both;
    }

    @keyframes test {
        from {
            object-fit: cover;
        }
        to {
            object-fit: scale-down;
        }
    }

    .hide {
        display: none;
    }
</style>