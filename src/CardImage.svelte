<script>
    export let url = 0;
    let show = true;
</script>
<div style="width: 450px; height: 480px" class="m-2 bg-gray-900">
    <img loading="lazy" on:error={() => show = false} class="{show ? 'show' : 'hide'}"
         src={'/images/' + url + '.jpg'}>
</div>
<style>
    .show {
        object-fit: cover;
        width: 450px;
        height: 480px;
        box-shadow: #8a2357 0 0 20px;
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