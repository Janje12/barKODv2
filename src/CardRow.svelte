<script>

    const matches = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    export let height;
    export let question;

    const colNum = [0, 1, 2, 3];
</script>
{#if matches}
    <div class="grid-cols-4 grid">
        {#each colNum as col}
            {#if col === 0} <a href="#{question}">
                <div class="column text-xl rounded text-center pt-2 mx-1 {col===0 ? 'column-1' : ''}"
                     style="height: 30vh;">
                    {question}
                </div>
            </a>
            {:else}
                <div class="column lg:visible text-xl rounded text-center pt-1 mx-1"
                     style="height: 30vh;">
                </div>
            {/if}
        {/each}
    </div>
{:else}
    <div class="grid-cols-4 grid">
        {#each colNum as col}
            {#if col === 0} <a href="#{question}">
                <div class="column text-xl rounded text-center pt-2 mx-1 {col===0 ? 'column-1' : ''}"
                     style="height: {height}em;">
                    {question}
                </div>
            </a>
            {:else}
                <div class="column lg:visible text-xl rounded text-center pt-1 mx-1"
                     style="height: {height}em;">
                </div>
            {/if}
        {/each}
    </div>
{/if}


<style>
    .text-xl:hover {

    }

    .column {
        background: rgba(53, 28, 115, 1);
        background: linear-gradient(0deg, rgba(53, 28, 115, 1) 5%, #C9196D 100%);
    }

    .column-1 {
        -webkit-animation: in 0.7s;
    }

    .column-1:hover {
        color: white;
        text-shadow: 2px 2px 5px #7866A8FF;
        -webkit-animation: out 0.3s;
        box-shadow: -5px 10px 10px rgba(53, 28, 115, 1);
        animation-fill-mode: forwards;
        cursor: pointer;
        animation-timing-function: linear;
    }

    @keyframes out {
        from {
            transform: translate3d(0px, 0px, 0px)
        }
        to {
            transform: translate3d(0.5rem, -0.5rem, 0.5rem)
        }
    }

    @keyframes in {
        from {
            transform: translate3d(0.5rem, -0.5rem, 0.5rem)
        }
        to {
            transform: translate3d(0px, 0px, 0px)
        }
    }
</style>